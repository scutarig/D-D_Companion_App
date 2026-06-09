# TODO — D&D Companion PWA

Offene Punkte nach der 2024 PHB UI-Migration.

---

## 🎯 AKTIVE PHASE — Player/DM-Split

### Phase 1: Mode-Switch (in Arbeit)
- [ ] `app_mode_v1` persistierter Mode-State (`player` | `dm`)
- [ ] Header-Toggle global (👤 Player ↔ 🎲 DM) ersetzt Spoiler-Button
- [ ] MAIN_TABS / MOBILE_NAV pro Mode filtern
- [ ] Player-Mode: overview, char, companions, proficiencies, inventar, notes, dice, world, quickref, npcs
- [ ] DM-Mode: combat, bestiary, klassen, voelker, npcs, dice, notes
- [ ] Save/PDF-Buttons nur im Player-Mode anzeigen
- [ ] Auto-Tab-Switch wenn aktueller Tab im neuen Mode nicht existiert
- [ ] viewMode (Spoiler/Voll) automatisch an Mode koppeln

### Phase 2: Content-Refresh (nach Phase 1)
- [ ] **Klassen-Referenz** komplett auf PHB 2024 (alle 13 Klassen, exakte Feature-Tabellen)
  - [x] Bündel A (Warriors): Barbarian, Fighter, Paladin, Ranger [71d3ce1]
  - [x] Bündel B (Experts): Bard, Monk, Rogue [fcb231b]
  - [x] Bündel C (Mages): Wizard, Sorcerer, Warlock [6b6e2a5]
  - [x] Bündel D (Priests): Cleric, Druid [pending commit]
  - [ ] **Artificer:** NICHT in PHB 2024 — bleibt 2014-Legacy bis WotC Update veröffentlicht (Tasha's-Quelle)
- [x] **Völker-Referenz** komplett auf PHB 2024 [pending commit]
  - VoelkerRef.jsx nutzt jetzt RACES_FULL (strukturierte 2024-Daten)
  - 2024-Badge in Liste + Detail
  - Edition-Filter (Alle/PHB 2024/Legacy)
  - Strukturierte Traits + Features + Lineages-Anzeige
  - 10 PHB-2024-Species verifiziert vs. PHB-2024 PDF
  - Legacy 2014 mit Warnhinweis + Verweis auf Ersatz-Optionen
- [x] **Schnellreferenz** exakt nach PHB-2024-Original [pending commit]
  - 10 Sektionen: Zustände, Aktionen, Kampf, Mastery, Waffen-Props, Bewegung, Rasten, Magie, Checks, Tabellen
  - 12 Aktionen (4 NEU 2024: Influence, Magic, Study, Utilize) mit 2024-Badge
  - 8 Mastery Properties komplett (Cleave/Graze/Nick/Push/Sap/Slow/Topple/Vex)
  - 10 Weapon Properties (Ammunition, Finesse, Heavy, Light, Loading, Range, Reach, Thrown, Two-Handed, Versatile)
  - PHB-2024-Reform-Hinweise (D20 Test, Critical nur auf Weapon, Counterspell-Änderung etc.)
- [x] **Equipment-Katalog** Magic-Modifier-System [pending commit]
  - `applyMagicModifier(item, plus)` Helper in items.js
  - Pro Basis-Waffe/Rüstung: +0/+1/+2/+3 Picker direkt im Katalog-Modal
  - Auto-Naming: "Langschwert +2", Auto-Rarity: Uncommon/Rare/Very Rare
  - Auto-Bonuses: hit/dmg für Weapons, ac für Armor
  - Generische "+1 Waffe" Einträge bleiben als Legacy-Backward-Compat
  - 9 neue DMG-2024 Magic Items hinzugefügt (Berserker-Axt, Bag of Holding,
    Wand of Magic Missiles, Glas-Trinkhorn etc.)
- [x] **Tablet/Mobile-Tauglichkeit** [pending commit]
  - Touch-Optimization CSS via `@media (pointer: coarse)` injected in App.jsx
  - Buttons: min-height 44px auf Tablets, 40px auf Phones (Apple HIG ≥44px)
  - Sidebar-Buttons: 12px padding für mehr Touch-Hitbox
  - Mode-Toggle prominent: min-height 60px auf Tablets
  - Inputs: min-height 40px + 15px font-size auf touch devices
  - useIsMobile-Breakpoint: 768 → 900 (S7 FE/iPad-Portrait friendlier)
  - Landscape-Tablet (≥900px) bleibt Desktop-Layout mit Sidebar

### Phase 3: PHB-2024 Restpunkte
- [ ] **Heroic Inspiration** (2024 NEU)
  - Bei Background-Wahl: auto-grant nach Long Rest
  - Halfling Lucky etc. → Auto-Vorschlag
- [ ] **Epic Boons Lv19** Picker
- [ ] **Weapon Mastery Swap** bei Long Rest (RAW)
- [ ] **Bonus-Action Spell-Rule** Tracker (1 Cantrip + 1 Bonus-Spell pro Turn)
- [ ] **6 komplexe Origin Feats** mit User-Picker:
  - Magic Initiate (2 Cantrips + 1 Lv1-Spell aus Cleric/Druid/Wizard)
  - Crafter (3 Artisan's Tools)
  - Skilled (3 Skills/Tools)
  - Musician (3 Instrumente)
  - Lucky (PB Luck Points trackbar)
  - Tavern Brawler (+1 STR/CON Half-Feat)

### Phase 4: DM-Features (nach Split)
- [ ] **DM-Mode Notes** pro Monster (für Encounter-Planung)
- [ ] **Encounter Builder** mit CR-Budget (Party-Level × Difficulty)
- [ ] **Kampflog persistent** mit Session-Archiv
- [ ] **2024 MM Vollständigkeit** — restl. ~10 Monster (Sukkubus, Schwarze Schlickpest, Ritter)

### Phase 5: Lokalisierung
- [ ] **DE-Übersetzung** D&D-konform (Begriffe wie "Übungsbonus" statt "Proficiency Bonus")
- [ ] Sprach-Toggle EN/DE in Settings
- [ ] Alle data/*.js Files mit i18n-Keys
- [ ] PHB-DE als Referenz nutzen, nicht banal übersetzen

---

## ✅ ABGESCHLOSSEN

### P1 — Rast-System 2024-Update [c30c9f6]
- ✅ Exhaustion -1 Level auf Long Rest (2014/2024 RAW)
- ✅ Klassen-Ressourcen-Reset (Rage, Action Surge, Bardische Inspiration etc.)
- ✅ HD-Würfel-UI im Short Rest (1d{hd} + CON-Mod, mit Log)
- ✅ Architektur: `src/utils/restHelpers.js` mit applyLongRest/applyShortRest/rollHitDie/spendHitDie

### P2.1 — Origin Feat Auto-Apply [5a226e1]
- ✅ `feat.effects` Schema (hp_per_level / tool_prof / initiative_pb)
- ✅ Tough: +2 HP pro Char-Level (auto-scale beim LevelUp)
- ✅ Healer: Herbalism Kit Tool-Proficiency
- ✅ Alert: char.initiativePB Flag
- ✅ Delta-Tracking für saubere Reverts bei BG-Wechsel
- ✅ `src/utils/originFeats.js`

### P2.2 — Subclass Locked-Preview [bdf7d0b]
- ✅ Locked-Klassen (unter Lv3) zeigen jetzt auch Subklassen-Dropdown
- ✅ Preview-Modus mit amber-Akzent (statt grau-gesperrt)
- ✅ Feature-Preview-Card mit "(Vorschau — wird auf Lv3 wirksam)" Hinweis

### P2.3 — Spellbook Cantrip-Limit-Warning [612bf87]
- ✅ `checkCantripLimit(spell)` Helper
- ✅ window.confirm-Dialog beim Über-Limit-Hinzufügen
- ✅ Cantrip-Status-Badges im Section-Header (Bar 4/4 / Mag 3/4 etc.)
- ✅ Multi-class-aware
