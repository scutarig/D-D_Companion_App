// Combat System Models & Utilities

export const createFighter = ({
  id = Date.now() + Math.random(),
  name = "Unknown",
  isPlayer = false,
  charRef = null,
  monsterRef = null,
  hp = 10,
  maxHp = 10,
  ac = 10,
  initiative = 0,
  initiativeBonus = 0,
  conditions = [],
  speed = 30,
  // Spellcasting
  klass = null,
  level = 1,
  spellSlots = [],       // [{lv, total, used, pact}]
  concentration = null,  // spellId | null
  spellAbility = "INT",
  spellDC = 8,
  spellAtk = 0,
  // Ability Scores & Proficiencies (Phase 6)
  abilityScores = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  saveProficiencies = { STR: false, DEX: false, CON: false, INT: false, WIS: false, CHA: false },
  skillProficiencies = {},   // skillId → true | "expertise"
} = {}) => ({
  id,
  name,
  isPlayer,
  charRef,
  monsterRef,
  klass,
  level,

  // Combat Stats
  initiative,
  initiativeBonus,
  hp,
  maxHp,
  tempHp: 0,
  ac,

  // Status
  conditions,
  deathSaves: { suc: 0, fail: 0 },

  // Spellcasting
  spellSlots,
  concentration,
  spellAbility,
  spellDC,
  spellAtk,

  // Ability Scores & Proficiencies
  abilityScores,
  saveProficiencies,
  skillProficiencies,

  // Action Economy (reset per turn)
  actions: {
    action: true,
    bonusAction: true,
    reaction: true,
    movement: speed,
    freeInteraction: true,
  },
});

export const createCombatState = ({
  isActive = false,
  round = 0,
  activeIndex = -1,
  fighters = [],
  log = [],
  presets = [],
  surprise = { enabled: false, surprised: [] },
} = {}) => ({
  isActive,
  round,
  activeIndex,
  fighters,
  log,
  presets,
  surprise,
});

export const createLogEntry = ({
  id = Date.now() + Math.random(),
  round = 0,
  type = "generic", // "join" | "round" | "turn" | "action" | "dmg" | "heal" | "condition" | "death" | "victory" | "generic"
  text = "",
  timestamp = new Date().toLocaleTimeString("de-DE"),
  sourceId = null,
  targetId = null,
} = {}) => ({
  id,
  round,
  type,
  text,
  timestamp,
  sourceId,
  targetId,
});

// Fighter CRUD operations
export const addFighter = (state, fighter) => ({
  ...state,
  fighters: [...state.fighters, fighter],
});

export const removeFighter = (state, fighterId) => ({
  ...state,
  fighters: state.fighters.filter(f => f.id !== fighterId),
});

export const updateFighter = (state, fighterId, updates) => ({
  ...state,
  fighters: state.fighters.map(f =>
    f.id === fighterId ? { ...f, ...updates } : f
  ),
});

// Initiative sorting
export const sortByInitiative = (fighters) => {
  return [...fighters].sort((a, b) => b.initiative - a.initiative);
};

// Combat state transitions
export const startCombat = (state) => {
  const sorted = sortByInitiative(state.fighters);
  return {
    ...state,
    isActive: true,
    round: 1,
    activeIndex: 0,
    fighters: sorted,
  };
};

export const endTurn = (state) => {
  const nextIndex = (state.activeIndex + 1) % state.fighters.length;
  const nextRound = nextIndex === 0 ? state.round + 1 : state.round;
  return {
    ...state,
    activeIndex: nextIndex,
    round: nextRound,
  };
};

export const endCombat = (state) => ({
  ...state,
  isActive: false,
  activeIndex: -1,
});

// Victory check: all non-player fighters at 0 HP or below
export const checkVictory = (fighters) => {
  const enemies = fighters.filter(f => !f.isPlayer);
  return enemies.length > 0 && enemies.every(f => f.hp <= 0);
};

// Defeat check: all player fighters at 0 HP or below
export const checkDefeat = (fighters) => {
  const players = fighters.filter(f => f.isPlayer);
  return players.length > 0 && players.every(f => f.hp <= 0);
};

// Apply damage to fighter
export const applyDamage = (fighter, amount) => {
  const newHp = Math.max(0, fighter.hp - amount);
  return {
    ...fighter,
    hp: newHp,
  };
};

// Apply healing to fighter
export const applyHealing = (fighter, amount) => {
  const newHp = Math.min(fighter.maxHp, fighter.hp + amount);
  return {
    ...fighter,
    hp: newHp,
  };
};

// Reset action economy for fighter (start of new turn)
export const resetActionEconomy = (fighter) => ({
  ...fighter,
  actions: {
    action: true,
    bonusAction: true,
    reaction: true,
    movement: fighter.actions.movement === 0 ? 30 : 30, // reset movement to default speed
    freeInteraction: true,
  },
});

// Mark action as used
export const useAction = (fighter, actionType) => {
  if (actionType === "movement") {
    return fighter; // movement is tracked differently
  }
  if (!["action", "bonusAction", "reaction", "freeInteraction"].includes(actionType)) {
    return fighter;
  }
  return {
    ...fighter,
    actions: {
      ...fighter.actions,
      [actionType]: false,
    },
  };
};

// Add death save
export const addDeathSave = (fighter, type) => {
  if (type !== "success" && type !== "failure") return fighter;
  const key = type === "success" ? "suc" : "fail";
  return {
    ...fighter,
    deathSaves: {
      ...fighter.deathSaves,
      [key]: Math.min(3, fighter.deathSaves[key] + 1),
    },
  };
};

// Rename fighter (handle duplicates)
export const generateUniqueName = (baseName, existingFighters) => {
  const names = existingFighters.map(f => f.name);
  if (!names.includes(baseName)) return baseName;

  let counter = 1;
  let newName = `${baseName}-${counter}`;
  while (names.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
};

// Preset management
export const savePreset = (state, name) => {
  const preset = {
    id: Date.now(),
    name,
    fighters: state.fighters.map(f => ({
      name: f.name,
      hp: f.maxHp,
      maxHp: f.maxHp,
      ac: f.ac,
      initiativeBonus: f.initiativeBonus,
      speed: f.actions.movement,
      monsterRef: f.monsterRef,
      charRef: f.charRef,
    })),
  };
  return {
    ...state,
    presets: [...state.presets, preset],
  };
};

export const deletePreset = (state, presetId) => ({
  ...state,
  presets: state.presets.filter(p => p.id !== presetId),
});

export const loadPreset = (state, presetId) => {
  const preset = state.presets.find(p => p.id === presetId);
  if (!preset) return state;

  const loadedFighters = preset.fighters.map(pf =>
    createFighter({
      name: pf.name,
      hp: pf.hp,
      maxHp: pf.maxHp,
      ac: pf.ac,
      initiativeBonus: pf.initiativeBonus,
      speed: pf.speed,
      monsterRef: pf.monsterRef,
      charRef: pf.charRef,
    })
  );

  return {
    ...state,
    fighters: loadedFighters,
  };
};
