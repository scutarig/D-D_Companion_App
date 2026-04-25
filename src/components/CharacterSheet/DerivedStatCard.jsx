import { C, FH } from "../../constants/theme.js";
import { fmtMod } from "../../utils/derivedStats.js";

/**
 * DerivedStatCard — Individual stat display
 * Props: label, value (number), color, formula (string), size ("sm"|"md"|"lg"), proficient (bool)
 */
export default function DerivedStatCard({ label, value, color, formula, size = "md", proficient = false }) {
  const fontSize = size === "lg" ? 24 : size === "sm" ? 14 : 18;
  const padding  = size === "lg" ? "10px 12px" : size === "sm" ? "5px 8px" : "8px 10px";

  return (
    <div style={{
      background:   `${color}0d`,
      border:       `1px solid ${color}30`,
      borderRadius: 10,
      padding,
      textAlign:    "center",
      position:     "relative",
      minWidth:     size === "lg" ? 80 : 60,
    }}>
      {/* Prof indicator dot */}
      {proficient && (
        <div style={{
          position: "absolute", top: 4, right: 4,
          width: 5, height: 5, borderRadius: "50%",
          background: color, opacity: 0.8,
        }} />
      )}

      <div style={{
        fontSize: 9, color, fontWeight: 700,
        letterSpacing: 0.6, textTransform: "uppercase",
        fontFamily: FH, marginBottom: 3,
      }}>
        {label}
      </div>

      <div style={{
        fontSize, fontWeight: 800, color: C.textBright, lineHeight: 1,
      }}>
        {fmtMod(value)}
      </div>

      {formula && (
        <div style={{ fontSize: 9, color: C.textDim, marginTop: 3, lineHeight: 1.2 }}>
          {formula}
        </div>
      )}
    </div>
  );
}
