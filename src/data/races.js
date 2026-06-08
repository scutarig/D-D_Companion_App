// ─────────────────────────────────────────────────────────────────────────────
// races.js — D&D 5e 2024 PHB Species + 2014 Legacy
//
// 2024 REFORM:
// - KEINE Ability Score Increases (ASI) an Species! ASI kommt aus dem Background.
// - "Race" → "Species" umbenannt
// - Sub-Races zu Lineages innerhalb der Hauptrasse umgebaut
// - Half-Elf und Half-Orc sind raus (Legacy 2014)
// - Goliath + Orc + Aasimar sind jetzt Core (PHB 2024)
//
// LEGACY (2014):
// Hochelf, Waldelf, Drow, Berg/Hügelzwerg, Halbelfe, Halbork, Aarakocra,
// Wasserkind (Genasi), Triton, Yuan-ti, Tiefling-Varianten — bleiben als
// "Legacy 2014" verfügbar, sind aber NICHT mehr 2024 PHB Core.
// ─────────────────────────────────────────────────────────────────────────────

export const DND_RACES = [
  // ── 2024 PHB Core Species ──────────────────────────────────────────────────
  {name:"Mensch",edition:"2024",traits:["Findig (Heroische Inspiration nach langer Rast)","Geübt (1 Fertigkeit deiner Wahl)","Vielseitig (1 Origin-Feat)"],speed:30,size:"Mittel oder Klein",desc:"Die vielseitigste und verbreitetste Species. Im PHB 2024 ohne Attributs-Boni (diese kommen vom Background). Resourceful + Skillful + Versatile machen den Menschen zur freistens wählbaren Origin-Klasse. Heroische Inspiration nach jeder langen Rast ist mechanisch extrem stark."},
  {name:"Aasimar",edition:"2024",traits:["Dunkelsicht 60ft","Resistenz Nekrose + Strahlend","Healing Hands (PB×W4 HP)","Light-Cantrip","Celestial Revelation @Lv3 (Wings/Inner Radiance/Necrotic Shroud)"],speed:30,size:"Mittel oder Klein",desc:"Mortale mit himmlischem Funken. 2024 PHB Core (war Volo's). Healing Hands skaliert mit Proficiency Bonus (PB W4). Auf Lv3 erhältst du Celestial Revelation: 3 Transformationen zur Wahl (jede 1×/Long Rest, 1 Min)."},
  {name:"Dragonborn",edition:"2024",traits:["Drachen-Abstammung (Wahl 10 Typen)","Atemwaffe (Attack-Replacement, 1d10→4d10)","Resistenz (je nach Ancestry)","Dunkelsicht 60ft","Draconic Flight @Lv5 (10 Min Fluggeschwindigkeit, 1×/LR)"],speed:30,size:"Mittel",desc:"Bipedale Drachen-Nachkommen. 2024 Atemwaffe ersetzt einen Angriff (statt eigene Aktion). Skaliert: 1d10 (Lv1), 2d10 (Lv5), 3d10 (Lv11), 4d10 (Lv17). NEU 2024: Draconic Flight auf Lv5 — spektrale Flügel für 10 Minuten."},
  {name:"Dwarf",edition:"2024",traits:["Dunkelsicht 120ft","Dwarven Resilience (Resistenz Gift + Vorteil vs Poisoned)","Dwarven Toughness (+1 HP/Level)","Stonecunning (Tremorsense 60ft, PB×/LR)"],speed:30,size:"Mittel",desc:"Robuste Bewohner unterirdischer Reiche. 2024: Sub-Races (Hill/Mountain) entfallen — alle Zwerge erhalten Dwarven Toughness (+1 HP/Level, vorher nur Hill). Stonecunning ist jetzt Tremorsense 60ft als Bonus-Aktion. Speed 30ft (war 2014: 25ft)."},
  {name:"Elf",edition:"2024",traits:["Dunkelsicht 60ft","Elven Lineage (Drow/High/Wood) mit Spells auf Lv1+3+5","Fey Ancestry (Vorteil vs Charmed)","Keen Senses (Insight/Perception/Survival)","Trance (Long Rest in 4h)"],speed:30,size:"Mittel",desc:"Magische, langlebige Wesen. 2024: Sub-Races zu Lineages umgebaut. Drow = Dancing Lights + Faerie Fire (L3) + Darkness (L5), 120ft Darkvision. High Elf = Prestidigitation + Detect Magic + Misty Step. Wood Elf = Druidcraft + Longstrider + Pass without Trace, Speed 35ft."},
  {name:"Gnome",edition:"2024",traits:["Dunkelsicht 60ft","Gnomish Cunning (Vorteil INT/WIS/CHA-Saves)","Gnomish Lineage (Forest/Rock)"],speed:30,size:"Klein",desc:"Erfinderische Kleinlinge. 2024: Gnomish Cunning gibt Vorteil auf INT/WIS/CHA-Saves gegen ALLES (war 2014: nur gegen Magie). Forest Gnome Lineage = Minor Illusion + Speak with Animals (immer prepared). Rock Gnome = Mending + Prestidigitation + Clockwork Device. Speed 30ft (war 25ft)."},
  {name:"Goliath",edition:"2024",traits:["Giant Ancestry (Cloud/Fire/Frost/Hill/Stone/Storm)","Powerful Build (Vorteil Grapple-Saves, +1 Größenkategorie Traglast)","Large Form @Lv5 (Größe Large, Vorteil STR-Checks, +10ft Speed, 10 Min)","Speed 35ft"],speed:35,size:"Mittel",desc:"Riesen-Nachkommen. 2024 PHB Core (war SCAG). 6 Giant Ancestry Optionen: Cloud (Teleport 30ft), Fire (+1d10 Feuer), Frost (+1d6 Kälte + Speed -10), Hill (Prone bei Treffer), Stone (Reaction +CON+1d12 Schaden reduzieren), Storm (Reaction 1d8 Donner). Alle PB×/LR. Lv5: Large Form."},
  {name:"Halfling",edition:"2024",traits:["Brave (Vorteil vs Frightened)","Halfling Nimbleness (durch größere Wesen bewegen)","Luck (Reroll 1 auf d20)","Naturally Stealthy (Hide hinter größeren Wesen)","Speed 30ft"],speed:30,size:"Klein",desc:"Glückliche Kleinlinge. 2024: Lightfoot/Stout entfallen — alle Halflings haben alle Traits. Speed jetzt 30ft (war 25ft). Naturally Stealthy: Verstecken hinter Wesen größer als du."},
  {name:"Orc",edition:"2024",traits:["Adrenaline Rush (Bonus-Aktion Dash + PB Temp HP, PB×/SR)","Dunkelsicht 120ft","Powerful Build (Vorteil Grapple-Saves, +1 Größenkategorie Traglast)","Relentless Endurance (1×/LR bei 0 HP → 1 HP)"],speed:30,size:"Mittel",desc:"Krieger mit Gruumsh-Erbe. 2024 PHB Core (war Volo's). Adrenaline Rush skaliert: PB-mal pro Short/Long Rest. Powerful Build wie Goliath. 120ft Darkvision (besser als Dwarves' 120ft hier ebenso)."},
  {name:"Tiefling",edition:"2024",traits:["Dunkelsicht 60ft","Fiendish Legacy (Abyssal/Chthonic/Infernal) mit Spells auf Lv1+3+5","Otherworldly Presence (Thaumaturgy-Cantrip)"],speed:30,size:"Mittel oder Klein",desc:"Mit Fiend-Blut verbunden. 2024: 3 Legacies. Abyssal = Resistenz Gift + Poison Spray, dann Ray of Sickness + Hold Person. Chthonic = Resistenz Nekrose + Chill Touch, dann False Life + Ray of Enfeeblement. Infernal = Resistenz Feuer + Fire Bolt, dann Hellish Rebuke + Darkness."},

  // ── Legacy 2014 Sub-Variants (eigentlich Lineages in 2024) ─────────────────
  {name:"Hochelf (2014)",edition:"2014",legacy:true,traits:["DEX +2, INT +1","Dunkelsicht 60ft","Fey-Abstammung","1 Zauberer-Cantrip","Extra Sprache"],speed:30,size:"Mittel",desc:"(2014 Legacy) In 2024 als High Elf Lineage innerhalb der Elf-Species verfügbar. Boni: Prestidigitation-Cantrip + Lv3 Detect Magic + Lv5 Misty Step."},
  {name:"Waldelfe (2014)",edition:"2014",legacy:true,traits:["DEX +2, WIS +1","Dunkelsicht 60ft","Fey-Abstammung","Speed 35ft","Maske der Wildnis"],speed:35,size:"Mittel",desc:"(2014 Legacy) In 2024 als Wood Elf Lineage. Boni: Druidcraft-Cantrip + Lv3 Longstrider + Lv5 Pass without Trace."},
  {name:"Dunkelelf (Drow) (2014)",edition:"2014",legacy:true,traits:["DEX +2, CHA +1","Dunkelsicht 120ft","Fey-Abstammung","Angeborene Zauber","Sonnenlicht-Empfindlichkeit"],speed:30,size:"Mittel",desc:"(2014 Legacy) In 2024 als Drow Lineage. Boni: Dancing Lights + Lv3 Faerie Fire + Lv5 Darkness. NEU 2024: Keine Sunlight Sensitivity mehr!"},
  {name:"Bergzwerg (2014)",edition:"2014",legacy:true,traits:["STR +2, CON +2","Dunkelsicht 60ft","Zwerg-Robustheit","Mittlere Rüstungs-Profizienz"],speed:25,size:"Mittel",desc:"(2014 Legacy) In 2024 entfällt die Mountain-Sub-Race komplett. Stattdessen wähle Dwarf + nimm Soldat-Background für STR+CON-Boni und Rüstungs-Profizienz."},
  {name:"Hügelzwerg (2014)",edition:"2014",legacy:true,traits:["WIS +1, CON +2","Zähigkeit (+1 HP/Level)","Dunkelsicht 60ft","Zwerg-Robustheit"],speed:25,size:"Mittel",desc:"(2014 Legacy) In 2024 entfällt die Hill-Sub-Race — alle Zwerge haben jetzt Dwarven Toughness (+1 HP/Level), nicht nur Hill."},
  {name:"Halbork (2014)",edition:"2014",legacy:true,traits:["STR +2, CON +1","Dunkelsicht 60ft","Unnachgiebige Ausdauer","Wilde Angriffe"],speed:30,size:"Mittel",desc:"(2014 Legacy) NICHT mehr im 2024 PHB Core. Alternative: Spiele Orc + wähle Outlander/Soldier Background. Oder behalte 2014-Mechaniken."},
  {name:"Halbelfe (2014)",edition:"2014",legacy:true,traits:["CHA +2, 2 weitere +1","Dunkelsicht 60ft","Fey-Abstammung","Vielseitigkeit (2 Skills)"],speed:30,size:"Mittel",desc:"(2014 Legacy) NICHT mehr im 2024 PHB Core. Alternative: Spiele Elf mit Sage/Entertainer Background. Oder behalte 2014-Mechaniken."},

  // ── Legacy 2014 Settings-/Companion-Species ────────────────────────────────
  {name:"Drachen-Geborener (2014)",edition:"2014",legacy:true,traits:["STR +2, CHA +1","Drachen-Abstammung","Atemwaffe","Schadensresistenz"],speed:30,size:"Mittel",desc:"(2014 Legacy) In 2024 stark überarbeitet als 'Dragonborn'. Hauptunterschiede: 2024 hat Atemwaffe als Attack-Replacement (statt Aktion), Skalierung mit Char-Level, und NEU: Draconic Flight @ Lv5."},
  {name:"Aarakocra (2014)",edition:"2014",legacy:true,traits:["DEX +2, WIS +1","Fluggeschwindigkeit 50ft","Klauenangriff"],speed:25,size:"Mittel",desc:"(EE Player's Companion 2014) NICHT im 2024 PHB Core. Vogelartige Humanoide mit Flug ab Lv1 — von vielen DMs eingeschränkt."},
  {name:"Aasimar (2014)",edition:"2014",legacy:true,traits:["CHA +2","Dunkelsicht 60ft","Heilende Hände","Licht-Träger","Celestialer Widerstand"],speed:30,size:"Mittel",desc:"(Volo's Guide 2014) In 2024 Core und überarbeitet — siehe 'Aasimar' (2024). Hauptunterschied: 2024 hat Healing Hands mit PB×W4 (statt = Level) und 3 Celestial Revelation Forms statt 3 fixe Sub-Races."},
  {name:"Tiefling (2014 Varianten)",edition:"2014",legacy:true,traits:["Wahl: Asmodeus/Baalzebul/Dispater/etc.","Angeborene Zauber je nach Linie"],speed:30,size:"Mittel",desc:"(Mordenkainen's Tome of Foes 2014) NICHT im 2024 PHB Core. 2024 hat stattdessen 3 Legacies (Abyssal/Chthonic/Infernal)."},
  {name:"Wasserkind/Genasi (2014)",edition:"2014",legacy:true,traits:["CON +2, Element +1","Elementare Kräfte (Feuer/Wasser/Erd/Luft)"],speed:30,size:"Mittel",desc:"(EE Player's Companion 2014) NICHT im 2024 PHB Core. Elementare Humanoide in 4 Sub-Varianten."},
  {name:"Triton (2014)",edition:"2014",legacy:true,traits:["STR +1, CON +1, CHA +1","Amphibisch","Kontrolle Luft/Wasser","Kälte-/Feuerresistenz"],speed:30,size:"Mittel",desc:"(Volo's Guide 2014) NICHT im 2024 PHB Core. Meeresvolk für Unterwasser-Kampagnen."},
  {name:"Yuan-ti Pureblood (2014)",edition:"2014",legacy:true,traits:["INT +1, CHA +2","Magieresistenz","Gift-Immunität","Angeborene Schlangenzauber"],speed:30,size:"Mittel",desc:"(Volo's Guide 2014) NICHT im 2024 PHB Core. Schlangenartige Humanoide. Magieresistenz mechanisch sehr stark."},
];

