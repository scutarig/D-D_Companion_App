# Datenverifikation gegen offizielle Regeln

**Quelle der Wahrheit:** D&D **2024 PHB + DMG** (RAW)
**Fallback:** Wo 2024 nichts ändert → 2014er Werte gelten weiter
**Workflow:** Pro Block — Findings sammeln, User entscheidet per Haken was gefixt wird

Legende: ⬜ offen · 🔍 in Prüfung · ⚠️ Findings vorhanden · ✅ verifiziert · 🔧 gefixt

---

## 1. Klassen

| Klasse | Stand | Datei(en) | Notizen |
|--------|-------|-----------|---------|
| Barbar | ⚠️ | `classFeatures.js`, `classResources.js`, `classes.js` | siehe Findings unten |
| Barde | ⚠️ | dito | siehe Findings unten |
| Druide | ⚠️ | dito | siehe Findings unten |
| Hexenmeister | ⚠️ | dito | siehe Findings unten |
| Kämpfer | ⚠️ | dito | siehe Findings unten |
| Kleriker | ⚠️ | dito | siehe Findings unten |
| Magier | ⚠️ | dito | siehe Findings unten |
| Magieschmied | ⏭️ | dito | **Artificer ist NICHT im PHB 2024** — bleibt 2014, separate Entscheidung |
| Mönch | ⚠️ | dito | siehe Findings unten |
| Paladin | ⚠️ | dito | siehe Findings unten |
| Schurke | ⚠️ | dito | siehe Findings unten |
| Waldläufer | ⚠️ | dito | siehe Findings unten |
| Zauberer | ⚠️ | dito | siehe Findings unten |

**Subklassen:** separat geprüft (`subclasses.js`) — kommt nach Hauptklassen-Run.

---

## 2. Spells

| Bereich | Stand | Datei | Notizen |
|---------|-------|-------|---------|
| Cantrips (Lv0) | ⬜ | `spells.js` | Skalierung (5/11/17) prüfen |
| Lv1–3 (Kampf) | ⬜ | dito | 2024: viele Damage-Spells überarbeitet |
| Lv4–9 (Hoch) | ⬜ | dito | Conjure-Reihe, Banishment, etc. |
| Ritual-Spells | ⬜ | dito | 53 Spells, Ritual-Flag |
| Konzentrations-Flags | ⬜ | dito | `concentration: true` vs `dur: "Conc."` |

---

## 3. Rassen / Species

| Bereich | Stand | Datei | Notizen |
|---------|-------|-------|---------|
| Core-Rassen | ⬜ | `races.js` | 2024: ASI nicht mehr Rassen-gebunden! |
| Traits & Features | ⬜ | dito | Lifespan, Speed, Resistenzen |

---

## 4. Backgrounds

| Bereich | Stand | Datei | Notizen |
|---------|-------|-------|---------|
| Backgrounds | ⬜ | `backgrounds.js` | 2024: Backgrounds geben ASI + Feat |
| Feats | ⬜ | `feats.js` | 2024: Origin/General/Fighting-Style/Epic |

---

## 5. DMG / Items / Mechaniken

| Bereich | Stand | Datei | Notizen |
|---------|-------|-------|---------|
| Conditions | ⬜ | `conditions.js` | 2024: Exhaustion stark vereinfacht (1 Stufe = -2 auf alles) |
| Magic Items | ⬜ | items, attunement | 2024-Anpassungen prüfen |
| Bestiary | ⬜ | `monsters.js` | 2024 MM ist noch nicht raus (Stand früh 2024) — meist 2014 Stats |
| Helper-Funktionen | ⬜ | `helpers.js` | PB-Tabelle, Slot-Tabellen, Caster-Types |

---

## Globaler i18n-Auftrag

Beim späteren Fix-Schritt:
- **Default-Sprache: Englisch (RAW Originaltext aus 2024 PHB/DMG)**
- **Sprach-Toggle DE/EN** in App-Einstellungen
- Deutsche Übersetzungen müssen **D&D-Kontext-treu** sein (z.B. "Sneak Attack" → "Hinterhältiger Angriff", nicht "Schleichangriff"), keine 1:1-Übersetzung
- Struktur-Vorschlag: `{ name: { en, de }, description: { en, de } }` oder Lookup-Dictionary

