import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { DND_RACES, RACES_FULL } from "../data/races.js";
import { useI18n } from "../i18n/index.js";

const RACE_COL = {
  Mensch:"#c9a84c", Aasimar:"#fde68a", Dragonborn:"#ef4444",
  Dwarf:"#fb923c", Elf:"#4ade80", Gnome:"#38bdf8",
  Goliath:"#a78bfa", Halfling:"#34d399", Orc:"#dc2626", Tiefling:"#f472b6",
  // Legacy
  Hochelf:"#60a5fa", Waldelfe:"#22c55e", "Dunkelelf (Drow)":"#a78bfa",
  Bergzwerg:"#f97316", Hügelzwerg:"#d97706", Halbork:"#dc2626", Halbelfe:"#c084fc",
  "Drachen-Geborener":"#ef4444", Aarakocra:"#a3e635", "Tiefling (Varianten)":"#e879f9",
  "Wasserkind (Genasi)":"#06b6d4", Triton:"#3b82f6", "Yuan-ti Pureblood":"#4ade80",
};
const RACE_ICON = {
  Mensch:"👤", Aasimar:"👼", Dragonborn:"🐉",
  Dwarf:"⛏️", Elf:"🧝", Gnome:"🔧",
  Goliath:"🏔️", Halfling:"🍀", Orc:"⚔️", Tiefling:"😈",
  // Legacy
  Hochelf:"🔮", Waldelfe:"🌿", "Dunkelelf (Drow)":"🕷️",
  Bergzwerg:"🏔️", Hügelzwerg:"🍄", Halbork:"⚔️", Halbelfe:"✨",
  "Drachen-Geborener":"🐉", Aarakocra:"🦅", "Tiefling (Varianten)":"🌑",
  "Wasserkind (Genasi)":"💧", Triton:"🌊", "Yuan-ti Pureblood":"🐍",
};

// Merge data: prefer RACES_FULL when available (structured 2024 PHB)
const fullByName = Object.fromEntries(RACES_FULL.map(r => [r.name, r]));
const fullById = Object.fromEntries(RACES_FULL.map(r => [r.id, r]));

