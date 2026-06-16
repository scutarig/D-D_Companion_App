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

export const validate = (s) => {
  const choice = CLASS_LV1_CHOICES[s.klass];
  if (!choice) return { ok: true };
  return s.classChoices?.[choice.key]
    ? { ok: true }
    : { ok: false, errorKey: "wizard.err_no_choice" };
};
