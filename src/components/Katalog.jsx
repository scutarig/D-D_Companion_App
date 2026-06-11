import { useState } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { SRD_ITEMS, MAGIC_MODIFIERS, applyMagicModifier } from "../data/items.js";
import { usePersist } from "../hooks/usePersist.js";
import { useI18n } from "../i18n/index.js";
import { useScrollLock } from "../hooks/useScrollLock.js";

// Check if item can be enhanced with +0/+1/+2/+3 magic modifier
const isMagicCompatible = (item) =>
  (item.type === "Weapon" || item.type === "Armor") &&
  item.sub !== "Magic" &&
  !item.magic;

// ─── Inline DE→EN translation dictionary for common Item-notes phrases ──
// Covers ~80% of weapon/armor/gear/potion notes. Falls back to DE if no match.
const ITEM_NOTE_TRANSLATIONS = {
  // Weapon properties
  "Vielseitig: 1d10 zweihändig.": "Versatile: 1d10 two-handed.",
  "Vielseitig: 1d10.": "Versatile: 1d10.",
  "Vielseitig 1d8. Wurfbar (20/60ft).": "Versatile 1d8. Thrown (20/60ft).",
  "Vielseitig 1d8.": "Versatile 1d8.",
  "Vielseitig 1d10.": "Versatile 1d10.",
  "Finesse, leicht.": "Finesse, Light.",
  "Finesse, leicht, wurfbar (20/60ft).": "Finesse, Light, Thrown (20/60ft).",
  "Finesse.": "Finesse.",
  "Finesse, Reach.": "Finesse, Reach.",
  "Finesse, wurfbar (20/60ft).": "Finesse, Thrown (20/60ft).",
  "Schwer, zweihändig.": "Heavy, Two-Handed.",
  "Schwer, Reach, zweihändig.": "Heavy, Reach, Two-Handed.",
  "Zweihändig.": "Two-Handed.",
  "Leicht.": "Light.",
  "Leicht, wurfbar (20/60ft).": "Light, Thrown (20/60ft).",
  "Wurfbar (30/120ft).": "Thrown (30/120ft).",
  "Reach 10ft. Nachteil auf 5ft.": "Reach 10ft. Disadvantage at 5ft.",
  "—": "—",
  // Ranged
  "150/600ft. Schwer, zweihändig.": "150/600ft. Heavy, Two-Handed.",
  "80/320ft. Zweihändig. Nach Schuss nachladen.": "80/320ft. Two-Handed. Loading.",
  "80/320ft. Zweihändig.": "80/320ft. Two-Handed.",
  "100/400ft. Schwer, zweihändig. Nachladen.": "100/400ft. Heavy, Two-Handed. Loading.",
  "25/100ft. Nachladen.": "25/100ft. Loading.",
  "30/120ft.": "30/120ft.",
  "5/15ft. STR DC 10 Entfesseln oder ATK 5 Schaden.": "5/15ft. STR DC 10 to escape, or attack 5 damage.",
  "Für Kurz- und Langbogen.": "For Shortbow and Longbow.",
  "Für Leichte und Schwere Armbrust.": "For Light and Heavy Crossbow.",
  "Für Blasrohr.": "For Blowgun.",
  // Armor
  "STR 13. Stealth-Nachteil.": "STR 13. Stealth Disadvantage.",
  "STR 15. Stealth-Nachteil.": "STR 15. Stealth Disadvantage.",
  "Stealth-Nachteil.": "Stealth Disadvantage.",
  "Nicht mit zweihändigen Waffen.": "Not with two-handed weapons.",
  // Adventuring Gear / Tools — common
  "Bis 300 Pfund. DC 17 STR zerreißen.": "Up to 300 lbs. DC 17 STR to break.",
  "Mit Seil klettern. Wurfweite 60ft.": "Climb with rope. Throw range 60ft.",
  "20ft hell + 20ft dämmrig. Brennt 1h.": "20ft bright + 20ft dim. Burns 1h.",
  "Ersetzt materielle Komponenten ohne GP-Wert.": "Replaces material components without GP cost.",
  "30 lb Kapazität (ohne Magie).": "30 lb capacity (non-magical).",
  "Feuer entfachen in 1 Minute (kein Würfelwurf).": "Light a fire in 1 minute (no roll required).",
  "30ft hell + 30ft dämmrig. 6h pro Öl-Flask.": "30ft bright + 30ft dim. 6h per oil flask.",
  "10 Anwendungen. Stabilisieren DC 10, kein Würfelwurf nötig.": "10 uses. Stabilize DC 10, no roll needed.",
  "+2 Bonus auf STR-Checks zum Aufbrechen.": "+2 bonus to STR checks to break.",
  "Spike, Handschuhe, Stiefel. Haken für sicheres Klettern.": "Spike, gloves, boots. Hooks for safe climbing.",
  "Schutz vor normalen Umweltbedingungen.": "Protection from normal environmental conditions.",
  "Tinte, Feder, 10 Blatt Pergament.": "Ink, quill, 10 sheets of parchment.",
  "Zugfestigkeit: kann bis 900 Pfund halten.": "Tensile strength: can hold up to 900 lbs.",
  "4 Tage Wasser (1 Gallone).": "4 days of water (1 gallon).",
  "2× Vergrößerung auf bis zu 1 Meile.": "2× magnification up to 1 mile.",
  "Ecken & Medusas-Schutz. Stealth DC +0.": "Corners & Medusa-protection. Stealth DC +0.",
  "DC 20 STR oder Dex+Diebeswerkzeug zum Entkommen.": "DC 20 STR or DEX+Thieves' Tools to escape.",
  "Feuer als Bonusaktion (wenn bereits Zunder bereit).": "Fire as Bonus Action (if tinder ready).",
  // Tools
  "Schlösser knacken & Fallen entschärfen. Proficiency benötigt.": "Pick locks & disarm traps. Proficiency required.",
  "Kostüme, Schminke, Perücken. Für Verkleidungs-Checks.": "Costumes, makeup, wigs. For disguise checks.",
  "Gifte herstellen und anwenden. Proficiency benötigt.": "Make and apply poisons. Proficiency required.",
  "Metallgegenstände herstellen und reparieren.": "Make and repair metal objects.",
  "Heilkräuter identifizieren, Tränke und Pasten herstellen.": "Identify herbs, brew potions and salves.",
  "Seekarten, Kompass, Sextant. Navigation auf See & Land.": "Sea charts, compass, sextant. Navigation on sea & land.",
  // Potions
  "Bonus-Aktion (selbst) oder Aktion (anderer).": "Bonus Action (self) or Action (other).",
  "Resistenz gegen Feuerschaden für 1 Stunde.": "Resistance to Fire damage for 1 hour.",
  "Fluggeschwindigkeit 60ft für 1 Stunde. Konzentration.": "Fly Speed 60ft for 1 hour. Concentration.",
  "Unsichtbar für 1h. Endet bei Angriff/Zauber.": "Invisible for 1h. Ends on attack/spell.",
  "STR wird 29 für 24 Stunden.": "STR becomes 29 for 24 hours.",
  "True Seeing: Illusionen durchschauen, Unsichtbare sehen.": "True Seeing: see through illusions, see invisible.",
  "1 Anwendung. Auf Klinge oder in Nahrung. CON DC 10 oder 1d4 Gift.": "1 use. On blade or in food. CON DC 10 or 1d4 Poison.",
  // Scrolls
  "Einmal verwendbar. Zauberkundige können lesen.": "Single use. Spellcasters can read.",
  "Einmal verwendbar. DC 12 wenn keine Klassenliste.": "Single use. DC 12 if not on class list.",
  "Einmal verwendbar. DC 13.": "Single use. DC 13.",
  "Einmal verwendbar. DC 14.": "Single use. DC 14.",
  "Einmal verwendbar. DC 15.": "Single use. DC 15.",
};

