import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile as useMobile } from "../hooks/useIsMobile.js";
import { SRD_NPCS } from "../data/npcs.js";
import { useI18n } from "../i18n/index.js";

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
  const { t } = useI18n();
  const ATT_LABEL = {
    freundlich: t("npc.att_friendly","freundlich"),
    neutral: t("npc.att_neutral","neutral"),
    feindlich: t("npc.att_hostile","feindlich"),
    unbekannt: t("npc.att_unknown","unbekannt"),
    Alle: t("npc.att_all","Alle"),
  };
  const STATUS_LABEL = {
    lebendig: t("npc.status_alive","lebendig"),
    tot: t("npc.status_dead","tot"),
    unbekannt: t("npc.status_unknown","unbekannt"),
    gefangen: t("npc.status_captured","gefangen"),
  };
  const [factions] = usePersist("factions_v1", []);
  const [dmMode, setDmMode] = usePersist("npc_dm_mode", false);
  const [dmConfirm, setDmConfirm] = useState(false);
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

        {/* DM Mode Toggle */}
        <button type="button"
          onClick={() => dmMode ? setDmMode(false) : setDmConfirm(true)}
          style={{
            background: dmMode ? `${C.purple}22` : "transparent",
            border: `1px solid ${dmMode ? C.purpleBright : C.border}`,
            borderRadius: 6,
            color: dmMode ? C.purpleBright : C.textDim,
            fontSize: 11,
            padding: "6px 10px",
            cursor: "pointer",
            fontFamily: FH,
            fontWeight: dmMode ? 700 : 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
          title={dmMode ? t("npc.dm_mode_active_title","DM-Modus ist aktiv — DM-Notizen sichtbar") : t("npc.dm_mode_inactive_title","DM-Modus inaktiv — DM-Notizen versteckt")}
        >
          <span>{t("npc.dm_mode","🎲 DM-Modus")}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 14, borderRadius: 7,
            background: dmMode ? C.purpleBright : C.border,
            position: "relative", transition: "background .2s",
          }}>
            <span style={{
              position: "absolute", top: 1, left: dmMode ? 15 : 1,
              width: 12, height: 12, borderRadius: "50%",
              background: dmMode ? C.bg : C.textDim,
              transition: "left .2s",
            }} />
          </span>
        </button>

        {/* Tab-Switcher */}
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={() => setView("list")}    style={{ ...sx.nb(view === "list"),    flex: 1, fontSize: 11 }}>{t("npc.my_npcs","👥 Meine NPCs")}</button>
          <button type="button" onClick={() => { setView("catalog"); setSel(null); setShowForm(false); }} style={{ ...sx.nb(view === "catalog"), flex: 1, fontSize: 11 }}>{t("npc.catalog_tab","📖 D&D Katalog")}</button>
        </div>

        {/* ── Meine NPCs ── */}
        {view === "list" && <>
          <button type="button" onClick={() => { setForm(blank); setSel(null); setShowForm(true); }} style={{ ...sx.btn(C.purple), width: "100%" }}>{t("npc.new_npc_btn","+ Neuer NPC")}</button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("npc.search_placeholder","🔍 Name, Rolle, Ort...")} style={sx.inp} />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["Alle", "freundlich", "neutral", "feindlich", "unbekannt"].map(a => (
              <button type="button" key={a} onClick={() => setAttFilter(a)} style={{ ...sx.bsm(ATT_COL[a] || C.textDim), fontWeight: attFilter === a ? 700 : 400, background: attFilter === a ? `${ATT_COL[a] || C.textDim}22` : `${ATT_COL[a] || C.textDim}08` }}>
                {ATT_ICON[a] || "📋"} {ATT_LABEL[a] || a}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginLeft: 2 }}>{filtered.length} {t("npc.count_label","NPCs")}</div>
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
                      <span style={{ fontSize: 9, color: STATUS_COL[npc.status] || C.textDim, fontWeight: 700, whiteSpace: "nowrap" }}>{STATUS_LABEL[npc.status] || npc.status}</span>
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
          <input value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder={t("npc.cat_search_placeholder","🔍 Name, Abenteuer, Ort...")} style={sx.inp} />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["Alle", "freundlich", "neutral", "feindlich"].map(a => (
              <button type="button" key={a} onClick={() => setCatAtt(a)} style={{ ...sx.bsm(ATT_COL[a] || C.textDim), fontWeight: catAtt === a ? 700 : 400, background: catAtt === a ? `${ATT_COL[a] || C.textDim}22` : `${ATT_COL[a] || C.textDim}08` }}>
                {ATT_ICON[a] || "📋"} {ATT_LABEL[a] || a}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginLeft: 2 }}>{catFiltered.length} {t("npc.count_label","NPCs")}</div>
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
                  <button type="button" onClick={e => { e.stopPropagation(); addFromCatalog(npc); }}
                    style={{ ...sx.bsm(inList ? C.textDim : C.green), fontSize: 10, padding: "2px 7px", flexShrink: 0, opacity: inList ? 0.5 : 1 }}
                    title={inList ? t("npc.already_in_list","Bereits in Liste") : t("npc.add_to_list_title","Zu meinen NPCs hinzufügen")}>
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
          <div style={sx.ct}>{sel?.custom ? t("npc.edit_title","NPC bearbeiten") : t("npc.new_title","Neuer NPC")}</div>
          <div style={sx.g3}>
            <div style={{ gridColumn: "1/3" }}><label style={sx.lbl}>{t("npc.name_label","Name")}</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={sx.inp} placeholder={t("npc.name_placeholder","Name des NPC")} /></div>
            <div><label style={sx.lbl}>{t("npc.role_label","Rolle / Beruf")}</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={sx.inp} placeholder={t("npc.role_placeholder","Wirt, Händler...")} /></div>
            <div><label style={sx.lbl}>{t("npc.location_label","Ort")}</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={sx.inp} placeholder={t("npc.location_placeholder","Stadt, Taverne...")} /></div>
            <div><label style={sx.lbl}>{t("npc.race_label","Rasse")}</label><input value={form.race} onChange={e => setForm(p => ({ ...p, race: e.target.value }))} style={sx.inp} placeholder={t("npc.race_placeholder","Mensch, Elf...")} /></div>
            <div><label style={sx.lbl}>{t("npc.alignment_label","Gesinnung")}</label><input value={form.alignment} onChange={e => setForm(p => ({ ...p, alignment: e.target.value }))} style={sx.inp} placeholder={t("npc.alignment_placeholder","Rechtsch. Gut...")} /></div>
            <div><label style={sx.lbl}>{t("npc.status_label","Status")}</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={sx.sel}>
                {["lebendig", "tot", "unbekannt", "gefangen"].map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>{t("npc.attitude_label","Einstellung")}</label>
              <select value={form.attitude} onChange={e => setForm(p => ({ ...p, attitude: e.target.value }))} style={sx.sel}>
                {["freundlich", "neutral", "feindlich", "unbekannt"].map(a => <option key={a} value={a}>{ATT_LABEL[a] || a}</option>)}
              </select>
            </div>
            {factions.length > 0 && (
              <div><label style={sx.lbl}>{t("npc.faction_label","Fraktion")}</label>
                <select value={form.factionId || ""} onChange={e => setForm(p => ({ ...p, factionId: e.target.value }))} style={sx.sel}>
                  <option value="">{t("npc.no_faction","— keine —")}</option>
                  {factions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ marginTop: 8 }}><label style={sx.lbl}>{t("npc.desc_label","Beschreibung / Aussehen")}</label><textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} style={{ ...sx.ta, height: 80 }} placeholder={t("npc.desc_placeholder","Aussehen, Persönlichkeit...")} /></div>
          <div style={{ marginTop: 6 }}><label style={sx.lbl}>{t("npc.dm_notes_label","DM-Notizen / Plot-Verbindungen")}</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...sx.ta, height: 60 }} placeholder={t("npc.dm_notes_placeholder","Geheimnis, Verbindungen, Quest-Relevanz...")} /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="button" onClick={save} style={sx.btn(C.green)}>{t("npc.save_btn","Speichern")}</button>
            <button type="button" onClick={() => setShowForm(false)} style={sx.btn(C.textDim)}>{t("npc.cancel_btn","Abbrechen")}</button>
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
                <button type="button" onClick={() => addFromCatalog(sel)} style={sx.bsm(C.green)}>{t("npc.add_to_my_btn","+ Zu meinen NPCs")}</button>
              )}
              {sel.custom && (
                <button type="button" onClick={() => { setForm({ ...sel }); setShowForm(true); }} style={sx.bsm(C.gold)}>{t("npc.edit_btn","✎ Bearbeiten")}</button>
              )}
              {npcs.some(n => n.id === sel.id) && (
                <button type="button" onClick={() => del(sel.id)} style={sx.bsm(C.red)}>{t("npc.delete_btn","🗑 Löschen")}</button>
              )}
            </div>
          </div>

          {view === "catalog" && <div style={{ marginBottom: 10 }}>
            <span style={{ ...sx.tag(C.purple), fontSize: 10 }}>📖 {sourceOf(sel.id)}</span>
          </div>}

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {sel.race && <span style={sx.tag(C.purple)}>🧬 {sel.race}</span>}
            {sel.alignment && <span style={sx.tag(C.blue)}>⚖️ {sel.alignment}</span>}
            <span style={sx.tag(STATUS_COL[sel.status] || C.textDim)}>● {STATUS_LABEL[sel.status] || sel.status}</span>
            <span style={sx.tag(ATT_COL[sel.attitude] || C.textDim)}>{ATT_ICON[sel.attitude]} {ATT_LABEL[sel.attitude] || sel.attitude}</span>
            <FactionBadge factionId={sel.factionId} factions={factions} />
          </div>
          {sel.desc && <div style={{ fontSize: 14, color: C.text, lineHeight: 1.75, marginBottom: sel.notes ? 12 : 0 }}>{sel.desc}</div>}
          {sel.notes && dmMode && <div style={{ background: `${C.purple}0a`, borderTop: `1px solid ${C.purple}25`, borderRight: `1px solid ${C.purple}25`, borderBottom: `1px solid ${C.purple}25`, borderLeft: `3px solid ${C.purple}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
            <div style={{ fontSize: 10, color: C.purple, fontFamily: FH, fontWeight: 700, marginBottom: 4 }}>{t("npc.dm_notes_upper","🎲 DM-NOTIZEN")}</div>
            {sel.notes}
          </div>}
        </div>}

        {!sel && !showForm && <div style={{ ...sx.card, textAlign: "center", color: C.textDim, padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{view === "catalog" ? "📖" : "👥"}</div>
          {view === "catalog"
            ? <><div style={{ fontSize: 15, marginBottom: 4 }}>{t("npc.catalog_title","D&D Katalog")}</div><div style={{ fontSize: 12 }}>{t("npc.catalog_hint","Ikonische NPCs aus offiziellen Abenteuern · ")}<strong style={{ color: C.green }}>+</strong> {t("npc.add_word","zum Hinzufügen")}</div></>
            : <><div style={{ fontSize: 15, marginBottom: 4 }}>{t("npc.pick_from_list","NPC aus der Liste wählen")}</div><div style={{ fontSize: 12 }}>{t("npc.or_word","oder")} <strong style={{ color: C.purple }}>{t("npc.new_npc_btn","+ Neuer NPC")}</strong> · <span style={{ color: C.blue, cursor: "pointer" }} onClick={() => setView("catalog")}>{t("npc.catalog_tab","📖 D&D Katalog")}</span></div></>
          }
        </div>}
      </div>

      {/* DM-Mode Confirm Popup */}
      {dmConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}
          onClick={() => setDmConfirm(false)}>
          <div style={{ ...sx.card, width: "min(420px, 92vw)", border: `2px solid ${C.purpleBright}` }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: FH, fontSize: 18, color: C.purpleBright, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              {t("npc.confirm_dm_title","🎲 DM-Modus aktivieren?")}
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>
              {t("npc.confirm_dm_body_1","Im DM-Modus sind")} <strong style={{ color: C.purpleBright }}>{t("npc.confirm_dm_body_2","geheime DM-Notizen")}</strong> {t("npc.confirm_dm_body_3","zu jedem NPC sichtbar — Plot-Hooks, Geheimnisse, Verbindungen.")}
              <br /><br />
              <strong style={{ color: C.amberBright }}>{t("npc.confirm_dm_warning","⚠️ Nur aktivieren, wenn du der DM bist!")}</strong> {t("npc.confirm_dm_subwarning","Spieler sollten diese Notizen nicht sehen.")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setDmMode(true); setDmConfirm(false); }}
                style={{ ...sx.btn(C.purpleBright), flex: 1 }}>
                {t("npc.confirm_dm_yes","✓ Ja, ich bin der DM")}
              </button>
              <button type="button" onClick={() => setDmConfirm(false)}
                style={{ ...sx.btn(C.textDim), padding: "8px 16px" }}>
                {t("npc.cancel_btn","Abbrechen")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
