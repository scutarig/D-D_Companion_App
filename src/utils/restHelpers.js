// ─────────────────────────────────────────────────────────────────────────────
// restHelpers.js — D&D 5e 2024 PHB Rest Logic
//
// applyLongRest(char, classes):
//   - HP → maxHp
//   - tempHp → 0 (RAW: temp HP doesn't carry over)
//   - deathSaves reset
//   - HD recovered: max(1, floor(level/2))
//   - Exhaustion -1 (2024 + 2014 RAW)
//   - All class resources reset (long-rest AND short-rest both refresh)
//
// applyShortRest(char, classes, hpGain):
//   - HP healed by hpGain (player spends HD manually)
//   - Short-rest class resources reset (Action Surge, Second Wind,
//     Channel Divinity, Focus Points, Bardic Inspiration (2024 NEU),
//     Warlock Pact Slots, Druid Wild Shape)
//
// rollHitDie(char, classes):
//   - Returns { roll, modifier, healed, hdRemaining }
//   - Spends 1 HD from primary class hit die
//   - Adds CON modifier
// ─────────────────────────────────────────────────────────────────────────────

import { computeAllResources } from "../data/classResources.js";

const ABILITY_MOD = (stat) => Math.floor(((stat || 10) - 10) / 2);

/** Build a map of resource id → max value for the given reset type */
function buildResourceMaxMap(classes, char, resetType) {
  const resources = computeAllResources(classes, char) || [];
  const map = {};
  resources.forEach(r => {
    if (r.reset === resetType || (resetType === "long" && r.reset === "short")) {
      // Long rest refreshes both long AND short rest resources
      map[r.id] = 0; // "used" = 0 means fully available
    }
  });
  return map;
}

/**
 * Apply a Long Rest to a character.
 * Returns the new char object.
 *
 * @param {object} char     — current character
 * @param {Array}  classes  — multi-class entries [{ name, level }]
 * @param {object} usedAuto — current tokens_auto_used_<aid> state
 * @returns {{ char, usedAuto, hdRecovered, exhaustionRemoved }}
 */
export function applyLongRest(char, classes, usedAuto = {}) {
  const regainHD = Math.max(1, Math.floor((char.level || 1) / 2));
  const oldHdUsed = char.hd_used || 0;
  const newHdUsed = Math.max(0, oldHdUsed - regainHD);
  const actualHdRecovered = oldHdUsed - newHdUsed;

  const oldExhaustion = char.exhaustion || 0;
  const newExhaustion = Math.max(0, oldExhaustion - 1);
  const exhaustionRemoved = oldExhaustion - newExhaustion;

  // Reset all long-rest AND short-rest resources
  const resetMap = buildResourceMaxMap(classes, char, "long");
  const newUsedAuto = { ...usedAuto };
  Object.keys(resetMap).forEach(id => { newUsedAuto[id] = 0; });

  return {
    char: {
      ...char,
      hp: char.maxHp || char.hp,
      tempHp: 0,
      deathSaves: { suc: 0, fail: 0 },
      hd_used: newHdUsed,
      exhaustion: newExhaustion,
    },
    usedAuto: newUsedAuto,
    hdRecovered: actualHdRecovered,
    exhaustionRemoved,
  };
}

/**
 * Apply a Short Rest to a character.
 *
 * @param {object} char     — current character
 * @param {Array}  classes  — multi-class entries
 * @param {object} usedAuto — current resource usage state
 * @param {number} hpGain   — HP regained from spending HD (manually entered)
 * @returns {{ char, usedAuto, healed }}
 */
export function applyShortRest(char, classes, usedAuto = {}, hpGain = 0) {
  const safeGain = Math.max(0, hpGain || 0);
  const newHp = Math.min(char.maxHp || char.hp, (char.hp || 0) + safeGain);

  // Reset short-rest resources only
  const resetMap = buildResourceMaxMap(classes, char, "short");
  const newUsedAuto = { ...usedAuto };
  Object.keys(resetMap).forEach(id => { newUsedAuto[id] = 0; });

  return {
    char: {
      ...char,
      hp: newHp,
    },
    usedAuto: newUsedAuto,
    healed: safeGain,
  };
}

/**
 * Roll a Hit Die for HP recovery during Short Rest.
 *
 * @param {object} char  — current character
 * @returns {{ roll, modifier, healed, hdRemaining, hdMax, error }}
 */
export function rollHitDie(char) {
  const hdRemaining = (char.level || 1) - (char.hd_used || 0);
  if (hdRemaining <= 0) {
    return { error: "Keine HD verfügbar", roll: 0, modifier: 0, healed: 0, hdRemaining: 0, hdMax: char.level || 1 };
  }

  // Parse hit die (e.g. "d10", "W12", "d8")
  const hdMatch = (char.hd || "d8").match(/[dDwW](\d+)/);
  const hdSize = hdMatch ? parseInt(hdMatch[1]) : 8;
  const roll = Math.floor(Math.random() * hdSize) + 1;
  const conMod = ABILITY_MOD(char.con);
  const healed = Math.max(1, roll + conMod); // min 1 HP

  return {
    roll,
    hdSize,
    modifier: conMod,
    healed,
    hdRemaining: hdRemaining - 1,
    hdMax: char.level || 1,
  };
}

/**
 * Spend one HD and apply the heal to char.
 * Mutates: hp, hd_used
 *
 * @returns {{ char, roll, healed }}
 */
export function spendHitDie(char) {
  const result = rollHitDie(char);
  if (result.error) return { char, ...result };

  const newHp = Math.min(char.maxHp || char.hp, (char.hp || 0) + result.healed);
  const newHdUsed = (char.hd_used || 0) + 1;

  return {
    char: { ...char, hp: newHp, hd_used: newHdUsed },
    ...result,
  };
}
