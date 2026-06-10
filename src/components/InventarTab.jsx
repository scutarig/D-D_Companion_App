import { useState } from "react";
import { C, sx, FH, F } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";
import { useI18n } from "../i18n/index.js";
import CharInventory from "./CharInventory.jsx";
import Katalog from "./Katalog.jsx";

const CURR = [
  { id: "pp",       short: "PP", gpVal: 10,   col: "#e2e8f0" },
  { id: "gold",     short: "GP", gpVal: 1,    col: C.gold    },
  { id: "electrum", short: "EP", gpVal: 0.5,  col: "#67cdcd" },
  { id: "silver",   short: "SP", gpVal: 0.1,  col: "#94a3b8" },
  { id: "copper",   short: "CP", gpVal: 0.01, col: "#b45309" },
];

const lbl = { fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: F };
const ctStyle = { fontFamily: FH, fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" };

function WealthWidget({ char, setChar }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const totalGP = CURR.reduce((s, c) => s + (char[c.id] || 0) * c.gpVal, 0);
  const totalWeight = (char.inventory || []).reduce(
    (s, i) => s + (parseFloat((i.wt || "0").replace(/[^0-9.]/g, "")) || 0) * (i.qty || 1), 0
  );

  return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ ...sx.card, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 22 }}>💰</span>
          <div>
            <div style={lbl}>{t("inv.wealth","Vermögen")}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: FH, lineHeight: 1.1 }}>
              {totalGP % 1 === 0 ? totalGP : totalGP.toFixed(2)} <span style={{ fontSize: 14 }}>GP</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div style={lbl}>{t("inv.weight","Gewicht")}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textBright, lineHeight: 1.1 }}>
              {totalWeight.toFixed(1)} <span style={{ fontSize: 12, color: C.textDim }}>lb</span>
            </div>
          </div>
          <span style={{ fontSize: 13, color: C.textDim }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ ...sx.card, marginTop: 4, padding: 14 }}>
          {CURR.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ ...lbl, minWidth: 36, color: c.col }}>{c.short}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={e => { e.stopPropagation(); setChar(p => ({ ...p, [c.id]: Math.max(0, (p[c.id] || 0) - 1) })); }} style={{ width: 26, height: 26, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", fontSize: 15 }}>−</button>
                <input
                  type="number" value={char[c.id] || 0}
                  onChange={e => setChar(p => ({ ...p, [c.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                  onClick={e => e.stopPropagation()}
                  style={{ width: 64, textAlign: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: c.col, padding: "3px 0", fontSize: 16, fontWeight: 700 }}
                />
                <button onClick={e => { e.stopPropagation(); setChar(p => ({ ...p, [c.id]: (p[c.id] || 0) + 1 })); }} style={{ width: 26, height: 26, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", fontSize: 15 }}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InventarTab() {
  const { t } = useI18n();
  const { active, setActive } = useChar();
  const [view, setView] = useState("char");

  return (
    <div>
      {active && <WealthWidget char={active} setChar={setActive} />}

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setView("char")} style={sx.nb(view === "char")}>🗡️ {t("inv.equipment","Ausrüstung & Rucksack")}</button>
        <button onClick={() => setView("sammlung")} style={sx.nb(view === "sammlung")}>📚 {t("inv.catalog","Katalog")}</button>
      </div>

      {view === "char" && active && <CharInventory char={active} setChar={setActive} />}
      {view === "char" && !active && (
        <div style={{ ...sx.card, textAlign: "center", color: C.textDim, padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
          <div style={{ fontSize: 15 }}>{t("inv.no_char","Kein Charakter aktiv")}</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>{t("inv.no_char_hint","Wechsle zum Charakter-Tab und wähle einen Charakter aus.")}</div>
        </div>
      )}
      {view === "sammlung" && <Katalog char={active} setChar={setActive} />}
    </div>
  );
}
