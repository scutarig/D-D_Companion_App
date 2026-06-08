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
 */
export const CONDITIONS = [
  {id:"blinded",name:"Blinded",icon:"👁️",desc:"Du kannst nicht sehen, scheiterst automatisch bei Sicht-Checks. Angriffe gegen dich: Vorteil. Deine Angriffe: Nachteil."},
  {id:"charmed",name:"Charmed",icon:"💜",desc:"Du kannst Quelle nicht angreifen oder mit schädigenden Effekten zielen. Quelle hat Vorteil auf soziale Checks gegen dich."},
  {id:"deafened",name:"Deafened",icon:"🔇",desc:"Du kannst nicht hören. Scheiterst automatisch bei Höraufgaben."},
  {id:"exhaustion",name:"Exhaustion",icon:"😴",desc:"NEU 2024: Pro Stufe -2 auf alle D20-Tests (Angriffe, Saves, Checks) + -5ft Speed. TOD bei Stufe 6. Long Rest entfernt 1 Stufe."},
  {id:"frightened",name:"Frightened",icon:"😱",desc:"Nachteil auf Checks/Angriffe solange Quelle der Furcht in Sicht. Du kannst dich nicht freiwillig näher zur Quelle bewegen."},
  {id:"grappled",name:"Grappled",icon:"🤝",desc:"Speed = 0. Angriffe von Wesen außer dem Grappler haben Vorteil gegen dich. Endet wenn Grappler Incapacitated oder durch DC-Check."},
  {id:"incapacitated",name:"Incapacitated",icon:"💫",desc:"Keine Aktionen, Bonus-Aktionen oder Reaktionen. Concentration bricht. Kann nicht sprechen. Wenn überrascht: kein Initiative-Bonus."},
  {id:"invisible",name:"Invisible",icon:"👻",desc:"Du bist unsichtbar (nur durch Magie/Sonderfähigkeit sichtbar). Angriffe gegen dich: Nachteil. Deine Angriffe: Vorteil. Auf Initiative: Vorteil."},
  {id:"paralyzed",name:"Paralyzed",icon:"⚡",desc:"Incapacitated + Speed 0 + scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil. Treffer in 5ft = Critical Hit."},
  {id:"petrified",name:"Petrified",icon:"🗿",desc:"Wirst zu Stein (×10 Gewicht). Incapacitated, kann nicht sprechen/bewegen. Angriffe Vorteil. Resistenz gegen ALLE Schäden. Immun gegen Gift + Krankheit (laufende immun pausiert)."},
  {id:"poisoned",name:"Poisoned",icon:"☠️",desc:"Nachteil auf Angriffe und Ability Checks."},
  {id:"prone",name:"Prone",icon:"⬇️",desc:"Du liegst. Bewegung nur durch Krabbeln (oder Aufstehen = halbe Speed). Deine Angriffe: Nachteil. Angriffe gegen dich in 5ft: Vorteil, weiter weg: Nachteil."},
  {id:"restrained",name:"Restrained",icon:"🕸️",desc:"Speed = 0. Angriffe gegen dich: Vorteil. Deine Angriffe + DEX-Saves: Nachteil."},
  {id:"stunned",name:"Stunned",icon:"⭐",desc:"Incapacitated + kann nicht bewegen. Scheiterst STR/DEX-Saves. Angriffe gegen dich: Vorteil."},
  {id:"unconscious",name:"Unconscious",icon:"💤",desc:"Incapacitated + Prone + Speed 0. Bewusstlos, lässt alles los. Scheiterst STR/DEX-Saves. Angriffe Vorteil. Treffer in 5ft = Critical Hit."},
  {id:"concentration",name:"Concentration",icon:"🔮",desc:"App-Tracking (keine offizielle Condition). Bei Schaden: CON-Save (DC = max(10, halbe Schaden), bis DC 30). Bricht bei Incapacitated/Death."},
];
