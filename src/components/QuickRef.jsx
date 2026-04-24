import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { CONDITIONS } from "../data/conditions.js";

const SECTIONS = [{ id: "conditions", label: "⚡ Zustände" }, { id: "combat", label: "⚔️ Kampf" }, { id: "actions", label: "🎯 Aktionen" }, { id: "movement", label: "💨 Bewegung" }, { id: "resting", label: "🌙 Rasten" }, { id: "magic", label: "🔮 Magie" }, { id: "checks", label: "🎲 Checks" }, { id: "tables", label: "📊 Tabellen" }];

const RULES = {
  combat: [
    { t: "Initiative", b: "1d20+DEX-Mod. Höchste geht zuerst." },
    { t: "Angriff & Treffer", b: "1d20+Angriffs-Bonus vs AC. Nat20=Krit (Würfel×2). Nat1=Fehlschlag. Vorteil=2d20 höchsten, Nachteil=niedrigsten." },
    { t: "Trefferpunkte & Tod", b: "Bei 0 HP: bewusstlos. Todeswürfe: 3× Erfolg (≥10)=stabil, 3× Fehlschlag=tod. Nat20=1HP sofort. Nat1=2 Fehlschläge." },
    { t: "Deckung", b: "Halbe: +2 AC/DEX-Saves. Dreiviertel: +5 AC/DEX-Saves. Voll: nicht direkt angreifbar." },
    { t: "Konzentration", b: "Max 1 Konz.-Zauber. Schaden: CON-Save DC max(10, halber Schaden). Fehlschlag=Ende." },
    { t: "Gelegenheitsangriff", b: "Kreatur verlässt Nahkampfbereich ohne Disengage: 1 Nahkampfangriff als Reaktion." },
    { t: "Fernkampf in Nahkampf", b: "Fernkampfangriffe in 5ft: Nachteil." },
    { t: "Unsichtbarkeit", b: "Angriffe gegen unsichtbare: Nachteil. Von unsichtbarer: Vorteil." },
  ],
  actions: [
    { t: "Angriff", typ: "Aktion", b: "1+ Nahkampf/Fernkampfangriff (Extra-Angriffe bei höherem Level)." },
    { t: "Zaubern", typ: "Aktion", b: "Zauber mit Casting Time 1 Aktion. Wenn Bonus-Aktion-Zauber: nur Cantrips als Aktion." },
    { t: "Dash", typ: "Aktion", b: "Bewegungsreichweite verdoppeln bis Ende des Zuges." },
    { t: "Ausweichen", typ: "Aktion", b: "Angriffe gegen dich: Nachteil. DEX-Saves: Vorteil. Bis nächster Zug." },
    { t: "Helfen", typ: "Aktion", b: "Verbündeter: Vorteil auf nächsten Angriff/Check gegen Ziel in 5ft." },
    { t: "Verstecken", typ: "Aktion", b: "Verbergen-Check vs passive Wahrnehmung. Nur wenn unbeobachtet." },
    { t: "Bereit machen", typ: "Aktion", b: "Trigger+Reaktion planen. Zauber mit Konzentration." },
    { t: "Greifen", typ: "Aktion", b: "Athletik vs Athletik/Akrobatik. Erfolg: Grappled (Speed 0)." },
    { t: "Umwerfen", typ: "Aktion", b: "Athletik vs Athletik/Akrobatik. Erfolg: Prone oder 5ft weg." },
    { t: "Nebenhandangriff", typ: "Bonus", b: "Nach Angriff mit leichter Waffe: leichte Nebenhandwaffe. Kein Schadens-Mod." },
    { t: "Bonus-Zaubern", typ: "Bonus", b: "Zauber mit Casting Time Bonus-Aktion. Dann nur Cantrips als Hauptaktion." },
    { t: "Gelegenheitsangriff", typ: "Reaktion", b: "Kreatur verlässt Nahkampfbereich ohne Disengage: 1 Nahkampfangriff." },
  ],
  movement: [
    { t: "Grundbewegung", b: "Volle Bewegung pro Runde (meist 30ft). Teilbar vor/nach Aktionen. Schwieriges Gelände: 2× Kosten." },
    { t: "Stehen nach Prone", b: "Kostet halbe Bewegung." },
    { t: "Klettern/Schwimmen", b: "2× Bewegungskosten. Klettern: Athletik-Check wenn schwierig." },
    { t: "Springen", b: "Weitsprung: STR-Score ft (mit Anlauf). Hochsprung: 3+STR-Mod ft." },
    { t: "Fallen", b: "Fallschaden: 1d6/10ft (max 20d6). Landen=Prone." },
    { t: "Disengage", b: "Aktion: keine Gelegenheitsangriffe bis Zugende. Schurke: Bonus-Aktion." },
  ],
  resting: [
    { t: "Kurze Rast (1h)", b: "Hit Dice ausgeben: würfle HD+CON-Mod pro HD. Kurz-Rast-Fähigkeiten nachladen." },
    { t: "Lange Rast (8h)", b: "Volle HP. Alle Spell Slots zurück. HD bis Hälfte Level regeneriert. Nur 1×/24h." },
    { t: "Erschöpfung", b: "1:Nachteil Checks. 2:Speed÷2. 3:Nachteil Angriffe+Saves. 4:MaxHP÷2. 5:Speed=0. 6:Tod." },
  ],
  magic: [
    { t: "Spell-Save DC", b: "8 + PB + Spellcasting-Mod. Angriffs-Bonus: PB + Spellcasting-Mod." },
    { t: "Spell Slots", b: "Ressource für Zauber. Cantrips kostenlos. Höherer Slot = stärker." },
    { t: "Ritual-Zaubern", b: "Ritual-Tag: +10 Min. aber kein Slot-Verbrauch. Kleriker/Druide/Barde: alle bekannten Rituale." },
    { t: "Counterspell", b: "Reaktion in 60ft. Grad≤3: auto. Grad4+: Spellcasting-Check DC 10+Grad." },
    { t: "Dispel Magic", b: "Grad3-Slot: alle Zauber ≤3 enden. Höherer Slot: Ability-Check DC 10+Grad." },
  ],
  checks: [
    { t: "Fähigkeitsprobe", b: "1d20+Mod (+PB bei Proficiency). DC: 5=trivial, 10=einfach, 15=mittel, 20=schwer, 25=sehr schwer." },
    { t: "Passive Checks", b: "10+Mod(+PB). Vorteil:+5. Nachteil:-5." },
    { t: "Vorteil/Nachteil", b: "Vorteil: 2d20 höchsten. Nachteil: niedrigsten. Mehrfach: kein Stacken. Beides=normal." },
    { t: "Rettungswürfe", b: "1d20+Mod(+PB). Gegen DC des Effekts. Erfolg: kein/halber Effekt." },
  ],
};

