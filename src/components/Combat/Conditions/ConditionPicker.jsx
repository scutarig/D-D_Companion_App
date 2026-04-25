import { useState } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { CONDITIONS, getConditionId } from "../../../utils/conditions.js";

/**
 * ConditionPicker — modal to add conditions to a fighter
 * Props:
 *   fighter: Fighter
 *   onAdd: (conditionId, duration) => void
 *   onClose: () => void
 */
export default function ConditionPicker({ fighter, onAdd, onClose }) {
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState("permanent");
  const [customRounds, setCustomRounds] = useState("1");

  const currentIds = (fighter?.conditions ?? []).map(getConditionId);

  const handleAdd = () => {
    if (!selected) return;
    const dur = duration === "permanent" ? null : parseInt(customRounds) || 1;
    onAdd?.(selected, dur);
    setSelected(null);
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.amber, fontWeight: 700 }}>
            ⚡ Condition hinzufügen
          </div>
          <button onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
          Für: <span style={{ color: C.purpleBright, fontWeight: 700 }}>{fighter?.name}</span>
        </div>

        {/* Condition Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
          maxHeight: 320,
          overflowY: "auto",
          marginBottom: 14,
          paddingRight: 2,
        }}>
          {CONDITIONS.map((cond) => {
            const alreadyHas = currentIds.includes(cond.id);
            const isSelected = selected === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => !alreadyHas && setSelected(isSelected ? null : cond.id)}
                title={cond.desc}
                style={{
                  padding: "8px 6px",
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? cond.color + "88" : alreadyHas ? cond.color + "30" : C.border}`,
                  background: isSelected ? `${cond.color}22` : alreadyHas ? `${cond.color}10` : "transparent",
                  color: alreadyHas ? cond.color + "88" : isSelected ? cond.color : C.text,
                  cursor: alreadyHas ? "default" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  transition: "all .15s",
                  fontSize: 11,
                  fontWeight: isSelected ? 700 : 400,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 18 }}>{cond.icon}</span>
                <span style={{ lineHeight: 1.2, textAlign: "center" }}>{cond.name}</span>
                {alreadyHas && (
                  <span style={{ position: "absolute", top: 3, right: 4, fontSize: 9, color: cond.color }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected condition info + duration */}
        {selected && (() => {
          const cond = CONDITIONS.find((c) => c.id === selected);
          return (
            <div style={{ background: `${cond.color}10`, border: `1px solid ${cond.color}30`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: cond.color, fontWeight: 700, marginBottom: 4 }}>
                {cond.icon} {cond.name}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 10 }}>{cond.desc}</div>

              {/* Duration */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.textDim }}>Dauer:</span>
                <button
                  onClick={() => setDuration("permanent")}
                  style={{
                    ...sx.bsm(duration === "permanent" ? C.amber : C.border),
                    background: duration === "permanent" ? `${C.amber}20` : "transparent",
                    fontSize: 11, padding: "4px 10px",
                  }}
                >
                  Permanent
                </button>
                <button
                  onClick={() => setDuration("rounds")}
                  style={{
                    ...sx.bsm(duration === "rounds" ? C.teal : C.border),
                    background: duration === "rounds" ? `${C.teal}20` : "transparent",
                    fontSize: 11, padding: "4px 10px",
                  }}
                >
                  Runden
                </button>
                {duration === "rounds" && (
                  <input
                    type="number"
                    min={1} max={99}
                    value={customRounds}
                    onChange={(e) => setCustomRounds(e.target.value)}
                    style={{ ...sx.inp, width: 60, fontSize: 13, padding: "4px 8px" }}
                    autoFocus
                  />
                )}
              </div>
            </div>
          );
        })()}

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!selected}
          style={{
            ...sx.btn(selected ? (CONDITIONS.find((c) => c.id === selected)?.color || C.amber) : C.border),
            width: "100%",
            padding: "11px",
            fontSize: 14,
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          ⚡ Condition anwenden
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.78)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: 16,
};

const modalStyle = {
  background: "#1e1b22",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  padding: 20,
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
  maxHeight: "90vh",
  overflowY: "auto",
};
