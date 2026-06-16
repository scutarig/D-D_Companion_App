import { C, sx, FH } from "../../../constants/theme.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step06_BackgroundSelect({ state, updatePartial }) {
  const { t } = useI18n();
  // Wizard scope: only 2024 PHB backgrounds (16 core).
  const bgs = BACKGROUNDS_FULL.filter((b) => b.edition === "2024");

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s6.title","Wähle deinen Background")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s6.subtitle","Background bestimmt Origin-Feat, Skill-Profs und Equipment.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {bgs.map((bg) => {
          const isSelected = state.background === bg.name;
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
                {isSelected ? "✓ " : ""}{bg.name}
              </div>
              {bg.feat && (
                <div style={{ fontSize: 11, color: C.amberBright, marginBottom: 4 }}>
                  <strong>{t("wizard.s6.feat_lbl","Origin-Feat:")}</strong> {bg.feat}
                </div>
              )}
              {bg.skillProfs && (
                <div style={{ fontSize: 11, color: C.textDim }}>
                  <strong>{t("wizard.s6.skills_lbl","Skills:")}</strong> {bg.skillProfs.join(", ")}
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
