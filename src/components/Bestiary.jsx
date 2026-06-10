import { useState } from "react";
import { C, sx, SC, ABS, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { modStr } from "../utils/helpers.js";
import { MONSTERS } from "../data/monsters.js";
import { useI18n } from "../i18n/index.js";

// ─── Inline DE→EN ⇄ EN→DE translation for common monster stat patterns ──
// Bestiary monster traits/actions follow regex patterns. Auto-translate.
const MONSTER_TEXT_DE = (text) => {
  if (!text) return text;
  return text
    // Action headers
    .replace(/Multiattack\./gi, "Mehrfachangriff.")
    .replace(/\bMelee Attack Roll:/gi, "Nahkampfangriff:")
    .replace(/\bRanged Attack Roll:/gi, "Fernkampfangriff:")
    .replace(/\bMelee or Ranged Attack Roll:/gi, "Nah- oder Fernkampfangriff:")
    .replace(/\bStrength Saving Throw:/gi, "Stärke-Rettungswurf:")
    .replace(/\bDexterity Saving Throw:/gi, "Geschicklichkeit-Rettungswurf:")
    .replace(/\bConstitution Saving Throw:/gi, "Konstitution-Rettungswurf:")
    .replace(/\bIntelligence Saving Throw:/gi, "Intelligenz-Rettungswurf:")
    .replace(/\bWisdom Saving Throw:/gi, "Weisheit-Rettungswurf:")
    .replace(/\bCharisma Saving Throw:/gi, "Charisma-Rettungswurf:")
    .replace(/\bSTR Save/gi, "STR-Save")
    .replace(/\bDEX Save/gi, "DEX-Save")
    .replace(/\bCON Save/gi, "KON-Save")
    .replace(/\bINT Save/gi, "INT-Save")
    .replace(/\bWIS Save/gi, "WIS-Save")
    .replace(/\bCHA Save/gi, "CHA-Save")
    .replace(/\bHit:/gi, "Treffer:")
    .replace(/\bFailure:/gi, "Fehlschlag:")
    .replace(/\bSuccess:/gi, "Erfolg:")
    .replace(/\breach 5 ft\./gi, "Reichweite 5 ft.")
    .replace(/\breach 10 ft\./gi, "Reichweite 10 ft.")
    .replace(/\brange (\d+\/\d+) ft\./gi, "Reichweite $1 ft.")
    // Damage types
    .replace(/\bBludgeoning damage/gi, "Wuchtschaden")
    .replace(/\bPiercing damage/gi, "Stichschaden")
    .replace(/\bSlashing damage/gi, "Hiebschaden")
    .replace(/\bFire damage/gi, "Feuerschaden")
    .replace(/\bCold damage/gi, "Kälteschaden")
    .replace(/\bLightning damage/gi, "Blitzschaden")
    .replace(/\bThunder damage/gi, "Donnerschaden")
    .replace(/\bAcid damage/gi, "Säureschaden")
    .replace(/\bPoison damage/gi, "Giftschaden")
    .replace(/\bNecrotic damage/gi, "Nekrose-Schaden")
    .replace(/\bRadiant damage/gi, "Strahlend-Schaden")
    .replace(/\bForce damage/gi, "Kraftschaden")
    .replace(/\bPsychic damage/gi, "Psychischer Schaden")
    // Common terms
    .replace(/\bAdvantage on/gi, "Vorteil auf")
    .replace(/\bDisadvantage on/gi, "Nachteil auf")
    .replace(/\bBonus Action/gi, "Bonus-Aktion")
    .replace(/\bMagic Action/gi, "Magie-Aktion")
    .replace(/\bReaction/gi, "Reaktion")
    .replace(/\bShort Rest/gi, "Kurze Rast")
    .replace(/\bLong Rest/gi, "Lange Rast")
    .replace(/\bSaving Throw/gi, "Rettungswurf")
    .replace(/\bPack Tactics\./gi, "Rudeltaktik.")
    .replace(/\bBrave\./gi, "Tapfer.")
    .replace(/\bUndead Fortitude\./gi, "Untote Standhaftigkeit.")
    .replace(/\bIncapacitated condition/gi, "Handlungsunfähig-Zustand")
    .replace(/\bGrappled condition/gi, "Gegriffen-Zustand")
    .replace(/\bProne condition/gi, "Liegend-Zustand")
    .replace(/\bRestrained condition/gi, "Festgehalten-Zustand")
    .replace(/\bCharmed condition/gi, "Bezaubert-Zustand")
    .replace(/\bFrightened condition/gi, "Verängstigt-Zustand")
    .replace(/\bPoisoned condition/gi, "Vergiftet-Zustand")
    .replace(/\bBlinded condition/gi, "Geblendet-Zustand")
    .replace(/\bStunned condition/gi, "Betäubt-Zustand")
    .replace(/\bAdvantage\b/gi, "Vorteil")
    .replace(/\bDisadvantage\b/gi, "Nachteil")
    .replace(/\battack roll\b/gi, "Angriffsrolle")
    .replace(/\battack rolls\b/gi, "Angriffsrollen")
    .replace(/\bability check\b/gi, "Fertigkeits-Check")
    .replace(/\bability checks\b/gi, "Fertigkeits-Checks");
};

// Pick correct field based on lang (EN is default storage)
const pickMonsterField = (lang, en, de) => (lang === "de" ? (de || MONSTER_TEXT_DE(en)) : en);

/**
 * Bestiary — Monster lookup + custom-monster CRUD
 *
 * 2024 MM SCHEMA SUPPORT:
 *   - Edition badge (2024 / 2014 Legacy)
 *   - Initiative line (separate from DEX)
 *   - Gear section
 *   - Habitat + Treasure pills
 *   - Three-column stat display (Score / Mod / Save) when saveBonuses present
 *   - Reactions + Bonus Actions blocks
 *
 * SPOILER-HIDE MODE (Player View):
 *   - Global toggle: app_view_mode_v1 → "full" | "spoiler"
 *   - Encountered tracking: encountered_monsters_v1 → number[] (monster IDs)
 *   - In spoiler mode: list shows only encountered + custom monsters
 *   - Search reveals MINIMAL cards (just name) with "Begegnet" button
 *   - Click → monster added to encountered list, full card now visible
 *   - Custom monsters are always visible (user added them themselves)
 */
export default function Bestiary() {
  const { t, lang } = useI18n();
  const mob = useIsMobile(900);
  const tMon = (en, de) => pickMonsterField(lang, en, de);
  const [custom, setCustom] = usePersist("bestiary_v4", []);
  const [viewMode, setViewMode] = usePersist("app_view_mode_v1", "full");
  const [encountered, setEncountered] = usePersist("encountered_monsters_v1", []);
  const [dmNotes, setDmNotes] = usePersist("dm_monster_notes_v1", {});
  const [search, setSearch] = useState("");
  const [tf, setTf] = useState("All");
  const [crFilter, setCrFilter] = useState("All"); // "All" | "weak" | "moderate" | "deadly" | "boss"
  const [sel, setSel] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({name:"",cr:"1",hp:10,ac:10,speed:"30 ft.",type:"Beast",size:"Medium",alignment:"",str:10,dex:10,con:10,int:10,wis:10,cha:10,saves:{},skills:{},resistances:[],immunities:[],vulnerabilities:[],condImmunities:[],senses:"",languages:"",traits:"",actions:"",legendary:""});

  const all = [...MONSTERS, ...(custom||[])];
  const types = ["All", ...new Set(all.map(m => m.type))].sort();
  const crN = cr => { const n=parseFloat(cr); return isNaN(n)?0:n; };

  const isSpoilerMode = viewMode === "spoiler";
  const isEncountered = (m) => m.custom || encountered.includes(m.id);

  // CR-Filter ranges (PHB 2024)
  const crInRange = (cr) => {
    if (crFilter === "All") return true;
    const n = crN(cr);
    if (crFilter === "weak") return n < 1;         // <1 — Mooks
    if (crFilter === "moderate") return n >= 1 && n < 5;   // 1-4 — Standard
    if (crFilter === "deadly") return n >= 5 && n < 11;    // 5-10 — Tough
    if (crFilter === "boss") return n >= 11;       // 11+ — Boss-Level
    return true;
  };

  // List filter
  const filtered = all.filter(m =>
    (tf==="All"||m.type===tf) &&
    crInRange(m.cr) &&
    (m.name.toLowerCase().includes(search.toLowerCase())||(m.nameDE||"").toLowerCase().includes(search.toLowerCase())||m.type.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => crN(a.cr)-crN(b.cr));

  // In spoiler mode: separate encountered (full) from unknown (minimal)
  const visibleList = isSpoilerMode ? filtered.filter(isEncountered) : filtered;
  const hiddenMatches = isSpoilerMode && search ? filtered.filter(m => !isEncountered(m)) : [];

  const markEncountered = (id) => {
    setEncountered(p => p.includes(id) ? p : [...p, id]);
  };
  const forgetEncountered = (id) => {
    setEncountered(p => p.filter(x => x !== id));
    if (sel?.id === id) setSel(null);
  };

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
    <div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
      {/* ── Left: list + mode toggle ── */}
      <div style={{width:mob?"100%":240,flexShrink:0}}>
        {/* Spoiler-Hide Mode toggle */}
        <div style={{marginBottom:8,display:"flex",gap:4}}>
          <button
            onClick={() => setViewMode(isSpoilerMode ? "full" : "spoiler")}
            title={isSpoilerMode ? t("bestiary.show_all","Zeige alle Monster (DM/Lookup)") : t("bestiary.hide_unknown","Verstecke unbekannte Monster (Spoiler-Schutz)")}
            style={{
              flex:1,
              padding:"6px 8px",
              fontSize:10,
              fontFamily:FH,
              fontWeight:700,
              letterSpacing:0.5,
              borderRadius:6,
              cursor:"pointer",
              background: isSpoilerMode ? `${C.purpleBright}1f` : `${C.amberBright}1f`,
              border: `1px solid ${isSpoilerMode ? C.purpleBright : C.amberBright}55`,
              color: isSpoilerMode ? C.purpleBright : C.amberBright,
            }}
          >
            {isSpoilerMode ? t("bestiary.spoiler_mode","🎲 Spoiler-Modus") : t("bestiary.full_view","📖 Vollansicht")}
          </button>
        </div>

        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isSpoilerMode ? t("bestiary.search_spoiler","🔍 Monster suchen (Name)…") : t("bestiary.search","🔍 Monster suchen…")} style={{...sx.inp,marginBottom:6}}/>
        <select value={tf} onChange={e=>setTf(e.target.value)} style={{...sx.sel,marginBottom:6}}>{types.map(typ=><option key={typ}>{typ}</option>)}</select>

        {/* CR-Filter (4 Stufen für DM-Encounter-Design) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, marginBottom: 6 }}>
          {[
            { id: "All",      label: t("bestiary.cr_filter_all", "Alle"),       col: C.textDim },
            { id: "weak",     label: t("bestiary.cr_filter_weak", "<1"),        col: "#40a060" },
            { id: "moderate", label: t("bestiary.cr_filter_moderate", "1-4"),   col: C.gold },
            { id: "deadly",   label: t("bestiary.cr_filter_deadly", "5-10"),    col: C.red },
            { id: "boss",     label: t("bestiary.cr_filter_boss", "11+"),       col: "#c020c0" },
          ].map(opt => (
            <button key={opt.id} onClick={() => setCrFilter(opt.id)} title={`CR ${opt.label}`}
              style={{
                padding: "5px 2px", borderRadius: 5, fontSize: 9,
                fontFamily: FH, fontWeight: 700, letterSpacing: 0.3, cursor: "pointer",
                background: crFilter === opt.id ? `${opt.col}33` : "transparent",
                border: `1px solid ${crFilter === opt.id ? opt.col : C.border}`,
                color: crFilter === opt.id ? opt.col : C.textDim,
                transition: "all .15s",
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        <button onClick={()=>setShowAdd(!showAdd)} style={{...sx.btn(C.green),width:"100%",marginBottom:8}}>{t("bestiary.add_custom","+ Eigenes Monster")}</button>

        <div style={{maxHeight:mob?"none":"62vh",overflowY:"auto"}}>
          {/* Encountered + custom: full cards */}
          {visibleList.map(m=>(
            <div key={m.id} onClick={()=>{setSel(m);setShowAdd(false);}} style={{background:sel?.id===m.id?`${C.red}33`:C.surface,border:`1px solid ${sel?.id===m.id?C.red:C.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3}}>
              <div style={sx.jb}>
                <div style={{display:"flex",flexDirection:"column",minWidth:0,flex:1}}>
                  <span style={{fontSize:13,fontFamily:FH,color:C.textBright,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
                  {m.nameDE && m.nameDE !== m.name && (
                    <span style={{fontSize:10,color:C.textDim,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.nameDE}</span>
                  )}
                </div>
                <span style={{fontSize:11,fontWeight:700,color:crC(m.cr),flexShrink:0,marginLeft:6}}>CR {m.cr}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:C.textDim}}>{m.size} {m.type}{m.custom&&<span style={{color:C.gold}}> ★</span>}{m.edition === "2024" && <span style={{color:C.purpleBright, marginLeft:4}}>· 2024</span>}</span>
                {isSpoilerMode && encountered.includes(m.id) && (
                  <button
                    onClick={e=>{e.stopPropagation(); forgetEncountered(m.id);}}
                    title="Aus 'Begegnet'-Liste entfernen"
                    style={{background:"transparent",border:"none",cursor:"pointer",color:C.textDim,fontSize:11,padding:"0 4px"}}
                  >✕</button>
                )}
              </div>
            </div>
          ))}

          {/* Spoiler mode: minimal name-cards for non-encountered search hits */}
          {hiddenMatches.length > 0 && (
            <div style={{marginTop:8,paddingTop:8,borderTop:`1px dashed ${C.border}`}}>
              <div style={{fontSize:9,color:C.textDim,fontFamily:FH,letterSpacing:0.5,marginBottom:6}}>
                ❔ TREFFER (NOCH NICHT BEGEGNET)
              </div>
              {hiddenMatches.map(m => (
                <div key={m.id} style={{background:C.surface,border:`1px dashed ${C.border}`,borderRadius:4,padding:"6px 10px",marginBottom:3,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,fontFamily:FH,color:C.textDim,fontStyle:"italic"}}>{m.name}</span>
                  <button
                    onClick={()=>markEncountered(m.id)}
                    title="Als 'Begegnet' markieren — Stats werden sichtbar"
                    style={{padding:"3px 8px",fontSize:9,fontFamily:FH,fontWeight:700,borderRadius:5,cursor:"pointer",background:`${C.green}33`,border:`1px solid ${C.green}88`,color:C.greenBright}}
                  >
                    ✓ Begegnet
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Counter */}
          <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>
            {isSpoilerMode ? `${visibleList.length} bekannt · ${encountered.length} gesamt begegnet` : `${filtered.length} Monster`}
          </div>
        </div>
      </div>

      {/* ── Right: detail / add form ── */}
      <div style={{flex:1,overflowY:"auto",maxHeight:mob?"none":"75vh"}}>
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
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <div style={{fontFamily:FH,fontSize:22,color:C.gold,fontWeight:700}}>{sel.name}</div>
                  {sel.edition === "2024" && (
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:700,background:`${C.purpleBright}1f`,border:`1px solid ${C.purpleBright}55`,color:C.purpleBright,letterSpacing:0.3}}>
                      2024 MM
                    </span>
                  )}
                  {sel.edition === "2014" && (
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:700,background:`${C.amberBright}1f`,border:`1px solid ${C.amberBright}55`,color:C.amberBright,letterSpacing:0.3}} title="2014 MM Legacy — noch nicht auf 2024 migriert">
                      ⚠ Legacy 2014
                    </span>
                  )}
                </div>
                <div style={{color:C.textDim,fontSize:13}}>{sel.size} {sel.type}{sel.alignment?` · ${sel.alignment}`:""}</div>
                {sel.nameDE && <div style={{color:C.textDim,fontSize:11,fontStyle:"italic",marginTop:1}}>DE: {sel.nameDE}</div>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:crC(sel.cr),fontFamily:FH}}>CR {sel.cr}</div>
                {sel.xp && <div style={{fontSize:11,color:C.textDim}}>{sel.xp.toLocaleString(lang === "en" ? "en-US" : "de-DE")} XP{sel.pb?` · PB +${sel.pb}`:""}</div>}
                {sel.custom&&<button onClick={()=>{setCustom(p=>p.filter(m=>m.id!==sel.id));setSel(null);}} style={{...sx.bsm(C.red),marginTop:4}}>🗑</button>}
                {!sel.custom && isSpoilerMode && encountered.includes(sel.id) && (
                  <button onClick={()=>forgetEncountered(sel.id)} style={{...sx.bsm(C.textDim),marginTop:4,fontSize:10}} title="Aus 'Begegnet'-Liste entfernen">
                    🙈 Vergessen
                  </button>
                )}
              </div>
            </div>

            {/* Habitat + Treasure pills (2024) */}
            {(sel.habitat?.length > 0 || sel.treasure) && (
              <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                {sel.habitat?.map(h => (
                  <span key={h} style={{fontSize:9,padding:"2px 7px",borderRadius:6,background:`${C.greenBright}1f`,border:`1px solid ${C.greenBright}55`,color:C.greenBright,fontWeight:700}}>
                    🌍 {h}
                  </span>
                ))}
                {sel.treasure && (
                  <span style={{fontSize:9,padding:"2px 7px",borderRadius:6,background:`${C.gold}22`,border:`1px solid ${C.gold}66`,color:C.gold,fontWeight:700}}>
                    💰 Treasure: {sel.treasure}
                  </span>
                )}
              </div>
            )}

            {/* Core stats bar */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <span style={sx.tag(C.red)}>❤️ {sel.hp} HP{sel.hpDice?` (${sel.hpDice})`:""}</span>
              <span style={sx.tag(C.blue)}>🛡️ {sel.ac} AC{sel.acNote?` (${sel.acNote})`:""}</span>
              {(sel.initiative !== undefined || sel.initiativePassive !== undefined) && (
                <span style={sx.tag(C.purple)}>
                  ⚡ Init {sel.initiative >= 0 ? `+${sel.initiative}` : sel.initiative}
                  {sel.initiativePassive !== undefined && ` (${sel.initiativePassive})`}
                </span>
              )}
              <span style={sx.tag(C.green)}>💨 {sel.speed}</span>
            </div>

            {/* Ability scores — 2024 three-column layout if saveBonuses present */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {ABS.map(a => {
                const raw = sel[a.toLowerCase()];
                const saveBonus = sel.saveBonuses?.[a];
                const hasSave = saveBonus !== undefined && saveBonus !== null;
                return (
                  <div key={a} style={{textAlign:"center",background:C.surface,borderRadius:6,padding:"6px 10px",minWidth:hasSave ? 70 : 52}}>
                    <div style={{fontSize:10,color:SC[a],fontFamily:FH,fontWeight:700}}>{a}</div>
                    <div style={{fontSize:18,fontWeight:700,color:C.textBright}}>{raw}</div>
                    <div style={{fontSize:12,color:C.gold}}>{modStr(raw)}</div>
                    {hasSave && (
                      <div style={{fontSize:9,color:C.tealBright,fontWeight:700,marginTop:2,paddingTop:2,borderTop:`1px solid ${C.tealBright}33`}}>
                        SAVE {saveBonus >= 0 ? `+${saveBonus}` : saveBonus}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legacy saves block (only if no saveBonuses but old saves field) */}
            {!sel.saveBonuses && sel.saves && Object.keys(sel.saves).length>0 && (
              <Sect title={t("bestiary.saves","Rettungswürfe")}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.entries(sel.saves).map(([ab,val])=>(
                    <Tag key={ab} label={`${ab} ${val}`} color={SC[ab]||C.purple}/>
                  ))}
                </div>
              </Sect>
            )}

            {/* Skills */}
            {sel.skills && Object.keys(sel.skills).length>0 && (
              <Sect title={t("bestiary.skills","Fertigkeiten")}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.entries(sel.skills).map(([sk,val])=>(
                    <Tag key={sk} label={`${sk} ${val}`} color={C.teal}/>
                  ))}
                </div>
              </Sect>
            )}

            {/* Gear (2024) */}
            {sel.gear?.length > 0 && (
              <Sect title={t("bestiary.equipment","Ausrüstung")}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {sel.gear.map(g => <Tag key={g} label={`⚔ ${g}`} color={C.amber}/>)}
                </div>
              </Sect>
            )}

            {/* Resistances / Immunities / Vulnerabilities */}
            {((sel.resistances?.length>0)||(sel.immunities?.length>0)||(sel.vulnerabilities?.length>0)||(sel.condImmunities?.length>0)) && (
              <Sect title={t("bestiary.resistances","Resistenzen & Immunitäten")}>
                {sel.vulnerabilities?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.amber,fontWeight:700}}>Verwundbar: </span>{sel.vulnerabilities.map(v=><Tag key={v} label={v} color={C.amber}/>)}</div>}
                {sel.resistances?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.blue,fontWeight:700}}>Resistent: </span>{sel.resistances.map(r=><Tag key={r} label={r} color={C.blue}/>)}</div>}
                {sel.immunities?.length>0 && <div style={{marginBottom:3}}><span style={{fontSize:11,color:C.green,fontWeight:700}}>Immun: </span>{sel.immunities.map(i=><Tag key={i} label={i} color={C.green}/>)}</div>}
                {sel.condImmunities?.length>0 && <div><span style={{fontSize:11,color:C.textDim,fontWeight:700}}>Zustand-Immun: </span>{sel.condImmunities.map(c=><Tag key={c} label={c} color={C.textDim}/>)}</div>}
              </Sect>
            )}

            {/* Senses & Languages */}
            <Sect title={t("bestiary.senses_languages","Sinne & Sprachen")}>
              {sel.senses && <div style={{fontSize:13,color:C.text,marginBottom:3}}>👁 {sel.senses}</div>}
              {sel.languages && <div style={{fontSize:13,color:C.text}}>🗣 {sel.languages}</div>}
            </Sect>

            {/* Description */}
            {sel.desc && (
              <Sect title={lang === "en" ? "Description" : "Beschreibung"}>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,fontStyle:"italic"}}>{tMon(sel.desc, sel.descDE)}</div>
              </Sect>
            )}

            {/* Traits */}
            {sel.traits && (
              <Sect title={lang === "en" ? "Traits" : "Eigenschaften"}>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{tMon(sel.traits, sel.traitsDE)}</div>
              </Sect>
            )}

            {/* Actions */}
            {sel.actions && (
              <Sect title={lang === "en" ? "Actions" : "Aktionen"}>
                <div style={{fontSize:13,color:C.textBright,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{tMon(sel.actions, sel.actionsDE)}</div>
              </Sect>
            )}

            {/* Bonus Actions (2024) */}
            {sel.bonusActions && (
              <Sect title={lang === "en" ? "Bonus Actions" : "Bonus-Aktionen"}>
                <div style={{fontSize:13,color:C.amberBright,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{tMon(sel.bonusActions, sel.bonusActionsDE)}</div>
              </Sect>
            )}

            {/* Reactions (2024 separates from Actions) */}
            {sel.reactions && (
              <Sect title={lang === "en" ? "Reactions" : "Reaktionen"}>
                <div style={{fontSize:13,color:C.tealBright,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{tMon(sel.reactions, sel.reactionsDE)}</div>
              </Sect>
            )}

            {/* Legendary */}
            {sel.legendary && (
              <Sect title={lang === "en" ? "Legendary Actions" : "Legendäre Aktionen"}>
                <div style={{fontSize:13,color:C.purple,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{tMon(sel.legendary, sel.legendaryDE)}</div>
              </Sect>
            )}

            {/* DM-Notizen (Phase 4) — nur im DM-Mode (viewMode = full) */}
            {viewMode === "full" && (
              <Sect title={t("bestiary.dm_notes_title", "🎲 DM-Notizen (privat)")}>
                <div style={{
                  background: `${C.purpleBright}08`,
                  border: `1px solid ${C.purpleBright}33`,
                  borderLeft: `3px solid ${C.purpleBright}`,
                  borderRadius: 8, padding: 10, marginBottom: 6,
                }}>
                  <textarea
                    value={dmNotes[sel.id] || ""}
                    onChange={e => setDmNotes(p => ({ ...p, [sel.id]: e.target.value }))}
                    placeholder={t("bestiary.dm_notes_placeholder", "Eigene DM-Notizen…")}
                    style={{
                      ...sx.ta,
                      minHeight: 80,
                      fontSize: 13,
                      background: "rgba(0,0,0,0.3)",
                    }}
                  />
                  {dmNotes[sel.id] && (
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6 }}>
                      <div style={{ fontSize:10, color:C.textDim, fontStyle:"italic" }}>
                        ✓ Lokal gespeichert · pro Monster
                      </div>
                      <button
                        onClick={() => { if (window.confirm(t("bestiary.delete_note","Notiz löschen?"))) setDmNotes(p => { const np = {...p}; delete np[sel.id]; return np; }); }}
                        style={{ ...sx.bsm(C.red), fontSize:9, padding:"3px 7px" }}
                      >
                        🗑 Löschen
                      </button>
                    </div>
                  )}
                </div>
              </Sect>
            )}
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>🐉</div>
            {isSpoilerMode
              ? <>Spoiler-Modus aktiv. Suche nach einem Monster (Name) → "Begegnet" markieren um Stats zu sehen.</>
              : <>Monster auswählen ({MONSTERS.length} SRD) oder eigenes erstellen.</>}
          </div>
        )}
      </div>
    </div>
  );
}
