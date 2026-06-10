import { useState } from "react";
import { C, sx, F, FH } from "../constants/theme.js";
import { CONDITIONS } from "../data/conditions.js";
import { useI18n } from "../i18n/index.js";

// ─── PHB 2024 Schnellreferenz ────────────────────────────────────────────────
// Quelle: D&D Player's Handbook 2024 (Wizards of the Coast)
// Pages: Actions Chapter 1 (pp.13-22), Weapons Chapter 6 (pp.213-218),
//        Conditions/Rules Glossary Appendix C (pp.360-377)
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "conditions", labelKey: "quickref.conditions", label: "⚡ Zustände" },
  { id: "actions",    labelKey: "quickref.actions",    label: "🎯 Aktionen" },
  { id: "combat",     labelKey: "quickref.combat",     label: "⚔️ Kampf" },
  { id: "mastery",    labelKey: "quickref.mastery",    label: "🗡️ Meisterschaft" },
  { id: "weapons",    labelKey: "quickref.weapons",    label: "🪓 Waffen-Props" },
  { id: "movement",   labelKey: "quickref.movement",   label: "💨 Bewegung" },
  { id: "resting",    labelKey: "quickref.resting",    label: "🌙 Rasten" },
  { id: "magic",      labelKey: "quickref.magic",      label: "🔮 Magie" },
  { id: "checks",     labelKey: "quickref.checks",     label: "🎲 Proben" },
  { id: "tables",     labelKey: "quickref.tables",     label: "📊 Tabellen" },
];

