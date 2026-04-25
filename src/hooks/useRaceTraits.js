import { applyRaceTraits } from "../utils/races.js";

/**
 * useRaceTraits(setChar)
 * Returns handleRaceChange(newRaceName) — removes old race traits, applies new.
 */
export function useRaceTraits(setChar) {
  const handleRaceChange = (newRaceName) => {
    setChar(prev => applyRaceTraits(prev, newRaceName));
  };

  return { handleRaceChange };
}
