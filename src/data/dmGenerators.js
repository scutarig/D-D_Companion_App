// ─── DM-Tools random generators ─────────────────────────────────────────────
// Shared tables + roll helpers used by NPC-Generator (in NpcList), Weather
// panel (in WorldbuildingPage), Loot roll (EncounterBuilder) and the
// Session-Log template (Notes). Kept in one file so DMs and players share
// vocabulary. All strings are German-first since the app defaults to DE;
// callers can translate labels via useI18n if needed.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rollD = (n) => Math.floor(Math.random() * n) + 1;

// ── NPC-Gen ────────────────────────────────────────────────────────────────
const FIRST_NAMES_M = ["Alric","Baldrik","Cedric","Dorn","Elric","Falken","Grendel","Halvar","Ivar","Jarek","Karn","Loran","Milo","Nyx","Olen","Peryn","Quinlan","Rowan","Sten","Tomasz","Ulric","Vadim","Wren","Xander","Yorik","Zoltan"];
const FIRST_NAMES_F = ["Aria","Brenna","Cira","Dara","Elyn","Fenna","Gilda","Hana","Isla","Jara","Kaya","Lira","Mira","Nora","Ophira","Petra","Quilla","Runa","Selene","Tira","Una","Vala","Wynn","Xara","Yara","Zora"];
const LAST_NAMES = ["Eisenherz","Sturmwind","Grauhaar","Falkenblick","Silberbart","Nachtschatten","Morgenstern","Weißfels","Rotmähne","Dunkelwald","Hellstein","Krähenfeld","Wolfsklaue","Bärentöter","Flammenzunge","Frosthauch","Schwarzquell","Goldkelch","Silberklinge","Rabenkralle"];
const NPC_RACES = ["Mensch","Elf","Halbelf","Zwerg","Halbling","Gnom","Halbork","Tiefling","Drachenblut","Aasimar"];
const NPC_ROLES = ["Wirt","Wache","Schmied","Alchemist","Priester","Barde","Dieb","Kaufmann","Söldner","Gelehrter","Späher","Fischer","Bauer","Adliger","Bettler","Weiser","Hexenmeister-Lehrling","Jäger","Karawanenführer","Waffenmeister"];
const NPC_QUIRKS = ["stottert wenn nervös","spricht nur im Flüsterton","hat eine tiefe Narbe im Gesicht","riecht nach Kräutern","trägt einen ungewöhnlichen Anhänger","hinkt","schielt","spricht ständig in Sprichwörtern","hat einen ansteckenden Husten","dreht ein Messer zwischen den Fingern","kaut auf einem Zahnstocher","summt eine alte Melodie","zählt heimlich seine Münzen","reibt sich ständig die Hände","blinzelt zu häufig","hat einen Vertrauten Raben","trägt fingerlose Handschuhe","spricht mit unsichtbaren Freunden"];
const NPC_ATTITUDES = ["freundlich","neutral","feindlich","unbekannt"];
const ALIGNMENTS = ["Rechtschaffen Gut","Neutral Gut","Chaotisch Gut","Rechtschaffen Neutral","Neutral","Chaotisch Neutral","Rechtschaffen Böse","Neutral Böse","Chaotisch Böse"];

export function generateNPC() {
  const female = Math.random() < 0.5;
  const first = pick(female ? FIRST_NAMES_F : FIRST_NAMES_M);
  const last = pick(LAST_NAMES);
  const role = pick(NPC_ROLES);
  const race = pick(NPC_RACES);
  const quirk = pick(NPC_QUIRKS);
  return {
    name: `${first} ${last}`,
    role,
    race,
    alignment: pick(ALIGNMENTS),
    attitude: pick(NPC_ATTITUDES),
    status: "lebendig",
    location: "",
    desc: `${race} · ${quirk}.`,
    notes: `Zufällig generiert. Rolle: ${role}. Quirk: ${quirk}.`,
    custom: true,
  };
}

// ── Weather-Gen ────────────────────────────────────────────────────────────
// Season-aware roll. Table combines temperature + precipitation + wind.
const SEASONS = ["Frühling","Sommer","Herbst","Winter"];
const WEATHER_TEMP = {
  Frühling: [{r:[1,10],v:"Kühl (8-14 °C)"},{r:[11,15],v:"Mild (14-20 °C)"},{r:[16,20],v:"Kalt (2-8 °C)"}],
  Sommer:   [{r:[1,4],v:"Warm (20-25 °C)"},{r:[11,20],v:"Heiß (25-32 °C)"},{r:[5,10],v:"Sehr heiß (32+ °C)"}],
  Herbst:   [{r:[1,10],v:"Kühl (8-14 °C)"},{r:[11,15],v:"Kalt (2-8 °C)"},{r:[16,20],v:"Nasskalt (0-5 °C)"}],
  Winter:   [{r:[1,10],v:"Frostig (−5 bis 2 °C)"},{r:[11,15],v:"Sehr kalt (−15 bis −5 °C)"},{r:[16,20],v:"Extrem (unter −15 °C)"}],
};
const WEATHER_PRECIP = {
  Frühling: [{r:[1,10],v:"klar"},{r:[11,14],v:"leichter Regen"},{r:[15,18],v:"Schauer"},{r:[19,20],v:"Gewitter"}],
  Sommer:   [{r:[1,12],v:"klar"},{r:[13,15],v:"schwül"},{r:[16,18],v:"Regenschauer"},{r:[19,20],v:"Sommergewitter"}],
  Herbst:   [{r:[1,8],v:"bewölkt"},{r:[9,13],v:"Nieselregen"},{r:[14,17],v:"Dauerregen"},{r:[18,19],v:"Sturm"},{r:[20,20],v:"Hagel"}],
  Winter:   [{r:[1,8],v:"klar-kalt"},{r:[9,12],v:"Schneefall"},{r:[13,16],v:"dichter Schneefall"},{r:[17,19],v:"Schneesturm"},{r:[20,20],v:"Eisregen"}],
};
const WEATHER_WIND = [{r:[1,10],v:"windstill"},{r:[11,15],v:"leichter Wind"},{r:[16,18],v:"böig"},{r:[19,20],v:"stürmisch"}];
const rollTable = (table, roll) => (table.find(e => roll >= e.r[0] && roll <= e.r[1]) || table[0]).v;