const COL = { combat: C.amber, actions: C.red, movement: C.green, resting: C.purple, magic: C.purpleBright, checks: C.teal };
const ACTIONCOLS = { Aktion: C.red, Bonus: C.amber, Reaktion: C.blue };

const RuleCard = ({ title, body, col }) => (
  <div style={{ ...sx.card, borderLeft: `3px solid ${col || C.border}`, marginBottom: 0 }}>
    <div style={{ fontFamily: FH, fontSize: 12, color: col || C.gold, fontWeight: 700, marginBottom: 5 }}>{title}</div>
    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{body}</div>
  </div>
);

const DataTable = ({ title, headers, rows, col }) => (
  <div style={{ ...sx.card, borderLeft: `3px solid ${col}`, marginBottom: 0 }}>
    <div style={{ fontFamily: FH, fontSize: 12, color: col, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "3px 6px", color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>{row.map((cell, j) => <td key={j} style={{ padding: "3px 6px", color: C.textBright, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

export default function QuickRef() {
  const [section, setSection] = useState("conditions");

  return (
    <div>
      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
        {SECTIONS.map(s => <button key={s.id} onClick={() => setSection(s.id)} style={sx.nb(section === s.id)}>{s.label}</button>)}
      </div>

      {section === "conditions" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
        {CONDITIONS.map(c => <RuleCard key={c.id} title={`${c.icon} ${c.name}`} body={c.desc} col={C.redBright} />)}
      </div>}

      {["combat", "movement", "resting", "magic", "checks"].includes(section) && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
        {(RULES[section] || []).map((r, i) => <RuleCard key={i} title={r.t} body={r.b} col={COL[section]} />)}
      </div>}

      {section === "actions" && <div>
        {["Aktion", "Bonus", "Reaktion"].map(typ => {
          const col = ACTIONCOLS[typ];
          const items = RULES.actions.filter(a => a.typ === typ);
          return (
            <div key={typ} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: FH, fontSize: 13, color: col, fontWeight: 700, marginBottom: 8, borderBottom: `1px solid ${col}30`, paddingBottom: 4 }}>{typ === "Aktion" ? "⚔️" : typ === "Bonus" ? "⚡" : "🛡️"} {typ} ({items.length})</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 6 }}>
                {items.map((a, i) => (
                  <div key={i} style={{ background: `${col}0a`, border: `1px solid ${col}20`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700, marginBottom: 3 }}>{a.t}</div>
                    <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{a.b}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>}

      {section === "tables" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
        <DataTable title="Proficiency Bonus" headers={["Level", "PB"]} rows={[["1-4", "+2"], ["5-8", "+3"], ["9-12", "+4"], ["13-16", "+5"], ["17-20", "+6"]]} col={C.gold} />
        <DataTable title="Difficulty Class" headers={["DC", "Schwierigkeit"]} rows={[["5", "Trivial"], ["10", "Einfach"], ["15", "Mittel"], ["20", "Schwer"], ["25", "Sehr schwer"], ["30", "Nahezu unmöglich"]]} col={C.amber} />
        <DataTable title="Kritische Würfe" headers={["Wurf", "Effekt"]} rows={[["Nat 20 Angriff", "Auto-Treffer + Krit (Würfel×2)"], ["Nat 1 Angriff", "Auto-Fehlschlag"], ["Nat 20 Todeswurf", "Sofort 1 HP"], ["Nat 1 Todeswurf", "2 Fehlschläge"]]} col={C.red} />
        <DataTable title="XP zum nächsten Level" headers={["Level", "XP"]} rows={[["1", "300"], ["2", "600"], ["3", "1.800"], ["4", "3.800"], ["5", "7.500"], ["6", "9.000"], ["7", "11.000"], ["8", "14.000"], ["9", "16.000"], ["10", "21.000"]]} col={C.purple} />
      </div>}
    </div>
  );
}
