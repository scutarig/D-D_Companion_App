/**
 * D&D 5e 2024 PHB Conditions — single source of truth.
 *
 * Merged Jun 2026 from the legacy English-only `utils/conditions.js`
 * (had `effects` schema + combat helpers) and `data/conditions.js`
 * (had DE/EN names + 2024 PHB-updated descriptions). The data/ file
 * has been removed; all callers now import from this file.
 *
 * Shape per entry:
 *   id        — stable key persisted in char.activeConditions / fighter.conditions
 *   name      — German label (default UI text)
 *   nameEN    — English label (shown when i18n lang === "en")
 *   icon      — short emoji
 *   color     — hex tint used by Combat-tab condition badges
 *   desc      — German description (PHB 2024)
 *   descEN    — English description (PHB 2024)
 *   effects   — mechanical hints consumed by suggestAttackModifiers and
 *               friends. Optional flags: attackerAdvantage,
 *               attackerDisadvantage, targetAdvantage, targetDisadvantage,
 *               speedZero, noActions, autoFailSaves[]
 */

export const CONDITIONS = [
  {
    id: "blinded", name: "Geblendet", nameEN: "Blinded",
    icon: "👁️", color: "#888888",
    desc: "Du kannst nicht sehen, scheiterst automatisch bei Sicht-Checks. Angriffe gegen dich: Vorteil. Deine Angriffe: Nachteil.",
    descEN: "You can't see; you automatically fail ability checks that require sight. Attack rolls against you have Advantage. Your attack rolls have Disadvantage.",
    effects: { attackerDisadvantage: true, targetAdvantage: true, autoFailSaves: [] },
  },
  {
    id: "charmed", name: "Bezaubert", nameEN: "Charmed",
    icon: "💜", color: "#ff69b4",
    desc: "Du kannst Quelle nicht angreifen oder mit schädigenden Effekten zielen. Quelle hat Vorteil auf soziale Checks gegen dich.",
    descEN: "You can't attack the charmer or target them with damaging abilities or magical effects. The charmer has Advantage on social interaction checks with you.",
    effects: { autoFailSaves: [] },
  },
  {
    id: "deafened", name: "Taub", nameEN: "Deafened",
    icon: "🔇", color: "#aaaaaa",
    desc: "Du kannst nicht hören. Scheiterst automatisch bei Höraufgaben.",
    descEN: "You can't hear and automatically fail ability checks that require hearing.",
    effects: { autoFailSaves: [] },
  },
  {
    id: "exhaustion", name: "Erschöpfung", nameEN: "Exhaustion",
    icon: "😴", color: "#c0a060",
    desc: "NEU 2024: Pro Stufe -2 auf alle D20-Tests (Angriffe, Saves, Checks) + -5ft Speed. TOD bei Stufe 6. Long Rest entfernt 1 Stufe.",
    descEN: "NEW 2024: Per level −2 on all D20 Tests (Attacks, Saves, Checks) + −5 ft Speed. DEATH at level 6. Long Rest removes 1 level.",
    effects: { attackerDisadvantage: true, autoFailSaves: [] },
  },
  {
    id: "frightened", name: "Verängstigt", nameEN: "Frightened",
    icon: "😱", color: "#9400d3",
    desc: "Nachteil auf Checks/Angriffe solange Quelle der Furcht in Sicht. Du kannst dich nicht freiwillig näher zur Quelle bewegen.",
    descEN: "Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. You can't willingly move closer to the source of your fear.",
    effects: { attackerDisadvantage: true, autoFailSaves: [] },
  },
  {
    id: "grappled", name: "Gegriffen", nameEN: "Grappled",
    icon: "🤝", color: "#8b4513",
    desc: "Speed = 0. Angriffe von Wesen außer dem Grappler haben Vorteil gegen dich. Endet wenn Grappler Incapacitated oder durch DC-Check.",
    descEN: "Your Speed is 0. Attack rolls against you by creatures other than the grappler have Advantage. Ends if the grappler is Incapacitated or if you escape via the Athletics/Acrobatics check.",
    effects: { speedZero: true, autoFailSaves: [] },
  },
  {
    id: "incapacitated", name: "Handlungsunfähig", nameEN: "Incapacitated",
    icon: "💫", color: "#708090",
    desc: "Keine Aktionen, Bonus-Aktionen oder Reaktionen. Concentration bricht. Kann nicht sprechen. Wenn überrascht: kein Initiative-Bonus.",
    descEN: "You can't take actions, Bonus Actions, or Reactions. Concentration is broken. You can't speak. If surprised: no Initiative bonus.",
    effects: { noActions: true, autoFailSaves: [] },
  },
  {
    id: "invisible", name: "Unsichtbar", nameEN: "Invisible",
    icon: "👻", color: "#00ced1",
    desc: "Du bist unsichtbar (nur durch Magie/Sonderfähigkeit sichtbar). Angriffe gegen dich: Nachteil. Deine Angriffe: Vorteil. Auf Initiative: Vorteil.",
    descEN: "You are invisible (only visible via magic or special senses). Attack rolls against you have Disadvantage. Your attack rolls have Advantage. Advantage on Initiative rolls.",
    effects: { attackerAdvantage: true, targetDisadvantage: true, autoFailSaves: [] },
  },
  {
    id: "paralyzed", name: "Gelähmt", nameEN: "Paralyzed",
    icon: "⚡", color: "#ffd700",
    desc: "Incapacitated + Speed 0 + scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil. Treffer in 5ft = Critical Hit.",
    descEN: "Incapacitated + Speed 0 + automatically fail STR/DEX saves. Attack rolls against you have Advantage. Hits from within 5 feet are Critical Hits.",
    effects: { targetAdvantage: true, noActions: true, speedZero: true, autoFailSaves: ["STR", "DEX"] },
  },
  {
    id: "petrified", name: "Versteinert", nameEN: "Petrified",
    icon: "🗿", color: "#a9a9a9",
    desc: "Wirst zu Stein (×10 Gewicht). Incapacitated, kann nicht sprechen/bewegen. Angriffe Vorteil. Resistenz gegen ALLE Schäden. Immun gegen Gift + Krankheit (laufende immun pausiert).",
    descEN: "You are turned to inanimate stone (×10 weight). Incapacitated, can't speak/move. Attacks against you have Advantage. Resistance to ALL damage. Immune to Poison + Disease (ongoing effects paused).",
    effects: { targetAdvantage: true, noActions: true, speedZero: true, autoFailSaves: ["STR", "DEX"] },
  },
  {
    id: "poisoned", name: "Vergiftet", nameEN: "Poisoned",
    icon: "☠️", color: "#32cd32",
    desc: "Nachteil auf Angriffe und Ability Checks.",
    descEN: "Disadvantage on attack rolls and ability checks.",
    effects: { attackerDisadvantage: true, autoFailSaves: [] },
  },
  {
    id: "prone", name: "Liegend", nameEN: "Prone",
    icon: "⬇️", color: "#cd853f",
    desc: "Du liegst. Bewegung nur durch Krabbeln (oder Aufstehen = halbe Speed). Deine Angriffe: Nachteil. Angriffe gegen dich in 5ft: Vorteil, weiter weg: Nachteil.",
    descEN: "You are prone. Movement only via crawling (or standing up = half Speed). Your attack rolls have Disadvantage. Attack rolls against you within 5 ft have Advantage; further: Disadvantage.",
    effects: { attackerDisadvantage: true, targetAdvantage: true, autoFailSaves: [] },
  },
  {
    id: "restrained", name: "Festgehalten", nameEN: "Restrained",
    icon: "🕸️", color: "#8b0000",
    desc: "Speed = 0. Angriffe gegen dich: Vorteil. Deine Angriffe + DEX-Saves: Nachteil.",
    descEN: "Your Speed is 0. Attack rolls against you have Advantage. Your attack rolls + DEX saves have Disadvantage.",
    effects: { attackerDisadvantage: true, targetAdvantage: true, speedZero: true, autoFailSaves: [] },
  },
  {
    id: "stunned", name: "Betäubt", nameEN: "Stunned",
    icon: "⭐", color: "#ffa500",
    desc: "Incapacitated + kann nicht bewegen. Scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil.",
    descEN: "Incapacitated + can't move. Automatically fail STR/DEX saves. Attack rolls against you have Advantage.",
    effects: { targetAdvantage: true, noActions: true, speedZero: true, autoFailSaves: ["STR", "DEX"] },
  },
  {
    id: "unconscious", name: "Bewusstlos", nameEN: "Unconscious",
    icon: "💤", color: "#dc143c",
    desc: "Incapacitated + Prone + Speed 0. Bewusstlos, lässt alles los. Scheiterst STR/DEX-Saves. Angriffe Vorteil. Treffer in 5ft = Critical Hit.",
    descEN: "Incapacitated + Prone + Speed 0. Unconscious, drops everything held. Automatically fail STR/DEX saves. Attack rolls against you have Advantage. Hits from within 5 feet are Critical Hits.",
    effects: { targetAdvantage: true, noActions: true, speedZero: true, autoFailSaves: ["STR", "DEX"] },
  },
  // ── App-spezifische / nicht-PHB Marker (im Picker der ConditionsCard
  // ausgeblendet, aber vom Combat-Tab + Tracker konsumiert) ──
  {
    id: "concentration", name: "Konzentration", nameEN: "Concentration",
    icon: "🔮", color: "#7b68ee",
    desc: "App-Tracking (keine offizielle Condition). Bei Schaden: CON-Save (DC = max(10, halbe Schaden), bis DC 30). Bricht bei Incapacitated/Death.",
    descEN: "App tracking (not an official condition). On taking damage: CON save (DC = max(10, half the damage taken), up to DC 30). Broken if Incapacitated or dies.",
    effects: { autoFailSaves: [] },
  },
  {
    id: "hidden", name: "Versteckt", nameEN: "Hidden",
    icon: "🫥", color: "#2f4f4f",
    desc: "Vor Feinden versteckt. Angriffe haben Vorteil. Angreifer müssen ohne Sichtkontakt raten.",
    descEN: "Hidden from enemies. Attack rolls have advantage. Attackers can't target without guessing.",
    effects: { attackerAdvantage: true, targetDisadvantage: true, autoFailSaves: [] },
  },
  {
    id: "raging", name: "Im Rausch", nameEN: "Raging",
    icon: "🔥", color: "#ff4500",
    desc: "Barbar-Rage. Vorteil auf STR-Checks/Saves. Resistenz gegen physischen Schaden. Bonus-Schaden auf Nahkampfangriffe.",
    descEN: "Barbarian Rage. Advantage on STR checks/saves. Resistance to physical damage. Bonus damage on melee attacks.",
    effects: { autoFailSaves: [] },
  },
];

