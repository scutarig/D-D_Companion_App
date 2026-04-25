import { C, FH, SC } from "../../constants/theme.js";

const ABS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const modOf = (s) => Math.floor((s - 10) / 2);
const fmtMod = (m) => (m >= 0 ? `+${m}` : `${m}`);

/**
 * CompanionStats — D&D 5e stat block for a companion
 * Props: companion, compact (bool)
 */
export default function CompanionStats({ companion, compact = false }) {
  const stats = companion.stats ?? {};

  return (
    <div>
      {/* 6-stat row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: compact ? 4 : 6,
        marginBottom: compact ? 6 : 10,
      }}>
        {ABS.map((ab) => {
          const score = stats[ab] ?? 10;
          const mod = modOf(score);
          return (
            <div key={ab} style={{
              background: `${SC[ab]}10`,
              border: `1px solid ${SC[ab]}28`,
              borderRadius: 8,
              padding: compact ? "5px 2px" : "8px 4px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: compact ? 8 : 9, color: SC[ab], fontFamily: FH, fontWeight: 700, letterSpacing: 0.3, marginBottom: 2 }}>
                {ab}
              </div>
              <div style={{ fontSize: compact ? 12 : 14, fontWeight: 700, color: C.textBright, lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: compact ? 9 : 10, color: SC[ab], marginTop: 1 }}>
                {fmtMod(mod)}
              </div>
            </div>
          );
        })}
      </div>

      {/* AC / Speed */}
      {!compact && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {companion.senses && (
            <span style={{ fontSize: 11, color: C.textDim }}>
              👁 {companion.senses}
            </span>
          )}
          {companion.languages && (
            <span style={{ fontSize: 11, color: C.textDim }}>
              🗣 {companion.languages}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
