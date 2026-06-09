// ─────────────────────────────────────────────────────────────────────────────
// classes.js — D&D 5e (2024 PHB) Class Reference Data
//
// LANGUAGE POLICY:
//   - `name` (DE) preserved for backward-compat with saved chars (char.klass)
//   - `enName` exact PHB 2024 English name
//   - Feature names/descriptions: English per 2024 PHB (i18n DE-toggle in Phase 5)
//
// SCHEMA per class:
//   id, name, enName, icon, hd, primary, saves, armor, weapons, tools,
//   skills: { count, choices[] }
//   startingEquipment: { A, B, C? }
//   spellcasting: null | { ability, focus, progression: "full|half|third|pact|prepared" }
//   subclassName, subclassChoiceLevel, subclasses[]
//   desc, srd (DE-source link)
//   progressionHeaders[], progressionRows[][]
//   featuresByLevel: { N: [{ name, desc }] }
//   edition: "2024-PHB"
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_KLASSEN = ["Barbar","Barde","Druide","Hexenmeister","Kämpfer","Kleriker","Magier","Mönch","Paladin","Schurke","Waldläufer","Zauberer","Magieschmied"];

// ─── 2024 PHB Updated Classes ────────────────────────────────────────────────
const BARBARIAN = {
  id: "barbar", name: "Barbar", enName: "Barbarian", icon: "🪓",
  hd: "d12", primary: "Strength", saves: "STR & CON",
  armor: "Light, Medium, Shields", weapons: "Simple, Martial",
  tools: "—",
  skills: { count: 2, choices: ["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"] },
  startingEquipment: { A: "Greataxe · 4 Handaxes · Explorer's Pack · 15 GP", B: "75 GP" },
  spellcasting: null,
  subclassName: "Primal Path",
  subclassChoiceLevel: 3,
  subclasses: ["Path of the Berserker","Path of the Wild Heart","Path of the World Tree","Path of the Zealot"],
  desc: "Mighty warriors powered by primal forces of the multiverse that manifest as Rage. More than mere emotion, this Rage is an incarnation of a predator's ferocity, a storm's fury, and a sea's turmoil. Barbarians often serve as protectors and leaders in their communities, charging headlong into danger so those under their protection don't have to.",
  srd: "https://www.dnddeutsch.de/srd/character/classes/barbarian/",
  progressionHeaders: ["Lv","PB","Class Features","Rages","Rage Dmg","Wpn Mastery"],
  progressionRows: [
    ["1","+2","Rage, Unarmored Defense, Weapon Mastery","2","+2","2"],
    ["2","+2","Danger Sense, Reckless Attack","2","+2","2"],
    ["3","+2","Barbarian Subclass, Primal Knowledge","3","+2","2"],
    ["4","+2","Ability Score Improvement","3","+2","3"],
    ["5","+3","Extra Attack, Fast Movement","3","+2","3"],
    ["6","+3","Subclass feature","4","+2","3"],
    ["7","+3","Feral Instinct, Instinctive Pounce","4","+2","3"],
    ["8","+3","Ability Score Improvement","4","+2","3"],
    ["9","+4","Brutal Strike","4","+3","3"],
    ["10","+4","Subclass feature","4","+3","4"],
    ["11","+4","Relentless Rage","4","+3","4"],
    ["12","+4","Ability Score Improvement","5","+3","4"],
    ["13","+5","Improved Brutal Strike","5","+3","4"],
    ["14","+5","Subclass feature","5","+3","4"],
    ["15","+5","Persistent Rage","5","+3","4"],
    ["16","+5","Ability Score Improvement","5","+4","4"],
    ["17","+6","Improved Brutal Strike","6","+4","4"],
    ["18","+6","Indomitable Might","6","+4","4"],
    ["19","+6","Epic Boon","6","+4","4"],
    ["20","+6","Primal Champion","6","+4","4"],
  ],
  featuresByLevel: {
    1: [
      { name: "Rage", desc: "Bonus Action to enter Rage (if not in Heavy armor). Resistance to Bludgeoning/Piercing/Slashing, Rage Damage bonus on STR-attacks, Advantage on STR-checks/saves, no Concentration/spells. Lasts until end of next turn; extend by attack/save-force/Bonus Action. Max 10 min." },
      { name: "Unarmored Defense", desc: "Without armor, AC = 10 + DEX-mod + CON-mod. Shield allowed." },
      { name: "Weapon Mastery", desc: "Use mastery properties of 2 Simple or Martial Melee weapons. Swap one on Long Rest. Grows to 4-6 weapons via levels." },
    ],
    2: [
      { name: "Danger Sense", desc: "Advantage on DEX saving throws (unless Incapacitated)." },
      { name: "Reckless Attack", desc: "First attack on your turn: Advantage on STR-attacks until next turn — but attacks against you also have Advantage." },
    ],
    3: [
      { name: "Barbarian Subclass", desc: "Choose a Primal Path: Berserker, Wild Heart, World Tree, or Zealot." },
      { name: "Primal Knowledge", desc: "Gain 1 extra Barbarian skill. While raging, may use STR for ability checks with Acrobatics/Intimidation/Perception/Stealth/Survival." },
    ],
    4: [{ name: "Ability Score Improvement", desc: "Take ASI feat or qualifying feat. Also at Lv 8, 12, 16." }],
    5: [
      { name: "Extra Attack", desc: "Attack twice when taking the Attack action." },
      { name: "Fast Movement", desc: "+10 ft Speed when not wearing Heavy armor." },
    ],
    7: [
      { name: "Feral Instinct", desc: "Advantage on Initiative rolls." },
      { name: "Instinctive Pounce", desc: "As part of the Bonus Action to enter Rage, move up to half your Speed." },
    ],
    9: [{ name: "Brutal Strike", desc: "When using Reckless Attack, forgo Advantage on one STR-attack: on hit, extra 1d10 damage + choose 1 effect (Forceful Blow / Hamstring Blow)." }],
    11: [{ name: "Relentless Rage", desc: "When dropped to 0 HP while raging: DC 10 CON-save (+5 per use, resets on rest); on success HP becomes 2× Barbarian level." }],
    13: [{ name: "Improved Brutal Strike", desc: "New Brutal Strike effects: Staggering Blow (target Disadvantage on next save, no OAs) and Sundering Blow (+5 to next attack vs. target by ally)." }],
    15: [{ name: "Persistent Rage", desc: "On Initiative roll, regain ALL Rage uses (1×/long rest). Rage lasts 10 minutes without extension; only ends on Unconscious or Heavy armor." }],
    17: [{ name: "Improved Brutal Strike (II)", desc: "Brutal Strike extra damage increases to 2d10. May use two different effects per strike." }],
    18: [{ name: "Indomitable Might", desc: "If a STR-check/save total is below your STR score, use your STR score instead." }],
    19: [{ name: "Epic Boon", desc: "Gain Epic Boon feat. Boon of Irresistible Offense recommended." }],
    20: [{ name: "Primal Champion", desc: "STR & CON +4 (max 25)." }],
  },
  edition: "2024-PHB",
};

