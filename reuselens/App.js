import { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  FlatList, Linking, Image, Alert, SafeAreaView, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";

// ─── HUGGING FACE ─────────────────────────────────────────────────────────────
// Get a free token at huggingface.co → Settings → Access Tokens → New token (read)
const HF_TOKEN = "hf_YOUR_TOKEN_HERE";
const HF_URL   = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32";

const CLIP_PROMPTS = [
  "a photo of a cardboard item",
  "a photo of a plastic item",
  "a photo of a paper item",
];
const PROMPT_TO_LABEL = {
  "a photo of a cardboard item": "cardboard",
  "a photo of a plastic item":   "plastic",
  "a photo of a paper item":     "paper",
};

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg:              "#061206",
  surface:         "#0e200e",
  surfaceBorder:   "#1c3a1c",
  primary:         "#3ddc5a",
  primaryDark:     "#174d17",
  white:           "#ffffff",
  muted:           "#6b8a6b",
  tipBg:           "#1a2e06",
  tipText:         "#c8e060",
  danger:          "#ff6035",
  tabBar:          "#090f09",
  tabBarBorder:    "#1a2a1a",
};

const difficultyLabel = { 1: "Easy", 2: "Medium", 3: "Hard", 4: "Very Hard", 5: "Expert" };
const difficultyColor = { 1: "#3ddc5a", 2: "#99cc44", 3: "#f0b840", 4: "#f07030", 5: "#e04040" };

