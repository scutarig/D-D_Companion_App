import { newChar } from "../../../utils/helpers.js";
import { getClassHd } from "../../../utils/multiclass.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { SRD_ITEMS } from "../../../data/items.js";
import { applyBackground, applyBackgroundAsi } from "../../../utils/backgrounds.js";
import { applyRaceTraits } from "../../../utils/races.js";
import { toEnSkill } from "../data/skillTranslation.js";

const SAVE_CODES = new Set(["STR", "DEX", "CON", "INT", "WIS", "CHA"]);

/**
 * Class starting-equipment strings mix English (Chain Mail, Greatsword) and
 * German (Speer, Bettrolle), while SRD_ITEMS is DE-only. This lookup maps a
 * normalized (lowercased, punctuation-stripped) raw entry to a canonical
 * SRD_ITEMS name, so we can inherit type / rarity / weight / notes rather
 * than dropping a bare `{name, qty}` into the inventory.
 *
 * Additions here need only cover names that actually appear in
 * data/classes.js and data/backgrounds.js — the fallback path generates a
 * generic Common Gear item for unknowns, so unrecognised names still land in
 * the bag, they just miss metadata.
 */
const NAME_MAP = new Map([
  // ── Armor ──
  ["chain mail",       "Kettenpanzer"],
  ["studded leather",  "Verstärktes Leder"],
  ["leather armor",    "Lederpanzer"],
  ["leather",          "Lederpanzer"],
  ["scale mail",       "Schuppenpanzer"],
  ["half plate",       "Halbplatte"],
  ["splint",           "Schienenpanzer"],
  ["ring mail",        "Ringpanzer"],
  ["padded",           "Gepolsterter Harnisch"],
  ["hide",             "Tierhaut"],
  ["breastplate",      "Brustplatte"],
  ["plate",            "Plattenpanzer"],
  ["shield",           "Schild"],
  // ── Melee weapons ──
  ["longsword",        "Langschwert"],
  ["shortsword",       "Kurzschwert"],
  ["dagger",           "Dolch"],
  ["daggers",          "Dolch"],
  ["greataxe",         "Großaxt"],
  ["greatsword",       "Großschwert"],
  ["handaxe",          "Handaxt"],
  ["handaxes",         "Handaxt"],
  ["flail",            "Flegel"],
  ["javelin",          "Wurfspeer"],
  ["javelins",         "Wurfspeer"],
  ["rapier",           "Rapier"],
  ["scimitar",         "Scimitar"],
  ["mace",             "Streitkolben"],
  ["warhammer",        "Kriegshammer"],
  ["quarterstaff",     "Viertelstab"],
  ["spear",            "Speer"],
  ["club",             "Keule"],
  ["sickle",           "Sichel"],
  ["light hammer",     "Leichter Hammer"],
  ["battleaxe",        "Streitaxt"],
  ["trident",          "Dreizack"],
  ["whip",             "Peitsche"],
  ["net",              "Netz"],
  ["halberd",          "Hellebarde"],
  ["lance",            "Lanze"],
  ["glaive",           "Glefe"],
  ["pike",             "Pike"],
  ["war pick",         "Kriegspick"],
  ["morningstar",      "Morgenstern"],
  // ── Ranged weapons ──
  ["longbow",          "Langbogen"],
  ["shortbow",         "Kurzbogen"],
  ["light crossbow",   "Leichte Armbrust"],
  ["heavy crossbow",   "Schwere Armbrust"],
  ["blowgun",          "Blasrohr"],
  ["sling",            "Schleuder"],
  ["dart",             "Wurfpfeil"],
  // ── Ammo (bundle items — qty stays 1 regardless of "20 Arrows") ──
  ["arrow",            "Pfeile (20)"],
  ["arrows",           "Pfeile (20)"],
  ["pfeile",           "Pfeile (20)"],
  ["crossbow bolt",    "Armbrustbolzen (20)"],
  ["crossbow bolts",   "Armbrustbolzen (20)"],
  ["bolts",            "Armbrustbolzen (20)"],
  ["bolzen",           "Armbrustbolzen (20)"],
  ["blowgun needle",   "Blasrohr-Nadeln (50)"],
  ["blowgun needles",  "Blasrohr-Nadeln (50)"],
  // ── Tools ──
  ["thieves' tools",   "Diebeswerkzeug"],
  ["thieves tools",    "Diebeswerkzeug"],
  ["herbalism kit",    "Kräuterkundeset"],
  ["healer's kit",     "Heilertasche"],
  ["healers kit",      "Heilertasche"],
  ["navigator's tools","Navigationswerkzeug"],
  ["navigators tools", "Navigationswerkzeug"],
  ["smith's tools",    "Schmiedewerkzeug"],
  ["disguise kit",     "Verkleidungsset"],
  ["poisoner's kit",   "Vergiftungsset"],
  // ── Adventuring gear ──
  ["backpack",         "Rucksack"],
  ["rucksack",         "Rucksack"],
  ["crowbar",          "Brecheisen"],
  ["brechstange",      "Brecheisen"],
  ["torch",            "Fackeln (10)"],
  ["torches",          "Fackeln (10)"],
  ["fackel",           "Fackeln (10)"],
  ["fackeln",          "Fackeln (10)"],
  ["tinderbox",        "Tinderbox"],
  ["ration",           "Feldration (1 Tag)"],
  ["rations",          "Feldration (1 Tag)"],
  ["day's rations",    "Feldration (1 Tag)"],
  ["days rations",     "Feldration (1 Tag)"],
  ["feldration",       "Feldration (1 Tag)"],
  ["waterskin",        "Wasser-/Weinflasche"],
  ["wasserschlauch",   "Wasser-/Weinflasche"],
  ["rope",             "Seil (50ft)"],
  ["seil",             "Seil (50ft)"],
  ["hooded lantern",   "Kapuzenlaterne"],
  ["oil",              "Öl (Flask)"],
  ["oil flask",        "Öl (Flask)"],
  ["öl",               "Öl (Flask)"],
  ["öl (flask)",       "Öl (Flask)"],
  ["grappling hook",   "Enterhaken"],
  ["alchemist's fire", "Alchemisten-Feuer"],
  ["climbing kit",     "Kletterausrüstung"],
  ["kletterausrüstung","Kletterausrüstung"],
  ["tent",             "Zelt (2 Personen)"],
  ["zelt",             "Zelt (2 Personen)"],
  ["flint & steel",    "Feuerstein & Stahl"],
  ["feuerstein & stahl","Feuerstein & Stahl"],
  ["spyglass",         "Fernrohr"],
  ["fernrohr",         "Fernrohr"],
  ["steel mirror",     "Stahlspiegel"],
  ["stahlspiegel",     "Stahlspiegel"],
  ["manacles",         "Handschellen"],
  ["handschellen",     "Handschellen"],
  ["arcane focus",     "Arkaner Fokus"],
  ["arkaner fokus",    "Arkaner Fokus"],
]);

