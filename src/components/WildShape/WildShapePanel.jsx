import { useState, useRef, useEffect } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { useChar } from "../../context/CharContext.jsx";
import { BEASTS, getBeastsForLevel, CR_LABELS, CR_VALUES } from "../../data/wildshapes.js";
import { modStr } from "../../utils/helpers.js";
import { useI18n } from "../../i18n/index.js";

const CR_COLOR = { 0:"#808080", 0.125:"#40c0a0", 0.25:"#409040", 0.5:"#c9a84c", 1:"#c96030", 2:"#c03030", 3:"#a020c0", 4:"#6020c0", 5:"#3020c0" };
const crCol = (cr) => CR_COLOR[cr] || "#6020c0";

function HoldBtn({ label, onPress, style }) {
  const t = useRef(null), iv = useRef(null);
  const start = e => { e.preventDefault(); onPress(); t.current = setTimeout(() => { iv.current = setInterval(onPress, 80); }, 400); };
  const stop  = () => { clearTimeout(t.current); clearInterval(iv.current); t.current = null; iv.current = null; };
  // Cleanup if unmounted mid-hold (prevents setState-on-unmounted warnings)
  useEffect(() => stop, []);
  return <button type="button" style={style} onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop}>{label}</button>;
}

export default function WildShapePanel({ compact = false }) {
  const { t } = useI18n();
  const { active: char } = useChar();
  const charId = char?.id || "g";

  // ── Persisted state ─────────────────────────────────────────────────────────
  const [form, setForm]         = usePersist(`ws_form_${charId}`, null);    // active beast or null
  const [beastHp, setBeastHp]   = usePersist(`ws_hp_${charId}`, 0);
  const [uses, setUses]         = usePersist(`ws_uses_${charId}`, 0);       // uses spent
  const [polyForm, setPolyForm] = usePersist(`ws_poly_${charId}`, null);    // polymorph form (non-druid)
  const [polyHp, setPolyHp]     = usePersist(`ws_polyhp_${charId}`, 0);

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [picker, setPicker]     = useState(false);
  const [polyPicker, setPolyPicker] = useState(false);
  const [crFilter, setCrFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [flyFilter, setFlyFilter] = useState(false);
  const [swimFilter, setSwimFilter] = useState(false);
  const [selBeast, setSelBeast] = useState(null);

  const isDruid    = char?.klass === "Druide";
  const level      = char?.level ?? 1;
  // Circle of Moon-Subklasse-Detection: char.subclasses[KlassenName] ist die
  // kanonische Quelle (gesetzt via useMulticlass.setSubclass).
  const druidSub   = char?.subclasses?.["Druide"] || "";
  const allSubs    = Object.values(char?.subclasses || {});
  const isMoon     = /mond|moon/i.test(druidSub) || allSubs.some(s => /mond|moon/i.test(s));
  const maxUses    = level >= 20 ? Infinity : 2;
  const usesLeft   = Math.max(0, maxUses - uses);

  // ── Wild Shape: transform ───────────────────────────────────────────────────
  const transform = (beast) => {
    setForm(beast);
    setBeastHp(beast.hp);
    setPicker(false);
    setSelBeast(null);
  };
  const revert = () => {
    setForm(null);
    setBeastHp(0);
  };
  const spendUse = (beast) => {
    setUses(p => p + 1);
    transform(beast);
  };

  // ── Polymorph ───────────────────────────────────────────────────────────────
  const startPoly = (beast) => {
    setPolyForm(beast);
    setPolyHp(beast.hp);
    setPolyPicker(false);
    setSelBeast(null);
  };
  const revertPoly = () => {
    setPolyForm(null);
    setPolyHp(0);
  };

  // ── Filtered beasts for picker ───────────────────────────────────────────
  const eligibleBeasts = isDruid ? getBeastsForLevel(level, isMoon) : BEASTS;
  const shownBeasts = eligibleBeasts.filter(b => {
    if (crFilter !== "all" && b.crLabel !== crFilter) return false;
    if (sizeFilter !== "all" && b.size !== sizeFilter) return false;
    if (flyFilter && !b.fly) return false;
    if (swimFilter && !b.swim) return false;
    return true;
  });
  const availCrLabels = [...new Set(eligibleBeasts.map(b => b.crLabel))];
  const availSizes    = [...new Set(eligibleBeasts.map(b => b.size))];

  const renderBeastCard = (beast, onPick) => {
    const col = crCol(beast.cr);
    const isSel = selBeast?.id === beast.id;
    return (
      <div key={beast.id}
        style={{ background: isSel ? `${col}1a` : C.surface, border: `1px solid ${isSel ? col : C.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", transition: "border .15s" }}
        onClick={() => setSelBeast(isSel ? null : beast)}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 700, color: C.textBright }}>{beast.name}</div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: col, background: `${col}22`, border: `1px solid ${col}44`, borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>CR {beast.crLabel}</span>
            {beast.fly  && <span style={{ fontSize: 10 }}>🦅</span>}
            {beast.swim && <span style={{ fontSize: 10 }}>🌊</span>}
          </div>
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>{beast.size} Beast · {beast.speed}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={sx.tag(C.red)}>❤️ {beast.hp}</span>
          <span style={sx.tag(C.tealBright)}>🛡️ {beast.ac}</span>
          {beast.attacks.slice(0,1).map((a,i) => (
            <span key={i} style={sx.tag(C.amberBright)}>⚔️ {a.dmg || "—"}</span>
          ))}
        </div>
        {/* Expanded detail */}
        {isSel && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}
            onClick={e => e.stopPropagation()}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3, marginBottom: 8 }}>
              {[["STR",beast.str],["DEX",beast.dex],["CON",beast.con],["INT",beast.int],["WIS",beast.wis],["CHA",beast.cha]].map(([lbl,val]) => (
                <div key={lbl} style={{ textAlign:"center", background: C.bg, borderRadius: 4, padding: "3px 0" }}>
                  <div style={{ fontSize: 9, color: C.textDim }}>{lbl}</div>
                  <div style={{ fontSize: 12, color: C.textBright, fontWeight: 700 }}>{val}</div>
                  <div style={{ fontSize: 9, color: C.amberBright }}>{modStr(val)}</div>
                </div>
              ))}
            </div>
            {/* Attacks */}
            {beast.attacks.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, marginBottom: 3 }}>{t("ws.attacks_upper","ANGRIFFE")}</div>
                {beast.attacks.map((a, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.text, marginBottom: 2 }}>
                    <span style={{ color: C.textBright, fontWeight: 600 }}>{a.name}</span>
                    {a.bonus !== undefined && <span style={{ color: C.amberBright }}> +{a.bonus}</span>}
                    {a.dmg && a.dmg !== "—" && <span style={{ color: C.redBright }}> · {a.dmg} {a.dmgType}</span>}
                    {a.range && <span style={{ color: C.textDim }}> · {a.range}</span>}
                    {a.note && <span style={{ color: C.textDim }}> ({a.note})</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Traits */}
            {beast.traits?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, marginBottom: 3 }}>{t("ws.traits_upper","EIGENSCHAFTEN")}</div>
                {beast.traits.map((tr, i) => <div key={i} style={{ fontSize: 11, color: C.text, marginBottom: 1 }}>• {tr}</div>)}
              </div>
            )}
            <button type="button" onClick={() => onPick(beast)} style={{ ...sx.btn(col), width: "100%", fontSize: 12 }}>
              {t("ws.pick_this_form","✓ Diese Form wählen")}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPicker = (onPick, title) => (
    <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 300, overflowY: "auto", padding: "20px 10px" }}
      onClick={() => { setPicker(false); setPolyPicker(false); setSelBeast(null); }}>
      <div style={{ ...sx.card, width: "min(700px, 96vw)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ ...sx.jb, marginBottom: 12 }}>
          <div style={{ fontFamily: FH, fontSize: 16, color: C.purpleBright, fontWeight: 700 }}>{title}</div>
          <button type="button" onClick={() => { setPicker(false); setPolyPicker(false); setSelBeast(null); }} style={{ ...sx.bsm(C.textDim) }}>✕</button>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setCrFilter("all")} style={{ ...sx.bsm(crFilter==="all"?C.purpleBright:C.textDim), fontSize: 10 }}>{t("ws.cr_all","CR: Alle")}</button>
            {availCrLabels.map(l => (
              <button type="button" key={l} onClick={() => setCrFilter(crFilter===l?"all":l)}
                style={{ ...sx.bsm(crFilter===l ? crCol(CR_VALUES[CR_LABELS.indexOf(l)]) : C.textDim), fontSize: 10 }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {availSizes.map(s => (
              <button type="button" key={s} onClick={() => setSizeFilter(sizeFilter===s?"all":s)}
                style={{ ...sx.bsm(sizeFilter===s ? C.tealBright : C.textDim), fontSize: 10 }}>
                {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setFlyFilter(p=>!p)}
            style={{ ...sx.bsm(flyFilter ? C.blueBright : C.textDim), fontSize: 10 }}>
            🦅 Fly
          </button>
          <button type="button" onClick={() => setSwimFilter(p=>!p)}
            style={{ ...sx.bsm(swimFilter ? C.tealBright : C.textDim), fontSize: 10 }}>
            🌊 Swim
          </button>
        </div>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>{shownBeasts.length} {t("ws.forms_count","Formen")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {shownBeasts.map(b => renderBeastCard(b, onPick))}
          {shownBeasts.length === 0 && <div style={{ color: C.textDim, fontStyle: "italic", gridColumn: "1/-1" }}>{t("ws.no_forms_match","Keine passenden Formen.")}</div>}
        </div>
      </div>
    </div>
  );

  // ── Beast HP bar & controls ─────────────────────────────────────────────────
  const renderBeastHpBar = (beast, hp, setHp, onRevert, label) => {
    const pct = Math.max(0, hp / beast.hp);
    const col = pct > 0.5 ? C.green : pct > 0.25 ? C.amber : C.red;
    return (
      <div style={{ background: C.surface, border: `1px solid ${crCol(beast.cr)}66`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
        {/* Beast name + badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 14, color: C.purpleBright, fontWeight: 700 }}>{beast.name}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>{label} · CR {beast.crLabel} · {beast.size} · {beast.speed}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.textDim }}>🛡️ {beast.ac}</span>
            <button type="button" onClick={onRevert} style={{ ...sx.bsm(C.amberBright), fontSize: 11 }}>{t("ws.revert_btn","↩️ Revert")}</button>
          </div>
        </div>
        {/* HP */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.textDim }}>{t("ws.beast_hp","Beast HP:")}</span>
            <span style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: col }}>{hp}</span>
            <span style={{ fontSize: 11, color: C.textDim }}>/ {beast.hp}</span>
            {hp === 0 && <span style={{ fontSize: 10, color: C.redBright, background:`${C.redBright}22`, border:`1px solid ${C.redBright}44`, borderRadius:4, padding:"1px 5px" }}>→ Revert!</span>}
          </div>
          <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct*100}%`, height:"100%", background: col, borderRadius: 3, transition: "width .2s" }} />
          </div>
        </div>
        {/* HP controls */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          {[-10,-5,-3,-1,+1,+3,+5,+10].map(d => (
            <HoldBtn key={d} label={d>0?`+${d}`:d}
              onPress={() => setHp(p => Math.max(0, Math.min(beast.hp, p + d)))}
              style={{ ...sx.bsm(d<0?C.red:C.green), fontSize: 10, padding: "2px 6px" }} />
          ))}
          <button type="button" onClick={() => setHp(beast.hp)} style={{ ...sx.bsm(C.tealBright), fontSize: 10 }}>{t("ws.max_btn","Max")}</button>
        </div>
        {/* Attacks */}
        {beast.attacks.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, marginBottom: 4 }}>{t("ws.attacks_upper","ANGRIFFE")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {beast.attacks.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.textBright, fontWeight: 600 }}>{a.name}</span>
                  {a.bonus !== undefined && <span style={sx.tag(C.amberBright)}>+{a.bonus}</span>}
                  {a.dmg && a.dmg !== "—" && <span style={sx.tag(C.red)}>💥 {a.dmg}</span>}
                  {a.range && <span style={{ fontSize: 10, color: C.textDim }}>{a.range}</span>}
                  {a.note && <span style={{ fontSize: 10, color: C.textDim }}>· {a.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Traits */}
        {beast.traits?.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, marginBottom: 3 }}>{t("ws.traits_upper","EIGENSCHAFTEN")}</div>
            {beast.traits.map((tr, i) => <div key={i} style={{ fontSize: 10, color: C.text, marginBottom: 1 }}>• {tr}</div>)}
          </div>
        )}
      </div>
    );
  };

  // ── Compact mode (for CombatDashboard sidebar) ──────────────────────────────
  if (compact) {
    return (
      <div>
        {/* Wild Shape uses (Druid only) */}
        {isDruid && (
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH }}>{t("ws.wild_shape_short","Wild Shape:")}</span>
            {Array.from({ length: maxUses }, (_, i) => (
              <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < usesLeft ? C.purpleBright : "transparent", border: `2px solid ${C.purpleBright}`, display: "inline-block" }} />
            ))}
            <button type="button" onClick={() => setUses(0)} style={{ ...sx.bsm(C.textDim), fontSize: 9, padding: "1px 5px" }}>↺</button>
            {!form && usesLeft > 0 && (
              <button type="button" onClick={() => setPicker(true)} style={{ ...sx.bsm(C.purpleBright), fontSize: 10 }}>{t("ws.transform_short","🐺 Transform")}</button>
            )}
            {form && <button type="button" onClick={revert} style={{ ...sx.bsm(C.amberBright), fontSize: 10 }}>{t("ws.revert_btn","↩️ Revert")}</button>}
          </div>
        )}
        {/* Active form compact */}
        {form && renderBeastHpBar(form, beastHp, setBeastHp, () => { revert(); setUses(p=>p+1); }, "Wild Shape")}
        {polyForm && renderBeastHpBar(polyForm, polyHp, setPolyHp, revertPoly, "Polymorph")}
        {/* Polymorph button (always) */}
        {!polyForm && (
          <button type="button" onClick={() => setPolyPicker(true)} style={{ ...sx.bsm(C.blue), fontSize: 10, marginTop: form ? 6 : 0 }}>{t("ws.polymorph_short","🔮 Polymorph")}</button>
        )}
        {picker && renderPicker(b => { spendUse(b); }, t("ws.wild_shape_picker_title","🐺 Wild Shape — Form wählen"))}
        {polyPicker && renderPicker(b => { startPoly(b); }, t("ws.polymorph_picker_title","🔮 Polymorph — Form wählen"))}
      </div>
    );
  }

  // ── Full panel ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Wild Shape section (Druid) */}
      {isDruid && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
            {t("ws.wild_shape_header","🐺 WILD SHAPE")}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.textDim }}>{t("ws.uses_label","Verwendungen:")}</span>
            {Array.from({ length: maxUses }, (_, i) => (
              <span key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: i < usesLeft ? C.purpleBright : "transparent", border: `2px solid ${C.purpleBright}`, display: "inline-block", cursor: "pointer" }}
                onClick={() => setUses(i < usesLeft ? uses + 1 : Math.max(0, uses - 1))} />
            ))}
            <button type="button" onClick={() => setUses(0)} style={{ ...sx.bsm(C.textDim), fontSize: 10 }}>{t("ws.rest_label","↺ Rast")}</button>
          </div>
          {form
            ? renderBeastHpBar(form, beastHp, setBeastHp, () => { revert(); setUses(p => p + 1); }, "Wild Shape")
            : (
              <button type="button" disabled={usesLeft === 0} onClick={() => setPicker(true)}
                style={{ ...sx.btn(usesLeft > 0 ? C.purpleBright : C.textDim), opacity: usesLeft > 0 ? 1 : 0.5 }}>
                {t("ws.pick_form_btn","🐺 Form wählen")} {usesLeft > 0 ? `(${usesLeft} ${t("ws.remaining_word","verbleibend")})` : `(${t("ws.none_word","keine")})`}
              </button>
            )
          }
        </div>
      )}

      {/* Polymorph section (everyone) */}
      <div>
        <div style={{ fontFamily: FH, fontSize: 13, color: C.blueBright, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
          {t("ws.polymorph_header","🔮 POLYMORPH")}
        </div>
        {polyForm
          ? renderBeastHpBar(polyForm, polyHp, setPolyHp, revertPoly, "Polymorph")
          : (
            <button type="button" onClick={() => setPolyPicker(true)} style={sx.btn(C.blue)}>
              {t("ws.polymorph_pick_btn","🔮 Form wählen")}
            </button>
          )
        }
      </div>

      {/* Pickers */}
      {picker     && renderPicker(b => { spendUse(b); },  t("ws.wild_shape_picker_title","🐺 Wild Shape — Form wählen"))}
      {polyPicker && renderPicker(b => { startPoly(b); }, t("ws.polymorph_picker_title","🔮 Polymorph — Form wählen"))}
    </div>
  );
}
