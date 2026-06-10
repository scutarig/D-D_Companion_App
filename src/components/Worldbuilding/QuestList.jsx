import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS = {
  aktiv:         { label: "Aktiv",        icon: "⚡", color: C.greenBright },
  ausstehend:    { label: "Ausstehend",   icon: "⏳", color: C.amberBright },
  abgeschlossen: { label: "Abgeschlossen",icon: "✅", color: C.tealBright  },
  gescheitert:   { label: "Gescheitert",  icon: "💀", color: C.redBright   },
};

const PRIORITY = {
  haupt:  { label: "Hauptquest",  icon: "🌟", color: C.gold        },
  neben:  { label: "Nebenquest",  icon: "📌", color: C.blueBright  },
  geheim: { label: "Geheimquest", icon: "🔒", color: C.purpleBright},
};

const STATUS_ORDER = ["aktiv", "ausstehend", "abgeschlossen", "gescheitert"];

function newQuest() {
  return {
    id: Date.now().toString(),
    name: "", description: "",
    status: "aktiv", priority: "neben",
    locationId: "", npcIds: [],
    rewards: "", notes: "",
    steps: [],
    createdAt: new Date().toLocaleDateString("de"),
  };
}

function newStep(text = "") {
  return { id: Date.now().toString() + Math.random(), text, done: false };
}

