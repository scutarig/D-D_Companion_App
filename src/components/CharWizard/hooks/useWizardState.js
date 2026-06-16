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
    levelupCurrent: 2,
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
