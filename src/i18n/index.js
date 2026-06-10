// ─────────────────────────────────────────────────────────────────────────────
// i18n — Lightweight internationalization for D&D Companion
//
// USAGE:
//   import { useI18n } from "../i18n/index.js";
//   const { t, lang, setLang } = useI18n();
//   <button>{t("ui.heroic_inspiration", "Heroic Inspiration")}</button>
//
// Keys folgen Dot-Notation: section.subsection.key
// Fallback wird genutzt wenn kein Key gefunden wird.
// Sprache persistiert via localStorage "app_lang_v1" (Default: "de")
//
// PHB 2024-Begriffe konsistent nach offizieller DE-Übersetzung:
//   Proficiency Bonus       → Übungsbonus
//   Heroic Inspiration      → Heldenhafte Inspiration
//   Weapon Mastery          → Waffenmeisterschaft
//   Epic Boon               → Epische Gunst
//   Bardic Inspiration      → Bardische Inspiration
//   Action / Bonus / React  → Aktion / Bonus / Reaktion
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

const STORAGE_KEY = "app_lang_v1";
const DEFAULT_LANG = "de";
const SUPPORTED_LANGS = ["de", "en"];

// ─── Translation Dictionaries ──────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    // ── Mode + Header ────────────────────────────────────────────────────
    "mode.player": "Spieler",
    "mode.dm": "DM",
    "mode.switch_to_player": "👤 Zu Spieler",
    "mode.switch_to_dm": "🎲 Zu DM",
    "mode.confirm_title_player": "Wechsel in Spieler-Modus?",
    "mode.confirm_title_dm": "Wechsel in DM-Modus?",
    "mode.confirm_warning": "ACHTUNG — Spoiler-Risiko!",
    "mode.confirm_dm_desc": "Im DM-Modus siehst du alle Monster-Stats ohne Spoiler-Filter und alle Referenzen. Save/PDF-Funktionen + Rast-Buttons werden versteckt.",
    "mode.confirm_player_desc": "Im Spieler-Modus werden alle DM-Tabs (Kampf, Bestiary, Klassen-Ref, Völker-Ref, Encounter) ausgeblendet. Save/PDF und Heldenhafte Inspiration werden wieder sichtbar.",

    // ── Header Buttons ───────────────────────────────────────────────────
    "header.heroic_inspiration": "Heldenhafte Inspiration",
    "header.short_rest": "Kurze Rast",
    "header.long_rest": "Lange Rast",
    "header.confirm": "Bestätigen",
    "header.lang_toggle": "Sprache",

    // ── Rest Banner ──────────────────────────────────────────────────────
    "rest.short_active": "◆ KURZE RAST",
    "rest.long_active": "◆ LANGE RAST",
    "rest.long_effects": "Volle TP · Alle Slots · Ressourcen zurück · Erschöpfung -1",
    "rest.heal_hp": "TP heilen:",
    "rest.heroic_inspiration_grant": "✦ Heldenhafte Inspiration (Mensch: Findig)",
    "rest.mastery_swap": "🗡️ Waffenmeisterschafts-Wechsel erlaubt — ggf. im Charakter-Tab tauschen",

    // ── Common Actions ───────────────────────────────────────────────────
    "action.save": "Speichern",
    "action.delete": "Löschen",
    "action.cancel": "Abbrechen",
    "action.confirm": "Bestätigen",
    "action.add": "Hinzufügen",
    "action.remove": "Entfernen",
    "action.edit": "Bearbeiten",
    "action.search": "Suchen",
    "action.close": "Schließen",
    "action.load": "Laden",

    // ── Tab Labels ───────────────────────────────────────────────────────
    "tab.overview": "Übersicht",
    "tab.character": "Charakter",
    "tab.companions": "Begleiter",
    "tab.proficiencies": "Übungsbonus",
    "tab.inventory": "Inventar",
    "tab.notes": "Notizen",
    "tab.npcs": "NPCs",
    "tab.combat": "Kampf",
    "tab.dice": "Würfel",
    "tab.world": "Weltenbau",
    "tab.bestiary": "Bestiarium",
    "tab.encounter": "Begegnung",
    "tab.classes": "Klassen",
    "tab.species": "Völker",
    "tab.quickref": "Schnellreferenz",

    // ── Common UI ────────────────────────────────────────────────────────
    "ui.loading": "Lädt…",
    "ui.empty": "Leer",
    "ui.search_placeholder": "🔍 Suchen…",
    "ui.no_character": "Kein Charakter gewählt",
    "ui.dm_no_character_needed": "🎲 DM-Modus aktiv — kein Charakter erforderlich",
    "ui.more": "Mehr",
    "ui.short_ref": "Schnellref",

    // ── Encounter Builder ────────────────────────────────────────────────
    "encounter.title": "🎲 ENCOUNTER BUILDER · PHB 2024 / DMG 2024",
    "encounter.party_level": "Gruppen-Level",
    "encounter.party_size": "Gruppen-Größe",
    "encounter.difficulty": "Schwierigkeit",
    "encounter.easy": "Leicht",
    "encounter.moderate": "Mittel",
    "encounter.hard": "Schwer",
    "encounter.xp_budget": "EP-BUDGET",
    "encounter.add_monsters": "Monster hinzufügen",
    "encounter.saved_encounters": "💾 GESPEICHERTE BEGEGNUNGEN",
    "encounter.combat_archive": "📜 KAMPF-ARCHIV",
    "encounter.empty_state_title": "Bereit für Encounter-Design",
    "encounter.empty_state_desc": "Wähle unten Monster aus, um sie zur Begegnung hinzuzufügen. Die XP-Budget-Bar oben zeigt live ob die Begegnung zur Schwierigkeit passt.",

    // ── Bestiary ─────────────────────────────────────────────────────────
    "bestiary.cr_filter_all": "Alle",
    "bestiary.cr_filter_weak": "<1",
    "bestiary.cr_filter_moderate": "1-4",
    "bestiary.cr_filter_deadly": "5-10",
    "bestiary.cr_filter_boss": "11+",
    "bestiary.dm_notes_title": "🎲 DM-Notizen (privat)",
    "bestiary.dm_notes_placeholder": "Eigene DM-Notizen für Encounter-Planung… (z.B. 'Schwächt sich nach Stunning Strike', 'Verwende für Boss-Encounter Sitzung 5')",

    // ── QuickRef ─────────────────────────────────────────────────────────
    "quickref.conditions": "⚡ Zustände",
    "quickref.actions": "🎯 Aktionen",
    "quickref.combat": "⚔️ Kampf",
    "quickref.mastery": "🗡️ Meisterschaft",
    "quickref.weapons": "🪓 Waffen-Props",
    "quickref.movement": "💨 Bewegung",
    "quickref.resting": "🌙 Rasten",
    "quickref.magic": "🔮 Magie",
    "quickref.checks": "🎲 Proben",
    "quickref.tables": "📊 Tabellen",
    "quickref.banner": "Schnellreferenz nach PHB 2024 · Zustände, Aktionen, Meisterschaft, Waffen-Eigenschaften, Regel-Glossar",
    "quickref.actions_section": "Aktionen",
    "quickref.bonus_section": "Bonus-Aktionen",
    "quickref.reactions_section": "Reaktionen",
    "quickref.mastery_intro": "PHB 2024 Reform: Jede Waffe hat eine Meisterschafts-Eigenschaft, die durch Klassen-Feature freigeschaltet wird (Barbar, Kämpfer, Paladin, Waldläufer, Schurke Lv1). Du kannst eine bestimmte Anzahl Waffen-Meisterschaften gleichzeitig nutzen.",

    // ── KlassenRef / VoelkerRef ──────────────────────────────────────────
    "ref.search_class": "🔍 Klasse suchen…",
    "ref.search_species": "🔍 Volk suchen…",
    "ref.about_class": "Über die Klasse",
    "ref.about_species": "Über das Volk",
    "ref.skills_tools": "Fertigkeiten & Werkzeuge",
    "ref.starting_equipment": "Startausrüstung",
    "ref.subclasses": "Subklassen",
    "ref.class_progression": "Klassen-Progression (Level 1-20)",
    "ref.class_features_detail": "Klassen-Merkmale (Detail)",
    "ref.features_excerpt": "Merkmale (Auszug · 2014 Schema)",
    "ref.legacy_warning": "⚠️ Diese Klasse ist noch auf 2014-Schema. PHB-2024-Refresh folgt in Phase 2.",
    "ref.archetypes": "Archetypen",
    "ref.choose_class": "Klasse auswählen",
    "ref.choose_species": "Volk auswählen",
    "ref.species_traits": "Rassen-Merkmale",
    "ref.species_features": "Level-Merkmale",
    "ref.species_lineages": "Lineages",
    "ref.species_legacy_warning": "⚠️ Legacy 2014 — keine strukturierten 2024-Daten. Siehe PHB 2024 Species für ersatzweise Optionen.",
    "ref.species_asi_hint": "2024-Reform: Keine Attributs-Boni an Species — Boni kommen vom Background!",
    "ref.classes_count": "KLASSEN",
    "ref.species_count": "VÖLKER",
    "ref.on_phb_2024": "auf PHB 2024",
    "ref.edition_all": "Alle",
    "ref.edition_2024": "PHB 2024",
    "ref.edition_legacy": "Legacy",
  },

  en: {
    // ── Mode + Header ────────────────────────────────────────────────────
    "mode.player": "Player",
    "mode.dm": "DM",
    "mode.switch_to_player": "👤 To Player",
    "mode.switch_to_dm": "🎲 To DM",
    "mode.confirm_title_player": "Switch to Player Mode?",
    "mode.confirm_title_dm": "Switch to DM Mode?",
    "mode.confirm_warning": "WARNING — Spoiler Risk!",
    "mode.confirm_dm_desc": "In DM mode you see all monster stats without spoiler filter and all references. Save/PDF + Rest buttons are hidden.",
    "mode.confirm_player_desc": "In Player mode all DM tabs (Combat, Bestiary, Classes Ref, Species Ref, Encounter) are hidden. Save/PDF and Heroic Inspiration become visible again.",

    // ── Header Buttons ───────────────────────────────────────────────────
    "header.heroic_inspiration": "Heroic Inspiration",
    "header.short_rest": "Short Rest",
    "header.long_rest": "Long Rest",
    "header.confirm": "Confirm",
    "header.lang_toggle": "Language",

    // ── Rest Banner ──────────────────────────────────────────────────────
    "rest.short_active": "◆ SHORT REST",
    "rest.long_active": "◆ LONG REST",
    "rest.long_effects": "Full HP · All Slots · Resources reset · Exhaustion -1",
    "rest.heal_hp": "Heal HP:",
    "rest.heroic_inspiration_grant": "✦ Heroic Inspiration (Human: Resourceful)",
    "rest.mastery_swap": "🗡️ Weapon Mastery Swap allowed — change in Character tab if desired",

    // ── Common Actions ───────────────────────────────────────────────────
    "action.save": "Save",
    "action.delete": "Delete",
    "action.cancel": "Cancel",
    "action.confirm": "Confirm",
    "action.add": "Add",
    "action.remove": "Remove",
    "action.edit": "Edit",
    "action.search": "Search",
    "action.close": "Close",
    "action.load": "Load",

    // ── Tab Labels ───────────────────────────────────────────────────────
    "tab.overview": "Overview",
    "tab.character": "Character",
    "tab.companions": "Companions",
    "tab.proficiencies": "Proficiencies",
    "tab.inventory": "Inventory",
    "tab.notes": "Notes",
    "tab.npcs": "NPCs",
    "tab.combat": "Combat",
    "tab.dice": "Dice",
    "tab.world": "Worldbuilding",
    "tab.bestiary": "Bestiary",
    "tab.encounter": "Encounter",
    "tab.classes": "Classes",
    "tab.species": "Species",
    "tab.quickref": "Quick Reference",

    // ── Common UI ────────────────────────────────────────────────────────
    "ui.loading": "Loading…",
    "ui.empty": "Empty",
    "ui.search_placeholder": "🔍 Search…",
    "ui.no_character": "No character selected",
    "ui.dm_no_character_needed": "🎲 DM mode active — no character required",
    "ui.more": "More",
    "ui.short_ref": "Quick Ref",

    // ── Encounter Builder ────────────────────────────────────────────────
    "encounter.title": "🎲 ENCOUNTER BUILDER · PHB 2024 / DMG 2024",
    "encounter.party_level": "Party Level",
    "encounter.party_size": "Party Size",
    "encounter.difficulty": "Difficulty",
    "encounter.easy": "Easy",
    "encounter.moderate": "Moderate",
    "encounter.hard": "Hard",
    "encounter.xp_budget": "XP BUDGET",
    "encounter.add_monsters": "Add Monsters",
    "encounter.saved_encounters": "💾 SAVED ENCOUNTERS",
    "encounter.combat_archive": "📜 COMBAT ARCHIVE",
    "encounter.empty_state_title": "Ready for Encounter Design",
    "encounter.empty_state_desc": "Pick monsters below to add them to your encounter. The XP budget bar above shows live whether the encounter matches the difficulty.",

    // ── Bestiary ─────────────────────────────────────────────────────────
    "bestiary.cr_filter_all": "All",
    "bestiary.cr_filter_weak": "<1",
    "bestiary.cr_filter_moderate": "1-4",
    "bestiary.cr_filter_deadly": "5-10",
    "bestiary.cr_filter_boss": "11+",
    "bestiary.dm_notes_title": "🎲 DM Notes (private)",
    "bestiary.dm_notes_placeholder": "Your DM notes for encounter planning… (e.g. 'Weakens after Stunning Strike', 'Use for Boss encounter session 5')",

    // ── QuickRef ─────────────────────────────────────────────────────────
    "quickref.conditions": "⚡ Conditions",
    "quickref.actions": "🎯 Actions",
    "quickref.combat": "⚔️ Combat",
    "quickref.mastery": "🗡️ Mastery",
    "quickref.weapons": "🪓 Weapon Props",
    "quickref.movement": "💨 Movement",
    "quickref.resting": "🌙 Resting",
    "quickref.magic": "🔮 Magic",
    "quickref.checks": "🎲 Checks",
    "quickref.tables": "📊 Tables",
    "quickref.banner": "Quick Reference per PHB 2024 · Conditions, Actions, Mastery Properties, Weapon Properties, Rules Glossary",
    "quickref.actions_section": "Actions",
    "quickref.bonus_section": "Bonus Actions",
    "quickref.reactions_section": "Reactions",
    "quickref.mastery_intro": "PHB 2024 Reform: Each weapon has a Mastery Property unlocked by a class feature (Barbarian, Fighter, Paladin, Ranger, Rogue Lv1). You can use a certain number of weapon masteries at once.",

    // ── KlassenRef / VoelkerRef ──────────────────────────────────────────
    "ref.search_class": "🔍 Search class…",
    "ref.search_species": "🔍 Search species…",
    "ref.about_class": "About the Class",
    "ref.about_species": "About the Species",
    "ref.skills_tools": "Skills & Tools",
    "ref.starting_equipment": "Starting Equipment",
    "ref.subclasses": "Subclasses",
    "ref.class_progression": "Class Progression (Level 1-20)",
    "ref.class_features_detail": "Class Features (Detail)",
    "ref.features_excerpt": "Features (Excerpt · 2014 Schema)",
    "ref.legacy_warning": "⚠️ This class is still on the 2014 schema. PHB 2024 refresh follows in Phase 2.",
    "ref.archetypes": "Archetypes",
    "ref.choose_class": "Select Class",
    "ref.choose_species": "Select Species",
    "ref.species_traits": "Species Traits",
    "ref.species_features": "Level Features",
    "ref.species_lineages": "Lineages",
    "ref.species_legacy_warning": "⚠️ Legacy 2014 — no structured 2024 data. See PHB 2024 Species for replacement options.",
    "ref.species_asi_hint": "2024 Reform: No ability score bonuses from Species — bonuses come from Background!",
    "ref.classes_count": "CLASSES",
    "ref.species_count": "SPECIES",
    "ref.on_phb_2024": "on PHB 2024",
    "ref.edition_all": "All",
    "ref.edition_2024": "PHB 2024",
    "ref.edition_legacy": "Legacy",
  },
};

// ─── Initial language detection ─────────────────────────────────────────────
function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch (_) { /* localStorage unavailable */ }
  return DEFAULT_LANG;
}

// ─── Module-level current language (so non-React code can read it) ──────────
let _currentLang = getInitialLang();
const _listeners = new Set();

function _setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === _currentLang) return;
  _currentLang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  _listeners.forEach(fn => fn(lang));
}

/** Get current language synchronously (use in non-React code) */
export function getLang() {
  return _currentLang;
}

/** Translate a key with optional fallback */
export function t(key, fallback = "") {
  const dict = TRANSLATIONS[_currentLang] || TRANSLATIONS[DEFAULT_LANG];
  return dict[key] ?? fallback ?? key;
}

/** React hook: returns { lang, setLang, t } */
export function useI18n() {
  const [lang, setLang] = useState(_currentLang);

  useEffect(() => {
    const fn = (newLang) => setLang(newLang);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);

  return {
    lang,
    setLang: _setLang,
    t: (key, fallback) => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
      return dict[key] ?? fallback ?? key;
    },
  };
}

export const SUPPORTED_LANGUAGES = SUPPORTED_LANGS;
