// ─────────────────────────────────────────────────────────────────────────────
// weaponMasteries.js — 2024 PHB Weapon Mastery System
//
// NEU 2024: Martials (Barbar/Fighter/Paladin/Ranger/Rogue) erhalten ab Lv1
// "Weapon Mastery" für N gewählte Waffen. Jede Waffe hat 1 Mastery-Property
// (z.B. Greataxe = Cleave). Nach jeder Long Rest dürfen die N Waffen geändert
// werden (mit denen man Proficiency hat).
//
// 8 Mastery Properties: Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex
// ─────────────────────────────────────────────────────────────────────────────

/** 8 Weapon Mastery Properties (2024 PHB) */
export const MASTERY_PROPERTIES = {
  Cleave: {
    icon: "🪓",
    color: "red",
    short: "Trefferwellenschaden auf 2. Wesen",
    description: "Bei Treffer mit Melee-Angriff: Du darfst ein zweites Wesen in 5ft des ersten angreifen (selber Wurf, ohne Modifier). Nur 1×/Zug.",
  },
  Graze: {
    icon: "💢",
    color: "amber",
    short: "Schaden auch bei Miss",
    description: "Verfehlst du einen Melee-Angriff: Ziel erleidet trotzdem Schaden = Ability-Modifier (gleicher Schadenstyp).",
  },
  Nick: {
    icon: "⚡",
    color: "green",
    short: "Bonus-Attack ohne Bonus-Action",
    description: "Wenn du Light-Weapon-Bonus-Attack als Teil der Attack-Action machst (statt Bonus-Action). Nur 1×/Zug.",
  },
  Push: {
    icon: "💨",
    color: "blue",
    short: "Ziel 10ft zurückstoßen",
    description: "Bei Treffer: Wenn das Ziel Large oder kleiner ist, kannst du es 10ft direkt von dir wegschieben.",
  },
  Sap: {
    icon: "😵",
    color: "purple",
    short: "Disadvantage auf nächsten Attack",
    description: "Bei Treffer: Ziel hat Disadvantage auf seinen nächsten Angriffswurf vor Anfang deines nächsten Zugs.",
  },
  Slow: {
    icon: "🐌",
    color: "teal",
    short: "Speed -10ft",
    description: "Bei Treffer: Ziel-Speed reduziert um 10ft bis Anfang deines nächsten Zugs. Stapelt nicht.",
  },
  Topple: {
    icon: "⬇️",
    color: "gold",
    short: "CON-Save oder Prone",
    description: "Bei Treffer: Ziel muss CON-Save (DC = 8 + PB + STR-Mod oder DEX-Mod, je nachdem was du für Attack benutzt). Bei Fehlschlag: Prone.",
  },
  Vex: {
    icon: "🎯",
    color: "amberBright",
    short: "Vorteil auf nächsten Attack",
    description: "Bei Treffer: Du hast Vorteil auf deinen nächsten Angriffswurf gegen dasselbe Ziel vor Ende deines nächsten Zugs.",
  },
};

/**
 * Weapon → Mastery mapping (2024 PHB Weapons Table).
 * Schema: { id, name, category: 'simple_melee'|'simple_ranged'|'martial_melee'|'martial_ranged',
 *           mastery: keyof MASTERY_PROPERTIES, damage, properties[] }
 */
