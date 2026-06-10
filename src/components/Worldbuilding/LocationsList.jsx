import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { t } from "../../i18n/index.js";

const TYPES = ["Stadt", "Dorf", "Dungeon", "Wildnis", "Tempel", "Festung", "Ruine", "Taverne", "Sonstiges"];

const TYPE_ICON = {
  Stadt: "🏙️", Dorf: "🏘️", Dungeon: "⛏️", Wildnis: "🌲",
  Tempel: "⛪", Festung: "🏰", Ruine: "🏚️", Taverne: "🍺", Sonstiges: "📍",
};

const TYPE_COLOR = {
  Stadt: C.blueBright, Dorf: C.greenBright, Dungeon: C.redBright, Wildnis: C.greenBright,
  Tempel: C.amberBright, Festung: C.purpleBright, Ruine: C.textDim, Taverne: C.gold, Sonstiges: C.textDim,
};

function newLoc() {
  return { id: Date.now().toString(), name: "", type: "Stadt", description: "", npcIds: [] };
}

export default function LocationsList() {
  const [locs, setLocs, ready] = usePersist("locations_v1", []);
  const [editing, setEditing]  = useState(null); // null | "new" | id
  const [draft,   setDraft]    = useState(null);
  const [search,  setSearch]   = useState("");
  const [filterT, setFilterT]  = useState(""); // type filter

  if (!ready) return null;

  const filtered = locs.filter(l => {
    if (filterT && l.type !== filterT) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const startNew = () => {
    const loc = newLoc();
    setDraft(loc);
    setEditing("new");
  };

  const startEdit = (loc) => {
    setDraft({ ...loc });
    setEditing(loc.id);
  };

  const saveDraft = () => {
    if (!draft?.name?.trim()) return;
    if (editing === "new") {
      setLocs(p => [...p, draft]);
    } else {
      setLocs(p => p.map(l => l.id === draft.id ? draft : l));
    }
    setEditing(null); setDraft(null);
  };

  const deleteLoc = (id) => {
    if (!confirm(t("wb.confirm_delete_location","Ort löschen?"))) return;
    setLocs(p => p.filter(l => l.id !== id));
    if (editing === id) { setEditing(null); setDraft(null); }
  };

  const cancel = () => { setEditing(null); setDraft(null); };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <input
          placeholder="🔍 Orte suchen…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...sx.inp, flex:1, minWidth:140 }}
        />
        <select value={filterT} onChange={e => setFilterT(e.target.value)} style={{ ...sx.sel, minWidth:110 }}>
          <option value="">Alle Typen</option>
          {TYPES.map(ty => <option key={ty} value={ty}>{TYPE_ICON[ty]} {ty}</option>)}
        </select>
        <button onClick={startNew} style={sx.btn(C.teal)}>+ Ort</button>
      </div>

      {/* Editor */}
      {editing && draft && (
        <div style={{ ...sx.card, border:`1px solid ${C.tealBright}55`, marginBottom:14 }}>
          <div style={{ ...sx.ct, color:C.tealBright, marginBottom:10 }}>
            {editing === "new" ? "✨ Neuer Ort" : "✏️ Ort bearbeiten"}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <div style={{ flex:2, minWidth:160 }}>
                <label style={sx.lbl}>Name *</label>
                <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ortsname…" style={sx.inp} autoFocus />
              </div>
              <div style={{ flex:1, minWidth:120 }}>
                <label style={sx.lbl}>Typ</label>
                <select value={draft.type} onChange={e => setDraft(p => ({ ...p, type: e.target.value }))} style={sx.sel}>
                  {TYPES.map(ty => <option key={ty} value={ty}>{TYPE_ICON[ty]} {ty}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={sx.lbl}>Beschreibung</label>
              <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                placeholder="Beschreibung, Notizen, Geheimnisse…"
                style={{ ...sx.inp, minHeight:90, resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveDraft} style={sx.btn(C.tealBright)} disabled={!draft.name?.trim()}>💾 Speichern</button>
              <button onClick={cancel} style={sx.bsm(C.textDim)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.textDim, fontSize:13 }}>
          {locs.length === 0
            ? <span>Noch keine Orte — <button onClick={startNew} style={{ background:"none", border:"none", color:C.tealBright, cursor:"pointer", fontSize:13 }}>ersten Ort anlegen</button></span>
            : "Keine Ergebnisse"}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(loc => {
            const isEditing = editing === loc.id;
            const col = TYPE_COLOR[loc.type] || C.textDim;
            return (
              <div key={loc.id} style={{
                ...sx.card,
                border:`1px solid ${isEditing ? col + "88" : C.border}`,
                transition:"border-color .15s",
              }}>
                <div style={sx.jb}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, flex:1, minWidth:0 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{TYPE_ICON[loc.type]}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:FH, fontSize:13, color:C.textBright, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {loc.name}
                      </div>
                      <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                        <span style={{
                          background:`${col}22`, color:col, border:`1px solid ${col}44`,
                          borderRadius:5, fontSize:9, fontWeight:700, padding:"1px 7px",
                          fontFamily:FH, letterSpacing:0.4, whiteSpace:"nowrap",
                        }}>{loc.type}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={() => startEdit(loc)} style={sx.bsm(C.tealBright)}>✏️</button>
                    <button onClick={() => deleteLoc(loc.id)} style={sx.bsm(C.red)}>🗑️</button>
                  </div>
                </div>
                {loc.description && (
                  <div style={{ marginTop:8, fontSize:12, color:C.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                    {loc.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {locs.length > 0 && (
        <div style={{ marginTop:14, fontSize:11, color:C.textDim, textAlign:"center" }}>
          {locs.length} Ort{locs.length !== 1 ? "e" : ""} total
          {filterT || search ? ` · ${filtered.length} angezeigt` : ""}
        </div>
      )}
    </div>
  );
}
