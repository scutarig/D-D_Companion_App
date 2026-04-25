import { usePersist } from "./usePersist.js";

/**
 * useCombatArchive — save & retrieve finished combat snapshots
 *
 * Archive entry shape:
 *   { id, name, timestamp, outcome, rounds, fighters: [...summary], log: [...entries] }
 */
export function useCombatArchive() {
  const [archives, setArchives] = usePersist("combat_archives_v1", []);

  /**
   * Save a completed combat to the archive
   * @param {object} state   — full CombatContext state
   * @param {string} outcome — "victory" | "defeat" | "ended"
   */
  const saveToArchive = (state, outcome = "ended") => {
    const players = state.fighters.filter((f) => f.isPlayer);
    const enemies  = state.fighters.filter((f) => !f.isPlayer);

    const autoName = (() => {
      const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
      const playerNames = players.map((f) => f.name).join(", ") || "Unbekannt";
      return `${date} · ${playerNames} — Runde ${state.round}`;
    })();

    const entry = {
      id: Date.now(),
      name: autoName,
      timestamp: new Date().toISOString(),
      outcome,
      rounds: state.round,
      fighters: state.fighters.map((f) => ({
        id: f.id,
        name: f.name,
        isPlayer: f.isPlayer,
        finalHp: f.hp,
        maxHp: f.maxHp,
        survived: f.hp > 0,
      })),
      playerCount: players.length,
      enemyCount: enemies.length,
      playersAlive: players.filter((f) => f.hp > 0).length,
      enemiesDefeated: enemies.filter((f) => f.hp <= 0).length,
      log: [...state.log],
    };

    setArchives((prev) => [entry, ...prev].slice(0, 50)); // keep last 50
    return entry;
  };

  const deleteArchive = (id) => {
    setArchives((prev) => prev.filter((a) => a.id !== id));
  };

  const clearArchives = () => setArchives([]);

  return { archives, saveToArchive, deleteArchive, clearArchives };
}
