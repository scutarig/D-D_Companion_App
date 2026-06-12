import { useState, useMemo } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile as useMobile } from "../hooks/useIsMobile.js";
import { useI18n } from "../i18n/index.js";
import { useDialog } from "../hooks/useDialog.jsx";
import Modal from "./Modal.jsx";

// Built-in categories — cannot be edited/deleted.
const BUILTIN_CATS = [
  { id: "location", labelKey: "notes.cat_location", fallback: "Location",  icon: "🗺️", color: "greenBright" },
  { id: "story",    labelKey: "notes.cat_story",    fallback: "Story",     icon: "📖", color: "gold" },
  { id: "monster",  labelKey: "notes.cat_monster",  fallback: "Monster",   icon: "🐉", color: "redBright" },
  { id: "misc",     labelKey: "notes.cat_misc",     fallback: "Sonstiges", icon: "📝", color: "blueBright" },
];
const BUILTIN_IDS = new Set(BUILTIN_CATS.map(c => c.id));

// Available colors for custom categories — keyed to theme palette
const COLOR_CHOICES = [
  { key: "gold",         color: C.gold },
  { key: "redBright",    color: C.redBright },
  { key: "blueBright",   color: C.blueBright },
  { key: "greenBright",  color: C.greenBright },
  { key: "purpleBright", color: C.purpleBright },
  { key: "tealBright",   color: C.tealBright },
  { key: "amberBright",  color: C.amberBright },
];

const ICON_SUGGESTIONS = ["⚔️","🏰","🛡️","🔮","💎","🗝️","🎭","👑","🏹","💀","🌙","🌟","🔥","❄️","⚡","🌿","📜","🎲","🎯","🍺","💰","🗡️","🐺","🐉","👁️","🌑","🧝","🧙","🧪","🌍","🗺️","📖","📝"];

