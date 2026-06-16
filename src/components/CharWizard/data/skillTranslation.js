// Background skillProfs are stored in DE in backgrounds.js but the Bogen tab
// (and char.skills keys) use EN names from constants/theme.js SKILLS. Map
// German skill names → English so background profs actually light up the
// skill rows on the character sheet.
//
// Class skills in classes.js are already in EN — no translation needed there.

export const SKILL_DE_TO_EN = {
  // STR
  "Athletik":          "Athletics",
  // DEX
  "Akrobatik":         "Acrobatics",
  "Fingerfertigkeit":  "Sleight of Hand",
  "Heimlichkeit":      "Stealth",
  // INT
  "Arkane Kunde":      "Arcana",
  "Geschichte":        "History",
  "Nachforschungen":   "Investigation",
  "Natur":             "Nature",
  "Religion":          "Religion",
  // WIS
  "Tierführung":       "Animal Handling",
  "Einsicht":          "Insight",
  "Medizin":           "Medicine",
  "Wahrnehmung":       "Perception",
  "Überlebenskunst":   "Survival",
  // CHA
  "Täuschen":          "Deception",
  "Einschüchtern":     "Intimidation",
  "Auftreten":         "Performance",
  "Überzeugen":        "Persuasion",
};

/** Returns the canonical EN skill key (used in char.skills). Pass-through if unknown. */
export function toEnSkill(name) {
  return SKILL_DE_TO_EN[name] || name;
}
