import { C, sx, FH } from "../constants/theme.js";
import { CONDITIONS, getCondition } from "../utils/conditions.js";
import ExhaustionTracker from "./ExhaustionTracker.jsx";
import { useI18n } from "../i18n/index.js";

// ── Mechanische Effekte als lesbarer Text ────────────────────────────────────
function effectSummary(cond, t) {
  const e = cond.effects;
  const parts = [];
  if (e.attackerDisadvantage) parts.push(t("cond.attacker_dis","Nachteil auf eigene Angriffe"));
  if (e.attackerAdvantage)    parts.push(t("cond.attacker_adv","Vorteil auf eigene Angriffe"));
  if (e.targetAdvantage)      parts.push(t("cond.target_adv","Angriffe gegen dich: Vorteil"));
  if (e.targetDisadvantage)   parts.push(t("cond.target_dis","Angriffe gegen dich: Nachteil"));
  if (e.autoFailSaves?.length) parts.push(`${t("cond.auto_fail","Auto-Fail")}: ${e.autoFailSaves.join(", ")} ${t("cond.saves","Saves")}`);
  if (e.speedZero)            parts.push(t("cond.speed_zero","Speed = 0"));
  if (e.noActions)            parts.push(t("cond.no_actions","Keine Aktionen/Reaktionen"));
  return parts;
}

// ── Farbe pro Condition ───────────────────────────────────────────────────────
function condColor(cond) {
  // use color from utils/conditions.js if available
  return cond.color || C.redBright;
}

// ── Komponente ────────────────────────────────────────────────────────────────
export default function ConditionsTracker({ char, setChar }) {
  const { t, lang } = useI18n();
  const activeIds = char?.activeConditions || [];
  // Picker für Condition-Namen + Beschreibungen DE/EN
  const condName = (c) => (lang === "en" && c.nameEN) ? c.nameEN : c.name;
  const condDesc = (c) => (lang === "en" && c.descEN) ? c.descEN : c.desc;

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
    if (cond.effects.attackerAdvantage) advHints.push(`${cond.icon} ${condName(cond)}`);
    if (cond.effects.attackerDisadvantage) disHints.push(`${cond.icon} ${condName(cond)}`);
  }

  // Exhaustion aus regulären Conditions ausfiltern (eigener Tracker)
  const PICKER_CONDITIONS = CONDITIONS.filter(c => c.id !== "exhaustion");

  return (
    <div>
      {/* ── Exhaustion Tracker ── */}
      <ExhaustionTracker char={char} setChar={setChar} />

      {/* ── Roll-Modifier Hinweis ── */}
      {(advHints.length > 0 || disHints.length > 0) && (
        <div style={{ ...sx.card, background: `${C.amber}0e`, border: `1px solid ${C.amberBright}44`, marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: C.amberBright, fontFamily: FH, fontWeight: 700, marginBottom: 6 }}>
            ⚠️ {t("cond.roll_mods","Aktive Würfel-Modifikatoren")}
          </div>
          {advHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.greenBright, marginBottom: 4 }}>
              ⬆ {t("cond.adv_on_attacks","Vorteil auf Angriffe")}: {advHints.join(", ")}
            </div>
          )}
          {disHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.redBright }}>
              ⬇ {t("cond.dis_on_attacks","Nachteil auf Angriffe")}: {disHints.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* ── Aktive Conditions ── */}
      {activeConds.length > 0 && (
        <div style={sx.card}>
          <div style={sx.ct}>🎯 {t("cond.active_conditions","Aktive Conditions")} ({activeConds.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {activeConds.map(cond => {
              const col = condColor(cond);
              const effects = effectSummary(cond, t);
              return (
                <div key={cond.id} style={{
                  background: `${col}18`, border: `1px solid ${col}66`,
                  borderRadius: 8, padding: "10px 12px", minWidth: 180, maxWidth: 260,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: FH, fontSize: 13, color: col, fontWeight: 700 }}>
                      {cond.icon} {condName(cond)}
                    </span>
                    <button onClick={() => toggle(cond.id)} style={sx.bsm(C.red)}>✕</button>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, marginBottom: effects.length ? 6 : 0 }}>
                    {condDesc(cond)}
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
        <div style={sx.ct}>📋 {t("cond.pick","Condition wählen")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 8 }}>
          {PICKER_CONDITIONS.map(cond => {
            const isActive = activeIds.includes(cond.id);
            const col = condColor(cond);
            const effects = effectSummary(cond, t);
            const nm = condName(cond);
            const dc = condDesc(cond);
            return (
              <div key={cond.id} onClick={() => toggle(cond.id)} style={{
                background: isActive ? `${col}28` : C.surface,
                border: `1px solid ${isActive ? col : C.border}`,
                borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                transition: "all .15s",
              }}>
                <div style={{ fontFamily: FH, fontSize: 12, color: isActive ? col : C.textBright, fontWeight: 700, marginBottom: 3 }}>
                  {cond.icon} {nm}
                  {isActive && <span style={{ fontSize: 9, color: col, marginLeft: 5 }}>✓ {t("cond.active","AKTIV")}</span>}
                </div>
                <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.4, marginBottom: effects.length ? 4 : 0 }}>
                  {dc.length > 70 ? dc.slice(0, 70) + "…" : dc}
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
