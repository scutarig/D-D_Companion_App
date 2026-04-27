import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile as useMobile } from "../hooks/useIsMobile.js";
import { SRD_NPCS } from "../data/npcs.js";

// helper: faction color dot
function FactionBadge({ factionId, factions, style = {} }) {
  if (!factionId) return null;
  const f = factions.find(x => x.id === factionId);
  if (!f) return null;
  return (
    <span title={f.name} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: `${f.color}22`, border: `1px solid ${f.color}66`,
      borderRadius: 5, padding: "1px 7px", fontSize: 10, color: f.color,
      fontWeight: 700, whiteSpace: "nowrap", ...style,
    }}>
      ⚔️ {f.name}
    </span>
  );
}

const ATT_COL  = { freundlich: C.greenBright, neutral: C.textDim, feindlich: C.redBright, unbekannt: C.amber };
const ATT_ICON = { freundlich: "💚", neutral: "⚪", feindlich: "❤️", unbekannt: "❓" };
const STATUS_COL = { lebendig: C.greenBright, tot: C.redBright, unbekannt: C.textDim, gefangen: C.amber };

const SOURCE_LABEL = {
  1: "Faerûn", 2: "Strahd", 3: "Phandelver", 4: "Avernus",
  5: "Frostmaiden", 6: "Chult", 7: "Sturmriesen", 8: "Ikonisch", 9: "Archetyp",
};
const sourceOf = id => SOURCE_LABEL[Math.floor(id / 100)] || "—";