UI-Strings ("Speichern", "Bearbeiten" etc.) bleiben vorerst auf Deutsch — nur das D&D-Material wird zweisprachig. *(Sollte das auch wechseln? — am Ende klären)*

---

## Findings-Log

*Hier sammle ich pro Block die Abweichungen mit User-Entscheidung.*

### Barbar (geprüft am 2026-06-08, PHB S. 50–54)

**Rage Uses & Reset (`classResources.js`)**
- B1: Rage-Tabelle Lv20 → App: `Infinity` (∞), 2024: **6** (gleich Lv17). 2024 hat NICHT mehr unlimited Rage.
- B2: Reset → App: nur `long`, 2024: **Kurze Rast = 1 Use zurück**, Lange Rast = alle Uses zurück.
- B3: Rage-Damage-Skalierung fehlt komplett als Ressource. 2024: +2 (Lv1-8), +3 (Lv9-15), +4 (Lv16-20).

**Features pro Level (`classFeatures.js`)**
- B4: **Weapon Mastery** auf Lv1 fehlt — 2024 Core-Feature (2 Waffen, skaliert auf 3 bei Lv4, 4 bei Lv10).
- B5: **Primal Knowledge** auf Lv3 fehlt — extra Skill + Skills können STR-basiert geworfen werden im Rage.
- B6: **Instinctive Pounce** auf Lv7 fehlt — als Teil der Bonus-Aktion bei Rage-Start halbe Speed bewegen.
- B7: **Brutal Strike** (Lv9) komplett anders! App: "+1 Schadenswürfel auf Krit". 2024: Bei Reckless Attack auf Vorteil verzichten → +1d10 Bonus + Effekt (Forceful/Hamstring/Sundering Blow).
- B8: **Improved Brutal Strike** (Lv13 & Lv17) fehlt — zusätzliche Effekt-Optionen.
- B9: **Indomitable Might** (Lv18) anders. App: "STR × STR". 2024: Bei STR-Check Mindestwert = STR-Score.
- B10: **Epic Boon** (Lv19) fehlt — wählbares Boon-Feat.
- B11: **Primal Champion** (Lv20) Beschreibung. App: "+4 STR/CON, unbegrenzte Rage". 2024: +4 STR/CON (max 25), **KEINE unbegrenzte Rage**.

**Rage-Mechanik selbst (Beschreibung in `classFeatures.js` Lv1)**
- B12: App: "Anzahl = max(1, CON-Mod)" → 2024: Anzahl steht in Tabelle, NICHT mehr CON-basiert.
- B13: App nennt nur "Resistenz BPS + STR-Bonus" → 2024 hat zusätzlich: STR-Advantage auf Checks & Saves, keine Concentration, keine Spells, neue Dauer-Regel (1 Runde + Verlängerung, max 10 Min).
- B14: Rage-Ende-Bedingung. 2014: Incapacitated. 2024: Heavy Armor angelegt ODER Incapacitated (initial), bei Persistent Rage → erst bei **Unconscious**.

**Subclass-Namen (`subclasses.js`)** — separat zu prüfen
- B15: 2024-Namen: Path of the Berserker, Path of the Wild Heart, Path of the World Tree (NEU!), Path of the Zealot.
  - World Tree ist neu in 2024 — vorher Path of the Storm Herald / Path of the Ancestral Guardian / Path of the Battlerager etc.
- B16: **Reckless Attack** in App beschreibt korrekt das Vorteil-für-Vorteil-Geben-Prinzip ✓ (Lv2-Feature ist OK).

**Subklassen-Detail (PHB S.53–57)**
- B17: **Path of the Berserker** — App "Frenzy" Lv3 ist KOMPLETT FALSCH (App: Bonus-Aktion-Angriff + Exhaustion; 2024: bei Reckless Attack im Rage = +Xd6 auf 1. Treffer/Zug, KEIN Exhaustion). Retaliation Lv10 (App: Lv14), Intimidating Presence Lv14 (App: Lv10) — Reihenfolge VERTAUSCHT.
- B18: **Path of the Totem Warrior** in App ist 2014er — durch **Path of the Wild Heart** (2024) ersetzen. Animal Speaker Lv3 (Rituals: Beast Sense + Speak with Animals), Rage of the Wilds (Bear/Eagle/Wolf), Aspect of the Wilds Lv6, Nature Speaker Lv10, Power of the Wilds Lv14 (Falcon/Lion/Ram).
- B19: **Path of the World Tree** — KOMPLETT NEU 2024, fehlt in App. Lv3 Vitality of the Tree (Temp HP), Lv6 Branches (Teleport-Reaktion), Lv10 Battering Roots (+10 ft Reach mit Heavy/Versatile), Lv14 Travel Along Tree (60 ft / 150 ft Teleport).
- B20: **Path of the Zealot** — App-Features alle FALSCH ZUGEORDNET. 2024: Lv3 Divine Fury (+1d6 + ½ Lv Schaden NEC/RAD) + Warrior of the Gods (Heal-Pool 4×d12, skaliert). Lv6 Fanatical Focus (Save-Reroll 1×/Rage). Lv10 Zealous Presence (Bonus-Aktion: 10 Verbündete Advantage). Lv14 Rage Beyond Death.

