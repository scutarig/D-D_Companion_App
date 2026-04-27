/**
 * Concentration utilities — D&D 5e PHB rules.
 */

/** True wenn der Zauber Konzentration benötigt (via Flag ODER dur-String). */
export const requiresConcentration = (spell) =>
  spell?.concentration === true ||
  (spell?.dur || "").includes("Conc");

/** Startet Konzentration auf einen Zauber. */
export const startConcentration = (char, spell, slotLv = null) => ({
  ...char,
  concentration: {
    spellId:   spell.id,
    spellName: spell.name,
    school:    spell.school,
    lv:        spell.lv,
    slotLv:    slotLv ?? spell.lv,
    dur:       spell.dur,
    startedAt: Date.now(),
  },
});

/** Beendet Konzentration. */
export const breakConcentration = (char) => ({ ...char, concentration: null });

/** CON-Save-DC bei erlitten Schaden. RAW: max(10, Schaden/2). */
export const getConcentrationDC = (damage) => Math.max(10, Math.floor((damage || 0) / 2));