export default function VoelkerRef() {
  const { t, lang } = useI18n();
  // Helper to pick localized field
  const pickL = (en, de) => (lang === "en" && en) ? en : de;
  const mob = useIsMobile(900);
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const [editionFilter, setEditionFilter] = useState("all"); // "all" | "2024" | "2014"

  const filtered = DND_RACES.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.desc?.toLowerCase().includes(search.toLowerCase());
    const matchesEdition = editionFilter === "all" || r.edition === editionFilter;
    return matchesSearch && matchesEdition;
  });

  const Tag = ({label,color}) => (
    <span style={{background:`${color}22`,border:`1px solid ${color}55`,borderRadius:4,padding:"1px 6px",fontSize:11,color,display:"inline-block",margin:"1px 2px"}}>{label}</span>
  );
  const Sect = ({title,children}) => (
    <div style={{marginTop:10,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:.8,marginBottom:5,textTransform:"uppercase"}}>{title}</div>
      {children}
    </div>
  );

  const col = sel ? (RACE_COL[sel.name]||C.purpleBright) : C.purpleBright;
  const full = sel ? fullByName[sel.name] : null;
  const is2024 = sel?.edition === "2024";
  const count2024 = DND_RACES.filter(r => r.edition === "2024").length;

  return (
    <div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
      {/* ── Left: list ── */}
      <div style={{width:mob?"100%":220,flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("ref.search_species", "🔍 Volk suchen…")} style={{...sx.inp,marginBottom:6}}/>

        {/* Edition filter */}
        <div style={{display:"flex",gap:4,marginBottom:6}}>
          {[
            { id:"all",  label: t("ref.edition_all", "Alle") },
            { id:"2024", label: t("ref.edition_2024", "PHB 2024") },
            { id:"2014", label: t("ref.edition_legacy", "Legacy") },
          ].map(opt => (
            <button key={opt.id} onClick={() => setEditionFilter(opt.id)}
              style={{
                flex:1, padding:"4px 6px", borderRadius:5, fontSize:10,
                fontFamily:FH, fontWeight:700, letterSpacing:0.3,
                cursor:"pointer", transition:"all .15s",
                background: editionFilter === opt.id ? `${C.amberBright}22` : C.surface,
                border: `1px solid ${editionFilter === opt.id ? C.amberBright : C.border}`,
                color: editionFilter === opt.id ? C.amberBright : C.textDim,
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
          {DND_RACES.length} {t("ref.species_count", "VÖLKER")} · {count2024} {t("ref.on_phb_2024", "auf PHB 2024")}
        </div>
        <div style={{maxHeight:mob?"none":"58vh",overflowY:"auto"}}>
          {filtered.map(r=>{
            const c = RACE_COL[r.name]||C.purpleBright;
            const active = sel?.name===r.name;
            const legacy = r.edition === "2014";
            return (
              <div key={r.name} onClick={()=>setSel(r)} style={{background:active?`${c}33`:C.surface,borderTop:`1px solid ${active?c:C.border}`,borderRight:`1px solid ${active?c:C.border}`,borderBottom:`1px solid ${active?c:C.border}`,borderLeft:`3px solid ${c}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3,display:"flex",alignItems:"center",gap:8,opacity:legacy?0.7:1}}>
                <span style={{fontSize:15,flexShrink:0}}>{RACE_ICON[r.name]||"🧬"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontFamily:FH,color:active?c:C.textBright,fontWeight:active?700:400,display:"flex",alignItems:"center",gap:5}}>
                    {r.name}
                    {!legacy && <span title="PHB 2024" style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:`${C.amberBright}22`,border:`1px solid ${C.amberBright}55`,color:C.amberBright,fontWeight:700,letterSpacing:0.3}}>2024</span>}
                  </div>
                  <div style={{fontSize:11,color:C.textDim}}>{r.size} · {r.speed}ft</div>
                </div>
              </div>
            );
          })}
          <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>{filtered.length} {t("ref.species_count","Völker")}</div>
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
                  <div style={{fontFamily:FH,fontSize:22,color:col,fontWeight:700,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    {sel.name}
                    {is2024 && <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${C.amberBright}22`,border:`1px solid ${C.amberBright}55`,color:C.amberBright,fontWeight:700,letterSpacing:0.5}}>PHB 2024</span>}
                    {!is2024 && <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${C.textDim}22`,border:`1px solid ${C.textDim}55`,color:C.textDim,fontWeight:700,letterSpacing:0.5}}>LEGACY 2014</span>}
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                    <Tag label={`📏 ${sel.size}`} color={col}/>
                    <Tag label={`💨 ${sel.speed}ft`} color={col}/>
                    {full?.languages && <Tag label={`💬 ${((lang === "en" && full.languagesEN ? full.languagesEN : full.languages) || []).join(", ")}`} color={C.blue}/>}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Sect title={t("ref.about_species", "Über das Volk")}>
              <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{pickL(full?.descriptionEN, full?.description) || sel.desc}</div>
            </Sect>

            {/* 2024 Structured Traits */}
            {full?.traits && full.traits.length > 0 && (
              <Sect title={`${t("ref.species_traits", "Rassen-Merkmale")} (${full.traits.length})`}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {full.traits.map((trait,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"8px 11px",borderLeft:`3px solid ${col}`}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.textBright,marginBottom:3,fontFamily:FH,letterSpacing:0.3}}>{pickL(trait.nameEN, trait.name)}</div>
                      <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>{pickL(trait.descriptionEN, trait.description)}</div>
                    </div>
                  ))}
                </div>
              </Sect>
            )}

            {/* 2024 Features (z.B. Lv3 Aasimar Celestial Revelation) */}
            {full?.features && full.features.length > 0 && (
              <Sect title={`${t("ref.species_features", "Level-Merkmale")} (${full.features.length})`}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {full.features.map((f,i)=>(
                    <div key={i} style={{background:`${col}11`,borderRadius:6,padding:"8px 11px",borderLeft:`3px solid ${col}`,border:`1px solid ${col}33`}}>
                      <div style={{fontSize:12,fontWeight:700,color:col,marginBottom:3,fontFamily:FH,letterSpacing:0.3}}>✦ {pickL(f.nameEN, f.name)}</div>
                      <div style={{fontSize:11,color:C.text,lineHeight:1.5}}>{pickL(f.descriptionEN, f.description)}</div>
                    </div>
                  ))}
                </div>
              </Sect>
            )}

            {/* 2024 Lineages */}
            {full?.lineages && full.lineages.length > 0 && (
              <Sect title={`${t("ref.species_lineages", "Lineages")} (${full.lineages.length})`}>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {full.lineages.map((l)=>(
                    <div key={l.id} style={{background:"rgba(255,255,255,0.02)",borderRadius:6,padding:"7px 11px",borderLeft:`3px solid ${col}88`}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.textBright,marginBottom:2,fontFamily:FH}}>{pickL(l.nameEN, l.name)}</div>
                      <div style={{fontSize:11,color:C.textDim,lineHeight:1.45}}>{pickL(l.descriptionEN, l.description)}</div>
                    </div>
                  ))}
                </div>
              </Sect>
            )}

            {/* Legacy Traits (string list — for 2014 entries without RACES_FULL) */}
            {!full && sel.traits && (
              <Sect title={`${t("ref.species_traits", "Rassen-Merkmale")} (${sel.traits.length})`}>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {sel.traits.map((trait,i)=>(
                    <div key={i} style={{display:"flex",gap:8,background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"7px 10px",borderLeft:`3px solid ${col}`}}>
                      <span style={{color:col,fontSize:12,minWidth:14,flexShrink:0}}>▸</span>
                      <span style={{fontSize:13,color:C.text,lineHeight:1.5}}>{trait}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8,padding:"6px 10px",background:`${C.amberBright}11`,border:`1px solid ${C.amberBright}33`,borderRadius:6,fontSize:10,color:C.amberBright,fontStyle:"italic"}}>
                  {t("ref.species_legacy_warning", "⚠️ Legacy 2014 — keine strukturierten 2024-Daten.")}
                </div>
              </Sect>
            )}
          </div>
        ) : (
          <div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:40}}>
            <div style={{fontSize:36,marginBottom:10}}>🧬</div>
            {t("ref.choose_species", "Volk auswählen")} ({count2024} {t("ref.on_phb_2024", "auf PHB 2024")})
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:14}}>
              {DND_RACES.filter(r => r.edition === "2024").map(r=>(
                <span key={r.name} onClick={()=>setSel(r)} style={{...sx.tag(RACE_COL[r.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{RACE_ICON[r.name]||"🧬"} {r.name}</span>
              ))}
            </div>
            <div style={{marginTop:14,fontSize:10,color:C.textDim,fontStyle:"italic"}}>
              {t("ref.species_asi_hint", "2024-Reform: Keine ASI an Species — Boni kommen vom Background!")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
