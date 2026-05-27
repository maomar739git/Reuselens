import io
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import CLIPModel, CLIPProcessor
from PIL import Image

app = FastAPI(title="ReuselensAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PROMPTS = [
    "a photo of a cardboard item",
    "a photo of a plastic item",
    "a photo of a paper item",
]
LABELS = ["cardboard", "plastic", "paper"]

model: CLIPModel | None = None
processor: CLIPProcessor | None = None


@app.on_event("startup")
async def load_model() -> None:
    global model, processor
    print("Loading CLIP model…")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    model.eval()
    print("Model ready.")


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/classify")
async def classify(file: UploadFile = File(...)) -> dict:
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    raw = await file.read()
    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not decode image")

    inputs = processor(text=PROMPTS, images=image, return_tensors="pt", padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)[0]

    top_idx = int(torch.argmax(probs).item())

    return {
        "label": LABELS[top_idx],
        "confidence": round(float(probs[top_idx]), 4),
    }