const FIGHTER = {
  id: "kaempfer", name: "Kämpfer", enName: "Fighter", icon: "⚔️",
  hd: "d10", primary: "Strength or Dexterity", saves: "STR & CON",
  armor: "Light, Medium, Heavy, Shields", weapons: "Simple, Martial",
  tools: "—",
  skills: { count: 2, choices: ["Acrobatics","Animal Handling","Athletics","History","Insight","Intimidation","Perception","Persuasion","Survival"] },
  startingEquipment: {
    A: "Chain Mail · Greatsword · Flail · 8 Javelins · Dungeoneer's Pack · 4 GP",
    B: "Studded Leather · Scimitar · Shortsword · Longbow & 20 Arrows · Quiver · Dungeoneer's Pack · 11 GP",
    C: "155 GP",
  },
  spellcasting: null,
  subclassName: "Martial Archetype",
  subclassChoiceLevel: 3,
  subclasses: ["Battle Master","Champion","Eldritch Knight","Psi Warrior"],
  desc: "Fighters rule many battlefields. Questing knights, royal champions, elite soldiers, and hardened mercenaries — they all share an unparalleled prowess with weapons and armor. Fighters master various weapon techniques and specialize in styles ranging from archery to two-weapon fighting to magical augmentation.",
  srd: "https://www.dnddeutsch.de/srd/character/classes/fighter/",
  progressionHeaders: ["Lv","PB","Class Features","2nd Wind","Wpn Mastery"],
  progressionRows: [
    ["1","+2","Fighting Style, Second Wind, Weapon Mastery","2","3"],
    ["2","+2","Action Surge (1×), Tactical Mind","2","3"],
    ["3","+2","Fighter Subclass","2","3"],
    ["4","+2","Ability Score Improvement","3","4"],
    ["5","+3","Extra Attack, Tactical Shift","3","4"],
    ["6","+3","Ability Score Improvement","3","4"],
    ["7","+3","Subclass feature","3","4"],
    ["8","+3","Ability Score Improvement","3","4"],
    ["9","+4","Indomitable (1×), Tactical Master","3","4"],
    ["10","+4","Subclass feature","4","5"],
    ["11","+4","Two Extra Attacks","4","5"],
    ["12","+4","Ability Score Improvement","4","5"],
    ["13","+5","Indomitable (2×), Studied Attacks","4","5"],
    ["14","+5","Ability Score Improvement","4","5"],
    ["15","+5","Subclass feature","4","5"],
    ["16","+5","Ability Score Improvement","4","6"],
    ["17","+6","Action Surge (2×), Indomitable (3×)","4","6"],
    ["18","+6","Subclass feature","4","6"],
    ["19","+6","Epic Boon","4","6"],
    ["20","+6","Three Extra Attacks","4","6"],
  ],
  featuresByLevel: {
    1: [
      { name: "Fighting Style", desc: "Gain a Fighting Style feat (Defense recommended). Swappable on level-up." },
      { name: "Second Wind", desc: "Bonus Action: regain 1d10 + Fighter level HP. 2 uses, recharge 1 on Short Rest, all on Long Rest. Scales to 3 (Lv5) and 4 (Lv10)." },
      { name: "Weapon Mastery", desc: "Use mastery of 3 weapons (Simple or Martial). Swap one per Long Rest. Grows to 4-6." },
    ],
    2: [
      { name: "Action Surge", desc: "Take 1 additional action (not Magic) on your turn. 1 use, recharges on Short/Long Rest. 2 uses at Lv17." },
      { name: "Tactical Mind", desc: "On failed ability check, spend Second Wind use: roll 1d10, add to check. If still failed, use is not consumed." },
    ],
    3: [{ name: "Fighter Subclass", desc: "Choose: Battle Master, Champion, Eldritch Knight, or Psi Warrior." }],
    4: [{ name: "Ability Score Improvement", desc: "ASI or feat. Also Lv 6, 8, 12, 14, 16." }],
    5: [
      { name: "Extra Attack", desc: "Attack twice with Attack action." },
      { name: "Tactical Shift", desc: "When Second Wind activated as Bonus Action, move up to half Speed without provoking OAs." },
    ],
    9: [
      { name: "Indomitable", desc: "Reroll a failed saving throw. 1 use; 2 at Lv13, 3 at Lv17. Recharges on Long Rest." },
      { name: "Tactical Master", desc: "When attacking with a weapon whose mastery you use: replace property with Push/Sap/Slow for that attack." },
    ],
    11: [{ name: "Two Extra Attacks", desc: "Attack 3 times with Attack action." }],
    13: [{ name: "Studied Attacks", desc: "When you miss an attack: Advantage on next attack against same creature before end of next turn." }],
    19: [{ name: "Epic Boon", desc: "Gain Epic Boon feat. Boon of Combat Prowess recommended." }],
    20: [{ name: "Three Extra Attacks", desc: "Attack 4 times with Attack action." }],
  },
  edition: "2024-PHB",
};

