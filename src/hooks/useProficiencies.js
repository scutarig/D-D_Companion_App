import { usePersist } from "./usePersist.js";
import { createProficiency } from "../utils/proficiency.js";

/**
 * useProficiencies(charId)
 * Per-character CRUD for proficiencies, persisted to localStorage.
 */
export function useProficiencies(charId) {
  const [proficiencies, setProficiencies] = usePersist(
    `proficiencies_v1_${charId}`,
    []
  );

  const add = (data) => {
    const prof = createProficiency(data);
    setProficiencies(p => [...p, prof]);
    return prof;
  };

  const update = (id, data) => {
    setProficiencies(p => p.map(prof => prof.id === id ? { ...prof, ...data } : prof));
  };

  const remove = (id) => {
    setProficiencies(p => p.filter(prof => prof.id !== id));
  };

  return { proficiencies, add, update, remove };
}
