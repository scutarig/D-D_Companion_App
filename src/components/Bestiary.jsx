import { useState } from "react";
import { C, sx, SC, ABS, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { modStr } from "../utils/helpers.js";
import { MONSTERS } from "../data/monsters.js";

export default function Bestiary() {
  const [custom, setCustom] = usePersist("bestiary_v4", []);
  const [search, setSearch] = useState("");
  const [tf, setTf] = useState("All");
  const [sel, setSel] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({name:"",cr:"1",hp:10,ac:10,speed:"30 ft.",type:"Beast",size:"Medium",alignment:"",str:10,dex:10,con:10,int:10,wis:10,cha:10,saves:{},skills:{},resistances:[],immunities:[],vulnerabilities:[],condImmunities:[],senses:"",languages:"",traits:"",actions:"",legendary:""});
  const all = [...MONSTERS, ...(custom||[])];
  const types = ["All", ...new Set(all.map(m => m.type))].sort();
  const crN = cr => { const n=parseFloat(cr); return isNaN(n)?0:n; };
  const filtered = all.filter(m =>
    (tf==="All"||m.type===tf) &&
    (m.name.toLowerCase().includes(search.toLowerCase())||m.type.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => crN(a.cr)-crN(b.cr));
  const crC = cr => { const n=crN(cr); return n<1?"#40a060":n<5?C.gold:n<10?C.red:"#c020c0"; };

  const Tag = ({label, color}) => (
    <span style={{background:`${color}22`,border:`1px solid ${color}55`,borderRadius:4,padding:"1px 6px",fontSize:11,color,display:"inline-block",margin:"1px 2px"}}>{label}</span>
  );
  const Sect = ({title, children}) => (
    <div style={{marginTop:10,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{display:"flex",gap:12}}>
      {/* ── Left: list ── */}
      <div style={{width:220,flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Monster suchen…" style={{...sx.inp,marginBottom:6}}/>
        <select value={tf} onChange={e=>setTf(e.target.value)} style={{...sx.sel,marginBottom:6}}>{types.map(t=><option key={t}>{t}</option>)}</select>
        <button onClick={()=>setShowAdd(!showAdd)} style={{...sx.btn(C.green),width:"100%",marginBottom:8}}>+ Eigenes Monster</button>
        <div style={{maxHeight:"62vh",overflowY:"auto"}}>
          {filtered.map(m=>(
            <div key={m.id} onClick={()=>{setSel(m);setShowAdd(false);}} style={{background:sel?.id===m.id?`${C.red}33`:C.surface,border:`1px solid ${sel?.id===m.id?C.red:C.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3}}>
              <div style={sx.jb}>
                <span style={{fontSize:13,fontFamily:FH,color:C.textBright}}>{m.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:crC(m.cr)}}>CR {m.cr}</span>
              </div>
              <span style={{fontSize:11,color:C.textDim}}>{m.size} {m.type}{m.custom&&<span style={{color:C.gold}}> ★</span>}</span>
            </div>
          ))}
          <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>{filtered.length} Monster</div>
        </div>
      </div>

      {/* ── Right: detail / add form ── */}
      <div style={{flex:1,overflowY:"auto",maxHeight:"75vh"}}>
        {showAdd ? (
          <div style={sx.card}>
            <div style={sx.ct}>🐉 Neues Monster</div>
            <div style={sx.g3}>{[["name","Name","text"],["cr","CR","text"],["type","Typ","text"],["size","Größe","text"],["alignment","Gesinnung","text"],["hp","HP","number"],["ac","AC","number"],["speed","Speed","text"]].map(([k,l,t])=><div key={k}><label style={sx.lbl}>{l}</label><input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:t==="number"?+e.target.value:e.target.value}))} style={sx.inp}/></div>)}</div>
            <div style={{marginTop:8}}><label style={sx.lbl}>Attribute</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ABS.map(a=><div key={a}><label style={{...sx.lbl,textAlign:"center"}}>{a}</label><input type="number" value={form[a.toLowerCase()]} onChange={e=>setForm(p=>({...p,[a.toLowerCase()]:+e.target.value}))} style={{...sx.inp,width:60,textAlign:"center"}}/></div>)}</div></div>
            <div style={{marginTop:8}}><label style={sx.lbl}>Sinne & Sprachen</label><input value={form.senses} onChange={e=>setForm(p=>({...p,senses:e.target.value}))} style={{...sx.inp,marginBottom:4}} placeholder="Dunkelsicht 60 ft., Passive Wahrnehmung 10"/><input value={form.languages} onChange={e=>setForm(p=>({...p,languages:e.target.value}))} style={sx.inp} placeholder="Gemeinsprache"/></div>
            <div style={{marginTop:8}}><label style={sx.lbl}>Eigenschaften</label><textarea value={form.traits} onChange={e=>setForm(p=>({...p,traits:e.target.value}))} style={{...sx.ta,height:60}} placeholder="Besondere Eigenschaften…"/></div>
            <div style={{marginTop:8}}><label style={sx.lbl}>Aktionen</label><textarea value={form.actions} onChange={e=>setForm(p=>({...p,actions:e.target.value}))} style={{...sx.ta,height:70}} placeholder="Angriffe und Fähigkeiten…"/></div>
            <div style={{marginTop:8}}><label style={sx.lbl}>Legendäre Aktionen</label><textarea value={form.legendary} onChange={e=>setForm(p=>({...p,legendary:e.target.value}))} style={{...sx.ta,height:50}} placeholder="Nur für legendäre Monster…"/></div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button onClick={()=>{if(!form.name)return;setCustom(p=>[...p,{...form,id:Date.now(),custom:true}]);setShowAdd(false);}} style={sx.btn(C.green)}>✓ Speichern</button>
              <button onClick={()=>setShowAdd(false)} style={sx.btn(C.red)}>✕ Abbrechen</button>
            </div>
          </div>
        ) : sel ? (
          <div style={sx.card}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontFamily:FH,fontSize:22,color:C.gold,fontWeight:700}}>{sel.name}</div>
                <div style={{color:C.textDim,fontSize:13}}>{sel.size} {sel.type}{sel.alignment?` · ${sel.alignment}`:""}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:crC(sel.cr),fontFamily:FH}}>CR {sel.cr}</div>
                {sel.xp && <div style={{fontSize:11,color:C.textDim}}>{sel.xp.toLocaleString("de")} XP</div>}
                {sel.custom&&<button onClick={()=>{setCustom(p=>p.filter(m=>m.id!==sel.id));setSel(null);}} style={{...sx.bsm(C.red),marginTop:4}}>🗑</button>}
              </div>
            </div>

            {/* Core stats bar */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <span style={sx.tag(C.red)}>❤️ {sel.hp} HP{sel.hpDice?` (${sel.hpDice})`:""}</span>
              <span style={sx.tag(C.blue)}>🛡️ {sel.ac} AC{sel.acNote?` (${sel.acNote})`:""}</span>
              <span style={sx.tag(C.green)}>💨 {sel.speed}</span>
            </div>

            {/* Ability scores */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {ABS.map(a=>(
                <div key={a} style={{textAlign:"center",background:C.surface,borderRadius:6,padding:"6px 10px",minWidth:52}}>
                  <div style={{fontSize:10,color:SC[a],fontFamily:FH,fontWeight:700}}>{a}</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.textBright}}>{sel[a.toLowerCase()]}</div>
                  <div style={{fontSize:12,color:C.gold}}>{modStr(sel[a.toLowerCase()])}</div>
                </div>
              ))}
            </div>

            {/* Saves */}
            {sel.saves && Object.keys(sel.saves).length>0 && (
              <Sect title="Rettungswürfe">
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.entries(sel.saves).map(([ab,val])=>(
                    <Tag key={ab} label={`${ab} ${val}`} color={SC[ab]||C.purple}/>
                  ))}
                </div>
              </Sect>
            )}

            {/* Skills */}
            {sel.skills && Object.keys(sel.skills).length>0 && (
              <Sect title="Fertigkeiten">
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.entries(sel.skills).map(([sk,val])=>(
                    <Tag key={sk} label={`${sk} ${val}`} color={C.teal}/>
                  ))}
                </div>
              </Sect>
            )}

            {/* Resistances / Immunities / Vulnerabilities */}
            {((sel.resistances?.length>0)||(sel.immunities?.length>0)||(sel.vulnerabilities?.length>0)||(sel.condImmunities?.length>0)) && (
              <Sect title="Resistenzen & Immunitäten">
                {sel.vulnerabilities?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.amber,fontWeight:700}}>Verwundbar: </span>{sel.vulnerabilities.map(v=><Tag key={v} label={v} color={C.amber}/>)}</div>}
                {sel.resistances?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.blue,fontWeight:700}}>Resistent: </span>{sel.resistances.map(r=><Tag key={r} label={r} color={C.blue}/>)}</div>}
                {sel.immunities?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.green,fontWeight:700}}>Immun: </span>{sel.immunities.map(i=><Tag key={i} label={i} color={C.green}/>)}</div>}
                {sel.condImmunities?.length>0 && <div><span style={{fontSize:11,color:C.textDim,fontWeight:700}}>Zustand-Immun: </span>{sel.condImmunities.map(c=><Tag key={c} label={c} color={C.textDim}/>)}</div>}
              </Sect>
            )}

            {/* Senses & Languages */}
            <Sect title="Sinne & Sprachen">
              {sel.senses && <div style={{fontSize:13,color:C.text,marginBottom:3}}>👁 {sel.senses}</div>}
              {sel.languages && <div style={{fontSize:13,color:C.text}}>🗣 {sel.languages}</div>}
            </Sect>

            {/* Traits */}
            {sel.traits && (
              <Sect title="Eigenschaften">
                <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{sel.traits}</div>
              </Sect>
            )}

            {/* Actions */}
            {sel.actions && (
              <Sect title="Aktionen">
                <div style={{fontSize:13,color:C.textBright,lineHeight:1.7}}>{sel.actions}</div>
              </Sect>
            )}

            {/* Legendary */}
            {sel.legendary && (
              <Sect title="Legendäre Aktionen">
                <div style={{fontSize:13,color:C.purple,lineHeight:1.7}}>{sel.legendary}</div>
              </Sect>
            )}
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>🐉</div>
            Monster auswählen ({MONSTERS.length} SRD) oder eigenes erstellen.
          </div>
        )}
      </div>
    </div>
  );
}