export const WEAPONS_WITH_MASTERY = [
  // ── SIMPLE MELEE ──────────────────────────────────────────────────────────
  { id: "club",          name: "Club",          category: "simple_melee",   mastery: "Slow",   damage: "1d4 B",  properties: ["Light"] },
  { id: "dagger",        name: "Dagger",        category: "simple_melee",   mastery: "Nick",   damage: "1d4 P",  properties: ["Light", "Finesse", "Thrown"] },
  { id: "greatclub",     name: "Greatclub",     category: "simple_melee",   mastery: "Push",   damage: "1d8 B",  properties: ["Two-Handed"] },
  { id: "handaxe",       name: "Handaxe",       category: "simple_melee",   mastery: "Vex",    damage: "1d6 S",  properties: ["Light", "Thrown"] },
  { id: "javelin",       name: "Javelin",       category: "simple_melee",   mastery: "Slow",   damage: "1d6 P",  properties: ["Thrown"] },
  { id: "light_hammer",  name: "Light Hammer",  category: "simple_melee",   mastery: "Nick",   damage: "1d4 B",  properties: ["Light", "Thrown"] },
  { id: "mace",          name: "Mace",          category: "simple_melee",   mastery: "Sap",    damage: "1d6 B",  properties: [] },
  { id: "quarterstaff",  name: "Quarterstaff",  category: "simple_melee",   mastery: "Topple", damage: "1d6 B",  properties: ["Versatile (1d8)"] },
  { id: "sickle",        name: "Sickle",        category: "simple_melee",   mastery: "Nick",   damage: "1d4 S",  properties: ["Light"] },
  { id: "spear",         name: "Spear",         category: "simple_melee",   mastery: "Sap",    damage: "1d6 P",  properties: ["Thrown", "Versatile (1d8)"] },

  // ── SIMPLE RANGED ─────────────────────────────────────────────────────────
  { id: "dart",          name: "Dart",          category: "simple_ranged",  mastery: "Vex",    damage: "1d4 P",  properties: ["Finesse", "Thrown"] },
  { id: "light_crossbow",name: "Light Crossbow",category: "simple_ranged",  mastery: "Slow",   damage: "1d8 P",  properties: ["Ammunition", "Loading", "Two-Handed"] },
  { id: "shortbow",      name: "Shortbow",      category: "simple_ranged",  mastery: "Vex",    damage: "1d6 P",  properties: ["Ammunition", "Two-Handed"] },
  { id: "sling",         name: "Sling",         category: "simple_ranged",  mastery: "Slow",   damage: "1d4 B",  properties: ["Ammunition"] },

  // ── MARTIAL MELEE ─────────────────────────────────────────────────────────
  { id: "battleaxe",     name: "Battleaxe",     category: "martial_melee",  mastery: "Topple", damage: "1d8 S",  properties: ["Versatile (1d10)"] },
  { id: "flail",         name: "Flail",         category: "martial_melee",  mastery: "Sap",    damage: "1d8 B",  properties: [] },
  { id: "glaive",        name: "Glaive",        category: "martial_melee",  mastery: "Graze",  damage: "1d10 S", properties: ["Heavy", "Reach", "Two-Handed"] },
  { id: "greataxe",      name: "Greataxe",      category: "martial_melee",  mastery: "Cleave", damage: "1d12 S", properties: ["Heavy", "Two-Handed"] },
  { id: "greatsword",    name: "Greatsword",    category: "martial_melee",  mastery: "Graze",  damage: "2d6 S",  properties: ["Heavy", "Two-Handed"] },
  { id: "halberd",       name: "Halberd",       category: "martial_melee",  mastery: "Cleave", damage: "1d10 S", properties: ["Heavy", "Reach", "Two-Handed"] },
  { id: "lance",         name: "Lance",         category: "martial_melee",  mastery: "Topple", damage: "1d10 P", properties: ["Heavy", "Reach", "Two-Handed*"] },
  { id: "longsword",     name: "Longsword",     category: "martial_melee",  mastery: "Sap",    damage: "1d8 S",  properties: ["Versatile (1d10)"] },
  { id: "maul",          name: "Maul",          category: "martial_melee",  mastery: "Topple", damage: "2d6 B",  properties: ["Heavy", "Two-Handed"] },
  { id: "morningstar",   name: "Morningstar",   category: "martial_melee",  mastery: "Sap",    damage: "1d8 P",  properties: [] },
  { id: "pike",          name: "Pike",          category: "martial_melee",  mastery: "Push",   damage: "1d10 P", properties: ["Heavy", "Reach", "Two-Handed"] },
  { id: "rapier",        name: "Rapier",        category: "martial_melee",  mastery: "Vex",    damage: "1d8 P",  properties: ["Finesse"] },
  { id: "scimitar",      name: "Scimitar",      category: "martial_melee",  mastery: "Nick",   damage: "1d6 S",  properties: ["Light", "Finesse"] },
  { id: "shortsword",    name: "Shortsword",    category: "martial_melee",  mastery: "Vex",    damage: "1d6 P",  properties: ["Light", "Finesse"] },
  { id: "trident",       name: "Trident",       category: "martial_melee",  mastery: "Topple", damage: "1d8 P",  properties: ["Thrown", "Versatile (1d10)"] },
  { id: "war_pick",      name: "War Pick",      category: "martial_melee",  mastery: "Sap",    damage: "1d8 P",  properties: ["Versatile (1d10)"] },
  { id: "warhammer",     name: "Warhammer",     category: "martial_melee",  mastery: "Push",   damage: "1d8 B",  properties: ["Versatile (1d10)"] },
  { id: "whip",          name: "Whip",          category: "martial_melee",  mastery: "Slow",   damage: "1d4 S",  properties: ["Finesse", "Reach"] },

  // ── MARTIAL RANGED ────────────────────────────────────────────────────────
  { id: "blowgun",       name: "Blowgun",       category: "martial_ranged", mastery: "Vex",    damage: "1 P",    properties: ["Ammunition", "Loading"] },
  { id: "hand_crossbow", name: "Hand Crossbow", category: "martial_ranged", mastery: "Vex",    damage: "1d6 P",  properties: ["Ammunition", "Light", "Loading"] },
  { id: "heavy_crossbow",name: "Heavy Crossbow",category: "martial_ranged", mastery: "Push",   damage: "1d10 P", properties: ["Ammunition", "Heavy", "Loading", "Two-Handed"] },
  { id: "longbow",       name: "Longbow",       category: "martial_ranged", mastery: "Slow",   damage: "1d8 P",  properties: ["Ammunition", "Heavy", "Two-Handed"] },
  { id: "musket",        name: "Musket",        category: "martial_ranged", mastery: "Slow",   damage: "1d12 P", properties: ["Ammunition", "Loading", "Two-Handed"] },
  { id: "pistol",        name: "Pistol",        category: "martial_ranged", mastery: "Vex",    damage: "1d10 P", properties: ["Ammunition", "Loading"] },
];