/**
 * PHB 2024 pack contents. Instead of dropping "Explorer's Pack" as a single
 * mystery-blob item, we expand each pack into its RAW contents. Each entry
 * is [nameForLookup, quantity]. Names route through NAME_MAP just like any
 * other equipment string, so pack members inherit SRD metadata where
 * available and fall back to Common Gear otherwise.
 *
 * Content lists follow PHB 2024 pack definitions verbatim. Note that
 * bundle-items like "Torches" resolve to "Fackeln (10)" (already 10 in one
 * entry), so "10 Torches" in a pack becomes qty=1 of the bundle — see the
 * bundle-detection in resolveItem below.
 */
const PACK_CONTENTS = {
  "Explorer's Pack": [
    ["Backpack", 1], ["Bedroll", 1], ["Rations", 2], ["Rope", 1],
    ["Tinderbox", 1], ["Torches", 10], ["Waterskin", 1],
  ],
  "Dungeoneer's Pack": [
    ["Backpack", 1], ["Crowbar", 1], ["Hammer", 1], ["Pitons", 10],
    ["Torches", 10], ["Tinderbox", 1], ["Rations", 10], ["Waterskin", 1],
    ["Rope", 1],
  ],
  "Priest's Pack": [
    ["Backpack", 1], ["Blanket", 1], ["Candles", 10], ["Tinderbox", 1],
    ["Alms Box", 1], ["Incense Blocks", 2], ["Censer", 1], ["Vestments", 1],
    ["Rations", 2], ["Waterskin", 1],
  ],
  "Burglar's Pack": [
    ["Backpack", 1], ["Ball Bearings", 1000], ["Bell", 1], ["Candles", 5],
    ["Crowbar", 1], ["Hammer", 1], ["Pitons", 10], ["Hooded Lantern", 1],
    ["Oil", 2], ["Rations", 5], ["Tinderbox", 1], ["Waterskin", 1],
    ["Rope", 1],
  ],
  "Entertainer's Pack": [
    ["Backpack", 1], ["Bedroll", 1], ["Costume", 2], ["Candles", 5],
    ["Rations", 5], ["Waterskin", 1], ["Disguise Kit", 1],
  ],
  "Scholar's Pack": [
    ["Backpack", 1], ["Book of Lore", 1], ["Ink", 1], ["Ink Pen", 1],
    ["Parchment", 10], ["Small Bag of Sand", 1], ["Small Knife", 1],
  ],
  "Diplomat's Pack": [
    ["Chest", 1], ["Map Case", 2], ["Fine Clothes", 1], ["Ink", 1],
    ["Ink Pen", 1], ["Lamp", 1], ["Oil", 2], ["Parchment", 5],
    ["Perfume", 1], ["Sealing Wax", 1], ["Soap", 1],
  ],
};

