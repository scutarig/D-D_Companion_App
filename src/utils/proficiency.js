/**
 * proficiency.js — Proficiency Bonus utilities & category config
 */

import { D3_KLASSEN } from "../data/classes.js";

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

/**
 * Derive read-only proficiencies from a character's class + background +
 * race data. These are what the character *already* has by virtue of their
 * origin — weapons/armor from class, tool from background, languages from
 * race + background pick. Marked `locked: true` so the UI can hide the
 * edit / delete controls; they can't be removed without changing the
 * underlying char fields on the Character tab.
 */
export function deriveProficiencies(char) {
  if (!char) return [];
  const out = [];
  const cls = D3_KLASSEN.find(c => c.name === char.klass || c.enName === char.klass);

  const pushMany = (raw, category, srcLabel) => {
    if (!raw || raw === "—") return;
    const parts = Array.isArray(raw) ? raw : String(raw).split(",");
    parts.map(s => String(s).trim()).filter(Boolean).forEach(name => {
      out.push({
        id: `_${category}_${name}`,
        name,
        category,
        type: "normal",
        notes: srcLabel,
        locked: true,
      });
    });
  };

  pushMany(cls?.weapons, "weapon", "Klasse");
  pushMany(cls?.armor,   "armor",  "Klasse");
  pushMany(char.toolProfs, "tool", "Background");
  pushMany(char.languages, "language", "Rasse/Background");

  return out;
}
