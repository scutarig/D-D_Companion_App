import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useChar } from "../context/CharContext.jsx";
import { modOf, modStr, getPB } from "../utils/helpers.js";
import { getExhaustionLevel } from "../data/exhaustion.js";
import { requiresConcentration, startConcentration, breakConcentration } from "../utils/concentration.js";
import ConcentrationBanner from "./ConcentrationBanner.jsx";
import WildShapePanel from "./WildShape/WildShapePanel.jsx";
import { useMulticlass } from "../hooks/useMulticlass.js";
import { computeAllResources } from "../data/classResources.js";
import { SPELLS } from "../data/spells.js";
import { useCompanions } from "../hooks/useCompanions.js";
import { typeOf } from "./Companions/CompanionCard.jsx";
import { useProficiencies } from "../hooks/useProficiencies.js";
import { calculateProficiencyBonus, PROF_CATEGORIES } from "../utils/proficiency.js";
import { useDerivedStats } from "../hooks/useDerivedStats.js";
import { useI18n } from "../i18n/index.js";
import DerivedStatsWidget from "./CharacterSheet/DerivedStatsWidget.jsx";
import SkillsCard from "./CharacterSheet/SkillsCard.jsx";
import LanguagesCard from "./CharacterSheet/LanguagesCard.jsx";
import ConditionsCard from "./CharacterSheet/ConditionsCard.jsx";
import ActionsRefCard from "./CharacterSheet/ActionsRefCard.jsx";
import HitDiceCard from "./CharacterSheet/HitDiceCard.jsx";
import StatusStrip from "./CharacterSheet/StatusStrip.jsx";
import WealthModal from "./CharacterSheet/WealthModal.jsx";

const RARITY_COL = {
  Common: C.textDim, Uncommon: C.greenBright, Rare: C.blueBright,
  "Very Rare": C.purpleBright, Legendary: C.amberBright,
};
const RARITY_GLOW = {
  Common: "none", Uncommon: "0 0 8px #00c04033", Rare: "0 0 10px #3b82f655",
  "Very Rare": "0 0 12px #a855f766", Legendary: "0 0 16px #f59e0b88",
};
const SLOT_LABELS = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const SLOT_DEF = {
  head:  { label:"Kopf",      key:"inv.slot_head",   icon:"👑" }, neck:  { label:"Hals",      key:"inv.slot_neck",   icon:"📿" },
  chest: { label:"Brust",     key:"inv.slot_chest",  icon:"🧥" }, back:  { label:"Rücken",    key:"inv.slot_back",   icon:"🎒" },
  hands: { label:"Hände",     key:"inv.slot_hands",  icon:"🧤" }, ring1: { label:"Ring L",    key:"inv.slot_ring_l", icon:"💍" },
  ring2: { label:"Ring R",    key:"inv.slot_ring_r", icon:"💍" }, main:  { label:"Haupthand", key:"inv.slot_main",   icon:"⚔️" },
  off:   { label:"Nebenhand", key:"inv.slot_off",    icon:"🛡️" }, feet:  { label:"Füße",      key:"inv.slot_feet",   icon:"👢" },
};
const EQ_TYPES = ["Weapon","Armor","Potion","Gear","Tool","Item","Ring","Wand","Staff","Scroll"];
const EQ_ICON  = { Weapon:"⚔️", Armor:"🛡️", Potion:"🧪", Gear:"⚙️", Tool:"🔧", Item:"📦", Ring:"💍", Wand:"🪄", Staff:"🔱", Scroll:"📜" };

const isTwoHanded = item => {
  if (!item) return false;
  const n = (item.notes || "").toLowerCase();
  return n.includes("zweihändig") && !n.includes("vielseitig");
};
const getCompatibleSlots = item => {
  if (!item) return [];
  const t    = item.type  || "";
  const sub  = (item.sub  || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  if (t === "Weapon") return isTwoHanded(item) ? ["main"] : ["main","off"];
  if (t === "Armor")  return sub === "shield" ? ["off"] : ["chest"];
  if (t === "Ring")   return ["ring1","ring2"];
  if (t === "Wand")   return ["main","off"];
  if (t === "Staff")  return ["main"];
  if (t === "Scroll") return ["main","off"];
  if (t === "Item" || t === "Gear") {
    if (["potion","ammo","tool","gear","focus"].includes(sub)) return [];
    if (sub === "scroll") return ["main","off"];
    if (/ring|siegelring/.test(name))                  return ["ring1","ring2"];
    if (/amulett|halsband|kette|anhänger/.test(name))  return ["neck"];
    if (/handschuh|gauntlet|armschiene/.test(name))    return ["hands"];
    if (/stiefel|schuhe?|sandalen/.test(name))         return ["feet"];
    if (/umhang|tarnumhang|mantel/.test(name))         return ["back","neck"];
    if (/stirnband|krone|diadem|helm/.test(name))      return ["head"];
    if (/beutel|rucksack/.test(name))                  return ["back"];
    if (sub === "magic") {
      if (item.dmg && item.dmg !== "—") return ["main","off"];
      if (item.ac  && item.ac  !== "—") return ["chest"];
      return ["head","neck","chest","back","hands","ring1","ring2","feet"];
    }
  }
  return [];
};

function hpAccent(hp, max) { const p = hp / max; return p > 0.5 ? C.green : p > 0.25 ? C.amber : C.red; }
function hpText(hp, max)   { const p = hp / max; return p > 0.5 ? C.greenBright : p > 0.25 ? C.amberBright : C.redBright; }

function HoldBtn({ label, onPress, style }) {
  const t = useRef(null), iv = useRef(null);
  const start = e => { e.preventDefault(); onPress(); t.current = setTimeout(() => { iv.current = setInterval(onPress, 80); }, 400); };
  const stop  = () => { clearTimeout(t.current); clearInterval(iv.current); t.current = null; iv.current = null; };
  // Cleanup if unmounted mid-hold
  useEffect(() => stop, []);
  return <button type="button" style={style} onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop}>{label}</button>;
}