/**
 * Mastery counts per class + level (2024 PHB).
 * Returns 0 if class has no mastery feature.
 */
export function getMasteryCount(klass, level) {
  if (!klass || !level) return 0;
  switch (klass) {
    case "Kämpfer":     // Fighter: 3 → 4 → 5 → 6
      if (level >= 16) return 6;
      if (level >= 10) return 5;
      if (level >= 4)  return 4;
      return 3;
    case "Barbar":      // Barbarian: 2 → 3
    case "Waldläufer":  // Ranger: 2 → 3 (Lv4)
      if (level >= 4) return 3;
      return 2;
    case "Paladin":
    case "Schurke":     // Rogue: 2 → 3 (Lv4)
      if (level >= 4) return 3;
      return 2;
    default:
      return 0;
  }
}

/** Get a single weapon by id */
export function getWeaponById(id) {
  return WEAPONS_WITH_MASTERY.find(w => w.id === id) || null;
}

/** Get mastery property by name */
export function getMasteryProperty(name) {
  return MASTERY_PROPERTIES[name] || null;
}

/** All weapons grouped by mastery property — useful for filter UI */
export function getWeaponsByMastery() {
  const groups = {};
  Object.keys(MASTERY_PROPERTIES).forEach(m => { groups[m] = []; });
  WEAPONS_WITH_MASTERY.forEach(w => {
    if (groups[w.mastery]) groups[w.mastery].push(w);
  });
  return groups;
}