const RULES = {
  combat: [
    { t: "Initiative", b: "1d20 + DEX-Mod (+ PB wenn proficient). Höchster Wert beginnt. Bei Gleichstand: höheres DEX entscheidet." },
    { t: "Angriff & Treffer", b: "1d20 + Angriffs-Bonus vs AC. Nat20 auf Weapon Attack = Critical Hit (Schadenswürfel ×2, KEINE flat-bonuses). Nat1 = Auto-Miss. Spell Attacks: Nat20 = Krit." },
    { t: "Vorteil/Nachteil", b: "Vorteil: 2d20, höchsten nehmen. Nachteil: niedrigsten. Stacken nicht. Beides = neutral. NEU 2024: Vorteil-Quellen klarer kategorisiert." },
    { t: "Trefferpunkte & Tod", b: "Bei 0 HP: bewusstlos. Todeswürfe pro Zug-Start: 3× Erfolg (≥10) = stabil, 3× Fehlschlag = tot. Nat20 = sofort 1 HP. Nat1 = 2 Fehlschläge." },
    { t: "Critical Hit", b: "NEU 2024: NUR Weapon Attacks und Unarmed Strikes können Krits sein. NICHT Spells (außer als Klassenfeature). Verdopple ALLE Schadenswürfel (Weapon + Sneak Attack + Smite etc.), nicht die flat bonuses." },
    { t: "Cover (Deckung)", b: "Halbe: +2 AC + DEX-Saves. Dreiviertel: +5 AC + DEX-Saves. Voll: nicht direkt angreifbar. Kreaturen geben halbe Deckung." },
    { t: "Konzentration", b: "Max 1 Konzentrations-Zauber gleichzeitig. Bei Schaden: CON-Save DC max(10, halber Schaden). Fehlschlag bricht Spell. Incapacitated/Death bricht auch." },
    { t: "Gelegenheitsangriff (OA)", b: "Reaktion: wenn feindliche Kreatur deinen Nahkampfbereich verlässt (ohne Disengage). 1 Nahkampfangriff. Nicht beim Teleport." },
    { t: "Fernkampf in Nahkampf", b: "Fernkampfangriff in 5ft eines feindlichen Wesens, das nicht Incapacitated ist: Nachteil." },
    { t: "Two-Weapon Fighting", b: "Bonus Action nach Attack mit Light-Waffe: Angriff mit anderer Light-Waffe (oder NEU: Nick-Mastery erlaubt es als Teil der Attack-Aktion). Kein Schadens-Mod (außer negativ)." },
    { t: "Resistenz / Verwundbarkeit / Immunität", b: "Resistenz: halber Schaden (abgerundet). Verwundbarkeit: doppelter Schaden. Immunität: kein Schaden. Mehrere Resistenzen zum gleichen Typ stacken NICHT. Vulnerability + Resistance = normaler Schaden." },
    { t: "Heldenhafte Inspiration", b: "🆕 2024: Reroll-Token (1×). Verbrauche um EINEN deiner D20-Würfel neu zu würfeln (nach dem Wurf, vor dem Ergebnis). Manche Backgrounds + Lineages geben sie. Mensch: 1 pro Lange Rast." },
  ],

  movement: [
    { t: "Grundbewegung", b: "Volle Speed pro Runde (meist 30ft). Teilbar vor/nach/zwischen Aktionen. Schwieriges Gelände: 2× Kosten pro ft." },
    { t: "Stehen aus Prone", b: "Kostet halbe Bewegung (15ft bei Speed 30)." },
    { t: "Klettern/Schwimmen", b: "2× Bewegungskosten. Klettern: STR(Athletik)-Check bei rutschigem/instabilem Untergrund." },
    { t: "Springen", b: "Weitsprung: STR-Score in ft (mit 10ft Anlauf, sonst halb). Hochsprung: 3 + STR-Mod in ft (mit Anlauf, sonst halb)." },
    { t: "Fallen", b: "Fallschaden: 1d6 pro 10ft (max 20d6 bei 200ft+). Landung = Prone (außer flying/Feather Fall etc.)." },
    { t: "Mounted Combat", b: "Reittier-Initiative = deine. Bewegung gilt zusammen. Dismount = halbe Bewegung. Vorteil auf Angriffe gegen Reittier wenn unbewusst." },
  ],

  resting: [
    { t: "Kurze Rast (1h)", b: "HD ausgeben: 1d{HD}+CON-Mod pro Würfel, HP heilen. Kurz-Rast-Ressourcen recharge (Action Surge, Second Wind, Channel Divinity, Pact Magic Slots, Focus Points etc.)." },
    { t: "Lange Rast (8h)", b: "NEU 2024: Volle HP. Alle Spell Slots. HD recovered = ½ Char-Level (min 1). Long-Rest-Ressourcen reset. Exhaustion -1 Stufe. Nur 1×/24h. Heroic Inspiration (manche Backgrounds)." },
    { t: "Exhaustion (2024)", b: "NEU komplett: Pro Stufe -2 auf alle D20-Tests + -5ft Speed. Stufe 6 = Tod. Long Rest entfernt 1 Stufe." },
    { t: "Hit Dice", b: "Pro Klassen-Level 1 HD (Klassen-Hit-Die). Auf KR ausgeben. Auf LR: regenerieren bis ½ Char-Level. Bei Multiclass: separate HD pro Klasse." },
  ],

  magic: [
    { t: "Spell-Save DC", b: "8 + PB + Spellcasting-Mod. Angriffs-Bonus für Spell Attacks: PB + Spellcasting-Mod." },
    { t: "Spell Slots", b: "Ressource für Lv1+ Zauber. Cantrips kostenlos. Höherer Slot = stärkerer Spell-Effekt (siehe Spell-Beschreibung 'At Higher Levels'). Long Rest recharge alle." },
    { t: "Ritual-Zaubern", b: "Ritual-Tag: +10 Min Casting Time, KEIN Slot-Verbrauch. Cleric/Druid/Bard: alle prepared Spells ritual-fähig. Wizard: alle im Spellbook (Ritual Adept Lv1)." },
    { t: "Counterspell (2024)", b: "Reaktion in 60ft beim Sehen eines Zauberers casts. NEU: Target macht CON-Save (DC = dein Spell-Save-DC). Fehlschlag = Spell verfällt. Erfolg = Spell wirkt normal." },
    { t: "Dispel Magic", b: "Wirke als Lv3-Slot: alle Spells ≤ Lv3 enden. Höhere Levels: Spellcasting-Check DC 10 + Spell-Lv." },
    { t: "Spell Components", b: "V (verbal), S (somatic), M (material). Spellcasting Focus ersetzt M (außer kostspezifizierte). Subtle Spell (Sorcerer) ignoriert V+S+M." },
    { t: "Bonus-Action Spell Rule", b: "Wenn du einen Spell als Bonus Action castest, kannst du auf gleicher Runde nur Cantrips mit Action casten (außer Action ist ein Cantrip mit 1 Action Casting Time)." },
    { t: "Concentration & Multiclass", b: "Spell Slots werden geteilt nach Multiclass-Caster-Level. Cantrips, Known/Prepared bleiben pro Klasse separat." },
    { t: "Multiclass Spell-Slot-Berechnung", b: "Multiclass Caster-Level = Full Caster-Level + ½ Half-Caster-Level (abgerundet) + ⅓ Third-Caster-Level. Pact Magic (Warlock) separat — eigener Slot-Pool." },
    { t: "Heroic Inspiration mit Spells", b: "Reroll wirkt auf ALLE D20-Tests — auch Concentration-Saves, Spell-Attacks, Counterspell-Save. Eine Inspiration = 1 Reroll, nicht 1 pro Wurftyp." },
  ],

  checks: [
    { t: "Fähigkeitsprobe", b: "1d20 + Ability-Mod (+ PB wenn proficient/Expertise: ×2 PB). Vergleich vs DC." },
    { t: "DC-Skala", b: "5 = trivial, 10 = einfach, 15 = mittel, 20 = schwer, 25 = sehr schwer, 30 = fast unmöglich." },
    { t: "Passive Checks", b: "10 + alle Mods (PB inklusive). Vorteil: +5, Nachteil: -5. Beispiel: Passive Perception für Hide-DC." },
    { t: "Rettungswürfe (Saves)", b: "1d20 + Save-Mod (+ PB wenn proficient). Gegen DC des Effekts. Klassen entscheiden Save-Proficiencies." },
    { t: "Group Checks", b: "Mind. halbe Gruppe muss DC schaffen = Gruppen-Erfolg. Für gemeinsame Tasks (z.B. unbemerkt Wache passieren)." },
    { t: "D20 Test", b: "NEU 2024: Sammelbegriff für alle d20-Würfe = Attack Rolls + Saving Throws + Ability Checks. 'Reroll a D20 Test' = ALLE drei Arten." },
    { t: "Skill-Liste (PHB 2024)", b: "Akrobatik (DEX), Tierkunde (WIS), Arkane Kunde (INT), Athletik (STR), Täuschung (CHA), Geschichte (INT), Einsicht (WIS), Einschüchtern (CHA), Nachforschungen (INT), Heilkunde (WIS), Natur (INT), Wahrnehmung (WIS), Auftreten (CHA), Überzeugen (CHA), Religion (INT), Fingerfertigkeit (DEX), Heimlichkeit (DEX), Überleben (WIS). = 18 Skills." },
  ],
};

