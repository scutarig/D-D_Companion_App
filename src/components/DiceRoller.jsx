import { useState, useRef } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { rollD } from "../utils/helpers.js";

export default function DiceRoller() {
  const [res, setRes]         = useState([]);
  const [cnt, setCnt]         = useState(1);
  const [mod, setMod]         = useState(0);
  const [rolling, setRolling] = useState(null);
  const [adv, setAdv]         = useState("normal");

  // Ref guarantees the setTimeout callback always reads the current adv value
  const advRef = useRef("normal");
  const setAdvSafe = val => { advRef.current = val; setAdv(val); };

  const DICE = [4, 6, 8, 10, 12, 20, 100];
  const DC   = { 4:"#a040c0", 6:"#2060c0", 8:"#20a060", 10:"#c07020", 12:"#c02040", 20:"#c9a84c", 100:"#808080" };

  const ADV_OPTS = [
    { key:"normal",       label:"Normal",      color:C.textDim },
    { key:"advantage",    label:"⬆ Vorteil",   color:C.greenBright },
    { key:"disadvantage", label:"⬇ Nachteil",  color:C.redBright },
  ];

  const go = s => {
    setRolling(s);
    const currentAdv = advRef.current; // safe read
    setTimeout(() => {
      let rolls, total, rollPairs = null;

      if (s === 20 && currentAdv !== "normal") {
        const a = rollD(20), b = rollD(20);
        const kept = currentAdv === "advantage" ? Math.max(a, b) : Math.min(a, b);
        rolls     = [kept];
        rollPairs = [a, b];
        total     = kept + parseInt(mod || 0);
      } else {
        rolls = Array.from({ length: cnt }, () => rollD(s));
        total = rolls.reduce((a, b) => a + b, 0) + parseInt(mod || 0);
      }

      setRes(p => [{
        id: Date.now(), sides: s, cnt, rolls, mod: parseInt(mod || 0), total,
        ts: new Date().toLocaleTimeString(),
        adv: s === 20 ? currentAdv : "normal",
        rollPairs,
      }, ...p.slice(0, 19)]);
      setRolling(null);
    }, 280);
  };

  const advColor = adv === "advantage" ? C.greenBright : adv === "disadvantage" ? C.redBright : C.textDim;

  return (
    <div>
      {/* ── Einstellungen ── */}
      <div style={sx.card}>
        <div style={sx.ct}>⚙️ Einstellungen</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div>
            <label style={sx.lbl}>Anzahl</label>
            <input type="number" min={1} max={20} value={cnt}
              onChange={e => setCnt(+e.target.value)}
              style={{ ...sx.inp, width:80 }} />
          </div>
          <div>
            <label style={sx.lbl}>Modifier</label>
            <input type="number" value={mod}
              onChange={e => setMod(e.target.value)}
              style={{ ...sx.inp, width:80 }} />
          </div>
        </div>

        {/* ── Vorteil / Nachteil Toggle ── */}
        <div style={{ marginTop:14 }}>
          <label style={sx.lbl}>W20 Modus</label>
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
                  borderLeft:  i > 0 ? `1px solid ${C.border}` : "none",
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
              {adv === "advantage" ? "⬆ 2× W20 würfeln — höchsten nehmen" : "⬇ 2× W20 würfeln — niedrigsten nehmen"}
            </div>
          )}
        </div>
      </div>

      {/* ── Würfel ── */}
      <div style={sx.card}>
        <div style={sx.ct}>🎲 Würfel</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {DICE.map(d => {
            const isRolling = rolling === d;
            const isD20     = d === 20;
            const advGlow   = isD20 && adv !== "normal";
            const glowCol   = adv === "advantage" ? C.greenBright : C.redBright;
            return (
              <button key={d} onClick={() => go(d)} style={{
                position:     "relative",
                background:   isRolling
                  ? `radial-gradient(circle,${DC[d]},#000)`
                  : `linear-gradient(135deg,${DC[d]}44,${DC[d]}22)`,
                border:       `2px solid ${advGlow ? glowCol : DC[d]}`,
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
                  : advGlow ? `0 0 12px ${glowCol}88` : "none",
              }}>
                d{d}
                {/* Vorteil/Nachteil-Indikator auf d20 */}
                {advGlow && (
                  <span style={{
                    position:"absolute", top:-8, right:-8,
                    background: glowCol,
                    color:"#000",
                    borderRadius:"50%",
                    fontSize:10, fontWeight:900,
                    width:16, height:16,
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
            <div style={sx.ct}>📜 Verlauf</div>
            <button onClick={() => setRes([])} style={sx.bsm(C.red)}>Leeren</button>
          </div>

          {res.map(r => {
            const isNat20 = r.sides === 20 && r.rolls[0] === 20;
            const isNat1  = r.sides === 20 && r.rolls[0] === 1;
            const rAdvCol = r.adv === "advantage" ? C.greenBright : C.redBright;

            // which rollPair index was kept?
            const keptIdx = r.rollPairs
              ? (r.rolls[0] === r.rollPairs[0] ? 0 : 1)
              : null;

            return (
              <div key={r.id} style={{
                background:   "#0f0f1e",
                borderRadius: 6,
                padding:      "10px 14px",
                marginBottom: 6,
                border:       `1px solid ${
                  r.adv === "advantage" ? `${C.greenBright}55` :
                  r.adv === "disadvantage" ? `${C.redBright}55` :
                  isNat20 ? C.gold : isNat1 ? C.red : C.border
                }`,
                boxShadow: isNat20 ? `0 0 12px ${C.goldDim}` : "none",
              }}>
                {/* Kopfzeile */}
                <div style={sx.jb}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ color:DC[r.sides]||C.gold, fontFamily:FH, fontWeight:700 }}>
                      {r.adv !== "normal" ? "d20" : `${r.cnt}d${r.sides}`}
                      {r.mod !== 0 ? (r.mod > 0 ? `+${r.mod}` : r.mod) : ""}
                    </span>

                    {/* Vorteil / Nachteil Badge – prominent */}
                    {r.adv === "advantage" && (
                      <span style={{
                        background: C.greenBright, color:"#000",
                        borderRadius:4, fontSize:11, fontWeight:900,
                        padding:"1px 7px", letterSpacing:"0.03em",
                      }}>⬆ VORTEIL</span>
                    )}
                    {r.adv === "disadvantage" && (
                      <span style={{
                        background: C.redBright, color:"#000",
                        borderRadius:4, fontSize:11, fontWeight:900,
                        padding:"1px 7px", letterSpacing:"0.03em",
                      }}>⬇ NACHTEIL</span>
                    )}

                    {isNat20 && <span style={{ color:C.gold, fontSize:12 }}>✨ NAT 20!</span>}
                    {isNat1  && <span style={{ color:C.red,  fontSize:12 }}>💀 PATZER!</span>}
                  </div>
                  <span style={{ color:C.textDim, fontSize:11 }}>{r.ts}</span>
                </div>

                {/* Würfelergebnis */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                  {r.rollPairs ? (
                    <span style={{ fontSize:13 }}>
                      {r.rollPairs.map((v, i) => {
                        const isKept = i === keptIdx;
                        return (
                          <span key={i}>
                            {i > 0 && <span style={{ color:C.textDim }}> / </span>}
                            <span style={{
                              color:          isKept ? rAdvCol : C.textDim,
                              fontWeight:     isKept ? 700 : 400,
                              textDecoration: isKept ? "none" : "line-through",
                            }}>{v}</span>
                          </span>
                        );
                      })}
                      {r.mod !== 0 && (
                        <span style={{ color:C.textDim }}> {r.mod > 0 ? "+" : ""}{r.mod}</span>
                      )}
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
