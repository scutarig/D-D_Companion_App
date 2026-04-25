import { useCombat } from "../../context/CombatContext.jsx";
import CombatInitiativeView from "./CombatInitiativeView.jsx";
import TurnManagerView from "./TurnManagerView.jsx";

export default function CombatSystem() {
  const { state } = useCombat();

  if (state.isActive) {
    return <TurnManagerView />;
  } else {
    return <CombatInitiativeView />;
  }
}
