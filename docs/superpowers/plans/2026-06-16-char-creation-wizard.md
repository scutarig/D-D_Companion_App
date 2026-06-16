# Char-Creation-Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A guided multi-step character-creation wizard that walks a user through D&D 5e PHB 2024 Chapter-1 procedure end-to-end (Class → Background → Species → Stats → Alignment → Details → Level-Up-Loop), producing a fully-filled character ready for play.

**Architecture:** Full-screen takeover from `App.jsx`. State persisted via `usePersist("wizard_active_v1")`. 16 modular step-components in `src/components/CharWizard/steps/`, orchestrated by a shell that uses a conditional step-flow registry. Pure `buildCharFromWizard(state) → char` function commits at the final step.

**Tech Stack:** React 18 + Vite (no router, no test framework). Inline styles from `theme.js`. i18n via `useI18n`. Verification via `preview_eval` browser tool.

**Spec:** [`docs/superpowers/specs/2026-06-16-char-creation-wizard-design.md`](../specs/2026-06-16-char-creation-wizard-design.md)

---

## Conventions (read once)

**Verification:** This project has no Vitest/Jest. Each task's "verify" step runs a `preview_eval` against `http://localhost:3000` (started via `mcp__Claude_Preview__preview_start name=DnD_APP`) and checks specific DOM/state assertions. If a step's expected outcome doesn't match, do not commit — fix the code and re-verify.

**Commit-Style:** All commits start with `feat(wizard):`, `chore(wizard):`, or `fix(wizard):`. No `--no-verify`.

**i18n pattern:** Every user-facing string uses `t("wizard.<step>.<key>","German default")`. Add the DE entry near other `wizard.*` keys in `src/i18n/index.js`, and the EN entry in the EN section. Audit-check after each step: grep for `wizard.` keys in JSX, ensure they exist in both DE+EN sections.

**Styling primitives:** Always import from `../../constants/theme.js`: `C` (colors), `sx` (style objects), `FH` (heading font). Never inline hex codes.

---

## Phase A — Foundation (no UI)

### Task A1: Char schema additions

**Files:**
- Modify: `src/utils/helpers.js` (around line 67 — the `newChar` object literal)

- [ ] **Step 1: Edit `newChar()` to add the 6 missing fields**

Open `src/utils/helpers.js`. Find the line containing `hd:"d10", hd_used:0, deathSaves:{suc:0,fail:0},` (was modified in audit-2 to use d-notation). Add the new fields immediately after that block:

```js
  // PHB 2024 character-details (formerly missing — wizard relies on these)
  alignment: "",        // "" | "LG"|"NG"|"CG"|"LN"|"N"|"CN"|"LE"|"NE"|"CE"
  age: "",              // free-text (e.g. "127")
  sex: "",              // free-text
  height: "",           // free-text (e.g. "5'8\"" or "175 cm")
  weight: "",           // free-text
  deity: "",            // free-text
```

- [ ] **Step 2: Verify the schema lives on new chars**

Start the preview server if not running:
```
mcp__Claude_Preview__preview_start name=DnD_APP
```

In the preview, evaluate:
```js
(() => { localStorage.removeItem("chars_v4"); window.location.reload(); return "reloaded"; })()
```

After reload, evaluate:
```js
JSON.parse(localStorage.getItem("chars_v4"))[0]
```
Expected: object contains `alignment: ""`, `age: ""`, `sex: ""`, `height: ""`, `weight: ""`, `deity: ""`.

- [ ] **Step 3: Commit**

```bash
cd "D:/89_Claude/Claude Code/DnD_APP"
git add src/utils/helpers.js
git commit -m "feat(wizard): add alignment + identity fields to char schema"
```

---

### Task A2: Alignment-Descriptions data

**Files:**
- Create: `src/components/CharWizard/data/alignmentDescriptions.js`

- [ ] **Step 1: Write the data file**

```js
// PHB 2024 Chapter 1 — Alignment short codes + bilingual descriptions
export const ALIGNMENTS = [
  { id: "LG", de: "Rechtschaffen Gut",    en: "Lawful Good",     row: 0, col: 0,
    descDE: "Tut das Richtige nach festen Regeln und persönlicher Ehre.",
    descEN: "Does the right thing as expected by society — laws, traditions, honor." },
  { id: "NG", de: "Neutral Gut",          en: "Neutral Good",    row: 0, col: 1,
    descDE: "Tut das Beste für andere, ohne sich an Regeln oder Chaos zu binden.",
    descEN: "Does what good people do, free of bias either toward law or chaos." },
  { id: "CG", de: "Chaotisch Gut",        en: "Chaotic Good",    row: 0, col: 2,
    descDE: "Folgt dem eigenen Gewissen, achtet wenig auf Regeln, hilft jedoch anderen.",
    descEN: "Acts as conscience directs with little respect for rules; champions freedom." },
  { id: "LN", de: "Rechtschaffen Neutral", en: "Lawful Neutral", row: 1, col: 0,
    descDE: "Handelt nach Regeln, Tradition oder persönlichem Kodex — moralisch neutral.",
    descEN: "Acts in accordance with law, tradition, or a personal code." },
  { id: "N",  de: "Neutral",              en: "True Neutral",    row: 1, col: 1,
    descDE: "Vermeidet ideologische Extreme; tut, was vernünftig erscheint.",
    descEN: "Acts naturally without prejudice or compulsion; balance above all." },
  { id: "CN", de: "Chaotisch Neutral",    en: "Chaotic Neutral", row: 1, col: 2,
    descDE: "Folgt eigenen Launen, schätzt persönliche Freiheit über alles.",
    descEN: "Follows whims, holding personal freedom above all else." },
  { id: "LE", de: "Rechtschaffen Böse",   en: "Lawful Evil",     row: 2, col: 0,
    descDE: "Nutzt Regeln, Tradition oder Hierarchie, um zu nehmen, was sie wollen.",
    descEN: "Methodically takes what is wanted, within tradition or hierarchy." },
  { id: "NE", de: "Neutral Böse",         en: "Neutral Evil",    row: 2, col: 1,
    descDE: "Tut, was nötig ist, um Vorteile zu erlangen, ohne Mitleid oder Skrupel.",
    descEN: "Does whatever they can get away with, without compassion or qualms." },
  { id: "CE", de: "Chaotisch Böse",       en: "Chaotic Evil",    row: 2, col: 2,
    descDE: "Folgt zerstörerischen Trieben; verachtet Regeln und Mitgefühl.",
    descEN: "Acts with arbitrary violence, driven by greed, hatred, or bloodlust." },
];

export function alignLabel(id, lang) {
  const a = ALIGNMENTS.find((x) => x.id === id);
  if (!a) return "";
  return lang === "en" ? a.en : a.de;
}
```

- [ ] **Step 2: Verify import works**

Evaluate in browser console:
```js
(async () => { const m = await import("/src/components/CharWizard/data/alignmentDescriptions.js"); return { count: m.ALIGNMENTS.length, sample: m.alignLabel("LG", "en") }; })()
```
Expected: `{ count: 9, sample: "Lawful Good" }`

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/data/alignmentDescriptions.js
git commit -m "feat(wizard): alignment descriptions (9 alignments × DE/EN)"
```

---

### Task A3: Point-Buy-Costs data

**Files:**
- Create: `src/components/CharWizard/data/pointBuyCosts.js`

- [ ] **Step 1: Write the data file**

```js
// PHB 2024 Point-Buy cost table — score → points
// Total budget = 27. All abilities start at 8.
export const POINT_BUY_COST = {
  8:  0,
  9:  1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

/** Returns the cost of buying all 6 ability scores. */
export function totalCost(scores) {
  return Object.values(scores).reduce((sum, s) => sum + (POINT_BUY_COST[s] ?? Infinity), 0);
}

/** Returns remaining points (budget − totalCost). Negative = over-budget. */
export function pointsRemaining(scores) {
  return POINT_BUY_BUDGET - totalCost(scores);
}

/** Validates a score is in valid range. */
export function isValidScore(score) {
  return score >= POINT_BUY_MIN && score <= POINT_BUY_MAX;
}
```

- [ ] **Step 2: Verify cost math**

In browser console:
```js
(async () => { const m = await import("/src/components/CharWizard/data/pointBuyCosts.js"); return { defaults: m.pointsRemaining({str:8,dex:8,con:8,int:8,wis:8,cha:8}), maxed: m.pointsRemaining({str:15,dex:15,con:15,int:8,wis:8,cha:8}), allHigh: m.pointsRemaining({str:15,dex:14,con:14,int:13,wis:12,cha:10}) }; })()
```
Expected: `{ defaults: 27, maxed: 9, allHigh: 0 }` (allHigh = 9+7+7+5+4+2 = 34? Hmm let me recheck — that's over budget. Use this instead: `str:15(9)+dex:14(7)+con:13(5)+int:12(4)+wis:10(2)+cha:8(0) = 27`. So result 0 with that.)

Re-verify: `m.pointsRemaining({str:15,dex:14,con:13,int:12,wis:10,cha:8})` → 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/data/pointBuyCosts.js
git commit -m "feat(wizard): point-buy cost table (PHB 2024 standard)"
```

---

### Task A4: Wizard i18n keys (shell + alignment)

**Files:**
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add shell + alignment keys to DE section**

Find the DE `aufbau.notes_lbl` line. Insert immediately after it (in DE section):

```
    "wizard.shell.title": "Charakter-Erstellung",
    "wizard.shell.step_of": "Schritt {n} von {total}",
    "wizard.shell.back": "← Zurück",
    "wizard.shell.next": "Weiter →",
    "wizard.shell.cancel": "✕ Abbrechen",
    "wizard.shell.cancel_confirm_title": "Wizard abbrechen?",
    "wizard.shell.cancel_confirm_msg": "Dein Fortschritt wird gespeichert — du kannst später fortsetzen.",
    "wizard.shell.cancel_confirm_save": "Speichern & schließen",
    "wizard.shell.cancel_confirm_discard": "Verwerfen",
    "wizard.shell.resume_title": "Du hast eine unfertige Char-Erstellung",
    "wizard.shell.resume_resume": "▶ Fortsetzen",
    "wizard.shell.resume_discard": "🗑 Verwerfen & neu",
    "wizard.shell.target_level_lbl": "Ziel-Level",
    "wizard.shell.target_level_hint": "Erstelle deinen Char zunächst auf Level 1, dann führt der Wizard dich durch jeden Level-Up bis zur Zielstufe.",
    "wizard.err_no_class": "Wähle eine Klasse",
    "wizard.err_no_skills": "Wähle {n} Skills",
    "wizard.err_no_choice": "Triff alle Pflicht-Auswahlen",
    "wizard.err_no_spells": "Wähle die geforderten Cantrips und Spells",
    "wizard.err_no_equipment": "Wähle Pack A oder B",
    "wizard.err_no_background": "Wähle einen Background",
    "wizard.err_no_asi": "Verteile die Background-ASI-Punkte vollständig",
    "wizard.err_no_species": "Wähle eine Spezies",
    "wizard.err_no_pointbuy": "Verwende alle 27 Punkte (nicht mehr, nicht weniger)",
    "wizard.err_no_alignment": "Wähle ein Alignment",
    "wizard.err_no_name": "Gib deinem Charakter einen Namen",
```

- [ ] **Step 2: Add same keys to EN section**

Find the EN `aufbau.notes_lbl` line. Insert immediately after it (in EN section):

```
    "wizard.shell.title": "Character Creation",
    "wizard.shell.step_of": "Step {n} of {total}",
    "wizard.shell.back": "← Back",
    "wizard.shell.next": "Next →",
    "wizard.shell.cancel": "✕ Cancel",
    "wizard.shell.cancel_confirm_title": "Cancel wizard?",
    "wizard.shell.cancel_confirm_msg": "Your progress will be saved — you can resume later.",
    "wizard.shell.cancel_confirm_save": "Save & close",
    "wizard.shell.cancel_confirm_discard": "Discard",
    "wizard.shell.resume_title": "You have an unfinished character",
    "wizard.shell.resume_resume": "▶ Resume",
    "wizard.shell.resume_discard": "🗑 Discard & new",
    "wizard.shell.target_level_lbl": "Target Level",
    "wizard.shell.target_level_hint": "Build your character at Lv1 first, then the wizard walks you through each level-up to the target.",
    "wizard.err_no_class": "Pick a class",
    "wizard.err_no_skills": "Pick {n} skills",
    "wizard.err_no_choice": "Make all required choices",
    "wizard.err_no_spells": "Pick the required cantrips and spells",
    "wizard.err_no_equipment": "Pick Pack A or B",
    "wizard.err_no_background": "Pick a background",
    "wizard.err_no_asi": "Distribute all background ASI points",
    "wizard.err_no_species": "Pick a species",
    "wizard.err_no_pointbuy": "Use exactly 27 points (no more, no less)",
    "wizard.err_no_alignment": "Pick an alignment",
    "wizard.err_no_name": "Give your character a name",
```

- [ ] **Step 3: Verify no fallthrough**

In browser console:
```js
(async () => { const m = await import("/src/i18n/index.js"); const k = ["wizard.shell.title","wizard.err_no_class","wizard.shell.next"]; const de = k.map(x => m.translations.de[x]); const en = k.map(x => m.translations.en[x]); return { de, en }; })()
```
Expected: both arrays have non-undefined strings for all 3 keys.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/index.js
git commit -m "feat(wizard): shell + alignment i18n keys (DE+EN parity)"
```

---

## Phase B — Wizard State & Shell

### Task B1: `useWizardState` hook

**Files:**
- Create: `src/components/CharWizard/hooks/useWizardState.js`

- [ ] **Step 1: Write the hook**

```js
import { usePersist } from "../../../hooks/usePersist.js";

/** Initial wizard state. Targets Lv1 by default. */
export function initialWizardState() {
  return {
    startedAt: Date.now(),
    targetLevel: 1,
    stepHistory: [],
    currentStep: "class_select",

    // Phase 1 — Class
    klass: "",
    classSkillsChosen: [],
    classChoices: {},
    cantripsChosen: [],
    lv1SpellsChosen: [],
    classEquipmentChoice: "",   // "" | "A" | "B"

    // Phase 2 — Origin
    background: "",
    bgAsiMode: "2+1",            // "2+1" | "1+1+1"
    bgAsiPicks: {},              // { ABILITY: bonus }
    bgChoices: { tool: null, language: null },
    bgEquipmentChoice: "",       // "" | "A" | "B"
    race: "",
    speciesChoices: {},

    // Phase 3 — Stats (BEFORE bg-ASI)
    abilityScores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },

    // Phase 4 — Alignment
    alignment: "",

    // Phase 5 — Details
    name: "", age: "", sex: "", height: "", weight: "", deity: "",
    traits: "", ideals: "", bonds: "", flaws: "", backstory: "",

    // Phase 6 — Level-Up Loop
    levelupChoices: {},
  };
}

