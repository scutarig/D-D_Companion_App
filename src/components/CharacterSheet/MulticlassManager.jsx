import { useState } from "react";
import { C, FH, sx } from "../../constants/theme.js";
import { ALL_KLASSEN } from "../../data/classes.js";
import { useMulticlass } from "../../hooks/useMulticlass.js";
import { canMulticlass } from "../../utils/multiclass.js";
import SubclassSelector from "./SubclassSelector.jsx";

const CLASS_ICONS = {
  "Barbar":"🪓","Barde":"🎶","Druide":"🌿","Hexenmeister":"👁️","Kämpfer":"⚔️",
  "Kleriker":"✝️","Magier":"🔮","Mönch":"👊","Paladin":"🛡️","Schurke":"🗡️",
  "Waldläufer":"🏹","Zauberer":"✨","Magieschmied":"⚙️",
};

/**
 * MulticlassManager — Manages character classes (single or multi).
 * Props: char, setChar
 */
export default function MulticlassManager({ char, setChar }) {
  const { classes, totalLevel, pb, addKlass, updateLevel, removeKlass, setSubclass } =
    useMulticlass(char.id, char, setChar);

  const [selected, setSelected] = useState("");
  const [error, setError]       = useState("");

  const available = ALL_KLASSEN.filter(k => !classes.some(c => c.name === k));

  const handleAdd = () => {
    if (!selected) return;
    const check = canMulticlass(char, selected);
    if (!check.ok) { setError(check.reason); return; }
    addKlass(selected);
    setSelected("");
    setError("");
  };

  return (
    <div style={{ ...sx.card, padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: FH, fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ⚔️ Klassen
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textDim }}>
            Level <strong style={{ color: C.textBright }}>{totalLevel}</strong>
            {" · "}PB <strong style={{ color: C.gold }}>+{pb}</strong>
          </span>
        </div>
      </div>

      {/* Class list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {classes.map((klass, idx) => (
          <div key={klass.name} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: idx === 0 ? `${C.gold}10` : `${C.purpleBright}08`,
            border: `1px solid ${idx === 0 ? C.gold : C.purpleBright}25`,
            borderRadius: 8, padding: "7px 10px",
          }}>
            {/* Icon + Name + Subclass */}
            <span style={{ fontSize: 16 }}>{CLASS_ICONS[klass.name] ?? "🎭"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: idx === 0 ? C.gold : C.purpleBright, fontFamily: FH }}>
                {klass.name}
                {idx === 0 && <span style={{ fontSize: 9, color: C.textDim, fontWeight: 400, marginLeft: 6 }}>PRIMÄR</span>}
              </div>
              <div style={{ fontSize: 10, color: C.textDim }}>HD {klass.hd}</div>
              <SubclassSelector
                className={klass.name}
                level={klass.level}
                value={(char.subclasses || {})[klass.name] || ""}
                onChange={sub => setSubclass(klass.name, sub)}
              />
            </div>

            {/* Level controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => updateLevel(klass.name, -1)}
                disabled={klass.level <= 1}
                style={{
                  width: 32, height: 32, borderRadius: 5, border: `1px solid ${C.border}`,
                  background: "none", color: C.textDim, cursor: klass.level <= 1 ? "default" : "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: klass.level <= 1 ? 0.3 : 1,
                }}
              >−</button>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.textBright, minWidth: 20, textAlign: "center", fontFamily: FH }}>
                {klass.level}
              </span>
              <button
                onClick={() => updateLevel(klass.name, 1)}
                disabled={totalLevel >= 20}
                style={{
                  width: 32, height: 32, borderRadius: 5, border: `1px solid ${C.border}`,
                  background: "none", color: C.textDim, cursor: totalLevel >= 20 ? "default" : "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: totalLevel >= 20 ? 0.3 : 1,
                }}
              >+</button>
            </div>

            {/* Remove (only for secondary classes) */}
            {classes.length > 1 && (
              <button
                onClick={() => removeKlass(klass.name)}
                style={{
                  width: 32, height: 32, borderRadius: 4, border: `1px solid ${C.redBright}40`,
                  background: `${C.redBright}10`, color: C.redBright, cursor: "pointer",
                  fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center",
                }}
                title="Klasse entfernen"
              >✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Add class row */}
      {totalLevel < 20 && (
        <div>
          <div style={{ display: "flex", gap: 6 }}>
            <select
              value={selected}
              onChange={e => { setSelected(e.target.value); setError(""); }}
              style={{ ...sx.sel, flex: 1, fontSize: 12 }}
            >
              <option value="">+ Klasse hinzufügen…</option>
              {available.map(k => <option key={k}>{k}</option>)}
            </select>
            <button
              onClick={handleAdd}
              disabled={!selected}
              style={{
                padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.gold}40`,
                background: selected ? `${C.gold}18` : "none",
                color: selected ? C.gold : C.textDim,
                cursor: selected ? "pointer" : "default",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}
            >Add</button>
          </div>
          {error && (
            <div style={{ fontSize: 11, color: C.redBright, marginTop: 5, padding: "4px 8px", borderRadius: 5, background: `${C.redBright}10`, border: `1px solid ${C.redBright}25` }}>
              ⚠ {error}
            </div>
          )}
        </div>
      )}

      {totalLevel >= 20 && (
        <div style={{ fontSize: 11, color: C.textDim, textAlign: "center", padding: "4px 0" }}>
          Maximallevel 20 erreicht
        </div>
      )}
    </div>
  );
}
