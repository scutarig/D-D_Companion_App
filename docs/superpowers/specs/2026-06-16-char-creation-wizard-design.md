# Char-Creation-Wizard — Design Spec

**Date:** 2026-06-16
**Status:** Approved (Brainstorming → Writing Plan next)
**Scope:** DnD_APP — D&D 5e PHB 2024 Char-Creation-Assistent

## 1. Goal

Add a guided multi-step character-creation wizard that follows the **PHB 2024 Chapter 1 procedure exactly**: Class → Origin (Background → Species) → Ability Scores → Alignment → Details. The wizard supports start-levels 1–20 via a level-up loop after the Lv1 setup, auto-saves progress on every interaction, and produces a fully filled-in character (no missing schema fields) when committed.

Also closes the existing schema gap: `char.alignment` is missing today and must be added (plus auxiliary detail fields: `age`, `sex`, `height`, `weight`, `deity`).

## 2. Confirmed Requirements (from brainstorming)

| Decision | Choice |
|---|---|
| Entry point | Replaces `+ Neu` completely. No more direct-default char. |
| Stat-Gen method | Point-Buy (27 pts) only |
| Equipment | User picks Pack A (items) vs Pack B (gold) per class **and** per background |
| Caster spells | Cantrips + Lv1 spells picked inside the wizard |
| Start-level | User picks 1–20; multi-level loop after Lv1 setup |
| Languages | Common + species default auto, Background-language via dropdown |
| Alignment | 3×3 grid with descriptions |
| Persistence | Auto-save on every change, Resume-banner on next entry |
| Shell layout | Full-screen takeover (sidebar/tabs hidden during wizard) |

## 3. Architecture

### 3.1 Top-level Integration

`App.jsx` adds one new top-level persistent state:

```js
const [wizardActive, setWizardActive] = usePersist("wizard_active_v1", null);
```

The render branch:

```
App.jsx
├─ if (wizardActive) → render <CharCreationWizard />  (full-screen, no sidebar)
└─ else              → existing layout (sidebar + tabs + CharArea)
```

`CharManager.jsx`'s `+ Neu` button does **not** call `newChar()` directly anymore. Instead it sets `wizardActive` to `initialWizardState()` (or shows the Resume-banner if a prior wizard state exists).

### 3.2 File Layout

```
src/components/CharWizard/
  CharCreationWizard.jsx        — Shell: step indicator + nav buttons + step container
  ResumeBanner.jsx              — Banner shown above + Neu when wizard_active_v1 exists
  steps/
    Step01_ClassSelect.jsx
    Step02_ClassSkills.jsx
    Step03_ClassChoices.jsx     — conditional (FightingStyle/Domain/etc.)
    Step04_Spellcasting.jsx     — conditional (casters only)
    Step05_ClassEquipment.jsx
    Step06_BackgroundSelect.jsx
    Step07_BackgroundASI.jsx    — +2/+1 or +1/+1/+1 distribution
    Step08_BackgroundChoices.jsx — conditional (tool/language picks)
    Step09_BackgroundEquipment.jsx
    Step10_SpeciesSelect.jsx
    Step11_SpeciesChoices.jsx   — conditional (Half-Elf, Tiefling, etc.)
    Step12_Abilities.jsx        — Point-Buy 27 pts
    Step13_Alignment.jsx        — 3×3 grid
    Step14_Personality.jsx      — name/age/sex/height/weight/deity + traits/ideals/bonds/flaws/backstory
    Step15_LevelUpLoop.jsx      — conditional (targetLevel > 1); one sub-page per level 2..N
    Step16_Review.jsx           — summary + "Charakter erstellen" button
  hooks/
    useWizardState.js           — { state, updatePartial, setStep, commit, abandon }
  utils/
    wizardSteps.js              — step flow registry + conditional logic
    pointBuyCosts.js            — { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 }
    buildCharFromWizard.js      — pure: (wizardState) → char object
    validateWizardState.js      — guard for corrupted resume state
  data/
    alignmentDescriptions.js    — 9 alignments × {de, en, summary}
```

### 3.3 Step Flow Registry

```js
const STEP_FLOW = [
  { id: "class_select",      component: Step01 },
  { id: "class_skills",      component: Step02 },
  { id: "class_choices",     component: Step03, when: s => hasClassLv1Choice(s.klass) },
  { id: "spellcasting",      component: Step04, when: s => isCasterClass(s.klass) },
  { id: "class_equipment",   component: Step05 },
  { id: "bg_select",         component: Step06 },
  { id: "bg_asi",            component: Step07 },
  { id: "bg_choices",        component: Step08, when: s => hasBgChoice(s.background) },
  { id: "bg_equipment",      component: Step09 },
  { id: "species_select",    component: Step10 },
  { id: "species_choices",   component: Step11, when: s => hasSpeciesChoice(s.race) },
  { id: "abilities",         component: Step12 },
  { id: "alignment",         component: Step13 },
  { id: "personality",       component: Step14 },
  { id: "levelup_loop",      component: Step15, when: s => s.targetLevel > 1, multi: true },
  { id: "review",            component: Step16 },
];
```