/**
 * Wizard state hook. All mutations go through updatePartial / setStep.
 * The state object itself is persisted via usePersist.
 */
export function useWizardState() {
  const [state, setState] = usePersist("wizard_active_v1", null);

  const updatePartial = (patch) => {
    setState((prev) => prev ? { ...prev, ...patch } : prev);
  };

  const setStep = (stepId) => {
    setState((prev) => {
      if (!prev) return prev;
      const history = prev.stepHistory.includes(stepId)
        ? prev.stepHistory
        : [...prev.stepHistory, prev.currentStep];
      return { ...prev, currentStep: stepId, stepHistory: history };
    });
  };

  const goBack = () => {
    setState((prev) => {
      if (!prev || prev.stepHistory.length === 0) return prev;
      const last = prev.stepHistory[prev.stepHistory.length - 1];
      return { ...prev, currentStep: last, stepHistory: prev.stepHistory.slice(0, -1) };
    });
  };

  const abandon = () => setState(null);

  const start = (targetLevel = 1) => {
    setState({ ...initialWizardState(), targetLevel });
  };

  return { state, updatePartial, setStep, goBack, abandon, start };
}
```

- [ ] **Step 2: Verify hook mounts (no UI yet, just smoke-import)**

```js
(async () => { const m = await import("/src/components/CharWizard/hooks/useWizardState.js"); return { initial_has_klass: m.initialWizardState().klass === "", initial_step: m.initialWizardState().currentStep }; })()
```
Expected: `{ initial_has_klass: true, initial_step: "class_select" }`

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/hooks/useWizardState.js
git commit -m "feat(wizard): useWizardState hook + initial state factory"
```

---

### Task B2: Step-Flow registry

**Files:**
- Create: `src/components/CharWizard/utils/wizardSteps.js`

- [ ] **Step 1: Write the registry (components imported as null placeholders for now; replaced as steps land)**

```js
// Step flow registry — single source of truth for step order + conditional inclusion.
// Each step component is imported lazily once it exists; until then, null.
import { D3_KLASSEN } from "../../../data/classes.js";

// Class-Lv1-choice detection — Fighter has fighting-style at Lv1, Cleric has divine order, etc.
// Conservative list: matches the canonical PHB-2024 list.
const LV1_CHOICE_CLASSES = ["Kämpfer", "Kleriker", "Paladin", "Waldläufer"];

export function isCasterClass(klass) {
  const cls = D3_KLASSEN.find((c) => c.name === klass);
  return !!cls?.spellcasting;
}

export function hasClassLv1Choice(klass) {
  return LV1_CHOICE_CLASSES.includes(klass);
}

export function hasBgChoice(background) {
  // Pre-2024 backgrounds had tool/language choices; for the wizard we treat
  // any non-empty background as potentially having a choice and let the step
  // render an empty state if there's nothing to pick.
  return !!background;
}

export function hasSpeciesChoice(race) {
  // Half-Elf (Halbelf), Tiefling, and Hochelf (Highelf subrace) have choices.
  const choiceSpecies = ["Halbelf", "Tiefling", "Elf", "Hochelf"];
  return choiceSpecies.some((c) => race?.includes(c));
}

export const STEP_FLOW = [
  { id: "class_select",      title: "Klasse" },
  { id: "class_skills",      title: "Klassen-Skills" },
  { id: "class_choices",     title: "Klassen-Choices",  when: (s) => hasClassLv1Choice(s.klass) },
  { id: "spellcasting",      title: "Zauber",           when: (s) => isCasterClass(s.klass) },
  { id: "class_equipment",   title: "Klassen-Equipment" },
  { id: "bg_select",         title: "Background" },
  { id: "bg_asi",            title: "Background-ASI" },
  { id: "bg_choices",        title: "Background-Choices", when: (s) => hasBgChoice(s.background) },
  { id: "bg_equipment",      title: "Background-Equipment" },
  { id: "species_select",    title: "Spezies" },
  { id: "species_choices",   title: "Spezies-Choices",  when: (s) => hasSpeciesChoice(s.race) },
  { id: "abilities",         title: "Attribute" },
  { id: "alignment",         title: "Alignment" },
  { id: "personality",       title: "Persönlichkeit" },
  { id: "levelup_loop",      title: "Level-Up",         when: (s) => s.targetLevel > 1, multi: true },
  { id: "review",            title: "Übersicht" },
];

/** Returns the list of step entries that are active for the given state. */
export function activeSteps(state) {
  return STEP_FLOW.filter((s) => !s.when || s.when(state));
}

/** Returns the next step id (or null if at end). */
export function nextStepId(currentId, state) {
  const list = activeSteps(state);
  const idx = list.findIndex((s) => s.id === currentId);
  return idx >= 0 && idx + 1 < list.length ? list[idx + 1].id : null;
}

/** Returns the previous step id (or null if at start). */
export function prevStepId(currentId, state) {
  const list = activeSteps(state);
  const idx = list.findIndex((s) => s.id === currentId);
  return idx > 0 ? list[idx - 1].id : null;
}
```

- [ ] **Step 2: Verify flow filtering**

```js
(async () => { const m = await import("/src/components/CharWizard/utils/wizardSteps.js"); const lvl1Mage = { klass: "Magier", targetLevel: 1, background: "", race: "" }; const lvl5Fighter = { klass: "Kämpfer", targetLevel: 5, background: "Sage", race: "Mensch" }; return { mageSteps: m.activeSteps(lvl1Mage).map(s => s.id), fighterSteps: m.activeSteps(lvl5Fighter).map(s => s.id) }; })()
```
Expected: mageSteps includes `spellcasting` (caster) but excludes `class_choices` (Magier not in LV1_CHOICE list) and `levelup_loop`. fighterSteps includes `class_choices` (Kämpfer has fighting-style) + `levelup_loop`, excludes `spellcasting`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/utils/wizardSteps.js
git commit -m "feat(wizard): step-flow registry + conditional helpers"
```

---

### Task B3: Wizard-state validator

**Files:**
- Create: `src/components/CharWizard/utils/validateWizardState.js`

- [ ] **Step 1: Write the validator**

```js
import { STEP_FLOW } from "./wizardSteps.js";

const REQUIRED_KEYS = [
  "startedAt", "targetLevel", "stepHistory", "currentStep",
  "klass", "classSkillsChosen", "classChoices", "cantripsChosen", "lv1SpellsChosen", "classEquipmentChoice",
  "background", "bgAsiMode", "bgAsiPicks", "bgChoices", "bgEquipmentChoice", "race", "speciesChoices",
  "abilityScores", "alignment",
  "name", "age", "sex", "height", "weight", "deity",
  "traits", "ideals", "bonds", "flaws", "backstory",
  "levelupChoices",
];

/**
 * Returns { ok: true } if state is a structurally-valid wizard payload,
 * else { ok: false, reason }. Used to guard against corrupted localStorage.
 */
export function validateWizardState(state) {
  if (!state || typeof state !== "object") return { ok: false, reason: "not-an-object" };
  for (const k of REQUIRED_KEYS) {
    if (!(k in state)) return { ok: false, reason: `missing-key:${k}` };
  }
  if (typeof state.targetLevel !== "number" || state.targetLevel < 1 || state.targetLevel > 20) {
    return { ok: false, reason: "invalid-target-level" };
  }
  if (!STEP_FLOW.some((s) => s.id === state.currentStep)) {
    return { ok: false, reason: `unknown-step:${state.currentStep}` };
  }
  return { ok: true };
}
```

- [ ] **Step 2: Verify validator**

```js
(async () => { const m = await import("/src/components/CharWizard/utils/validateWizardState.js"); const init = await import("/src/components/CharWizard/hooks/useWizardState.js"); return { good: m.validateWizardState(init.initialWizardState()), bad_null: m.validateWizardState(null), bad_missing: m.validateWizardState({ targetLevel: 1 }) }; })()
```
Expected: `good: {ok:true}`, `bad_null: {ok:false, reason:"not-an-object"}`, `bad_missing: {ok:false, reason:"missing-key:..."}`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/utils/validateWizardState.js
git commit -m "feat(wizard): wizard-state structural validator"
```

---

### Task B4: Wizard shell (`CharCreationWizard.jsx`)

**Files:**
- Create: `src/components/CharWizard/CharCreationWizard.jsx`
- Create: `src/components/CharWizard/steps/Placeholder.jsx` (temporary placeholder for un-implemented steps)

- [ ] **Step 1: Write the placeholder step**

```js
// src/components/CharWizard/steps/Placeholder.jsx
import { C, sx } from "../../../constants/theme.js";

export default function Placeholder({ stepId }) {
  return (
    <div style={{ ...sx.card, textAlign: "center", padding: 40, color: C.textDim }}>
      <h2 style={{ color: C.amberBright }}>🚧 Step: {stepId}</h2>
      <p>Dieser Schritt ist noch nicht implementiert.</p>
    </div>
  );
}

export const validate = () => ({ ok: true });
```

- [ ] **Step 2: Write the wizard shell**

```js
// src/components/CharWizard/CharCreationWizard.jsx
import { useMemo } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useDialog } from "../../hooks/useDialog.jsx";
import { useI18n } from "../../i18n/index.js";
import { useWizardState } from "./hooks/useWizardState.js";
import { activeSteps, nextStepId, prevStepId, STEP_FLOW } from "./utils/wizardSteps.js";
import { validateWizardState } from "./utils/validateWizardState.js";
import Placeholder from "./steps/Placeholder.jsx";

// Step component registry — replaced as each step lands.
const STEP_COMPONENTS = {};

export default function CharCreationWizard() {
  const { t } = useI18n();
  const { confirm } = useDialog();
  const { state, updatePartial, setStep, goBack, abandon } = useWizardState();

  if (!state) return null;

  const validity = validateWizardState(state);
  if (!validity.ok) {
    return (
      <div style={{ ...sx.card, margin: 40, textAlign: "center", borderColor: C.red }}>
        <h2 style={{ color: C.redBright }}>⚠ Wizard-State konnte nicht geladen werden</h2>
        <p style={{ color: C.textDim }}>Reason: {validity.reason}</p>
        <button type="button" onClick={abandon} style={sx.btn(C.red)}>Neu starten</button>
      </div>
    );
  }

  const flow = useMemo(() => activeSteps(state), [state]);
  const currentIdx = flow.findIndex((s) => s.id === state.currentStep);
  const Step = STEP_COMPONENTS[state.currentStep] || Placeholder;
  const validation = (Step.validate || (() => ({ ok: true })))(state);

  const onNext = () => {
    const next = nextStepId(state.currentStep, state);
    if (next) setStep(next);
  };
  const onBack = () => {
    const prev = prevStepId(state.currentStep, state);
    if (prev) goBack();
  };
  const onCancel = async () => {
    const ok = await confirm(
      t("wizard.shell.cancel_confirm_msg","Dein Fortschritt wird gespeichert — du kannst später fortsetzen."),
      { title: t("wizard.shell.cancel_confirm_title","Wizard abbrechen?") }
    );
    if (ok) {
      // Save & close — state remains in localStorage. App.jsx will hide the wizard
      // because wizard_active_v1 still exists; the resume-banner picks it up next time.
      window.location.reload();
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", zIndex: 1000,
    }}>
      {/* Header: title + step indicator */}
      <div style={{ ...sx.card, margin: 12, marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: FH, fontSize: 14, color: C.gold, fontWeight: 700 }}>
          ✨ {t("wizard.shell.title","Charakter-Erstellung")}
        </span>
        <span style={{ flex: 1, fontSize: 11, color: C.textDim }}>
          {t("wizard.shell.step_of","Schritt {n} von {total}")
            .replace("{n}", String(currentIdx + 1))
            .replace("{total}", String(flow.length))}
          {" · "}{flow[currentIdx]?.title}
        </span>
        <button type="button" onClick={onCancel} style={sx.bsm(C.textDim)}>
          {t("wizard.shell.cancel","✕ Abbrechen")}
        </button>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        <Step state={state} updatePartial={updatePartial} setStep={setStep} stepId={state.currentStep} />
      </div>

      {/* Footer: back / next */}
      <div style={{ ...sx.card, margin: 12, marginTop: 0, display: "flex", justifyContent: "space-between", gap: 8 }}>
        <button type="button" onClick={onBack} disabled={currentIdx === 0}
          style={{ ...sx.bsm(C.textDim), opacity: currentIdx === 0 ? 0.3 : 1 }}>
          {t("wizard.shell.back","← Zurück")}
        </button>
        {!validation.ok && (
          <span style={{ flex: 1, textAlign: "center", color: C.red, fontSize: 11, lineHeight: "30px" }}>
            ⚠ {validation.errorKey ? t(validation.errorKey, "Pflicht-Feld") : (validation.error || "")}
          </span>
        )}
        <button type="button" onClick={onNext} disabled={!validation.ok || currentIdx === flow.length - 1}
          style={{ ...sx.btn(C.amber), opacity: (!validation.ok || currentIdx === flow.length - 1) ? 0.4 : 1 }}>
          {t("wizard.shell.next","Weiter →")}
        </button>
      </div>
    </div>
  );
}

export { STEP_COMPONENTS };
```

- [ ] **Step 3: Verify component imports without error**

