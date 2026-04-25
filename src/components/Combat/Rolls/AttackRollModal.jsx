import { useState, useEffect } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { rollAttack, isCritical } from "../../../utils/rolls.js";
import { useCombat } from "../../../context/CombatContext.jsx";
import { suggestAttackModifiers } from "../../../utils/conditions.js";
import TargetSelector from "./TargetSelector.jsx";
import RollResult from "./RollResult.jsx";

/**
 * AttackRollModal — W20 + attack bonus vs target AC
 * Props:
 *   attacker: Fighter (the active fighter)
 *   onClose: () => void
 *   onHit: (attackResult, targetId, isCrit) => void
 */
export default function AttackRollModal({ attacker, onClose, onHit }) {
  const { state } = useCombat();
  const [targetId, setTargetId] = useState("");
  const [attackBonus, setAttackBonus] = useState("0");
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [result, setResult] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const target = state.fighters.find((f) => f.id === targetId);
  const crit = result ? isCritical(result) : false;
  const bonusNum = parseInt(attackBonus, 10) || 0;

  // Auto-suggest advantage/disadvantage from conditions
  useEffect(() => {
    if (!attacker || !target) { setSuggestion(null); return; }
    const s = suggestAttackModifiers(attacker, target);
    setSuggestion(s);
    // Auto-apply suggestion if nothing manually set yet
    if (!result) {
      setAdvantage(s.advantage);
      setDisadvantage(s.disadvantage);
    }
  }, [targetId, attacker?.id]);

  const handleRoll = () => {
    if (!targetId) return;
    const res = rollAttack(bonusNum, target.ac, { advantage, disadvantage });
    setResult(res);
  };

  const toggleAdv = () => { setAdvantage((v) => !v); setDisadvantage(false); };
  const toggleDis = () => { setDisadvantage((v) => !v); setAdvantage(false); };

  const highlight = result ? (crit ? "crit" : result.hit ? "hit" : "miss") : null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.gold, fontWeight: 700 }}>⚔️ Attack Roll</div>
          <button onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Attacker */}
        <div style={{ background: `${C.purple}12`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 0.5, marginBottom: 2 }}>ANGREIFER</div>
          <div style={{ fontSize: 14, color: C.purpleBright, fontWeight: 700 }}>{attacker?.name}</div>
        </div>

        {/* Target */}
        <div style={{ marginBottom: 12 }}>
          <TargetSelector
            fighters={state.fighters}
            value={targetId}
            onChange={(id) => { setTargetId(id); setResult(null); }}
            excludeId={attacker?.id}
            label="Ziel"
          />
        </div>

        {/* Condition suggestion banner */}
        {suggestion && (suggestion.advReasons.length > 0 || suggestion.disReasons.length > 0) && (
          <div style={{
            background: suggestion.cancelled
              ? `${C.textDim}10`
              : suggestion.advantage ? `${C.green}12` : `${C.red}12`,
            border: `1px solid ${suggestion.cancelled ? C.border : suggestion.advantage ? C.green + "40" : C.red + "40"}`,
            borderRadius: 8, padding: "8px 10px", marginBottom: 12, fontSize: 11,
          }}>
            <div style={{ fontWeight: 700, color: suggestion.cancelled ? C.textDim : suggestion.advantage ? C.greenBright : C.redBright, marginBottom: 4 }}>
              {suggestion.cancelled
                ? "⚖ Advantage & Disadvantage heben sich auf"
                : suggestion.advantage ? "▲ Advantage empfohlen" : "▼ Disadvantage empfohlen"}
            </div>
            {suggestion.advReasons.length > 0 && (
              <div style={{ color: C.greenBright }}>+ {suggestion.advReasons.join(", ")}</div>
            )}
            {suggestion.disReasons.length > 0 && (
              <div style={{ color: C.redBright }}>− {suggestion.disReasons.join(", ")}</div>
            )}
          </div>
        )}

        {/* Attack Bonus */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>Angriffs-Bonus</label>
          <input
            type="number"
            value={attackBonus}
            onChange={(e) => setAttackBonus(e.target.value)}
            style={{ ...sx.inp, fontSize: 16, fontWeight: 700, textAlign: "center" }}
            placeholder="z.B. 5"
          />
        </div>

        {/* Advantage / Disadvantage */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={toggleAdv} style={{
            flex: 1, padding: "8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: advantage ? 700 : 400, transition: "all .15s",
            border: `1px solid ${advantage ? C.green : C.border}`,
            background: advantage ? `${C.green}22` : C.surface,
            color: advantage ? C.greenBright : C.textDim,
          }}>
            ▲ Advantage
          </button>
          <button onClick={toggleDis} style={{
            flex: 1, padding: "8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: disadvantage ? 700 : 400, transition: "all .15s",
            border: `1px solid ${disadvantage ? C.red : C.border}`,
            background: disadvantage ? `${C.red}22` : C.surface,
            color: disadvantage ? C.redBright : C.textDim,
          }}>
            ▼ Disadvantage
          </button>
        </div>

        {/* Roll */}
        {!result ? (
          <button
            onClick={handleRoll}
            disabled={!targetId}
            style={{
              ...sx.btn(C.red), width: "100%", padding: "12px", fontSize: 14,
              opacity: !targetId ? 0.5 : 1, cursor: !targetId ? "not-allowed" : "pointer",
            }}
          >
            🎲 Angriff würfeln
          </button>
        ) : (
          <div>
            {result.roll1 !== undefined && (
              <div style={{ marginBottom: 8, fontSize: 12, color: C.textDim, textAlign: "center" }}>
                Gewürfelt: <span style={{ color: C.textBright }}>{result.roll1}</span> und{" "}
                <span style={{ color: C.textBright }}>{result.roll2}</span> →{" "}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {result.advantage ? "höher" : "niedriger"} genommen: {result.roll}
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
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {(result.hit || crit) ? (
                <button onClick={() => onHit?.(result, targetId, crit)} style={{ ...sx.btn(C.green), flex: 1, padding: "10px", fontSize: 13 }}>
                  💥 Schaden würfeln
                </button>
              ) : (
                <button onClick={onClose} style={{ ...sx.btn(C.teal), flex: 1, padding: "10px", fontSize: 13 }}>
                  ✓ Daneben — Schließen
                </button>
              )}
              <button onClick={() => setResult(null)} style={{ ...sx.bsm(C.purple), padding: "10px 14px", fontSize: 12 }}>
                🎲 Neu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16,
};
const modalStyle = {
  background: "#1e1b22", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 360,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto",
};
