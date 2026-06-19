import { t } from "../i18n/index.js";

export const modOf = s => Math.floor((s - 10) / 2);
export const modStr = s => { const m = modOf(s); return m >= 0 ? `+${m}` : `${m}`; };
export const rollD = n => Math.floor(Math.random() * n) + 1;
export const getPB = l => l < 5 ? 2 : l < 9 ? 3 : l < 13 ? 4 : l < 17 ? 5 : 6;

// Re-export the canonical class-HD lookup so callers can keep importing
// from helpers.js (the multiclass module is the source of truth — it reads
// from D3_KLASSEN so it stays in sync with the class data).
export { getClassHd } from "./multiclass.js";

// ── Zauberplatz-Tabellen ──────────────────────────────────────────────────────
export const SLOT_LABELS = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];

export const FULL_CASTER  = [0,[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
export const HALF_CASTER  = [0,null,[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],[4,3,3],[4,3,3],[4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]];
export const THIRD_CASTER = [0,[2],[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],[4,3,3],[4,3,3],[4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]];
export const PACT_MAGIC   = [0,[1,1],[2,1],[2,2],[2,2],[2,3],[2,3],[2,4],[2,4],[2,5],[2,5],[3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5]];

export const CASTER_TYPE = {
  Barde:"full", Kleriker:"full", Druide:"full", Magier:"full", Zauberer:"full",
  Paladin:"half", Waldläufer:"half",
  Hexenmeister:"pact",
  Magieschmied:"third",
};

// Gibt Array von {lv, lbl, tot, pact} zurück — oder null für Nicht-Zauberer
export function buildSlotsForLevel(klass, level) {
  const cType = CASTER_TYPE[klass];
  if (!cType) return null;
  if (cType === "pact") {
    const pm = PACT_MAGIC[level];
    if (!pm) return [];
    const [count, grade] = pm;
    return [{ lv: grade, lbl: SLOT_LABELS[grade - 1], tot: count, pact: true }];
  }
  const table = cType === "full" ? FULL_CASTER : cType === "half" ? HALF_CASTER : THIRD_CASTER;
  const row = table[level];
  if (!row) return [];
  return row.map((count, i) => count ? { lv: i + 1, lbl: SLOT_LABELS[i], tot: count, pact: false } : null).filter(Boolean);
}

export const newChar = id => ({
  id,
  name: t("char.default_name", "Neuer Held"),
  race: t("char.default_race", "Mensch"),
  klass: t("char.default_class", "Kämpfer"),
  level:1,
  background: t("char.default_background", "Soldat"),
  str:10, dex:10, con:10, int:10, wis:10, cha:10,
  hp:10, maxHp:10, tempHp:0, ac:10, speed:30, initiative:0,
  hd:"d10", hd_used:0, deathSaves:{suc:0,fail:0},
  saves:{STR:false,DEX:false,CON:false,INT:false,WIS:false,CHA:false},
  // spellDC/spellAtk werden live aus PB + Mod berechnet (Bogen.jsx, CombatInitiativeView)
  skills:{}, spellAbility:"INT", inspiration:false,
  traits:"", ideals:"", bonds:"", flaws:"", equipment:"", features:"", backstory:"",
  inventory:[], actions:[], gold:0, silver:0, copper:0, electrum:0, platinum:0,
  // Auto-applied trait groups
  raceTraits:[], bgTraits:[], classFeatures:[], subclassFeatures:[], feats:[],
  // Tool proficiencies (from Background + class — wizard sets this, Aufbau can edit)
  toolProfs:[],
  // Languages (merged from race + background + manual)
  languages:[],
  // Subclass selections per class: { "Barbar": "pfad_berserker", ... }
  subclasses:{},
  // Active conditions (IDs from utils/conditions.js)
  activeConditions:[],
  // Attuned magic item UIDs (max 3)
  attunedItems:[],
  // Tracks which item UIDs had attunement toggled since last rest
  attunementChangedSinceRest:[],
  // Exhaustion level 0-6 (PHB)
  exhaustion: 0,
  // Active concentration spell — null or { spellId, spellName, school, lv, slotLv, dur, startedAt }
  concentration: null,
  // PHB 2024 character-details (formerly missing — wizard relies on these)
  alignment: "",        // "" | "LG"|"NG"|"CG"|"LN"|"N"|"CN"|"LE"|"NE"|"CE"
  age: "",              // free-text (e.g. "127")
  sex: "",              // free-text
  height: "",           // free-text (e.g. "5'8\"" or "175 cm")
  weight: "",           // free-text
  deity: "",            // free-text
});

// Rest logic lives in restHelpers.js (single source of truth).
// applyShortRest / applyLongRest / grantsHeroicInspirationOnLR moved
// there so multi-class resources reset correctly via one call.
