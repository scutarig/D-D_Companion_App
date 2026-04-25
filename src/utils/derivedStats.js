import { getPB } from "./helpers.js";

/** stat score → modifier */
export const getStatMod = (val) => Math.floor(((val ?? 10) - 10) / 2);

/** format modifier as "+X" / "-X" */
export const fmtMod = (n) => (n >= 0 ? `+${n}` : `${n}`);

/**
 * calculateDerivedStats(char, proficiencies)
 * Pure function — no side effects.
 *
 * @param {object} char          — character object from CharContext
 * @param {Array}  proficiencies — from useProficiencies (category: weapon/armor/tool/language)
 * @returns {object} all derived combat stats
 */
export function calculateDerivedStats(char, proficiencies = []) {
  const pb = getPB(char.level ?? 1);

  const STR = getStatMod(char.str);
  const DEX = getStatMod(char.dex);
  const CON = getStatMod(char.con);
  const INT = getStatMod(char.int);
  const WIS = getStatMod(char.wis);
  const CHA = getStatMod(char.cha);

  const modMap = { STR, DEX, CON, INT, WIS, CHA };

  // Spell ability mod
  const spellKey  = (char.spellAbility || "INT").toLowerCase();
  const spellMod  = getStatMod(char[spellKey]);

  // Proficiency flags
  const saves         = char.saves || {};
  const hasWeaponProf = proficiencies.some(p => p.category === "weapon");

  return {
    proficiencyBonus: pb,

    // Attack rolls
    meleeAttackRoll:  STR + (hasWeaponProf ? pb : 0),
    rangedAttackRoll: DEX + (hasWeaponProf ? pb : 0),
    spellAttackRoll:  spellMod + pb,

    // Spell DC
    spellSaveDC: 8 + spellMod + pb,

    // Base AC (unarmored)
    baseAC: 10 + DEX,
    dexMod: DEX,

    // Saving throws
    strSave: STR + (saves.STR ? pb : 0),
    dexSave: DEX + (saves.DEX ? pb : 0),
    conSave: CON + (saves.CON ? pb : 0),
    intSave: INT + (saves.INT ? pb : 0),
    wisSave: WIS + (saves.WIS ? pb : 0),
    chaSave: CHA + (saves.CHA ? pb : 0),

    // Save proficiency flags (for display)
    saveProfFlags: { STR: !!saves.STR, DEX: !!saves.DEX, CON: !!saves.CON, INT: !!saves.INT, WIS: !!saves.WIS, CHA: !!saves.CHA },

    // Extra context for UI
    spellAbility:   char.spellAbility || "INT",
    hasWeaponProf,
    level: char.level ?? 1,
    modMap,
  };
}
