import { useState } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { rollAttack, isCritical } from "../../../utils/rolls.js";
import { useCombat } from "../../../context/CombatContext.jsx";
import TargetSelector from "./TargetSelector.jsx";
import RollResult from "./RollResult.jsx";

/**
 * AttackRollModal — W20 + attack bonus vs target AC
 * Props:
 *   attacker: Fighter (the active fighter)
 *   onClose: () => void
 *   onHit: (attackResult, targetId, isCrit) => void  — called to proceed to damage
 */
export default function AttackRollModal({ attacker, onClose, onHit }) {
  const { state } = useCombat();
  const [targetId, setTargetId] = useState("");
  const [attackBonus, setAttackBonus] = useState("0");
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [result, setResult] = useState(null);

  const target = state.fighters.find((f) => f.id === targetId);
  const crit = result ? isCritical(result) : false;
  const bonusNum = parseInt(attackBonus, 10) || 0;

  const handleRoll = () => {
    if (!targetId) return;
    const res = rollAttack(bonusNum, target.ac, { advantage, disadvantage });
    setResult(res);
  };

  const handleHit = () => {
    onHit?.(result, targetId, crit);
  };

  // Advantage and disadvantage are mutually exclusive
  const toggleAdvantage = () => {
    setAdvantage((v) => !v);
    if (!advantage) setDisadvantage(false);
  };
  const toggleDisadvantage = () => {
    setDisadvantage((v) => !v);
    if (!disadvantage) setAdvantage(false);
  };

  const highlight = result
    ? crit ? "crit" : result.hit ? "hit" : "miss"
    : null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.gold, fontWeight: 700 }}>
            ⚔️ Attack Roll
          </div>
          <button onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Attacker */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 1, marginBottom: 3, textTransform: "uppercase" }}>
            Attacker
          </div>
          <div style={{ fontSize: 14, color: C.purpleBright, fontWeight: 700 }}>
            {attacker?.name}
          </div>
        </div>

        {/* Target Selector */}
        <div style={{ marginBottom: 12 }}>
          <TargetSelector
            fighters={state.fighters}
            value={targetId}
            onChange={setTargetId}
            excludeId={attacker?.id}
            label="Target"
          />
        </div>

        {/* Attack Bonus */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>Attack Bonus</label>
          <input
            type="number"
            value={attackBonus}
            onChange={(e) => setAttackBonus(e.target.value)}
            style={{ ...sx.inp, width: "100%" }}
            placeholder="e.g. 5"
          />
        </div>

        {/* Advantage / Disadvantage */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={toggleAdvantage}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 6,
              border: `1px solid ${advantage ? C.green : C.border}`,
              background: advantage ? `${C.green}22` : C.surface,
              color: advantage ? C.greenBright : C.textDim,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: advantage ? 700 : 400,
              transition: "all .15s",
            }}
          >
            ▲ Advantage
          </button>
          <button
            onClick={toggleDisadvantage}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 6,
              border: `1px solid ${disadvantage ? C.red : C.border}`,
              background: disadvantage ? `${C.red}22` : C.surface,
              color: disadvantage ? C.redBright : C.textDim,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: disadvantage ? 700 : 400,
              transition: "all .15s",
            }}
          >
            ▼ Disadvantage
          </button>
        </div>

        {/* Roll Button */}
        {!result && (
          <button
            onClick={handleRoll}
            disabled={!targetId}
            style={{
              ...sx.btn(C.red),
              width: "100%",
              padding: "12px",
              fontSize: 14,
              opacity: !targetId ? 0.5 : 1,
              cursor: !targetId ? "not-allowed" : "pointer",
            }}
          >
            🎲 Roll Attack
          </button>
        )}

        {/* Result */}
        {result && (
          <div style={{ marginTop: 4 }}>
            {/* Advantage/Disadvantage secondary dice */}
            {(result.roll1 !== undefined) && (
              <div style={{ marginBottom: 8, fontSize: 12, color: C.textDim, textAlign: "center" }}>
                Rolled: <span style={{ color: C.textBright }}>{result.roll1}</span>
                {" "}and{" "}
                <span style={{ color: C.textBright }}>{result.roll2}</span>
                {" "}→{" "}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {result.advantage ? "took higher" : "took lower"}: {result.roll}
                </span>
              </div>
            )}

            <RollResult
              rolls={[result.roll]}
              modifier={bonusNum}
              total={result.total}
              label={`vs AC ${target?.ac}`}
              highlight={highlight}
            />

            {/* Action buttons after roll */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {(result.hit || crit) ? (
                <button
                  onClick={handleHit}
                  style={{ ...sx.btn(C.green), flex: 1, padding: "10px", fontSize: 13 }}
                >
                  💥 Roll Damage
                </button>
              ) : (
                <button
                  onClick={onClose}
                  style={{ ...sx.btn(C.teal), flex: 1, padding: "10px", fontSize: 13 }}
                >
                  ✓ Miss — Close
                </button>
              )}
              <button
                onClick={() => setResult(null)}
                style={{ ...sx.bsm(C.purple), padding: "10px 14px", fontSize: 12 }}
              >
                Re-Roll
              </button>
            </div>
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
  maxWidth: 360,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
};
