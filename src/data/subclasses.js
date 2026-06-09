/**
 * subclasses.js — D&D 5e 2024 PHB Subklassen
 *
 * Format: { [ClassName]: [{ id, name, levelGained, features: [{level, id, name, description, category}] }] }
 *
 * 2024 PHB hat 4 Subklassen pro Klasse (48 insgesamt). Wichtige Änderungen:
 * - Alle Subklassen ab Lv3 (war 2014 oft Lv1/Lv2 für Cleric/Druid/Wizard/Sorcerer/Warlock)
 * - Subklassen-Features auf Lv3, 6, 10, 14 (oder 7/11/15 für andere Klassen)
 * - Neue Subklassen: World Tree (Barbar), Wild Heart (Barbar — Totem reform), Dance (Bard),
 *   Sea + Stars (Druid), Mercy (Monk), Fey Wanderer (Ranger), Soulknife (Rogue),
 *   Aberrant (Sorcerer), Celestial (Warlock)
 * - Entfernt (Legacy 2014): Totem Warrior, Knowledge Domain, Necromancy, Enchantment,
 *   Transmutation, Path of Storm Herald, etc.
 *
 * Format-Hinweis: Wegen Größe halten wir Beschreibungen kompakt (1-2 Sätze pro Feature).
 */
export const SUBCLASSES = {
  // ── Barbar ────────────────────────────────────────────────────────────────
  Barbar: [
    {
      id: "barbar_berserker", name: "Path of the Berserker", levelGained: 3,
      features: [
        { level: 3, id: "barb_b_frenzy", name: "Frenzy (2024 NEU)", description: "Bei Reckless Attack im Rage: 1. Treffer pro Zug verursacht (Rage Damage)d6 zusätzlich. KEIN Exhaustion-Penalty mehr.", category: "feature" },
        { level: 6, id: "barb_b_mindless", name: "Mindless Rage", description: "Im Rage: Immunität gegen Charmed + Frightened. Endet die Conditions bei Rage-Start.", category: "feature" },
        { level: 10, id: "barb_b_retaliation", name: "Retaliation (2024 FIX: Lv10)", description: "Reaktion bei Schaden von Wesen in 5ft: 1 Melee Attack gegen es. (War 2014: Lv14)", category: "feature" },
        { level: 14, id: "barb_b_intimidate", name: "Intimidating Presence", description: "Bonus-Aktion: 30ft Emanation. Wesen DC CHA oder Frightened 1 Min (Save am Ende des Zugs). 1×/LR (oder Rage-Use ausgeben). (War 2014: Lv10)", category: "feature" },
      ],
    },
    {
      id: "barbar_wild_heart", name: "Path of the Wild Heart (NEU 2024 — ersetzt Totem)", levelGained: 3,
      features: [
        { level: 3, id: "barb_wh_animal_speaker", name: "Animal Speaker", description: "Beast Sense + Speak with Animals als Rituale wirken (WIS-basiert).", category: "feature" },
        { level: 3, id: "barb_wh_rage_wilds", name: "Rage of the Wilds", description: "Bei Rage-Start wähle: Bear (Resistenz alles außer Force/Necrotic/Psychic/Radiant) / Eagle (Disengage+Dash als Bonus-Aktion) / Wolf (Verbündete Vorteil auf Angriffe in 5ft deines Feindes).", category: "feature" },
        { level: 6, id: "barb_wh_aspect", name: "Aspect of the Wilds", description: "Wähle (nach LR änderbar): Owl (Darkvision 60ft / +60ft falls schon) / Panther (Climb Speed = Speed) / Salmon (Swim Speed = Speed).", category: "feature" },
        { level: 10, id: "barb_wh_nature_speaker", name: "Nature Speaker", description: "Commune with Nature als Ritual wirken (WIS).", category: "feature" },
        { level: 14, id: "barb_wh_power_wilds", name: "Power of the Wilds", description: "Bei Rage wähle zusätzlich: Falcon (Fly Speed = Speed ohne Rüstung) / Lion (Feinde in 5ft Disadvantage gegen andere Ziele) / Ram (Push/Prone Large oder kleinere bei Treffer).", category: "feature" },
      ],
    },
    {
      id: "barbar_world_tree", name: "Path of the World Tree (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "barb_wt_vitality", name: "Vitality of the Tree", description: "Bei Rage-Start: Temp HP = 2×Rage Damage. Bonus-Aktion (während Rage): Verbündeter in 10ft erhält Temp HP = 1d6 + Barb-Lv.", category: "feature" },
        { level: 6, id: "barb_wt_branches", name: "Branches of the Tree", description: "Reaktion bei Wesen in 30ft: Spektrale Äste. Ziel DC STR oder Speed 0 + teleportiert zu freiem Ort in 5ft von dir.", category: "feature" },
        { level: 10, id: "barb_wt_battering", name: "Battering Roots", description: "Bei Heavy oder Versatile Weapon: +10ft Reach. Bei Treffer: Push 10ft oder Prone (Wahl).", category: "feature" },
        { level: 14, id: "barb_wt_travel", name: "Travel Along the Tree", description: "Bonus-Aktion (während Rage): Teleport bis 60ft. PB Verbündete in 5ft kommen mit. 1×/LR (oder Rage-Use ausgeben). Reichweite 150ft mit gemeinsamem Teleport.", category: "feature" },
      ],
    },
    {
      id: "barbar_zealot", name: "Path of the Zealot", levelGained: 3,
      features: [
        { level: 3, id: "barb_z_divine_fury", name: "Divine Fury (2024)", description: "Im Rage: 1. Treffer/Zug = +1d6 + ½ Barb-Lv Necrotic ODER Radiant Schaden.", category: "feature" },
        { level: 3, id: "barb_z_warrior_gods", name: "Warrior of the Gods (2024 NEU)", description: "Pool von 4 d12 (skaliert: Lv6→5, Lv11→6, Lv17→7). Bonus-Aktion (während Rage): Spende Würfel → heile dich oder Verbündeten in 30ft.", category: "feature" },
        { level: 6, id: "barb_z_fanatical", name: "Fanatical Focus (2024)", description: "Im Rage: Bei missing Save → reroll. 1× pro Rage.", category: "feature" },
        { level: 10, id: "barb_z_zealous", name: "Zealous Presence", description: "Bonus-Aktion: Schlachtruf. Bis 10 Verbündete in 60ft erhalten Vorteil auf Angriffe + Saves bis Anfang deines nächsten Zugs. 1×/LR.", category: "feature" },
        { level: 14, id: "barb_z_rage_beyond", name: "Rage Beyond Death", description: "Im Rage: Bei 0 HP nicht Bewusstlos. Death Saves NICHT erforderlich. Erst bei Rage-Ende: Save oder Stirb.", category: "feature" },
      ],
    },
  ],

  // ── Barde ─────────────────────────────────────────────────────────────────
  Barde: [
    {
      id: "barde_dance", name: "College of Dance (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "bd_d_proficiencies", name: "Bonus Proficiencies", description: "Übung mit Acrobatics + Performance.", category: "feature" },
        { level: 3, id: "bd_d_dazzling", name: "Dazzling Footwork", description: "Während kein Heavy Armor: Unarmed Strike Damage = Martial Arts Die (Bardic Inspiration Die). AC = 10 + DEX + CHA. Du kannst CHA für Unarmed Attacks nutzen.", category: "feature" },
        { level: 6, id: "bd_d_tandem", name: "Tandem Footwork", description: "Bei Initiative: Du + 5 Verbündete in 30ft erhalten Temp HP = Bardic Inspiration Die + CHA-Mod. Speed +10ft bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 14, id: "bd_d_leading", name: "Leading Evasion", description: "Du + Verbündete in 5ft: Erfolgreicher DEX-Save = kein Schaden. Fail = half.", category: "feature" },
      ],
    },
    {
      id: "barde_glamour", name: "College of Glamour", levelGained: 3,
      features: [
        { level: 3, id: "bd_g_mantle", name: "Mantle of Inspiration", description: "Bonus-Aktion: Spend Bardic Inspiration → 5 Verbündete in 60ft Temp HP = 2× Bardic Die + Reaction-Bewegung (halbe Speed ohne Opportunity).", category: "feature" },
        { level: 3, id: "bd_g_enthralling", name: "Enthralling Performance", description: "Nach 1 Min Performance: 3 Wesen die zugesehen DC CHA oder Charmed 1h. Spend 1 Bardic Inspiration. (5 ab Lv5, 8 ab Lv10).", category: "feature" },
        { level: 6, id: "bd_g_unbreakable", name: "Mantle of Majesty", description: "Bonus-Aktion (1 Min Conc): Du erscheinst übernatürlich majestätisch. Aktion: Wirke Command auf 1 Wesen ohne Slot.", category: "feature" },
        { level: 14, id: "bd_g_unfailing", name: "Unbreakable Majesty", description: "Bonus-Aktion: 1 Min lang strahlst du majestätisch. Angreifer DC CHA oder Angriff fehlt + zielt jemand anderen.", category: "feature" },
      ],
    },
    {
      id: "barde_lore", name: "College of Lore", levelGained: 3,
      features: [
        { level: 3, id: "bd_l_proficiencies", name: "Bonus Proficiencies", description: "Übung in 3 Skills deiner Wahl.", category: "feature" },
        { level: 3, id: "bd_l_cutting", name: "Cutting Words (2024)", description: "Reaktion: Wenn Wesen in 60ft d20-Test macht: Spend Bardic Inspiration → subtrahiere Bardic Die vom Wurf (auch nach Hit/Miss).", category: "feature" },
        { level: 6, id: "bd_l_magical_secrets", name: "Magical Secrets (Lv6)", description: "Lerne 2 zusätzliche Spells beliebiger Klasse (zählen als Bard-Spells).", category: "feature" },
        { level: 14, id: "bd_l_peerless", name: "Peerless Skill", description: "Bei missing Skill-Check: Spend Bardic Inspiration → addiere Bardic Die zum Wurf.", category: "feature" },
      ],
    },
    {
      id: "barde_valor", name: "College of Valor", levelGained: 3,
      features: [
        { level: 3, id: "bd_v_combat", name: "Combat Proficiencies", description: "Übung mit Medium Armor, Shields, Martial Weapons.", category: "feature" },
        { level: 3, id: "bd_v_combat_inspiration", name: "Combat Inspiration", description: "Bardic Inspiration: kann statt Roll als Reaktion +Bardic Die zum AC ODER Damage Roll. (Verbündeter)", category: "feature" },
        { level: 6, id: "bd_v_extra_attack", name: "Extra Attack", description: "2 Angriffe pro Angriffsaktion.", category: "feature" },
        { level: 14, id: "bd_v_battle_magic", name: "Battle Magic", description: "Bei Spell-Cast als Aktion: Bonus-Aktion = 1 Weapon Attack.", category: "feature" },
      ],
    },
  ],

  // ── Druide ────────────────────────────────────────────────────────────────
  Druide: [
    {
      id: "druide_land", name: "Circle of the Land", levelGained: 3,
      features: [
        { level: 3, id: "dr_l_circle_spells", name: "Circle Spells", description: "Wähle Land-Typ (Arctic/Coast/Desert/Forest/Grassland/Mountain/Swamp/Underdark). Erhalte 2 always-prepared Spells. Skaliert: Lv5 +2, Lv7 +2, Lv9 +2.", category: "feature" },
        { level: 3, id: "dr_l_recovery", name: "Land's Aid", description: "Magic Action: 10ft Radius Heilung 2d6 + Druid-Mod (alle Verbündete). Schaden gegen Untote/Constructs/Plants. Wis-Mod×/LR.", category: "feature" },
        { level: 6, id: "dr_l_stride", name: "Land's Stride", description: "Difficult Terrain (non-magisch) ignorieren. Pflanzen-Difficult-Terrain ohne Schaden. Vorteil auf Saves gegen Pflanzen.", category: "feature" },
        { level: 10, id: "dr_l_natures_ward", name: "Nature's Ward", description: "Immunität gegen Charmed + Frightened durch Elementals + Fey. Immunität gegen Krankheiten + Gift.", category: "feature" },
        { level: 14, id: "dr_l_sanctuary", name: "Nature's Sanctuary", description: "Beasts + Plants greifen dich nur ungern an. Bei Treffer: DC WIS oder Ziel muss anderes wählen.", category: "feature" },
      ],
    },
    {
      id: "druide_moon", name: "Circle of the Moon", levelGained: 3,
      features: [
        { level: 3, id: "dr_m_combat_ws", name: "Circle Forms (NEU 2024)", description: "Wild Shape Beast-CR höher: ½ Lv (statt CR 1 cap). Erhalte +(2×Druid-Lv) Temp HP bei Wild Shape.", category: "feature" },
        { level: 3, id: "dr_m_lunar_form", name: "Lunar Form", description: "Im Wild Shape: 1. Treffer/Zug = +2d8 Radiant. Magic Action: Wirke Moonbeam ohne Slot (Wis-Mod×/LR).", category: "feature" },
        { level: 6, id: "dr_m_improved", name: "Improved Lunar Radiance", description: "Lunar-Form Treffer: 2d10 Radiant statt 2d8.", category: "feature" },
        { level: 10, id: "dr_m_advanced", name: "Advanced Forms", description: "Im Wild Shape: Resistenz gegen Bludgeoning/Piercing/Slashing (außer magisch/silvern).", category:"feature" },
        { level: 14, id: "dr_m_apex", name: "Lunar Apex", description: "Bonus-Aktion (im Wild Shape): Spend Spell Slot → heile 2d8+Druid-Lv HP + entsche 1 Status (Frightened/Charmed/Poisoned).", category: "feature" },
      ],
    },
    {
      id: "druide_sea", name: "Circle of the Sea (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "dr_s_spells", name: "Circle Spells", description: "Always prepared: Fog Cloud (Lv3), Gust of Wind (Lv5), Wall of Water (Lv7), Control Water (Lv9).", category: "feature" },
        { level: 3, id: "dr_s_wrath", name: "Wrath of the Sea", description: "Magic Action: Wis-Mod×/LR. 30ft Linie: DC CON 2d6 Cold + 10ft Push. Skaliert: Lv7 +1d6, Lv11 +1d6.", category: "feature" },
        { level: 6, id: "dr_s_aquatic", name: "Aquatic Affinity", description: "Swim Speed = Speed. Water Breathing.", category: "feature" },
        { level: 10, id: "dr_s_stormborn", name: "Stormborn", description: "Fly Speed = Speed bei Bewegung. Resistenz Cold + Lightning + Thunder.",category: "feature" },
        { level: 14, id: "dr_s_oceanic", name: "Oceanic Gift", description: "Magic Action: Verbündeter in 60ft erhält Resistenz Cold/Lightning/Thunder + Wrath of Sea-Aktion 1× nutzen.", category: "feature" },
      ],
    },
    {
      id: "druide_stars", name: "Circle of the Stars (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "dr_st_form", name: "Starry Form", description: "Bonus-Aktion (statt Wild Shape): Sternenform 10 Min. Wähle: Archer (Bonus-Aktion: 1d8+Wis Radiant ranged 60ft), Chalice (bei Heal-Spell: Heile zusätzlich 1d8+Wis), Dragon (DC 10 Concentration + 10 Investigation/Insight passive).", category: "feature" },
        { level: 3, id: "dr_st_starry", name: "Star Map", description: "Always prepared: Guidance + Guiding Bolt. Magic Action: Mit Star Map kann Guiding Bolt ohne Slot (Wis-Mod×/LR).", category: "feature" },
        { level: 6, id: "dr_st_cosmic", name: "Cosmic Omen", description: "Bei Long Rest: Wirf d6. Even = Weal (Bonus 1d6 auf Verbündete d20-Tests, Wis×/LR), Odd = Woe (Reaction -1d6 Feind d20-Test).", category: "feature" },
        { level: 10, id: "dr_st_twinkling", name: "Twinkling Constellations", description: "Starry Form Würfel d8→d10. Im Form: Fly Speed 20ft.", category: "feature" },
        { level: 14, id: "dr_st_full", name: "Full of Stars", description: "In Starry Form: Resistenz Bludgeoning/Piercing/Slashing.", category: "feature" },
      ],
    },
  ],

  // ── Hexenmeister / Warlock ────────────────────────────────────────────────
  Hexenmeister: [
    {
      id: "hex_archfey", name: "Archfey Patron", levelGained: 3,
      features: [
        { level: 3, id: "hex_af_spells", name: "Archfey Spells", description: "Always prepared (Lv3): Faerie Fire, Sleep + Lv5/9/13/17 weitere Fey-Spells.", category: "feature" },
        { level: 3, id: "hex_af_step", name: "Steps of the Fey", description: "Wirke Misty Step ohne Slot (Wis-Mod×/LR). Wähle bei Cast: Refreshing Step (Temp HP) oder Taunting Step (Disadvantage Angriffe von Wesen in 5ft).", category: "feature" },
        { level: 6, id: "hex_af_misty_escape", name: "Misty Escape", description: "Reaktion bei Schaden: Teleport bis 60ft + Invisible bis nächster Zug. PB×/LR.", category: "feature" },
        { level: 10, id: "hex_af_beguiling", name: "Beguiling Defenses", description: "Immunität gegen Charmed. Wenn Wesen versucht zu charmen: Reaktion → Charmer DC WIS oder Charmed 1 Min (von dir).", category: "feature" },
        { level: 14, id: "hex_af_dark_delirium", name: "Bewitching Magic", description: "Bei Enchantment/Illusion-Spell-Cast: Bonus-Aktion = Misty Step ohne Slot.", category: "feature" },
      ],
    },
    {
      id: "hex_celestial", name: "Celestial Patron (NEU im 2024 PHB)", levelGained: 3,
      features: [
        { level: 3, id: "hex_c_spells", name: "Celestial Spells", description: "Always prepared (Lv3): Cure Wounds, Guiding Bolt + Aid, Lesser Restoration (Lv5), Daylight, Revivify (Lv9), Guardian of Faith, Wall of Fire (Lv13), Greater Restoration, Summon Celestial (Lv17).", category: "feature" },
        { level: 3, id: "hex_c_bonus_cantrips", name: "Bonus Cantrips", description: "Lerne Light + Sacred Flame.", category: "feature" },
        { level: 3, id: "hex_c_healing_light", name: "Healing Light", description: "Pool = 1+CHA-Mod d6 (heilbare Würfel). Bonus-Aktion: 1+ Würfel ausgeben → heile Wesen in 60ft. Refresh nach Long Rest.", category: "feature" },
        { level: 6, id: "hex_c_radiant_soul", name: "Radiant Soul", description: "Resistenz Radiant. Bei Radiant/Fire-Spell: +CHA-Mod Schaden (1×/Zug).", category: "feature" },
        { level: 10, id: "hex_c_celestial_resilience", name: "Celestial Resilience", description: "Nach Short/Long Rest: Du + 5 Verbündete Temp HP = ½ Warlock-Lv + CHA-Mod.", category: "feature" },
        { level: 14, id: "hex_c_searing", name: "Searing Vengeance", description: "Reaktion bei Verbündeten 0 HP in 60ft: Wesen bei 0 → 1 HP + 2d8+CHA Radiant an 1 Wesen in 60ft + Wesen blinded.", category: "feature" },
      ],
    },
    {
      id: "hex_fiend", name: "Fiend Patron", levelGained: 3,
      features: [
        { level: 3, id: "hex_f_spells", name: "Fiend Spells", description: "Always prepared (Lv3): Burning Hands, Command + Lv5/9/13/17 Fiend-Spells (Scorching Ray, Fireball, Wall of Fire, Hallow).", category: "feature" },
        { level: 3, id: "hex_f_dark_blessing", name: "Dark One's Blessing", description: "Wenn du Wesen auf 0 HP reduzierst: Temp HP = CHA-Mod + Warlock-Lv (min 1).", category: "feature" },
        { level: 6, id: "hex_f_lucky_number", name: "Dark One's Own Luck", description: "Reaktion: Bei d20-Test = +1d10 zum Wurf. Wis-Mod×/LR.", category: "feature" },
        { level: 10, id: "hex_f_fiendish_resilience", name: "Fiendish Resilience", description: "Nach Long Rest: Wähle 1 Damage-Typ → Resistenz dagegen bis nächste LR.", category: "feature" },
        { level: 14, id: "hex_f_hurl_hell", name: "Hurl Through Hell", description: "Bei Treffer: Reaktion → Ziel in Hell-Plane verbannen für 1 Runde (kommt zurück + 8d10 Psychic Schaden). 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "hex_goo", name: "Great Old One Patron", levelGained: 3,
      features: [
        { level: 3, id: "hex_g_spells", name: "Great Old One Spells", description: "Always prepared (Lv3): Dissonant Whispers, Mind Sliver + Lv5/9/13/17 Psychic-Spells.", category: "feature" },
        { level: 3, id: "hex_g_awakened_mind", name: "Awakened Mind", description: "Telepathie 30ft (keine gemeinsame Sprache nötig).", category: "feature" },
        { level: 3, id: "hex_g_psychic_spells", name: "Psychic Spells", description: "Bei Spell-Cast: Wähle Schadenstyp → wird Psychic. Spell mit V-Komponenten kann ohne werden.", category: "feature" },
        { level: 6, id: "hex_g_clairvoyant", name: "Clairvoyant Combatant", description: "Magic Action: Wesen in 60ft DC WIS oder Aufmerksamkeit nur auf dich (Vorteil deine Angriffe, Disadvantage Angriffe auf andere). PB×/LR.", category: "feature" },
        { level: 10, id: "hex_g_thought_shield", name: "Thought Shield", description: "Resistenz Psychic. Wesen die psychisch angreifen: Schaden gleich an Angreifer.", category: "feature" },
        { level: 14, id: "hex_g_create_thrall", name: "Create Thrall", description: "Magic Action: Touch Incapacitated Wesen → Charmed permanent (telepathisch kontaktbar 1 Mile).", category: "feature" },
      ],
    },
  ],

  // ── Kämpfer ───────────────────────────────────────────────────────────────
  Kämpfer: [
    {
      id: "kaempfer_battle_master", name: "Battle Master", levelGained: 3,
      features: [
        { level: 3, id: "fbm_combat_superiority", name: "Combat Superiority", description: "4 Superiority Dice (d8). 3 Maneuvers deiner Wahl. Refresh: Short Rest. Skaliert: Lv7→5 Dice + d10, Lv15→6 Dice + d12.", category: "feature" },
        { level: 3, id: "fbm_student_war", name: "Student of War", description: "Übung in 1 Skill + 1 Tool.", category: "feature" },
        { level: 7, id: "fbm_know_enemy", name: "Know Your Enemy", description: "Magic Action: Studiere Wesen für 1 Min → erfahre 2 Eigenschaften (Stats/Conditions/Resistances).", category: "feature" },
        { level: 10, id: "fbm_improved_combat", name: "Improved Combat Superiority", description: "+2 Maneuvers. Würfel d10.", category: "feature" },
        { level: 15, id: "fbm_relentless", name: "Relentless", description: "Bei Initiative wenn 0 Superiority Dice: Erhalte 1 zurück.", category: "feature" },
        { level: 18, id: "fbm_ultimate", name: "Ultimate Combat Superiority", description: "Würfel d12.", category: "feature" },
      ],
    },
    {
      id: "kaempfer_champion", name: "Champion", levelGained: 3,
      features: [
        { level: 3, id: "fch_improved_critical", name: "Improved Critical", description: "Crit auf 19-20.", category: "feature" },
        { level: 3, id: "fch_remarkable_athlete", name: "Remarkable Athlete", description: "Halber PB auf STR/DEX/CON-Checks ohne Übung. Standing Long Jump +DEX-Mod ft.", category: "feature" },
        { level: 7, id: "fch_additional_fighting_style", name: "Additional Fighting Style", description: "Wähle 2. Fighting Style.", category: "feature" },
        { level: 10, id: "fch_heroic_warrior", name: "Heroic Warrior", description: "Bei Initiative: Heroic Inspiration (wenn nicht schon).", category: "feature" },
        { level: 15, id: "fch_superior_critical", name: "Superior Critical", description: "Crit auf 18-20.", category: "feature" },
        { level: 18, id: "fch_survivor", name: "Survivor", description: "Bei Initiative wenn HP ≤ ½: Regeneriere PB HP zu Beginn deines Zugs.", category: "feature" },
      ],
    },
    {
      id: "kaempfer_eldritch", name: "Eldritch Knight", levelGained: 3,
      features: [
        { level: 3, id: "fek_spellcasting", name: "Spellcasting", description: "INT-Spellcasting. Lerne 2 Cantrips + 3 Lv1-Spells (Abjuration/Evocation Wizard-Liste).", category: "feature" },
        { level: 3, id: "fek_weapon_bond", name: "Weapon Bond", description: "Rituelle Bindung mit Waffe(n). Bonus-Aktion: Beschwöre gebondete Waffe (Touch oder 60ft).", category: "feature" },
        { level: 3, id: "fek_war_magic", name: "War Magic", description: "Bei Cantrip-Cast als Aktion: Bonus-Aktion = 1 Weapon Attack.", category: "feature" },
        { level: 7, id: "fek_war_bond", name: "War Bond", description: "Spell-Cast + Bonus-Aktion gleichzeitig (auch Lv1+ Spells).", category: "feature" },
        { level: 10, id: "fek_eldritch_strike", name: "Eldritch Strike", description: "Bei Treffer: Ziel hat Disadvantage auf nächsten Save gegen deinen Spell (vor Ende deines nächsten Zugs).", category: "feature" },
        { level: 15, id: "fek_arcane_charge", name: "Arcane Charge", description: "Bei Action Surge: Teleport 30ft.", category: "feature" },
        { level: 18, id: "fek_improved_war_magic", name: "Improved War Magic", description: "War Magic gilt auch für Lv1+ Spells (nicht nur Cantrips).", category: "feature" },
      ],
    },
    {
      id: "kaempfer_psi_warrior", name: "Psi Warrior", levelGained: 3,
      features: [
        { level: 3, id: "fpw_psionic_power", name: "Psionic Power", description: "Pool = (2× Fighter PB) Psionic Dice (d6, skaliert d8/d10/d12). 3 Optionen: Protective Field (Reaktion: Reduziere Schaden um 1d6+INT), Psionic Strike (Bonus-Aktion nach Treffer: +1d6+INT Force), Telekinetic Movement (Bonus-Aktion: Bewege Object/Wesen 30ft).", category: "feature" },
        { level: 7, id: "fpw_telekinetic", name: "Telekinetic Adept", description: "Telekinetic Thrust (Push 10ft + Prone). Psi-Powered Leap = Fly 30ft Bonus-Aktion (PB×/LR).", category: "feature" },
        { level: 10, id: "fpw_guarded_mind", name: "Guarded Mind", description: "Resistenz Psychic. Beendet Charmed/Frightened durch Psi Die.", category: "feature" },
        { level: 15, id: "fpw_bulwark", name: "Bulwark of Force", description: "Bonus-Aktion: 5 Wesen in 30ft erhalten ½ Cover (+2 AC + DEX-Save) 1 Min.", category: "feature" },
        { level: 18, id: "fpw_telekinetic_master", name: "Telekinetic Master", description: "Wirke Telekinesis ohne Slot/Concentration. Während aktiv: 1 Weapon Attack als Bonus-Aktion.", category: "feature" },
      ],
    },
  ],

  // ── Kleriker ──────────────────────────────────────────────────────────────
  Kleriker: [
    {
      id: "kleriker_life", name: "Life Domain", levelGained: 3,
      features: [
        { level: 3, id: "cl_life_spells", name: "Life Domain Spells", description: "Always prepared: Bless, Cure Wounds + Aid, Lesser Restoration (Lv5), Beacon of Hope, Revivify (Lv7), Death Ward, Guardian of Faith (Lv9).", category: "feature" },
        { level: 3, id: "cl_life_disciple", name: "Disciple of Life", description: "Bei Heil-Spell (Lv1+): +2 + Slot-Lv HP zusätzlich.", category: "feature" },
        { level: 3, id: "cl_life_channel", name: "Channel Divinity: Preserve Life", description: "Magic Action: Pool 5× Cleric-Lv HP. Verteile unter Wesen in 30ft (kein Wesen über ½ HP-Max).", category: "feature" },
        { level: 6, id: "cl_life_blessed", name: "Blessed Healer", description: "Bei Heil-Spell auf Verbündete: Du heilst 2 + Slot-Lv HP.", category: "feature" },
        { level: 14, id: "cl_life_supreme", name: "Supreme Healing", description: "Bei Heil-Spell: Max statt Würfeln.", category: "feature" },
        { level: 17, id: "cl_life_capstone", name: "Subclass Capstone (Lv17)", description: "Stärkstes Domain-Feature (siehe PHB).", category: "feature" },
      ],
    },
    {
      id: "kleriker_light", name: "Light Domain", levelGained: 3,
      features: [
        { level: 3, id: "cl_light_spells", name: "Light Domain Spells", description: "Always prepared: Burning Hands, Faerie Fire + Scorching Ray (Lv5), Daylight, Fireball (Lv7), Guardian of Faith, Wall of Fire (Lv9).", category: "feature" },
        { level: 3, id: "cl_light_bonus_cantrip", name: "Bonus Cantrip", description: "Light immer prepared.", category: "feature" },
        { level: 3, id: "cl_light_warding", name: "Warding Flare", description: "Reaktion bei Angriff: Angreifer DC Wis oder Disadvantage. Wis-Mod×/LR.", category: "feature" },
        { level: 3, id: "cl_light_channel", name: "Channel Divinity: Radiance of the Dawn", description: "Magic Action: 30ft Radius Sonne. DC CON 2d10+Cleric-Lv Radiant (half). Dispelled magische Darkness.", category: "feature" },
        { level: 6, id: "cl_light_improved_warding", name: "Improved Warding Flare", description: "Auch Verbündete in 30ft schützen. Bei Long Rest: Pool refresh.", category: "feature" },
        { level: 14, id: "cl_light_corona", name: "Corona of Light", description: "Magic Action: 60ft Aura strahlt 1 Min. Feinde haben Disadvantage auf Saves gegen deine Fire/Radiant-Spells.", category: "feature" },
        { level: 17, id: "cl_light_capstone", name: "Subclass Capstone (Lv17)", description: "Stärkstes Domain-Feature.", category: "feature" },
      ],
    },
    {
      id: "kleriker_trickery", name: "Trickery Domain", levelGained: 3,
      features: [
        { level: 3, id: "cl_tr_spells", name: "Trickery Domain Spells", description: "Always prepared: Charm Person, Disguise Self + Mirror Image, Pass without Trace (Lv5), Blink, Dispel Magic (Lv7), Dimension Door, Polymorph (Lv9).", category: "feature" },
        { level: 3, id: "cl_tr_blessing", name: "Blessing of the Trickster", description: "Magic Action: Vorteil auf Stealth-Checks für 1 Wesen (1h, Konzentration nicht erforderlich).", category: "feature" },
        { level: 3, id: "cl_tr_channel", name: "Channel Divinity: Invoke Duplicity", description: "Magic Action: Illusorische Kopie (30ft). Bonus-Aktion bewegen. Wirke Spells durch sie. Verbündete in 5ft der Kopie haben Vorteil auf Angriffe gegen Wesen in 5ft.", category: "feature" },
        { level: 6, id: "cl_tr_cloak", name: "Cloak of Shadows", description: "Channel Divinity-Option: Magic Action → Invisible bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 14, id: "cl_tr_improved", name: "Improved Duplicity", description: "Invoke Duplicity: 4 Kopien. Schaden auf Kopie reicht 5 HP.", category: "feature" },
        { level: 17, id: "cl_tr_capstone", name: "Subclass Capstone (Lv17)", description: "Stärkstes Domain-Feature.", category: "feature" },
      ],
    },
    {
      id: "kleriker_war", name: "War Domain", levelGained: 3,
      features: [
        { level: 3, id: "cl_war_spells", name: "War Domain Spells", description: "Always prepared: Guiding Bolt, Shield of Faith + Magic Weapon, Spiritual Weapon (Lv5), Crusader's Mantle, Spirit Guardians (Lv7), Freedom of Movement, Stoneskin (Lv9).", category: "feature" },
        { level: 3, id: "cl_war_proficiencies", name: "War Proficiencies", description: "Übung mit Martial Weapons + Heavy Armor.", category: "feature" },
        { level: 3, id: "cl_war_priest", name: "War Priest", description: "Bonus-Aktion nach Attack: 1 zusätzlicher Weapon Attack. Wis-Mod×/LR.", category: "feature" },
        { level: 3, id: "cl_war_channel", name: "Channel Divinity: Guided Strike", description: "Reaktion bei Angriff: +10 zum Wurf.", category: "feature" },
        { level: 6, id: "cl_war_strike", name: "War God's Blessing", description: "Channel Divinity-Option: Reaktion → Verbündeter in 30ft erhält +10 zum Angriff.", category: "feature" },
        { level: 14, id: "cl_war_avatar", name: "Avatar of Battle", description: "Resistenz gegen nicht-magischen B/P/S-Schaden.", category: "feature" },
        { level: 17, id: "cl_war_capstone", name: "Subclass Capstone (Lv17)", description: "Stärkstes Domain-Feature.", category: "feature" },
      ],
    },
  ],

  // ── Magier / Wizard ──────────────────────────────────────────────────────
  Magier: [
    {
      id: "magier_abjurer", name: "Abjurer", levelGained: 3,
      features: [
        { level: 3, id: "wz_abj_savant", name: "Abjuration Savant", description: "Spell Master Pool. Schreibe Abjuration-Spells zu halben Kosten/Zeit.", category: "feature" },
        { level: 3, id: "wz_abj_ward", name: "Arcane Ward", description: "Bei Abjuration-Cast (Lv1+): Ward HP = 2×Wizard-Lv + INT-Mod. Schaden geht erst auf Ward.", category: "feature" },
        { level: 6, id: "wz_abj_projected", name: "Projected Ward", description: "Reaktion: Ward schützt Verbündeten in 30ft.", category: "feature" },
        { level: 10, id: "wz_abj_improved", name: "Improved Abjuration", description: "Bei Abjuration-Cast mit Ability Check: +PB.", category: "feature" },
        { level: 14, id: "wz_abj_spell_resistance", name: "Spell Resistance", description: "Vorteil auf Saves gegen Spells. Resistenz gegen Spell-Schaden.", category: "feature" },
      ],
    },
    {
      id: "magier_diviner", name: "Diviner", levelGained: 3,
      features: [
        { level: 3, id: "wz_div_savant", name: "Divination Savant", description: "Divination-Spells zu halben Kosten/Zeit.", category: "feature" },
        { level: 3, id: "wz_div_portent", name: "Portent", description: "Bei Long Rest: Wirf 2d20 (Pool). Spend zu Ersatz für Wesen d20-Test. Lv14: 3 Würfel.", category: "feature" },
        { level: 6, id: "wz_div_expert", name: "Expert Divination", description: "Bei Divination-Spell ≥Lv2: Refund 1 Slot ≤ (gecast Lv - 1).", category: "feature" },
        { level: 10, id: "wz_div_third_eye", name: "The Third Eye", description: "Magic Action: Wähle Buff: Darkvision (60ft), Ethereal Sight (60ft), Greater Comprehension (lese alle Schriften), See Invisibility (60ft). PB×/Short Rest.", category: "feature" },
        { level: 14, id: "wz_div_greater_portent", name: "Greater Portent", description: "Portent jetzt 3 Würfel.", category: "feature" },
      ],
    },
    {
      id: "magier_evoker", name: "Evoker", levelGained: 3,
      features: [
        { level: 3, id: "wz_evo_savant", name: "Evocation Savant", description: "Evocation-Spells zu halben Kosten/Zeit.", category: "feature" },
        { level: 3, id: "wz_evo_sculpt", name: "Sculpt Spells", description: "Bei Evocation-Spell mit Area: Wähle PB Wesen → automatisch erfolgreicher Save + kein Schaden.", category: "feature" },
        { level: 6, id: "wz_evo_potent", name: "Potent Cantrip", description: "Bei Cantrip mit Save: Half Schaden auch bei Save.", category: "feature" },
        { level: 10, id: "wz_evo_empowered", name: "Empowered Evocation", description: "Bei Evocation-Damage-Spell: +INT-Mod Schaden.", category: "feature" },
        { level: 14, id: "wz_evo_overchannel", name: "Overchannel", description: "Bei Evocation Lv1-5: Würfle nicht — nimm Max-Schaden. 1×/LR ohne Penalty. Mehrfach: 2d12+ Necrotic-Schaden eskalierend.", category: "feature" },
      ],
    },
    {
      id: "magier_illusionist", name: "Illusionist", levelGained: 3,
      features: [
        { level: 3, id: "wz_ill_savant", name: "Illusion Savant", description: "Illusion-Spells zu halben Kosten/Zeit.", category: "feature" },
        { level: 3, id: "wz_ill_improved_minor", name: "Improved Minor Illusion", description: "Minor Illusion: Sound UND Object gleichzeitig.", category: "feature" },
        { level: 6, id: "wz_ill_malleable", name: "Malleable Illusions", description: "Magic Action: Forme aktive Illusion (Aussehen/Sound).", category: "feature" },
        { level: 10, id: "wz_ill_illusory_self", name: "Illusory Self", description: "Reaktion bei Treffer: Erzeuge Duplikat → Angriff fehlt. PB×/Short Rest.", category: "feature" },
        { level: 14, id: "wz_ill_real_self", name: "Illusory Reality", description: "Bei Illusion-Spell (Lv1+): Bonus-Aktion → Teil davon wird real (1 Min).", category: "feature" },
      ],
    },
  ],

  // ── Mönch ────────────────────────────────────────────────────────────────
  Mönch: [
    {
      id: "moenche_mercy", name: "Warrior of Mercy (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "mn_m_hand_of_healing", name: "Hand of Healing", description: "Spend 1 Focus: Heile Wesen (Berührung) = Martial Arts Die + Wis-Mod. Bei Flurry: 1 Healing ersetzt 1 Schlag (kein Extra-Focus).", category: "feature" },
        { level: 3, id: "mn_m_hand_of_harm", name: "Hand of Harm", description: "1×/Zug bei Unarmed Hit: Spend 1 Focus → +Martial Arts Die + Wis-Mod Necrotic Damage. Bei Treffer: Ziel CON-Save oder Poisoned bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 6, id: "mn_m_implements", name: "Physician's Touch", description: "Hand of Healing: Beendet Blinded/Deafened/Paralyzed/Poisoned/Stunned. Hand of Harm: Trigger zusätzlich Poisoned bis Ende des nächsten Zugs.", category: "feature" },
        { level: 11, id: "mn_m_flurry", name: "Flurry of Healing and Harm", description: "Flurry of Blows: Jede 'Schlag' kann durch Hand of Healing/Harm ersetzt werden (keine zusätzliche Focus-Kosten).", category: "feature" },
        { level: 17, id: "mn_m_hand_of_ultimate", name: "Hand of Ultimate Mercy", description: "Magic Action (5 Focus): Berühre Leiche (max 24h tot) → reanimiere mit 4d10+Wis HP. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "moenche_shadow", name: "Warrior of Shadow", levelGained: 3,
      features: [
        { level: 3, id: "mn_sh_shadow_arts", name: "Shadow Arts", description: "Lerne Minor Illusion. Spend 2 Focus: Wirke Darkness ohne Slot — kannst durch sie sehen. (Lv5: + Pass without Trace, Lv9: + Silence, Lv13: + Greater Invisibility, Lv17: + Shadow Walk).", category: "feature" },
        { level: 6, id: "mn_sh_shadow_step", name: "Shadow Step", description: "Bei Schwachlicht/Darkness: Bonus-Aktion → Teleport 60ft zu anderem Schwachlicht/Darkness. Nächster Melee Attack: Vorteil.", category: "feature" },
        { level: 11, id: "mn_sh_improved_step", name: "Improved Shadow Step", description: "Shadow Step gilt überall. Spend 1 Focus: Bonus-Aktion → Invisible bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 17, id: "mn_sh_cloak", name: "Cloak of Shadows", description: "Magic Action (3 Focus): Werde unsichtbar UND fortgeschritten Form (Wahl). 1 Min, Conc.", category: "feature" },
      ],
    },
    {
      id: "moenche_elements", name: "Warrior of the Elements", levelGained: 3,
      features: [
        { level: 3, id: "mn_e_arcana", name: "Elemental Attunement", description: "Spend 1 Focus + Bonus-Aktion: 10 Min lang Reach +5ft auf Unarmed Strikes. Bei Treffer: 1d8 Acid/Cold/Fire/Lightning/Thunder (wähle bei Cast).", category: "feature" },
        { level: 6, id: "mn_e_elemental_burst", name: "Elemental Burst", description: "Spend 2 Focus: 20ft Sphere oder 30ft Cube. DC DEX 2d8 + Wis-Mod Element-Schaden (half).", category: "feature" },
        { level: 11, id: "mn_e_stride", name: "Stride of the Elements", description: "Während Elemental Attunement: Fly Speed = Speed + Swim Speed = Speed.", category: "feature" },
        { level: 17, id: "mn_e_chains", name: "Chains of the Elements", description: "Elemental Burst Schaden 4d8. Bei Treffer: Ziel DC STR oder Grappled durch Element. Conc.", category: "feature" },
      ],
    },
    {
      id: "moenche_open_hand", name: "Warrior of the Open Hand", levelGained: 3,
      features: [
        { level: 3, id: "mn_oh_open_hand", name: "Open Hand Technique", description: "Bei Flurry of Blows: Pro Treffer wähle Effekt: Topple (DC DEX oder Prone), Push (DC STR oder 15ft Push), Addle (verliert Reaktionen + Opportunity Attacks gegen dich Disadvantage).", category: "feature" },
        { level: 6, id: "mn_oh_wholeness", name: "Wholeness of Body", description: "Spend 2 Focus: Heile 2d8+Wis HP. Auch bei 0 HP nutzbar. PB×/LR.", category: "feature" },
        { level: 11, id: "mn_oh_fleet_step", name: "Fleet Step", description: "Bonus-Aktion (Spend 1 Focus): Wirke Step of the Wind gratis + 1 weitere Bonus-Aktion.", category: "feature" },
        { level: 17, id: "mn_oh_quivering_palm", name: "Quivering Palm", description: "Spend 4 Focus bei Unarmed Hit: Setze Vibrationen. Magic Action: DC CON oder fällt auf 0 HP (success: 10d12 Necrotic).", category: "feature" },
      ],
    },
  ],

  // ── Paladin ──────────────────────────────────────────────────────────────
  Paladin: [
    {
      id: "paladin_devotion", name: "Oath of Devotion", levelGained: 3,
      features: [
        { level: 3, id: "pd_d_spells", name: "Devotion Spells", description: "Always prepared (Lv3): Protection from Evil and Good, Shield of Faith + Lesser Restoration, Zone of Truth (Lv5), Beacon of Hope, Dispel Magic (Lv9), Freedom of Movement, Guardian of Faith (Lv13), Commune, Flame Strike (Lv17).", category: "feature" },
        { level: 3, id: "pd_d_sacred_weapon", name: "Channel Divinity: Sacred Weapon", description: "Bonus-Aktion: Waffe +CHA-Mod Attack + leuchtet 20ft. 1 Min.", category: "feature" },
        { level: 7, id: "pd_d_aura_devotion", name: "Aura of Devotion", description: "10ft Aura: Du + Verbündete immun gegen Charmed.", category: "feature" },
        { level: 15, id: "pd_d_purity", name: "Smite of Protection", description: "10ft Aura: Du + Verbündete Resistenz gegen Spell-Schaden (1 Min). Bei Divine Smite: Ausweitung 30ft.", category: "feature" },
        { level: 20, id: "pd_d_holy_nimbus", name: "Holy Nimbus", description: "Magic Action: 30ft Aura strahlend 10 Min. Verbündete Vorteil auf Saves gegen Spells. Fiends/Undead in Aura: 10 Radiant am Anfang ihres Zugs. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "paladin_glory", name: "Oath of Glory", levelGained: 3,
      features: [
        { level: 3, id: "pg_g_spells", name: "Glory Spells", description: "Always prepared (Lv3): Guiding Bolt, Heroism + Enhance Ability, Magic Weapon (Lv5), Haste, Protection from Energy (Lv9), Compulsion, Freedom of Movement (Lv13), Legend Lore, Yolande's Regal Presence (Lv17).", category: "feature" },
        { level: 3, id: "pg_g_inspiring", name: "Channel Divinity: Inspiring Smite", description: "Nach Divine Smite: Bonus-Aktion → 30ft Aura, du + 5 Verbündete Temp HP = 2d8+Paladin-Lv.", category: "feature" },
        { level: 3, id: "pg_g_peerless", name: "Peerless Athlete", description: "Channel Divinity (1 Use): 1h lang Vorteil auf Athletics + Acrobatics. Carry Cap ×2. Jump-Distance ×2.", category: "feature" },
        { level: 7, id: "pg_g_aura_alacrity", name: "Aura of Alacrity", description: "5ft Aura (Lv18: 10ft). Du + Verbündete +10ft Speed.", category: "feature" },
        { level: 15, id: "pg_g_glorious", name: "Glorious Defense", description: "Reaktion bei Treffer auf dich/Verbündete in 10ft: +CHA-Mod AC für diesen Angriff. Bei Miss: 1 Melee-Angriff gegen Angreifer. PB×/LR.", category: "feature" },
        { level: 20, id: "pg_g_champion", name: "Living Legend", description: "Bonus-Aktion: 1 Min lang Vorteil auf Angriffe. Reroll Saves 1×/Runde. Misses gegen dich = Treffer Angreifer-Verbündeter in 5ft. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "paladin_ancients", name: "Oath of the Ancients", levelGained: 3,
      features: [
        { level: 3, id: "pa_a_spells", name: "Ancients Spells", description: "Always prepared (Lv3): Ensnaring Strike, Speak with Animals + Misty Step, Moonbeam (Lv5), Plant Growth, Protection from Energy (Lv9), Ice Storm, Stoneskin (Lv13), Commune with Nature, Tree Stride (Lv17).", category: "feature" },
        { level: 3, id: "pa_a_natures_wrath", name: "Channel Divinity: Nature's Wrath", description: "Magic Action: 1 Wesen in 10ft DC STR/DEX oder Restrained 1 Min (Save Ende Zug).", category: "feature" },
        { level: 3, id: "pa_a_turn_faithless", name: "Channel Divinity: Turn the Faithless", description: "Magic Action: Fiends + Fey in 30ft DC WIS oder Turned 1 Min.", category: "feature" },
        { level: 7, id: "pa_a_aura_warding", name: "Aura of Warding", description: "10ft Aura: Resistenz gegen Spell-Schaden für Verbündete.", category: "feature" },
        { level: 15, id: "pa_a_undying", name: "Undying Sentinel", description: "Bei 0 HP (nicht sofortig tot): Bleib bei 1 HP. 1×/LR. Auch: Alterst nicht mehr durch magische Mittel.", category: "feature" },
        { level: 20, id: "pa_a_elder", name: "Elder Champion", description: "Magic Action: 10 Min lang transformiere zu Elder. Heile 10 HP/Anfang Zug. Spells als Bonus-Aktion. Feinde in 10ft Disadvantage auf Saves vs deine Spells/Channel. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "paladin_vengeance", name: "Oath of Vengeance", levelGained: 3,
      features: [
        { level: 3, id: "pv_v_spells", name: "Vengeance Spells", description: "Always prepared (Lv3): Bane, Hunter's Mark + Hold Person, Misty Step (Lv5), Haste, Protection from Energy (Lv9), Banishment, Dimension Door (Lv13), Hold Monster, Scrying (Lv17).", category: "feature" },
        { level: 3, id: "pv_v_vow", name: "Channel Divinity: Vow of Enmity", description: "Bonus-Aktion: 1 Wesen in 10ft → Vorteil auf Angriffe gegen es 1 Min.", category: "feature" },
        { level: 7, id: "pv_v_relentless", name: "Relentless Avenger", description: "Bei Opportunity Attack Hit: Speed des Ziels = 0 + Bonus-Aktion bewege ½ Speed.", category: "feature" },
        { level: 15, id: "pv_v_soul", name: "Soul of Vengeance", description: "Bei Treffer auf Vow-Ziel: Reaktion → Melee Attack gegen es.", category: "feature" },
        { level: 20, id: "pv_v_avenging", name: "Avenging Angel", description: "Bonus-Aktion: 1 Stunde lang Fly Speed 60ft + spektrale Flügel. Feinde in 30ft DC WIS oder Frightened 1 Min. 1×/LR.", category: "feature" },
      ],
    },
  ],

  // ── Schurke / Rogue ──────────────────────────────────────────────────────
  Schurke: [
    {
      id: "schurke_arcane_trickster", name: "Arcane Trickster", levelGained: 3,
      features: [
        { level: 3, id: "rg_at_spellcasting", name: "Spellcasting", description: "INT-Spellcasting. Lerne 3 Cantrips (inkl. Mage Hand) + 3 Lv1-Spells (Enchantment/Illusion Wizard-Liste).", category: "feature" },
        { level: 3, id: "rg_at_mage_hand", name: "Mage Hand Legerdemain", description: "Mage Hand wird unsichtbar. Aktion: Hand kann Locks/Traps disarmen, Items aus Container nehmen.", category: "feature" },
        { level: 9, id: "rg_at_versatile", name: "Versatile Trickster", description: "Bonus-Aktion: Mage Hand lenkt 1 Wesen ab → Vorteil auf nächsten Angriff gegen es.", category: "feature" },
        { level: 13, id: "rg_at_magical_ambush", name: "Magical Ambush", description: "Wenn unsichtbar/hidden: Save-DC für deine Spells gegen Sehende mit Disadvantage.", category: "feature" },
        { level: 17, id: "rg_at_thief_thoughts", name: "Thief's Thoughts", description: "Beim Wirken: Wenn du gegen Wesen hörst → INT-Save oder du weißt 1 Geheimnis.", category: "feature" },
      ],
    },
    {
      id: "schurke_assassin", name: "Assassin", levelGained: 3,
      features: [
        { level: 3, id: "rg_as_proficiencies", name: "Bonus Proficiencies", description: "Übung mit Disguise Kit + Poisoner's Kit.", category: "feature" },
        { level: 3, id: "rg_as_assassinate", name: "Assassinate", description: "Vorteil auf Angriffe gegen Wesen die noch keinen Zug hatten. Kritischer Treffer gegen Surprised Wesen.", category: "feature" },
        { level: 9, id: "rg_as_infiltration", name: "Infiltration Expertise", description: "1h + 25gp: Falsche Identität erstellen.", category: "feature" },
        { level: 13, id: "rg_as_envenom", name: "Envenom Weapons", description: "Bei Poison-Coated Waffe: +1d8 Poison Schaden bei Sneak Attack.", category: "feature" },
        { level: 17, id: "rg_as_death_strike", name: "Death Strike", description: "Bei Surprise-Treffer: Ziel DC CON oder doppelter Schaden.", category: "feature" },
      ],
    },
    {
      id: "schurke_soulknife", name: "Soulknife (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "rg_sk_psionic", name: "Psionic Power", description: "Pool: 2×PB Psionic Dice (d6 → d8 Lv5 → d10 Lv11 → d12 Lv17). Refresh: 1 Würfel bei Initiative wenn 0.", category: "feature" },
        { level: 3, id: "rg_sk_psi_blades", name: "Psychic Blades", description: "Manifestiere Psychic Blade (Light, Finesse, Range 60/120ft Thrown). 1d6 (Lv5 1d8). Bonus-Aktion: Off-Hand Blade.", category: "feature" },
        { level: 9, id: "rg_sk_soul_blades", name: "Soul Blades", description: "Spend Psionic Die: Psychic Teleportation (Bonus-Aktion: Teleport bis 30ft) ODER Homing Strikes (bei Miss: addiere Psionic Die zum Wurf).", category: "feature" },
        { level: 13, id: "rg_sk_psychic_veil", name: "Psychic Veil", description: "Spend 1 Psionic Die: Invisible 1h (oder bis Angriff). Mental Communication 10 Min.", category: "feature" },
        { level: 17, id: "rg_sk_rend_mind", name: "Rend Mind", description: "Bei Sneak Attack: Spend 3 Psionic Dice → Ziel DC WIS oder Stunned 1 Min (Save Ende Zug).", category: "feature" },
      ],
    },
    {
      id: "schurke_thief", name: "Thief", levelGained: 3,
      features: [
        { level: 3, id: "rg_th_fast_hands", name: "Fast Hands", description: "Bonus-Aktion: Sleight of Hand, Use Object oder Use Tool.", category: "feature" },
        { level: 3, id: "rg_th_second_story", name: "Second-Story Work", description: "Klettern kostet keine extra Bewegung. Running Jump: +DEX-Mod ft.", category: "feature" },
        { level: 9, id: "rg_th_supreme_sneak", name: "Supreme Sneak", description: "Spend 1 Cunning Strike-Würfel: Vorteil auf Stealth + Bewegung halbiert für Hide.", category: "feature" },
        { level: 13, id: "rg_th_use_magic", name: "Use Magic Device", description: "Ignoriere Class/Race/Lv Requirements von Magic Items. Spells/Scrolls aus jeder Klasse.", category: "feature" },
        { level: 17, id: "rg_th_thief_reflexes", name: "Thief's Reflexes", description: "Bei Initiative: Nimm 2 Züge (1. normal, 2. mit Initiative -10). 2. Zug: Niemand anderer kann reagieren.", category: "feature" },
      ],
    },
  ],

  // ── Waldläufer / Ranger ──────────────────────────────────────────────────
  Waldläufer: [
    {
      id: "waldl_beast_master", name: "Beast Master", levelGained: 3,
      features: [
        { level: 3, id: "rn_bm_primal", name: "Primal Companion", description: "Beschwöre Beast Companion (Beast of the Land/Sea/Sky). Stat Block: AC 13+Wis, HP 5+(5×Ranger-Lv). Acts in your turn (Dodge unless commanded).", category: "feature" },
        { level: 7, id: "rn_bm_exceptional", name: "Exceptional Training", description: "Bonus-Aktion: Beast macht Dash/Disengage/Dodge/Help als Bonus. Beast Attack: +Wis Force Damage.", category: "feature" },
        { level: 11, id: "rn_bm_bestial", name: "Bestial Fury", description: "Beast Attack: 2 Attacks pro Aktion. Bei Hunter's Mark Hit: +Hunter's Mark Damage.", category: "feature" },
        { level: 15, id: "rn_bm_share", name: "Share Spells", description: "Self-Target Spells gelten auch für Beast (30ft).", category: "feature" },
      ],
    },
    {
      id: "waldl_fey_wanderer", name: "Fey Wanderer (NEU 2024)", levelGained: 3,
      features: [
        { level: 3, id: "rn_fw_dreadful", name: "Dreadful Strikes", description: "1×/Zug bei Weapon Attack: +1d4 Psychic (Lv11: +1d6).", category: "feature" },
        { level: 3, id: "rn_fw_spells", name: "Fey Wanderer Spells", description: "Always prepared: Charm Person, Misty Step (Lv5), Summon Fey (Lv9), Dimension Door (Lv13), Mislead (Lv17).", category: "feature" },
        { level: 3, id: "rn_fw_gift", name: "Otherworldly Glamour", description: "+Wis-Mod CHA-Checks. Übung in Deception, Performance oder Persuasion.", category: "feature" },
        { level: 7, id: "rn_fw_beguiling", name: "Beguiling Twist", description: "Vorteil auf Saves vs Charmed/Frightened. Reaktion bei missing Charmed/Frightened Save eines Verbündeten in 60ft → Save mit Vorteil + bei Erfolg redirecte zum Angreifer.", category: "feature" },
        { level: 11, id: "rn_fw_mind", name: "Fey Reinforcements", description: "Wirke Summon Fey ohne Slot. 1×/LR.", category: "feature" },
        { level: 15, id: "rn_fw_misty", name: "Misty Wanderer", description: "Wirke Misty Step Wis-Mod×/LR ohne Slot. Bei Cast: 1 Verbündeter kommt mit.", category: "feature" },
      ],
    },
    {
      id: "waldl_gloom_stalker", name: "Gloom Stalker", levelGained: 3,
      features: [
        { level: 3, id: "rn_gs_dread", name: "Dread Ambusher", description: "Bei Initiative: +Wis-Mod Init + 10ft Speed + 1 extra Attack im 1. Zug (+1d8 Schaden).", category: "feature" },
        { level: 3, id: "rn_gs_spells", name: "Gloom Stalker Spells", description: "Always prepared: Disguise Self, Rope Trick (Lv5), Fear (Lv9), Greater Invisibility (Lv13), Seeming (Lv17).", category: "feature" },
        { level: 3, id: "rn_gs_umbral", name: "Umbral Sight", description: "Darkvision 60ft (+30ft falls schon). In Darkness: Invisible für Wesen mit Darkvision.", category: "feature" },
        { level: 7, id: "rn_gs_iron_mind", name: "Iron Mind", description: "Übung in Wis + Int Saves.", category: "feature" },
        { level: 11, id: "rn_gs_stalker", name: "Stalker's Flurry", description: "1×/Zug bei Miss: Reroll mit Vorteil.", category: "feature" },
        { level: 15, id: "rn_gs_haunted", name: "Shadowy Dodge", description: "Reaktion bei Angriff: Angreifer mit Disadvantage. Werwölfe/Untote in 5ft: Disadvantage auf Angriffe.", category: "feature" },
      ],
    },
    {
      id: "waldl_hunter", name: "Hunter", levelGained: 3,
      features: [
        { level: 3, id: "rn_h_lore", name: "Hunter's Lore", description: "Du kennst Resistenzen/Immunities/Vulnerabilities von Hunter's-Mark-Zielen.", category: "feature" },
        { level: 3, id: "rn_h_prey", name: "Hunter's Prey", description: "Wähle Lv3 (austauschbar bei Rest): Colossus Slayer (+1d8 wenn Ziel < Max HP, 1×/Zug) ODER Horde Breaker (1×/Zug 2. Attack gegen anderes Wesen in 5ft).", category: "feature" },
        { level: 7, id: "rn_h_defensive", name: "Defensive Tactics", description: "Wähle (austauschbar bei Rest): Escape the Horde (Opportunity Attacks Disadvantage gegen dich) ODER Multiattack Defense (bei Treffer: nächste Angriffe des Wesens Disadvantage).", category: "feature" },
        { level: 11, id: "rn_h_superior_prey", name: "Superior Hunter's Prey", description: "1×/Zug nach Hit auf Hunter's Mark Ziel: Schaden auch an 2. Wesen in 30ft.", category: "feature" },
        { level: 15, id: "rn_h_superior_defense", name: "Superior Hunter's Defense", description: "Reaktion bei Schaden: Resistenz gegen diesen Schadenstyp bis Ende des Zugs.", category: "feature" },
      ],
    },
  ],

  // ── Zauberer / Sorcerer ──────────────────────────────────────────────────
  Zauberer: [
    {
      id: "zauber_aberrant", name: "Aberrant Sorcery (NEU 2024 — ersetzt Aberrant Mind aus Tasha's)", levelGained: 3,
      features: [
        { level: 3, id: "sc_ab_spells", name: "Aberrant Spells", description: "Always prepared: Arms of Hadar, Dissonant Whispers + Detect Thoughts, Calm Emotions (Lv5), Hunger of Hadar, Sending (Lv9), Evard's Black Tentacles, Summon Aberration (Lv13), Telekinesis, Telepathy (Lv17).", category: "feature" },
        { level: 3, id: "sc_ab_telepathic", name: "Telepathic Speech", description: "Telepathie 30ft (keine Sprache nötig).", category: "feature" },
        { level: 6, id: "sc_ab_psionic", name: "Psionic Sorcery", description: "Aberrant-Spells: Wirke ohne V+S, ohne Slot — spend Sorcery Points (Lv = SP).", category: "feature" },
        { level: 6, id: "sc_ab_psychic", name: "Psychic Defenses", description: "Resistenz gegen Psychic. Vorteil auf Saves vs Charmed/Frightened.", category: "feature" },
        { level: 14, id: "sc_ab_revelation", name: "Revelation in Flesh", description: "Bonus-Aktion (1 Sorcery Point): Manifestiere aberrante Fähigkeit (Wahl): Tentacle-Reach 5ft, Sight (See Invisible 60ft), Wings (Fly 30ft), Aquatic (Swim Speed = Speed). 10 Min.", category: "feature" },
        { level: 18, id: "sc_ab_warping", name: "Warping Implosion", description: "Magic Action (5 Sorcery Points): Teleport 120ft. Bei Manifest: Wesen in 30ft DC STR 30 Force (half) + 30ft zu dir gezogen. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "zauber_clockwork", name: "Clockwork Sorcery", levelGained: 3,
      features: [
        { level: 3, id: "sc_cw_spells", name: "Clockwork Spells", description: "Always prepared: Alarm, Protection from Evil and Good + Aid, Lesser Restoration (Lv5), Dispel Magic, Protection from Energy (Lv9), Freedom of Movement, Summon Construct (Lv13), Animate Objects, Wall of Force (Lv17).", category: "feature" },
        { level: 3, id: "sc_cw_restore", name: "Restore Balance", description: "Reaktion: Wesen in 60ft macht d20-Test mit Adv/Disadv → Cancel das (normaler Roll). PB×/LR.", category: "feature" },
        { level: 6, id: "sc_cw_bastion", name: "Bastion of Law", description: "Magic Action (1-5 SP): Schutzschild auf Wesen → Würfel d8s = SP. Spend Würfel um Schaden zu absorbieren. 1 Std.", category: "feature" },
        { level: 14, id: "sc_cw_trance", name: "Trance of Order", description: "Bonus-Aktion: 1 Min lang Angriffe + Saves + Checks: niedrigster Wert = 10 (treat 1-9 als 10). 1×/LR.", category: "feature" },
        { level: 18, id: "sc_cw_clockwork", name: "Clockwork Cavalcade", description: "Magic Action (7 SP): 30ft Cube. Wähle 3 Effekte: Heal 100 HP / Beende Spells ≤Lv6 / Repariere Objekte ≤Cube / Banishe 1 Wesen. 1×/LR.", category: "feature" },
      ],
    },
    {
      id: "zauber_draconic", name: "Draconic Sorcery", levelGained: 3,
      features: [
        { level: 3, id: "sc_dr_spells", name: "Draconic Spells", description: "Always prepared: Chromatic Orb, Command + Dragon's Breath, Scorching Ray (Lv5), Fear, Fly (Lv9), Stoneskin, Wall of Fire (Lv13), Summon Dragon (Lv17).",category: "feature" },
        { level: 3, id: "sc_dr_resilience", name: "Draconic Resilience", description: "+1 HP/Level. AC = 13 + DEX-Mod ohne Rüstung.", category: "feature" },
        { level: 3, id: "sc_dr_ancestry", name: "Draconic Ancestry", description: "Wähle Drachen-Typ. Sprich Drakonisch. Vorteil auf CHA-Checks gegen Drachen.", category: "feature" },
        { level: 6, id: "sc_dr_elemental", name: "Elemental Affinity", description: "Bei Spell mit Drachen-Element: +CHA-Mod Schaden. Spend 1 SP: 1h Resistenz gegen Element.", category: "feature" },
        { level: 14, id: "sc_dr_wings", name: "Dragon Wings", description: "Bonus-Aktion: Fly Speed 60ft. Bis du es endest. Lange Pause: Konzentration nicht nötig.", category: "feature" },
        { level: 18, id: "sc_dr_companion", name: "Dragon Companion", description: "Wirke Summon Dragon 1×/LR ohne Slot. Während aktiv: Kein Conc nötig, Dauer 1 Min.", category: "feature" },
      ],
    },
    {
      id: "zauber_wild_magic", name: "Wild Magic Sorcery", levelGained: 3,
      features: [
        { level: 3, id: "sc_wm_surge", name: "Wild Magic Surge", description: "1×/Zug nach Spell-Cast (Slot Lv1+): Wirf d20. Bei 20: Tabelle d100 (Wild Magic Effekt).", category: "feature" },
        { level: 3, id: "sc_wm_tides", name: "Tides of Chaos", description: "Vorteil auf 1 d20-Test (vor Wurf entscheiden). Nach Spell-Cast: Wild Surge garantiert (Tabelle). Refresh: Long Rest oder nach Surge.", category: "feature" },
        { level: 6, id: "sc_wm_bend", name: "Bend Luck", description: "Reaktion: Wesen in 30ft macht d20-Test → Spend 1 SP, +/- 1d4 zum Wurf.", category: "feature" },
        { level: 14, id: "sc_wm_controlled", name: "Controlled Chaos", description: "Bei Wild Magic Surge: Wirf 2× auf Tabelle, wähle.", category: "feature" },
        { level: 18, id: "sc_wm_spell", name: "Tamed Surge", description: "Nach Spell-Cast: Trigger Wild Magic Surge effekt ohne Wurf (Wahl). 1×/LR.", category: "feature" },
      ],
    },
  ],

  // ── Magieschmied (Legacy 2014 — nicht im 2024 PHB) ───────────────────────
  Magieschmied: [
    {
      id: "ms_battle", name: "Kampfschmied (2014 Legacy)", levelGained: 3,
      features: [
        { level: 3, id: "ms_b_battle", name: "Battle Smith (2014)", description: "Beschwöre Steel Defender + Battle Ready Combat Bonus.", category: "feature" },
      ],
    },
    {
      id: "ms_alchemist", name: "Alchemist (2014 Legacy)", levelGained: 3,
      features: [
        { level: 3, id: "ms_a_alchemy", name: "Alchemist (2014)", description: "Magic Tools + Experimental Elixirs.", category: "feature" },
      ],
    },
  ],
};

/** Get subclass features up to and including a given level */
export function getSubclassFeaturesUpToLevel(className, subclassId, level) {
  const subs = SUBCLASSES[className];
  if (!subs) return [];
  const sub = subs.find(s => s.id === subclassId);
  if (!sub) return [];
  return sub.features.filter(f => f.level <= level);
}

/** Get all subclass display names for a class (string[]) */
export function getSubclassNames(className) {
  const subs = SUBCLASSES[className];
  if (!subs) return [];
  return subs.map(s => s.name);
}

/** Get [{id, name}] list for a class (for picker UIs) */
export function getSubclasses(className) {
  const subs = SUBCLASSES[className];
  if (!subs) return [];
  return subs.map(s => ({ id: s.id, name: s.name }));
}

/** Get the level at which a class chooses its subclass (2024: meist 3) */
export function getSubclassChoiceLevel(className) {
  const subs = SUBCLASSES[className];
  if (!subs || subs.length === 0) return null;
  return subs[0].levelGained;
}

/** Get full subclass data by id */
export function getSubclassById(className, subclassId) {
  const subs = SUBCLASSES[className];
  if (!subs) return null;
  return subs.find(s => s.id === subclassId) || null;
}

/** Get full subclass data by name (used because char.subclasses stores names) */
export function getSubclassByName(className, subclassName) {
  const subs = SUBCLASSES[className];
  if (!subs) return null;
  return subs.find(s => s.name === subclassName) || null;
}
