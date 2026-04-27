import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { rollD } from "../utils/helpers.js";

export default function DiceRoller() {
  const [res, setRes]     = useState([]);
  const [cnt, setCnt]     = useState(1);
  const [mod, setMod]     = useState(0);
  const [rolling, setRolling] = useState(null);
  const [adv, setAdv]     = useState("normal");

  const DICE = [4, 6, 8, 10, 12, 20, 100];
  const DC   = {4:"#a040c0",6:"#2060c0",8:"#20a060",10:"#c07020",12:"#c02040",20:"#c9a84c",100:"#808080"};

  const ADV_OPTS = [
    { key:"normal",       label:"Normal",      color:C.textDim },
    { key:"advantage",    label:"⬆ Vorteil",   color:C.greenBright },
    { key:"disadvantage", label:"⬇ Nachteil",  color:C.redBright },
  ];

  const go = s => {
    setRolling(s);
    setTimeout(() => {
      let rolls, total, rollPairs = null;

      if (s === 20 && adv !== "normal") {
        const a = rollD(20), b = rollD(20);
        const kept    = adv === "advantage" ? Math.max(a, b) : Math.min(a, b);
        rolls      = [kept];
        rollPairs  = [a, b];
        total      = kept + parseInt(mod || 0);
      } else {
        rolls = Array.from({ length: cnt }, () => rollD(s));
        total = rolls.reduce((a, b) => a + b, 0) + parseInt(mod || 0);
      }

      setRes(p => [{
        id: Date.now(), sides: s, cnt, rolls, mod: parseInt(mod || 0), total,
        ts: new Date().toLocaleTimeString(),
        adv: s === 20 ? adv : "normal",
        rollPairs,
      }, ...p.slice(0, 19)]);
      setRolling(null);
    }, 280);
  };

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

        {/* Vorteil / Nachteil Toggle */}
        <div style={{ marginTop:14 }}>
          <label style={sx.lbl}>W20 Modus</label>
          <div style={{ display:"flex", gap:6, marginTop:5 }}>
            {ADV_OPTS.map(({ key, label, color }) => (
              <button key={key} onClick={() => setAdv(key)} style={{
                background:   adv === key ? `${color}28` : "transparent",
                border:       `1px solid ${adv === key ? color : C.border}`,
                borderRadius: 6,
                color:        adv === key ? color : C.textDim,
                padding:      "5px 14px",
                fontSize:     13,
                fontWeight:   adv === key ? 700 : 400,
                cursor:       "pointer",
                transition:   "all .15s",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Würfel ── */}
      <div style={sx.card}>
        <div style={sx.ct}>🎲 Würfel</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {DICE.map(d => {
            const isActive = rolling === d;
            const advGlow  = d === 20 && adv !== "normal";
            const glowCol  = adv === "advantage" ? C.greenBright : C.redBright;
            return (
              <button key={d} onClick={() => go(d)} style={{
                background:  isActive
                  ? `radial-gradient(circle,${DC[d]},#000)`
                  : `linear-gradient(135deg,${DC[d]}44,${DC[d]}22)`,
                border:      `2px solid ${advGlow && !isActive ? glowCol : DC[d]}`,
                borderRadius: 8,
                color:       DC[d],
                fontFamily:  FH,
                fontSize:    18,
                fontWeight:  700,
                width:       72,
                height:      72,
                cursor:      "pointer",
                transition:  "all .2s",
                transform:   isActive ? "scale(1.1) rotate(8deg)" : "scale(1)",
                boxShadow:   isActive
                  ? `0 0 20px ${DC[d]}88`
                  : advGlow ? `0 0 8px ${glowCol}66` : "none",
              }}>d{d}</button>
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
            const advCol  = r.adv === "advantage" ? C.greenBright : C.redBright;

            return (
              <div key={r.id} style={{
                background:   "#0f0f1e",
                borderRadius: 6,
                padding:      "10px 14px",
                marginBottom: 6,
                border:       `1px solid ${isNat20 ? C.gold : isNat1 ? C.red : C.border}`,
                boxShadow:    isNat20 ? `0 0 12px ${C.goldDim}` : "none",
              }}>
                {/* Kopfzeile */}
                <div style={sx.jb}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ color:DC[r.sides]||C.gold, fontFamily:FH, fontWeight:700 }}>
                      {r.adv !== "normal" ? "d20" : `${r.cnt}d${r.sides}`}
                      {r.mod !== 0 ? (r.mod > 0 ? `+${r.mod}` : r.mod) : ""}
                    </span>

                    {r.adv === "advantage" && (
                      <span style={{ background:`${C.greenBright}22`, border:`1px solid ${C.greenBright}`, borderRadius:4, color:C.greenBright, fontSize:11, padding:"1px 6px" }}>VOR</span>
                    )}
                    {r.adv === "disadvantage" && (
                      <span style={{ background:`${C.redBright}22`, border:`1px solid ${C.redBright}`, borderRadius:4, color:C.redBright, fontSize:11, padding:"1px 6px" }}>NACH</span>
                    )}

                    {isNat20 && <span style={{ color:C.gold,     fontSize:12 }}>✨ NAT 20!</span>}
                    {isNat1  && <span style={{ color:C.red,      fontSize:12 }}>💀 PATZER!</span>}
                  </div>
                  <span style={{ color:C.textDim, fontSize:11 }}>{r.ts}</span>
                </div>

                {/* Würfelergebnis */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                  {r.rollPairs ? (
                    <span style={{ color:C.textDim, fontSize:13 }}>
                      [
                      <span style={{ color: r.rolls[0] === r.rollPairs[0] ? advCol : C.textDim }}>
                        {r.rollPairs[0]}
                      </span>
                      {" / "}
                      <span style={{ color: r.rolls[0] === r.rollPairs[1] ? advCol : C.textDim }}>
                        {r.rollPairs[1]}
                      </span>
                      ]
                      {r.mod !== 0 ? ` ${r.mod > 0 ? "+" : ""}${r.mod}` : ""}
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
