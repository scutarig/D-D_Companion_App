import { newChar } from "../../../utils/helpers.js";
import { getClassHd } from "../../../utils/multiclass.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { RACES_FULL } from "../../../data/races.js";
import { applyBackground, applyBackgroundAsi } from "../../../utils/backgrounds.js";
import { applyRaceTraits } from "../../../utils/races.js";

const SAVE_CODES = new Set(["STR", "DEX", "CON", "INT", "WIS", "CHA"]);

/**
 * Parse a starting-equipment description (string or array) into individual
 * inventory items and an aggregated gold amount. Recognises:
 *   - "N GP" entries → adds N to gold (case-insensitive)
 *   - "N <item>" entries → single inventory entry with qty=N
 *   - any other entry → single inventory entry with qty=1
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
    const qtyMatch = entry.match(/^(\d+)\s+(.+)$/);
    if (qtyMatch) {
      items.push({ name: qtyMatch[2], qty: parseInt(qtyMatch[1], 10) });
    } else {
      items.push({ name: entry, qty: 1 });
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
  // they show up in the skill list with their proficiency markers.
  const bg = BACKGROUNDS_FULL.find((b) => b.name === state.background);
  (bg?.skillProfs || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

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
