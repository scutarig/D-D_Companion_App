import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { C, sx, FH, F } from "./constants/theme.js";
import { usePersist } from "./hooks/usePersist.js";
import { getPB, buildSlotsForLevel, applyShortRest, applyLongRest } from "./utils/helpers.js";
import { CharProvider, useChar } from "./context/CharContext.jsx";
import { CombatProvider } from "./context/CombatContext.jsx";
import { useIsMobile } from "./hooks/useIsMobile.js";
import { useMulticlass } from "./hooks/useMulticlass.js";
import { computeAllResources } from "./data/classResources.js";

const Overview      = lazy(() => import("./components/CombatDashboard.jsx"));
const CharManager   = lazy(() => import("./components/CharManager.jsx"));
const Notes         = lazy(() => import("./components/Notes.jsx"));
const InventarTab   = lazy(() => import("./components/InventarTab.jsx"));
const NpcList       = lazy(() => import("./components/NpcList.jsx"));
const CombatSystem  = lazy(() => import("./components/Combat/CombatSystem.jsx"));
const DiceRoller    = lazy(() => import("./components/DiceRoller.jsx"));
const Bestiary      = lazy(() => import("./components/Bestiary.jsx"));
const KlassenRef    = lazy(() => import("./components/KlassenRef.jsx"));
const VoelkerRef    = lazy(() => import("./components/VoelkerRef.jsx"));
const QuickRef      = lazy(() => import("./components/QuickRef.jsx"));
const CompanionsPage    = lazy(() => import("./components/Companions/CompanionsPage.jsx"));
const ProficienciesPage = lazy(() => import("./components/Proficiencies/ProficienciesPage.jsx"));
const WorldbuildingPage = lazy(() => import("./components/Worldbuilding/WorldbuildingPage.jsx"));

const MAIN_TABS = [
  { id: "overview",       label: "Übersicht",    icon: "🗺️" },
  { id: "char",           label: "Charakter",    icon: "📜" },
  { id: "inventar",       label: "Inventar",     icon: "🎒" },
  { id: "companions",     label: "Begleiter",    icon: "🐾" },
  { id: "proficiencies",  label: "Proficiencies",icon: "🎓" },
  { id: "notes",          label: "Notizen",      icon: "📝" },
  { id: "npcs",           label: "NPCs",         icon: "👥" },
  { id: "combat",         label: "Kampf",        icon: "⚔️" },
  { id: "dice",           label: "Würfel",       icon: "🎲" },
  { id: "world",          label: "Weltenbau",    icon: "🌍" },
];
const REF_TABS = [
  { id: "bestiary", label: "Bestiary",        icon: "🐉" },
  { id: "klassen",  label: "Klassen",         icon: "⚔️" },
  { id: "voelker",  label: "Völker",          icon: "🧬" },
  { id: "quickref", label: "Schnellreferenz", icon: "📋" },
];

const Loader = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:60, color:C.textDim, fontSize:14 }}>
    <span style={{ marginRight:10, fontSize:20 }}>🐉</span> Laden…
  </div>
);

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div style={{ background:"#3a1a1a", borderBottom:"1px solid #c0392b", color:"#ff6b6b", fontSize:11, fontFamily:FH, letterSpacing:0.5, padding:"5px 14px", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
      <span>📶</span> Offline — App läuft lokal, Daten gespeichert
    </div>
  );
}

const snb = (active) => ({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "100%",
  background: active ? "linear-gradient(135deg,#6d4fc2 0%,#4a2fa0 100%)" : "transparent",
  border: "1px solid transparent",
  borderRadius: 9,
  color: active ? "#f0eeff" : C.textDim,
  fontSize: 18, padding: "9px 0", cursor: "pointer",
  transition: "all .18s",
  boxShadow: active ? "0 2px 10px rgba(109,79,194,0.35)" : "none",
});

