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

  const active = chars.find(c => c.id === aid) || chars[0];
  const setActive = upd =>
    setChars(prev =>
      prev.map(c =>
        c.id === aid ? (typeof upd === "function" ? upd(c) : upd) : c
      )
    );

  return (
    <CharContext.Provider value={{ chars, setChars, aid, setAid, active, setActive }}>
      {children}
    </CharContext.Provider>
  );
}
