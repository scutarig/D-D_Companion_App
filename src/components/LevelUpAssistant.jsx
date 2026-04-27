import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { modOf, modStr, getPB, buildSlotsForLevel, CASTER_TYPE, FULL_CASTER, HALF_CASTER, THIRD_CASTER, PACT_MAGIC } from "../utils/helpers.js";
import { CLASS_FEATURES } from "../data/classFeatures.js";
import { FEATS, meetsPrerequisite } from "../data/feats.js";
import { applyFeat } from "../utils/feats.js";

// ── ASI-Levels pro Klasse ───────────────────────────────────────────────────
const ASI_DEFAULT = [4, 8, 12, 16, 19];
const ASI_BY_CLASS = {
  Kämpfer: [4, 6, 8, 12, 14, 16, 19],   // 7 ASIs
  Schurke:  [4, 8, 10, 12, 16, 19],       // ASI auch auf Level 10
};

// ── Klassen-Features — aus data/classFeatures.js importiert ─────────────────
// CLF[class][level] → [{name, description}]  (format wie bisher via Adapter)
const CLF = Object.fromEntries(
  Object.entries(CLASS_FEATURES).map(([cls, lvlMap]) => [
    cls,
    Object.fromEntries(
      Object.entries(lvlMap).map(([lvl, feats]) => [
        lvl,
        feats.map(f => ({ n: f.name, d: f.description })),
      ])
    ),
  ])
);

