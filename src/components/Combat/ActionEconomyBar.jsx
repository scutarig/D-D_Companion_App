import { C, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";

const ACTIONS = [
  { key: "action",          icon: "⚔️",  label: "Action",   color: C.red },
  { key: "bonusAction",     icon: "⚡",  label: "Bonus",    color: C.amber },
  { key: "reaction",        icon: "🛡️",  label: "Reaction", color: C.blue },
];

export default function ActionEconomyBar() {
  const { state, setState } = useCombat();

  if (state.activeIndex < 0 || state.activeIndex >= state.fighters.length) return null;

  const fighter = state.fighters[state.activeIndex];

  const toggle = (key) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f, i) =>
        i === prev.activeIndex
          ? { ...f, actions: { ...f.actions, [key]: !f.actions[key] } }
          : f
      ),
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Main 3 action toggles */}
      <div style={{ display: "flex", gap: 6 }}>
        {ACTIONS.map(({ key, icon, label, color }) => {
          const active = fighter.actions[key];
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                flex: 1,
                padding: "10px 6px",
                borderRadius: 8,
                border: `1px solid ${active ? color + "66" : C.border}`,
                background: active ? `${color}18` : `${C.surface}`,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all .2s",
                opacity: active ? 1 : 0.45,
              }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 10, color: active ? color : C.textDim, fontFamily: FH, fontWeight: 700, letterSpacing: 0.5 }}>
                {label}
              </span>
              <span style={{ fontSize: 11, color: active ? color : C.textDim, fontWeight: 700 }}>
                {active ? "✓" : "✗"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Movement + Free Interaction */}
      <div style={{ display: "flex", gap: 6 }}>
        {/* Movement — display only (speed preset) */}
        <div style={{
          flex: 1, background: C.surface, borderRadius: 8, padding: "8px 10px",
          border: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 16 }}>👣</span>
          <span style={{ fontSize: 9, color: C.textDim, fontFamily: FH, letterSpacing: 0.5 }}>BEWEGUNG</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.tealBright }}>
            {fighter.actions.movement ?? 30} ft
          </span>
        </div>

        {/* Free Interaction toggle */}
        <button
          onClick={() => toggle("freeInteraction")}
          style={{
            flex: 1, borderRadius: 8, padding: "8px 10px", cursor: "pointer", transition: "all .2s",
            border: `1px solid ${fighter.actions.freeInteraction ? C.green + "66" : C.border}`,
            background: fighter.actions.freeInteraction ? `${C.green}18` : C.surface,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            opacity: fighter.actions.freeInteraction ? 1 : 0.45,
          }}
        >
          <span style={{ fontSize: 16 }}>🤝</span>
          <span style={{ fontSize: 9, color: C.textDim, fontFamily: FH, letterSpacing: 0.5 }}>FREE</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: fighter.actions.freeInteraction ? C.greenBright : C.textDim }}>
            {fighter.actions.freeInteraction ? "✓" : "✗"}
          </span>
        </button>
      </div>
    </div>
  );
}
