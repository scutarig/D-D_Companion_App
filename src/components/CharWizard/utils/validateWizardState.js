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
