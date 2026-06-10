import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { usePersist } from "../hooks/usePersist.js";
import { createCombatState } from "../utils/combat.js";

export const CombatContext = createContext(null);

const HISTORY_LIMIT = 5;

export function CombatProvider({ children }) {
  const [state, _persist, isReady] = usePersist("combat_v5", createCombatState());

  // Undo/redo history (in-memory only, not persisted)
  const [past, setPast] = useState([]);    // [..., prev2, prev1] — last item = most recent
  const [future, setFuture] = useState([]); // [next1, next2, ...] — first item = next redo

  /**
   * setState — wraps _persist and records undo history.
   * Accepts a value or a function updater, same API as normal setState.
   */
  const setState = useCallback(
    (updaterOrValue) => {
      // snapshot current state before applying update
      setPast((prev) => [...prev, state].slice(-HISTORY_LIMIT));
      setFuture([]); // new action clears redo branch
      _persist(updaterOrValue);
    },
    [state, _persist]
  );

  /** Undo last action — restores previous state */
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture((f) => [state, ...f].slice(0, HISTORY_LIMIT));
    setPast((p) => p.slice(0, -1));
    _persist(previous);
  }, [past, state, _persist]);

  /** Redo next action — re-applies undone state */
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, state].slice(-HISTORY_LIMIT));
    setFuture((f) => f.slice(1));
    _persist(next);
  }, [future, state, _persist]);

  // Memoize value to prevent unnecessary re-renders in all consumers
  const value = useMemo(() => ({
    state,
    setState,
    isReady,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }), [state, setState, isReady, undo, redo, past.length, future.length]);

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>;
}

export function useCombat() {
  const ctx = useContext(CombatContext);
  if (!ctx) throw new Error("useCombat must be used within CombatProvider");
  return ctx;
}
