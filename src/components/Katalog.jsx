import { useState } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { SRD_ITEMS, MAGIC_MODIFIERS, applyMagicModifier } from "../data/items.js";
import { usePersist } from "../hooks/usePersist.js";

// Check if item can be enhanced with +0/+1/+2/+3 magic modifier
const isMagicCompatible = (item) =>
  (item.type === "Weapon" || item.type === "Armor") &&
  item.sub !== "Magic" &&
  !item.magic;

const RC   = { Common: C.textDim, Uncommon: "#00c040", Rare: "#3b82f6", "Very Rare": "#a855f7", Legendary: "#f59e0b" };
const RCBG = { Common: "rgba(255,255,255,0.03)", Uncommon: "rgba(0,192,64,0.07)", Rare: "rgba(59,130,246,0.09)", "Very Rare": "rgba(168,85,247,0.09)", Legendary: "rgba(245,158,11,0.11)" };
const GLOW = { Common:"none", Uncommon:"0 0 8px #00c04033", Rare:"0 0 10px #3b82f655", "Very Rare":"0 0 12px #a855f766", Legendary:"0 0 16px #f59e0b88" };
const TICON = { Weapon:"⚔️", Armor:"🛡️", Item:"📦", Potion:"🧪", Ring:"💍", Wand:"🪄", Staff:"🔱", Scroll:"📜" };

const CATS = [
  { id:"alle",     label:"Alle" },
  { id:"waffe",    label:"⚔️ Waffen",       match: i => i.type === "Weapon" && i.sub !== "Magic" },
  { id:"ruestung", label:"🛡️ Rüstung",      match: i => i.type === "Armor"  && i.sub !== "Magic" },
  { id:"gear",     label:"🎒 Ausrüstung",   match: i => i.type === "Item"   && ["Gear","Focus","Ammo","Tool"].includes(i.sub) },
  { id:"trank",    label:"🧪 Tränke",        match: i => i.sub === "Potion" },
  { id:"magie",    label:"✨ Magie",          match: i => i.sub === "Magic" },
  { id:"schriftrolle", label:"📜 Schriftrollen", match: i => i.sub === "Scroll" },
  { id:"werkzeug", label:"🔧 Werkzeuge",     match: i => i.sub === "Tool" },
];
const RARS = ["Alle", "Common", "Uncommon", "Rare", "Very Rare", "Legendary"];

const BLANK_FORM = { name:"", type:"Weapon", sub:"Simple Melee", dmg:"", ac:"", eff:"", wt:"", rar:"Common", notes:"" };