// ── Persistent char header (shown on all tabs) ────────────────────────────────
function CharHeader({ restBanner, setRestBanner, restHpInput, setRestHpInput, setSlots, setCustom, autoUsed, setAutoUsed }) {
  const { active: char, setActive: setChar, aid } = useChar();
  const { classes } = useMulticlass(aid, char, null);
  if (!char) return null;

  const lbl = { fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase" };

  const confirmRest = () => {
    const autoResources = computeAllResources(classes, char);
    if (restBanner === "long") {
      setChar(p => applyLongRest(p));
      setSlots(p => p.map(s => ({ ...s, used: 0 })));
      setCustom(p => p.map(t => ({ ...t, used: 0 })));
      // Long rest resets ALL class resources (long + short)
      const reset = {};
      autoResources.forEach(r => { reset[r.id] = 0; });
      setAutoUsed(p => ({ ...p, ...reset }));
    } else {
      const hpGain = parseInt(restHpInput) || 0;
      setChar(p => applyShortRest(p, { hpGain }));
      // Short rest resets only short-rest class resources
      const reset = {};
      autoResources.forEach(r => { if (r.reset === "short") reset[r.id] = 0; });
      setAutoUsed(p => ({ ...p, ...reset }));
    }
    setRestBanner(null); setRestHpInput("");
  };

  return (
    <div style={{ background: "linear-gradient(180deg,#1c1826 0%,#16121e 100%)", borderBottom: `1px solid rgba(201,168,76,0.15)`, padding: "0 14px", flexShrink: 0 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6, height:44 }}>
        <div>
          <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:C.gold, lineHeight:1.1 }}>{char.name}</div>
          <div style={{ fontSize:9, color:C.textDim, marginTop:1, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span>{char.race} · {char.klass} · Level {char.level}</span>
            {char.originFeat && (
              <span
                title={`Origin Feat (von Background ${char.background || "—"})`}
                style={{
                  fontSize:9, padding:"1px 6px", borderRadius:6, fontWeight:700,
                  background:`${C.amberBright}22`, border:`1px solid ${C.amberBright}55`,
                  color:C.amberBright, letterSpacing:0.3, cursor:"help",
                }}
              >
                ⚔ {char.originFeat}
              </span>
            )}
          </div>
        </div>
        <div style={{ display:"flex", gap:4, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={() => setChar(p => ({ ...p, inspiration: !p.inspiration }))}
            style={{ ...sx.bsm(C.gold), fontSize:9, padding:"3px 7px", background: char.inspiration ? `${C.gold}22` : "transparent", border:`1px solid ${char.inspiration ? C.gold : C.border}`, color: char.inspiration ? C.gold : C.textDim, fontWeight:700 }}>
            {char.inspiration ? "✦" : "✧"} Inspiration
          </button>
          <button onClick={() => setRestBanner(restBanner === "short" ? null : "short")} style={{ ...sx.bsm(C.tealBright),   fontSize:9, padding:"3px 7px" }}>🌙 Kurze Rast</button>
          <button onClick={() => setRestBanner(restBanner === "long"  ? null : "long")}  style={{ ...sx.bsm(C.purpleBright), fontSize:9, padding:"3px 7px" }}>🌟 Lange Rast</button>
        </div>
      </div>

      {restBanner && (
        <div style={{ background: restBanner==="long" ? `${C.purple}22` : `${C.teal}22`, border:`1px solid ${restBanner==="long" ? C.purpleBright : C.tealBright}44`, borderRadius:10, padding:"10px 14px", marginTop:10, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span style={{ color: restBanner==="long" ? C.purpleBright : C.tealBright, fontSize:13, fontWeight:600, fontFamily:FH }}>
            {restBanner==="long" ? "◆ LANGE RAST" : "◆ KURZE RAST"}
          </span>
          {restBanner==="short" && (
            <span style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={lbl}>HP heilen:</span>
              <input value={restHpInput} onChange={e => setRestHpInput(e.target.value)} type="number" autoFocus
                style={{ ...sx.inp, width:70, fontSize:14, textAlign:"center" }} />
            </span>
          )}
          {restBanner==="long" && <span style={{ fontSize:12, color:C.text }}>Volle HP · Alle Slots · Ressourcen zurück</span>}
          <button onClick={confirmRest} style={sx.btn(restBanner==="long" ? C.purpleBright : C.tealBright)}>Bestätigen</button>
          <button onClick={() => setRestBanner(null)} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
      )}
    </div>
  );
}

// ── Mobile nav groups ─────────────────────────────────────────────────────────
const MOBILE_NAV = [
  { id: "overview",   label: "Übersicht", icon: "🗺️" },
  {
    id: "char-group", label: "Charakter", icon: "📜",
    groupIds: ["char", "companions", "proficiencies"],
    children: [
      { id: "char",          label: "Charakter",    icon: "📜" },
      { id: "companions",    label: "Begleiter",    icon: "🐾" },
      { id: "proficiencies", label: "Proficiencies",icon: "🎓" },
    ],
  },
  { id: "inventar", label: "Inventar", icon: "🎒" },
  { id: "combat",   label: "Kampf",    icon: "⚔️" },
  {
    id: "more", label: "Mehr", icon: "⋯",
    groupIds: ["dice", "notes", "npcs", "world", "bestiary", "klassen", "voelker", "quickref"],
    children: [
      { id: "dice",     label: "Würfel",     icon: "🎲" },
      { id: "notes",    label: "Notizen",    icon: "📝" },
      { id: "npcs",     label: "NPCs",       icon: "👥" },
      { id: "world",    label: "Weltenbau",  icon: "🌍" },
      { id: "bestiary", label: "Bestiary",   icon: "🐉" },
      { id: "klassen",  label: "Klassen",    icon: "📚" },
      { id: "voelker",  label: "Völker",     icon: "🧬" },
      { id: "quickref", label: "Schnellref", icon: "📋" },
    ],
  },
];

// ── App ────────────────────────────────────────────────────────────────────────
function AppInner() {
  const [tab, setTab]         = usePersist("app_tab_v5", "overview");
  const { active, aid, setActive: setChar } = useChar();
  const [refOpen,  setRefOpen]  = useState(false);
  const [refPos,   setRefPos]   = useState({ top: 0 });
  const [charOpen, setCharOpen] = useState(false);
  const [charPos,  setCharPos]  = useState({ top: 0 });
  const refBtnRef               = useRef(null);
  const charBtnRef              = useRef(null);
  const isMobile                = useIsMobile(768);
  const [mobileMenu, setMobileMenu] = useState(null); // null | "char-group" | "more"

  // Lifted state — shared with CombatDashboard (per Charakter)
  const [usedSlots, setUsedSlots] = usePersist(`tokens_used_${aid}`, {});
  const [custom, setCustom]       = usePersist(`tokens_custom_${aid}`, []);
  const [autoUsed, setAutoUsed]   = usePersist(`tokens_auto_used_${aid}`, {});

  // Slots live aus Klasse+Level ableiten (wie in Tokens.jsx)
  const slotDef = buildSlotsForLevel(active?.klass, active?.level) ?? [];
  const slots   = slotDef.map(s => ({ ...s, used: usedSlots[s.lv] || 0 }));
  const setSlots = (updater) => setUsedSlots(prev => {
    const cur  = slotDef.map(s => ({ ...s, used: prev[s.lv] || 0 }));
    const next = typeof updater === "function" ? updater(cur) : updater;
    const out  = {};
    next.forEach(s => { out[s.lv] = s.used; });
    return out;
  });
  const [restBanner, setRestBanner]   = useState(null);
  const [restHpInput, setRestHpInput] = useState("");

  const toggleRef = () => {
    if (refBtnRef.current) { const r = refBtnRef.current.getBoundingClientRect(); setRefPos({ top: r.top }); }
    setRefOpen(p => !p); setCharOpen(false);
  };
  const toggleChar = () => {
    if (charBtnRef.current) { const r = charBtnRef.current.getBoundingClientRect(); setCharPos({ top: r.top }); }
    setCharOpen(p => !p); setRefOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    if (!refOpen && !charOpen) return;
    const handler = () => { setRefOpen(false); setCharOpen(false); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [refOpen, charOpen]);

  const exportJSON = () => {
    if (!active) return;
    const blob = new Blob([JSON.stringify(active, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${active.name||"charakter"}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!active) return;
    const pb   = getPB(active.level);
    const modS = s => { const m = Math.floor((s-10)/2); return m>=0?`+${m}`:String(m); };
    const attrs = ["str","dex","con","int","wis","cha"].map(a=>`<tr><td>${a.toUpperCase()}</td><td>${active[a]||10}</td><td>${modS(active[a]||10)}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${active.name}</title><style>body{font-family:Calibri,sans-serif;padding:20px;max-width:680px}h1{margin:0}h3{border-bottom:1px solid #ccc;margin-top:16px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #ddd;padding:4px 8px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.box{border:1px solid #ccc;padding:6px;text-align:center}.bv{font-size:20px;font-weight:bold}</style></head><body><h1>${active.name}</h1><p>${active.race} · ${active.klass} · Level ${active.level} · PB +${pb}</p><div class="grid"><div class="box"><div style="font-size:10px">HP</div><div class="bv">${active.hp}/${active.maxHp}</div></div><div class="box"><div style="font-size:10px">AC</div><div class="bv">${active.ac}</div></div><div class="box"><div style="font-size:10px">Init</div><div class="bv">${modS(active.dex||10)}</div></div><div class="box"><div style="font-size:10px">Gold</div><div class="bv">${active.gold||0}gp</div></div></div><h3>Attribute</h3><table><tr><th>Attr</th><th>Wert</th><th>Mod</th></tr>${attrs}</table>${active.traits?`<h3>Persönlichkeit</h3><p>${active.traits}</p>`:""}${active.features?`<h3>Merkmale</h3><p>${active.features}</p>`:""}<p style="font-size:10px;color:#999">D&D Companion · ${new Date().toLocaleDateString("de")}</p></body></html>`;
    const w = window.open("","_blank"); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),300);
  };

  const isRef = REF_TABS.some(t => t.id === tab);

  const content = (
    <Suspense fallback={<Loader />}>
      {tab==="overview"    && <Overview  slots={slots} setSlots={setSlots} custom={custom} setCustom={setCustom} autoUsed={autoUsed} setAutoUsed={setAutoUsed} />}
      {tab==="char"        && <CharManager />}
      {tab==="notes"       && <Notes />}
      {tab==="inventar"    && <InventarTab />}
      {tab==="companions"     && <CompanionsPage />}
      {tab==="proficiencies"  && <ProficienciesPage />}
      {tab==="npcs"        && <NpcList />}
      {tab==="combat"      && <CombatSystem />}
      {tab==="dice"        && <DiceRoller char={active} setChar={setChar} />}
      {tab==="world"       && <WorldbuildingPage />}
      {tab==="bestiary"    && <Bestiary />}
      {tab==="klassen"     && <KlassenRef />}
      {tab==="voelker"     && <VoelkerRef />}
      {tab==="quickref"    && <QuickRef />}
    </Suspense>
  );

  // ── Desktop ────────────────────────────────────────────────────────────────
  if (!isMobile) return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden", background:C.bg, fontFamily:F, color:C.text }}>

      {/* Sidebar */}
      <aside style={{ width:58, flexShrink:0, background:"linear-gradient(180deg,#1a1526 0%,#100d18 100%)", borderRight:"1px solid rgba(201,168,76,0.13)", display:"flex", flexDirection:"column", height:"100%", boxShadow:"2px 0 24px rgba(0,0,0,0.5)" }}>

        {/* Logo */}
        <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid rgba(201,168,76,0.10)", flexShrink:0 }}>
          <div style={{ fontSize:20, lineHeight:1 }}>🐉</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"8px 4px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {MAIN_TABS.filter(t => !["char","companions","proficiencies"].includes(t.id)).map(t => (
            <button key={t.id} title={t.label} onClick={() => setTab(t.id)} style={snb(tab===t.id)}>
              {t.icon}
            </button>
          ))}
          <div style={{ marginTop:4, display:"flex", flexDirection:"column", gap:2 }}>
            {/* Charakter-Gruppe Dropdown */}
            <button ref={charBtnRef} title="Charakter" onClick={e => { e.stopPropagation(); toggleChar(); }}
              style={snb(["char","companions","proficiencies"].includes(tab) || charOpen)}>
              📜
            </button>
            {/* Referenz Dropdown */}
            <button ref={refBtnRef} title="Referenz" onClick={e => { e.stopPropagation(); toggleRef(); }} style={snb(isRef)}>
              📚
            </button>
          </div>
        </nav>

        {/* Bottom: export */}
        <div style={{ padding:"10px 4px 20px", borderTop:"1px solid rgba(201,168,76,0.10)", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <button title="JSON exportieren" onClick={exportJSON} style={{ fontSize:16, background:"none", border:"none", cursor:"pointer", color:C.tealBright, opacity:active?1:0.3, padding:"6px 0", width:"100%" }}>⬇️</button>
          <button title="PDF exportieren"  onClick={exportPDF}  style={{ fontSize:16, background:"none", border:"none", cursor:"pointer", color:C.amberBright, opacity:active?1:0.3, padding:"6px 0", width:"100%" }}>📄</button>
        </div>
      </aside>

      {/* Charakter dropdown popover */}
      {charOpen && (
        <div onClick={e => e.stopPropagation()} style={{ position:"fixed", left:62, top:charPos.top, zIndex:9999, background:C.card, border:`1px solid ${C.gold}44`, borderRadius:10, padding:6, minWidth:190, boxShadow:"0 8px 32px rgba(0,0,0,0.8)" }}>
          {[{ id:"char", label:"Charakter", icon:"📜" }, { id:"companions", label:"Begleiter", icon:"🐾" }, { id:"proficiencies", label:"Übungsbonus", icon:"🎓" }].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setCharOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", background:tab===t.id?`${C.gold}22`:"transparent", border:"none", borderRadius:7, color:tab===t.id?C.gold:C.textBright, fontFamily:FH, fontSize:11, padding:"9px 12px", cursor:"pointer", transition:"all .15s" }}>
              <span style={{ fontSize:15 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Referenz dropdown popover */}
      {refOpen && (
        <div onClick={e => e.stopPropagation()} style={{ position:"fixed", left:62, top:refPos.top, zIndex:9999, background:C.card, border:`1px solid ${C.purple}44`, borderRadius:10, padding:6, minWidth:190, boxShadow:"0 8px 32px rgba(0,0,0,0.8)" }}>
          {REF_TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setRefOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", background:tab===t.id?`${C.purple}33`:"transparent", border:"none", borderRadius:7, color:tab===t.id?C.purpleBright:C.textBright, fontFamily:FH, fontSize:11, padding:"9px 12px", cursor:"pointer", transition:"all .15s" }}>
              <span style={{ fontSize:15 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Main column */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <OfflineBanner />
        <CharHeader restBanner={restBanner} setRestBanner={setRestBanner} restHpInput={restHpInput} setRestHpInput={setRestHpInput} setSlots={setSlots} setCustom={setCustom} autoUsed={autoUsed} setAutoUsed={setAutoUsed} />
        <main style={{ flex:1, overflowY:"auto", padding:"14px 16px", boxSizing:"border-box" }}>
          {content}
        </main>
      </div>
    </div>
  );

  // ── Mobile ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg, fontFamily:F, color:C.text, overflowX:"hidden" }}>
      <OfflineBanner />
      <CharHeader restBanner={restBanner} setRestBanner={setRestBanner} restHpInput={restHpInput} setRestHpInput={setRestHpInput} setSlots={setSlots} setCustom={setCustom} autoUsed={autoUsed} setAutoUsed={setAutoUsed} />

      {/* Main content — click closes sub-menu */}
      <main
        style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"12px", boxSizing:"border-box" }}
        onClick={() => mobileMenu && setMobileMenu(null)}
      >
        <div style={{ width:"100%", maxWidth:"100%" }}>
          {content}
          {tab === "char" && active && (
            <div style={{ marginTop:12, padding:"12px 14px", background:C.card, borderRadius:12, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, color:C.textDim, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Charakter speichern</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={exportJSON} style={{ ...sx.btn(C.teal), flex:1, fontSize:12 }}>⬇️ JSON exportieren</button>
                <button onClick={exportPDF}  style={{ ...sx.btn(C.amber), flex:1, fontSize:12 }}>📄 PDF drucken</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sub-menu panel — appears between content and nav */}
      {mobileMenu && (() => {
        const group = MOBILE_NAV.find(n => n.id === mobileMenu);
        if (!group?.children) return null;
        return (
          <div style={{
            background: "linear-gradient(180deg,#1e1a2e 0%,#18142a 100%)",
            borderTop: `1px solid ${C.border}`,
            padding: "12px",
            flexShrink: 0,
          }}>
            {/* Handle bar */}
            <div style={{ width:32, height:3, background:C.border, borderRadius:2, margin:"0 auto 10px" }} />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:7 }}>
              {group.children.map(child => {
                const isActive = tab === child.id;
                return (
                  <button key={child.id}
                    onClick={() => { setTab(child.id); setMobileMenu(null); }}
                    style={{
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      gap:5, padding:"11px 6px", borderRadius:11, cursor:"pointer",
                      background: isActive ? `${C.purple}33` : C.surface,
                      border: `1px solid ${isActive ? C.purpleBright + "88" : C.border}`,
                      color: isActive ? C.purpleBright : C.text,
                      boxShadow: isActive ? `0 0 12px ${C.purple}44` : "none",
                      transition: "all .15s",
                    }}>
                    <span style={{ fontSize:22 }}>{child.icon}</span>
                    <span style={{ fontSize:10, fontFamily:FH, letterSpacing:0.4, textAlign:"center", lineHeight:1.2 }}>{child.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Bottom nav — 5 grouped tabs */}
      <nav style={{
        background: "linear-gradient(0deg,#1a1526 0%,#100d18 100%)",
        borderTop: "1px solid rgba(201,168,76,0.13)",
        display: "flex", flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom,0px)",
      }}>
        {MOBILE_NAV.map(item => {
          const isGroup      = !!item.groupIds;
          const isMenuOpen   = mobileMenu === item.id;
          const isGroupActive = isGroup && (item.groupIds.includes(tab) || isMenuOpen);
          const isActive     = isGroup ? isGroupActive : tab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isGroup) {
                  setMobileMenu(isMenuOpen ? null : item.id);
                } else {
                  setTab(item.id);
                  setMobileMenu(null);
                }
              }}
              style={{
                flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:2, padding:"7px 2px 8px", cursor:"pointer",
                background: "none", border: "none",
                color: isActive ? C.purpleBright : C.textDim,
                fontFamily: FH, transition: "color .15s",
                position: "relative",
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div style={{ position:"absolute", top:4, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:C.purpleBright }} />
              )}
              <span style={{ fontSize: isGroup && item.id === "more" ? 15 : 18, lineHeight:1 }}>
                {item.icon}
              </span>
              <span style={{ fontSize:8, letterSpacing:0.3, lineHeight:1 }}>
                {item.label}{isGroup && <span style={{ fontSize:7, opacity:0.6 }}> {isMenuOpen ? "▴" : "▾"}</span>}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <CharProvider>
      <CombatProvider>
        <AppInner />
      </CombatProvider>
    </CharProvider>
  );
}