export default function NpcList() {
  const [factions] = usePersist("factions_v1", []);
  const [npcs, setNpcs] = usePersist("npc_list_v1", [
    { id: 1, name: "Tavil, der Wirt", role: "Wirt", location: "Zum Goldenen Pfeil", race: "Mensch", alignment: "Neutral Gut", status: "lebendig", attitude: "freundlich", desc: "Ein grossgewachsener, kahlkoepfiger Mann mit weissem Bart. Fuehrt die Taverne seit 30 Jahren.", notes: "Kennt viele Geruechte. Tochter ist verschwunden.", custom: false },
    { id: 2, name: "Lady Mira Ashveil", role: "Stadtvogt", location: "Hafenstadt Silverton", race: "Mensch", alignment: "Rechtschaffen Neutral", status: "lebendig", attitude: "neutral", desc: "Strenge Buergerin, mittleres Alter, immer in formellen Gewaendern. Misstrauisch gegenueber Abenteurern.", notes: "Hat Verbindungen zur Gilde. Verdaechtig.", custom: false },
  ]);

  const [view, setView]           = useState("list"); // "list" | "catalog"
  const [search, setSearch]       = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [attFilter, setAttFilter] = useState("Alle");
  const [catAtt, setCatAtt]       = useState("Alle");
  const [sel, setSel]             = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const blank = { name: "", role: "", location: "", race: "", alignment: "", status: "lebendig", attitude: "neutral", desc: "", notes: "", factionId: "" };
  const [form, setForm] = useState(blank);

  const filtered = npcs.filter(n =>
    (attFilter === "Alle" || n.attitude === attFilter) &&
    (n.name.toLowerCase().includes(search.toLowerCase()) ||
     n.role.toLowerCase().includes(search.toLowerCase()) ||
     n.location.toLowerCase().includes(search.toLowerCase()))
  );

  const catFiltered = SRD_NPCS.filter(n =>
    (catAtt === "Alle" || n.attitude === catAtt) &&
    (n.name.toLowerCase().includes(catSearch.toLowerCase()) ||
     n.role.toLowerCase().includes(catSearch.toLowerCase()) ||
     n.location.toLowerCase().includes(catSearch.toLowerCase()) ||
     sourceOf(n.id).toLowerCase().includes(catSearch.toLowerCase()))
  );

  const addFromCatalog = npc => {
    if (npcs.some(n => n.name === npc.name)) return;
    const n = { ...npc, id: Date.now() + Math.random(), custom: false };
    setNpcs(p => [...p, n]);
  };

  const save = () => {
    if (!form.name) return;
    if (sel?.custom) {
      setNpcs(p => p.map(n => n.id === sel.id ? { ...form, id: sel.id, custom: true } : n));
      setSel({ ...form, id: sel.id, custom: true });
    } else {
      const n = { ...form, id: Date.now(), custom: true };
      setNpcs(p => [...p, n]); setSel(n);
    }
    setShowForm(false);
  };
  const del = id => { setNpcs(p => p.filter(n => n.id !== id)); setSel(null); };

  const mob = useMobile();

  return (
    <div style={{ display: "flex", gap: 14, flexDirection: mob ? "column" : "row" }}>

      {/* ── Linke Sidebar ─────────────────────────────────────────────── */}
      <div style={{ width: mob ? "100%" : 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>

        {/* Tab-Switcher */}
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setView("list")}    style={{ ...sx.nb(view === "list"),    flex: 1, fontSize: 11 }}>👥 Meine NPCs</button>
          <button onClick={() => { setView("catalog"); setSel(null); setShowForm(false); }} style={{ ...sx.nb(view === "catalog"), flex: 1, fontSize: 11 }}>📖 D&D Katalog</button>
        </div>

        {/* ── Meine NPCs ── */}
        {view === "list" && <>
          <button onClick={() => { setForm(blank); setSel(null); setShowForm(true); }} style={{ ...sx.btn(C.purple), width: "100%" }}>+ Neuer NPC</button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Name, Rolle, Ort..." style={sx.inp} />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["Alle", "freundlich", "neutral", "feindlich", "unbekannt"].map(a => (
              <button key={a} onClick={() => setAttFilter(a)} style={{ ...sx.bsm(ATT_COL[a] || C.textDim), fontWeight: attFilter === a ? 700 : 400, background: attFilter === a ? `${ATT_COL[a] || C.textDim}22` : `${ATT_COL[a] || C.textDim}08` }}>
                {ATT_ICON[a] || "📋"} {a}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginLeft: 2 }}>{filtered.length} NPCs</div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "68vh", display: "flex", flexDirection: "column", gap: 4 }}>
            {filtered.map(npc => {
              const col = ATT_COL[npc.attitude] || C.textDim;
              const active = sel?.id === npc.id;
              return (
                <div key={npc.id} onClick={() => { setSel(npc); setShowForm(false); }}
                  style={{ background: active ? `${col}18` : C.surface, borderTop: `1px solid ${active ? col : C.border}`, borderRight: `1px solid ${active ? col : C.border}`, borderBottom: `1px solid ${active ? col : C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{ATT_ICON[npc.attitude] || "👤"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FH, fontSize: 12, color: active ? col : C.textBright, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.name}</div>
                      <div style={{ fontSize: 10, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.role}{npc.location && ` · ${npc.location}`}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2, flexShrink:0 }}>
                      <span style={{ fontSize: 9, color: STATUS_COL[npc.status] || C.textDim, fontWeight: 700, whiteSpace: "nowrap" }}>{npc.status}</span>
                      <FactionBadge factionId={npc.factionId} factions={factions} style={{ fontSize: 8, padding: "0px 5px" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ── D&D Katalog ── */}
        {view === "catalog" && <>
          <input value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="🔍 Name, Abenteuer, Ort..." style={sx.inp} />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["Alle", "freundlich", "neutral", "feindlich"].map(a => (
              <button key={a} onClick={() => setCatAtt(a)} style={{ ...sx.bsm(ATT_COL[a] || C.textDim), fontWeight: catAtt === a ? 700 : 400, background: catAtt === a ? `${ATT_COL[a] || C.textDim}22` : `${ATT_COL[a] || C.textDim}08` }}>
                {ATT_ICON[a] || "📋"} {a}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginLeft: 2 }}>{catFiltered.length} NPCs</div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "68vh", display: "flex", flexDirection: "column", gap: 4 }}>
            {catFiltered.map(npc => {
              const col = ATT_COL[npc.attitude] || C.textDim;
              const inList = npcs.some(n => n.name === npc.name);
              return (
                <div key={npc.id} style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all .15s" }}
                  onClick={() => setSel(npc)}>
                  <span style={{ fontSize: 14 }}>{ATT_ICON[npc.attitude] || "👤"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.name}</div>
                    <div style={{ fontSize: 10, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {npc.role} · <span style={{ color: C.purple }}>{sourceOf(npc.id)}</span>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); addFromCatalog(npc); }}
                    style={{ ...sx.bsm(inList ? C.textDim : C.green), fontSize: 10, padding: "2px 7px", flexShrink: 0, opacity: inList ? 0.5 : 1 }}
                    title={inList ? "Bereits in Liste" : "Zu meinen NPCs hinzufügen"}>
                    {inList ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </>}
      </div>

      {/* ── Rechter Detail-Bereich ─────────────────────────────────────── */}
      <div style={{ flex: 1 }}>
        {showForm && <div style={sx.card}>
          <div style={sx.ct}>{sel?.custom ? "NPC bearbeiten" : "Neuer NPC"}</div>
          <div style={sx.g3}>
            <div style={{ gridColumn: "1/3" }}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={sx.inp} placeholder="Name des NPC" /></div>
            <div><label style={sx.lbl}>Rolle / Beruf</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={sx.inp} placeholder="Wirt, Händler..." /></div>
            <div><label style={sx.lbl}>Ort</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={sx.inp} placeholder="Stadt, Taverne..." /></div>
            <div><label style={sx.lbl}>Rasse</label><input value={form.race} onChange={e => setForm(p => ({ ...p, race: e.target.value }))} style={sx.inp} placeholder="Mensch, Elf..." /></div>
            <div><label style={sx.lbl}>Gesinnung</label><input value={form.alignment} onChange={e => setForm(p => ({ ...p, alignment: e.target.value }))} style={sx.inp} placeholder="Rechtsch. Gut..." /></div>
            <div><label style={sx.lbl}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={sx.sel}>
                {["lebendig", "tot", "unbekannt", "gefangen"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>Einstellung</label>
              <select value={form.attitude} onChange={e => setForm(p => ({ ...p, attitude: e.target.value }))} style={sx.sel}>
                {["freundlich", "neutral", "feindlich", "unbekannt"].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            {factions.length > 0 && (
              <div><label style={sx.lbl}>Fraktion</label>
                <select value={form.factionId || ""} onChange={e => setForm(p => ({ ...p, factionId: e.target.value }))} style={sx.sel}>
                  <option value="">— keine —</option>
                  {factions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ marginTop: 8 }}><label style={sx.lbl}>Beschreibung / Aussehen</label><textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} style={{ ...sx.ta, height: 80 }} placeholder="Aussehen, Persönlichkeit..." /></div>
          <div style={{ marginTop: 6 }}><label style={sx.lbl}>DM-Notizen / Plot-Verbindungen</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...sx.ta, height: 60 }} placeholder="Geheimnis, Verbindungen, Quest-Relevanz..." /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={save} style={sx.btn(C.green)}>Speichern</button>
            <button onClick={() => setShowForm(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
          </div>
        </div>}

        {sel && !showForm && <div style={sx.card}>
          <div style={{ ...sx.jb, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>{ATT_ICON[sel.attitude] || "👤"}</span>
              <div>
                <div style={{ fontFamily: FH, fontSize: 20, color: ATT_COL[sel.attitude] || C.gold, fontWeight: 700 }}>{sel.name}</div>
                <div style={{ fontSize: 12, color: C.textDim }}>{sel.role}{sel.location && <span> · {sel.location}</span>}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {view === "catalog" && !npcs.some(n => n.name === sel.name) && (
                <button onClick={() => addFromCatalog(sel)} style={sx.bsm(C.green)}>+ Zu meinen NPCs</button>
              )}
              {sel.custom && (
                <button onClick={() => { setForm({ ...sel }); setShowForm(true); }} style={sx.bsm(C.gold)}>✎ Bearbeiten</button>
              )}
              {npcs.some(n => n.id === sel.id) && (
                <button onClick={() => del(sel.id)} style={sx.bsm(C.red)}>🗑 Löschen</button>
              )}
            </div>
          </div>

          {view === "catalog" && <div style={{ marginBottom: 10 }}>
            <span style={{ ...sx.tag(C.purple), fontSize: 10 }}>📖 {sourceOf(sel.id)}</span>
          </div>}

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {sel.race && <span style={sx.tag(C.purple)}>🧬 {sel.race}</span>}
            {sel.alignment && <span style={sx.tag(C.blue)}>⚖️ {sel.alignment}</span>}
            <span style={sx.tag(STATUS_COL[sel.status] || C.textDim)}>● {sel.status}</span>
            <span style={sx.tag(ATT_COL[sel.attitude] || C.textDim)}>{ATT_ICON[sel.attitude]} {sel.attitude}</span>
            <FactionBadge factionId={sel.factionId} factions={factions} />
          </div>
          {sel.desc && <div style={{ fontSize: 14, color: C.text, lineHeight: 1.75, marginBottom: sel.notes ? 12 : 0 }}>{sel.desc}</div>}
          {sel.notes && <div style={{ background: `${C.purple}0a`, borderTop: `1px solid ${C.purple}25`, borderRight: `1px solid ${C.purple}25`, borderBottom: `1px solid ${C.purple}25`, borderLeft: `3px solid ${C.purple}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
            <div style={{ fontSize: 10, color: C.purple, fontFamily: FH, fontWeight: 700, marginBottom: 4 }}>DM-NOTIZEN</div>
            {sel.notes}
          </div>}
        </div>}

        {!sel && !showForm && <div style={{ ...sx.card, textAlign: "center", color: C.textDim, padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{view === "catalog" ? "📖" : "👥"}</div>
          {view === "catalog"
            ? <><div style={{ fontSize: 15, marginBottom: 4 }}>D&D Katalog</div><div style={{ fontSize: 12 }}>Ikonische NPCs aus offiziellen Abenteuern · <strong style={{ color: C.green }}>+</strong> zum Hinzufügen</div></>
            : <><div style={{ fontSize: 15, marginBottom: 4 }}>NPC aus der Liste wählen</div><div style={{ fontSize: 12 }}>oder <strong style={{ color: C.purple }}>+ Neuer NPC</strong> · <span style={{ color: C.blue, cursor: "pointer" }} onClick={() => setView("catalog")}>📖 D&D Katalog</span></div></>
          }
        </div>}
      </div>
    </div>
  );
}
