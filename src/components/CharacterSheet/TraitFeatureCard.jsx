import { C, FH } from "../../constants/theme.js";

const CATEGORY_CFG = {
  trait:   { label: "Trait",   color: "#10b981", icon: "✦" },
  feature: { label: "Feature", color: "#6366f1", icon: "⚡" },
};

/**
 * TraitFeatureCard — Individual trait or feature display card
 * Props: trait { id, name, description, source, category }
 */
export default function TraitFeatureCard({ trait }) {
  const cfg = CATEGORY_CFG[trait.category] ?? CATEGORY_CFG.trait;

  return (
    <div style={{
      background: `${cfg.color}08`,
      border: `1px solid ${cfg.color}25`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: 10, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: cfg.color }}>{cfg.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f0f5", fontFamily: FH }}>
            {trait.name}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <span style={{
            fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
            background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
            color: cfg.color, letterSpacing: 0.4, textTransform: "uppercase",
          }}>
            {cfg.label}
          </span>
        </div>
      </div>
      <p style={{
        fontSize: 12, color: C.textDim, margin: 0, lineHeight: 1.6,
      }}>
        {trait.description}
      </p>
    </div>
  );
}
