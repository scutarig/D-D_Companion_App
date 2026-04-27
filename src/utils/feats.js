import { getFeatById } from "../data/feats.js";

/**
 * Apply a feat to a character by id.
 * Adds the feat to char.feats (idempotent — won't add duplicates).
 * Applies statBonus if present.
 */
export function applyFeat(char, featId) {
  const feat = getFeatById(featId);
  if (!feat) return char;

  // Already applied?
  if ((char.feats || []).some(f => f.id === feat.id)) return char;

  // Build feat entry for storage
  const featEntry = {
    id: feat.id,
    name: feat.name,
    description: feat.description,
    source: `feat:${feat.id}`,
    category: "feat",
  };

  let next = {
    ...char,
    feats: [...(char.feats || []), featEntry],
  };

  // Apply stat bonus
  if (feat.statBonus) {
    for (const [stat, bonus] of Object.entries(feat.statBonus)) {
      next = { ...next, [stat]: (next[stat] || 10) + bonus };
    }
  }

  return next;
}

/**
 * Remove a feat from a character by id.
 * Also reverses statBonus.
 */
export function removeFeat(char, featId) {
  const feat = getFeatById(featId);
  const existing = (char.feats || []).find(f => f.id === featId);
  if (!existing) return char;

  let next = {
    ...char,
    feats: (char.feats || []).filter(f => f.id !== featId),
  };

  // Reverse stat bonus
  if (feat?.statBonus) {
    for (const [stat, bonus] of Object.entries(feat.statBonus)) {
      next = { ...next, [stat]: (next[stat] || 10) - bonus };
    }
  }

  return next;
}
