// Step flow registry — single source of truth for step order + conditional inclusion.
import { D3_KLASSEN } from "../../../data/classes.js";

// Class-Lv1-choice detection — Fighter has fighting-style at Lv1, Cleric has divine order, etc.
const LV1_CHOICE_CLASSES = ["Kämpfer", "Kleriker", "Paladin", "Waldläufer"];

export function isCasterClass(klass) {
  const cls = D3_KLASSEN.find((c) => c.name === klass);
  return !!cls?.spellcasting;
}

export function hasClassLv1Choice(klass) {
  return LV1_CHOICE_CLASSES.includes(klass);
}

export function hasBgChoice(background) {
  // PHB 2024 backgrounds have fixed tool/skill/equipment in our data
  // (backgrounds.js); no open choices to render. The bg_choices step is
  // therefore skipped. Re-enable per background if/when the data grows
  // explicit choice fields.
  return false;
}

export function hasSpeciesChoice(race) {
  // Half-Elf (Halbelf), Tiefling, and Hochelf (Highelf subrace) have choices.
  const choiceSpecies = ["Halbelf", "Tiefling", "Elf", "Hochelf"];
  return choiceSpecies.some((c) => race?.includes(c));
}

export const STEP_FLOW = [
  { id: "class_select",      title: "Klasse" },
  { id: "class_skills",      title: "Klassen-Skills" },
  { id: "class_choices",     title: "Klassen-Choices",    when: (s) => hasClassLv1Choice(s.klass) },
  { id: "spellcasting",      title: "Zauber",             when: (s) => isCasterClass(s.klass) },
  { id: "class_equipment",   title: "Klassen-Equipment" },
  { id: "bg_select",         title: "Background" },
  { id: "bg_asi",            title: "Background-ASI" },
  { id: "bg_choices",        title: "Background-Choices", when: (s) => hasBgChoice(s.background) },
  { id: "bg_equipment",      title: "Background-Equipment" },
  { id: "species_select",    title: "Spezies" },
  { id: "species_choices",   title: "Spezies-Choices",    when: (s) => hasSpeciesChoice(s.race) },
  { id: "abilities",         title: "Attribute" },
  { id: "alignment",         title: "Alignment" },
  { id: "personality",       title: "Persönlichkeit" },
  { id: "levelup_loop",      title: "Level-Up",           when: (s) => s.targetLevel > 1, multi: true },
  { id: "review",            title: "Übersicht" },
];

/** Returns the list of step entries that are active for the given state. */
export function activeSteps(state) {
  return STEP_FLOW.filter((s) => !s.when || s.when(state));
}

/** Returns the next step id (or null if at end). */
export function nextStepId(currentId, state) {
  const list = activeSteps(state);
  const idx = list.findIndex((s) => s.id === currentId);
  return idx >= 0 && idx + 1 < list.length ? list[idx + 1].id : null;
}

/** Returns the previous step id (or null if at start). */
export function prevStepId(currentId, state) {
  const list = activeSteps(state);
  const idx = list.findIndex((s) => s.id === currentId);
  return idx > 0 ? list[idx - 1].id : null;
}