const PALADIN = {
  id: "paladin", name: "Paladin", enName: "Paladin", icon: "🛡️",
  hd: "d10", primary: "Strength & Charisma", saves: "WIS & CHA",
  armor: "Light, Medium, Heavy, Shields", weapons: "Simple, Martial",
  tools: "—",
  skills: { count: 2, choices: ["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"] },
  startingEquipment: {
    A: "Chain Mail · Shield · Longsword · 6 Javelins · Holy Symbol · Priest's Pack · 9 GP",
    B: "150 GP",
  },
  spellcasting: {
    ability: "CHA",
    focus: "Holy Symbol",
    progression: "half",
    prepared: true,
    cantrips: false,
  },
  subclassName: "Sacred Oath",
  subclassChoiceLevel: 3,
  subclasses: ["Oath of Devotion","Oath of Glory","Oath of the Ancients","Oath of Vengeance"],
  desc: "Paladins are united by their oaths to stand against the forces of annihilation and corruption. A Paladin's oath is a powerful bond — a source of power that turns a devout warrior into a blessed champion. They wield magical power to heal the injured, smite their foes, and protect the helpless.",
  srd: "https://www.dnddeutsch.de/srd/character/classes/paladin/",
  progressionHeaders: ["Lv","PB","Class Features","CD","Prepared","S1","S2","S3","S4","S5"],
  progressionRows: [
    ["1","+2","Lay On Hands, Spellcasting, Weapon Mastery","—","2","2","—","—","—","—"],
    ["2","+2","Fighting Style, Paladin's Smite","—","3","2","—","—","—","—"],
    ["3","+2","Channel Divinity, Paladin Subclass","2","4","3","—","—","—","—"],
    ["4","+2","Ability Score Improvement","2","5","3","—","—","—","—"],
    ["5","+3","Extra Attack, Faithful Steed","2","6","4","2","—","—","—"],
    ["6","+3","Aura of Protection","2","6","4","2","—","—","—"],
    ["7","+3","Subclass feature","2","7","4","3","—","—","—"],
    ["8","+3","Ability Score Improvement","2","7","4","3","—","—","—"],
    ["9","+4","Abjure Foes","2","9","4","3","2","—","—"],
    ["10","+4","Aura of Courage","2","9","4","3","2","—","—"],
    ["11","+4","Radiant Strike","3","10","4","3","3","—","—"],
    ["12","+4","Ability Score Improvement","3","10","4","3","3","—","—"],
    ["13","+5","—","3","11","4","3","3","1","—"],
    ["14","+5","Restoring Touch","3","11","4","3","3","1","—"],
    ["15","+5","Subclass feature","3","12","4","3","3","2","—"],
    ["16","+5","Ability Score Improvement","3","12","4","3","3","2","—"],
    ["17","+6","—","3","14","4","3","3","3","1"],
    ["18","+6","Aura Expansion","3","14","4","3","3","3","1"],
    ["19","+6","Epic Boon","3","15","4","3","3","3","2"],
    ["20","+6","Subclass feature","3","15","4","3","3","3","2"],
  ],
  featuresByLevel: {
    1: [
      { name: "Lay On Hands", desc: "Pool = Paladin level × 5 HP. Bonus Action: touch creature, heal up to pool. 5 HP cures Poisoned (without healing). Pool restores on Long Rest." },
      { name: "Spellcasting", desc: "Prepared casting; CHA-based. Holy Symbol as Focus. Prepare list grows from 2 (Lv1) to 15 (Lv19). Swap 1 on Long Rest." },
      { name: "Weapon Mastery", desc: "Use mastery of 2 weapons of your choice. Swap on Long Rest." },
    ],
    2: [
      { name: "Fighting Style", desc: "Gain Fighting Style feat. Blessed Warrior (Cleric cantrips) is recommended." },
      { name: "Paladin's Smite", desc: "Always have Divine Smite prepared. May cast it without a spell slot once per Long Rest." },
    ],
    3: [
      { name: "Channel Divinity", desc: "Channel divine energy. Start with Divine Sense. Subclass adds more. 2 uses (3 at Lv11); recharge 1 on Short Rest, all on Long Rest." },
      { name: "Paladin Subclass", desc: "Choose: Devotion, Glory, Ancients, or Vengeance." },
    ],
    4: [{ name: "Ability Score Improvement", desc: "ASI or feat. Also Lv 8, 12, 16." }],
    5: [
      { name: "Extra Attack", desc: "Attack twice with Attack action." },
      { name: "Faithful Steed", desc: "Always have Find Steed prepared. Cast it without a spell slot once per Long Rest." },
    ],
    6: [{ name: "Aura of Protection", desc: "10-ft aura: you and allies add CHA-mod to saving throws (min +1). Grows to 30 ft at Lv18." }],
    9: [{ name: "Abjure Foes", desc: "Use Channel Divinity: 30-ft Emanation, up to CHA-mod creatures must save vs Frightened + can't take Reactions for 1 minute." }],
    10: [{ name: "Aura of Courage", desc: "You and allies within aura can't be Frightened." }],
    11: [{ name: "Radiant Strike", desc: "When you hit with a weapon attack, deal +1d8 Radiant damage." }],
    14: [{ name: "Restoring Touch", desc: "Lay on Hands can also cure Blinded/Deafened/Paralyzed/Stunned for 5 HP each." }],
    18: [{ name: "Aura Expansion", desc: "Auras extend to 30 ft (from 10 ft)." }],
    19: [{ name: "Epic Boon", desc: "Gain Epic Boon feat. Boon of Truesight recommended." }],
  },
  edition: "2024-PHB",
};

