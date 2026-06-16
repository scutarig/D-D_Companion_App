// PHB 2024 Lv1 choices per class. Only classes that have a Lv1-only choice.
export const CLASS_LV1_CHOICES = {
  Kämpfer: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Archery",       name: "Archery",        desc: "+2 to attack rolls with ranged weapons." },
      { id: "Blind Fighting", name: "Blind Fighting", desc: "10 ft Blindsight; can fight unseen creatures within 10 ft." },
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Great Weapon",  name: "Great Weapon Fighting", desc: "Reroll 1s and 2s on two-handed weapon damage." },
      { id: "Interception",  name: "Interception",   desc: "Reaction: reduce damage to an ally within 5 ft." },
      { id: "Protection",    name: "Protection",     desc: "Reaction: impose disadvantage on attack against ally within 5 ft." },
      { id: "Thrown Weapon", name: "Thrown Weapon",  desc: "+1 damage to thrown weapons; draw a weapon as part of attack." },
      { id: "Two-Weapon",    name: "Two-Weapon Fighting", desc: "Add ability mod to off-hand attack damage." },
    ],
  },
  Kleriker: {
    key: "divineOrder",
    label: "Divine Order",
    options: [
      { id: "Protector", name: "Protector", desc: "Heavy armor + martial weapon proficiency." },
      { id: "Thaumaturge", name: "Thaumaturge", desc: "+1 cantrip known; +Wis-mod to one Intelligence (Arcana/Religion) check." },
    ],
  },
  Paladin: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Great Weapon",  name: "Great Weapon Fighting", desc: "Reroll 1s and 2s on two-handed weapon damage." },
      { id: "Protection",    name: "Protection",     desc: "Reaction: impose disadvantage on attack against ally within 5 ft." },
    ],
  },
  Waldläufer: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Archery",       name: "Archery",        desc: "+2 to attack rolls with ranged weapons." },
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Two-Weapon",    name: "Two-Weapon Fighting", desc: "Add ability mod to off-hand attack damage." },
    ],
  },
};
