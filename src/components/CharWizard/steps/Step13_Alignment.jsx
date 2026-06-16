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
