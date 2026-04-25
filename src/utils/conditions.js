// D&D 5e Conditions — all 13 standard conditions + common extras

export const CONDITIONS = [
  {
    id: "blinded",
    name: "Blinded",
    icon: "👁️",
    color: "#888888",
    desc: "Can't see. Attack rolls have disadvantage. Attacks vs. have advantage.",
    effects: {
      attackerDisadvantage: true,   // this fighter has disadvantage on attacks
      targetAdvantage: true,        // attacks AGAINST this fighter have advantage
      autoFailSaves: [],
    },
  },
  {
    id: "charmed",
    name: "Charmed",
    icon: "💕",
    color: "#ff69b4",
    desc: "Can't attack the charmer. Charmer has advantage on social interactions.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "deafened",
    name: "Deafened",
    icon: "🔇",
    color: "#aaa",
    desc: "Can't hear. Automatically fails hearing-based Perception checks.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "exhaustion",
    name: "Exhaustion",
    icon: "😩",
    color: "#c0a060",
    desc: "Levels 1-6: disadvantage on checks, speed halved, -4 to rolls, max HP halved, speed 0, death.",
    effects: {
      attackerDisadvantage: true,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "frightened",
    name: "Frightened",
    icon: "😨",
    color: "#9400d3",
    desc: "Disadvantage on ability checks & attack rolls while source is in sight.",
    effects: {
      attackerDisadvantage: true,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "grappled",
    name: "Grappled",
    icon: "🤼",
    color: "#8b4513",
    desc: "Speed becomes 0. Ends if grappler is incapacitated.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
      speedZero: true,
    },
  },
  {
    id: "incapacitated",
    name: "Incapacitated",
    icon: "💤",
    color: "#708090",
    desc: "Can't take actions or reactions.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
      noActions: true,
    },
  },
  {
    id: "invisible",
    name: "Invisible",
    icon: "👻",
    color: "#00ced1",
    desc: "Can't be seen without magic. Attack rolls have advantage. Attacks vs. have disadvantage.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      attackerAdvantage: true,       // this fighter has advantage on attacks
      targetDisadvantage: true,      // attacks against this fighter have disadvantage
      autoFailSaves: [],
    },
  },
  {
    id: "paralyzed",
    name: "Paralyzed",
    icon: "⚡",
    color: "#ffd700",
    desc: "Incapacitated. Auto-fail STR/DEX saves. Attacks vs. have advantage. Melee hits are crits.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: true,
      noActions: true,
      autoFailSaves: ["STR", "DEX"],
    },
  },
  {
    id: "petrified",
    name: "Petrified",
    icon: "🪨",
    color: "#a9a9a9",
    desc: "Transformed to stone. Incapacitated. Auto-fail STR/DEX saves. Resistance to all damage.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: true,
      noActions: true,
      autoFailSaves: ["STR", "DEX"],
    },
  },
  {
    id: "poisoned",
    name: "Poisoned",
    icon: "🤢",
    color: "#32cd32",
    desc: "Disadvantage on attack rolls and ability checks.",
    effects: {
      attackerDisadvantage: true,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "prone",
    name: "Prone",
    icon: "⬇️",
    color: "#cd853f",
    desc: "Disadvantage on attack rolls. Melee attacks vs. have advantage; ranged attacks have disadvantage.",
    effects: {
      attackerDisadvantage: true,
      targetAdvantage: true,         // melee
      autoFailSaves: [],
    },
  },
  {
    id: "restrained",
    name: "Restrained",
    icon: "⛓️",
    color: "#8b0000",
    desc: "Speed 0. Disadvantage on attack rolls. Attacks vs. have advantage. Disadvantage on DEX saves.",
    effects: {
      attackerDisadvantage: true,
      targetAdvantage: true,
      autoFailSaves: [],
      speedZero: true,
    },
  },
  {
    id: "stunned",
    name: "Stunned",
    icon: "💫",
    color: "#ffa500",
    desc: "Incapacitated. Auto-fail STR/DEX saves. Attacks vs. have advantage.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: true,
      noActions: true,
      autoFailSaves: ["STR", "DEX"],
    },
  },
  {
    id: "unconscious",
    name: "Unconscious",
    icon: "💀",
    color: "#dc143c",
    desc: "Incapacitated. Auto-fail STR/DEX saves. Attacks vs. have advantage (crits in melee).",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: true,
      noActions: true,
      autoFailSaves: ["STR", "DEX"],
    },
  },
  // Extra common conditions
  {
    id: "concentration",
    name: "Concentrating",
    icon: "🧠",
    color: "#7b68ee",
    desc: "Concentrating on a spell. Takes concentration check (CON DC 10 or half damage) when hit.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
  {
    id: "hidden",
    name: "Hidden",
    icon: "🫥",
    color: "#2f4f4f",
    desc: "Hidden from enemies. Attack rolls have advantage. Attackers can't target without guessing.",
    effects: {
      attackerAdvantage: true,
      targetDisadvantage: true,
      autoFailSaves: [],
    },
  },
  {
    id: "raging",
    name: "Raging",
    icon: "🔥",
    color: "#ff4500",
    desc: "Barbarian Rage. Advantage on STR checks/saves. Resistance to physical damage. Bonus damage.",
    effects: {
      attackerDisadvantage: false,
      targetAdvantage: false,
      autoFailSaves: [],
    },
  },
];

