import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";

const ActionCheckbox = ({ label, icon, checked, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      cursor: "pointer",
      opacity: checked ? 1 : 0.5,
      transition: "opacity .2s",
      padding: "6px 8px",
      borderRadius: 6,
      border: `1px solid ${checked ? C.purple : C.border}`,
      background: checked ? `${C.purple}12` : "transparent",
      minWidth: 50,
    }}
  >
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 10, color: checked ? C.purpleBright : C.textDim, fontFamily: FH, fontWeight: 700 }}>
      {checked ? "✓" : "✗"}
    </span>
    <span style={{ fontSize: 9, color: C.textDim, textAlign: "center" }}>{label}</span>
  </div>
);

export default function ActionEconomyBar() {
  const { state } = useCombat();

  if (state.activeIndex < 0 || state.activeIndex >= state.fighters.length) {
    return null;
  }

  const fighter = state.fighters[state.activeIndex];

  const toggleAction = (actionType) => {
    // In Phase 2, we just display state. Actual toggle happens in Phase 3+
    console.log(`Toggle ${actionType} for ${fighter.name}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Actions Row */}
      <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
        <ActionCheckbox
          label="Action"
          icon="⚔️"
          checked={fighter.actions.action}
          onClick={() => toggleAction("action")}
        />
        <ActionCheckbox
          label="Bonus"
          icon="⚡"
          checked={fighter.actions.bonusAction}
          onClick={() => toggleAction("bonusAction")}
        />
        <ActionCheckbox
          label="React"
          icon="🛡️"
          checked={fighter.actions.reaction}
          onClick={() => toggleAction("reaction")}
        />
      </div>

      {/* Movement & Free Interaction */}
      <div style={{ display: "flex", gap: 6, justifyContent: "space-between", fontSize: 12 }}>
        <div style={{ flex: 1, background: C.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>MOVEMENT</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textBright }}>
            {fighter.actions.movement}/30 ft
          </div>
        </div>
        <div
          onClick={() => toggleAction("freeInteraction")}
          style={{
            flex: 1,
            background: fighter.actions.freeInteraction ? `${C.green}12` : `${C.red}12`,
            borderRadius: 6,
            padding: "8px 10px",
            border: `1px solid ${fighter.actions.freeInteraction ? C.green : C.red}`,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "all .2s",
          }}
        >
          <div style={{ fontSize: 9, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>FREE</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: fighter.actions.freeInteraction ? C.greenBright : C.redBright }}>
            {fighter.actions.freeInteraction ? "✓" : "✗"}
          </div>
        </div>
      </div>
    </div>
  );
}
