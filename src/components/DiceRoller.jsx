import { useState, useRef } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { rollD } from "../utils/helpers.js";
import { getCondition } from "../utils/conditions.js";
import { useI18n } from "../i18n/index.js";

export default function DiceRoller({ char, setChar }) {
  const { t } = useI18n();
  const [res, setRes]         = useState([]);
  const [cnt, setCnt]         = useState(1);
  const [mod, setMod]         = useState(0);
  const [rolling, setRolling] = useState(null);
  const [adv, setAdv]         = useState("normal");
  const [useInspiration, setUseInspiration] = useState(false);

  // Ref: setTimeout-Closure liest immer aktuellen Wert
  const advRef = useRef("normal");
  const useInspirationRef = useRef(false);
  const setAdvSafe = val => { advRef.current = val; setAdv(val); };
  const setUseInspirationSafe = val => { useInspirationRef.current = val; setUseInspiration(val); };

  const hasInspiration = char?.inspiration === true;

  // Condition-based roll hints
  const activeConds = (char?.activeConditions || []).map(getCondition).filter(Boolean);
  const condAdvHints = activeConds.filter(c => c.effects?.attackerAdvantage).map(c => `${c.icon} ${c.name}`);
  const condDisHints = activeConds.filter(c => c.effects?.attackerDisadvantage).map(c => `${c.icon} ${c.name}`);

  const DICE = [4, 6, 8, 10, 12, 20, 100];
  const DC   = { 4:"#a040c0", 6:"#2060c0", 8:"#20a060", 10:"#c07020", 12:"#c02040", 20:"#c9a84c", 100:"#808080" };

  const ADV_OPTS = [
    { key:"normal",       label:t("dice.normal","Normal"),                  color:C.textDim },
    { key:"advantage",    label:`⬆ ${t("dice.advantage","Vorteil")}`,      color:C.greenBright },
    { key:"disadvantage", label:`⬇ ${t("dice.disadvantage","Nachteil")}`,  color:C.redBright },
  ];

  const go = s => {
    setRolling(s);
    const currentAdv = advRef.current;
    const consumingInspiration = useInspirationRef.current && hasInspiration && s === 20;
    // Inspiration gives advantage (overrides normal, stacks with existing advantage)
    const effectiveAdv = consumingInspiration && currentAdv === "normal" ? "advantage" : currentAdv;

    setTimeout(() => {
      let rolls, total;
      let rollPairs = null;

      if (effectiveAdv !== "normal") {
        const pairs = Array.from({ length: cnt }, () => {
          const a = rollD(s), b = rollD(s);
          const keptIdx = effectiveAdv === "advantage"
            ? (a >= b ? 0 : 1)
            : (a <= b ? 0 : 1);
          return { a, b, keptIdx };
        });
        rollPairs = pairs;
        rolls     = pairs.map(p => [p.a, p.b][p.keptIdx]);
        total     = rolls.reduce((x, y) => x + y, 0) + parseInt(mod || 0);
      } else {
        rolls = Array.from({ length: cnt }, () => rollD(s));
        total = rolls.reduce((x, y) => x + y, 0) + parseInt(mod || 0);
      }

      // Consume inspiration
      if (consumingInspiration && setChar) {
        setChar(p => ({ ...p, inspiration: false }));
        setUseInspirationSafe(false);
      }

      setRes(p => [{
        id: Date.now(), sides: s, cnt, rolls, mod: parseInt(mod || 0), total,
        ts: new Date().toLocaleTimeString(undefined),
        adv: effectiveAdv,
        rollPairs,
        inspirationUsed: consumingInspiration,
      }, ...p.slice(0, 19)]);
      setRolling(null);
    }, 280);
  };

  const advColor = adv === "advantage" ? C.greenBright : adv === "disadvantage" ? C.redBright : C.textDim;

  return (
    <div>
      {/* ── Einstellungen ── */}
      <div style={sx.card}>
        <div style={sx.ct}>⚙️ {t("dice.settings","Einstellungen")}</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div>
            <label style={sx.lbl}>{t("dice.count","Anzahl")}</label>
            <input type="number" min={1} max={20} value={cnt}
              onChange={e => setCnt(+e.target.value)}
              style={{ ...sx.inp, width:80 }} />
          </div>
          <div>
            <label style={sx.lbl}>{t("dice.modifier","Modifier")}</label>
            <input type="number" value={mod}
              onChange={e => setMod(e.target.value)}
              style={{ ...sx.inp, width:80 }} />
          </div>
        </div>

        {/* Vorteil / Nachteil Toggle */}
        <div style={{ marginTop:14 }}>
          <label style={sx.lbl}>{t("dice.mode","Modus")}</label>
          <div style={{
            display:"flex", gap:0, marginTop:6,
            border:`1px solid ${C.border}`, borderRadius:8,
            overflow:"hidden", width:"fit-content",
          }}>
            {ADV_OPTS.map(({ key, label, color }, i) => {
              const active = adv === key;
              return (
                <button key={key} onClick={() => setAdvSafe(key)} style={{
                  background:  active ? `${color}33` : "transparent",
                  border:      "none",
                  borderLeft:  i > 0 ? `1px solid ${C.border}` : "none",
                  color:       active ? color : C.textDim,
                  padding:     "7px 16px",
                  fontSize:    13,
                  fontWeight:  active ? 700 : 400,
                  cursor:      "pointer",
                  transition:  "all .15s",
                  outline:     active ? `2px solid ${color}` : "none",
                  outlineOffset: "-2px",
                }}>{label}</button>
              );
            })}
          </div>
          {adv !== "normal" && (
            <div style={{ marginTop:5, fontSize:11, color:advColor }}>
              {adv === "advantage"
                ? `⬆ ${t("dice.adv_hint","Jeden Würfel 2× würfeln — höchsten nehmen")}`
                : `⬇ ${t("dice.dis_hint","Jeden Würfel 2× würfeln — niedrigsten nehmen")}`}
            </div>
          )}

          {/* Inspiration */}
          {hasInspiration && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 8,
              background: `${C.gold}18`, border: `1px solid ${C.gold}55`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, fontFamily: FH }}>{t("dice.inspiration_active","Inspiration aktiv!")}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{t("dice.inspiration_hint","Beim nächsten d20 → Vorteil + Inspiration verbraucht")}</div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={useInspiration} onChange={e => setUseInspirationSafe(e.target.checked)} />
                <span style={{ fontSize: 12, color: useInspiration ? C.gold : C.textDim, fontWeight: useInspiration ? 700 : 400 }}>
                  {t("dice.use","Nutzen")}
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Condition-Hinweise */}
      {(condAdvHints.length > 0 || condDisHints.length > 0) && (
        <div style={{ ...sx.card, background: `${C.amber}0e`, border: `1px solid ${C.amberBright}44` }}>
          <div style={{ fontSize: 11, color: C.amberBright, fontFamily: FH, fontWeight: 700, marginBottom: 4 }}>
            ⚠️ {t("dice.conditions_affect","Aktive Conditions beeinflussen Würfe")}
          </div>
          {condAdvHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.greenBright, marginBottom: 2 }}>
              ⬆ {t("dice.advantage","Vorteil")}: {condAdvHints.join(", ")}
            </div>
          )}
          {condDisHints.length > 0 && (
            <div style={{ fontSize: 12, color: C.redBright }}>
              ⬇ {t("dice.disadvantage","Nachteil")}: {condDisHints.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* ── Würfel ── */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom:10 }}>
          <div style={sx.ct}>🎲 {t("dice.dice","Würfel")}</div>
          {adv !== "normal" && (
            <span style={{
              background: `${advColor}22`, border:`1px solid ${advColor}`,
              borderRadius:6, color:advColor,
              fontSize:12, fontWeight:700, padding:"3px 10px",
            }}>
              {adv === "advantage" ? `⬆ ${t("dice.adv_active","Vorteil aktiv")}` : `⬇ ${t("dice.dis_active","Nachteil aktiv")}`}
            </span>
          )}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {DICE.map(d => {
            const isRolling = rolling === d;
            return (
              <button key={d} onClick={() => go(d)} style={{
                position:     "relative",
                background:   isRolling
                  ? `radial-gradient(circle,${DC[d]},#000)`
                  : `linear-gradient(135deg,${DC[d]}44,${DC[d]}22)`,
                border:       `2px solid ${adv !== "normal" && !isRolling ? advColor : DC[d]}`,
                borderRadius: 8,
                color:        DC[d],
                fontFamily:   FH,
                fontSize:     18,
                fontWeight:   700,
                width:        72,
                height:       72,
                cursor:       "pointer",
                transition:   "all .2s",
                transform:    isRolling ? "scale(1.1) rotate(8deg)" : "scale(1)",
                boxShadow:    isRolling
                  ? `0 0 20px ${DC[d]}88`
                  : adv !== "normal" ? `0 0 10px ${advColor}55` : "none",
              }}>
                d{d}
                {adv !== "normal" && (
                  <span style={{
                    position:"absolute", top:-7, right:-7,
                    background: advColor, color:"#000",
                    borderRadius:"50%", fontSize:9, fontWeight:900,
                    width:15, height:15,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"sans-serif",
                  }}>
                    {adv === "advantage" ? "▲" : "▼"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Verlauf ── */}
      {res.length > 0 && (
        <div style={sx.card}>
          <div style={{ ...sx.jb, marginBottom:8 }}>
            <div style={sx.ct}>📜 {t("dice.history","Verlauf")}</div>
            <button onClick={() => setRes([])} style={sx.bsm(C.red)}>{t("dice.clear","Leeren")}</button>
          </div>

          {res.map(r => {
            const isNat20  = r.sides === 20 && r.rolls[0] === 20;
            const isNat1   = r.sides === 20 && r.rolls[0] === 1;
            const rAdvCol  = r.adv === "advantage" ? C.greenBright : C.redBright;
            const hasAdv   = r.adv !== "normal";

            return (
              <div key={r.id} style={{
                background:   "#0f0f1e",
                borderRadius: 6,
                padding:      "10px 14px",
                marginBottom: 6,
                border: `1px solid ${
                  hasAdv  ? `${rAdvCol}55` :
                  isNat20 ? C.gold :
                  isNat1  ? C.red  : C.border
                }`,
                boxShadow: isNat20 ? `0 0 12px ${C.goldDim}` : "none",
              }}>
                {/* Kopfzeile */}
                <div style={sx.jb}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ color:DC[r.sides]||C.gold, fontFamily:FH, fontWeight:700 }}>
                      {r.cnt}d{r.sides}{r.mod !== 0 ? (r.mod > 0 ? `+${r.mod}` : r.mod) : ""}
                    </span>

                    {r.adv === "advantage" && (
                      <span style={{
                        background:C.greenBright, color:"#000",
                        borderRadius:4, fontSize:11, fontWeight:900, padding:"1px 7px",
                      }}>⬆ {t("dice.adv_upper","VORTEIL")}</span>
                    )}
                    {r.adv === "disadvantage" && (
                      <span style={{
                        background:C.redBright, color:"#000",
                        borderRadius:4, fontSize:11, fontWeight:900, padding:"1px 7px",
                      }}>⬇ {t("dice.dis_upper","NACHTEIL")}</span>
                    )}
                    {r.inspirationUsed && (
                      <span style={{
                        background:C.gold, color:"#000",
                        borderRadius:4, fontSize:11, fontWeight:900, padding:"1px 7px",
                      }}>✨ {t("dice.inspiration_upper","INSPIRATION")}</span>
                    )}

                    {isNat20 && <span style={{ color:C.gold, fontSize:12 }}>✨ {t("dice.nat20","NAT 20!")}</span>}
                    {isNat1  && <span style={{ color:C.red,  fontSize:12 }}>💀 {t("dice.fumble","PATZER!")}</span>}
                  </div>
                  <span style={{ color:C.textDim, fontSize:11 }}>{r.ts}</span>
                </div>

                {/* Würfelergebnis */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
                  {r.rollPairs ? (
                    <span style={{ fontSize:13 }}>
                      {r.rollPairs.map((p, i) => {
                        const kept    = [p.a, p.b][p.keptIdx];
                        const dropped = [p.a, p.b][1 - p.keptIdx];
                        return (
                          <span key={i}>
                            {i > 0 && <span style={{ color:C.textDim }}>,  </span>}
                            [<span style={{ color:rAdvCol, fontWeight:700 }}>{kept}</span>
                            <span style={{ color:C.textDim }}>/</span>
                            <span style={{ color:C.textDim, textDecoration:"line-through", opacity:0.45 }}>{dropped}</span>]
                          </span>
                        );
                      })}
                      {r.mod !== 0 && <span style={{ color:C.textDim }}> {r.mod > 0 ? "+" : ""}{r.mod}</span>}
                    </span>
                  ) : (
                    <span style={{ color:C.textDim, fontSize:13 }}>
                      [{r.rolls.join(", ")}]{r.mod !== 0 ? ` ${r.mod > 0 ? "+" : ""}${r.mod}` : ""}
                    </span>
                  )}
                  <span style={{ fontSize:22, fontWeight:700, color:C.textBright, marginLeft:4 }}>
                    = {r.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