// Lookup by id
export const getCondition = (id) => CONDITIONS.find((c) => c.id === id) ?? null;

// Get all conditions that give the fighter disadvantage on attacks
export const getAttackerDisadvantageConditions = (conditionIds = []) =>
  conditionIds
    .map(getCondition)
    .filter(Boolean)
    .filter((c) => c.effects.attackerDisadvantage);

// Get all conditions that give attackers advantage against this fighter
export const getTargetAdvantageConditions = (conditionIds = []) =>
  conditionIds
    .map(getCondition)
    .filter(Boolean)
    .filter((c) => c.effects.targetAdvantage);

// Get all conditions that give this fighter advantage on attacks
export const getAttackerAdvantageConditions = (conditionIds = []) =>
  conditionIds
    .map(getCondition)
    .filter(Boolean)
    .filter((c) => c.effects.attackerAdvantage);

/**
 * Suggest advantage/disadvantage for an attack roll.
 * Returns { advantage: bool, disadvantage: bool, reasons: string[] }
 */
export const suggestAttackModifiers = (attacker, target) => {
  const attackerConds = attacker?.conditions ?? [];
  const targetConds = target?.conditions ?? [];

  const advReasons = [];
  const disReasons = [];

  // Attacker has advantage on attacks (invisible, hidden, raging, etc.)
  for (const cId of attackerConds) {
    const c = getCondition(cId);
    if (c?.effects.attackerAdvantage) advReasons.push(`${c.icon} ${c.name}`);
  }

  // Target gives advantage to attackers (blinded, paralyzed, prone, restrained, etc.)
  for (const cId of targetConds) {
    const c = getCondition(cId);
    if (c?.effects.targetAdvantage) advReasons.push(`Target ${c.icon} ${c.name}`);
  }

  // Attacker has disadvantage (blinded, frightened, poisoned, prone, restrained)
  for (const cId of attackerConds) {
    const c = getCondition(cId);
    if (c?.effects.attackerDisadvantage) disReasons.push(`${c.icon} ${c.name}`);
  }

  // Target gives disadvantage to attackers (invisible, hidden)
  for (const cId of targetConds) {
    const c = getCondition(cId);
    if (c?.effects.targetDisadvantage) disReasons.push(`Target ${c.icon} ${c.name}`);
  }

  // D&D 5e rule: adv + disadv = straight roll
  const hasAdv = advReasons.length > 0;
  const hasDis = disReasons.length > 0;
  const cancel = hasAdv && hasDis;

  return {
    advantage: hasAdv && !cancel,
    disadvantage: hasDis && !cancel,
    cancelled: cancel,
    advReasons,
    disReasons,
  };
};

// Create a condition instance for a fighter
export const createConditionInstance = (id, duration = null, sourceId = null) => ({
  id,
  duration, // null = permanent, number = rounds remaining
  sourceId,
});

// Decrement condition durations for a fighter (call on turn start/end)
export const decrementConditions = (fighter) => {
  const updated = fighter.conditions
    .map((cid) => {
      // If conditions are just IDs (legacy), keep as-is
      if (typeof cid === "string") return cid;
      // If it's an object with duration
      if (cid.duration === null) return cid; // permanent
      return { ...cid, duration: cid.duration - 1 };
    })
    .filter((cid) => {
      if (typeof cid === "string") return true;
      return cid.duration === null || cid.duration > 0;
    });
  return { ...fighter, conditions: updated };
};

// Get condition id from either string or object
export const getConditionId = (c) => (typeof c === "string" ? c : c?.id);

// Get all condition IDs for a fighter
export const getFighterConditionIds = (fighter) =>
  (fighter?.conditions ?? []).map(getConditionId);
