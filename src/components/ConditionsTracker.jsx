import { C, sx, FH } from "../constants/theme.js";
import { CONDITIONS, getCondition } from "../utils/conditions.js";

// ── Mechanische Effekte als lesbarer Text ────────────────────────────────────
function effectSummary(cond) {
  const e = cond.effects;
  const parts = [];
  if (e.attackerDisadvantage) parts.push("Nachteil auf eigene Angriffe");
  if (e.attackerAdvantage)    parts.push("Vorteil auf eigene Angriffe");
  if (e.targetAdvantage)      parts.push("Angriffe gegen dich: Vorteil");
  if (e.targetDisadvantage)   parts.push("Angriffe gegen dich: Nachteil");
  if (e.autoFailSaves?.length) parts.push(`Auto-Fail: ${e.autoFailSaves.join(", ")} Saves`);
  if (e.speedZero)            parts.push("Speed = 0");
  if (e.noActions)            parts.push("Keine Aktionen/Reaktionen");
  return parts;
}

// ── Farbe pro Condition ───────────────────────────────────────────────────────
function condColor(cond) {
  // use color from utils/conditions.js if available
  return cond.color || C.redBright;
}

// ── Komponente ────────────────────────────────────────────────────────────────
export default function ConditionsTracker({ char, setChar }) {
  const activeIds = char?.activeConditions || [];

  const toggle = (id) => {
    if (!setChar) return;
    setChar(p => {
      const cur = p.activeConditions || [];
      return {
        ...p,
        activeConditions: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id],
      };
    });
  };

  const activeConds = activeIds.map(getCondition).filter(Boolean);

  // Build roll-modifier hints from active conditions
  const advHints = [];
  const disHints = [];
  for (const cond of activeConds) {
    if (cond.effects.attackerAdvantage) advHints.push(`${cond.icon} ${cond.name}`);
    if (cond.effects.attackerDisadvantage) disHints.push(`${cond.icon} ${cond.name}`);
  }

  return (
    <div>
      {/* ── Roll-Modifier Hinweis ── */}
      {(advHints.length > 0 || disHints.length > 0) && (
        <div style={{ ...sx.card, background: `${C.amber}0e`, border: `1px solid ${C.amberBright}44`, marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: C.amberBright, fontFamily: FH, fontWeight: 700, marginBottom: 6 }}>
            ⚠️ Aktive Würfel-Modifikatoren
          </div>
          {advHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.greenBright, marginBottom: 4 }}>
              ⬆ Vorteil auf Angriffe: {advHints.join(", ")}
            </div>
          )}
          {disHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.redBright }}>
              ⬇ Nachteil auf Angriffe: {disHints.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* ── Aktive Conditions ── */}
      {activeConds.length > 0 && (
        <div style={sx.card}>
          <div style={sx.ct}>🎯 Aktive Conditions ({activeConds.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {activeConds.map(cond => {
              const col = condColor(cond);
              const effects = effectSummary(cond);
              return (
                <div key={cond.id} style={{
                  background: `${col}18`, border: `1px solid ${col}66`,
                  borderRadius: 8, padding: "10px 12px", minWidth: 180, maxWidth: 260,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: FH, fontSize: 13, color: col, fontWeight: 700 }}>
                      {cond.icon} {cond.name}
                    </span>
                    <button onClick={() => toggle(cond.id)} style={sx.bsm(C.red)}>✕</button>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, marginBottom: effects.length ? 6 : 0 }}>
                    {cond.desc}
                  </div>
                  {effects.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {effects.map((e, i) => (
                        <span key={i} style={{
                          fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                          background: `${col}30`, color: col, display: "inline-block",
                        }}>
                          ⚡ {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Alle Conditions (Picker) ── */}
      <div style={sx.card}>
        <div style={sx.ct}>📋 Condition wählen</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 8 }}>
          {CONDITIONS.map(cond => {
            const isActive = activeIds.includes(cond.id);
            const col = condColor(cond);
            const effects = effectSummary(cond);
            return (
              <div key={cond.id} onClick={() => toggle(cond.id)} style={{
                background: isActive ? `${col}28` : C.surface,
                border: `1px solid ${isActive ? col : C.border}`,
                borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                transition: "all .15s",
              }}>
                <div style={{ fontFamily: FH, fontSize: 12, color: isActive ? col : C.textBright, fontWeight: 700, marginBottom: 3 }}>
                  {cond.icon} {cond.name}
                  {isActive && <span style={{ fontSize: 9, color: col, marginLeft: 5 }}>✓ AKTIV</span>}
                </div>
                <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.4, marginBottom: effects.length ? 4 : 0 }}>
                  {cond.desc.length > 70 ? cond.desc.slice(0, 70) + "…" : cond.desc}
                </div>
                {effects.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {effects.map((e, i) => (
                      <span key={i} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: `${col}22`, color: col }}>
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