// ─── Actions PHB 2024 (Chapter 1, p.15) ──────────────────────────────────────
const ACTIONS_2024 = [
  // ─── Standard Actions ───
  { t: "Attack", typ: "Aktion", new: false, b: "Angriff mit Weapon oder Unarmed Strike. Extra-Angriffe bei Lv5+ (Klassen-Feature)." },
  { t: "Dash", typ: "Aktion", new: false, b: "Rest des Zuges: Extra-Bewegung = deine Speed." },
  { t: "Disengage", typ: "Aktion", new: false, b: "Rest des Zuges: Bewegung provoziert keine OAs." },
  { t: "Dodge", typ: "Aktion", new: false, b: "Bis nächster Zug: Angriffe gegen dich = Nachteil + DEX-Saves = Vorteil. Verloren bei Incapacitated oder Speed 0." },
  { t: "Help", typ: "Aktion", new: false, b: "Verbündeter erhält Vorteil auf nächsten Check ODER nächsten Angriffsrolle gegen Ziel in 5ft." },
  { t: "Hide", typ: "Aktion", new: false, b: "DEX(Stealth)-Check. Erfolg bedeutet, du hast Invisible-Condition gegen Wesen, die dich nicht sehen — bis du Angriff machst oder gesehen wirst." },
  { t: "Influence", typ: "Aktion", new: true, b: "🆕 PHB 2024: CHA(Deception/Intimidation/Performance/Persuasion) oder WIS(Animal Handling)-Check, um NPC-Einstellung zu ändern (Friendly/Indifferent/Hostile)." },
  { t: "Magic", typ: "Aktion", new: true, b: "🆕 PHB 2024: Wirke einen Spell, nutze ein Magic Item oder ein magisches Klassenfeature. (Vorher: 'Cast a Spell')" },
  { t: "Ready", typ: "Aktion", new: false, b: "Bereite Aktion oder Bewegung vor + Trigger. Auslöser tritt ein → Reaktion ausführen. Spell ready = Concentration nötig." },
  { t: "Search", typ: "Aktion", new: false, b: "WIS(Insight/Medicine/Perception/Survival)-Check, um etwas zu entdecken." },
  { t: "Study", typ: "Aktion", new: true, b: "🆕 PHB 2024: INT(Arcana/History/Investigation/Nature/Religion)-Check, um Wesen, Objekt oder Phänomen zu analysieren." },
  { t: "Utilize", typ: "Aktion", new: true, b: "🆕 PHB 2024: Nicht-magisches Objekt verwenden, das nicht klar zu einer anderen Aktion gehört (z.B. Trank schlucken, Schalter umlegen, Tür öffnen)." },

  // ─── Special Actions ───
  { t: "Grapple", typ: "Aktion", new: false, b: "Unarmed Strike Special: bei Treffer (STR-Athletik vs DEX-Save) → Target Grappled. Speed 0, bis Disengage-Check." },
  { t: "Shove", typ: "Aktion", new: false, b: "Unarmed Strike Special: bei Treffer (STR-Athletik vs DEX-Save) → Target 5ft schieben oder Prone." },

  // ─── Bonus Actions ───
  { t: "Off-Hand Attack", typ: "Bonus", new: false, b: "Nach Attack-Action mit Light Melee Weapon: zweiter Angriff mit anderer Light-Waffe. Kein Schadens-Mod (außer negativ)." },
  { t: "Bonus-Action Spell", typ: "Bonus", new: false, b: "Zauber mit Casting Time 1 Bonus Action. Dann darfst du auf gleicher Runde nur Cantrips (Action Casting Time) zaubern." },

  // ─── Reactions ───
  { t: "Opportunity Attack", typ: "Reaktion", new: false, b: "Feind verlässt deinen Nahkampfbereich (ohne Teleport/Disengage): 1 Nahkampfangriff." },
  { t: "Readied Action", typ: "Reaktion", new: false, b: "Trigger (durch Ready-Aktion definiert) tritt ein: vorbereitete Aktion/Bewegung ausführen." },
  { t: "Counterspell", typ: "Reaktion", new: false, b: "🔄 NEU 2024: Spell, gegen anderen Caster in 60ft. Target macht CON-Save vs deinem Spell-DC. Fehlschlag = Spell verfällt." },
];

