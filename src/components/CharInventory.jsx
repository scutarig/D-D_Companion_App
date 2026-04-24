import { useState } from "react";
import { C, sx, F, FH } from "../constants/theme.js";

// ── Rarity colours ────────────────────────────────────────────────────────────
const RC   = { Common: C.textDim, Uncommon: "#00c040", Rare: "#3b82f6", "Very Rare": "#a855f7", Legendary: "#f59e0b" };
const RCBG = { Common: "rgba(255,255,255,0.04)", Uncommon: "rgba(0,192,64,0.07)", Rare: "rgba(59,130,246,0.09)", "Very Rare": "rgba(168,85,247,0.09)", Legendary: "rgba(245,158,11,0.11)" };
const GLOW = { Common:"none", Uncommon:"0 0 8px #00c04033", Rare:"0 0 10px #3b82f655", "Very Rare":"0 0 12px #a855f766", Legendary:"0 0 16px #f59e0b88" };
const TICON = { Weapon:"⚔️", Armor:"🛡️", Gear:"🪖", Tool:"🔧", Item:"📦", Potion:"🧪", Ring:"💍", Wand:"🪄", Staff:"🔱", Scroll:"📜" };
const ITEM_TYPES = ["Weapon","Armor","Gear","Tool","Item","Potion","Ring","Wand","Staff","Scroll"];

// ── D&D 5e Slot-Definitionen ─────────────────────────────────────────────────
const SLOTS = [
  { id:"head",  label:"Kopf",      icon:"👑" },
  { id:"neck",  label:"Hals",      icon:"📿" },
  { id:"chest", label:"Brust",     icon:"🧥" },
  { id:"back",  label:"Rücken",    icon:"🎒" },
  { id:"hands", label:"Hände",     icon:"🧤" },
  { id:"ring1", label:"Ring L",    icon:"💍" },
  { id:"ring2", label:"Ring R",    icon:"💍" },
  { id:"main",  label:"Haupthand", icon:"⚔️" },
  { id:"off",   label:"Nebenhand", icon:"🛡️" },
  { id:"feet",  label:"Füße",      icon:"👢" },
];

// ── D&D 5e Slot-Kompatibilität ────────────────────────────────────────────────
/** Waffe hat die Eigenschaft "zweihändig" (nicht nur "vielseitig") */
const isTwoHanded = item => {
  if (!item) return false;
  const n = (item.notes || "").toLowerCase();
  // "vielseitig: 1d10 zweihändig" → einhändig/vielseitig, nicht echt zweihändig
  return n.includes("zweihändig") && !n.includes("vielseitig");
};

