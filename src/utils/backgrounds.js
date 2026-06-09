// ─────────────────────────────────────────────────────────────────────────────
// utils/backgrounds.js — 2024 PHB Background Logic
//
// 2024 Reform: Backgrounds geben jetzt
//   - ASI (Ability Score Increase): 3 vorgegebene Stats, +2/+1 oder +1/+1/+1
//   - Origin Feat (1 Feat pro Background)
//   - 2 Skill Profs (fest)
//   - 1 Tool Prof (fest)
//   - Equipment Wahl A (Items) oder B (50 GP)
//
// ASI wird per Delta-Tracking auf char.str/dex/etc. angewendet:
//   - char.bgAsi = { str: 2, dex: 1 } speichert die User-Wahl
//   - applyBackgroundAsi() berechnet diff zur vorherigen Wahl und
//     addiert/subtrahiert auf den Stats → kein Double-Apply möglich
// ─────────────────────────────────────────────────────────────────────────────

import { BACKGROUNDS_FULL, getBackgroundData } from "../data/backgrounds.js";

const BG_SOURCE_PREFIX = "Hintergrund:";

/** Remove all background-sourced traits from a character */
export function removeBackgroundTraits(char) {
  return {
    ...char,
    bgTraits: (char.bgTraits || []).filter(t => !t.source?.startsWith(BG_SOURCE_PREFIX)),
  };
}

/**
 * Build the bgTraits array for a 2024 background.
 * Returns [{id, name, description, source, category}]
 */
function buildBgTraits(bg) {
  const src = `${BG_SOURCE_PREFIX}${bg.name}`;
  const traits = [];

  // Skill proficiencies
  if (bg.skillProfs?.length) {
    traits.push({
      id: `bg_${bg.id}_skills`,
      name: `Fertigkeiten: ${bg.skillProfs.join(", ")}`,
      description: `Vom Hintergrund ${bg.name}: Du hast Übung in ${bg.skillProfs.join(" und ")}.`,
      source: src,
      category: "trait",
    });
  }

  // Tool proficiency
  if (bg.toolProf) {
    traits.push({
      id: `bg_${bg.id}_tool`,
      name: `Werkzeug: ${bg.toolProf}`,
      description: `Vom Hintergrund ${bg.name}: Du hast Übung mit ${bg.toolProf}.`,
      source: src,
      category: "trait",
    });
  }

  // Origin Feat (NEU 2024)
  if (bg.feat) {
    traits.push({
      id: `bg_${bg.id}_feat`,
      name: `Origin Feat: ${bg.feat}`,
      description: `Vom Hintergrund ${bg.name}: Du erhältst den Origin Feat ${bg.feat} (siehe feats.js für Details).`,
      source: src,
      category: "feature",
    });
  }

  return traits;
}

/** Stats die Background gibt (lowercase) */
const ASI_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

/** Sum of all values in an ASI object */
export function asiTotal(asi) {
  if (!asi) return 0;
  return ASI_KEYS.reduce((sum, k) => sum + (asi[k] || 0), 0);
}

/** Validate ASI distribution: total = 3, max per stat = 2, all stats in background.abilityScores */
export function isAsiValid(asi, bg) {
  if (!asi || !bg) return false;
  const total = asiTotal(asi);
  if (total !== 3) return false;
  const validStats = bg.abilityScores.map(s => s.toLowerCase());
  for (const k of ASI_KEYS) {
    const v = asi[k] || 0;
    if (v < 0 || v > 2) return false;
    if (v > 0 && !validStats.includes(k)) return false;
  }
  return true;
}

/**
 * Apply ASI delta to char.str/dex/etc.
 * Calculates diff between newAsi and char.bgAsi, applies to base stats.
 *
 * Example: old = {str:2}, new = {str:0, dex:2, con:1}
 *   → char.str -= 2, char.dex += 2, char.con += 1
 */
export function applyBackgroundAsi(char, newAsi) {
  const oldAsi = char.bgAsi || {};
  const newChar = { ...char };
  for (const k of ASI_KEYS) {
    const delta = (newAsi?.[k] || 0) - (oldAsi[k] || 0);
    if (delta !== 0) {
      newChar[k] = (newChar[k] || 10) + delta;
    }
  }
  newChar.bgAsi = newAsi ? { ...newAsi } : null;
  return newChar;
}

/**
 * Apply a background to a character:
 * 1. Revert old ASI (if any)
 * 2. Remove old background traits
 * 3. Add new traits from the chosen background
 */
export function applyBackground(char, backgroundName) {
  // Step 1: Revert old ASI (set bgAsi to null/empty applies negative delta)
  let workChar = applyBackgroundAsi(char, null);

  // Step 2: Remove old traits
  workChar = removeBackgroundTraits(workChar);

  // Step 3: Apply new background
  const bg = getBackgroundData(backgroundName);
  if (!bg) {
    // Unknown/custom background: just clear, keep name
    return {
      ...workChar,
      background: backgroundName,
      bgAsi: null,
      originFeat: null,
      bgEquipChoice: null,
    };
  }

  const newTraits = buildBgTraits(bg);

  return {
    ...workChar,
    background: backgroundName,
    bgTraits: [...(workChar.bgTraits || []), ...newTraits],
    bgAsi: null,         // User must re-pick distribution
    originFeat: bg.feat || null,
    bgEquipChoice: null, // User must pick A or B
  };
}

export { getBackgroundData };
export const ALL_BACKGROUNDS = BACKGROUNDS_FULL.map(b => b.name);