// ─── Mastery Properties (PHB 2024 Chapter 6, p.213) ──────────────────────────
const MASTERIES = [
  { id: "cleave", name: "Cleave", icon: "🪓",
    b: "Bei Treffer mit Melee-Attack: Extra-Angriff gegen 2. Wesen in 5ft des ersten Ziels (gleiche Reach). Kein Schadens-Mod auf Extra-Angriff (außer negativ). Nur 1×/Zug.",
    bEN: "On hit with Melee Attack: Extra attack against a 2nd creature within 5 ft of the first target (same reach). No damage mod on extra attack (unless negative). Once per turn.",
    weapons: "Greataxe, Halberd" },
  { id: "graze", name: "Graze", icon: "💢",
    b: "Bei MISS mit Attack: Schaden = dein Ability-Mod (gleicher Schadens-Typ wie Waffe). Skaliert nur über Ability-Mod-Increase.",
    bEN: "On MISS with attack: damage = your ability modifier (same damage type as weapon). Scales only via ability mod increases.",
    weapons: "Glaive, Greatsword" },
  { id: "nick", name: "Nick", icon: "⚡",
    b: "Bei Nutzung der Light-Bonus-Action: kannst du den Extra-Angriff als TEIL der Attack-Aktion machen (statt Bonus Action). Nur 1×/Zug.",
    bEN: "When using the Light bonus-action: you may make the extra attack as PART of the Attack action (instead of Bonus Action). Once per turn.",
    weapons: "Dagger, Scimitar, Sickle, Light Hammer" },
  { id: "push", name: "Push", icon: "↗️",
    b: "Bei Treffer: Push das Wesen bis zu 10ft gerade weg von dir (Large oder kleiner).",
    bEN: "On hit: Push the creature up to 10 ft straight away from you (Large or smaller).",
    weapons: "Greatclub, Maul, Pike, Warhammer" },
  { id: "sap", name: "Sap", icon: "🌀",
    b: "Bei Treffer und Schaden: Target hat Nachteil auf nächsten Angriffsrolle bis Ende seines nächsten Zugs.",
    bEN: "On hit and damage: Target has Disadvantage on its next attack roll until the end of its next turn.",
    weapons: "Mace, Spear, Longsword (one-handed), Morningstar, Warpick" },
  { id: "slow", name: "Slow", icon: "🐌",
    b: "Bei Treffer und Schaden: Speed des Targets -10ft bis Anfang deines nächsten Zugs. Multiple Treffer stapeln NICHT.",
    bEN: "On hit and damage: Target's Speed −10 ft until the start of your next turn. Multiple hits do NOT stack.",
    weapons: "Club, Javelin, Light Crossbow, Longbow, Shortbow, Sling, Whip" },
  { id: "topple", name: "Topple", icon: "🤸",
    b: "Bei Treffer: Target macht CON-Save (DC = 8 + Ability-Mod + PB) oder ist Prone.",
    bEN: "On hit: Target makes a CON save (DC = 8 + Ability Mod + PB) or is Prone.",
    weapons: "Battleaxe, Flail, Quarterstaff, Trident, Lance" },
  { id: "vex", name: "Vex", icon: "👁️",
    b: "Bei Treffer und Schaden: Vorteil auf deinen nächsten Angriff gegen dasselbe Target (bis Ende deines nächsten Zugs).",
    bEN: "On hit and damage: Advantage on your next attack against the same target (until the end of your next turn).",
    weapons: "Handaxe, Dart, Rapier, Shortsword, Hand Crossbow, Heavy Crossbow, Musket, Pistol" },
];