const recipe_times = {
  1: "30 mins",  2: "15 mins",  3: "20 mins",  4: "1 hour",
  5: "1.5 hrs",  6: "2 hours",  7: "2 hours",  8: "10 mins",
  9: "20 mins",  10: "15 mins", 11: "15 mins", 12: "30 mins",
  13: "15 mins", 14: "45 mins", 15: "2 hours", 16: "45 mins",
  17: "10 mins", 18: "20 mins", 19: "30 mins", 20: "45 mins",
  21: "45 mins", 22: "20 mins", 23: "1 hour",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const materials_data = [
  { id: 1, name: "Cardboard", wet_ok: false, dirty_ok: false, ripped_ok: true,  washable: false, wash_instructions: null },
  { id: 2, name: "Paper",     wet_ok: false, dirty_ok: false, ripped_ok: true,  washable: false, wash_instructions: null },
  { id: 3, name: "Plastic",   wet_ok: true,  dirty_ok: false, ripped_ok: false, washable: true,  wash_instructions: "Rinse with warm water and mild soap, dry fully before use." },
];

const recipes_data = [
  // CARDBOARD
  {
    id: 1, recipe_name: "Corn on the Cob Pencil Holder",
    end_product: "A cardboard tube decorated to look like corn on the cob, used to hold pens and pencils on your desk.",
    material_id: 1, requires_glue: true, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true,
    difficulty: 1, supervision_required: false,
    steps: [
      "Use the cardboard tube as the base structure.",
      "Apply glue to the surface of the tube and roll it over beans or small rolled paper balls to stick them to the surface and mimic corn kernels.",
      "Paint the tube and beans bright yellow to resemble corn.",
      "Cut felt or paper into triangle shapes and glue them to the base to serve as the corn husks.",
    ],
  },
  {
    id: 2, recipe_name: "Vase",
    end_product: "A cardboard tube transformed into a decorative vase for holding flowers or art supplies.",
    material_id: 1, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true,
    difficulty: 1, supervision_required: false,
    steps: [
      "Clean and prepare your cardboard tube.",
      "Apply paint to the exterior in any colour or pattern you like.",
      "Leave to dry fully before using as a vase or desk organiser.",
    ],
  },
  {
    id: 3, recipe_name: "Parking Garage",
    end_product: "A cardboard box converted into a multi-storey garage for storing and displaying toy cars.",
    material_id: 1, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false,
    difficulty: 2, supervision_required: false,
    steps: [
      "Use a large cardboard box as the outer frame for the garage.",
      "Place cardboard tubes in a row fitting the width of the garage.",
      "Tape the row of tubes together.",
      "Place the row into the garage and stack more rows of tubes until you reach the top.",
      "Your garage is ready to store and display toy cars or other figurines.",
    ],
  },
  {
    id: 4, recipe_name: "Geometric Wall Organizers",
    end_product: "Triangular cardboard baskets mounted on the wall for storing craft supplies and stationery.",
    material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: true, requires_paint: true,
    difficulty: 3, supervision_required: true,
    steps: [
      "Draw a template of three equilateral triangles on cardboard.",
      "Cut the pattern using scissors.",
      "Draw lines down the middle of the side triangles and score along them using one blade of the scissors.",
      "Fold along the scored lines and join the edges to form a triangle basket, using tape to hold temporarily.",
      "Paint the baskets with any colour you like and leave to dry.",
      "Glue the baskets onto a larger cardboard base using PVA glue and leave to dry fully.",
      "Glue a cardboard strip to the top of the base and thread string through holes to make a hanging mechanism.",
    ],
  },
  {
    id: 5, recipe_name: "Nok Hockey Game",
    end_product: "A handmade tabletop hockey game built from cardboard boxes that two players can compete against each other.",
    material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false,
    difficulty: 4, supervision_required: true,
    steps: [
      "Cut a large rectangle base from cardboard boxes, taping pieces together if necessary.",
      "Mark the centre line with masking tape.",
      "Create sideboards by gluing two layers of cardboard together for height and support using PVA glue, hold with tape while drying.",
      "Cut goal slots into the centre of the short sideboards using scissors.",
      "Glue the sideboards to the base using PVA glue and tape while drying.",
      "Construct goal blocks by gluing four layers of cardboard together and attaching them near the goal walls.",
      "Make pucks and sticks by gluing three layers of cardboard shapes together and leaving to dry.",
    ],
  },
  {
    id: 6, recipe_name: "Storage Shelf",
    end_product: "A sturdy cardboard shelf built from a single box capable of holding books and small household items.",
    material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false,
    difficulty: 4, supervision_required: true,
    steps: [
      "Cut four legs from the corners of a large cardboard box using scissors.",
      "Cut four shelves from the sides of the box, leaving extra cardboard on the edges for folding.",
      "Bend the shelf sides by pressing firmly with a ruler along the fold lines.",
      "Glue the shelf corners with PVA glue and tape to hold them while drying.",
      "Reinforce the shelves by gluing extra cardboard pieces to the sides.",
      "Assemble by gluing the top and bottom shelves to two legs first, then adding the middle shelves and remaining legs.",
      "Leave to dry fully before placing any items on the shelf.",
    ],
  },
  {
    id: 7, recipe_name: "Tensegrity Pen Holder",
    end_product: "A floating desk accessory that uses string tension to suspend a platform for holding pens and small items.",
    material_id: 1, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: false,
    difficulty: 5, supervision_required: true,
    steps: [
      "Cut 16 identical U shapes from cardboard using a template.",
      "Glue them into four stacks of four using PVA glue and leave to dry.",
      "Twist string between the ends of two U stacks then glue the remaining two stacks on top to sandwich the string.",
      "Construct the pen holder box by gluing stacked cardboard pieces into a U shape and attaching side panels.",
      "Use a pencil to punch holes into cardboard squares and feed two strands of string through each corner.",
      "Glue the unravelled ends of the string to a cardboard square and sandwich with another square.",
      "Glue the tensegrity block to the centre of the base and the bottom of the pen holder.",
      "Feed the strands through the pen holder lip and adjust them until balanced, then knot and glue into place.",
    ],
  },
  // PAPER
  {
    id: 8, recipe_name: "Origami Corner Bookmark",
    end_product: "A small triangular paper bookmark that slots onto the corner of a page to mark your place in a book.",
    material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 1, supervision_required: false,
    steps: [
      "Fold the square in half diagonally to create a triangle.",
      "Fold the bottom right and left corners up to meet the top centre point.",
      "Open those corners back out so you are back to a flat triangle.",
      "Take only the top layer of the top point and fold it down to the bottom edge to create a pocket.",
      "Fold the right and left corners back up and tuck them inside that pocket.",
      "Press it flat and slide it onto the corner of your book.",
    ],
  },
  {
    id: 9, recipe_name: "Origami Box with Lid",
    end_product: "A folded paper box with a matching lid used for storing small items like paper clips and sweets.",
    material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 2, supervision_required: false,
    steps: [
      "Fold and unfold the paper in half both ways to make a cross, then fold all four corners into the centre point.",
      "Fold the top and bottom edges to the centre and unfold, then repeat with the side edges.",
      "Open the top and bottom flaps, then pull the sides up at a 90 degree angle to make walls.",
      "Push the corners inward to form the box shape and fold the top and bottom flaps over the edges to lock in place.",
      "For the lid follow the same steps but leave a small gap between the corners and the centre point so the lid fits over the box.",
    ],
  },
  {
    id: 10, recipe_name: "Ninja Star",
    end_product: "A folded paper throwing star that can be used as a toy or displayed as a desk decoration.",
    material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 2, supervision_required: false,
    steps: [
      "Fold both squares in half to make thin rectangles, then fold them in half again.",
      "Fold the ends of the strips into opposite diagonal shapes so they look like mirror images of each other.",
      "Fold the ends again to create two triangles on each strip making them look like a Z or S shape.",
      "Place one piece across the other to form a cross.",
      "Fold the points of the bottom piece over and tuck them into the pockets of the top piece.",
      "Flip it over and tuck the remaining points into the pockets on the other side to lock it together.",
    ],
  },
  {
    id: 11, recipe_name: "Newspaper Origami Envelope",
    end_product: "A rectangular envelope folded from newspaper used for sending letters and cards.",
    material_id: 2, requires_glue: false, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 2, supervision_required: false,
    steps: [
      "Fold one corner of your newspaper over to make a triangle and cut off the extra bit to make a perfect square.",
      "Fold the bottom edge up by about 1cm then fold it again to reach the middle line.",
      "Turn the bottom corners in and fold the sides toward the middle.",
      "Fold the top corners in to make a triangle flap then fold the whole flap down and tuck it in to close the envelope.",
    ],
  },
  {
    id: 12, recipe_name: "DIY Gift Bag",
    end_product: "A custom gift bag with handles made from any decorative paper used for presenting gifts.",
    material_id: 2, requires_glue: true, requires_scissors: false, requires_tape: true, requires_string: true, requires_paint: false,
    difficulty: 3, supervision_required: false,
    steps: [
      "Wrap your paper around a cereal box like a present but keep the top open.",
      "Glue the side edge and tape the bottom of the paper shut.",
      "Slide the box out and put a piece of cardboard in the bottom to make it strong.",
      "Pinch the sides to make neat creases and use a pencil to poke two holes at the top.",
      "Thread your string handles through the holes and tie knots to keep them in place.",
    ],
  },
  {
    id: 13, recipe_name: "Origami Photo Frame",
    end_product: "A folded paper photo frame used to display a favourite picture or piece of artwork.",
    material_id: 2, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 2, supervision_required: false,
    steps: [
      "Fold the paper in half both ways and unfold.",
      "Fold all four edges in about 2cm to make a border.",
      "Flip the paper over and fold each of the new corners into the centre point.",
      "Flip it back over and you will see your frame.",
      "Slide your photo under the corner flaps to hold it in place.",
    ],
  },
  {
    id: 14, recipe_name: "Newspaper Rings Basket",
    end_product: "A woven bowl-like basket made from rolled newspaper rings used as a container or coaster.",
    material_id: 2, requires_glue: true, requires_scissors: false, requires_tape: true, requires_string: false, requires_paint: true,
    difficulty: 3, supervision_required: false,
    steps: [
      "Roll newspaper sheets into tight tubes using a pencil then flatten them by rolling a heavy object over them.",
      "Coil a flattened tube into a tight circle gluing as you go until it is about 7cm wide to make the base.",
      "Wrap flattened tubes around a mug and tape the ends to make large rings.",
      "Wrap tubes around a smaller container to make smaller rings.",
      "Glue the smaller rings around the base then glue the larger rings on top to build the basket walls.",
      "Paint the basket when dry.",
    ],
  },
  {
    id: 15, recipe_name: "Birds Nest Lampshade",
    end_product: "A woven lampshade made from rolled newspaper tubes that creates a natural textured pattern when lit.",
    material_id: 2, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 5, supervision_required: true,
    steps: [
      "Roll thin tubes of newspaper using a pencil and glue the ends shut. You will need a large number of tubes.",
      "Trim the ends of the tubes with scissors so they are all the same length.",
      "Stack the tubes on top of each other in a messy overlapping circle just like a birds nest gluing them together as you go.",
      "Once dry and strong sit it on top of a small lamp.",
    ],
  },
  {
    id: 16, recipe_name: "Newspaper Placemat",
    end_product: "A woven placemat made from newspaper strips used to protect your table at mealtimes.",
    material_id: 2, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: true,
    difficulty: 3, supervision_required: false,
    steps: [
      "Cut newspaper pages in half and fold them into long flat strips.",
      "Weave the strips together starting from the middle and working outward.",
      "Use dots of glue to keep the strips from moving while you work.",
      "When it is big enough glue a final strip around the edge to cover the messy ends.",
      "Paint it with bright colours and add a layer of PVA glue to make it shiny and tough.",
    ],
  },
  // PLASTIC
  {
    id: 17, recipe_name: "Bowling Set",
    end_product: "A set of ten plastic bottles filled with sand used as bowling pins for an indoor or outdoor game.",
    material_id: 3, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: false,
    difficulty: 1, supervision_required: false,
    steps: [
      "Fill each of your 10 bottles with a little sand or water to make them heavy so they do not blow away.",
      "Put the caps back on tightly.",
      "Set the bottles up in a triangle shape like real bowling pins.",
      "Grab a small ball, roll it, and try to knock them all down!",
    ],
  },
  {
    id: 18, recipe_name: "Plastic Bottle Shaker",
    end_product: "A plastic bottle filled with dried beans or rice that creates different sounds when shaken as a musical instrument.",
    material_id: 3, requires_glue: false, requires_scissors: false, requires_tape: false, requires_string: false, requires_paint: true,
    difficulty: 1, supervision_required: false,
    steps: [
      "Wash and dry your bottle and remove the label.",
      "Paint your bottle and lid with bright colours. You may need a few thin layers.",
      "Once the paint is dry roll a piece of paper into a funnel shape and place it in the top of the bottle.",
      "Use a spoon to put 3 or 4 scoops of beans, lentils, or rice into the bottle.",
      "Screw the lid on tightly and shake to make music!",
    ],
  },
  {
    id: 19, recipe_name: "Piggy Bank",
    end_product: "A plastic bottle decorated to look like a pig with a coin slot cut into the top for saving money.",
    material_id: 3, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: false, requires_paint: true,
    difficulty: 2, supervision_required: false,
    steps: [
      "Use a pencil to poke two holes about 2cm apart into the top of your bottle.",
      "Slide scissors in and cut a small slit between the holes for your coins.",
      "Paint the bottle pink and leave to dry.",
      "Cut two paper circles and glue them to the bottle cap to make a nose, colour them black.",
      "Cut two paper ear shapes and glue them near the spout, draw on eyes with a marker.",
      "Cut four small circles from paper and glue them to the bottom as trotters.",
      "Cut a thin strip of paper and drag a pencil along it to make it curl into a tail, glue it to the back and paint it pink.",
    ],
  },
  {
    id: 20, recipe_name: "Woven Basket",
    end_product: "A milk carton woven with coloured string to create a decorative basket used as a gift box or storage container.",
    material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: true, requires_paint: false,
    difficulty: 3, supervision_required: false,
    steps: [
      "Cut your carton in half and save a long strip of plastic to use as a handle later.",
      "Cut upright strips down the sides of the bottom half. You need an odd number like 7 or 9 for the weaving to work.",
      "Tie a knot in your string around one strip and start weaving it in and out of the other strips.",
      "To change colours just tie a new piece of string to the old one.",
      "When you are done weaving tape the handle strip to the sides of your basket.",
    ],
  },
  {
    id: 21, recipe_name: "Yogurt Pot Snake",
    end_product: "A chain of linked yogurt pots decorated to look like a snake used as a toy or room decoration.",
    material_id: 3, requires_glue: true, requires_scissors: true, requires_tape: false, requires_string: true, requires_paint: true,
    difficulty: 3, supervision_required: true,
    steps: [
      "Paint each of the yogurt pots to decorate them and leave to dry.",
      "Use a pencil to poke a hole in the middle of the bottom of the first pot which will be the head.",
      "Pull your string through the hole, draw eyes and glue a paper tongue onto the head.",
      "Poke holes in the rest of the pots and thread them onto the string one by one.",
      "Face the pots toward each other so the open tops touch.",
      "Tie a big knot at the end and make a loop with the string so you can pull your snake along.",
    ],
  },
  {
    id: 22, recipe_name: "Plastic Bottle Water Gun",
    end_product: "A plastic bottle converted into a water gun toy for outdoor summer play.",
    material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: false, requires_paint: false,
    difficulty: 3, supervision_required: true,
    steps: [
      "Use a pencil to poke a hole in the bottle cap.",
      "Use scissors to carefully widen the hole just enough for a straw to fit through.",
      "Push a straw through the hole.",
      "Wrap tape tightly around where the straw meets the cap to seal it so no water leaks out.",
      "Cut the straw so it almost touches the bottom of the bottle when the cap is on.",
      "Fill the bottle with water, screw the cap on tightly, and squeeze the bottle to shoot water!",
    ],
  },
  {
    id: 23, recipe_name: "Jewelry Stand",
    end_product: "A tiered stand made from plastic bottles connected with string used for organising and displaying jewelry and accessories.",
    material_id: 3, requires_glue: false, requires_scissors: true, requires_tape: true, requires_string: true, requires_paint: false,
    difficulty: 4, supervision_required: true,
    steps: [
      "Use a pencil to poke a hole in the bottom of each bottle then use scissors to widen it.",
      "Cut the tops and bottoms off the bottles using scissors to make flat plastic sheets.",
      "Roll each plastic sheet into a rod shape and secure with tape.",
      "Cut the bottoms off two bottles to use as the tiers of the stand.",
      "Thread string through the bottom of one bottle tier, through a rod, and through the bottom of the next tier.",
      "Secure with a knot and repeat to add more tiers.",
      "Hang your jewelry over the edges of each tier.",
    ],
  },
];

const recipe_references = {
  1:  { source_name: "Corn on the Cob Pencil Holder",       source_url: "https://funfamilycrafts.com/corn-on-the-cob-pencil-holder/" },
  2:  { source_name: "Vase from Recycled Materials",         source_url: "https://funfamilycrafts.com/vase-with-recycled-materials/" },
  3:  { source_name: "Toy Car Parking Garage",               source_url: "https://funfamilycrafts.com/wooden-crate-parking-garage/" },
  4:  { source_name: "DIY Geometric Wall Organiser",         source_url: "https://funfamilycrafts.com/wooden-crate-parking-garage/" },
  5:  { source_name: "Cardboard Nok Hockey",                 source_url: "https://www.instructables.com/Cardboard-Nok-Hockey/" },
  6:  { source_name: "Cardboard Storage Shelf",              source_url: "https://www.instructables.com/Cardboard-Storage-Shelf-From-Single-Box/" },
  7:  { source_name: "DIY Cardboard Tensegrity Pen Holder",  source_url: "https://www.instructables.com/DIY-Cardboard-Tensegrity-Pen-Holder/" },
  8:  { source_name: "Origami Corner Bookmark",              source_url: "https://www.gatheringbeauty.com/blog//2017/11/make-your-own-origami-corner-bookmarks.html" },
  9:  { source_name: "Origami Box with Lid (Masu Box)",      source_url: "https://origami.me/box/" },
  10: { source_name: "Ninja Star (Shuriken)",                source_url: "https://frugalfun4boys.com/fold-paper-ninja-stars/" },
  11: { source_name: "Newspaper Origami Envelope",           source_url: "https://www.redtedart.com/newspaper-origami-envelope/" },
  12: { source_name: "DIY Gift Bag",                         source_url: "https://www.kellyelko.com/diy-gift-bags-from-any-paper/" },
  13: { source_name: "Origami Photo Frame",                  source_url: "https://makeandtakes.com/super-simple-origami-picture-frames" },
  14: { source_name: "Newspaper Rings Basket",               source_url: "https://crazeekidsart.com/newspaper-crafts-for-kids/" },
  15: { source_name: "Birds Nest Lampshade",                 source_url: "https://www.catchmyparty.com/blog/diy-how-to-make-a-birds-nest-lamp-shade-out-of-newspaper" },
  16: { source_name: "Newspaper Placemat",                   source_url: "https://www.instructables.com/Old-Newspaper-Placemats-and-Coaster/" },
  17: { source_name: "Bowling Set",                          source_url: "https://www.plasticexpert.co.uk/diy-easy-plastic-bottle-craft-ideas/" },
  18: { source_name: "Plastic Bottle Shaker",                source_url: "https://www.things-to-make-and-do.co.uk/other-stuff/musical-instruments/plastic-bottle-shaker.html" },
  19: { source_name: "Piggy Bank",                           source_url: "https://www.ourkidthings.com/diy-water-bottle-piggy-banks/" },
  20: { source_name: "Woven Basket",                         source_url: "https://www.redtedart.com/milk-carton-woven-basket-craft/" },
  21: { source_name: "Yogurt Pot Snake",                     source_url: "https://www.diythought.com/yogurt-pot-snake/" },
  22: { source_name: "Plastic Bottle Water Gun",             source_url: "https://rediscovercenter.org/make-a-plastic-bottle-soaker/" },
  23: { source_name: "Jewelry Stand",                        source_url: "https://www.thriftyfun.com/Upcycled-Plastic-Bottle-Jewelry-Stand-1.html" },
};

const recipe_images = {
  1:  require("./assets/corn-on-the-cob-pencil-holder.jpg"),
  3:  require("./assets/parking-garage.jpg"),
  4:  require("./assets/geometric-organiser.webp"),
  5:  require("./assets/nok-hockey.webp"),
  6:  require("./assets/storage-shelf.webp"),
  7:  require("./assets/tensegrity-pen-holder.webp"),
  8:  require("./assets/origami-corner-bookmark.png"),
  9:  require("./assets/origami-box-with-lid.png"),
  10: require("./assets/ninja-star.png"),
  11: require("./assets/Newspaper-Envelopes.jpg"),
  12: require("./assets/paper-gift-bag.png"),
  14: require("./assets/newspaper-rings-basket.jpg"),
  15: require("./assets/birdsnest-lampshade.png"),
  16: require("./assets/newspaper-placemat.png"),
  17: require("./assets/bowling.jpg"),
  18: require("./assets/shaker-instrument.jpg"),
  19: require("./assets/piggy-bank.png"),
  20: require("./assets/woven-basket.jpg"),
  21: require("./assets/yogurt-pot-snake.webp"),
  22: require("./assets/watergun.png"),
  23: require("./assets/jewellery-stand.jpg"),
};

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
function TabBar({ activeTab, onTabPress }) {
  const tabs = [
    { key: "home",  label: "Home",     icon: "home",        iconOutline: "home-outline" },
    { key: "scans", label: "My Scans", icon: "time",        iconOutline: "time-outline" },
    { key: "guide", label: "Guide",    icon: "book",        iconOutline: "book-outline" },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, active && styles.tabItemActive]}
            onPress={() => onTabPress(tab.key)}
          >
            <Ionicons
              name={active ? tab.icon : tab.iconOutline}
              size={22}
              color={active ? C.primary : C.muted}
            />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ onStartScan }) {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeTitle}>REUSE LENS</Text>
      <Text style={styles.homeTagline}>
        Photo it. Check its history.{"\n"}Reuse it — or bin it right.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={onStartScan}>
        <Text style={styles.startButtonText}>Start Scanning</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCAN SCREEN ─────────────────────────────────────────────────────────────
