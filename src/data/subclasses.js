/**
 * subclasses.js — PHB-Subklassen mit Features pro Level
 * Format: { [ClassName]: [{ id, name, levelGained, features: [{level, id, name, description, category}] }] }
 */
export const SUBCLASSES = {
  Barbar: [
    {
      id: "barbar_berserker", name: "Pfad des Berserkers", levelGained: 3,
      features: [
        { level: 3, id: "barb_b_frenzy", name: "Raserei", description: "Im Kampfrausch: Bonus-Aktion für weiteren Nahkampfangriff. Nach: 1 Erschöpfungsstufe.", category: "feature" },
        { level: 6, id: "barb_b_mindless", name: "Gedankenloses Wüten", description: "Im Kampfrausch: Charm und Erschrecken werden bis zum Ende des Kampfrausches ausgesetzt.", category: "feature" },
        { level: 10, id: "barb_b_intimidate", name: "Einschüchternde Präsenz", description: "Aktion: Kreatur in 30 Fuß muss WIS-RW oder ist erschreckt.", category: "feature" },
        { level: 14, id: "barb_b_retaliation", name: "Vergeltung", description: "Reaktion: Wenn Schaden in 5 Fuß → Nahkampfangriff gegen Angreifer.", category: "feature" },
      ],
    },
    {
      id: "barbar_totem", name: "Pfad des Totemkriegers", levelGained: 3,
      features: [
        { level: 3, id: "barb_t_spirit", name: "Totemgeist (Bär/Adler/Wolf)", description: "Bär: Widerstand gegen Schaden im Kampfrausch. Adler: Enteilen als Bonus-Aktion. Wolf: Verbündete erhalten Vorteil.", category: "feature" },
        { level: 6, id: "barb_t_aspect", name: "Aspekt des Totems", description: "Bär: Trage doppeltes Gewicht. Adler: Keine Reaktionsangriffe. Wolf: Verbündete ignorieren schwieriges Terrain.", category: "feature" },
        { level: 14, id: "barb_t_walker", name: "Totemkörper", description: "Bär: Bonus HP im Kampfrausch. Adler: Fluggeschwindigkeit. Wolf: Kannst dich durch Feinde bewegen.", category: "feature" },
      ],
    },
    {
      id: "barbar_zelot", name: "Pfad des Zeloten", levelGained: 3,
      features: [
        { level: 3, id: "barb_z_fury", name: "Göttlicher Kampfrausch", description: "Im Kampfrausch: +PB Strahlungs-/Nekroseschaden bei 1. Angriff pro Zug.", category: "feature" },
        { level: 6, id: "barb_z_mind", name: "Zealoter-Präsenz", description: "Verbündete können für dich sterben-Würfe wiederholen.", category: "feature" },
        { level: 10, id: "barb_z_magic", name: "Göttliche Magie",   description: "Kannst Zauber wirken während du zerstört bist.", category: "feature" },
        { level: 14, id: "barb_z_revive", name: "Unaufhaltsame Wut", description: "Stirbst du im Kampfrausch: Weiterhin kämpfen (bis Kampfrausch endet oder Runde später).", category: "feature" },
      ],
    },
  ],
  Barde: [
    {
      id: "barde_wissen", name: "Schule des Wissens", levelGained: 3,
      features: [
        { level: 3, id: "barde_wis_bonus", name: "Bonusprofizienzen", description: "3 zusätzliche Skill-Profizienzen nach Wahl.", category: "feature" },
        { level: 3, id: "barde_wis_secrets", name: "Schneidende Worte", description: "Reaktion: Gegner würfelt 1W8 von Angriff, Schaden oder Rettungswurf ab.", category: "feature" },
        { level: 6, id: "barde_wis_magic", name: "Magische Geheimnisse (L6)", description: "Lerne 2 Zauber beliebiger Klasse.", category: "feature" },
        { level: 14, id: "barde_wis_peerless", name: "Unerreichtes Können", description: "Lege Bardische Inspiration auf dich selbst.", category: "feature" },
      ],
    },
    {
      id: "barde_wagemut", name: "Schule des Wagemuts", levelGained: 3,
      features: [
        { level: 3, id: "barde_wag_combat", name: "Kampfprofizienzen", description: "Mittlere Rüstung, Schilde, Kriegswaffen.",  category: "feature" },
        { level: 3, id: "barde_wag_attack", name: "Kampfmagie", description: "Bonus-Aktion: Waffenangriff nach Zauber.", category: "feature" },
        { level: 6, id: "barde_wag_maneuver", name: "Zusätzlicher Angriff", description: "2 Angriffe pro Angriffsaktion.", category: "feature" },
        { level: 14, id: "barde_wag_blade", name: "Klingenblüte", description: "Wenn du Schaden zufügst: Verbündete innerhalb 5 Fuß erhalten HP = PB.", category: "feature" },
      ],
    },
  ],
  Druide: [
    {
      id: "druide_mond", name: "Zirkel des Mondes (Circle of the Moon)", levelGained: 3,
      features: [
        { level: 2, id: "druide_mond_combat", name: "Kampfwildnis", description: "Tiergestalt bis CR Stufe÷3 (min CR 1). Bonus-Aktion statt Aktion.", category: "feature" },
        { level: 6, id: "druide_mond_primal", name: "Urwandlung", description: "Tier-Angriffe gelten als magisch in Tiergestalt.", category: "feature" },
        { level: 10, id: "druide_mond_element", name: "Elementale Gestalt", description: "Kann in Elementarwesen wechseln (Luft/Erd/Feuer/Wasser).", category: "feature" },
        { level: 14, id: "druide_mond_wilder", name: "Bewusste Wildnis", description: "Zauberwirken in Tiergestalt.", category: "feature" },
      ],
    },
    {
      id: "druide_land", name: "Zirkel des Landes (Circle of the Land)", levelGained: 3,
      features: [
        { level: 2, id: "druide_land_bonus", name: "Bonus-Cantrip", description: "Lerne 1 weiteren Druiden-Cantrip.", category: "feature" },
        { level: 2, id: "druide_land_recovery", name: "Natürliche Wiederherstellung", description: "Nach kurzem Rest: Zauberplätze ≤ ½ Level zurückerhalten.", category: "feature" },
        { level: 6, id: "druide_land_stride", name: "Landgang", description: "Schwieriges Terrain verlangsamt dich in bevorzugtem Gelände nicht.", category: "feature" },
        { level: 10, id: "druide_land_mind", name: "Naturverbundenheit", description: "Immun gegen Bezauberung und Erschrecken.", category: "feature" },
      ],
    },
  ],
  Hexenmeister: [
    {
      id: "hex_grosser_alte", name: "Der Große Alte", levelGained: 3,
      features: [
        { level: 1, id: "hex_ga_mind", name: "Ausgeweitetes Gedächtnis", description: "+WIS-Mod auf Arkane-Kunde-Proben.", category: "feature" },
        { level: 6, id: "hex_ga_telepathy", name: "Telepathie", description: "Telepath. Kommunikation in 30 Fuß (ohne Zustimmung).", category: "feature" },
        { level: 10, id: "hex_ga_shield", name: "Tentakelschutz", description: "Wenn Bezauberung gegen dich → kann zurückreflektiert werden.", category: "feature" },
        { level: 14, id: "hex_ga_enthrall", name: "Verschlungener Wille", description: "Bezauberungszauber auf mehrere Ziele gleichzeitig.", category: "feature" },
      ],
    },
    {
      id: "hex_unhold", name: "Der Unhold", levelGained: 3,
      features: [
        { level: 1, id: "hex_fey_presence", name: "Unholds Segen",  description: "+CHA-Mod auf Schadensrollen (1× pro Zug).", category: "feature" },
        { level: 6, id: "hex_fey_ward", name: "Dunkle Abwehr", description: "Reaktion: Reduziere Schaden um 2× Hexenmeisterlevel.", category: "feature" },
        { level: 10, id: "hex_fey_flight", name: "Fliegen",         description: "Fluggeschwindigkeit = Gehgeschwindigkeit.", category: "feature" },
        { level: 14, id: "hex_fey_fire", name: "Dunkle Flut",      description: "Wähle Wesen und verteile Schaden an andere in 5 Fuß.", category: "feature" },
      ],
    },
    {
      id: "hex_erzfee", name: "Erzfeen", levelGained: 3,
      features: [
        { level: 1, id: "hex_arc_presence", name: "Feenpräsenz", description: "Aktion: Wesen in 10 Fuß Kubus um dich → WIS-RW oder bezaubert/erschreckt bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 6, id: "hex_arc_step", name: "Misty Escape", description: "Reaktion wenn Schaden: Teleportiere 60 Fuß + unsichtbar bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 10, id: "hex_arc_beguile", name: "Betörung", description: "Bezauberung/Erschrecken in größerem Radius.", category: "feature" },
        { level: 14, id: "hex_arc_dark_delirium", name: "Dunkle Ekstase", description: "1 Minute: Ziel bezaubert oder erschreckt, benommen.", category: "feature" },
      ],
    },
  ],
  Kämpfer: [
    {
      id: "kaempfer_champion", name: "Champion", levelGained: 3,
      features: [
        { level: 3, id: "champ_crit", name: "Verbesserter Kritischer Treffer", description: "Kritischer Treffer auf W20-Ergebnis 19 und 20.", category: "feature" },
        { level: 7, id: "champ_athletics", name: "Bemerkenswerter Athlet", description: "+½ PB (aufgerundet) auf STR/DEX/CON-Proben ohne PB.", category: "feature" },
        { level: 10, id: "champ_style2", name: "Zusätzlicher Kampfstil", description: "Lerne einen weiteren Kampfstil.", category: "feature" },
        { level: 15, id: "champ_crit2", name: "Überlegener Kritischer Treffer", description: "Kritischer Treffer auf W20-Ergebnis 18, 19, 20.", category: "feature" },
        { level: 18, id: "champ_survivor", name: "Überlebender", description: "Wenn HP ≤ ½ Max-HP: Regeneriere PB HP zu Beginn deines Zugs.", category: "feature" },
      ],
    },
    {
      id: "kaempfer_kampfmeister", name: "Kampfmeister", levelGained: 3,
      features: [
        { level: 3, id: "bm_maneuvers", name: "Kampfmanöver (3)",  description: "Wähle 3 Kampfmanöver (Angriff, Pariere, Einschüchterung, etc.). Überlegenheitswürfel: W8.", category: "feature" },
        { level: 7, id: "bm_know", name: "Bekanntes Werkzeug", description: "+1 Überlegenheitswürfel, Würfel steigt auf W10.", category: "feature" },
        { level: 10, id: "bm_more_maneuvers", name: "Weitere Manöver", description: "Lerne 2 weitere Kampfmanöver.", category: "feature" },
        { level: 15, id: "bm_relentless", name: "Unerbittlich", description: "Wenn Initiative und 0 Überlegenheitswürfel: Erhalte 1 zurück.", category: "feature" },
      ],
    },
    {
      id: "kaempfer_eldritch", name: "Mystischer Ritter", levelGained: 3,
      features: [
        { level: 3, id: "ek_spells", name: "Zauberwirken (INT)", description: "Magierschule-Zauber + 1 beliebiger Zauber. INT als Zauberfähigkeit.", category: "feature" },
        { level: 7, id: "ek_bind", name: "Gebundene Waffe", description: "Verbinde eine Waffe: Kann sie als Bonus-Aktion beschwören.", category: "feature" },
        { level: 10, id: "ek_eldritch_strike", name: "Mystischer Schlag", description: "Wenn Waffentreffer: Nächster Zauber gegen das Ziel lässt dessen RW mit Nachteil würfeln.", category: "feature" },
        { level: 15, id: "ek_arcane_charge", name: "Arkaner Angriff", description: "Wenn Tatendrang: Teleportiere bis 30 Fuß vor oder nach Angriffen.", category: "feature" },
      ],
    },
  ],
  Kleriker: [
    {
      id: "kleriker_leben", name: "Domäne des Lebens", levelGained: 3,
      features: [
        { level: 1, id: "life_proficiency", name: "Schwere Rüstungsprofizienzen", description: "Profizient mit schwerer Rüstung.", category: "feature" },
        { level: 1, id: "life_disciple", name: "Jünger des Lebens", description: "Heilzauber: Heile 2 + Zaubergrad extra HP.", category: "feature" },
        { level: 2, id: "life_channel", name: "Kanalenergie: Leben erhalten", description: "Kanalenergie: Stelle jedem Verbündeten in 30 Fuß min. 1 HP wieder her.", category: "feature" },
        { level: 6, id: "life_blessed", name: "Gesegnete Heilung", description: "Wenn du Heilzauber auf andere wirkst: Du erhältst auch 2 + Zaubergrad HP.", category: "feature" },
        { level: 8, id: "life_divine_strike", name: "Göttlicher Schlag", description: "+1W8 (ab L14: 2W8) Strahlungsschaden bei Waffenangriff 1× pro Zug.", category: "feature" },
      ],
    },
    {
      id: "kleriker_wissen", name: "Domäne des Wissens", levelGained: 3,
      features: [
        { level: 1, id: "know_languages", name: "Sprachen & Profizienzen", description: "Lerne 2 Sprachen. Wähle 2 Fertigkeiten: Expertise in ihnen.", category: "feature" },
        { level: 2, id: "know_channel", name: "Kanalenergie: Wissen", description: "10 Min. Konzentration: Profizient in 1 Skill oder Werkzeug.", category: "feature" },
        { level: 6, id: "know_read_thoughts", name: "Gedanken lesen", description: "Lies Gedanken eines Wesens (WIS-RW oder du liest oberflächliche Gedanken).", category: "feature" },
        { level: 8, id: "know_potent", name: "Wirksamer Zauber", description: "+WIS-Mod Schaden bei Cantrips.", category: "feature" },
      ],
    },
    {
      id: "kleriker_krieg", name: "Domäne des Krieges", levelGained: 3,
      features: [
        { level: 1, id: "war_proficiency", name: "Kriegsprofizienzen", description: "Schwere Rüstung, Kriegswaffen.", category: "feature" },
        { level: 1, id: "war_bonus", name: "Kriegspriester", description: "Bonus-Aktion: Waffenangriff (WIS-Mod × pro Rast).", category: "feature" },
        { level: 2, id: "war_channel", name: "Kanalenergie: Strafe des Kriegers", description: "Reaktion: +10 auf Angriffswurf.", category: "feature" },
        { level: 6, id: "war_divine", name: "Göttliche Streitmacht", description: "Zauberwirken + Angriff in gleichem Zug.", category: "feature" },
        { level: 8, id: "war_strike", name: "Göttlicher Schlag", description: "+1W8 (ab L14: 2W8) Wucht- oder Hiebschaden 1× pro Zug.", category: "feature" },
      ],
    },
  ],
  Magier: [
    {
      id: "magier_verzauberung", name: "Schule der Verzauberung", levelGained: 3,
      features: [
        { level: 2, id: "enc_hypnotic", name: "Hypnotischer Blick", description: "Aktion: 1 Wesen in 5 Fuß → WIS-RW oder bezaubert bis Ende deines nächsten Zugs.", category: "feature" },
        { level: 6, id: "enc_instinctive", name: "Instinktive Bezauberung", description: "Wenn gegen dich angegriffen: Leite Angriff auf nahes Wesen um.", category: "feature" },
        { level: 10, id: "enc_split", name: "Geteilte Bezauberung", description: "Wähle ein weiteres Ziel für Bezauberungszauber (ohne extra Slot).", category: "feature" },
        { level: 14, id: "enc_alter", name: "Erinnerungen verändern", description: "Bearbeite kurze Erinnerung eines bezauberten Wesens.", category: "feature" },
      ],
    },
    {
      id: "magier_hervorrufung", name: "Schule der Hervorrufung", levelGained: 3,
      features: [
        { level: 2, id: "evoc_sculpt", name: "Zauber formen", description: "Rette Verbündete automatisch aus Flächenzaubern.", category: "feature" },
        { level: 6, id: "evoc_potent", name: "Wirksamer Cantrip", description: "Wenn Wesen bei Cantrip-Schaden RW besteht: ½ Schaden (statt keiner).", category: "feature" },
        { level: 10, id: "evoc_empowered", name: "Verstärkter Zauber", description: "Reroll bis INT-Mod Schadenswürfel (1× pro Zauber).", category: "feature" },
        { level: 14, id: "evoc_overchannel", name: "Überkanalisation", description: "Maximiere Schadenswürfel von L1-L5-Zaubern (Nachteil: ab 2. Nutzung Schaden für dich).", category: "feature" },
      ],
    },
    {
      id: "magier_nekromantie", name: "Schule der Nekromantie", levelGained: 3,
      features: [
        { level: 2, id: "nec_grim", name: "Düstere Ernte", description: "Töte Wesen mit Nekromantie-Zauber: Erhalte Max(Level, 1) temporäre HP.", category: "feature" },
        { level: 6, id: "nec_undead", name: "Untote Diener", description: "Animiere Untote als Bonus-Aktion + erhöhe Max-Anzahl animierter Untote.", category: "feature" },
        { level: 10, id: "nec_indomit", name: "Untoter-Kommandant", description: "Deine animierten Untoten erhalten Vorteil auf Rettungswürfe und zusätzliche Attacken.", category: "feature" },
        { level: 14, id: "nec_command_undead", name: "Untote beherrschen", description: "Kontrolliere mächtige Untote bis CR = Magier-Level ÷ 2.", category: "feature" },
      ],
    },
  ],
  Mönch: [
    {
      id: "moenche_offene_hand", name: "Weg der offenen Hand", levelGained: 3,
      features: [
        { level: 3, id: "oh_flurry", name: "Offene-Hand-Technik", description: "Nach Wirbelwind-Schlägen: Knockback, Knock Prone, oder Reaktionslos machen.", category: "feature" },
        { level: 6, id: "oh_spirit", name: "Verwundungslosigkeit", description: "Kannst den Körperfunktionen widerstehen: Kein Schlaf/Nahrung/Wasser nötig.", category: "feature" },
        { level: 11, id: "oh_tranq", name: "Ruhige Seele", description: "Immunität gegen Bezauberung und Erschrecken.", category: "feature" },
        { level: 17, id: "oh_quivering", name: "Zitternde Handfläche", description: "1 Ki: Töte Ziel (CON-RW oder automatisch nach 1 Woche).", category: "feature" },
      ],
    },
    {
      id: "moenche_schatten", name: "Weg des Schattens", levelGained: 3,
      features: [
        { level: 3, id: "shadow_arts", name: "Schattenkünste", description: "Ki-Zauber: Darkness, Darkvision, Pass Without Trace, Silence.", category: "feature" },
        { level: 6, id: "shadow_step", name: "Schattensprung", description: "Bonus-Aktion: Teleportiere zwischen Dunkelheitsbereichen (≤ 60 Fuß).", category: "feature" },
        { level: 11, id: "shadow_cloak", name: "Schattenmantel", description: "In Dunkelheit: Unsichtbar.", category: "feature" },
        { level: 17, id: "shadow_opportunist", name: "Gelegenheitsmeister", description: "Reaktion wenn Verbündeter einen Angriff trifft: Eigener Angriff.",  category: "feature" },
      ],
    },
  ],
  Paladin: [
    {
      id: "paladin_hingabe", name: "Eid der Hingabe", levelGained: 3,
      features: [
        { level: 3, id: "dev_sacred_weapon", name: "Heilige Waffe", description: "Kanalenergie: Waffe leuchtet, +CHA-Mod auf Angriffe für 1 Min.", category: "feature" },
        { level: 3, id: "dev_turn_undead", name: "Untote vertreiben", description: "Kanalenergie: Untote in 30 Fuß müssen WIS-RW oder fliehen.", category: "feature" },
        { level: 7, id: "dev_aura_devotion", name: "Aura der Hingabe", description: "Du + Verbündete in 10 Fuß: Immun gegen Bezauberung.", category: "feature" },
        { level: 15, id: "dev_purity", name: "Reinheit des Geistes", description: "Immer unter Schutz vor Böse und Gut.", category: "feature" },
        { level: 20, id: "dev_holy", name: "Heilige Nemesis", description: "Wachse zu einem engelhaften Wesen: Flügel, Angriffsaura, Immunität.", category: "feature" },
      ],
    },
    {
      id: "paladin_rache", name: "Eid der Rache", levelGained: 3,
      features: [
        { level: 3, id: "rev_vow", name: "Rache schwören",    description: "Bonus-Aktion: Schwöre Rache gegen 1 Wesen: Vorteil auf Angriffe, CHA-Mod Schaden extra.", category: "feature" },
        { level: 3, id: "rev_hold", name: "Untote festhalten", description: "Kanalenergie: Untote paralysiert (WIS-RW).", category: "feature" },
        { level: 7, id: "rev_aura", name: "Unnachgiebige Aura",  description: "Du + Verbündete in 10 Fuß: Bewegungsgeschwindigkeit nicht reduzierbar.", category: "feature" },
        { level: 15, id: "rev_soul", name: "Seele des Rächers", description: "Tötest du das geschwörene Ziel → bonus Aktion / Angriff.", category: "feature" },
        { level: 20, id: "rev_avenging", name: "Rächer-Inkarnation", description: "Flügel + Aura 30 Fuß: Feinde haben Nachteil gegen alle in der Aura.", category: "feature" },
      ],
    },
    {
      id: "paladin_alte", name: "Eid der Alten", levelGained: 3,
      features: [
        { level: 3, id: "anc_nature", name: "Natürliche Kraft", description: "Kanalenergie: Heile 1W8 + WIS-Mod HP pro Level.", category: "feature" },
        { level: 7, id: "anc_aura", name: "Aura des Schutzes (Magie)", description: "Du + Verbündete in 10 Fuß: Resistenz gegen Zauberschaden.", category: "feature" },
        { level: 15, id: "anc_undying", name: "Unverwüstlichkeit", description: "Sterbend? Immun gegen Alterung und Magie-induziertem Tod.", category: "feature" },
        { level: 20, id: "anc_elder", name: "Ältester Kämpfer", description: "Verwandle dich in eine ätherische Version deiner selbst.", category: "feature" },
      ],
    },
  ],
  Schurke: [
    {
      id: "schurke_assassine", name: "Assassine", levelGained: 3,
      features: [
        { level: 3, id: "ass_proficiency", name: "Assassinen-Werkzeug", description: "Profizient mit Verkleidungsset und Giftkit.", category: "feature" },
        { level: 3, id: "ass_assassinate", name: "Assassinieren", description: "Vorteil gegen Wesen die noch nicht am Zug waren. Kritisch wenn überrascht.", category: "feature" },
        { level: 9, id: "ass_infiltrate", name: "Infiltrationsexpertise", description: "Erstelle perfekte Tarnidentität in 7 Tagen.", category: "feature" },
        { level: 13, id: "ass_imposter", name: "Doppelgänger", description: "Imitiere eine Stimme und Manierismen einer Person nach 3h Beobachtung.", category: "feature" },
      ],
    },
    {
      id: "schurke_trickster", name: "Arkaner Trickser", levelGained: 3,
      features: [
        { level: 3, id: "at_spells", name: "Zauberwirken (INT)", description: "Illusionen und Beschwörungszauber. INT als Zauberfähigkeit.", category: "feature" },
        { level: 3, id: "at_mage_hand", name: "Mage Hand Legerdemain", description: "Mage Hand kann unsichtbar stehlen, Schlösser knacken, etc.", category: "feature" },
        { level: 9, id: "at_magical_ambush", name: "Magischer Hinterhalt", description: "Wenn du unsichtbar Zauber wirkst: Ziel hat Nachteil auf RW.", category: "feature" },
        { level: 13, id: "at_versatile", name: "Wandelfähiger Zauberer", description: "Wenn du handeln und Zauber wirken kannst: Trick als Bonus.", category: "feature" },
      ],
    },
  ],
  Waldläufer: [
    {
      id: "waldl_jaeger", name: "Jäger", levelGained: 3,
      features: [
        { level: 3, id: "hunter_prey", name: "Jäger-Beute", description: "Wähle: Riesenmörder (+W8 Schaden), Brutalmörder (alle in 5 Fuß), oder Kolossmörder.", category: "feature" },
        { level: 7, id: "hunter_tactics", name: "Verteidigungstaktiken", description: "Wähle: Entrinne nicht (Reaktion), Eisengewillt, Mehrangreifer-Verteidigung.", category: "feature" },
        { level: 11, id: "hunter_multi", name: "Mehrfachangriff", description: "Wähle: Salvenschuss (3 Ziele), Wirbelwindschlag (alle in 5 Fuß).", category: "feature" },
        { level: 15, id: "hunter_super", name: "Überlegene Jägerkünste", description: "Wähle: Unerschütterlich, Spreizungsschuss (3 Pfeile 1 Aktion).", category: "feature" },
      ],
    },
    {
      id: "waldl_horizont", name: "Horizont-Wanderer", levelGained: 3,
      features: [
        { level: 3, id: "hw_portal", name: "Portal-Erkundung", description: "+WIS-Mod auf Nachforschung über Ebenen + Detektierung magischer Portale.", category: "feature" },
        { level: 3, id: "hw_planar", name: "Planarer Krieger", description: "Bonus-Aktion: 1 Wesen nimmt 1W8 extra Kraft-Schaden.", category: "feature" },
        { level: 7, id: "hw_ethereal", name: "Ätherischer Schritt", description: "Bonus-Aktion: Tritt für 1 Runde in die Ätherische Ebene.", category: "feature" },
        { level: 11, id: "hw_distant_strike", name: "Ferner Schlag", description: "Teleportiere 10 Fuß vor Angriffen. Dritter Angriff gegen ein weiteres Wesen.", category: "feature" },
      ],
    },
  ],
  Zauberer: [
    {
      id: "zauber_drachenblut", name: "Drachenblut", levelGained: 3,
      features: [
        { level: 1, id: "drac_ancestry", name: "Drachen-Abstammung", description: "Wähle Drachentyp → bestimmt Cantrip und Schadensresistenz.", category: "feature" },
        { level: 1, id: "drac_resilience", name: "Drakonische Robustheit", description: "+1 HP pro Level. RK = 13 + DEX-Mod ohne Rüstung.", category: "feature" },
        { level: 6, id: "drac_affinity", name: "Elementare Affinität", description: "+CHA-Mod Schaden wenn passender Schadenstyp.", category: "feature" },
        { level: 14, id: "drac_wings", name: "Drachenflügel", description: "Bonus-Aktion: Flügel und Fluggeschwindigkeit.", category: "feature" },
        { level: 18, id: "drac_presence", name: "Drakonische Präsenz", description: "Aktion: Furcht oder Begeisterung in 60 Fuß.", category: "feature" },
      ],
    },
    {
      id: "zauber_wildmagie", name: "Wilde Magie", levelGained: 3,
      features: [
        { level: 1, id: "wild_surge", name: "Wilde Magie-Woge",  description: "DM kann W1-100 rollen → zufällige magische Effekte nach Zaubern.", category: "feature" },
        { level: 1, id: "wild_tides", name: "Tides of Chaos", description: "1× pro langem Rest: Vorteil auf Angriff/Probe/RW. Reset bei wilder Woge.", category: "feature" },
        { level: 6, id: "wild_bend", name: "Magie biegen", description: "Reaktion: +INT-Mod auf RW eines Verbündeten.", category: "feature" },
        { level: 14, id: "wild_controlled", name: "Kontrollierte Chaos", description: "Bei Wilder Woge: Würfle 2× auf der Tabelle, wähle Ergebnis.", category: "feature" },
      ],
    },
  ],
  Magieschmied: [
    {
      id: "ms_kampfschmied", name: "Kampfschmied", levelGained: 3,
      features: [
        { level: 3, id: "bs_proficiency", name: "Werkzeugprofizienzen", description: "Profizient mit Schmiedewerkzeug. INT statt STR für Waffenangriffe.", category: "feature" },
        { level: 3, id: "bs_steel_defender", name: "Stahlverteidiger", description: "Erschaffe einen mechanischen Begleiter (CR = Level ÷ 3).", category: "feature" },
        { level: 9, id: "bs_arcane_jolt", name: "Arkaner Stoß", description: "Magische Waffe: +2W6 Kraft oder heilige Schaden oder Geistesheilen 2W6.", category: "feature" },
        { level: 15, id: "bs_improved_defender", name: "Verbesserter Verteidiger", description: "+2 auf Angriff/Schaden des Stahlverteidigers. Arkaner Stoß +4W6.", category: "feature" },
      ],
    },
    {
      id: "ms_alchemist", name: "Alchemist", levelGained: 3,
      features: [
        { level: 3, id: "alch_formulas", name: "Formeln", description: "Profizient mit Alchemieausrüstung. Erschaffe nützliche Elixiere nach langer Rast.", category: "feature" },
        { level: 5, id: "alch_elixir", name: "Experimentelles Elixier", description: "Erschaffe 1 zufälliges Elixier pro langem Rest (Heilung, Fliegen, Unsichtbarkeit, etc.).", category: "feature" },
        { level: 9, id: "alch_brew", name: "Alchemistischer Elixier", description: "Experimentelle Elixiere werden mächtiger.", category: "feature" },
        { level: 15, id: "alch_chem", name: "Chemischer Meister", description: "Nutze Alchemieausrüstung um Gift/Krankheiten zu kurieren.", category: "feature" },
      ],
    },
  ],
};

/** List of subclass names for a class */
export function getSubclassNames(className) {
  return (SUBCLASSES[className] || []).map(s => s.name);
}

/** Get a subclass by class + name */
export function getSubclassData(className, subclassName) {
  return (SUBCLASSES[className] || []).find(s => s.name === subclassName) ?? null;
}

/** Get features for a subclass up to a given level */
export function getSubclassFeaturesUpToLevel(className, subclassName, level) {
  const sc = getSubclassData(className, subclassName);
  if (!sc) return [];
  return sc.features.filter(f => f.level <= level);
}

/** Level at which the subclass is chosen (usually 3, but varies) */
export function getSubclassChoiceLevel(className) {
  const first = (SUBCLASSES[className] || [])[0];
  return first?.levelGained ?? 3;
}
