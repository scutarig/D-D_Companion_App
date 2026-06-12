import { useState, useMemo } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { rollSave } from "../../../utils/rolls.js";
import { useCombat } from "../../../context/CombatContext.jsx";
import { useCombatActions } from "../../../hooks/useCombatActions.js";
import { addLog } from "../../../utils/log.js";
import { saveModifier, fmtMod } from "../../../data/skills.js";
import RollResult from "./RollResult.jsx";
import TargetSelector from "./TargetSelector.jsx";

const SAVE_TYPES = [
  { key: "STR", label: "Strength",     icon: "💪", color: "#c04040" },
  { key: "DEX", label: "Dexterity",    icon: "🏹", color: "#40c0a0" },
  { key: "CON", label: "Constitution", icon: "🛡️", color: "#c08040" },
  { key: "INT", label: "Intelligence", icon: "📚", color: "#4080c0" },
  { key: "WIS", label: "Wisdom",       icon: "🦉", color: "#a040c0" },
  { key: "CHA", label: "Charisma",     icon: "✨", color: "#c06090" },
];

/**
 * SaveRollModal — Saving throw DC roller
 * Props:
 *   onClose: () => void
 */
export default function SaveRollModal({ onClose }) {
  const { state, setState } = useCombat();
  const [saveType, setSaveType] = useState("DEX");
  const [dc, setDc] = useState("15");
  const [manualMod, setManualMod] = useState(null); // null = auto from fighter
  const [targetId, setTargetId] = useState(
    state.fighters[state.activeIndex]?.id ?? ""
  );
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [result, setResult] = useState(null);

  const target = state.fighters.find((f) => f.id === targetId) ?? null;
  const dcNum = parseInt(dc) || 10;

  // Auto-fill from fighter's save modifier
  const autoMod = useMemo(() => {
    if (!target) return 0;
    return saveModifier(target, saveType);
  }, [target, saveType]);

  const modNum = manualMod !== null ? (parseInt(manualMod) || 0) : autoMod;
  const hasSaveProf = target?.saveProficiencies?.[saveType] ?? false;

  const handleRoll = () => {
    const res = rollSave(modNum, dcNum, { advantage, disadvantage });
    setResult(res);

    // Log the save
    const typeName = SAVE_TYPES.find((s) => s.key === saveType)?.label ?? saveType;
    const targetName = target?.name ?? "Unknown";
    setState((prev) =>
      addLog(
        prev,
        "action",
        `${targetName}: ${typeName} Save (DC ${dcNum}) — ${res.roll}${modNum !== 0 ? ` ${fmtMod(modNum)}` : ""} = ${res.total} → ${res.success ? "✓ SUCCESS" : "✗ FAIL"}`,
        null,
        target?.id ?? null
      )
    );
  };

  const toggleAdv = () => { setAdvantage((v) => !v); if (!advantage) setDisadvantage(false); setResult(null); };
  const toggleDis = () => { setDisadvantage((v) => !v); if (!disadvantage) setAdvantage(false); setResult(null); };

  const activeSave = SAVE_TYPES.find((s) => s.key === saveType);
  const highlight = result ? (result.success ? "hit" : "miss") : null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.gold, fontWeight: 700 }}>🛡️ Saving Throw</div>
          <button type="button" onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }} aria-label={t("modal.close","Schließen")}>✕</button>
        </div>

        {/* Save type selector */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>Save Type</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))", gap: 4 }}>
            {SAVE_TYPES.map((s) => (
              <button type="button"
                key={s.key}
                onClick={() => { setSaveType(s.key); setResult(null); }}
                style={{
                  padding: "7px 4px",
                  borderRadius: 6,
                  border: `1px solid ${saveType === s.key ? s.color + "88" : C.border}`,
                  background: saveType === s.key ? `${s.color}22` : "transparent",
                  color: saveType === s.key ? s.color : C.textDim,
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: saveType === s.key ? 700 : 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                {s.key}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div style={{ marginBottom: 10 }}>
          <TargetSelector
            fighters={state.fighters}
            value={targetId}
            onChange={(id) => { setTargetId(id); setManualMod(null); setResult(null); }}
            label="Creature"
          />
        </div>

        {/* Auto-mod hint */}
        {target && (
          <div style={{
            fontSize: 11, color: hasSaveProf ? C.greenBright : C.textDim,
            marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
            background: `${C.surface}`, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px",
          }}>
            {hasSaveProf
              ? <span>✓ <strong>{target.name}</strong> ist proficient in {saveType} Saves</span>
              : <span>{target.name} · {saveType} Save Modifier: <strong>{fmtMod(autoMod)}</strong></span>
            }
          </div>
        )}

        {/* DC + Modifier */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={sx.lbl}>Difficulty Class (DC)</label>
            <input
              type="number"
              value={dc}
              onChange={(e) => { setDc(e.target.value); setResult(null); }}
              style={{ ...sx.inp, fontSize: 16, fontWeight: 700, textAlign: "center" }}
            />
          </div>
          <div>
            <label style={sx.lbl}>Save Modifier</label>
            <input
              type="number"
              value={manualMod !== null ? manualMod : modNum}
              onChange={(e) => { setManualMod(e.target.value); setResult(null); }}
              style={{
                ...sx.inp, fontSize: 16, fontWeight: 700, textAlign: "center",
                color: modNum >= 0 ? C.greenBright : C.redBright,
              }}
              placeholder="0"
            />
          </div>
        </div>

        {/* Advantage / Disadvantage */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button type="button"
            onClick={toggleAdv}
            style={{
              flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: advantage ? 700 : 400, transition: "all .15s",
              border: `1px solid ${advantage ? C.green : C.border}`,
              background: advantage ? `${C.green}22` : C.surface,
              color: advantage ? C.greenBright : C.textDim,
            }}
          >
            ▲ Advantage
          </button>
          <button type="button"
            onClick={toggleDis}
            style={{
              flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: disadvantage ? 700 : 400, transition: "all .15s",
              border: `1px solid ${disadvantage ? C.red : C.border}`,
              background: disadvantage ? `${C.red}22` : C.surface,
              color: disadvantage ? C.redBright : C.textDim,
            }}
          >
            ▼ Disadvantage
          </button>
        </div>

        {/* Roll */}
        {!result ? (
          <button type="button"
            onClick={handleRoll}
            style={{
              ...sx.btn(activeSave?.color || C.teal),
              width: "100%", padding: "12px", fontSize: 14,
            }}
          >
            🎲 Roll {activeSave?.label ?? ""} Save (DC {dcNum})
          </button>
        ) : (
          <div>
            {result.roll1 !== undefined && (
              <div style={{ marginBottom: 8, fontSize: 12, color: C.textDim, textAlign: "center" }}>
                Rolled: {result.roll1} and {result.roll2} →{" "}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {result.advantage ? "took higher" : "took lower"}: {result.roll}
                </span>
              </div>
            )}
            <RollResult
              rolls={[result.roll]}
              modifier={modNum}
              total={result.total}
              label={`${activeSave?.label} Save vs DC ${dcNum}`}
              highlight={highlight}
              extra={result.success ? "✓ Save Successful!" : "✗ Save Failed!"}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => setResult(null)} style={{ ...sx.bsm(C.purple), flex: 1, padding: "9px", fontSize: 12 }}>
                🎲 Re-Roll
              </button>
              <button type="button" onClick={onClose} style={{ ...sx.btn(C.teal), flex: 1, padding: "9px", fontSize: 12 }}>
                Close
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
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 380,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto",
};
