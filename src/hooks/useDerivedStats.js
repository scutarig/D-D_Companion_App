import { useMemo } from "react";
import { calculateDerivedStats } from "../utils/derivedStats.js";

/**
 * useDerivedStats(char, proficiencies)
 * Returns memoized derived stats — recalculates only when char or proficiencies change.
 */
export function useDerivedStats(char, proficiencies = []) {
  return useMemo(
    () => (char ? calculateDerivedStats(char, proficiencies) : null),
    // Granular deps so memo is precise
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      char?.str, char?.dex, char?.con, char?.int, char?.wis, char?.cha,
      char?.level, char?.spellAbility,
      char?.saves?.STR, char?.saves?.DEX, char?.saves?.CON,
      char?.saves?.INT, char?.saves?.WIS, char?.saves?.CHA,
      proficiencies,
    ]
  );
}