/** Collision-free uid consistent with CharInventory.addCustom (line ~181). */
function makeUid() {
  return Date.now() + Math.random();
}

/** Bundle items encode their count in a bare parenthesised number
 *  ("Pfeile (20)", "Blasrohr-Nadeln (50)"). We only match a fully-numeric
 *  parenthesis so descriptive names like "Feldration (1 Tag)" or
 *  "Seil (50ft)" are NOT treated as bundles — those still take the caller's
 *  qty (e.g. Explorer's Pack ships 2 Rations = qty 2, not qty 1). */
function isBundleItem(srdItem) {
  return !!srdItem && /\(\d+\)/.test(srdItem.name);
}

/**
 * Resolve a raw equipment entry (name + qty) into a fully-populated
 * inventory item. Path:
 *   1. Look up the normalised name in NAME_MAP → canonical SRD name.
 *   2. Fall back to a direct case-insensitive match on SRD_ITEMS.
 *   3. Fall back to a generic Common Gear entry so the player still sees
 *      the item, just without pre-filled stats.
 */
function resolveItem(rawName, qty) {
  const trimmed = String(rawName).trim();
  const key = trimmed
    .toLowerCase()
    .replace(/[.,]$/, "")           // drop trailing punctuation
    .replace(/\s*\(.*?\)\s*/g, "")  // drop parentheticals like "(gewählt)"
    .trim();
  const canonName = NAME_MAP.get(key);

  let srdItem = canonName ? SRD_ITEMS.find((i) => i.name === canonName) : null;
  if (!srdItem) {
    srdItem = SRD_ITEMS.find((i) => i.name.toLowerCase() === trimmed.toLowerCase());
  }

  if (srdItem) {
    // Strip the SRD `id` — inventory items are uid-keyed. Keep display fields.
    const { id, ...rest } = srdItem;
    return { ...rest, uid: makeUid(), qty: isBundleItem(srdItem) ? 1 : qty };
  }
  // Fallback for names we don't recognise (chosen tools, "Robe", "Kostüm"…).
  return {
    uid: makeUid(),
    name: trimmed,
    qty,
    type: "Item", sub: "Gear", rar: "Common",
    dmg: "", ac: "", eff: "", wt: "—", notes: "",
  };
}

/**
 * Parse a starting-equipment description (string or array) into individual
 * inventory items and an aggregated gold amount. Recognises:
 *   - "N GP" entries → adds N to gold (case-insensitive).
 *   - Known packs (Explorer's Pack, Dungeoneer's Pack, …) → expanded into
 *     their PHB 2024 contents, each resolved through resolveItem so the
 *     items land in the bag with proper metadata instead of a "pack blob".
 *   - "N <item>" entries → resolveItem with qty=N (bundle items keep qty=1).
 *   - Any other entry → resolveItem with qty=1.
 * The "·" character (or comma) separates entries when input is a string.
 */
