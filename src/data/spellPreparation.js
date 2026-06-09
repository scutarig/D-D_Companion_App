// ─────────────────────────────────────────────────────────────────────────────
// spellPreparation.js — 2024 PHB Spell-Preparation Limits
//
// 2024 REFORM: ALLE Caster nutzen jetzt "Prepared Spells" (Sorcerer/Warlock/
// Bard waren vorher "Known"). Nach Long Rest neu verteilen.
// Cantrips zählen separat, sind nicht "prepared" sondern fest gewählt.
//
// Formeln (PHB 2024 Klassentabellen):
// - Bard:      Tabelle (4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,19,20,21,21,22)
// - Cleric:    WIS-Mod + Cleric-Lv (min 1)
// - Druid:     WIS-Mod + Druid-Lv (min 1)
// - Paladin:   CHA-Mod + ceil(Paladin-Lv / 2) (min 1) — kein Spell auf Lv1
// - Ranger:    WIS-Mod + ceil(Ranger-Lv / 2) (min 1) — kein Spell auf Lv1
// - Sorcerer:  Tabelle (2,4,6,7,9,10,11,12,14,15,16,16,17,18,19,19,20,21,21,22)
// - Warlock:   Tabelle (2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15)
// - Wizard:    INT-Mod + Wizard-Lv (min 1)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Class → spellcasting ability key (lowercase char-stat)
 * Returns null for non-casters.
 */
export const CASTER_ABILITY = {
  Barde:        "cha",
  Hexenmeister: "cha",
  Kleriker:     "wis",
  Druide:       "wis",
  Waldläufer:   "wis",
  Magier:       "int",
  Paladin:      "cha",
  Zauberer:     "cha",
  Magieschmied: "int",
  // Non-casters: Barbar, Kämpfer, Mönch, Schurke — Eldritch Knight/Arcane Trickster handled separately
};

/** Bard Spells Prepared table (Lv1-Lv20) */
const BARD_PREP_TABLE = [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,19,20,21,21,22];
/** Sorcerer Spells Prepared table (Lv1-Lv20) */
const SORC_PREP_TABLE = [2,4,6,7,9,10,11,12,14,15,16,16,17,18,19,19,20,21,21,22];
/** Warlock Spells Prepared table (Lv1-Lv20) — Mystic Arcanum separate */
const WARLOCK_PREP_TABLE = [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];

/** Get attribute-modifier from char (raw integer 1-30) */
function mod(stat) {
  return Math.floor(((stat || 10) - 10) / 2);
}

/**
 * Calculate spell prepared limit for a single class.
 *
 * @param {string} klass — class name (German)
 * @param {number} level — class level (1-20)
 * @param {object} char — full char with str/dex/con/int/wis/cha
 * @returns {{limit:number, formula:string, ability:string|null} | null}
 *          null if class is not a caster
 */
export function getSpellPreparedLimit(klass, level, char) {
  const lv = Math.max(1, Math.min(20, level || 1));
  switch (klass) {
    case "Barde":
      return { limit: BARD_PREP_TABLE[lv - 1], formula: `PHB-Tabelle Lv${lv}`, ability: "cha" };
    case "Hexenmeister":
      return { limit: WARLOCK_PREP_TABLE[lv - 1], formula: `PHB-Tabelle Lv${lv}`, ability: "cha" };
    case "Zauberer":
      return { limit: SORC_PREP_TABLE[lv - 1], formula: `PHB-Tabelle Lv${lv}`, ability: "cha" };
    case "Kleriker": {
      const m = mod(char.wis);
      return { limit: Math.max(1, m + lv), formula: `WIS-Mod (+${m}) + Lv${lv}`, ability: "wis" };
    }
    case "Druide": {
      const m = mod(char.wis);
      return { limit: Math.max(1, m + lv), formula: `WIS-Mod (+${m}) + Lv${lv}`, ability: "wis" };
    }
    case "Magier": {
      const m = mod(char.int);
      return { limit: Math.max(1, m + lv), formula: `INT-Mod (+${m}) + Lv${lv}`, ability: "int" };
    }
    case "Paladin": {
      if (lv < 2) return null;       // Paladin gets spells from Lv2
      const m = mod(char.cha);
      const halfLv = Math.ceil(lv / 2);
      return { limit: Math.max(1, m + halfLv), formula: `CHA-Mod (+${m}) + ⌈Lv${lv}/2⌉ (${halfLv})`, ability: "cha" };
    }
    case "Waldläufer": {
      if (lv < 2) return null;       // Ranger gets spells from Lv2
      const m = mod(char.wis);
      const halfLv = Math.ceil(lv / 2);
      return { limit: Math.max(1, m + halfLv), formula: `WIS-Mod (+${m}) + ⌈Lv${lv}/2⌉ (${halfLv})`, ability: "wis" };
    }
    case "Magieschmied": {
      // Artificer (2014 Legacy): INT-Mod + Artificer-Lv/2
      const m = mod(char.int);
      const halfLv = Math.ceil(lv / 2);
      return { limit: Math.max(1, m + halfLv), formula: `INT-Mod (+${m}) + ⌈Lv${lv}/2⌉ (${halfLv}) — Legacy`, ability: "int" };
    }
    default:
      return null;
  }
}

/**
 * For a multi-class char, calculate per-class prepared limits.
 * Returns array of { klassName, level, limit, formula, ability } for each caster class.
 *
 * @param {Array<{name,level}>} classes — from useMulticlass
 * @param {object} char — full char object
 */
export function getAllSpellPreparedLimits(classes, char) {
  if (!Array.isArray(classes)) return [];
  return classes
    .map(c => {
      const data = getSpellPreparedLimit(c.name, c.level, char);
      if (!data) return null;
      return { klassName: c.name, level: c.level, ...data };
    })
    .filter(Boolean);
}
