import { C, sx } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { CONDITIONS } from "../data/conditions.js";

export default function ConditionsTracker() {
  const [active, setActive] = usePersist("cond_v4", []);
  const tog = id => setActive(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <div>
      {active.length > 0 && (
        <div style={sx.card}>
          <div style={sx.ct}>🎯 Aktive Conditions ({active.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {CONDITIONS.filter(c => active.includes(c.id)).map(c => (
              <div key={c.id} style={{background:C.surface,border:`1px solid ${C.redBright}88`,borderRadius:6,padding:"8px 12px",maxWidth:260}}>
                <div style={{...sx.jb,marginBottom:4}}><span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:C.redBright}}>{c.icon} {c.name}</span><button onClick={() => tog(c.id)} style={sx.bsm(C.red)}>✕</button></div>
                <div style={{fontSize:13,color:C.textDim,lineHeight:1.5}}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={sx.card}>
        <div style={sx.ct}>📋 Alle Conditions</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:8}}>
          {CONDITIONS.map(c => (
            <div key={c.id} onClick={() => tog(c.id)} style={{background:active.includes(c.id)?C.red+"33":C.surface,border:`1px solid ${active.includes(c.id)?C.redBright:C.border}`,borderRadius:6,padding:"8px 12px",cursor:"pointer",transition:"all .2s"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:active.includes(c.id)?C.redBright:C.textBright,fontWeight:700,marginBottom:3}}>{c.icon} {c.name}</div>
              <div style={{fontSize:11,color:C.textDim,lineHeight:1.4}}>{c.desc.slice(0,80)}{c.desc.length>80?"...":""}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