function InfoModal({ data, onClose }) {
  const { t } = useI18n();
  if (!data) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 560, background: C.card, borderTop: `2px solid ${data.color}`, borderRadius: "18px 18px 0 0", padding: "20px 18px 36px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.85)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: data.color }}>{data.title}</div>
          <button type="button" onClick={onClose} style={{ ...sx.bsm(C.textDim), fontSize: 14, padding: "6px 12px" }}>{t("dash.close_modal","✕ Schließen")}</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: data.stats?.length || data.desc ? 14 : 0 }}>
          {data.badges?.map((b, i) => <span key={i} style={sx.tag(b.col || data.color)}>{b.label}</span>)}
        </div>
        {data.stats?.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.stats.length, 3)}, 1fr)`, gap: 8, marginBottom: 14 }}>
            {data.stats.map((s, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.col || C.textBright }}>{s.val}</div>
              </div>
            ))}
          </div>
        )}
        {data.desc && <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>{data.desc}</div>}
      </div>
    </div>
  );
}

export default function CombatDashboard({ slots, setSlots, custom, setCustom, autoUsed = {}, setAutoUsed = () => {} }) {
  const { t } = useI18n();
  const slotLabel = (sd) => sd?.key ? t(sd.key, sd.label) : (sd?.label || "");
  const { active: char, setActive: setChar, aid } = useChar();
  const { companions, updateHp: updateCompanionHp } = useCompanions(aid);
  const { proficiencies } = useProficiencies(aid);
  const derivedStats = useDerivedStats(char, proficiencies);
  const { classes } = useMulticlass(aid, char, null);
  const autoResources = computeAllResources(classes, char);
  const setAutoUsedR = (id, used) => setAutoUsed(p => ({ ...p, [id]: used }));
  const [prepIds, setPrepIds]       = useState([]);
  const [knownIds, setKnownIds]     = useState([]);
  const [castModal, setCastModal]   = useState(null);
  const [tempHpModal, setTempHpModal] = useState(false);
  const [tempHpInput, setTempHpInput] = useState("");
  const [infoModal, setInfoModal]   = useState(null);
  const [showWealthModal, setShowWealthModal] = useState(false);
  const isMobile = useIsMobile(900);
  const [eqModal,    setEqModal]    = useState(null);
  const [eqStep,     setEqStep]     = useState("pick");
  const [eqItem,     setEqItem]     = useState(null);
  const [eqNew,      setEqNew]      = useState({ name:"", type:"Weapon", dmg:"", ac:"", eff:"", rar:"Common", notes:"" });
  const [eqSearch,   setEqSearch]   = useState("");
  const [eqType,     setEqType]     = useState("All");
  const [swapModal,  setSwapModal]  = useState(null);
  const [swapSearch, setSwapSearch] = useState("");
  const [swapType,   setSwapType]   = useState("All");
  const [eqInfoModal, setEqInfoModal] = useState(null);
  const [concWarn,   setConcWarn]   = useState(null); // { spell, slotLv } pending cast

  // Auto-break concentration when unconscious or dead
  // Deps via String-Hash, damit jeder Re-Mount des activeConditions-Arrays
  // (neue Array-Ref bei usePersist-Reload) keinen Loop auslöst.
  const conditionsHash = (char?.activeConditions || []).join(",");
  useEffect(() => {
    if (!char?.concentration) return;
    const isUnconscious = (char?.activeConditions || []).includes("unconscious");
    if (char?.hp === 0 || isUnconscious) {
      setChar(p => breakConcentration(p));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char?.hp, conditionsHash, char?.concentration]);

  // handleCast — checks concentration before spending slot
  const handleCast = (spell, slotLv) => {
    if (requiresConcentration(spell) && char?.concentration) {
      setConcWarn({ spell, slotLv });
      return;
    }
    useSlot(slotLv);
    if (requiresConcentration(spell)) {
      setChar(p => startConcentration(p, spell, slotLv));
    }
  };

  // handleRitualCast — no slot consumed, +10 minutes
  const handleRitualCast = (spell) => {
    if (requiresConcentration(spell) && char?.concentration) {
      setConcWarn({ spell, slotLv: null, ritual: true });
      return;
    }
    if (requiresConcentration(spell)) {
      setChar(p => startConcentration(p, spell, spell.lv));
    }
  };

  useEffect(() => {
    if (!aid && aid !== 0) return;
    const getVal = async key => {
      try {
        if (window.storage) { const r = await window.storage.get(key); return r?.value ? JSON.parse(r.value) : []; }
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : [];
      } catch { return []; }
    };
    (async () => {
      setPrepIds(await getVal(`spells_prep_${aid}`));
      setKnownIds(await getVal(`spells_known_${aid}`));
    })();
  }, [aid]);

  if (!char) return null;

  const pb      = getPB(char.level);
  const hpAcc   = hpAccent(char.hp, char.maxHp);
  const hpTxt   = hpText(char.hp, char.maxHp);
  const hpPct   = char.hp / char.maxHp;
  const isDying    = char.hp === 0;
  const exhaustLv  = char.exhaustion || 0;
  const exhaustInfo = exhaustLv > 0 ? getExhaustionLevel(exhaustLv) : null;
  const modHp     = d => setChar(p => ({ ...p, hp: Math.max(0, Math.min(p.maxHp, p.hp + d)) }));
  const modTempHp = d => setChar(p => ({ ...p, tempHp: Math.max(0, (p.tempHp || 0) + d) }));

  // Total GP equivalent — used by StatusStrip pill. Per-coin editing happens
  // in WealthModal (which owns its own CURR list to stay self-contained).
  const totalGP =
    (char.pp || 0) * 10 +
    (char.gold || 0) +
    (char.electrum || 0) * 0.5 +
    (char.silver || 0) * 0.1 +
    (char.copper || 0) * 0.01;

  const equipped       = Object.entries(char.equipSlots || {}).filter(([, v]) => v).map(([slot, item]) => ({ slot, item }));
  const preparedSpells = SPELLS.filter(s => prepIds.includes(s.id) && s.lv > 0);
  const cantrips       = SPELLS.filter(s => knownIds.includes(s.id) && s.lv === 0);

  const availSlots = lv => { const s = slots.find(x => x.lv === lv); return s ? s.tot - s.used : 0; };
  const useSlot    = lv => setSlots(p => p.map(x => x.lv === lv && x.used < x.tot ? { ...x, used: x.used + 1 } : x));

  const HP_BTNS = [
    { label: "−5", fn: () => modHp(-5), bg: C.red   + "33", border: C.redBright   + "77", col: C.redBright   },
    { label: "−1", fn: () => modHp(-1), bg: C.red   + "18", border: C.border,              col: C.text        },
    { label: "+1", fn: () => modHp(1),  bg: C.green + "18", border: C.border,              col: C.text        },
    { label: "+5", fn: () => modHp(5),  bg: C.green + "33", border: C.greenBright + "77", col: C.greenBright },
  ];
  const TEMP_BTNS = [
    { label: "−5", fn: () => modTempHp(-5), bg: C.blue + "33", border: C.blueBright + "77",    col: C.blueBright  },
    { label: "−1", fn: () => modTempHp(-1), bg: C.blue + "18", border: C.border,               col: C.text        },
    { label: "+1", fn: () => modTempHp(1),  bg: C.blue + "18", border: C.border,               col: C.text        },
    { label: "+5", fn: () => modTempHp(5),  bg: C.blue + "33", border: C.blueBright + "77",    col: C.blueBright  },
  ];

  const ctStyle = { fontFamily: FH, fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${C.gold}44`, paddingBottom: 6, marginBottom: 10 };
  const lbl     = { fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase" };

  return (
    <div>
      {/* ── VITALS: Kompakte Vollbreite-Karte ── */}
      <div style={{ ...sx.card, border: `2px solid ${hpAcc}`, marginBottom: 10 }}>

        {/* Zeile 1: HP + alle Kampfwerte in einer Reihe */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
          {/* HP Zahl */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 3, flex: "0 0 auto" }}>
            <span style={{ fontSize: 11, color: C.textDim, marginRight: 2 }}>❤️</span>
            <input type="number" min={0} max={char.maxHp} value={char.hp}
              onChange={e => setChar(p => ({ ...p, hp: Math.max(0, Math.min(p.maxHp, +e.target.value || 0)) }))}
              style={{ fontSize: 40, fontWeight: 800, color: hpTxt, lineHeight: 1, background: "transparent", border: "none", outline: "none", width: 74, fontFamily: FH, transition: "color .3s", padding: 0 }} />
            {(char.tempHp || 0) > 0 && <span style={{ fontSize: 15, fontWeight: 700, color: C.blueBright }}>+{char.tempHp}</span>}
            <span style={{ fontSize: 15, color: C.textDim, margin: "0 1px" }}>/</span>
            <input type="number" min={1} max={999} value={char.maxHp}
              onChange={e => { const m = Math.max(1, +e.target.value || 1); setChar(p => ({ ...p, maxHp: m, hp: Math.min(p.hp, m) })); }}
              style={{ fontSize: 14, fontWeight: 600, color: C.text, background: "transparent", border: "none", outline: "none", width: 46, padding: 0 }} />
          </div>

          {/* Trennlinie */}
          <div style={{ width: 1, height: 34, background: C.border, flexShrink: 0 }} />

          {/* AC */}
          <div style={{ textAlign: "center", flex: "0 0 auto" }}>
            <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>🛡 AC</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, fontFamily: FH, lineHeight: 1.1 }}>{char.ac}</div>
          </div>

          {/* Init */}
          <div style={{ textAlign: "center", flex: "0 0 auto" }}>
            <div style={{ fontSize: 9, color: C.blueBright, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>⚡ Init</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.blueBright, fontFamily: FH, lineHeight: 1.1 }}>{modStr(modOf(char.dex || 10) + (char.initiative || 0))}</div>
          </div>

          {/* Speed */}
          <div style={{ textAlign: "center", flex: "0 0 auto" }}>
            <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>💨 Speed</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FH, lineHeight: 1.1 }}>{char.speed || 30}<span style={{ fontSize: 10, fontWeight: 400 }}>ft</span></div>
          </div>

          {/* Inspiration toggle — ✨ glows when held, dim otherwise. Click toggles. */}
          <button type="button"
            onClick={() => setChar(p => ({ ...p, inspiration: !p.inspiration }))}
            title={char.inspiration
              ? t("dash.inspiration_spend","Inspiration ausgeben (Vorteil auf 1 Wurf)")
              : t("dash.inspiration_gain","Inspiration erhalten")}
            aria-pressed={!!char.inspiration}
            style={{
              flex: "0 0 auto",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "3px 9px",
              borderRadius: 8,
              border: `1px solid ${char.inspiration ? C.amberBright + "aa" : C.border}`,
              background: char.inspiration ? `${C.amberBright}22` : "transparent",
              boxShadow: char.inspiration ? `0 0 10px ${C.amberBright}66` : "none",
              cursor: "pointer",
              transition: "all .2s",
              fontFamily: "inherit",
            }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
              color: char.inspiration ? C.amberBright : C.textDim,
            }}>✨ {t("dash.inspiration_short","Insp.")}</div>
            <div style={{
              fontSize: 14, fontWeight: 700, fontFamily: FH, lineHeight: 1.1,
              color: char.inspiration ? C.amberBright : C.textDim,
            }}>{char.inspiration ? "✓" : "—"}</div>
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* TempHP */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, flex: "0 0 auto" }}>
            <span style={{ fontSize: 9, color: C.blueBright, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>💙 Temp</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: (char.tempHp || 0) > 0 ? C.blueBright : C.textDim, fontFamily: FH, minWidth: 18 }}>{char.tempHp || 0}</span>
            <button type="button" onClick={() => { setTempHpInput(String(char.tempHp || "")); setTempHpModal(true); }}
              style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, border: `1px solid ${C.blueBright}44`, background: `${C.blueBright}10`, color: C.blueBright, cursor: "pointer" }}>±</button>
          </div>

          {isDying && (
            <span style={{ fontSize: 10, color: C.redBright, background: `${C.red}33`, border: `1px solid ${C.redBright}55`, borderRadius: 5, padding: "2px 7px", fontWeight: 700, flex: "0 0 auto" }}>{t("dash.unconscious","☠ Kampfunfähig")}</span>
          )}
          {exhaustInfo && (
            <span style={{ fontSize: 10, color: exhaustInfo.color, background: `${exhaustInfo.color}22`, border: `1px solid ${exhaustInfo.color}55`, borderRadius: 5, padding: "2px 7px", fontWeight: 700, flex: "0 0 auto" }}>
              {exhaustInfo.icon} {t("dash.exhaustion","Erschöpfung")} {exhaustLv}/6
            </span>
          )}
          <button type="button" onClick={() => setChar(p => ({ ...p, hp: p.maxHp }))} style={{ ...sx.tag(hpTxt), cursor: "pointer", fontSize: 10, flex: "0 0 auto" }}>⟳ Max</button>
        </div>

        {/* Concentration Banner */}
        <ConcentrationBanner char={char} setChar={setChar} />

        {/* HP Bar */}
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 5, height: 6, overflow: "hidden", display: "flex", marginBottom: 8 }}>
          <div style={{ height: "100%", background: hpTxt, width: `${Math.min(100, hpPct * 100)}%`, transition: "width .3s, background .3s", boxShadow: `0 0 8px ${hpTxt}66` }} />
          {(char.tempHp || 0) > 0 && (
            <div style={{ height: "100%", background: C.blueBright, width: `${Math.min(100 - Math.min(100, hpPct * 100), ((char.tempHp || 0) / char.maxHp) * 100)}%` }} />
          )}
        </div>

        {/* Zeile 3: HP-Buttons + TempHP-Buttons kombiniert */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {HP_BTNS.map(b => (
            <HoldBtn key={b.label} label={b.label} onPress={b.fn}
              style={{ flex: 1, height: 32, fontSize: 12, fontWeight: 700, background: b.bg, border: `1px solid ${b.border}`, color: b.col, borderRadius: 7, cursor: "pointer" }} />
          ))}
          <div style={{ width: 1, background: C.border, alignSelf: "stretch", margin: "2px 0" }} />
          {TEMP_BTNS.map(b => (
            <HoldBtn key={`t${b.label}`} label={b.label} onPress={b.fn}
              style={{ width: 34, height: 32, fontSize: 11, fontWeight: 700, background: b.bg, border: `1px solid ${b.border}`, color: b.col, borderRadius: 7, cursor: "pointer" }} />
          ))}
        </div>
      </div>

      {/* ── Unified 2-col panel ──
          Desktop (≥900 px): 320 px sidebar with ALL narrow widgets
          stacked continuously — Status box (shared grey card around
          StatusStrip+Conditions+HitDice+Languages), then Equipment,
          Resources, WildShape. Right column carries the wide content:
          DerivedStats → Skills → ActionsRef → Magic/Spells. Columns
          flow independently so a long inventory in the sidebar doesn't
          push the spells panel down.
          Mobile (<900 px): grid collapses to one column; everything
          stacks in the JSX-order it appears below. */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "320px minmax(0, 1fr)",
        gap: isMobile ? 0 : 12,
        marginBottom: 12,
        alignItems: "start",
      }}>
        {/* LEFT SIDEBAR — status, equipment, resources, wildshape */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Status box: one shared grey card around the four thin
              state widgets so they read as a single grouped panel
              instead of four loose rows. */}
          <div style={sx.card}>
            <StatusStrip char={char} setChar={setChar} totalGP={totalGP}
              onOpenWealth={() => setShowWealthModal(true)} />
            <ConditionsCard char={char} setChar={setChar} />
            <HitDiceCard char={char} setChar={setChar} />
            <LanguagesCard char={char} />
          </div>

          <div style={sx.card}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={ctStyle}>{t("dash.equipment_header","⚔️ Ausrüstung")}</div>
              <button type="button" onClick={() => { setEqModal("list"); setEqStep("pick"); setEqItem(null); setEqSearch(""); setEqType("All"); }}
                style={{ ...sx.bsm(C.teal), fontSize:11, fontWeight:700 }}>{t("dash.equip_btn","＋ Anlegen")}</button>
            </div>
            {equipped.length === 0 ? (
              <div style={{ fontSize:12, color:C.textDim, fontStyle:"italic" }}>{t("dash.no_equipment","Nichts ausgerüstet — ＋ Anlegen drücken")}</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {equipped.map(({ slot, item }) => {
                  const col = RARITY_COL[item.rar] || C.textDim;
                  const sd  = SLOT_DEF[slot] || { label:slot, icon:"📦" };
                  return (
                    <div key={slot} style={{ background:C.surface, borderRadius:9, padding:"8px 10px", borderLeft:`3px solid ${col}`, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{EQ_ICON[item.type]||"📦"}</span>
                      <div style={{ flex:1, minWidth:0, cursor:"pointer" }}
                        onClick={() => setEqInfoModal({ ...item, _slotId: slot, _slotLabel: slotLabel(sd), _slotIcon: sd.icon })}>
                        <div style={{ fontSize:13, fontWeight:600, color:col, fontFamily:FH, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        <div style={{ fontSize:10, color:C.textDim }}>{sd.icon} {slotLabel(sd)}</div>
                      </div>
                      <button type="button" onClick={() => { setSwapModal({slot,item}); setSwapSearch(""); setSwapType("All"); }}
                        style={{ background:`${C.amber}18`, border:`1px solid ${C.amber}44`, borderRadius:6, padding:"3px 8px", cursor:"pointer", fontSize:12, color:C.amber, flexShrink:0 }}>↔</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {custom.length > 0 && (
            <div style={sx.card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={ctStyle}>{t("dash.resources_header","🏷️ Ressourcen")}</div>
                <button type="button" onClick={() => setCustom(p => p.map(tk => ({ ...tk, used: 0 })))} style={sx.bsm(C.gold)}>↺ Reset</button>
              </div>
              {custom.map(tok => (
                <div key={tok.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: tok.color, fontFamily: FH, fontWeight: 700 }}>
                      {tok.name}{tok.tier && <span style={{ color: C.textDim, fontWeight: 400, fontSize: 10 }}> ({tok.tier})</span>}
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: C.textDim }}>{tok.tot - tok.used}/{tok.tot}</span>
                      <button type="button" onClick={() => setCustom(p => p.map(tk => tk.id === tok.id ? { ...tk, used: 0 } : tk))} style={sx.bsm(C.goldDim)}>↺</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {Array.from({ length: tok.tot }).map((_, i) => (
                      <button type="button" key={i}
                        onClick={() => setCustom(p => p.map(tk => tk.id === tok.id ? { ...tk, used: i < tk.used ? i : i + 1 } : tk))}
                        style={{ width: 20, height: 20, borderRadius: "50%", cursor: "pointer", border: `2px solid ${tok.color}`, background: i < tok.used ? "transparent" : tok.color, transition: "background .15s" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WildShape / Polymorph — moved into sidebar so it slots
              underneath equipment instead of starting a new full-width
              row of its own. */}
          <div style={sx.card}>
            <div style={{ fontFamily: FH, fontSize: 12, color: C.purpleBright, fontWeight: 700, letterSpacing: 0.5, marginBottom: 10 }}>
              {t("dash.wild_shape_polymorph","🐺 WILD SHAPE & POLYMORPH")}
            </div>
            <WildShapePanel compact={true} />
          </div>
        </div>

        {/* RIGHT MAIN — combat stats, skills, actions, then spells */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DerivedStatsWidget stats={derivedStats} isMobile={isMobile} />
          <SkillsCard char={char} pb={getPB(char.level || 1)} />
          <ActionsRefCard char={char} />

          <div style={sx.card}>
            <div style={ctStyle}>{t("dash.magic_header","🔮 Magie & Ressourcen")}</div>

          {/* Class Resources (Rage, Ki, Sorcery, etc.) */}
          {autoResources.length > 0 && (
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: C.amberBright, fontFamily: FH, fontWeight: 700, letterSpacing: 0.5 }}>{t("dash.class_resources_header","⚡ KLASSEN-RESSOURCEN")}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {autoResources.map(r => {
                  const maxNum = typeof r.max === "number" ? r.max : null;
                  const used = autoUsed[r.id] || 0;
                  if (maxNum === null) {
                    return (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: FH, fontSize: 12, color: r.color, fontWeight: 700, minWidth: 130 }}>{r.name}</span>
                        <span style={{ fontSize: 11, color: r.color, fontStyle: "italic" }}>{r.max}</span>
                        <span style={{ fontSize: 9, color: C.textDim, marginLeft: "auto" }}>{r.reset === "short" ? t("dash.short_rest_short","K.Rast") : t("dash.long_rest_short","L.Rast")}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: FH, fontSize: 12, color: r.color, fontWeight: 700, minWidth: 130 }}>{r.name}</span>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {Array.from({ length: maxNum }).map((_, i) => (
                          <button type="button" key={i}
                            onClick={() => setAutoUsedR(r.id, i < used ? i : i + 1)}
                            title={`${r.name} ${i < (maxNum - used) ? t("dash.spend_word","verbrauchen") : t("dash.restore_word","wiederherstellen")}`}
                            style={{ width: 18, height: 18, borderRadius: 4, cursor: "pointer", border: `2px solid ${r.color}`, background: i < used ? "transparent" : r.color, transition: "background .15s", padding: 0 }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: C.textDim }}>{maxNum - used}/{maxNum}</span>
                      <span style={{ fontSize: 9, color: C.textDim, marginLeft: "auto" }}>{r.reset === "short" ? t("dash.short_rest_short","K.Rast") : t("dash.long_rest_short","L.Rast")}</span>
                      <button type="button" onClick={() => setAutoUsedR(r.id, 0)} style={{ ...sx.bsm(C.goldDim), fontSize: 10, padding: "1px 6px" }}>↺</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cantrips */}
          {cantrips.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              <span style={lbl}>{t("dash.cantrips_word","Cantrips")}</span>
              {cantrips.map(c => (
                <button type="button" key={c.id}
                  onClick={() => setInfoModal({ title: c.name, color: C.tealBright, badges: [{ label: c.school, col: C.tealBright }, { label: c.ct, col: C.textDim }, { label: c.range, col: C.textDim }], stats: [c.dmg !== "—" && { label: t("dash.damage_label","Schaden"), val: c.dmg, col: C.redBright }].filter(Boolean), desc: c.desc })}
                  style={{ ...sx.tag(C.tealBright), cursor: "pointer", fontSize: 12, padding: "3px 10px" }}>{c.name}</button>
              ))}
            </div>
          )}

          {/* Slot bar */}
          {slots.some(s => s.tot > 0) && (
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {slots.filter(s => s.tot > 0).map(s => {
                  const avail = s.tot - s.used;
                  return (
                    <div key={s.lv} style={{ textAlign: "center" }}>
                      <div style={{ ...lbl, marginBottom: 4 }}>LV{s.lv}</div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {Array.from({ length: s.tot }).map((_, i) => (
                          <button type="button" key={i}
                            onClick={() => setSlots(p => p.map(x => x.lv === s.lv ? { ...x, used: i < (x.tot - x.used) ? x.used + 1 : Math.max(0, x.used - 1) } : x))}
                            style={{ width: 14, height: 14, borderRadius: 3, cursor: "pointer", border: `1.5px solid ${C.purpleBright}`, background: i < avail ? C.purpleBright : "transparent", transition: "background .15s" }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spell list */}
          {preparedSpells.length === 0 ? (
            <div style={{ fontSize: 12, color: C.textDim, fontStyle: "italic" }}>{t("dash.no_prepared_hint","Keine Zauber vorbereitet (Charakter → Spellbook → 🕯️)")}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {preparedSpells.map(spell => {
                const lowestSlot = slots.find(sl => sl.lv >= spell.lv && sl.tot > 0 && sl.tot > sl.used);
                const canCast    = !!lowestSlot;
                const canRitual  = !!spell.ritual;
                const rowActive  = canCast || canRitual;
                return (
                  <div key={spell.id}
                    style={{ background: rowActive ? C.surface : C.bg, borderRadius: 10, border: `1px solid ${rowActive ? C.border : C.border + "66"}`, padding: "10px 14px", opacity: rowActive ? 1 : 0.5, transition: "opacity .2s", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, cursor: "pointer" }}
                    onClick={() => setInfoModal({ title: spell.name, color: C.purpleBright, badges: [{ label: `Level ${spell.lv}`, col: C.purpleBright }, { label: spell.school, col: C.textDim }, { label: spell.ct, col: C.textDim }, { label: spell.dur, col: C.amberBright }], stats: [spell.dmg !== "—" && { label: t("dash.damage_label","Schaden"), val: spell.dmg, col: C.redBright }, { label: t("dash.range_label","Reichweite"), val: spell.range, col: C.text }, { label: t("dash.components_label","Komp."), val: spell.comp, col: C.textDim }, spell.upcast?.length && { label: "Upcast", val: t("dash.scales_label","Skaliert"), col: C.amberBright }].filter(Boolean), desc: spell.desc })}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: rowActive ? C.textBright : C.text }}>{spell.name}</span>
                        <span style={sx.tag(C.purpleBright)}>Lv{spell.lv}</span>
                        <span style={{ fontSize: 11, color: C.textDim }}>{spell.school}</span>
                        {spell.ritual && <span style={{ fontSize: 9, color: C.amberBright, background: `${C.amberBright}22`, border: `1px solid ${C.amberBright}55`, borderRadius: 3, padding: "0 4px", fontWeight: 700 }}>ℛ</span>}
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.text }}>{spell.dmg !== "—" ? spell.dmg : spell.dur}</span>
                        <span style={{ fontSize: 11, color: C.textDim }}>· {spell.range}</span>
                        {spell.upcast?.length > 0 && <span style={{ fontSize: 11, color: C.amberBright }}>{t("dash.scales_word","↑ Skaliert")}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
                      {spell.upcast?.length > 0 && canCast && (
                        <button type="button" onClick={() => setCastModal({ spell })}
                          style={{ ...sx.tag(C.amberBright), cursor: "pointer" }}>{t("dash.upcast_word","↑ Upcast")}</button>
                      )}
                      {spell.ritual && (
                        <button type="button" onClick={() => handleRitualCast(spell)}
                          style={{ padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 600, background: `${C.amberBright}18`, border: `1px solid ${C.amberBright}55`, color: C.amberBright, whiteSpace: "nowrap" }}>
                          {requiresConcentration(spell) && char?.concentration ? "⚠️ " : ""}ℛ +10 Min.
                        </button>
                      )}
                      <button type="button" disabled={!canCast} onClick={() => canCast && handleCast(spell, lowestSlot.lv)}
                        style={{ padding: "5px 14px", borderRadius: 7, cursor: canCast ? "pointer" : "default", fontSize: 12, fontWeight: 600, background: canCast ? `${C.purple}44` : C.bg, border: `1px solid ${canCast ? C.purpleBright : C.border}`, color: canCast ? C.purpleBright : C.textDim, whiteSpace: "nowrap" }}>
                        {canCast
                          ? <>{requiresConcentration(spell) && char?.concentration ? "⚠️ " : ""}{t("dash.cast_at_lv","Wirken Lv{lv}").replace("{lv}", lowestSlot.lv)}</>
                          : t("dash.no_slots_word","Keine Slots")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ── BEGLEITER WIDGET ── */}
      {companions.length > 0 && (
        <div style={sx.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={ctStyle}>{t("dash.companions_header","🐾 Begleiter")}</div>
            <span style={{ fontSize: 10, color: C.textDim }}>
              {companions.filter(c => c.hp > 0).length}/{companions.length} {t("dash.active_count","aktiv")}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {companions.map(c => {
              const cfg = typeOf(c.type);
              const pct = Math.max(0, Math.min(1, c.hp / (c.maxHp || 1)));
              const hpCol = pct > 0.5 ? C.green : pct > 0.25 ? C.amber : C.red;
              const hpTxt = pct > 0.5 ? C.greenBright : pct > 0.25 ? C.amberBright : C.redBright;
              return (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: `${cfg.color}08`, border: `1px solid ${cfg.color}20`,
                  borderLeft: `3px solid ${cfg.color}`, borderRadius: 8, padding: "8px 10px",
                  opacity: c.hp <= 0 ? 0.5 : 1,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name} {c.hp <= 0 && <span style={{ color: C.red }}>☠</span>}
                    </div>
                    <div style={{ height: 3, background: C.surface, borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct * 100}%`, background: hpCol, borderRadius: 2, transition: "width .2s" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <button type="button"
                      onMouseDown={() => updateCompanionHp(c.id, -1)}
                      style={{ ...sx.bsm(C.red), padding: "2px 7px", fontSize: 13, fontWeight: 700 }}
                    >−</button>
                    <span style={{ fontSize: 11, fontWeight: 700, color: hpTxt, minWidth: 36, textAlign: "center" }}>
                      {c.hp}/{c.maxHp}
                    </span>
                    <button type="button"
                      onMouseDown={() => updateCompanionHp(c.id, +1)}
                      style={{ ...sx.bsm(C.green), padding: "2px 7px", fontSize: 13, fontWeight: 700 }}
                    >+</button>
                  </div>
                  <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>{t("dash.ac_short","RK")} {c.ac}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROFICIENCY WIDGET ── */}
      {proficiencies.length > 0 && (() => {
        const profPb = calculateProficiencyBonus(char.level ?? 1);
        // group counts
        const grouped = PROF_CATEGORIES.map(cat => ({
          ...cat,
          items: proficiencies.filter(p => p.category === cat.id),
        })).filter(g => g.items.length > 0);

        return (
          <div style={sx.card}>
            <div style={{ marginBottom: 10 }}>
              <div style={ctStyle}>{t("dash.profs_header","🎓 Proficiencies")}</div>
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {grouped.map(group => (
                <div key={group.id} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: `${group.color}10`, border: `1px solid ${group.color}25`,
                  borderRadius: 20, padding: "4px 10px",
                }}>
                  <span style={{ fontSize: 12 }}>{group.icon}</span>
                  <span style={{ fontSize: 11, color: group.color, fontWeight: 600 }}>{group.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: group.color,
                    background: `${group.color}20`, borderRadius: 8, padding: "0 5px",
                  }}>{group.items.length}</span>
                </div>
              ))}
            </div>

            {/* Expertise highlight */}
            {proficiencies.some(p => p.type === "expertise") && (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {proficiencies.filter(p => p.type === "expertise").map(p => (
                  <span key={p.id} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 700,
                    background: `${C.amber}18`, border: `1px solid ${C.amber}44`, color: C.amberBright,
                  }}>
                    ★ {p.name} <span style={{ color: C.textDim }}>+{profPb * 2}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Equip Modal ── */}
      {eqModal && (() => {
        const inv2 = char.inventory || [];
        const eq2  = char.equipSlots || {};
        const bagItems = inv2.filter(i => !Object.values(eq2).some(s => s?.uid === i.uid) && getCompatibleSlots(i).length > 0);
        const filteredBag = bagItems.filter(i =>
          (eqType === "All" || i.type === eqType) &&
          (!eqSearch || i.name.toLowerCase().includes(eqSearch.toLowerCase()))
        );
        const close = () => { setEqModal(null); setEqItem(null); setEqStep("pick"); setEqSearch(""); setEqType("All"); };
        const doEquip = (item, slot) => {
          setChar(p => {
            const inv3 = p.inventory || [];
            const already = inv3.some(i => i.uid === item.uid);
            const newSlots = { ...(p.equipSlots||{}), [slot]: item };
            if (isTwoHanded(item) && slot === "main") newSlots.off = null;
            if (slot === "off" && isTwoHanded(p.equipSlots?.main)) newSlots.main = null;
            return { ...p, inventory: already ? inv3 : [...inv3, item], equipSlots: newSlots };
          });
          close();
        };
        return (
          <>
            <div onClick={close} style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:560, background:C.card, borderTop:`2px solid ${C.teal}`, borderRadius:"18px 18px 0 0", padding:"20px 18px 36px", maxHeight:"82vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,0.85)" }}>

              {eqModal === "list" && (
                <>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ fontFamily:FH, fontSize:14, color:C.teal, fontWeight:700 }}>
                      {eqStep==="pick" ? t("dash.equip_item","⚔️ Item anlegen") : t("dash.slot_for","🎯 Slot für: {name}").replace("{name}", eqItem?.name || "")}
                    </div>
                    <button type="button" onClick={close} style={sx.bsm(C.textDim)} aria-label={t("modal.close","Schließen")}>✕</button>
                  </div>
                  {eqStep === "pick" && (
                    <>
                      <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                        <input value={eqSearch} onChange={e=>setEqSearch(e.target.value)} placeholder={t("dash.search_placeholder","🔍 Suchen…")} style={{ ...sx.inp, fontSize:12, flex:1 }} />
                        <select value={eqType} onChange={e=>setEqType(e.target.value)} style={{ ...sx.sel, fontSize:11, width:"auto" }}>
                          {["All",...EQ_TYPES].map(ty=><option key={ty} value={ty}>{ty==="All"?t("dash.all_types","Alle"):ty}</option>)}
                        </select>
                      </div>
                      {filteredBag.length > 0 ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                          {filteredBag.map(item => {
                            const col = RARITY_COL[item.rar] || C.textDim;
                            return (
                              <div key={item.uid} onClick={() => { setEqItem(item); setEqStep("slot"); }}
                                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, cursor:"pointer", background:`${col}0e`, border:`1px solid ${col}30` }}>
                                <span style={{ fontSize:16 }}>{EQ_ICON[item.type]||"📦"}</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:13, color:C.textBright, fontFamily:FH, fontWeight:700 }}>{item.name}</div>
                                  <div style={{ fontSize:10, color:col }}>{item.rar} · {item.type}</div>
                                </div>
                                <span style={{ color:C.teal }}>›</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize:12, color:C.textDim, textAlign:"center", padding:"10px 0", marginBottom:8 }}>{t("dash.no_item_inv","Kein Item im Inventar")}</div>
                      )}
                      <button type="button" onClick={() => setEqModal("new")} style={{ ...sx.btn(C.green), width:"100%" }}>{t("dash.new_item_create","＋ Neues Item erstellen")}</button>
                    </>
                  )}
                  {eqStep === "slot" && eqItem && (() => {
                    const compatSlots = getCompatibleSlots(eqItem);
                    const mainIsTwoHanded = isTwoHanded(eq2.main);
                    return (
                      <>
                        {compatSlots.length === 0 ? (
                          <div style={{ fontSize:12, color:C.textDim, textAlign:"center", padding:"16px 0" }}>{t("dash.cant_equip_item","Dieses Item kann nicht angelegt werden.")}</div>
                        ) : (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {Object.entries(SLOT_DEF).filter(([sid]) => compatSlots.includes(sid)).map(([sid, sd]) => {
                              const cur = eq2[sid];
                              const locked = sid === "off" && mainIsTwoHanded;
                              return (
                                <button type="button" key={sid} disabled={locked} onClick={() => !locked && doEquip(eqItem, sid)}
                                  style={{ background:locked?`${C.red}15`:cur?`${C.amber}15`:`${C.teal}12`, border:`1px solid ${locked?C.red:cur?C.amber:C.teal}44`, borderRadius:10, padding:"9px 12px", cursor:locked?"not-allowed":"pointer", minWidth:80, textAlign:"center", opacity:locked?0.5:1 }}>
                                  <div style={{ fontSize:20 }}>{locked?"🔒":sd.icon}</div>
                                  <div style={{ fontSize:11, color:locked?C.red:cur?C.amber:C.teal, fontFamily:FH, fontWeight:700 }}>{slotLabel(sd)}</div>
                                  {cur && !locked && <div style={{ fontSize:9, color:C.textDim, marginTop:2 }}>↔ {cur.name.slice(0,10)}</div>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <button type="button" onClick={() => { setEqStep("pick"); setEqItem(null); }} style={{ ...sx.bsm(C.textDim), marginTop:10, fontSize:11 }}>{t("dash.back_arrow","← Zurück")}</button>
                      </>
                    );
                  })()}
                </>
              )}

              {eqModal === "new" && (
                <>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ fontFamily:FH, fontSize:14, color:C.green, fontWeight:700 }}>{t("dash.new_item","＋ Neues Item")}</div>
                    <button type="button" onClick={close} style={sx.bsm(C.textDim)} aria-label={t("modal.close","Schließen")}>✕</button>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div><label style={sx.lbl}>{t("dash.name_required","Name *")}</label><input value={eqNew.name} onChange={e=>setEqNew(p=>({...p,name:e.target.value}))} style={sx.inp} autoFocus /></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <div><label style={sx.lbl}>{t("dash.type_label","Typ")}</label><select value={eqNew.type} onChange={e=>setEqNew(p=>({...p,type:e.target.value}))} style={sx.sel}>{EQ_TYPES.map(ty=><option key={ty}>{ty}</option>)}</select></div>
                      <div><label style={sx.lbl}>{t("dash.rarity_label","Seltenheit")}</label><select value={eqNew.rar} onChange={e=>setEqNew(p=>({...p,rar:e.target.value}))} style={sx.sel}>{["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}</select></div>
                      <div><label style={sx.lbl}>{t("dash.damage_form","Schaden")}</label><input value={eqNew.dmg} onChange={e=>setEqNew(p=>({...p,dmg:e.target.value}))} style={sx.inp} placeholder="1d8+3" /></div>
                      <div><label style={sx.lbl}>AC</label><input value={eqNew.ac} onChange={e=>setEqNew(p=>({...p,ac:e.target.value}))} style={sx.inp} placeholder="16" /></div>
                    </div>
                    <div><label style={sx.lbl}>{t("dash.effect_label","Effekt")}</label><input value={eqNew.eff} onChange={e=>setEqNew(p=>({...p,eff:e.target.value}))} style={sx.inp} placeholder="+1 ATK…" /></div>
                    <div><label style={sx.lbl}>{t("dash.notes_label","Notizen")}</label><textarea value={eqNew.notes} onChange={e=>setEqNew(p=>({...p,notes:e.target.value}))} style={{ ...sx.ta, height:50 }} /></div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button type="button" onClick={() => {
                        if (!eqNew.name.trim()) return;
                        const ni = { ...eqNew, uid:Date.now()+Math.random(), qty:1, custom:true };
                        setEqItem(ni); setEqStep("slot"); setEqModal("list");
                        setEqNew({ name:"", type:"Weapon", dmg:"", ac:"", eff:"", rar:"Common", notes:"" });
                      }} style={{ ...sx.btn(C.green), flex:1 }}>{t("dash.next_pick_slot","Weiter → Slot wählen")}</button>
                      <button type="button" onClick={() => setEqModal("list")} style={sx.bsm(C.textDim)}>{t("dash.back_arrow","← Zurück")}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            </div>
          </>
        );
      })()}

      {/* ── Swap Modal ── */}
      {swapModal && (() => {
        const inv3 = char.inventory || [];
        const eq3  = char.equipSlots || {};
        const bagItems3 = inv3.filter(i =>
          !Object.values(eq3).some(s => s?.uid === i.uid) &&
          getCompatibleSlots(i).includes(swapModal.slot)
        );
        const filteredSwap = bagItems3.filter(i =>
          (swapType === "All" || i.type === swapType) &&
          (!swapSearch || i.name.toLowerCase().includes(swapSearch.toLowerCase()))
        );
        const closeSwap = () => { setSwapModal(null); setSwapSearch(""); setSwapType("All"); };
        const sd = SLOT_DEF[swapModal.slot] || { label:swapModal.slot, icon:"📦" };
        return (
          <>
            <div onClick={closeSwap} style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:560, background:C.card, borderTop:`2px solid ${C.amber}`, borderRadius:"18px 18px 0 0", padding:"20px 18px 36px", maxHeight:"82vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,0.85)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:22 }}>{EQ_ICON[swapModal.item.type]||"📦"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FH, fontSize:14, color:C.amber, fontWeight:700 }}>{t("dash.swap_word","↔ Tauschen")}</div>
                  <div style={{ fontSize:11, color:C.textDim }}>{swapModal.item.name} · {sd.icon} {slotLabel(sd)}</div>
                </div>
                <button type="button" onClick={closeSwap} style={sx.bsm(C.textDim)} aria-label={t("modal.close","Schließen")}>✕</button>
              </div>
              <button type="button"
                onClick={() => { setChar(p => ({ ...p, equipSlots: { ...(p.equipSlots||{}), [swapModal.slot]: null } })); closeSwap(); }}
                style={{ ...sx.btn(C.red), width:"100%", marginBottom:10 }}>{t("dash.unequip_short","↩ Ablegen")}</button>
              <div style={{ display:"flex", gap:4, marginBottom:10 }}>
                <input value={swapSearch} onChange={e=>setSwapSearch(e.target.value)} placeholder={t("dash.search_short","🔍 Suchen…")} style={{ ...sx.inp, fontSize:12, flex:1 }} />
                <select value={swapType} onChange={e=>setSwapType(e.target.value)} style={{ ...sx.sel, fontSize:11, width:"auto" }}>
                  {["All",...EQ_TYPES].map(ty=><option key={ty} value={ty}>{ty==="All"?t("dash.all_types","Alle"):ty}</option>)}
                </select>
              </div>
              {filteredSwap.length === 0
                ? <div style={{ textAlign:"center", color:C.textDim, padding:"16px 0", fontSize:12 }}>{t("dash.no_item_backpack","Kein Item im Rucksack")}</div>
                : <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    {filteredSwap.map(bi => {
                      const bc = RARITY_COL[bi.rar] || C.textDim;
                      return (
                        <div key={bi.uid}
                          onClick={() => {
                            setChar(p => {
                              const newSlots = { ...(p.equipSlots||{}), [swapModal.slot]: bi };
                              if (isTwoHanded(bi) && swapModal.slot === "main") newSlots.off = null;
                              return { ...p, equipSlots: newSlots };
                            });
                            closeSwap();
                          }}
                          style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, cursor:"pointer", background:`${bc}0e`, border:`1px solid ${bc}30` }}>
                          <span style={{ fontSize:18 }}>{EQ_ICON[bi.type]||"📦"}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, color:C.textBright, fontFamily:FH, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{bi.name}</div>
                            <div style={{ fontSize:10, color:bc }}>{bi.rar} · {bi.type}</div>
                          </div>
                          <span style={{ color:C.amber, fontSize:14 }}>↔</span>
                        </div>
                      );
                    })}
                  </div>
              }
            </div>
            </div>
          </>
        );
      })()}

      {/* Equipment Item Info Modal */}
      {eqInfoModal && (
        <div onClick={() => setEqInfoModal(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{
              width:"100%", maxWidth:560,
              background: C.surface,
              borderTop:`2px solid ${RARITY_COL[eqInfoModal.rar]||C.border}`,
              borderRadius:"18px 18px 0 0",
              padding:"20px 18px 36px",
              boxShadow:`0 -8px 40px rgba(0,0,0,0.7), ${RARITY_GLOW[eqInfoModal.rar]||"none"}`,
            }}>
            <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }} />
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
              <span style={{ fontSize:44 }}>{EQ_ICON[eqInfoModal.type]||"📦"}</span>
              <div>
                <div style={{ fontFamily:FH, fontSize:20, color:RARITY_COL[eqInfoModal.rar]||C.gold, fontWeight:700, lineHeight:1.2 }}>{eqInfoModal.name}</div>
                <div style={{ fontSize:12, color:C.textDim, marginTop:4, display:"flex", flexWrap:"wrap", gap:4, alignItems:"center" }}>
                  <span>{eqInfoModal.sub||eqInfoModal.type}</span>
                  <span>·</span>
                  <span style={{ color:RARITY_COL[eqInfoModal.rar]||C.textDim }}>{eqInfoModal.rar}</span>
                  <span style={{ ...sx.tag(C.purple), fontSize:9 }}>{t("dash.equipped_tag","Ausgerüstet")}</span>
                  <span style={{ ...sx.tag(C.textDim), fontSize:9 }}>{eqInfoModal._slotIcon} {eqInfoModal._slotLabel}</span>
                  {isTwoHanded(eqInfoModal) && <span style={{ ...sx.tag(C.amber), fontSize:9 }}>{t("dash.two_handed_tag","Zweihändig")}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {eqInfoModal.dmg && eqInfoModal.dmg!=="—" && <span style={sx.tag(C.red)}>⚔️ {eqInfoModal.dmg}</span>}
              {eqInfoModal.ac  && eqInfoModal.ac!=="—"  && <span style={sx.tag(C.blue)}>🛡️ {eqInfoModal.ac}</span>}
              {eqInfoModal.eff && eqInfoModal.eff!=="—" && <span style={sx.tag(C.green)}>✨ {eqInfoModal.eff}</span>}
              {eqInfoModal.wt  && eqInfoModal.wt!=="—"  && <span style={sx.tag(C.textDim)}>⚖️ {eqInfoModal.wt}</span>}
            </div>
            {eqInfoModal.notes && eqInfoModal.notes!=="—" && (
              <div style={{ fontSize:13, color:C.text, lineHeight:1.7, marginBottom:16, padding:"10px 12px", background:"rgba(0,0,0,0.3)", borderRadius:8 }}>
                {eqInfoModal.notes}
              </div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <button type="button" onClick={() => { setChar(p => ({ ...p, equipSlots: { ...(p.equipSlots||{}), [eqInfoModal._slotId]: null } })); setEqInfoModal(null); }}
                style={{ ...sx.btn(C.red), padding:"10px 20px", fontSize:13 }}>↩ Ablegen</button>
              <button type="button" onClick={() => setEqInfoModal(null)} style={{ ...sx.bsm(C.textDim), padding:"10px 16px" }}>{t("dash.close_btn","Schließen")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      <InfoModal data={infoModal} onClose={() => setInfoModal(null)} />

      {/* TempHP Modal */}
      {tempHpModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setTempHpModal(false)}>
          <div style={{ ...sx.card, border: `1px solid ${C.blueBright}55`, width: 300, padding: 22 }} onClick={e => e.stopPropagation()}>
            <div style={ctStyle}>{t("dash.temp_hp_header","Temporäre HP")}</div>
            <p style={{ fontSize: 12, color: C.text, marginBottom: 16 }}>{t("dash.temp_hp_hint","Temp HP stapeln sich nicht — nur der höchste Wert gilt.")}</p>
            <input autoFocus type="number" min={0} max={999} value={tempHpInput}
              onChange={e => setTempHpInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { const n = Math.max(0, Math.min(999, parseInt(tempHpInput, 10) || 0)); setChar(p => ({ ...p, tempHp: n })); setTempHpModal(false); } if (e.key === "Escape") setTempHpModal(false); }}
              placeholder="0"
              style={{ width: "100%", textAlign: "center", fontSize: 40, fontWeight: 700, background: C.surface, border: `1px solid ${C.blueBright}`, borderRadius: 10, color: C.blueBright, padding: "10px 0", marginBottom: 14, outline: "none" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setTempHpModal(false)} style={{ ...sx.bsm(C.textDim), flex: 1 }}>{t("dash.cancel_btn","Abbrechen")}</button>
              <button type="button" onClick={() => { const n = Math.max(0, Math.min(999, parseInt(tempHpInput, 10) || 0)); setChar(p => ({ ...p, tempHp: n })); setTempHpModal(false); }}
                style={{ ...sx.btn(C.blueBright), flex: 2, fontWeight: 700 }}>{t("dash.set_btn","Setzen")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Upcast Modal */}
      {castModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setCastModal(null)}>
          <div style={{ ...sx.card, border: `1px solid ${C.purpleBright}55`, width: 320, padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={ctStyle}>{t("dash.cast_title","Wirken:")} {castModal.spell.name}</div>
            <p style={{ fontSize: 12, color: C.text, marginBottom: 14 }}>{t("dash.pick_slot_level","Wähle den Slot-Level:")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {slots.filter(sl => sl.lv >= castModal.spell.lv && sl.tot > 0).map(sl => {
                const avail = sl.tot - sl.used;
                return (
                  <button type="button" key={sl.lv} disabled={avail === 0} onClick={() => { handleCast(castModal.spell, sl.lv); setCastModal(null); }}
                    style={{ background: avail > 0 ? `${C.purpleBright}22` : C.surface, border: `1px solid ${avail > 0 ? C.purpleBright : C.border}`, borderRadius: 8, color: avail > 0 ? C.purpleBright : C.textDim, padding: "6px 14px", cursor: avail > 0 ? "pointer" : "default", fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: avail > 0 ? 1 : 0.4 }}>
                    <span>{SLOT_LABELS[sl.lv]} {t("dash.slot_word","Slot")}</span>
                    <span style={{ fontSize: 11, opacity: 0.8 }}>{avail} {t("dash.remaining_word","übrig")}</span>
                  </button>
                );
              })}
            </div>
            {castModal.spell.upcast?.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.amberBright, fontWeight: 700, marginBottom: 6 }}>{t("dash.scaling_label","💎 Skalierung:")}</div>
                {castModal.spell.upcast.map(u => (
                  <div key={u.slot} style={{ fontSize: 11, color: C.text, marginBottom: 3 }}>
                    <span style={{ color: C.purpleBright, fontFamily: FH }}>{SLOT_LABELS[u.slot]}:</span> {u.dmg || u.note}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Concentration Warning Modal — neuer Conc-Zauber während aktiver Konz. */}
      {concWarn && (
        <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={() => setConcWarn(null)}>
          <div style={{ ...sx.card, border:`1px solid ${C.amberBright}55`, width:340, padding:22, maxWidth:"90vw" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily:FH, fontSize:15, color:C.amberBright, fontWeight:700, marginBottom:10 }}>{t("dash.conc_switch_title","⚠️ Konzentration wechseln?")}</div>
            <p style={{ fontSize:13, color:C.text, marginBottom:6, lineHeight:1.6 }}>
              {t("dash.conc_concentrating_on","Du konzentrierst dich auf")} <strong style={{ color:C.purpleBright }}>{char?.concentration?.spellName}</strong>.
            </p>
            <p style={{ fontSize:12, color:C.textDim, marginBottom:16 }}>
              {t("dash.conc_casting_breaks","Das Wirken von")} <strong style={{ color:C.textBright }}>{concWarn.spell.name}</strong> {t("dash.conc_breaks_end","beendet die aktive Konzentration sofort.")}
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button type="button" onClick={() => {
                if (!concWarn.ritual) useSlot(concWarn.slotLv);
                setChar(p => startConcentration(p, concWarn.spell, concWarn.slotLv ?? concWarn.spell.lv));
                setConcWarn(null);
              }} style={sx.btn(C.amberBright)}>{concWarn.ritual ? t("dash.cast_ritual_btn","ℛ Ritual wirken") : t("dash.cast_anyway_btn","Trotzdem wirken")}</button>
              <button type="button" onClick={() => setConcWarn(null)} style={sx.btn(C.textDim)}>{t("dash.cancel_btn","Abbrechen")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Wealth editor (opened via StatusStrip's Wealth pill) */}
      <WealthModal open={showWealthModal} onClose={() => setShowWealthModal(false)}
        char={char} setChar={setChar} />
    </div>
  );
}