export default function Notes() {
  const { t } = useI18n();
  const { confirm } = useDialog();
  const mob = useMobile();

  const [notes, setNotes] = usePersist("notes_v5", []);
  const [customCats, setCustomCats] = usePersist("notes_custom_cats_v1", []);
  const [aid, setAid] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorCat, setEditorCat] = useState(null); // null = create, otherwise edit

  const builtinCats = BUILTIN_CATS.map(c => ({
    id: c.id,
    label: t(c.labelKey, c.fallback),
    icon: c.icon,
    color: C[c.color] || C.textDim,
    builtin: true,
  }));
  const userCats = customCats.map(c => ({
    id: c.id,
    label: c.label,
    icon: c.icon,
    color: C[c.color] || C.gold,
    builtin: false,
    colorKey: c.color,
  }));
  const allCats = [...builtinCats, ...userCats];
  const catById = Object.fromEntries(allCats.map(c => [c.id, c]));

  const allFilter = { id: "all", label: t("notes.cat_all","Alle"), icon: "📋", color: C.textDim, builtin: true };
  const sidebarCats = [allFilter, ...allCats];

  // Migration: alte "npc"-Notizen + Notizen mit gelöschten Custom-Cats → "misc"
  const normalizeCat = (c) => {
    if (c === "npc") return "monster";
    if (!catById[c]) return "misc";
    return c;
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, catFilter, search, customCats.length]);

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
  const delNote = async () => {
    if (!cur) return;
    const ok = await confirm(t("notes.confirm_delete","Notiz wirklich löschen?"), { danger: true });
    if (!ok) return;
    const rest = notes.filter(n => n.id !== cur.id);
    setNotes(rest);
    setAid(rest[0]?.id || null);
  };

  const openCreate = () => { setEditorCat(null); setEditorOpen(true); };
  const openEdit = (c) => { setEditorCat(c); setEditorOpen(true); };
  const saveCat = (data) => {
    if (editorCat) {
      setCustomCats(p => p.map(c => c.id === editorCat.id ? { ...c, ...data } : c));
    } else {
      const id = "custom_" + Date.now();
      setCustomCats(p => [...p, { id, ...data }]);
    }
    setEditorOpen(false);
  };
  const deleteCat = async (c) => {
    const affected = notes.filter(n => normalizeCat(n.cat) === c.id).length;
    const msg = affected > 0
      ? t("notes.confirm_delete_cat_with_notes","Filter \"{name}\" löschen?\n{n} Notiz(en) werden in \"Sonstiges\" verschoben.")
          .replace("{name}", c.label).replace("{n}", affected)
      : t("notes.confirm_delete_cat","Filter \"{name}\" löschen?").replace("{name}", c.label);
    const ok = await confirm(msg, { danger: true });
    if (!ok) return;
    setNotes(p => p.map(n => n.cat === c.id ? { ...n, cat: "misc" } : n));
    setCustomCats(p => p.filter(x => x.id !== c.id));
    if (catFilter === c.id) setCatFilter("all");
    setEditorOpen(false);
  };

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

        {/* ── Kategorie-Filter (2-Spalten-Grid, kompakt) ──────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 4,
        }}>
          {sidebarCats.map(c => {
            const count = c.id === "all"
              ? filtered.length
              : filtered.filter(n => n.cat === c.id).length;
            const totalCount = c.id === "all"
              ? notes.length
              : notes.filter(n => normalizeCat(n.cat) === c.id).length;
            const isFiltered = search.trim() !== "" && count !== totalCount;
            const active = catFilter === c.id;
            const showEdit = !c.builtin;
            return (
              <div key={c.id} style={{ position: "relative" }}>
                <button type="button"
                  onClick={() => setCatFilter(c.id)}
                  title={c.label}
                  style={{
                    width: "100%",
                    background: active ? c.color + "33" : C.surface,
                    border: `1px solid ${active ? c.color : C.border}`,
                    borderRadius: 5, padding: "5px 7px", cursor: "pointer",
                    textAlign: "left",
                    color: active ? c.color : C.textDim,
                    fontFamily: F, fontSize: 11,
                    fontWeight: active ? 700 : 400,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 4, minWidth: 0,
                  }}
                >
                  <span style={{
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    minWidth: 0, flex: 1,
                  }}>
                    {c.icon} {c.label}
                  </span>
                  <span style={{
                    fontSize: 9,
                    background: active ? c.color + "44" : "transparent",
                    borderRadius: 8, padding: "0 5px",
                    flexShrink: 0,
                  }}>
                    {isFiltered ? `${count}/${totalCount}` : totalCount}
                  </span>
                </button>
                {showEdit && (
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                    title={t("notes.edit_cat","Filter bearbeiten")}
                    style={{
                      position: "absolute", top: -4, right: -4,
                      width: 16, height: 16, borderRadius: "50%",
                      background: C.card, border: `1px solid ${C.border}`,
                      color: c.color, fontSize: 9, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: 0, lineHeight: 1,
                    }}
                  >✎</button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── + Filter (eigene Kategorie anlegen) ──────────────────── */}
        <button type="button"
          onClick={openCreate}
          style={{
            background: "transparent",
            border: `1px dashed ${C.border}`,
            borderRadius: 5, padding: "5px 7px", cursor: "pointer",
            color: C.textDim, fontSize: 11, fontFamily: F,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}
        >
          ＋ {t("notes.add_custom_cat","Eigener Filter")}
        </button>

        {/* ── Add-Note-Buttons ─────────────────────────────────────── */}
        <div style={{display:"flex", flexWrap:"wrap", gap:4, borderTop:`1px solid ${C.border}`, paddingTop:6}}>
          {allCats.map(c => (
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
            const meta = catById[n.cat] || catById["misc"];
            const col = meta?.color || C.textDim;
            const icon = meta?.icon || "📝";
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
              border: `1px solid ${(catById[normalizeCat(cur.cat)]?.color) || C.border}`,
              borderLeft: `4px solid ${(catById[normalizeCat(cur.cat)]?.color) || C.gold}`,
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
              flexWrap: "wrap",
              minWidth: 0,
            }}>
              <span style={{fontSize:18, flexShrink: 0}}>{catById[normalizeCat(cur.cat)]?.icon || "📝"}</span>
              <input
                value={cur.title}
                onChange={e => upd(cur.id, "title", e.target.value)}
                style={{
                  flex: "1 1 140px", minWidth: 0,
                  background: "transparent", border: "none", outline: "none",
                  color: (catById[normalizeCat(cur.cat)]?.color) || C.gold,
                  fontFamily: FH, fontSize: 17, fontWeight: 700,
                }}
                placeholder={t("notes.title_placeholder","Titel eingeben...")}
              />
              <select
                value={normalizeCat(cur.cat)}
                onChange={e => upd(cur.id, "cat", e.target.value)}
                title={t("notes.cat_prefix","Kategorie")}
                style={{
                  background: C.card,
                  border: `1px solid ${(catById[normalizeCat(cur.cat)]?.color) || C.border}`,
                  borderRadius: 4,
                  color: (catById[normalizeCat(cur.cat)]?.color) || C.textDim,
                  fontFamily: F, fontSize: 12, padding: "3px 8px",
                  cursor: "pointer", outline: "none",
                  maxWidth: "100%",
                  flexShrink: 0,
                }}
              >
                {allCats.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <textarea
              value={cur.content}
              onChange={e => upd(cur.id, "content", e.target.value)}
              style={{
                ...sx.ta, flex: 1, minHeight: 400,
                lineHeight: 1.9, fontSize: 14,
                borderColor: (catById[normalizeCat(cur.cat)]?.color) || C.border,
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

      <CategoryEditor
        open={editorOpen}
        cat={editorCat}
        onClose={() => setEditorOpen(false)}
        onSave={saveCat}
        onDelete={editorCat ? () => deleteCat(editorCat) : null}
      />
    </div>
  );
}

function CategoryEditor({ open, cat, onClose, onSave, onDelete }) {
  const { t } = useI18n();
  const [label, setLabel] = useState(cat?.label || "");
  const [icon, setIcon] = useState(cat?.icon || "⚔️");
  const [colorKey, setColorKey] = useState(cat?.colorKey || "gold");

  // Re-sync state when cat changes (open with different cat / create→edit)
  useMemo(() => {
    setLabel(cat?.label || "");
    setIcon(cat?.icon || "⚔️");
    setColorKey(cat?.colorKey || "gold");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat?.id, open]);

  const isEdit = !!cat;
  const submit = () => {
    const lbl = label.trim();
    if (!lbl) return;
    onSave({ label: lbl.slice(0, 40), icon: (icon || "📝").slice(0, 4), color: colorKey });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t("notes.edit_cat_title","Filter bearbeiten") : t("notes.new_cat_title","Neuer Filter")}
      maxWidth={420}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Name */}
        <div>
          <label style={sx.lbl}>{t("notes.cat_name","Name")}</label>
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder={t("notes.cat_name_placeholder","z.B. NPCs, Lore, Items…")}
            maxLength={40}
            style={sx.inp}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
          />
        </div>

        {/* Icon */}
        <div>
          <label style={sx.lbl}>{t("notes.cat_icon","Icon (Emoji)")}</label>
          <input
            value={icon}
            onChange={e => setIcon(e.target.value)}
            maxLength={4}
            style={{ ...sx.inp, fontSize: 20, textAlign: "center", width: 60 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {ICON_SUGGESTIONS.map(em => (
              <button type="button" key={em}
                onClick={() => setIcon(em)}
                style={{
                  background: icon === em ? C.gold + "22" : "transparent",
                  border: `1px solid ${icon === em ? C.gold : C.border}`,
                  borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: 16,
                  lineHeight: 1,
                }}
              >{em}</button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label style={sx.lbl}>{t("notes.cat_color","Farbe")}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COLOR_CHOICES.map(ch => (
              <button type="button" key={ch.key}
                onClick={() => setColorKey(ch.key)}
                aria-label={ch.key}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: ch.color,
                  border: colorKey === ch.key ? `3px solid ${C.textBright}` : `1px solid ${C.border}`,
                  cursor: "pointer",
                  boxShadow: colorKey === ch.key ? `0 0 8px ${ch.color}88` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          padding: "6px 10px", borderRadius: 5,
          background: (C[colorKey] || C.gold) + "22",
          border: `1px solid ${C[colorKey] || C.gold}`,
          color: C[colorKey] || C.gold,
          fontSize: 12, fontWeight: 700,
        }}>
          {t("notes.preview_label","Vorschau:")} {icon} {label || t("notes.cat_name","Name")}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 4 }}>
          {isEdit && onDelete ? (
            <button type="button" onClick={onDelete} style={{ ...sx.bsm(C.red), padding: "8px 14px", fontSize: 12 }}>
              🗑 {t("notes.delete_cat","Filter löschen")}
            </button>
          ) : <span />}
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={onClose} style={{ ...sx.bsm(C.textDim), padding: "8px 14px", fontSize: 12 }}>
              {t("dialog.cancel","Abbrechen")}
            </button>
            <button type="button" onClick={submit} disabled={!label.trim()}
              style={{ ...sx.btn(C[colorKey] || C.gold), padding: "8px 18px", fontSize: 12, opacity: label.trim() ? 1 : 0.5 }}>
              {isEdit ? t("notes.save_cat","Speichern") : t("notes.create_cat","Anlegen")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
