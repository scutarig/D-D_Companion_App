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