export function generateWeather(season = null) {
  const s = season || pick(SEASONS);
  return {
    season: s,
    temperature: rollTable(WEATHER_TEMP[s], rollD(20)),
    precipitation: rollTable(WEATHER_PRECIP[s], rollD(20)),
    wind: rollTable(WEATHER_WIND, rollD(20)),
  };
}

export function generateWeatherWeek(season = null) {
  const s = season || pick(SEASONS);
  return Array.from({ length: 7 }, () => generateWeather(s));
}

export const WEATHER_SEASONS = SEASONS;

// ── Loot-Gen ───────────────────────────────────────────────────────────────
// DMG-inspired treasure buckets per encounter tier (loose). Returns coin +
// optional gems/art + optional magic item (rare based on tier).
function coinsForTier(cr) {
  if (cr < 5)  return { cp: rollD(6)*10, sp: rollD(6)*10,  gp: rollD(6)*5,  pp: 0 };
  if (cr < 11) return { cp: 0, sp: rollD(6)*100, gp: rollD(6)*50, pp: rollD(6) };
  if (cr < 17) return { cp: 0, sp: 0, gp: rollD(6)*200, pp: rollD(6)*5 };
  return { cp: 0, sp: 0, gp: rollD(6)*400, pp: rollD(6)*10 };
}
const GEMS = ["Bergkristall","Onyx","Bernstein","Malachit","Karneol","Achat","Peridot","Aquamarin","Granat","Rubin","Saphir","Smaragd","Diamant"];
const ART = ["silberner Kelch","kunstvoll bemalter Krug","Elfenbein-Statuette","goldener Reif","seidener Wandteppich","edelsteinbesetzte Krone","gravierte Schwertscheide","antike Münze","exotisches Musikinstrument","Portraitgemälde"];
const MAGIC_COMMON  = ["Trank der Heilung","Trank der Kletterkunst","Pergamentrolle mit Schutzschrift","Feenblume","Mystische Kerze"];
const MAGIC_UNCOMMON = ["Trank der größeren Heilung","+1 Waffe","Rüstung des Schleichens","Handschuhe des Schwimmens","Amulett des Schutzes"];
const MAGIC_RARE     = ["Trank der ungeheuren Heilung","+2 Waffe","Bogen des Feindsuchers","Umhang der Elfenart","Stab der Blitze"];
const MAGIC_VRARE    = ["+3 Waffe","Rüstung der Unverwundbarkeit","Stab der Erzmagier","Rune der Macht"];

export function generateLoot(cr = 5) {
  const coins = coinsForTier(cr);
  const out = { coins, gems: [], art: [], magic: [] };
  // gems / art
  if (rollD(20) >= 15 - Math.min(cr, 10)) {
    out.gems = Array.from({ length: rollD(3) }, () => ({ name: pick(GEMS), value: `${rollD(6)*(cr < 5 ? 10 : cr < 11 ? 50 : 250)} gp` }));
  }
  if (rollD(20) >= 17 - Math.min(cr, 8)) {
    out.art = Array.from({ length: rollD(2) }, () => ({ name: pick(ART), value: `${rollD(6)*(cr < 5 ? 25 : 100)} gp` }));
  }
  // magic item chance & rarity by cr
  const magicRoll = rollD(20);
  if (cr < 5 && magicRoll >= 18)  out.magic.push({ name: pick(MAGIC_COMMON),  rarity: "Common" });
  if (cr >= 5 && cr < 11 && magicRoll >= 15) out.magic.push({ name: pick(MAGIC_UNCOMMON), rarity: "Uncommon" });
  if (cr >= 11 && cr < 17 && magicRoll >= 12) out.magic.push({ name: pick(MAGIC_RARE),     rarity: "Rare" });
  if (cr >= 17 && magicRoll >= 10) out.magic.push({ name: pick(MAGIC_VRARE), rarity: "Very Rare" });
  return out;
}

// ── Session-Log template ───────────────────────────────────────────────────
// Returns a Markdown-flavoured skeleton the DM fills in. Used by the Notes
// tab's 'Session-Log erstellen' button to seed a new note.
export function sessionLogTemplate(dateISO = null) {
  const d = dateISO || new Date().toISOString().slice(0, 10);
  return `# 📖 Session vom ${d}

## 🎯 Ort / Situation
-

## 👥 Anwesende Charaktere
-

## ⚔ Wichtigste Ereignisse
-

## 💬 Bemerkenswerte NPCs / Dialoge
-

## 💰 Beute / Rewards
- Münzen:
- Magische Gegenstände:
- Sonstige Funde:

## ✨ Erfahrung / Level-Up
- XP:
- Milestone:

## ❓ Offene Fäden / Cliffhanger
-

## 📝 Notizen für nächste Session
-
`;
}
