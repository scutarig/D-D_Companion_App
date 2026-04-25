import { C, sx } from "../../constants/theme.js";
import { useState } from "react";
import AttackAction from "./ActionButtons/AttackAction.jsx";

const QUICK_ACTIONS = [
  { id: "attack", label: "Attack", icon: "⚔️", color: C.red },
  { id: "dodge", label: "Dodge", icon: "🛡️", color: C.blue },
  { id: "dash", label: "Dash", icon: "👣", color: C.teal },
  { id: "spell", label: "Spell", icon: "🔮", color: C.purple },
];

export default function QuickActionBar({ onActionClick }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [attackOpen, setAttackOpen] = useState(false);

  const handleActionClick = (actionId) => {
    if (actionId === "attack") {
      setAttackOpen(true);
      return;
    }
    onActionClick?.(actionId);
  };

  return (
    <div>
      {/* Attack modal */}
      <AttackAction open={attackOpen} onClose={() => setAttackOpen(false)} />

      {/* Main 4 buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: moreOpen ? 8 : 0 }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            style={{
              flex: "1 1 calc(50% - 3px)",
              minWidth: 70,
              padding: "10px 8px",
              borderRadius: 6,
              border: `1px solid ${action.color}44`,
              background: `${action.color}12`,
              color: action.color,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${action.color}22`;
              e.currentTarget.style.boxShadow = `0 0 8px ${action.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${action.color}12`;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 16 }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* More actions button */}
      <button
        onClick={() => setMoreOpen(!moreOpen)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 6,
          border: `1px solid ${C.border}`,
          background: moreOpen ? `${C.purple}22` : C.surface,
          color: moreOpen ? C.purpleBright : C.textDim,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: moreOpen ? 700 : 400,
          transition: "all .2s",
        }}
      >
        {moreOpen ? "▼ Hide More" : "▶ More Actions..."}
      </button>

      {/* More actions menu */}
      {moreOpen && (
        <div style={{ background: C.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${C.border}`, marginTop: 8, fontSize: 11 }}>
          <button
            onClick={() => handleActionClick("help")}
            style={{ ...sx.bsm(C.green), width: "100%", marginBottom: 4 }}
          >
            Help
          </button>
          <button
            onClick={() => handleActionClick("hide")}
            style={{ ...sx.bsm(C.blue), width: "100%", marginBottom: 4 }}
          >
            Hide
          </button>
          <button
            onClick={() => handleActionClick("disengage")}
            style={{ ...sx.bsm(C.teal), width: "100%" }}
          >
            Disengage
          </button>
        </div>
      )}
    </div>
  );
}
