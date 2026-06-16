// PHB 2024 Chapter 1 — Alignment short codes + bilingual descriptions
export const ALIGNMENTS = [
  { id: "LG", de: "Rechtschaffen Gut",    en: "Lawful Good",     row: 0, col: 0,
    descDE: "Tut das Richtige nach festen Regeln und persönlicher Ehre.",
    descEN: "Does the right thing as expected by society — laws, traditions, honor." },
  { id: "NG", de: "Neutral Gut",          en: "Neutral Good",    row: 0, col: 1,
    descDE: "Tut das Beste für andere, ohne sich an Regeln oder Chaos zu binden.",
    descEN: "Does what good people do, free of bias either toward law or chaos." },
  { id: "CG", de: "Chaotisch Gut",        en: "Chaotic Good",    row: 0, col: 2,
    descDE: "Folgt dem eigenen Gewissen, achtet wenig auf Regeln, hilft jedoch anderen.",
    descEN: "Acts as conscience directs with little respect for rules; champions freedom." },
  { id: "LN", de: "Rechtschaffen Neutral", en: "Lawful Neutral", row: 1, col: 0,
    descDE: "Handelt nach Regeln, Tradition oder persönlichem Kodex — moralisch neutral.",
    descEN: "Acts in accordance with law, tradition, or a personal code." },
  { id: "N",  de: "Neutral",              en: "True Neutral",    row: 1, col: 1,
    descDE: "Vermeidet ideologische Extreme; tut, was vernünftig erscheint.",
    descEN: "Acts naturally without prejudice or compulsion; balance above all." },
  { id: "CN", de: "Chaotisch Neutral",    en: "Chaotic Neutral", row: 1, col: 2,
    descDE: "Folgt eigenen Launen, schätzt persönliche Freiheit über alles.",
    descEN: "Follows whims, holding personal freedom above all else." },
  { id: "LE", de: "Rechtschaffen Böse",   en: "Lawful Evil",     row: 2, col: 0,
    descDE: "Nutzt Regeln, Tradition oder Hierarchie, um zu nehmen, was sie wollen.",
    descEN: "Methodically takes what is wanted, within tradition or hierarchy." },
  { id: "NE", de: "Neutral Böse",         en: "Neutral Evil",    row: 2, col: 1,
    descDE: "Tut, was nötig ist, um Vorteile zu erlangen, ohne Mitleid oder Skrupel.",
    descEN: "Does whatever they can get away with, without compassion or qualms." },
  { id: "CE", de: "Chaotisch Böse",       en: "Chaotic Evil",    row: 2, col: 2,
    descDE: "Folgt zerstörerischen Trieben; verachtet Regeln und Mitgefühl.",
    descEN: "Acts with arbitrary violence, driven by greed, hatred, or bloodlust." },
];

export function alignLabel(id, lang) {
  const a = ALIGNMENTS.find((x) => x.id === id);
  if (!a) return "";
  return lang === "en" ? a.en : a.de;
}
