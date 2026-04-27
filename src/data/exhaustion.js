/**
 * D&D 5e PHB Exhaustion — 6 Stufen mit kumulativen Effekten.
 * Jede Stufe enthält alle Effekte der vorherigen Stufen.
 */
export const EXHAUSTION_LEVELS = [
  {
    lv: 0,
    name: "Keine Erschöpfung",
    color: "#68d18a",
    icon: "✅",
    effects: [],
  },
  {
    lv: 1,
    name: "Stufe 1",
    color: "#c9a84c",
    icon: "😓",
    effects: ["Nachteil auf Ability Checks"],
  },
  {
    lv: 2,
    name: "Stufe 2",
    color: "#ffa460",
    icon: "😰",
    effects: ["Nachteil auf Ability Checks", "Speed halbiert"],
  },
  {
    lv: 3,
    name: "Stufe 3",
    color: "#ff7744",
    icon: "😵",
    effects: ["Nachteil auf Ability Checks", "Speed halbiert", "Nachteil auf Angriffe & Saving Throws"],
  },
  {
    lv: 4,
    name: "Stufe 4",
    color: "#ff4444",
    icon: "🤢",
    effects: ["Nachteil auf Ability Checks", "Speed halbiert", "Nachteil auf Angriffe & Saving Throws", "Max HP halbiert"],
  },
  {
    lv: 5,
    name: "Stufe 5",
    color: "#cc1111",
    icon: "🫀",
    effects: ["Nachteil auf Ability Checks", "Speed halbiert", "Nachteil auf Angriffe & Saving Throws", "Max HP halbiert", "Speed = 0"],
  },
  {
    lv: 6,
    name: "Stufe 6 — TOD",
    color: "#880000",
    icon: "💀",
    effects: ["TOD"],
  },
];

/** Gibt den Eintrag für eine Exhaustion-Stufe zurück. */
export const getExhaustionLevel = (lv) =>
  EXHAUSTION_LEVELS[Math.max(0, Math.min(6, lv))] || EXHAUSTION_LEVELS[0];

/** True wenn Exhaustion Nachteil auf Angriffe/Saves gibt (Stufe 3+). */
export const exhaustionCausesDisadvantage = (lv) => lv >= 3;

/** True wenn Exhaustion Speed halbiert (Stufe 2+). */
export const exhaustionHalvesSpeed = (lv) => lv >= 2;

/** True wenn Exhaustion Max-HP halbiert (Stufe 4+). */
export const exhaustionHalvesMaxHp = (lv) => lv >= 4;