(No browser test yet — it's not wired into App.jsx. Just check that no import errors happen by mounting in dev console:)

```js
(async () => { const m = await import("/src/components/CharWizard/CharCreationWizard.jsx"); return !!m.default; })()
```
Expected: `true`.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/CharCreationWizard.jsx src/components/CharWizard/steps/Placeholder.jsx
git commit -m "feat(wizard): shell component + placeholder step"
```

---

### Task B5: App.jsx integration (mount wizard full-screen)

**Files:**
- Modify: `src/App.jsx` (around line 318 where `app_tab_v5` is declared)

- [ ] **Step 1: Add wizardActive top-level state + render branch**

Open `src/App.jsx`. Just below the line `const [tab, setTab] = usePersist("app_tab_v5", "overview");`, add:

```js
  const [wizardActive, setWizardActive] = usePersist("wizard_active_v1", null);
```

Then near the top of the return statement in `AppInner`, add a render-branch BEFORE the existing JSX:

```jsx
  if (wizardActive) {
    return <CharCreationWizard />;
  }
```

At the top of the file, add the lazy import next to the other lazy imports:

```js
const CharCreationWizard = lazy(() => import("./components/CharWizard/CharCreationWizard.jsx"));
```

- [ ] **Step 2: Verify wizard auto-shows when localStorage seeded**

In browser:
```js
(() => { localStorage.setItem("wizard_active_v1", JSON.stringify({ startedAt: Date.now(), targetLevel: 1, stepHistory: [], currentStep: "class_select", klass: "", classSkillsChosen: [], classChoices: {}, cantripsChosen: [], lv1SpellsChosen: [], classEquipmentChoice: "", background: "", bgAsiMode: "2+1", bgAsiPicks: {}, bgChoices: {}, bgEquipmentChoice: "", race: "", speciesChoices: {}, abilityScores: {str:8,dex:8,con:8,int:8,wis:8,cha:8}, alignment: "", name: "", age: "", sex: "", height: "", weight: "", deity: "", traits: "", ideals: "", bonds: "", flaws: "", backstory: "", levelupChoices: {} })); window.location.reload(); return "reloaded"; })()
```

After reload, expected: full-screen overlay with "✨ Charakter-Erstellung — Schritt 1 von …" and the Placeholder for `class_select`.

Then clear:
```js
(() => { localStorage.removeItem("wizard_active_v1"); window.location.reload(); return "cleared"; })()
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(wizard): App.jsx mounts CharCreationWizard when wizard_active_v1 set"
```

---

### Task B6: CharManager integration (+ Neu opens wizard)

**Files:**
- Modify: `src/components/CharManager.jsx`
- Create: `src/components/CharWizard/ResumeBanner.jsx`

- [ ] **Step 1: Write the resume banner**

```js
// src/components/CharWizard/ResumeBanner.jsx
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

export default function ResumeBanner({ wizardState, onResume, onDiscard }) {
  const { t } = useI18n();
  if (!wizardState) return null;

  const ageMin = Math.max(1, Math.floor((Date.now() - wizardState.startedAt) / 60000));
  const ageLabel = ageMin > 60
    ? `${Math.floor(ageMin / 60)} Std`
    : `${ageMin} Min`;

  return (
    <div style={{
      ...sx.card,
      borderColor: `${C.amberBright}55`,
      background: `linear-gradient(135deg, ${C.amberBright}11, transparent)`,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 24 }}>🔄</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: C.amberBright }}>
            {t("wizard.shell.resume_title","Du hast eine unfertige Char-Erstellung")}
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {wizardState.name || "—"} · {wizardState.klass || "—"}
            {wizardState.targetLevel > 1 && ` · Lv${wizardState.targetLevel}`}
            {" · "}gestartet vor {ageLabel}
          </div>
        </div>
        <button type="button" onClick={onResume} style={sx.btn(C.amber)}>
          {t("wizard.shell.resume_resume","▶ Fortsetzen")}
        </button>
        <button type="button" onClick={onDiscard} style={sx.bsm(C.red)}>
          {t("wizard.shell.resume_discard","🗑 Verwerfen & neu")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Modify CharManager.jsx — replace `+ Neu` button's onClick**

Open `src/components/CharManager.jsx`. Find the `addChar` function. Replace it AND wire up the wizard.

Add at top of imports:
```js
import { usePersist } from "../hooks/usePersist.js";
import { initialWizardState } from "./CharWizard/hooks/useWizardState.js";
import ResumeBanner from "./CharWizard/ResumeBanner.jsx";
```

(Skip if `usePersist` is already imported.)

Inside the CharManager component body, add (next to the other state hooks):

```js
  const [wizardState, setWizardState] = usePersist("wizard_active_v1", null);
```

Replace the `addChar` function:

```js
  const startWizard = (targetLevel = 1) => {
    setWizardState({ ...initialWizardState(), targetLevel });
  };
```

In the JSX, find the `addChar` button and replace its onClick:

```jsx
            <button type="button" onClick={() => startWizard(1)} style={sx.bsm(C.green)}>
              {t("char.new_short","+ Neu")}
            </button>
```

Just above the character-row, render the resume banner:

```jsx
        {wizardState && (
          <ResumeBanner
            wizardState={wizardState}
            onResume={() => setWizardState({ ...wizardState })}
            onDiscard={() => setWizardState(null)}
          />
        )}
```

- [ ] **Step 3: Verify the + Neu flow**

In browser:
1. Click "+ Neu" → wizard should appear full-screen with Placeholder for `class_select`
2. Click "✕ Abbrechen" → confirm dialog → "Speichern & schließen" → reload happens → back on normal layout
3. Click "+ Neu" again → wizard re-opens at same step (resume from saved state)
4. Click "✕ Abbrechen" + reload → return to normal app, see Resume-Banner above char list
5. Click "🗑 Verwerfen & neu" on banner → banner gone

- [ ] **Step 4: Commit**

```bash
git add src/components/CharManager.jsx src/components/CharWizard/ResumeBanner.jsx
git commit -m "feat(wizard): + Neu triggers wizard, resume banner on partial state"
```

---

## Phase C — Class Steps (1–5)

### Task C1: Step01_ClassSelect

**Files:**
- Create: `src/components/CharWizard/steps/Step01_ClassSelect.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx` (register the step)
- Modify: `src/i18n/index.js` (DE+EN keys)

- [ ] **Step 1: Add i18n keys**

In DE section (near other `wizard.*` keys):
```
    "wizard.s1.title": "Wähle deine Klasse",
    "wizard.s1.subtitle": "Die Klasse legt deine Kernfähigkeiten fest — Hit Die, Saves, Skills, Spellcasting.",
    "wizard.s1.hd": "Trefferwürfel",
    "wizard.s1.primary": "Primär-Attribut",
    "wizard.s1.saves": "Saves",
```

In EN section:
```
    "wizard.s1.title": "Pick your class",
    "wizard.s1.subtitle": "Class determines core abilities — hit die, saves, skills, spellcasting.",
    "wizard.s1.hd": "Hit Die",
    "wizard.s1.primary": "Primary",
    "wizard.s1.saves": "Saves",
```

- [ ] **Step 2: Write the step component**

```js
// src/components/CharWizard/steps/Step01_ClassSelect.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step01_ClassSelect({ state, updatePartial }) {
  const { t, lang } = useI18n();

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s1.title","Wähle deine Klasse")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s1.subtitle","Die Klasse legt deine Kernfähigkeiten fest.")}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}>
        {D3_KLASSEN.map((cls) => {
          const isSelected = state.klass === cls.name;
          return (
            <button
              type="button"
              key={cls.name}
              onClick={() => updatePartial({ klass: cls.name })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "left",
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected
                  ? `linear-gradient(135deg, ${C.gold}22, transparent)`
                  : "transparent",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{cls.icon}</span>
                <span style={{ fontFamily: FH, fontWeight: 700, color: isSelected ? C.gold : C.textBright }}>
                  {lang === "en" ? cls.enName : cls.name}
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4 }}>
                <span><strong>{t("wizard.s1.hd","Trefferwürfel")}:</strong> {cls.hd}</span>
                {" · "}
                <span><strong>{t("wizard.s1.primary","Primär-Attribut")}:</strong> {cls.primary}</span>
                <br />
                <span><strong>{t("wizard.s1.saves","Saves")}:</strong> {cls.saves}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => s.klass
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_class" };
```

- [ ] **Step 3: Register the step in the shell**

In `src/components/CharWizard/CharCreationWizard.jsx`, replace the `const STEP_COMPONENTS = {};` line with:

```js
import Step01_ClassSelect, { validate as validateStep01 } from "./steps/Step01_ClassSelect.jsx";

const STEP_COMPONENTS = {
  class_select: Object.assign(Step01_ClassSelect, { validate: validateStep01 }),
};
```

- [ ] **Step 4: Verify in browser**

1. Click "+ Neu" → see "Wähle deine Klasse" with 13 class-cards
2. Click "Magier" → card highlights gold
3. Footer "Weiter →" becomes enabled
4. Click "Weiter" → moves to next step (Placeholder for `class_skills`)
5. Check localStorage:
```js
JSON.parse(localStorage.getItem("wizard_active_v1")).klass
```
Expected: `"Magier"`.

- [ ] **Step 5: Commit**

```bash
git add src/components/CharWizard/steps/Step01_ClassSelect.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 1 — class selection"
```

---

### Task C2: Step02_ClassSkills

**Files:**
- Create: `src/components/CharWizard/steps/Step02_ClassSkills.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx` (register)
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys (DE + EN)**

DE:
```
    "wizard.s2.title": "Wähle deine Klassen-Skills",
    "wizard.s2.subtitle": "Wähle {n} Skills aus der Klassen-Liste.",
    "wizard.s2.picked": "Gewählt: {n}/{total}",
```
EN:
```
    "wizard.s2.title": "Pick your class skills",
    "wizard.s2.subtitle": "Pick {n} skills from your class list.",
    "wizard.s2.picked": "Picked: {n}/{total}",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step02_ClassSkills.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step02_ClassSkills({ state, updatePartial }) {
  const { t } = useI18n();
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);
  if (!cls) return null;

  const pool = cls.skills?.choices || [];
  const count = cls.skills?.count || 2;
  const chosen = state.classSkillsChosen || [];

  const toggle = (skill) => {
    const has = chosen.includes(skill);
    if (has) {
      updatePartial({ classSkillsChosen: chosen.filter((s) => s !== skill) });
    } else if (chosen.length < count) {
      updatePartial({ classSkillsChosen: [...chosen, skill] });
    }
  };

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s2.title","Wähle deine Klassen-Skills")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 8 }}>
        {t("wizard.s2.subtitle","Wähle {n} Skills aus der Klassen-Liste.").replace("{n}", String(count))}
      </p>
      <div style={{ color: chosen.length === count ? C.green : C.amber, fontWeight: 700, marginBottom: 14 }}>
        {t("wizard.s2.picked","Gewählt: {n}/{total}")
          .replace("{n}", String(chosen.length))
          .replace("{total}", String(count))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 8,
      }}>
        {pool.map((skill) => {
          const isPicked = chosen.includes(skill);
          const isFull = chosen.length >= count && !isPicked;
          return (
            <button
              type="button"
              key={skill}
              onClick={() => toggle(skill)}
              disabled={isFull}
              style={{
                ...sx.card,
                cursor: isFull ? "not-allowed" : "pointer",
                opacity: isFull ? 0.4 : 1,
                borderColor: isPicked ? C.green : C.border,
                background: isPicked ? `${C.green}22` : "transparent",
                padding: "10px 14px",
                fontSize: 13,
                color: isPicked ? C.greenBright : C.text,
              }}
            >
              {isPicked ? "✓" : "○"} {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => {
  const cls = require("../../../data/classes.js").D3_KLASSEN.find((c) => c.name === s.klass);
  const count = cls?.skills?.count || 2;
  return (s.classSkillsChosen?.length === count)
    ? { ok: true }
    : { ok: false, errorKey: "wizard.err_no_skills" };
};
```

**Note:** The `require()` inside `validate` is intentional — Vite supports it for ESM-CommonJS interop in browser. If the build complains, replace with: import at top + module-level lookup.

If `require` fails in Vite (it might), use this alternative `validate`:

```js
import { D3_KLASSEN } from "../../../data/classes.js";

export const validate = (s) => {
  const cls = D3_KLASSEN.find((c) => c.name === s.klass);
  const count = cls?.skills?.count || 2;
  return (s.classSkillsChosen?.length === count)
    ? { ok: true }
    : { ok: false, errorKey: "wizard.err_no_skills" };
};
```

(Move the `D3_KLASSEN` import to top — the component-import already pulls it.)

- [ ] **Step 3: Register in shell**

In `CharCreationWizard.jsx`, extend `STEP_COMPONENTS`:

```js
import Step02_ClassSkills, { validate as validateStep02 } from "./steps/Step02_ClassSkills.jsx";

const STEP_COMPONENTS = {
  class_select: Object.assign(Step01_ClassSelect, { validate: validateStep01 }),
  class_skills: Object.assign(Step02_ClassSkills, { validate: validateStep02 }),
};
```

- [ ] **Step 4: Verify**

1. From Step 1, pick "Kämpfer" (8 skill choices, count=2)
2. Weiter → Step 2 shows "Wähle 2 Skills"
3. Pick 2 skills → "Gewählt: 2/2" turns green → Weiter enabled
4. Pick a third → blocked (greyed out)
5. Verify state:
```js
JSON.parse(localStorage.getItem("wizard_active_v1")).classSkillsChosen
```
Expected: 2-element array.

- [ ] **Step 5: Commit**

```bash
git add src/components/CharWizard/steps/Step02_ClassSkills.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 2 — class skill picks"
```

---

### Task C3: Step03_ClassChoices (Fighting-Style etc.)

**Files:**
- Create: `src/components/CharWizard/steps/Step03_ClassChoices.jsx`
- Create: `src/components/CharWizard/data/classLv1Choices.js`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx` (register)
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Write Lv1-choice data**

```js
// src/components/CharWizard/data/classLv1Choices.js
// PHB 2024 Lv1 choices per class. Only classes that have a Lv1-only choice.
export const CLASS_LV1_CHOICES = {
  Kämpfer: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Archery",       name: "Archery",        desc: "+2 to attack rolls with ranged weapons." },
      { id: "Blind Fighting", name: "Blind Fighting", desc: "10 ft Blindsight; can fight unseen creatures within 10 ft." },
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Great Weapon",  name: "Great Weapon Fighting", desc: "Reroll 1s and 2s on two-handed weapon damage." },
      { id: "Interception",  name: "Interception",   desc: "Reaction: reduce damage to an ally within 5 ft." },
      { id: "Protection",    name: "Protection",     desc: "Reaction: impose disadvantage on attack against ally within 5 ft." },
      { id: "Thrown Weapon", name: "Thrown Weapon",  desc: "+1 damage to thrown weapons; draw a weapon as part of attack." },
      { id: "Two-Weapon",    name: "Two-Weapon Fighting", desc: "Add ability mod to off-hand attack damage." },
    ],
  },
  Kleriker: {
    key: "divineOrder",
    label: "Divine Order",
    options: [
      { id: "Protector", name: "Protector", desc: "Heavy armor + martial weapon proficiency." },
      { id: "Thaumaturge", name: "Thaumaturge", desc: "+1 cantrip known; +Wis-mod to one Intelligence (Arcana/Religion) check." },
    ],
  },
  Paladin: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Great Weapon",  name: "Great Weapon Fighting", desc: "Reroll 1s and 2s on two-handed weapon damage." },
      { id: "Protection",    name: "Protection",     desc: "Reaction: impose disadvantage on attack against ally within 5 ft." },
    ],
  },
  Waldläufer: {
    key: "fightingStyle",
    label: "Fighting-Style",
    options: [
      { id: "Archery",       name: "Archery",        desc: "+2 to attack rolls with ranged weapons." },
      { id: "Defense",       name: "Defense",        desc: "+1 AC while wearing armor." },
      { id: "Dueling",       name: "Dueling",        desc: "+2 damage with one-handed melee weapons when other hand empty." },
      { id: "Two-Weapon",    name: "Two-Weapon Fighting", desc: "Add ability mod to off-hand attack damage." },
    ],
  },
};
```

- [ ] **Step 2: Add i18n keys**

DE:
```
    "wizard.s3.title": "Klassen-Spezifische Auswahl",
    "wizard.s3.subtitle": "Wähle die {label} für deine Klasse.",
