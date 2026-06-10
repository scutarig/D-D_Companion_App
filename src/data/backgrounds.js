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
    descriptionEN: "You devote yourself to service in a temple — embedded in a city or hidden in a sacred grove. You perform rites in honor of a god or pantheon, and learn to channel a spark of divine power.",
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
    descriptionEN: "You swept floors at a craft workshop for a few copper coins a day until you were old enough to apprentice. You learned to make basic items and occasionally to convince demanding customers.",
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
    descriptionEN: "As soon as you were old enough to order an ale, you had a favorite stool in every tavern within 10 miles. Traveling between inns, you learned to prey on unfortunates seeking a comforting lie or a fake potion.",
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
    descriptionEN: "You lived in dark alleys, cutting purses or robbing shops. Perhaps you were part of a small gang or a lone operator standing up against the Thieves' Guild.",
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
    descriptionEN: "You spent your youth at traveling circuses and markets, running errands in exchange for lessons. You may have walked tightropes, played the lute, or recited poetry.",
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
    descriptionEN: "You grew up close to the land. Years of animal husbandry and farming gave you patience and good health. You have a genuine appreciation for nature's gifts — and a healthy respect for her wrath.",
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
    descriptionEN: "Your feet ache when you remember the countless hours on guard duty. You were trained to keep one eye outward — for marauders — and the other inward — for pickpockets.",
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
    descriptionEN: "You grew up outdoors, far from settled lands. Wherever you spread your bedroll was home. You learned to provide for yourself — and occasionally guided friendly nature clerics.",
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
    descriptionEN: "You spent your early years alone in a hut or remote monastery. Your only companions were the woodland creatures and the occasional visitor. The solitude let you spend countless hours contemplating the mysteries of creation.",
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
    descriptionEN: "You apprenticed to a trader, caravan master, or shopkeeper. You traveled widely and earned your living buying and selling raw materials or finished goods.",
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
    descriptionEN: "You were raised in a castle, surrounded by wealth, power, and privilege. Your family provided a first-rate education. You learned much about leadership by watching your family at court.",
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
    descriptionEN: "You spent your formative years traveling between estates and monasteries, running various errands in exchange for library access. You studied books and writings and even learned the basics of magic.",
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
    descriptionEN: "You lived as a seafarer, with wind at your back and swaying decks beneath your feet. You've perched on barstools in more ports than you can recall, weathered storms, and traded tales with deep-sea creatures.",
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
    descriptionEN: "You spent formative years in a scriptorium — a monastery or government office. You learned to write with a clear hand and create elaborate texts. Perhaps you copied government documents or transcribed literature.",
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
    descriptionEN: "You trained for war as soon as you came of age, and carry few memories of the life before. Battle is in your blood. Sometimes you catch yourself reflexively performing the basic drills you first learned.",
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
    descriptionEN: "You grew up on the streets, surrounded by similarly fated outcasts. You slept where you could and ran errands for food. Sometimes you turned to theft — but you never lost your pride.",
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