const RANGER = {
  id: "waldlaeufer", name: "Waldläufer", enName: "Ranger", icon: "🏹",
  hd: "d10", primary: "Dexterity & Wisdom", saves: "STR & DEX",
  armor: "Light, Medium, Shields", weapons: "Simple, Martial",
  tools: "—",
  skills: { count: 3, choices: ["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"] },
  startingEquipment: {
    A: "Studded Leather · Scimitar · Shortsword · Longbow & 20 Arrows · Quiver · Druidic Focus · Explorer's Pack · 7 GP",
    B: "150 GP",
  },
  spellcasting: {
    ability: "WIS",
    focus: "Druidic Focus",
    progression: "half",
    prepared: true,
    cantrips: false,
  },
  subclassName: "Ranger Conclave",
  subclassChoiceLevel: 3,
  subclasses: ["Beast Master","Fey Wanderer","Gloom Stalker","Hunter"],
  desc: "Rangers keep their unending watch in the wilderness — tracking quarry, moving stealthily, and harnessing primal powers through spells. A Ranger's talents and magic are honed with deadly focus to protect the world from the ravages of monsters and tyrants.",
  srd: "https://www.dnddeutsch.de/srd/character/classes/ranger/",
  progressionHeaders: ["Lv","PB","Class Features","Fav. Enemy","Prep.","S1","S2","S3","S4","S5"],
  progressionRows: [
    ["1","+2","Spellcasting, Favored Enemy, Weapon Mastery","2","2","2","—","—","—","—"],
    ["2","+2","Deft Explorer, Fighting Style","2","3","2","—","—","—","—"],
    ["3","+2","Ranger Subclass","2","4","3","—","—","—","—"],
    ["4","+2","Ability Score Improvement","2","5","3","—","—","—","—"],
    ["5","+3","Extra Attack","3","6","4","2","—","—","—"],
    ["6","+3","Roving","3","6","4","2","—","—","—"],
    ["7","+3","Subclass feature","3","7","4","3","—","—","—"],
    ["8","+3","Ability Score Improvement","3","7","4","3","—","—","—"],
    ["9","+4","Expertise","4","9","4","3","2","—","—"],
    ["10","+4","Tireless","4","9","4","3","2","—","—"],
    ["11","+4","Subclass feature","4","10","4","3","3","—","—"],
    ["12","+4","Ability Score Improvement","4","10","4","3","3","—","—"],
    ["13","+5","Relentless Hunter","5","11","4","3","3","1","—"],
    ["14","+5","Nature's Veil","5","11","4","3","3","1","—"],
    ["15","+5","Subclass feature","5","12","4","3","3","2","—"],
    ["16","+5","Ability Score Improvement","5","12","4","3","3","2","—"],
    ["17","+6","Precise Hunter","6","14","4","3","3","3","1"],
    ["18","+6","Feral Senses","6","14","4","3","3","3","1"],
    ["19","+6","Epic Boon","6","15","4","3","3","3","2"],
    ["20","+6","Foe Slayer","6","15","4","3","3","3","2"],
  ],
  featuresByLevel: {
    1: [
      { name: "Spellcasting", desc: "Prepared casting; WIS-based. Druidic Focus. Always have Hunter's Mark. Learn 2 Druid cantrips (Guidance, Starry Wisp recommended)." },
      { name: "Favored Enemy", desc: "Hunter's Mark always prepared, cast 2× without a slot (uses scale to 6 at Lv17). Recharges on Long Rest." },
      { name: "Weapon Mastery", desc: "Use mastery of 2 weapons. Swap on Long Rest." },
    ],
    2: [
      { name: "Deft Explorer", desc: "Expertise in 1 of your skills. Learn 2 languages." },
      { name: "Fighting Style", desc: "Gain Fighting Style feat. Druidic Warrior (Druid cantrips) is recommended." },
    ],
    3: [{ name: "Ranger Subclass", desc: "Choose: Beast Master, Fey Wanderer, Gloom Stalker, or Hunter." }],
    4: [{ name: "Ability Score Improvement", desc: "ASI or feat. Also Lv 8, 12, 16." }],
    5: [{ name: "Extra Attack", desc: "Attack twice with Attack action." }],
    6: [{ name: "Roving", desc: "+10 ft Speed. Climb Speed and Swim Speed = Speed." }],
    9: [{ name: "Expertise", desc: "Expertise in 2 more skills." }],
    10: [{ name: "Tireless", desc: "Bonus Action: gain Temp HP = 1d8 + WIS-mod, PB-times per Long Rest. Reduce Exhaustion by 1 on Short Rest." }],
    13: [{ name: "Relentless Hunter", desc: "Taking damage doesn't break Concentration on Hunter's Mark." }],
    14: [{ name: "Nature's Veil", desc: "Bonus Action: become Invisible until end of next turn. PB-times per Long Rest." }],
    17: [{ name: "Precise Hunter", desc: "Advantage on attack rolls against target marked by Hunter's Mark." }],
    18: [{ name: "Feral Senses", desc: "Blindsight 30 ft." }],
    19: [{ name: "Epic Boon", desc: "Gain Epic Boon feat. Boon of Dimensional Travel recommended." }],
    20: [{ name: "Foe Slayer", desc: "Once per turn: deal extra damage = WIS-mod (min 1) to one target." }],
  },
  edition: "2024-PHB",
};

