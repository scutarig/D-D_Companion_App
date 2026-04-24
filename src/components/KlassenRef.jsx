import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { D3_KLASSEN } from "../data/classes.js";

const CL_COL = { Barbar:"#dc2626",Barde:"#a78bfa",Druide:"#4ade80",Hexenmeister:"#9d174d",Kämpfer:"#0d9488",Kleriker:"#f59e0b",Magier:"#60a5fa",Mönch:"#fb923c",Paladin:"#fde68a",Schurke:"#9ca3af",Waldläufer:"#22c55e",Zauberer:"#e879f9",Magieschmied:"#38bdf8" };

export default function KlassenRef() {
  const mob = useIsMobile(768);
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = D3_KLASSEN.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    k.primary.toLowerCase().includes(search.toLowerCase())
  );

  const Tag = ({label,color}) => (
    <span style={{background:`${color}22`,border:`1px solid ${color}55`,borderRadius:4,padding:"1px 6px",fontSize:11,color,display:"inline-block",margin:"1px 2px"}}>{label}</span>
  );
  const Sect = ({title,children}) => (
    <div style={{marginTop:10,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
      {/* ── Left: list ── */}
      <div style={{width:mob?"100%":220,flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Klasse suchen…" style={{...sx.inp,marginBottom:6}}/>
        <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
          {D3_KLASSEN.length} KLASSEN · <a href="https://www.dnddeutsch.de/klassen-und-archetypen/" target="_blank" rel="noreferrer" style={{color:C.purpleBright,textDecoration:"none"}}>dnddeutsch.de ↗</a>
        </div>
        <div style={{maxHeight:mob?"none":"62vh",overflowY:"auto"}}>
          {filtered.map(k=>{
            const col = CL_COL[k.name]||C.purpleBright;
            const active = sel?.id===k.id;
            return (
              <div key={k.id} onClick={()=>{setSel(k);}} style={{background:active?`${col}33`:C.surface,borderTop:`1px solid ${active?col:C.border}`,borderRight:`1px solid ${active?col:C.border}`,borderBottom:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:15,flexShrink:0}}>{k.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontFamily:FH,color:active?col:C.textBright,fontWeight:active?700:400}}>{k.name}</div>
                  <div style={{fontSize:11,color:C.textDim}}>HD {k.hd} · {k.saves}</div>
                </div>
              </div>
            );
          })}
          <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>{filtered.length} Klassen</div>
        </div>
      </div>

      {/* ── Right: detail ── */}
      <div style={{flex:1,overflowY:"auto",maxHeight:mob?"none":"75vh"}}>
        {sel ? (
          <div style={sx.card}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:36}}>{sel.icon}</span>
                <div>
                  <div style={{fontFamily:FH,fontSize:22,color:CL_COL[sel.name]||C.gold,fontWeight:700}}>{sel.name}</div>
                  <a href={sel.srd} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.purpleBright,textDecoration:"none"}}>→ SRD auf dnddeutsch.de</a>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:CL_COL[sel.name]||C.gold,fontFamily:FH}}>{sel.hd}</div>
                <div style={{fontSize:11,color:C.textDim}}>Trefferwürfel</div>
              </div>
            </div>

            {/* Core stats bar */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <Tag label={`⭐ ${sel.primary}`} color={CL_COL[sel.name]||C.gold}/>
              <Tag label={`💾 ${sel.saves}`} color={C.blue}/>
              <Tag label={`🛡️ ${sel.armor}`} color={C.teal}/>
              <Tag label={`⚔️ ${sel.weapons}`} color={C.red}/>
            </div>

            {/* Description */}
            {sel.desc && (
              <Sect title="Über die Klasse">
                <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{sel.desc}</div>
              </Sect>
            )}

            {/* Tools & Skills */}
            <Sect title="Werkzeuge & Fertigkeiten">
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <div style={{fontSize:12,color:C.textBright}}><span style={{color:C.textDim}}>🔧 Werkzeuge: </span>{sel.tools}</div>
                <div style={{fontSize:12,color:C.textBright}}><span style={{color:C.textDim}}>🎯 Fertigkeiten: </span>{sel.skills}</div>
              </div>
            </Sect>

            {/* Archetypes */}
            <Sect title={`Archetypen (${sel.archetypes.length})`}>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {sel.archetypes.map(a=><Tag key={a} label={a} color={CL_COL[sel.name]||C.purple}/>)}
              </div>
            </Sect>

            {/* Features table */}
            <Sect title="Merkmale (Auszug)">
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>{sel.tableHead.map(h=><th key={h} style={{textAlign:"left",padding:"4px 7px",color:CL_COL[sel.name]||C.gold,fontFamily:FH,fontSize:10,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                  <tbody>{sel.table.map((row,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>{row.map((cell,j)=><td key={j} style={{padding:"4px 7px",color:j===row.length-1?C.text:C.textBright,borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5}}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </Sect>
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>⚔️</div>
            Klasse auswählen ({D3_KLASSEN.length} verfügbar)
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:14}}>
              {D3_KLASSEN.map(k=><span key={k.id} onClick={()=>setSel(k)} style={{...sx.tag(CL_COL[k.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{k.icon} {k.name}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