// ── (Legacy inline CLF removed — now sourced from data/classFeatures.js) ────
/* DELETED */
const _CLF_LEGACY_STUB = {
  Barbar: {
    1:[{n:"Kampfrausch",d:"Bonus-Aktion: +2 auf STR-Angriffe/Schaden, Widerstand gegen Hieb/Stich/Wucht. Anzahl = max(1, CON-Mod)."},{n:"Ungerüstete Verteidigung",d:"RK = 10 + DEX-Mod + CON-Mod (ohne Rüstung)."}],
    2:[{n:"Rücksichtsloser Angriff",d:"Vorteil auf STR-Angriffswürfe, Gegner hat Vorteil gegen dich bis zu deinem nächsten Zug."},{n:"Gefahrengespür",d:"Vorteil auf DEX-Rettungswürfe gegen sichtbare Gefahren/Fallen."}],
    3:[{n:"Urtümlicher Pfad (Unterklasse)",d:"Wähle deinen Barbarenpfad."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."},{n:"Schnelle Bewegung",d:"+10 Fuß Bewegungsgeschwindigkeit (keine schwere Rüstung)."}],
    6:[{n:"Pfad-Feature",d:"Unterklassen-Feature deines Pfades."}],
    7:[{n:"Tierinstinkt",d:"Vorteil auf Initiative. Wenn überrascht + im Kampfrausch: In der 1. Runde normal handeln."}],
    9:[{n:"Brutaler Kritischer Treffer",d:"Beim kritischen Treffer: +1 Schadenswürfel extra."}],
    10:[{n:"Pfad-Feature",d:"Unterklassen-Feature."}],
    11:[{n:"Unerbittlicher Kampfrausch",d:"Wenn auf 0 HP im Kampfrausch: CON-Rettungswurf DC 10 (+5 pro Versuch in dieser Kampfbegegnung) oder bleibe bei 1 HP."}],
    13:[{n:"Brutaler Kritischer Treffer (2)",d:"+2 Schadenswürfel beim kritischen Treffer."}],
    14:[{n:"Pfad-Feature",d:"Unterklassen-Feature."}],
    15:[{n:"Anhaltender Kampfrausch",d:"Kampfrausch endet nur wenn du bewusstlos wirst oder freiwillig beendest."}],
    17:[{n:"Brutaler Kritischer Treffer (3)",d:"+3 Schadenswürfel beim kritischen Treffer."}],
    18:[{n:"Unbändige Kraft",d:"STR-Probe: Nutze STR-Wert×STR-Wert statt Normalwurf (wenn normaler Wurf niedriger wäre)."}],
    20:[{n:"Urmeister",d:"+4 STR, +4 CON (max. 24). Rage ist jetzt unbegrenzt verfügbar."}],
  },
  Barde: {
    1:[{n:"Zauberwirken",d:"CHA als Zauberfähigkeit."},{n:"Bardische Inspiration W6",d:"Bonus-Aktion: Verbündeter in 60 Fuß erhält 1 Inspirationswürfel (W6) für Angriff/Probe/Rettung."}],
    2:[{n:"Allrounder",d:"Halbierter PB auf alle ungelernten Fähigkeitsproben (PB ÷ 2, aufgerundet)."},{n:"Rastlied W6",d:"Nach kurzem Rest: Verbündete mit Trefferwürfeln regainieren W6 + CHA-Mod extra HP."}],
    3:[{n:"Bardenschule (Unterklasse)",d:"Wähle deine Bardenschule."},{n:"Expertise",d:"Verdopple PB für 2 deiner Fertigkeiten."}],
    5:[{n:"Bardische Inspiration W8",d:"Inspirationswürfel steigt auf W8."},{n:"Fließende Inspiration",d:"Inspirationswürfel nach kurzem Rest auffüllen (statt nur langem)."}],
    6:[{n:"Konterakord",d:"Reaktion: Gib dir oder Verbündeten in 30 Fuß Vorteil auf Rettungswürfe gegen Furcht/Betäubung."},{n:"Schulen-Feature",d:"Unterklassen-Feature."}],
    9:[{n:"Rastlied W8",d:"Rastlied-Würfel steigt auf W8."}],
    10:[{n:"Bardische Inspiration W10",d:"Inspirationswürfel steigt auf W10."},{n:"Expertise",d:"2 weitere Fertigkeiten mit verdoppeltem PB."},{n:"Magische Geheimnisse",d:"Lerne 2 Zauber beliebiger Klasse."}],
    13:[{n:"Rastlied W10",d:"Rastlied-Würfel steigt auf W10."}],
    14:[{n:"Magische Geheimnisse",d:"2 weitere Zauber beliebiger Klasse."},{n:"Schulen-Feature",d:"Unterklassen-Feature."}],
    15:[{n:"Bardische Inspiration W12",d:"Inspirationswürfel steigt auf W12."}],
    17:[{n:"Rastlied W12",d:"Rastlied-Würfel steigt auf W12."}],
    18:[{n:"Magische Geheimnisse",d:"Nochmals 2 Zauber aus beliebiger Klasse."}],
    20:[{n:"Überlegene Inspiration",d:"Bei Initiative-Wurf ohne Bardische Inspiration: Erhalte 1 zurück."}],
  },
  Druide: {
    1:[{n:"Druidisch",d:"Geheimsprache der Druiden (du kannst unsichtbare Nachrichten hinterlassen)."},{n:"Zauberwirken",d:"WIS als Zauberfähigkeit."}],
    2:[{n:"Tiergestalt",d:"2× zwischen Kurzrasten: Bis CR 1/4, kein Schwimmen/Fliegen."},{n:"Druidenzirkel (Unterklasse)",d:"Wähle deinen Druidenzirkel."}],
    4:[{n:"Tiergestalt",d:"Bis CR 1/2, kann schwimmen."}],
    6:[{n:"Zirkel-Feature",d:"Unterklassen-Feature."}],
    8:[{n:"Tiergestalt",d:"Bis CR 1, kann fliegen."}],
    10:[{n:"Zirkel-Feature",d:"Unterklassen-Feature."}],
    14:[{n:"Zirkel-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Zeitloser Körper",d:"Alterst 10× langsamer, immun gegen magische Alterung."},{n:"Tiersprache",d:"In Tiergestalt Zauber mit verbalen/somantischen Komponenten wirken (Konzentration beibehalten)."}],
    20:[{n:"Erzdruide",d:"Unbegrenzte Tiergestalt-Nutzung."}],
  },
  Hexenmeister: {
    1:[{n:"Andersweltlicher Patron (Unterklasse)",d:"Wähle deinen Patron."},{n:"Paktmagie",d:"CHA-Zauberwirken. Kurzrast-Slots, hoher Slot-Grad."}],
    2:[{n:"Schauerliche Anrufungen (2)",d:"Wähle 2 Eldritch Invocations."}],
    3:[{n:"Paktgeschenk",d:"Wähle Pakt des Schwertes / der Kette / des Buches."},{n:"Schauerliche Anrufungen (3)",d:"Wähle 1 weitere Invocation."}],
    5:[{n:"Schauerliche Anrufungen",d:"1 weitere Invocation. Pakt-Slots jetzt Grad 3."}],
    6:[{n:"Patron-Feature",d:"Unterklassen-Feature."}],
    7:[{n:"Pakt-Slots",d:"Slots jetzt Grad 4."}],
    9:[{n:"Pakt-Slots",d:"Slots jetzt Grad 5."}],
    10:[{n:"Patron-Feature",d:"Unterklassen-Feature."}],
    11:[{n:"Mystisches Arkanum (Grad 6)",d:"1× täglich einen Grad-6-Zauber ohne Slot wirken."}],
    12:[{n:"Schauerliche Anrufungen",d:"Weiteres Invocation wählbar."}],
    13:[{n:"Mystisches Arkanum (Grad 7)",d:"1× täglich einen Grad-7-Zauber."}],
    14:[{n:"Patron-Feature",d:"Unterklassen-Feature."}],
    15:[{n:"Mystisches Arkanum (Grad 8)",d:"1× täglich einen Grad-8-Zauber."}],
    17:[{n:"Mystisches Arkanum (Grad 9)",d:"1× täglich einen Grad-9-Zauber."}],
    20:[{n:"Magischer Meister",d:"10 Min. Konzentration: Alle Pakt-Slots zurückerhalten (1× pro langem Rest)."}],
  },
  Kämpfer: {
    1:[{n:"Kampfstil",d:"Wähle einen Kampfstil (Duell, Große Waffe, Verteidigung, Bogenkampf, etc.)."},{n:"Durchschnaufen",d:"Bonus-Aktion: W10 + Kämpfer-Level HP heilen. 1× zwischen Kurzrasten."}],
    2:[{n:"Tatendrang",d:"1 zusätzliche Aktion im Zug. 1× zwischen Kurzrasten."}],
    3:[{n:"Kriegerarchetyp (Unterklasse)",d:"Wähle deinen Archetypen."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."}],
    7:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    9:[{n:"Unnachgiebig (1×)",d:"1× pro langem Rest: Misslungenen Rettungswurf wiederholen."}],
    10:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    11:[{n:"Extra-Angriff (2)",d:"3 Angriffe pro Angriffsaktion."}],
    13:[{n:"Unnachgiebig (2×)",d:"2× pro langem Rest."}],
    15:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    17:[{n:"Tatendrang (2. Nutzung)",d:"Tatendrang 2× zwischen Kurzrasten."},{n:"Unnachgiebig (3×)",d:"3× pro langem Rest."}],
    18:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    20:[{n:"Extra-Angriff (3)",d:"4 Angriffe pro Angriffsaktion."}],
  },
  Kleriker: {
    1:[{n:"Zauberwirken",d:"WIS als Zauberfähigkeit."},{n:"Göttliche Domäne (Unterklasse)",d:"Wähle deine Domäne."}],
    2:[{n:"Göttliche Macht fokussieren (1×)",d:"Nutze Domänen-Kanalenergie. 1× zwischen Kurzrasten."},{n:"Domänen-Feature",d:"Unterklassen-Feature."}],
    5:[{n:"Untote zerstören (CR 1/2)",d:"Untote bis CR 1/2 werden bei Kanalenergie sofort vernichtet."}],
    6:[{n:"Göttliche Macht fokussieren (2×)",d:"2× zwischen Kurzrasten."},{n:"Domänen-Feature",d:"Unterklassen-Feature."}],
    8:[{n:"Untote zerstören (CR 1)",d:"Untote bis CR 1 werden vernichtet."},{n:"Domänen-Feature",d:"Unterklassen-Feature."}],
    10:[{n:"Göttliche Intervention",d:"1× pro Woche: W100 ≤ Kleriker-Level = Gott greift ein."}],
    11:[{n:"Untote zerstören (CR 2)",d:"Untote bis CR 2."}],
    14:[{n:"Untote zerstören (CR 3)",d:"Untote bis CR 3."}],
    17:[{n:"Untote zerstören (CR 4)",d:"Untote bis CR 4."},{n:"Domänen-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Göttliche Macht fokussieren (3×)",d:"3× zwischen Kurzrasten."}],
    20:[{n:"Verbesserte Göttliche Intervention",d:"Göttliche Intervention wirkt automatisch (kein Würfelwurf)."}],
  },
  Magier: {
    1:[{n:"Zauberwirken",d:"INT als Zauberfähigkeit. Zauberbuch."},{n:"Arkane Erholung",d:"Nach kurzem Rest: Zauberplätze ≤ ½ Level (aufgerundet) zurückgewinnen (insg. 1× pro Tag)."}],
    2:[{n:"Arkane Tradition (Unterklasse)",d:"Wähle deine magische Schule / Tradition."}],
    6:[{n:"Traditions-Feature",d:"Unterklassen-Feature."}],
    10:[{n:"Traditions-Feature",d:"Unterklassen-Feature."}],
    14:[{n:"Traditions-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Zaubermeisterschaft",d:"Wähle 1 Grad-1- und 1 Grad-2-Zauber: Kannst sie beliebig oft ohne Slot wirken."}],
    20:[{n:"Signaturzauber",d:"Wähle 2 Grad-3-Zauber: 1× pro kurzem Rest ohne Slot wirken."}],
  },
  Mönch: {
    1:[{n:"Ungerüstete Verteidigung",d:"RK = 10 + DEX-Mod + WIS-Mod (ohne Rüstung/Schild)."},{n:"Kampfkünste",d:"W4 unbewaffnet / Mönchswaffe, DEX statt STR erlaubt, Bonus-Aktion: 1 unbewaffneter Angriff."}],
    2:[{n:"Ki",d:"Ki-Punkte = Level. Ki-DC = 8 + PB + WIS-Mod. Sturmschritt, Geduldiger Verteidiger, Wirbelwind-Schläge."},{n:"Ungerüstete Bewegung",d:"+10 Fuß Bewegung."}],
    3:[{n:"Mönchstradition (Unterklasse)",d:"Wähle deinen Weg."},{n:"Geschosse ablenken",d:"Reaktion: Reduziere Fernkampfschaden um W10+DEX-Mod+Level. Bei 0: fange und schleudere zurück (1 Ki)."}],
    4:[{n:"Langsamer Fall",d:"Reaktion: Reduziere Fallschaden um 5× Mönch-Level."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."},{n:"Betäubender Schlag",d:"1 Ki nach Treffer: CON-Rettungswurf oder betäubt bis Ende deines nächsten Zugs."}],
    6:[{n:"Ki-gestärkte Schläge",d:"Unbewaffnete Schläge gelten als magisch."},{n:"Traditions-Feature",d:"Unterklassen-Feature."}],
    7:[{n:"Ausweichen",d:"Erfolgreicher DEX-Rettungswurf: Kein Schaden (statt halb)."},{n:"Stille des Geistes",d:"Aktion: Furcht-/Verzauberungseffekte sofort beenden."}],
    9:[{n:"Ungerüstete Bewegung verbessert",d:"An Wänden laufen + über Wasser laufen (Zug auf festem Boden enden)."}],
    10:[{n:"Reinheit des Körpers",d:"Immun gegen Krankheiten und Gift."}],
    11:[{n:"Traditions-Feature",d:"Unterklassen-Feature."}],
    13:[{n:"Sprache von Sonne und Mond",d:"Kann sich mit allen Lebewesen verständigen."}],
    14:[{n:"Diamantseele",d:"Proficiency auf alle Rettungswürfe. 1× pro Rast: Misslungenen RW wiederholen (1 Ki)."}],
    15:[{n:"Zeitloser Körper",d:"Kein Wasser/Nahrung/Schlaf nötig. Immun gegen magische Alterung."}],
    18:[{n:"Leerer Körper",d:"4 Ki: 1 Min. Unsichtbarkeit + Widerstand auf alle außer Kraft. 8 Ki: Astralprojektion."}],
    20:[{n:"Vollkommenes Selbst",d:"Wenn Initiative und 0 Ki: Erhalte 4 Ki zurück."}],
  },
  Paladin: {
    1:[{n:"Göttlicher Sinn",d:"Bonus-Aktion: Spüre Celestials/Fiends/Undead in 60 Fuß bis Ende deines nächsten Zugs. (CHA-Mod + 1)× pro langem Rest."},{n:"Handauflegen",d:"Pool = Level × 5 HP. Heile oder kuriere Krankheit/Gift (5 HP pro Dosis)."}],
    2:[{n:"Kampfstil",d:"Wähle Kampfstil."},{n:"Zauberwirken",d:"CHA als Zauberfähigkeit. Vorbereitete Zauber = CHA-Mod + ½ Paladin-Level."},{n:"Göttlicher Schlag",d:"Nach Waffentreffer: Slot ausgeben → 2W8 strahlender Schaden pro Slot-Grad extra."}],
    3:[{n:"Göttliche Gesundheit",d:"Immun gegen Krankheiten."},{n:"Heiliger Eid (Unterklasse)",d:"Lege deinen Eid ab."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."}],
    6:[{n:"Aura des Schutzes (10 Fuß)",d:"Du + Verbündete in 10 Fuß: +CHA-Mod auf alle Rettungswürfe (wenn du bewusst bist)."}],
    7:[{n:"Eids-Feature",d:"Unterklassen-Feature."}],
    10:[{n:"Aura des Mutes (10 Fuß)",d:"Du + Verbündete in 10 Fuß: Immun gegen Furcht (wenn du bewusst)."}],
    11:[{n:"Verbesserter Göttlicher Schlag",d:"Jeder Waffentreffer: +1W8 strahlender Schaden (ohne Slot)."}],
    14:[{n:"Reinigende Berührung",d:"CHA-Mod × pro langem Rest: Berührung beendet aktiven Zauber auf willigem Ziel."}],
    15:[{n:"Eids-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Aura-Erweiterung",d:"Aura des Schutzes + Aura des Mutes: Radius auf 30 Fuß erweitert."}],
    20:[{n:"Heilige Aura (Capstone)",d:"Eids-Feature: Stark leuchtende Aura als Reaktion."}],
  },
  Schurke: {
    1:[{n:"Expertise",d:"PB verdoppelt für 2 deiner Fertigkeiten."},{n:"Heimtückischer Angriff (1W6)",d:"1× pro Zug: +1W6 Schaden mit Finesse-/Fernkampfwaffe bei Vorteil oder Verbündeten in Nahkampf."}],
    2:[{n:"Hinterhältige Aktion",d:"Bonus-Aktion: Enteilen, Verstecken oder Sprinten."}],
    3:[{n:"Ganovenarchetyp (Unterklasse)",d:"Wähle Schurken-Archetypen."},{n:"Heimtückischer Angriff (2W6)",d:"Schaden auf 2W6."}],
    5:[{n:"Unverbesserlicher Instinkt",d:"Reaktion wenn angegriffen: Nachteil auf alle Angriffe des Angreifers bis Ende seines Zugs."},{n:"Heimtückischer Angriff (3W6)",d:"Schaden auf 3W6."}],
    6:[{n:"Expertise",d:"2 weitere Fertigkeiten mit verdoppeltem PB."}],
    7:[{n:"Ausweichen",d:"Erfolgreicher DEX-Rettungswurf: Kein Schaden."},{n:"Heimtückischer Angriff (4W6)",d:"Schaden auf 4W6."}],
    9:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."},{n:"Heimtückischer Angriff (5W6)",d:"Schaden auf 5W6."}],
    11:[{n:"Zuverlässiges Talent",d:"Fertigkeits-/Werkzeugprobe mit PB: Minimum 10 auf dem W20."},{n:"Heimtückischer Angriff (6W6)",d:"Schaden auf 6W6."}],
    13:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."},{n:"Heimtückischer Angriff (7W6)",d:"Schaden auf 7W6."}],
    14:[{n:"Blindheitssinn",d:"Spüre alle Wesen in 10 Fuß (auch Unsichtbare), solange du nicht blind/taub bist."}],
    15:[{n:"Geistesstärke",d:"WIS-Rettungswurf-Proficiency erhalten."},{n:"Heimtückischer Angriff (8W6)",d:"Schaden auf 8W6."}],
    17:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."},{n:"Heimtückischer Angriff (9W6)",d:"Schaden auf 9W6."}],
    18:[{n:"Schwer zu fassen",d:"Angriffe haben nie Vorteil gegen dich (außer du bist handlungsunfähig)."}],
    20:[{n:"Glücksfall",d:"1× pro Rast: Misslungener Angriff oder Fähigkeitsprobe → verwandelt sich in Erfolg."},{n:"Heimtückischer Angriff (10W6)",d:"Schaden auf 10W6."}],
  },
  Waldläufer: {
    1:[{n:"Lieblingsfeind",d:"Wähle Feindtyp: Vorteil auf Survival/Nachforschung gegen diese Kreaturenart. Lernst deren Sprache."},{n:"Natürlicher Erkunder",d:"Wähle bevorzugtes Gelände: Diverses Bonusse (Initiative, Navigation, Verstecken etc.)."}],
    2:[{n:"Kampfstil",d:"Wähle Kampfstil."},{n:"Zauberwirken",d:"WIS als Zauberfähigkeit."}],
    3:[{n:"Ranger-Archetyp (Unterklasse)",d:"Wähle deinen Archetypen."},{n:"Urtümliches Bewusstsein",d:"1 Slot: In großem Radius Verzauberungen/Unsichtbare spüren."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."}],
    6:[{n:"Lieblingsfeind / Erkunder (verbessert)",d:"Wähle 1 weiteren Feindtyp UND 1 weiteres bevorzugtes Gelände."}],
    7:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    8:[{n:"Landgang",d:"Schwieriges Terrain verlangsamt dich nicht in bevorzugtem Gelände."}],
    10:[{n:"Natürlicher Erkunder (3. Terrain)",d:"Wähle 3. bevorzugtes Gelände."},{n:"Verstecken im Freien",d:"Kannst dich hinter einzelnen Bäumen, Gräsern, Felsen verstecken."}],
    11:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    14:[{n:"Verschwinden",d:"Bonus-Aktion: Verstecken. Kann sich nach Angriff sofort wieder verstecken."}],
    15:[{n:"Archetypen-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Tierische Sinne",d:"Spürt Positionen unsichtbarer Wesen in 30 Fuß."}],
    20:[{n:"Feindesleger",d:"Bei Lieblingsfeinden: Zusätzlich +CHA-Mod Schaden auf STR-/DEX-Angriffe."}],
  },
  Zauberer: {
    1:[{n:"Zauberwirken",d:"CHA als Zauberfähigkeit."},{n:"Zaubereiursprung (Unterklasse)",d:"Wähle deinen Ursprung."}],
    2:[{n:"Quell der Magie",d:"Sorcery Points = Level. Punkte in Slots umwandeln (und umgekehrt)."}],
    3:[{n:"Metamagie",d:"Wähle 2 Metamagie-Optionen (Careful, Distant, Empowered, Extended, Heightened, Quickened, Subtle, Twinned, …)."}],
    6:[{n:"Ursprungs-Feature",d:"Unterklassen-Feature."}],
    10:[{n:"Metamagie",d:"1 weiteres Metamagie-Option wählen."}],
    14:[{n:"Ursprungs-Feature",d:"Unterklassen-Feature."}],
    17:[{n:"Metamagie",d:"1 weiteres Metamagie-Option wählen."}],
    18:[{n:"Ursprungs-Feature",d:"Unterklassen-Feature."}],
    20:[{n:"Zauberische Wiederherstellung",d:"Nach kurzem Rest: 4 Sorcery Points zurückerhalten."}],
  },
  Magieschmied: {
    1:[{n:"Magisches Basteln",d:"Kleingegenstände mit magischen Effekten erschaffen (Licht, Musik, Geruch, Feuer)."},{n:"Zauberwirken",d:"INT als Zauberfähigkeit."}],
    2:[{n:"Infusionen",d:"Lerne Infusionen = 2+Level. Aktiviere davon 2 pro langem Rest (infundierte Items entstehen)."}],
    3:[{n:"Artifizient-Spezialisierung (Unterklasse)",d:"Wähle Spezialisierung."},{n:"Das richtige Werkzeug",d:"Kurzrast: Erschaffe jedes einfache Werkzeug / Handwerksausrüstung."}],
    5:[{n:"Extra-Angriff",d:"2 Angriffe pro Angriffsaktion."}],
    6:[{n:"Werkzeug-Expertise",d:"PB verdoppelt für alle Werkzeugproben."}],
    7:[{n:"Blitz der Genialität",d:"Reaktion: +INT-Mod auf Fähigkeitsprobe/-Rettungswurf eines Verbündeten in 30 Fuß."}],
    9:[{n:"Spezialisierungs-Feature",d:"Unterklassen-Feature."}],
    10:[{n:"Meister Magischer Gegenstände",d:"Trage 1 weiteres attuniertes Item (total 4). Bonus: Schwache Items ohne Attunement."}],
    11:[{n:"Zauber-speicherndes Objekt",d:"Nach langem Rest: Speichere einen Grad-1- oder Grad-2-Zauber in einem Item (bis zu 2× täglich nutzbar)."}],
    14:[{n:"Meister Magischer Gegenstände (verbessert)",d:"Trage 2 weitere attunierte Items (total 5)."}],
    15:[{n:"Spezialisierungs-Feature",d:"Unterklassen-Feature."}],
    18:[{n:"Meister Magischer Gegenstände (weiter)",d:"Trage 3 weitere attunierte Items (total 6)."}],
    20:[{n:"Seele des Artefakthändlers",d:"+1 auf alle Rettungswürfe für jedes attunierte Item (max. +6)."}],
  },
};

// ── Komponente ───────────────────────────────────────────────────────────────
export default function LevelUpAssistant({ char, setChar }) {
  const newLevel = char.level + 1;
  const pb = getPB(newLevel);
  const pbOld = getPB(char.level);
  const hdMatch = (char.hd || "d8").match(/[dDwW](\d+)/);
  const hdNum = hdMatch ? parseInt(hdMatch[1]) : 8;
  const conMod = modOf(char.con || 10);

  const [hpChoice, setHpChoice] = useState("avg");
  const [rolledHp, setRolledHp] = useState(null);
  const [doneInfo, setDoneInfo] = useState(null);

  // ASI / Feat state
  const [asiMode, setAsiMode] = useState("asi");   // "asi" | "feat"
  const [asiA, setAsiA]       = useState("");      // first stat for ASI
  const [asiB, setAsiB]       = useState("");      // second stat (optional)
  const [featId, setFeatId]   = useState("");

  const avgHp = Math.floor(hdNum / 2) + 1 + conMod;
  const chosenHp = hpChoice === "roll" && rolledHp != null ? Math.max(1, rolledHp + conMod) : avgHp;

  const newPbFeature = pb > pbOld;
  const casterType = CASTER_TYPE[char.klass];
  const asiLevels = ASI_BY_CLASS[char.klass] || ASI_DEFAULT;
  const isAsi = asiLevels.includes(newLevel);
  const classFeatures = CLF[char.klass]?.[newLevel] || [];

  const ABS_LIST = ["STR","DEX","CON","INT","WIS","CHA"];
  const availableFeats = FEATS.filter(f =>
    meetsPrerequisite(char, f) && !(char.feats || []).some(cf => cf.id === f.id)
  );

  const [confirmReset, setConfirmReset] = useState(false);

  const doLevelUp = () => {
    setDoneInfo({ reachedLevel: newLevel, hpGained: chosenHp, newPb: pb, oldPb: pbOld });
    setChar(prev => {
      let next = { ...prev, level: newLevel, maxHp: prev.maxHp + chosenHp, hp: prev.hp + chosenHp, hd_used: Math.max(0, (prev.hd_used || 0) - 1) };
      // Apply ASI or Feat at ASI levels
      if (isAsi) {
        if (asiMode === "asi") {
          if (asiA) next = { ...next, [asiA.toLowerCase()]: Math.min(20, (next[asiA.toLowerCase()] || 10) + 1) };
          if (asiB) next = { ...next, [asiB.toLowerCase()]: Math.min(20, (next[asiB.toLowerCase()] || 10) + 1) };
        } else if (asiMode === "feat" && featId) {
          next = applyFeat(next, featId);
        }
      }
      return next;
    });
  };

  const doReset = () => {
    const l1Hp = hdNum + conMod;
    setChar(p => ({ ...p, level: 1, maxHp: l1Hp, hp: l1Hp, hd_used: 0 }));
    setConfirmReset(false);
    setDoneInfo(null);
  };

  if (newLevel > 20 && !doneInfo) return (
    <div style={sx.card}><div style={sx.ct}>⬆️ Level-Up</div><div style={{ color: C.textDim, fontSize: 14 }}>Level 20 erreicht — maximales Level!</div></div>
  );

  if (doneInfo) return (
    <div style={{ ...sx.card, background: `${C.purple}10`, border: `1px solid ${C.purple}40` }}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
        <div style={{ fontFamily: FH, fontSize: 22, color: C.gold, fontWeight: 700, marginBottom: 6 }}>Level {doneInfo.reachedLevel} erreicht!</div>
        <div style={{ fontSize: 14, color: C.textDim, marginBottom: 16 }}>+{doneInfo.hpGained} Max HP · PB {doneInfo.newPb > doneInfo.oldPb ? `+${doneInfo.newPb} (war +${doneInfo.oldPb})` : `+${doneInfo.newPb}`}</div>
        <button onClick={() => setDoneInfo(null)} style={sx.btn(C.purple)}>Zurück zum Assistenten</button>
      </div>
    </div>
  );

  // ── Zauberplätze ermitteln ────────────────────────────────────────────────
  const renderSpellSlots = () => {
    if (!casterType) return null;

    if (casterType === "pact") {
      const pm = PACT_MAGIC[newLevel];
      if (!pm) return null;
      const [slots, grade] = pm;
      return (
        <div style={sx.card}>
          <div style={sx.ct}>3. Paktmagie (Hexenmeister)</div>
          <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>
            Kurzrastend auffüllbar. Alle Slots haben denselben Grad.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={slotBox(C.purple)}><div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>Grad</div><div style={{ fontSize: 20, fontWeight: 700, color: C.purpleBright }}>{grade}</div></div>
            <div style={slotBox(C.purple)}><div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>Slots</div><div style={{ fontSize: 20, fontWeight: 700, color: C.purpleBright }}>{slots}</div></div>
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>Pakt-Slots füllen sich nach einem kurzen oder langen Rest auf.</div>
          <div style={{ fontSize: 12, color: C.greenBright, marginTop: 4 }}>✅ Pakt-Slots passen sich automatisch zu deinem Level an.</div>
        </div>
      );
    }

    const table = casterType === "full" ? FULL_CASTER
      : casterType === "half" ? HALF_CASTER
      : THIRD_CASTER;
    const slots = table[newLevel];
    if (!slots) return null;

    const label = casterType === "half" ? "Halbzauberer" : casterType === "third" ? "⅓-Zauberer" : "Vollzauberer";
    const labels = ["1","2","3","4","5","6","7","8","9"];

    return (
      <div style={sx.card}>
        <div style={sx.ct}>3. Zauberplätze ({label})</div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>
          {char.klass} auf Level {newLevel} — Zauberplätze nach langem Rest:
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {slots.map((s, i) => s ? (
            <div key={i} style={slotBox(C.blue)}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>{labels[i]}. Grad</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.blueBright }}>{s}</div>
            </div>
          ) : null)}
        </div>
        <div style={{ fontSize: 12, color: C.greenBright, marginTop: 8 }}>✅ Zauberplätze im Tokens-Tab passen sich automatisch zu deinem Level an.</div>
      </div>
    );
  };

  // ── Erinnerungen ──────────────────────────────────────────────────────────
  const reminders = [
    isAsi && "⚔️ ASI oder Feat: 2 verschiedene Attribute +1 ODER 1 Feat wählen (wenn DM Feats erlaubt).",
    isAsi && "📐 Nach ASI: Alle abhängigen Werte neu berechnen (AC, HP, Angriffsboni, Rettungswürfe, Zaubersave-DC).",
    newPbFeature && `🎖️ PB steigt auf +${pb}: Alle Proficiency-abhängigen Boni aktualisieren (Angriffe, Skills, Rettungswürfe, Zaubersave-DC).`,
    newLevel === 2 && char.klass === "Druide" && "🐻 Wähle deinen Druidenzirkel (Unterklasse).",
    newLevel === 3 && ["Barbar","Barde","Kämpfer","Mönch","Paladin","Schurke","Waldläufer","Zauberer","Magieschmied"].includes(char.klass) && `🔱 Unterklasse wählen: ${char.klass} wählt auf Level 3 seinen Archetypen/Pfad.`,
    newLevel === 1 && ["Hexenmeister","Kleriker"].includes(char.klass) && `🔱 Unterklasse bereits auf Level 1 wählen (${char.klass}).`,
    newLevel === 2 && char.klass === "Magier" && "🔱 Arkane Tradition (Unterklasse) auf Level 2 wählen.",
    [5,11,20].includes(newLevel) && char.klass === "Kämpfer" && `⚔️ Extra-Angriff prüfen: Kämpfer hat auf Level ${newLevel} ${newLevel === 5 ? "2" : newLevel === 11 ? "3" : "4"} Angriffe pro Angriffsaktion.`,
    newLevel === 5 && ["Barbar","Paladin","Waldläufer","Mönch","Magieschmied"].includes(char.klass) && "⚔️ Extra-Angriff: Ab jetzt 2 Angriffe pro Angriffsaktion.",
    casterType && "📖 Neue Zauber auswählen und ins Zauberbuch / die Zauberliste eintragen.",
    casterType && newPbFeature && "🎯 Zaubersave-DC und Zauberangriffswurf neu berechnen (8 + PB + Zaubermerkmal-Mod).",
    "👁️ Passive Wahrnehmung aktualisieren: 10 + WIS-Mod + PB (wenn Proficiency).",
    "📊 Alle Skills und Rettungswürfe mit neuem PB aktualisieren.",
    "🎲 Du erhältst 1 neuen Trefferwürfel (HD). Gesamtzahl jetzt: " + newLevel + "× " + (char.hd || "W8") + ".",
    newLevel === 20 && "🏆 Level 20 erreicht! Capstone-Feature deiner Klasse aktivieren.",
  ].filter(Boolean);

  const sectionNum = (n) => casterType ? n : n - 1;

  return (
    <div>
      {/* Header */}
      <div style={{ ...sx.card, background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,0,0,0.2))", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>⬆️</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 18, color: C.gold, fontWeight: 700 }}>{char.name}</div>
            <div style={{ fontSize: 13, color: C.textDim }}>{char.klass} · Level {char.level} → <span style={{ color: C.purpleBright, fontWeight: 700 }}>Level {newLevel}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={sx.tag(C.purple)}>⬆️ Level {newLevel}</span>
          <span style={sx.tag(C.gold)}>🎖️ PB +{pb}{newPbFeature && <span style={{ color: C.amberBright }}> (↑ von +{pbOld})</span>}</span>
          <span style={sx.tag(C.teal)}>🎲 {char.hd}</span>
          {isAsi && <span style={sx.tag(C.green)}>✨ ASI / Feat</span>}
        </div>
      </div>

      {/* 1. HP */}
      <div style={sx.card}>
        <div style={sx.ct}>1. Trefferpunkte</div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 12 }}>
          CON-Mod: <strong style={{ color: C.textBright }}>{modStr(char.con || 10)}</strong> · Trefferwürfel: <strong style={{ color: C.textBright }}>{char.hd}</strong>
          <span style={{ marginLeft: 12, color: C.textDim }}>
            (Fest: {Math.floor(hdNum/2)+1}{conMod !== 0 ? ` ${conMod > 0 ? "+" : ""}${conMod}` : ""} HP)
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["avg", `Durchschnitt (${avgHp} HP)`, C.blue], ["roll", "Würfeln", C.amber]].map(([v, l, col]) => (
            <button key={v} onClick={() => setHpChoice(v)} style={{ flex: "1 1 120px", padding: "10px", borderRadius: 10, cursor: "pointer", background: hpChoice === v ? `${col}22` : "transparent", border: `2px solid ${hpChoice === v ? col : C.border}`, color: hpChoice === v ? col : C.textDim, fontFamily: FH, fontSize: 11, fontWeight: hpChoice === v ? 700 : 400 }}>{l}</button>
          ))}
        </div>
        {hpChoice === "roll" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.textDim }}>Ergebnis des {char.hd}-Wurfs:</span>
            <input type="number" min={1} max={hdNum} value={rolledHp ?? ""} onChange={e => setRolledHp(Math.max(1, Math.min(hdNum, +e.target.value)))} style={{ ...sx.inp, width: 80 }} placeholder={`1–${hdNum}`} />
            <button onClick={() => setRolledHp(Math.floor(Math.random() * hdNum) + 1)} style={sx.btn(C.amber)}>🎲 Würfeln</button>
          </div>
        )}
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>❤️</span>
          <div>
            <div style={{ fontSize: 12, color: C.textDim }}>Neue Max HP</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.greenBright }}>{char.maxHp} + {chosenHp} = <span style={{ color: C.gold }}>{char.maxHp + chosenHp}</span></div>
          </div>
        </div>
      </div>

      {/* 2. Klassenmerkmale */}
      <div style={sx.card}>
        <div style={sx.ct}>2. Klassenmerkmale — {char.klass} Level {newLevel}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {isAsi && (
            <div style={{ ...featureBox(C.green), padding: 14 }}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.greenBright, fontWeight: 700, marginBottom: 10 }}>✨ Attributswerterhöhung (ASI) oder Feat</div>
              {/* Toggle ASI / Feat */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[["asi", "📈 ASI"], ["feat", "⭐ Feat"]].map(([mode, label]) => (
                  <button key={mode} onClick={() => setAsiMode(mode)} style={{
                    flex: 1, padding: "7px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
                    border: `1px solid ${asiMode === mode ? C.greenBright : C.border}`,
                    background: asiMode === mode ? `${C.greenBright}22` : "transparent",
                    color: asiMode === mode ? C.greenBright : C.textDim,
                  }}>{label}</button>
                ))}
              </div>

              {asiMode === "asi" && (
                <div>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Wähle 1–2 Attribute (+1 je Attribut, max. 20):</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {ABS_LIST.map(ab => {
                      const val = char[ab.toLowerCase()] || 10;
                      const isA = asiA === ab, isB = asiB === ab;
                      const selected = isA || isB;
                      return (
                        <button key={ab} onClick={() => {
                          if (isA) { setAsiA(asiB); setAsiB(""); }
                          else if (isB) setAsiB("");
                          else if (!asiA) setAsiA(ab);
                          else if (!asiB) setAsiB(ab);
                        }} style={{
                          padding: "5px 10px", borderRadius: 8, cursor: val >= 20 ? "default" : "pointer",
                          border: `1px solid ${selected ? C.greenBright : C.border}`,
                          background: selected ? `${C.greenBright}22` : "transparent",
                          color: selected ? C.greenBright : val >= 20 ? C.textDim : C.text,
                          fontFamily: FH, fontSize: 11, fontWeight: 700,
                          opacity: val >= 20 ? 0.4 : 1,
                        }}>
                          {ab} {val}{selected ? ` → ${Math.min(20, val + 1)}` : ""}
                        </button>
                      );
                    })}
                  </div>
                  {!asiA && !asiB && <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>Kein Attribut gewählt — Erhöhung wird beim Level-Up übersprungen.</div>}
                </div>
              )}

              {asiMode === "feat" && (
                <div>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Wähle ein Feat (nur Voraussetzungen erfüllte werden angezeigt):</div>
                  <select value={featId} onChange={e => setFeatId(e.target.value)} style={{ ...sx.sel, width: "100%" }}>
                    <option value="">— Feat wählen —</option>
                    {availableFeats.map(f => <option key={f.id} value={f.id}>{f.name}{f.prerequisite ? ` (${f.prerequisite})` : ""}</option>)}
                  </select>
                  {featId && (() => { const f = availableFeats.find(x => x.id === featId); return f ? (
                    <div style={{ marginTop: 8, fontSize: 12, color: C.text, background: C.surface, padding: "8px 10px", borderRadius: 6 }}>{f.description}</div>
                  ) : null; })()}
                </div>
              )}
            </div>
          )}
          {newPbFeature && (
            <div style={featureBox(C.gold)}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, marginBottom: 3 }}>🎖️ Übungsbonus steigt: +{pbOld} → +{pb}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>Alle Proben, Angriffe und DCs mit PB werden stärker.</div>
            </div>
          )}
          {classFeatures.length > 0 ? classFeatures.map((f, i) => (
            <div key={i} style={featureBox(C.purple)}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700, marginBottom: 3 }}>{f.n}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{f.d}</div>
            </div>
          )) : !isAsi && !newPbFeature && (
            <div style={{ fontSize: 13, color: C.textDim, fontStyle: "italic" }}>Kein generelles Feature auf Level {newLevel} — prüfe deine Unterklasse im Regelwerk.</div>
          )}
        </div>
      </div>

      {/* 3. Zauberplätze */}
      {renderSpellSlots()}

      {/* 4. Erinnerungen */}
      <div style={{ ...sx.card, background: `${C.amber}0d`, border: `2px solid ${C.amber}50` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.amberBright, fontWeight: 700 }}>
            {casterType ? "4." : "3."} Checkliste für Level {newLevel}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {reminders.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: `${C.amber}08`, border: `1px solid ${C.amber}25`, borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{tip.split(" ")[0]}</span>
              <span style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>{tip.slice(tip.indexOf(" ") + 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bestätigen */}
      <div style={{ ...sx.card, background: `${C.green}10`, border: `1px solid ${C.green}40` }}>
        <div style={{ ...sx.jb, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 14, color: C.greenBright, fontWeight: 700 }}>Level-Up bestätigen</div>
            <div style={{ fontSize: 12, color: C.textDim }}>Level {char.level} → {newLevel} · Max HP +{chosenHp} ({char.maxHp} → {char.maxHp + chosenHp}) · PB +{pb}</div>
          </div>
          <button onClick={doLevelUp} style={{ ...sx.btn(C.green), fontSize: 13, padding: "10px 20px" }}>⬆️ Jetzt Level-Up durchführen</button>
        </div>
      </div>

      {!confirmReset ? (
        <div style={{ textAlign: "center", paddingBottom: 8 }}>
          <button onClick={() => setConfirmReset(true)} style={{ ...sx.bsm(C.red), fontSize: 11 }}>↩️ Auf Level 1 zurücksetzen</button>
        </div>
      ) : (
        <div style={{ ...sx.card, background: `${C.red}0d`, border: `1px solid ${C.red}40` }}>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.redBright, fontWeight: 700, marginBottom: 6 }}>⚠️ Wirklich auf Level 1 zurücksetzen?</div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            Level → 1 · Max HP → {hdNum + conMod} ({char.hd} Max + CON) · HD zurückgesetzt
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={doReset} style={{ ...sx.btn(C.red), fontSize: 12 }}>↩️ Ja, zurücksetzen</button>
            <button onClick={() => setConfirmReset(false)} style={sx.bsm(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Style-Helfer ─────────────────────────────────────────────────────────────
const featureBox = (col) => ({
  background: `${col}0a`, border: `1px solid ${col}20`, borderLeft: `3px solid ${col}`,
  borderRadius: 8, padding: "8px 12px",
});
const slotBox = (col) => ({
  background: `${col}12`, border: `1px solid ${col}25`, borderRadius: 8,
  padding: "8px 14px", textAlign: "center", minWidth: 60,
});