### Barde (geprüft am 2026-06-08, PHB S. 58–61)

**Ressourcen (`classResources.js`)** — Bardic Inspiration
- BD-1: `formulaKey: "cha"` mit `max(1, chaMod)` ✓ KORREKT für 2024.
- BD-2: Reset `"short"` ✓ KORREKT (ab Lv5 Font of Inspiration regain bei Short ODER Long Rest).
- BD-3: 2024 Zusatz fehlt: Ab Lv5 kann auch ein Spell Slot eingesetzt werden (no action) → 1 Use Bardic Inspiration zurück. Nicht in App-Beschreibung.
- BD-4: Lv18 Superior Inspiration: Bei Initiative-Wurf wird Pool auf mindestens 2 aufgefüllt. Fehlt in App.

**Features pro Level (`classFeatures.js`)**
- BD-5: **Expertise** in App auf Lv3 → 2024 Lv2. FALSCH.
- BD-6: **"Rastlied"** (Song of Rest) auf Lv2 → in 2024 entfernt. Nicht mehr Klassen-Feature. RAUS.
- BD-7: **Jack of All Trades** auf Lv2 — App nennt es "Allrounder", korrekt ✓ (App hat es auf Lv2).
- BD-8: **Countercharm** in App auf Lv6 → 2024 Lv7. FALSCH (zudem Mechanik geändert: 2024 ist Reaction-Reroll mit Advantage, nicht Aura).
- BD-9: **Expertise (2 more skills)** auf Lv9 fehlt in App.
- BD-10: **Magical Secrets** Lv10: 2024-Mechanik ist anders — bei jedem Level-Up, wo Prepared Spells steigt, kann ein Spell aus Bard/Cleric/Druid/Wizard gewählt werden. App: "2 Zauber beliebiger Klasse" — vereinfacht.
- BD-11: Bardic Inspiration Die-Skalierung: App: W6/W8/W10/W12 auf Lv1/5/10/15 ✓ KORREKT mit 2024.
- BD-12: **Superior Inspiration** (Lv18) fehlt komplett.
- BD-13: **Epic Boon** (Lv19) fehlt.
- BD-14: **Words of Creation** (Lv20) fehlt — Power Word Heal & Kill als Always-Prepared + Dual-Target.

**Subklassen (`subclasses.js`)**
- BD-15: App hat: Schule des Wissens (Lore), Schule des Wagemuts (Valor). 2024 hat 4 Subklassen: **College of Dance (NEU), College of Glamour, College of Lore, College of Valor**.
  - Glamour und Dance komplett fehlen.
- BD-16: Lore-Detail in App: "Schneidende Worte" als Reaktion (1W8 abziehen) → in 2024: **Cutting Words** ist Lv3 (richtig), 2024-Version: 1W6 vom Angriff/Schaden/Save subtrahieren (skaliert mit Bardic Die). App-Beschreibung "1W8" stimmt für Bard Lv5 aber nicht statisch.

### Kleriker (geprüft am 2026-06-08, PHB S. 68–77)

**Ressourcen (`classResources.js`)**
- CL-1: Channel Divinity Uses: App **1/2/3** auf L2/L6/L18 → 2024: **2/3/4**. OFF-BY-ONE überall.
- CL-2: Channel Divinity Reset `"short"` ✓ KORREKT.
- CL-3: Divine Intervention `{ 10: 1, reset: "long" }` ✓ KORREKT bei Uses, aber Mechanik (siehe CL-9).