Skipped steps (`when` returns false) are removed from breadcrumb display and not visitable via ← Zurück.

## 4. Wizard State Shape

Persisted in `wizard_active_v1` via `usePersist`:

```js
{
  startedAt: 1781596149,
  targetLevel: 5,
  stepHistory: ["class_select","class_skills","class_equipment","bg_select"],
  currentStep: "bg_select",

  // Phase 1 — Class
  klass: "Magier",
  classSkillsChosen: ["Arcana","Investigation"],
  classChoices: { fightingStyle: "Defense" },   // shape varies per class
  cantripsChosen: ["fire_bolt","mage_hand","prestidigitation"],
  lv1SpellsChosen: ["mage_armor","magic_missile","shield"],
  classEquipmentChoice: "A",                     // "A" | "B"

  // Phase 2 — Origin
  background: "Sage",
  bgAsiMode: "2+1",                              // "2+1" | "1+1+1"
  bgAsiPicks: { INT: 2, WIS: 1 },
  bgChoices: { tool: null, language: "Elfisch" },
  bgEquipmentChoice: "A",
  race: "Elf",
  speciesChoices: { extraSkill: "Perception" },

  // Phase 3 — Stats (BEFORE Background-ASI is applied)
  abilityScores: { str:8, dex:14, con:14, int:15, wis:12, cha:10 },

  // Phase 4 — Alignment
  alignment: "NG",

  // Phase 5 — Details
  name: "Eldrin", age: "127", sex: "M", height: "5'8\"", weight: "140 lbs", deity: "",
  traits: "...", ideals: "...", bonds: "...", flaws: "...", backstory: "...",

  // Phase 6 — Level-Up Loop (one entry per level 2..targetLevel)
  levelupChoices: {
    2: { hp: "avg" },
    3: { hp: "avg", subclass: "Schule der Abjuration" },
    4: { hp: "avg", asi: { mode: "feat", feat: "Lucky" } },
    5: { hp: "avg", newSpellsKnown: ["fireball","counterspell"] }
  }
}
```

Derived values (HP, AC, PB, modifiers) are NOT stored — computed at commit time. Single source of truth = user choices.

## 5. Char-Schema Additions

`newChar()` in `src/utils/helpers.js` gains:

```js
alignment: "",        // "" | "LG"|"NG"|"CG"|"LN"|"N"|"CN"|"LE"|"NE"|"CE"
age: "",
sex: "",
height: "",
weight: "",
deity: "",
```

All 6 are blank-string by default for backwards compatibility with existing chars. PDF export (`utils/charPdf.js`) already references `traits`/`ideals`/etc.; the new fields will be added to the same Personality section.

## 6. Commit Logic (Step 16 → "Charakter erstellen")

Pure function `buildCharFromWizard(state) → char`:

```
1. char = newChar(id = Date.now())
2. char.klass, char.hd ← state.klass             // via getClassHd from multiclass.js
3. char.saves ← class default saves from D3_KLASSEN
4. char.skills ← {classSkills, bgSkills} as { skill_<Name>: true }
5. Persist spell IDs:
     localStorage `spells_known_<id>` ← cantrips + lv1 spells
     localStorage `spells_prep_<id>`  ← lv1 spells (cantrips are always-known)
6. char.inventory ← expandPack(class, choice) + expandPack(bg, choice)
   char.gold     ← +classGold(if B) +bgGold(if B)
7. char.background, char.originFeat ← background-data
8. char.race + char.speed + char.size + char.languages ← species-data + bgLanguage
9. char.{str/dex/con/int/wis/cha} ← pointBuy + bgAsiPicks
10. char.maxHp = HD-max + CON-mod                // Lv1 RAW
    char.hp    = char.maxHp
11. char.alignment ← state.alignment
12. char.{name,age,sex,height,weight,deity,traits,ideals,bonds,flaws,backstory} ← state.*
13. for lv in 2..targetLevel:
      char = applyLevelUp(char, state.levelupChoices[lv])
      // HP += HD-avg+CON, new features, subclass at Lv3, ASI at Lv4/8/12/16/19
14. setChars(prev => [...prev, char])
    setAid(char.id)
    setWizardActive(null)
```

`chars_v4` is **only** written at this final step. No partial-char pollution from abandoned wizards.

## 7. Multi-Level Loop Detail

Step 15 is not one screen — it's a sub-wizard with one screen per level from 2 to `targetLevel`. Reuses the visual pattern of the existing `LevelUpAssistant` component (HP gain, new features list, choices on right).

