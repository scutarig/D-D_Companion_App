import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { DND_RACES } from "../data/races.js";

const RACE_COL = { Mensch:"#c9a84c",Elf:"#4ade80",Hochelf:"#60a5fa",Waldelfe:"#22c55e","Dunkelelf (Drow)":"#a78bfa",Zwerg:"#fb923c",Bergzwerg:"#f97316",Hügelzwerg:"#d97706",Halbling:"#34d399",Halbork:"#dc2626",Halbelfe:"#c084fc",Tiefling:"#f472b6","Drachen-Geborener":"#ef4444",Gnom:"#38bdf8",Aarakocra:"#a3e635","Tiefling (Varianten)":"#e879f9",Aasimar:"#fde68a","Wasserkind (Genasi)":"#06b6d4",Triton:"#3b82f6","Yuan-ti Pureblood":"#4ade80" };
const RACE_ICON = { Mensch:"👤",Elf:"🧝",Hochelf:"🔮",Waldelfe:"🌿","Dunkelelf (Drow)":"🕷️",Zwerg:"⛏️",Bergzwerg:"🏔️",Hügelzwerg:"🍄",Halbling:"🍀",Halbork:"⚔️",Halbelfe:"✨",Tiefling:"😈","Drachen-Geborener":"🐉",Gnom:"🔧",Aarakocra:"🦅","Tiefling (Varianten)":"🌑",Aasimar:"👼","Wasserkind (Genasi)":"💧",Triton:"🌊","Yuan-ti Pureblood":"🐍" };

export default function VoelkerRef() {
  const mob = useIsMobile(768);
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = DND_RACES.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.desc?.toLowerCase().includes(search.toLowerCase())
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
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Volk suchen…" style={{...sx.inp,marginBottom:6}}/>
        <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
          {DND_RACES.length} VÖLKER · D&D 5e
        </div>
        <div style={{maxHeight:mob?"none":"62vh",overflowY:"auto"}}>
          {filtered.map(r=>{
            const col = RACE_COL[r.name]||C.purpleBright;
            const active = sel?.name===r.name;
            return (
              <div key={r.name} onClick={()=>setSel(r)} style={{background:active?`${col}33`:C.surface,borderTop:`1px solid ${active?col:C.border}`,borderRight:`1px solid ${active?col:C.border}`,borderBottom:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:15,flexShrink:0}}>{RACE_ICON[r.name]||"🧬"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontFamily:FH,color:active?col:C.textBright,fontWeight:active?700:400}}>{r.name}</div>
                  <div style={{fontSize:11,color:C.textDim}}>{r.size} · {r.speed}ft</div>
                </div>
              </div>
            );
          })}
          <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>{filtered.length} Völker</div>
        </div>
      </div>

      {/* ── Right: detail ── */}
      <div style={{flex:1,overflowY:"auto",maxHeight:mob?"none":"75vh"}}>
        {sel ? (
          <div style={sx.card}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:36}}>{RACE_ICON[sel.name]||"🧬"}</span>
                <div>
                  <div style={{fontFamily:FH,fontSize:22,color:RACE_COL[sel.name]||C.gold,fontWeight:700}}>{sel.name}</div>
                  <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                    <Tag label={`📏 ${sel.size}`} color={RACE_COL[sel.name]||C.purple}/>
                    <Tag label={`💨 ${sel.speed}ft`} color={RACE_COL[sel.name]||C.purple}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Sect title="Über das Volk">
              <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{sel.desc}</div>
            </Sect>

            {/* Traits */}
            <Sect title={`Rassenmerkmale (${sel.traits.length})`}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {sel.traits.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"7px 10px",borderTop:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,borderLeft:`3px solid ${RACE_COL[sel.name]||C.purple}`}}>
                    <span style={{color:RACE_COL[sel.name]||C.teal,fontSize:12,minWidth:14,flexShrink:0}}>▸</span>
                    <span style={{fontSize:13,color:C.text,lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </Sect>
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>🧬</div>
            Volk auswählen ({DND_RACES.length} verfügbar)
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:14}}>
              {DND_RACES.map(r=><span key={r.name} onClick={()=>setSel(r)} style={{...sx.tag(RACE_COL[r.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{RACE_ICON[r.name]||"🧬"} {r.name}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
