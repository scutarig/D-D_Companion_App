export const DND_RACES = [
  {name:"Mensch",traits:["+1 auf alle Attribute","Extra Fertigkeit","Extra Sprache"],speed:30,size:"Mittel",desc:"Die vielseitigste und verbreitetste Rasse der bekannten Welten. Menschen zeichnen sich durch ihre Anpassungsfähigkeit und ihren Ehrgeiz aus – kein Bonus ist herausragend, aber sie sind in allem kompetent. Die Variantenmenschen können alternativ +1 auf zwei Attribute, eine Fertigkeit und einen Feat wählen, was sie zu den stärksten Startcharakteren macht."},
  {name:"Elf",traits:["Dunkelsicht 60ft","Fey-Abstammung (Vorteil vs. Charm, Immunität gegen Schlaf-Zauber)","Trance (4h Meditation statt 8h Schlaf)","Scharfe Sinne (Wahrnehmungs-Proficiency)"],speed:30,size:"Mittel",desc:"Anmutige, langlebige Wesen mit einer tiefen Verbindung zur Natur und Magie. Elfen leben Jahrhunderte und haben eine feenhafte Abstammung, die sie gegen Bezauberung schützt. Ihre Trance statt Schlaf macht sie unter bestimmten Umständen weniger anfällig für Überraschungsangriffe in der Nacht."},
  {name:"Hochelf",traits:["DEX +2, INT +1","Dunkelsicht 60ft","Fey-Abstammung","1 Zauberer-Cantrip","Extra Sprache","Waffenprofizienzen: Langschwert, Kurzschwert, Kurzbogen, Langbogen"],speed:30,size:"Mittel",desc:"Die kultiviertesten aller Elfen, mit einer natürlichen Affinität für arkane Magie. Ein kostenloser Cantrip aus der Zauberer-Liste erweitert ihre Möglichkeiten erheblich. Hochelfen sind in Städten und Elfenreichen zu Hause – sie schätzen Wissen, Kunst und die Schönheit der Magie über alles."},
  {name:"Waldelfe",traits:["DEX +2, WIS +1","Dunkelsicht 60ft","Fey-Abstammung","Bewegungsgeschwindigkeit 35ft","Maske der Wildnis (Verstecken in natürlicher Umgebung)"],speed:35,size:"Mittel",desc:"Naturverbundene Elfen, die in Wäldern und wilden Gebieten leben. Ihre erhöhte Bewegungsgeschwindigkeit und Fähigkeit, sich in der Natur zu verbergen, machen sie zu hervorragenden Scouts. Waldläufer und Druiden profitieren besonders von ihren Boni auf Weisheit und Mobilität."},
  {name:"Dunkelelf (Drow)",traits:["DEX +2, CHA +1","Dunkelsicht 120ft","Fey-Abstammung","Angeborene Zauber: Tanzende Lichter (Cantrip), Feen-Feuer (Stufe 3), Dunkelheit (Stufe 5)","Sonnenlicht-Empfindlichkeit (Nachteil in hellem Licht)"],speed:30,size:"Mittel",desc:"Die unterirdischen Elfen aus der Underdark, bekannt für ihre Grausamkeit und mächtige angeborene Magie. Ihr außergewöhnliches Dunkelsicht von 120ft macht sie in der Finsternis überlegen. Die Sonnenlicht-Empfindlichkeit ist ein erheblicher Nachteil auf der Oberfläche, der taktisches Vorgehen erfordert."},
  {name:"Zwerg",traits:["CON +2","Dunkelsicht 60ft","Zwerg-Robustheit (Vorteil gegen Gift, Resistenz gegen Giftschaden)","Steinkunde (Proficiency in Geschichte für Stein und Metall)","Waffenprofizienzen: Handaxt, Streitaxt, Leichter Hammer, Kriegshammer","Rüstungsprofizienzen: Leichte und Mittlere Rüstungen"],speed:25,size:"Mittel",desc:"Robuste Bergbewohner mit einer kulturellen Liebe zu Handwerk, Bergbau und Kampf. Ihre natürliche Resistenz gegen Gift und der Bonus auf Konstitution machen sie zu ausgezeichneten Kriegern und Tankcharakteren. Zwerge haben trotz kürzerer Beine keine Geschwindigkeitsstrafe durch das Tragen schwerer Rüstungen."},
  {name:"Bergzwerg",traits:["STR +2, CON +2","Dunkelsicht 60ft","Zwerg-Robustheit","Profizienzen mit leichten und mittleren Rüstungen"],speed:25,size:"Mittel",desc:"Die kriegerischsten der Zwerge, gestählt in den harten Bergfestungen ihrer Vorväter. Als einzige nicht-humanoide Rasse mit natürlichen Rüstungsprofizienzen sind Bergzwerge für Kämpfer und Paladine optimal – mit STR+2 und CON+2 sind sie physisch eine der stärksten Grundrassen im Spiel."},
  {name:"Hügelzwerg",traits:["WIS +1, CON +2","Zähigkeit (+1 HP pro Level zusätzlich)","Dunkelsicht 60ft","Zwerg-Robustheit"],speed:25,size:"Mittel",desc:"Weise und zähe Zwerge, die in Hügeln und fruchtbaren Landen siedeln. Ihr Bonus-HP pro Level macht sie zu den robustesten Charakteren im frühen Spiel. Kleriker und Druiden profitieren besonders vom Weisheitsbonus, kombiniert mit der natürlichen Zähigkeit und Giftresistenz."},
  {name:"Halbling",traits:["DEX +2","Glück (Würfe einer 1 dürfen wiederholt werden)","Tapferkeit (Vorteil gegen Erschreckt-Zustand)","Beweglichkeit (kann durch Felder größerer Kreaturen gehen)"],speed:25,size:"Klein",desc:"Kleine, fröhliche Wesen mit einer legendären Fähigkeit, dem Pech zu entgehen. Ihre Glück-Eigenschaft ist mechanisch eine der stärksten in 5e – eine 1 auf einem Würfelwurf niemals akzeptieren zu müssen, erhöht die Zuverlässigkeit erheblich. Ideal als Schurke oder Waldläufer durch den DEX-Bonus und die natürliche Tapferkeit."},
  {name:"Halbork",traits:["STR +2, CON +1","Dunkelsicht 60ft","Profizient: Einschüchterung","Unnachgiebige Ausdauer (einmal pro lange Rast: 1 HP statt zu sterben)","Wilde Angriffe (kritische Treffer fügen +1 Schadenswürfel hinzu)"],speed:30,size:"Mittel",desc:"Starke Krieger mit dem Erbe der Orks in ihren Adern. Ihre Unnachgiebige Ausdauer ist eine der besten Überlebensfähigkeiten für frontlinige Charaktere – einmal pro langer Rast einem tödlichen Treffer zu überleben, ist spielentscheidend. Barbare und Kämpfer profitieren am meisten von Stärke, Konstitution und Wilden Angriffen."},
  {name:"Halbelfe",traits:["CHA +2, zwei weitere Attribute +1 (frei wählbar)","Dunkelsicht 60ft","Fey-Abstammung (Vorteil gegen Charm)","Vielseitigkeit (2 Skill-Profizienzen frei wählen)"],speed:30,size:"Mittel",desc:"Wesen zwischen zwei Welten, die das Beste beider Rassen vereinen. Als einzige Rasse können Halbhelfen ihre zwei weiteren +1-Boni frei auf beliebige Attribute verteilen und zwei Fertigkeiten ihrer Wahl erlernen. Diese Flexibilität macht sie zu einer der universellsten Rassen für Barden, Hexenmeister und Paladine."},
  {name:"Tiefling",traits:["INT +1, CHA +2","Dunkelsicht 60ft","Höllische Resistenz (Resistenz gegen Feuerschaden)","Angeborene Zauber: Thaumaturgie (Cantrip), Höllischer Tadel (Stufe 3), Dunkelheit (Stufe 5)"],speed:30,size:"Mittel",desc:"Nachfahren von Teufeln, gebrandmarkt durch ein höllisches Erbe. Tieflinge tragen die Stigmata ihrer Abstammung – Hörner, Schwanz, flammende Augen – und stoßen viele ab. Ihre angeborene Feuermagie und Resistenz sind in Dungeons wertvoll, und ihr CHA+2 macht sie zu natürlichen Hexenmeistern, Zauberern und Barden."},
  {name:"Drachen-Geborener",traits:["STR +2, CHA +1","Drachen-Abstammung (bestimmt Schadenstyp und Resistenz)","Atemwaffe (Kegel oder Linie; STR- oder CON-Rettungswurf des Ziels)","Schadensresistenz (entspricht dem Drachen-Typ)"],speed:30,size:"Mittel",desc:"Stolze Humanoide mit Drachenblut, die die körperliche Macht ihrer drachischen Vorfahren tragen. Die Atemwaffe skaliert nicht mit dem Level, ist aber besonders in frühen Stufen mächtig. Der CHA-Bonus ergänzt magische Klassen, der STR-Bonus physische Klassen – Paladine und Barden passen thematisch und mechanisch hervorragend."},
  {name:"Gnom",traits:["INT +2","Dunkelsicht 60ft","Gnomische List (Vorteil auf INT/WIS/CHA-Rettungswürfe gegen Magie)"],speed:25,size:"Klein",desc:"Erfinderische Kleinlinge mit einer angeborenen Resistenz gegen magische Kontrolle. Gnomische List macht sie besonders resistent gegen Bezauberungen, Illusionen und andere Geistesmagie. Unterrassen: Waldgnom (DEX+1, Tiersprache, Täuschungs-Cantrip) und Gesteinsgnom (CON+1, Tüftler, Schnittstellenwissen) bieten sehr unterschiedliche Spielstile."},
  {name:"Aarakocra",traits:["DEX +2, WIS +1","Fluggeschwindigkeit 50ft (ohne Rüstung)","Klauenangriff (1W4 Klingenwaffe, natürliche Waffe)"],speed:25,size:"Mittel",desc:"(Elemental Evil Player's Companion) Vogelartige Humanoide aus luftigen Gipfeln, bekannt für ihre außergewöhnliche Mobilität. Eine Fluggeschwindigkeit von 50ft schon auf Stufe 1 ist der größte Mobilitätsvorteil im gesamten Regelwerk – Lufthoheit bedeutet oft taktische Dominanz. Viele Spielleiter schränken diese Rasse ein, da Fliegen den Dungeonschwierigkeitsgrad drastisch senken kann."},
  {name:"Aasimar",traits:["CHA +2","Dunkelsicht 60ft","Heilende Hände (HP = Charakterlevel wiederherstellen, 1× pro langer Rast)","Licht-Träger (Licht-Cantrip)","Celestialer Widerstand (Resistenz gegen Nekrose- und Strahlungsschaden)"],speed:30,size:"Mittel",desc:"(Volo's Guide) Abkömmlinge himmlischer Wesen, gesegnet mit celestialer Gnade. Ihre Unterrassen bieten markant unterschiedliche Kräfte: Beschützer-Aasimar erhalten temporäre Flügel, Geißel-Aasimar verteilen Strahlungsschaden in der Nähe, und Gefallene Aasimar können Feinde in Angst und Schrecken versetzen – ideal für dunklere Charakterkonzepte."},
  {name:"Tiefling (Varianten)",traits:["Attributsboni je nach Teufelslord-Abstammung","Angeborene Zauber je nach gewählter Abstammungslinie","Höllische Resistenz (Feuer) bleibt stets erhalten"],speed:30,size:"Mittel",desc:"(Mordenkainen's Tome of Foes) Erweiterte Tiefling-Varianten mit Abstammung von verschiedenen Teufelslords wie Asmodeus, Baalzebul oder Dispater. Jede Variante bietet andere Attributsboni und angeborene Zauber, die weit über den Standard-Tiefling hinausgehen. Ideal für maßgeschneiderte, thematisch tiefe Charakterkonzepte."},
  {name:"Wasserkind (Genasi)",traits:["CON +2, zusätzlich je nach Element +1","Elementare Kräfte und Zauber je nach gewähltem Element"],speed:30,size:"Mittel",desc:"(Elemental Evil Player's Companion) Nachkommen von Elementarwesen in vier Varianten. Feuer-Genasi (INT+1): Immunität gegen Feuer, Feuerzauber. Wasser-Genasi (WIS+1): Amphibisch, Schwimmgeschwindigkeit. Erd-Genasi (STR+1): Passieren von Felsen, Steinhaut-Zauber. Luft-Genasi (DEX+1): Levitation, Nicht-Atmen. Jede Variante bietet einen völlig anderen Spielstil."},
  {name:"Triton",traits:["STR +1, CON +1, CHA +1","Amphibisch (atmet Wasser und Luft)","Dunkelsicht 60ft","Kontrolle Luft und Wasser (Windstoß, Strahlendes Licht, Sturm)","Resistenz gegen Kälte- und Feuerschaden"],speed:30,size:"Mittel",desc:"(Volo's Guide) Krieger der tiefen Meere mit einer jahrhundertelangen Geschichte des Kampfes gegen Abyssal-Bedrohungen aus den Meerestiefen. Ihre ausgewogenen +1-Boni auf drei Attribute machen sie flexibel, jedoch nicht spezialisiert. Besonders stark in Unterwasserkampagnen; die Kontrollzauber über Luft und Wasser bieten situative, aber eindrucksvolle Möglichkeiten."},
  {name:"Yuan-ti Pureblood",traits:["INT +1, CHA +2","Dunkelsicht 60ft","Magieresistenz (Vorteil auf alle Rettungswürfe gegen Zauber)","Gift-Immunität","Angeborene Zauber: Giftspray (Cantrip), Tierfreundschaft (3× LR: Schlangen), Einflüsterung (1× LR)"],speed:30,size:"Mittel",desc:"(Volo's Guide) Schlangenartige Humanoide aus einer alten, dunklen Zivilisation. Ihre Magieresistenz – Vorteil auf alle magischen Rettungswürfe – ist mechanisch eine der stärksten passiven Eigenschaften im Spiel. Kombiniert mit Gift-Immunität und CHA+2 sind sie exzellente Hexenmeister, Zauberer oder Barden, besonders in magieintensiven Kampagnen."},
];

