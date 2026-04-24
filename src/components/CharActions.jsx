import { useState } from "react";
import { C, sx, FH, ABS } from "../constants/theme.js";

const TYPES = [
  { id: "action", label: "Aktion", icon: "⚔️", color: C.red },
  { id: "bonus", label: "Bonus-Aktion", icon: "⚡", color: C.amber },
  { id: "reaction", label: "Reaktion", icon: "🛡️", color: C.blue },
];

const STD_ACTIONS = [
  { type: "action", name: "Angriff", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", description: "Einen Nahkampf- oder Fernkampfangriff mit einer Waffe ausfuehren." },
  { type: "action", name: "Zaubern", range: "Variabel", toHit: "", damage: "Zauber", description: "Einen Zauber mit Casting Time 1 Aktion wirken." },
  { type: "action", name: "Rennen (Dash)", range: "—", toHit: "", damage: "—", description: "Geschwindigkeit verdoppeln bis Ende des Zuges." },
  { type: "action", name: "Ausweichen (Dodge)", range: "—", toHit: "", damage: "—", description: "Bis Beginn deines naechsten Zuges: Angriffe gegen dich haben Nachteil. DEX-Saves: Vorteil." },
  { type: "action", name: "Helfen (Help)", range: "5ft", toHit: "", damage: "—", description: "Einem Verbundeten helfen: Vorteil auf naechste Faehigkeitsprobe oder Angriff gegen eine Kreatur in 5ft." },
  { type: "action", name: "Verstecken (Hide)", range: "—", toHit: "", damage: "—", description: "Stealth-Check (gegen passive Perception der Feinde). Erfolg: du bist versteckt." },
  { type: "action", name: "Bereit machen (Ready)", range: "—", toHit: "", damage: "—", description: "Aktion fuer spaeter vorbereiten (Reaktion). Trigger festlegen, Aktion und Concentration-Check beachten." },
  { type: "action", name: "Suchen (Search)", range: "—", toHit: "", damage: "—", description: "Perception- oder Investigation-Check um etwas zu finden." },
  { type: "action", name: "Objekt benutzen", range: "5ft", toHit: "", damage: "—", description: "Einen magischen Gegenstand oder eine Falle/Tuer/Mechanismus benutzen." },
  { type: "action", name: "Greifen (Grapple)", range: "5ft", toHit: "STR(Athletics)", damage: "—", description: "Kreatur packen: Athletik-Check gegen Athletik/Akrobatik des Ziels. Erfolg: Kreatur Grappled (Speed 0)." },
  { type: "action", name: "Stossen (Shove)", range: "5ft", toHit: "STR(Athletics)", damage: "—", description: "Kreatur umwerfen (Prone) oder 5ft wegstossen: Athletik gegen Athletik/Akrobatik." },
  { type: "bonus", name: "Nebenhandangriff", range: "5ft", toHit: "STR/DEX", damage: "Nebenhand (kein Mod)", description: "Zwei-Waffen-Kampf: Wenn du mit leichter Waffe angegriffen hast, Nebenhandangriff ohne Schadens-Modifikator." },
  { type: "bonus", name: "Bonus-Zaubern", range: "Variabel", toHit: "", damage: "Zauber", description: "Einen Zauber mit Casting Time 1 Bonus-Aktion wirken. Du kannst in dieser Runde keinen anderen Zauber (ausser Cantrips) wirken." },
  { type: "bonus", name: "Zweiter Wind", range: "Self", toHit: "", damage: "1d10+Fighter-Lv", description: "(Kaempfer) 1× pro Kurze/Lange Rast: 1d10 + Fighter-Level HP heilen." },
  { type: "bonus", name: "Verschlauerter Angriff (Cunning)", range: "—", toHit: "", damage: "—", description: "(Schurke) Bonus-Aktion: Dash, Disengage oder Hide." },
  { type: "bonus", name: "Wildgestalt (Wild Shape)", range: "Self", toHit: "", damage: "—", description: "(Druide) In ein Tier verwandeln (CR-Grenze je nach Level). Bis Lange Rast: 2×." },
  { type: "bonus", name: "Kriegsschrei (Battle Cry)", range: "30ft", toHit: "", damage: "—", description: "(Barbar) Rage einleiten: +2 Schadens-Bonus, Resistance B/P/S, Vorteil STR-Checks+Saves." },
  { type: "reaction", name: "Gelegenheitsangriff", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", description: "Wenn eine Kreatur deinen Nahkampfbereich verlaesst (ohne Disengage): 1 Nahkampfangriff als Reaktion." },
  { type: "reaction", name: "Schild-Zauber (Shield)", range: "Self", toHit: "", damage: "—", description: "(Zauberer/Hexenmeister, Spell Slot 1) +5 AC bis Beginn deines naechsten Zuges. Auch gegen Magic Missile." },
  { type: "reaction", name: "Gegenzauber (Counterspell)", range: "60ft", toHit: "", damage: "—", description: "(Spell Slot 3+) Zauber Lv 3: automatisch. Lv 4+: Spellcasting-Check DC 10+Lv." },
  { type: "reaction", name: "Schutzzstil (Protection)", range: "5ft", toHit: "", damage: "—", description: "(Kaempfer, Protection-Stil, Schild) Angriff gegen benachbarte Kreatur: Angreifer hat Nachteil." },
  { type: "reaction", name: "Waechter-Angriff (Sentinel)", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", description: "(Feat) Wenn Kreatur in Reichweite eine andere angreift: Reaktions-Angriff." },
];

export default function CharActions({ char, setChar }) {
  const actions = char.actions || [];
  const setActions = fn => setChar(p => ({ ...p, actions: typeof fn === "function" ? fn(p.actions || []) : fn }));
  const [showForm, setShowForm] = useState(false);
  const [showStd, setShowStd] = useState(false);
  const [stdFilter, setStdFilter] = useState("action");
  const [editId, setEditId] = useState(null);
  const blank = { name: "", type: "action", description: "", toHit: "", damage: "", range: "", saveDC: "", saveAbility: "STR" };
  const [form, setForm] = useState(blank);
  const grouped = { action: actions.filter(a => a.type === "action"), bonus: actions.filter(a => a.type === "bonus"), reaction: actions.filter(a => a.type === "reaction") };

  const openNew = () => { setForm(blank); setEditId(null); setShowForm(true); setShowStd(false); };
  const openEdit = a => { setForm({ ...a }); setEditId(a.id); setShowForm(true); setShowStd(false); };
  const addStd = tmpl => { setActions(p => [...p, { ...tmpl, id: Date.now(), saveDC: "", saveAbility: "STR" }]); };
  const save = () => {
    if (!form.name) return;
    if (editId) setActions(p => p.map(a => a.id === editId ? { ...form, id: editId } : a));
    else setActions(p => [...p, { ...form, id: Date.now() }]);
    setShowForm(false); setEditId(null);
  };
  const del = id => setActions(p => p.filter(a => a.id !== id));

  return (
    <div>
      <div style={{ ...sx.jb, marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: C.textDim }}>
          Aktionen, Bonus-Aktionen und Reaktionen
          {(char.pinnedActionIds || []).length > 0 && <span style={{ ...sx.tag(C.amber), marginLeft: 8, fontSize: 10 }}>📌 {(char.pinnedActionIds || []).length} auf Übersicht</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setShowStd(!showStd); setShowForm(false); }} style={sx.btn(showStd ? C.amber : C.teal)}>📖 Standard D&D</button>
          <button onClick={openNew} style={sx.btn(C.purple)}>+ Eigene Aktion</button>
        </div>
      </div>

      {showStd && <div style={sx.card}>
        <div style={sx.ct}>📖 Standard D&D 5e Aktionen hinzufuegen</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {TYPES.map(t => <button key={t.id} onClick={() => setStdFilter(t.id)} style={{ ...sx.bsm(t.color), background: stdFilter === t.id ? `${t.color}30` : `${t.color}10`, border: `1px solid ${t.color}44`, fontWeight: stdFilter === t.id ? 700 : 400 }}>{t.icon} {t.label}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STD_ACTIONS.filter(a => a.type === stdFilter).map((a, i) => {
            const col = TYPES.find(t => t.id === a.type)?.color || C.red;
            const already = actions.some(x => x.name === a.name && x.type === a.type);
            return (
              <div key={i} style={{ background: `${col}08`, border: `1px solid ${col}20`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700, marginBottom: 3 }}>{a.name} {a.range && <span style={{ ...sx.tag(col), marginLeft: 6 }}>{a.range}</span>}</div>
                  {(a.toHit || a.damage) && <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{a.toHit && <span style={sx.tag(col)}>🎯 {a.toHit}</span>}{a.damage && a.damage !== "—" && <span style={sx.tag(col)}>💥 {a.damage}</span>}</div>}
                  <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{a.description}</div>
                </div>
                <button onClick={() => !already && addStd(a)} style={{ ...sx.btn(already ? C.textDim : col), opacity: already ? .5 : 1, flexShrink: 0, fontSize: 10, padding: "5px 10px" }}>
                  {already ? "✓ Drin" : "+ Hinzufuegen"}
                </button>
              </div>
            );
          })}
        </div>
      </div>}

      {showForm && <div style={sx.card}>
        <div style={sx.ct}>{editId ? "Aktion bearbeiten" : "Neue Aktion"}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setForm(p => ({ ...p, type: t.id }))} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer", border: `2px solid ${form.type === t.id ? t.color : C.border}`, background: form.type === t.id ? `${t.color}22` : "transparent", color: form.type === t.id ? t.color : C.textDim, fontFamily: FH, fontSize: 11, fontWeight: 700, transition: "all .15s" }}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div style={sx.g3}>
          <div style={{ gridColumn: "1/3" }}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={sx.inp} placeholder="z.B. Longsword-Angriff" /></div>
          <div><label style={sx.lbl}>Reichweite</label><input value={form.range} onChange={e => setForm(p => ({ ...p, range: e.target.value }))} style={sx.inp} placeholder="5ft" /></div>
          <div><label style={sx.lbl}>Treffer +</label><input value={form.toHit} onChange={e => setForm(p => ({ ...p, toHit: e.target.value }))} style={sx.inp} placeholder="+5" /></div>
          <div><label style={sx.lbl}>Schaden</label><input value={form.damage} onChange={e => setForm(p => ({ ...p, damage: e.target.value }))} style={sx.inp} placeholder="1d8+3" /></div>
          <div><label style={sx.lbl}>Save DC</label><input value={form.saveDC} onChange={e => setForm(p => ({ ...p, saveDC: e.target.value }))} style={sx.inp} placeholder="DC 14" /></div>
          <div><label style={sx.lbl}>Save Attribut</label><select value={form.saveAbility} onChange={e => setForm(p => ({ ...p, saveAbility: e.target.value }))} style={sx.sel}>{ABS.map(a => <option key={a}>{a}</option>)}</select></div>
        </div>
        <div style={{ marginTop: 10 }}><label style={sx.lbl}>Beschreibung</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...sx.ta, height: 72 }} placeholder="Effekt, Bedingungen, Sonderregeln..." /></div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={save} style={sx.btn(C.green)}>Speichern</button>
          <button onClick={() => setShowForm(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
        </div>
      </div>}

      {TYPES.map(({ id, label, icon, color }) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontFamily: FH, color, fontSize: 13, fontWeight: 700, letterSpacing: .5 }}>{label}</span>
            <span style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: "1px 10px", fontSize: 11, color, fontWeight: 700 }}>{grouped[id].length}</span>
          </div>
          {grouped[id].length === 0 ? (
            <div style={{ background: `${color}08`, border: `1px dashed ${color}30`, borderRadius: 10, padding: "10px 14px", color: C.textDim, fontSize: 12, fontStyle: "italic" }}>
              Keine {label}en. Nutze "Standard D&D" oder "+ Eigene Aktion".
            </div>
          ) : (
            grouped[id].map(action => (
              <div key={action.id} style={{ background: `${color}0c`, border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: "10px 14px", marginBottom: 6 }}>
                <div style={{ ...sx.jb, marginBottom: (action.toHit || action.damage || action.saveDC) ? 6 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700 }}>{action.name}</span>
                    {action.range && action.range !== "—" && <span style={sx.tag(color)}>{action.range}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => openEdit(action)} style={sx.bsm(C.gold)}>✎</button>
                    <button onClick={() => {
                      const pinned = char.pinnedActionIds || [];
                      const next = pinned.includes(action.id) ? pinned.filter(x => x !== action.id) : [...pinned, action.id];
                      setChar(p => ({ ...p, pinnedActionIds: next }));
                    }} title="Auf Übersicht anzeigen" style={{ ...sx.bsm((char.pinnedActionIds || []).includes(action.id) ? C.amber : C.textDim), fontWeight: (char.pinnedActionIds || []).includes(action.id) ? 700 : 400 }}>📌</button>
                    <button onClick={() => del(action.id)} style={sx.bsm(C.red)}>✕</button>
                  </div>
                </div>
                {(action.toHit || action.damage || action.saveDC) && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: action.description ? 5 : 0 }}>
                  {action.toHit && <span style={sx.tag(color)}>🎯 {action.toHit}</span>}
                  {action.damage && action.damage !== "—" && <span style={sx.tag(color)}>💥 {action.damage}</span>}
                  {action.saveDC && <span style={sx.tag(color)}>⚡ {action.saveDC} {action.saveAbility}</span>}
                </div>}
                {action.description && <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{action.description}</div>}
              </div>
            ))
          )}
        </div>
      ))}
      {actions.length === 0 && !showForm && !showStd && (
        <div style={{ ...sx.card, textAlign: "center", color: C.textDim, padding: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚔️</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Aktionen angelegt</div>
          <div style={{ fontSize: 12 }}>Nutze "Standard D&D" fuer vorgefertigte Regelwerk-Aktionen oder erstelle eigene.</div>
        </div>
      )}
    </div>
  );
}
