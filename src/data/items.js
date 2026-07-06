// ─────────────────────────────────────────────────────────────────────────────
// SRD Items + 2024 Equipment + DMG Magic Items
//
// MAGIC-MODIFIER-SYSTEM:
// Waffen + Rüstungen mit `magicCompatible: true` können im Katalog als
// +0/+1/+2/+3 Variante zum Inventar hinzugefügt werden (siehe Katalog.jsx).
// Damit verschwindet die Notwendigkeit für N×3 separate Magic-Variants.
//
// Bonus-Anwendung beim Add-to-Inventory:
//   +1: Common→Uncommon, +1 auf Hit/Damage (Weapon) ODER +1 AC (Armor)
//   +2: Rare, +2 auf Hit/Damage ODER +2 AC
//   +3: Very Rare, +3 auf Hit/Damage ODER +3 AC
// ─────────────────────────────────────────────────────────────────────────────
//
// PHB 2024 Mastery-Property auf Waffen (siehe weaponMasteries.js):
// Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex
// ─────────────────────────────────────────────────────────────────────────────

export const MAGIC_MODIFIERS = [
  { plus: 0, label: "Standard", rar: "Common",    glow: false },
  { plus: 1, label: "+1",       rar: "Uncommon",  glow: true },
  { plus: 2, label: "+2",       rar: "Rare",      glow: true },
  { plus: 3, label: "+3",       rar: "Very Rare", glow: true },
];

/**
 * Apply magic modifier to a base item.
 * Returns a new item with:
 *  - name: "Langschwert +2"
 *  - dmg: "1d8 S +2" (Weapon) or ac: "+2 AC" (Armor)
 *  - rarity bumped
 *  - magic: true, bonuses: { hit: 2, dmg: 2 } / { ac: 2 }
 */
export function applyMagicModifier(baseItem, plus) {
  if (!plus || plus < 1) return baseItem;
  const mod = MAGIC_MODIFIERS.find(m => m.plus === plus);
  if (!mod) return baseItem;
  const isWeapon = baseItem.type === "Weapon";
  const isArmor  = baseItem.type === "Armor";
  if (!isWeapon && !isArmor) return baseItem;

  return {
    ...baseItem,
    name: `${baseItem.name} +${plus}`,
    rar: mod.rar,
    magic: true,
    bonuses: isWeapon
      ? { hit: plus, dmg: plus }
      : { ac: plus },
    dmg: isWeapon
      ? `${baseItem.dmg} (+${plus})`
      : baseItem.dmg,
    ac: isArmor
      ? `${baseItem.ac} (+${plus})`
      : baseItem.ac,
    notes: `Magische Waffe +${plus}: +${plus} auf Angriffsrolle und Schaden. Gilt als magisch.${baseItem.notes ? "\n\nBasis: " + baseItem.notes : ""}`,
  };
}

