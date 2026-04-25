// Combat Spell & Resource Utilities
import { buildSlotsForLevel } from "./helpers.js";
import { SPELLS } from "../data/spells.js";

/**
 * Build initial spell slot array for a fighter.
 * Returns [{lv, total, used}] or [] for non-casters.
 */
export const initSpellSlots = (klass, level) => {
  if (!klass || !level) return [];
  const slots = buildSlotsForLevel(klass, level);
  if (!slots) return [];
  return slots.map((s) => ({ lv: s.lv, total: s.tot, used: 0, pact: s.pact || false }));
};

/**
 * Use one spell slot of a given level.
 * Returns updated fighter, or unchanged if no slots available.
 */
export const useSpellSlot = (fighter, slotLevel) => {
  const slots = fighter.spellSlots ?? [];
  const slot = slots.find((s) => s.lv === slotLevel && s.used < s.total);
  if (!slot) return fighter; // no slot available
  return {
    ...fighter,
    spellSlots: slots.map((s) =>
      s.lv === slotLevel ? { ...s, used: s.used + 1 } : s
    ),
  };
};

/**
 * Restore one spell slot of a given level (e.g. arcane recovery).
 */
export const restoreSpellSlot = (fighter, slotLevel, count = 1) => {
  const slots = fighter.spellSlots ?? [];
  return {
    ...fighter,
    spellSlots: slots.map((s) =>
      s.lv === slotLevel ? { ...s, used: Math.max(0, s.used - count) } : s
    ),
  };
};

/**
 * Restore all spell slots (long rest).
 */
export const restoreAllSlots = (fighter) => ({
  ...fighter,
  spellSlots: (fighter.spellSlots ?? []).map((s) => ({ ...s, used: 0 })),
  concentration: null,
});

/**
 * Short rest: restore pact magic slots only.
 */
export const shortRestSlots = (fighter) => ({
  ...fighter,
  spellSlots: (fighter.spellSlots ?? []).map((s) =>
    s.pact ? { ...s, used: 0 } : s
  ),
});

/**
 * Set concentration on a spell. Pass null to remove.
 * Also applies/removes the "concentration" condition.
 */
export const setConcentration = (fighter, spellId, spellName) => {
  // Remove old concentration condition if present
  const conditionsWithout = (fighter.conditions ?? []).filter(
    (c) => (typeof c === "string" ? c : c?.id) !== "concentration"
  );

  if (!spellId) {
    return { ...fighter, concentration: null, conditions: conditionsWithout };
  }

  // Add new concentration condition
  const newConditions = [...conditionsWithout, { id: "concentration", duration: null, spellName }];
  return { ...fighter, concentration: spellId, conditions: newConditions };
};

/**
 * Check if fighter has a free slot of at least the given level.
 */
export const hasSlotAvailable = (fighter, minLevel = 1) => {
  return (fighter.spellSlots ?? []).some(
    (s) => s.lv >= minLevel && s.used < s.total
  );
};

/**
 * Get available (not used) slot levels.
 */
export const getAvailableSlotLevels = (fighter) =>
  (fighter.spellSlots ?? [])
    .filter((s) => s.used < s.total)
    .map((s) => s.lv);

/**
 * Get spell data by id.
 */
export const getSpellById = (id) => SPELLS.find((s) => s.id === id) ?? null;

/**
 * Check if a spell requires concentration.
 */
export const isConcentration = (spell) =>
  spell?.dur?.toLowerCase().includes("conc") ?? false;

/**
 * Get damage type emoji.
 */
export const getDamageTypeEmoji = (dt) => {
  const map = {
    fire: "🔥", cold: "❄️", lightning: "⚡", acid: "💚",
    thunder: "💨", radiant: "✨", necrotic: "💀", poison: "☠️",
    psychic: "🔮", force: "⚪", healing: "💛", bludgeoning: "🪨",
    piercing: "🗡️", slashing: "⚔️",
  };
  return map[dt?.toLowerCase()] ?? "✨";
};

/**
 * Spell level label.
 */
export const slotLabel = (lv) =>
  lv === 0 ? "Cantrip" : lv === 1 ? "1st" : lv === 2 ? "2nd" : lv === 3 ? "3rd" : `${lv}th`;

/** Level color */
export const slotColor = (lv) => {
  const colors = ["#808080","#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  return colors[lv] ?? "#808080";
};
