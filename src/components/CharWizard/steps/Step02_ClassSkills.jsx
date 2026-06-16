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
  const cls = D3_KLASSEN.find((c) => c.name === s.klass);
  const count = cls?.skills?.count || 2;
  return (s.classSkillsChosen?.length === count)
    ? { ok: true }
    : { ok: false, errorKey: "wizard.err_no_skills" };
};
