import { CASTER_TYPE, FULL_CASTER, PACT_MAGIC, getPB } from "./helpers.js";
import { D3_KLASSEN } from "../data/classes.js";

// ── Multiclass Attribute-Requirements (PHB) ───────────────────────────────────
const REQUIREMENTS = {
  "Barbar":       [{ stat: "str", min: 13 }],
  "Barde":        [{ stat: "cha", min: 13 }],
  "Kleriker":     [{ stat: "wis", min: 13 }],
  "Druide":       [{ stat: "wis", min: 13 }],
  "Kämpfer":      [{ stat: "str", min: 13 }, { stat: "dex", min: 13 }], // OR
  "Mönch":        [{ stat: "dex", min: 13 }, { stat: "wis", min: 13 }],
  "Paladin":      [{ stat: "str", min: 13 }, { stat: "cha", min: 13 }],
  "Waldläufer":   [{ stat: "dex", min: 13 }, { stat: "wis", min: 13 }],
  "Schurke":      [{ stat: "dex", min: 13 }],
  "Zauberer":     [{ stat: "cha", min: 13 }],
  "Hexenmeister": [{ stat: "cha", min: 13 }],
  "Magier":       [{ stat: "int", min: 13 }],
  "Magieschmied": [{ stat: "int", min: 13 }],
};

// Kämpfer: STR oder DEX ≥ 13 (OR-logic)
const OR_CLASSES = new Set(["Kämpfer"]);

/**
 * canMulticlass(charStats, className)
 * Returns { ok: bool, reason: string | null }
 */
export function canMulticlass(charStats, className) {
  const reqs = REQUIREMENTS[className];
  if (!reqs) return { ok: true, reason: null }; // unknown class → allow

  if (OR_CLASSES.has(className)) {
    const ok = reqs.some(r => (charStats[r.stat] ?? 10) >= r.min);
    if (!ok) {
      const parts = reqs.map(r => `${r.stat.toUpperCase()} ≥ ${r.min}`);
      return {
        ok: false,
        reason: `${parts.join(" oder ")} benötigt (aktuell STR ${charStats.str ?? 10}, DEX ${charStats.dex ?? 10})`,
      };
    }
  } else {
    for (const req of reqs) {
      const val = charStats[req.stat] ?? 10;
      if (val < req.min) {
        return {
          ok: false,
          reason: `${req.stat.toUpperCase()} ≥ ${req.min} benötigt (aktuell: ${val})`,
        };
      }
    }
  }
  return { ok: true, reason: null };
}

/** Sum of all class levels */
export function calculateTotalLevel(classes) {
  if (!classes || classes.length === 0) return 1;
  return classes.reduce((s, c) => s + (c.level || 1), 0);
}

/** Caster level contribution of one class */
function casterContrib(className, classLevel) {
  const type = CASTER_TYPE[className];
  if (!type || type === "pact") return 0;
  if (type === "full")  return classLevel;
  if (type === "half")  return Math.floor(classLevel / 2);
  if (type === "third") return Math.floor(classLevel / 3);
  return 0;
}

/**
 * calculateMulticlassSpellSlots(classes)
 * Uses PHB multiclassing rules: non-pact caster levels summed → FULL_CASTER table.
 * Hexenmeister pact slots tracked separately.
 */
export function calculateMulticlassSpellSlots(classes) {
  if (!classes || classes.length === 0) {
    return { slots: {}, pact: { slots: 0, spellLevel: 0 }, hasCaster: false, hasPact: false };
  }

  let casterLevel = 0;
  let pactSlots = 0;
  let pactSpellLevel = 0;

  for (const klass of classes) {
    if (CASTER_TYPE[klass.name] === "pact") {
      const pm = PACT_MAGIC[klass.level];
      if (pm) { pactSlots = pm[0]; pactSpellLevel = pm[1]; }
    } else {
      casterLevel += casterContrib(klass.name, klass.level);
    }
  }

  casterLevel = Math.min(20, casterLevel);

  const row = FULL_CASTER[casterLevel] || [];
  const slots = {};
  for (let i = 0; i < 9; i++) slots[i + 1] = row[i] || 0;

  return {
    slots,
    pact: { slots: pactSlots, spellLevel: pactSpellLevel },
    hasCaster: casterLevel > 0,
    hasPact: pactSlots > 0,
  };
}

/** HD for a known class, falls back to d8 */
export function getClassHd(className) {
  const cls = D3_KLASSEN.find(c => c.name === className);
  return cls ? cls.hd : "d8";
}

/** Create a fresh class entry */
export function createClassEntry(name, level = 1) {
  return { name, level, hd: getClassHd(name) };
}