// ─── Legacy classes (still on 2014 schema — refresh in Phase 2 bundles B-D) ──
const LEGACY_CLASSES = [
  {id:"barde",name:"Barde",icon:"🎶",hd:"W8",primary:"Charisma",saves:"DEX & CHA",armor:"Leicht",weapons:"Einfach, Hand-Armbrust, Langschwert, Rapier, Kurzschwert",tools:"3 Musikinstrumente",skills:"Drei deiner Wahl",desc:"Meister der Worte, Musik und Magie zugleich. Barden ziehen ihre arkane Kraft aus leidenschaftlichem Ausdruck und inspirieren Verbündete mit mythischen Geschichten und bardischer Inspiration.",archetypes:["Schule des Wissens","Schule der Tapferkeit","Schule der Schwerter","Schule der Verzauberung","Schule der Schöpfung","Schule der Eloquenz","Schule der Geister","Schule des Wagemuts","Schule des Zauberbanns"],srd:"https://www.dnddeutsch.de/srd/character/classes/bard/",table:[["1","+2","Zauberwirken, Bardische Inspiration (W6)"],["3","+2","Bardenschule, Expertise"],["5","+3","Bardische Inspiration (W8)"],["10","+4","Bardische Inspiration (W10), Magische Geheimnisse"],["20","+6","Überlegene Inspiration"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"druide",name:"Druide",icon:"🌿",hd:"W8",primary:"Weisheit",saves:"INT & WIS",armor:"Leicht, Mittel, Schilde (kein Metall)",weapons:"Knüppel, Dolch, Kampfstab, Sichel, Schleuder, Speer",tools:"Kräuterkundeausrüstung",skills:"Wähle 2: Arkane Kunde, Heilkunde, Tiere, Motiv, Naturkunde, Religion, Wahrnehmung, Überleben",desc:"Hüter der natürlichen Ordnung mit Zugang zu uralter Primärmagie. Druiden können die Gestalt von Tieren annehmen (Tiergestalt), Stürme beschwören und das Wachstum der Erde lenken.",archetypes:["Zirkel des Mondes","Zirkel des Landes","Zirkel der Sporen","Zirkel der Sterne","Zirkel des Wildfeuers","Zirkel des Hirten"],srd:"https://www.dnddeutsch.de/srd/character/classes/druid/",table:[["1","+2","Druidisch, Zauberwirken"],["2","+2","Tiergestalt, Druidenzirkel"],["18","+6","Zeitloser Körper"],["20","+6","Erzdruide"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"hexenmeister",name:"Hexenmeister",icon:"👁️",hd:"W8",primary:"Charisma",saves:"WIS & CHA",armor:"Leicht",weapons:"Einfach",tools:"keine",skills:"Wähle 2: Arkane Kunde, Einschüchterung, Geschichte, Nachforschung, Naturkunde, Religion, Täuschung",desc:"Magiekundige, die einen dunklen Pakt mit mächtigen übernatürlichen Wesen geschlossen haben. Ihre Macht ist begrenzt, aber intensiv – Hexenmeister verfügen über wenige Zauberplätze, die sich jedoch nach jeder kurzen Rast erneuern.",archetypes:["Der Abgründige","Der Dschinn","Die Fluchklinge","Der Große Alte","Der Himmlische","Der Unhold","Der Unsterbliche","Der Untote","Erzfeen"],srd:"https://www.dnddeutsch.de/srd/character/classes/warlock/",table:[["1","+2","Andersweltl. Schutzherr, Paktmagie"],["2","+2","Schauerliche Anrufungen"],["11","+4","Mystisches Arkanum (6te)"],["20","+6","Mystischer Meister"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"kleriker",name:"Kleriker",icon:"✝️",hd:"W8",primary:"Weisheit",saves:"WIS & CHA",armor:"Leicht, Mittel, Schilde",weapons:"Einfach",tools:"keine",skills:"Wähle 2: Geschichte, Heilkunde, Motiv, Religion, Überzeugen",desc:"Heilige Streiter, die göttliche Macht direkt von ihren Göttern empfangen. Kleriker verbinden starke Heilmagie mit direktem Kampf und können durch Göttliche Macht Untote vertreiben.",archetypes:["Domäne des Lebens","Domäne des Krieges","Domäne der Natur","Domäne des Wissens","Domäne der List","Domäne der Dämmerung","Domäne des Friedens","Domäne des Grabes","Domäne der Ordnung","Domäne des Sturms"],srd:"https://www.dnddeutsch.de/srd/character/classes/cleric/",table:[["1","+2","Zauberwirken, Göttliche Domäne"],["2","+2","Göttliche Macht fokussieren"],["10","+4","Göttliche Intervention"],["20","+6","Verbesserte Göttliche Intervention"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"magier",name:"Magier",icon:"🔮",hd:"W6",primary:"Intelligenz",saves:"INT & WIS",armor:"keine",weapons:"Dolch, Wurfpfeil, Schleuder, Kampfstab, Leichte Armbrust",tools:"keine",skills:"Wähle 2: Arkane Kunde, Geschichte, Heilkunde, Motiv, Nachforschung, Religion",desc:"Akademiker der arkanen Künste mit dem breitesten Zauberspektrum aller Klassen. Magier lernen Zauber aus Schriftrollen und Büchern – ihr Zauberbuch ist ihr wertvollstes Gut.",archetypes:["Schule der Bannmagie","Schule der Erkenntnismagie","Schule der Hervorrufung","Schule der Illusion","Schule der Verzauberung","Schule der Verwandlung","Schule der Nekromantie","Schule der Beschwörung","Klingengesang","Kriegsmagie","Orden der Schreiber"],srd:"https://www.dnddeutsch.de/srd/character/classes/wizard/",table:[["1","+2","Zauberwirken, Arkane Erholung"],["2","+2","Arkane Tradition"],["18","+6","Zaubermeisterschaft"],["20","+6","Signaturzauber"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"moench",name:"Mönch",icon:"👊",hd:"W8",primary:"DEX & WIS",saves:"STR & DEX",armor:"keine",weapons:"Einfach, Kurzschwert",tools:"1 Handwerkszeug oder Instrument",skills:"Wähle 2: Akrobatik, Athletik, Geschichte, Motiv, Religion, Verbergen",desc:"Kriegerische Asketen, die durch jahrelange Disziplin Ki-Energie bündeln. Mönche kämpfen unbewaffnet mit tödlicher Präzision, brauchen weder Rüstung noch Waffe und können übernatürliche Fähigkeiten einsetzen.",archetypes:["Weg der offenen Hand","Weg des Schattens","Weg der vier Elemente","Weg des betrunkenen Meisters","Weg des langen Todes"],srd:"https://www.dnddeutsch.de/srd/character/classes/monk/",table:[["1","+2","Ungerüstete Verteidigung, Kampfkünste"],["2","+2","Ki, Ungerüstete Bewegung"],["5","+3","Betäubender Schlag, Extra-Angriff"],["20","+6","Vollkommenes Selbst"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"schurke",name:"Schurke",icon:"🗡️",hd:"W8",primary:"Geschicklichkeit",saves:"DEX & INT",armor:"Leicht",weapons:"Einfach, Hand-Armbrust, Langschwert, Rapier, Kurzschwert",tools:"Diebeswerkzeug",skills:"Wähle 4 aus: Akrobatik, Athletik, Einschüchterung, Geschichte, Motiv, Nachforschung, Täuschung, Überzeugen, Taschenspielertricks, Wahrnehmung, Verbergen, Auftreten",desc:"Meister der List, Täuschung und chirurgischer Präzisionsangriffe. Der Hinterhältige Angriff vervielfacht den Schaden bei Überraschungsangriffen oder mit Vorteil drastisch.",archetypes:["Dieb","Assassine","Arkaner Trickser","Phantom","Seelenmesser","Scharlatan","Spion","Unberechenbarer"],srd:"https://www.dnddeutsch.de/srd/character/classes/rogue/",table:[["1","+2","Expertise, Hinterhältiger Angriff 1W6"],["3","+2","Ganoventrick"],["5","+3","Unverbesserlicher Instinkt"],["11","+4","Zuverlässiges Talent"],["20","+6","Schlagtöter, Hinterhältiger Angriff 10W6"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"zauberer",name:"Zauberer",icon:"✨",hd:"W6",primary:"Charisma",saves:"CON & CHA",armor:"keine",weapons:"Dolch, Darts, Schleuder, Kampfstab, Leichte Armbrust",tools:"keine",skills:"Wähle 2: Arkane Kunde, Einschüchterung, Geschichte, Nachforschung, Religion, Täuschung, Überzeugen",desc:"Angeborene Zauberer mit magischem Blut in den Adern. Im Gegensatz zum Magier studiert der Zauberer nicht – er entfesselt Magie, die schon immer in ihm schlummerte.",archetypes:["Drachenblut","Wilde Magie","Abgrundmagie","Göttliche Seele","Schattenmagie","Sturmmagie","Uhrwerkseele"],srd:"https://www.dnddeutsch.de/srd/character/classes/sorcerer/",table:[["1","+2","Zauberwirken, Zaubereiursprung"],["3","+2","Metamagie"],["20","+6","Schwindelerregender Zauber"]],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
  {id:"magieschmied",name:"Magieschmied",icon:"⚙️",hd:"W8",primary:"Intelligenz",saves:"CON & INT",armor:"Leicht, Mittel, Schilde",weapons:"Einfach",tools:"Diebeswerkzeug, Handwerkerausrüstung, 1 Spezialwerkzeug",skills:"Wähle 2: Arkane Kunde, Geschichte, Motiv, Nachforschung, Religion, Naturkunde",desc:"Handwerker der arkanen Schmiede, die magische Gegenstände erschaffen und Verbündete mit Infusionen ausrüsten. Als einziger Halbzauberer mit allen Rüstungsprofizenzen verbinden Magieschmiede Intelligenz mit Kampfstärke.",archetypes:["Alchemist","Artillerist","Kampfschmied"],srd:"https://www.dnddeutsch.de/srd/character/classes/artificer/",table:[["1","+2","Magisches Basteln, Zauberwirken"],["2","+2","Infusionen"],["3","+2","Artifizient-Spezialisierung"],["5","+3","Extra-Angriff"],["20","+6","Seele der Artefakthändler"],],tableHead:["Stufe","ÜB","Merkmale"],edition:"2014-LEGACY"},
];

export const D3_KLASSEN = [
  BARBARIAN, ...LEGACY_CLASSES.filter(c => c.id === "barde"),
  ...LEGACY_CLASSES.filter(c => c.id === "druide"),
  ...LEGACY_CLASSES.filter(c => c.id === "hexenmeister"),
  FIGHTER,
  ...LEGACY_CLASSES.filter(c => c.id === "kleriker"),
  ...LEGACY_CLASSES.filter(c => c.id === "magier"),
  ...LEGACY_CLASSES.filter(c => c.id === "moench"),
  PALADIN,
  ...LEGACY_CLASSES.filter(c => c.id === "schurke"),
  RANGER,
  ...LEGACY_CLASSES.filter(c => c.id === "zauberer"),
  ...LEGACY_CLASSES.filter(c => c.id === "magieschmied"),
];

// ─── Helper: detect 2024 schema ──────────────────────────────────────────────
export const is2024Class = (klass) => klass?.edition === "2024-PHB";
