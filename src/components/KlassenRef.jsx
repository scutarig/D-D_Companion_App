import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { D3_KLASSEN, is2024Class } from "../data/classes.js";

const CL_COL = { Barbar:"#dc2626",Barde:"#a78bfa",Druide:"#4ade80",Hexenmeister:"#9d174d",Kämpfer:"#0d9488",Kleriker:"#f59e0b",Magier:"#60a5fa",Mönch:"#fb923c",Paladin:"#fde68a",Schurke:"#9ca3af",Waldläufer:"#22c55e",Zauberer:"#e879f9",Magieschmied:"#38bdf8" };

export default function KlassenRef() {
  const mob = useIsMobile(768);
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = D3_KLASSEN.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    (k.enName || "").toLowerCase().includes(search.toLowerCase()) ||
    (k.primary || "").toLowerCase().includes(search.toLowerCase())
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

  const col = sel ? (CL_COL[sel.name]||C.purpleBright) : C.purpleBright;
  const is2024 = sel && is2024Class(sel);

  return (
    <div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
      {/* ── Left: list ── */}
      <div style={{width:mob?"100%":220,flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Klasse suchen…" style={{...sx.inp,marginBottom:6}}/>
        <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
          {D3_KLASSEN.length} KLASSEN · {D3_KLASSEN.filter(is2024Class).length} auf PHB 2024
        </div>
        <div style={{maxHeight:mob?"none":"62vh",overflowY:"auto"}}>
          {filtered.map(k=>{
            const c = CL_COL[k.name]||C.purpleBright;
            const active = sel?.id===k.id;
            const klass2024 = is2024Class(k);
            return (
              <div key={k.id} onClick={()=>{setSel(k);}} style={{background:active?`${c}33`:C.surface,borderTop:`1px solid ${active?c:C.border}`,borderRight:`1px solid ${active?c:C.border}`,borderBottom:`1px solid ${active?c:C.border}`,borderLeft:`3px solid ${c}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:15,flexShrink:0}}>{k.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontFamily:FH,color:active?c:C.textBright,fontWeight:active?700:400,display:"flex",alignItems:"center",gap:6}}>
                    {k.name}
                    {klass2024 && <span title="PHB 2024" style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:`${C.amberBright}22`,border:`1px solid ${C.amberBright}55`,color:C.amberBright,fontWeight:700,letterSpacing:0.3}}>2024</span>}
                  </div>
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
                  <div style={{fontFamily:FH,fontSize:22,color:col,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
                    {sel.name}
                    {sel.enName && sel.enName !== sel.name && (
                      <span style={{fontSize:13,color:C.textDim,fontWeight:400}}>· {sel.enName}</span>
                    )}
                    {is2024 && <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${C.amberBright}22`,border:`1px solid ${C.amberBright}55`,color:C.amberBright,fontWeight:700,letterSpacing:0.5}}>PHB 2024</span>}
                  </div>
                  <a href={sel.srd} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.purpleBright,textDecoration:"none"}}>→ SRD auf dnddeutsch.de</a>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:col,fontFamily:FH}}>{sel.hd}</div>
                <div style={{fontSize:11,color:C.textDim}}>Hit Die</div>
              </div>
            </div>

            {/* Core stats bar */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <Tag label={`⭐ ${sel.primary}`} color={col}/>
              <Tag label={`💾 ${sel.saves}`} color={C.blue}/>
              <Tag label={`🛡️ ${sel.armor}`} color={C.teal}/>
              <Tag label={`⚔️ ${sel.weapons}`} color={C.red}/>
              {sel.spellcasting && (
                <Tag label={`✨ ${sel.spellcasting.ability} · ${sel.spellcasting.progression}`} color={C.purpleBright}/>
              )}
            </div>

            {/* Description */}
            {sel.desc && (
              <Sect title="About the Class">
                <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{sel.desc}</div>
              </Sect>
            )}

            {/* Skills + Tools (2024 schema uses skills.count/choices) */}
            <Sect title="Skills & Tools">
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {typeof sel.skills === "object" && sel.skills.count ? (
                  <div style={{fontSize:12,color:C.textBright}}>
                    <span style={{color:C.textDim}}>🎯 Skills: Choose {sel.skills.count}: </span>
                    {sel.skills.choices.join(", ")}
                  </div>
                ) : (
                  <div style={{fontSize:12,color:C.textBright}}><span style={{color:C.textDim}}>🎯 Skills: </span>{sel.skills}</div>
                )}
                <div style={{fontSize:12,color:C.textBright}}><span style={{color:C.textDim}}>🔧 Tools: </span>{sel.tools}</div>
              </div>
            </Sect>

            {/* Starting Equipment (2024 only) */}
            {is2024 && sel.startingEquipment && (
              <Sect title="Starting Equipment">
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {Object.entries(sel.startingEquipment).map(([k,v]) => (
                    <div key={k} style={{fontSize:12,color:C.text}}>
                      <span style={{fontFamily:FH,color:col,fontWeight:700,marginRight:6}}>({k})</span>{v}
                    </div>
                  ))}
                </div>
              </Sect>
            )}

            {/* Subclasses (2024 schema) */}
            {is2024 && sel.subclasses && (
              <Sect title={`${sel.subclassName} (chosen at Lv${sel.subclassChoiceLevel})`}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {sel.subclasses.map(a=><Tag key={a} label={a} color={col}/>)}
                </div>
              </Sect>
            )}

            {/* Legacy archetypes */}
            {!is2024 && sel.archetypes && (
              <Sect title={`Archetypen (${sel.archetypes.length})`}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {sel.archetypes.map(a=><Tag key={a} label={a} color={CL_COL[sel.name]||C.purple}/>)}
                </div>
              </Sect>
            )}

            {/* 2024 Full Progression Table */}
            {is2024 && sel.progressionRows && (
              <Sect title="Class Progression (Level 1-20)">
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr>
                        {sel.progressionHeaders.map(h=>(
                          <th key={h} style={{textAlign:"left",padding:"4px 6px",color:col,fontFamily:FH,fontSize:10,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sel.progressionRows.map((row,i)=>(
                        <tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                          {row.map((cell,j)=>(
                            <td key={j} style={{padding:"3px 6px",color:j===2?C.text:C.textBright,borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.4,fontWeight:j===0?700:400,whiteSpace:j===2?"normal":"nowrap"}}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Sect>
            )}

            {/* 2024 Features by Level */}
            {is2024 && sel.featuresByLevel && (
              <Sect title="Class Features (Detail)">
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {Object.entries(sel.featuresByLevel)
                    .map(([lv,feats])=>[Number(lv),feats])
                    .sort((a,b)=>a[0]-b[0])
                    .map(([lv,feats])=>(
                    <div key={lv} style={{borderLeft:`3px solid ${col}`,paddingLeft:10,paddingTop:2,paddingBottom:2}}>
                      <div style={{fontSize:10,fontFamily:FH,letterSpacing:0.6,color:col,fontWeight:700,marginBottom:4}}>
                        LEVEL {lv}
                      </div>
                      {feats.map((f,i)=>(
                        <div key={i} style={{marginBottom:6}}>
                          <div style={{fontSize:12,fontWeight:700,color:C.textBright,marginBottom:2}}>{f.name}</div>
                          <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>{f.desc}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Sect>
            )}

            {/* Legacy table */}
            {!is2024 && sel.table && (
              <Sect title="Merkmale (Auszug · 2014 Schema)">
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr>{sel.tableHead.map(h=><th key={h} style={{textAlign:"left",padding:"4px 7px",color:col,fontFamily:FH,fontSize:10,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                    <tbody>{sel.table.map((row,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>{row.map((cell,j)=><td key={j} style={{padding:"4px 7px",color:j===row.length-1?C.text:C.textBright,borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5}}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
                <div style={{marginTop:8,padding:"6px 10px",background:`${C.amberBright}11`,border:`1px solid ${C.amberBright}33`,borderRadius:6,fontSize:10,color:C.amberBright,fontStyle:"italic"}}>
                  ⚠️ Diese Klasse ist noch auf 2014-Schema. PHB-2024-Refresh folgt in Phase 2.
                </div>
              </Sect>
            )}
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>⚔️</div>
            Klasse auswählen ({D3_KLASSEN.length} verfügbar)
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:14}}>
              {D3_KLASSEN.map(k=><span key={k.id} onClick={()=>setSel(k)} style={{...sx.tag(CL_COL[k.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{k.icon} {k.name}{is2024Class(k)?" ✦":""}</span>)}
            </div>
            <div style={{marginTop:14,fontSize:10,color:C.textDim}}>✦ = PHB 2024</div>
          </div>
        )}
      </div>
    </div>
  );
}