function ScanScreen({ onBack, onClassificationResult }) {
  const [imageUri,    setImageUri]    = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading,     setLoading]     = useState(false);

  const pickOptions = { mediaTypes: "images", allowsEditing: true, quality: 0.6, base64: true };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync(pickOptions);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const chooseFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(pickOptions);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const analyseWithAI = async () => {
    if (!imageBase64) {
      Alert.alert("No image", "Please take or choose a photo first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: imageBase64,
          parameters: { candidate_labels: CLIP_PROMPTS },
        }),
      });

      if (response.status === 503) {
        Alert.alert("Model warming up", "The AI is starting up. Please wait about 20 seconds and try again.");
        return;
      }
      if (!response.ok) throw new Error(`API error ${response.status}`);

      const results = await response.json();
      // HF returns results sorted by score descending
      const top    = results[0];
      const label  = PROMPT_TO_LABEL[top.label] ?? top.label;
      onClassificationResult(label, top.score);
    } catch (err) {
      Alert.alert("Error", "Could not classify the image. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={styles.scanHeader}>
        <TouchableOpacity style={styles.circleBack} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.scanHeaderTitle}>Step 1 — Photo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scanBody}>
        <Text style={styles.scanTitle}>Take a clear photo</Text>

        <View style={styles.tipBox}>
          <Ionicons name="bulb" size={16} color={C.tipText} />
          <Text style={styles.tipText}>  Good lighting = Better detection</Text>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.scanPreview} resizeMode="cover" />
        ) : (
          <View style={styles.scanPreviewPlaceholder}>
            <Ionicons name="image-outline" size={64} color={C.muted} />
          </View>
        )}

        <TouchableOpacity style={styles.scanPrimaryButton} onPress={takePhoto} disabled={loading}>
          <Ionicons name="camera" size={20} color={C.bg} />
          <Text style={styles.scanPrimaryButtonText}>  Take New Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanSecondaryButton} onPress={chooseFromLibrary} disabled={loading}>
          <Ionicons name="images" size={20} color={C.primary} />
          <Text style={styles.scanSecondaryButtonText}>  Choose from Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanPrimaryButton, { marginTop: 8, opacity: loading || !imageUri ? 0.5 : 1 }]}
          onPress={analyseWithAI}
          disabled={loading || !imageUri}
        >
          {loading ? (
            <ActivityIndicator color={C.bg} />
          ) : (
            <Text style={styles.scanPrimaryButtonText}>Analyse with AI</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── CLASSIFICATION RESULT SCREEN ─────────────────────────────────────────────
const MATERIAL_META = {
  cardboard: { id: 1, name: "Cardboard", emoji: "📦" },
  paper:     { id: 2, name: "Paper",     emoji: "📄" },
  plastic:   { id: 3, name: "Plastic",   emoji: "🧴" },
};

function ClassificationResultScreen({ label, confidence, onConfirm }) {
  const [showManual, setShowManual] = useState(false);
  const lowConfidence = confidence < 0.70;
  const meta = MATERIAL_META[label];

  if (showManual) {
    return (
      <View style={styles.classContainer}>
        <Text style={styles.classHeading}>Choose your material</Text>
        <Text style={styles.classSub}>Select the correct material below</Text>
        {Object.values(MATERIAL_META).map((m) => (
          <TouchableOpacity key={m.id} style={styles.materialCard} onPress={() => onConfirm(m.name.toLowerCase())}>
            <Text style={styles.materialEmoji}>{m.emoji}</Text>
            <Text style={styles.materialName}>{m.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.classContainer}>
      {lowConfidence && (
        <View style={styles.lowConfBox}>
          <Ionicons name="alert-circle-outline" size={18} color={C.tipText} />
          <Text style={styles.lowConfText}>
            {"  "}Low confidence — {Math.round(confidence * 100)}% sure
          </Text>
        </View>
      )}

      <Text style={styles.classEmoji}>{meta?.emoji ?? "🔍"}</Text>
      <Text style={styles.classHeading}>We think this is</Text>
      <Text style={styles.classLabel}>{meta?.name ?? label}</Text>
      <Text style={styles.classSub}>Is that correct?</Text>

      {!lowConfidence && (
        <View style={styles.confBar}>
          <View style={[styles.confFill, { width: `${Math.round(confidence * 100)}%` }]} />
          <Text style={styles.confLabel}>{Math.round(confidence * 100)}% confidence</Text>
        </View>
      )}

      <TouchableOpacity style={styles.scanPrimaryButton} onPress={() => onConfirm(label)}>
        <Text style={styles.scanPrimaryButtonText}>Yes, that's correct</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.scanSecondaryButton, { marginTop: 12 }]} onPress={() => setShowManual(true)}>
        <Text style={styles.scanSecondaryButtonText}>No, let me choose</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── MY SCANS SCREEN ─────────────────────────────────────────────────────────
function MyScansScreen() {
  return (
    <View style={styles.placeholderScreen}>
      <Ionicons name="time-outline" size={64} color={C.muted} />
      <Text style={styles.placeholderTitle}>My Scans</Text>
      <Text style={styles.placeholderSubtitle}>Your scan history will appear here</Text>
    </View>
  );
}

// ─── GUIDE: Material Selection ────────────────────────────────────────────────
function MaterialScreen({ onSelect }) {
  const materialList = [
    { id: 1, name: "Cardboard", emoji: "📦" },
    { id: 2, name: "Paper",     emoji: "📄" },
    { id: 3, name: "Plastic",   emoji: "🧴" },
  ];
  return (
    <ScrollView contentContainerStyle={styles.guideScreen}>
      <Text style={styles.guideTitle}>What material do you have?</Text>
      {materialList.map((m) => (
        <TouchableOpacity key={m.id} style={styles.materialCard} onPress={() => onSelect(m)}>
          <Text style={styles.materialEmoji}>{m.emoji}</Text>
          <Text style={styles.materialName}>{m.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── GUIDE: Condition Check ───────────────────────────────────────────────────
function ConditionScreen({ material, onResult, onBack }) {
  const [isWet,    setIsWet]    = useState(false);
  const [isDirty,  setIsDirty]  = useState(false);
  const [isRipped, setIsRipped] = useState(false);
  const [isFine,   setIsFine]   = useState(false);

  const rules = {
    1: { wet_ok: false, dirty_ok: false, ripped_ok: true,  washable: false, wash_instructions: null },
    2: { wet_ok: false, dirty_ok: false, ripped_ok: true,  washable: false, wash_instructions: null },
    3: { wet_ok: true,  dirty_ok: false, ripped_ok: false, washable: true,  wash_instructions: "Rinse with warm water and mild soap, dry fully before use." },
  };

  const handleFine = (val) => {
    setIsFine(val);
    if (val) { setIsWet(false); setIsDirty(false); setIsRipped(false); }
  };
  const handleCondition = (setter) => (val) => { setter(val); if (val) setIsFine(false); };

  const handleSubmit = () => {
    const rule = rules[material.id];
    if (isWet && !rule.wet_ok)   return onResult({ reuseable: false, reason: "This item is too wet to reuse. Let it dry completely first." });
    if (isDirty && !rule.dirty_ok) {
      if (rule.washable) return onResult({ reuseable: true, washFirst: true, instructions: rule.wash_instructions });
      return onResult({ reuseable: false, reason: "This item is too dirty to reuse." });
    }
    if (isRipped && !rule.ripped_ok) return onResult({ reuseable: false, reason: "This item is too damaged to reuse." });
    onResult({ reuseable: true });
  };

  const Toggle = ({ label, value, onChange }) => (
    <TouchableOpacity style={[styles.toggle, value && styles.toggleActive]} onPress={() => onChange(!value)}>
      <Text style={[styles.toggleText, value && styles.toggleTextActive]}>
        {value ? "✓  " : ""}{label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.guideScreen}>
      <TouchableOpacity style={styles.backLink} onPress={onBack}>
        <Ionicons name="chevron-back" size={18} color={C.primary} />
        <Text style={styles.backLinkText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.guideTitle}>What condition is your {material.name} in?</Text>
      <Text style={styles.guideSubtitle}>Select all that apply</Text>
      <Toggle label="It is fine"   value={isFine}   onChange={handleFine} />
      <Toggle label="It is wet"    value={isWet}    onChange={handleCondition(setIsWet)} />
      <Toggle label="It is dirty"  value={isDirty}  onChange={handleCondition(setIsDirty)} />
      <Toggle label="It is ripped" value={isRipped} onChange={handleCondition(setIsRipped)} />
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── GUIDE: Not Reuseable ─────────────────────────────────────────────────────
function NotReuseableScreen({ reason, onRestart }) {
  return (
    <View style={styles.centredScreen}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>😔</Text>
      <Text style={styles.guideTitle}>This item cannot be reused</Text>
      <Text style={styles.guideSubtitle}>{reason}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onRestart}>
        <Text style={styles.primaryButtonText}>Scan another item</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── GUIDE: Wash First ────────────────────────────────────────────────────────
function WashScreen({ instructions, onContinue }) {
  return (
    <View style={styles.centredScreen}>
      <Text style={{ fontSize: 50, marginBottom: 16 }}>🧼</Text>
      <Text style={styles.guideTitle}>Wash this item first</Text>
      <Text style={styles.guideSubtitle}>{instructions}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Done — show me recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── GUIDE: Tool Selection ────────────────────────────────────────────────────
function ToolScreen({ onSubmit, onBack }) {
  const [tools, setTools] = useState({ scissors: false, glue: false, tape: false, string: false, paint: false });
  const toggleTool = (tool) => setTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  const toolList = [
    { key: "scissors", label: "Scissors", emoji: "✂️" },
    { key: "glue",     label: "Glue",     emoji: "🖊️" },
    { key: "tape",     label: "Tape",     emoji: "🔲" },
    { key: "string",   label: "String",   emoji: "🧵" },
    { key: "paint",    label: "Paint",    emoji: "🎨" },
  ];
  return (
    <ScrollView contentContainerStyle={styles.guideScreen}>
      <TouchableOpacity style={styles.backLink} onPress={onBack}>
        <Ionicons name="chevron-back" size={18} color={C.primary} />
        <Text style={styles.backLinkText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.guideTitle}>What tools do you have?</Text>
      <Text style={styles.guideSubtitle}>Select all that apply</Text>
      {toolList.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[styles.toggle, tools[t.key] && styles.toggleActive]}
          onPress={() => toggleTool(t.key)}
        >
          <Text style={[styles.toggleText, tools[t.key] && styles.toggleTextActive]}>
            {tools[t.key] ? "✓  " : ""}{t.emoji}  {t.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.primaryButton} onPress={() => onSubmit(tools)}>
        <Text style={styles.primaryButtonText}>Show me recipes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── GUIDE: Recipe List ───────────────────────────────────────────────────────
function RecipeScreen({ materialId, tools, onBack, onRestart, onSelectRecipe }) {
  const recipeList = recipes_data
    .filter((r) => r.material_id === materialId)
    .filter((r) => {
      if (r.requires_scissors && !tools.scissors) return false;
      if (r.requires_glue     && !tools.glue)     return false;
      if (r.requires_tape     && !tools.tape)      return false;
      if (r.requires_string   && !tools.string)    return false;
      if (r.requires_paint    && !tools.paint)     return false;
      return true;
    })
    .sort((a, b) => a.difficulty - b.difficulty);

  if (recipeList.length === 0) {
    return (
      <View style={styles.centredScreen}>
        <Text style={styles.guideTitle}>No recipes found</Text>
        <Text style={styles.guideSubtitle}>Try selecting more tools</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onBack}>
          <Text style={styles.primaryButtonText}>Change tools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={onRestart}>
          <Text style={styles.ghostButtonText}>Start again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={styles.listHeader}>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <Ionicons name="chevron-back" size={18} color={C.primary} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.listHeaderTitle}>Recipes for you</Text>
        <TouchableOpacity onPress={onRestart}>
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => onSelectRecipe(item)}>
            {recipe_images[item.id] ? (
              <Image source={recipe_images[item.id]} style={styles.recipeCardImage} resizeMode="cover" />
            ) : (
              <View style={styles.recipeCardImagePlaceholder}>
                <Ionicons name="image-outline" size={32} color={C.muted} />
              </View>
            )}
            <View style={styles.recipeCardBody}>
              <Text style={styles.recipeCardName}>{item.recipe_name}</Text>
              <Text style={styles.recipeCardDesc} numberOfLines={2}>{item.end_product}</Text>
              <View style={styles.recipeCardMeta}>
                <View style={styles.metaChip}>
                  <Ionicons name="time-outline" size={13} color={C.muted} />
                  <Text style={styles.metaChipText}> {recipe_times[item.id]}</Text>
                </View>
                <View style={[styles.metaChip, { borderColor: difficultyColor[item.difficulty] + "55" }]}>
                  <Text style={[styles.metaChipText, { color: difficultyColor[item.difficulty] }]}>
                    Difficulty: {difficultyLabel[item.difficulty]}
                  </Text>
                </View>
              </View>
              {item.supervision_required && (
                <Text style={styles.supervisionBadge}>⚠️ Adult supervision needed</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ─── GUIDE: Recipe Detail ─────────────────────────────────────────────────────
function RecipeDetailScreen({ recipe, onBack }) {
  const ref = recipe_references[recipe.id];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={styles.detailBody}>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <Ionicons name="chevron-back" size={18} color={C.primary} />
          <Text style={styles.backLinkText}>Back to recipes</Text>
        </TouchableOpacity>

        <Text style={styles.detailTitle}>{recipe.recipe_name}</Text>

        {ref && (
          <TouchableOpacity onPress={() => Linking.openURL(ref.source_url)}>
            <Text style={styles.adaptedFrom}>Adapted from: {ref.source_name}</Text>
          </TouchableOpacity>
        )}

        {recipe_images[recipe.id] ? (
          <Image source={recipe_images[recipe.id]} style={styles.detailImage} resizeMode="cover" />
        ) : (
          <View style={styles.detailImagePlaceholder}>
            <Ionicons name="image-outline" size={48} color={C.muted} />
            <Text style={styles.imagePlaceholderText}>Image coming soon</Text>
          </View>
        )}

        <Text style={styles.detailDesc}>{recipe.end_product}</Text>

        <View style={styles.detailMetaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={14} color={C.muted} />
            <Text style={styles.metaChipText}> {recipe_times[recipe.id]}</Text>
          </View>
          <View style={[styles.metaChip, { borderColor: difficultyColor[recipe.difficulty] + "55" }]}>
            <Text style={[styles.metaChipText, { color: difficultyColor[recipe.difficulty] }]}>
              Difficulty: {difficultyLabel[recipe.difficulty]}
            </Text>
          </View>
          {recipe.supervision_required && (
            <View style={[styles.metaChip, { borderColor: C.danger + "55" }]}>
              <Text style={[styles.metaChipText, { color: C.danger }]}>⚠️ Supervision</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionHeading}>Steps</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepBubble}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>Top Tips</Text>
        <View style={styles.topTipsBox}>
          <Ionicons name="bulb-outline" size={24} color={C.muted} />
          <Text style={styles.topTipsPlaceholder}>Top tips coming soon!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,          setActiveTab]          = useState("home");
  const [homeScreen,         setHomeScreen]         = useState("home");
  const [classResult,        setClassResult]        = useState(null);
  const [guideScreen,        setGuideScreen]        = useState("material");
  const [material,           setMaterial]           = useState(null);
  const [tools,              setTools]              = useState(null);
  const [notReuseableReason, setNotReuseableReason] = useState("");
  const [washInstructions,   setWashInstructions]   = useState("");
  const [selectedRecipe,     setSelectedRecipe]     = useState(null);

  const restartGuide = () => {
    setGuideScreen("material");
    setMaterial(null);
    setTools(null);
    setSelectedRecipe(null);
  };

  const handleConditionResult = (result) => {
    if (!result.reuseable) {
      setNotReuseableReason(result.reason);
      setGuideScreen("notReuseable");
    } else if (result.washFirst) {
      setWashInstructions(result.instructions);
      setGuideScreen("wash");
    } else {
      setGuideScreen("tools");
    }
  };

  // Called when the backend returns a classification result.
  const handleClassificationResult = (label, confidence) => {
    setClassResult({ label, confidence });
    setHomeScreen("classResult");
  };

  // Called when the user confirms (or manually selects) a material from the classification screen.
  const handleConfirmMaterial = (materialKey) => {
    const meta = MATERIAL_META[materialKey];
    if (!meta) return;
    setMaterial({ id: meta.id, name: meta.name, emoji: meta.emoji });
    setGuideScreen("condition");
    setActiveTab("guide");
    setHomeScreen("home");
    setClassResult(null);
  };

  const renderHome = () => {
    switch (homeScreen) {
      case "scan":
        return (
          <ScanScreen
            onBack={() => setHomeScreen("home")}
            onClassificationResult={handleClassificationResult}
          />
        );
      case "classResult":
        return (
          <ClassificationResultScreen
            label={classResult.label}
            confidence={classResult.confidence}
            onConfirm={handleConfirmMaterial}
          />
        );
      default:
        return <HomeScreen onStartScan={() => setHomeScreen("scan")} />;
    }
  };

  const renderGuide = () => {
    switch (guideScreen) {
      case "material":
        return (
          <MaterialScreen
            onSelect={(m) => { setMaterial(m); setGuideScreen("condition"); }}
          />
        );
      case "condition":
        return (
          <ConditionScreen
            material={material}
            onResult={handleConditionResult}
            onBack={() => setGuideScreen("material")}
          />
        );
      case "notReuseable":
        return <NotReuseableScreen reason={notReuseableReason} onRestart={restartGuide} />;
      case "wash":
        return <WashScreen instructions={washInstructions} onContinue={() => setGuideScreen("tools")} />;
      case "tools":
        return (
          <ToolScreen
            onSubmit={(t) => { setTools(t); setGuideScreen("recipes"); }}
            onBack={() => setGuideScreen("condition")}
          />
        );
      case "recipes":
        return (
          <RecipeScreen
            materialId={material.id}
            tools={tools}
            onBack={() => setGuideScreen("tools")}
            onRestart={restartGuide}
            onSelectRecipe={(r) => { setSelectedRecipe(r); setGuideScreen("recipeDetail"); }}
          />
        );
      case "recipeDetail":
        return (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            onBack={() => setGuideScreen("recipes")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {activeTab === "home"  && renderHome()}
        {activeTab === "scans" && <MyScansScreen />}
        {activeTab === "guide" && renderGuide()}
      </View>
      <TabBar activeTab={activeTab} onTabPress={(tab) => { setActiveTab(tab); }} />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Tab Bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.tabBar,
    borderTopWidth: 1,
    borderTopColor: C.tabBarBorder,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabItemActive: {
    backgroundColor: C.surfaceBorder,
  },
  tabLabel: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
  },
  tabLabelActive: {
    color: C.primary,
    fontWeight: "600",
  },

  // ── Home
  homeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: C.bg,
  },
  homeTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: C.primary,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 20,
  },
  homeTagline: {
    fontSize: 18,
    color: C.white,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 48,
  },
  startButton: {
    backgroundColor: C.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 40,
  },
  startButtonText: {
    color: C.bg,
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Scan
  scanHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceBorder,
  },
  circleBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  scanHeaderTitle: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
  },
  scanBody: {
    padding: 24,
  },
  scanTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 16,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.tipBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tipText: {
    color: C.tipText,
    fontSize: 14,
    fontWeight: "600",
  },
  scanPreview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
  },
  scanPreviewPlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  scanPrimaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    borderRadius: 40,
    paddingVertical: 18,
    marginBottom: 12,
  },
  scanPrimaryButtonText: {
    color: C.bg,
    fontSize: 16,
    fontWeight: "700",
  },
  scanSecondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primaryDark,
    borderRadius: 40,
    paddingVertical: 18,
    marginBottom: 12,
  },
  scanSecondaryButtonText: {
    color: C.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  // ── Placeholder screen
  placeholderScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.bg,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.white,
    marginTop: 16,
  },
  placeholderSubtitle: {
    fontSize: 15,
    color: C.muted,
    marginTop: 8,
    textAlign: "center",
  },

  // ── Guide shared
  guideScreen: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: C.bg,
    flexGrow: 1,
  },
  centredScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.bg,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.white,
    marginBottom: 8,
  },
  guideSubtitle: {
    fontSize: 15,
    color: C.muted,
    marginBottom: 20,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backLinkText: {
    color: C.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  materialEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  materialName: {
    fontSize: 18,
    fontWeight: "600",
    color: C.white,
  },
  toggle: {
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.surfaceBorder,
  },
  toggleActive: {
    backgroundColor: C.primaryDark,
    borderColor: C.primary,
  },
  toggleText: {
    fontSize: 16,
    color: C.muted,
    textAlign: "center",
  },
  toggleTextActive: {
    color: C.primary,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: C.primary,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: C.bg,
    fontSize: 16,
    fontWeight: "700",
  },
  ghostButton: {
    borderRadius: 40,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    width: "100%",
  },
  ghostButtonText: {
    color: C.muted,
    fontSize: 15,
  },

  // ── Recipe list
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceBorder,
  },
  listHeaderTitle: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
  },
  restartText: {
    color: C.muted,
    fontSize: 14,
  },
  recipeCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.surfaceBorder,
  },
  recipeCardImage: {
    width: "100%",
    height: 160,
  },
  recipeCardImagePlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bg,
  },
  recipeCardBody: {
    padding: 14,
  },
  recipeCardName: {
    fontSize: 17,
    fontWeight: "700",
    color: C.white,
    marginBottom: 4,
  },
  recipeCardDesc: {
    fontSize: 13,
    color: C.muted,
    marginBottom: 10,
    lineHeight: 18,
  },
  recipeCardMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaChipText: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "500",
  },
  supervisionBadge: {
    fontSize: 12,
    color: C.danger,
    fontWeight: "600",
    marginTop: 8,
  },

  // ── Recipe detail
  detailBody: {
    padding: 24,
    paddingTop: 16,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.white,
    marginBottom: 6,
  },
  adaptedFrom: {
    fontSize: 13,
    color: C.primary,
    textDecorationLine: "underline",
    marginBottom: 18,
  },
  detailImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
  },
  detailImagePlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  imagePlaceholderText: {
    color: C.muted,
    marginTop: 8,
    fontSize: 14,
  },
  detailDesc: {
    fontSize: 15,
    color: C.muted,
    lineHeight: 22,
    marginBottom: 12,
  },
  detailMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: "700",
    color: C.white,
    marginBottom: 14,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  stepBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumber: {
    color: C.bg,
    fontSize: 13,
    fontWeight: "800",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: C.white,
    lineHeight: 22,
  },
  topTipsBox: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    alignItems: "center",
    marginBottom: 40,
    gap: 8,
  },
  topTipsPlaceholder: {
    fontSize: 15,
    color: C.muted,
    fontStyle: "italic",
  },

  // ── Classification result
  classContainer: {
    flexGrow: 1,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bg,
  },
  lowConfBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.tipBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: "100%",
  },
  lowConfText: {
    color: C.tipText,
    fontSize: 14,
    fontWeight: "600",
  },
  classEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  classHeading: {
    fontSize: 20,
    color: C.muted,
    fontWeight: "500",
    marginBottom: 4,
  },
  classLabel: {
    fontSize: 38,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  classSub: {
    fontSize: 16,
    color: C.white,
    marginBottom: 28,
  },
  confBar: {
    width: "100%",
    height: 28,
    backgroundColor: C.surface,
    borderRadius: 14,
    marginBottom: 28,
    overflow: "hidden",
    justifyContent: "center",
  },
  confFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: C.primaryDark,
    borderRadius: 14,
  },
  confLabel: {
    textAlign: "center",
    color: C.primary,
    fontSize: 13,
    fontWeight: "600",
    zIndex: 1,
  },
});
