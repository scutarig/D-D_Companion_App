# TODO — D&D Companion PWA

Offene Punkte nach der 2024 PHB UI-Migration.

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

---

## ⏳ AUSSTEHEND (LOW PRIORITY)

### Origin Feats (komplex — brauchen User-Input-Picker)
- [ ] **Magic Initiate**: Spell-Auswahl-Picker (2 Cantrips + 1 Lv1 Spell aus Cleric/Druid/Wizard Liste)
- [ ] **Crafter**: 3 Artisan's Tools Wahl-Picker
- [ ] **Skilled**: 3 Skills/Tools Wahl-Picker
- [ ] **Musician**: 3 Musical Instruments Wahl-Picker
- [ ] **Lucky**: PB Luck Points als trackbare Ressource (analog Rage)
- [ ] **Tavern Brawler**: +1 STR oder CON via Half-Feat-Picker

### Heroic Inspiration (2024 NEU)
- [ ] Bei Background-Wahl: manche Backgrounds geben Heroic Inspiration nach Long Rest
- [ ] Bei Klassen-Features die Heroic Inspiration triggern (z.B. Halfling Lucky):
  Auto-Vorschlag beim Würfeln

### Sonstige
- [ ] **DM-Mode Notes**: Pro Monster eigene DM-Notizen (für Encounter-Planung)
- [ ] **Encounter Builder**: CR-Budget basierend auf Party-Level + Encounter-Difficulty
- [ ] **2024 MM Vollständigkeit**: Restl. ~10 Monster wie Sukkubus, Schwarze
  Schlickpest, Ritter (selten genutzt — als "Legacy 2014" markieren?)