function unpackEquipment(raw) {
  if (!raw) return { items: [], gold: 0 };
  const arr = Array.isArray(raw)
    ? raw
    : String(raw).split(/[·,]/).map((s) => s.trim()).filter(Boolean);
  const items = [];
  let gold = 0;
  for (const entry of arr) {
    const gpMatch = entry.match(/^(\d+)\s*GP$/i);
    if (gpMatch) {
      gold += parseInt(gpMatch[1], 10);
      continue;
    }

    // Pack expansion — match on canonical pack name (case-insensitive) so a
    // leading number like "1 Explorer's Pack" still resolves. The lookup key
    // trims a leading count.
    const packKey = Object.keys(PACK_CONTENTS).find((k) =>
      entry.toLowerCase().replace(/^\d+\s+/, "") === k.toLowerCase()
    );
    if (packKey) {
      for (const [subName, subQty] of PACK_CONTENTS[packKey]) {
        items.push(resolveItem(subName, subQty));
      }
      continue;
    }

    const qtyMatch = entry.match(/^(\d+)\s+(.+)$/);
    if (qtyMatch) {
      items.push(resolveItem(qtyMatch[2], parseInt(qtyMatch[1], 10)));
    } else {
      items.push(resolveItem(entry, 1));
    }
  }
  return { items, gold };
}

/**
 * Pure builder: wizard-state → fully-populated char object.
 * Caller must persist spell IDs separately to `spells_known_<id>` and
 * `spells_prep_<id>` using the returned char.id.
 */