Rules:
- **HP gain**: PHB 2024 average roll (HD-average + CON-mod). E.g. Lv2 Kämpfer (d10) with CON+2 → 6+2 = 8 HP. Stored as `hp: "avg"` in `levelupChoices[lv]`.
- **Subclass pick**: At Lv3 (PHB 2024 normalized all classes to Lv3). User picks from `data/subclasses.js[klass]`.
- **ASI / Feat**: At Lv4, 8, 12, 16, 19 for all classes. **Additionally** Fighter at Lv6+14, Rogue at Lv10 (class-extra ASI levels). Choice between +2 to one ability, +1/+1 to two abilities, or a feat from PHB 2024 feat list.
- **Spell upgrades**: For prepared casters, the prep-count grows; for "spells-known" casters (e.g. Sorcerer in 2024 if applicable), user picks new spells from class list.

## 8. Resume Behavior

On `+ Neu` click, `CharManager.jsx` checks `wizard_active_v1`:

- **null** → start fresh: `setWizardActive(initialWizardState())`
- **non-null** → show banner above current view:

```
┌────────────────────────────────────────────────────────┐
│ 🔄 Du hast eine unfertige Char-Erstellung              │
│    Eldrin · Magier (Lv 5)                              │
│    Stand: Schritt 7 von 16 · gestartet vor 2 Std       │
│                                                        │
│    [ ▶ Fortsetzen ]    [ 🗑 Verwerfen & neu ]         │
└────────────────────────────────────────────────────────┘
```

"Verwerfen" sets `wizard_active_v1` to a fresh initial state. "Fortsetzen" sets `wizardActive` (same value), which triggers the full-screen render.

## 9. Validation Per Step

Each step component exports a pure validator:

```js
// Step01_ClassSelect.jsx
export const validate = (s) => s.klass
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_class" };
```

Wizard shell calls this before allowing →Weiter. Failed validation greys out the button and shows a tooltip with the localized error string.

## 10. Error Handling

| Failure | Behavior |
|---|---|
| Corrupted wizard state on resume | `validateWizardState(state)` returns `{ok:false}` → banner: "Wizard-Stand konnte nicht geladen werden. Neu starten." → reset to null. No crash. |
| Missing data lookup (e.g. background renamed) | Step picker shows "⚠ Unbekannt — bitte neu wählen". Cannot advance until valid. |
| Step-index out-of-bounds (skipped by changed conditional) | Router auto-advances to next valid step + shows toast. |
| Commit failure (localStorage quota) | Caught try/catch → modal with link to char-backup-tool. Wizard state preserved. |
| Browser reload mid-edit | Worst case 1 unsaved keystroke; `usePersist` writes synchronously on every setState. |

## 11. i18n Strategy

- New namespace: `wizard.s<N>.*` (per step) + `wizard.shell.*` (nav/buttons) + `wizard.err_*` (validation errors)
- Estimated ~120 new keys × 2 languages (DE+EN)
- Data-driven labels (classes, species, backgrounds, spells, feats) come from existing `data/*.js` files which already have `de`/`en` fields
- Parity audit hook: extend the i18n-integrity check to verify `wizard.*` key coverage in both languages

## 12. Testing — Manual Smoke Paths

| Path | Class | Background | Species | Start-Lv | Validates |
|---|---|---|---|---|---|
| Happy-Caster | Magier | Sage | Hochelf | 1 | Spellbook gets 3 cantrips + 6 lv1 spells; INT/WIS bonuses applied |
| Happy-Martial | Kämpfer | Soldat | Mensch | 1 | Equipment Pack A in inventory; FightingStyle stored |
| Multi-Level | Paladin | Acolyte | Aasimar | 5 | 4 LevelUp screens; Subclass at Lv3; ASI at Lv4 |
| Resume | Druide | Hermit | Halbling | 3 | Reload mid-Step-8 → exact resume position |

Each path is verified via `preview_eval` browser tests: no console errors, no i18n fallthrough, fields land in expected `char.*` slots.

## 13. Mobile UX (Viewport <820px)

- Step indicator collapses to "Schritt 7 / 16: Background"
- Picker cards become 1-column with ≥44px touch targets
- ← Zurück / → Weiter buttons stick to bottom edge
- Alignment grid stays 3×3 but uses short codes (LG/NG/CG/...)
- Spell-picker filters move to chips above list (not sidebar)
- Cancel on mobile returns to Übersicht tab

## 14. Out of Scope

- Background-ASI variant **not** auto-computed when species also gives ASI bonus (PHB 2024 species don't give ASI in 2024 rules — this is a 2014 carry-over not relevant)
- Custom-built / homebrew classes/species
- Importing a wizard state from a file
- Multi-character batch creation
- DM-tool: roll random characters

## 15. Acceptance Criteria

1. `+ Neu` triggers wizard, not direct `newChar()` insert.
2. Wizard guides through PHB 2024 order: Class → Background → Species → Stats → Alignment → Details → (Level-up loop) → Review.
3. Alignment becomes a stored char field; PDF export uses it.
4. Resume after closing browser mid-wizard works for any step.
5. Generated char has: class skills, class equipment, background skills + tool/lang + equipment, species traits, point-buy + bg-ASI stats, alignment, all personality fields filled in.
6. Multi-level start (e.g. Lv5) produces a char with HP totals and class features matching PHB tables.
7. All wizard strings have DE + EN parity.
8. Mobile (375px) is functional end-to-end.
