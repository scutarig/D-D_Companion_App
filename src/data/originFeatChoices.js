// ─────────────────────────────────────────────────────────────────────────────
// originFeatChoices.js — Data for the 6 complex Origin Feats with User Pickers
//
// Each feat that requires user input gets its options data here.
// User selections are stored in char.featChoices[featId] = {...}
//
// 6 Complex Origin Feats:
//   1. Magic Initiate    → Wahl Spellliste + 2 Cantrips + 1 Lv1 Spell
//   2. Crafter           → 3 Artisan's Tools
//   3. Skilled           → 3 Skills oder Tools
//   4. Musician          → 3 Musical Instruments
//   5. Lucky             → PB Luck Points (Resource-Tracking)
//   6. Tavern Brawler    → +1 STR oder CON Half-Feat
// ─────────────────────────────────────────────────────────────────────────────

// ─── Magic Initiate ──────────────────────────────────────────────────────────
export const MAGIC_INITIATE_LISTS = {
  cleric: {
    name: "Cleric",
    cantrips: ["Guidance","Light","Mending","Resistance","Sacred Flame","Spare the Dying","Thaumaturgy","Toll the Dead","Word of Radiance"],
    lvl1: ["Bless","Cure Wounds","Detect Magic","Guiding Bolt","Healing Word","Inflict Wounds","Protection from Evil and Good","Sanctuary","Shield of Faith"],
  },
  druid: {
    name: "Druid",
    cantrips: ["Druidcraft","Elementalism","Guidance","Mending","Poison Spray","Produce Flame","Resistance","Shillelagh","Starry Wisp","Thorn Whip"],
    lvl1: ["Cure Wounds","Detect Magic","Entangle","Faerie Fire","Goodberry","Healing Word","Speak with Animals","Thunderwave"],
  },
  wizard: {
    name: "Wizard",
    cantrips: ["Acid Splash","Chill Touch","Dancing Lights","Fire Bolt","Friends","Light","Mage Hand","Mending","Message","Minor Illusion","Poison Spray","Prestidigitation","Ray of Frost","Shocking Grasp","True Strike"],
    lvl1: ["Burning Hands","Charm Person","Detect Magic","Disguise Self","Feather Fall","Identify","Mage Armor","Magic Missile","Shield","Sleep","Thunderwave"],
  },
};

// ─── Crafter / Musician — Tool Lists ─────────────────────────────────────────
export const ARTISAN_TOOLS = [
  "Alchemist's Supplies","Brewer's Supplies","Calligrapher's Supplies",
  "Carpenter's Tools","Cartographer's Tools","Cobbler's Tools",
  "Cook's Utensils","Glassblower's Tools","Jeweler's Tools",
  "Leatherworker's Tools","Mason's Tools","Painter's Supplies",
  "Potter's Tools","Smith's Tools","Tinker's Tools","Weaver's Tools",
  "Woodcarver's Tools",
];

export const MUSICAL_INSTRUMENTS = [
  "Bagpipes","Drum","Dulcimer","Flute","Horn","Lute","Lyre",
  "Pan Flute","Shawm","Viol",
];

// ─── Skilled — Skills + Tools (mixed picker) ─────────────────────────────────
export const ALL_SKILLS = [
  "Acrobatics","Animal Handling","Arcana","Athletics","Deception","History",
  "Insight","Intimidation","Investigation","Medicine","Nature","Perception",
  "Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival",
];

export const SKILLED_OPTIONS = [
  ...ALL_SKILLS.map(s => ({ id: `skill_${s}`, label: s, type: "skill" })),
  ...ARTISAN_TOOLS.map(t => ({ id: `tool_${t}`, label: t, type: "tool" })),
  ...MUSICAL_INSTRUMENTS.map(i => ({ id: `instrument_${i}`, label: i, type: "instrument" })),
  { id: "tool_thieves", label: "Thieves' Tools", type: "tool" },
  { id: "tool_navigator", label: "Navigator's Tools", type: "tool" },
  { id: "tool_herbalism", label: "Herbalism Kit", type: "tool" },
  { id: "tool_disguise", label: "Disguise Kit", type: "tool" },
  { id: "tool_forgery", label: "Forgery Kit", type: "tool" },
  { id: "tool_poisoner", label: "Poisoner's Kit", type: "tool" },
];

// ─── Tavern Brawler — Stat Choice ────────────────────────────────────────────
export const TAVERN_BRAWLER_STATS = ["STR", "CON"];

// ─── Helper: detect if feat needs a picker ───────────────────────────────────
const COMPLEX_FEAT_IDS = ["magic_initiate","crafter","skilled","musician","lucky","tavern_brawler"];
export function isComplexOriginFeat(featName) {
  if (!featName) return false;
  const id = featName.toLowerCase().split("(")[0].trim().replace(/[\s']/g,"_").replace(/[^a-z_]/g,"");
  return COMPLEX_FEAT_IDS.includes(id);
}

export function getFeatIdFromName(featName) {
  if (!featName) return null;
  return featName.toLowerCase().split("(")[0].trim().replace(/[\s']/g,"_").replace(/[^a-z_]/g,"");
}

// ─── Helper: compute PB from level ──────────────────────────────────────────
export function getLuckPointsMax(level) {
  if (!level) return 2;
  if (level < 5) return 2;
  if (level < 9) return 3;
  if (level < 13) return 4;
  if (level < 17) return 5;
  return 6;
}