export function buildCharFromWizard(state) {
  const id = Date.now();
  let char = newChar(id);

  // ── Phase 1 — Class ─────────────────────────────────────────────────────
  char.klass = state.klass;
  char.hd = getClassHd(state.klass);
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);

  // Saves from class (e.g. "STR & CON" → { STR: true, CON: true })
  char.saves = {};
  (cls?.saves || "").split("&").map((s) => s.trim()).forEach((s) => {
    if (SAVE_CODES.has(s)) char.saves[s] = true;
  });

  // Class skills
  char.skills = {};
  (state.classSkillsChosen || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

  // Class choices stored on the char object for later inspection
  char.classChoices = state.classChoices || {};

  // Class equipment — unpacked into individual items + gold.
  const classEq = cls?.startingEquipment?.[state.classEquipmentChoice];
  if (classEq) {
    const { items, gold } = unpackEquipment(classEq);
    char.inventory = [...(char.inventory || []), ...items];
    char.gold = (char.gold || 0) + gold;
  }

  // ── Phase 2 — Origin (Background + Species) ────────────────────────────
  // Apply background via the canonical utility so bgTraits get populated with
  // skill / tool / Origin-Feat entries (TraitsFeatures reads char.bgTraits).
  char = applyBackground(char, state.background);

  // applyBackground may not add skill_<name> map entries — wire those too so
  // they show up in the skill list with their proficiency markers. The
  // background data uses German skill names; the canonical char.skills keys
  // are English (matching constants/theme.js SKILLS), so translate.
  const bg = BACKGROUNDS_FULL.find((b) => b.name === state.background);
  (bg?.skillProfs || []).forEach((sk) => {
    char.skills[`skill_${toEnSkill(sk)}`] = true;
  });

  // Background tool proficiency — preserved verbatim (some backgrounds list a
  // generic "1 Artisan's Tools deiner Wahl" choice that the user resolves
  // later in the inventory tab).
  if (bg?.toolProf) {
    char.toolProfs = [...(char.toolProfs || []), bg.toolProf];
  }

  // Background equipment — also unpacked. Pack B is a flat "50 GP".
  if (state.bgEquipmentChoice === "A" && bg?.equipmentA) {
    const { items, gold } = unpackEquipment(bg.equipmentA);
    char.inventory = [...(char.inventory || []), ...items];
    char.gold = (char.gold || 0) + gold;
  } else if (state.bgEquipmentChoice === "B") {
    const { gold } = unpackEquipment(bg?.equipmentB || "50 GP");
    char.gold = (char.gold || 0) + (gold || 50);
  }

  // Species (race) — applyRaceTraits handles raceTraits, languages, etc.
  char = applyRaceTraits(char, state.race);

  // Add the user-picked background language (if any) on top.
  if (state.bgChoices?.language && !char.languages.includes(state.bgChoices.language)) {
    char.languages = [...(char.languages || []), state.bgChoices.language];
  }
  // Ensure Common is present (some race data uses "Gemeinsprache" but a few
  // legacy chars might lack it).
  if (!char.languages?.includes("Gemeinsprache")) {
    char.languages = ["Gemeinsprache", ...(char.languages || [])];
  }

  // ── Phase 3 — Stats: point-buy first, then apply background ASI delta ──
  const ab = state.abilityScores || {};
  char.str = ab.str || 8;
  char.dex = ab.dex || 8;
  char.con = ab.con || 8;
  char.int = ab.int || 8;
  char.wis = ab.wis || 8;
  char.cha = ab.cha || 8;

  // Convert UPPERCASE wizard picks to lowercase for applyBackgroundAsi.
  const asiUC = state.bgAsiPicks || {};
  const asiLC = {
    str: asiUC.STR || 0, dex: asiUC.DEX || 0, con: asiUC.CON || 0,
    int: asiUC.INT || 0, wis: asiUC.WIS || 0, cha: asiUC.CHA || 0,
  };
  char = applyBackgroundAsi(char, asiLC);

  // HP at Lv1: HD-max + CON-mod (PHB 2024 RAW)
  const hdMatch = (char.hd || "d10").match(/\d+/);
  const hdSize = hdMatch ? parseInt(hdMatch[0]) : 10;
  const conMod = Math.floor((char.con - 10) / 2);
  char.maxHp = hdSize + conMod;
  char.hp = char.maxHp;

  // ── Phase 4 — Alignment ────────────────────────────────────────────────
  char.alignment = state.alignment;

  // ── Phase 5 — Details ──────────────────────────────────────────────────
  char.name = state.name;
  char.age = state.age;
  char.sex = state.sex;
  char.height = state.height;
  char.weight = state.weight;
  char.deity = state.deity;
  char.traits = state.traits;
  char.ideals = state.ideals;
  char.bonds = state.bonds;
  char.flaws = state.flaws;
  char.backstory = state.backstory;

  // ── Phase 6 — Level-up loop ────────────────────────────────────────────
  char.level = 1;
  if (state.targetLevel > 1) {
    const hpAvg = Math.floor(hdSize / 2) + 1;
    for (let lv = 2; lv <= state.targetLevel; lv++) {
      const loopChoice = state.levelupChoices[lv] || {};
      char.level = lv;
      // HP gain — 3 modes selectable in the wizard, default "avg":
      //   avg    → HD-average + CON-mod (PHB 2024 standard)
      //   roll   → use the rolled value persisted in loopChoice.hpRoll
      //   manual → use the value the user typed in loopChoice.hpManual
      let hpGain;
      if (loopChoice.hpMode === "roll" && typeof loopChoice.hpRoll === "number") {
        hpGain = loopChoice.hpRoll + conMod;
      } else if (loopChoice.hpMode === "manual" && typeof loopChoice.hpManual === "number") {
        hpGain = loopChoice.hpManual + conMod;
      } else {
        hpGain = hpAvg + conMod;
      }
      // Floor at 1 — a level-up never reduces HP regardless of CON-mod sign.
      char.maxHp += Math.max(1, hpGain);
      // Subclass at Lv3
      if (lv === 3 && loopChoice.subclass) {
        char.subclasses = { ...(char.subclasses || {}), [state.klass]: loopChoice.subclass };
      }
      // ASI/Feat — PHB 2024: +2 to one ability OR +1 to two abilities OR a Feat.
      // ability_2 mode picks: { STR: 2 }
      // ability_1_1 mode picks: { STR: 1, DEX: 1 }
      // feat mode: free-text feat name.
      if ((loopChoice.asi?.mode === "ability_2" || loopChoice.asi?.mode === "ability_1_1") && loopChoice.asi.picks) {
        Object.entries(loopChoice.asi.picks).forEach(([abKey, bonus]) => {
          const k = abKey.toLowerCase();
          if (typeof char[k] === "number") char[k] += bonus;
        });
      } else if (loopChoice.asi?.mode === "feat" && loopChoice.asi.feat) {
        char.feats = [...(char.feats || []), loopChoice.asi.feat];
      }
    }
    char.hp = char.maxHp;
  }

  return char;
}

/** Returns { knownSpellIds, preparedSpellIds } for persistence. */
export function spellIdsFromWizard(state) {
  return {
    knownSpellIds: [...(state.cantripsChosen || []), ...(state.lv1SpellsChosen || [])],
    preparedSpellIds: [...(state.lv1SpellsChosen || [])],
  };
}
