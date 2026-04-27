import { applyBackground } from "../utils/backgrounds.js";

/**
 * useBackground(setChar)
 * Returns handleBackgroundChange(name) —
 * removes old background traits and applies the new background.
 */
export function useBackground(setChar) {
  const handleBackgroundChange = (newBackground) => {
    setChar(prev => applyBackground(prev, newBackground));
  };
  return { handleBackgroundChange };
}