export const SRD_ITEMS = [
  // ── Simple Melee ──────────────────────────────────────────────────────────
  {id:1,  name:"Langschwert",       type:"Weapon",sub:"Martial Melee",  dmg:"1d8 S",  ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Vielseitig: 1d10 zweihändig."},
  {id:2,  name:"Kurzschwert",       type:"Weapon",sub:"Martial Melee",  dmg:"1d6 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Finesse, leicht."},
  {id:3,  name:"Dolch",             type:"Weapon",sub:"Simple Melee",   dmg:"1d4 P",  ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Finesse, leicht, wurfbar (20/60ft)."},
  {id:4,  name:"Streitaxt",         type:"Weapon",sub:"Martial Melee",  dmg:"1d8 H",  ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"Vielseitig: 1d10."},
  {id:5,  name:"Großschwert",       type:"Weapon",sub:"Martial Melee",  dmg:"2d6 S",  ac:"",eff:"",wt:"6 lb",  rar:"Common",notes:"Schwer, zweihändig."},
  {id:6,  name:"Rapier",            type:"Weapon",sub:"Martial Melee",  dmg:"1d8 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Finesse."},
  {id:7,  name:"Streitkolben",      type:"Weapon",sub:"Simple Melee",   dmg:"1d6 B",  ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"—"},
  {id:8,  name:"Hellebarde",        type:"Weapon",sub:"Martial Melee",  dmg:"1d10 H", ac:"",eff:"",wt:"6 lb",  rar:"Common",notes:"Schwer, Reach, zweihändig."},
  {id:9,  name:"Lanze",             type:"Weapon",sub:"Martial Melee",  dmg:"1d12 P", ac:"",eff:"",wt:"6 lb",  rar:"Common",notes:"Reach 10ft. Nachteil auf 5ft."},
  {id:10, name:"Langbogen",         type:"Weapon",sub:"Martial Ranged", dmg:"1d8 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"150/600ft. Schwer, zweihändig."},
  {id:11, name:"Leichte Armbrust",  type:"Weapon",sub:"Martial Ranged", dmg:"1d8 P",  ac:"",eff:"",wt:"5 lb",  rar:"Common",notes:"80/320ft. Zweihändig. Nach Schuss nachladen."},
  {id:41, name:"Keule",             type:"Weapon",sub:"Simple Melee",   dmg:"1d4 B",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Leicht."},
  {id:42, name:"Knotenstock",       type:"Weapon",sub:"Simple Melee",   dmg:"1d8 B",  ac:"",eff:"",wt:"10 lb", rar:"Common",notes:"Zweihändig."},
  {id:43, name:"Handaxt",           type:"Weapon",sub:"Simple Melee",   dmg:"1d6 H",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Leicht, wurfbar (20/60ft)."},
  {id:44, name:"Wurfspeer",         type:"Weapon",sub:"Simple Melee",   dmg:"1d6 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Wurfbar (30/120ft)."},
  {id:45, name:"Leichter Hammer",   type:"Weapon",sub:"Simple Melee",   dmg:"1d4 B",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Leicht, wurfbar (20/60ft)."},
  {id:46, name:"Sichel",            type:"Weapon",sub:"Simple Melee",   dmg:"1d4 S",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Leicht."},
  {id:47, name:"Speer",             type:"Weapon",sub:"Simple Melee",   dmg:"1d6 P",  ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Vielseitig 1d8. Wurfbar (20/60ft)."},
  {id:48, name:"Viertelstab",       type:"Weapon",sub:"Simple Melee",   dmg:"1d6 B",  ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"Vielseitig 1d8."},
  {id:49, name:"Wurfpfeil",         type:"Weapon",sub:"Simple Ranged",  dmg:"1d4 P",  ac:"",eff:"",wt:"0.25 lb",rar:"Common",notes:"Finesse, wurfbar (20/60ft)."},
  {id:50, name:"Kurzbogen",         type:"Weapon",sub:"Simple Ranged",  dmg:"1d6 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"80/320ft. Zweihändig."},
  {id:51, name:"Schleuder",         type:"Weapon",sub:"Simple Ranged",  dmg:"1d4 B",  ac:"",eff:"",wt:"—",     rar:"Common",notes:"30/120ft."},
  {id:52, name:"Kriegshammer",      type:"Weapon",sub:"Martial Melee",  dmg:"1d8 B",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Vielseitig 1d10."},
  {id:53, name:"Morgenstern",       type:"Weapon",sub:"Martial Melee",  dmg:"1d8 P",  ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"—"},
  {id:54, name:"Kriegspick",        type:"Weapon",sub:"Martial Melee",  dmg:"1d8 P",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"—"},
  {id:55, name:"Flegel",            type:"Weapon",sub:"Martial Melee",  dmg:"1d8 B",  ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"—"},
  {id:56, name:"Glefe",             type:"Weapon",sub:"Martial Melee",  dmg:"1d10 S", ac:"",eff:"",wt:"6 lb",  rar:"Common",notes:"Schwer, Reach, zweihändig."},
  {id:57, name:"Großaxt",           type:"Weapon",sub:"Martial Melee",  dmg:"1d12 H", ac:"",eff:"",wt:"7 lb",  rar:"Common",notes:"Schwer, zweihändig."},
  {id:58, name:"Scimitar",          type:"Weapon",sub:"Martial Melee",  dmg:"1d6 S",  ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Finesse, leicht."},
  {id:59, name:"Dreizack",          type:"Weapon",sub:"Martial Melee",  dmg:"1d6 P",  ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"Vielseitig 1d8. Wurfbar (20/60ft)."},
  {id:60, name:"Peitsche",          type:"Weapon",sub:"Martial Melee",  dmg:"1d4 S",  ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Finesse, Reach."},
  {id:61, name:"Pike",              type:"Weapon",sub:"Martial Melee",  dmg:"1d10 P", ac:"",eff:"",wt:"18 lb", rar:"Common",notes:"Schwer, Reach, zweihändig."},
  {id:62, name:"Schwere Armbrust",  type:"Weapon",sub:"Martial Ranged", dmg:"1d10 P", ac:"",eff:"",wt:"18 lb", rar:"Common",notes:"100/400ft. Schwer, zweihändig. Nachladen."},
  {id:63, name:"Blasrohr",          type:"Weapon",sub:"Martial Ranged", dmg:"1 P",    ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"25/100ft. Nachladen."},
  {id:64, name:"Netz",              type:"Weapon",sub:"Martial Ranged", dmg:"—",      ac:"",eff:"Gefesselt",wt:"3 lb",rar:"Common",notes:"5/15ft. STR DC 10 Entfesseln oder ATK 5 Schaden."},

  // ── Armor ─────────────────────────────────────────────────────────────────
  {id:12, name:"Kettenpanzer",      type:"Armor", sub:"Heavy Armor",    dmg:"",ac:"16",        eff:"",wt:"55 lb", rar:"Common",notes:"STR 13. Stealth-Nachteil."},
  {id:13, name:"Lederpanzer",       type:"Armor", sub:"Light Armor",    dmg:"",ac:"11+DEX",    eff:"",wt:"10 lb", rar:"Common",notes:"—"},
  {id:14, name:"Kettenhemd",        type:"Armor", sub:"Medium Armor",   dmg:"",ac:"13+DEX(max2)",eff:"",wt:"20 lb",rar:"Common",notes:"—"},
  {id:15, name:"Plattenpanzer",     type:"Armor", sub:"Heavy Armor",    dmg:"",ac:"18",        eff:"",wt:"65 lb", rar:"Common",notes:"STR 15. Stealth-Nachteil."},
  {id:16, name:"Schild",            type:"Armor", sub:"Shield",         dmg:"",ac:"+2",        eff:"",wt:"6 lb",  rar:"Common",notes:"Nicht mit zweihändigen Waffen."},
  {id:65, name:"Gepolsterter Harnisch",type:"Armor",sub:"Light Armor",  dmg:"",ac:"11+DEX",    eff:"",wt:"8 lb",  rar:"Common",notes:"Stealth-Nachteil."},
  {id:66, name:"Verstärktes Leder", type:"Armor", sub:"Light Armor",    dmg:"",ac:"12+DEX",    eff:"",wt:"13 lb", rar:"Common",notes:"—"},
  {id:67, name:"Tierhaut",          type:"Armor", sub:"Medium Armor",   dmg:"",ac:"12+DEX(max2)",eff:"",wt:"12 lb",rar:"Common",notes:"—"},
  {id:68, name:"Schuppenpanzer",    type:"Armor", sub:"Medium Armor",   dmg:"",ac:"14+DEX(max2)",eff:"",wt:"45 lb",rar:"Common",notes:"Stealth-Nachteil."},
  {id:69, name:"Brustplatte",       type:"Armor", sub:"Medium Armor",   dmg:"",ac:"14+DEX(max2)",eff:"",wt:"20 lb",rar:"Common",notes:"—"},
  {id:70, name:"Halbplatte",        type:"Armor", sub:"Medium Armor",   dmg:"",ac:"15+DEX(max2)",eff:"",wt:"40 lb",rar:"Common",notes:"Stealth-Nachteil."},
  {id:71, name:"Ringpanzer",        type:"Armor", sub:"Heavy Armor",    dmg:"",ac:"14",        eff:"",wt:"40 lb", rar:"Common",notes:"Stealth-Nachteil."},
  {id:72, name:"Schienenpanzer",    type:"Armor", sub:"Heavy Armor",    dmg:"",ac:"17",        eff:"",wt:"60 lb", rar:"Common",notes:"STR 15. Stealth-Nachteil."},

  // ── Adventuring Gear ──────────────────────────────────────────────────────
  {id:20, name:"Seil (50ft)",       type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"10 lb", rar:"Common",notes:"Bis 300 Pfund. DC 17 STR zerreißen."},
  {id:21, name:"Enterhaken",        type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"4 lb",  rar:"Common",notes:"Mit Seil klettern. Wurfweite 60ft."},
  {id:22, name:"Fackeln (10)",      type:"Item",  sub:"Gear",           dmg:"1 B",ac:"",eff:"",wt:"10 lb",rar:"Common",notes:"20ft hell + 20ft dämmrig. Brennt 1h."},
  {id:23, name:"Feldration (1 Tag)",type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"—"},
  {id:24, name:"Arkaner Fokus",     type:"Item",  sub:"Focus",          dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Ersetzt materielle Komponenten ohne GP-Wert."},
  {id:38, name:"Alchemisten-Feuer", type:"Item",  sub:"Gear",           dmg:"1d4/Rd",ac:"",eff:"",wt:"1 lb",rar:"Common",notes:"Wurfwaffe (20ft). Brennt 1d4 Feu/Rd. Löschen: Aktion DC10."},
  {id:39, name:"Heilkräuter",       type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"+1 HD",wt:"0.5 lb",rar:"Common",notes:"Hit Dice bei kurzer Rast +1 Ergebnis."},
  {id:73, name:"Rucksack",          type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"5 lb",  rar:"Common",notes:"30 lb Kapazität (ohne Magie)."},
  {id:74, name:"Brecheisen",        type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"5 lb",  rar:"Common",notes:"+2 Bonus auf STR-Checks zum Aufbrechen."},
  {id:75, name:"Kapuzenlaterne",    type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"30ft hell + 30ft dämmrig. 6h pro Öl-Flask."},
  {id:76, name:"Öl (Flask)",        type:"Item",  sub:"Gear",           dmg:"2d6 F",ac:"",eff:"",wt:"1 lb",rar:"Common",notes:"Laternenbrennstoff (6h). Wurfwaffe: bei Feuer 2d6 Feuer."},
  {id:77, name:"Heilertasche",      type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"Stabilisieren",wt:"3 lb",rar:"Common",notes:"10 Anwendungen. Stabilisieren DC 10, kein Würfelwurf nötig."},
  {id:78, name:"Kletterausrüstung", type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"12 lb", rar:"Common",notes:"Spike, Handschuhe, Stiefel. Haken für sicheres Klettern."},
  {id:79, name:"Zelt (2 Personen)", type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"20 lb", rar:"Common",notes:"Schutz vor normalen Umweltbedingungen."},
  {id:80, name:"Feuerstein & Stahl",type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Feuer entfachen in 1 Minute (kein Würfelwurf)."},
  {id:81, name:"Fernrohr",          type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"2× Vergrößerung auf bis zu 1 Meile."},
  {id:82, name:"Stahlspiegel",      type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"0.5 lb",rar:"Common",notes:"Ecken & Medusas-Schutz. Stealth DC +0."},
  {id:83, name:"Handschellen",      type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"6 lb",  rar:"Common",notes:"DC 20 STR oder Dex+Diebeswerkzeug zum Entkommen."},
  {id:84, name:"Schreibzeug-Set",   type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"5 lb",  rar:"Common",notes:"Tinte, Feder, 10 Blatt Pergament."},
  {id:85, name:"Kette (10ft)",      type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"10 lb", rar:"Common",notes:"Zugfestigkeit: kann bis 900 Pfund halten."},
  {id:86, name:"Wasser-/Weinflasche",type:"Item", sub:"Gear",           dmg:"",ac:"",eff:"",wt:"5 lb (voll)",rar:"Common",notes:"4 Tage Wasser (1 Gallone)."},
  {id:87, name:"Tinderbox",         type:"Item",  sub:"Gear",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Feuer als Bonusaktion (wenn bereits Zunder bereit)."},

  // ── Potions ───────────────────────────────────────────────────────────────
  {id:17, name:"Heiltrank",         type:"Item",  sub:"Potion",         dmg:"",ac:"",eff:"2d4+2 HP",wt:"0.5 lb",rar:"Common",  notes:"Bonus-Aktion (selbst) oder Aktion (anderer)."},
  {id:18, name:"Großer Heiltrank",  type:"Item",  sub:"Potion",         dmg:"",ac:"",eff:"4d4+4 HP",wt:"0.5 lb",rar:"Uncommon",notes:"—"},
  {id:19, name:"Überlegener Heiltrank",type:"Item",sub:"Potion",        dmg:"",ac:"",eff:"8d4+8 HP",wt:"0.5 lb",rar:"Rare",    notes:"—"},
  {id:88, name:"Trank der Feuerresistenz",type:"Item",sub:"Potion",     dmg:"",ac:"",eff:"Feuer-Resist 1h",wt:"0.5 lb",rar:"Uncommon",notes:"Resistenz gegen Feuerschaden für 1 Stunde."},
  {id:89, name:"Fliegentrunk",      type:"Item",  sub:"Potion",         dmg:"",ac:"",eff:"Fliegen 60ft 1h",wt:"0.5 lb",rar:"Uncommon",notes:"Fluggeschwindigkeit 60ft für 1 Stunde. Konzentration."},
  {id:90, name:"Trank der Unsichtbarkeit",type:"Item",sub:"Potion",     dmg:"",ac:"",eff:"Unsichtbar 1h",wt:"0.5 lb",rar:"Very Rare",notes:"Unsichtbar für 1h. Endet bei Angriff/Zauber."},
  {id:91, name:"Riesentrunk",       type:"Item",  sub:"Potion",         dmg:"",ac:"",eff:"STR 29 (24h)",wt:"0.5 lb",rar:"Legendary",notes:"STR wird 29 für 24 Stunden."},
  {id:92, name:"Wahrsagertrank",    type:"Item",  sub:"Potion",         dmg:"",ac:"",eff:"True Seeing 1h",wt:"0.5 lb",rar:"Rare",notes:"True Seeing: Illusionen durchschauen, Unsichtbare sehen."},
  {id:93, name:"Gift (Basis)",      type:"Item",  sub:"Potion",         dmg:"1d4 P + Saved",ac:"",eff:"",wt:"—",rar:"Common",notes:"1 Anwendung. Auf Klinge oder in Nahrung. CON DC 10 oder 1d4 Gift."},

  // ── Scrolls ───────────────────────────────────────────────────────────────
  {id:40, name:"Zauberschriftrolle (1. Grad)",type:"Item",sub:"Scroll", dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Common",   notes:"Einmal verwendbar. Zauberkundige können lesen."},
  {id:94, name:"Zauberschriftrolle (2. Grad)",type:"Item",sub:"Scroll", dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Common",   notes:"Einmal verwendbar. DC 12 wenn keine Klassenliste."},
  {id:95, name:"Zauberschriftrolle (3. Grad)",type:"Item",sub:"Scroll", dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Uncommon", notes:"Einmal verwendbar. DC 13."},
  {id:96, name:"Zauberschriftrolle (4. Grad)",type:"Item",sub:"Scroll", dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Rare",     notes:"Einmal verwendbar. DC 14."},
  {id:97, name:"Zauberschriftrolle (5. Grad)",type:"Item",sub:"Scroll", dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Rare",     notes:"Einmal verwendbar. DC 15."},

  // ── Tools ─────────────────────────────────────────────────────────────────
  {id:98, name:"Diebeswerkzeug",    type:"Item",  sub:"Tool",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Schlösser knacken & Fallen entschärfen. Proficiency benötigt."},
  {id:99, name:"Verkleidungsset",   type:"Item",  sub:"Tool",           dmg:"",ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Kostüme, Schminke, Perücken. Für Verkleidungs-Checks."},
  {id:100,name:"Vergiftungsset",    type:"Item",  sub:"Tool",           dmg:"",ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Gifte herstellen und anwenden. Proficiency benötigt."},
  {id:101,name:"Schmiedewerkzeug",  type:"Item",  sub:"Tool",           dmg:"",ac:"",eff:"",wt:"8 lb",  rar:"Common",notes:"Metallgegenstände herstellen und reparieren."},
  {id:102,name:"Kräuterkundeset",   type:"Item",  sub:"Tool",           dmg:"",ac:"",eff:"",wt:"3 lb",  rar:"Common",notes:"Heilkräuter identifizieren, Tränke und Pasten herstellen."},
  {id:103,name:"Navigationswerkzeug",type:"Item", sub:"Tool",           dmg:"",ac:"",eff:"",wt:"2 lb",  rar:"Common",notes:"Seekarten, Kompass, Sextant. Navigation auf See & Land."},

  // ── Ammunition ────────────────────────────────────────────────────────────
  {id:104,name:"Pfeile (20)",       type:"Item",  sub:"Ammo",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Für Kurz- und Langbogen."},
  {id:105,name:"Armbrustbolzen (20)",type:"Item", sub:"Ammo",           dmg:"",ac:"",eff:"",wt:"1.5 lb",rar:"Common",notes:"Für Leichte und Schwere Armbrust."},
  {id:106,name:"Blasrohr-Nadeln (50)",type:"Item",sub:"Ammo",           dmg:"",ac:"",eff:"",wt:"1 lb",  rar:"Common",notes:"Für Blasrohr."},

  // ── Magic Items ───────────────────────────────────────────────────────────
  // Generische +X-Waffen/Rüstungen entfernt — werden jetzt direkt via
  // Magic-Modifier-Picker (+0/+1/+2/+3) auf Basis-Item erstellt.
  // IDs 25-28 sind reserviert für Backward-Compat (alte Inventare).
  {id:29, name:"Amulett der Gesundheit",type:"Item",sub:"Magic",magic:true,attunement:true,  bonuses:{setCon:19},          dmg:"",ac:"",eff:"CON=19",wt:"—",rar:"Rare",    notes:"Req. Attunement. CON wird 19."},
  {id:30, name:"Ring der Unsichtbarkeit",type:"Item",sub:"Magic",magic:true,attunement:true, bonuses:{},                   dmg:"",ac:"",eff:"Unsichtbar",wt:"—",rar:"Legendary",notes:"Req. Attunement. Unsichtbar bis Angriff/Zauber."},
  {id:31, name:"Stiefel des Elfenschritts",type:"Item",sub:"Magic",magic:true,attunement:true,bonuses:{},                  dmg:"",ac:"",eff:"Kein Stealth-Nachteil",wt:"—",rar:"Uncommon",notes:"Req. Attunement. Bewegungsgeräusche unterdrückt."},
  {id:32, name:"Umhang des Schutzes",type:"Item", sub:"Magic", magic:true, attunement:true,  bonuses:{ac:1,saves:1},       dmg:"",ac:"+1",eff:"+1 Saves",wt:"—",rar:"Uncommon",notes:"Req. Attunement. +1 AC und alle Rettungswürfe."},
  {id:33, name:"Handschuhe der Stärke",type:"Item",sub:"Magic",magic:true, attunement:true,  bonuses:{setStr:19},          dmg:"",ac:"",eff:"STR=19",wt:"—",rar:"Rare",    notes:"Req. Attunement. STR wird 19."},
  {id:34, name:"Mithral-Rüstung",   type:"Armor", sub:"Magic", magic:true, attunement:false, bonuses:{},                   dmg:"",ac:"Normal",eff:"",wt:"—",rar:"Uncommon",notes:"Kein STR-Req. Kein Stealth-Nachteil."},
  {id:35, name:"Vorpal-Schwert",    type:"Weapon",sub:"Magic", magic:true, attunement:true,  bonuses:{hit:3,dmg:3},        dmg:"+3",ac:"",eff:"Nat20=Enthauptung",wt:"—",rar:"Legendary",notes:"Req. Attunement. Nat20 ohne Kopf-Immunität: Enthauptung."},
  {id:36, name:"Froststahl",        type:"Weapon",sub:"Magic", magic:true, attunement:true,  bonuses:{hit:1,extraDmg:"1d6 Kälte"},dmg:"+1d6 K",ac:"",eff:"Feuer-Resist",wt:"3 lb",rar:"Very Rare",notes:"Req. Attunement. +1d6 Kälteschaden. Feuerresistenz."},
  {id:37, name:"Tarnumhang",        type:"Item",  sub:"Magic", magic:true, attunement:false, bonuses:{},                   dmg:"",ac:"",eff:"+10 Stealth",wt:"—",rar:"Uncommon",notes:"+10 auf Stealth. Aktion: vollständig unsichtbar."},
  {id:107,name:"Beutel der Überkapazität",type:"Item",sub:"Magic",magic:true,attunement:false,bonuses:{},                  dmg:"",ac:"",eff:"64 cbft Raum",wt:"15 lb",rar:"Uncommon",notes:"Extradimensionaler Raum: 64 Kubikfuß / 500 Pfund."},
  {id:108,name:"Schutzring",        type:"Item",  sub:"Magic", magic:true, attunement:true,  bonuses:{ac:1,saves:1},       dmg:"",ac:"+1",eff:"+1 Saves",wt:"—",rar:"Uncommon",notes:"Req. Attunement. +1 AC und Rettungswürfe."},
  {id:109,name:"Stirnband des Intellekts",type:"Item",sub:"Magic",magic:true,attunement:true,bonuses:{setInt:19},          dmg:"",ac:"",eff:"INT=19",wt:"—",rar:"Uncommon",notes:"Req. Attunement. INT wird 19."},
  {id:110,name:"Schuhe der Schnelligkeit",type:"Item",sub:"Magic",magic:true,attunement:true,bonuses:{speedMult:2},        dmg:"",ac:"",eff:"Speed ×2",wt:"—",rar:"Very Rare",notes:"Req. Attunement. Bewegungsrate verdoppelt. Dash Bonus-Aktion."},
  {id:111,name:"Halsband der Feuerbälle",type:"Item",sub:"Magic",magic:true, attunement:false,bonuses:{},                  dmg:"",ac:"",eff:"Feuerbälle",wt:"1 lb",rar:"Rare",notes:"1–7 Perlen. Jede: Feuerball DC 15, 10d6 Schaden."},
  {id:112,name:"Perle der Macht",   type:"Item",  sub:"Magic", magic:true, attunement:true,  bonuses:{},                   dmg:"",ac:"",eff:"Slot zurück",wt:"—",rar:"Uncommon",notes:"Req. Attunement (Zauberer). Slot 3. Grades oder niedriger zurück."},
  {id:113,name:"Flammenzunge",      type:"Weapon",sub:"Magic", magic:true, attunement:true,  bonuses:{extraDmg:"2d6 Feuer"},dmg:"+2d6 F",ac:"",eff:"Licht 40ft",wt:"3 lb",rar:"Rare",notes:"Req. Attunement. Befehlswort: Klinge entzündet sich. 2d6 Feuer."},
  {id:114,name:"Handschuhe der Ogrenkraft",type:"Item",sub:"Magic",magic:true,attunement:true,bonuses:{setStr:19},         dmg:"",ac:"",eff:"STR=19",wt:"—",rar:"Uncommon",notes:"Req. Attunement. STR wird 19 (wenn nicht höher)."},
  {id:115,name:"Mantel der Verschiebung",type:"Item",sub:"Magic",magic:true, attunement:true, bonuses:{},                  dmg:"",ac:"",eff:"Nachteil auf Angriffe",wt:"—",rar:"Rare",notes:"Req. Attunement. Angriffe auf dich haben Nachteil (bis getroffen)."},

  // ── DMG 2024 Named Magic Items ────────────────────────────────────────────
  {id:120,name:"Berserker-Axt",     type:"Weapon",sub:"Magic", magic:true, attunement:true,  bonuses:{hit:1,dmg:1},        dmg:"+1 H",ac:"",eff:"Max HP +Lv",wt:"4 lb",rar:"Rare",notes:"Req. Attunement. Verflucht. +1 Streitaxt. Erhöht maxHP um deinen Level beim Attunen. Beim Schaden: Frenzy-CON-Save oder muss zum nächsten Wesen angreifen."},
  {id:121,name:"Wakizashi der Schärfe",type:"Weapon",sub:"Magic", magic:true, attunement:true, bonuses:{hit:2,dmg:2},      dmg:"+2 P",ac:"",eff:"Krit 18-20",wt:"2 lb",rar:"Very Rare",notes:"Req. Attunement. +2 auf Hit/Dmg. NEU 2024: Krit auch auf Nat 18 und 19."},
  {id:122,name:"Bogen der Tiefen Hölle",type:"Weapon",sub:"Magic", magic:true, attunement:true, bonuses:{hit:1,dmg:1},     dmg:"+1 P",ac:"",eff:"Sehnenlos",wt:"2 lb",rar:"Very Rare",notes:"Req. Attunement (Hexenmeister/Ranger). +1 Langbogen. Keine Munition nötig. Pfeile aus Schatten."},
  {id:123,name:"Stiefel der Geschwindigkeit",type:"Item",sub:"Magic",magic:true,attunement:true,bonuses:{speedMult:2},     dmg:"",ac:"",eff:"Speed ×2 + Dash BA",wt:"1 lb",rar:"Rare",notes:"Req. Attunement. Bonus Action: 10 Min lang Speed ×2 + Disengage als Bonus. Bricht bei Schaden. 1×/LR."},
  {id:124,name:"Glas-Trinkhorn",    type:"Item",  sub:"Magic", magic:true, attunement:false, bonuses:{},                   dmg:"",ac:"",eff:"Stat ↑ 19",wt:"1 lb",rar:"Uncommon to Legendary",notes:"DMG 2024: Cloud Giant Strength → STR 27 (Legendary). Frost Giant → STR 23 (Very Rare). Fire/Stone → STR 25 (Rare). Hill → STR 21 (Uncommon)."},
  {id:125,name:"Sphäre der Anihilation",type:"Item",sub:"Magic",magic:true, attunement:false, bonuses:{},                  dmg:"4d10 F",ac:"",eff:"Schwarzes Loch",wt:"—",rar:"Legendary",notes:"3ft schwarze Sphäre. Bewegt sich INT-Check kontrolliert (DC 25). Berührung: 4d10 Force-Schaden + Tod bei 0 HP."},
  {id:126,name:"Wand der Magic Missiles",type:"Item",sub:"Magic",magic:true, attunement:false, bonuses:{},                 dmg:"3 Slots",ac:"",eff:"Magic Missile",wt:"1 lb",rar:"Uncommon",notes:"7 Charges. Lv1: 1 Charge. Lv2: 2. Lv3: 3. Bei 0 Charges: 1d20 → Nat1 = Wand zerstört. Erholt 1d6+1/Dawn."},
  {id:127,name:"Stab der Striking",  type:"Weapon",sub:"Magic", magic:true, attunement:true,  bonuses:{hit:3,dmg:3,extraDmg:"3d6"},dmg:"+3 + 3d6 F",ac:"",eff:"Force-Strike",wt:"4 lb",rar:"Very Rare",notes:"Req. Attunement. +3 Stab. Bei Strike-Power-Use: +3d6 Force-Schaden, kostet 1 Charge (10 Charges, 1d6+4 recovers/Dawn)."},
  {id:128,name:"Bag of Holding",    type:"Item",  sub:"Magic", magic:true, attunement:false, bonuses:{},                   dmg:"",ac:"",eff:"500 lb / 64 ft³",wt:"15 lb",rar:"Uncommon",notes:"500 Pfund / 64 Kubikfuß Stauraum. Beim Reinpacken anderer extradimensionaler Items (Bag of Holding in Bag): Loch zu Astral Plane!"},
];

// ─────────────────────────────────────────────────────────────────────────────
// English display names, keyed by the canonical German name in SRD_ITEMS.
// Inventory items are stored with their German name (that's what the wizard
// resolves against and what CharInventory persists), so the render layer
// needs a lookup table to show "Longsword" instead of "Langschwert" when
// lang="en". i18n/itemLabel(name) reads from this map. Any entry not present
// falls back to the raw German name — no name goes missing, just less
// perfectly translated.
//
// Bundle counts stay as-is: "Pfeile (20)" → "Arrows (20)" (parens intact).
// ─────────────────────────────────────────────────────────────────────────────
export const ITEM_EN_NAMES = {
  // Weapons — melee
  "Langschwert":         "Longsword",
  "Kurzschwert":         "Shortsword",
  "Dolch":               "Dagger",
  "Streitaxt":           "Battleaxe",
  "Großschwert":         "Greatsword",
  "Rapier":              "Rapier",
  "Streitkolben":        "Mace",
  "Hellebarde":          "Halberd",
  "Lanze":               "Lance",
  "Keule":               "Club",
  "Knotenstock":         "Greatclub",
  "Handaxt":             "Handaxe",
  "Wurfspeer":           "Javelin",
  "Leichter Hammer":     "Light Hammer",
  "Sichel":              "Sickle",
  "Speer":               "Spear",
  "Viertelstab":         "Quarterstaff",
  "Kriegshammer":        "Warhammer",
  "Morgenstern":         "Morningstar",
  "Kriegspick":          "War Pick",
  "Flegel":              "Flail",
  "Glefe":               "Glaive",
  "Großaxt":             "Greataxe",
  "Scimitar":            "Scimitar",
  "Dreizack":            "Trident",
  "Peitsche":            "Whip",
  "Pike":                "Pike",
  // Weapons — ranged
  "Langbogen":           "Longbow",
  "Kurzbogen":           "Shortbow",
  "Leichte Armbrust":    "Light Crossbow",
  "Schwere Armbrust":    "Heavy Crossbow",
  "Blasrohr":            "Blowgun",
  "Schleuder":           "Sling",
  "Wurfpfeil":           "Dart",
  "Netz":                "Net",
  // Ammunition (bundle items — count stays in parens)
  "Pfeile (20)":         "Arrows (20)",
  "Armbrustbolzen (20)": "Crossbow Bolts (20)",
  "Blasrohr-Nadeln (50)":"Blowgun Needles (50)",
  // Armor
  "Kettenpanzer":        "Chain Mail",
  "Lederpanzer":         "Leather Armor",
  "Kettenhemd":          "Chain Shirt",
  "Plattenpanzer":       "Plate Armor",
  "Schild":              "Shield",
  "Gepolsterter Harnisch":"Padded Armor",
  "Verstärktes Leder":   "Studded Leather",
  "Tierhaut":            "Hide Armor",
  "Schuppenpanzer":      "Scale Mail",
  "Brustplatte":         "Breastplate",
  "Halbplatte":          "Half Plate",
  "Ringpanzer":          "Ring Mail",
  "Schienenpanzer":      "Splint Armor",
  // Gear
  "Seil (50ft)":         "Rope (50ft)",
  "Enterhaken":          "Grappling Hook",
  "Fackeln (10)":        "Torches (10)",
  "Feldration (1 Tag)":  "Rations (1 Day)",
  "Arkaner Fokus":       "Arcane Focus",
  "Alchemisten-Feuer":   "Alchemist's Fire",
  "Heilkräuter":         "Healer's Herbs",
  "Rucksack":            "Backpack",
  "Brecheisen":          "Crowbar",
  "Kapuzenlaterne":      "Hooded Lantern",
  "Öl (Flask)":          "Oil (Flask)",
  "Heilertasche":        "Healer's Kit",
  "Kletterausrüstung":   "Climber's Kit",
  "Zelt (2 Personen)":   "Tent (2-person)",
  "Feuerstein & Stahl":  "Flint & Steel",
  "Fernrohr":            "Spyglass",
  "Stahlspiegel":        "Steel Mirror",
  "Handschellen":        "Manacles",
  "Schreibzeug-Set":     "Writing Kit",
  "Kette (10ft)":        "Chain (10ft)",
  "Wasser-/Weinflasche": "Waterskin",
  "Tinderbox":           "Tinderbox",
  // Potions
  "Heiltrank":                 "Healing Potion",
  "Großer Heiltrank":          "Greater Healing Potion",
  "Überlegener Heiltrank":     "Superior Healing Potion",
  "Trank der Feuerresistenz":  "Potion of Fire Resistance",
  "Fliegentrunk":              "Potion of Flying",
  "Trank der Unsichtbarkeit":  "Potion of Invisibility",
  "Riesentrunk":               "Potion of Giant Strength",
  "Wahrsagertrank":            "Potion of Clairvoyance",
  "Gift (Basis)":              "Basic Poison",
  // Scrolls
  "Zauberschriftrolle (1. Grad)": "Spell Scroll (1st Level)",
  "Zauberschriftrolle (2. Grad)": "Spell Scroll (2nd Level)",
  "Zauberschriftrolle (3. Grad)": "Spell Scroll (3rd Level)",
  "Zauberschriftrolle (4. Grad)": "Spell Scroll (4th Level)",
  "Zauberschriftrolle (5. Grad)": "Spell Scroll (5th Level)",
  // Tools
  "Diebeswerkzeug":     "Thieves' Tools",
  "Verkleidungsset":    "Disguise Kit",
  "Vergiftungsset":     "Poisoner's Kit",
  "Schmiedewerkzeug":   "Smith's Tools",
  "Kräuterkundeset":    "Herbalism Kit",
  "Navigationswerkzeug":"Navigator's Tools",
  // Magic items
  "Amulett der Gesundheit":     "Amulet of Health",
  "Ring der Unsichtbarkeit":    "Ring of Invisibility",
  "Stiefel des Elfenschritts":  "Boots of Elvenkind",
  "Umhang des Schutzes":        "Cloak of Protection",
  "Handschuhe der Stärke":      "Gauntlets of Ogre Power",
  "Mithral-Rüstung":            "Mithral Armor",
  "Vorpal-Schwert":             "Vorpal Sword",
  "Froststahl":                 "Frost Brand",
  "Tarnumhang":                 "Cloak of Elvenkind",
  "Beutel der Überkapazität":   "Bag of Holding",
  "Schutzring":                 "Ring of Protection",
  "Stirnband des Intellekts":   "Headband of Intellect",
  "Schuhe der Schnelligkeit":   "Boots of Speed",
  "Halsband der Feuerbälle":    "Necklace of Fireballs",
  "Perle der Macht":            "Pearl of Power",
  "Flammenzunge":               "Flame Tongue",
  "Handschuhe der Ogrenkraft":  "Gauntlets of Ogre Power",
  "Mantel der Verschiebung":    "Cloak of Displacement",
  "Berserker-Axt":              "Berserker Axe",
  "Wakizashi der Schärfe":      "Sword of Sharpness",
  "Bogen der Tiefen Hölle":     "Oathbow of Shadows",
  "Stiefel der Geschwindigkeit":"Boots of Speed",
  "Glas-Trinkhorn":             "Drinking Horn of Giant Strength",
  "Sphäre der Anihilation":     "Sphere of Annihilation",
  "Wand der Magic Missiles":    "Wand of Magic Missiles",
  "Stab der Striking":          "Staff of Striking",
  "Bag of Holding":             "Bag of Holding",
};

// ─────────────────────────────────────────────────────────────────────────────
// English translation of `notes` and `eff` fields. Same key-scheme as
// ITEM_EN_NAMES: German canonical name → English string. Only entries that
// actually need translating are listed — anything absent falls through
// to the raw German value, which is still readable if unusual. Both maps
// are consumed by i18n/itemNotes(item) and i18n/itemEff(item).
// ─────────────────────────────────────────────────────────────────────────────
export const ITEM_EN_NOTES = {
  // Weapons — melee
  "Langschwert":       "Versatile: 1d10 two-handed.",
  "Kurzschwert":       "Finesse, light.",
  "Dolch":             "Finesse, light, thrown (20/60ft).",
  "Streitaxt":         "Versatile: 1d10.",
  "Großschwert":       "Heavy, two-handed.",
  "Rapier":            "Finesse.",
  "Hellebarde":        "Heavy, Reach, two-handed.",
  "Lanze":             "Reach 10ft. Disadvantage within 5ft.",
  "Keule":             "Light.",
  "Knotenstock":       "Two-handed.",
  "Handaxt":           "Light, thrown (20/60ft).",
  "Wurfspeer":         "Thrown (30/120ft).",
  "Leichter Hammer":   "Light, thrown (20/60ft).",
  "Sichel":            "Light.",
  "Speer":             "Versatile 1d8. Thrown (20/60ft).",
  "Viertelstab":       "Versatile 1d8.",
  "Wurfpfeil":         "Finesse, thrown (20/60ft).",
  "Schleuder":         "30/120ft.",
  "Kriegshammer":      "Versatile 1d10.",
  "Glefe":             "Heavy, Reach, two-handed.",
  "Großaxt":           "Heavy, two-handed.",
  "Scimitar":          "Finesse, light.",
  "Dreizack":          "Versatile 1d8. Thrown (20/60ft).",
  "Peitsche":          "Finesse, Reach.",
  "Pike":              "Heavy, Reach, two-handed.",
  // Weapons — ranged
  "Langbogen":         "150/600ft. Heavy, two-handed.",
  "Leichte Armbrust":  "80/320ft. Two-handed. Reload after each shot.",
  "Kurzbogen":         "80/320ft. Two-handed.",
  "Schwere Armbrust":  "100/400ft. Heavy, two-handed. Loading.",
  "Blasrohr":          "25/100ft. Loading.",
  "Netz":              "5/15ft. STR DC 10 to escape or attack 5 damage.",
  // Armor
  "Kettenpanzer":         "STR 13. Stealth disadvantage.",
  "Plattenpanzer":        "STR 15. Stealth disadvantage.",
  "Schild":               "Not usable with two-handed weapons.",
  "Gepolsterter Harnisch":"Stealth disadvantage.",
  "Schuppenpanzer":       "Stealth disadvantage.",
  "Halbplatte":           "Stealth disadvantage.",
  "Ringpanzer":           "Stealth disadvantage.",
  "Schienenpanzer":       "STR 15. Stealth disadvantage.",
  // Gear
  "Seil (50ft)":       "Up to 300 pounds. DC 17 STR to burst.",
  "Enterhaken":        "Climb with rope. Throw range 60ft.",
  "Fackeln (10)":      "20ft bright + 20ft dim. Burns 1h.",
  "Arkaner Fokus":     "Replaces material components with no gp cost.",
  "Alchemisten-Feuer": "Thrown weapon (20ft). Burns 1d4 fire/rd. Extinguish: action DC 10.",
  "Heilkräuter":       "Short rest: +1 to a Hit Die result.",
  "Rucksack":          "30 lb capacity (non-magical).",
  "Brecheisen":        "+2 bonus on STR checks to force open.",
  "Kapuzenlaterne":    "30ft bright + 30ft dim. 6h per oil flask.",
  "Öl (Flask)":        "Lantern fuel (6h). Thrown at fire: 2d6 fire.",
  "Heilertasche":      "10 uses. Stabilize DC 10, no roll needed.",
  "Kletterausrüstung": "Spikes, gloves, boots. Hooks for safe climbing.",
  "Zelt (2 Personen)": "Shelter from ordinary weather.",
  "Feuerstein & Stahl":"Light a fire in 1 minute (no roll).",
  "Fernrohr":          "2× magnification up to 1 mile.",
  "Stahlspiegel":      "See around corners & Medusa protection. Stealth DC +0.",
  "Handschellen":      "DC 20 STR or DEX + thieves' tools to escape.",
  "Schreibzeug-Set":   "Ink, quill, 10 sheets of parchment.",
  "Kette (10ft)":      "Tensile strength: holds up to 900 pounds.",
  "Wasser-/Weinflasche":"4 days of water (1 gallon).",
  "Tinderbox":         "Light a fire as a bonus action (with tinder ready).",
  // Potions
  "Heiltrank":                "Bonus action (self) or action (other).",
  "Trank der Feuerresistenz": "Resistance to fire damage for 1 hour.",
  "Fliegentrunk":             "Fly speed 60ft for 1 hour. Concentration.",
  "Trank der Unsichtbarkeit": "Invisible for 1h. Ends on attack/spell.",
  "Riesentrunk":              "STR becomes 29 for 24 hours.",
  "Wahrsagertrank":           "True Seeing: see through illusions, see invisible.",
  "Gift (Basis)":             "1 use. On blade or in food. CON DC 10 or 1d4 poison.",
  // Scrolls
  "Zauberschriftrolle (1. Grad)": "Single use. Spellcasters can read.",
  "Zauberschriftrolle (2. Grad)": "Single use. DC 12 if not on class list.",
  "Zauberschriftrolle (3. Grad)": "Single use. DC 13.",
  "Zauberschriftrolle (4. Grad)": "Single use. DC 14.",
  "Zauberschriftrolle (5. Grad)": "Single use. DC 15.",
  // Tools
  "Diebeswerkzeug":     "Pick locks & disarm traps. Proficiency required.",
  "Verkleidungsset":    "Costumes, makeup, wigs. For disguise checks.",
  "Vergiftungsset":     "Craft and apply poisons. Proficiency required.",
  "Schmiedewerkzeug":   "Craft and repair metal items.",
  "Kräuterkundeset":    "Identify herbs, craft potions and pastes.",
  "Navigationswerkzeug":"Sea charts, compass, sextant. Navigation at sea and on land.",
  // Ammunition
  "Pfeile (20)":          "For shortbow and longbow.",
  "Armbrustbolzen (20)":  "For light and heavy crossbow.",
  "Blasrohr-Nadeln (50)": "For blowgun.",
  // Magic items
  "Amulett der Gesundheit":     "Requires Attunement. CON becomes 19.",
  "Ring der Unsichtbarkeit":    "Requires Attunement. Invisible until you attack or cast a spell.",
  "Stiefel des Elfenschritts":  "Requires Attunement. Movement sounds suppressed.",
  "Umhang des Schutzes":        "Requires Attunement. +1 AC and all saving throws.",
  "Handschuhe der Stärke":      "Requires Attunement. STR becomes 19.",
  "Mithral-Rüstung":            "No STR requirement. No stealth disadvantage.",
  "Vorpal-Schwert":             "Requires Attunement. Nat 20 vs. a creature that has a head: decapitation.",
  "Froststahl":                 "Requires Attunement. +1d6 cold damage. Fire resistance.",
  "Tarnumhang":                 "+10 to Stealth. Action: become fully invisible.",
  "Beutel der Überkapazität":   "Extradimensional space: 64 cubic feet / 500 pounds.",
  "Schutzring":                 "Requires Attunement. +1 AC and saving throws.",
  "Stirnband des Intellekts":   "Requires Attunement. INT becomes 19.",
  "Schuhe der Schnelligkeit":   "Requires Attunement. Speed doubled. Dash as a bonus action.",
  "Halsband der Feuerbälle":    "1–7 beads. Each: Fireball DC 15, 10d6 damage.",
  "Perle der Macht":            "Requires Attunement (caster). Recover a spell slot of 3rd level or lower.",
  "Flammenzunge":               "Requires Attunement. Command word: blade ignites. 2d6 fire.",
  "Handschuhe der Ogrenkraft":  "Requires Attunement. STR becomes 19 (if not already higher).",
  "Mantel der Verschiebung":    "Requires Attunement. Attacks against you have disadvantage (until you take damage).",
  // Named DMG 2024
  "Berserker-Axt":       "Requires Attunement. Cursed. +1 battleaxe. Attuning grants max HP equal to your level. On taking damage: CON save or Frenzy — must attack the nearest creature.",
  "Wakizashi der Schärfe":"Requires Attunement. +2 to hit and damage. 2024 update: crits also on Nat 18 and 19.",
  "Bogen der Tiefen Hölle":"Requires Attunement (Warlock/Ranger). +1 longbow. No ammunition required. Fires arrows made of shadow.",
  "Stiefel der Geschwindigkeit":"Requires Attunement. Bonus Action: for 10 min Speed ×2 + Disengage as a bonus action. Ends on taking damage. 1×/long rest.",
  "Glas-Trinkhorn":       "DMG 2024: Cloud Giant Strength → STR 27 (Legendary). Frost Giant → STR 23 (Very Rare). Fire/Stone → STR 25 (Rare). Hill → STR 21 (Uncommon).",
  "Sphäre der Anihilation":"3ft black sphere. Moved via INT check (DC 25). Touch: 4d10 force damage + death at 0 HP.",
  "Wand der Magic Missiles":"7 charges. Lv1: 1 charge. Lv2: 2. Lv3: 3. At 0 charges: 1d20 → Nat 1 = wand destroyed. Regains 1d6+1/dawn.",
  "Stab der Striking":    "Requires Attunement. +3 quarterstaff. On Strike power use: +3d6 force damage, costs 1 charge (10 charges, 1d6+4 regained/dawn).",
  "Bag of Holding":       "500 pounds / 64 cubic feet of storage. Placing another extradimensional item inside (bag of holding in a bag): rift to the Astral Plane!",
};

export const ITEM_EN_EFF = {
  "Ring der Unsichtbarkeit":     "Invisible",
  "Stiefel des Elfenschritts":   "No stealth disadvantage",
  "Vorpal-Schwert":              "Nat 20 = decapitation",
  "Froststahl":                  "Fire resistance",
  "Trank der Feuerresistenz":    "Fire resistance 1h",
  "Fliegentrunk":                "Fly 60ft 1h",
  "Trank der Unsichtbarkeit":    "Invisible 1h",
  "Beutel der Überkapazität":    "64 cbft space",
  "Halsband der Feuerbälle":     "Fireballs",
  "Perle der Macht":             "Spell slot regained",
  "Flammenzunge":                "Light 40ft",
  "Mantel der Verschiebung":     "Disadvantage on attacks",
  "Wakizashi der Schärfe":       "Crit 18-20",
  "Bogen der Tiefen Hölle":      "No ammo needed",
  "Sphäre der Anihilation":      "Black hole",
  "Heilertasche":                "Stabilize",
};
