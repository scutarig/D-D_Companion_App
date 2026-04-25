/**
 * proficiency.js — Proficiency Bonus utilities & category config
 */

/** Proficiency Bonus per level (matches getPB in helpers.js) */
export function calculateProficiencyBonus(level) {
  return Math.ceil((level || 1) / 4) + 1;
}

/** Category config */
export const PROF_CATEGORIES = [
  { id: "weapon",   label: "Waffen",     icon: "🗡️",  color: "#ef4444" },
  { id: "armor",    label: "Rüstungen",  icon: "🛡️",  color: "#3b82f6" },
  { id: "tool",     label: "Werkzeuge",  icon: "🔧",  color: "#f59e0b" },
  { id: "language", label: "Sprachen",   icon: "🗣️",  color: "#10b981" },
];

export function categoryOf(id) {
  return PROF_CATEGORIES.find(c => c.id === id) ?? PROF_CATEGORIES[0];
}

/** Type labels */
export const PROF_TYPES = [
  { id: "normal",    label: "Normal",    short: "PROF" },
  { id: "expertise", label: "Expertise", short: "EXP"  },
];

/** Create a new proficiency object */
export function createProficiency({ name = "", category = "weapon", type = "normal", notes = "" } = {}) {
  return {
    id: Date.now() + Math.random(),
    name,
    category,
    type,
    notes,
    createdAt: Date.now(),
  };
}