export const ALL_VOELKER = DND_RACES.map(r => r.name);
export const DND_BACKGROUNDS = ["Akolyt","Adliger","Ausgestoßener","Entertainer","Edelmann","Fernhändler","Fischer","Forscher","Gildenmitglied","Gladiator","Handwerker","Heimatloser","Held des Volkes","Krimineller","Matrose","Pirat","Scharlatan","Söldner","Soldat","Stadtbewohner","Waldläufer","Verbrechensopfer","Wanderer","Weiser","Zögling"];

// ── Strukturierte Rassen-Daten (9 Standardrassen) ────────────────────────────
// Jedes Trait/Feature: { id, name, description, source, category }
// category: "trait" | "feature"
export const RACES_FULL = [
  {
    id: "mensch",
    name: "Mensch",
    description: "Die vielseitigste und verbreitetste Rasse. Menschen zeichnen sich durch Anpassungsfähigkeit und Ehrgeiz aus.",
    statBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "1 Sprache nach Wahl"],
    traits: [
      { id: "mensch_attr_bonus", name: "+1 auf alle Attribute", description: "Jeder deiner sechs Attributswerte erhöht sich um 1.", source: "Mensch", category: "trait" },
      { id: "mensch_extra_fertigkeit", name: "Vielseitigkeit", description: "Du erhältst Übung in einer Fertigkeit deiner Wahl.", source: "Mensch", category: "trait" },
      { id: "mensch_extra_sprache", name: "Extra Sprache", description: "Du kannst eine zusätzliche Sprache deiner Wahl sprechen, lesen und schreiben.", source: "Mensch", category: "trait" },
    ],
    features: [
      { id: "mensch_versatile", name: "Anpassungsfähigkeit", description: "Menschen sind in allen Klassen und Rollen gleich stark. Keine Stärke ist herausragend, aber keine Schwäche schränkt ein.", source: "Mensch", category: "feature" },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    description: "Anmutige, langlebige Wesen mit einer tiefen Verbindung zur Natur und Magie. Elfen leben Jahrhunderte.",
    statBonuses: { STR: 0, DEX: 2, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Elfisch"],
    traits: [
      { id: "elf_dex_bonus", name: "DEX +2", description: "Dein Geschicklichkeitswert erhöht sich um 2.", source: "Elf", category: "trait" },
      { id: "elf_darkvision", name: "Dunkelsicht", description: "Du siehst in Dunkelheit (schwaches Licht) auf bis zu 60 Fuß als wäre es helles Licht, und in völliger Dunkelheit als wäre es schwaches Licht. In Dunkelheit erkennst du keine Farben, nur Grautöne.", source: "Elf", category: "trait" },
      { id: "elf_keen_senses", name: "Scharfe Sinne", description: "Du hast Übung in der Fertigkeit Wahrnehmung.", source: "Elf", category: "trait" },
      { id: "elf_fey_ancestry", name: "Fey-Abstammung", description: "Du hast Vorteil auf Rettungswürfe gegen das Bezaubert-Sein und kannst durch Magie nicht in den Schlaf versetzt werden.", source: "Elf", category: "trait" },
    ],
    features: [
      { id: "elf_trance", name: "Trance", description: "Elfen schlafen nicht. Stattdessen meditieren sie 4 Stunden täglich tief (Trance). Danach profitierst du wie nach einer langen Rast.", source: "Elf", category: "feature" },
    ],
  },
  {
    id: "zwerg",
    name: "Zwerg",
    description: "Robuste Bergbewohner mit kultureller Liebe zu Handwerk, Bergbau und Kampf. Bekannt für ihre Ausdauer.",
    statBonuses: { STR: 0, DEX: 0, CON: 2, INT: 0, WIS: 0, CHA: 0 },
    speed: 25, size: "Mittel", languages: ["Gemeinsprache", "Zwergisch"],
    traits: [
      { id: "zwerg_con_bonus", name: "CON +2", description: "Dein Konstitutionswert erhöht sich um 2.", source: "Zwerg", category: "trait" },
      { id: "zwerg_darkvision", name: "Dunkelsicht", description: "Gewohnt an das Leben unter der Erde, siehst du in Dunkelheit auf bis zu 60 Fuß.", source: "Zwerg", category: "trait" },
      { id: "zwerg_robustheit", name: "Zwerg-Robustheit", description: "Du hast Vorteil auf Rettungswürfe gegen Gift und Resistenz gegen Giftschaden.", source: "Zwerg", category: "trait" },
      { id: "zwerg_steinkunde", name: "Steinkunde", description: "Wenn du einen Intelligenz(Geschichte)-Wurf machst, der sich auf die Herkunft von Steinmetzarbeiten bezieht, hast du Vorteil.", source: "Zwerg", category: "trait" },
      { id: "zwerg_kampftraining", name: "Zwerg-Kampftraining", description: "Du hast Übung mit Handaxt, Streitaxt, Leichtem Hammer und Kriegshammer.", source: "Zwerg", category: "trait" },
    ],
    features: [
      { id: "zwerg_werkzeug", name: "Werkzeugübung", description: "Du hast Übung mit dem Werkzeug eines Handwerks deiner Wahl: Schmiedewerkzeug, Brauersutensilien oder Steinmetzwerkzeug.", source: "Zwerg", category: "feature" },
      { id: "zwerg_bewegung", name: "Standhaftigkeit", description: "Deine Bewegungsgeschwindigkeit wird nicht durch das Tragen schwerer Rüstung verringert.", source: "Zwerg", category: "feature" },
    ],
  },
  {
    id: "halbling",
    name: "Halbling",
    description: "Kleine, fröhliche Wesen mit einer legendären Fähigkeit, dem Pech zu entgehen. Ideal als Schurke oder Waldläufer.",
    statBonuses: { STR: 0, DEX: 2, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    speed: 25, size: "Klein", languages: ["Gemeinsprache", "Halblingsprache"],
    traits: [
      { id: "halbling_dex_bonus", name: "DEX +2", description: "Dein Geschicklichkeitswert erhöht sich um 2.", source: "Halbling", category: "trait" },
      { id: "halbling_luck", name: "Glück", description: "Wenn du bei einem Angriffswurf, Rettungswurf oder Fertigkeitswurf eine 1 würfelst, darfst du den Würfel erneut würfeln und musst das neue Ergebnis verwenden.", source: "Halbling", category: "trait" },
      { id: "halbling_tapferkeit", name: "Tapferkeit", description: "Du hast Vorteil auf Rettungswürfe gegen das Erschreckt-Sein.", source: "Halbling", category: "trait" },
      { id: "halbling_beweglichkeit", name: "Halbling-Beweglichkeit", description: "Du kannst durch den Raum einer beliebigen Kreatur gehen, die mindestens eine Größe größer als du ist.", source: "Halbling", category: "trait" },
    ],
    features: [],
  },
  {
    id: "drachen_geborener",
    name: "Drachen-Geborener",
    description: "Stolze Humanoide mit Drachenblut. Die körperliche Macht ihrer drachischen Vorfahren zeigt sich in Atem und Resistenz.",
    statBonuses: { STR: 2, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 1 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Drachisch"],
    traits: [
      { id: "drache_str_bonus", name: "STR +2, CHA +1", description: "Dein Stärkewert erhöht sich um 2, dein Charismawert um 1.", source: "Drachen-Geborener", category: "trait" },
      { id: "drache_abstammung", name: "Drachen-Abstammung", description: "Du hast die Abstammung eines bestimmten Drachentyps (z.B. Gold, Silber, Feuer). Dieser bestimmt deinen Atemwaffen-Schadenstyp und deine Resistenz.", source: "Drachen-Geborener", category: "trait" },
      { id: "drache_atemwaffe", name: "Atemwaffe", description: "Du kannst als Aktion deinen Atem als Waffe einsetzen (Kegel 15ft oder Linie 5×30ft). Jedes Wesen muss einen Rettungswurf ablegen (SG = 8 + CON-Mod + PB). Bei Erfolg halber Schaden. Einmal nach kurzer oder langer Rast.", source: "Drachen-Geborener", category: "feature" },
    ],
    features: [
      { id: "drache_resistenz", name: "Schadensresistenz", description: "Du hast Resistenz gegen den Schadenstyp, der deiner Drachen-Abstammung entspricht.", source: "Drachen-Geborener", category: "feature" },
    ],
  },
  {
    id: "gnom",
    name: "Gnom",
    description: "Erfinderische Kleinlinge mit natürlicher Resistenz gegen magische Kontrolle. Ideal für Zauberer und Erfinder.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 2, WIS: 0, CHA: 0 },
    speed: 25, size: "Klein", languages: ["Gemeinsprache", "Gnomisch"],
    traits: [
      { id: "gnom_int_bonus", name: "INT +2", description: "Dein Intelligenzwert erhöht sich um 2.", source: "Gnom", category: "trait" },
      { id: "gnom_darkvision", name: "Dunkelsicht", description: "Gewohnt an unterirdische Wohnstätten, siehst du in Dunkelheit auf bis zu 60 Fuß.", source: "Gnom", category: "trait" },
      { id: "gnom_list", name: "Gnomische List", description: "Du hast Vorteil auf alle Intelligenz-, Weisheits- und Charismo-Rettungswürfe gegen Magie.", source: "Gnom", category: "trait" },
    ],
    features: [],
  },
  {
    id: "halbork",
    name: "Halbork",
    description: "Starke Krieger mit dem Erbe der Orks. Unnachgiebige Ausdauer ist eine der besten Überlebensfähigkeiten im Spiel.",
    statBonuses: { STR: 2, DEX: 0, CON: 1, INT: 0, WIS: 0, CHA: 0 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Orkisch"],
    traits: [
      { id: "halbork_str_bonus", name: "STR +2, CON +1", description: "Dein Stärkewert erhöht sich um 2, dein Konstitutionswert um 1.", source: "Halbork", category: "trait" },
      { id: "halbork_darkvision", name: "Dunkelsicht", description: "Dank deines ork'schen Erbes siehst du in Dunkelheit auf bis zu 60 Fuß.", source: "Halbork", category: "trait" },
      { id: "halbork_einschuechterung", name: "Einschüchterung", description: "Du hast Übung in der Fertigkeit Einschüchterung.", source: "Halbork", category: "trait" },
    ],
    features: [
      { id: "halbork_ausdauer", name: "Unnachgiebige Ausdauer", description: "Wenn du auf 0 Trefferpunkte reduziert wirst, kannst du stattdessen auf 1 Trefferpunkt bleiben. Diese Fähigkeit kann nicht erneut verwendet werden, bis du eine lange Rast abgeschlossen hast.", source: "Halbork", category: "feature" },
      { id: "halbork_wilde_angriffe", name: "Wilde Angriffe", description: "Wenn du mit einem Nahkampfangriff einen kritischen Treffer erzielst, kannst du einen zusätzlichen Würfel des Schadenswürfels der Waffe zum Extraschadenswurf würfeln.", source: "Halbork", category: "feature" },
    ],
  },
  {
    id: "halbelfe",
    name: "Halbelfe",
    description: "Wesen zwischen zwei Welten. Als einzige Rasse können Halbhelfen ihre +1-Boni frei verteilen und Fertigkeiten frei wählen.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 2 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Elfisch", "1 Sprache nach Wahl"],
    traits: [
      { id: "halbelfe_cha_bonus", name: "CHA +2, zwei weitere +1", description: "Dein Charismawert erhöht sich um 2. Außerdem erhöhen sich zwei andere Attributswerte deiner Wahl jeweils um 1.", source: "Halbelfe", category: "trait" },
      { id: "halbelfe_darkvision", name: "Dunkelsicht", description: "Dank deines elfischen Erbes siehst du in Dunkelheit auf bis zu 60 Fuß.", source: "Halbelfe", category: "trait" },
      { id: "halbelfe_fey_ancestry", name: "Fey-Abstammung", description: "Du hast Vorteil auf Rettungswürfe gegen das Bezaubert-Sein und kannst durch Magie nicht in den Schlaf versetzt werden.", source: "Halbelfe", category: "trait" },
      { id: "halbelfe_vielseitigkeit", name: "Vielseitigkeit", description: "Du hast Übung in zwei Fertigkeiten deiner Wahl.", source: "Halbelfe", category: "trait" },
    ],
    features: [],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    description: "Nachfahren von Teufeln, gebrandmarkt durch ein höllisches Erbe. CHA+2 macht sie zu natürlichen Hexenmeistern und Barden.",
    statBonuses: { STR: 0, DEX: 0, CON: 0, INT: 1, WIS: 0, CHA: 2 },
    speed: 30, size: "Mittel", languages: ["Gemeinsprache", "Teuflisch"],
    traits: [
      { id: "tiefling_int_cha_bonus", name: "INT +1, CHA +2", description: "Dein Intelligenzwert erhöht sich um 1, dein Charismawert um 2.", source: "Tiefling", category: "trait" },
      { id: "tiefling_darkvision", name: "Dunkelsicht", description: "Dank deines höllischen Erbes siehst du in Dunkelheit auf bis zu 60 Fuß.", source: "Tiefling", category: "trait" },
      { id: "tiefling_feuer_resistenz", name: "Höllische Resistenz", description: "Du hast Resistenz gegen Feuerschaden.", source: "Tiefling", category: "trait" },
    ],
    features: [
      { id: "tiefling_thaumaturgie", name: "Thaumaturgie (Cantrip)", description: "Du kennst den Cantrip Thaumaturgie. Charisma ist deine Zauberfähigkeit für diesen Zauber.", source: "Tiefling", category: "feature" },
      { id: "tiefling_hoellischer_tadel", name: "Höllischer Tadel (Stufe 3)", description: "Wenn du Stufe 3 erreichst, kannst du Höllischer Tadel als Stufe-2-Zauber wirken. Einmal nach einer langen Rast.", source: "Tiefling", category: "feature" },
      { id: "tiefling_dunkelheit", name: "Dunkelheit (Stufe 5)", description: "Wenn du Stufe 5 erreichst, kannst du Dunkelheit als Stufe-2-Zauber wirken. Einmal nach einer langen Rast.", source: "Tiefling", category: "feature" },
    ],
  },
];