**Features pro Level (`classFeatures.js`)**
- CL-4: **Subclass-Level: App Lv1 → 2024 Lv3**. Cleric Subclass kommt 2024 erst auf Lv3 (war 2014 Lv1).
- CL-5: **Divine Order** Lv1 fehlt (Wahl: Protector = Martial + Heavy Armor, Thaumaturge = Bonus-Cantrip + Wis-Mod auf Arcana/Religion-Checks).
- CL-6: Lv5 "Untote zerstören CR ½" in App = 2014. 2024 hat **Sear Undead**: bei Turn Undead zusätzlich (Wis-Mod)d8 Strahlungsschaden auf alle die failen.
- CL-7: **Blessed Strikes** Lv7 fehlt (App hat das fälschlich als Subclass-Feature auf Lv8). 2024: Wahl Divine Strike (1d8 NEC/RAD bei Waffentreffer 1×/Zug) ODER Potent Spellcasting (+Wis-Mod auf Cantrip-Schaden).
- CL-8: **Improved Blessed Strikes** Lv14 fehlt (Divine Strike → 2d8; Potent → Temp HP nach Cantrip-Damage).
- CL-9: **Divine Intervention** Lv10 Mechanik. App: 2014 W100-Roll. 2024: Wirke einen Cleric-Spell ≤Lv5 ohne Slot/Komponenten als Action, 1×/Long Rest.
- CL-10: **Epic Boon** Lv19 fehlt.
- CL-11: **Greater Divine Intervention** Lv20: 2024 = Wish wirkbar mit 2d4 Long-Rest-Cooldown. App: "wirkt automatisch" — falsch.

**Subklassen (`subclasses.js`)**
- CL-12: 2024 Subklassen: **Life Domain, Light Domain, Trickery Domain, War Domain**. App hat: Life, Wissen, Krieg.
  - **Domäne des Wissens (Knowledge)** ist NICHT in 2024 PHB — entfernen oder auf "Legacy/2014" kennzeichnen.
  - **Light Domain** und **Trickery Domain** fehlen komplett.
- CL-13: Subklassen-`levelGained: 1` für alle 3 Cleric-Subklassen → muss auf **3** geändert werden (s. CL-4).

### Druide (geprüft am 2026-06-08, PHB S. 78–87)

**Ressourcen (`classResources.js`)**
- D-1: Wild Shape Uses: App konstant **2** ab Lv2 → 2024 staffel: **2 (L2)/3 (L6)/4 (L17)**. SKALIERUNG FEHLT.
- D-2: Wild Shape Reset `"short"` ✓ KORREKT (1 Use bei Short, alle bei Long Rest).

**Features pro Level (`classFeatures.js`)**
- D-3: **Subclass-Level: App Lv2 → 2024 Lv3**. Druid Subclass kommt 2024 erst auf Lv3 (war 2014 Lv2).
- D-4: **Primal Order** Lv1 fehlt (Wahl: Magician = Cantrip + Arcana/Nature bonus; Warden = Martial Weapons + Medium Armor).
- D-5: Wild Shape App-Beschreibung: "2× zwischen Kurzrasten: Bis CR 1/4, kein Schwimmen/Fliegen". 2024: **4 Known Forms** auf Lv2, **6 ab Lv4** (CR 1/2), **8 ab Lv8 (CR 1, mit Fly)**. Mechanik geändert: 2024 hat known-forms-Limit (statt CR-only).
- D-6: Lv2 **Wild Companion** fehlt (Bonus-Aktion Find Familiar via Spell Slot ODER Wild Shape Use).
- D-7: "Druidisch" Lv1: 2024 zusätzlich **Speak with Animals immer prepared**. Fehlt in App.
- D-8: **Wild Resurgence** Lv5 fehlt (Spell Slot → Wild Shape Use; oder umgekehrt 1×/Long Rest).
- D-9: **Elemental Fury** Lv7 fehlt (Wahl: Potent Spellcasting +Wis-Mod auf Cantrip OR Primal Strike +1d8 Cold/Fire/Lightning/Thunder).
- D-10: **Improved Elemental Fury** Lv15 fehlt (Potent: Cantrip-Range +300 ft; Primal: 2d8).
- D-11: Lv18 "Zeitloser Körper" + "Tiersprache" → 2024 hat dort **Beast Spells** (Zauber in Tiergestalt wirken). Timeless Body wurde in Archdruid (Lv20) integriert.
- D-12: **Epic Boon** Lv19 fehlt.
- D-13: Lv20 "Erzdruide / Unbegrenzte Tiergestalt" → 2024: **Archdruid** komplett anders (Evergreen Wild Shape bei Init, Convert WS in Spell Slots, Longevity). Keine "unbegrenzte" Nutzung mehr.

