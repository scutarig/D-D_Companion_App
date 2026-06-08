/**
 * D&D 5e 2024 PHB Exhaustion — KOMPLETT REFORM!
 *
 * 2014 (alt): 6 Stufen mit unterschiedlichen Effekten pro Stufe (Disadvantage,
 *             Speed halved, Disadvantage Attacks/Saves, HP-Max halved, Speed 0, Tod)
 *
 * 2024 (neu): 6 Stufen mit LINEAR skalierten Effekten:
 *   - Jede Stufe gibt -2 × Exhaustion-Level auf ALLE D20-Tests
 *     (Attack Rolls, Ability Checks, Saving Throws)
 *   - Speed wird um 5ft × Exhaustion-Level reduziert
 *   - Tod bei Stufe 6
 *
 * Long Rest entfernt 1 Stufe (gleich wie 2014).
 */
export const EXHAUSTION_LEVELS = [
  {
    lv: 0,
    name: "Keine Erschöpfung",
    color: "#68d18a",
    icon: "✅",
    d20Penalty: 0,
    speedReduction: 0,
    effects: [],
  },
  {
    lv: 1,
    name: "Stufe 1",
    color: "#c9a84c",
    icon: "😓",
    d20Penalty: -2,
    speedReduction: 5,
    effects: ["−2 auf alle D20-Tests (Angriffe, Saves, Checks)", "−5 ft Speed"],
  },
  {
    lv: 2,
    name: "Stufe 2",
    color: "#ffa460",
    icon: "😰",
    d20Penalty: -4,
    speedReduction: 10,
    effects: ["−4 auf alle D20-Tests", "−10 ft Speed"],
  },
  {
    lv: 3,
    name: "Stufe 3",
    color: "#ff7744",
    icon: "😵",
    d20Penalty: -6,
    speedReduction: 15,
    effects: ["−6 auf alle D20-Tests", "−15 ft Speed"],
  },
  {
    lv: 4,
    name: "Stufe 4",
    color: "#ff4444",
    icon: "🤢",
    d20Penalty: -8,
    speedReduction: 20,
    effects: ["−8 auf alle D20-Tests", "−20 ft Speed"],
  },
  {
    lv: 5,
    name: "Stufe 5",
    color: "#cc1111",
    icon: "🫀",
    d20Penalty: -10,
    speedReduction: 25,
    effects: ["−10 auf alle D20-Tests", "−25 ft Speed"],
  },
  {
    lv: 6,
    name: "Stufe 6 — TOD",
    color: "#880000",
    icon: "💀",
    d20Penalty: -12,
    speedReduction: 30,
    effects: ["TOD"],
  },
];

/** Gibt den Eintrag für eine Exhaustion-Stufe zurück. */
export const getExhaustionLevel = (lv) =>
  EXHAUSTION_LEVELS[Math.max(0, Math.min(6, lv))] || EXHAUSTION_LEVELS[0];

/**
 * 2024 PHB: Exhaustion gibt IMMER Malus auf D20-Tests (ab Stufe 1).
 * Old (2014): nur ab Stufe 3.
 */
export const exhaustionCausesDisadvantage = (lv) => lv >= 1;

/**
 * 2024 PHB: Speed wird LINEAR reduziert (5ft pro Stufe).
 * Old (2014): Halbiert ab Stufe 2.
 *
 * Diese Helper wird beibehalten für Backward-Compat, aber gibt jetzt die
 * Reduktion in ft zurück.
 */
export const exhaustionSpeedReduction = (lv) => getExhaustionLevel(lv).speedReduction;

/** Legacy 2014 Helper — in 2024 NICHT mehr angewendet. */
export const exhaustionHalvesSpeed = (lv) => false;

/** Legacy 2014 Helper — in 2024 KEIN HP-Max-Halving mehr. */
export const exhaustionHalvesMaxHp = (lv) => false;

/** 2024 NEU: Gibt den D20-Test-Malus für ein Exhaustion-Level. */
export const exhaustionD20Penalty = (lv) => getExhaustionLevel(lv).d20Penalty;
