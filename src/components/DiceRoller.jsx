import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { rollD } from "../utils/helpers.js";

export default function DiceRoller() {
  const [res, setRes] = useState([]);
  const [cnt, setCnt] = useState(1);
  const [mod, setMod] = useState(0);
  const [rolling, setRolling] = useState(null);
  const DICE = [4, 6, 8, 10, 12, 20, 100];
  const DC = {4:"#a040c0",6:"#2060c0",8:"#20a060",10:"#c07020",12:"#c02040",20:"#c9a84c",100:"#808080"};
  const go = s => {
    setRolling(s);
    setTimeout(() => {
      const rolls = Array.from({length:cnt}, () => rollD(s));
      const total = rolls.reduce((a,b) => a+b, 0) + parseInt(mod||0);
      setRes(p => [{id:Date.now(),sides:s,cnt,rolls,mod:parseInt(mod||0),total,ts:new Date().toLocaleTimeString()},...p.slice(0,19)]);
      setRolling(null);
    }, 280);
  };
  return (
    <div>
      <div style={sx.card}>
        <div style={sx.ct}>⚙️ Einstellungen</div>
        <div style={{display:"flex",gap:12}}>
          <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} max={20} value={cnt} onChange={e=>setCnt(+e.target.value)} style={{...sx.inp,width:80}}/></div>
          <div><label style={sx.lbl}>Modifier</label><input type="number" value={mod} onChange={e=>setMod(e.target.value)} style={{...sx.inp,width:80}}/></div>
        </div>
      </div>
      <div style={sx.card}>
        <div style={sx.ct}>🎲 Würfel</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          {DICE.map(d => (
            <button key={d} onClick={() => go(d)} style={{background:rolling===d?`radial-gradient(circle,${DC[d]},#000)`:`linear-gradient(135deg,${DC[d]}44,${DC[d]}22)`,border:`2px solid ${DC[d]}`,borderRadius:8,color:DC[d],fontFamily:FH,fontSize:18,fontWeight:700,width:72,height:72,cursor:"pointer",transition:"all .2s",transform:rolling===d?"scale(1.1) rotate(8deg)":"scale(1)",boxShadow:rolling===d?`0 0 20px ${DC[d]}88`:"none"}}>d{d}</button>
          ))}
        </div>
      </div>
      {res.length > 0 && (
        <div style={sx.card}>
          <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>📜 Verlauf</div><button onClick={() => setRes([])} style={sx.bsm(C.red)}>Leeren</button></div>
          {res.map(r => (
            <div key={r.id} style={{background:"#0f0f1e",borderRadius:6,padding:"10px 14px",marginBottom:6,border:`1px solid ${r.sides===20&&r.rolls[0]===20?C.gold:r.sides===20&&r.rolls[0]===1?C.red:C.border}`,boxShadow:r.sides===20&&r.rolls[0]===20?`0 0 12px ${C.goldDim}`:"none"}}>
              <div style={sx.jb}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{color:DC[r.sides]||C.gold,fontFamily:FH,fontWeight:700}}>{r.cnt}d{r.sides}{r.mod!==0?(r.mod>0?`+${r.mod}`:r.mod):""}</span>
                  {r.sides===20&&r.rolls[0]===20&&<span style={{color:C.gold,fontSize:12}}>✨ NAT 20!</span>}
                  {r.sides===20&&r.rolls[0]===1&&<span style={{color:C.red,fontSize:12}}>💀 PATZER!</span>}
                </div>
                <span style={{color:C.textDim,fontSize:11}}>{r.ts}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <span style={{color:C.textDim,fontSize:13}}>[{r.rolls.join(", ")}]{r.mod!==0?` ${r.mod>0?"+":""}${r.mod}`:""}</span>
                <span style={{fontSize:22,fontWeight:700,color:C.textBright,marginLeft:4}}>= {r.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