// ── Sub-component: Step checklist ─────────────────────────────────────────────
function StepList({ steps, onChange }) {
  const [input, setInput] = useState("");

  const addStep = () => {
    if (!input.trim()) return;
    onChange([...steps, newStep(input.trim())]);
    setInput("");
  };

  const toggleStep = (id) => onChange(steps.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const deleteStep = (id) => onChange(steps.filter(s => s.id !== id));
  const editStep   = (id, text) => onChange(steps.map(s => s.id === id ? { ...s, text } : s));

  const done  = steps.filter(s => s.done).length;
  const total = steps.length;

  return (
    <div>
      <label style={sx.lbl}>Ziele / Schritte {total > 0 && <span style={{ color:C.tealBright }}>({done}/{total})</span>}</label>
      {/* Progress bar */}
      {total > 0 && (
        <div style={{ height:4, background:C.surface, borderRadius:2, margin:"4px 0 8px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(done/total)*100}%`, background:C.tealBright, borderRadius:2, transition:"width .3s" }} />
        </div>
      )}
      {steps.map(s => (
        <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
          <input type="checkbox" checked={s.done} onChange={() => toggleStep(s.id)} style={{ cursor:"pointer", accentColor:C.tealBright, flexShrink:0 }} />
          <input value={s.text} onChange={e => editStep(s.id, e.target.value)}
            style={{ ...sx.inp, flex:1, fontSize:12, textDecoration:s.done?"line-through":"none", color:s.done?C.textDim:C.text }} />
          <button onClick={() => deleteStep(s.id)} style={{ background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:13, padding:"0 2px", flexShrink:0 }}>✕</button>
        </div>
      ))}
      <div style={{ display:"flex", gap:6, marginTop:4 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Neues Ziel…"
          onKeyDown={e => { if (e.key === "Enter") addStep(); }}
          style={{ ...sx.inp, flex:1, fontSize:12 }} />
        <button onClick={addStep} style={sx.bsm(C.tealBright)}>+</button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuestList() {
  const [quests,    setQuests,    ready] = usePersist("quests_v1", []);
  const [locations]                      = usePersist("locations_v1", []);
  const [npcs]                           = usePersist("npc_list_v1", []);

  const [editing,   setEditing]  = useState(null);  // null | "new" | id
  const [draft,     setDraft]    = useState(null);
  const [selId,     setSelId]    = useState(null);   // expanded detail
  const [filterSt,  setFilterSt] = useState("alle");
  const [filterPr,  setFilterPr] = useState("alle");
  const [search,    setSearch]   = useState("");

  if (!ready) return null;

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = quests
    .filter(q => filterSt === "alle" || q.status === filterSt)
    .filter(q => filterPr === "alle" || q.priority === filterPr)
    .filter(q => !search ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const po = Object.keys(PRIORITY);
      const so = STATUS_ORDER;
      const sd = so.indexOf(a.status) - so.indexOf(b.status);
      if (sd !== 0) return sd;
      return po.indexOf(a.priority) - po.indexOf(b.priority);
    });

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const startNew = () => { setDraft(newQuest()); setEditing("new"); setSelId(null); };

  const startEdit = (q) => { setDraft({ ...q, steps: [...(q.steps || [])], npcIds: [...(q.npcIds || [])] }); setEditing(q.id); };

  const saveDraft = () => {
    if (!draft?.name?.trim()) return;
    if (editing === "new") {
      setQuests(p => [...p, draft]);
    } else {
      setQuests(p => p.map(q => q.id === draft.id ? draft : q));
    }
    setEditing(null); setDraft(null);
  };

  const deleteQuest = (id) => {
    if (!window.confirm("Quest löschen?\n(Diese Aktion kann nicht rückgängig gemacht werden.)")) return;
    setQuests(p => p.filter(q => q.id !== id));
    if (selId === id) setSelId(null);
    if (editing === id) { setEditing(null); setDraft(null); }
  };

  const cycleStatus = (id) => {
    setQuests(p => p.map(q => {
      if (q.id !== id) return q;
      const keys = STATUS_ORDER;
      const next = keys[(keys.indexOf(q.status) + 1) % keys.length];
      return { ...q, status: next };
    }));
  };

  const toggleNpc = (npcId) => {
    setDraft(p => {
      const ids = p.npcIds || [];
      return { ...p, npcIds: ids.includes(npcId) ? ids.filter(x => x !== npcId) : [...ids, npcId] };
    });
  };

  const cancel = () => { setEditing(null); setDraft(null); };

  // ── Counts ─────────────────────────────────────────────────────────────────
  const counts = Object.fromEntries(STATUS_ORDER.map(s => [s, quests.filter(q => q.status === s).length]));

  return (
    <div>
      {/* Status summary pills */}
      {quests.length > 0 && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {STATUS_ORDER.map(s => {
            const st = STATUS[s];
            if (!counts[s]) return null;
            return (
              <span key={s} style={{
                background:`${st.color}18`, border:`1px solid ${st.color}44`,
                borderRadius:6, padding:"3px 10px", fontSize:11, color:st.color, fontWeight:700,
              }}>
                {st.icon} {counts[s]} {st.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:"flex", gap:7, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="🔍 Quest suchen…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...sx.inp, flex:1, minWidth:130 }} />
        <select value={filterSt} onChange={e => setFilterSt(e.target.value)} style={{ ...sx.sel, minWidth:120 }}>
          <option value="alle">Alle Status</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS[s].icon} {STATUS[s].label}</option>)}
        </select>
        <select value={filterPr} onChange={e => setFilterPr(e.target.value)} style={{ ...sx.sel, minWidth:120 }}>
          <option value="alle">Alle Typen</option>
          {Object.entries(PRIORITY).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
        <button onClick={startNew} style={sx.btn(C.gold)}>+ Quest</button>
      </div>

      {/* Editor */}
      {editing && draft && (
        <div style={{ ...sx.card, border:`1px solid ${C.gold}55`, marginBottom:14 }}>
          <div style={{ ...sx.ct, color:C.gold, marginBottom:12 }}>
            {editing === "new" ? "✨ Neue Quest" : "✏️ Quest bearbeiten"}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* Name + Priority + Status */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <div style={{ flex:2, minWidth:160 }}>
                <label style={sx.lbl}>Name *</label>
                <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder="Questname…" style={sx.inp} autoFocus />
              </div>
              <div style={{ flex:1, minWidth:110 }}>
                <label style={sx.lbl}>Typ</label>
                <select value={draft.priority} onChange={e => setDraft(p => ({ ...p, priority: e.target.value }))} style={sx.sel}>
                  {Object.entries(PRIORITY).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div style={{ flex:1, minWidth:110 }}>
                <label style={sx.lbl}>Status</label>
                <select value={draft.status} onChange={e => setDraft(p => ({ ...p, status: e.target.value }))} style={sx.sel}>
                  {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS[s].icon} {STATUS[s].label}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={sx.lbl}>Beschreibung</label>
              <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                placeholder="Auftrag, Hintergrundinformationen…"
                style={{ ...sx.inp, minHeight:70, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>

            {/* Steps */}
            <StepList steps={draft.steps || []} onChange={steps => setDraft(p => ({ ...p, steps }))} />

            {/* Location + Rewards */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {locations.length > 0 && (
                <div style={{ flex:1, minWidth:140 }}>
                  <label style={sx.lbl}>Ort</label>
                  <select value={draft.locationId || ""} onChange={e => setDraft(p => ({ ...p, locationId: e.target.value }))} style={sx.sel}>
                    <option value="">— kein Ort —</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ flex:1, minWidth:140 }}>
                <label style={sx.lbl}>Belohnungen</label>
                <input value={draft.rewards} onChange={e => setDraft(p => ({ ...p, rewards: e.target.value }))}
                  placeholder="500 Gold, Magisches Schwert…" style={sx.inp} />
              </div>
            </div>

            {/* NPCs */}
            {npcs.filter(n => n.custom !== false || n.id > 100).length > 0 || npcs.length > 0 ? (
              <div>
                <label style={sx.lbl}>Beteiligte NPCs</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:4 }}>
                  {npcs.map(n => {
                    const sel = (draft.npcIds || []).includes(String(n.id));
                    return (
                      <button key={n.id} onClick={() => toggleNpc(String(n.id))} style={{
                        background: sel ? `${C.purpleBright}22` : C.surface,
                        border: `1px solid ${sel ? C.purpleBright : C.border}`,
                        borderRadius:6, padding:"3px 9px", fontSize:11,
                        color: sel ? C.purpleBright : C.textDim, cursor:"pointer", transition:"all .15s",
                      }}>
                        {sel ? "✓ " : ""}{n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Notes */}
            <div>
              <label style={sx.lbl}>DM-Notizen</label>
              <textarea value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))}
                placeholder="Geheime Infos, Twists, Plot-Verbindungen…"
                style={{ ...sx.inp, minHeight:55, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveDraft} style={sx.btn(C.gold)} disabled={!draft.name?.trim()}>💾 Speichern</button>
              <button onClick={cancel} style={sx.bsm(C.textDim)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* Quest list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.textDim, fontSize:13 }}>
          {quests.length === 0
            ? <span>Noch keine Quests — <button onClick={startNew} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontSize:13 }}>erste Quest anlegen</button></span>
            : "Keine Ergebnisse"}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(q => {
            const st    = STATUS[q.status]   || STATUS.aktiv;
            const pr    = PRIORITY[q.priority] || PRIORITY.neben;
            const isExp = selId === q.id;
            const steps = q.steps || [];
            const done  = steps.filter(s => s.done).length;
            const loc   = locations.find(l => l.id === q.locationId);
            const qNpcs = npcs.filter(n => (q.npcIds || []).includes(String(n.id)));

            return (
              <div key={q.id} style={{
                ...sx.card,
                border:`1px solid ${st.color}44`,
                borderLeft:`3px solid ${st.color}`,
                transition:"border-color .15s",
              }}>
                {/* Card header */}
                <div style={sx.jb}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0, cursor:"pointer" }}
                    onClick={() => setSelId(isExp ? null : q.id)}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{pr.icon}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:FH, fontSize:13, color:C.textBright, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {q.name}
                      </div>
                      <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:2, flexWrap:"wrap" }}>
                        {/* Status badge */}
                        <span style={{ background:`${st.color}22`, color:st.color, border:`1px solid ${st.color}44`, borderRadius:4, fontSize:9, padding:"1px 6px", fontWeight:700 }}>
                          {st.icon} {st.label}
                        </span>
                        {/* Priority badge */}
                        <span style={{ background:`${pr.color}18`, color:pr.color, border:`1px solid ${pr.color}33`, borderRadius:4, fontSize:9, padding:"1px 6px" }}>
                          {pr.label}
                        </span>
                        {/* Step progress */}
                        {steps.length > 0 && (
                          <span style={{ fontSize:9, color:done===steps.length ? C.tealBright : C.textDim }}>
                            {done}/{steps.length} Ziele
                          </span>
                        )}
                        {/* Location */}
                        {loc && <span style={{ fontSize:9, color:C.amberBright }}>📍 {loc.name}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                    {/* Quick status cycle */}
                    <button onClick={() => cycleStatus(q.id)} title="Status wechseln"
                      style={{ ...sx.bsm(st.color), fontSize:12, padding:"3px 8px" }}>
                      {st.icon}
                    </button>
                    <button onClick={() => startEdit(q)} style={sx.bsm(C.gold)}>✏️</button>
                    <button onClick={() => deleteQuest(q.id)} style={sx.bsm(C.red)}>🗑️</button>
                  </div>
                </div>

                {/* Step progress bar (compact, always visible) */}
                {steps.length > 0 && (
                  <div style={{ height:3, background:C.surface, borderRadius:2, margin:"8px 0 0", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(done/steps.length)*100}%`, background:st.color, borderRadius:2, transition:"width .3s" }} />
                  </div>
                )}

                {/* Expanded detail */}
                {isExp && (
                  <div style={{ marginTop:10, borderTop:`1px solid ${C.border}`, paddingTop:10, display:"flex", flexDirection:"column", gap:8 }}>
                    {q.description && (
                      <div style={{ fontSize:12, color:C.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{q.description}</div>
                    )}

                    {/* Step checklist (interactive) */}
                    {steps.length > 0 && (
                      <div>
                        <div style={{ fontSize:10, color:C.textDim, fontFamily:FH, letterSpacing:0.5, marginBottom:5 }}>ZIELE</div>
                        {steps.map(s => (
                          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                            <input type="checkbox" checked={s.done}
                              onChange={() => setQuests(p => p.map(x => x.id !== q.id ? x : {
                                ...x, steps: (x.steps ?? []).map(st2 => st2.id === s.id ? { ...st2, done: !st2.done } : st2)
                              }))}
                              style={{ cursor:"pointer", accentColor:st.color, flexShrink:0 }} />
                            <span style={{ fontSize:12, color:s.done?C.textDim:C.text, textDecoration:s.done?"line-through":"none" }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NPCs */}
                    {qNpcs.length > 0 && (
                      <div>
                        <div style={{ fontSize:10, color:C.textDim, fontFamily:FH, letterSpacing:0.5, marginBottom:5 }}>BETEILIGTE NPCS</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                          {qNpcs.map(n => (
                            <span key={n.id} style={{ background:`${C.purple}18`, border:`1px solid ${C.purple}44`, borderRadius:5, fontSize:11, color:C.purpleBright, padding:"2px 8px" }}>
                              👤 {n.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    {q.rewards && (
                      <div style={{ background:`${C.gold}0e`, border:`1px solid ${C.gold}33`, borderRadius:7, padding:"7px 11px", fontSize:12, color:C.gold }}>
                        🎁 <strong>Belohnungen:</strong> {q.rewards}
                      </div>
                    )}

                    {/* Notes */}
                    {q.notes && (
                      <div style={{ background:`${C.purple}0a`, border:`1px solid ${C.purple}33`, borderRadius:7, padding:"7px 11px", fontSize:12, color:C.textDim, lineHeight:1.6 }}>
                        <div style={{ fontSize:9, color:C.purpleBright, fontFamily:FH, fontWeight:700, marginBottom:4 }}>DM-NOTIZEN</div>
                        {q.notes}
                      </div>
                    )}

                    {q.createdAt && (
                      <div style={{ fontSize:10, color:C.textDim }}>Erstellt: {q.createdAt}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {quests.length > 0 && (
        <div style={{ marginTop:14, fontSize:11, color:C.textDim, textAlign:"center" }}>
          {quests.length} Quest{quests.length !== 1 ? "s" : ""} total
          {(filterSt !== "alle" || filterPr !== "alle" || search) ? ` · ${filtered.length} angezeigt` : ""}
        </div>
      )}
    </div>
  );
}
