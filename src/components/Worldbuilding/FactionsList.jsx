import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { t as moduleT, useI18n } from "../../i18n/index.js";
import { fmtDateTime } from "../../utils/locale.js";

// Reputation scale: -3..+3
const REP_META = {
  "-3": { icon: "💀", color: "#ff3333", key: "wb.rep_hostile",    de: "Feindlich"    },
  "-2": { icon: "😠", color: "#ff6644", key: "wb.rep_unfriendly", de: "Feindselig"   },
  "-1": { icon: "😒", color: "#ff9944", key: "wb.rep_suspicious", de: "Misstrauisch" },
   "0": { icon: "😐", color: C.textDim, key: "wb.rep_neutral",    de: "Neutral"      },
   "1": { icon: "🙂", color: "#68d18a", key: "wb.rep_friendly",   de: "Freundlich"   },
   "2": { icon: "😊", color: "#40c080", key: "wb.rep_trusted",    de: "Vertraut"     },
   "3": { icon: "🤝", color: "#c9a84c", key: "wb.rep_allied",     de: "Verbündet"    },
};

const PRESET_COLORS = [
  "#c0392b", "#e67e22", "#f1c40f", "#27ae60", "#2980b9",
  "#8e44ad", "#e91e8c", "#1abc9c", "#95a5a6", "#d35400",
];

function newFaction() {
  return { id: Date.now().toString(), name: "", description: "", color: "#8e44ad", npcIds: [], reputation: 0 };
}

