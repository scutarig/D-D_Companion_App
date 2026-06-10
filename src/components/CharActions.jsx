import { useState } from "react";
import { C, sx, FH, ABS } from "../constants/theme.js";

const TYPES = [
  { id: "action", label: "Aktion", icon: "⚔️", color: C.red },
  { id: "bonus", label: "Bonus-Aktion", icon: "⚡", color: C.amber },
  { id: "reaction", label: "Reaktion", icon: "🛡️", color: C.blue },
];

// ─── PHB 2024 Standard Actions (Chapter 1, p.15) ───────────────────────────
// Core-Aktionen für ALLE Charaktere (Klassenspezifische separat unten).
const STD_ACTIONS = [
  // ── Core Actions ───
  { type: "action", name: "Attack", range: "5ft / Range", toHit: "STR/DEX+PB", damage: "Waffe", description: "Nahkampf- oder Fernkampfangriff mit Waffe. Extra-Angriffe ab Lv5+ (Klassen-Feature)." },
  { type: "action", name: "Magic (Zaubern)", range: "Variabel", toHit: "", damage: "Zauber", description: "🆕 PHB 2024: Wirke Spell, nutze Magic Item oder magisches Klassenfeature. (Ehemals 'Cast a Spell')" },
  { type: "action", name: "Dash", range: "—", toHit: "", damage: "—", description: "Rest des Zuges: Extra-Bewegung = deine Speed." },
  { type: "action", name: "Disengage", range: "—", toHit: "", damage: "—", description: "Rest des Zuges: Bewegung provoziert keine Gelegenheitsangriffe (OAs)." },
  { type: "action", name: "Dodge", range: "—", toHit: "", damage: "—", description: "Bis nächster Zug: Angriffe gegen dich = Nachteil + DEX-Saves = Vorteil. Verloren bei Incapacitated/Speed 0." },
  { type: "action", name: "Help", range: "5ft", toHit: "", damage: "—", description: "Verbündeter erhält Vorteil auf nächste Probe ODER nächsten Angriff gegen Ziel in 5ft." },
  { type: "action", name: "Hide", range: "—", toHit: "DEX(Stealth)", damage: "—", description: "DEX(Stealth)-Check. Erfolg: du hast Invisible-Condition gegen Wesen, die dich nicht sehen — bis Angriff oder Sicht." },
  { type: "action", name: "Influence", range: "Variabel", toHit: "CHA-Check", damage: "—", description: "🆕 PHB 2024: CHA(Deception/Intimidation/Performance/Persuasion) oder WIS(Animal Handling)-Check, um NPC-Einstellung zu ändern (Friendly/Indifferent/Hostile)." },
  { type: "action", name: "Ready", range: "—", toHit: "", damage: "—", description: "Bereite Aktion oder Bewegung + Trigger vor. Auslöser → Reaktion. Spell-ready braucht Concentration." },
  { type: "action", name: "Search", range: "—", toHit: "WIS-Check", damage: "—", description: "WIS(Insight/Medicine/Perception/Survival)-Check, um etwas zu entdecken." },
  { type: "action", name: "Study", range: "—", toHit: "INT-Check", damage: "—", description: "🆕 PHB 2024: INT(Arcana/History/Investigation/Nature/Religion)-Check, um Wesen/Objekt/Phänomen zu analysieren." },
  { type: "action", name: "Utilize", range: "5ft", toHit: "", damage: "—", description: "🆕 PHB 2024: Nicht-magisches Objekt verwenden (Trank, Schalter, Tür, etc.) (Ehemals 'Use Object')." },

  // ── Special Actions (als Teil von Attack) ───
  { type: "action", name: "Grapple (Unarmed Strike)", range: "5ft", toHit: "STR-Athletik vs DEX-Save", damage: "—", description: "Unarmed Strike Special: bei Treffer → Target Grappled (Speed 0). Target kann mit Athletik/Akrobatik-Check entkommen." },
  { type: "action", name: "Shove (Unarmed Strike)", range: "5ft", toHit: "STR-Athletik vs DEX-Save", damage: "—", description: "Unarmed Strike Special: bei Treffer → Target 5ft schieben ODER Prone." },

  // ── Bonus Actions ───
  { type: "bonus", name: "Off-Hand Attack", range: "5ft", toHit: "STR/DEX", damage: "Light Weapon (kein Mod)", description: "Nach Attack-Action mit Light Weapon: zweiter Angriff mit anderer Light-Waffe. Kein Schadens-Mod (außer negativ)." },
  { type: "bonus", name: "Bonus-Action Spell", range: "Variabel", toHit: "", damage: "Zauber", description: "Spell mit Casting Time 1 Bonus Action. Dann auf gleicher Runde nur Cantrips (1-Action) wirkbar." },

  // ── Reactions ───
  { type: "reaction", name: "Opportunity Attack", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", description: "Feind verlässt deinen Nahkampfbereich (ohne Disengage/Teleport): 1 Nahkampfangriff." },
  { type: "reaction", name: "Readied Action", range: "—", toHit: "", damage: "—", description: "Trigger (durch Ready-Action) tritt ein: vorbereitete Aktion/Bewegung ausführen." },

  // ── Klassenspezifische (optional, je nach Klasse) ───
  { type: "bonus", name: "Second Wind (Kämpfer)", range: "Self", toHit: "", damage: "1d10+Fighter-Lv HP", description: "(Kämpfer Lv1) 1d10 + Kämpfer-Level HP heilen. 2/3/4 Nutzungen ab Lv1/5/10. Recharge: Kurze Rast." },
  { type: "bonus", name: "Cunning Action (Schurke)", range: "—", toHit: "", damage: "—", description: "(Schurke Lv2) Bonus-Action: Dash, Disengage oder Hide." },
  { type: "bonus", name: "Wild Shape (Druide)", range: "Self", toHit: "", damage: "—", description: "(Druide Lv2) In Beast-Form verwandeln. 2/3/4 Nutzungen je nach Level. Recharge: Kurze Rast." },
  { type: "bonus", name: "Rage (Barbar)", range: "Self", toHit: "", damage: "+Rage Damage", description: "(Barbar Lv1) Bonus-Action: Kampfrausch aktivieren. +Rage-Damage auf STR-Attacks, Resistance B/P/S, Vorteil STR-Checks/Saves." },
  { type: "reaction", name: "Shield (Zauber)", range: "Self", toHit: "", damage: "—", description: "(Slot 1) +5 AC bis Anfang nächster Zug. Auch gegen Magic Missile." },
  { type: "reaction", name: "Counterspell (2024)", range: "60ft", toHit: "CON-Save vs deinem DC", damage: "—", description: "🆕 PHB 2024: Target macht CON-Save (vs deinem Spell-DC). Fehlschlag = Spell verfällt. Erfolg = Spell wirkt normal." },
  { type: "reaction", name: "Sentinel (Feat)", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", description: "(Feat) Wenn Kreatur in Reichweite eine andere angreift: Reaktions-Angriff." },
];

// ── Core-Aktionen (für alle Klassen) — werden vom 'Alle hinzufügen'-Button gesetzt
const CORE_ACTION_NAMES = new Set([
  "Attack", "Magic (Zaubern)", "Dash", "Disengage", "Dodge", "Help", "Hide",
  "Influence", "Ready", "Search", "Study", "Utilize",
  "Grapple (Unarmed Strike)", "Shove (Unarmed Strike)",
  "Off-Hand Attack", "Bonus-Action Spell",
  "Opportunity Attack", "Readied Action",
]);

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
  const addStd = tmpl => { setActions(p => [...p, { ...tmpl, id: Date.now() + Math.random(), saveDC: "", saveAbility: "STR" }]); };

  // Bulk: Alle PHB-2024-Core-Aktionen hinzufügen (klassenspezifische ausgenommen)
  const addAllCore = () => {
    const existingNames = new Set(actions.map(a => a.name));
    const toAdd = STD_ACTIONS.filter(a => CORE_ACTION_NAMES.has(a.name) && !existingNames.has(a.name));
    if (toAdd.length === 0) return;
    setActions(p => [...p, ...toAdd.map((a, i) => ({ ...a, id: Date.now() + i, saveDC: "", saveAbility: "STR" }))]);
  };

  // Bulk: Aktuelle gefilterte Aktionen vom Standard-Picker hinzufügen
  const addAllOfType = () => {
    const existingNames = new Set(actions.filter(a => a.type === stdFilter).map(a => a.name));
    const toAdd = STD_ACTIONS.filter(a => a.type === stdFilter && !existingNames.has(a.name));
    if (toAdd.length === 0) return;
    setActions(p => [...p, ...toAdd.map((a, i) => ({ ...a, id: Date.now() + i, saveDC: "", saveAbility: "STR" }))]);
  };
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
        <div style={sx.ct}>📖 PHB 2024 Standard-Aktionen hinzufügen</div>

        {/* ── BULK-ADD-BUTTONS ──────────────────────────────────────── */}
        <div style={{
          background: `${C.greenBright}10`, border: `1px solid ${C.greenBright}40`,
          borderLeft: `3px solid ${C.greenBright}`, borderRadius: 8,
          padding: "10px 12px", marginBottom: 12,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontFamily: FH, fontSize: 12, color: C.greenBright, fontWeight: 700, marginBottom: 2 }}>⚡ Quick-Setup</div>
            <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4 }}>Lade alle PHB-2024 Core-Aktionen (Attack/Dash/Dodge/Help/Hide/Influence/Magic/Ready/Search/Study/Utilize + Grapple/Shove + Off-Hand + Bonus-Spell + OA + Ready-Reaction).</div>
          </div>
          <button onClick={addAllCore} style={{ ...sx.btn(C.greenBright), padding: "10px 16px", whiteSpace: "nowrap" }}>
            ⚡ Alle Core-Aktionen
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
          {TYPES.map(t => <button key={t.id} onClick={() => setStdFilter(t.id)} style={{ ...sx.bsm(t.color), background: stdFilter === t.id ? `${t.color}30` : `${t.color}10`, border: `1px solid ${t.color}44`, fontWeight: stdFilter === t.id ? 700 : 400 }}>{t.icon} {t.label}</button>)}
          <button onClick={addAllOfType} title={`Alle ${TYPES.find(t=>t.id===stdFilter)?.label}s der aktuellen Liste hinzufügen`} style={{
            ...sx.bsm(C.teal), background: `${C.teal}18`, border: `1px solid ${C.teal}55`,
            marginLeft: "auto", fontSize: 10, fontWeight: 700,
          }}>+ Alle dieser Sorte</button>
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
