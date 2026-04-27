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
 * Build the bgTraits array for a given background.
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

  // Tool proficiencies
  if (bg.toolProfs?.length) {
    traits.push({
      id: `bg_${bg.id}_tools`,
      name: `Werkzeuge: ${bg.toolProfs.join(", ")}`,
      description: `Vom Hintergrund ${bg.name}: Du hast Übung mit ${bg.toolProfs.join(", ")}.`,
      source: src,
      category: "trait",
    });
  }

  // Languages
  if (bg.languages) {
    const langText = typeof bg.languages === "number"
      ? `${bg.languages} Sprache${bg.languages > 1 ? "n" : ""} nach Wahl`
      : bg.languages.join(", ");
    traits.push({
      id: `bg_${bg.id}_lang`,
      name: `Sprachen: ${langText}`,
      description: `Vom Hintergrund ${bg.name}: Du sprichst ${langText}.`,
      source: src,
      category: "trait",
    });
  }

  // Equipment
  if (bg.equipment?.length) {
    traits.push({
      id: `bg_${bg.id}_equipment`,
      name: "Startausrüstung",
      description: `${bg.equipment.join(", ")}.`,
      source: src,
      category: "trait",
    });
  }

  // Feature
  if (bg.feature) {
    traits.push({
      id: `bg_${bg.id}_feature`,
      name: bg.feature.name,
      description: bg.feature.description,
      source: src,
      category: "feature",
    });
  }

  return traits;
}

/**
 * Apply a background to a character:
 * 1. Remove old background traits
 * 2. Add new traits from the chosen background
 * 3. Merge specific languages into char.languages
 */
export function applyBackground(char, backgroundName) {
  const charWithoutOld = removeBackgroundTraits(char);
  const bg = getBackgroundData(backgroundName);

  if (!bg) {
    // Unknown/custom background: just clear traits, keep name
    return { ...charWithoutOld, background: backgroundName };
  }

  const newTraits = buildBgTraits(bg);

  // Merge specific languages (when bg.languages is an array)
  let languages = [...(charWithoutOld.languages || [])];
  if (Array.isArray(bg.languages)) {
    bg.languages.forEach(lang => {
      if (!languages.includes(lang)) languages.push(lang);
    });
  }

  return {
    ...charWithoutOld,
    background: backgroundName,
    bgTraits: [...(charWithoutOld.bgTraits || []), ...newTraits],
    languages,
  };
}

export { getBackgroundData };
export const ALL_BACKGROUNDS = BACKGROUNDS_FULL.map(b => b.name);