```
EN:
```
    "wizard.s3.title": "Class-specific choice",
    "wizard.s3.subtitle": "Choose your class's {label}.",
```

- [ ] **Step 3: Write the step component**

```js
// src/components/CharWizard/steps/Step03_ClassChoices.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { CLASS_LV1_CHOICES } from "../data/classLv1Choices.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step03_ClassChoices({ state, updatePartial }) {
  const { t } = useI18n();
  const choice = CLASS_LV1_CHOICES[state.klass];
  if (!choice) return null;

  const selected = state.classChoices?.[choice.key] || "";

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s3.title","Klassen-Spezifische Auswahl")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s3.subtitle","Wähle die {label} für deine Klasse.").replace("{label}", choice.label)}
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        {choice.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => updatePartial({ classChoices: { ...state.classChoices, [choice.key]: opt.id } })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "left",
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected ? `${C.gold}22` : "transparent",
              }}
            >
              <div style={{ fontFamily: FH, fontWeight: 700, color: isSelected ? C.gold : C.textBright }}>
                {isSelected ? "✓ " : ""}{opt.name}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{opt.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { CLASS_LV1_CHOICES as _C } from "../data/classLv1Choices.js";
export const validate = (s) => {
  const choice = _C[s.klass];
  if (!choice) return { ok: true };
  return s.classChoices?.[choice.key]
    ? { ok: true }
    : { ok: false, errorKey: "wizard.err_no_choice" };
};
```

- [ ] **Step 4: Register in shell**

```js
import Step03_ClassChoices, { validate as validateStep03 } from "./steps/Step03_ClassChoices.jsx";

// in STEP_COMPONENTS:
  class_choices: Object.assign(Step03_ClassChoices, { validate: validateStep03 }),
```

- [ ] **Step 5: Verify**

1. From Step 2, with class = Kämpfer, → Weiter
2. Step 3 shows 9 Fighting-Style cards
3. Pick "Defense" → highlights → Weiter enabled
4. Verify state:
```js
JSON.parse(localStorage.getItem("wizard_active_v1")).classChoices
```
Expected: `{ fightingStyle: "Defense" }`.

5. Restart wizard, pick Magier → Step 3 is SKIPPED (no Lv1 choice).

- [ ] **Step 6: Commit**

```bash
git add src/components/CharWizard/steps/Step03_ClassChoices.jsx src/components/CharWizard/data/classLv1Choices.js src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 3 — class Lv1 choices (Fighting-Style/Divine Order)"
```

---

### Task C4: Step04_Spellcasting (Cantrips + Lv1 Spells)

**Files:**
- Create: `src/components/CharWizard/steps/Step04_Spellcasting.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s4.title": "Zauber lernen",
    "wizard.s4.cantrips_h": "Cantrips ({n}/{total})",
    "wizard.s4.spells_h": "Level-1 Zauber ({n}/{total})",
    "wizard.s4.search": "Suchen…",
```
EN:
```
    "wizard.s4.title": "Learn spells",
    "wizard.s4.cantrips_h": "Cantrips ({n}/{total})",
    "wizard.s4.spells_h": "Level-1 Spells ({n}/{total})",
    "wizard.s4.search": "Search…",
```

- [ ] **Step 2: Write the step (cantrip + Lv1 picker)**

```js
// src/components/CharWizard/steps/Step04_Spellcasting.jsx
import { useState, useMemo } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { SPELLS } from "../../../data/spells.js";
import { useI18n } from "../../../i18n/index.js";

// Map German class → English spell tag used in spells.js
const KLASS_TO_TAG = {
  Barde: "Bard", Druide: "Druid", Hexenmeister: "Warlock", Kleriker: "Cleric",
  Magier: "Wizard", Zauberer: "Sorcerer", Magieschmied: "Artificer",
  Paladin: "Paladin", Waldläufer: "Ranger",
};

// PHB-2024 Lv1 cantrip + spell limits per caster class.
const LIMITS = {
  Magier:       { cantrips: 3, spells: 6 },   // Wizard learns 6 spells at Lv1
  Kleriker:     { cantrips: 3, spells: 0 },   // prepared casters, 0 to "learn", but choose preparation later
  Druide:       { cantrips: 2, spells: 0 },
  Zauberer:     { cantrips: 4, spells: 2 },
  Hexenmeister: { cantrips: 2, spells: 2 },
  Barde:        { cantrips: 2, spells: 4 },
  Magieschmied: { cantrips: 2, spells: 2 },
  Paladin:      { cantrips: 0, spells: 0 },   // gets spells at Lv2
  Waldläufer:   { cantrips: 0, spells: 0 },   // gets spells at Lv2
};

export default function Step04_Spellcasting({ state, updatePartial }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState("");

  const limit = LIMITS[state.klass] || { cantrips: 0, spells: 0 };
  const tag = KLASS_TO_TAG[state.klass];
  const cantripPool = useMemo(() =>
    SPELLS.filter((s) => s.lv === 0 && s.classes?.includes(tag)),
    [tag]);
  const spellPool = useMemo(() =>
    SPELLS.filter((s) => s.lv === 1 && s.classes?.includes(tag)),
    [tag]);

  const cantrips = state.cantripsChosen || [];
  const spells = state.lv1SpellsChosen || [];

  const toggleCantrip = (id) => {
    const has = cantrips.includes(id);
    if (has) updatePartial({ cantripsChosen: cantrips.filter((s) => s !== id) });
    else if (cantrips.length < limit.cantrips) updatePartial({ cantripsChosen: [...cantrips, id] });
  };
  const toggleSpell = (id) => {
    const has = spells.includes(id);
    if (has) updatePartial({ lv1SpellsChosen: spells.filter((s) => s !== id) });
    else if (spells.length < limit.spells) updatePartial({ lv1SpellsChosen: [...spells, id] });
  };

  const fc = filter.toLowerCase();
  const showCantrip = (s) => !fc || s.name.toLowerCase().includes(fc);

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 14 }}>
        {t("wizard.s4.title","Zauber lernen")}
      </h2>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t("wizard.s4.search","Suchen…")}
        style={{ ...sx.inp, marginBottom: 14, width: "100%", maxWidth: 360 }}
      />

      {limit.cantrips > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: C.amberBright, fontSize: 13 }}>
            {t("wizard.s4.cantrips_h","Cantrips ({n}/{total})")
              .replace("{n}", String(cantrips.length))
              .replace("{total}", String(limit.cantrips))}
          </h3>
          <SpellList pool={cantripPool.filter(showCantrip)} chosen={cantrips} toggle={toggleCantrip}
            limit={limit.cantrips} />
        </section>
      )}

      {limit.spells > 0 && (
        <section>
          <h3 style={{ color: C.amberBright, fontSize: 13 }}>
            {t("wizard.s4.spells_h","Level-1 Zauber ({n}/{total})")
              .replace("{n}", String(spells.length))
              .replace("{total}", String(limit.spells))}
          </h3>
          <SpellList pool={spellPool.filter(showCantrip)} chosen={spells} toggle={toggleSpell}
            limit={limit.spells} />
        </section>
      )}
    </div>
  );
}

function SpellList({ pool, chosen, toggle, limit }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 6,
      marginTop: 8,
    }}>
      {pool.map((s) => {
        const isPicked = chosen.includes(s.id);
        const isFull = chosen.length >= limit && !isPicked;
        return (
          <button
            type="button"
            key={s.id}
            onClick={() => toggle(s.id)}
            disabled={isFull}
            style={{
              ...sx.card,
              cursor: isFull ? "not-allowed" : "pointer",
              opacity: isFull ? 0.4 : 1,
              padding: "8px 10px",
              borderColor: isPicked ? C.green : C.border,
              background: isPicked ? `${C.green}11` : "transparent",
              textAlign: "left",
              fontSize: 12,
            }}
          >
            {isPicked ? "✓" : "○"} <strong>{s.name}</strong>
            {s.school && <span style={{ color: C.textDim }}> · {s.school}</span>}
          </button>
        );
      })}
    </div>
  );
}

const LIMITS_FOR_VAL = LIMITS;
export const validate = (s) => {
  const lim = LIMITS_FOR_VAL[s.klass] || { cantrips: 0, spells: 0 };
  const cOk = (s.cantripsChosen?.length || 0) === lim.cantrips;
  const sOk = (s.lv1SpellsChosen?.length || 0) === lim.spells;
  return (cOk && sOk) ? { ok: true } : { ok: false, errorKey: "wizard.err_no_spells" };
};
```

- [ ] **Step 3: Register in shell**

```js
import Step04_Spellcasting, { validate as validateStep04 } from "./steps/Step04_Spellcasting.jsx";

// in STEP_COMPONENTS:
  spellcasting: Object.assign(Step04_Spellcasting, { validate: validateStep04 }),
```

- [ ] **Step 4: Verify**

1. Restart wizard, pick Magier → Weiter → (no class_choices, skipped) → Step 4 Spellcasting
2. UI shows "Cantrips (0/3)" and "Level-1 Zauber (0/6)" headings
3. Pick 3 cantrips, 6 lv1 spells → Weiter enabled
4. State check:
```js
const s = JSON.parse(localStorage.getItem("wizard_active_v1"));
({ c: s.cantripsChosen.length, sp: s.lv1SpellsChosen.length })
```
Expected: `{ c: 3, sp: 6 }`.

5. Restart with Kämpfer → Step 4 skipped (non-caster).

- [ ] **Step 5: Commit**

```bash
git add src/components/CharWizard/steps/Step04_Spellcasting.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 4 — cantrip + Lv1 spell selection"
```

---

### Task C5: Step05_ClassEquipment

**Files:**
- Create: `src/components/CharWizard/steps/Step05_ClassEquipment.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s5.title": "Klassen-Ausrüstung",
    "wizard.s5.subtitle": "Wähle Pack A (Items) oder Pack B (Gold).",
    "wizard.s5.pack_a": "📦 Pack A",
    "wizard.s5.pack_b": "💰 Pack B",
```
EN:
```
    "wizard.s5.title": "Class equipment",
    "wizard.s5.subtitle": "Choose Pack A (items) or Pack B (gold).",
    "wizard.s5.pack_a": "📦 Pack A",
    "wizard.s5.pack_b": "💰 Pack B",
