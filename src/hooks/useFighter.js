import { useCombat } from "../context/CombatContext.jsx";
import {
  createFighter,
  addFighter as addFighterUtil,
  removeFighter as removeFighterUtil,
  updateFighter as updateFighterUtil,
  generateUniqueName,
} from "../utils/combat.js";

export function useFighter() {
  const { state, setState } = useCombat();

  const addFighter = (fighterData) => {
    // Generate unique name if duplicate
    const uniqueName = generateUniqueName(fighterData.name || "Unknown", state.fighters);
    const fighter = createFighter({
      ...fighterData,
      name: uniqueName,
    });
    setState((prev) => addFighterUtil(prev, fighter));
    return fighter;
  };

  const removeFighter = (fighterId) => {
    setState((prev) => removeFighterUtil(prev, fighterId));
  };

  const updateFighter = (fighterId, updates) => {
    setState((prev) => updateFighterUtil(prev, fighterId, updates));
  };

  const getFighter = (fighterId) => {
    return state.fighters.find((f) => f.id === fighterId);
  };

  const getFighterByIndex = (index) => {
    return state.fighters[index];
  };

  return {
    fighters: state.fighters,
    addFighter,
    removeFighter,
    updateFighter,
    getFighter,
    getFighterByIndex,
  };
}
