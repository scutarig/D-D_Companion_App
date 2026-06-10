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
    "bestiary.show_all": "Zeige alle Monster (DM/Lookup)",
    "bestiary.hide_unknown": "Verstecke unbekannte Monster (Spoiler-Schutz)",
    "bestiary.spoiler_mode": "🎲 Spoiler-Modus",
    "bestiary.full_view": "📖 Vollansicht",
    "bestiary.search": "🔍 Monster suchen…",
    "bestiary.search_spoiler": "🔍 Monster suchen (Name)…",
    "bestiary.add_custom": "+ Eigenes Monster",
    "bestiary.saves": "Rettungswürfe",
    "bestiary.skills": "Fertigkeiten",
    "bestiary.equipment": "Ausrüstung",
    "bestiary.resistances": "Resistenzen & Immunitäten",
    "bestiary.senses_languages": "Sinne & Sprachen",
    "bestiary.delete_note": "Notiz löschen?",
    "bestiary.empty_state": "Wähle ein Monster aus der Liste oder erstelle ein eigenes.",
    "bestiary.description": "Beschreibung",
    "bestiary.traits": "Eigenschaften",
    "bestiary.actions": "Aktionen",
    "bestiary.bonus_actions": "Bonus-Aktionen",
    "bestiary.reactions": "Reaktionen",
    "bestiary.legendary": "Legendäre Aktionen",

    // ── Katalog (Items) ──────────────────────────────────────────────────
    "katalog.add_custom": "+ Eigenes Item",
    "katalog.search": "🔍 Suchen…",
    "katalog.items_count": "Items",
    "katalog.label_name": "Name",
    "katalog.label_type": "Typ",
    "katalog.label_sub": "Sub-Typ",
    "katalog.label_dmg": "Schaden",
    "katalog.label_ac": "RK",
    "katalog.label_eff": "Effekt",
    "katalog.label_wt": "Gewicht",
    "katalog.label_rar": "Seltenheit",
    "katalog.label_notes": "Notizen",
    "katalog.save": "Speichern",
    "katalog.cancel": "Abbrechen",
    "katalog.edit": "Bearbeiten",
    "katalog.add_to_inventory": "+ Inventar",
    "katalog.magic_modifier": "Magischer Modifikator",
    "katalog.choose_plus": "+0/+1/+2/+3 wählen",

    // ── Notes ────────────────────────────────────────────────────────────
    "notes.cat_all": "Alle",
    "notes.cat_location": "Location",
    "notes.cat_story": "Story",
    "notes.cat_monster": "Monster",
    "notes.cat_misc": "Sonstiges",
    "notes.cat_prefix": "Kategorie",
    "notes.new_note": "Neue Notiz",
    "notes.new_with_cat": "Neue {cat}-Notiz",
    "notes.search_placeholder": "🔍 Notiz suchen…",
    "notes.clear_search": "Suche zurücksetzen",
    "notes.no_title": "(kein Titel)",
    "notes.empty": "(leer)",
    "notes.no_matches": "Keine Treffer für \"{q}\".",
    "notes.no_entries": "Keine Einträge.",
    "notes.delete": "Notiz löschen",
    "notes.title_placeholder": "Titel eingeben...",
    "notes.ph_monster": "Name, Typ, CR, Taktik, Schwächen, Lore...",
    "notes.ph_location": "Beschreibung, Atmosphäre, NPCs vor Ort...",
    "notes.ph_story": "Plotpunkte, Hinweise, Twist-Ideen...",
    "notes.ph_misc": "Freie Notizen...",
    "notes.empty_state": "Wähle eine Notiz oder erstelle eine neue.",

    // ── CharActions ──────────────────────────────────────────────────────
    "actions.header": "Aktionen, Bonus-Aktionen und Reaktionen",
    "actions.pinned": "auf Übersicht",
    "actions.std_dnd": "Standard D&D",
    "actions.custom": "Eigene Aktion",
    "actions.std_title": "PHB 2024 Standard-Aktionen hinzufügen",
    "actions.quick_setup": "Quick-Setup",
    "actions.quick_desc": "Lade alle PHB-2024 Core-Aktionen (Attack/Dash/Dodge/Help/Hide/Influence/Magic/Ready/Search/Study/Utilize + Grapple/Shove + Off-Hand + Bonus-Spell + OA + Ready-Reaction).",
    "actions.bulk_all_core": "Alle Core-Aktionen",
    "actions.bulk_of_type": "Alle {type} der aktuellen Liste hinzufügen",
    "actions.bulk_of_type_btn": "Alle dieser Sorte",
    "actions.already_added": "Drin",
    "actions.add": "Hinzufügen",
    "actions.edit_title": "Aktion bearbeiten",
    "actions.new_title": "Neue Aktion",
    "actions.field_name": "Name",
    "actions.field_range": "Reichweite",
    "actions.field_tohit": "Treffer +",
    "actions.field_damage": "Schaden",
    "actions.field_savedc": "Save DC",
    "actions.field_saveab": "Save Attribut",
    "actions.field_desc": "Beschreibung",
    "actions.ph_name": "z.B. Longsword-Angriff",
    "actions.ph_desc": "Effekt, Bedingungen, Sonderregeln...",
    "actions.pin_to_overview": "Auf Übersicht anzeigen",
    "actions.empty_for_type": "Keine {type}. Nutze 'Standard D&D' oder '+ Eigene Aktion'.",
    "actions.empty_title": "Noch keine Aktionen angelegt",
    "actions.empty_desc": "Nutze 'Standard D&D' für vorgefertigte Regelwerk-Aktionen oder erstelle eigene.",

    // ── CharSheet ────────────────────────────────────────────────────────
    "sheet.name": "Name",
    "sheet.primary_class": "Primärklasse",
    "sheet.classes_short": "Kl.",
    "sheet.level": "Level",
    "sheet.pb_short": "PB",
    "sheet.hp": "HP",
    "sheet.max_hp": "Max HP",
    "sheet.temp_hp": "Temp HP",
    "sheet.ac": "AC",
    "sheet.init": "Init",
    "sheet.speed": "Speed",
    "sheet.inspiration": "INSPIRATION",
    "sheet.active": "AKTIV",
    "sheet.inactive": "INAKTIV",
    "sheet.tab_stats": "Attribute",
    "sheet.tab_skills": "Skills",
    "sheet.tab_saves": "Saves",
    "sheet.tab_traits": "Traits",
    "sheet.tab_personality": "Charakter",
    "sheet.hit_dice": "Hit Dice",
    "sheet.available": "verfügbar",
    "sheet.regain": "Wiederh.",
    "sheet.spend": "Verbrauch",
    "sheet.skills": "Skills",
    "sheet.skills_legend": "(☑ Proficient · ☑☑ Expertise)",
    "sheet.proficient": "Proficient",
    "sheet.expertise": "Expertise",
    "sheet.saving_throws": "Saving Throws",
    "sheet.death_saves": "Todeswürfe",
    "sheet.successes": "Erfolge",
    "sheet.failures": "Misserfolge",
    "sheet.reset": "Zurücksetzen",
    "sheet.spell_stats": "Zauberwerte",
    "sheet.spell_ability": "Zauberfähigkeit",
    "sheet.spell_dc": "Zauber-SG",
    "sheet.spell_atk": "Zauber-Angriff",
    "sheet.personality": "Persönlichkeit",
    "sheet.ideals": "Ideale",
    "sheet.bonds": "Bindungen",
    "sheet.flaws": "Makel",
    "sheet.ph_personality": "Ich bin…",
    "sheet.ph_ideals": "Ich glaube an…",
    "sheet.ph_bonds": "Ich sorge mich um…",
    "sheet.ph_flaws": "Mein größter Fehler…",
    "sheet.features": "Features & Fähigkeiten",
    "sheet.ph_features": "Klassen-Features, Volksfähigkeiten…",
    "sheet.backstory": "Hintergrundgeschichte",
    "sheet.ph_backstory": "Woher komme ich? Was motiviert mich?",

    // ── Combat (alerts/confirms) ─────────────────────────────────────────
    "combat.err_name_required": "Name erforderlich!",
    "combat.err_select_monster": "Monster auswählen!",
    "combat.err_preset_name": "Preset-Name erforderlich!",
    "combat.confirm_delete_preset": "Preset löschen?",
    "combat.confirm_end": "Kampf beenden?",

    // ── Worldbuilding (confirms) ─────────────────────────────────────────
    "wb.confirm_delete_faction": "Fraktion löschen?",
    "wb.confirm_delete_location": "Ort löschen?",
    "wb.confirm_delete_quest": "Quest löschen?\n(Diese Aktion kann nicht rückgängig gemacht werden.)",

    // ── EncounterBuilder (confirms) ──────────────────────────────────────
    "encounter.confirm_clear": "Encounter wirklich leeren?",
    "encounter.confirm_delete_saved": "Gespeicherten Encounter löschen?",
    "encounter.confirm_delete_archive": "Archiv-Eintrag löschen?",

    // ── Save/Export ──────────────────────────────────────────────────────
    "save.title": "Charakter speichern",
    "save.export_json": "JSON exportieren",
    "save.export_pdf": "PDF drucken",
    "save.dm_mode_active": "DM-MODUS AKTIV",
    "save.player_mode_active": "SPIELER-MODUS AKTIV",
    "save.switch": "Wechseln",

    // ── CharManager Subtabs ──────────────────────────────────────────────
    "char.tab_sheet": "Bogen",
    "char.tab_currency": "Währung",
    "char.tab_levelup": "Level-Up",
    "char.tab_actions": "Aktionen",
    "char.tab_spells": "Spellbook",
    "char.tab_tokens": "Tokens",
    "char.tab_conditions": "Conditions",
    "char.invalid_file": "Ungültige Charakter-Datei.",
    "char.json_error": "JSON konnte nicht gelesen werden.",
    "char.auto_save": "Auto-Speichern",

    // ── Concentration Banner ─────────────────────────────────────────────
    "concentration.active": "KONZENTRATION AKTIV",
    "concentration.end": "Beenden",
    "concentration.dc_formula": "DC = max(10, Schaden ÷ 2)",
    "concentration.damage_taken": "Schaden erlitten:",
    "concentration.roll": "Würfeln",
    "concentration.held": "Save gehalten!",
    "concentration.broken": "Konzentration gebrochen!",
    "concentration.dice": "Würfel",
    "concentration.war_caster_adv": "War Caster: Vorteil",

    // ── SpellCastModal ───────────────────────────────────────────────────
    "spellcast.choose_slot": "Zauberplatz-Stufe wählen",
    "spellcast.no_slots": "Keine Zauberplätze verfügbar",
    "spellcast.level": "Stufe",
    "spellcast.cast": "gewirkt!",
    "spellcast.conc_active": "Konzentration aktiv — erscheint als Condition",

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
    "bestiary.show_all": "Show all monsters (DM/Lookup)",
    "bestiary.hide_unknown": "Hide unknown monsters (Spoiler protection)",
    "bestiary.spoiler_mode": "🎲 Spoiler Mode",
    "bestiary.full_view": "📖 Full View",
    "bestiary.search": "🔍 Search monsters…",
    "bestiary.search_spoiler": "🔍 Search monsters (Name)…",
    "bestiary.add_custom": "+ Custom Monster",
    "bestiary.saves": "Saving Throws",
    "bestiary.skills": "Skills",
    "bestiary.equipment": "Equipment",
    "bestiary.resistances": "Resistances & Immunities",
    "bestiary.senses_languages": "Senses & Languages",
    "bestiary.delete_note": "Delete note?",
    "bestiary.empty_state": "Pick a monster from the list or create a custom one.",
    "bestiary.description": "Description",
    "bestiary.traits": "Traits",
    "bestiary.actions": "Actions",
    "bestiary.bonus_actions": "Bonus Actions",
    "bestiary.reactions": "Reactions",
    "bestiary.legendary": "Legendary Actions",

    // ── Katalog (Items) ──────────────────────────────────────────────────
    "katalog.add_custom": "+ Custom Item",
    "katalog.search": "🔍 Search…",
    "katalog.items_count": "Items",
    "katalog.label_name": "Name",
    "katalog.label_type": "Type",
    "katalog.label_sub": "Sub-Type",
    "katalog.label_dmg": "Damage",
    "katalog.label_ac": "AC",
    "katalog.label_eff": "Effect",
    "katalog.label_wt": "Weight",
    "katalog.label_rar": "Rarity",
    "katalog.label_notes": "Notes",
    "katalog.save": "Save",
    "katalog.cancel": "Cancel",
    "katalog.edit": "Edit",
    "katalog.add_to_inventory": "+ Inventory",
    "katalog.magic_modifier": "Magic Modifier",
    "katalog.choose_plus": "Choose +0/+1/+2/+3",

    // ── Notes ────────────────────────────────────────────────────────────
    "notes.cat_all": "All",
    "notes.cat_location": "Location",
    "notes.cat_story": "Story",
    "notes.cat_monster": "Monster",
    "notes.cat_misc": "Misc",
    "notes.cat_prefix": "Category",
    "notes.new_note": "New Note",
    "notes.new_with_cat": "New {cat} note",
    "notes.search_placeholder": "🔍 Search notes…",
    "notes.clear_search": "Clear search",
    "notes.no_title": "(untitled)",
    "notes.empty": "(empty)",
    "notes.no_matches": "No matches for \"{q}\".",
    "notes.no_entries": "No entries.",
    "notes.delete": "Delete note",
    "notes.title_placeholder": "Enter title...",
    "notes.ph_monster": "Name, type, CR, tactics, weaknesses, lore...",
    "notes.ph_location": "Description, atmosphere, NPCs present...",
    "notes.ph_story": "Plot points, hints, twist ideas...",
    "notes.ph_misc": "Free notes...",
    "notes.empty_state": "Select a note or create a new one.",

    // ── CharActions ──────────────────────────────────────────────────────
    "actions.header": "Actions, Bonus Actions, and Reactions",
    "actions.pinned": "on overview",
    "actions.std_dnd": "Standard D&D",
    "actions.custom": "Custom Action",
    "actions.std_title": "Add PHB 2024 Standard Actions",
    "actions.quick_setup": "Quick Setup",
    "actions.quick_desc": "Load all PHB 2024 core actions (Attack/Dash/Dodge/Help/Hide/Influence/Magic/Ready/Search/Study/Utilize + Grapple/Shove + Off-Hand + Bonus Spell + OA + Readied Action).",
    "actions.bulk_all_core": "All Core Actions",
    "actions.bulk_of_type": "Add all {type} from the current list",
    "actions.bulk_of_type_btn": "All of this kind",
    "actions.already_added": "Added",
    "actions.add": "Add",
    "actions.edit_title": "Edit action",
    "actions.new_title": "New action",
    "actions.field_name": "Name",
    "actions.field_range": "Range",
    "actions.field_tohit": "To Hit +",
    "actions.field_damage": "Damage",
    "actions.field_savedc": "Save DC",
    "actions.field_saveab": "Save Ability",
    "actions.field_desc": "Description",
    "actions.ph_name": "e.g. Longsword Attack",
    "actions.ph_desc": "Effect, conditions, special rules...",
    "actions.pin_to_overview": "Show on overview",
    "actions.empty_for_type": "No {type}. Use 'Standard D&D' or '+ Custom Action'.",
    "actions.empty_title": "No actions created yet",
    "actions.empty_desc": "Use 'Standard D&D' for prefab rulebook actions or create your own.",

    // ── CharSheet ────────────────────────────────────────────────────────
    "sheet.name": "Name",
    "sheet.primary_class": "Primary Class",
    "sheet.classes_short": "Cl.",
    "sheet.level": "Level",
    "sheet.pb_short": "PB",
    "sheet.hp": "HP",
    "sheet.max_hp": "Max HP",
    "sheet.temp_hp": "Temp HP",
    "sheet.ac": "AC",
    "sheet.init": "Init",
    "sheet.speed": "Speed",
    "sheet.inspiration": "INSPIRATION",
    "sheet.active": "ACTIVE",
    "sheet.inactive": "INACTIVE",
    "sheet.tab_stats": "Abilities",
    "sheet.tab_skills": "Skills",
    "sheet.tab_saves": "Saves",
    "sheet.tab_traits": "Traits",
    "sheet.tab_personality": "Character",
    "sheet.hit_dice": "Hit Dice",
    "sheet.available": "available",
    "sheet.regain": "+ Regain",
    "sheet.spend": "- Spend",
    "sheet.skills": "Skills",
    "sheet.skills_legend": "(☑ Proficient · ☑☑ Expertise)",
    "sheet.proficient": "Proficient",
    "sheet.expertise": "Expertise",
    "sheet.saving_throws": "Saving Throws",
    "sheet.death_saves": "Death Saves",
    "sheet.successes": "Successes",
    "sheet.failures": "Failures",
    "sheet.reset": "Reset",
    "sheet.spell_stats": "Spellcasting Stats",
    "sheet.spell_ability": "Spellcasting Ability",
    "sheet.spell_dc": "Spell Save DC",
    "sheet.spell_atk": "Spell Attack",
    "sheet.personality": "Personality",
    "sheet.ideals": "Ideals",
    "sheet.bonds": "Bonds",
    "sheet.flaws": "Flaws",
    "sheet.ph_personality": "I am…",
    "sheet.ph_ideals": "I believe in…",
    "sheet.ph_bonds": "I care about…",
    "sheet.ph_flaws": "My greatest flaw…",
    "sheet.features": "Features & Traits",
    "sheet.ph_features": "Class features, racial traits…",
    "sheet.backstory": "Backstory",
    "sheet.ph_backstory": "Where do I come from? What drives me?",

    // ── Combat (alerts/confirms) ─────────────────────────────────────────
    "combat.err_name_required": "Name required!",
    "combat.err_select_monster": "Select a monster!",
    "combat.err_preset_name": "Preset name required!",
    "combat.confirm_delete_preset": "Delete preset?",
    "combat.confirm_end": "End combat?",

    // ── Worldbuilding (confirms) ─────────────────────────────────────────
    "wb.confirm_delete_faction": "Delete faction?",
    "wb.confirm_delete_location": "Delete location?",
    "wb.confirm_delete_quest": "Delete quest?\n(This action cannot be undone.)",

    // ── EncounterBuilder (confirms) ──────────────────────────────────────
    "encounter.confirm_clear": "Really clear encounter?",
    "encounter.confirm_delete_saved": "Delete saved encounter?",
    "encounter.confirm_delete_archive": "Delete archive entry?",


    // ── Save/Export ──────────────────────────────────────────────────────
    "save.title": "Save Character",
    "save.export_json": "Export JSON",
    "save.export_pdf": "Print PDF",
    "save.dm_mode_active": "DM MODE ACTIVE",
    "save.player_mode_active": "PLAYER MODE ACTIVE",
    "save.switch": "Switch",

    // ── CharManager Subtabs ──────────────────────────────────────────────
    "char.tab_sheet": "Sheet",
    "char.tab_currency": "Currency",
    "char.tab_levelup": "Level-Up",
    "char.tab_actions": "Actions",
    "char.tab_spells": "Spellbook",
    "char.tab_tokens": "Tokens",
    "char.tab_conditions": "Conditions",
    "char.invalid_file": "Invalid character file.",
    "char.json_error": "Could not parse JSON.",
    "char.auto_save": "Auto-Save",

    // ── Concentration Banner ─────────────────────────────────────────────
    "concentration.active": "CONCENTRATION ACTIVE",
    "concentration.end": "End",
    "concentration.dc_formula": "DC = max(10, Damage ÷ 2)",
    "concentration.damage_taken": "Damage taken:",
    "concentration.roll": "Roll",
    "concentration.held": "Save held!",
    "concentration.broken": "Concentration broken!",
    "concentration.dice": "Die",
    "concentration.war_caster_adv": "War Caster: Advantage",

    // ── SpellCastModal ───────────────────────────────────────────────────
    "spellcast.choose_slot": "Choose spell slot level",
    "spellcast.no_slots": "No spell slots available",
    "spellcast.level": "Level",
    "spellcast.cast": "cast!",
    "spellcast.conc_active": "Concentration active — appears as Condition",

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
