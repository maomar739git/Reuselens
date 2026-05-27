import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Linking, Image } from "react-native";

const materials_data = [
  { id: 1, name: "Cardboard", wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
  { id: 2, name: "Paper", wet_ok: false, dirty_ok: false, ripped_ok: true, washable: false, wash_instructions: null },
  { id: 3, name: "Plastic", wet_ok: true, dirty_ok: false, ripped_ok: false, washable: true, wash_instructions: "Rinse with warm water and mild soap, dry fully before use." }
];

const recipes_data = [
  // CARDBOARD
  {
    id: 1,
    recipe_name: "Corn on the Cob Pencil Holder",
    end_product: "A cardboard tube decorated to look like corn on the cob, used to hold pens and pencils on your desk.",
    material_id: 1,
    requires_glue: true,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: true,
    difficulty: 1,
    supervision_required: false,
    steps: [
      "Use the cardboard tube as the base structure.",
      "Apply glue to the surface of the tube and roll it over beans or small rolled paper balls to stick them to the surface and mimic corn kernels.",
      "Paint the tube and beans bright yellow to resemble corn.",
      "Cut felt or paper into triangle shapes and glue them to the base to serve as the corn husks."
    ]
  },
  {
    id: 2,
    recipe_name: "Vase",
    end_product: "A cardboard tube transformed into a decorative vase for holding flowers or art supplies.",
    material_id: 1,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: true,
    difficulty: 1,
    supervision_required: false,
    steps: [
      "Clean and prepare your cardboard tube.",
      "Apply paint to the exterior in any colour or pattern you like.",
      "Leave to dry fully before using as a vase or desk organiser."
    ]
  },
  {
    id: 3,
    recipe_name: "Parking Garage",
    end_product: "A cardboard box converted into a multi-storey garage for storing and displaying toy cars.",
    material_id: 1,
    requires_glue: false,
    requires_scissors: true,
    requires_tape: true,
    requires_string: false,
    requires_paint: false,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Use a large cardboard box as the outer frame for the garage.",
      "Place cardboard tubes in a row fitting the width of the garage.",
      "Tape the row of tubes together.",
      "Place the row into the garage and stack more rows of tubes until you reach the top.",
      "Your garage is ready to store and display toy cars or other figurines."
    ]
  },
  {
    id: 4,
    recipe_name: "Geometric Wall Organizers",
    end_product: "Triangular cardboard baskets mounted on the wall for storing craft supplies and stationery.",
    material_id: 1,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: true,
    requires_string: true,
    requires_paint: true,
    difficulty: 3,
    supervision_required: true,
    steps: [
      "Draw a template of three equilateral triangles on cardboard.",
      "Cut the pattern using scissors.",
      "Draw lines down the middle of the side triangles and score along them using one blade of the scissors.",
      "Fold along the scored lines and join the edges to form a triangle basket, using tape to hold temporarily.",
      "Paint the baskets with any colour you like and leave to dry.",
      "Glue the baskets onto a larger cardboard base using PVA glue and leave to dry fully.",
      "Glue a cardboard strip to the top of the base and thread string through holes to make a hanging mechanism."
    ]
  },
  {
    id: 5,
    recipe_name: "Nok Hockey Game",
    end_product: "A handmade tabletop hockey game built from cardboard boxes that two players can compete against each other.",
    material_id: 1,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: true,
    requires_string: false,
    requires_paint: false,
    difficulty: 4,
    supervision_required: true,
    steps: [
      "Cut a large rectangle base from cardboard boxes, taping pieces together if necessary.",
      "Mark the centre line with masking tape.",
      "Create sideboards by gluing two layers of cardboard together for height and support using PVA glue, hold with tape while drying.",
      "Cut goal slots into the centre of the short sideboards using scissors.",
      "Glue the sideboards to the base using PVA glue and tape while drying.",
      "Construct goal blocks by gluing four layers of cardboard together and attaching them near the goal walls.",
      "Make pucks and sticks by gluing three layers of cardboard shapes together and leaving to dry."
    ]
  },
  {
    id: 6,
    recipe_name: "Storage Shelf",
    end_product: "A sturdy cardboard shelf built from a single box capable of holding books and small household items.",
    material_id: 1,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: true,
    requires_string: false,
    requires_paint: false,
    difficulty: 4,
    supervision_required: true,
    steps: [
      "Cut four legs from the corners of a large cardboard box using scissors.",
      "Cut four shelves from the sides of the box, leaving extra cardboard on the edges for folding.",
      "Bend the shelf sides by pressing firmly with a ruler along the fold lines.",
      "Glue the shelf corners with PVA glue and tape to hold them while drying.",
      "Reinforce the shelves by gluing extra cardboard pieces to the sides.",
      "Assemble by gluing the top and bottom shelves to two legs first, then adding the middle shelves and remaining legs.",
      "Leave to dry fully before placing any items on the shelf."
    ]
  },
  {
    id: 7,
    recipe_name: "Tensegrity Pen Holder",
    end_product: "A floating desk accessory that uses string tension to suspend a platform for holding pens and small items.",
    material_id: 1,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: false,
    requires_string: true,
    requires_paint: false,
    difficulty: 5,
    supervision_required: true,
    steps: [
      "Cut 16 identical U shapes from cardboard using a template.",
      "Glue them into four stacks of four using PVA glue and leave to dry.",
      "Twist string between the ends of two U stacks then glue the remaining two stacks on top to sandwich the string.",
      "Construct the pen holder box by gluing stacked cardboard pieces into a U shape and attaching side panels.",
      "Use a pencil to punch holes into cardboard squares and feed two strands of string through each corner.",
      "Glue the unravelled ends of the string to a cardboard square and sandwich with another square.",
      "Glue the tensegrity block to the centre of the base and the bottom of the pen holder.",
      "Feed the strands through the pen holder lip and adjust them until balanced, then knot and glue into place."
    ]
  },

  // PAPER
  {
    id: 8,
    recipe_name: "Origami Corner Bookmark",
    end_product: "A small triangular paper bookmark that slots onto the corner of a page to mark your place in a book.",
    material_id: 2,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 1,
    supervision_required: false,
    steps: [
      "Fold the square in half diagonally to create a triangle.",
      "Fold the bottom right and left corners up to meet the top centre point.",
      "Open those corners back out so you are back to a flat triangle.",
      "Take only the top layer of the top point and fold it down to the bottom edge to create a pocket.",
      "Fold the right and left corners back up and tuck them inside that pocket.",
      "Press it flat and slide it onto the corner of your book."
    ]
  },
  {
    id: 9,
    recipe_name: "Origami Box with Lid",
    end_product: "A folded paper box with a matching lid used for storing small items like paper clips and sweets.",
    material_id: 2,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Fold and unfold the paper in half both ways to make a cross, then fold all four corners into the centre point.",
      "Fold the top and bottom edges to the centre and unfold, then repeat with the side edges.",
      "Open the top and bottom flaps, then pull the sides up at a 90 degree angle to make walls.",
      "Push the corners inward to form the box shape and fold the top and bottom flaps over the edges to lock in place.",
      "For the lid follow the same steps but leave a small gap between the corners and the centre point so the lid fits over the box."
    ]
  },
  {
    id: 10,
    recipe_name: "Ninja Star",
    end_product: "A folded paper throwing star that can be used as a toy or displayed as a desk decoration.",
    material_id: 2,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Fold both squares in half to make thin rectangles, then fold them in half again.",
      "Fold the ends of the strips into opposite diagonal shapes so they look like mirror images of each other.",
      "Fold the ends again to create two triangles on each strip making them look like a Z or S shape.",
      "Place one piece across the other to form a cross.",
      "Fold the points of the bottom piece over and tuck them into the pockets of the top piece.",
      "Flip it over and tuck the remaining points into the pockets on the other side to lock it together."
    ]
  },
  {
    id: 11,
    recipe_name: "Newspaper Origami Envelope",
    end_product: "A rectangular envelope folded from newspaper used for sending letters and cards.",
    material_id: 2,
    requires_glue: false,
    requires_scissors: true,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Fold one corner of your newspaper over to make a triangle and cut off the extra bit to make a perfect square.",
      "Fold the bottom edge up by about 1cm then fold it again to reach the middle line.",
      "Turn the bottom corners in and fold the sides toward the middle.",
      "Fold the top corners in to make a triangle flap then fold the whole flap down and tuck it in to close the envelope."
    ]
  },
  {
    id: 12,
    recipe_name: "DIY Gift Bag",
    end_product: "A custom gift bag with handles made from any decorative paper used for presenting gifts.",
    material_id: 2,
    requires_glue: true,
    requires_scissors: false,
    requires_tape: true,
    requires_string: true,
    requires_paint: false,
    difficulty: 3,
    supervision_required: false,
    steps: [
      "Wrap your paper around a cereal box like a present but keep the top open.",
      "Glue the side edge and tape the bottom of the paper shut.",
      "Slide the box out and put a piece of cardboard in the bottom to make it strong.",
      "Pinch the sides to make neat creases and use a pencil to poke two holes at the top.",
      "Thread your string handles through the holes and tie knots to keep them in place."
    ]
  },
  {
    id: 13,
    recipe_name: "Origami Photo Frame",
    end_product: "A folded paper photo frame used to display a favourite picture or piece of artwork.",
    material_id: 2,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Fold the paper in half both ways and unfold.",
      "Fold all four edges in about 2cm to make a border.",
      "Flip the paper over and fold each of the new corners into the centre point.",
      "Flip it back over and you will see your frame.",
      "Slide your photo under the corner flaps to hold it in place."
    ]
  },
  {
    id: 14,
    recipe_name: "Newspaper Rings Basket",
    end_product: "A woven bowl-like basket made from rolled newspaper rings used as a container or coaster.",
    material_id: 2,
    requires_glue: true,
    requires_scissors: false,
    requires_tape: true,
    requires_string: false,
    requires_paint: true,
    difficulty: 3,
    supervision_required: false,
    steps: [
      "Roll newspaper sheets into tight tubes using a pencil then flatten them by rolling a heavy object over them.",
      "Coil a flattened tube into a tight circle gluing as you go until it is about 7cm wide to make the base.",
      "Wrap flattened tubes around a mug and tape the ends to make large rings.",
      "Wrap tubes around a smaller container to make smaller rings.",
      "Glue the smaller rings around the base then glue the larger rings on top to build the basket walls.",
      "Paint the basket when dry."
    ]
  },
  {
    id: 15,
    recipe_name: "Birds Nest Lampshade",
    end_product: "A woven lampshade made from rolled newspaper tubes that creates a natural textured pattern when lit.",
    material_id: 2,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 5,
    supervision_required: true,
    steps: [
      "Roll thin tubes of newspaper using a pencil and glue the ends shut. You will need a large number of tubes.",
      "Trim the ends of the tubes with scissors so they are all the same length.",
      "Stack the tubes on top of each other in a messy overlapping circle just like a birds nest gluing them together as you go.",
      "Once dry and strong sit it on top of a small lamp."
    ]
  },
  {
    id: 16,
    recipe_name: "Newspaper Placemat",
    end_product: "A woven placemat made from newspaper strips used to protect your table at mealtimes.",
    material_id: 2,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: false,
    requires_string: false,
    requires_paint: true,
    difficulty: 3,
    supervision_required: false,
    steps: [
      "Cut newspaper pages in half and fold them into long flat strips.",
      "Weave the strips together starting from the middle and working outward.",
      "Use dots of glue to keep the strips from moving while you work.",
      "When it is big enough glue a final strip around the edge to cover the messy ends.",
      "Paint it with bright colours and add a layer of PVA glue to make it shiny and tough."
    ]
  },

  // PLASTIC
  {
    id: 17,
    recipe_name: "Bowling Set",
    end_product: "A set of ten plastic bottles filled with sand used as bowling pins for an indoor or outdoor game.",
    material_id: 3,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: false,
    difficulty: 1,
    supervision_required: false,
    steps: [
      "Fill each of your 10 bottles with a little sand or water to make them heavy so they do not blow away.",
      "Put the caps back on tightly.",
      "Set the bottles up in a triangle shape like real bowling pins.",
      "Grab a small ball, roll it, and try to knock them all down!"
    ]
  },
  {
    id: 18,
    recipe_name: "Plastic Bottle Shaker",
    end_product: "A plastic bottle filled with dried beans or rice that creates different sounds when shaken as a musical instrument.",
    material_id: 3,
    requires_glue: false,
    requires_scissors: false,
    requires_tape: false,
    requires_string: false,
    requires_paint: true,
    difficulty: 1,
    supervision_required: false,
    steps: [
      "Wash and dry your bottle and remove the label.",
      "Paint your bottle and lid with bright colours. You may need a few thin layers.",
      "Once the paint is dry roll a piece of paper into a funnel shape and place it in the top of the bottle.",
      "Use a spoon to put 3 or 4 scoops of beans, lentils, or rice into the bottle.",
      "Screw the lid on tightly and shake to make music!"
    ]
  },
  {
    id: 19,
    recipe_name: "Piggy Bank",
    end_product: "A plastic bottle decorated to look like a pig with a coin slot cut into the top for saving money.",
    material_id: 3,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: false,
    requires_string: false,
    requires_paint: true,
    difficulty: 2,
    supervision_required: false,
    steps: [
      "Use a pencil to poke two holes about 2cm apart into the top of your bottle.",
      "Slide scissors in and cut a small slit between the holes for your coins.",
      "Paint the bottle pink and leave to dry.",
      "Cut two paper circles and glue them to the bottle cap to make a nose, colour them black.",
      "Cut two paper ear shapes and glue them near the spout, draw on eyes with a marker.",
      "Cut four small circles from paper and glue them to the bottom as trotters.",
      "Cut a thin strip of paper and drag a pencil along it to make it curl into a tail, glue it to the back and paint it pink."
    ]
  },
  {
    id: 20,
    recipe_name: "Woven Basket",
    end_product: "A milk carton woven with coloured string to create a decorative basket used as a gift box or storage container.",
    material_id: 3,
    requires_glue: false,
    requires_scissors: true,
    requires_tape: true,
    requires_string: true,
    requires_paint: false,
    difficulty: 3,
    supervision_required: false,
    steps: [
      "Cut your carton in half and save a long strip of plastic to use as a handle later.",
      "Cut upright strips down the sides of the bottom half. You need an odd number like 7 or 9 for the weaving to work.",
      "Tie a knot in your string around one strip and start weaving it in and out of the other strips.",
      "To change colours just tie a new piece of string to the old one.",
      "When you are done weaving tape the handle strip to the sides of your basket."
    ]
  },
  {
    id: 21,
    recipe_name: "Yogurt Pot Snake",
    end_product: "A chain of linked yogurt pots decorated to look like a snake used as a toy or room decoration.",
    material_id: 3,
    requires_glue: true,
    requires_scissors: true,
    requires_tape: false,
    requires_string: true,
    requires_paint: true,
    difficulty: 3,
    supervision_required: true,
    steps: [
      "Paint each of the yogurt pots to decorate them and leave to dry.",
      "Use a pencil to poke a hole in the middle of the bottom of the first pot which will be the head.",
      "Pull your string through the hole, draw eyes and glue a paper tongue onto the head.",
      "Poke holes in the rest of the pots and thread them onto the string one by one.",
      "Face the pots toward each other so the open tops touch.",
      "Tie a big knot at the end and make a loop with the string so you can pull your snake along."
    ]
  },
  {
    id: 22,
    recipe_name: "Plastic Bottle Water Gun",
    end_product: "A plastic bottle converted into a water gun toy for outdoor summer play.",
    material_id: 3,
    requires_glue: false,
    requires_scissors: true,
    requires_tape: true,
    requires_string: false,
    requires_paint: false,
    difficulty: 3,
    supervision_required: true,
    steps: [
      "Use a pencil to poke a hole in the bottle cap.",
      "Use scissors to carefully widen the hole just enough for a straw to fit through.",
      "Push a straw through the hole.",
      "Wrap tape tightly around where the straw meets the cap to seal it so no water leaks out.",
      "Cut the straw so it almost touches the bottom of the bottle when the cap is on.",
      "Fill the bottle with water, screw the cap on tightly, and squeeze the bottle to shoot water!"
    ]
  },
  {
    id: 23,
    recipe_name: "Jewelry Stand",
    end_product: "A tiered stand made from plastic bottles connected with string used for organising and displaying jewelry and accessories.",
    material_id: 3,
    requires_glue: false,
    requires_scissors: true,
    requires_tape: true,
    requires_string: true,
    requires_paint: false,
    difficulty: 4,
    supervision_required: true,
    steps: [
      "Use a pencil to poke a hole in the bottom of each bottle then use scissors to widen it.",
      "Cut the tops and bottoms off the bottles using scissors to make flat plastic sheets.",
      "Roll each plastic sheet into a rod shape and secure with tape.",
      "Cut the bottoms off two bottles to use as the tiers of the stand.",
      "Thread string through the bottom of one bottle tier, through a rod, and through the bottom of the next tier.",
      "Secure with a knot and repeat to add more tiers.",
      "Hang your jewelry over the edges of each tier."
    ]
  }
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
function RecipeScreen({ materialId, tools, onRestart, onSelectRecipe }) {
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
          <TouchableOpacity style={styles.recipeCard} onPress={() => onSelectRecipe(item)}>
            {recipe_images[item.id] ? (
              <Image source={recipe_images[item.id]} style={styles.recipePlaceholderImage} resizeMode="cover" />
            ) : (
              <View style={styles.recipePlaceholderImage}>
                <Text style={styles.placeholderText}>📷 Image coming soon</Text>
              </View>
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.recipe_name}</Text>
              <Text style={styles.recipeDescription}>{item.end_product}</Text>
              <Text style={styles.stars}>{stars(item.difficulty)}</Text>
              {item.supervision_required && (
                <Text style={styles.supervisionBadge}>⚠️ Adult supervision needed</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={onRestart}>
        <Text style={styles.buttonText}>Start again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── SCREEN 7: Recipe Detail ─────────────────────────────────────────────────
function RecipeDetailScreen({ recipe, onBack }) {
  const ref = recipe_references[recipe.id];
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <ScrollView contentContainerStyle={styles.detailContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.detailTitle}>{recipe.recipe_name}</Text>

      {ref && (
        <TouchableOpacity onPress={() => Linking.openURL(ref.source_url)}>
          <Text style={styles.adaptedFrom}>Adapted from: {ref.source_name}</Text>
        </TouchableOpacity>
      )}

      {recipe_images[recipe.id] ? (
        <Image source={recipe_images[recipe.id]} style={styles.detailPlaceholderImage} resizeMode="cover" />
      ) : (
        <View style={styles.detailPlaceholderImage}>
          <Text style={styles.placeholderText}>📷 Image coming soon</Text>
        </View>
      )}

      <Text style={styles.detailDescription}>{recipe.end_product}</Text>

      <View style={styles.detailMeta}>
        <Text style={styles.stars}>{stars(recipe.difficulty)}</Text>
        {recipe.supervision_required && (
          <Text style={styles.supervisionBadge}>⚠️ Adult supervision needed</Text>
        )}
      </View>

      <Text style={styles.sectionHeading}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <Text style={styles.sectionHeading}>Top Tips</Text>
      <View style={styles.topTipsBox}>
        <Text style={styles.topTipsPlaceholder}>💡 Top tips coming soon!</Text>
      </View>
    </ScrollView>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("material");
  const [material, setMaterial] = useState(null);
  const [tools, setTools] = useState(null);
  const [notReuseableReason, setNotReuseableReason] = useState("");
  const [washInstructions, setWashInstructions] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setScreen("recipeDetail");
  };

  const restart = () => {
    setScreen("material");
    setMaterial(null);
    setTools(null);
    setSelectedRecipe(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {screen === "material" && <MaterialScreen onSelect={handleMaterialSelect} />}
      {screen === "condition" && <ConditionScreen material={material} onResult={handleConditionResult} />}
      {screen === "notReuseable" && <NotReuseableScreen reason={notReuseableReason} onRestart={restart} />}
      {screen === "wash" && <WashScreen instructions={washInstructions} onContinue={() => setScreen("tools")} />}
      {screen === "tools" && <ToolScreen onSubmit={handleToolSubmit} />}
      {screen === "recipes" && (
        <RecipeScreen
          materialId={material.id}
          tools={tools}
          onRestart={restart}
          onSelectRecipe={handleSelectRecipe}
        />
      )}
      {screen === "recipeDetail" && selectedRecipe && (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          onBack={() => setScreen("recipes")}
        />
      )}
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
  detailContainer: {
    padding: 24,
    backgroundColor: "#f0f4f8",
  },
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#4a6fa5",
    fontWeight: "600",
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  adaptedFrom: {
    fontSize: 14,
    color: "#4a6fa5",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  detailPlaceholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e8edf2",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
    lineHeight: 22,
  },
  detailMeta: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    marginTop: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4a6fa5",
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
    marginRight: 12,
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    paddingTop: 4,
  },
  topTipsBox: {
    backgroundColor: "#fffde7",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffe082",
    marginTop: 4,
    marginBottom: 32,
    alignItems: "center",
  },
  topTipsPlaceholder: {
    fontSize: 15,
    color: "#888",
    fontStyle: "italic",
  },
});