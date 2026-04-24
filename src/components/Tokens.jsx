import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";

export default function Tokens() {
  const [slots, setSlots] = usePersist("tokens_slots_v4", [{lv:1,lbl:"1st",tot:4,used:0},{lv:2,lbl:"2nd",tot:3,used:0},{lv:3,lbl:"3rd",tot:3,used:0},{lv:4,lbl:"4th",tot:3,used:0},{lv:5,lbl:"5th",tot:2,used:0}]);
  const [custom, setCustom] = usePersist("tokens_custom_v4", [{id:1,name:"Bardic Inspiration",tot:4,used:0,color:C.blueBright,tier:"d6"},{id:2,name:"Rage",tot:2,used:0,color:C.redBright,tier:""},{id:3,name:"Wild Shape",tot:2,used:0,color:C.greenBright,tier:""}]);
  const [nT, setNT] = useState({name:"",tot:3,color:C.purple,tier:""});
  const SC = ["#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  return (
    <div>
      <div style={sx.card}>
        <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>🔮 Spell Slots</div><button onClick={() => setSlots(p => p.map(s => ({...s,used:0})))} style={sx.bsm(C.gold)}>↺ Langer Rast</button></div>
        {slots.map((sl, si) => (
          <div key={sl.lv} style={{marginBottom:14}}>
            <div style={{...sx.jb,marginBottom:4}}>
              <span style={{fontFamily:FH,fontSize:13,color:C.textBright}}>{sl.lbl} Level</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:12,color:C.textDim}}>{sl.tot-sl.used}/{sl.tot}</span>
                <input type="number" min={0} max={20} value={sl.tot} onChange={e => setSlots(p => p.map(x => x.lv===sl.lv?{...x,tot:Math.max(0,+e.target.value)}:x))} style={{...sx.inp,width:55,padding:"2px 6px",fontSize:12}}/>
                <button onClick={() => setSlots(p => p.map(x => x.lv===sl.lv?{...x,used:0}:x))} style={sx.bsm(C.goldDim)}>↺</button>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Array.from({length:sl.tot}).map((_,i) => (
                <div key={i} onClick={() => setSlots(p => p.map(x => x.lv===sl.lv?{...x,used:i<x.used?i:i+1}:x))} style={{width:28,height:28,borderRadius:"50%",cursor:"pointer",background:i<sl.used?"#1a1a1a":SC[si]+"cc",border:`2px solid ${i<sl.used?C.border:SC[si]}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:i<sl.used?C.border:"white"}}>{i<sl.used?"×":"◆"}</div>
              ))}
            </div>
          </div>
        ))}
        {slots.length < 9 && <button onClick={() => setSlots(p => [...p,{lv:p.length+1,lbl:["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"][p.length],tot:1,used:0}])} style={sx.bsm(C.blue)}>+ Level {slots.length+1}</button>}
      </div>
      <div style={sx.card}>
        <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>🏷️ Eigene Ressourcen</div><button onClick={() => setCustom(p => p.map(t => ({...t,used:0})))} style={sx.bsm(C.gold)}>↺ Alle zurücksetzen</button></div>
        {custom.map(t => (
          <div key={t.id} style={{background:C.surface,borderRadius:6,padding:"10px 12px",marginBottom:10,border:`1px solid ${t.color}44`}}>
            <div style={{...sx.jb,marginBottom:6}}>
              <span style={{fontFamily:FH,fontSize:13,color:t.color,fontWeight:700}}>{t.name}{t.tier&&<span style={{color:C.textDim,fontWeight:400}}> ({t.tier})</span>}</span>
              <div style={{display:"flex",gap:6}}>
                <span style={{fontSize:12,color:C.textDim}}>{t.tot-t.used}/{t.tot}</span>
                <button onClick={() => setCustom(p => p.map(x => x.id===t.id?{...x,used:0}:x))} style={sx.bsm(C.goldDim)}>↺</button>
                <button onClick={() => setCustom(p => p.filter(x => x.id!==t.id))} style={sx.bsm(C.red)}>✕</button>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Array.from({length:t.tot}).map((_,i) => (
                <div key={i} onClick={() => setCustom(p => p.map(x => x.id===t.id?{...x,used:i<x.used?i:i+1}:x))} style={{width:32,height:32,borderRadius:4,cursor:"pointer",background:i<t.used?"#1a1a1a":t.color+"99",border:`2px solid ${i<t.used?C.border:t.color}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{i<t.used?"✗":"●"}</div>
              ))}
            </div>
          </div>
        ))}
        <div style={{background:"#0f0f1e",borderRadius:6,padding:12,border:`1px dashed ${C.border}`}}>
          <div style={{...sx.ct,marginBottom:8}}>+ Neue Ressource</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div><label style={sx.lbl}>Name</label><input value={nT.name} onChange={e => setNT(p => ({...p,name:e.target.value}))} style={{...sx.inp,width:130}}/></div>
            <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} max={20} value={nT.tot} onChange={e => setNT(p => ({...p,tot:+e.target.value}))} style={{...sx.inp,width:70}}/></div>
            <div><label style={sx.lbl}>Typ</label><input value={nT.tier} onChange={e => setNT(p => ({...p,tier:e.target.value}))} style={{...sx.inp,width:80}} placeholder="d8"/></div>
            <div><label style={sx.lbl}>Farbe</label><input type="color" value={nT.color} onChange={e => setNT(p => ({...p,color:e.target.value}))} style={{height:34,width:50,border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer"}}/></div>
            <button onClick={() => { if(!nT.name)return; setCustom(p => [...p,{...nT,id:Date.now(),used:0}]); setNT({name:"",tot:3,color:C.purple,tier:""}); }} style={sx.btn(C.green)}>Hinzufügen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
