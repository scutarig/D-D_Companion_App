/**
 * classFeatures.js — PHB-Klassenfeatures pro Level
 * Format pro Klasse: { [level]: [{id, name, description, category}] }
 * source wird beim Anwenden automatisch ergänzt ("class:Barbar")
 */
export const CLASS_FEATURES = {
  Barbar: {
    1: [{id:"barbar_kampfrausch",name:"Kampfrausch",description:"Bonus-Aktion: +2 auf STR-Angriffe/Schaden, Widerstand gegen Hieb/Stich/Wucht. Anzahl = max(1, CON-Mod).",category:"feature"},{id:"barbar_ungeruest_verteidigung",name:"Ungerüstete Verteidigung",description:"RK = 10 + DEX-Mod + CON-Mod (ohne Rüstung).",category:"feature"}],
    2: [{id:"barbar_ruecksichtslos",name:"Rücksichtsloser Angriff",description:"Vorteil auf STR-Angriffswürfe, Gegner hat Vorteil gegen dich bis zu deinem nächsten Zug.",category:"feature"},{id:"barbar_gefahrengespuer",name:"Gefahrengespür",description:"Vorteil auf DEX-Rettungswürfe gegen sichtbare Gefahren/Fallen.",category:"feature"}],
    3: [{id:"barbar_pfad",name:"Urtümlicher Pfad (Unterklasse)",description:"Wähle deinen Barbarenpfad.",category:"feature"}],
    5: [{id:"barbar_extra_angriff",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},{id:"barbar_schnelle_bewegung",name:"Schnelle Bewegung",description:"+10 Fuß Bewegungsgeschwindigkeit (keine schwere Rüstung).",category:"feature"}],
    7: [{id:"barbar_tierinstinkt",name:"Tierinstinkt",description:"Vorteil auf Initiative. Wenn überrascht + im Kampfrausch: In der 1. Runde normal handeln.",category:"feature"}],
    9: [{id:"barbar_brut_krit",name:"Brutaler Kritischer Treffer",description:"Beim kritischen Treffer: +1 Schadenswürfel extra.",category:"feature"}],
    11: [{id:"barbar_unerbittlich",name:"Unerbittlicher Kampfrausch",description:"Wenn auf 0 HP im Kampfrausch: CON-Rettungswurf DC 10 (+5 pro Versuch) oder bleibe bei 1 HP.",category:"feature"}],
    15: [{id:"barbar_anhaltend",name:"Anhaltender Kampfrausch",description:"Kampfrausch endet nur wenn du bewusstlos wirst oder freiwillig beendest.",category:"feature"}],
    18: [{id:"barbar_kraft",name:"Unbändige Kraft",description:"STR-Probe: Nutze STR-Wert × STR-Wert statt Normalwurf.",category:"feature"}],
    20: [{id:"barbar_urmeister",name:"Urmeister",description:"+4 STR, +4 CON (max. 24). Rage ist jetzt unbegrenzt verfügbar.",category:"feature"}],
  },
  Barde: {
    1: [{id:"barde_zauberwirken",name:"Zauberwirken",description:"CHA als Zauberfähigkeit.",category:"feature"},{id:"barde_inspiration_w6",name:"Bardische Inspiration W6",description:"Bonus-Aktion: Verbündeter in 60 Fuß erhält 1 Inspirationswürfel (W6) für Angriff/Probe/Rettung.",category:"feature"}],
    2: [{id:"barde_allrounder",name:"Allrounder",description:"Halbierter PB auf alle ungelernten Fähigkeitsproben.",category:"feature"},{id:"barde_rastlied",name:"Rastlied",description:"Nach kurzem Rest: Verbündete regainieren W6 + CHA-Mod extra HP.",category:"feature"}],
    3: [{id:"barde_schule",name:"Bardenschule (Unterklasse)",description:"Wähle deine Bardenschule.",category:"feature"},{id:"barde_expertise",name:"Expertise",description:"Verdopple PB für 2 deiner Fertigkeiten.",category:"feature"}],
    5: [{id:"barde_inspiration_w8",name:"Bardische Inspiration W8",description:"Inspirationswürfel steigt auf W8.",category:"feature"},{id:"barde_fliesend",name:"Fließende Inspiration",description:"Inspirationswürfel nach kurzem Rest auffüllen (statt nur langem).",category:"feature"}],
    6: [{id:"barde_konterakord",name:"Konterakord",description:"Reaktion: Gib dir oder Verbündeten in 30 Fuß Vorteil auf Rettungswürfe gegen Furcht/Betäubung.",category:"feature"}],
    10: [{id:"barde_inspiration_w10",name:"Bardische Inspiration W10",description:"Inspirationswürfel steigt auf W10.",category:"feature"},{id:"barde_expertise2",name:"Expertise",description:"2 weitere Fertigkeiten mit verdoppeltem PB.",category:"feature"},{id:"barde_geheimnisse",name:"Magische Geheimnisse",description:"Lerne 2 Zauber beliebiger Klasse.",category:"feature"}],
    15: [{id:"barde_inspiration_w12",name:"Bardische Inspiration W12",description:"Inspirationswürfel steigt auf W12.",category:"feature"}],
    20: [{id:"barde_ueberlegene",name:"Überlegene Inspiration",description:"Bei Initiative-Wurf ohne Bardische Inspiration: Erhalte 1 zurück.",category:"feature"}],
  },
  Druide: {
    1: [{id:"druide_druidisch",name:"Druidisch",description:"Geheimsprache der Druiden.",category:"feature"},{id:"druide_zauberwirken",name:"Zauberwirken",description:"WIS als Zauberfähigkeit.",category:"feature"}],
    2: [{id:"druide_tiergestalt",name:"Tiergestalt",description:"2× zwischen Kurzrasten: Bis CR 1/4, kein Schwimmen/Fliegen.",category:"feature"},{id:"druide_zirkel",name:"Druidenzirkel (Unterklasse)",description:"Wähle deinen Druidenzirkel.",category:"feature"}],
    4: [{id:"druide_tiergestalt2",name:"Tiergestalt verbessert",description:"Bis CR 1/2, kann schwimmen.",category:"feature"}],
    8: [{id:"druide_tiergestalt3",name:"Tiergestalt verbessert (2)",description:"Bis CR 1, kann fliegen.",category:"feature"}],
    18: [{id:"druide_zeitlos",name:"Zeitloser Körper",description:"Alterst 10× langsamer, immun gegen magische Alterung.",category:"feature"},{id:"druide_tiersprache",name:"Tiersprache",description:"In Tiergestalt Zauber mit verbalen/somatischen Komponenten wirken.",category:"feature"}],
    20: [{id:"druide_erzdruide",name:"Erzdruide",description:"Unbegrenzte Tiergestalt-Nutzung.",category:"feature"}],
  },
  Hexenmeister: {
    1: [{id:"hex_patron",name:"Andersweltlicher Patron (Unterklasse)",description:"Wähle deinen Patron.",category:"feature"},{id:"hex_paktmagie",name:"Paktmagie",description:"CHA-Zauberwirken. Kurzrast-Slots, hoher Slot-Grad.",category:"feature"}],
    2: [{id:"hex_anrufungen",name:"Schauerliche Anrufungen (2)",description:"Wähle 2 Eldritch Invocations.",category:"feature"}],
    3: [{id:"hex_paktgeschenk",name:"Paktgeschenk",description:"Wähle Pakt des Schwertes / der Kette / des Buches.",category:"feature"}],
    11: [{id:"hex_arkanum6",name:"Mystisches Arkanum (Grad 6)",description:"1× täglich einen Grad-6-Zauber ohne Slot wirken.",category:"feature"}],
    13: [{id:"hex_arkanum7",name:"Mystisches Arkanum (Grad 7)",description:"1× täglich einen Grad-7-Zauber.",category:"feature"}],
    15: [{id:"hex_arkanum8",name:"Mystisches Arkanum (Grad 8)",description:"1× täglich einen Grad-8-Zauber.",category:"feature"}],
    17: [{id:"hex_arkanum9",name:"Mystisches Arkanum (Grad 9)",description:"1× täglich einen Grad-9-Zauber.",category:"feature"}],
    20: [{id:"hex_meister",name:"Magischer Meister",description:"10 Min. Konzentration: Alle Pakt-Slots zurückerhalten (1× pro langem Rest).",category:"feature"}],
  },
  Kämpfer: {
    1: [{id:"kaempfer_kampfstil",name:"Kampfstil",description:"Wähle einen Kampfstil (Duell, Große Waffe, Verteidigung, Bogenkampf, etc.).",category:"feature"},{id:"kaempfer_durchschnaufen",name:"Durchschnaufen",description:"Bonus-Aktion: W10 + Kämpfer-Level HP heilen. 1× zwischen Kurzrasten.",category:"feature"}],
    2: [{id:"kaempfer_tatendrang",name:"Tatendrang",description:"1 zusätzliche Aktion im Zug. 1× zwischen Kurzrasten.",category:"feature"}],
    3: [{id:"kaempfer_archetyp",name:"Kriegerarchetyp (Unterklasse)",description:"Wähle deinen Archetypen.",category:"feature"}],
    5: [{id:"kaempfer_extra_angriff",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"}],
    9: [{id:"kaempfer_unnachgiebig",name:"Unnachgiebig (1×)",description:"1× pro langem Rest: Misslungenen Rettungswurf wiederholen.",category:"feature"}],
    11: [{id:"kaempfer_extra_angriff2",name:"Extra-Angriff (2)",description:"3 Angriffe pro Angriffsaktion.",category:"feature"}],
    17: [{id:"kaempfer_tatendrang2",name:"Tatendrang (2. Nutzung)",description:"Tatendrang 2× zwischen Kurzrasten.",category:"feature"}],
    20: [{id:"kaempfer_extra_angriff3",name:"Extra-Angriff (3)",description:"4 Angriffe pro Angriffsaktion.",category:"feature"}],
  },
  Kleriker: {
    1: [{id:"kleriker_zauberwirken",name:"Zauberwirken",description:"WIS als Zauberfähigkeit.",category:"feature"},{id:"kleriker_domaene",name:"Göttliche Domäne (Unterklasse)",description:"Wähle deine Domäne.",category:"feature"}],
    2: [{id:"kleriker_kanal",name:"Göttliche Macht fokussieren (1×)",description:"Nutze Domänen-Kanalenergie. 1× zwischen Kurzrasten.",category:"feature"}],
    5: [{id:"kleriker_untote",name:"Untote zerstören (CR 1/2)",description:"Untote bis CR 1/2 werden bei Kanalenergie sofort vernichtet.",category:"feature"}],
    6: [{id:"kleriker_kanal2",name:"Göttliche Macht fokussieren (2×)",description:"2× zwischen Kurzrasten.",category:"feature"}],
    10: [{id:"kleriker_intervention",name:"Göttliche Intervention",description:"1× pro Woche: W100 ≤ Kleriker-Level = Gott greift ein.",category:"feature"}],
    18: [{id:"kleriker_kanal3",name:"Göttliche Macht fokussieren (3×)",description:"3× zwischen Kurzrasten.",category:"feature"}],
    20: [{id:"kleriker_intervention2",name:"Verbesserte Göttliche Intervention",description:"Göttliche Intervention wirkt automatisch.",category:"feature"}],
  },
  Magier: {
    1: [{id:"magier_zauberwirken",name:"Zauberwirken",description:"INT als Zauberfähigkeit. Zauberbuch.",category:"feature"},{id:"magier_erholung",name:"Arkane Erholung",description:"Nach kurzem Rest: Zauberplätze ≤ ½ Level zurückgewinnen (1× pro Tag).",category:"feature"}],
    2: [{id:"magier_tradition",name:"Arkane Tradition (Unterklasse)",description:"Wähle deine magische Schule / Tradition.",category:"feature"}],
    18: [{id:"magier_meisterschaft",name:"Zaubermeisterschaft",description:"Wähle 1 Grad-1- und 1 Grad-2-Zauber: Kannst sie beliebig oft ohne Slot wirken.",category:"feature"}],
    20: [{id:"magier_signatur",name:"Signaturzauber",description:"Wähle 2 Grad-3-Zauber: 1× pro kurzem Rest ohne Slot wirken.",category:"feature"}],
  },
  Mönch: {
    1: [{id:"moenche_verteidigung",name:"Ungerüstete Verteidigung",description:"RK = 10 + DEX-Mod + WIS-Mod (ohne Rüstung/Schild).",category:"feature"},{id:"moenche_kampfkuenste",name:"Kampfkünste",description:"W4 unbewaffnet / Mönchswaffe, DEX statt STR erlaubt, Bonus-Aktion: 1 unbewaffneter Angriff.",category:"feature"}],
    2: [{id:"moenche_ki",name:"Ki",description:"Ki-Punkte = Level. Ki-DC = 8 + PB + WIS-Mod.",category:"feature"},{id:"moenche_bewegung",name:"Ungerüstete Bewegung",description:"+10 Fuß Bewegung.",category:"feature"}],
    3: [{id:"moenche_tradition",name:"Mönchstradition (Unterklasse)",description:"Wähle deinen Weg.",category:"feature"},{id:"moenche_geschosse",name:"Geschosse ablenken",description:"Reaktion: Reduziere Fernkampfschaden. Bei 0: fange und schleudere zurück (1 Ki).",category:"feature"}],
    5: [{id:"moenche_extra",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"},{id:"moenche_betaeubend",name:"Betäubender Schlag",description:"1 Ki nach Treffer: CON-Rettungswurf oder betäubt bis Ende deines nächsten Zugs.",category:"feature"}],
    6: [{id:"moenche_ki_staerke",name:"Ki-gestärkte Schläge",description:"Unbewaffnete Schläge gelten als magisch.",category:"feature"}],
    7: [{id:"moenche_ausweichen",name:"Ausweichen",description:"Erfolgreicher DEX-Rettungswurf: Kein Schaden.",category:"feature"},{id:"moenche_stille",name:"Stille des Geistes",description:"Aktion: Furcht-/Verzauberungseffekte sofort beenden.",category:"feature"}],
    10: [{id:"moenche_reinheit",name:"Reinheit des Körpers",description:"Immun gegen Krankheiten und Gift.",category:"feature"}],
    14: [{id:"moenche_diamant",name:"Diamantseele",description:"Proficiency auf alle Rettungswürfe. 1× pro Rast: Misslungenen RW wiederholen (1 Ki).",category:"feature"}],
    20: [{id:"moenche_vollkommen",name:"Vollkommenes Selbst",description:"Wenn Initiative und 0 Ki: Erhalte 4 Ki zurück.",category:"feature"}],
  },
  Paladin: {
    1: [{id:"paladin_sinn",name:"Göttlicher Sinn",description:"Bonus-Aktion: Spüre Celestials/Fiends/Undead in 60 Fuß. (CHA-Mod + 1)× pro langem Rest.",category:"feature"},{id:"paladin_handauflegen",name:"Handauflegen",description:"Pool = Level × 5 HP. Heile oder kuriere Krankheit/Gift.",category:"feature"}],
    2: [{id:"paladin_kampfstil",name:"Kampfstil",description:"Wähle Kampfstil.",category:"feature"},{id:"paladin_zauberwirken",name:"Zauberwirken",description:"CHA als Zauberfähigkeit.",category:"feature"},{id:"paladin_schlag",name:"Göttlicher Schlag",description:"Nach Waffentreffer: Slot ausgeben → 2W8 pro Slot-Grad extra.",category:"feature"}],
    3: [{id:"paladin_gesundheit",name:"Göttliche Gesundheit",description:"Immun gegen Krankheiten.",category:"feature"},{id:"paladin_eid",name:"Heiliger Eid (Unterklasse)",description:"Lege deinen Eid ab.",category:"feature"}],
    5: [{id:"paladin_extra",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"}],
    6: [{id:"paladin_aura",name:"Aura des Schutzes (10 Fuß)",description:"Du + Verbündete in 10 Fuß: +CHA-Mod auf alle Rettungswürfe.",category:"feature"}],
    11: [{id:"paladin_verb_schlag",name:"Verbesserter Göttlicher Schlag",description:"Jeder Waffentreffer: +1W8 strahlender Schaden (ohne Slot).",category:"feature"}],
    18: [{id:"paladin_aura_erw",name:"Aura-Erweiterung",description:"Aura des Schutzes + Aura des Mutes: Radius auf 30 Fuß erweitert.",category:"feature"}],
    20: [{id:"paladin_heilige_aura",name:"Heilige Aura",description:"Eids-Feature: Stark leuchtende Aura als Reaktion.",category:"feature"}],
  },
  Schurke: {
    1: [{id:"schurke_expertise",name:"Expertise",description:"PB verdoppelt für 2 deiner Fertigkeiten.",category:"feature"},{id:"schurke_heimtückisch",name:"Heimtückischer Angriff (1W6)",description:"1× pro Zug: +1W6 Schaden mit Finesse-/Fernkampfwaffe bei Vorteil.",category:"feature"}],
    2: [{id:"schurke_hinterthaeltig",name:"Hinterhältige Aktion",description:"Bonus-Aktion: Enteilen, Verstecken oder Sprinten.",category:"feature"}],
    3: [{id:"schurke_archetyp",name:"Ganovenarchetyp (Unterklasse)",description:"Wähle Schurken-Archetypen.",category:"feature"}],
    5: [{id:"schurke_instinkt",name:"Unverbesserlicher Instinkt",description:"Reaktion wenn angegriffen: Nachteil auf alle Angriffe des Angreifers bis Ende seines Zugs.",category:"feature"}],
    7: [{id:"schurke_ausweichen",name:"Ausweichen",description:"Erfolgreicher DEX-Rettungswurf: Kein Schaden.",category:"feature"}],
    11: [{id:"schurke_talent",name:"Zuverlässiges Talent",description:"Fertigkeits-/Werkzeugprobe mit PB: Minimum 10 auf dem W20.",category:"feature"}],
    14: [{id:"schurke_blindheit",name:"Blindheitssinn",description:"Spüre alle Wesen in 10 Fuß (auch Unsichtbare).",category:"feature"}],
    18: [{id:"schurke_schwer",name:"Schwer zu fassen",description:"Angriffe haben nie Vorteil gegen dich (außer du bist handlungsunfähig).",category:"feature"}],
    20: [{id:"schurke_glueck",name:"Glücksfall",description:"1× pro Rast: Misslungener Angriff oder Fähigkeitsprobe → verwandelt sich in Erfolg.",category:"feature"}],
  },
  Waldläufer: {
    1: [{id:"waldl_lieblingsfeind",name:"Lieblingsfeind",description:"Wähle Feindtyp: Vorteil auf Survival/Nachforschung. Lernst deren Sprache.",category:"feature"},{id:"waldl_erkunder",name:"Natürlicher Erkunder",description:"Wähle bevorzugtes Gelände: Diverse Boni.",category:"feature"}],
    2: [{id:"waldl_kampfstil",name:"Kampfstil",description:"Wähle Kampfstil.",category:"feature"},{id:"waldl_zauberwirken",name:"Zauberwirken",description:"WIS als Zauberfähigkeit.",category:"feature"}],
    3: [{id:"waldl_archetyp",name:"Ranger-Archetyp (Unterklasse)",description:"Wähle deinen Archetypen.",category:"feature"}],
    5: [{id:"waldl_extra",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"}],
    14: [{id:"waldl_verschwinden",name:"Verschwinden",description:"Bonus-Aktion: Verstecken. Kann sich nach Angriff sofort wieder verstecken.",category:"feature"}],
    20: [{id:"waldl_feindesleger",name:"Feindesleger",description:"Bei Lieblingsfeinden: Zusätzlich +CHA-Mod Schaden.",category:"feature"}],
  },
  Zauberer: {
    1: [{id:"zauber_wirken",name:"Zauberwirken",description:"CHA als Zauberfähigkeit.",category:"feature"},{id:"zauber_ursprung",name:"Zaubereiursprung (Unterklasse)",description:"Wähle deinen Ursprung.",category:"feature"}],
    2: [{id:"zauber_quell",name:"Quell der Magie",description:"Sorcery Points = Level. Punkte in Slots umwandeln.",category:"feature"}],
    3: [{id:"zauber_metamagie",name:"Metamagie",description:"Wähle 2 Metamagie-Optionen.",category:"feature"}],
    10: [{id:"zauber_metamagie2",name:"Metamagie (erweitert)",description:"1 weiteres Metamagie-Option wählen.",category:"feature"}],
    20: [{id:"zauber_wiederh",name:"Zauberische Wiederherstellung",description:"Nach kurzem Rest: 4 Sorcery Points zurückerhalten.",category:"feature"}],
  },
  Magieschmied: {
    1: [{id:"ms_basteln",name:"Magisches Basteln",description:"Kleingegenstände mit magischen Effekten erschaffen.",category:"feature"},{id:"ms_zauberwirken",name:"Zauberwirken",description:"INT als Zauberfähigkeit.",category:"feature"}],
    2: [{id:"ms_infusionen",name:"Infusionen",description:"Lerne Infusionen = 2+Level. Aktiviere davon 2 pro langem Rest.",category:"feature"}],
    3: [{id:"ms_spezialisierung",name:"Artifizient-Spezialisierung (Unterklasse)",description:"Wähle Spezialisierung.",category:"feature"}],
    5: [{id:"ms_extra",name:"Extra-Angriff",description:"2 Angriffe pro Angriffsaktion.",category:"feature"}],
    10: [{id:"ms_meister",name:"Meister Magischer Gegenstände",description:"Trage 1 weiteres attuniertes Item (total 4).",category:"feature"}],
    20: [{id:"ms_seele",name:"Seele des Artefakthändlers",description:"+1 auf alle Rettungswürfe für jedes attunierte Item (max. +6).",category:"feature"}],
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
