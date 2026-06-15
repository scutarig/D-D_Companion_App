// ─────────────────────────────────────────────────────────────────────────────
// languages.js — D&D 5e (PHB 2024) Standard Language list
//
// Stored on char.languages[] as the **DE label** (matches existing race-data:
// "Gemeinsprache", "Zwergisch", …). Use `langLabel(id, lang)` to localize.
// ─────────────────────────────────────────────────────────────────────────────

export const STANDARD_LANGUAGES = [
  // Standard (Origin) — chosen by Background
  { id: "common",        de: "Gemeinsprache",        en: "Common",              tier: "standard" },
  { id: "common_sign",   de: "Gemeinsprachen-Gebärden", en: "Common Sign Language", tier: "standard" },
  { id: "draconic",      de: "Drachisch",            en: "Draconic",            tier: "standard" },
  { id: "dwarvish",      de: "Zwergisch",            en: "Dwarvish",            tier: "standard" },
  { id: "elvish",        de: "Elfisch",              en: "Elvish",              tier: "standard" },
  { id: "giant",         de: "Riesisch",             en: "Giant",               tier: "standard" },
  { id: "gnomish",       de: "Gnomisch",             en: "Gnomish",             tier: "standard" },
  { id: "goblin",        de: "Goblinisch",           en: "Goblin",              tier: "standard" },
  { id: "halfling",      de: "Halblingisch",         en: "Halfling",            tier: "standard" },
  { id: "orc",           de: "Orkisch",              en: "Orc",                 tier: "standard" },
  // Rare (Feat / class-locked) — selectable via the Linguist feat or class
  { id: "abyssal",       de: "Abyssisch",            en: "Abyssal",             tier: "rare" },
  { id: "celestial",     de: "Himmlisch",            en: "Celestial",           tier: "rare" },
  { id: "deep_speech",   de: "Tiefensprache",        en: "Deep Speech",         tier: "rare" },
  { id: "druidic",       de: "Druidisch",            en: "Druidic",             tier: "rare" },
  { id: "infernal",      de: "Höllisch",             en: "Infernal",            tier: "rare" },
  { id: "primordial",    de: "Urtümlich",            en: "Primordial",          tier: "rare" },
  { id: "sylvan",        de: "Sylvanisch",           en: "Sylvan",              tier: "rare" },
  { id: "thieves_cant",  de: "Diebesjargon",         en: "Thieves' Cant",       tier: "rare" },
  { id: "undercommon",   de: "Unter-Gemeinsprache",  en: "Undercommon",         tier: "rare" },
];

const DE_TO_EN = Object.fromEntries(STANDARD_LANGUAGES.map(l => [l.de, l.en]));
const EN_TO_DE = Object.fromEntries(STANDARD_LANGUAGES.map(l => [l.en, l.de]));

/** Localize a stored language label. Custom (unknown) labels pass through. */
export function langLabel(stored, lang) {
  if (!stored) return "";
  if (lang === "en") return DE_TO_EN[stored] || stored;
  return EN_TO_DE[stored] || stored;
}