**Subklassen (`subclasses.js`)**
- D-14: 2024 Subklassen: **Circle of the Land, Circle of the Moon, Circle of the Sea (NEU), Circle of the Stars (NEU)**. App hat: Mond, Land. Sea + Stars fehlen.
- D-15: Subklassen-`levelGained: 2` muss auf **3** (s. D-3).
- D-16: Circle of the Moon Lv2-Detail "Tiergestalt bis CR Stufe÷3" — 2024: ab Lv3 Combat Wild Shape mit anderen Stats (Temp HP, Lunar Form Magie, etc.).

### Kämpfer (geprüft am 2026-06-08, PHB S. 90–99)

**Ressourcen**
- F-1: **Second Wind** App `{ 1: 1 }`. 2024: **L1: 2 Uses, L4: 3, L10: 4**, Reset short. Skalierung + Reset short fehlt.
- F-2: **Action Surge** App `{ 1: 1, 17: 2 }`, reset short. 2024: **L2: 1 (nicht L1!), L17: 2**, reset short. Off-by-one.
- F-3: **Indomitable** App `{ 9: 1, 13: 2, 17: 3 }`, reset long ✓ KORREKT.

**Features**
- F-4: L1 **Weapon Mastery** (3 Waffen) fehlt komplett. Skaliert auf 4@L4, 5@L9, 6@L16.
- F-5: L1 Fighting Style: 2024 als FEAT (re-wählbar nach jedem Long Rest). App nur Choice.
- F-6: L2 **Tactical Mind** fehlt (Second Wind verbrauchen: bei Ability-Check-Fail 1d10 dazu).
- F-7: L5 **Tactical Shift** fehlt (Bonus-Aktion Second Wind → halbe Speed ohne Opportunity Attacks).
- F-8: L9 **Tactical Master** fehlt (Push/Sap/Slow als Mastery-Property-Option).
- F-9: L13 **Studied Attacks** fehlt (Miss → Advantage auf nächsten Angriff gegen selben Gegner).
- F-10: L19 **Epic Boon** fehlt.

**Subklassen (`subclasses.js`)**
- F-11: 2024-Subklassen: Battle Master, Champion, **Eldritch Knight, Psi Warrior**. App: Champion, Kampfmeister (=BM). Eldritch Knight + Psi Warrior fehlen.

### Mönch (geprüft am 2026-06-08, PHB S. 100–107)

**Ressourcen**
- M-1: "Ki Points" → 2024 **Focus Points** (Fokuspunkte). Umbenennen.
- M-2: Anzahl-Skalierung App `{ 2: 2, ..., 20: 20 }` ✓ KORREKT (= Monk-Level ab Lv2).
- M-3: Reset short ✓ KORREKT.

**Features**
- M-4: L1 Martial Arts Die App: **W4** → 2024: **d6** (skaliert d6/d8/d10/d12 auf L1/5/11/17). FALSCH.
- M-5: L1 Martial Arts 2024 enthält **Dexterous Attacks** (DEX für Grapple/Shove DC) — fehlt in App-Beschreibung.
- M-6: L2 **Uncanny Metabolism** (NEU!) fehlt — Init-Roll: alle Focus Points zurück + d? HP heilen, 1×/Long Rest.
- M-7: L3 "Geschosse ablenken" → 2024 **Deflect Attacks** (für ALLE Angriffe inkl. Nahkampf, nicht nur Fernkampf).
- M-8: L4 **Slow Fall** fehlt komplett in App.
- M-9: L6 **Empowered Strikes** 2024 anders: 1 Focus expenden → +Martial Arts Die Force damage (App-Mechanik komplett anders).
- M-10: L9 **Acrobatic Movement** fehlt (Wand-/Wasser-Laufen ohne Fallen).
- M-11: L10 "Reinheit des Körpers" → 2024 **Heightened Focus** + **Self-Restoration**. Komplett ersetzen.
- M-12: L13 **Deflect Energy** fehlt.
- M-13: L14 "Diamantseele" → 2024 **Disciplined Survivor** (Save-Proficiency + Focus für Reroll).
- M-14: L15 **Perfect Focus** fehlt.
- M-15: L18 **Superior Defense** fehlt.
- M-16: L20 "Vollkommenes Selbst (4 Ki zurück)" → 2024 **Body and Mind** (+4 DEX, +4 WIS, max 25).

