import { useState, useRef } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import CompanionStats from "./CompanionStats.jsx";

// Companion type config
const TYPE_CFG = {
  beast:     { label: "Tier",       icon: "🐾", color: C.green    },
  construct: { label: "Konstrukt",  icon: "⚙️",  color: C.blue     },
  humanoid:  { label: "Humanoid",   icon: "👤", color: C.teal     },
  fiend:     { label: "Teufel",     icon: "😈", color: C.red      },
  undead:    { label: "Untoter",    icon: "💀", color: C.purple   },
  celestial: { label: "Himmlisch",  icon: "✨", color: C.gold     },
  fey:       { label: "Fee",        icon: "🧚", color: C.purpleBright },
  dragon:    { label: "Drache",     icon: "🐉", color: C.amberBright },
  other:     { label: "Sonstiges",  icon: "❓", color: C.textDim  },
};

export function typeOf(type) {
  return TYPE_CFG[type] ?? TYPE_CFG.other;
}

function hpColor(hp, max) {
  const p = hp / (max || 1);
  return p > 0.5 ? C.green : p > 0.25 ? C.amber : C.red;
}
function hpText(hp, max) {
  const p = hp / (max || 1);
  return p > 0.5 ? C.greenBright : p > 0.25 ? C.amberBright : C.redBright;
}

function HoldBtn({ label, onPress, style }) {
  const t = useRef(null), iv = useRef(null);
  const start = (e) => {
    e.preventDefault();
    onPress();
    t.current = setTimeout(() => { iv.current = setInterval(onPress, 80); }, 400);
  };
  const stop = () => { clearTimeout(t.current); clearInterval(iv.current); };
  return (
    <button
      style={style}
      onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
      onTouchStart={start} onTouchEnd={stop}
    >
      {label}
    </button>
  );
}

/**
 * CompanionCard — compact display of a single companion
 * Props: companion, onEdit, onDelete, onHpChange
 */
export default function CompanionCard({ companion, onEdit, onDelete, onHpChange }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = typeOf(companion.type);
  const hpPct = Math.max(0, Math.min(1, companion.hp / (companion.maxHp || 1)));
  const col = hpColor(companion.hp, companion.maxHp);
  const textCol = hpText(companion.hp, companion.maxHp);

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${cfg.color}28`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: 12,
      padding: "12px 14px",
      marginBottom: 8,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{cfg.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {companion.name}
            </span>
            {companion.cr && (
              <span style={{ ...sx.tag(cfg.color), fontSize: 9 }}>CR {companion.cr}</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 1 }}>
            {cfg.label}{companion.size ? ` · ${companion.size}` : ""} · AC {companion.ac} · {companion.speed} ft.
          </div>
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{ ...sx.bsm(C.blue), fontSize: 11, padding: "4px 8px" }}
          >
            {expanded ? "▲" : "▼"}
          </button>
          <button onClick={() => onEdit?.(companion)} style={{ ...sx.bsm(C.amber), fontSize: 11, padding: "4px 8px" }}>✎</button>
          <button
            onClick={() => {
              if (window.confirm(`"${companion.name}" wirklich löschen?`)) onDelete?.(companion.id);
            }}
            style={{ ...sx.bsm(C.red), fontSize: 11, padding: "4px 8px" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* HP Bar + controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <HoldBtn
          label="−"
          onPress={() => onHpChange?.(companion.id, -1)}
          style={{ ...sx.bsm(C.red), fontSize: 14, padding: "3px 10px", fontWeight: 700 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: C.textDim }}>HP</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: textCol }}>
              {companion.hp} / {companion.maxHp}
            </span>
          </div>
          <div style={{ height: 5, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${hpPct * 100}%`, background: col, borderRadius: 3, transition: "width .2s" }} />
          </div>
        </div>
        <HoldBtn
          label="+"
          onPress={() => onHpChange?.(companion.id, +1)}
          style={{ ...sx.bsm(C.green), fontSize: 14, padding: "3px 10px", fontWeight: 700 }}
        />
      </div>

      {/* Expanded: stats + details */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <CompanionStats companion={companion} compact />
          {companion.traits && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 4 }}>TRAITS</div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{companion.traits}</div>
            </div>
          )}
          {companion.actions && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 4 }}>AKTIONEN</div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{companion.actions}</div>
            </div>
          )}
          {companion.notes && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 4 }}>NOTIZEN</div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{companion.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
