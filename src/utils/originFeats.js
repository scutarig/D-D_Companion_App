// ─────────────────────────────────────────────────────────────────────────────
// originFeats.js — Auto-Apply Origin Feat effects
//
// Manche Origin Feats geben mechanische Boni die wir automatisch
// auf den Charakter anwenden können:
//   - "Tough"  → +2 HP pro Char-Level
//   - "Healer" → Herbalism Kit Tool-Proficiency
//   - "Alert"  → +PB auf Initiative (markiert via char.initiativePB flag)
//
// Delta-Tracking: char.originFeatApplied speichert was angewendet wurde,
// damit ein Feat-Wechsel den alten Effekt sauber rückgängig macht.
//
// SCHEMA der feat.effects:
//   { type: "hp_per_level",  value: number }
//   { type: "tool_prof",     value: string }
//   { type: "initiative_pb", value: true }
// ─────────────────────────────────────────────────────────────────────────────

import { FEATS } from "../data/feats.js";

/** Find feat by display-name (handles parens like "Magic Initiate (Cleric)") */
function findFeatByName(featName) {
  if (!featName) return null;
  const baseId = featName.toLowerCase().split("(")[0].trim()
    .replace(/[\s']/g, "_")
    .replace(/[^a-z_]/g, "");
  return FEATS.find(f => f.id === baseId);
}

/** Get effects array for a feat name, or [] */
export function getOriginFeatEffects(featName) {
  const feat = findFeatByName(featName);
  return feat?.effects || [];
}

/**
 * Compute the "applied delta" for a given feat at current char-level.
 * Returns an object summarizing what would be applied.
 *
 * Used for both apply and revert (revert subtracts the same delta).
 */
function computeFeatDelta(featName, level) {
  const effects = getOriginFeatEffects(featName);
  const delta = {
    hpBonus: 0,
    tools: [],
    initiativePB: false,
  };
  effects.forEach(e => {
    if (e.type === "hp_per_level") {
      delta.hpBonus += e.value * (level || 1);
    } else if (e.type === "tool_prof") {
      delta.tools.push(e.value);
    } else if (e.type === "initiative_pb") {
      delta.initiativePB = true;
    }
  });
  return delta;
}

/**
 * Apply Origin Feat effects to a character.
 * Reverts any previously-applied origin feat effects first (via delta).
 *
 * @param {object} char     — character
 * @param {string} newFeat  — new origin feat name (null to just revert)
 * @returns {object} new char
 */
export function applyOriginFeatEffects(char, newFeat) {
  // Step 1: Revert previously applied effects
  const oldApplied = char.originFeatApplied;
  let workChar = { ...char };

  if (oldApplied) {
    if (oldApplied.hpBonus) {
      workChar.maxHp = Math.max(1, (workChar.maxHp || 1) - oldApplied.hpBonus);
      workChar.hp = Math.min(workChar.maxHp, Math.max(0, (workChar.hp || 0) - oldApplied.hpBonus));
    }
    if (oldApplied.tools?.length) {
      // Remove only auto-added tools (heuristic: not user-added)
      const toolList = workChar.tools || [];
      workChar.tools = toolList.filter(t => !oldApplied.tools.includes(t));
    }
    if (oldApplied.initiativePB) {
      workChar.initiativePB = false;
    }
  }

  // Step 2: Apply new effects
  if (!newFeat) {
    return { ...workChar, originFeatApplied: null };
  }

  const newDelta = computeFeatDelta(newFeat, workChar.level || 1);
  let nextChar = { ...workChar };

  if (newDelta.hpBonus > 0) {
    nextChar.maxHp = (nextChar.maxHp || 1) + newDelta.hpBonus;
    nextChar.hp = (nextChar.hp || 0) + newDelta.hpBonus;
  }
  if (newDelta.tools.length > 0) {
    nextChar.tools = [...(nextChar.tools || []), ...newDelta.tools];
  }
  if (newDelta.initiativePB) {
    nextChar.initiativePB = true;
  }

  return { ...nextChar, originFeatApplied: newDelta };
}

/**
 * Re-apply HP-bonus on level-up if Tough is the origin feat.
 * Should be called from LevelUpAssistant when level increases.
 *
 * @param {object} char        — character (before level-up)
 * @param {number} newLevel    — new char level
 * @returns {object} new char with updated HP bonus
 */
export function updateOriginFeatOnLevelUp(char, newLevel) {
  if (!char.originFeat) return char;
  // Re-compute delta at new level, replace
  return applyOriginFeatEffects({ ...char, level: newLevel }, char.originFeat);
}