**Subklassen**
- M-17: 2024 Subklassen: **Warrior of Mercy (NEU), Warrior of Shadow, Warrior of the Elements, Warrior of the Open Hand**. App-Subklassen müssen erfasst werden.

### Paladin (geprüft am 2026-06-08, PHB S. 108–115)

**Ressourcen**
- P-1: **Lay on Hands** App `formulaKey: "level5x"` ✓ KORREKT (5×Level).
- P-2: **Channel Divinity** App nur Lv3 mit 1 Use ← 2024: **Lv3: 2 Uses, L11: 3 Uses**, Reset short. Anzahl + Skalierung fehlt.
- P-3: "divine_smite_slots" als separate Ressource → 2024: Smite **braucht Spell Slot wie 2014**, aber zusätzlich **Paladin's Smite Lv2 Feature** kann **Searing Smite ohne Slot** wirken (1×/Long Rest). Konzept verschoben.

**Features**
- P-4: L1 **Weapon Mastery** fehlt (2 Waffen).
- P-5: L1 "Göttlicher Sinn" → 2024 nur **Lay on Hands + Spellcasting + Weapon Mastery** auf Lv1. Divine Sense ist 2024 NICHT mehr Lv1-Feature.
- P-6: L2 Fighting Style App ✓ KORREKT.
- P-7: L2 **Paladin's Smite** (NEU): Searing Smite 1×/Long Rest ohne Slot — fehlt.
- P-8: L3 "Göttliche Gesundheit" → 2024 ENTFERNT (Immunität gegen Diseases kommt erst später via Aura).
- P-9: L3 **Channel Divinity** fehlt als Class-Feature (App hat nur als Resource).
- P-10: L5 **Faithful Steed** fehlt (Find Steed immer prepared, kein Slot nötig).
- P-11: L6 **Aura of Protection** App vermutlich vorhanden — verifizieren.
- P-12: L9 **Abjure Foes** fehlt (Channel Divinity option: 30ft Frighten oder Incapacitated).
- P-13: L11 **Radiant Strike** (NEU!) fehlt — +1d8 Radiant auf Angriffe (war 2014 "Improved Divine Smite" auf Lv11, jetzt ähnlich aber als separates Feature).
- P-14: L14 **Restoring Touch** fehlt (Lay on Hands kann auch Charmed/Frightened/Paralyzed/Stunned entfernen — App-Beschreibung knapp).
- P-15: L18 **Aura Expansion** fehlt (Auras 10ft → 30ft).
- P-16: L19 **Epic Boon** fehlt.

**Subklassen**
- P-17: 2024 Subklassen: **Oath of Devotion, Oath of Glory, Oath of the Ancients, Oath of Vengeance**. App-Subklassen müssen erfasst werden.

### Waldläufer / Ranger (geprüft am 2026-06-08, PHB S. 118–127)

**Ressourcen** — Ranger hat 2024 keine eigene Spell-Pool-Ressource, aber **Favored Enemy** zählt jetzt als Use-Pool für Hunter's Mark.
- R-1: 2024 **Favored Enemy** = Hunter's Mark prepared + free casts (skaliert 2/3/4/5 mit Lv). App: nur Beschreibungs-Text. Komplett überarbeiten.

