import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { t as moduleT, useI18n } from "../../i18n/index.js";
import { fmtDate } from "../../utils/locale.js";

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_META = {
  aktiv:         { icon: "⚡", color: C.greenBright, key: "wb.status_active", de: "Aktiv" },
  ausstehend:    { icon: "⏳", color: C.amberBright, key: "wb.status_pending", de: "Ausstehend" },
  abgeschlossen: { icon: "✅", color: C.tealBright,  key: "wb.status_done", de: "Abgeschlossen" },
  gescheitert:   { icon: "💀", color: C.redBright,   key: "wb.status_failed", de: "Gescheitert" },
};

const PRIORITY_META = {
  haupt:  { icon: "🌟", color: C.gold,         key: "wb.prio_main", de: "Hauptquest" },
  neben:  { icon: "📌", color: C.blueBright,   key: "wb.prio_side", de: "Nebenquest" },
  geheim: { icon: "🔒", color: C.purpleBright, key: "wb.prio_secret", de: "Geheimquest" },
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
    createdAtIso: new Date().toISOString(),
  };
}

function newStep(text = "") {
  return { id: Date.now().toString() + Math.random(), text, done: false };
}

// ── Sub-component: Step checklist ─────────────────────────────────────────────
function StepList({ steps, onChange }) {
  const { t } = useI18n();
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
      <label style={sx.lbl}>{t("wb.steps_label","Ziele / Schritte")} {total > 0 && <span style={{ color:C.tealBright }}>({done}/{total})</span>}</label>
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
          <button type="button" onClick={() => deleteStep(s.id)} style={{ background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:13, padding:"0 2px", flexShrink:0 }}>✕</button>
        </div>
      ))}
      <div style={{ display:"flex", gap:6, marginTop:4 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={t("wb.new_step_placeholder","Neues Ziel…")}
          onKeyDown={e => { if (e.key === "Enter") addStep(); }}
          style={{ ...sx.inp, flex:1, fontSize:12 }} />
        <button type="button" onClick={addStep} style={sx.bsm(C.tealBright)}>+</button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuestList() {
  const { t } = useI18n();
  const STATUS = Object.fromEntries(Object.entries(STATUS_META).map(([k, v]) => [k, { ...v, label: t(v.key, v.de) }]));
  const PRIORITY = Object.fromEntries(Object.entries(PRIORITY_META).map(([k, v]) => [k, { ...v, label: t(v.key, v.de) }]));
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
      const po = Object.keys(PRIORITY_META);
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
    if (!window.confirm(moduleT("wb.confirm_delete_quest","Quest löschen?\n(Diese Aktion kann nicht rückgängig gemacht werden.)"))) return;
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
        <input placeholder={t("wb.quest_search_placeholder","🔍 Quest suchen…")} value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...sx.inp, flex:1, minWidth:130 }} />
        <select value={filterSt} onChange={e => setFilterSt(e.target.value)} style={{ ...sx.sel, minWidth:120 }}>
          <option value="alle">{t("wb.all_status","Alle Status")}</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS[s].icon} {STATUS[s].label}</option>)}
        </select>
        <select value={filterPr} onChange={e => setFilterPr(e.target.value)} style={{ ...sx.sel, minWidth:120 }}>
          <option value="alle">{t("wb.all_types","Alle Typen")}</option>
          {Object.entries(PRIORITY).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
        <button type="button" onClick={startNew} style={sx.btn(C.gold)}>{t("wb.new_quest_btn","+ Quest")}</button>
      </div>

      {/* Editor */}
      {editing && draft && (
        <div style={{ ...sx.card, border:`1px solid ${C.gold}55`, marginBottom:14 }}>
          <div style={{ ...sx.ct, color:C.gold, marginBottom:12 }}>
            {editing === "new" ? t("wb.new_quest_title","✨ Neue Quest") : t("wb.edit_quest_title","✏️ Quest bearbeiten")}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* Name + Priority + Status */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <div style={{ flex:2, minWidth:160 }}>
                <label style={sx.lbl}>{t("wb.name_required","Name *")}</label>
                <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder={t("wb.quest_name_placeholder","Questname…")} style={sx.inp} autoFocus />
              </div>
              <div style={{ flex:1, minWidth:110 }}>
                <label style={sx.lbl}>{t("wb.type_label","Typ")}</label>
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
              <label style={sx.lbl}>{t("wb.description_label","Beschreibung")}</label>
              <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                placeholder={t("wb.quest_description_placeholder","Auftrag, Hintergrundinformationen…")}
                style={{ ...sx.inp, minHeight:70, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>

            {/* Steps */}
            <StepList steps={draft.steps || []} onChange={steps => setDraft(p => ({ ...p, steps }))} />

            {/* Location + Rewards */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {locations.length > 0 && (
                <div style={{ flex:1, minWidth:140 }}>
                  <label style={sx.lbl}>{t("wb.location_label","Ort")}</label>
                  <select value={draft.locationId || ""} onChange={e => setDraft(p => ({ ...p, locationId: e.target.value }))} style={sx.sel}>
                    <option value="">{t("wb.no_location","— kein Ort —")}</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ flex:1, minWidth:140 }}>
                <label style={sx.lbl}>{t("wb.rewards_label","Belohnungen")}</label>
                <input value={draft.rewards} onChange={e => setDraft(p => ({ ...p, rewards: e.target.value }))}
                  placeholder={t("wb.rewards_placeholder","500 Gold, Magisches Schwert…")} style={sx.inp} />
              </div>
            </div>

            {/* NPCs */}
            {npcs.filter(n => n.custom !== false || n.id > 100).length > 0 || npcs.length > 0 ? (
              <div>
                <label style={sx.lbl}>{t("wb.involved_npcs","Beteiligte NPCs")}</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:4 }}>
                  {npcs.map(n => {
                    const sel = (draft.npcIds || []).includes(String(n.id));
                    return (
                      <button type="button" key={n.id} onClick={() => toggleNpc(String(n.id))} style={{
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
              <label style={sx.lbl}>{t("wb.dm_notes","DM-Notizen")}</label>
              <textarea value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))}
                placeholder={t("wb.dm_notes_placeholder","Geheime Infos, Twists, Plot-Verbindungen…")}
                style={{ ...sx.inp, minHeight:55, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button type="button" onClick={saveDraft} style={sx.btn(C.gold)} disabled={!draft.name?.trim()}>{t("wb.save_btn","💾 Speichern")}</button>
              <button type="button" onClick={cancel} style={sx.bsm(C.textDim)}>{t("wb.cancel_btn","Abbrechen")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Quest list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.textDim, fontSize:13 }}>
          {quests.length === 0
            ? <span>{t("wb.no_quests_yet","Noch keine Quests —")} <button type="button" onClick={startNew} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontSize:13 }}>{t("wb.create_first_quest","erste Quest anlegen")}</button></span>
            : t("wb.no_results","Keine Ergebnisse")}
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
                            {done}/{steps.length} {t("wb.goals_n","Ziele")}
                          </span>
                        )}
                        {/* Location */}
                        {loc && <span style={{ fontSize:9, color:C.amberBright }}>📍 {loc.name}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                    {/* Quick status cycle */}
                    <button type="button" onClick={() => cycleStatus(q.id)} title={t("wb.status_cycle_title","Status wechseln")}
                      style={{ ...sx.bsm(st.color), fontSize:12, padding:"3px 8px" }}>
                      {st.icon}
                    </button>
                    <button type="button" onClick={() => startEdit(q)} style={sx.bsm(C.gold)}>✏️</button>
                    <button type="button" onClick={() => deleteQuest(q.id)} style={sx.bsm(C.red)}>🗑️</button>
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
                        <div style={{ fontSize:10, color:C.textDim, fontFamily:FH, letterSpacing:0.5, marginBottom:5 }}>{t("wb.goals_label_upper","ZIELE")}</div>
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
                        <div style={{ fontSize:10, color:C.textDim, fontFamily:FH, letterSpacing:0.5, marginBottom:5 }}>{t("wb.involved_npcs_upper","BETEILIGTE NPCS")}</div>
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
                        🎁 <strong>{t("wb.rewards_label_bold","Belohnungen:")}</strong> {q.rewards}
                      </div>
                    )}

                    {/* Notes */}
                    {q.notes && (
                      <div style={{ background:`${C.purple}0a`, border:`1px solid ${C.purple}33`, borderRadius:7, padding:"7px 11px", fontSize:12, color:C.textDim, lineHeight:1.6 }}>
                        <div style={{ fontSize:9, color:C.purpleBright, fontFamily:FH, fontWeight:700, marginBottom:4 }}>{t("wb.dm_notes_upper","DM-NOTIZEN")}</div>
                        {q.notes}
                      </div>
                    )}

                    {(q.createdAtIso || q.createdAt) && (
                      <div style={{ fontSize:10, color:C.textDim }}>{t("wb.created_at","Erstellt:")} {q.createdAtIso ? fmtDate(q.createdAtIso) : q.createdAt}</div>
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
          {quests.length} {quests.length !== 1 ? t("wb.quests_total_plural","Quests") : t("wb.quests_total_singular","Quest")} {t("wb.total_word","total")}
          {(filterSt !== "alle" || filterPr !== "alle" || search) ? ` · ${filtered.length} ${t("wb.shown","angezeigt")}` : ""}
        </div>
      )}
    </div>
  );
}
