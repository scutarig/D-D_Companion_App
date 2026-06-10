import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { DOWNTIME_ACTIVITIES, DOWNTIME_TYPES } from "../../data/downtime.js";
import { useChar } from "../../context/CharContext.jsx";

let _uid = Date.now();
const uid = () => (++_uid).toString(36);

export default function DowntimeTracker() {
  const { active: char } = useChar();
  const charId = char?.id || "g";
  const [active, setActive]     = usePersist(`downtime_active_${charId}`, []);
  const [history, setHistory]   = usePersist(`downtime_history_${charId}`, []);
  const [typeFilter, setTypeFilter] = useState("all");
  const [newForm, setNewForm]   = useState(null);   // { activityId, label, daysTotal, notes }
  const [selEntry, setSelEntry] = useState(null);   // active entry id for detail
  const [histShow, setHistShow] = useState(false);

  // ── Start new activity ───────────────────────────────────────────────────────
  const openForm = (act) => {
    setNewForm({ activityId: act.id, label: act.name, daysTotal: act.daysDefault, notes: "" });
  };

  const confirmStart = () => {
    if (!newForm) return;
    const entry = {
      id: uid(),
      activityId: newForm.activityId,
      label: newForm.label,
      daysTotal: Math.max(1, parseInt(newForm.daysTotal) || 1),
      daysSpent: 0,
      notes: newForm.notes,
      startedAt: Date.now(),
    };
    setActive(p => [...p, entry]);
    setNewForm(null);
  };

  // ── Advance days ─────────────────────────────────────────────────────────────
  const addDays = (id, delta) => {
    setActive(p => p.map(e => e.id !== id ? e : { ...e, daysSpent: Math.max(0, e.daysSpent + delta) }));
  };

  // ── Complete ─────────────────────────────────────────────────────────────────
  const complete = (entry, outcome = "") => {
    const hist = { ...entry, completedAt: Date.now(), outcome, finished: true };
    setHistory(p => [hist, ...p].slice(0, 50));
    setActive(p => p.filter(e => e.id !== entry.id));
    setSelEntry(null);
  };

  // ── Abandon ──────────────────────────────────────────────────────────────────
  const abandon = (entry) => {
    const hist = { ...entry, completedAt: Date.now(), outcome: "Abgebrochen", finished: false };
    setHistory(p => [hist, ...p].slice(0, 50));
    setActive(p => p.filter(e => e.id !== entry.id));
    setSelEntry(null);
  };

  const getActivity = id => DOWNTIME_ACTIVITIES.find(a => a.id === id);
  const typeKeys    = ["all", ...Object.keys(DOWNTIME_TYPES)];
  const filtered    = typeFilter === "all"
    ? DOWNTIME_ACTIVITIES
    : DOWNTIME_ACTIVITIES.filter(a => a.type === typeFilter);

  return (
    <div>
      {/* ── Active activities ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ ...sx.jb, marginBottom: 10 }}>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, letterSpacing: 0.5 }}>
            ⏳ AKTIVE AKTIVITÄTEN
            {active.length > 0 && (
              <span style={{ background: C.amber, color: C.bg, borderRadius: "50%", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 6 }}>
                {active.length}
              </span>
            )}
          </div>
          <button onClick={() => setHistShow(p => !p)} style={{ ...sx.bsm(C.textDim), fontSize: 10 }}>
            📋 Verlauf {history.length > 0 ? `(${history.length})` : ""}
          </button>
        </div>

        {active.length === 0 ? (
          <div style={{ color: C.textDim, fontStyle: "italic", fontSize: 13, padding: "10px 0" }}>
            Keine aktiven Aktivitäten. Starte eine aus der Liste unten.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {active.map(entry => {
              const act  = getActivity(entry.activityId);
              const pct  = Math.min(1, entry.daysSpent / entry.daysTotal);
              const done = entry.daysSpent >= entry.daysTotal;
              const col  = act?.color || C.purpleBright;
              const isSel = selEntry === entry.id;
              return (
                <div key={entry.id}
                  style={{ background: C.surface, border: `1px solid ${isSel ? col : C.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}
                  onClick={() => setSelEntry(isSel ? null : entry.id)}>
                  {/* Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 18 }}>{act?.icon || "⏳"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.textBright, fontFamily: FH, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {entry.label}
                        </div>
                        <div style={{ fontSize: 10, color: C.textDim }}>
                          {act?.name}{act?.source ? ` · ${act.source}` : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: done ? col : C.textBright, fontWeight: 700 }}>
                        {entry.daysSpent}/{entry.daysTotal} Tage
                      </span>
                      {done && <span style={{ fontSize: 10, color: col, background: `${col}22`, border: `1px solid ${col}55`, borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>✓ Bereit</span>}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: 8, height: 4, background: C.bg, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct * 100}%`, height: "100%", background: col, borderRadius: 2, transition: "width .3s" }} />
                  </div>

                  {/* Expanded controls */}
                  {isSel && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}
                      onClick={e => e.stopPropagation()}>
                      {act?.details && (
                        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>{act.details}</div>
                      )}
                      {entry.notes && (
                        <div style={{ fontSize: 11, color: C.text, marginBottom: 10, fontStyle: "italic" }}>📝 {entry.notes}</div>
                      )}
                      {/* Day controls */}
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: C.textDim }}>Tage:</span>
                        {[-1, +1, +3, +5, +10].map(d => (
                          <button key={d} onClick={() => addDays(entry.id, d)}
                            style={{ ...sx.bsm(d < 0 ? C.red : C.tealBright), fontSize: 11, padding: "3px 8px" }}>
                            {d > 0 ? `+${d}` : d}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                        <button onClick={() => complete(entry)}
                          style={{ ...sx.btn(C.green), flex: 1, fontSize: 11 }}>
                          ✓ Abschließen
                        </button>
                        <button onClick={() => abandon(entry)}
                          style={{ ...sx.btn(C.red), fontSize: 11, padding: "6px 14px" }}>
                          ✕ Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── History ───────────────────────────────────────────────────────────── */}
      {histShow && history.length > 0 && (
        <div style={{ marginBottom: 18, background: `${C.surface}88`, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontFamily: FH, fontSize: 12, color: C.textDim, fontWeight: 700, marginBottom: 8, letterSpacing: 0.4 }}>
            📋 VERLAUF ({history.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 200, overflowY: "auto" }}>
            {history.map((h, i) => {
              const act = getActivity(h.activityId);
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${C.border}55` }}>
                  <span style={{ fontSize: 14 }}>{act?.icon || "📋"}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: h.finished ? C.greenBright : C.redBright }}>{h.label}</span>
                    <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>{h.daysSpent} Tage</span>
                    {h.outcome && <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>· {h.outcome}</span>}
                  </div>
                  <span style={{ fontSize: 10, color: C.textDim }}>
                    {new Date(h.completedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
          <button onClick={() => setHistory([])} style={{ ...sx.bsm(C.red), fontSize: 10, marginTop: 8 }}>🗑️ Verlauf leeren</button>
        </div>
      )}

      {/* ── Activity picker ───────────────────────────────────────────────────── */}
      <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
        🎭 NEUE AKTIVITÄT STARTEN
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {typeKeys.map(t => {
          const info = DOWNTIME_TYPES[t];
          const active_ = typeFilter === t;
          return (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ background: active_ ? (info?.color || C.purple) + "33" : "transparent", border: `1px solid ${active_ ? (info?.color || C.purple) : C.border}`, borderRadius: 4, color: active_ ? (info?.color || C.purpleBright) : C.textDim, fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: FH, fontWeight: active_ ? 700 : 400 }}>
              {t === "all" ? "Alle" : info?.label || t}
            </button>
          );
        })}
      </div>

      {/* Activity cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
        {filtered.map(act => (
          <div key={act.id}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = act.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{act.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.textBright, fontFamily: FH }}>{act.name}</div>
                  <div style={{ fontSize: 10, color: act.color }}>
                    {DOWNTIME_TYPES[act.type]?.label} · {act.source}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: C.textDim, textAlign: "right", flexShrink: 0 }}>
                ~{act.daysDefault}T
                {act.gpPerDay !== undefined && (
                  <div style={{ color: act.gpPerDay > 0 ? C.greenBright : C.redBright, fontWeight: 700 }}>
                    {act.gpPerDay > 0 ? `+${act.gpPerDay}` : act.gpPerDay} gp/T
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, marginBottom: 10 }}>
              {act.desc}
            </div>
            <button onClick={() => openForm(act)}
              style={{ ...sx.btn(act.color), width: "100%", fontSize: 11 }}>
              + Starten
            </button>
          </div>
        ))}
      </div>

      {/* ── Start form modal ──────────────────────────────────────────────────── */}
      {newForm && (() => {
        const act = getActivity(newForm.activityId);
        return (
          <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
            onClick={() => setNewForm(null)}>
            <div style={{ ...sx.card, width: "min(400px, 92vw)", maxHeight: "80vh", overflowY: "auto", position: "relative" }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setNewForm(null)}
                aria-label="Schließen"
                style={{
                  position:"absolute", top:8, right:8, zIndex:10,
                  width:32, height:32, borderRadius:"50%",
                  background:"transparent", border:`1px solid ${C.border}`,
                  color:C.textDim, fontSize:16, lineHeight:1, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>✕</button>
              <div style={{ fontFamily: FH, fontSize: 16, color: act?.color || C.purpleBright, fontWeight: 700, marginBottom: 12, paddingRight: 32 }}>
                {act?.icon} {act?.name} starten
              </div>
              <label style={sx.lbl}>Beschriftung</label>
              <input value={newForm.label} onChange={e => setNewForm(p => ({ ...p, label: e.target.value }))}
                style={{ ...sx.inp, marginBottom: 10 }} placeholder={act?.name} />
              <label style={sx.lbl}>Geplante Tage</label>
              <input type="number" min={1} value={newForm.daysTotal}
                onChange={e => setNewForm(p => ({ ...p, daysTotal: e.target.value }))}
                style={{ ...sx.inp, marginBottom: 10, width: 80 }} />
              {act?.details && (
                <div style={{ fontSize: 11, color: C.textDim, background: C.bg, borderRadius: 6, padding: "8px 10px", marginBottom: 10, lineHeight: 1.6 }}>
                  {act.details}
                </div>
              )}
              <label style={sx.lbl}>Notizen (optional)</label>
              <textarea value={newForm.notes} onChange={e => setNewForm(p => ({ ...p, notes: e.target.value }))}
                rows={2} placeholder="Ziel, Gegenstand, Zauberlevel…"
                style={{ ...sx.inp, resize: "vertical", marginBottom: 14 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={confirmStart} style={{ ...sx.btn(act?.color || C.purple), flex: 1 }}>
                  ✓ Starten
                </button>
                <button onClick={() => setNewForm(null)} style={{ ...sx.btn(C.textDim), padding: "8px 16px" }}>
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