export const ALL_VOELKER = DND_RACES.map(r => r.name);

export const DND_BACKGROUNDS = ["Akolyt","Adliger","Ausgestoßener","Entertainer","Edelmann","Fernhändler","Fischer","Forscher","Gildenmitglied","Gladiator","Handwerker","Heimatloser","Held des Volkes","Krimineller","Matrose","Pirat","Scharlatan","Söldner","Soldat","Stadtbewohner","Waldläufer","Verbrechensopfer","Wanderer","Weiser","Zögling"];

// ── Strukturierte 2024 Species-Daten ─────────────────────────────────────────
// 2024: KEINE statBonuses mehr! Alle auf 0 — ASI kommt vom Background.
// Format pro Species: { id, name, edition, description, statBonuses (alle 0!), speed, size, languages, traits, features, lineages? }
// Format pro Lineage: { id, name, description, traits: [{level, ...}], spells: [{level, name}] }

export const RACES_FULL = [
  {
    id: "human", name: "Mensch", edition: "2024",
    description: "Die vielseitigste Species. 2024 PHB ohne ASI — Boni kommen vom Background.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "1 Sprache (Background)"],
    traits: [
      { id: "human_resourceful", name: "Resourceful", description: "Du erhältst Heroische Inspiration nach jeder langen Rast.", source: "Mensch", category: "trait" },
      { id: "human_skillful", name: "Skillful", description: "Übung in einer Fertigkeit deiner Wahl.", source: "Mensch", category: "trait" },
      { id: "human_versatile", name: "Versatile", description: "Origin-Feat deiner Wahl (Skilled empfohlen). Siehe Feats-Kapitel.", source: "Mensch", category: "trait" },
    ],
    features: [],
  },
  {
    id: "aasimar", name: "Aasimar", edition: "2024",
    description: "Mortale mit himmlischem Funken. 2024 PHB Core.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel oder Klein", languages: ["Gemeinsprache"],
    traits: [
      { id: "aasimar_resistance", name: "Celestial Resistance", description: "Resistenz gegen Nekrose- und Strahlend-Schaden.", source: "Aasimar", category: "trait" },
      { id: "aasimar_darkvision", name: "Dunkelsicht 60ft", description: "Du siehst in Dunkelheit auf 60ft als wäre es Schwachlicht.", source: "Aasimar", category: "trait" },
      { id: "aasimar_healing", name: "Healing Hands", description: "Magic Action: Berühre ein Wesen und würfle PB×W4. Heilt diese HP. 1×/Long Rest.", source: "Aasimar", category: "trait" },
      { id: "aasimar_light", name: "Light Bearer", description: "Du kennst den Light-Cantrip. CHA ist deine Zauberfähigkeit dafür.", source: "Aasimar", category: "trait" },
    ],
    features: [
      { id: "aasimar_revelation", name: "Celestial Revelation (Lv3)", description: "Bonus-Aktion: Transformiere für 1 Min in eine von 3 Formen (Wahl pro Aktivierung): Heavenly Wings (Fly Speed = Speed), Inner Radiance (10ft Bright Light + PB Radiant Schaden/Runde), Necrotic Shroud (Wesen in 10ft: DC CHA oder Frightened). Während Transformation: 1×/Zug PB Bonus-Schaden auf Treffer. 1×/Long Rest.", source: "Aasimar", category: "feature" },
    ],
  },
  {
    id: "dragonborn", name: "Dragonborn", edition: "2024",
    description: "Bipedale Drachen-Nachkommen. 2024: Breath als Attack-Replacement + Flight @ Lv5.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Drachisch"],
    traits: [
      { id: "dragonborn_ancestry", name: "Draconic Ancestry", description: "Wähle Drachentyp (Black/Blue/Brass/Bronze/Copper/Gold/Green/Red/Silver/White) — bestimmt Atemwaffen-Schadenstyp und Resistenz. Schadenstypen: Acid/Lightning/Fire/Lightning/Acid/Fire/Poison/Fire/Cold/Cold.", source: "Dragonborn", category: "trait" },
      { id: "dragonborn_breath", name: "Atemwaffe", description: "Bei Attack-Aktion: Ersetze einen Angriff durch Atemwaffe (15ft Kegel ODER 30ft Linie ×5ft). DC 8+CON+PB DEX-Save. 1d10 (steigt: Lv5→2d10, Lv11→3d10, Lv17→4d10). PB×/Long Rest.", source: "Dragonborn", category: "feature" },
      { id: "dragonborn_resistance", name: "Damage Resistance", description: "Resistenz gegen Schadenstyp deiner Drachen-Abstammung.", source: "Dragonborn", category: "trait" },
      { id: "dragonborn_darkvision", name: "Dunkelsicht 60ft", description: "Dunkelsicht 60ft.", source: "Dragonborn", category: "trait" },
    ],
    features: [
      { id: "dragonborn_flight", name: "Draconic Flight (Lv5)", description: "NEU 2024: Bonus-Aktion: Spektrale Flügel für 10 Min (oder bis du sie einklappst). Fly Speed = Speed. 1×/Long Rest.", source: "Dragonborn", category: "feature" },
    ],
  },
  {
    id: "dwarf", name: "Dwarf", edition: "2024",
    description: "Robuste Bewohner unterirdischer Reiche. 2024: Sub-Races entfallen.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Zwergisch"],
    traits: [
      { id: "dwarf_darkvision", name: "Dunkelsicht 120ft", description: "Du siehst in Dunkelheit auf 120ft als wäre es Schwachlicht.", source: "Dwarf", category: "trait" },
      { id: "dwarf_resilience", name: "Dwarven Resilience", description: "Resistenz gegen Gift + Vorteil auf Saves vs Poisoned.", source: "Dwarf", category: "trait" },
      { id: "dwarf_toughness", name: "Dwarven Toughness", description: "+1 HP-Max + +1 HP-Max bei jedem Level-Up. (Vorher 2014: nur Hill Dwarf)", source: "Dwarf", category: "trait" },
      { id: "dwarf_stonecunning", name: "Stonecunning", description: "Bonus-Aktion: Tremorsense 60ft für 10 Min (Stein berühren erforderlich). PB×/Long Rest.", source: "Dwarf", category: "trait" },
    ],
    features: [],
  },
  {
    id: "elf", name: "Elf", edition: "2024",
    description: "Langlebige magische Wesen. 2024: Sub-Races zu Lineages.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Elfisch"],
    traits: [
      { id: "elf_darkvision", name: "Dunkelsicht 60ft", description: "Dunkelsicht 60ft.", source: "Elf", category: "trait" },
      { id: "elf_lineage", name: "Elven Lineage", description: "Wähle eine Lineage: Drow, High Elf, oder Wood Elf (siehe Lineages). Gibt dir Spells auf Lv1, 3, und 5.", source: "Elf", category: "trait" },
      { id: "elf_fey_ancestry", name: "Fey Ancestry", description: "Vorteil auf Saves gegen Charmed-Zustand.", source: "Elf", category: "trait" },
      { id: "elf_keen_senses", name: "Keen Senses", description: "Übung in Insight, Perception, ODER Survival (Wahl).", source: "Elf", category: "trait" },
      { id: "elf_trance", name: "Trance", description: "Du brauchst keinen Schlaf. Long Rest in 4h Meditation (bei Bewusstsein).", source: "Elf", category: "trait" },
    ],
    features: [],
    lineages: [
      { id: "drow", name: "Drow Lineage", description: "Dunkelsicht erweitert auf 120ft. Spells: Dancing Lights (Cantrip), Faerie Fire (Lv3, 1×/LR), Darkness (Lv5, 1×/LR). INT/WIS/CHA Spellcasting." },
      { id: "high_elf", name: "High Elf Lineage", description: "Spells: Prestidigitation (Cantrip, austauschbar mit Wizard-Cantrip nach Long Rest), Detect Magic (Lv3, 1×/LR), Misty Step (Lv5, 1×/LR). INT/WIS/CHA Spellcasting." },
      { id: "wood_elf", name: "Wood Elf Lineage", description: "Speed steigt auf 35ft. Spells: Druidcraft (Cantrip), Longstrider (Lv3, 1×/LR), Pass without Trace (Lv5, 1×/LR). INT/WIS/CHA Spellcasting." },
    ],
  },
  {
    id: "gnome", name: "Gnome", edition: "2024",
    description: "Erfinderische Kleinlinge. 2024: Cunning gegen ALLES (nicht nur Magie).",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Klein", languages: ["Gemeinsprache", "Gnomisch"],
    traits: [
      { id: "gnome_darkvision", name: "Dunkelsicht 60ft", description: "Dunkelsicht 60ft.", source: "Gnome", category: "trait" },
      { id: "gnome_cunning", name: "Gnomish Cunning", description: "Vorteil auf alle INT/WIS/CHA-Saves (war 2014: nur gegen Magie).", source: "Gnome", category: "trait" },
      { id: "gnome_lineage", name: "Gnomish Lineage", description: "Wähle Forest Gnome oder Rock Gnome (siehe Lineages).", source: "Gnome", category: "trait" },
    ],
    features: [],
    lineages: [
      { id: "forest_gnome", name: "Forest Gnome Lineage", description: "Minor Illusion Cantrip + Speak with Animals immer prepared (PB×/LR ohne Slot, oder mit Slot)." },
      { id: "rock_gnome", name: "Rock Gnome Lineage", description: "Mending + Prestidigitation Cantrips. Kann 10-Min-Prestidigitation in Tiny Clockwork Device (AC5, 1HP) verwandeln — bis zu 3 gleichzeitig." },
    ],
  },
  {
    id: "goliath", name: "Goliath", edition: "2024",
    description: "Riesen-Nachkommen. 2024 PHB Core (war SCAG). Wähle eine von 6 Giant Ancestries.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 35, size: "Mittel", languages: ["Gemeinsprache", "Riesisch"],
    traits: [
      { id: "goliath_ancestry", name: "Giant Ancestry", description: "Wähle einen Boon (PB×/LR): Cloud's Jaunt (Bonus-Aktion 30ft Teleport), Fire's Burn (+1d10 Feuer bei Treffer), Frost's Chill (+1d6 Kälte + -10 Speed), Hill's Tumble (Prone bei Treffer ≤Large), Stone's Endurance (Reaction: 1d12+CON Schaden reduzieren), Storm's Thunder (Reaction bei Schaden: 1d8 Donner an Angreifer).", source: "Goliath", category: "trait" },
      { id: "goliath_build", name: "Powerful Build", description: "Vorteil auf Saves gegen Grappled. +1 Größenkategorie für Traglast/Push/Pull/Lift.", source: "Goliath", category: "trait" },
      { id: "goliath_speed", name: "Speed 35ft", description: "Deine Bewegungsgeschwindigkeit ist 35ft.", source: "Goliath", category: "trait" },
    ],
    features: [
      { id: "goliath_large", name: "Large Form (Lv5)", description: "Bonus-Aktion: Wachse zu Large für 10 Min (oder beende es). Vorteil auf STR-Checks + +10ft Speed. 1×/Long Rest.", source: "Goliath", category: "feature" },
    ],
  },
  {
    id: "halfling", name: "Halfling", edition: "2024",
    description: "Glückliche Kleinlinge. 2024: Lightfoot/Stout entfallen, alle Traits standard.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Klein", languages: ["Gemeinsprache", "Halblingisch"],
    traits: [
      { id: "halfling_brave", name: "Brave", description: "Vorteil auf Saves gegen Frightened.", source: "Halfling", category: "trait" },
      { id: "halfling_nimble", name: "Halfling Nimbleness", description: "Du kannst durch den Raum jeder Kreatur bewegen, die größer als du ist.", source: "Halfling", category: "trait" },
      { id: "halfling_luck", name: "Luck", description: "Bei 1 auf einem d20: Reroll. Musst neuen Wurf nehmen.", source: "Halfling", category: "trait" },
      { id: "halfling_stealth", name: "Naturally Stealthy", description: "Du kannst die Hide-Aktion machen wenn du nur von einem Wesen größer als du verdeckt bist.", source: "Halfling", category: "trait" },
    ],
    features: [],
  },
  {
    id: "orc", name: "Orc", edition: "2024",
    description: "Krieger mit Gruumsh-Erbe. 2024 PHB Core (war Volo's).",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Orkisch"],
    traits: [
      { id: "orc_adrenaline", name: "Adrenaline Rush", description: "Bonus-Aktion: Dash + erhalte PB Temp HP. PB×/Short oder Long Rest.", source: "Orc", category: "trait" },
      { id: "orc_darkvision", name: "Dunkelsicht 120ft", description: "Dunkelsicht 120ft.", source: "Orc", category: "trait" },
      { id: "orc_build", name: "Powerful Build", description: "Vorteil auf Saves gegen Grappled. +1 Größenkategorie für Traglast.", source: "Orc", category: "trait" },
      { id: "orc_endurance", name: "Relentless Endurance", description: "Wenn du auf 0 HP reduziert wirst (nicht sofort getötet): bleibe stattdessen bei 1 HP. 1×/Long Rest.", source: "Orc", category: "trait" },
    ],
    features: [],
  },
  {
    id: "tiefling", name: "Tiefling", edition: "2024",
    description: "Mit Fiend-Blut verbunden. 2024: 3 Legacies mit Lv1/3/5 Spells.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel oder Klein", languages: ["Gemeinsprache", "Höllisch"],
    traits: [
      { id: "tiefling_darkvision", name: "Dunkelsicht 60ft", description: "Dunkelsicht 60ft.", source: "Tiefling", category: "trait" },
      { id: "tiefling_legacy", name: "Fiendish Legacy", description: "Wähle Abyssal / Chthonic / Infernal (siehe Lineages). Gibt Lv1-Cantrip + Lv3/Lv5 Spells.", source: "Tiefling", category: "trait" },
      { id: "tiefling_presence", name: "Otherworldly Presence", description: "Du kennst Thaumaturgy-Cantrip. CHA als Spellcasting-Ability dafür.", source: "Tiefling", category: "trait" },
    ],
    features: [],
    lineages: [
      { id: "abyssal", name: "Abyssal Legacy", description: "Resistenz Gift + Poison Spray Cantrip. Lv3: Ray of Sickness (1×/LR). Lv5: Hold Person (1×/LR)." },
      { id: "chthonic", name: "Chthonic Legacy", description: "Resistenz Nekrose + Chill Touch Cantrip. Lv3: False Life (1×/LR). Lv5: Ray of Enfeeblement (1×/LR)." },
      { id: "infernal", name: "Infernal Legacy", description: "Resistenz Feuer + Fire Bolt Cantrip. Lv3: Hellish Rebuke (1×/LR). Lv5: Darkness (1×/LR)." },
    ],
  },
];
