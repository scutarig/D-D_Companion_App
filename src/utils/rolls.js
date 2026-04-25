// Dice & Combat Roll Functions

// Base dice roll: W20, W12, W8, etc.
export const rollD = (n) => Math.floor(Math.random() * n) + 1;

// Roll W20 (returns 1-20)
export const rollD20 = () => rollD(20);

// Roll initiative: W20 + DEX modifier
export const rollInitiative = (dexModifier = 0) => {
  const roll = rollD20();
  const total = roll + dexModifier;
  return { roll, dexModifier, total };
};

// Roll attack: W20 + modifier vs target AC
export const rollAttack = (
  attackBonus = 0,
  targetAC = 10,
  options = { advantage: false, disadvantage: false }
) => {
  let roll1 = rollD20();
  let roll = roll1;

  if (options.advantage) {
    const roll2 = rollD20();
    roll = Math.max(roll1, roll2);
    return {
      roll1,
      roll2,
      roll,
      attackBonus,
      total: roll + attackBonus,
      targetAC,
      hit: roll + attackBonus >= targetAC,
      advantage: true,
    };
  }

  if (options.disadvantage) {
    const roll2 = rollD20();
    roll = Math.min(roll1, roll2);
    return {
      roll1,
      roll2,
      roll,
      attackBonus,
      total: roll + attackBonus,
      targetAC,
      hit: roll + attackBonus >= targetAC,
      disadvantage: true,
    };
  }

  return {
    roll,
    attackBonus,
    total: roll + attackBonus,
    targetAC,
    hit: roll + attackBonus >= targetAC,
  };
};

// Critical hit check
export const isCritical = (attackRoll) => {
  return attackRoll.roll === 20;
};

// Parse dice notation: "1d8+3", "2d6", "1d20-2", etc.
export const parseDiceNotation = (notation) => {
  const match = notation.match(/^(\d+)d(\d+)([\+\-]\d+)?$/i);
  if (!match) return null;

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  return { count, sides, modifier };
};

// Roll damage: "1d8+3" notation
export const rollDamage = (diceNotation = "1d8") => {
  const parsed = parseDiceNotation(diceNotation);
  if (!parsed) {
    // fallback: try to parse as just a number
    const num = parseInt(diceNotation, 10);
    if (!isNaN(num)) {
      return { rolls: [num], modifier: 0, total: num };
    }
    return null;
  }

  const { count, sides, modifier } = parsed;
  const rolls = Array.from({ length: count }, () => rollD(sides));
  const rollTotal = rolls.reduce((a, b) => a + b, 0);
  const total = rollTotal + modifier;

  return { rolls, modifier, total };
};

// Double damage dice for critical hits
export const doubleDamageDice = (diceNotation = "1d8") => {
  const parsed = parseDiceNotation(diceNotation);
  if (!parsed) return diceNotation;

  const { count, sides, modifier } = parsed;
  return `${count * 2}d${sides}${modifier > 0 ? "+" : ""}${modifier}`;
};

// Roll saving throw: W20 + modifier vs DC
export const rollSave = (
  saveModifier = 0,
  targetDC = 10,
  options = { advantage: false, disadvantage: false }
) => {
  let roll1 = rollD20();
  let roll = roll1;

  if (options.advantage) {
    const roll2 = rollD20();
    roll = Math.max(roll1, roll2);
    return {
      roll1,
      roll2,
      roll,
      saveModifier,
      total: roll + saveModifier,
      targetDC,
      success: roll + saveModifier >= targetDC,
      advantage: true,
    };
  }

  if (options.disadvantage) {
    const roll2 = rollD20();
    roll = Math.min(roll1, roll2);
    return {
      roll1,
      roll2,
      roll,
      saveModifier,
      total: roll + saveModifier,
      targetDC,
      success: roll + saveModifier >= targetDC,
      disadvantage: true,
    };
  }

  return {
    roll,
    saveModifier,
    total: roll + saveModifier,
    targetDC,
    success: roll + saveModifier >= targetDC,
  };
};

// Ability check: W20 + modifier vs DC
export const rollAbilityCheck = (
  checkModifier = 0,
  targetDC = 10,
  options = { advantage: false, disadvantage: false }
) => {
  return rollSave(checkModifier, targetDC, options);
};

// Death saving throw (always DC 10, hardcoded)
export const rollDeathSave = (options = { advantage: false, disadvantage: false }) => {
  return rollSave(0, 10, options);
};

// Format roll result for display
export const formatAttackResult = (attackRoll, isCrit = false) => {
  const { roll, attackBonus, total, targetAC, hit } = attackRoll;

  let text = `${roll} + ${attackBonus} = ${total}`;
  if (attackRoll.roll1 !== undefined) {
    // advantage or disadvantage
    const adv = attackRoll.advantage ? "ADV" : "DIS";
    text = `${attackRoll.roll1}/${attackRoll.roll2} (${adv}) → ${roll} + ${attackBonus} = ${total}`;
  }

  if (isCrit) {
    text += " 🎯 CRITICAL!";
  }

  text += ` vs AC ${targetAC} → ${hit ? "✓ HIT" : "✗ MISS"}`;

  return text;
};

// Format damage result for display
export const formatDamageResult = (damageRoll) => {
  const { rolls, modifier, total } = damageRoll;
  const rollString = rolls.join(" + ");
  const modString = modifier > 0 ? `+ ${modifier}` : modifier < 0 ? `- ${Math.abs(modifier)}` : "";
  return `${rollString} ${modString} = ${total}`;
};

// Resistance/Vulnerability/Immunity (future use)
export const applyResistance = (damage, resistanceType) => {
  // resistanceType: "half", "double", "immune", "none"
  switch (resistanceType) {
    case "half":
      return Math.floor(damage / 2);
    case "double":
      return damage * 2;
    case "immune":
      return 0;
    default:
      return damage;
  }
};
