import { C, sx, FH, SC } from "../../../constants/theme.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step07_BackgroundASI({ state, updatePartial }) {
  const { t } = useI18n();
  const bg = BACKGROUNDS_FULL.find((b) => b.name === state.background);
  if (!bg) return null;
  const abilities = bg.abilityScores || ["STR", "DEX", "CON"];

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
