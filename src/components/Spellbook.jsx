import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { SPELLS } from "../data/spells.js";

export default function Spellbook({ charId }) {
  const [known, setKnown] = usePersist(`spells_known_${charId||"g"}`, []);
  const [prepared, setPrepared] = usePersist(`spells_prep_${charId||"g"}`, []);
  const [search, setSearch] = useState("");
  const [lf, setLf] = useState("All");
  const [cf, setCf] = useState("All");
  const [sel, setSel] = useState(null);
  const [view, setView] = useState("db");
  const CLASSES = ["All","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"];
  const LVS = ["All","0","1","2","3","4","5","6","7","8","9"];
  const SPC = ["#808080","#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  const DT = {fire:"🔥",cold:"❄️",lightning:"⚡",acid:"💚",thunder:"💨",radiant:"✨",necrotic:"💀",poison:"☠️",psychic:"🔮",force:"⚪",healing:"💛",death:"💀"};
  const SLOT_LABELS = ["","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
  const base = view==="known" ? SPELLS.filter(s=>known.includes(s.id)) : view==="prepared" ? SPELLS.filter(s=>prepared.includes(s.id)) : SPELLS;
  const shown = base.filter(s => {
    const lm = lf==="All"||s.lv===parseInt(lf);
    const cm = cf==="All"||s.cls.includes(cf);
    const sm = !search||s.name.toLowerCase().includes(search.toLowerCase())||s.school.toLowerCase().includes(search.toLowerCase());
    return lm&&cm&&sm;
  });
  const grps = {}; shown.forEach(s => { (grps[s.lv]=grps[s.lv]||[]).push(s); });
  const togKnown = id => setKnown(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const togPrep = id => { if(!known.includes(id)){setKnown(p=>[...p,id]);} setPrepared(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); };
  const ll = l => l===0?"Cantrip":`Level ${l}`;
  return (
    <div style={{display:"flex",gap:12}}>
      <div style={{width:255,flexShrink:0}}>
        <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
          <button onClick={() => setView("db")} style={sx.nb(view==="db")}>📚 Alle</button>
          <button onClick={() => setView("known")} style={{...sx.nb(view==="known"),display:"flex",alignItems:"center",gap:4}}>⭐ Bekannt <span style={{background:C.blue,borderRadius:"50%",minWidth:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,padding:"0 2px"}}>{known.length}</span></button>
          <button onClick={() => setView("prepared")} style={{...sx.nb(view==="prepared"),display:"flex",alignItems:"center",gap:4}}>🕯️ Vorbereitet <span style={{background:C.gold,color:C.bg,borderRadius:"50%",minWidth:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,padding:"0 2px",fontWeight:700}}>{prepared.length}</span></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Zauber suchen…" style={{...sx.inp,marginBottom:6}}/>
        <select value={cf} onChange={e => setCf(e.target.value)} style={{...sx.sel,marginBottom:6}}>{CLASSES.map(c => <option key={c}>{c}</option>)}</select>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
          {LVS.map(l => <button key={l} onClick={() => setLf(l)} style={{background:lf===l?SPC[parseInt(l)]||C.gold+"44":"transparent",border:`1px solid ${lf===l?SPC[parseInt(l)]||C.gold:C.border}`,borderRadius:3,color:lf===l?C.textBright:C.textDim,fontSize:10,padding:"3px 7px",cursor:"pointer",fontFamily:FH}}>{l==="All"?"All":l==="0"?"C":l}</button>)}
        </div>
        <div style={{maxHeight:"55vh",overflowY:"auto"}}>
          {Object.keys(grps).sort((a,b)=>+a-+b).map(lv => (
            <div key={lv}>
              <div style={{fontSize:11,color:SPC[+lv]||C.textDim,fontFamily:FH,fontWeight:700,padding:"4px 0 2px",borderBottom:`1px solid ${C.border}`,marginBottom:3}}>{ll(+lv)}</div>
              {grps[lv].map(sp => (
                <div key={sp.id} onClick={() => setSel(sp)} style={{background:sel?.id===sp.id?C.purple+"33":C.surface,border:`1px solid ${sel?.id===sp.id?C.purpleBright:C.border}`,borderRadius:4,padding:"5px 10px",cursor:"pointer",marginBottom:2,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:12,color:C.textBright,fontFamily:FH}}>{sp.name}</div><div style={{fontSize:10,color:C.textDim}}>{sp.school}</div></div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={e=>{e.stopPropagation();togPrep(sp.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:prepared.includes(sp.id)?C.gold:"#444"}}>🕯️</button>
                    <button onClick={e=>{e.stopPropagation();togKnown(sp.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:known.includes(sp.id)?C.blueBright:"#444"}}>★</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {shown.length===0&&<div style={{color:C.textDim,fontStyle:"italic",fontSize:13,padding:8}}>Keine Zauber.</div>}
        </div>
      </div>
      <div style={{flex:1}}>
        {sel ? (
          <div style={sx.card}>
            <div style={{...sx.jb,marginBottom:10}}>
              <div><div style={{fontFamily:FH,fontSize:20,color:C.purpleBright,fontWeight:700}}>{sel.name}</div><div style={{color:C.textDim,fontSize:13}}>{sel.lv===0?"Cantrip":ll(sel.lv)} · {sel.school}</div></div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={() => togPrep(sel.id)} style={sx.btn(prepared.includes(sel.id)?C.goldDim:C.purple)}>{prepared.includes(sel.id)?"🕯️ Vorbereitet":"🕯️ Vorbereiten"}</button>
                <button onClick={() => togKnown(sel.id)} style={sx.btn(known.includes(sel.id)?C.blue:C.textDim)}>{known.includes(sel.id)?"★ Bekannt":"☆ Merken"}</button>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {[["⏱",sel.ct],["📏",sel.range],["⏳",sel.dur],["🔤",sel.comp]].map(([ic,v]) => <span key={ic} style={sx.tag(C.blue)}>{ic} {v}</span>)}
            </div>
            {sel.dmg!=="—"&&<div style={{display:"flex",gap:8,marginBottom:10}}><span style={sx.tag(C.red)}>💥 {sel.dmg}</span><span style={sx.tag(C.red)}>{DT[sel.dt]||"⚡"} {sel.dt}</span></div>}
            <div style={{fontSize:15,color:C.text,lineHeight:1.7,marginBottom:12}}>{sel.desc}</div>
            {sel.upcast?.length > 0 && (
              <div style={{background:`${C.gold}0d`,border:`1px solid ${C.gold}30`,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                <div style={{fontSize:11,color:C.gold,fontFamily:FH,fontWeight:700,letterSpacing:.5,marginBottom:8}}>📈 AUF HÖHEREM LEVEL</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {/* Basiszeile */}
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,background:SPC[sel.lv]||C.purple,borderRadius:6,padding:"2px 8px",color:"#fff",fontWeight:700,fontFamily:FH,minWidth:36,textAlign:"center"}}>{sel.lv===0?"C":SLOT_LABELS[sel.lv]}</span>
                    <span style={{fontSize:12,color:C.textBright}}>{sel.dmg!=="—"?`💥 ${sel.dmg}`:""} <span style={{color:C.textDim,fontSize:11}}>(Basis)</span></span>
                  </div>
                  {sel.upcast.map((u,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,background:SPC[u.slot]||C.purple,borderRadius:6,padding:"2px 8px",color:"#fff",fontWeight:700,fontFamily:FH,minWidth:36,textAlign:"center"}}>{SLOT_LABELS[u.slot]}</span>
                      <span style={{fontSize:12,color:C.textBright}}>
                        {u.dmg && <span style={{color:C.redBright}}>💥 {u.dmg}</span>}
                        {u.note && <span style={{color:C.tealBright}}>✦ {u.note}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:8,fontSize:12,color:C.textDim}}>Klassen: {sel.cls.join(", ")}</div>
          </div>
        ) : (
          <div style={{...sx.card,textAlign:"center",color:C.textDim}}>
            <div style={{fontSize:40,marginBottom:8}}>🔮</div>
            <div>Zauber aus der Liste auswählen.</div>
            <div style={{marginTop:10,display:"flex",justifyContent:"center",gap:16,fontSize:13}}>
              <span>★ = Bekannt</span><span>🕯️ = Vorbereitet</span>
            </div>
            <div style={{marginTop:4,fontSize:12,color:C.gold}}>{known.length} bekannt · {prepared.length} vorbereitet</div>
          </div>
        )}
      </div>
    </div>
  );
}
