import { getSubclassFeaturesUpToLevel } from "../data/subclasses.js";

/** Remove all subclass-sourced features from a character */
export function removeSubclassFeatures(char) {
  return {
    ...char,
    subclassFeatures: (char.subclassFeatures || []).filter(
      f => !f.source?.startsWith("subclass:")
    ),
  };
}

/**
 * Recompute subclassFeatures for all active classes.
 * classes: [{ name, level }]
 * char.subclasses: { [className]: subclassName }
 */
export function applySubclasses(char, classes) {
  if (!classes?.length) return char;

  const subclassMap = char.subclasses || {};

  const newFeatures = classes.flatMap(({ name, level }) => {
    const subclassName = subclassMap[name];
    if (!subclassName) return [];
    return getSubclassFeaturesUpToLevel(name, subclassName, level).map(f => ({
      ...f,
      source: `subclass:${name}:${subclassName}`,
    }));
  });

  const manual = (char.subclassFeatures || []).filter(
    f => !f.source?.startsWith("subclass:")
  );

  return {
    ...char,
    subclassFeatures: [...manual, ...newFeatures],
  };
}
