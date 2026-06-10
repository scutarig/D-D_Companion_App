import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";

const CURR = [
  { id: "pp",       label: "Platin",   short: "PP", icon: "🪙", color: "#e2e8f0", gpVal: 10    },
  { id: "gold",     label: "Gold",     short: "GP", icon: "💰", color: C.gold,    gpVal: 1     },
  { id: "electrum", label: "Elektrum", short: "EP", icon: "🔵", color: "#67e8f9", gpVal: 0.5   },
  { id: "silver",   label: "Silber",   short: "SP", icon: "⚪", color: "#94a3b8", gpVal: 0.1   },
  { id: "copper",   label: "Kupfer",   short: "CP", icon: "🟤", color: "#b45309", gpVal: 0.01  },
];

export default function CurrencyTab() {
  const { active: char, setActive: setChar } = useChar();
  const [txAmt, setTxAmt]   = useState("");
  const [txCurr, setTxCurr] = useState("gold");
  const [txDesc, setTxDesc] = useState("");
  const [log, setLog]       = useState([]);
  const [showCalc, setShowCalc] = useState(false);
  const [calcAmt, setCalcAmt]   = useState(1);
  const [calcFrom, setCalcFrom] = useState("gold");

  if (!char) return null;

  const totalGP = CURR.reduce((s, c) => s + (char[c.id] || 0) * c.gpVal, 0);

  const book = (dir) => {
    const n = Math.max(0, +txAmt || 0);
    if (!n) return;
    const sign = dir === "add" ? 1 : -1;
    setChar(p => ({ ...p, [txCurr]: Math.max(0, (p[txCurr] || 0) + sign * n) }));
    const cur = CURR.find(c => c.id === txCurr);
    setLog(l => [{ id: Date.now(), dir, amt: n, short: cur.short, color: cur.color, desc: txDesc, ts: new Date().toLocaleTimeString("de") }, ...l.slice(0, 29)]);
    setTxAmt(""); setTxDesc("");
  };

  const adjust = (id, delta) =>
    setChar(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));

  const autoConvert = () => {
    let cp = (char.copper || 0) + (char.silver || 0) * 10 + (char.electrum || 0) * 50 + (char.gold || 0) * 100 + (char.pp || 0) * 1000;
    const pp = Math.floor(cp / 1000); cp %= 1000;
    const gp = Math.floor(cp / 100);  cp %= 100;
    const ep = Math.floor(cp / 50);   cp %= 50;
    const sp = Math.floor(cp / 10);   cp %= 10;
    setChar(p => ({ ...p, pp, gold: gp, electrum: ep, silver: sp, copper: cp }));
  };

  const calcBaseGP = (calcAmt || 0) * (CURR.find(c => c.id === calcFrom)?.gpVal || 1);

  return (
    <div>

      {/* ── Gesamtwert ── */}
      <div style={{ ...sx.card, background: "linear-gradient(135deg,rgba(225,227,120,0.08),rgba(0,0,0,0.2))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FH, letterSpacing: 1, marginBottom: 4 }}>GESAMTVERMÖGEN</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.gold, fontFamily: FH }}>{totalGP.toLocaleString("de", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} <span style={{ fontSize: 16 }}>GP</span></div>
          </div>
          <button onClick={autoConvert} style={{ ...sx.btn(C.teal), fontSize: 12 }}>⟳ Münzen optimieren</button>
        </div>
      </div>

      {/* ── Schnelle Transaktion ── */}
      <div style={sx.card}>
        <div style={sx.ct}>⚡ Transaktion</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 10 }}>
          <div style={{ flex: "0 0 100px" }}>
            <label style={sx.lbl}>Betrag</label>
            <input
              type="number" min={0} value={txAmt}
              onChange={e => setTxAmt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && book("add")}
              style={{ ...sx.inp, fontSize: 20, fontWeight: 700, textAlign: "center" }}
              placeholder="0"
              autoFocus
            />
          </div>
          <div style={{ flex: "0 0 110px" }}>
            <label style={sx.lbl}>Währung</label>
            <select value={txCurr} onChange={e => setTxCurr(e.target.value)} style={{ ...sx.sel, fontSize: 15, fontWeight: 700 }}>
              {CURR.map(c => <option key={c.id} value={c.id}>{c.icon} {c.short}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={sx.lbl}>Notiz</label>
            <input value={txDesc} onChange={e => setTxDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && book("add")} style={sx.inp} placeholder="Beute, Sold, Kauf…" />
          </div>
          <button onClick={() => book("add")} style={{ ...sx.btn(C.green), fontSize: 14, padding: "10px 20px", flexShrink: 0 }}>+ Erhalten</button>
          <button onClick={() => book("sub")} style={{ ...sx.btn(C.red), fontSize: 14, padding: "10px 20px", flexShrink: 0 }}>− Ausgeben</button>
        </div>

        {/* Transaktionslog */}
        {log.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: .8, marginBottom: 6 }}>VERLAUF</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 160, overflowY: "auto" }}>
              {log.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, borderLeft: `3px solid ${e.dir === "add" ? C.greenBright : C.redBright}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: e.dir === "add" ? C.greenBright : C.redBright, minWidth: 70 }}>{e.dir === "add" ? "+" : "−"}{e.amt} {e.short}</span>
                  <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{e.desc || "—"}</span>
                  <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>{e.ts}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Geldbeutel ── */}
      <div style={sx.card}>
        <div style={sx.ct}>👜 Geldbeutel</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          {CURR.map(c => {
            const val = char[c.id] || 0;
            return (
              <div key={c.id} style={{ background: `${c.color}0e`, border: `1px solid ${c.color}35`, borderRadius: 14, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: FH, fontSize: 13, color: c.color, fontWeight: 700 }}>{c.short}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{c.label}</div>
                  </div>
                </div>

                {/* Betrag gross */}
                <input
                  type="number" min={0} value={val}
                  onChange={e => setChar(p => ({ ...p, [c.id]: Math.max(0, +e.target.value) }))}
                  style={{ ...sx.inp, fontSize: 32, fontWeight: 900, color: c.color, textAlign: "center", background: "transparent", border: `1px solid ${c.color}30`, borderRadius: 10, padding: "6px 4px", width: "100%" }}
                />

                {/* +/- Buttons — responsive grid: 2 Spalten auf engen Screens, 4 sonst */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))", gap: 4, width: "100%" }}>
                  {[-10, -1, 1, 10].map(d => (
                    <button key={d} onClick={() => adjust(c.id, d)} style={{
                      background: d < 0 ? `${C.red}18` : `${c.color}18`,
                      border: `1px solid ${d < 0 ? C.red : c.color}40`,
                      borderRadius: 8, color: d < 0 ? C.redBright : c.color,
                      fontSize: 12, fontWeight: 700, padding: "8px 0", cursor: "pointer", minHeight: 36,
                    }}>
                      {d > 0 ? `+${d}` : d}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Währungsrechner (kollabierbar) ── */}
      <div style={sx.card}>
        <button onClick={() => setShowCalc(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}>
          <div style={{ ...sx.ct, marginBottom: showCalc ? 12 : 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>🔄 Währungsrechner</span>
            <span style={{ fontSize: 12, color: C.textDim }}>{showCalc ? "▲" : "▼"}</span>
          </div>
        </button>
        {showCalc && (
          <>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 12 }}>
              <div><label style={sx.lbl}>Betrag</label><input type="number" min={0} value={calcAmt} onChange={e => setCalcAmt(Math.max(0, +e.target.value))} style={{ ...sx.inp, width: 90 }} /></div>
              <div><label style={sx.lbl}>Von</label>
                <select value={calcFrom} onChange={e => setCalcFrom(e.target.value)} style={{ ...sx.sel, width: 130 }}>
                  {CURR.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8 }}>
              {CURR.map(c => {
                const result = calcBaseGP / c.gpVal;
                const isFrom = c.id === calcFrom;
                return (
                  <div key={c.id} style={{ background: isFrom ? `${c.color}20` : `${c.color}08`, border: `1px solid ${c.color}${isFrom ? "55" : "22"}`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{c.icon}</div>
                    <div style={{ fontFamily: FH, fontSize: 10, color: c.color, marginBottom: 4 }}>{c.short}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isFrom ? c.color : C.textBright }}>
                      {result === Math.floor(result) ? result.toLocaleString("de") : result.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: C.textDim }}>
              1 PP = 10 GP = 20 EP = 100 SP = 1.000 CP
            </div>
          </>
        )}
      </div>

    </div>
  );
}