const tNote = (note, lang) => {
  if (lang !== "en" || !note) return note;
  return ITEM_NOTE_TRANSLATIONS[note] || note;
};

const RC   = { Common: C.textDim, Uncommon: "#00c040", Rare: "#3b82f6", "Very Rare": "#a855f7", Legendary: "#f59e0b" };
const RCBG = { Common: "rgba(255,255,255,0.03)", Uncommon: "rgba(0,192,64,0.07)", Rare: "rgba(59,130,246,0.09)", "Very Rare": "rgba(168,85,247,0.09)", Legendary: "rgba(245,158,11,0.11)" };
const GLOW = { Common:"none", Uncommon:"0 0 8px #00c04033", Rare:"0 0 10px #3b82f655", "Very Rare":"0 0 12px #a855f766", Legendary:"0 0 16px #f59e0b88" };
const TICON = { Weapon:"⚔️", Armor:"🛡️", Item:"📦", Potion:"🧪", Ring:"💍", Wand:"🪄", Staff:"🔱", Scroll:"📜" };

const CATS = [
  { id:"alle",     label:"Alle",           key:"katalog.cat_all" },
  { id:"waffe",    label:"⚔️ Waffen",       key:"katalog.cat_weapons",   match: i => i.type === "Weapon" && i.sub !== "Magic" },
  { id:"ruestung", label:"🛡️ Rüstung",      key:"katalog.cat_armor",     match: i => i.type === "Armor"  && i.sub !== "Magic" },
  { id:"gear",     label:"🎒 Ausrüstung",   key:"katalog.cat_gear",      match: i => i.type === "Item"   && ["Gear","Focus","Ammo","Tool"].includes(i.sub) },
  { id:"trank",    label:"🧪 Tränke",       key:"katalog.cat_potions",   match: i => i.sub === "Potion" },
  { id:"magie",    label:"✨ Magie",         key:"katalog.cat_magic",     match: i => i.sub === "Magic" },
  { id:"schriftrolle", label:"📜 Schriftrollen", key:"katalog.cat_scrolls", match: i => i.sub === "Scroll" },
  { id:"werkzeug", label:"🔧 Werkzeuge",    key:"katalog.cat_tools",     match: i => i.sub === "Tool" },
];
const RARS = ["Alle", "Common", "Uncommon", "Rare", "Very Rare", "Legendary"];

