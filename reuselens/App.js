import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from "react-native";

const materials_data = [
  { id: 1, name: "Cardboard", wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
  { id: 2, name: "Paper", wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
  { id: 3, name: "Plastic", wet_ok: true, dirty_ok: false, ripped_ok: false, washable: true, wash_instructions: "Rinse with warm water and mild soap, dry fully before use." }
];

const recipes_data = [
  // CARDBOARD
  { id: 1, recipe_name: "Corn on the Cob Pencil Holder", end_product: "A cardboard tube decorated to look like corn on the cob, used to hold pens and pencils on your desk.", material_id: 1, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 1, supervision_required: false },
  { id: 2, recipe_name: "Vase", end_product: "A cardboard tube transformed into a decorative vase for holding flowers or art supplies.", material_id: 1, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 1, supervision_required: false },
  { id: 3, recipe_name: "Parking Garage", end_product: "A cardboard box converted into a multi-storey garage for storing and displaying toy cars.", material_id: 1, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false, difficulty: 2, supervision_required: false },
  { id: 4, recipe_name: "Geometric Wall Organizers", end_product: "Triangular cardboard baskets mounted on the wall for storing craft supplies and stationery.", material_id: 1, requires_glue: false, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 3, supervision_required: true },
  { id: 5, recipe_name: "Nok Hockey Game", end_product: "A handmade tabletop hockey game built from cardboard boxes that two players can compete against each other.", material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false, difficulty: 4, supervision_required: true },
  { id: 6, recipe_name: "Storage Shelf", end_product: "A sturdy cardboard shelf built from a single box capable of holding books and small household items.", material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false, difficulty: 4, supervision_required: true },
  { id: 7, recipe_name: "Tensegrity Pen Holder", end_product: "A floating desk accessory that uses string tension to suspend a platform for holding pens and small items.", material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: false, difficulty: 5, supervision_required: true },

  // PAPER
  { id: 8, recipe_name: "Origami Corner Bookmark", end_product: "A small triangular paper bookmark that slots onto the corner of a page to mark your place in a book.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 1, supervision_required: false },
  { id: 9, recipe_name: "Origami Box with Lid", end_product: "A folded paper box with a matching lid used for storing small items like paper clips and sweets.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 2, supervision_required: false },
  { id: 10, recipe_name: "Ninja Star", end_product: "A folded paper throwing star that can be used as a toy or displayed as a desk decoration.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 2, supervision_required: false },
  { id: 11, recipe_name: "Newspaper Origami Envelope", end_product: "A rectangular envelope folded from newspaper used for sending letters and cards.", material_id: 2, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: true, difficulty: 2, supervision_required: false },
  { id: 12, recipe_name: "Newspaper Rings Basket", end_product: "A woven bowl-like basket made from rolled newspaper rings used as a container or coaster.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: true, requires_string: false, requires_paint: true, difficulty: 3, supervision_required: false },
  { id: 13, recipe_name: "DIY Gift Bag", end_product: "A custom gift bag with handles made from any decorative paper used for presenting gifts.", material_id: 2, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: true, requires_paint: false, difficulty: 3, supervision_required: false },
  { id: 14, recipe_name: "Origami Diamond Divider Box", end_product: "A folded paper storage box with a diamond shaped divider insert for keeping small items separated.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 4, supervision_required: false },
  { id: 15, recipe_name: "Origami Drawers Box", end_product: "A folded paper box with pull out drawers used for organising small items on a desk.", material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 4, supervision_required: false },
  { id: 16, recipe_name: "Birds Nest Lampshade", end_product: "A woven lampshade made from rolled newspaper tubes that creates a natural textured pattern when lit.", material_id: 2, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 5, supervision_required: true },

  // PLASTIC
  { id: 17, recipe_name: "Bowling Set", end_product: "A set of ten plastic bottles filled with sand used as bowling pins for an indoor or outdoor game.", material_id: 3, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false, difficulty: 1, supervision_required: false },
  { id: 18, recipe_name: "Plastic Bottle Shaker", end_product: "A plastic bottle filled with dried beans or rice that creates different sounds when shaken as a musical instrument.", material_id: 3, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 1, supervision_required: false },
  { id: 19, recipe_name: "Piggy Bank", end_product: "A plastic bottle decorated to look like a pig with a coin slot cut into the top for saving money.", material_id: 3, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: true, difficulty: 2, supervision_required: false },
  { id: 20, recipe_name: "Woven Basket", end_product: "A milk carton woven with coloured wool to create a decorative basket used as a gift box or storage container.", material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: false, difficulty: 3, supervision_required: false },
  { id: 21, recipe_name: "Yogurt Pot Snake", end_product: "A chain of linked yogurt pots decorated to look like a snake used as a toy or room decoration.", material_id: 3, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: true, difficulty: 3, supervision_required: true },
  { id: 22, recipe_name: "Plastic Bottle Soaker", end_product: "A plastic bottle converted into a water soaker toy by puncturing holes in the cap for outdoor summer play.", material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false, difficulty: 3, supervision_required: true },
  { id: 23, recipe_name: "Jewelry Stand", end_product: "A tiered stand made from plastic bottles connected with string used for organising and displaying jewelry and accessories.", material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: false, difficulty: 4, supervision_required: true }
];

// ─── SCREEN 1: Material Selection ───────────────────────────────────────────
function MaterialScreen({ onSelect }) {
  const materialList = [
    { id: 1, name: "Cardboard", emoji: "📦" },
    { id: 2, name: "Paper", emoji: "📄" },
    { id: 3, name: "Plastic", emoji: "🧴" },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>What material do you have?</Text>
      {materialList.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.materialCard}
          onPress={() => onSelect(m)}
        >
          <Text style={styles.emoji}>{m.emoji}</Text>
          <Text style={styles.materialName}>{m.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── SCREEN 2: Condition Check ───────────────────────────────────────────────
function ConditionScreen({ material, onResult }) {
  const [isWet, setIsWet] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isRipped, setIsRipped] = useState(false);
  const [isFine, setIsFine] = useState(false);

  const rules = {
    1: { wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
    2: { wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
    3: { wet_ok: true, dirty_ok: false, ripped_ok: false, washable: true, wash_instructions: "Rinse with warm water and mild soap, dry fully before use." },
  };

  // When fine is selected clear all other selections
  const handleFine = (val) => {
    setIsFine(val);
    if (val) {
      setIsWet(false);
      setIsDirty(false);
      setIsRipped(false);
    }
  };

  // When any condition is selected clear fine
  const handleCondition = (setter) => (val) => {
    setter(val);
    if (val) setIsFine(false);
  };

  const checkConditions = () => {
    const rule = rules[material.id];
    if (isWet && !rule.wet_ok) {
      return { reuseable: false, reason: "This item is too wet to reuse. Let it dry completely first." };
    }
    if (isDirty && !rule.dirty_ok) {
      if (rule.washable) {
        return { reuseable: true, washFirst: true, instructions: rule.wash_instructions };
      }
      return { reuseable: false, reason: "This item is too dirty to reuse." };
    }
    if (isRipped && !rule.ripped_ok) {
      return { reuseable: false, reason: "This item is too damaged to reuse." };
    }
    return { reuseable: true };
  };

  const handleSubmit = () => {
    const result = checkConditions();
    onResult(result);
  };

  const Toggle = ({ label, value, onChange }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={() => onChange(!value)}
    >
      <Text style={[styles.toggleText, value && styles.toggleTextActive]}>
        {value ? "✓ " : ""}{label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>What condition is your {material.name} in?</Text>
      <Text style={styles.subtitle}>Select all that apply</Text>
      <Toggle label="It is fine" value={isFine} onChange={handleFine} />
      <Toggle label="It is wet" value={isWet} onChange={handleCondition(setIsWet)} />
      <Toggle label="It is dirty" value={isDirty} onChange={handleCondition(setIsDirty)} />
      <Toggle label="It is ripped" value={isRipped} onChange={handleCondition(setIsRipped)} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCREEN 3: Not Reuseable ─────────────────────────────────────────────────
function NotReuseableScreen({ reason, onRestart }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.sadEmoji}>😔</Text>
      <Text style={styles.title}>This item cannot be reused</Text>
      <Text style={styles.subtitle}>{reason}</Text>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Scan another item</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCREEN 4: Wash First ────────────────────────────────────────────────────
function WashScreen({ instructions, onContinue }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.emoji}>🧼</Text>
      <Text style={styles.title}>Wash this item first</Text>
      <Text style={styles.subtitle}>{instructions}</Text>
      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Done — show me recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCREEN 5: Tool Selection ────────────────────────────────────────────────
function ToolScreen({ onSubmit }) {
  const [tools, setTools] = useState({
    scissors: false,
    glue: false,
    tape: false,
    string: false,
    paint: false,
  });

  const toggleTool = (tool) => {
    setTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  const toolList = [
    { key: "scissors", label: "Scissors", emoji: "✂️" },
    { key: "glue", label: "Glue", emoji: "🖊️" },
    { key: "tape", label: "Tape", emoji: "🔲" },
    { key: "string", label: "String", emoji: "🧵" },
    { key: "paint", label: "Paint", emoji: "🎨" },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>What tools do you have?</Text>
      <Text style={styles.subtitle}>Select all that apply</Text>
      {toolList.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[styles.toggle, tools[t.key] && styles.toggleActive]}
          onPress={() => toggleTool(t.key)}
        >
          <Text style={[styles.toggleText, tools[t.key] && styles.toggleTextActive]}>
            {tools[t.key] ? "✓ " : ""}{t.emoji} {t.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => onSubmit(tools)}>
        <Text style={styles.buttonText}>Show me recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCREEN 6: Recipe List ───────────────────────────────────────────────────
function RecipeScreen({ materialId, tools, onRestart }) {
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    const filtered = recipes_data
      .filter((r) => r.material_id === materialId)
      .filter((r) => {
        if (r.requires_scissors && !tools.scissors) return false;
        if (r.requires_glue && !tools.glue) return false;
        if (r.requires_tape && !tools.tape) return false;
        if (r.requires_string && !tools.string) return false;
        if (r.requires_paint && !tools.paint) return false;
        return true;
      })
      .sort((a, b) => a.difficulty - b.difficulty);

    setRecipeList(filtered);
    setLoading(false);
  };

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Finding recipes...</Text>
      </View>
    );
  }

  if (recipeList.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>No recipes found</Text>
        <Text style={styles.subtitle}>Try selecting more tools</Text>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>Start again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Here are your recipes</Text>
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <View style={styles.recipePlaceholderImage}>
              <Text style={styles.placeholderText}>📷 Image coming soon</Text>
            </View>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.recipe_name}</Text>
              <Text style={styles.recipeDescription}>{item.end_product}</Text>
              <Text style={styles.stars}>{stars(item.difficulty)}</Text>
              {item.supervision_required && (
                <Text style={styles.supervisionBadge}>⚠️ Adult supervision needed</Text>
              )}
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={onRestart}>
        <Text style={styles.buttonText}>Start again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("material");
  const [material, setMaterial] = useState(null);
  const [tools, setTools] = useState(null);
  const [notReuseableReason, setNotReuseableReason] = useState("");
  const [washInstructions, setWashInstructions] = useState("");

  const handleMaterialSelect = (m) => {
    setMaterial(m);
    setScreen("condition");
  };

  const handleConditionResult = (result) => {
    if (!result.reuseable) {
      setNotReuseableReason(result.reason);
      setScreen("notReuseable");
    } else if (result.washFirst) {
      setWashInstructions(result.instructions);
      setScreen("wash");
    } else {
      setScreen("tools");
    }
  };

  const handleToolSubmit = (selectedTools) => {
    setTools(selectedTools);
    setScreen("recipes");
  };

  const restart = () => {
    setScreen("material");
    setMaterial(null);
    setTools(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {screen === "material" && <MaterialScreen onSelect={handleMaterialSelect} />}
      {screen === "condition" && <ConditionScreen material={material} onResult={handleConditionResult} />}
      {screen === "notReuseable" && <NotReuseableScreen reason={notReuseableReason} onRestart={restart} />}
      {screen === "wash" && <WashScreen instructions={washInstructions} onContinue={() => setScreen("tools")} />}
      {screen === "tools" && <ToolScreen onSubmit={handleToolSubmit} />}
      {screen === "recipes" && <RecipeScreen materialId={material.id} tools={tools} onRestart={restart} />}
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
  },
  screen: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  materialCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  sadEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  materialName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  toggle: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  toggleActive: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  toggleText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  toggleTextActive: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4a6fa5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recipePlaceholderImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e8edf2",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  stars: {
    fontSize: 18,
    color: "#f4a736",
    marginBottom: 4,
  },
  supervisionBadge: {
    fontSize: 12,
    color: "#e65100",
    fontWeight: "600",
    marginTop: 4,
  },
});