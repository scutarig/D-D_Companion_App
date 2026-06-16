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
    if (pointsRemaining(newScores) < 0) return;
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