const BLANK_FORM = { name:"", type:"Weapon", sub:"Simple Melee", dmg:"", ac:"", eff:"", wt:"", rar:"Common", notes:"" };

export default function Katalog({ char, setChar }) {
  const { t, lang } = useI18n();
  const inv    = char?.inventory || [];

  // Used later for modal scroll-lock
  // (declared early so hooks run unconditionally)
  const setInv = fn => setChar && setChar(p => ({ ...p, inventory: typeof fn === "function" ? fn(p.inventory || []) : fn }));

  const [custom, setCustom] = usePersist("katalog_custom_v1", []);
  const [cat,    setCat]    = useState("alle");
  const [rar,    setRar]    = useState("Alle");
  const [q,      setQ]      = useState("");
  const [form,   setForm]   = useState(BLANK_FORM);
  const [showForm, setShowForm] = useState(false);
  const [modal,  setModal]  = useState(null);
  useScrollLock(!!modal);
  const [editId, setEditId] = useState(null);

  const allItems = [...SRD_ITEMS, ...custom];

  const catFn  = CATS.find(c => c.id === cat)?.match || (() => true);
  const shown  = allItems.filter(i =>
    catFn(i) &&
    (rar === "Alle" || i.rar === rar) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.sub?.toLowerCase().includes(q.toLowerCase()) || i.notes?.toLowerCase().includes(q.toLowerCase()))
  );

  const countInInv = name => inv.filter(i => i.name === name).reduce((s,i)=>(s+(i.qty||1)),0);
  const addToInv = (item, magicPlus = 0) => {
    if (!char) return;
    const finalItem = magicPlus > 0 ? applyMagicModifier(item, magicPlus) : item;
    // Wenn schon im Inventar: qty erhöhen, sonst neu hinzufügen
    const existing = inv.find(i => i.name === finalItem.name);
    if (existing) {
      setInv(p => p.map(i => i.name === finalItem.name ? { ...i, qty: (i.qty||1) + 1 } : i));
    } else {
      setInv(p => [...p, { ...finalItem, uid: Date.now() + Math.random(), qty: 1 }]);
    }
  };

  const saveCustom = () => {
    if (!form.name.trim()) return;
    if (editId != null) {
      setCustom(p => p.map(i => i._cid === editId ? { ...form, _cid: editId } : i));
    } else {
      setCustom(p => [...p, { ...form, id: Date.now(), _cid: Date.now(), custom: true }]);
    }
    setForm(BLANK_FORM); setShowForm(false); setEditId(null);
  };
  const deleteCustom = cid => { setCustom(p => p.filter(i => i._cid !== cid)); if (modal?._cid === cid) setModal(null); };

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("katalog.search","🔍 Suchen…")}
          style={{ ...sx.inp, flex:"1 1 160px", minWidth:120 }} />
        <select value={rar} onChange={e => setRar(e.target.value)} style={{ ...sx.sel, width:"auto" }}>
          {RARS.map(r => <option key={r}>{r}</option>)}
        </select>
        <button onClick={() => { setForm(BLANK_FORM); setEditId(null); setShowForm(p => !p); }}
          style={sx.btn(showForm ? C.textDim : C.green)}>
          {showForm ? "✕ " + t("katalog.cancel","Abbrechen") : t("katalog.add_custom","+ Eigenes Item")}
        </button>
      </div>

      {/* ── Category pills ── */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            style={{ ...sx.bsm(cat === c.id ? C.purple : C.textDim), fontWeight: cat === c.id ? 700 : 400, fontSize:11 }}>
            {c.key ? t(c.key, c.label) : c.label}
          </button>
        ))}
      </div>

      {/* ── Custom item form ── */}
      {showForm && (
        <div style={{ ...sx.card, marginBottom:12 }}>
          <div style={sx.ct}>{editId != null ? t("katalog.edit_item_title","✏️ Item bearbeiten") : t("katalog.create_custom_title","✏️ Eigenes Item erstellen")}</div>
          <div style={sx.g3}>
            <div style={{ gridColumn:"1/3" }}><label style={sx.lbl}>{t("katalog.label_name","Name")}</label><input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} style={sx.inp} /></div>
            <div><label style={sx.lbl}>{t("katalog.label_type","Typ")}</label>
              <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))} style={sx.sel}>
                {["Weapon","Armor","Item"].map(tp=><option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>{t("katalog.label_sub","Subtyp")}</label><input value={form.sub} onChange={e => setForm(p=>({...p,sub:e.target.value}))} style={sx.inp} placeholder="Simple Melee, Potion…" /></div>
            <div><label style={sx.lbl}>{t("katalog.label_rar","Seltenheit")}</label>
              <select value={form.rar} onChange={e => setForm(p=>({...p,rar:e.target.value}))} style={sx.sel}>
                {["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>{t("katalog.label_dmg","Schaden")}</label><input value={form.dmg} onChange={e => setForm(p=>({...p,dmg:e.target.value}))} style={sx.inp} placeholder="1d8 S" /></div>
            <div><label style={sx.lbl}>{t("katalog.label_ac","AC")}</label><input value={form.ac} onChange={e => setForm(p=>({...p,ac:e.target.value}))} style={sx.inp} placeholder="AC 16" /></div>
            <div><label style={sx.lbl}>{t("katalog.label_eff","Effekt")}</label><input value={form.eff} onChange={e => setForm(p=>({...p,eff:e.target.value}))} style={sx.inp} placeholder="2d4+2 HP" /></div>
            <div><label style={sx.lbl}>{t("katalog.label_wt","Gewicht")}</label><input value={form.wt} onChange={e => setForm(p=>({...p,wt:e.target.value}))} style={sx.inp} placeholder="3 lb" /></div>
          </div>
          <div style={{marginTop:8}}><label style={sx.lbl}>{t("katalog.label_notes","Beschreibung / Notizen")}</label>
            <textarea value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:52}} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={saveCustom} style={sx.btn(C.green)}>{t("katalog.save","Speichern")}</button>
            <button onClick={() => {setShowForm(false);setEditId(null);setForm(BLANK_FORM);}} style={sx.btn(C.textDim)}>{t("katalog.cancel","Abbrechen")}</button>
          </div>
        </div>
      )}

      {/* ── Item count ── */}
      <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{shown.length} {t("katalog.items_count","Items")}</div>

      {/* ── Item grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:6 }}>
        {shown.map(item => {
          const col    = RC[item.rar] || C.textDim;
          return (
            <div key={item.id ?? item._cid}
              onClick={() => setModal(item)}
              style={{ background:RCBG[item.rar]||"rgba(0,0,0,0.2)", border:`1px solid ${col}33`, borderRadius:10,
                padding:"10px 12px", cursor:"pointer", transition:"all .15s",
                display:"flex", gap:10, alignItems:"flex-start",
              }}>
              <span style={{fontSize:22,flexShrink:0,marginTop:2}}>{TICON[item.type]||"📦"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:9,color:col,marginBottom:3}}>{item.rar} · {item.sub||item.type}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {item.dmg && item.dmg!=="—" && <span style={{fontSize:9,color:C.red}}>⚔️ {item.dmg}</span>}
                  {item.ac  && <span style={{fontSize:9,color:C.blue}}>🛡️ {item.ac}</span>}
                  {item.eff && <span style={{fontSize:9,color:C.green}}>✨ {item.eff}</span>}
                  {item.wt  && item.wt!=="—" && <span style={{fontSize:9,color:C.textDim}}>⚖️ {item.wt}</span>}
                </div>
              </div>
              {char && (() => {
                const cnt = countInInv(item.name);
                return (
                  <button onClick={e => { e.stopPropagation(); addToInv(item); }}
                    style={{...sx.btn(C.green),fontSize:10,padding:"4px 10px",flexShrink:0}}>
                    {cnt > 0 ? `+1 (${cnt})` : "+"}
                  </button>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* ── Detail Modal — Bottom Sheet mit solidem Hintergrund ── */}
      {modal && (
        <div onClick={() => setModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e => e.stopPropagation()}
            style={{
              width:"100%", maxWidth:560,
              background: C.surface,
              borderTop:`2px solid ${RC[modal.rar]||C.border}`,
              borderRadius:"18px 18px 0 0",
              padding:"20px 18px 36px",
              boxShadow:`0 -8px 40px rgba(0,0,0,0.8), ${GLOW[modal.rar]}`,
              maxHeight:"80vh", overflowY:"auto",
              position:"relative",
            }}>
            {/* Close X (Touch-Discoverability) */}
            <button onClick={() => setModal(null)}
              aria-label={t("katalog.close_word","Schließen")}
              style={{
                position:"absolute", top:10, right:10, zIndex:10,
                width:36, height:36, borderRadius:"50%",
                background:"rgba(0,0,0,0.5)", border:`1px solid ${C.border}`,
                color:C.textBright, fontSize:18, lineHeight:1, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            {/* Griff */}
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>

            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14,paddingRight:50}}>
              <span style={{fontSize:44}}>{TICON[modal.type]||"📦"}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:FH,fontSize:20,color:RC[modal.rar]||C.gold,fontWeight:700,lineHeight:1.2}}>{modal.name}</div>
                <div style={{fontSize:12,color:C.textDim,marginTop:4}}>
                  {modal.sub||modal.type} · <span style={{color:RC[modal.rar]||C.textDim}}>{modal.rar}</span>
                  {modal.custom && <span style={{...sx.tag(C.purple),marginLeft:8,fontSize:9}}>{t("katalog.custom_item_tag","Eigenes Item")}</span>}
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {modal.dmg && modal.dmg!=="—" && <span style={sx.tag(C.red)}>⚔️ Schaden: {modal.dmg}</span>}
              {modal.ac  && <span style={sx.tag(C.blue)}>🛡️ AC: {modal.ac}</span>}
              {modal.eff && <span style={sx.tag(C.green)}>✨ {modal.eff}</span>}
              {modal.wt  && modal.wt!=="—" && <span style={sx.tag(C.textDim)}>⚖️ {modal.wt}</span>}
            </div>

            {modal.notes && modal.notes!=="—" && (
              <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:16,padding:"10px 12px",background:"rgba(0,0,0,0.35)",borderRadius:8}}>
                {tNote(modal.notes, lang)}
              </div>
            )}

            {/* Magic Modifier Picker (Waffen & Rüstungen) */}
            {char && isMagicCompatible(modal) && (
              <div style={{
                marginBottom: 14,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.35)",
                borderRadius: 8,
                border: `1px solid ${C.amberBright}33`,
                borderLeft: `3px solid ${C.amberBright}`,
              }}>
                <div style={{ fontSize: 10, color: C.amberBright, fontFamily: FH, letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 }}>
                  {t("katalog.magic_variant_header","✨ ALS MAGISCHE VARIANTE HINZUFÜGEN")}
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {MAGIC_MODIFIERS.map(mod => {
                    const previewName = mod.plus === 0 ? modal.name : `${modal.name} +${mod.plus}`;
                    const cnt = countInInv(previewName);
                    return (
                      <button
                        key={mod.plus}
                        onClick={() => { addToInv(modal, mod.plus); setModal(null); }}
                        title={mod.plus === 0 ? t("katalog.no_magic_title","Standard ohne Magie") : t("katalog.modifier_title","+{n} auf Angriff & Schaden (Waffe) bzw. +{n} AC (Rüstung). Rarität: {rar}").replace(/\{n\}/g, mod.plus).replace("{rar}", mod.rar)}
                        style={{
                          flex: "1 1 auto",
                          padding: "8px 10px",
                          borderRadius: 7,
                          fontFamily: FH,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all .15s",
                          background: mod.plus === 0 ? "rgba(255,255,255,0.04)" : `${RC[mod.rar] || C.amberBright}22`,
                          border: `1px solid ${RC[mod.rar] || C.amberBright}55`,
                          color: RC[mod.rar] || C.amberBright,
                          letterSpacing: 0.5,
                          minWidth: 70,
                        }}>
                        {mod.label}
                        <div style={{ fontSize: 8, opacity: 0.7, marginTop: 2, fontFamily: "inherit", letterSpacing: 0.3 }}>
                          {mod.rar}{cnt > 0 ? ` · ${cnt}×` : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {char && !isMagicCompatible(modal) && (() => {
                const cnt = countInInv(modal.name);
                return (
                  <button onClick={() => { addToInv(modal); setModal(null); }}
                    style={{...sx.btn(C.green),padding:"10px 20px",fontSize:13}}>
                    {cnt > 0 ? `${t("katalog.add_again","📦 Nochmal hinzufügen")} (${cnt}×)` : t("katalog.to_inventory","📦 Zu Inventar")}
                  </button>
                );
              })()}
              {modal.custom && (
                <>
                  <button onClick={() => { setForm({name:modal.name,type:modal.type,sub:modal.sub||"",dmg:modal.dmg||"",ac:modal.ac||"",eff:modal.eff||"",wt:modal.wt||"",rar:modal.rar,notes:modal.notes||""}); setEditId(modal._cid); setShowForm(true); setModal(null); }}
                    style={{...sx.bsm(C.gold),padding:"8px 14px"}}>✎ {t("katalog.edit","Bearbeiten")}</button>
                  <button onClick={() => deleteCustom(modal._cid)} style={{...sx.bsm(C.red),padding:"8px 14px"}}>🗑 {t("katalog.delete_word","Löschen")}</button>
                </>
              )}
              <button onClick={() => setModal(null)} style={{...sx.bsm(C.textDim),padding:"8px 14px"}}>{t("katalog.close_word","Schließen")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