/** Gibt zurück, in welche Slots ein Item ausgerüstet werden kann */
const getCompatibleSlots = item => {
  if (!item) return [];
  const t    = item.type  || "";
  const sub  = (item.sub  || "").toLowerCase();
  const name = (item.name || "").toLowerCase();

  // ── Waffen ──
  if (t === "Weapon") {
    // Echte Zweihänder nur Haupthand
    return isTwoHanded(item) ? ["main"] : ["main", "off"];
  }

  // ── Rüstung & Schild ──
  if (t === "Armor") {
    if (sub === "shield") return ["off"];          // Schild → Nebenhand
    return ["chest"];                              // Alle Rüstungen → Brust
  }

  // ── Ringe ──
  if (t === "Ring") return ["ring1", "ring2"];

  // ── Zauberstab / Rute ──
  if (t === "Wand") return ["main", "off"];

  // ── Stab (Kampfstab/Magierstab — oft zweihändig) ──
  if (t === "Staff") return ["main"];

  // ── Schriftrolle (in der Hand gehalten) ──
  if (t === "Scroll") return ["main", "off"];

  // ── Allgemeine Items & Magie-Items (Namens-Erkennung) ──
  if (t === "Item" || t === "Gear") {
    // Verbrauchsitems / Ausrüstung im Rucksack → nicht ausrüstbar
    if (["potion", "ammo", "tool", "gear", "focus"].includes(sub)) return [];
    // Scrolls als sub
    if (sub === "scroll") return ["main", "off"];

    // Name-basierte Erkennung für getragene Gegenstände:
    if (/ring|siegelring|fingerring/.test(name))              return ["ring1", "ring2"];
    if (/amulett|halsband|kette|anhänger|medaillon/.test(name)) return ["neck"];
    if (/handschuh|gauntlet|armschiene/.test(name))           return ["hands"];
    if (/stiefel|schuhe?|sandalen/.test(name))                return ["feet"];
    if (/umhang|tarnumhang|mantel|cape|cloak/.test(name))     return ["back", "neck"];
    if (/stirnband|krone|diadem|helm|haube|tiara/.test(name)) return ["head"];
    if (/beutel|tasche|rucksack/.test(name))                  return ["back"];
    if (/gürtel/.test(name))                                  return ["back"];
    if (/armband|bracelet/.test(name))                        return ["hands"];

    // Generische Magie-Items ohne klare Namens-Zuordnung
    if (sub === "magic") {
      // Waffe-ähnliche Magie-Items (haben Schaden) → Hände
      if (item.dmg && item.dmg !== "—" && item.dmg !== "") return ["main", "off"];
      // Rüstungs-ähnliche Magie-Items (haben AC) → Brust
      if (item.ac  && item.ac  !== "—" && item.ac  !== "") return ["chest"];
      // Sonstiges → alle tragbaren Slots
      return ["head", "neck", "chest", "back", "hands", "ring1", "ring2", "feet"];
    }
  }

  return [];
};

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
const panelBg  = { background:"linear-gradient(160deg,#0d0b16 0%,#17132a 100%)", border:"1px solid #241e3a", borderRadius:14, padding:12 };
const secTitle = { fontSize:9, color:"#4a3f6a", fontFamily:FH, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10, textAlign:"center" };

