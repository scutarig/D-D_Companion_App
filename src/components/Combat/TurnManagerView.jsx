import { C } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import TurnManagerDesktop from "./TurnManagerDesktop.jsx";
import TurnManagerMobile from "./TurnManagerMobile.jsx";

export default function TurnManagerView() {
  const { state } = useCombat();
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

  return isMobile ? <TurnManagerMobile /> : <TurnManagerDesktop />;
}