**Features**
- R-2: L1 "Lieblingsfeind/Natürlicher Erkunder" → 2024 KOMPLETT ERSETZT durch **Favored Enemy (Hunter's Mark + free casts)** und **Weapon Mastery** (2 Waffen).
- R-3: L1 **Spellcasting** existiert in 2024 (Ranger castet ab Lv1!) — App-Feature auf Lv2. FALSCH.
- R-4: L2 **Deft Explorer** (NEU: Expertise + 2 Languages) fehlt.
- R-5: L2 Fighting Style App-Lv2 ✓ KORREKT.
- R-6: L6 **Roving** (+10 ft Speed, Climb/Swim) fehlt.
- R-7: L9 **Expertise** (2 weitere) fehlt.
- R-8: L10 **Tireless** (Temp HP-Pool + Exhaustion -1 per Short Rest) fehlt.
- R-9: L13 **Relentless Hunter** (HM Concentration immun gegen Damage) fehlt.
- R-10: L14 "Verschwinden" → 2024 **Nature's Veil** (Invisible Bonus-Aktion, Wis-Mod×/Long Rest). Mechanik präziser.
- R-11: L17 **Precise Hunter** (Advantage vs HM target) fehlt.
- R-12: L18 **Feral Senses** (Blindsight 30 ft) fehlt.
- R-13: L19 **Epic Boon** fehlt.
- R-14: L20 "Feindesleger (+CHA-Mod Schaden)" → 2024 **Foe Slayer** (HM-Würfel d10 statt d6).

**Subklassen**
- R-15: 2024 Subklassen: **Beast Master, Fey Wanderer (NEU), Gloom Stalker, Hunter**.

### Schurke / Rogue (geprüft am 2026-06-08, PHB S. 128–133)

**Features**
- RG-1: L1 Sneak Attack App "+1W6" ✓ KORREKT (1d6 base). Skalierung muss verifiziert werden (steigt alle 2 Lv).
- RG-2: L1 **Weapon Mastery** (2 Waffen) fehlt.
- RG-3: L2 Cunning Action App ✓ KORREKT.
- RG-4: L3 **Steady Aim** + **Cunning Strike** (NEU 2024!) fehlen. Cunning Strike opfert Sneak Attack-Würfel für Effekte (Daze, Knockout, Obscure, Trip, Withdraw).
- RG-5: L5 "Unverbesserlicher Instinkt" → 2024 **Uncanny Dodge** (App-Beschreibung ist falsch — Uncanny Dodge halbiert Schaden, nicht "Nachteil auf Angriffe").
- RG-6: L6 **Expertise** (2 weitere) fehlt.
- RG-7: L7 Evasion App ✓ KORREKT.
- RG-8: L7 **Reliable Talent** (in 2024 jetzt auf Lv7, war 2014 Lv11!) — App: Lv11. Off-by-4!
- RG-9: L11 **Improved Cunning Strike** (2 Effekte gleichzeitig) fehlt.
- RG-10: L14 **Devious Strikes** (NEU: weitere Cunning Strike-Optionen) fehlt — App hat "Blindheitssinn" auf L14 (gehört 2024 eher L18 Elusive Position).
- RG-11: L14 "Blindheitssinn" → 2024 KEIN Feature mehr (Blindsense gibt's, aber an anderer Stelle).
- RG-12: L15 Slippery Mind App ✓ KORREKT (Wis + Cha Save Profizienz).
- RG-13: L18 "Schwer zu fassen" → 2024 **Elusive** (Attack rolls vs you keine Advantage) — App-Beschreibung knapp.
- RG-14: L19 Epic Boon fehlt.
- RG-15: L20 "Glücksfall" → 2024 **Stroke of Luck** (Failed D20 Test → wird 20). App-Beschreibung OK aber knapp.

**Subklassen**
- RG-16: 2024 Subklassen: **Arcane Trickster, Assassin, Soulknife (NEU), Thief**.

### Zauberer / Sorcerer (geprüft am 2026-06-08, PHB S. 138–148)

**Ressourcen**
- S-1: Sorcery Points App `{ 2: 2, ..., 20: 20 }` ✓ KORREKT.
- S-2: Reset App `"long"` ✓ KORREKT, aber 2024 Sorcerous Restoration Lv5 gibt zusätzlich halbe SP nach Short Rest. Fehlt.

**Features**
- S-3: Subclass-Level: App Lv1 → 2024 Lv3. FALSCH.
- S-4: L1 **Innate Sorcery** fehlt (Bonus-Aktion: 1-Min-Buff, +1 Spell DC, Spell-Attack Advantage, 2×/Long Rest).
- S-5: L2 Font of Magic App ✓ KORREKT (Sorcery Points + Slot-Konversion).
- S-6: L2 **Metamagic** App-Position Lv3 → 2024 Lv2!
- S-7: L5 **Sorcerous Restoration** (halbe SP nach Short Rest, 1× pro Long Rest) fehlt.
- S-8: L7 **Sorcery Incarnate** (2 Metamagic gleichzeitig, 1 SP pro Stack) fehlt.
- S-9: L10 Metamagie (+1) App ✓ KORREKT.
- S-10: L17 Metamagic (+1) fehlt — App nennt es nicht.
- S-11: L19 Epic Boon fehlt.
- S-12: L20 **Arcane Apotheosis** (NEU 2024: während Innate Sorcery dürfen Metamagie ohne SP-Kosten gewählt werden) fehlt.

**Subklassen**
- S-13: 2024 Subklassen: **Aberrant Sorcery, Clockwork Sorcery, Draconic Sorcery, Wild Magic Sorcery**. App-Subklassen müssen erfasst werden.

### Hexenmeister / Warlock (geprüft am 2026-06-08, PHB S. 152–161)

**Ressourcen**
- WL-1: **Warlock Slots** App `{ 1: 1, 2: 2, 11: 3, 17: 4 }` reset short. 2024 Pact Magic skaliert: L1: 1, L2: 2, L11: 3, L17: 4 ✓ KORREKT.
- WL-2: **Eldritch Invocations** als Resource gezählt → 2024 ist das KEIN Use-Pool sondern Wahl bei Levelup. Kategorisierung verkehrt — sollte als "Choices" statt "Resource" laufen.

**Features**
- WL-3: L1 Patron (Subclass) App ✓ → 2024 ist Subclass auf Lv3, nicht Lv1!
- WL-4: L1 Pact Magic App ✓ KORREKT.
- WL-5: L2 **Magical Cunning** (NEU 2024!) fehlt — während Short Rest: halbe Pact-Slots zurück (1× pro Long Rest).
- WL-6: L2 Invocations (App: 2 Invocations) → 2024 hat Invocations-Tabelle: Lv1: 1, Lv2: 3, Lv5: 5, ... — Anzahl + Levels prüfen.
- WL-7: L3 **Pact Boon** → 2024 ist Pact Boon Teil des Subclass-Pakets, nicht eigenes Feature.
- WL-8: L11/13/15/17 Mystic Arcanum App ✓ KORREKT (1× pro Long Rest, Lv6/7/8/9).
- WL-9: L19 Epic Boon fehlt.
- WL-10: L20 "Magischer Meister" → 2024 **Eldritch Master** (Magical Cunning regain ALL pact slots — gut, aber Mechanik basiert auf Magical Cunning das in App fehlt).

**Subklassen**
- WL-11: 2024 Subklassen: **Archfey Patron, Celestial Patron (NEU PHB), Fiend Patron, Great Old One Patron**.

### Magier / Wizard (geprüft am 2026-06-08, PHB S. 162–166)

**Ressourcen**
- WZ-1: **Arcane Recovery** App ✓ KORREKT (1× pro langem Rest, halbe Level als Slot-Pool).

**Features**
- WZ-2: Subclass-Level: App Lv2 → 2024 Lv3! FALSCH.
- WZ-3: L1 **Ritual Adept** fehlt (Wizard kann JEDEN Spell mit Ritual-Tag aus Spellbook als Ritual wirken, ohne ihn prepared zu haben).
- WZ-4: L2 **Scholar** (NEU 2024!) fehlt — Expertise in einem von Arcana/History/Investigation/Medicine/Nature/Religion.
- WZ-5: L5 **Memorize Spell** (NEU 2024!) fehlt — 1× zwischen Long Rests: nach Short Rest eine prepared Spell tauschen.
- WZ-6: L18 Spell Mastery App ✓ KORREKT.
- WZ-7: L19 Epic Boon fehlt.
- WZ-8: L20 Signature Spells App ✓ KORREKT.

**Subklassen**
- WZ-9: 2024 Subklassen: **Abjurer, Diviner, Evoker, Illusionist**. Alle anderen Schulen (Necromancer, Conjurer, Enchanter, Transmuter) NICHT im 2024 PHB Core!

### Magieschmied / Artificer

- AR-1: **Artificer ist NICHT im 2024 PHB!** 2024 Core sind die 12 Klassen: Barbar, Barde, Kleriker, Druide, Kämpfer, Mönch, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.
- AR-2: Artificer bleibt 2014 (Tasha's Cauldron of Everything) bis Wizards eine 2024-Version released (laut Roadmap: vermutlich in Eberron 2025 oder als Free Online Release).
- AR-3: **Entscheidung nötig:** App-Artificer als "Legacy 2014" markieren ODER entfernen ODER warten auf 2024er Update.
