/**
 * classFeatures.js — D&D 5e 2024 PHB Klassen-Features pro Level
 *
 * 2024 PHB MIGRATION:
 * - Subclass-Level standardisiert: Cleric/Druid/Sorcerer/Warlock/Wizard alle auf Lv3
 *   (war 2014: Cleric/Sorcerer/Warlock Lv1, Druid/Wizard Lv2)
 * - Weapon Mastery (Lv1) für Barbar, Fighter, Paladin, Ranger, Rogue
 * - Epic Boon Feat (Lv19) für alle Klassen
 * - Diverse neue Features (siehe Kommentare)
 *
 * Format pro Klasse: { [level]: [{id, name, description, category}] }
 * source wird beim Anwenden automatisch ergänzt ("class:Barbar")
 */
export const CLASS_FEATURES = {
  // ── Barbar (2024 PHB) ──────────────────────────────────────────────────────
  Barbar: {
    1: [
      {id:"barbar_rage",name:"Rage (Kampfrausch)",description:"Bonus-Aktion: Aktiviere Rage. Resistenz BPS, +Rage Damage (Lv1-8: +2, Lv9-15: +3, Lv16-20: +4) bei STR-Angriffen. Vorteil auf STR-Checks & Saves. Keine Concentration/Spells. Dauer: bis Ende deines nächsten Zugs, verlängerbar durch Angriff/Save/Bonus-Aktion (max 10 Min).",category:"feature"},
      {id:"barbar_unarmored",name:"Ungerüstete Verteidigung",description:"RK = 10 + DEX-Mod + CON-Mod (ohne Rüstung). Schild erlaubt.",category:"feature"},
      {id:"barbar_weapon_mastery",name:"Weapon Mastery (NEU 2024)",description:"Nutze Mastery-Eigenschaften von 2 Simple/Martial-Waffen. Wechselbar nach Long Rest. Skaliert: Lv4→3, Lv10→4 Waffen.",category:"feature"},
    ],
    2: [
      {id:"barbar_reckless",name:"Reckless Attack",description:"Vorteil auf 1. STR-Angriff. Bis nächster Zug: Angriffe gegen dich haben Vorteil.",category:"feature"},
      {id:"barbar_danger_sense",name:"Danger Sense",description:"Vorteil auf DEX-Saves (außer Incapacitated).",category:"feature"},
    ],
    3: [
      {id:"barbar_subclass",name:"Barbarian Subclass",description:"Wähle: Path of the Berserker, Wild Heart, World Tree (NEU 2024) oder Zealot.",category:"feature"},
      {id:"barbar_primal_knowledge",name:"Primal Knowledge (NEU 2024)",description:"+1 Skill aus Barbar-Liste. Im Rage: Acrobatics/Intimidation/Perception/Stealth/Survival als STR-Check.",category:"feature"},
    ],
    5: [
      {id:"barbar_extra_attack",name:"Extra Attack",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},
      {id:"barbar_fast_movement",name:"Fast Movement",description:"+10ft Speed (ohne Heavy Armor).",category:"feature"},
    ],
    7: [
      {id:"barbar_feral_instinct",name:"Feral Instinct",description:"Vorteil auf Initiative.",category:"feature"},
      {id:"barbar_instinctive_pounce",name:"Instinctive Pounce (NEU 2024)",description:"Als Teil der Rage-Bonus-Aktion: Bewege bis halbe Speed.",category:"feature"},
    ],
    9: [
      {id:"barbar_brutal_strike",name:"Brutal Strike (NEU 2024)",description:"Bei Reckless Attack: Verzichte auf Vorteil → +1d10 + 1 Effekt (Forceful Blow: 15ft Push; Hamstring Blow: -15ft Speed; Sundering Blow: +5 nächster Angriff).",category:"feature"},
    ],
    11: [
      {id:"barbar_relentless_rage",name:"Relentless Rage",description:"Wenn im Rage auf 0 HP: CON-Save DC 10 (+5 pro Versuch) → bleibe bei 1 HP.",category:"feature"},
    ],
    13: [
      {id:"barbar_improved_brutal_strike",name:"Improved Brutal Strike (NEU 2024)",description:"2 neue Brutal-Strike-Effekte verfügbar.",category:"feature"},
    ],
    15: [
      {id:"barbar_persistent_rage",name:"Persistent Rage",description:"Bei Initiative: regain alle Rage-Uses (1×/LR). Rage dauert 10 Min, endet nur bei Unconscious/Heavy Armor.",category:"feature"},
    ],
    17: [
      {id:"barbar_improved_brutal_strike2",name:"Improved Brutal Strike (Lv17)",description:"Brutal Strike-Schaden steigt auf 2d10.",category:"feature"},
    ],
    18: [
      {id:"barbar_indomitable_might",name:"Indomitable Might",description:"Bei STR-Check: Mindestwert = dein STR-Score (NICHT STR×STR wie 2014).",category:"feature"},
    ],
    19: [
      {id:"barbar_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Combat Prowess empfohlen).",category:"feature"},
    ],
    20: [
      {id:"barbar_primal_champion",name:"Primal Champion",description:"+4 STR/+4 CON (max 25). Rage bleibt bei 6 Uses (KEINE unbegrenzte Rage wie 2014).",category:"feature"},
    ],
  },

  // ── Barde (2024 PHB) ──────────────────────────────────────────────────────
  Barde: {
    1: [
      {id:"barde_spellcasting",name:"Spellcasting",description:"CHA als Zauberfähigkeit. 2 Cantrips + 4 Lv1-Spells prepared.",category:"feature"},
      {id:"barde_inspiration",name:"Bardic Inspiration (d6)",description:"Bonus-Aktion: Verbündeter in 60ft erhält 1 Inspirationswürfel. Anzahl: CHA-Mod (min 1)/LR. Würfel: d6 (Lv1) → d8 (Lv5) → d10 (Lv10) → d12 (Lv15).",category:"feature"},
    ],
    2: [
      {id:"barde_expertise",name:"Expertise",description:"PB×2 für 2 Skills. (2024 FIX: war L3 in App)",category:"feature"},
      {id:"barde_jack_of_all",name:"Jack of All Trades",description:"½ PB auf nicht-geübte Skill-Checks.",category:"feature"},
    ],
    3: [
      {id:"barde_subclass",name:"Bard Subclass",description:"Wähle: College of Dance (NEU 2024), Glamour, Lore oder Valor.",category:"feature"},
    ],
    5: [
      {id:"barde_font_of_inspiration",name:"Font of Inspiration",description:"Bardic Inspiration regain nach Short ODER Long Rest. Spell Slot ausgeben → 1 Inspiration zurück.",category:"feature"},
      {id:"barde_inspiration_d8",name:"Bardic Inspiration steigt auf d8",description:"Inspirationswürfel ist jetzt d8.",category:"feature"},
    ],
    7: [
      {id:"barde_countercharm",name:"Countercharm (2024 FIX: Lv7)",description:"Reaktion bei Charmed/Frightened-Save eines Wesens in 30ft: Save wird gerollt + hat Vorteil.",category:"feature"},
    ],
    9: [
      {id:"barde_expertise2",name:"Expertise (2 weitere)",description:"PB×2 für 2 weitere Skills.",category:"feature"},
    ],
    10: [
      {id:"barde_magical_secrets",name:"Magical Secrets",description:"Ab Lv10: Bei jedem Level-Up wo Prepared-Spell-Anzahl steigt, kannst du Spells aus Bard/Cleric/Druid/Wizard-Listen wählen.",category:"feature"},
      {id:"barde_inspiration_d10",name:"Bardic Inspiration steigt auf d10",description:"Inspirationswürfel ist jetzt d10.",category:"feature"},
    ],
    15: [
      {id:"barde_inspiration_d12",name:"Bardic Inspiration steigt auf d12",description:"Inspirationswürfel ist jetzt d12.",category:"feature"},
    ],
    18: [
      {id:"barde_superior_inspiration",name:"Superior Inspiration (NEU 2024)",description:"Bei Initiative: Bardic Inspiration auf mindestens 2 aufgefüllt (wenn weniger).",category:"feature"},
    ],
    19: [
      {id:"barde_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Spell Recall empfohlen).",category:"feature"},
    ],
    20: [
      {id:"barde_words_of_creation",name:"Words of Creation (NEU 2024)",description:"Power Word Heal + Power Word Kill immer prepared. Beide können 2. Ziel in 10ft erreichen.",category:"feature"},
    ],
  },

  // ── Druide (2024 PHB) ──────────────────────────────────────────────────────
  Druide: {
    1: [
      {id:"druide_spellcasting",name:"Spellcasting",description:"WIS als Zauberfähigkeit. 2 Cantrips + 4 Lv1-Spells prepared.",category:"feature"},
      {id:"druide_druidic",name:"Druidic",description:"Geheime Druidensprache. Speak with Animals immer prepared.",category:"feature"},
      {id:"druide_primal_order",name:"Primal Order (NEU 2024)",description:"Wähle: Magician (+1 Cantrip + Wis-Mod auf Arcana/Nature-Checks) ODER Warden (Martial Weapons + Medium Armor).",category:"feature"},
    ],
    2: [
      {id:"druide_wild_shape",name:"Wild Shape",description:"Bonus-Aktion: Transformiere in Beast-Form. Bekannte Formen: 4 (Lv2) → 6 (Lv4, CR ½) → 8 (Lv8, CR 1, Fly OK). 2× pro Short/Long Rest.",category:"feature"},
      {id:"druide_wild_companion",name:"Wild Companion (NEU 2024)",description:"Magic Action: Spend Spell Slot ODER Wild Shape Use → Find Familiar wirken (Fey, verschwindet nach Long Rest).",category:"feature"},
    ],
    3: [
      {id:"druide_subclass",name:"Druid Subclass",description:"Wähle: Circle of the Land, Moon, Sea (NEU 2024) oder Stars (NEU 2024). (2024 FIX: war Lv2)",category:"feature"},
    ],
    5: [
      {id:"druide_wild_resurgence",name:"Wild Resurgence (NEU 2024)",description:"1×/Zug: Wenn 0 Wild Shape Uses → Spend Spell Slot für 1 Use. ODER 1×/LR: 1 Wild Shape Use → Lv1 Spell Slot.",category:"feature"},
    ],
    7: [
      {id:"druide_elemental_fury",name:"Elemental Fury (NEU 2024)",description:"Wähle: Potent Spellcasting (+Wis-Mod Cantrip-Schaden) ODER Primal Strike (+1d8 Cold/Fire/Lightning/Thunder bei Weapon/Beast Attack).",category:"feature"},
    ],
    15: [
      {id:"druide_improved_elemental_fury",name:"Improved Elemental Fury (NEU 2024)",description:"Potent: Cantrip-Range +300ft. Primal: Schaden steigt auf 2d8.",category:"feature"},
    ],
    18: [
      {id:"druide_beast_spells",name:"Beast Spells",description:"In Wild Shape: Spells wirken möglich (außer mit gekostetem Material).",category:"feature"},
    ],
    19: [
      {id:"druide_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Dimensional Travel empfohlen).",category:"feature"},
    ],
    20: [
      {id:"druide_archdruid",name:"Archdruid (NEU 2024)",description:"Evergreen Wild Shape: Bei Initiative → 1 Use zurück. Nature Magician: Konvertiere Wild Shape Uses in Spell Slot (2 Slot-Level pro Use, 1×/LR). Longevity: Alterst 10× langsamer. (KEINE unbegrenzte Wild Shape wie 2014!)",category:"feature"},
    ],
  },

  // ── Hexenmeister / Warlock (2024 PHB) ─────────────────────────────────────
  Hexenmeister: {
    1: [
      {id:"hex_eldritch_invocations",name:"Eldritch Invocations",description:"1 Invocation auf Lv1. Skaliert: Lv2:3, Lv5:5, Lv7:6, ...",category:"feature"},
      {id:"hex_pact_magic",name:"Pact Magic",description:"CHA-Spellcasting. Wenige Slots (1-4), aber alle haben höchsten Grad. Refill bei Short ODER Long Rest.",category:"feature"},
    ],
    2: [
      {id:"hex_magical_cunning",name:"Magical Cunning (NEU 2024)",description:"Während Short Rest: 1 Min Ritual → halbe Pact-Slots zurück (1×/LR).",category:"feature"},
    ],
    3: [
      {id:"hex_subclass",name:"Warlock Subclass (Patron)",description:"Wähle Patron: Archfey, Celestial (NEU PHB), Fiend oder Great Old One. (2024 FIX: war Lv1)",category:"feature"},
    ],
    11: [
      {id:"hex_arcanum6",name:"Mystic Arcanum (Lv6)",description:"1× pro Long Rest: 1 Lv6-Spell ohne Slot wirken.",category:"feature"},
    ],
    13: [
      {id:"hex_arcanum7",name:"Mystic Arcanum (Lv7)",description:"1× pro Long Rest: 1 Lv7-Spell.",category:"feature"},
    ],
    15: [
      {id:"hex_arcanum8",name:"Mystic Arcanum (Lv8)",description:"1× pro Long Rest: 1 Lv8-Spell.",category:"feature"},
    ],
    17: [
      {id:"hex_arcanum9",name:"Mystic Arcanum (Lv9)",description:"1× pro Long Rest: 1 Lv9-Spell.",category:"feature"},
    ],
    19: [
      {id:"hex_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Fate empfohlen).",category:"feature"},
    ],
    20: [
      {id:"hex_eldritch_master",name:"Eldritch Master",description:"Magical Cunning regain ALLE Pact-Slots (statt halbe).",category:"feature"},
    ],
  },

  // ── Kämpfer (2024 PHB) ────────────────────────────────────────────────────
  Kämpfer: {
    1: [
      {id:"kaempfer_fighting_style",name:"Fighting Style",description:"Wähle Fighting-Style-Feat (Archery, Defense, Dueling, etc.). Wechselbar nach Long Rest.",category:"feature"},
      {id:"kaempfer_second_wind",name:"Second Wind (Zweiter Wind)",description:"Bonus-Aktion: Heile 1d10+Fighter-Level HP. 2× pro Short Rest (Lv4: 3×, Lv10: 4×).",category:"feature"},
      {id:"kaempfer_weapon_mastery",name:"Weapon Mastery (NEU 2024)",description:"Nutze Mastery von 3 Simple/Martial-Waffen. Skaliert: Lv4→4, Lv10→5, Lv16→6.",category:"feature"},
    ],
    2: [
      {id:"kaempfer_action_surge",name:"Action Surge (Kraftakt)",description:"1 zusätzliche Aktion (außer Magic). 1× pro Short Rest. Lv17: 2× (aber max 1×/Zug).",category:"feature"},
      {id:"kaempfer_tactical_mind",name:"Tactical Mind (NEU 2024)",description:"Bei misslungenem Skill-Check: Spend Second Wind → 1d10 zum Wurf addieren. Wenn immer noch fail: Second Wind NICHT verbraucht.",category:"feature"},
    ],
    3: [
      {id:"kaempfer_subclass",name:"Fighter Subclass",description:"Wähle: Battle Master, Champion, Eldritch Knight oder Psi Warrior.",category:"feature"},
    ],
    5: [
      {id:"kaempfer_extra_attack",name:"Extra Attack",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},
      {id:"kaempfer_tactical_shift",name:"Tactical Shift (NEU 2024)",description:"Bei Second Wind als Bonus-Aktion: Bewege halbe Speed ohne Opportunity Attacks.",category:"feature"},
    ],
    9: [
      {id:"kaempfer_indomitable",name:"Indomitable (Unnachgiebig)",description:"Bei misslungenem Save: Reroll mit +Fighter-Lv. 1× pro Long Rest (Lv13: 2×, Lv17: 3×).",category:"feature"},
      {id:"kaempfer_tactical_master",name:"Tactical Master (NEU 2024)",description:"Bei Weapon Attack mit Mastery: Ersetze Mastery durch Push, Sap oder Slow.",category:"feature"},
    ],
    11: [
      {id:"kaempfer_extra_attack2",name:"Two Extra Attacks",description:"3 Angriffe pro Angriffsaktion.",category:"feature"},
    ],
    13: [
      {id:"kaempfer_studied_attacks",name:"Studied Attacks (NEU 2024)",description:"Bei Miss eines Angriffs: Vorteil auf nächsten Angriff gegen dasselbe Ziel (bis Ende deines nächsten Zugs).",category:"feature"},
    ],
    19: [
      {id:"kaempfer_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Combat Prowess empfohlen).",category:"feature"},
    ],
    20: [
      {id:"kaempfer_extra_attack3",name:"Three Extra Attacks",description:"4 Angriffe pro Angriffsaktion.",category:"feature"},
    ],
  },

  // ── Kleriker (2024 PHB) ───────────────────────────────────────────────────
  Kleriker: {
    1: [
      {id:"kleriker_spellcasting",name:"Spellcasting",description:"WIS als Zauberfähigkeit. 3 Cantrips + 4 Lv1-Spells prepared.",category:"feature"},
      {id:"kleriker_divine_order",name:"Divine Order (NEU 2024)",description:"Wähle: Protector (Martial Weapons + Heavy Armor) ODER Thaumaturge (+1 Cantrip + Wis-Mod auf Arcana/Religion-Checks).",category:"feature"},
    ],
    2: [
      {id:"kleriker_channel_divinity",name:"Channel Divinity (2 Uses)",description:"2 Uses pro Short Rest. Optionen: Divine Spark (Magic Action: 1d8+Wis HP heilen ODER 1d8+Wis Necrotic/Radiant Schaden) und Turn Undead.",category:"feature"},
    ],
    3: [
      {id:"kleriker_subclass",name:"Cleric Subclass (Domain)",description:"Wähle: Life, Light, Trickery oder War. (2024 FIX: war Lv1)",category:"feature"},
    ],
    5: [
      {id:"kleriker_sear_undead",name:"Sear Undead (NEU 2024)",description:"Bei Turn Undead: Jedes Untote die fail → (Wis-Mod)d8 Strahlend (zusätzlich zum Turn-Effekt).",category:"feature"},
    ],
    6: [
      {id:"kleriker_channel_divinity_3",name:"Channel Divinity (3 Uses)",description:"3 Uses pro Short Rest.",category:"feature"},
    ],
    7: [
      {id:"kleriker_blessed_strikes",name:"Blessed Strikes (NEU 2024)",description:"Wähle: Divine Strike (1×/Zug nach Waffentreffer: +1d8 Necrotic/Radiant) ODER Potent Spellcasting (+Wis-Mod Cantrip-Schaden).",category:"feature"},
    ],
    10: [
      {id:"kleriker_divine_intervention",name:"Divine Intervention (NEU 2024 Mechanik)",description:"Magic Action: Wirke beliebigen Cleric-Spell ≤Lv5 ohne Slot/Material/Reaction. 1× pro Long Rest.",category:"feature"},
    ],
    14: [
      {id:"kleriker_improved_blessed_strikes",name:"Improved Blessed Strikes (NEU 2024)",description:"Divine Strike: Schaden auf 2d8. Potent: Nach Cantrip-Damage → 2×Wis-Mod Temp HP an Verbündeten in 60ft.",category:"feature"},
    ],
    18: [
      {id:"kleriker_channel_divinity_4",name:"Channel Divinity (4 Uses)",description:"4 Uses pro Short Rest.",category:"feature"},
    ],
    19: [
      {id:"kleriker_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Fate empfohlen).",category:"feature"},
    ],
    20: [
      {id:"kleriker_greater_intervention",name:"Greater Divine Intervention (NEU 2024)",description:"Bei Divine Intervention: Wish wählbar. Danach 2d4 Long Rests Cooldown.",category:"feature"},
    ],
  },

  // ── Magier / Wizard (2024 PHB) ────────────────────────────────────────────
  Magier: {
    1: [
      {id:"magier_spellcasting",name:"Spellcasting",description:"INT als Zauberfähigkeit. Spellbook mit 6 Lv1-Spells. 3 Cantrips.",category:"feature"},
      {id:"magier_ritual_adept",name:"Ritual Adept (NEU 2024)",description:"Jeder Spell mit Ritual-Tag aus Spellbook als Ritual castbar (ohne prepared).",category:"feature"},
      {id:"magier_arcane_recovery",name:"Arcane Recovery",description:"Nach Short Rest: Spell-Slots ≤ ½ Lv (round up) zurück (kein Slot Lv6+). 1×/Long Rest.",category:"feature"},
    ],
    2: [
      {id:"magier_scholar",name:"Scholar (NEU 2024)",description:"Expertise (PB×2) in einem Skill aus Arcana/History/Investigation/Medicine/Nature/Religion.",category:"feature"},
    ],
    3: [
      {id:"magier_subclass",name:"Wizard Subclass",description:"Wähle: Abjurer, Diviner, Evoker oder Illusionist. (2024 FIX: war Lv2)",category:"feature"},
    ],
    5: [
      {id:"magier_memorize_spell",name:"Memorize Spell (NEU 2024)",description:"1×/Long Rest: Nach Short Rest 1 prepared Spell gegen anderen Spellbook-Spell tauschen.",category:"feature"},
    ],
    18: [
      {id:"magier_spell_mastery",name:"Spell Mastery",description:"Wähle 1 Lv1 + 1 Lv2 Spell: Beliebig oft ohne Slot wirken (höhere Slots verstärken).",category:"feature"},
    ],
    19: [
      {id:"magier_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Spell Recall empfohlen).",category:"feature"},
    ],
    20: [
      {id:"magier_signature_spells",name:"Signature Spells",description:"Wähle 2 Lv3-Spells: 1×/Short Rest ohne Slot wirken.",category:"feature"},
    ],
  },

  // ── Mönch (2024 PHB) ──────────────────────────────────────────────────────
  Mönch: {
    1: [
      {id:"moenche_martial_arts",name:"Martial Arts",description:"Martial Arts Die: d6 (Lv1) → d8 (Lv5) → d10 (Lv11) → d12 (Lv17). DEX statt STR auf Unarmed/Monk Weapon Attacks + Damage. DEX auf Grapple/Shove DC. Bonus-Aktion: Unarmed Strike. (2024 FIX: Würfel d6 statt d4 wie 2014)",category:"feature"},
      {id:"moenche_unarmored",name:"Unarmored Defense",description:"RK = 10 + DEX-Mod + WIS-Mod (ohne Rüstung/Schild).",category:"feature"},
    ],
    2: [
      {id:"moenche_focus_points",name:"Focus Points (Fokus-Punkte)",description:"Focus Points = Monk-Level. DC = 8+PB+Wis. Optionen: Flurry of Blows (1 Focus → 2 Unarmed Strikes), Patient Defense (1 Focus → Disengage+Dodge), Step of the Wind (1 Focus → Disengage+Dash, doppelte Jump). (2024 FIX: 'Ki' heißt jetzt 'Focus Points')",category:"feature"},
      {id:"moenche_unarmored_movement",name:"Unarmored Movement",description:"+10ft Speed. Skaliert: Lv6→+15, Lv10→+20, Lv14→+25, Lv18→+30.",category:"feature"},
      {id:"moenche_uncanny_metabolism",name:"Uncanny Metabolism (NEU 2024)",description:"Bei Initiative: Alle Focus Points zurück + heile (Monk-Lv + Martial Arts Die) HP. 1×/Long Rest.",category:"feature"},
    ],
    3: [
      {id:"moenche_subclass",name:"Monk Subclass",description:"Wähle: Warrior of Mercy (NEU 2024), Shadow, Elements oder Open Hand.",category:"feature"},
      {id:"moenche_deflect_attacks",name:"Deflect Attacks (NEU 2024)",description:"Reaktion: Bei Schaden von Angriff (Melee ODER Ranged) → reduziere Damage um 1d10+DEX+Lv. Wenn 0: Spend 1 Focus → wirf 2 Daggers (1d4+DEX) zurück.",category:"feature"},
    ],
    4: [
      {id:"moenche_slow_fall",name:"Slow Fall (NEU in App)",description:"Reaktion bei Fall: Reduziere Fallschaden um 5×Monk-Lv.",category:"feature"},
    ],
    5: [
      {id:"moenche_extra_attack",name:"Extra Attack",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},
      {id:"moenche_stunning_strike",name:"Stunning Strike",description:"1×/Zug nach Treffer mit Monk Weapon/Unarmed: 1 Focus → CON-Save oder Stunned bis Ende deines nächsten Zugs.",category:"feature"},
    ],
    6: [
      {id:"moenche_empowered_strikes",name:"Empowered Strikes (NEU 2024)",description:"Unarmed Strikes gelten als magisch. 1 Focus expenden → +Martial Arts Die Force-Schaden.",category:"feature"},
    ],
    7: [
      {id:"moenche_evasion",name:"Evasion",description:"Erfolgreicher DEX-Save: Kein Schaden statt half. Fail: half Schaden.",category:"feature"},
    ],
    9: [
      {id:"moenche_acrobatic_movement",name:"Acrobatic Movement (NEU 2024)",description:"Wand-Laufen + Wasser-Laufen bei deinem Zug.",category:"feature"},
    ],
    10: [
      {id:"moenche_heightened_focus",name:"Heightened Focus (NEU 2024)",description:"Flurry of Blows: jetzt 3 Unarmed Strikes statt 2. Patient Defense: Temp HP = Martial Arts Die. Step of the Wind: 1 Verbündeten ziehen.",category:"feature"},
      {id:"moenche_self_restoration",name:"Self-Restoration (NEU 2024)",description:"Kein Schaden mehr von Charmed/Frightened/Poisoned (endet automatisch). Wenn 0 Focus: regain 1 Focus.",category:"feature"},
    ],
    13: [
      {id:"moenche_deflect_energy",name:"Deflect Energy (NEU 2024)",description:"Deflect Attacks gilt auch für Energie-Schaden (Acid/Cold/Fire/Force/Lightning/Necrotic/Psychic/Radiant/Thunder).",category:"feature"},
    ],
    14: [
      {id:"moenche_disciplined_survivor",name:"Disciplined Survivor (NEU 2024)",description:"Übung auf ALLE Saves. Bei misslungenem Save: 1 Focus → Reroll mit +Wis-Mod.",category:"feature"},
    ],
    15: [
      {id:"moenche_perfect_focus",name:"Perfect Focus (NEU 2024)",description:"Bei Initiative wenn weniger als 4 Focus: Aufgefüllt auf 4.",category:"feature"},
    ],
    18: [
      {id:"moenche_superior_defense",name:"Superior Defense (NEU 2024)",description:"Bonus-Aktion (3 Focus): Resistenz gegen ALLE Schäden außer Force für 1 Min.",category:"feature"},
    ],
    19: [
      {id:"moenche_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Speed empfohlen).",category:"feature"},
    ],
    20: [
      {id:"moenche_body_and_mind",name:"Body and Mind (NEU 2024)",description:"+4 DEX/+4 WIS (max 25). (Ersetzt 'Perfect Self' aus 2014)",category:"feature"},
    ],
  },

  // ── Paladin (2024 PHB) ────────────────────────────────────────────────────
  Paladin: {
    1: [
      {id:"paladin_lay_on_hands",name:"Lay on Hands (Handauflegen)",description:"Pool = 5×Paladin-Lv HP. Bonus-Aktion: Berühre Wesen → heile bis zum Pool-Limit. 5 HP spend: Beendet Poisoned.",category:"feature"},
      {id:"paladin_spellcasting",name:"Spellcasting",description:"CHA als Zauberfähigkeit. 2 Lv1-Spells prepared.",category:"feature"},
      {id:"paladin_weapon_mastery",name:"Weapon Mastery (NEU 2024)",description:"Nutze Mastery von 2 Simple/Martial-Waffen. Wechselbar nach Long Rest.",category:"feature"},
    ],
    2: [
      {id:"paladin_fighting_style",name:"Fighting Style",description:"Wähle Fighting-Style-Feat (Defense, Dueling, etc.).",category:"feature"},
      {id:"paladin_smite",name:"Paladin's Smite (NEU 2024)",description:"Searing Smite immer prepared. 1× pro Long Rest ohne Slot wirken.",category:"feature"},
      {id:"paladin_divine_smite",name:"Divine Smite (über Spells)",description:"Nach Waffentreffer: Spell-Slot ausgeben → 2d8 Strahlend (+1d8 pro Slot-Lv darüber, +1d8 vs Undead/Fiend).",category:"feature"},
    ],
    3: [
      {id:"paladin_subclass",name:"Paladin Subclass (Oath)",description:"Wähle: Oath of Devotion, Glory, Ancients oder Vengeance.",category:"feature"},
      {id:"paladin_channel_divinity",name:"Channel Divinity (2 Uses)",description:"2 Uses pro Short Rest. Optionen kommen von Oath + Divine Sense (NICHT mehr Lv1!): Bonus-Aktion → spüre Celestial/Fiend/Undead in 60ft für 10 Min.",category:"feature"},
    ],
    5: [
      {id:"paladin_extra_attack",name:"Extra Attack",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},
      {id:"paladin_faithful_steed",name:"Faithful Steed (NEU 2024)",description:"Find Steed immer prepared. 1× pro Long Rest ohne Slot wirken.",category:"feature"},
    ],
    6: [
      {id:"paladin_aura_protection",name:"Aura of Protection",description:"10ft Aura. Du + Verbündete: +CHA-Mod auf alle Saves.",category:"feature"},
    ],
    9: [
      {id:"paladin_abjure_foes",name:"Abjure Foes (NEU 2024 Channel Divinity)",description:"Magic Action: 60ft Emanation, bis 5 Wesen. CHA-Save oder Frightened + Incapacitated bis Ende deines nächsten Zugs (oder Schaden). Fail by ≥5: Wirkung gilt 1 Minute (Save am Ende des Zugs).",category:"feature"},
    ],
    11: [
      {id:"paladin_radiant_strike",name:"Radiant Strike (NEU 2024)",description:"Bei Waffentreffer: +1d8 Strahlend (ohne Slot).",category:"feature"},
      {id:"paladin_channel_divinity_3",name:"Channel Divinity (3 Uses)",description:"3 Uses pro Short Rest.",category:"feature"},
    ],
    14: [
      {id:"paladin_restoring_touch",name:"Restoring Touch (NEU 2024)",description:"Lay on Hands kann auch beenden: Blinded, Charmed, Deafened, Frightened, Paralyzed, Stunned (5 HP pro Condition spend).",category:"feature"},
    ],
    18: [
      {id:"paladin_aura_expansion",name:"Aura Expansion",description:"Aura of Protection + Aura of Courage: Radius 10ft → 30ft.",category:"feature"},
    ],
    19: [
      {id:"paladin_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Truesight empfohlen).",category:"feature"},
    ],
    20: [
      {id:"paladin_oath_capstone",name:"Oath Capstone (Subclass)",description:"Subclass-spezifisches Lv20-Feature (siehe Oath).",category:"feature"},
    ],
  },

  // ── Schurke / Rogue (2024 PHB) ────────────────────────────────────────────
  Schurke: {
    1: [
      {id:"schurke_expertise",name:"Expertise",description:"PB×2 für 2 Skills.",category:"feature"},
      {id:"schurke_sneak_attack",name:"Sneak Attack (1d6)",description:"1×/Zug: +1d6 Schaden mit Finesse/Ranged-Weapon bei Vorteil ODER wenn Verbündeter in 5ft des Ziels. Skaliert: +1d6 alle 2 Lv (Lv20: 10d6).",category:"feature"},
      {id:"schurke_thieves_cant",name:"Thieves' Cant",description:"Geheime Schurkensprache + 1 weitere Sprache.",category:"feature"},
      {id:"schurke_weapon_mastery",name:"Weapon Mastery (NEU 2024)",description:"Nutze Mastery von 2 Waffen mit Finesse/Light Property.",category:"feature"},
    ],
    2: [
      {id:"schurke_cunning_action",name:"Cunning Action",description:"Bonus-Aktion: Dash, Disengage oder Hide.",category:"feature"},
    ],
    3: [
      {id:"schurke_subclass",name:"Rogue Subclass",description:"Wähle: Arcane Trickster, Assassin, Soulknife (NEU 2024) oder Thief.",category:"feature"},
      {id:"schurke_steady_aim",name:"Steady Aim (NEU 2024)",description:"Bonus-Aktion (wenn nicht bewegt): Vorteil auf nächsten Angriff. Speed wird 0 bis Ende des Zugs.",category:"feature"},
    ],
    5: [
      {id:"schurke_cunning_strike",name:"Cunning Strike (NEU 2024)",description:"Bei Sneak Attack: Verbrauche Sneak-Attack-Würfel für Effekte: Daze (1d6, kein action+bonus), Knockout (6d6, Unconscious 1 Min), Obscure (3d6, Blinded), Trip (1d6, Prone), Withdraw (1d6, halbe Speed weg).",category:"feature"},
    ],
    6: [
      {id:"schurke_expertise2",name:"Expertise (2 weitere)",description:"PB×2 für 2 weitere Skills.",category:"feature"},
    ],
    7: [
      {id:"schurke_evasion",name:"Evasion",description:"Erfolgreicher DEX-Save: Kein Schaden. Fail: half.",category:"feature"},
      {id:"schurke_reliable_talent",name:"Reliable Talent (2024 FIX: Lv7)",description:"Bei Skill-Check mit Proficiency: Mindestwert = 10 (war 2014: Lv11).",category:"feature"},
    ],
    11: [
      {id:"schurke_improved_cunning_strike",name:"Improved Cunning Strike (NEU 2024)",description:"Wende bis zu 2 Cunning-Strike-Effekte gleichzeitig an (pro Würfel-Kosten).",category:"feature"},
    ],
    14: [
      {id:"schurke_devious_strikes",name:"Devious Strikes (NEU 2024)",description:"Cunning Strike: Daze (2d6), Knockout (6d6), Obscure (3d6) gelten jetzt auch mit fortgeschrittenen Mechaniken.",category:"feature"},
    ],
    15: [
      {id:"schurke_slippery_mind",name:"Slippery Mind",description:"Übung in WIS + CHA Saves.",category:"feature"},
    ],
    18: [
      {id:"schurke_elusive",name:"Elusive",description:"Angriffe gegen dich haben nie Vorteil (außer du bist Incapacitated).",category:"feature"},
    ],
    19: [
      {id:"schurke_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of the Night Spirit empfohlen).",category:"feature"},
    ],
    20: [
      {id:"schurke_stroke_of_luck",name:"Stroke of Luck",description:"Bei missing d20-Test: Wird zu 20. 1× pro Short/Long Rest.",category:"feature"},
    ],
  },

  // ── Waldläufer / Ranger (2024 PHB) ────────────────────────────────────────
  Waldläufer: {
    1: [
      {id:"waldl_spellcasting",name:"Spellcasting",description:"WIS als Zauberfähigkeit. 2 Lv1-Spells prepared (Ranger ab Lv1, nicht Lv2 wie 2014!).",category:"feature"},
      {id:"waldl_favored_enemy",name:"Favored Enemy (NEU 2024)",description:"Hunter's Mark immer prepared. 2 free Casts (no slot) pro Long Rest. Skaliert: Lv5→3, Lv13→4, Lv17→5.",category:"feature"},
      {id:"waldl_weapon_mastery",name:"Weapon Mastery (NEU 2024)",description:"Nutze Mastery von 2 Simple/Martial-Waffen. Wechselbar nach Long Rest.",category:"feature"},
    ],
    2: [
      {id:"waldl_deft_explorer",name:"Deft Explorer (NEU 2024)",description:"Expertise (PB×2) in 1 Skill. Lerne 2 zusätzliche Sprachen.",category:"feature"},
      {id:"waldl_fighting_style",name:"Fighting Style",description:"Wähle Fighting-Style-Feat (Archery, Defense, Dueling, Two-Weapon).",category:"feature"},
    ],
    3: [
      {id:"waldl_subclass",name:"Ranger Subclass",description:"Wähle: Beast Master, Fey Wanderer (NEU 2024), Gloom Stalker oder Hunter.",category:"feature"},
    ],
    5: [
      {id:"waldl_extra_attack",name:"Extra Attack",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},
    ],
    6: [
      {id:"waldl_roving",name:"Roving (NEU 2024)",description:"+10ft Speed. Climb Speed + Swim Speed = Speed (ohne Heavy Armor).",category:"feature"},
    ],
    9: [
      {id:"waldl_expertise",name:"Expertise (2 weitere)",description:"PB×2 für 2 weitere Skills.",category:"feature"},
    ],
    10: [
      {id:"waldl_tireless",name:"Tireless (NEU 2024)",description:"Magic Action: Gib dir 1d8+Wis Temp HP. (Wis-Mod)×/Long Rest. Nach Short Rest: Exhaustion-Level -1.",category:"feature"},
    ],
    13: [
      {id:"waldl_relentless_hunter",name:"Relentless Hunter (NEU 2024)",description:"Schaden bricht Concentration auf Hunter's Mark nicht.",category:"feature"},
    ],
    14: [
      {id:"waldl_natures_veil",name:"Nature's Veil (NEU 2024)",description:"Bonus-Aktion: Invisible bis Ende deines nächsten Zugs. (Wis-Mod)×/Long Rest.",category:"feature"},
    ],
    17: [
      {id:"waldl_precise_hunter",name:"Precise Hunter (NEU 2024)",description:"Vorteil auf Angriffe gegen Ziel deiner Hunter's Mark.",category:"feature"},
    ],
    18: [
      {id:"waldl_feral_senses",name:"Feral Senses (NEU 2024)",description:"Blindsight 30ft.",category:"feature"},
    ],
    19: [
      {id:"waldl_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Dimensional Travel empfohlen).",category:"feature"},
    ],
    20: [
      {id:"waldl_foe_slayer",name:"Foe Slayer (NEU 2024)",description:"Hunter's Mark Schadenswürfel ist jetzt d10 statt d6.",category:"feature"},
    ],
  },

  // ── Zauberer / Sorcerer (2024 PHB) ────────────────────────────────────────
  Zauberer: {
    1: [
      {id:"zauber_spellcasting",name:"Spellcasting",description:"CHA als Zauberfähigkeit. 4 Cantrips + 2 Lv1-Spells prepared.",category:"feature"},
      {id:"zauber_innate_sorcery",name:"Innate Sorcery (NEU 2024)",description:"Bonus-Aktion: 1 Min Buff. +1 Spell Save DC + Vorteil auf Spell Attack Rolls. 2× pro Long Rest.",category:"feature"},
    ],
    2: [
      {id:"zauber_font_of_magic",name:"Font of Magic",description:"Sorcery Points = Lv. Slots ↔ Punkte konvertieren: 1=2 SP, 2=3, 3=5, 4=6, 5=7.",category:"feature"},
      {id:"zauber_metamagic",name:"Metamagic (2 Optionen)",description:"Wähle 2 Metamagic-Optionen. (2024 FIX: war Lv3 in App)",category:"feature"},
    ],
    3: [
      {id:"zauber_subclass",name:"Sorcerer Subclass (Origin)",description:"Wähle: Aberrant, Clockwork, Draconic oder Wild Magic. (2024 FIX: war Lv1)",category:"feature"},
    ],
    5: [
      {id:"zauber_sorcerous_restoration",name:"Sorcerous Restoration (NEU 2024)",description:"Nach Short Rest: Halbe Sorcery Points zurück. 1× pro Long Rest.",category:"feature"},
    ],
    7: [
      {id:"zauber_sorcery_incarnate",name:"Sorcery Incarnate (NEU 2024)",description:"Während Innate Sorcery: 2 Metamagic-Optionen am gleichen Spell anwenden (Kostet je SP).",category:"feature"},
    ],
    10: [
      {id:"zauber_metamagic2",name:"Metamagic (+1 Option)",description:"3 Metamagic-Optionen.",category:"feature"},
    ],
    17: [
      {id:"zauber_metamagic3",name:"Metamagic (+1 Option)",description:"4 Metamagic-Optionen.",category:"feature"},
    ],
    19: [
      {id:"zauber_epic_boon",name:"Epic Boon (NEU 2024)",description:"Wähle Epic-Boon-Feat (Boon of Dimensional Travel empfohlen).",category:"feature"},
    ],
    20: [
      {id:"zauber_arcane_apotheosis",name:"Arcane Apotheosis (NEU 2024)",description:"Während Innate Sorcery: 1+ Metamagic-Optionen ohne SP-Kosten anwenden.",category:"feature"},
    ],
  },

  // ── Magieschmied (Legacy 2014 — nicht im 2024 PHB Core) ──────────────────
  Magieschmied: {
    1: [
      {id:"ms_basteln",name:"Magisches Basteln (2014 Legacy)",description:"Kleingegenstände mit magischen Effekten erschaffen. NICHT 2024-Stand.",category:"feature"},
      {id:"ms_zauberwirken",name:"Zauberwirken (2014)",description:"INT als Zauberfähigkeit.",category:"feature"},
    ],
    2: [{id:"ms_infusionen",name:"Infusionen (2014)",description:"Lerne Infusionen = 2+Level. Aktiviere davon 2 pro langem Rest.",category:"feature"}],
    3: [{id:"ms_spezialisierung",name:"Artifizient-Spezialisierung (2014 Unterklasse)",description:"Wähle Spezialisierung.",category:"feature"}],
    5: [{id:"ms_extra",name:"Extra-Angriff (2014)",description:"2 Angriffe pro Angriffsaktion.",category:"feature"}],
    10: [{id:"ms_meister",name:"Meister Magischer Gegenstände (2014)",description:"Trage 1 weiteres attuniertes Item (total 4).",category:"feature"}],
    20: [{id:"ms_seele",name:"Seele des Artefakthändlers (2014)",description:"+1 auf alle Rettungswürfe für jedes attunierte Item (max. +6).",category:"feature"}],
  },
};

/** Get all features for a class up to (and including) a given level */
export function getClassFeaturesUpToLevel(className, level) {
  const entries = CLASS_FEATURES[className];
  if (!entries) return [];
  return Object.entries(entries)
    .filter(([lvl]) => parseInt(lvl) <= level)
    .flatMap(([, features]) => features);
}
