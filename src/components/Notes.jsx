import { useState, useMemo } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile as useMobile } from "../hooks/useIsMobile.js";
import { useI18n } from "../i18n/index.js";

export default function Notes() {
  const { t } = useI18n();
  const CATS = [
    {id:"all",     label:t("notes.cat_all","Alle"),       icon:"📋", color:C.textDim},
    {id:"location",label:t("notes.cat_location","Location"),   icon:"🗺️", color:C.greenBright},
    {id:"story",   label:t("notes.cat_story","Story"),      icon:"📖", color:C.gold},
    {id:"monster", label:t("notes.cat_monster","Monster"),    icon:"🐉", color:C.redBright},
    {id:"misc",    label:t("notes.cat_misc","Sonstiges"),  icon:"📝", color:C.blueBright},
  ];
  const CC = {location:C.greenBright, story:C.gold, monster:C.redBright, misc:C.blueBright};
  const CI = {location:"🗺️", story:"📖", monster:"🐉", misc:"📝"};

  const [notes, setNotes] = usePersist("notes_v5", []);
  const [aid, setAid] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const mob = useMobile();

  // Migration alter "npc"-Notizen auf "monster" (npc-Cat hatte keine CC/CI → war Dead-Branch)
  const normalizeCat = (c) => (c === "npc" ? "monster" : c);

  // Filter: Kategorie + Suche (Titel + Inhalt, case-insensitive)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes
      .map(n => ({ ...n, cat: normalizeCat(n.cat) }))
      .filter(n => {
        if (catFilter !== "all" && n.cat !== catFilter) return false;
        if (!q) return true;
        return (n.title || "").toLowerCase().includes(q)
            || (n.content || "").toLowerCase().includes(q);
      });
  }, [notes, catFilter, search]);

  const cur = notes.find(n => n.id === aid) || (filtered[0] || notes[0]);

  const addNote = (cat) => {
    const n = { id: Date.now(), title: t("notes.new_note","Neue Notiz"), content: "", cat };
    setNotes(p => [...p, n]);
    setAid(n.id);
    setCatFilter("all");
    setSearch("");
  };
  const upd = (id, field, val) =>
    setNotes(p => p.map(n => n.id === id ? { ...n, [field]: val } : n));
  const delNote = () => {
    if (!cur) return;
    const rest = notes.filter(n => n.id !== cur.id);
    setNotes(rest);
    setAid(rest[0]?.id || null);
  };

  // Highlight-Helper für Suche im Titel
  const highlight = (text) => {
    const q = search.trim();
    if (!q || !text) return text;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark style={{ background: C.gold + "55", color: C.textBright, padding: "0 2px", borderRadius: 2 }}>
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    );
  };

  return (
    <div style={{display:"flex", gap:12, minHeight:"65vh", flexDirection:mob?"column":"row"}}>
      <div style={{width:mob?"100%":230, flexShrink:0, display:"flex", flexDirection:"column", gap:6}}>

        {/* ── Search ─────────────────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("notes.search_placeholder","🔍 Notiz suchen…")}
            style={{ ...sx.inp, paddingRight: search ? 32 : 10 }}
          />
          {search && (
            <button type="button"
              onClick={() => setSearch("")}
              title={t("notes.clear_search","Suche zurücksetzen")}
              style={{
                position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                width: 26, height: 26, borderRadius: "50%",
                background: "transparent", border: "none", color: C.textDim,
                cursor: "pointer", fontSize: 14, lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          )}
        </div>

        {/* ── Kategorie-Filter ──────────────────────────────────────── */}
        <div style={{display:"flex", flexDirection:"column", gap:2}}>
          {CATS.map(c => {
            const count = c.id === "all"
              ? filtered.length
              : filtered.filter(n => n.cat === c.id).length;
            const totalCount = c.id === "all"
              ? notes.length
              : notes.filter(n => normalizeCat(n.cat) === c.id).length;
            const isFiltered = search.trim() !== "" && count !== totalCount;
            return (
              <button type="button"
                key={c.id}
                onClick={() => setCatFilter(c.id)}
                style={{
                  background: catFilter === c.id ? c.color + "33" : C.surface,
                  border: `1px solid ${catFilter === c.id ? c.color : C.border}`,
                  borderRadius: 5, padding: "6px 10px", cursor: "pointer",
                  textAlign: "left",
                  color: catFilter === c.id ? c.color : C.textDim,
                  fontFamily: F, fontSize: 12,
                  fontWeight: catFilter === c.id ? 700 : 400,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{c.icon} {c.label}</span>
                <span style={{
                  fontSize: 10,
                  background: catFilter === c.id ? c.color + "44" : "transparent",
                  borderRadius: 10, padding: "1px 6px",
                }}>
                  {isFiltered ? `${count}/${totalCount}` : totalCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Add-Buttons ───────────────────────────────────────────── */}
        <div style={{display:"flex", flexWrap:"wrap", gap:4, borderTop:`1px solid ${C.border}`, paddingTop:6}}>
          {CATS.slice(1).map(c => (
            <button type="button"
              key={c.id}
              onClick={() => addNote(c.id)}
              title={t("notes.new_with_cat","Neue {cat}-Notiz").replace("{cat}", c.label)}
              style={{
                background: "transparent",
                border: `1px solid ${c.color}40`,
                borderRadius: 12, padding: "2px 9px",
                cursor: "pointer", color: c.color,
                fontSize: 11, lineHeight: 1.4, fontFamily: F,
              }}
            >+{c.icon}</button>
          ))}
          <span style={{fontSize:10, color:C.textDim, alignSelf:"center", marginLeft:2}}>{t("notes.new_note","Neue Notiz")}</span>
        </div>

        {/* ── Liste ─────────────────────────────────────────────────── */}
        <div style={{flex:1, overflowY:"auto", maxHeight:"42vh", borderTop:`1px solid ${C.border}`, paddingTop:6}}>
          {filtered.map(n => {
            const col = CC[n.cat] || C.textDim;
            const icon = CI[n.cat] || "📝";
            const active = cur?.id === n.id;
            return (
              <div
                key={n.id}
                onClick={() => setAid(n.id)}
                style={{
                  background: active ? col + "22" : C.surface,
                  border: `1px solid ${active ? col : C.border}`,
                  borderLeft: `3px solid ${col}`,
                  borderRadius: 5, padding: "7px 9px",
                  cursor: "pointer", marginBottom: 3,
                  transition: "all .15s",
                }}
              >
                <div style={{
                  fontSize: 12, color: active ? col : C.textBright, fontWeight: 700,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {icon} {n.title ? highlight(n.title) : t("notes.no_title","(kein Titel)")}
                </div>
                <div style={{
                  fontSize: 10, color: C.textDim, marginTop: 2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {n.content.slice(0, 34) || t("notes.empty","(leer)")}{n.content.length > 34 ? "..." : ""}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{fontSize:12, color:C.textDim, fontStyle:"italic", padding:"8px 4px"}}>
              {search.trim()
                ? t("notes.no_matches","Keine Treffer für \"{q}\".").replace("{q}", search)
                : t("notes.no_entries","Keine Einträge.")}
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <button type="button" onClick={delNote} style={{...sx.bsm(C.red), width:"100%"}}>{t("notes.delete","Notiz löschen")}</button>
        )}
      </div>

      {/* ── Detail-Pane ─────────────────────────────────────────────── */}
      <div style={{flex:1, display:"flex", flexDirection:"column", gap:8}}>
        {cur ? (
          <>
            <div style={{
              background: C.surface, borderRadius: 8,
              border: `1px solid ${CC[normalizeCat(cur.cat)] || C.border}`,
              borderLeft: `4px solid ${CC[normalizeCat(cur.cat)] || C.gold}`,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{fontSize:18}}>{CI[normalizeCat(cur.cat)] || "📝"}</span>
              <input
                value={cur.title}
                onChange={e => upd(cur.id, "title", e.target.value)}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: CC[normalizeCat(cur.cat)] || C.gold,
                  fontFamily: FH, fontSize: 17, fontWeight: 700,
                }}
                placeholder={t("notes.title_placeholder","Titel eingeben...")}
              />
              <select
                value={normalizeCat(cur.cat)}
                onChange={e => upd(cur.id, "cat", e.target.value)}
                style={{
                  background: C.card,
                  border: `1px solid ${CC[normalizeCat(cur.cat)] || C.border}`,
                  borderRadius: 4,
                  color: CC[normalizeCat(cur.cat)] || C.textDim,
                  fontFamily: F, fontSize: 12, padding: "3px 8px",
                  cursor: "pointer", outline: "none",
                }}
              >
                <option value="location">{t("notes.cat_prefix","Kategorie")}: {t("notes.cat_location","Location")}</option>
                <option value="story">{t("notes.cat_prefix","Kategorie")}: {t("notes.cat_story","Story")}</option>
                <option value="monster">{t("notes.cat_prefix","Kategorie")}: {t("notes.cat_monster","Monster")}</option>
                <option value="misc">{t("notes.cat_prefix","Kategorie")}: {t("notes.cat_misc","Sonstiges")}</option>
              </select>
            </div>
            <textarea
              value={cur.content}
              onChange={e => upd(cur.id, "content", e.target.value)}
              style={{
                ...sx.ta, flex: 1, minHeight: 400,
                lineHeight: 1.9, fontSize: 14,
                borderColor: CC[normalizeCat(cur.cat)] || C.border,
              }}
              placeholder={
                normalizeCat(cur.cat) === "monster" ? t("notes.ph_monster","Name, Typ, CR, Taktik, Schwächen, Lore...") :
                normalizeCat(cur.cat) === "location" ? t("notes.ph_location","Beschreibung, Atmosphäre, NPCs vor Ort...") :
                normalizeCat(cur.cat) === "story" ? t("notes.ph_story","Plotpunkte, Hinweise, Twist-Ideen...") :
                t("notes.ph_misc","Freie Notizen...")
              }
            />
          </>
        ) : (
          <div style={{...sx.card, textAlign:"center", color:C.textDim, fontStyle:"italic", padding:40}}>
            <div style={{fontSize:36, marginBottom:10}}>📝</div>
            {t("notes.empty_state","Wähle eine Notiz oder erstelle eine neue.")}
          </div>
        )}
      </div>
    </div>
  );
}
