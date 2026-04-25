import { C, FH } from "../../../constants/theme.js";

/**
 * RollResult — displays a formatted dice roll breakdown
 * Props:
 *   rolls: number[]   — individual dice results
 *   modifier: number  — flat modifier added
 *   total: number     — final sum
 *   label: string     — e.g. "Attack Roll" or "Damage"
 *   highlight: "hit"|"miss"|"crit"|null  — color coding
 *   extra: string     — optional extra text below
 */
export default function RollResult({ rolls = [], modifier = 0, total, label, highlight, extra }) {
  const highlightColor = {
    hit: C.greenBright,
    miss: C.redBright,
    crit: C.gold,
  }[highlight] || C.textBright;

  const bgColor = {
    hit: `${C.green}18`,
    miss: `${C.red}18`,
    crit: `${C.gold}18`,
  }[highlight] || `${C.surface}`;

  const rollStr = rolls.join(" + ");
  const modStr = modifier > 0 ? `+ ${modifier}` : modifier < 0 ? `− ${Math.abs(modifier)}` : "";

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${highlightColor}40`,
        borderRadius: 10,
        padding: "12px 14px",
        textAlign: "center",
      }}
    >
      {label && (
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
          {label}
        </div>
      )}

      {/* Dice breakdown */}
      <div style={{ fontSize: 13, color: C.text, marginBottom: 4, fontFamily: FH }}>
        {rollStr}
        {modStr && <span style={{ color: modifier >= 0 ? C.greenBright : C.redBright }}> {modStr}</span>}
      </div>

      {/* Total */}
      <div style={{ fontSize: 28, fontWeight: 700, color: highlightColor, fontFamily: FH, lineHeight: 1 }}>
        {total}
      </div>

      {/* Highlight label */}
      {highlight && (
        <div style={{ fontSize: 13, fontWeight: 700, color: highlightColor, marginTop: 4, letterSpacing: 1 }}>
          {highlight === "crit" ? "🎯 CRITICAL HIT!" : highlight === "hit" ? "✓ HIT" : "✗ MISS"}
        </div>
      )}

      {extra && (
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
          {extra}
        </div>
      )}
    </div>
  );
}