// ── Lookups ──────────────────────────────────────────────────────────────────
export const getCondition = (id) => CONDITIONS.find((c) => c.id === id) ?? null;

// All conditions where the holder has disadvantage on their own attacks
export const getAttackerDisadvantageConditions = (conditionIds = []) =>
  conditionIds.map(getCondition).filter(Boolean).filter((c) => c.effects?.attackerDisadvantage);

// All conditions where attacks against the holder have advantage
export const getTargetAdvantageConditions = (conditionIds = []) =>
  conditionIds.map(getCondition).filter(Boolean).filter((c) => c.effects?.targetAdvantage);

// All conditions where the holder gets advantage on their own attacks
export const getAttackerAdvantageConditions = (conditionIds = []) =>
  conditionIds.map(getCondition).filter(Boolean).filter((c) => c.effects?.attackerAdvantage);

/**
 * Suggest advantage/disadvantage for an attack roll based on attacker + target
 * conditions. Returns { advantage, disadvantage, cancelled, advReasons[], disReasons[] }.
 * D&D 5e: any single advantage + any single disadvantage = straight roll.
 */
export const suggestAttackModifiers = (attacker, target) => {
  const attackerConds = attacker?.conditions ?? [];
  const targetConds = target?.conditions ?? [];

  const advReasons = [];
  const disReasons = [];

  for (const cId of attackerConds) {
    const c = getCondition(cId);
    if (c?.effects?.attackerAdvantage) advReasons.push(`${c.icon} ${c.name}`);
    if (c?.effects?.attackerDisadvantage) disReasons.push(`${c.icon} ${c.name}`);
  }

  for (const cId of targetConds) {
    const c = getCondition(cId);
    if (c?.effects?.targetAdvantage) advReasons.push(`Target ${c.icon} ${c.name}`);
    if (c?.effects?.targetDisadvantage) disReasons.push(`Target ${c.icon} ${c.name}`);
  }

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

// Wrap a condition id with a duration (rounds remaining; null = permanent)
export const createConditionInstance = (id, duration = null, sourceId = null) => ({
  id, duration, sourceId,
});

// Decrement durations and drop expired conditions for a fighter (turn start/end)
export const decrementConditions = (fighter) => {
  const updated = (fighter.conditions || [])
    .map((cid) => {
      if (typeof cid === "string") return cid;             // legacy bare id
      if (cid.duration === null) return cid;               // permanent
      return { ...cid, duration: cid.duration - 1 };
    })
    .filter((cid) => {
      if (typeof cid === "string") return true;
      return cid.duration === null || cid.duration > 0;
    });
  return { ...fighter, conditions: updated };
};

// Normalize: condition entry is either a bare id string or { id, duration, ... }
export const getConditionId = (c) => (typeof c === "string" ? c : c?.id);

export const getFighterConditionIds = (fighter) =>
  (fighter?.conditions ?? []).map(getConditionId);
