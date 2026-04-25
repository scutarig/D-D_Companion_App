import { createContext, useContext } from "react";
import { usePersist } from "../hooks/usePersist.js";
import { createCombatState } from "../utils/combat.js";

export const CombatContext = createContext(null);

export function CombatProvider({ children }) {
  const [state, setState, isReady] = usePersist("combat_v5", createCombatState());

  // Expose state and setState for consumption
  const value = {
    state,
    setState,
    isReady,
  };

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>;
}

export function useCombat() {
  const ctx = useContext(CombatContext);
  if (!ctx) {
    throw new Error("useCombat must be used within CombatProvider");
  }
  return ctx;
}
