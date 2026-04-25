// D&D 5e Skills — 18 core skills with governing ability

export const SKILLS = [
  // Strength
  { id: "athletics",       name: "Athletics",       ability: "STR", icon: "🏋️" },
  // Dexterity
  { id: "acrobatics",      name: "Acrobatics",      ability: "DEX", icon: "🤸" },
  { id: "sleight_of_hand", name: "Sleight of Hand", ability: "DEX", icon: "🤌" },
  { id: "stealth",         name: "Stealth",         ability: "DEX", icon: "🫥" },
  // Intelligence
  { id: "arcana",          name: "Arcana",          ability: "INT", icon: "🔮" },
  { id: "history",         name: "History",         ability: "INT", icon: "📜" },
  { id: "investigation",   name: "Investigation",   ability: "INT", icon: "🔍" },
  { id: "nature",          name: "Nature",          ability: "INT", icon: "🌿" },
  { id: "religion",        name: "Religion",        ability: "INT", icon: "⛪" },
  // Wisdom
  { id: "animal_handling", name: "Animal Handling", ability: "WIS", icon: "🐾" },
  { id: "insight",         name: "Insight",         ability: "WIS", icon: "👁️" },
  { id: "medicine",        name: "Medicine",        ability: "WIS", icon: "💊" },
  { id: "perception",      name: "Perception",      ability: "WIS", icon: "👀" },
  { id: "survival",        name: "Survival",        ability: "WIS", icon: "🏕️" },
  // Charisma
  { id: "deception",       name: "Deception",       ability: "CHA", icon: "🎭" },
  { id: "intimidation",    name: "Intimidation",    ability: "CHA", icon: "😤" },
  { id: "performance",     name: "Performance",     ability: "CHA", icon: "🎶" },
  { id: "persuasion",      name: "Persuasion",      ability: "CHA", icon: "🗣️" },
];

// Ability display config
export const ABILITIES = [
  { key: "STR", label: "Strength",     color: "#c04040", icon: "💪" },
  { key: "DEX", label: "Dexterity",    color: "#40c0a0", icon: "🏹" },
  { key: "CON", label: "Constitution", color: "#c08040", icon: "🛡️" },
  { key: "INT", label: "Intelligence", color: "#4080c0", icon: "📚" },
  { key: "WIS", label: "Wisdom",       color: "#a040c0", icon: "🦉" },
  { key: "CHA", label: "Charisma",     color: "#c06090", icon: "✨" },
];

export const abilityColor = (key) =>
  ABILITIES.find((a) => a.key === key)?.color ?? "#808080";

// Skills grouped by ability for UI rendering
export const SKILLS_BY_ABILITY = ABILITIES.map((ab) => ({
  ...ab,
  skills: SKILLS.filter((s) => s.ability === ab.key),
}));

// Calc proficiency bonus for a given level
export const getProfBonus = (level = 1) =>
  level < 5 ? 2 : level < 9 ? 3 : level < 13 ? 4 : level < 17 ? 5 : 6;

// Calc ability modifier from score
export const abilityMod = (score = 10) => Math.floor((score - 10) / 2);

// Format modifier: "+2" or "-1"
export const fmtMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

/**
 * Calc total skill modifier for a fighter
 *   proficiencies[skillId] = true | "expertise" | undefined
 */
export const skillModifier = (fighter, skillId) => {
  const skill = SKILLS.find((s) => s.id === skillId);
  if (!skill) return 0;
  const scores = fighter.abilityScores ?? {};
  const score = scores[skill.ability] ?? 10;
  const base = abilityMod(score);
  const prof = fighter.skillProficiencies?.[skillId];
  const pb = getProfBonus(fighter.level ?? 1);
  if (prof === "expertise") return base + pb * 2;
  if (prof) return base + pb;
  return base;
};

/**
 * Calc total save modifier for a fighter
 *   saveProficiencies[saveKey] = true | false
 */
export const saveModifier = (fighter, saveKey) => {
  const scores = fighter.abilityScores ?? {};
  const score = scores[saveKey] ?? 10;
  const base = abilityMod(score);
  const hasProficiency = fighter.saveProficiencies?.[saveKey] ?? false;
  const pb = getProfBonus(fighter.level ?? 1);
  return hasProficiency ? base + pb : base;
};
