import { C, sx, FH } from "../constants/theme.js";
import { EXHAUSTION_LEVELS, getExhaustionLevel } from "../data/exhaustion.js";
import { useI18n } from "../i18n/index.js";

export default function ExhaustionTracker({ char, setChar }) {
  const { t } = useI18n();
  const lv  = char?.exhaustion ?? 0;
  const cur = getExhaustionLevel(lv);

  const set = (newLv) => {
    if (!setChar) return;
    if (newLv === 6) {
      if (!confirm(t("exh.confirm_death","Stufe 6 bedeutet Tod des Charakters. Fortfahren?"))) return;
    }
    setChar(p => ({ ...p, exhaustion: newLv }));
  };

  const inc = () => { if (lv < 6) set(lv + 1); };
  const dec = () => { if (lv > 0) set(lv - 1); };

  return (
    <div style={{ ...sx.card, border: lv > 0 ? `1px solid ${cur.color}55` : `1px solid ${C.border}` }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: FH, fontSize: 12, color: lv > 0 ? cur.color : C.textDim, fontWeight: 700, letterSpacing: 0.5 }}>
          😴 {t("exh.title","ERSCHÖPFUNG")}
        </div>
        {lv > 0 && (
          <span style={{
            background: `${cur.color}22`, border: `1px solid ${cur.color}55`,
            borderRadius: 5, fontSize: 10, padding: "2px 8px",
            color: cur.color, fontWeight: 700,
          }}>
            {cur.icon} {cur.name}
          </span>
        )}
      </div>

      {/* Stufen-Track */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 10 }}>
        <button type="button" onClick={dec} disabled={lv === 0} style={{
          background: "none", border: `1px solid ${C.border}`, borderRadius: 5,
          color: C.textDim, width: 24, height: 24, cursor: lv > 0 ? "pointer" : "default",
          fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, opacity: lv === 0 ? 0.3 : 1,
        }}>−</button>

        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {EXHAUSTION_LEVELS.filter(e => e.lv > 0).map(e => {
            const filled = lv >= e.lv;
            const col    = filled ? e.color : C.border;
            return (
              <div key={e.lv} onClick={() => set(lv === e.lv ? e.lv - 1 : e.lv)}
                title={e.name}
                style={{
                  flex: 1, height: 10, borderRadius: 4, cursor: "pointer",
                  background: filled ? col : C.surface,
                  border: `1px solid ${col}`,
                  transition: "all .15s",
                  boxShadow: filled && lv === e.lv ? `0 0 8px ${col}88` : "none",
                }} />
            );
          })}
        </div>

        <button type="button" onClick={inc} disabled={lv === 6} style={{
          background: "none", border: `1px solid ${C.border}`, borderRadius: 5,
          color: C.textDim, width: 24, height: 24, cursor: lv < 6 ? "pointer" : "default",
          fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, opacity: lv === 6 ? 0.3 : 1,
        }}>+</button>

        <span style={{ fontSize: 11, fontFamily: FH, color: lv > 0 ? cur.color : C.textDim, minWidth: 28, textAlign: "right", fontWeight: 700 }}>
          {lv}/6
        </span>
      </div>

      {/* Aktive Effekte */}
      {lv > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {cur.effects.map((e, i) => (
            <span key={i} style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 4,
              background: `${cur.color}18`, color: cur.color,
              border: `1px solid ${cur.color}33`,
            }}>
              ⚡ {e}
            </span>
          ))}
        </div>
      )}

      {/* Hinweis bei Level 0 */}
      {lv === 0 && (
        <div style={{ fontSize: 11, color: C.textDim }}>
          {t("exh.level0_hint","Kein Erschöpfungsgrad aktiv. Lange Rast reduziert um 1 Stufe.")}
        </div>
      )}
    </div>
  );
}