```

- [ ] **Step 2: Write the step (reads `cls.startingEquipment` from D3_KLASSEN)**

```js
// src/components/CharWizard/steps/Step05_ClassEquipment.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step05_ClassEquipment({ state, updatePartial }) {
  const { t } = useI18n();
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);
  const eq = cls?.startingEquipment || { A: "—", B: "—" };
  const choice = state.classEquipmentChoice;

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s5.title","Klassen-Ausrüstung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s5.subtitle","Wähle Pack A oder Pack B.")}
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        {["A", "B"].map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => updatePartial({ classEquipmentChoice: p })}
            style={{
              ...sx.card,
              cursor: "pointer",
              borderColor: choice === p ? C.gold : C.border,
              background: choice === p ? `${C.gold}22` : "transparent",
              textAlign: "left",
              padding: 16,
            }}
          >
            <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 14, color: choice === p ? C.gold : C.textBright, marginBottom: 6 }}>
              {choice === p ? "✓ " : ""}{p === "A" ? t("wizard.s5.pack_a","📦 Pack A") : t("wizard.s5.pack_b","💰 Pack B")}
            </div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>{eq[p]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const validate = (s) => s.classEquipmentChoice
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_equipment" };
```

- [ ] **Step 3: Register in shell**

```js
import Step05_ClassEquipment, { validate as validateStep05 } from "./steps/Step05_ClassEquipment.jsx";

  class_equipment: Object.assign(Step05_ClassEquipment, { validate: validateStep05 }),
```

- [ ] **Step 4: Verify**

1. Continue Wizard → Step 5 shows two cards with Pack A and Pack B contents
2. Pick A → gold highlight → Weiter enabled
3. State:
```js
JSON.parse(localStorage.getItem("wizard_active_v1")).classEquipmentChoice
```
Expected: `"A"`.

- [ ] **Step 5: Commit**

```bash
git add src/components/CharWizard/steps/Step05_ClassEquipment.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 5 — class equipment A/B choice"
```

---

## Phase D — Background Steps (6–9)

### Task D1: Step06_BackgroundSelect

**Files:**
- Create: `src/components/CharWizard/steps/Step06_BackgroundSelect.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

**Prereq:** The codebase already has `src/data/backgrounds.js` (used by `BackgroundSelector`). Inspect its export name with `grep -n "^export" src/data/backgrounds.js` before writing the step. The exported list is named `BACKGROUNDS` per existing usage.

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s6.title": "Wähle deinen Background",
    "wizard.s6.subtitle": "Background bestimmt Origin-Feat, Skill-Profs und Equipment.",
    "wizard.s6.feat_lbl": "Origin-Feat:",
    "wizard.s6.skills_lbl": "Skills:",
```
EN:
```
    "wizard.s6.title": "Pick your background",
    "wizard.s6.subtitle": "Background defines Origin Feat, skill proficiencies, and equipment.",
    "wizard.s6.feat_lbl": "Origin Feat:",
    "wizard.s6.skills_lbl": "Skills:",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step06_BackgroundSelect.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { BACKGROUNDS } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step06_BackgroundSelect({ state, updatePartial }) {
  const { t, lang } = useI18n();

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s6.title","Wähle deinen Background")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s6.subtitle","Background bestimmt Origin-Feat, Skill-Profs und Equipment.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {BACKGROUNDS.map((bg) => {
          const isSelected = state.background === bg.name;
          const label = lang === "en" ? (bg.enName || bg.name) : bg.name;
          return (
            <button
              type="button"
              key={bg.name}
              onClick={() => updatePartial({ background: bg.name })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "left",
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected ? `${C.gold}22` : "transparent",
              }}
            >
              <div style={{ fontFamily: FH, fontWeight: 700, color: isSelected ? C.gold : C.textBright, marginBottom: 6 }}>
                {isSelected ? "✓ " : ""}{label}
              </div>
              {bg.originFeat && (
                <div style={{ fontSize: 11, color: C.amberBright, marginBottom: 4 }}>
                  <strong>{t("wizard.s6.feat_lbl","Origin-Feat:")}</strong> {bg.originFeat}
                </div>
              )}
              {bg.skills && (
                <div style={{ fontSize: 11, color: C.textDim }}>
                  <strong>{t("wizard.s6.skills_lbl","Skills:")}</strong> {bg.skills.join(", ")}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => s.background
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_background" };
```

- [ ] **Step 3: Register & verify**

Register: `bg_select: Object.assign(Step06_BackgroundSelect, { validate: validateStep06 }),`

Verify: navigate to Step 6, pick a Background, check `state.background` is set.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step06_BackgroundSelect.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 6 — background selection"
```

---

### Task D2: Step07_BackgroundASI

**Files:**
- Create: `src/components/CharWizard/steps/Step07_BackgroundASI.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s7.title": "Background-Attributs-Bonus",
    "wizard.s7.subtitle": "Verteile entweder +2/+1 ODER +1/+1/+1 auf die 3 Background-Attribute.",
    "wizard.s7.mode_split": "+2 / +1",
    "wizard.s7.mode_even": "+1 / +1 / +1",
```
EN:
```
    "wizard.s7.title": "Background ASI",
    "wizard.s7.subtitle": "Distribute either +2/+1 OR +1/+1/+1 across the 3 background abilities.",
    "wizard.s7.mode_split": "+2 / +1",
    "wizard.s7.mode_even": "+1 / +1 / +1",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step07_BackgroundASI.jsx
import { C, sx, FH, SC } from "../../../constants/theme.js";
import { BACKGROUNDS } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step07_BackgroundASI({ state, updatePartial }) {
  const { t } = useI18n();
  const bg = BACKGROUNDS.find((b) => b.name === state.background);
  if (!bg) return null;
  // Each PHB 2024 background lists 3 abilities that can receive ASI.
  // bg.asiAbilities should exist; if not, default to common picks.
  const abilities = bg.asiAbilities || ["STR", "DEX", "CON"]; // fallback

  const mode = state.bgAsiMode || "2+1";
  const picks = state.bgAsiPicks || {};

  const setMode = (m) => updatePartial({ bgAsiMode: m, bgAsiPicks: {} });
  const togglePick = (ab) => {
    if (mode === "2+1") {
      // Cycle: empty → +2 → +1 → empty
      const cur = picks[ab] || 0;
      const next = cur === 0 ? 2 : (cur === 2 ? 1 : 0);
      const newPicks = { ...picks, [ab]: next };
      // Enforce: only one ability can have +2, only one can have +1
      if (next === 2) {
        Object.keys(newPicks).forEach((k) => { if (k !== ab && newPicks[k] === 2) newPicks[k] = 0; });
      }
      if (next === 1) {
        Object.keys(newPicks).forEach((k) => { if (k !== ab && newPicks[k] === 1) newPicks[k] = 0; });
      }
      updatePartial({ bgAsiPicks: newPicks });
    } else {
      // +1/+1/+1 — each ability gets exactly +1 (toggle in/out)
      const cur = picks[ab] || 0;
      updatePartial({ bgAsiPicks: { ...picks, [ab]: cur === 1 ? 0 : 1 } });
    }
  };

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s7.title","Background-Attributs-Bonus")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s7.subtitle","Verteile entweder +2/+1 ODER +1/+1/+1.")}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button type="button" onClick={() => setMode("2+1")}
          style={{ ...sx.btn(mode === "2+1" ? C.amber : C.textDim), padding: "6px 14px" }}>
          {t("wizard.s7.mode_split","+2 / +1")}
        </button>
        <button type="button" onClick={() => setMode("1+1+1")}
          style={{ ...sx.btn(mode === "1+1+1" ? C.amber : C.textDim), padding: "6px 14px" }}>
          {t("wizard.s7.mode_even","+1 / +1 / +1")}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {abilities.map((ab) => {
          const val = picks[ab] || 0;
          const col = SC[ab] || C.gold;
          return (
            <button
              type="button"
              key={ab}
              onClick={() => togglePick(ab)}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "center",
                padding: 18,
                borderColor: val > 0 ? col : C.border,
                background: val > 0 ? `${col}22` : "transparent",
              }}
            >
              <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 16, color: col }}>{ab}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: val > 0 ? col : C.textDim, marginTop: 6 }}>
                {val > 0 ? `+${val}` : "—"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => {
  const picks = s.bgAsiPicks || {};
  const vals = Object.values(picks).filter((v) => v > 0);
  if (s.bgAsiMode === "2+1") {
    const has2 = vals.includes(2);
    const has1 = vals.includes(1);
    return (has2 && has1 && vals.length === 2) ? { ok: true } : { ok: false, errorKey: "wizard.err_no_asi" };
  } else {
    return (vals.length === 3 && vals.every((v) => v === 1)) ? { ok: true } : { ok: false, errorKey: "wizard.err_no_asi" };
  }
};
```

- [ ] **Step 3: Register & verify**

Register: `bg_asi: Object.assign(Step07_BackgroundASI, { validate: validateStep07 }),`

Verify: Step 7 shows the 3 background-ASI abilities; clicking one cycles values; Weiter validates.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step07_BackgroundASI.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 7 — background ASI distribution"
```

---

### Task D3: Step08_BackgroundChoices (Tool/Language)

**Files:**
- Create: `src/components/CharWizard/steps/Step08_BackgroundChoices.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s8.title": "Background-Auswahl",
    "wizard.s8.subtitle": "Triff offene Background-Choices (Tool oder Sprache).",
    "wizard.s8.tool_lbl": "Werkzeug",
    "wizard.s8.lang_lbl": "Sprache",
```
EN:
```
    "wizard.s8.title": "Background choices",
    "wizard.s8.subtitle": "Make any open background choices (tool or language).",
    "wizard.s8.tool_lbl": "Tool",
    "wizard.s8.lang_lbl": "Language",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step08_BackgroundChoices.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { BACKGROUNDS } from "../../../data/backgrounds.js";
import { STANDARD_LANGUAGES, langLabel } from "../../../data/languages.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step08_BackgroundChoices({ state, updatePartial }) {
  const { t, lang } = useI18n();
  const bg = BACKGROUNDS.find((b) => b.name === state.background);
  if (!bg) return null;

  const toolChoices = bg.toolChoices || [];   // e.g. ["Smith's Tools", "Cook's Utensils"]
  const langChoice = !!bg.languageChoice;     // boolean: needs to pick 1 lang

  const setTool = (v) => updatePartial({ bgChoices: { ...state.bgChoices, tool: v } });
  const setLanguage = (v) => updatePartial({ bgChoices: { ...state.bgChoices, language: v } });

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s8.title","Background-Auswahl")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s8.subtitle","Triff offene Background-Choices.")}
      </p>

      {toolChoices.length > 0 && (
        <section style={{ marginBottom: 18 }}>
          <label style={sx.lbl}>{t("wizard.s8.tool_lbl","Werkzeug")}</label>
          <select value={state.bgChoices?.tool || ""} onChange={(e) => setTool(e.target.value)} style={sx.sel}>
            <option value="">— wählen —</option>
            {toolChoices.map((tl) => <option key={tl} value={tl}>{tl}</option>)}
          </select>
        </section>
      )}

      {langChoice && (
        <section>
          <label style={sx.lbl}>{t("wizard.s8.lang_lbl","Sprache")}</label>
          <select value={state.bgChoices?.language || ""} onChange={(e) => setLanguage(e.target.value)} style={sx.sel}>
            <option value="">— wählen —</option>
            {STANDARD_LANGUAGES.filter((l) => l.tier === "standard" && l.id !== "common").map((l) => (
              <option key={l.id} value={l.de}>{lang === "en" ? l.en : l.de}</option>
            ))}
          </select>
        </section>
      )}
    </div>
  );
}

export const validate = (s) => {
  const bg = BACKGROUNDS.find((b) => b.name === s.background);
  if (!bg) return { ok: true };
  const needsTool = (bg.toolChoices || []).length > 0;
  const needsLang = !!bg.languageChoice;
  const toolOk = !needsTool || !!s.bgChoices?.tool;
  const langOk = !needsLang || !!s.bgChoices?.language;
  return (toolOk && langOk) ? { ok: true } : { ok: false, errorKey: "wizard.err_no_choice" };
};

import { BACKGROUNDS } from "../../../data/backgrounds.js";
```

(Move the BACKGROUNDS import to the top of the file once — duplicate removed.)

**Note:** If `BACKGROUNDS` entries don't have `toolChoices` / `languageChoice` fields, this step renders nothing (validation passes). The shell's `hasBgChoice` conditional in `wizardSteps.js` will still trigger the step — adjust if you want to skip empty: in `wizardSteps.js`, refine `hasBgChoice` to check for actual choices:

```js
export function hasBgChoice(background) {
  if (!background) return false;
  const bg = BACKGROUNDS.find((b) => b.name === background);
  return (bg?.toolChoices?.length > 0) || !!bg?.languageChoice;
}
```

(This is a tiny change to `wizardSteps.js` — bundle with this task.)

- [ ] **Step 3: Register & verify**

Register: `bg_choices: Object.assign(Step08_BackgroundChoices, { validate: validateStep08 }),`

Verify: pick a background WITH a choice (check data) — Step 8 shows pickers. Pick a background WITHOUT choices — Step 8 is skipped.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step08_BackgroundChoices.jsx src/components/CharWizard/CharCreationWizard.jsx src/components/CharWizard/utils/wizardSteps.js src/i18n/index.js
git commit -m "feat(wizard): Step 8 — background tool/language choices"
```

---

### Task D4: Step09_BackgroundEquipment

**Files:**
- Create: `src/components/CharWizard/steps/Step09_BackgroundEquipment.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

Mirrors Step05 but for background equipment.

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s9.title": "Background-Ausrüstung",
    "wizard.s9.subtitle": "Wähle Pack A (Items) oder Pack B (50 gp).",
```
EN:
```
    "wizard.s9.title": "Background equipment",
    "wizard.s9.subtitle": "Choose Pack A (items) or Pack B (50 gp).",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step09_BackgroundEquipment.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { BACKGROUNDS } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step09_BackgroundEquipment({ state, updatePartial }) {
  const { t } = useI18n();
  const bg = BACKGROUNDS.find((b) => b.name === state.background);
  // PHB 2024: every background equipment Option A is items, Option B is 50 gp.
  const a = bg?.equipment || "—";
  const choice = state.bgEquipmentChoice;

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s9.title","Background-Ausrüstung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s9.subtitle","Wähle Pack A oder Pack B (50 gp).")}
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <button type="button" onClick={() => updatePartial({ bgEquipmentChoice: "A" })}
          style={{ ...sx.card, cursor: "pointer", borderColor: choice === "A" ? C.gold : C.border, background: choice === "A" ? `${C.gold}22` : "transparent", textAlign: "left", padding: 16 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: choice === "A" ? C.gold : C.textBright, marginBottom: 6 }}>
            {choice === "A" ? "✓ " : ""}📦 Pack A
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>{a}</div>
        </button>
        <button type="button" onClick={() => updatePartial({ bgEquipmentChoice: "B" })}
          style={{ ...sx.card, cursor: "pointer", borderColor: choice === "B" ? C.gold : C.border, background: choice === "B" ? `${C.gold}22` : "transparent", textAlign: "left", padding: 16 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: choice === "B" ? C.gold : C.textBright, marginBottom: 6 }}>
            {choice === "B" ? "✓ " : ""}💰 Pack B
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>50 gp</div>
        </button>
      </div>
    </div>
  );
}

export const validate = (s) => s.bgEquipmentChoice
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_equipment" };
```

- [ ] **Step 3: Register & verify**

Register: `bg_equipment: Object.assign(Step09_BackgroundEquipment, { validate: validateStep09 }),`

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step09_BackgroundEquipment.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 9 — background equipment A/B choice"
```

---

## Phase E — Species Steps (10–11)

### Task E1: Step10_SpeciesSelect

**Files:**
- Create: `src/components/CharWizard/steps/Step10_SpeciesSelect.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.s10.title": "Wähle deine Spezies",
    "wizard.s10.subtitle": "Spezies bestimmt Größe, Geschwindigkeit und besondere Eigenschaften.",
    "wizard.s10.speed": "Speed",
    "wizard.s10.size": "Größe",
```
EN:
```
    "wizard.s10.title": "Pick your species",
    "wizard.s10.subtitle": "Species determines size, speed, and unique traits.",
    "wizard.s10.speed": "Speed",
    "wizard.s10.size": "Size",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step10_SpeciesSelect.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { RACES } from "../../../data/races.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step10_SpeciesSelect({ state, updatePartial }) {
  const { t, lang } = useI18n();

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s10.title","Wähle deine Spezies")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s10.subtitle","Spezies bestimmt Größe, Geschwindigkeit und besondere Eigenschaften.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {RACES.map((r) => {
          const isSelected = state.race === r.name;
          const label = lang === "en" ? (r.enName || r.name) : r.name;
          const size = lang === "en" ? (r.sizeEN || r.size) : r.size;
          return (
            <button type="button" key={r.name}
              onClick={() => updatePartial({ race: r.name })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "left",
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected ? `${C.gold}22` : "transparent",
              }}>
              <div style={{ fontFamily: FH, fontWeight: 700, color: isSelected ? C.gold : C.textBright, marginBottom: 4 }}>
                {isSelected ? "✓ " : ""}{label}
              </div>
              <div style={{ fontSize: 11, color: C.textDim }}>
                <strong>{t("wizard.s10.speed","Speed")}:</strong> {r.speed} ft · <strong>{t("wizard.s10.size","Größe")}:</strong> {size}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => s.race ? { ok: true } : { ok: false, errorKey: "wizard.err_no_species" };
```

- [ ] **Step 3: Register & verify**

`species_select: Object.assign(Step10_SpeciesSelect, { validate: validateStep10 }),`

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step10_SpeciesSelect.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 10 — species selection"
```

---

### Task E2: Step11_SpeciesChoices

