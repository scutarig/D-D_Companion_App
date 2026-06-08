// ─────────────────────────────────────────────────────────────────────────────
// backgrounds.js — D&D 5e 2024 PHB Backgrounds (16 Core)
//
// 2024 REFORM:
// - Backgrounds geben jetzt **ASI** (Ability Score Increase): 3 Stats vorgegeben,
//   du verteilst +2/+1 oder +1/+1/+1 darunter.
// - Backgrounds geben jetzt **Origin Feat** (1 spezifischer Feat pro Background)
// - Skills: 2 vorgegeben
// - Tool: 1 vorgegeben (Wahl bei Gaming Set / Artisan / Musical)
// - Equipment: Wahl A (spezifisch) oder B (50 GP)
// - KEINE narrativen "Features" mehr (war 2014: Schutz der Heiligen Stätte, etc.)
//
// Schema 2024:
//   { id, name, edition, description, abilityScores[3], feat, skillProfs[2],
//     toolProf, equipmentA[], equipmentB:"50 GP" }
//
// LEGACY 2014-Backgrounds bleiben am Ende verfügbar (mit `legacy: true`).
// ─────────────────────────────────────────────────────────────────────────────

export const BACKGROUNDS_FULL = [
  // ── 2024 PHB Core Backgrounds (16) ─────────────────────────────────────────
  {
    id: "acolyte", name: "Acolyte", edition: "2024",
    description: "Du widmest dich dem Dienst in einem Tempel — sei es eingebettet in einer Stadt oder versteckt in einem heiligen Hain. Du führst Riten zu Ehren eines Gottes oder Pantheons durch und lernst, einen Funken göttlicher Macht zu kanalisieren.",
    abilityScores: ["INT", "WIS", "CHA"],
    feat: "Magic Initiate (Cleric)",
    skillProfs: ["Einsicht", "Religion"],
    toolProf: "Calligrapher's Supplies",
    equipmentA: ["Calligrapher's Supplies", "Gebetsbuch", "Pergament (10 Bögen)", "Heiliges Symbol", "Robe", "8 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "artisan", name: "Artisan", edition: "2024",
    description: "Du hast in einer Handwerkswerkstatt für ein paar Kupfermünzen pro Tag Böden geschrubbt, bis du alt genug warst, um Lehrling zu werden. Du hast gelernt, einfache Stücke zu fertigen und gelegentlich anspruchsvolle Kunden zu überzeugen.",
    abilityScores: ["STR", "DEX", "INT"],
    feat: "Crafter",
    skillProfs: ["Nachforschungen", "Überzeugen"],
    toolProf: "1 Artisan's Tools deiner Wahl",
    equipmentA: ["Artisan's Tools (gewählt)", "2 Pouches", "Travelers Clothes", "32 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "charlatan", name: "Charlatan", edition: "2024",
    description: "Sobald du alt genug warst, ein Ale zu bestellen, hattest du einen Lieblingshocker in jeder Taverne im Umkreis von 10 Meilen. Auf der Reise zwischen Wirtshäusern lerntest du, Pechvögel zu beuten, die nach einer beruhigenden Lüge oder einem gefälschten Trank suchten.",
    abilityScores: ["DEX", "CON", "CHA"],
    feat: "Skilled",
    skillProfs: ["Täuschen", "Fingerfertigkeit"],
    toolProf: "Forgery Kit",
    equipmentA: ["Forgery Kit", "Kostüm", "Feine Kleidung", "15 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "criminal", name: "Criminal", edition: "2024",
    description: "Du hast in dunklen Gassen gelebt, Beutel abgeschnitten oder Läden ausgeraubt. Vielleicht warst du Teil einer kleinen Gang oder ein Einzelgänger, der sich gegen die Diebesgilde behauptete.",
    abilityScores: ["DEX", "CON", "INT"],
    feat: "Alert",
    skillProfs: ["Fingerfertigkeit", "Heimlichkeit"],
    toolProf: "Thieves' Tools",
    equipmentA: ["2 Daggers", "Thieves' Tools", "Brechstange", "2 Pouches", "Travelers Clothes", "16 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "entertainer", name: "Entertainer", edition: "2024",
    description: "Du hast deine Jugend bei Wanderzirkussen und Märkten verbracht und gegen Lektionen Botengänge erledigt. Du hast vielleicht Seil getanzt, Laute gespielt oder Gedichte rezitiert.",
    abilityScores: ["STR", "DEX", "CHA"],
    feat: "Musician",
    skillProfs: ["Akrobatik", "Auftreten"],
    toolProf: "1 Musical Instrument deiner Wahl",
    equipmentA: ["Musical Instrument", "2 Kostüme", "Spiegel", "Parfüm", "Travelers Clothes", "11 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "farmer", name: "Farmer", edition: "2024",
    description: "Du bist nah am Land aufgewachsen. Jahre der Tierpflege und Landwirtschaft schenkten dir Geduld und gute Gesundheit. Du hast eine echte Wertschätzung für die Gaben der Natur — und einen gesunden Respekt vor ihrem Zorn.",
    abilityScores: ["STR", "CON", "WIS"],
    feat: "Tough",
    skillProfs: ["Tierführung", "Natur"],
    toolProf: "Carpenter's Tools",
    equipmentA: ["Sichel", "Carpenter's Tools", "Healer's Kit", "Eisentopf", "Schaufel", "Travelers Clothes", "30 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "guard", name: "Guard", edition: "2024",
    description: "Deine Füße schmerzen, wenn du dich an die unzähligen Stunden auf deinem Posten erinnerst. Du wurdest geschult, ein Auge nach außen zu richten — nach Marodeuren — und das andere nach innen — nach Taschendieben.",
    abilityScores: ["STR", "INT", "WIS"],
    feat: "Alert",
    skillProfs: ["Athletik", "Wahrnehmung"],
    toolProf: "1 Gaming Set deiner Wahl",
    equipmentA: ["Speer", "Leichte Armbrust", "20 Bolzen", "Gaming Set", "Kapuzenlaterne", "Handschellen", "Köcher", "Travelers Clothes", "12 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "guide", name: "Guide", edition: "2024",
    description: "Du bist im Freien aufgewachsen, fern von besiedeltem Land. Wo immer du deine Bettrolle ausbreitetest, war dein Zuhause. Du hast gelernt, dich selbst zu versorgen — und wirst gelegentlich freundliche Naturkleriker geführt haben.",
    abilityScores: ["DEX", "CON", "WIS"],
    feat: "Magic Initiate (Druid)",
    skillProfs: ["Heimlichkeit", "Überlebenskunst"],
    toolProf: "Cartographer's Tools",
    equipmentA: ["Kurzbogen", "20 Pfeile", "Cartographer's Tools", "Bettrolle", "Köcher", "Zelt", "Travelers Clothes", "3 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "hermit", name: "Hermit", edition: "2024",
    description: "Du hast deine frühen Jahre allein in einer Hütte oder einem abgelegenen Kloster verbracht. Deine einzigen Gefährten waren die Wesen des Waldes und gelegentliche Besucher. Die Einsamkeit erlaubte es dir, viele Stunden über die Mysterien der Schöpfung nachzudenken.",
    abilityScores: ["CON", "WIS", "CHA"],
    feat: "Healer",
    skillProfs: ["Medizin", "Religion"],
    toolProf: "Herbalism Kit",
    equipmentA: ["Quarterstaff", "Herbalism Kit", "Bettrolle", "Philosophie-Buch", "Lampe", "Öl (3 Flaschen)", "Travelers Clothes", "16 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "merchant", name: "Merchant", edition: "2024",
    description: "Du wurdest bei einem Händler, Karawanenführer oder Ladenbesitzer in die Lehre gegeben. Du bist weit gereist und hast deinen Lebensunterhalt mit dem Kauf und Verkauf von Rohstoffen oder Fertigwaren verdient.",
    abilityScores: ["CON", "INT", "CHA"],
    feat: "Lucky",
    skillProfs: ["Tierführung", "Überzeugen"],
    toolProf: "Navigator's Tools",
    equipmentA: ["Navigator's Tools", "2 Pouches", "Travelers Clothes", "22 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "noble", name: "Noble", edition: "2024",
    description: "Du wurdest in einer Burg aufgezogen, umgeben von Reichtum, Macht und Privilegien. Deine Familie sorgte für eine erstklassige Ausbildung. Du lerntest viel über Führung beim Beobachten deiner Familie am Hofe.",
    abilityScores: ["STR", "INT", "CHA"],
    feat: "Skilled",
    skillProfs: ["Geschichte", "Überzeugen"],
    toolProf: "1 Gaming Set deiner Wahl",
    equipmentA: ["Gaming Set", "Feine Kleidung", "Parfüm", "29 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "sage", name: "Sage", edition: "2024",
    description: "Du hast deine prägenden Jahre damit verbracht, zwischen Anwesen und Klöstern zu reisen und im Austausch für Bibliothekszugang verschiedene Botengänge zu erledigen. Du hast Bücher und Schriften studiert und sogar die Grundlagen der Magie gelernt.",
    abilityScores: ["CON", "INT", "WIS"],
    feat: "Magic Initiate (Wizard)",
    skillProfs: ["Arkane Kunde", "Geschichte"],
    toolProf: "Calligrapher's Supplies",
    equipmentA: ["Quarterstaff", "Calligrapher's Supplies", "Geschichte-Buch", "Pergament (8 Bögen)", "Robe", "8 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "sailor", name: "Sailor", edition: "2024",
    description: "Du hast als Seefahrer gelebt, mit dem Wind im Rücken und schwankenden Decks unter den Füßen. Du hast auf Barhockern in mehr Häfen gesessen als du dich erinnern kannst, hast Stürme überstanden und Geschichten mit Tiefseewesen getauscht.",
    abilityScores: ["STR", "DEX", "WIS"],
    feat: "Tavern Brawler",
    skillProfs: ["Akrobatik", "Wahrnehmung"],
    toolProf: "Navigator's Tools",
    equipmentA: ["Dolch", "Navigator's Tools", "Seil", "Travelers Clothes", "20 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "scribe", name: "Scribe", edition: "2024",
    description: "Du hast prägende Jahre in einem Skriptorium verbracht — einem Kloster oder einer staatlichen Behörde. Du hast gelernt, mit klarer Hand zu schreiben und kunstvolle Texte zu erstellen. Vielleicht hast du Regierungsdokumente kopiert oder Literatur transkribiert.",
    abilityScores: ["DEX", "INT", "WIS"],
    feat: "Skilled",
    skillProfs: ["Nachforschungen", "Wahrnehmung"],
    toolProf: "Calligrapher's Supplies",
    equipmentA: ["Calligrapher's Supplies", "Feine Kleidung", "Lampe", "Öl (3 Flaschen)", "Pergament (12 Bögen)", "23 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "soldier", name: "Soldier", edition: "2024",
    description: "Du hast für den Krieg trainiert, sobald du das Erwachsenenalter erreicht hattest, und trägst wenige Erinnerungen an das Leben davor. Schlachten liegen in deinem Blut. Manchmal ertappst du dich dabei, reflexartig die Grundübungen auszuführen, die du zuerst gelernt hast.",
    abilityScores: ["STR", "DEX", "CON"],
    feat: "Savage Attacker",
    skillProfs: ["Athletik", "Einschüchtern"],
    toolProf: "1 Gaming Set deiner Wahl",
    equipmentA: ["Speer", "Kurzbogen", "20 Pfeile", "Gaming Set", "Healer's Kit", "Köcher", "Travelers Clothes", "14 GP"],
    equipmentB: "50 GP",
  },
  {
    id: "wayfarer", name: "Wayfarer", edition: "2024",
    description: "Du bist auf den Straßen aufgewachsen, umgeben von ähnlich schicksalhaften Ausgestoßenen. Du hast geschlafen, wo du konntest, und Botengänge für Essen erledigt. Manchmal griffst du zum Diebstahl — aber du hast nie deinen Stolz verloren.",
    abilityScores: ["DEX", "WIS", "CHA"],
    feat: "Lucky",
    skillProfs: ["Einsicht", "Heimlichkeit"],
    toolProf: "Thieves' Tools",
    equipmentA: ["2 Daggers", "Thieves' Tools", "1 Gaming Set", "Bettrolle", "2 Pouches", "Travelers Clothes", "16 GP"],
    equipmentB: "50 GP",
  },
];

/** Lookup by name */
export function getBackgroundData(name) {
  return BACKGROUNDS_FULL.find(b => b.name === name || b.id === name) ?? null;
}

/** Get all background names */
export const ALL_BACKGROUND_NAMES = BACKGROUNDS_FULL.map(b => b.name);
