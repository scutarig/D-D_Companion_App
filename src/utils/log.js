// Combat Logging System

import { createLogEntry } from "./combat.js";

// Add log entry to combat log
export const addLog = (state, type, text, sourceId = null, targetId = null) => {
  const entry = createLogEntry({
    round: state.round,
    type,
    text,
    timestamp: new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    sourceId,
    targetId,
  });
  return {
    ...state,
    log: [entry, ...state.log], // newest first
  };
};

// Log templates
export const logJoin = (state, fighterName, hp, ac) => {
  return addLog(state, "join", `${fighterName} joins combat (HP ${hp}/${hp}, AC ${ac})`);
};

export const logRoundStart = (state, round) => {
  return addLog(state, "round", `--- Round ${round} starts ---`);
};

export const logTurnStart = (state, fighterName, initiative, sourceId) => {
  return addLog(state, "turn", `Turn: ${fighterName} (Initiative ${initiative})`, sourceId);
};

export const logTurnEnd = (state, fighterName, sourceId) => {
  return addLog(state, "turn", `${fighterName} ends turn`, sourceId);
};

export const logAttack = (
  state,
  attackerName,
  targetName,
  rollTotal,
  targetAC,
  hit,
  sourceId = null,
  targetId = null
) => {
  const result = hit ? "✓ HIT" : "✗ MISS";
  return addLog(
    state,
    "action",
    `${attackerName} attacks ${targetName}: ${rollTotal} vs AC ${targetAC} → ${result}`,
    sourceId,
    targetId
  );
};

export const logCritical = (state, attackerName, targetName, sourceId = null, targetId = null) => {
  return addLog(state, "action", `${attackerName} CRITICAL HIT vs ${targetName}! 🎯`, sourceId, targetId);
};

export const logDamage = (
  state,
  attackerName,
  targetName,
  damageAmount,
  oldHp,
  newHp,
  sourceId = null,
  targetId = null
) => {
  return addLog(
    state,
    "dmg",
    `${attackerName} → ${targetName}: ${damageAmount} damage (${oldHp} → ${newHp} HP)`,
    sourceId,
    targetId
  );
};

export const logHealing = (
  state,
  healeeName,
  healAmount,
  oldHp,
  newHp,
  sourceId = null,
  targetId = null
) => {
  return addLog(
    state,
    "heal",
    `${healeeName} healed: +${healAmount} HP (${oldHp} → ${newHp})`,
    sourceId,
    targetId
  );
};

export const logCondition = (state, fighterName, condition, added = true, sourceId = null) => {
  const text = added ? `${fighterName} is now ${condition}` : `${fighterName} is no longer ${condition}`;
  return addLog(state, "condition", text, sourceId);
};

export const logDeath = (state, fighterName, sourceId = null) => {
  return addLog(state, "death", `${fighterName} falls unconscious (0 HP)`, sourceId);
};

export const logDeathSave = (state, fighterName, success, sourceId = null) => {
  const text = success ? `${fighterName} succeeds death save` : `${fighterName} fails death save`;
  return addLog(state, "death", text, sourceId);
};

export const logVictory = (state) => {
  return addLog(state, "victory", "🎉 Combat ended - Victory!");
};

export const logDefeat = (state) => {
  return addLog(state, "victory", "☠️ Combat ended - Defeat!");
};

export const logManualEntry = (state, text) => {
  return addLog(state, "generic", text);
};

// Format log for display
export const formatLogEntry = (entry) => {
  return {
    ...entry,
    displayText: entry.text,
    icon: getLogIcon(entry.type),
    color: getLogColor(entry.type),
  };
};

// Get icon for log entry type
const getLogIcon = (type) => {
  const icons = {
    join: "➕",
    round: "🔄",
    turn: "👣",
    action: "⚔️",
    dmg: "💥",
    heal: "💚",
    condition: "⚡",
    death: "☠️",
    victory: "🎉",
    generic: "📝",
  };
  return icons[type] || "📝";
};

// Get color for log entry type (for UI)
const getLogColor = (type) => {
  const colors = {
    join: "#888",
    round: "#666",
    turn: "#999",
    action: "#4a9eff",
    dmg: "#ff6b6b",
    heal: "#51cf66",
    condition: "#ffd43b",
    death: "#a61e4d",
    victory: "#51cf66",
    generic: "#999",
  };
  return colors[type] || "#999";
};

// Search/filter log entries
export const searchLog = (log, query) => {
  if (!query || query.trim() === "") return log;
  const q = query.toLowerCase();
  return log.filter(
    (entry) =>
      entry.text.toLowerCase().includes(q) ||
      (entry.type && entry.type.toLowerCase().includes(q))
  );
};

// Filter log by type
export const filterLogByType = (log, types) => {
  if (!types || types.length === 0) return log;
  return log.filter((entry) => types.includes(entry.type));
};

// Get last N log entries
export const getRecentLog = (log, count = 10) => {
  return log.slice(0, count);
};

// Clear old log entries (keep only last N)
export const pruneLog = (state, maxEntries = 500) => {
  if (state.log.length <= maxEntries) return state;
  return {
    ...state,
    log: state.log.slice(0, maxEntries),
  };
};

// Export log as text
export const exportLogAsText = (log, fighters) => {
  let text = "=== D&D Combat Log ===\n\n";

  log.forEach((entry) => {
    const icon = getLogIcon(entry.type);
    text += `[${entry.timestamp}] R${entry.round} ${icon} ${entry.text}\n`;
  });

  return text;
};

// Export log as JSON
export const exportLogAsJSON = (state) => {
  return JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      totalRounds: state.round,
      fighters: state.fighters.map((f) => ({
        name: f.name,
        finalHp: f.hp,
        maxHp: f.maxHp,
      })),
      log: state.log,
    },
    null,
    2
  );
};
