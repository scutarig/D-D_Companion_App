import { RACES_FULL } from "../data/races.js";

/** Get full race data by name (returns null if not found) */
export function getRaceData(raceName) {
  return RACES_FULL.find(r => r.name === raceName) ?? null;
}

/**
 * Remove all race-sourced traits/features from a character.
 * Keeps manually added traits (those without a source matching any race name).
 */
export function removeRaceTraits(char) {
  const raceNames = new Set(RACES_FULL.map(r => r.name));
  return {
    ...char,
    raceTraits: (char.raceTraits || []).filter(t => !raceNames.has(t.source)),
  };
}

/**
 * Apply a race's traits + features to a character.
 * First removes any existing race traits, then adds the new race's.
 */
export function applyRaceTraits(char, raceName) {
  const raceData = getRaceData(raceName);
  const charWithoutOld = removeRaceTraits(char);

  if (!raceData) {
    // Unknown race: just clear, don't add anything
    return { ...charWithoutOld, race: raceName };
  }

  const newTraits = [
    ...raceData.traits,
    ...raceData.features,
  ];

  return {
    ...charWithoutOld,
    race: raceName,
    raceTraits: [...(charWithoutOld.raceTraits || []), ...newTraits],
  };
}

/** Format a stat bonus object to display string, e.g. "+2 DEX, +1 CHA" */
export function formatStatBonuses(statBonuses) {
  if (!statBonuses) return "";
  return Object.entries(statBonuses)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `${v > 0 ? "+" : ""}${v} ${k}`)
    .join(", ");
}