// ─── Weapon Properties (PHB 2024, p.213) ─────────────────────────────────────
const WEAPON_PROPS = [
  { t: "Ammunition", b: "Range-Weapon braucht Ammo (Bow=Arrows, Crossbow=Bolts). Draw aus Quiver = frei. Halve Ammo recoverable nach Combat." },
  { t: "Finesse", b: "Wahl STR oder DEX für Attack + Damage. Beispiele: Rapier, Scimitar, Whip." },
  { t: "Heavy", b: "Small-Wesen haben Nachteil mit Heavy-Weapons. Beispiele: Greatsword, Greataxe, Longbow." },
  { t: "Light", b: "Bonus Action Off-Hand Attack möglich nach Main-Hand-Attack mit Light Weapon. Beispiele: Dagger, Shortsword." },
  { t: "Loading", b: "Nur 1 Schuss pro Action/Bonus/Reaction. Beispiele: Heavy Crossbow, Hand Crossbow." },
  { t: "Range", b: "Normalbereich / Maximum. Bei Maximum: Nachteil. Beyond: kein Schuss möglich. Beispiel: Longbow 150/600ft." },
  { t: "Reach", b: "+5ft Nahkampf-Reichweite. Beispiele: Glaive, Halberd, Whip." },
  { t: "Thrown", b: "Kann geworfen werden für Ranged Attack. Melee-Mod (STR/DEX wenn Finesse) gilt auch für Throw." },
  { t: "Two-Handed", b: "Erfordert zwei Hände beim Angriff. Beispiel: Greatsword." },
  { t: "Versatile", b: "Wahl: ein- oder zweihändig. Zweihändig erhöht Damage Die (z.B. Longsword 1d8/1d10)." },
];

const COL = { combat: C.amber, actions: C.red, movement: C.green, resting: C.purple, magic: C.purpleBright, checks: C.teal, mastery: C.amberBright, weapons: C.tealBright };
const ACTIONCOLS = { Aktion: C.red, Bonus: C.amber, Reaktion: C.blue };

// Box-Heading-Style: breitere Inter-Font statt schmaler Cinzel,
// damit Überschriften in dunklen Cards besser lesbar sind.
const boxHeadStyle = (col) => ({
  fontFamily: F, fontSize: 13, color: col || C.gold,
  fontWeight: 800, letterSpacing: 0.5, marginBottom: 6,
  textTransform: "uppercase",
});