export default function FactionsList() {
  const { t } = useI18n();
  const REP_LABELS = Object.fromEntries(Object.entries(REP_META).map(([k, v]) => [k, { ...v, label: t(v.key, v.de) }]));
  const [factions, setFactions, ready] = usePersist("factions_v1", []);
  const [npcs]                         = usePersist("npc_list_v1", []);
  const [editing,  setEditing]  = useState(null);
  const [draft,    setDraft]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [repNote,  setRepNote]  = useState(""); // pending note for rep change
  const [repPop,   setRepPop]   = useState(null); // { fid, delta } | null
  const [expanded, setExpanded] = useState({}); // { [fid]: bool } — show members

  if (!ready) return null;

  const filtered = factions.filter(f =>
    !search ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const startNew = () => {
    const f = newFaction();
    setDraft(f);
    setEditing("new");
  };

  const startEdit = (f) => {
    setDraft({ ...f });
    setEditing(f.id);
  };

  const saveDraft = () => {
    if (!draft?.name?.trim()) return;
    if (editing === "new") {
      setFactions(p => [...p, draft]);
    } else {
      setFactions(p => p.map(f => f.id === draft.id ? draft : f));
    }
    setEditing(null); setDraft(null);
  };

  const deleteFaction = (id) => {
    if (!confirm(moduleT("wb.confirm_delete_faction","Fraktion löschen?"))) return;
    setFactions(p => p.filter(f => f.id !== id));
    if (editing === id) { setEditing(null); setDraft(null); }
  };

  const openRepPop = (fid, delta) => { setRepPop({ fid, delta }); setRepNote(""); };
  const confirmRep = () => {
    if (!repPop) return;
    const { fid, delta } = repPop;
    const tsIso = new Date().toISOString();
    setFactions(p => p.map(f => {
      if (f.id !== fid) return f;
      const newRep = Math.max(-3, Math.min(3, (f.reputation ?? 0) + delta));
      const entry  = { id: Date.now().toString(), tsIso, delta, note: repNote.trim(), from: f.reputation ?? 0, to: newRep };
      return { ...f, reputation: newRep, repLog: [...(f.repLog || []), entry] };
    }));
    setRepPop(null); setRepNote("");
  };
  const cancelRep = () => { setRepPop(null); setRepNote(""); };

  const toggleExpand = (fid) => setExpanded(p => ({ ...p, [fid]: !p[fid] }));

  const cancel = () => { setEditing(null); setDraft(null); };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
        <input
          placeholder={t("wb.factions_search_placeholder","🔍 Fraktionen suchen…")}
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...sx.inp, flex:1 }}
        />
        <button type="button" onClick={startNew} style={sx.btn(C.purple)}>{t("wb.new_faction_btn","+ Fraktion")}</button>
      </div>

      {/* Editor */}
      {editing && draft && (
        <div style={{ ...sx.card, border:`1px solid ${draft.color}66`, marginBottom:14 }}>
          <div style={{ ...sx.ct, marginBottom:10 }}>
            <span style={{ color: draft.color }}>{editing === "new" ? t("wb.new_faction_title","✨ Neue Fraktion") : t("wb.edit_faction_title","✏️ Fraktion bearbeiten")}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <div>
              <label style={sx.lbl}>{t("wb.name_required","Name *")}</label>
              <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                placeholder={t("wb.faction_name_placeholder","Fraktionsname…")} style={sx.inp} autoFocus />
            </div>
            <div>
              <label style={sx.lbl}>{t("wb.color_label","Farbe")}</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                {PRESET_COLORS.map(col => (
                  <button type="button" key={col} onClick={() => setDraft(p => ({ ...p, color: col }))} style={{
                    width:24, height:24, borderRadius:6, background:col, border:`2px solid ${draft.color === col ? "#fff" : "transparent"}`,
                    cursor:"pointer", transition:"border-color .15s", flexShrink:0,
                  }} />
                ))}
                <input type="color" value={draft.color} onChange={e => setDraft(p => ({ ...p, color: e.target.value }))}
                  style={{ width:24, height:24, borderRadius:6, border:`2px solid ${C.border}`, background:"none", cursor:"pointer", padding:0 }} />
              </div>
            </div>
            <div>
              <label style={sx.lbl}>{t("wb.description_label","Beschreibung")}</label>
              <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                placeholder={t("wb.faction_desc_placeholder","Ziele, Geschichte, Mitglieder, Symbole…")}
                style={{ ...sx.inp, minHeight:90, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button type="button" onClick={saveDraft} style={sx.btn(C.purpleBright)} disabled={!draft.name?.trim()}>{t("wb.save_btn","💾 Speichern")}</button>
              <button type="button" onClick={cancel} style={sx.bsm(C.textDim)}>{t("wb.cancel_btn","Abbrechen")}</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.textDim, fontSize:13 }}>
          {factions.length === 0
            ? <span>{t("wb.no_factions_yet","Noch keine Fraktionen —")} <button type="button" onClick={startNew} style={{ background:"none", border:"none", color:C.purpleBright, cursor:"pointer", fontSize:13 }}>{t("wb.create_first_faction","erste anlegen")}</button></span>
            : t("wb.no_results","Keine Ergebnisse")}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(f => {
            const repKey = String(f.reputation ?? 0);
            const rep    = REP_LABELS[repKey] || REP_LABELS["0"];
            const isEdit = editing === f.id;
            return (
              <div key={f.id} style={{
                ...sx.card,
                border:`1px solid ${isEdit ? f.color + "aa" : f.color + "44"}`,
                transition:"border-color .15s",
              }}>
                {/* Header */}
                <div style={sx.jb}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, flex:1, minWidth:0 }}>
                    {/* Color dot */}
                    <div style={{ width:12, height:12, borderRadius:"50%", background:f.color, flexShrink:0, boxShadow:`0 0 8px ${f.color}88` }} />
                    <div style={{ fontFamily:FH, fontSize:13, color:C.textBright, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {f.name}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button type="button" onClick={() => startEdit(f)} style={sx.bsm(C.purpleBright)}>✏️</button>
                    <button type="button" onClick={() => deleteFaction(f.id)} style={sx.bsm(C.red)}>🗑️</button>
                  </div>
                </div>

                {/* Reputation bar */}
                <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
                  <button type="button" onClick={() => openRepPop(f.id, -1)} disabled={f.reputation <= -3}
                    style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:5, color:C.textDim, width:22, height:22, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:f.reputation<=-3?0.3:1 }}>
                    −
                  </button>

                  {/* Rep track */}
                  <div style={{ flex:1, display:"flex", gap:3, alignItems:"center" }}>
                    {[-3,-2,-1,0,1,2,3].map(v => {
                      const filled = v <= (f.reputation ?? 0);
                      const vRep   = REP_LABELS[String(v)];
                      const dotCol = filled ? (vRep?.color || rep.color) : C.border;
                      const targetDelta = v - (f.reputation ?? 0);
                      return (
                        <div key={v} onClick={() => targetDelta !== 0 && openRepPop(f.id, targetDelta)}
                          style={{
                            flex:1, height:8, borderRadius:4, cursor: targetDelta !== 0 ? "pointer" : "default",
                            background: filled ? dotCol : C.surface,
                            border:`1px solid ${filled ? dotCol : C.border}`,
                            transition:"all .15s",
                            boxShadow: filled && v === (f.reputation ?? 0) ? `0 0 6px ${dotCol}88` : "none",
                          }} />
                      );
                    })}
                  </div>

                  <button type="button" onClick={() => openRepPop(f.id, 1)} disabled={f.reputation >= 3}
                    style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:5, color:C.textDim, width:22, height:22, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:f.reputation>=3?0.3:1 }}>
                    +
                  </button>

                  <span style={{ fontSize:11, color:rep.color, fontWeight:700, whiteSpace:"nowrap", minWidth:80, textAlign:"right" }}>
                    {rep.icon} {rep.label}
                  </span>
                </div>

                {/* Rep-change popup */}
                {repPop?.fid === f.id && (
                  <div style={{ marginTop:8, background:`${C.surface}`, border:`1px solid ${f.color}55`, borderRadius:8, padding:"10px 12px", display:"flex", flexDirection:"column", gap:7 }}>
                    <div style={{ fontSize:11, color:f.color, fontWeight:700, fontFamily:FH }}>
                      {t("wb.reputation_change_title","Reputation {delta} — Notiz (optional)").replace("{delta}", repPop.delta > 0 ? `+${repPop.delta}` : repPop.delta)}
                    </div>
                    <input value={repNote} onChange={e => setRepNote(e.target.value)}
                      placeholder={t("wb.reputation_note_placeholder","Warum ändert sich die Reputation?")}
                      style={{ ...sx.inp, fontSize:12 }}
                      onKeyDown={e => { if (e.key === "Enter") confirmRep(); if (e.key === "Escape") cancelRep(); }}
                      autoFocus />
                    <div style={{ display:"flex", gap:6 }}>
                      <button type="button" onClick={confirmRep} style={sx.btn(f.color)}>{t("wb.confirm_btn","✓ Bestätigen")}</button>
                      <button type="button" onClick={cancelRep} style={sx.bsm(C.textDim)}>{t("wb.cancel_btn","Abbrechen")}</button>
                    </div>
                  </div>
                )}

                {/* Description */}
                {f.description && (
                  <div style={{ marginTop:8, fontSize:12, color:C.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                    {f.description}
                  </div>
                )}

                {/* Linked NPCs */}
                {(() => {
                  const members = npcs.filter(n => n.factionId === f.id);
                  if (members.length === 0) return null;
                  const isExp = expanded[f.id];
                  return (
                    <div style={{ marginTop:8, borderTop:`1px solid ${C.border}`, paddingTop:7 }}>
                      <button type="button" onClick={() => toggleExpand(f.id)} style={{
                        background:"none", border:"none", cursor:"pointer", color:C.textDim,
                        fontSize:11, display:"flex", alignItems:"center", gap:5, padding:0,
                      }}>
                        <span>{isExp ? "▾" : "▸"}</span>
                        <span style={{ color:f.color, fontWeight:700 }}>{members.length}</span>
                        <span>{members.length !== 1 ? t("wb.members_label_plural","Mitglieder") : t("wb.members_label_singular","Mitglied")}</span>
                      </button>
                      {isExp && (
                        <div style={{ marginTop:6, display:"flex", flexWrap:"wrap", gap:5 }}>
                          {members.map(n => (
                            <span key={n.id} style={{
                              background:`${f.color}18`, border:`1px solid ${f.color}44`,
                              borderRadius:5, fontSize:11, color:C.textBright, padding:"2px 8px",
                            }}>
                              👤 {n.name}
                              {n.role && <span style={{ color:C.textDim }}> · {n.role}</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Rep log */}
                {(f.repLog?.length > 0) && (() => {
                  const logKey = `log_${f.id}`;
                  const isExp  = expanded[logKey];
                  const recent = [...(f.repLog || [])].reverse().slice(0, 10);
                  return (
                    <div style={{ marginTop:6, borderTop:`1px solid ${C.border}`, paddingTop:7 }}>
                      <button type="button" onClick={() => setExpanded(p => ({ ...p, [logKey]: !p[logKey] }))} style={{
                        background:"none", border:"none", cursor:"pointer", color:C.textDim,
                        fontSize:11, display:"flex", alignItems:"center", gap:5, padding:0,
                      }}>
                        <span>{isExp ? "▾" : "▸"}</span>
                        <span>{t("wb.reputation_log","📜 Reputations-Log")} ({f.repLog.length})</span>
                      </button>
                      {isExp && (
                        <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:4 }}>
                          {recent.map(e => {
                            const eCol = e.delta > 0 ? "#68d18a" : "#ff9944";
                            return (
                              <div key={e.id} style={{ fontSize:11, color:C.textDim, display:"flex", gap:7, alignItems:"baseline" }}>
                                <span style={{ color:eCol, fontWeight:700, minWidth:24 }}>{e.delta > 0 ? `+${e.delta}` : e.delta}</span>
                                <span style={{ color:C.textDim, fontSize:10 }}>{e.from}→{e.to}</span>
                                {e.note && <span style={{ color:C.text }}>{e.note}</span>}
                                <span style={{ marginLeft:"auto", color:C.textDim, fontSize:9, whiteSpace:"nowrap" }}>{e.tsIso ? fmtDateTime(e.tsIso) : (e.ts || "")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {factions.length > 0 && (
        <div style={{ marginTop:14, fontSize:11, color:C.textDim, textAlign:"center" }}>
          {factions.length} {factions.length !== 1 ? t("wb.factions_total_plural","Fraktionen") : t("wb.factions_total_singular","Fraktion")} {t("wb.total_word","total")}
        </div>
      )}
    </div>
  );
}
