import { createContext, useContext } from "react";
import { usePersist } from "../hooks/usePersist.js";
import { newChar } from "../utils/helpers.js";

const CharContext = createContext(null);

export function useChar() {
  return useContext(CharContext);
}

export function CharProvider({ children }) {
  const [chars, setChars] = usePersist("chars_v4", [newChar(1)]);
  const [aid, setAid] = usePersist("chars_active_v4", 1);

  // Defensive: if localStorage cleared, ensure we always have ≥1 char
  // (prevents undefined `aid` → kollidierende tokens_used_undefined storage-keys)
  const safeChars = chars.length > 0 ? chars : [newChar(1)];
  const active = safeChars.find(c => c.id === aid) || safeChars[0];
  const setActive = upd =>
    setChars(prev => {
      const list = prev.length > 0 ? prev : [newChar(1)];
      return list.map(c =>
        c.id === aid ? (typeof upd === "function" ? upd(c) : upd) : c
      );
    });

  return (
    <CharContext.Provider value={{ chars: safeChars, setChars, aid: active?.id || 1, setAid, active, setActive }}>
      {children}
    </CharContext.Provider>
  );
}
