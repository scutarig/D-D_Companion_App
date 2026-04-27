/**
 * Class Resources — D&D 5e PHB
 * Each entry: { id, name, className, color, reset, levels: { [level]: max } }
 * reset: "long" | "short" | "dawn"
 *
 * Helper functions at bottom:
 *   getClassResources(className, level) → [{ id, name, max, reset, color }]
 *   computeAllResources(classes)        → merged flat list
 */

export const CLASS_RESOURCES = {

  // ── Barbar ────────────────────────────────────────────────────────────────
  Barbar: [
    {
      id: "rage",
      name: "Wut",
      color: "#ff4d4d",
      reset: "long",
      levels: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6, 20: Infinity },
    },
  ],

  // ── Barde ─────────────────────────────────────────────────────────────────
  Barde: [
    {
      id: "bardic_inspiration",
      name: "Bardische Inspiration",
      color: "#f59e0b",
      reset: "short",     // short rest from lv 5 (Font of Inspiration)
      levels: {
        1: "CHA mod (min 1)",
      },
      formulaKey: "cha", // derived from CHA modifier at runtime
    },
  ],

  // ── Druide ────────────────────────────────────────────────────────────────
  Druide: [
    {
      id: "wild_shape",
      name: "Wildgestalt",
      color: "#4ade80",
      reset: "short",
      levels: { 2: 2 },  // always 2 uses after lv 2
    },
  ],

  // ── Hexenmeister ──────────────────────────────────────────────────────────
  Hexenmeister: [
    {
      id: "warlock_slots",
      name: "Pakt-Magieplätze",
      color: "#a855f7",
      reset: "short",
      levels: { 1: 1, 2: 2, 11: 3, 17: 4 },
    },
    {
      id: "eldritch_invocations",
      name: "Unheimliche Anrufungen",
      color: "#7c3aed",
      reset: "none",       // passive count only
      levels: { 2: 2, 5: 3, 7: 4, 9: 5, 12: 6, 15: 7, 18: 8 },
    },
  ],

  // ── Kämpfer ───────────────────────────────────────────────────────────────
  Kämpfer: [
    {
      id: "action_surge",
      name: "Kraftakt",
      color: "#f97316",
      reset: "short",
      levels: { 1: 1, 17: 2 },
    },
    {
      id: "second_wind",
      name: "Zweiter Wind",
      color: "#fb923c",
      reset: "short",
      levels: { 1: 1 },
    },
    {
      id: "indomitable",
      name: "Unbeugsamkeit",
      color: "#fbbf24",
      reset: "long",
      levels: { 9: 1, 13: 2, 17: 3 },
    },
  ],

  // ── Kleriker ──────────────────────────────────────────────────────────────
  Kleriker: [
    {
      id: "channel_divinity",
      name: "Göttliche Kraft",
      color: "#fde68a",
      reset: "short",
      levels: { 2: 1, 6: 2, 18: 3 },
    },
    {
      id: "divine_intervention",
      name: "Göttliche Intervention",
      color: "#fbbf24",
      reset: "long",
      levels: { 10: 1 },
    },
  ],

  // ── Magier ────────────────────────────────────────────────────────────────
  Magier: [
    {
      id: "arcane_recovery",
      name: "Arkane Wiederherstellung",
      color: "#60a5fa",
      reset: "long",
      levels: { 1: 1 },
    },
  ],

  // ── Mönch ─────────────────────────────────────────────────────────────────
  Mönch: [
    {
      id: "ki_points",
      name: "Ki-Punkte",
      color: "#34d399",
      reset: "short",
      levels: {
        2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
        11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20,
      },
    },
  ],

  // ── Paladin ───────────────────────────────────────────────────────────────
  Paladin: [
    {
      id: "lay_on_hands",
      name: "Handauflegen",
      color: "#f9a8d4",
      reset: "long",
      // 5 × paladin level HP pool — computed at runtime
      formulaKey: "level5x",
      levels: { 1: 5 }, // placeholder; actual = level * 5
    },
    {
      id: "divine_smite_slots",
      name: "Göttlicher Eifer (Zb-Plätze)",
      color: "#fca5a5",
      reset: "long",
      levels: {
        1: 1, 2: 2, 3: 3, 5: 4, 7: 5, 9: 6, 11: 7, 13: 8, 15: 9, 17: 10
      },
    },
    {
      id: "channel_divinity_paladin",
      name: "Göttliche Kraft",
      color: "#fde68a",
      reset: "short",
      levels: { 3: 1 },
    },
  ],

  // ── Schurke ───────────────────────────────────────────────────────────────
  Schurke: [
    {
      id: "cunning_action",
      name: "Schlaue Aktion",
      color: "#6ee7b7",
      reset: "none",   // passive always-on, no resource
      levels: { 2: 0 },
    },
  ],

  // ── Waldläufer ────────────────────────────────────────────────────────────
  Waldläufer: [],  // No non-spell resource pool

  // ── Zauberer ──────────────────────────────────────────────────────────────
  Zauberer: [
    {
      id: "sorcery_points",
      name: "Zauberkraft-Punkte",
      color: "#f0abfc",
      reset: "long",
      levels: {
        2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
        11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20,
      },
    },
  ],

  // ── Magieschmied ──────────────────────────────────────────────────────────
  Magieschmied: [
    {
      id: "infusions",
      name: "Infusionen",
      color: "#9ca3af",
      reset: "long",
      levels: { 2: 2, 6: 3, 10: 4, 14: 5, 18: 6 },
    },
    {
      id: "arcane_jolt",
      name: "Arkaner Schock",
      color: "#6ee7b7",
      reset: "long",
      levels: { 9: "INT mod", },
      formulaKey: "int",
    },
  ],
};

