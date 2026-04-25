import { useCallback } from "react";
import { usePersist } from "./usePersist.js";

/**
 * useCompanions — CRUD for a character's companion list
 * Persisted per character via companions_v1_${charId}
 *
 * Returns: { companions, add, update, remove, updateHp }
 */
export function useCompanions(charId) {
  const key = charId ? `companions_v1_${charId}` : "companions_v1_guest";
  const [companions, setCompanions] = usePersist(key, []);

  const add = useCallback((data) => {
    const companion = {
      id: Date.now() + Math.random(),
      name: data.name ?? "Begleiter",
      type: data.type ?? "beast",
      hp: data.hp ?? data.maxHp ?? 10,
      maxHp: data.maxHp ?? data.hp ?? 10,
      ac: data.ac ?? 12,
      speed: data.speed ?? 30,
      stats: data.stats ?? { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      skills: data.skills ?? {},
      traits: data.traits ?? "",
      actions: data.actions ?? "",
      notes: data.notes ?? "",
      monsterRef: data.monsterRef ?? null,
      cr: data.cr ?? null,
      size: data.size ?? null,
      senses: data.senses ?? "",
      languages: data.languages ?? "",
      createdAt: Date.now(),
    };
    setCompanions((prev) => [...prev, companion]);
    return companion;
  }, [setCompanions]);

  const update = useCallback((id, changes) => {
    setCompanions((prev) =>
      prev.map((c) => c.id === id ? { ...c, ...changes } : c)
    );
  }, [setCompanions]);

  const remove = useCallback((id) => {
    setCompanions((prev) => prev.filter((c) => c.id !== id));
  }, [setCompanions]);

  const updateHp = useCallback((id, delta) => {
    setCompanions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newHp = Math.max(0, Math.min(c.maxHp, c.hp + delta));
        return { ...c, hp: newHp };
      })
    );
  }, [setCompanions]);

  return { companions, add, update, remove, updateHp };
}
