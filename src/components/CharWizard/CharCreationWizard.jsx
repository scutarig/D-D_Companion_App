import { useMemo } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useDialog } from "../../hooks/useDialog.jsx";
import { useI18n } from "../../i18n/index.js";
import { useWizardState } from "./hooks/useWizardState.js";
import { activeSteps, nextStepId, prevStepId } from "./utils/wizardSteps.js";
import { validateWizardState } from "./utils/validateWizardState.js";
import Placeholder from "./steps/Placeholder.jsx";
import Step01_ClassSelect, { validate as validateStep01 } from "./steps/Step01_ClassSelect.jsx";

// Step component registry — populated as steps are implemented.
const STEP_COMPONENTS = {
  class_select: Object.assign(Step01_ClassSelect, { validate: validateStep01 }),
};

export default function CharCreationWizard() {
  const { t } = useI18n();
  const { confirm } = useDialog();
  const { state, updatePartial, setStep, goBack, abandon } = useWizardState();

  const flow = useMemo(() => state ? activeSteps(state) : [], [state]);

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

  const currentIdx = flow.findIndex((s) => s.id === state.currentStep);
  const Step = STEP_COMPONENTS[state.currentStep] || Placeholder;
  const validation = (Step.validate || (() => ({ ok: true })))(state);

  const onNext = () => {
    // Special case: level-up loop is multi-step (one screen per level)
    if (state.currentStep === "levelup_loop") {
      if (state.levelupCurrent < state.targetLevel) {
        updatePartial({ levelupCurrent: state.levelupCurrent + 1 });
        return;
      }
      // Last level reached — fall through to normal advance
    }
    const next = nextStepId(state.currentStep, state);
    if (next) setStep(next);
  };

  const onBack = () => {
    if (state.currentStep === "levelup_loop" && state.levelupCurrent > 2) {
      updatePartial({ levelupCurrent: state.levelupCurrent - 1 });
      return;
    }
    const prev = prevStepId(state.currentStep, state);
    if (prev) goBack();
  };

  const onCancel = async () => {
    const ok = await confirm(
      t("wizard.shell.cancel_confirm_msg","Dein Fortschritt wird gespeichert — du kannst später fortsetzen."),
      { title: t("wizard.shell.cancel_confirm_title","Wizard abbrechen?") }
    );
    if (ok) {
      // State stays in localStorage. Reload puts us back on normal layout
      // and the resume-banner picks the state up on next + Neu click.
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
          {state.currentStep === "levelup_loop" && ` (Lv ${state.levelupCurrent} / ${state.targetLevel})`}
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
