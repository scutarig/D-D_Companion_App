import { getClassFeaturesUpToLevel } from "../data/classFeatures.js";

/** Remove all class-sourced features from a character */
export function removeClassFeatures(char) {
  return {
    ...char,
    classFeatures: (char.classFeatures || []).filter(
      f => !f.source?.startsWith("class:")
    ),
  };
}

/**
 * Recompute classFeatures for all active classes.
 * classes: [{ name, level }]
 */
export function applyClassFeatures(char, classes) {
  if (!classes?.length) return char;

  // Build new features from all classes
  const newFeatures = classes.flatMap(({ name, level }) =>
    getClassFeaturesUpToLevel(name, level).map(f => ({
      ...f,
      source: `class:${name}`,
    }))
  );

  // Keep manually added classFeatures (those without class: source)
  const manual = (char.classFeatures || []).filter(
    f => !f.source?.startsWith("class:")
  );

  return {
    ...char,
    classFeatures: [...manual, ...newFeatures],
  };
}
