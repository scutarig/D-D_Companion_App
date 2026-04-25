import { useCombat } from "../context/CombatContext.jsx";
import {
  startCombat as startCombatUtil,
  endTurn as endTurnUtil,
  endCombat as endCombatUtil,
  sortByInitiative,
  checkVictory,
  checkDefeat,
  applyDamage,
  applyHealing,
  resetActionEconomy,
  useAction as useActionUtil,
  addDeathSave,
  savePreset as savePresetUtil,
  loadPreset as loadPresetUtil,
  deletePreset as deletePresetUtil,
} from "../utils/combat.js";
import { addLog } from "../utils/log.js";

export function useCombatActions() {
  const { state, setState } = useCombat();

  // Start combat: sort fighters, set activeIndex to 0, round to 1
  const startCombat = () => {
    setState((prev) => {
      const sorted = sortByInitiative(prev.fighters);
      const updated = {
        ...prev,
        isActive: true,
        round: 1,
        activeIndex: 0,
        fighters: sorted,
      };
      // Log round start
      return addLog(updated, "round", "--- Round 1 starts ---");
    });
  };

  // End turn: increment activeIndex, handle round increment
  const endTurn = () => {
    setState((prev) => {
      if (!prev.isActive) return prev;

      const nextIndex = (prev.activeIndex + 1) % prev.fighters.length;
      const newRound = nextIndex === 0 ? prev.round + 1 : prev.round;
      let updated = {
        ...prev,
        activeIndex: nextIndex,
        round: newRound,
      };

      // Log turn start
      if (nextIndex < prev.fighters.length) {
        const nextFighter = prev.fighters[nextIndex];
        updated = addLog(
          updated,
          "turn",
          `Turn: ${nextFighter.name}`,
          nextFighter.id
        );
      }

      // Log round start if new round
      if (nextIndex === 0 && newRound > 1) {
        updated = addLog(updated, "round", `--- Round ${newRound} starts ---`);
      }

      return updated;
    });
  };

  // End combat
  const endCombat = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      activeIndex: -1,
    }));
  };

  // Apply damage to fighter by ID
  const damageTarget = (fighterId, amount) => {
    setState((prev) => {
      const fighter = prev.fighters.find((f) => f.id === fighterId);
      if (!fighter) return prev;

      const oldHp = fighter.hp;
      const newFighter = applyDamage(fighter, amount);
      const updated = {
        ...prev,
        fighters: prev.fighters.map((f) =>
          f.id === fighterId ? newFighter : f
        ),
      };

      // Log damage
      let result = addLog(
        updated,
        "dmg",
        `${fighter.name} takes ${amount} damage (${oldHp} → ${newFighter.hp} HP)`,
        null,
        fighterId
      );

      // Check for unconscious
      if (oldHp > 0 && newFighter.hp <= 0) {
        result = addLog(
          result,
          "death",
          `${fighter.name} falls unconscious (0 HP)`,
          null,
          fighterId
        );
      }

      return result;
    });
  };

  // Heal fighter by ID
  const healTarget = (fighterId, amount) => {
    setState((prev) => {
      const fighter = prev.fighters.find((f) => f.id === fighterId);
      if (!fighter) return prev;

      const oldHp = fighter.hp;
      const newFighter = applyHealing(fighter, amount);
      const updated = {
        ...prev,
        fighters: prev.fighters.map((f) =>
          f.id === fighterId ? newFighter : f
        ),
      };

      // Log healing
      return addLog(
        updated,
        "heal",
        `${fighter.name} healed: +${amount} HP (${oldHp} → ${newFighter.hp})`,
        null,
        fighterId
      );
    });
  };

  // Use action (mark as used for turn)
  const useAction = (fighterId, actionType) => {
    setState((prev) => {
      const fighter = prev.fighters.find((f) => f.id === fighterId);
      if (!fighter) return prev;

      const updated = useActionUtil(fighter, actionType);
      return {
        ...prev,
        fighters: prev.fighters.map((f) =>
          f.id === fighterId ? updated : f
        ),
      };
    });
  };

  // Add death save success/failure
  const addDeathSaveResult = (fighterId, type) => {
    setState((prev) => {
      const fighter = prev.fighters.find((f) => f.id === fighterId);
      if (!fighter || fighter.hp > 0) return prev; // only if unconscious

      const updated = addDeathSave(fighter, type);
      const newState = {
        ...prev,
        fighters: prev.fighters.map((f) =>
          f.id === fighterId ? updated : f
        ),
      };

      // Log death save
      const text = type === "success"
        ? `${fighter.name} succeeds death save (${updated.deathSaves.suc}/3)`
        : `${fighter.name} fails death save (${updated.deathSaves.fail}/3)`;
      return addLog(newState, "death", text, null, fighterId);
    });
  };

  // Check victory condition
  const checkVictoryCondition = () => {
    return checkVictory(state.fighters);
  };

  // Check defeat condition
  const checkDefeatCondition = () => {
    return checkDefeat(state.fighters);
  };

  // Save preset
  const savePreset = (name) => {
    setState((prev) => savePresetUtil(prev, name));
  };

  // Load preset
  const loadPreset = (presetId) => {
    setState((prev) => {
      const updated = loadPresetUtil(prev, presetId);
      // Reset combat state
      return {
        ...updated,
        isActive: false,
        round: 0,
        activeIndex: -1,
        log: [],
      };
    });
  };

  // Delete preset
  const deletePreset = (presetId) => {
    setState((prev) => deletePresetUtil(prev, presetId));
  };

  // Reset combat (clear everything)
  const resetCombat = () => {
    setState({
      isActive: false,
      round: 0,
      activeIndex: -1,
      fighters: [],
      log: [],
      presets: state.presets, // keep presets
      surprise: { enabled: false, surprised: [] },
    });
  };

  return {
    // State
    isActive: state.isActive,
    round: state.round,
    activeIndex: state.activeIndex,
    fighters: state.fighters,
    log: state.log,
    presets: state.presets,

    // Actions
    startCombat,
    endTurn,
    endCombat,
    damageTarget,
    healTarget,
    useAction,
    addDeathSaveResult,
    checkVictoryCondition,
    checkDefeatCondition,
    savePreset,
    loadPreset,
    deletePreset,
    resetCombat,
  };
}
