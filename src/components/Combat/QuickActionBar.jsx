import { C, sx } from "../../constants/theme.js";
import { useState } from "react";
import AttackAction from "./ActionButtons/AttackAction.jsx";
import SaveRollModal from "./Rolls/SaveRollModal.jsx";
import SpellcastingPanel from "./Spells/SpellcastingPanel.jsx";

const QUICK_ACTIONS = [
  { id: "attack",  label: "Attack",  icon: "⚔️",  color: C.red },
  { id: "save",    label: "Save",    icon: "🛡️",  color: C.blue },
  { id: "dash",    label: "Dash",    icon: "👣",  color: C.teal },
  { id: "spell",   label: "Spell",   icon: "🔮",  color: C.purple },
];

const MORE_ACTIONS = [
  { id: "dodge",      label: "Dodge",      icon: "🔄", color: C.blue },
  { id: "help",       label: "Help",       icon: "🤝", color: C.green },
  { id: "hide",       label: "Hide",       icon: "🫥", color: C.teal },
  { id: "disengage",  label: "Disengage",  icon: "🏃", color: C.amber },
  { id: "ready",      label: "Ready",      icon: "⏱️", color: C.purple },
  { id: "use_item",   label: "Use Item",   icon: "🎒", color: C.gold },
];

export default function QuickActionBar({ onActionClick }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [attackOpen, setAttackOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [spellsOpen, setSpellsOpen] = useState(false);

  const handleActionClick = (actionId) => {
    if (actionId === "attack") { setAttackOpen(true); return; }
    if (actionId === "save")   { setSaveOpen(true);   return; }
    if (actionId === "spell")  { setSpellsOpen(true); return; }
    onActionClick?.(actionId);
  };

  return (
    <div>
      {/* Modals */}
      <AttackAction open={attackOpen} onClose={() => setAttackOpen(false)} />
      {saveOpen && <SaveRollModal onClose={() => setSaveOpen(false)} />}
      {spellsOpen && <SpellcastingPanel onClose={() => setSpellsOpen(false)} />}

      {/* Main 4 buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
        {QUICK_ACTIONS.map((action) => (
          <QuickBtn key={action.id} action={action} onClick={() => handleActionClick(action.id)} />
        ))}
      </div>

      {/* More toggle */}
      <button
        onClick={() => setMoreOpen(!moreOpen)}
        style={{
          width: "100%", padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 11, transition: "all .2s",
          border: `1px solid ${moreOpen ? C.purple + "55" : C.border}`,
          background: moreOpen ? `${C.purple}18` : C.surface,
          color: moreOpen ? C.purpleBright : C.textDim,
          fontWeight: moreOpen ? 700 : 400,
        }}
      >
        {moreOpen ? "▼ Weniger" : "▶ Mehr Aktionen..."}
      </button>

      {/* More actions grid */}
      {moreOpen && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {MORE_ACTIONS.map((action) => (
            <QuickBtn key={action.id} action={action} onClick={() => handleActionClick(action.id)} small />
          ))}
        </div>
      )}
    </div>
  );
}

function QuickBtn({ action, onClick, small = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: small ? "1 1 calc(33% - 4px)" : "1 1 calc(50% - 3px)",
        minWidth: small ? 60 : 70,
        padding: small ? "7px 4px" : "10px 8px",
        borderRadius: 6,
        border: `1px solid ${action.color}44`,
        background: `${action.color}10`,
        color: action.color,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all .2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        fontSize: small ? 10 : 11,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${action.color}22`;
        e.currentTarget.style.boxShadow = `0 0 8px ${action.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${action.color}10`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: small ? 15 : 18 }}>{action.icon}</span>
      {action.label}
    </button>
  );
}