const RuleCard = ({ title, body, col }) => (
  <div style={{ ...sx.card, borderLeft: `3px solid ${col || C.border}`, marginBottom: 0 }}>
    <div style={boxHeadStyle(col)}>{title}</div>
    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{body}</div>
  </div>
);

const DataTable = ({ title, headers, rows, col }) => (
  <div style={{ ...sx.card, borderLeft: `3px solid ${col}`, marginBottom: 0 }}>
    <div style={boxHeadStyle(col)}>{title}</div>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "3px 6px", color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>{row.map((cell, j) => <td key={j} style={{ padding: "3px 6px", color: C.textBright, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

export default function QuickRef() {
  const { t, lang } = useI18n();
  const [section, setSection] = useState("conditions");

  return (
    <div>
      {/* PHB 2024 Banner */}
      <div style={{
        background: `linear-gradient(90deg, ${C.amberBright}11 0%, transparent 100%)`,
        border: `1px solid ${C.amberBright}33`,
        borderLeft: `3px solid ${C.amberBright}`,
        borderRadius: 6, padding: "6px 10px", marginBottom: 10,
        fontSize: 10, color: C.amberBright, fontFamily: FH, letterSpacing: 0.5,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>📖</span>
        <span>{t("quickref.banner", "Schnellreferenz nach PHB 2024 · Zustände, Aktionen, Meisterschaft, Waffen-Eigenschaften, Regel-Glossar")}</span>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
        {SECTIONS.map(s => <button key={s.id} onClick={() => setSection(s.id)} style={sx.nb(section === s.id)}>{s.labelKey ? t(s.labelKey, s.label) : s.label}</button>)}
      </div>

      {/* CONDITIONS */}
      {section === "conditions" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
          {CONDITIONS.map(c => {
            const displayName = lang === "en" && c.nameEN ? c.nameEN : c.name;
            const displayDesc = lang === "en" && c.descEN ? c.descEN : c.desc;
            return <RuleCard key={c.id} title={`${c.icon} ${displayName}`} body={displayDesc} col={C.redBright} />;
          })}
        </div>
      )}

      {/* RULES sections (combat, movement, resting, magic, checks) */}
      {["combat", "movement", "resting", "magic", "checks"].includes(section) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
          {(RULES[section] || []).map((r, i) => <RuleCard key={i} title={r.t} body={r.b} col={COL[section]} />)}
        </div>
      )}

      {/* ACTIONS (PHB 2024) */}
      {section === "actions" && (
        <div>
          {["Aktion", "Bonus", "Reaktion"].map(typ => {
            const col = ACTIONCOLS[typ];
            const items = ACTIONS_2024.filter(a => a.typ === typ);
            const sectionLabel = typ === "Aktion"
              ? t("quickref.actions_section", "Aktionen")
              : typ === "Bonus"
                ? t("quickref.bonus_section", "Bonus-Aktionen")
                : t("quickref.reactions_section", "Reaktionen");
            return (
              <div key={typ} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: F, fontSize: 14, color: col, fontWeight: 800, letterSpacing: 0.5, marginBottom: 8, borderBottom: `1px solid ${col}30`, paddingBottom: 4, textTransform: "uppercase" }}>
                  {typ === "Aktion" ? "⚔️" : typ === "Bonus" ? "⚡" : "🛡️"} {sectionLabel} ({items.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 6 }}>
                  {items.map((a, i) => (
                    <div key={i} style={{
                      background: a.new ? `${C.amberBright}11` : `${col}0a`,
                      border: `1px solid ${a.new ? C.amberBright + '33' : col + '20'}`,
                      borderLeft: `3px solid ${col}`,
                      borderRadius: 8, padding: "8px 10px",
                    }}>
                      <div style={{ fontFamily: F, fontSize: 13, color: C.textBright, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                        {a.t}
                        {a.new && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: `${C.amberBright}22`, border: `1px solid ${C.amberBright}55`, color: C.amberBright, fontWeight: 700, letterSpacing: 0.3 }}>2024</span>}
                      </div>
                      <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{a.b}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MASTERY PROPERTIES (PHB 2024 NEU) */}
      {section === "mastery" && (
        <div>
          <div style={{
            background: `${C.amberBright}11`, border: `1px solid ${C.amberBright}33`,
            borderLeft: `3px solid ${C.amberBright}`, borderRadius: 6,
            padding: "8px 12px", marginBottom: 10, fontSize: 12, color: C.text, lineHeight: 1.5,
          }}>
            <b style={{ color: C.amberBright }}>🆕</b> {t("quickref.mastery_intro", "PHB 2024 Reform: Jede Waffe hat eine Meisterschafts-Eigenschaft.")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 8 }}>
            {MASTERIES.map(m => (
              <div key={m.id} style={{ ...sx.card, borderLeft: `3px solid ${C.amberBright}`, marginBottom: 0 }}>
                <div style={{ fontFamily: F, fontSize: 14, color: C.amberBright, fontWeight: 800, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{m.icon}</span> {m.name}
                </div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>{lang === "en" && m.bEN ? m.bEN : m.b}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", borderTop: `1px solid ${C.border}`, paddingTop: 5 }}>
                  <b style={{ color: C.amberBright }}>Waffen:</b> {m.weapons}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEAPON PROPERTIES */}
      {section === "weapons" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
          {WEAPON_PROPS.map((w, i) => <RuleCard key={i} title={w.t} body={w.b} col={C.tealBright} />)}
        </div>
      )}

      {/* TABLES */}
      {section === "tables" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          <DataTable title="Proficiency Bonus" headers={["Level", "PB"]} rows={[["1-4", "+2"], ["5-8", "+3"], ["9-12", "+4"], ["13-16", "+5"], ["17-20", "+6"]]} col={C.gold} />
          <DataTable title="DC Schwierigkeit" headers={["DC", "Stufe"]} rows={[["5", "Trivial"], ["10", "Einfach"], ["15", "Mittel"], ["20", "Schwer"], ["25", "Sehr schwer"], ["30", "Fast unmöglich"]]} col={C.amber} />
          <DataTable title="Cover (Deckung)" headers={["Typ", "AC + DEX-Save"]} rows={[["Halbe", "+2"], ["Dreiviertel", "+5"], ["Voll", "Nicht angreifbar"]]} col={C.teal} />
          <DataTable title="Critical Hits" headers={["Wurf", "Effekt"]} rows={[["Nat 20 Weapon", "Auto-Treffer + Krit (Schadens-Würfel ×2)"], ["Nat 20 Spell", "Auto-Treffer (Krit nur via Feature)"], ["Nat 1 Attack", "Auto-Miss"], ["Nat 20 Todeswurf", "Sofort 1 HP"], ["Nat 1 Todeswurf", "2 Fehlschläge"]]} col={C.red} />
          <DataTable title="Carrying Capacity" headers={["Wert", "Limit"]} rows={[["Push/Drag/Lift", "STR × 30 lb"], ["Carry", "STR × 15 lb"], ["Encumbered (variant)", "STR × 5 lb"]]} col={C.purple} />
          <DataTable title="Falling Damage" headers={["Höhe", "Schaden"]} rows={[["10 ft", "1d6"], ["20 ft", "2d6"], ["50 ft", "5d6"], ["100 ft", "10d6"], ["200+ ft", "20d6 (Max)"]]} col={C.redBright} />
          <DataTable title="XP-Schwellen (PHB 2024)" headers={["Level", "XP gesamt"]} rows={[
            ["1", "0"],
            ["2", "300"],
            ["3", "900"],
            ["4", "2.700"],
            ["5", "6.500"],
            ["6", "14.000"],
            ["7", "23.000"],
            ["8", "34.000"],
            ["9", "48.000"],
            ["10", "64.000"],
            ["11", "85.000"],
            ["12", "100.000"],
            ["13", "120.000"],
            ["14", "140.000"],
            ["15", "165.000"],
            ["16", "195.000"],
            ["17", "225.000"],
            ["18", "265.000"],
            ["19", "305.000"],
            ["20", "355.000"],
          ]} col={C.purple} />
          <DataTable title="Coin Values" headers={["Münze", "Wert"]} rows={[["1 PP", "10 GP"], ["1 GP", "10 SP"], ["1 EP", "5 SP"], ["1 SP", "10 CP"]]} col={C.gold} />
        </div>
      )}
    </div>
  );
}