export default function Katalog({ char, setChar }) {
  const inv    = char?.inventory || [];
  const setInv = fn => setChar && setChar(p => ({ ...p, inventory: typeof fn === "function" ? fn(p.inventory || []) : fn }));

  const [custom, setCustom] = usePersist("katalog_custom_v1", []);
  const [cat,    setCat]    = useState("alle");
  const [rar,    setRar]    = useState("Alle");
  const [q,      setQ]      = useState("");
  const [form,   setForm]   = useState(BLANK_FORM);
  const [showForm, setShowForm] = useState(false);
  const [modal,  setModal]  = useState(null);
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
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Suchen…"
          style={{ ...sx.inp, flex:"1 1 160px", minWidth:120 }} />
        <select value={rar} onChange={e => setRar(e.target.value)} style={{ ...sx.sel, width:"auto" }}>
          {RARS.map(r => <option key={r}>{r}</option>)}
        </select>
        <button onClick={() => { setForm(BLANK_FORM); setEditId(null); setShowForm(p => !p); }}
          style={sx.btn(showForm ? C.textDim : C.green)}>
          {showForm ? "✕ Abbrechen" : "+ Eigenes Item"}
        </button>
      </div>

      {/* ── Category pills ── */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            style={{ ...sx.bsm(cat === c.id ? C.purple : C.textDim), fontWeight: cat === c.id ? 700 : 400, fontSize:11 }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Custom item form ── */}
      {showForm && (
        <div style={{ ...sx.card, marginBottom:12 }}>
          <div style={sx.ct}>{editId != null ? "✏️ Item bearbeiten" : "✏️ Eigenes Item erstellen"}</div>
          <div style={sx.g3}>
            <div style={{ gridColumn:"1/3" }}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} style={sx.inp} /></div>
            <div><label style={sx.lbl}>Typ</label>
              <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))} style={sx.sel}>
                {["Weapon","Armor","Item"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>Subtyp</label><input value={form.sub} onChange={e => setForm(p=>({...p,sub:e.target.value}))} style={sx.inp} placeholder="Simple Melee, Potion…" /></div>
            <div><label style={sx.lbl}>Seltenheit</label>
              <select value={form.rar} onChange={e => setForm(p=>({...p,rar:e.target.value}))} style={sx.sel}>
                {["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label style={sx.lbl}>Schaden</label><input value={form.dmg} onChange={e => setForm(p=>({...p,dmg:e.target.value}))} style={sx.inp} placeholder="1d8 S" /></div>
            <div><label style={sx.lbl}>AC</label><input value={form.ac} onChange={e => setForm(p=>({...p,ac:e.target.value}))} style={sx.inp} placeholder="AC 16" /></div>
            <div><label style={sx.lbl}>Effekt</label><input value={form.eff} onChange={e => setForm(p=>({...p,eff:e.target.value}))} style={sx.inp} placeholder="2d4+2 HP" /></div>
            <div><label style={sx.lbl}>Gewicht</label><input value={form.wt} onChange={e => setForm(p=>({...p,wt:e.target.value}))} style={sx.inp} placeholder="3 lb" /></div>
          </div>
          <div style={{marginTop:8}}><label style={sx.lbl}>Beschreibung / Notizen</label>
            <textarea value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:52}} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={saveCustom} style={sx.btn(C.green)}>Speichern</button>
            <button onClick={() => {setShowForm(false);setEditId(null);setForm(BLANK_FORM);}} style={sx.btn(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* ── Item count ── */}
      <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{shown.length} Items</div>

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
            }}>
            {/* Griff */}
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>

            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
              <span style={{fontSize:44}}>{TICON[modal.type]||"📦"}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:FH,fontSize:20,color:RC[modal.rar]||C.gold,fontWeight:700,lineHeight:1.2}}>{modal.name}</div>
                <div style={{fontSize:12,color:C.textDim,marginTop:4}}>
                  {modal.sub||modal.type} · <span style={{color:RC[modal.rar]||C.textDim}}>{modal.rar}</span>
                  {modal.custom && <span style={{...sx.tag(C.purple),marginLeft:8,fontSize:9}}>Eigenes Item</span>}
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
                {modal.notes}
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
                  ✨ ALS MAGISCHE VARIANTE HINZUFÜGEN
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {MAGIC_MODIFIERS.map(mod => {
                    const previewName = mod.plus === 0 ? modal.name : `${modal.name} +${mod.plus}`;
                    const cnt = countInInv(previewName);
                    return (
                      <button
                        key={mod.plus}
                        onClick={() => { addToInv(modal, mod.plus); setModal(null); }}
                        title={mod.plus === 0 ? "Standard ohne Magie" : `+${mod.plus} auf Angriff & Schaden (Waffe) bzw. +${mod.plus} AC (Rüstung). Rarität: ${mod.rar}`}
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
                    {cnt > 0 ? `📦 Nochmal hinzufügen (${cnt}×)` : "📦 Zu Inventar"}
                  </button>
                );
              })()}
              {modal.custom && (
                <>
                  <button onClick={() => { setForm({name:modal.name,type:modal.type,sub:modal.sub||"",dmg:modal.dmg||"",ac:modal.ac||"",eff:modal.eff||"",wt:modal.wt||"",rar:modal.rar,notes:modal.notes||""}); setEditId(modal._cid); setShowForm(true); setModal(null); }}
                    style={{...sx.bsm(C.gold),padding:"8px 14px"}}>✎ Bearbeiten</button>
                  <button onClick={() => deleteCustom(modal._cid)} style={{...sx.bsm(C.red),padding:"8px 14px"}}>🗑 Löschen</button>
                </>
              )}
              <button onClick={() => setModal(null)} style={{...sx.bsm(C.textDim),padding:"8px 14px"}}>Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