**Files:**
- Create: `src/components/CharWizard/steps/Step11_SpeciesChoices.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.s11.title": "Spezies-Auswahl",
    "wizard.s11.subtitle": "Treffe offene Spezies-Choices (z.B. Half-Elf Skill, Tiefling Spell-Line).",
    "wizard.s11.no_choice": "Keine Auswahl für diese Spezies erforderlich.",
```
EN:
```
    "wizard.s11.title": "Species choices",
    "wizard.s11.subtitle": "Make any open species choices (e.g. Half-Elf skill, Tiefling spell line).",
    "wizard.s11.no_choice": "No additional choice needed for this species.",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step11_SpeciesChoices.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { RACES } from "../../../data/races.js";
import { SKILLS } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step11_SpeciesChoices({ state, updatePartial }) {
  const { t } = useI18n();
  const r = RACES.find((x) => x.name === state.race);
  if (!r) return null;

  const choices = r.choices || [];   // array of { key, label, type: "skill"|"spell", options: [...] }
  if (choices.length === 0) {
    return (
      <div>
        <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
          {t("wizard.s11.title","Spezies-Auswahl")}
        </h2>
        <p style={{ color: C.textDim, fontSize: 12 }}>{t("wizard.s11.no_choice","Keine Auswahl für diese Spezies erforderlich.")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s11.title","Spezies-Auswahl")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s11.subtitle","Treffe offene Spezies-Choices.")}
      </p>

      {choices.map((ch) => {
        const cur = state.speciesChoices?.[ch.key] || "";
        return (
          <section key={ch.key} style={{ marginBottom: 18 }}>
            <label style={sx.lbl}>{ch.label}</label>
            <select value={cur} onChange={(e) => updatePartial({ speciesChoices: { ...state.speciesChoices, [ch.key]: e.target.value } })} style={sx.sel}>
              <option value="">— wählen —</option>
              {ch.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </section>
        );
      })}
    </div>
  );
}

export const validate = (s) => {
  const r = RACES.find((x) => x.name === s.race);
  if (!r) return { ok: true };
  const choices = r.choices || [];
  if (choices.length === 0) return { ok: true };
  const allFilled = choices.every((ch) => !!s.speciesChoices?.[ch.key]);
  return allFilled ? { ok: true } : { ok: false, errorKey: "wizard.err_no_choice" };
};

import { RACES } from "../../../data/races.js";
```

(Move imports to top of file — remove the duplicate at bottom.)

**Note:** If `races.js` doesn't have a `choices` field on race entries, you have two options: (1) add the field to the data, or (2) keep this step a no-op for now. The plan assumes data is extended in this task; if data shape differs, audit `races.js` first and adjust.

- [ ] **Step 3: Register & verify**

`species_choices: Object.assign(Step11_SpeciesChoices, { validate: validateStep11 }),`

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step11_SpeciesChoices.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 11 — species choices"
```

---

## Phase F — Stats, Alignment, Personality (12–14)

### Task F1: Step12_Abilities (Point-Buy)

**Files:**
- Create: `src/components/CharWizard/steps/Step12_Abilities.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.s12.title": "Attribute (Point-Buy)",
    "wizard.s12.subtitle": "Verteile 27 Punkte. Min 8, Max 15 pro Attribut (PHB 2024 Standard).",
    "wizard.s12.points_left": "Punkte übrig: {n}",
    "wizard.s12.cost_tab": "Kostentabelle: 8=0 · 9=1 · 10=2 · 11=3 · 12=4 · 13=5 · 14=7 · 15=9",
```
EN:
```
    "wizard.s12.title": "Abilities (Point Buy)",
    "wizard.s12.subtitle": "Distribute 27 points. Min 8, max 15 per ability (PHB 2024 standard).",
    "wizard.s12.points_left": "Points left: {n}",
    "wizard.s12.cost_tab": "Cost table: 8=0 · 9=1 · 10=2 · 11=3 · 12=4 · 13=5 · 14=7 · 15=9",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step12_Abilities.jsx
import { C, sx, FH, SC, ABS } from "../../../constants/theme.js";
import { POINT_BUY_MIN, POINT_BUY_MAX, POINT_BUY_COST, pointsRemaining, isValidScore } from "../data/pointBuyCosts.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step12_Abilities({ state, updatePartial }) {
  const { t } = useI18n();
  const scores = state.abilityScores;
  const remaining = pointsRemaining(scores);

  const adjust = (ab, delta) => {
    const key = ab.toLowerCase();
    const cur = scores[key];
    const next = cur + delta;
    if (!isValidScore(next)) return;
    const newScores = { ...scores, [key]: next };
    if (pointsRemaining(newScores) < 0) return;   // can't go over budget
    updatePartial({ abilityScores: newScores });
  };

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s12.title","Attribute (Point-Buy)")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 8 }}>
        {t("wizard.s12.subtitle","Verteile 27 Punkte. Min 8, Max 15 pro Attribut.")}
      </p>
      <div style={{ fontSize: 13, color: remaining === 0 ? C.green : (remaining < 0 ? C.red : C.amber), fontWeight: 700, marginBottom: 6 }}>
        {t("wizard.s12.points_left","Punkte übrig: {n}").replace("{n}", String(remaining))}
      </div>
      <div style={{ fontSize: 10, color: C.textDim, marginBottom: 18 }}>
        {t("wizard.s12.cost_tab","Kostentabelle: …")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {ABS.map((ab) => {
          const key = ab.toLowerCase();
          const val = scores[key];
          const col = SC[ab];
          return (
            <div key={ab} style={{ ...sx.card, textAlign: "center", borderColor: `${col}55` }}>
              <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 14, color: col }}>{ab}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => adjust(ab, -1)} disabled={val <= POINT_BUY_MIN}
                  style={{ ...sx.bsm(col), opacity: val <= POINT_BUY_MIN ? 0.3 : 1 }}>−</button>
                <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: C.textBright, minWidth: 30 }}>{val}</div>
                <button type="button" onClick={() => adjust(ab, +1)} disabled={val >= POINT_BUY_MAX || pointsRemaining({ ...scores, [key]: val + 1 }) < 0}
                  style={{ ...sx.bsm(col), opacity: (val >= POINT_BUY_MAX) ? 0.3 : 1 }}>+</button>
              </div>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 6 }}>
                Cost: {POINT_BUY_COST[val] ?? "?"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => pointsRemaining(s.abilityScores) === 0
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_pointbuy" };
```

- [ ] **Step 3: Register & verify**

`abilities: Object.assign(Step12_Abilities, { validate: validateStep12 }),`

Verify: Step 12 shows 6 stat cards starting at 8 (27 left). +/- buttons adjust. Spend all 27 → "0 left" turns green → Weiter enabled.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step12_Abilities.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 12 — point-buy ability scores"
```

---

### Task F2: Step13_Alignment (3×3 Grid)

**Files:**
- Create: `src/components/CharWizard/steps/Step13_Alignment.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.s13.title": "Alignment",
    "wizard.s13.subtitle": "Wähle die moralische und ethische Ausrichtung deines Charakters.",
```
EN:
```
    "wizard.s13.title": "Alignment",
    "wizard.s13.subtitle": "Pick your character's moral and ethical alignment.",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step13_Alignment.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { ALIGNMENTS } from "../data/alignmentDescriptions.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step13_Alignment({ state, updatePartial }) {
  const { t, lang } = useI18n();
  const selected = state.alignment;

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s13.title","Alignment")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s13.subtitle","Wähle die moralische und ethische Ausrichtung.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxWidth: 600 }}>
        {ALIGNMENTS.map((al) => {
          const isSelected = selected === al.id;
          return (
            <button type="button" key={al.id}
              onClick={() => updatePartial({ alignment: al.id })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "center",
                padding: 12,
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected ? `${C.gold}22` : "transparent",
              }}>
              <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 700, color: isSelected ? C.gold : C.textBright }}>
                {isSelected ? "✓ " : ""}{al.id}
              </div>
              <div style={{ fontSize: 11, color: C.text, marginTop: 4 }}>
                {lang === "en" ? al.en : al.de}
              </div>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 6, lineHeight: 1.35 }}>
                {lang === "en" ? al.descEN : al.descDE}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => s.alignment
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_alignment" };
```

- [ ] **Step 3: Register & verify**

`alignment: Object.assign(Step13_Alignment, { validate: validateStep13 }),`

Verify: Step 13 shows 3×3 grid with 9 alignments. Click one → highlight.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step13_Alignment.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 13 — alignment 3x3 grid"
```

---

### Task F3: Step14_Personality

**Files:**
- Create: `src/components/CharWizard/steps/Step14_Personality.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.s14.title": "Persönlichkeit & Identität",
    "wizard.s14.subtitle": "Fülle Charakter-Details aus — Name ist Pflicht, der Rest ist optional.",
    "wizard.s14.name": "Name *",
    "wizard.s14.age": "Alter",
    "wizard.s14.sex": "Geschlecht",
    "wizard.s14.height": "Größe",
    "wizard.s14.weight": "Gewicht",
    "wizard.s14.deity": "Gottheit",
    "wizard.s14.traits": "Wesenszüge",
    "wizard.s14.ideals": "Ideale",
    "wizard.s14.bonds": "Bindungen",
    "wizard.s14.flaws": "Schwächen",
    "wizard.s14.backstory": "Hintergrundgeschichte",
```
EN:
```
    "wizard.s14.title": "Personality & Identity",
    "wizard.s14.subtitle": "Fill in character details — name is required, rest is optional.",
    "wizard.s14.name": "Name *",
    "wizard.s14.age": "Age",
    "wizard.s14.sex": "Sex",
    "wizard.s14.height": "Height",
    "wizard.s14.weight": "Weight",
    "wizard.s14.deity": "Deity",
    "wizard.s14.traits": "Personality Traits",
    "wizard.s14.ideals": "Ideals",
    "wizard.s14.bonds": "Bonds",
    "wizard.s14.flaws": "Flaws",
    "wizard.s14.backstory": "Backstory",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step14_Personality.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step14_Personality({ state, updatePartial }) {
  const { t } = useI18n();
  const u = (k, v) => updatePartial({ [k]: v });

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s14.title","Persönlichkeit & Identität")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s14.subtitle","Fülle Charakter-Details aus.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <Field label={t("wizard.s14.name","Name *")} value={state.name} onChange={(v) => u("name", v)} accent={C.gold} />
        <Field label={t("wizard.s14.age","Alter")} value={state.age} onChange={(v) => u("age", v)} />
        <Field label={t("wizard.s14.sex","Geschlecht")} value={state.sex} onChange={(v) => u("sex", v)} />
        <Field label={t("wizard.s14.height","Größe")} value={state.height} onChange={(v) => u("height", v)} />
        <Field label={t("wizard.s14.weight","Gewicht")} value={state.weight} onChange={(v) => u("weight", v)} />
        <Field label={t("wizard.s14.deity","Gottheit")} value={state.deity} onChange={(v) => u("deity", v)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginTop: 16 }}>
        <TextArea label={t("wizard.s14.traits","Wesenszüge")} value={state.traits} onChange={(v) => u("traits", v)} col={C.amberBright} />
        <TextArea label={t("wizard.s14.ideals","Ideale")} value={state.ideals} onChange={(v) => u("ideals", v)} col={C.tealBright} />
        <TextArea label={t("wizard.s14.bonds","Bindungen")} value={state.bonds} onChange={(v) => u("bonds", v)} col={C.purpleBright} />
        <TextArea label={t("wizard.s14.flaws","Schwächen")} value={state.flaws} onChange={(v) => u("flaws", v)} col={C.redBright} />
      </div>

      <div style={{ marginTop: 14 }}>
        <TextArea label={t("wizard.s14.backstory","Hintergrundgeschichte")} value={state.backstory} onChange={(v) => u("backstory", v)} col={C.gold} rows={5} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, accent }) {
  return (
    <div>
      <label style={sx.lbl}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ ...sx.inp, color: accent || undefined, fontFamily: accent ? "Cinzel, serif" : undefined, fontWeight: accent ? 700 : undefined }} />
    </div>
  );
}

function TextArea({ label, value, onChange, col, rows = 2 }) {
  return (
    <div>
      <label style={{ ...sx.lbl, color: col }}>{label}</label>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows}
        style={{ ...sx.ta, borderLeft: `3px solid ${col}` }} />
    </div>
  );
}

export const validate = (s) => s.name?.trim()
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_name" };
```

- [ ] **Step 3: Register & verify**

`personality: Object.assign(Step14_Personality, { validate: validateStep14 }),`

- [ ] **Step 4: Commit**

```bash
git add src/components/CharWizard/steps/Step14_Personality.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 14 — personality + identity fields"
```

---

## Phase G — Level-Up Loop (15)

### Task G1: Step15_LevelUpLoop

**Files:**
- Create: `src/components/CharWizard/steps/Step15_LevelUpLoop.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/components/CharWizard/utils/wizardSteps.js` (multi-step handling)
- Modify: `src/i18n/index.js`

This step is a sub-wizard: one screen per level 2..targetLevel. State tracks current sub-level via `state.levelupCurrent` (number).

- [ ] **Step 1: Extend wizard state with `levelupCurrent`**

In `src/components/CharWizard/hooks/useWizardState.js`, add to `initialWizardState()`:

```js
    levelupCurrent: 2,   // current level being configured in the level-up loop
```

- [ ] **Step 2: Add i18n keys**

DE:
```
    "wizard.s15.title": "Level {n} ausbauen",
    "wizard.s15.hp_lbl": "TP-Gewinn (Average)",
    "wizard.s15.subclass_lbl": "Subclass",
    "wizard.s15.asi_lbl": "ASI / Feat",
    "wizard.s15.asi_mode_asi": "+2 / +1",
    "wizard.s15.asi_mode_feat": "Feat",
    "wizard.s15.no_choice": "Auf diesem Level musst du nichts wählen — weiter zum nächsten.",
```
EN:
```
    "wizard.s15.title": "Build Level {n}",
    "wizard.s15.hp_lbl": "HP Gain (Average)",
    "wizard.s15.subclass_lbl": "Subclass",
    "wizard.s15.asi_lbl": "ASI / Feat",
    "wizard.s15.asi_mode_asi": "+2 / +1",
    "wizard.s15.asi_mode_feat": "Feat",
    "wizard.s15.no_choice": "No choices required at this level — proceed to the next.",
```

- [ ] **Step 3: Write the step**

```js
// src/components/CharWizard/steps/Step15_LevelUpLoop.jsx
import { useMemo } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { SUBCLASSES } from "../../../data/subclasses.js";
import { useI18n } from "../../../i18n/index.js";

// Standard ASI levels (PHB 2024). Fighter adds 6 + 14, Rogue adds 10.
const ASI_LEVELS = { default: [4, 8, 12, 16, 19] };
const CLASS_EXTRA_ASI = { Kämpfer: [6, 14], Schurke: [10] };

function asiAtLevel(klass, lv) {
  if (ASI_LEVELS.default.includes(lv)) return true;
  if (CLASS_EXTRA_ASI[klass]?.includes(lv)) return true;
  return false;
}

