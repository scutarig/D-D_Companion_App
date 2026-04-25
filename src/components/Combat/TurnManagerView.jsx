import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import TurnManagerDesktop from "./TurnManagerDesktop.jsx";
import TurnManagerMobile from "./TurnManagerMobile.jsx";

function VictoryOverlay({ onEndCombat }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 500,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#1e1b22",
        border: `2px solid ${C.gold}`,
        borderRadius: 20,
        padding: "36px 32px",
        textAlign: "center",
        maxWidth: 320,
        boxShadow: `0 0 60px ${C.gold}40`,
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <div style={{ fontFamily: FH, fontSize: 22, color: C.gold, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
          VICTORY!
        </div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>
          All enemies have been defeated.
        </div>
        <button
          onClick={onEndCombat}
          style={{ ...sx.btn(C.gold), padding: "12px 28px", fontSize: 13, color: C.bg, fontWeight: 700 }}
        >
          ✓ End Combat
        </button>
      </div>
    </div>
  );
}

function DefeatOverlay({ onEndCombat }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 500,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#1e1b22",
        border: `2px solid ${C.red}`,
        borderRadius: 20,
        padding: "36px 32px",
        textAlign: "center",
        maxWidth: 320,
        boxShadow: `0 0 60px ${C.red}40`,
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>☠️</div>
        <div style={{ fontFamily: FH, fontSize: 22, color: C.redBright, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
          DEFEAT
        </div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>
          All player characters have fallen.
        </div>
        <button
          onClick={onEndCombat}
          style={{ ...sx.btn(C.red), padding: "12px 28px", fontSize: 13, fontWeight: 700 }}
        >
          End Combat
        </button>
      </div>
    </div>
  );
}

export default function TurnManagerView() {
  const { state } = useCombat();
  const { checkVictoryCondition, checkDefeatCondition, endCombat } = useCombatActions();
  const isMobile = useIsMobile(768);

  if (!state.isActive) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.textDim }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚔️</div>
          <div style={{ fontSize: 14 }}>Kampf nicht aktiv</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Gehe zum Kampf-Tab um einen Kampf zu starten</div>
        </div>
      </div>
    );
  }

  const isVictory = checkVictoryCondition();
  const isDefeat = checkDefeatCondition();

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {isVictory && <VictoryOverlay onEndCombat={endCombat} />}
      {!isVictory && isDefeat && <DefeatOverlay onEndCombat={endCombat} />}
      {isMobile ? <TurnManagerMobile /> : <TurnManagerDesktop />}
    </div>
  );
}
