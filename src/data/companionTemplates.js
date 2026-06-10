/**
 * PHB 2024 Companion Templates
 *
 * Standard-Begleiter aus dem PHB 2024:
 * - Find Familiar (Magier Lv1): Celestial/Fey/Fiend in Form eines kleinen Tiers
 * - Find Steed (Paladin Lv5 via Faithful Steed): Otherworldly Steed
 * - Wild Companion (Druide Lv2 NEU 2024): Wild Shape → Find Familiar effect
 * - Primal Beast (Ranger Beast Master 2024): wächst mit Ranger-Level
 *
 * Jedes Template kann via "Quick-Add" Button im Companions-Tab geladen
 * werden und dann beliebig angepasst werden.
 */

export const COMPANION_TEMPLATES = [
  // ── Find Familiar (Wizard / Warlock-Pact of the Chain / Druid Wild Companion) ──
  {
    id: "familiar_celestial_owl",
    label: "Find Familiar — Eule (Celestial)",
    source: "Find Familiar (Magier Lv1)",
    desc: "Kleiner Begleiter in Form einer Eule (Celestial). Kann sehen/hören/wahrnehmen für dich. Beschwöre als Magic Action.",
    data: {
      name: "Eule (Vertrauter)", type: "celestial", size: "Tiny",
      hp: 1, maxHp: 1, ac: 11, speed: 5,
      stats: { STR: 3, DEX: 13, CON: 8, INT: 2, WIS: 12, CHA: 7 },
      senses: "Darkvision 120ft, Passive Perception 13", languages: "—",
      cr: "0",
      traits: "Flugbewegung 60ft. Keen Hearing & Sight: Vorteil auf Perception (hören/sehen).",
      actions: "Talons: Melee +3, 1 Schlachtschaden. (Selten genutzt — Vertrauter kämpft nicht ohne Anweisung.)",
      notes: "PHB 2024: Find Familiar bietet Celestial-Form. Beschwöre via Magic Action (1 Stunde Ritual). Form-Switch zwischen ausgewählten Tieren als Bonus-Action.",
    },
  },
  {
    id: "familiar_fey_cat",
    label: "Find Familiar — Katze (Fey)",
    source: "Find Familiar (Magier Lv1)",
    desc: "Kleiner Begleiter in Form einer Katze (Fey). Geschickter Späher.",
    data: {
      name: "Katze (Vertrauter)", type: "fey", size: "Tiny",
      hp: 2, maxHp: 2, ac: 12, speed: 40,
      stats: { STR: 3, DEX: 15, CON: 10, INT: 3, WIS: 12, CHA: 7 },
      senses: "Darkvision 60ft, Passive Perception 13", languages: "—",
      cr: "0",
      traits: "Keen Smell: Vorteil auf WIS(Perception) bei Geruch. Climbing Speed 30ft.",
      actions: "Claws: Melee +0, 1 Schlachtschaden.",
      notes: "PHB 2024: Find Familiar bietet Fey-Form. Beschwöre via Magic Action.",
    },
  },
  {
    id: "familiar_fiend_imp",
    label: "Find Familiar — Imp-Form (Fiend)",
    source: "Find Familiar (Magier Lv1)",
    desc: "Kleiner Begleiter in fiendischer Form (z.B. kleines bat-ähnliches Wesen).",
    data: {
      name: "Fledermaus (Vertrauter)", type: "fiend", size: "Tiny",
      hp: 1, maxHp: 1, ac: 12, speed: 5,
      stats: { STR: 2, DEX: 15, CON: 8, INT: 2, WIS: 12, CHA: 4 },
      senses: "Blindsight 60ft, Passive Perception 11", languages: "—",
      cr: "0",
      traits: "Echolocation: Blindsight funktioniert. Flugbewegung 30ft. Keen Hearing: Vorteil auf Perception (hören).",
      actions: "Bite: Melee +0, 1 Stichschaden.",
      notes: "PHB 2024: Find Familiar bietet Fiend-Form. Beschwöre via Magic Action.",
    },
  },

  // ── Find Steed (Paladin Lv5) ─────────────────────────────────────────────────
  {
    id: "steed_celestial_warhorse",
    label: "Find Steed — Streitross (Celestial)",
    source: "Find Steed (Paladin Lv5)",
    desc: "Otherworldly Mount in Form eines Streitrosses (Celestial). Geht in Pocket Dimension bei HP 0.",
    data: {
      name: "Celestial-Streitross", type: "celestial", size: "Large",
      hp: 19, maxHp: 19, ac: 11, speed: 60,
      stats: { STR: 18, DEX: 12, CON: 13, INT: 6, WIS: 12, CHA: 7 },
      senses: "Passive Perception 11", languages: "Versteht Common (kann nicht sprechen)",
      cr: "1/2",
      traits: "Otherworldly Bond: Beim Reduzieren auf 0 HP verschwindet das Steed in eine Pocket Dimension statt zu sterben. Charge: Wenn 20ft+ rennend und Trampling-Strike trifft: +2d6 Schaden + STR-Save DC 14 oder Prone.",
      actions: "Trampling Strike: Melee +6, 2d6+4 Wuchtschaden.",
      notes: "PHB 2024 (Paladin Faithful Steed Lv5): Find Steed immer prepared, 1× pro Long Rest ohne Slot. Bei 0 HP → Pocket Dimension statt Tod.",
    },
  },
  {
    id: "steed_fey_pony",
    label: "Find Steed — Fee-Pony (Fey)",
    source: "Find Steed (Paladin Lv5)",
    desc: "Otherworldly Mount in Form eines Fee-Ponys.",
    data: {
      name: "Fey-Pony", type: "fey", size: "Medium",
      hp: 11, maxHp: 11, ac: 11, speed: 40,
      stats: { STR: 15, DEX: 10, CON: 13, INT: 4, WIS: 11, CHA: 7 },
      senses: "Darkvision 60ft, Passive Perception 10", languages: "Versteht Common",
      cr: "1/8",
      traits: "Otherworldly Bond: Pocket Dimension bei 0 HP. Sure-Footed: Vorteil auf STR-/DEX-Saves gegen Prone.",
      actions: "Hooves: Melee +4, 2d4+2 Wuchtschaden.",
      notes: "PHB 2024: Fey-Variant des Find Steed. Sure-Footed-Trait je nach DM-Auslegung.",
    },
  },

  // ── Wild Companion (Druide Lv2 NEU 2024) ─────────────────────────────────────
  {
    id: "wild_companion_fey",
    label: "Wild Companion (Druide 2024)",
    source: "Wild Companion (Druide Lv2 NEU)",
    desc: "Druide kann eine Wild-Shape-Nutzung verwenden, um Find Familiar zu wirken. Der Vertraute ist Fey und verschwindet nach Long Rest.",
    data: {
      name: "Wild Companion (Fee-Tier)", type: "fey", size: "Tiny",
      hp: 1, maxHp: 1, ac: 12, speed: 30,
      stats: { STR: 3, DEX: 14, CON: 10, INT: 4, WIS: 12, CHA: 8 },
      senses: "Darkvision 60ft, Passive Perception 13", languages: "—",
      cr: "0",
      traits: "Form-Wahl: Kleines Tier (Eule, Eichhörnchen, Specht etc.). Kann Druidic verstehen.",
      actions: "Wenig — Wild Companion ist primär ein Späher/Spähhilfe.",
      notes: "PHB 2024 NEU (Druide Lv2): Spend Spell Slot ODER Wild Shape Use → Find Familiar-Effekt. Vertrauter ist immer Fey, verschwindet nach Long Rest.",
    },
  },

  // ── Primal Beast (Ranger Beast Master 2024) ──────────────────────────────────
  {
    id: "primal_beast_land",
    label: "Primal Beast — Land (Beast Master 2024)",
    source: "Primal Beast (Ranger Lv3 Beast Master)",
    desc: "Primal Companion: 4-beiniges Wesen das mit dem Ranger wächst. Stats skalieren mit Ranger-Level.",
    data: {
      name: "Primal Beast (Land)", type: "beast", size: "Medium",
      hp: 5, maxHp: 5, ac: 13, speed: 40,
      stats: { STR: 14, DEX: 14, CON: 14, INT: 8, WIS: 13, CHA: 11 },
      senses: "Darkvision 60ft, Passive Perception 13", languages: "—",
      cr: "—",
      traits: "Primal Bond: HP = 5 + (5×Ranger-Level). AC = 13 + ½ Ranger-Level. PB = Ranger-PB. Saves nutzen Ranger-PB. Schaden skaliert mit Ranger-Level. Bei 0 HP: nicht tot, sondern kann mit Bonus-Action wiederbelebt werden (Spell-Slot kostet).",
      actions: "Maul: Melee Attack (uses Ranger PB), 1d8 + PB Schaden. Push (Mastery): Target STR-Save oder 5ft zurück.",
      notes: "PHB 2024 (Beast Master Ranger Lv3): Stats automatisch aus Ranger-Level berechnet. Beast Slayer, Tireless-Heilung via Ranger-Features.",
    },
  },
  {
    id: "primal_beast_sky",
    label: "Primal Beast — Luft (Beast Master 2024)",
    source: "Primal Beast (Ranger Lv3 Beast Master)",
    desc: "Geflügelter Primal Companion. Wächst mit Ranger-Level.",
    data: {
      name: "Primal Beast (Luft)", type: "beast", size: "Small",
      hp: 4, maxHp: 4, ac: 13, speed: 30,
      stats: { STR: 6, DEX: 14, CON: 14, INT: 8, WIS: 14, CHA: 11 },
      senses: "Darkvision 60ft, Passive Perception 14", languages: "—",
      cr: "—",
      traits: "Primal Bond: Flying Speed 60ft (statt 30 normal). HP = 4 + (5×Ranger-Level). Schaden skaliert mit Ranger-Level.",
      actions: "Beak: Melee Attack (uses Ranger PB), 1d4 + PB Schaden. Vex (Mastery): Vorteil auf nächsten Angriff gegen dasselbe Ziel.",
      notes: "PHB 2024 (Beast Master Ranger): Flugform. Schaden + HP skalieren mit Ranger-Level.",
    },
  },
  {
    id: "primal_beast_sea",
    label: "Primal Beast — Wasser (Beast Master 2024)",
    source: "Primal Beast (Ranger Lv3 Beast Master)",
    desc: "Aquatischer Primal Companion.",
    data: {
      name: "Primal Beast (Wasser)", type: "beast", size: "Medium",
      hp: 5, maxHp: 5, ac: 13, speed: 5,
      stats: { STR: 15, DEX: 14, CON: 15, INT: 8, WIS: 13, CHA: 11 },
      senses: "Darkvision 60ft, Passive Perception 13", languages: "—",
      cr: "—",
      traits: "Primal Bond: Swim Speed 60ft. HP = 5 + (5×Ranger-Level). Schaden skaliert mit Ranger-Level. Hold Breath: 1 Stunde Luft anhalten.",
      actions: "Bite: Melee Attack (uses Ranger PB), 1d6 + PB Schaden. Topple (Mastery): Target CON-Save oder Prone.",
      notes: "PHB 2024 (Beast Master Ranger): Aquatische Variante. Kämpft auch an Land aber langsam.",
    },
  },
];

export const getCompanionTemplate = (id) =>
  COMPANION_TEMPLATES.find(t => t.id === id);
