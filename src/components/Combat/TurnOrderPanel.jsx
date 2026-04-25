import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";

export default function TurnOrderPanel() {
  const { state } = useCombat();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ ...sx.ct, marginBottom: 4 }}>🎯 Turn Order</div>

      {state.fighters.length === 0 ? (
        <div style={{ fontSize: 12, color: C.textDim }}>Keine Kämpfer</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {state.fighters.map((fighter, idx) => {
            const isActive = idx === state.activeIndex;
            return (
              <div
                key={fighter.id}
                style={{
                  background: isActive ? `${C.purple}22` : C.surface,
                  border: `1px solid ${isActive ? C.purple : C.border}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow: isActive ? `0 0 8px ${C.purple}40` : "none",
                }}
              >
                <span style={{ fontFamily: FH, fontSize: 11, color: isActive ? C.purpleBright : C.textDim, fontWeight: 700, minWidth: 20 }}>
                  {idx + 1}.
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: isActive ? C.purpleBright : C.textBright, fontWeight: isActive ? 700 : 400 }}>
                    {fighter.name}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim }}>Init {fighter.initiative}</div>
                </div>

                {isActive && (
                  <span style={{ fontSize: 12, color: C.purple, fontWeight: 700 }}>▶</span>
                )}

                {!isActive && (
                  <span style={{ fontSize: 10, color: C.textDim }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