function keyInfo(item) {
  if (!item) return "";
  const parts = [];
  if (item.ac  && item.ac  !== "—") parts.push(`🛡️ ${item.ac}`);
  if (item.dmg && item.dmg !== "—") parts.push(`⚔️ ${item.dmg}`);
  if (item.eff && item.eff !== "—") parts.push(`✨ ${item.eff.length > 14 ? item.eff.slice(0,12)+"…" : item.eff}`);
  if (item.wt  && item.wt  !== "—" && parts.length < 2) parts.push(`${item.wt}`);
  return parts.slice(0, 2).join(" · ");
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function CharInventory({ char, setChar }) {
  const inv    = char.inventory || [];
  const eq     = char.equipSlots || {};
  const setInv = fn => setChar(p => ({ ...p, inventory:  typeof fn === "function" ? fn(p.inventory  || []) : fn }));
  const setEq  = fn => setChar(p => ({ ...p, equipSlots: typeof fn === "function" ? fn(p.equipSlots || {}) : fn }));

  const [selForEquip, setSelForEquip] = useState(null);
  const [expanded,    setExpanded]    = useState(null);
  const [search,      setSearch]      = useState("");
  const [typeFilter,  setTypeFilter]  = useState("All");
  const [showAdd,     setShowAdd]     = useState(false);
  const [form,        setForm]        = useState({ name:"", type:"Item", sub:"", dmg:"", ac:"", eff:"", wt:"", rar:"Common", notes:"" });
  const [slotModal,   setSlotModal]   = useState(null);
  const [slotError,   setSlotError]   = useState(null); // Fehlermeldung bei ungültigem Slot

  const bagItems = inv.filter(i => !Object.values(eq).some(s => s?.uid === i.uid));
  const filtered = bagItems.filter(i =>
    (typeFilter === "All" || i.type === typeFilter) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Zweihänder in der Haupthand?
  const mainIsTwoHanded = isTwoHanded(eq.main);

  const compatSlots = selForEquip ? getCompatibleSlots(selForEquip) : [];

  const addCustom = () => {
    if (!form.name) return;
    setInv(p => [...p, { ...form, uid: Date.now() + Math.random(), qty: 1, custom: true }]);
    setForm({ name:"", type:"Item", sub:"", dmg:"", ac:"", eff:"", wt:"", rar:"Common", notes:"" });
    setShowAdd(false);
  };

  const removeItem = uid => {
    setInv(p => p.filter(i => i.uid !== uid));
    setEq(p => { const n={...p}; Object.keys(n).forEach(k=>{if(n[k]?.uid===uid)n[k]=null;}); return n; });
    setExpanded(null); setSlotModal(null);
  };

  const equipTo = slotId => {
    if (!selForEquip) return;

    // Kompatibilität prüfen
    if (!compatSlots.includes(slotId)) {
      const reason = mainIsTwoHanded && slotId === "off"
        ? "Nebenhand gesperrt — Haupthand führt eine Zweihandwaffe."
        : `Dieses Item passt nicht in den Slot „${SLOTS.find(s=>s.id===slotId)?.label}".`;
      setSlotError(reason);
      setTimeout(() => setSlotError(null), 2500);
      return;
    }

    // Zweihänder → Nebenhand leeren
    if (isTwoHanded(selForEquip) && slotId === "main") {
      setEq(p => ({ ...p, main: selForEquip, off: null }));
    } else {
      setEq(p => ({ ...p, [slotId]: selForEquip }));
    }
    setSelForEquip(null);
  };

  const unequip    = slotId => { setEq(p => ({ ...p, [slotId]: null })); setSlotModal(null); };
  const changeQty  = (uid, delta) => setInv(p => p.map(i => i.uid === uid ? { ...i, qty: Math.max(1, (i.qty||1) + delta) } : i));
  const toggleExpand = uid => setExpanded(p => p === uid ? null : uid);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Equip-mode Banner ── */}
      {selForEquip && (
        <div style={{ ...sx.card, marginBottom:12, background:`${RC[selForEquip.rar]||C.purple}18`, border:`1px solid ${RC[selForEquip.rar]||C.purple}44` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{fontSize:20}}>{TICON[selForEquip.type]||"📦"}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:FH,fontSize:12,color:RC[selForEquip.rar]||C.gold,fontWeight:700}}>{selForEquip.name}</div>
              <div style={{fontSize:11,color:C.textDim}}>
                {compatSlots.length > 0
                  ? `Gültige Slots: ${compatSlots.map(id => SLOTS.find(s=>s.id===id)?.label).join(", ")}`
                  : "Dieses Item kann nicht ausgerüstet werden."}
              </div>
            </div>
            <button onClick={() => setSelForEquip(null)} style={sx.bsm(C.textDim)}>✕</button>
          </div>
          {slotError && (
            <div style={{marginTop:8,padding:"6px 10px",background:`${C.red}18`,border:`1px solid ${C.red}44`,borderRadius:8,fontSize:12,color:C.redBright}}>
              ⚠️ {slotError}
            </div>
          )}
        </div>
      )}

      {/* ── Equipment Slots — 5×2 Grid ── */}
      <div style={{ ...panelBg, marginBottom:12 }}>
        <div style={secTitle}>Ausrüstung</div>

        {/* Zweihänder-Hinweis */}
        {mainIsTwoHanded && (
          <div style={{fontSize:10,color:C.amberBright,background:`${C.amber}12`,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"4px 8px",marginBottom:8,textAlign:"center"}}>
            🔒 Zweihänder in der Haupthand — Nebenhand gesperrt
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
          {SLOTS.map(slot => {
            const item    = eq[slot.id];
            const col     = item ? RC[item.rar] || C.textDim : "#2a2440";

            // Slot-Status im Equip-Modus bestimmen
            const isOffLockedByTwoHand = slot.id === "off" && mainIsTwoHanded && !item;
            const isValidTarget  = selForEquip && compatSlots.includes(slot.id) && !isOffLockedByTwoHand;
            const isInvalidTarget= selForEquip && !compatSlots.includes(slot.id) || (selForEquip && isOffLockedByTwoHand);

            const info = keyInfo(item);

            return (
              <div key={slot.id}
                onClick={() => {
                  if (selForEquip)         equipTo(slot.id);
                  else if (item)           setSlotModal({ ...item, _slotId: slot.id });
                }}
                title={item ? `${item.name}${info ? " · " + info : ""}` : slot.label}
                style={{
                  background: isOffLockedByTwoHand
                    ? "rgba(133,0,0,0.15)"
                    : isValidTarget
                      ? "rgba(0,200,80,0.10)"
                      : item ? RCBG[item.rar] : "rgba(0,0,0,0.4)",
                  border: `2px solid ${
                    isOffLockedByTwoHand ? "#85000066"
                    : isValidTarget      ? "#00c84088"
                    : isInvalidTarget    ? "#ffffff11"
                    : item               ? col
                    : "#2a2440"
                  }`,
                  borderRadius:10, padding:"6px 3px",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor: (item && !selForEquip) || isValidTarget ? "pointer" : isInvalidTarget ? "not-allowed" : "default",
                  boxShadow: item && !isInvalidTarget ? GLOW[item.rar] : isValidTarget ? "0 0 8px #00c84022" : "inset 0 2px 8px rgba(0,0,0,0.5)",
                  transition:"all .15s", position:"relative", minHeight:72, gap:2,
                  opacity: isInvalidTarget ? 0.35 : 1,
                }}>

                {/* Gesperrtes Feld */}
                {isOffLockedByTwoHand ? (
                  <>
                    <span style={{fontSize:16}}>🔒</span>
                    <span style={{fontSize:7,color:"#85000099",fontFamily:F,textTransform:"uppercase",letterSpacing:0.3,textAlign:"center"}}>Gesperrt</span>
                  </>
                ) : (
                  <>
                    <span style={{fontSize: item ? 20 : 16, lineHeight:1, opacity: isInvalidTarget ? 0.4 : 1}}>
                      {isValidTarget && !item ? "✚" : item ? TICON[item.type]||"📦" : slot.icon}
                    </span>
                    <span style={{
                      fontSize:7, color: isValidTarget && !item ? "#00c840" : item ? col : "#3a3050",
                      fontFamily:F, textTransform:"uppercase", letterSpacing:0.3,
                      textAlign:"center", width:"100%", overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap", padding:"0 2px", lineHeight:1.3,
                    }}>
                      {item ? item.name : slot.label}
                    </span>
                    {item && info && (
                      <span style={{
                        fontSize:6.5, color: col, opacity:0.85,
                        textAlign:"center", width:"100%", padding:"0 2px",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", lineHeight:1.2,
                      }}>
                        {info}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legende */}
        {selForEquip && compatSlots.length > 0 && (
          <div style={{marginTop:8,fontSize:10,color:C.textDim,textAlign:"center"}}>
            <span style={{color:"#00c840"}}>✚ Gültiger Slot</span>
            <span style={{margin:"0 8px"}}>·</span>
            <span style={{opacity:0.5}}>Ausgegraut = inkompatibel</span>
          </div>
        )}
      </div>

      {/* ── Rucksack ── */}
      <div style={{ ...panelBg, marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{...secTitle, marginBottom:0, textAlign:"left"}}>
            Rucksack <span style={{color:C.purple}}>({bagItems.length})</span>
          </span>
          <button onClick={() => setShowAdd(p=>!p)} style={{...sx.bsm(C.green),fontSize:11}}>+ Item</button>
        </div>

        <div style={{display:"flex", gap:6, marginBottom:8}}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Suchen…"
            style={{...sx.inp, fontSize:13, flex:1, padding:"7px 10px"}} />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{...sx.sel, fontSize:11, padding:"7px 6px", width:88}}>
            <option value="All">Alle</option>
            {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:"center",color:C.textDim,padding:24,fontSize:12}}>
            <div style={{fontSize:28,marginBottom:6}}>🎒</div>
            Rucksack leer — füge Items im <strong style={{color:C.blue}}>Katalog</strong> hinzu.
          </div>
        )}

        <div style={{display:"flex", flexDirection:"column", gap:4}}>
          {filtered.map(item => {
            const col   = RC[item.rar] || C.textDim;
            const open  = expanded === item.uid;
            const isSel = selForEquip?.uid === item.uid;
            const info  = keyInfo(item);
            const canEquip = getCompatibleSlots(item).length > 0;

            return (
              <div key={item.uid}>
                {/* Item-Zeile */}
                <div onClick={() => toggleExpand(item.uid)}
                  style={{
                    background: isSel ? RCBG[item.rar] : open ? `${col}12` : "rgba(0,0,0,0.25)",
                    borderTop:`1px solid ${open || isSel ? col : col+"33"}`,
                    borderRight:`1px solid ${open || isSel ? col : col+"33"}`,
                    borderBottom:`1px solid ${open || isSel ? col : col+"33"}`,
                    borderLeft:`3px solid ${col}`,
                    borderRadius: open ? "8px 8px 0 0" : 8,
                    padding:"10px 12px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:10, transition:"all .15s",
                    boxShadow: isSel ? GLOW[item.rar] : "none",
                  }}>
                  <span style={{fontSize:20,flexShrink:0}}>{TICON[item.type]||"📦"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:FH,fontSize:13,color:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {item.name}
                      {isTwoHanded(item) && <span style={{fontSize:9,color:C.amberBright,marginLeft:6,fontFamily:F}}>2H</span>}
                    </div>
                    <div style={{fontSize:10,color:C.textDim,display:"flex",gap:6,flexWrap:"wrap",marginTop:2}}>
                      <span style={{color:col}}>{item.rar}</span>
                      {info && <span>{info}</span>}
                    </div>
                  </div>
                  {/* Menge — stopPropagation damit kein Toggle */}
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}
                    onClick={e => e.stopPropagation()}>
                    <button onClick={() => changeQty(item.uid,-1)}
                      style={{width:24,height:24,borderRadius:6,background:"rgba(0,0,0,0.4)",border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>−</button>
                    <span style={{fontSize:13,fontWeight:700,color:C.textBright,minWidth:20,textAlign:"center"}}>{item.qty||1}</span>
                    <button onClick={() => changeQty(item.uid,+1)}
                      style={{width:24,height:24,borderRadius:6,background:"rgba(0,0,0,0.4)",border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>+</button>
                  </div>
                  <span style={{fontSize:12,color:C.textDim,flexShrink:0}}>{open?"▲":"▼"}</span>
                </div>

                {/* Ausgeklappte Detail-Box */}
                {open && (
                  <div style={{
                    background:`${col}08`, border:`1px solid ${col}33`,
                    borderTop:"none", borderRadius:"0 0 8px 8px",
                    padding:"10px 12px", display:"flex", flexDirection:"column", gap:8,
                  }}>
                    {(item.dmg || item.ac || item.eff || item.wt) && (
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {item.dmg && item.dmg!=="—" && <span style={sx.tag(C.red)}>⚔️ {item.dmg}</span>}
                        {item.ac  && <span style={sx.tag(C.blue)}>🛡️ {item.ac}</span>}
                        {item.eff && item.eff!=="—" && <span style={sx.tag(C.green)}>✨ {item.eff}</span>}
                        {item.wt  && item.wt!=="—"  && <span style={sx.tag(C.textDim)}>⚖️ {item.wt}</span>}
                        {isTwoHanded(item) && <span style={sx.tag(C.amber)}>Zweihändig</span>}
                      </div>
                    )}
                    {item.notes && item.notes!=="—" && (
                      <div style={{fontSize:12,color:C.text,lineHeight:1.6,padding:"8px 10px",background:"rgba(0,0,0,0.3)",borderRadius:6}}>
                        {item.notes}
                      </div>
                    )}
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {canEquip && (
                        <button onClick={() => { setSelForEquip(item); setExpanded(null); }}
                          style={{...sx.btn(C.purple),fontSize:12,padding:"7px 14px"}}>⚔️ Ausstatten</button>
                      )}
                      <button onClick={() => removeItem(item.uid)}
                        style={{...sx.bsm(C.red),fontSize:12,padding:"7px 12px"}}>🗑 Entfernen</button>
                    </div>
                    {!canEquip && (
                      <div style={{fontSize:10,color:C.textDim,fontStyle:"italic"}}>
                        📦 Wird im Rucksack getragen (kein Ausrüstungsslot)
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Custom Item Form ── */}
      {showAdd && (
        <div style={{...sx.card, marginBottom:14}}>
          <div style={sx.ct}>✏️ Eigenes Item</div>
          <div style={sx.g3}>
            <div><label style={sx.lbl}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={sx.inp} /></div>
            <div><label style={sx.lbl}>Typ</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={sx.sel}>{ITEM_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={sx.lbl}>Seltenheit</label><select value={form.rar} onChange={e=>setForm(p=>({...p,rar:e.target.value}))} style={sx.sel}>{["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}</select></div>
            <div><label style={sx.lbl}>Schaden</label><input value={form.dmg} onChange={e=>setForm(p=>({...p,dmg:e.target.value}))} style={sx.inp} placeholder="1d8 S" /></div>
            <div><label style={sx.lbl}>AC</label><input value={form.ac} onChange={e=>setForm(p=>({...p,ac:e.target.value}))} style={sx.inp} placeholder="AC 16" /></div>
            <div><label style={sx.lbl}>Gewicht</label><input value={form.wt} onChange={e=>setForm(p=>({...p,wt:e.target.value}))} style={sx.inp} placeholder="3 lb" /></div>
          </div>
          <div style={{marginTop:8}}><label style={sx.lbl}>Notizen (Eigenschaften wie "zweihändig", "leicht"…)</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:50}} /></div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={addCustom} style={sx.btn(C.green)}>Hinzufügen</button>
            <button onClick={() => setShowAdd(false)} style={sx.bsm(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* ── Ausgerüstetes Item — Bottom Sheet ── */}
      {slotModal && (
        <div onClick={() => setSlotModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()}
            style={{
              width:"100%", maxWidth:560,
              background: C.surface,
              borderTop:`2px solid ${RC[slotModal.rar]||C.border}`,
              borderRadius:"18px 18px 0 0",
              padding:"20px 18px 36px",
              boxShadow:`0 -8px 40px rgba(0,0,0,0.7), ${GLOW[slotModal.rar]}`,
            }}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
              <span style={{fontSize:44}}>{TICON[slotModal.type]||"📦"}</span>
              <div>
                <div style={{fontFamily:FH,fontSize:20,color:RC[slotModal.rar]||C.gold,fontWeight:700,lineHeight:1.2}}>{slotModal.name}</div>
                <div style={{fontSize:12,color:C.textDim,marginTop:4}}>
                  {slotModal.sub||slotModal.type} · <span style={{color:RC[slotModal.rar]||C.textDim}}>{slotModal.rar}</span>
                  <span style={{...sx.tag(C.purple),marginLeft:8,fontSize:9}}>Ausgerüstet</span>
                  {isTwoHanded(slotModal) && <span style={{...sx.tag(C.amber),marginLeft:6,fontSize:9}}>Zweihändig</span>}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {slotModal.dmg && slotModal.dmg!=="—" && <span style={sx.tag(C.red)}>⚔️ {slotModal.dmg}</span>}
              {slotModal.ac  && <span style={sx.tag(C.blue)}>🛡️ {slotModal.ac}</span>}
              {slotModal.eff && <span style={sx.tag(C.green)}>✨ {slotModal.eff}</span>}
              {slotModal.wt  && slotModal.wt!=="—" && <span style={sx.tag(C.textDim)}>⚖️ {slotModal.wt}</span>}
            </div>
            {slotModal.notes && slotModal.notes!=="—" && (
              <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:16,padding:"10px 12px",background:"rgba(0,0,0,0.3)",borderRadius:8}}>
                {slotModal.notes}
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <button onClick={() => unequip(slotModal._slotId)} style={{...sx.btn(C.red),padding:"10px 20px",fontSize:13}}>↩ Ablegen</button>
              <button onClick={() => setSlotModal(null)} style={{...sx.bsm(C.textDim),padding:"10px 16px"}}>Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
