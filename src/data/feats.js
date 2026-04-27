/**
 * D&D 5e PHB Feats — German descriptions
 * Shape: { id, name, prerequisite, description, statBonus }
 *   statBonus: { [statKey]: number } | null
 */

export const FEATS = [
  {
    id: "alert",
    name: "Alarmbereit",
    prerequisite: null,
    description: "+5 auf Initiative. Du kannst nicht überrascht werden, solange du bei Bewusstsein bist. Andere Kreaturen erhalten keinen Vorteil auf Angriffswürfe gegen dich, nur weil sie unsichtbar sind.",
    statBonus: null,
  },
  {
    id: "athlete",
    name: "Athlet",
    prerequisite: null,
    description: "+1 STR oder DEX. Aufstehen kostet nur 5 Fuß Bewegung. Klettern kostet keine zusätzliche Bewegung. Anlaufsprünge können aus dem Stand gemacht werden.",
    statBonus: null,  // +1 STR or DEX — user chooses
  },
  {
    id: "actor",
    name: "Schauspieler",
    prerequisite: null,
    description: "+1 CHA. Du hast Vorteil auf Täuschungs- und Auftrittswürfe, wenn du dich als eine andere Person ausgibst. Du kannst die Stimme jeder Person perfekt imitieren, die du mindestens eine Minute lang gehört hast.",
    statBonus: { cha: 1 },
  },
  {
    id: "charger",
    name: "Stürmer",
    prerequisite: null,
    description: "Wenn du in deinem Zug mit Anrennen-Aktion mindestens 10 Fuß geradeaus läufst und danach einen Nahkampfangriff machst, erhältst du +5 Schaden oder kannst das Ziel 10 Fuß zurückstoßen.",
    statBonus: null,
  },
  {
    id: "crossbow_expert",
    name: "Armbrust-Experte",
    prerequisite: null,
    description: "Ignorierst Nahkampf-Nachteil bei Armbrüsten. Beim Laden einer Handarmbrustals Bonusaktion. Wenn du mit einer einhändigen Waffe angreifst, kannst du als Bonusaktion mit einer Handarmbrustangreifen.",
    statBonus: null,
  },
  {
    id: "defensive_duelist",
    name: "Defensiver Duellant",
    prerequisite: "DEX 13",
    description: "Wenn du mit einer finessen Waffe in einer Hand angegriffen wirst, kannst du deine Reaktion nutzen, um deinen Rüstungsklasse um deinen Fertigkeitsbonus zu erhöhen, bis zum Beginn deines nächsten Zuges.",
    statBonus: null,
    prereqStat: { dex: 13 },
  },
  {
    id: "dual_wielder",
    name: "Zweikämpfer",
    prerequisite: null,
    description: "+1 AC, wenn du zwei Waffen trägst. Du kannst zwei nicht-leichte Einhandwaffen tragen. Du kannst eine Waffe als Teil der Bonusaktion des Zweihandkampfes ziehen oder wegstecken.",
    statBonus: null,
  },
  {
    id: "dungeon_delver",
    name: "Höhlenforscher",
    prerequisite: null,
    description: "Vorteil auf Wahrnehmung und Nachforschung bei Fallen und Geheimtüren. Vorteil auf Rettungswürfe gegen Fallen. Widerstandsfähigkeit gegen Trefferpunktschaden durch Fallen.",
    statBonus: null,
  },
  {
    id: "durable",
    name: "Zäh",
    prerequisite: null,
    description: "+1 CON. Wenn du Trefferwürfel für kurze Rast verwendest, erhältst du mindestens das Doppelte deines CON-Modifiers (min 2) TP zurück.",
    statBonus: { con: 1 },
  },
  {
    id: "elemental_adept",
    name: "Elementar-Adept",
    prerequisite: "Zauberfähigkeit",
    description: "Wähle einen Schadenstyp (Feuer, Kälte, Blitz, Säure oder Donner). Deine Zauber ignorieren Resistenz gegen diesen Typ. Für Schadenswürfe gilt eine 1 als 2.",
    statBonus: null,
  },
  {
    id: "grappler",
    name: "Ringer",
    prerequisite: "STR 13",
    description: "Vorteil auf Angriffe gegen gefesselte Kreaturen. Du kannst eine Kreatur, die du gepackt hast, als Aktion festhalten (beide sind bewegungsunfähig).",
    statBonus: null,
    prereqStat: { str: 13 },
  },
  {
    id: "great_weapon_master",
    name: "Großwaffen-Meister",
    prerequisite: null,
    description: "Kritischer Treffer oder Tödlicher Schlag → Bonusaktion für weiteren Angriff. Optional: -5 auf Angriff, +10 auf Schaden.",
    statBonus: null,
  },
  {
    id: "healer",
    name: "Heiler",
    prerequisite: null,
    description: "Mit einem Heiler-Set kannst du eine Kreatur auf 1 + 1W6 + ihre TP-Maximum-Würfel stabilisieren (statt auf 0). Diese Fähigkeit kann an einer Kreatur einmal pro kurzer Rast genutzt werden.",
    statBonus: null,
  },
  {
    id: "heavily_armored",
    name: "Schwere Rüstung",
    prerequisite: "Mittlere Rüstungskompetenz",
    description: "+1 STR. Du erhältst Kompetenz mit schwerer Rüstung.",
    statBonus: { str: 1 },
  },
  {
    id: "heavy_armor_master",
    name: "Meister schwerer Rüstung",
    prerequisite: "Schwere Rüstungskompetenz",
    description: "+1 STR. Wenn du schwere Rüstung trägst, wird physikalischer Schaden (nicht-magisch) um 3 reduziert.",
    statBonus: { str: 1 },
  },
  {
    id: "inspiring_leader",
    name: "Inspirierende Führung",
    prerequisite: "CHA 13",
    description: "Nach 10-minütiger Rede erhalten bis zu 6 Zuhörer temporäre TP in Höhe deines Levels + CHA-Modifier. Wirkt nur einmal pro kurzer Rast.",
    statBonus: null,
    prereqStat: { cha: 13 },
  },
  {
    id: "keen_mind",
    name: "Scharfer Verstand",
    prerequisite: null,
    description: "+1 INT. Du kennst immer Norden, Sonnenstand und Mondphase. Du erinnerst dich an alles, was du in den letzten 30 Tagen gehört oder gesehen hast.",
    statBonus: { int: 1 },
  },
  {
    id: "linguist",
    name: "Sprachtalent",
    prerequisite: null,
    description: "+1 INT. Du lernst 3 neue Sprachen. Du kannst Geheimcodes erstellen. Sprachtests werden mit Vorteil gewürfelt.",
    statBonus: { int: 1 },
  },
  {
    id: "lucky",
    name: "Glückspilz",
    prerequisite: null,
    description: "3 Glückspunkte pro langer Rast. Gib einen aus, um einen deiner Würfelwürfe (Angriff, Fähigkeit, Rettungswurf) erneut zu würfeln und den besseren zu wählen. Auch gegen Angriffe auf dich nutzbar (Angreifer nimmt das schlechtere Ergebnis).",
    statBonus: null,
  },
  {
    id: "mage_slayer",
    name: "Magier-Mörder",
    prerequisite: null,
    description: "Reaktionsangriff gegen Zauberer im Nahkampf. Deine Angriffe geben dem Ziel Nachteil auf seine Konzentrationsrettungen. Vorteil auf Rettungswürfe gegen Zauber von Kreaturen in Nahkampfreichweite.",
    statBonus: null,
  },
  {
    id: "mobile",
    name: "Beweglich",
    prerequisite: null,
    description: "+10 Fuß Bewegungsrate. Dash-Aktion ignoriert schwieriges Gelände. Wenn du eine Kreatur angreifst, provozierst du bei ihr keinen Gelegenheitsangriff, auch wenn du sie verfehlst.",
    statBonus: null,
  },
  {
    id: "mounted_combatant",
    name: "Reiterkämpfer",
    prerequisite: null,
    description: "Vorteil auf Angriffe gegen kleinere Kreaturen als dein Reittier. Du kannst Angriffe auf dein Reittier auf dich umlenken. Dein Reittier hat Vorteil auf Reflexrettungswürfe (halber Schaden bei Erfolg, kein Schaden bei Misserfolg).",
    statBonus: null,
  },
  {
    id: "observant",
    name: "Aufmerksam",
    prerequisite: null,
    description: "+1 INT oder WIS. Du kannst Lippen lesen. Passives Wahrnehmungs- und Nachforschungswert erhöhen sich um 5.",
    statBonus: null,
  },
  {
    id: "polearm_master",
    name: "Stangenwaffen-Meister",
    prerequisite: null,
    description: "Als Bonusaktion mit dem anderen Ende der Stangenwaffe schlagen (1W4 + STR). Kreaturen, die deinen Bereich betreten, provozieren Gelegenheitsangriffe.",
    statBonus: null,
  },
  {
    id: "resilient",
    name: "Widerstandsfähig",
    prerequisite: null,
    description: "+1 auf einen Attributswert. Du erhältst Kompetenz bei Rettungswürfen mit diesem Attribut.",
    statBonus: null,
  },
  {
    id: "ritual_caster",
    name: "Ritualzauberer",
    prerequisite: "INT oder WIS 13",
    description: "Du erhältst ein Ritualbuch mit 2 Ritualen der Stufe 1 und kannst diese als Rituale wirken (10 Min. länger, kein Slot-Verbrauch). Neue Rituale können beim Erlernen eingetragen werden.",
    statBonus: null,
  },
  {
    id: "savage_attacker",
    name: "Brutaler Angreifer",
    prerequisite: null,
    description: "Einmal pro Zug kannst du die Schadenswürfel deines Nahkampfangriffs erneut würfeln und das bessere Ergebnis nehmen.",
    statBonus: null,
  },
  {
    id: "sentinel",
    name: "Wächter",
    prerequisite: null,
    description: "Wenn du einen Gelegenheitsangriff triffst, wird die Bewegung der Kreatur auf 0 reduziert. Kreaturen provozieren Gelegenheitsangriffe auch dann, wenn sie Rückzug nutzen. Wenn eine Kreatur einen benachbarten Verbündeten angreift, kannst du reagieren.",
    statBonus: null,
  },
  {
    id: "sharpshooter",
    name: "Scharfschütze",
    prerequisite: null,
    description: "Keine Nachteil bei Fernkampf auf große Entfernungen. Ignoriert Halb- und Dreiviertelsdeckung. Optional: -5 auf Angriff, +10 auf Schaden.",
    statBonus: null,
  },
  {
    id: "shield_master",
    name: "Schildmeister",
    prerequisite: null,
    description: "Als Bonusaktion nach Angriff: Schubsen (5 Fuß). +2 Reflex-Rettungswürfe gegen Effekte, die nur dich treffen. Bei erfolgreichem Reflex-Rettungswurf kein Schaden (statt halber).",
    statBonus: null,
  },
  {
    id: "skilled",
    name: "Geübt",
    prerequisite: null,
    description: "Du erhältst Kompetenz in 3 Fertigkeiten oder Werkzeugen deiner Wahl.",
    statBonus: null,
  },
  {
    id: "skulker",
    name: "Schleicher",
    prerequisite: "DEX 13",
    description: "Verstecken ist möglich, wenn du leicht verdeckt bist. Ein misslungener Fernkampfangriff verrät nicht deinen Standort. Schlechtes Licht gibt keinen Nachteil auf Wahrnehmungswürfe.",
    statBonus: null,
    prereqStat: { dex: 13 },
  },
  {
    id: "spell_sniper",
    name: "Zauber-Scharfschütze",
    prerequisite: "Zauberfähigkeit",
    description: "Reichweite von Angriffszaubern verdoppelt. Ignoriert Halb- und Dreiviertelsdeckung. Lerne einen Angriffskantripper aus einer beliebigen Klasse.",
    statBonus: null,
  },
  {
    id: "tough",
    name: "Hartgesotten",
    prerequisite: null,
    description: "Max-HP erhöhen sich um 2 × dein Level. Bei jedem weiteren Level erhöhen sie sich um 2.",
    statBonus: null,
  },
  {
    id: "war_caster",
    name: "Kriegszauberer",
    prerequisite: "Zauberfähigkeit",
    description: "Vorteil auf Konzentrationsrettungen. Materialkomponenten mit Waffe/Schild in Händen verwendbar. Als Reaktion Zauber statt Gelegenheitsangriff wirken.",
    statBonus: null,
  },
  {
    id: "weapon_master",
    name: "Waffenmeister",
    prerequisite: null,
    description: "+1 STR oder DEX. Kompetenz mit 4 Waffen deiner Wahl erlangen.",
    statBonus: null,
  },
];

/** Get feat data by id */
export function getFeatById(id) {
  return FEATS.find(f => f.id === id) ?? null;
}

/** Check if character meets a feat's stat prerequisite */
export function meetsPrerequisite(char, feat) {
  if (!feat.prereqStat) return true;
  return Object.entries(feat.prereqStat).every(([stat, min]) => {
    const val = char[stat] || 10;
    return val >= min;
  });
}
