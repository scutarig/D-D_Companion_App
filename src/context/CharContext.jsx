import { createContext, useContext, useMemo, useCallback } from "react";
import { usePersist } from "../hooks/usePersist.js";
import { newChar } from "../utils/helpers.js";

const CharContext = createContext(null);

export function useChar() {
  return useContext(CharContext);
}

export function CharProvider({ children }) {
  const [chars, setChars] = usePersist("chars_v4", [newChar(1)]);
  const [aid, setAid] = usePersist("chars_active_v4", 1);

  const safeChars = chars.length > 0 ? chars : [newChar(1)];
  const active = safeChars.find(c => c.id === aid) || safeChars[0];
  const safeAid = active?.id || 1;

  const setActive = useCallback((upd) => {
    setChars(prev => {
      const list = prev.length > 0 ? prev : [newChar(1)];
      return list.map(c =>
        c.id === safeAid ? (typeof upd === "function" ? upd(c) : upd) : c
      );
    });
  }, [setChars, safeAid]);

  const value = useMemo(
    () => ({ chars: safeChars, setChars, aid: safeAid, setAid, active, setActive }),
    [safeChars, setChars, safeAid, setAid, active, setActive]
  );

  return (
    <CharContext.Provider value={value}>
      {children}
    </CharContext.Provider>
  );
}