/**
 * Get max value for a resource at a given level.
 * Finds the highest entry in `levels` that is <= charLevel.
 */
function resolveMax(resource, charLevel, char) {
  const lvlMap = resource.levels;
  const keys = Object.keys(lvlMap).map(Number).sort((a, b) => a - b);
  let maxVal = null;
  for (const k of keys) {
    if (k <= charLevel) maxVal = lvlMap[k];
  }
  if (maxVal === null) return null;  // not yet available

  // Handle formula-based resources
  if (typeof maxVal === "string" || resource.formulaKey) {
    if (resource.formulaKey === "cha" && char) {
      const chaMod = Math.floor(((char.cha || 10) - 10) / 2);
      return Math.max(1, chaMod);
    }
    if (resource.formulaKey === "int" && char) {
      const intMod = Math.floor(((char.int || 10) - 10) / 2);
      return Math.max(1, intMod);
    }
    if (resource.formulaKey === "level5x") {
      return charLevel * 5;
    }
    return maxVal;  // return raw string if no handler
  }

  if (maxVal === Infinity) return "∞";
  return maxVal;
}

/**
 * Get all class resources for a single class at a given level.
 * Returns [{ id, name, max, reset, color }]
 */
export function getClassResources(className, level, char) {
  const list = CLASS_RESOURCES[className];
  if (!list) return [];

  return list
    .map(r => {
      const max = resolveMax(r, level, char);
      if (max === null) return null;   // resource not yet unlocked
      if (r.reset === "none") return null;  // passive — don't show as tracker
      return {
        id: `${r.id}_${className}`,
        name: r.name,
        max,
        reset: r.reset,
        color: r.color,
        className,
      };
    })
    .filter(Boolean);
}

/**
 * Compute all class resources for a multiclass character.
 * classes: [{ name, level }]
 * char: full char object (for stat-based formulas)
 */
export function computeAllResources(classes, char) {
  return (classes || []).flatMap(({ name, level }) =>
    getClassResources(name, level, char)
  );
}
