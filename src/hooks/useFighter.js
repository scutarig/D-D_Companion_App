import { useCombat } from "../context/CombatContext.jsx";
import {
  createFighter,
  addFighter as addFighterUtil,
  removeFighter as removeFighterUtil,
  updateFighter as updateFighterUtil,
  generateUniqueName,
} from "../utils/combat.js";
import { initSpellSlots } from "../utils/spells.js";

export function useFighter() {
  const { state, setState } = useCombat();

  const addFighter = (fighterData) => {
    const uniqueName = generateUniqueName(fighterData.name || "Unknown", state.fighters);

    // Auto-init spell slots if klass + level provided and no slots given
    let spellSlots = fighterData.spellSlots ?? [];
    if (spellSlots.length === 0 && fighterData.klass && fighterData.level) {
      spellSlots = initSpellSlots(fighterData.klass, fighterData.level);
    }

    const fighter = createFighter({
      ...fighterData,
      name: uniqueName,
      spellSlots,
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

  const getFighter = (fighterId) => state.fighters.find((f) => f.id === fighterId);
  const getFighterByIndex = (index) => state.fighters[index];

  return { fighters: state.fighters, addFighter, removeFighter, updateFighter, getFighter, getFighterByIndex };
}
