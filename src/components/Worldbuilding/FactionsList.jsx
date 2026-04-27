import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";

// Reputation scale: -3..+3
const REP_LABELS = {
  "-3": { label: "Feindlich",   icon: "💀", color: "#ff3333" },
  "-2": { label: "Feindselig",  icon: "😠", color: "#ff6644" },
  "-1": { label: "Misstrauisch",icon: "😒", color: "#ff9944" },
   "0": { label: "Neutral",     icon: "😐", color: C.textDim },
   "1": { label: "Freundlich",  icon: "🙂", color: "#68d18a" },
   "2": { label: "Vertraut",    icon: "😊", color: "#40c080" },
   "3": { label: "Verbündet",   icon: "🤝", color: "#c9a84c" },
};

const PRESET_COLORS = [
  "#c0392b", "#e67e22", "#f1c40f", "#27ae60", "#2980b9",
  "#8e44ad", "#e91e8c", "#1abc9c", "#95a5a6", "#d35400",
];

function newFaction() {
  return { id: Date.now().toString(), name: "", description: "", color: "#8e44ad", npcIds: [], reputation: 0 };
}

export default function FactionsList() {
  const [factions, setFactions, ready] = usePersist("factions_v1", []);
  const [editing,  setEditing]  = useState(null);
  const [draft,    setDraft]    = useState(null);
  const [search,   setSearch]   = useState("");

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
    if (!confirm("Fraktion löschen?")) return;
    setFactions(p => p.filter(f => f.id !== id));
    if (editing === id) { setEditing(null); setDraft(null); }
  };

  const changeRep = (id, delta) => {
    setFactions(p => p.map(f => f.id === id
      ? { ...f, reputation: Math.max(-3, Math.min(3, f.reputation + delta)) }
      : f
    ));
  };

  const cancel = () => { setEditing(null); setDraft(null); };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
        <input
          placeholder="🔍 Fraktionen suchen…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...sx.inp, flex:1 }}
        />
        <button onClick={startNew} style={sx.btn(C.purple)}>+ Fraktion</button>
      </div>

      {/* Editor */}
      {editing && draft && (
        <div style={{ ...sx.card, border:`1px solid ${draft.color}66`, marginBottom:14 }}>
          <div style={{ ...sx.ct, marginBottom:10 }}>
            <span style={{ color: draft.color }}>{editing === "new" ? "✨ Neue Fraktion" : "✏️ Fraktion bearbeiten"}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <div>
              <label style={sx.lbl}>Name *</label>
              <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                placeholder="Fraktionsname…" style={sx.inp} autoFocus />
            </div>
            <div>
              <label style={sx.lbl}>Farbe</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                {PRESET_COLORS.map(col => (
                  <button key={col} onClick={() => setDraft(p => ({ ...p, color: col }))} style={{
                    width:24, height:24, borderRadius:6, background:col, border:`2px solid ${draft.color === col ? "#fff" : "transparent"}`,
                    cursor:"pointer", transition:"border-color .15s", flexShrink:0,
                  }} />
                ))}
                <input type="color" value={draft.color} onChange={e => setDraft(p => ({ ...p, color: e.target.value }))}
                  style={{ width:24, height:24, borderRadius:6, border:`2px solid ${C.border}`, background:"none", cursor:"pointer", padding:0 }} />
              </div>
            </div>
            <div>
              <label style={sx.lbl}>Beschreibung</label>
              <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                placeholder="Ziele, Geschichte, Mitglieder, Symbole…"
                style={{ ...sx.inp, minHeight:90, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveDraft} style={sx.btn(C.purpleBright)} disabled={!draft.name?.trim()}>💾 Speichern</button>
              <button onClick={cancel} style={sx.bsm(C.textDim)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.textDim, fontSize:13 }}>
          {factions.length === 0
            ? <span>Noch keine Fraktionen — <button onClick={startNew} style={{ background:"none", border:"none", color:C.purpleBright, cursor:"pointer", fontSize:13 }}>erste anlegen</button></span>
            : "Keine Ergebnisse"}
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
                    <button onClick={() => startEdit(f)} style={sx.bsm(C.purpleBright)}>✏️</button>
                    <button onClick={() => deleteFaction(f.id)} style={sx.bsm(C.red)}>🗑️</button>
                  </div>
                </div>

                {/* Reputation bar */}
                <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={() => changeRep(f.id, -1)} disabled={f.reputation <= -3}
                    style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:5, color:C.textDim, width:22, height:22, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:f.reputation<=-3?0.3:1 }}>
                    −
                  </button>

                  {/* Rep track */}
                  <div style={{ flex:1, display:"flex", gap:3, alignItems:"center" }}>
                    {[-3,-2,-1,0,1,2,3].map(v => {
                      const filled = v <= (f.reputation ?? 0);
                      const vRep   = REP_LABELS[String(v)];
                      const dotCol = filled ? (vRep?.color || rep.color) : C.border;
                      return (
                        <div key={v} onClick={() => setFactions(p => p.map(x => x.id===f.id ? {...x, reputation:v} : x))}
                          style={{
                            flex:1, height:8, borderRadius:4, cursor:"pointer",
                            background: filled ? dotCol : C.surface,
                            border:`1px solid ${filled ? dotCol : C.border}`,
                            transition:"all .15s",
                            boxShadow: filled && v === (f.reputation ?? 0) ? `0 0 6px ${dotCol}88` : "none",
                          }} />
                      );
                    })}
                  </div>

                  <button onClick={() => changeRep(f.id, 1)} disabled={f.reputation >= 3}
                    style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:5, color:C.textDim, width:22, height:22, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:f.reputation>=3?0.3:1 }}>
                    +
                  </button>

                  <span style={{ fontSize:11, color:rep.color, fontWeight:700, whiteSpace:"nowrap", minWidth:80, textAlign:"right" }}>
                    {rep.icon} {rep.label}
                  </span>
                </div>

                {/* Description */}
                {f.description && (
                  <div style={{ marginTop:8, fontSize:12, color:C.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                    {f.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {factions.length > 0 && (
        <div style={{ marginTop:14, fontSize:11, color:C.textDim, textAlign:"center" }}>
          {factions.length} Fraktion{factions.length !== 1 ? "en" : ""} total
        </div>
      )}
    </div>
  );
}
