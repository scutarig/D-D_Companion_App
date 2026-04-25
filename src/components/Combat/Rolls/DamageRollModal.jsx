import { useState } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { rollDamage, doubleDamageDice, parseDiceNotation } from "../../../utils/rolls.js";
import RollResult from "./RollResult.jsx";

/**
 * DamageRollModal — roll damage and apply to target
 * Props:
 *   attacker: Fighter
 *   target: Fighter
 *   isCrit: boolean
 *   onClose: () => void
 *   onApply: (targetId, damage) => void
 */
export default function DamageRollModal({ attacker, target, isCrit = false, onClose, onApply }) {
  const [diceInput, setDiceInput] = useState("1d8");
  const [damageType, setDamageType] = useState("Piercing");
  const [result, setResult] = useState(null);
  const [applied, setApplied] = useState(false);

  const effectiveDice = isCrit ? doubleDamageDice(diceInput) : diceInput;
  const isValid = !!parseDiceNotation(effectiveDice);

  const handleRoll = () => {
    const res = rollDamage(effectiveDice);
    if (res) setResult(res);
  };

  const handleApply = () => {
    if (!result || !target) return;
    onApply?.(target.id, result.total);
    setApplied(true);
  };

  const DAMAGE_TYPES = ["Piercing", "Slashing", "Bludgeoning", "Fire", "Cold", "Lightning", "Poison", "Acid", "Radiant", "Necrotic", "Force", "Psychic", "Thunder"];

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.gold, fontWeight: 700 }}>
            {isCrit ? "🎯 Critical Damage!" : "💥 Damage Roll"}
          </div>
          <button onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Attacker → Target */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, background: C.surface, borderRadius: 8, padding: "8px 12px" }}>
          <span style={{ color: C.purpleBright, fontWeight: 700, fontSize: 13 }}>{attacker?.name}</span>
          <span style={{ color: C.textDim, fontSize: 12 }}>→</span>
          <span style={{ color: C.redBright, fontWeight: 700, fontSize: 13 }}>{target?.name}</span>
          <span style={{ color: C.textDim, fontSize: 11, marginLeft: "auto" }}>HP {target?.hp}/{target?.maxHp}</span>
        </div>

        {/* Critical badge */}
        {isCrit && (
          <div style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: "6px 10px", marginBottom: 12, textAlign: "center", fontSize: 12, color: C.gold, fontWeight: 700 }}>
            🎯 CRITICAL HIT — dice doubled: <span style={{ color: C.gold }}>{diceInput} → {doubleDamageDice(diceInput)}</span>
          </div>
        )}

        {/* Dice input */}
        <div style={{ marginBottom: 10 }}>
          <label style={sx.lbl}>Damage Dice</label>
          <input
            type="text"
            value={diceInput}
            onChange={(e) => { setDiceInput(e.target.value); setResult(null); }}
            style={{ ...sx.inp, borderColor: isValid ? undefined : C.redBright }}
            placeholder="1d8+3"
          />
          {!isValid && diceInput && (
            <div style={{ fontSize: 10, color: C.redBright, marginTop: 3 }}>
              Invalid format — use e.g. 1d8, 2d6+3, 1d4-1
            </div>
          )}
          {isCrit && (
            <div style={{ fontSize: 10, color: C.gold, marginTop: 3 }}>
              Effective: {effectiveDice} (critical)
            </div>
          )}
        </div>

        {/* Quick dice presets */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
          {["1d4", "1d6", "1d8", "1d10", "2d6", "1d12"].map((d) => (
            <button
              key={d}
              onClick={() => { setDiceInput(d); setResult(null); }}
              style={{
                ...sx.bsm(diceInput === d ? C.purple : C.border),
                padding: "4px 8px",
                fontSize: 10,
                background: diceInput === d ? `${C.purple}22` : "transparent",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Damage type */}
        <div style={{ marginBottom: 14 }}>
          <label style={sx.lbl}>Type</label>
          <select
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            style={{ ...sx.sel, fontSize: 12 }}
          >
            {DAMAGE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Roll button */}
        {!result && (
          <button
            onClick={handleRoll}
            disabled={!isValid}
            style={{
              ...sx.btn(isCrit ? C.gold : C.red),
              width: "100%",
              padding: "12px",
              fontSize: 14,
              opacity: isValid ? 1 : 0.5,
              cursor: isValid ? "pointer" : "not-allowed",
              color: isCrit ? C.bg : "#fff",
            }}
          >
            🎲 Roll {isCrit ? "Critical " : ""}Damage
          </button>
        )}

        {/* Result */}
        {result && !applied && (
          <div>
            <RollResult
              rolls={result.rolls}
              modifier={result.modifier}
              total={result.total}
              label={`${damageType} damage`}
              highlight={null}
            />

            {/* Preview new HP */}
            {target && (
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: C.textDim }}>
                {target.name}: {target.hp} HP →{" "}
                <span style={{
                  fontWeight: 700,
                  color: Math.max(0, target.hp - result.total) === 0 ? C.redBright : C.amberBright
                }}>
                  {Math.max(0, target.hp - result.total)} HP
                </span>
                {target.hp - result.total <= 0 && (
                  <span style={{ color: C.redBright }}> ☠️ Unconscious!</span>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={handleApply}
                style={{ ...sx.btn(C.red), flex: 1, padding: "10px", fontSize: 13 }}
              >
                ✓ Apply {result.total} Damage
              </button>
              <button
                onClick={() => setResult(null)}
                style={{ ...sx.bsm(C.purple), padding: "10px 14px", fontSize: 12 }}
              >
                Re-Roll
              </button>
            </div>
          </div>
        )}

        {/* Applied confirmation */}
        {applied && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 14, color: C.greenBright, fontWeight: 700, marginBottom: 4 }}>
              {result.total} damage applied!
            </div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 14 }}>
              {target?.name}: {Math.max(0, target.hp - result.total)} HP remaining
              {target?.hp - result.total <= 0 && " — Unconscious"}
            </div>
            <button onClick={onClose} style={{ ...sx.btn(C.teal), padding: "10px 20px" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
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
  maxWidth: 380,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
  maxHeight: "90vh",
  overflowY: "auto",
};
