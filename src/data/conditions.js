/**
 * D&D 5e 2024 PHB Conditions
 * 14 offizielle Conditions + Concentration (App-spezifisches Tracking).
 *
 * 2024 PHB Reform-Highlights:
 * - Exhaustion: KOMPLETT neu (-2 D20 + -5ft Speed pro Stufe, siehe exhaustion.js)
 * - Surprised ist KEINE Condition mehr (gibt nur Initiative-Disadvantage)
 * - Grappled: Speed = 0 + Angriffe gegen das Wesen haben Vorteil, Schaden nicht direkt
 * - Restrained: Speed = 0 + Disadvantage Attacks/DEX-Saves + Attacks against have Advantage
 * - Texte präziser, weniger zweideutig
 *
 * i18n: `desc` ist die deutsche Beschreibung (Default), `descEN` ist Englisch.
 * `nameEN` ist der englische Original-Name. Lokalisierung via lang-Toggle.
 */
export const CONDITIONS = [
  {id:"blinded", name:"Geblendet", nameEN:"Blinded", icon:"👁️",
    desc:"Du kannst nicht sehen, scheiterst automatisch bei Sicht-Checks. Angriffe gegen dich: Vorteil. Deine Angriffe: Nachteil.",
    descEN:"You can't see; you automatically fail ability checks that require sight. Attack rolls against you have Advantage. Your attack rolls have Disadvantage."},
  {id:"charmed", name:"Bezaubert", nameEN:"Charmed", icon:"💜",
    desc:"Du kannst Quelle nicht angreifen oder mit schädigenden Effekten zielen. Quelle hat Vorteil auf soziale Checks gegen dich.",
    descEN:"You can't attack the charmer or target them with damaging abilities or magical effects. The charmer has Advantage on social interaction checks with you."},
  {id:"deafened", name:"Taub", nameEN:"Deafened", icon:"🔇",
    desc:"Du kannst nicht hören. Scheiterst automatisch bei Höraufgaben.",
    descEN:"You can't hear and automatically fail ability checks that require hearing."},
  {id:"exhaustion", name:"Erschöpfung", nameEN:"Exhaustion", icon:"😴",
    desc:"NEU 2024: Pro Stufe -2 auf alle D20-Tests (Angriffe, Saves, Checks) + -5ft Speed. TOD bei Stufe 6. Long Rest entfernt 1 Stufe.",
    descEN:"NEW 2024: Per level −2 on all D20 Tests (Attacks, Saves, Checks) + −5 ft Speed. DEATH at level 6. Long Rest removes 1 level."},
  {id:"frightened", name:"Verängstigt", nameEN:"Frightened", icon:"😱",
    desc:"Nachteil auf Checks/Angriffe solange Quelle der Furcht in Sicht. Du kannst dich nicht freiwillig näher zur Quelle bewegen.",
    descEN:"Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. You can't willingly move closer to the source of your fear."},
  {id:"grappled", name:"Gegriffen", nameEN:"Grappled", icon:"🤝",
    desc:"Speed = 0. Angriffe von Wesen außer dem Grappler haben Vorteil gegen dich. Endet wenn Grappler Incapacitated oder durch DC-Check.",
    descEN:"Your Speed is 0. Attack rolls against you by creatures other than the grappler have Advantage. Ends if the grappler is Incapacitated or if you escape via the Athletics/Acrobatics check."},
  {id:"incapacitated", name:"Handlungsunfähig", nameEN:"Incapacitated", icon:"💫",
    desc:"Keine Aktionen, Bonus-Aktionen oder Reaktionen. Concentration bricht. Kann nicht sprechen. Wenn überrascht: kein Initiative-Bonus.",
    descEN:"You can't take actions, Bonus Actions, or Reactions. Concentration is broken. You can't speak. If surprised: no Initiative bonus."},
  {id:"invisible", name:"Unsichtbar", nameEN:"Invisible", icon:"👻",
    desc:"Du bist unsichtbar (nur durch Magie/Sonderfähigkeit sichtbar). Angriffe gegen dich: Nachteil. Deine Angriffe: Vorteil. Auf Initiative: Vorteil.",
    descEN:"You are invisible (only visible via magic or special senses). Attack rolls against you have Disadvantage. Your attack rolls have Advantage. Advantage on Initiative rolls."},
  {id:"paralyzed", name:"Gelähmt", nameEN:"Paralyzed", icon:"⚡",
    desc:"Incapacitated + Speed 0 + scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil. Treffer in 5ft = Critical Hit.",
    descEN:"Incapacitated + Speed 0 + automatically fail STR/DEX saves. Attack rolls against you have Advantage. Hits from within 5 feet are Critical Hits."},
  {id:"petrified", name:"Versteinert", nameEN:"Petrified", icon:"🗿",
    desc:"Wirst zu Stein (×10 Gewicht). Incapacitated, kann nicht sprechen/bewegen. Angriffe Vorteil. Resistenz gegen ALLE Schäden. Immun gegen Gift + Krankheit (laufende immun pausiert).",
    descEN:"You are turned to inanimate stone (×10 weight). Incapacitated, can't speak/move. Attacks against you have Advantage. Resistance to ALL damage. Immune to Poison + Disease (ongoing effects paused)."},
  {id:"poisoned", name:"Vergiftet", nameEN:"Poisoned", icon:"☠️",
    desc:"Nachteil auf Angriffe und Ability Checks.",
    descEN:"Disadvantage on attack rolls and ability checks."},
  {id:"prone", name:"Liegend", nameEN:"Prone", icon:"⬇️",
    desc:"Du liegst. Bewegung nur durch Krabbeln (oder Aufstehen = halbe Speed). Deine Angriffe: Nachteil. Angriffe gegen dich in 5ft: Vorteil, weiter weg: Nachteil.",
    descEN:"You are prone. Movement only via crawling (or standing up = half Speed). Your attack rolls have Disadvantage. Attack rolls against you within 5 ft have Advantage; further: Disadvantage."},
  {id:"restrained", name:"Festgehalten", nameEN:"Restrained", icon:"🕸️",
    desc:"Speed = 0. Angriffe gegen dich: Vorteil. Deine Angriffe + DEX-Saves: Nachteil.",
    descEN:"Your Speed is 0. Attack rolls against you have Advantage. Your attack rolls + DEX saves have Disadvantage."},
  {id:"stunned", name:"Betäubt", nameEN:"Stunned", icon:"⭐",
    desc:"Incapacitated + kann nicht bewegen. Scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil.",
    descEN:"Incapacitated + can't move. Automatically fail STR/DEX saves. Attack rolls against you have Advantage."},
  {id:"unconscious", name:"Bewusstlos", nameEN:"Unconscious", icon:"💤",
    desc:"Incapacitated + Prone + Speed 0. Bewusstlos, lässt alles los. Scheiterst STR/DEX-Saves. Angriffe Vorteil. Treffer in 5ft = Critical Hit.",
    descEN:"Incapacitated + Prone + Speed 0. Unconscious, drops everything held. Automatically fail STR/DEX saves. Attack rolls against you have Advantage. Hits from within 5 feet are Critical Hits."},
  {id:"concentration", name:"Konzentration", nameEN:"Concentration", icon:"🔮",
    desc:"App-Tracking (keine offizielle Condition). Bei Schaden: CON-Save (DC = max(10, halbe Schaden), bis DC 30). Bricht bei Incapacitated/Death.",
    descEN:"App tracking (not an official condition). On taking damage: CON save (DC = max(10, half the damage taken), up to DC 30). Broken if Incapacitated or dies."},
];
