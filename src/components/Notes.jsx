import { useState } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useMobile } from "../hooks/useMobile.js";

export default function Notes() {
  const CATS = [
    {id:"all",label:"Alle",icon:"📋",color:C.textDim},
    {id:"location",label:"Location",icon:"🗺️",color:C.greenBright},
    {id:"story",label:"Story",icon:"📖",color:C.gold},
    {id:"misc",label:"Sonstiges",icon:"📝",color:C.blueBright},
  ];
  const CC = {location:C.greenBright,story:C.gold,misc:C.blueBright};
  const CI = {location:"🗺️",story:"📖",misc:"📝"};
  const [notes, setNotes] = usePersist("notes_v5", [
    {id:2,title:"Dunkle Waldlichtung",content:"",cat:"location"},
    {id:3,title:"Der verlorene Thron",content:"",cat:"story"},
  ]);
  const [aid, setAid] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const filtered = catFilter==="all" ? notes : notes.filter(n => n.cat===catFilter);
  const cur = notes.find(n => n.id===aid) || (filtered[0]||notes[0]);
  const addNote = cat => { const n={id:Date.now(),title:"Neue Notiz",content:"",cat}; setNotes(p=>[...p,n]); setAid(n.id); setCatFilter("all"); };
  const upd = (id,field,val) => setNotes(p => p.map(n => n.id===id?{...n,[field]:val}:n));
  const delNote = () => { if(!cur)return; const rest=notes.filter(n=>n.id!==cur.id); setNotes(rest); setAid(rest[0]?.id||null); };
  const mob = useMobile();
  return (
    <div style={{display:"flex",gap:12,minHeight:"65vh",flexDirection:mob?"column":"row"}}>
      <div style={{width:mob?"100%":215,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} style={{background:catFilter===c.id?c.color+"33":C.surface,border:`1px solid ${catFilter===c.id?c.color:C.border}`,borderRadius:5,padding:"6px 10px",cursor:"pointer",textAlign:"left",color:catFilter===c.id?c.color:C.textDim,fontFamily:F,fontSize:12,fontWeight:catFilter===c.id?700:400,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>{c.icon} {c.label}</span>
              <span style={{fontSize:10,background:catFilter===c.id?c.color+"44":"transparent",borderRadius:10,padding:"1px 6px"}}>{c.id==="all"?notes.length:notes.filter(n=>n.cat===c.id).length}</span>
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,borderTop:`1px solid ${C.border}`,paddingTop:6}}>
          {CATS.slice(1).map(c => (
            <button key={c.id} onClick={() => addNote(c.id)} title={`Neue ${c.label}-Notiz`} style={{background:"transparent",border:`1px solid ${c.color}40`,borderRadius:12,padding:"2px 9px",cursor:"pointer",color:c.color,fontSize:11,lineHeight:1.4,fontFamily:F}}>+{c.icon}</button>
          ))}
          <span style={{fontSize:10,color:C.textDim,alignSelf:"center",marginLeft:2}}>Neue Notiz</span>
        </div>
        <div style={{flex:1,overflowY:"auto",maxHeight:"42vh",borderTop:`1px solid ${C.border}`,paddingTop:6}}>
          {filtered.map(n => {
            const col=CC[n.cat]||C.textDim; const icon=CI[n.cat]||"📝"; const active=cur?.id===n.id;
            return (
              <div key={n.id} onClick={() => setAid(n.id)} style={{background:active?col+"22":C.surface,border:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,borderRadius:5,padding:"7px 9px",cursor:"pointer",marginBottom:3,transition:"all .15s"}}>
                <div style={{fontSize:12,color:active?col:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{icon} {n.title||"(kein Titel)"}</div>
                <div style={{fontSize:10,color:C.textDim,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.content.slice(0,34)||"(leer)"}{n.content.length>34?"...":""}</div>
              </div>
            );
          })}
          {filtered.length===0&&<div style={{fontSize:12,color:C.textDim,fontStyle:"italic",padding:"8px 4px"}}>Keine Eintraege.</div>}
        </div>
        {notes.length>0&&<button onClick={delNote} style={{...sx.bsm(C.red),width:"100%"}}>Notiz loeschen</button>}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
        {cur ? (
          <>
            <div style={{background:C.surface,borderRadius:8,border:`1px solid ${CC[cur.cat]||C.border}`,borderLeft:`4px solid ${CC[cur.cat]||C.gold}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{CI[cur.cat]||"📝"}</span>
              <input value={cur.title} onChange={e => upd(cur.id,"title",e.target.value)} style={{flex:1,background:"transparent",border:"none",outline:"none",color:CC[cur.cat]||C.gold,fontFamily:FH,fontSize:17,fontWeight:700}} placeholder="Titel eingeben..."/>
              <select value={cur.cat} onChange={e => upd(cur.id,"cat",e.target.value)} style={{background:C.card,border:`1px solid ${CC[cur.cat]||C.border}`,borderRadius:4,color:CC[cur.cat]||C.textDim,fontFamily:F,fontSize:12,padding:"3px 8px",cursor:"pointer",outline:"none"}}>
                <option value="location">Kategorie: Location</option>
                <option value="story">Kategorie: Story</option>
                <option value="misc">Kategorie: Sonstiges</option>
              </select>
            </div>
            <textarea value={cur.content} onChange={e => upd(cur.id,"content",e.target.value)} style={{...sx.ta,flex:1,minHeight:400,lineHeight:1.9,fontSize:14,borderColor:CC[cur.cat]||C.border}} placeholder={cur.cat==="npc"?"Name, Rasse, Klasse, Motivation...":cur.cat==="location"?"Beschreibung, Atmosphäre...":cur.cat==="story"?"Plotpunkte, Hinweise...":"Freie Notizen..."}/>
          </>
        ) : (
          <div style={{...sx.card,textAlign:"center",color:C.textDim,fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>📝</div>
            Wähle eine Notiz oder erstelle eine neue.
          </div>
        )}
      </div>
    </div>
  );
}