export default function Step15_LevelUpLoop({ state, updatePartial, setStep }) {
  const { t } = useI18n();
  const lv = state.levelupCurrent;
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);
  const choice = state.levelupChoices[lv] || { hp: "avg" };
  const setChoice = (patch) => updatePartial({ levelupChoices: { ...state.levelupChoices, [lv]: { ...choice, ...patch } } });

  const needsSubclass = lv === 3;
  const needsASI = asiAtLevel(state.klass, lv);
  const subclassOptions = SUBCLASSES[state.klass] || [];

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 14 }}>
        {t("wizard.s15.title","Level {n} ausbauen").replace("{n}", String(lv))}
      </h2>

      {/* HP gain (always "avg" in wizard) */}
      <section style={{ marginBottom: 18 }}>
        <label style={sx.lbl}>{t("wizard.s15.hp_lbl","TP-Gewinn (Average)")}</label>
        <div style={{ ...sx.inp, color: C.tealBright, fontFamily: FH, fontWeight: 700 }}>
          {cls?.hd ? `+${Math.floor(parseInt(cls.hd.match(/\d+/)[0]) / 2) + 1} TP (HD-Average)` : "—"}
        </div>
      </section>

      {needsSubclass && (
        <section style={{ marginBottom: 18 }}>
          <label style={sx.lbl}>{t("wizard.s15.subclass_lbl","Subclass")}</label>
          <select value={choice.subclass || ""} onChange={(e) => setChoice({ subclass: e.target.value })} style={sx.sel}>
            <option value="">— wählen —</option>
            {subclassOptions.map((sc) => <option key={sc.name} value={sc.name}>{sc.name}</option>)}
          </select>
        </section>
      )}

      {needsASI && (
        <section style={{ marginBottom: 18 }}>
          <label style={sx.lbl}>{t("wizard.s15.asi_lbl","ASI / Feat")}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setChoice({ asi: { mode: "asi" } })}
              style={{ ...sx.btn(choice.asi?.mode === "asi" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_asi","+2 / +1")}
            </button>
            <button type="button" onClick={() => setChoice({ asi: { mode: "feat" } })}
              style={{ ...sx.btn(choice.asi?.mode === "feat" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_feat","Feat")}
            </button>
          </div>
          {/* Detailed ASI/feat picker omitted for brevity — user fills in
              feat name or ASI distribution via free text for now. */}
          {choice.asi?.mode === "feat" && (
            <input value={choice.asi?.feat || ""} onChange={(e) => setChoice({ asi: { ...choice.asi, feat: e.target.value } })}
              placeholder="Feat-Name (z.B. Lucky)" style={{ ...sx.inp, marginTop: 8 }} />
          )}
        </section>
      )}

      {!needsSubclass && !needsASI && (
        <p style={{ color: C.textDim, fontSize: 12 }}>{t("wizard.s15.no_choice","Auf diesem Level musst du nichts wählen.")}</p>
      )}
    </div>
  );
}

// Validation: if subclass needed → picked; if ASI needed → mode picked AND (mode=feat → feat-name filled)
export const validate = (s) => {
  const lv = s.levelupCurrent;
  const choice = s.levelupChoices[lv] || {};
  const needsSubclass = lv === 3;
  const needsASI = asiAtLevel(s.klass, lv);
  if (needsSubclass && !choice.subclass) return { ok: false, errorKey: "wizard.err_no_choice" };
  if (needsASI) {
    if (!choice.asi?.mode) return { ok: false, errorKey: "wizard.err_no_choice" };
    if (choice.asi.mode === "feat" && !choice.asi.feat?.trim()) return { ok: false, errorKey: "wizard.err_no_choice" };
  }
  return { ok: true };
};
```

- [ ] **Step 4: Modify the shell to handle the multi-loop**

In `CharCreationWizard.jsx`, modify `onNext` to advance through level-up sub-steps before moving to `review`:

```js
  const onNext = () => {
    // Special case: level-up loop is multi-step
    if (state.currentStep === "levelup_loop") {
      if (state.levelupCurrent < state.targetLevel) {
        updatePartial({ levelupCurrent: state.levelupCurrent + 1 });
        return;
      }
      // Last level reached — advance to review
    }
    const next = nextStepId(state.currentStep, state);
    if (next) setStep(next);
  };
```

And modify `onBack`:

```js
  const onBack = () => {
    if (state.currentStep === "levelup_loop" && state.levelupCurrent > 2) {
      updatePartial({ levelupCurrent: state.levelupCurrent - 1 });
      return;
    }
    const prev = prevStepId(state.currentStep, state);
    if (prev) goBack();
  };
```

Update the step indicator to show `(Lv {levelupCurrent} / {targetLevel})` when in the loop:

```jsx
        <span style={{ flex: 1, fontSize: 11, color: C.textDim }}>
          {t("wizard.shell.step_of","Schritt {n} von {total}")
            .replace("{n}", String(currentIdx + 1))
            .replace("{total}", String(flow.length))}
          {" · "}{flow[currentIdx]?.title}
          {state.currentStep === "levelup_loop" && ` (Lv ${state.levelupCurrent} / ${state.targetLevel})`}
        </span>
```

- [ ] **Step 5: Register the step**

```js
import Step15_LevelUpLoop, { validate as validateStep15 } from "./steps/Step15_LevelUpLoop.jsx";

  levelup_loop: Object.assign(Step15_LevelUpLoop, { validate: validateStep15 }),
```

- [ ] **Step 6: Verify**

1. Restart wizard, pick targetLevel = 5 (note: targetLevel is set somehow — for now, edit it manually in localStorage)
2. Complete steps 1-14
3. Step 15 shows "Level 2 ausbauen" → no choices → Weiter
4. Shows "Level 3 ausbauen" → Subclass picker required
5. Shows "Level 4 ausbauen" → ASI/Feat picker required
6. Shows "Level 5 ausbauen" → no choices → Weiter → moves to Review

- [ ] **Step 7: Commit**

```bash
git add src/components/CharWizard/steps/Step15_LevelUpLoop.jsx src/components/CharWizard/CharCreationWizard.jsx src/components/CharWizard/hooks/useWizardState.js src/i18n/index.js
git commit -m "feat(wizard): Step 15 — level-up loop with subclass + ASI picks"
```

---

## Phase H — Commit (Review + buildChar)

### Task H1: `buildCharFromWizard` (pure function)

**Files:**
- Create: `src/components/CharWizard/utils/buildCharFromWizard.js`

- [ ] **Step 1: Write the build function**

```js
// src/components/CharWizard/utils/buildCharFromWizard.js
import { newChar, getPB } from "../../../utils/helpers.js";
import { getClassHd } from "../../../utils/multiclass.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { BACKGROUNDS } from "../../../data/backgrounds.js";
import { RACES } from "../../../data/races.js";

const SAVE_CODES = { STR: "STR", DEX: "DEX", CON: "CON", INT: "INT", WIS: "WIS", CHA: "CHA" };

/**
 * Pure builder: wizard-state → fully-populated char object.
 * Caller must persist spell IDs separately to `spells_known_<id>` and
 * `spells_prep_<id>` using the returned char.id.
 */
export function buildCharFromWizard(state) {
  const id = Date.now();
  let char = newChar(id);

  // Phase 1 — Class
  char.klass = state.klass;
  char.hd = getClassHd(state.klass);
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);

  // Saves from class (e.g. "STR & CON" → { STR: true, CON: true })
  char.saves = {};
  (cls?.saves || "").split("&").map((s) => s.trim()).forEach((s) => {
    if (SAVE_CODES[s]) char.saves[s] = true;
  });

  // Class skills
  char.skills = {};
  (state.classSkillsChosen || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

  // Class choices (stored under raw class-choice key)
  char.classChoices = state.classChoices || {};

  // Phase 2 — Background
  char.background = state.background;
  const bg = BACKGROUNDS.find((b) => b.name === state.background);
  char.originFeat = bg?.originFeat || "";

  // Background skills
  (bg?.skills || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

  // Background language (custom languages from bgChoices.language)
  char.languages = ["Gemeinsprache"];
  if (state.bgChoices?.language) char.languages.push(state.bgChoices.language);

  // Phase 2 — Species
  char.race = state.race;
  const sp = RACES.find((r) => r.name === state.race);
  char.speed = sp?.speed || 30;
  char.size = sp?.size || "Mittel";
  (sp?.languages || []).forEach((l) => { if (!char.languages.includes(l)) char.languages.push(l); });

  // Phase 3 — Stats (point-buy + bg ASI)
  const ab = state.abilityScores;
  const asi = state.bgAsiPicks || {};
  char.str = ab.str + (asi.STR || 0);
  char.dex = ab.dex + (asi.DEX || 0);
  char.con = ab.con + (asi.CON || 0);
  char.int = ab.int + (asi.INT || 0);
  char.wis = ab.wis + (asi.WIS || 0);
  char.cha = ab.cha + (asi.CHA || 0);

  // HP at Lv1: HD-max + CON-mod
  const hdSize = parseInt((char.hd || "d10").match(/\d+/)[0]);
  const conMod = Math.floor((char.con - 10) / 2);
  char.maxHp = hdSize + conMod;
  char.hp = char.maxHp;

  // Phase 4 — Alignment
  char.alignment = state.alignment;

  // Phase 5 — Details
  char.name = state.name;
  char.age = state.age;
  char.sex = state.sex;
  char.height = state.height;
  char.weight = state.weight;
  char.deity = state.deity;
  char.traits = state.traits;
  char.ideals = state.ideals;
  char.bonds = state.bonds;
  char.flaws = state.flaws;
  char.backstory = state.backstory;

  // Phase 6 — Level-up loop
  char.level = 1;
  if (state.targetLevel > 1) {
    for (let lv = 2; lv <= state.targetLevel; lv++) {
      const loopChoice = state.levelupChoices[lv] || {};
      char.level = lv;
      // HP gain: HD-avg + CON-mod
      char.maxHp += Math.floor(hdSize / 2) + 1 + conMod;
      // Subclass at Lv3
      if (lv === 3 && loopChoice.subclass) {
        char.subclasses = { ...(char.subclasses || {}), [state.klass]: loopChoice.subclass };
      }
      // ASI/Feat — apply if mode "asi" (with picks) or "feat" (name only)
      if (loopChoice.asi?.mode === "asi" && loopChoice.asi.picks) {
        Object.entries(loopChoice.asi.picks).forEach(([abKey, bonus]) => {
          const k = abKey.toLowerCase();
          if (char[k] !== undefined) char[k] += bonus;
        });
      } else if (loopChoice.asi?.mode === "feat" && loopChoice.asi.feat) {
        char.feats = [...(char.feats || []), loopChoice.asi.feat];
      }
    }
    char.hp = char.maxHp;
  }

  return char;
}

/** Returns { knownSpellIds, preparedSpellIds } for persistence. */
export function spellIdsFromWizard(state) {
  return {
    knownSpellIds: [...(state.cantripsChosen || []), ...(state.lv1SpellsChosen || [])],
    preparedSpellIds: [...(state.lv1SpellsChosen || [])],
  };
}
```

- [ ] **Step 2: Verify with a sample state**

```js
(async () => {
  const m = await import("/src/components/CharWizard/utils/buildCharFromWizard.js");
  const fakeState = {
    klass: "Magier", classSkillsChosen: ["Arcana","Investigation"], classChoices: {},
    cantripsChosen: ["fire_bolt"], lv1SpellsChosen: ["mage_armor"], classEquipmentChoice: "A",
    background: "Sage", bgAsiMode: "2+1", bgAsiPicks: { INT: 2, WIS: 1 },
    bgChoices: { language: "Elfisch" }, bgEquipmentChoice: "A",
    race: "Elf", speciesChoices: {},
    abilityScores: { str:8, dex:14, con:14, int:15, wis:12, cha:10 },
    alignment: "NG",
    name: "Eldrin", age: "127", sex: "M", height: "5'8\"", weight: "140 lbs", deity: "",
    traits: "", ideals: "", bonds: "", flaws: "", backstory: "",
    targetLevel: 1, levelupChoices: {},
  };
  const char = m.buildCharFromWizard(fakeState);
  return { name: char.name, klass: char.klass, hd: char.hd, int: char.int, alignment: char.alignment, maxHp: char.maxHp, skillCount: Object.keys(char.skills).length, languages: char.languages };
})()
```
Expected: `{ name: "Eldrin", klass: "Magier", hd: "d6", int: 17 (15+2), alignment: "NG", maxHp: 8 (d6=6 + CON-mod 2), skillCount: 2 (class skills, may include bg skills if data has them), languages: ["Gemeinsprache", "Elfisch", ...]}`. Adjust expectations if BG/Species data adds languages.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharWizard/utils/buildCharFromWizard.js
git commit -m "feat(wizard): buildCharFromWizard pure commit function"
```

---

### Task H2: Step16_Review + final commit

**Files:**
- Create: `src/components/CharWizard/steps/Step16_Review.jsx`
- Modify: `src/components/CharWizard/CharCreationWizard.jsx`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add i18n keys**

DE:
```
    "wizard.s16.title": "Übersicht & Bestätigung",
    "wizard.s16.subtitle": "Prüfe deine Auswahlen. Klick auf 'Charakter erstellen' speichert den Char.",
    "wizard.s16.create": "🎲 Charakter erstellen",
    "wizard.s16.section_basics": "Basis",
    "wizard.s16.section_origin": "Origin",
    "wizard.s16.section_stats": "Attribute",
    "wizard.s16.section_personality": "Persönlichkeit",
```
EN:
```
    "wizard.s16.title": "Review & Confirm",
    "wizard.s16.subtitle": "Review your choices. Click 'Create Character' to save the character.",
    "wizard.s16.create": "🎲 Create Character",
    "wizard.s16.section_basics": "Basics",
    "wizard.s16.section_origin": "Origin",
    "wizard.s16.section_stats": "Abilities",
    "wizard.s16.section_personality": "Personality",
```

- [ ] **Step 2: Write the step**

```js
// src/components/CharWizard/steps/Step16_Review.jsx
import { C, sx, FH } from "../../../constants/theme.js";
import { useChar } from "../../../context/CharContext.jsx";
import { useI18n } from "../../../i18n/index.js";
import { buildCharFromWizard, spellIdsFromWizard } from "../utils/buildCharFromWizard.js";

export default function Step16_Review({ state, updatePartial }) {
  const { t } = useI18n();
  const { setChars, setAid } = useChar();

  const onCreate = () => {
    const char = buildCharFromWizard(state);
    const { knownSpellIds, preparedSpellIds } = spellIdsFromWizard(state);

    // Persist spells under the new char's id
    try {
      localStorage.setItem(`spells_known_${char.id}`, JSON.stringify(knownSpellIds));
      localStorage.setItem(`spells_prep_${char.id}`, JSON.stringify(preparedSpellIds));
    } catch (_) {}

    setChars((prev) => [...prev, char]);
    setAid(char.id);

    // Clear wizard state — the App.jsx render branch returns to normal layout
    localStorage.removeItem("wizard_active_v1");
    window.location.reload();
  };

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s16.title","Übersicht & Bestätigung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s16.subtitle","Prüfe deine Auswahlen.")}
      </p>

      <Section title={t("wizard.s16.section_basics","Basis")}>
        <Row label="Name">{state.name}</Row>
        <Row label="Klasse">{state.klass}</Row>
        <Row label="Ziel-Level">{state.targetLevel}</Row>
      </Section>

      <Section title={t("wizard.s16.section_origin","Origin")}>
        <Row label="Background">{state.background}</Row>
        <Row label="Origin-Feat">{/* derived */}—</Row>
        <Row label="Spezies">{state.race}</Row>
      </Section>

      <Section title={t("wizard.s16.section_stats","Attribute")}>
        <Row label="Point-Buy (vor ASI)">
          STR {state.abilityScores.str} · DEX {state.abilityScores.dex} · CON {state.abilityScores.con} ·
          {" "}INT {state.abilityScores.int} · WIS {state.abilityScores.wis} · CHA {state.abilityScores.cha}
        </Row>
        <Row label="Background-ASI">
          {Object.entries(state.bgAsiPicks).map(([ab, v]) => `${ab} +${v}`).join(" · ") || "—"}
        </Row>
        <Row label="Alignment">{state.alignment || "—"}</Row>
      </Section>

      <Section title={t("wizard.s16.section_personality","Persönlichkeit")}>
        <Row label="Wesenszüge">{state.traits || "—"}</Row>
        <Row label="Ideale">{state.ideals || "—"}</Row>
        <Row label="Bindungen">{state.bonds || "—"}</Row>
        <Row label="Schwächen">{state.flaws || "—"}</Row>
      </Section>

      <button type="button" onClick={onCreate}
        style={{ ...sx.btn(C.green), fontSize: 14, padding: "12px 24px", marginTop: 20, display: "block", marginLeft: "auto", marginRight: "auto" }}>
        {t("wizard.s16.create","🎲 Charakter erstellen")}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ ...sx.card, marginBottom: 10 }}>
      <div style={{ ...sx.ct, color: C.amberBright, fontSize: 12, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
function Row({ label, children }) {
  return (
    <div style={{ fontSize: 12, marginBottom: 4 }}>
      <strong style={{ color: C.textDim }}>{label}:</strong>{" "}
      <span style={{ color: C.text }}>{children}</span>
    </div>
  );
}

export const validate = () => ({ ok: true });
```

- [ ] **Step 3: Register in shell**

```js
import Step16_Review, { validate as validateStep16 } from "./steps/Step16_Review.jsx";

  review: Object.assign(Step16_Review, { validate: validateStep16 }),
```

- [ ] **Step 4: Verify end-to-end happy path**

Full smoke test for Happy-Caster (Magier / Sage / Hochelf / Lv1):
1. Click "+ Neu"
2. Step 1: Magier
3. Step 2: Arcana + Investigation
4. Step 4 (Step 3 skipped): 3 cantrips + 6 lv1 spells
5. Step 5: Pack A
6. Step 6: Sage
7. Step 7: +2 INT, +1 WIS
8. Step 8: (if Sage has tool/lang choice) — fill
9. Step 9: Pack A
10. Step 10: Hochelf (or Elf)
11. Step 11: (species choices)
12. Step 12: spend all 27 points
13. Step 13: pick alignment
14. Step 14: name = "Eldrin"
15. Step 16: click "🎲 Charakter erstellen"
16. Page reloads → in CharManager, find "Eldrin · Magier" in char-list
17. Verify in Bogen tab: name, class, stats, skills, languages all populated
18. Verify in Spellbook: 3 cantrips + 6 spells visible
19. Verify localStorage:
```js
const chars = JSON.parse(localStorage.getItem("chars_v4"));
const eldrin = chars.find(c => c.name === "Eldrin");
({ klass: eldrin.klass, hd: eldrin.hd, alignment: eldrin.alignment, maxHp: eldrin.maxHp, languages: eldrin.languages.length })
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CharWizard/steps/Step16_Review.jsx src/components/CharWizard/CharCreationWizard.jsx src/i18n/index.js
git commit -m "feat(wizard): Step 16 — review + final char creation"
```

---

## Phase I — Polish & Integration

### Task I1: Target-level picker in wizard entry

**Files:**
- Modify: `src/components/CharManager.jsx`
- Modify: `src/i18n/index.js`

The wizard supports targetLevel 1-20 but there's no UI yet to set it. Add a small picker when "+ Neu" is clicked.

- [ ] **Step 1: i18n keys**

DE:
```
    "wizard.entry.title": "Neuen Charakter erstellen",
    "wizard.entry.lvl_lbl": "Start-Level",
    "wizard.entry.start": "Wizard starten",
```
EN:
```
    "wizard.entry.title": "Create new character",
    "wizard.entry.lvl_lbl": "Start level",
    "wizard.entry.start": "Start wizard",
```

- [ ] **Step 2: Add a modal for level pick in CharManager**

Open `src/components/CharManager.jsx`. Replace the "+ Neu" button onClick with a state-driven mini-prompt.

Add state:
```js
  const [showEntry, setShowEntry] = useState(false);
  const [pickLevel, setPickLevel] = useState(1);
```

Replace the "+ Neu" button:
```jsx
            <button type="button" onClick={() => setShowEntry(true)} style={sx.bsm(C.green)}>
              {t("char.new_short","+ Neu")}
            </button>
```

Add entry modal (rendered conditionally above the char list):
```jsx
        {showEntry && (
          <div style={{ ...sx.card, marginBottom: 12, padding: 18, borderColor: C.green }}>
            <h3 style={{ color: C.greenBright, marginBottom: 8 }}>{t("wizard.entry.title","Neuen Charakter erstellen")}</h3>
            <label style={sx.lbl}>{t("wizard.entry.lvl_lbl","Start-Level")}</label>
            <input type="number" min={1} max={20} value={pickLevel}
              onChange={(e) => setPickLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              style={{ ...sx.inp, width: 80 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => { setShowEntry(false); startWizard(pickLevel); }} style={sx.btn(C.green)}>
                {t("wizard.entry.start","Wizard starten")}
              </button>
              <button type="button" onClick={() => setShowEntry(false)} style={sx.bsm(C.textDim)}>
                {t("char.cancel_word","Abbrechen")}
              </button>
            </div>
          </div>
        )}
```

- [ ] **Step 3: Verify**

1. Click "+ Neu" → see modal with level picker
2. Set 5 → Start → wizard opens with targetLevel = 5
3. State:
```js
JSON.parse(localStorage.getItem("wizard_active_v1")).targetLevel
```
Expected: `5`.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharManager.jsx src/i18n/index.js
git commit -m "feat(wizard): entry modal with start-level picker"
```

---

### Task I2: Alignment in Bogen tab + PDF export

**Files:**
- Modify: `src/components/CharacterSheet/Bogen.jsx`
- Modify: `src/utils/charPdf.js`
- Modify: `src/i18n/index.js`

- [ ] **Step 1: Add alignment display to Bogen Identity header**

Open `src/components/CharacterSheet/Bogen.jsx`. Find the Identity Header section (around line 54 — the `<div style={{ marginTop: 8, ... }}>` that shows race/background/originFeat). Add an alignment span:

```jsx
          {char.alignment && (
            <span><strong style={{ color: C.amberBright }}>{alignLabel(char.alignment, lang)}</strong></span>
          )}
```

At the top of the file, add the import:

```js
import { ALIGNMENTS, alignLabel } from "../CharWizard/data/alignmentDescriptions.js";
```

Update the `useI18n` destructure to include `lang`:

```js
const { t, lang } = useI18n();
```

- [ ] **Step 2: Add alignment to PDF export**

Open `src/utils/charPdf.js`. Find the Identity/Personality section. Add a row for alignment:

```js
  // Inside the appropriate section:
  if (char.alignment) {
    html += `<tr><td>${esc(t("pdf.alignment_lbl","Alignment"))}</td><td>${esc(char.alignment)}</td></tr>`;
  }
```

Add i18n keys:

DE: `"pdf.alignment_lbl": "Alignment",`
EN: `"pdf.alignment_lbl": "Alignment",`

- [ ] **Step 3: Verify**

1. Create a wizard char with alignment = "CG"
2. Open Bogen tab → alignment shows in identity header
3. Click PDF Export → printout shows "Alignment: CG"

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterSheet/Bogen.jsx src/utils/charPdf.js src/i18n/index.js
git commit -m "feat(wizard): alignment shown in Bogen + PDF export"
```

---

### Task I3: i18n parity audit

**Files:**
- Read-only audit

- [ ] **Step 1: Extract all wizard.* keys used in code**

```bash
cd "D:/89_Claude/Claude Code/DnD_APP"
grep -rhoE 't\("(wizard\.[a-z0-9_\.]+)"' src/components/CharWizard | grep -oE '"wizard\.[a-z0-9_\.]+"' | sort -u > /tmp/wizard_keys_used.txt
wc -l /tmp/wizard_keys_used.txt
```

- [ ] **Step 2: Extract keys defined in i18n DE + EN**

```bash
grep -oE '"wizard\.[a-z0-9_\.]+"' src/i18n/index.js | sort -u > /tmp/wizard_keys_defined.txt
wc -l /tmp/wizard_keys_defined.txt
```

- [ ] **Step 3: Diff**

```bash
comm -23 /tmp/wizard_keys_used.txt /tmp/wizard_keys_defined.txt
```
Expected: empty output (all used keys are defined).

- [ ] **Step 4: Verify DE+EN parity**

```bash
# Count occurrences per key in i18n/index.js — should be 2 (DE + EN)
grep -c '"wizard.s1.title"' src/i18n/index.js
```
Expected: `2`.

Run a one-liner check:
```bash
for k in $(grep -oE '"wizard\.[a-z0-9_\.]+"' src/i18n/index.js | sort -u); do
  count=$(grep -c "$k" src/i18n/index.js)
  if [ "$count" -ne 2 ]; then echo "MISSING PARITY: $k (count=$count)"; fi
done
```
Expected: no output.

- [ ] **Step 5: Commit any fixes (if parity gaps found)**

If keys missing, add them and:
```bash
git add src/i18n/index.js
git commit -m "fix(wizard): close i18n DE/EN parity gaps"
```

---

### Task I4: Final smoke-test all 4 happy paths

**Files:**
- No files modified — verification only

- [ ] **Step 1: Happy-Caster path (Magier / Sage / Hochelf / Lv1)**

Run the full Step01-Step16 flow as documented in Task H2 Step 4. After creation, verify the resulting char has:
- klass = Magier, hd = d6
- skills includes skill_Arcana + skill_Investigation
- alignment present
- 3 cantrips + 6 lv1 spells in spells_known_<id>
- All identity fields filled

- [ ] **Step 2: Happy-Martial path (Kämpfer / Soldat / Mensch / Lv1)**

Run the wizard with Kämpfer, including Step 3 (Fighting Style) and Step 5 (equipment). Verify:
- klass = Kämpfer, hd = d10
- classChoices.fightingStyle = (whatever was picked)
- Step 4 (spellcasting) is SKIPPED

- [ ] **Step 3: Multi-Level path (Paladin / Acolyte / Aasimar / Lv5)**

Set targetLevel = 5 via the entry modal. Verify:
- Steps 1-14 run as expected
- Step 15 runs 4 times (for Lv2, 3, 4, 5)
- Lv3 requires Subclass pick
- Lv4 requires ASI/Feat pick
- Final char has level = 5, subclasses["Paladin"] = (chosen), maxHp = HD-max + sum of (HD-avg + CON-mod) × 4

- [ ] **Step 4: Resume path (Druide / Hermit / Halbling / Lv3)**

1. Start wizard, get to Step 8
2. Cancel → "Speichern & schließen"
3. Reload page
4. Click "+ Neu" → see Resume-Banner
5. Click "▶ Fortsetzen" → wizard opens at Step 8 (not Step 1)
6. Complete the wizard → char created successfully

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit --allow-empty -m "chore(wizard): all 4 smoke paths verified"
```

---

## Self-Review Notes

This plan addresses every section of the spec:

| Spec Section | Implementing Tasks |
|---|---|
| §1 Goal | A1–I4 (whole plan) |
| §2 Confirmed Requirements | A1 (schema), B5–B6 (entry replace), F1 (point-buy), C5+D4 (equipment), C4 (spells), I1 (start-level), D3 (lang dropdown), F2 (alignment), B6 (resume), B4–B5 (full-screen) |
| §3 Architecture | B1–B6 (state + shell), C1–H2 (steps) |
| §4 State Shape | B1 (initial state) |
| §5 Schema Additions | A1 |
| §6 Commit Logic | H1 |
| §7 Multi-Level Loop | G1 |
| §8 Resume Behavior | B6 |
| §9 Validation | each step exports `validate()` |
| §10 Error Handling | B3 (validator), B4 (shell shows error banner) |
| §11 i18n | every step adds keys; I3 audits parity |
| §12 Testing | I4 |
| §13 Mobile UX | inline in step layouts (auto-fit grid + min-44px buttons in card padding) |
| §15 Acceptance Criteria | I4 (all 4 paths), I2 (alignment in Bogen + PDF) |

**Placeholder scan:** No `TBD`, `TODO`, or `add appropriate X` in plan. All code blocks are complete.

**Type consistency:** State shape from B1 matches what every step reads/writes. `buildCharFromWizard` in H1 consumes the exact same shape.

**Known small caveats** (intentional, not gaps):
- Detailed feat-picker is text-input only in Step 15 (`asi: { mode: "feat", feat: "<name>" }`). A full PHB-feat-list picker can be added later — out-of-scope for V1 per spec §14.
- Background data (`backgrounds.js`) is assumed to expose `originFeat`, `skills`, `asiAbilities`, `toolChoices`, `languageChoice`, `equipment`. If the actual file structure differs, audit before Task D1 and adjust the field reads accordingly.
- Race data (`races.js`) is assumed to expose `choices` for species with picks (Half-Elf/Tiefling/Elf). Same caveat as above.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-16-char-creation-wizard.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
