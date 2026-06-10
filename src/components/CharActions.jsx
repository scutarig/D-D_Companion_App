import { useState } from "react";
import { C, sx, FH, ABS } from "../constants/theme.js";
import { useI18n } from "../i18n/index.js";

const TYPES = [
  { id: "action", labelDE: "Aktion", labelEN: "Action", icon: "⚔️", color: C.red },
  { id: "bonus", labelDE: "Bonus-Aktion", labelEN: "Bonus Action", icon: "⚡", color: C.amber },
  { id: "reaction", labelDE: "Reaktion", labelEN: "Reaction", icon: "🛡️", color: C.blue },
];

// ─── PHB 2024 Standard Actions (Chapter 1, p.15) ───────────────────────────
// Core-Aktionen für ALLE Charaktere (Klassenspezifische separat unten).
// Jeder Eintrag hat description (DE) + descriptionEN für lang-Toggle.
const STD_ACTIONS = [
  // ── Core Actions ───
  { type: "action", name: "Attack", range: "5ft / Range", toHit: "STR/DEX+PB", damage: "Waffe", damageEN: "Weapon",
    description: "Nahkampf- oder Fernkampfangriff mit Waffe. Extra-Angriffe ab Lv5+ (Klassen-Feature).",
    descriptionEN: "Melee or Ranged Attack with a weapon. Extra Attacks from Lv5+ (class feature)." },
  { type: "action", name: "Magic (Cast a Spell)", range: "Variable", rangeEN: "Variable", toHit: "", damage: "Zauber", damageEN: "Spell",
    description: "🆕 PHB 2024: Wirke Spell, nutze Magic Item oder magisches Klassenfeature. (Ehemals 'Cast a Spell')",
    descriptionEN: "🆕 PHB 2024: Cast a spell, use a Magic Item, or use a magical class feature. (Formerly 'Cast a Spell')" },
  { type: "action", name: "Dash", range: "—", toHit: "", damage: "—",
    description: "Rest des Zuges: Extra-Bewegung = deine Speed.",
    descriptionEN: "For the rest of your turn: extra movement equal to your Speed." },
  { type: "action", name: "Disengage", range: "—", toHit: "", damage: "—",
    description: "Rest des Zuges: Bewegung provoziert keine Gelegenheitsangriffe (OAs).",
    descriptionEN: "For the rest of your turn: your movement doesn't provoke Opportunity Attacks." },
  { type: "action", name: "Dodge", range: "—", toHit: "", damage: "—",
    description: "Bis nächster Zug: Angriffe gegen dich = Nachteil + DEX-Saves = Vorteil. Verloren bei Incapacitated/Speed 0.",
    descriptionEN: "Until your next turn: attacks against you have Disadvantage + DEX Saves have Advantage. Lost if Incapacitated or Speed 0." },
  { type: "action", name: "Help", range: "5ft", toHit: "", damage: "—",
    description: "Verbündeter erhält Vorteil auf nächste Probe ODER nächsten Angriff gegen Ziel in 5ft.",
    descriptionEN: "An ally gains Advantage on their next ability check OR next attack roll against a target within 5 ft." },
  { type: "action", name: "Hide", range: "—", toHit: "DEX(Stealth)", damage: "—",
    description: "DEX(Stealth)-Check. Erfolg: du hast Invisible-Condition gegen Wesen, die dich nicht sehen — bis Angriff oder Sicht.",
    descriptionEN: "DEX(Stealth) check. On success: you have the Invisible condition against creatures that can't see you — until you attack or are seen." },
  { type: "action", name: "Influence", range: "Variable", rangeEN: "Variable", toHit: "CHA-Check", damage: "—",
    description: "🆕 PHB 2024: CHA(Deception/Intimidation/Performance/Persuasion) oder WIS(Animal Handling)-Check, um NPC-Einstellung zu ändern (Friendly/Indifferent/Hostile).",
    descriptionEN: "🆕 PHB 2024: CHA(Deception/Intimidation/Performance/Persuasion) or WIS(Animal Handling) check to alter a creature's attitude (Friendly/Indifferent/Hostile)." },
  { type: "action", name: "Ready", range: "—", toHit: "", damage: "—",
    description: "Bereite Aktion oder Bewegung + Trigger vor. Auslöser → Reaktion. Spell-ready braucht Concentration.",
    descriptionEN: "Prepare an Action or movement with a trigger. When triggered → Reaction. Ready spell requires Concentration." },
  { type: "action", name: "Search", range: "—", toHit: "WIS-Check", damage: "—",
    description: "WIS(Insight/Medicine/Perception/Survival)-Check, um etwas zu entdecken.",
    descriptionEN: "WIS(Insight/Medicine/Perception/Survival) check to discover something." },
  { type: "action", name: "Study", range: "—", toHit: "INT-Check", damage: "—",
    description: "🆕 PHB 2024: INT(Arcana/History/Investigation/Nature/Religion)-Check, um Wesen/Objekt/Phänomen zu analysieren.",
    descriptionEN: "🆕 PHB 2024: INT(Arcana/History/Investigation/Nature/Religion) check to analyze a creature, object, or phenomenon." },
  { type: "action", name: "Utilize", range: "5ft", toHit: "", damage: "—",
    description: "🆕 PHB 2024: Nicht-magisches Objekt verwenden (Trank, Schalter, Tür, etc.) (Ehemals 'Use Object').",
    descriptionEN: "🆕 PHB 2024: Use a nonmagical object (potion, lever, door, etc.) (Formerly 'Use an Object')." },

  // ── Special Actions (als Teil von Attack) ───
  { type: "action", name: "Grapple (Unarmed Strike)", range: "5ft", toHit: "STR-Athletics vs DEX-Save", damage: "—",
    description: "Unarmed Strike Special: bei Treffer → Target Grappled (Speed 0). Target kann mit Athletik/Akrobatik-Check entkommen.",
    descriptionEN: "Unarmed Strike Special: on hit → target is Grappled (Speed 0). Target can escape with Athletics/Acrobatics check." },
  { type: "action", name: "Shove (Unarmed Strike)", range: "5ft", toHit: "STR-Athletics vs DEX-Save", damage: "—",
    description: "Unarmed Strike Special: bei Treffer → Target 5ft schieben ODER Prone.",
    descriptionEN: "Unarmed Strike Special: on hit → push target 5 ft OR make them Prone." },

  // ── Bonus Actions ───
  { type: "bonus", name: "Off-Hand Attack", range: "5ft", toHit: "STR/DEX", damage: "Light Weapon (kein Mod)", damageEN: "Light Weapon (no Mod)",
    description: "Nach Attack-Action mit Light Weapon: zweiter Angriff mit anderer Light-Waffe. Kein Schadens-Mod (außer negativ).",
    descriptionEN: "After Attack action with Light weapon: second attack with another Light weapon. No damage modifier (unless negative)." },
  { type: "bonus", name: "Bonus-Action Spell", range: "Variable", rangeEN: "Variable", toHit: "", damage: "Zauber", damageEN: "Spell",
    description: "Spell mit Casting Time 1 Bonus Action. Dann auf gleicher Runde nur Cantrips (1-Action) wirkbar.",
    descriptionEN: "Spell with Casting Time 1 Bonus Action. Same turn you can only cast cantrips (1-Action) with your Action." },

  // ── Reactions ───
  { type: "reaction", name: "Opportunity Attack", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", damageEN: "Weapon",
    description: "Feind verlässt deinen Nahkampfbereich (ohne Disengage/Teleport): 1 Nahkampfangriff.",
    descriptionEN: "Enemy leaves your reach (without Disengage/teleport): 1 Melee Attack." },
  { type: "reaction", name: "Readied Action", range: "—", toHit: "", damage: "—",
    description: "Trigger (durch Ready-Action) tritt ein: vorbereitete Aktion/Bewegung ausführen.",
    descriptionEN: "Trigger (from Ready action) occurs: execute the prepared action/movement." },

  // ── Klassenspezifische (optional, je nach Klasse) ───
  { type: "bonus", name: "Second Wind (Fighter)", range: "Self", toHit: "", damage: "1d10+Fighter Lv HP",
    description: "(Kämpfer Lv1) 1d10 + Kämpfer-Level HP heilen. 2/3/4 Nutzungen ab Lv1/5/10. Recharge: Kurze Rast.",
    descriptionEN: "(Fighter Lv1) Heal 1d10 + Fighter level HP. 2/3/4 uses from Lv1/5/10. Recharges on Short Rest." },
  { type: "bonus", name: "Cunning Action (Rogue)", range: "—", toHit: "", damage: "—",
    description: "(Schurke Lv2) Bonus-Action: Dash, Disengage oder Hide.",
    descriptionEN: "(Rogue Lv2) Bonus Action: Dash, Disengage or Hide." },
  { type: "bonus", name: "Wild Shape (Druid)", range: "Self", toHit: "", damage: "—",
    description: "(Druide Lv2) In Beast-Form verwandeln. 2/3/4 Nutzungen je nach Level. Recharge: Kurze Rast.",
    descriptionEN: "(Druid Lv2) Transform into a Beast form. 2/3/4 uses by level. Recharges on Short Rest." },
  { type: "bonus", name: "Rage (Barbarian)", range: "Self", toHit: "", damage: "+Rage Damage",
    description: "(Barbar Lv1) Bonus-Action: Kampfrausch aktivieren. +Rage-Damage auf STR-Attacks, Resistance B/P/S, Vorteil STR-Checks/Saves.",
    descriptionEN: "(Barbarian Lv1) Bonus Action: enter Rage. +Rage Damage on STR attacks, Resistance to B/P/S, Advantage on STR checks/saves." },
  { type: "reaction", name: "Shield (Spell)", range: "Self", toHit: "", damage: "—",
    description: "(Slot 1) +5 AC bis Anfang nächster Zug. Auch gegen Magic Missile.",
    descriptionEN: "(Slot 1) +5 AC until start of your next turn. Also negates Magic Missile." },
  { type: "reaction", name: "Counterspell (2024)", range: "60ft", toHit: "CON-Save vs your DC", damage: "—",
    description: "🆕 PHB 2024: Target macht CON-Save (vs deinem Spell-DC). Fehlschlag = Spell verfällt. Erfolg = Spell wirkt normal.",
    descriptionEN: "🆕 PHB 2024: Target makes a CON Save (vs your Spell DC). Failure = spell fizzles. Success = spell works normally." },
  { type: "reaction", name: "Sentinel (Feat)", range: "5ft", toHit: "STR/DEX+PB", damage: "Waffe", damageEN: "Weapon",
    description: "(Feat) Wenn Kreatur in Reichweite eine andere angreift: Reaktions-Angriff.",
    descriptionEN: "(Feat) When a creature within reach attacks someone else: Reaction Attack." },
];

// ── Core-Aktionen (für alle Klassen) — werden vom 'Alle hinzufügen'-Button gesetzt
const CORE_ACTION_NAMES = new Set([
  "Attack", "Magic (Cast a Spell)", "Dash", "Disengage", "Dodge", "Help", "Hide",
  "Influence", "Ready", "Search", "Study", "Utilize",
  "Grapple (Unarmed Strike)", "Shove (Unarmed Strike)",
  "Off-Hand Attack", "Bonus-Action Spell",
  "Opportunity Attack", "Readied Action",
]);

export default function CharActions({ char, setChar }) {
  const { t, lang } = useI18n();
  const isEN = lang === "en";
  const pickDesc = (a) => (isEN && a.descriptionEN) ? a.descriptionEN : a.description;
  const pickRange = (a) => (isEN && a.rangeEN) ? a.rangeEN : a.range;
  const pickDamage = (a) => (isEN && a.damageEN) ? a.damageEN : a.damage;
  const pickTypeLabel = (typeId) => {
    const td = TYPES.find(x => x.id === typeId);
    if (!td) return typeId;
    return isEN ? td.labelEN : td.labelDE;
  };

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
    setActions(p => [...p, ...toAdd.map(a => ({ ...a, id: Date.now() + Math.random(), saveDC: "", saveAbility: "STR" }))]);
  };

  // Bulk: Aktuelle gefilterte Aktionen vom Standard-Picker hinzufügen
  const addAllOfType = () => {
    const existingNames = new Set(actions.filter(a => a.type === stdFilter).map(a => a.name));
    const toAdd = STD_ACTIONS.filter(a => a.type === stdFilter && !existingNames.has(a.name));
    if (toAdd.length === 0) return;
    setActions(p => [...p, ...toAdd.map(a => ({ ...a, id: Date.now() + Math.random(), saveDC: "", saveAbility: "STR" }))]);
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
          {t("actions.header","Aktionen, Bonus-Aktionen und Reaktionen")}
          {(char.pinnedActionIds || []).length > 0 && <span style={{ ...sx.tag(C.amber), marginLeft: 8, fontSize: 10 }}>📌 {(char.pinnedActionIds || []).length} {t("actions.pinned","auf Übersicht")}</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setShowStd(!showStd); setShowForm(false); }} style={sx.btn(showStd ? C.amber : C.teal)}>📖 {t("actions.std_dnd","Standard D&D")}</button>
          <button onClick={openNew} style={sx.btn(C.purple)}>+ {t("actions.custom","Eigene Aktion")}</button>
        </div>
      </div>

      {showStd && <div style={sx.card}>
        <div style={sx.ct}>📖 {t("actions.std_title","PHB 2024 Standard-Aktionen hinzufügen")}</div>

        {/* ── BULK-ADD-BUTTONS ──────────────────────────────────────── */}
        <div style={{
          background: `${C.greenBright}10`, border: `1px solid ${C.greenBright}40`,
          borderLeft: `3px solid ${C.greenBright}`, borderRadius: 8,
          padding: "10px 12px", marginBottom: 12,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontFamily: FH, fontSize: 12, color: C.greenBright, fontWeight: 700, marginBottom: 2 }}>⚡ {t("actions.quick_setup","Quick-Setup")}</div>
            <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4 }}>{t("actions.quick_desc","Lade alle PHB-2024 Core-Aktionen (Attack/Dash/Dodge/Help/Hide/Influence/Magic/Ready/Search/Study/Utilize + Grapple/Shove + Off-Hand + Bonus-Spell + OA + Ready-Reaction).")}</div>
          </div>
          <button onClick={addAllCore} style={{ ...sx.btn(C.greenBright), padding: "10px 16px", whiteSpace: "nowrap" }}>
            ⚡ {t("actions.bulk_all_core","Alle Core-Aktionen")}
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
          {TYPES.map(td => <button key={td.id} onClick={() => setStdFilter(td.id)} style={{ ...sx.bsm(td.color), background: stdFilter === td.id ? `${td.color}30` : `${td.color}10`, border: `1px solid ${td.color}44`, fontWeight: stdFilter === td.id ? 700 : 400 }}>{td.icon} {pickTypeLabel(td.id)}</button>)}
          <button onClick={addAllOfType} title={t("actions.bulk_of_type","Alle {type} der aktuellen Liste hinzufügen").replace("{type}", pickTypeLabel(stdFilter))} style={{
            ...sx.bsm(C.teal), background: `${C.teal}18`, border: `1px solid ${C.teal}55`,
            marginLeft: "auto", fontSize: 10, fontWeight: 700,
          }}>+ {t("actions.bulk_of_type_btn","Alle dieser Sorte")}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STD_ACTIONS.filter(a => a.type === stdFilter).map((a, i) => {
            const col = TYPES.find(td => td.id === a.type)?.color || C.red;
            const already = actions.some(x => x.name === a.name && x.type === a.type);
            return (
              <div key={i} style={{ background: `${col}08`, border: `1px solid ${col}20`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700, marginBottom: 3 }}>{a.name} {pickRange(a) && <span style={{ ...sx.tag(col), marginLeft: 6 }}>{pickRange(a)}</span>}</div>
                  {(a.toHit || pickDamage(a)) && <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{a.toHit && <span style={sx.tag(col)}>🎯 {a.toHit}</span>}{pickDamage(a) && pickDamage(a) !== "—" && <span style={sx.tag(col)}>💥 {pickDamage(a)}</span>}</div>}
                  <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{pickDesc(a)}</div>
                </div>
                <button onClick={() => !already && addStd(a)} style={{ ...sx.btn(already ? C.textDim : col), opacity: already ? .5 : 1, flexShrink: 0, fontSize: 10, padding: "5px 10px" }}>
                  {already ? `✓ ${t("actions.already_added","Drin")}` : `+ ${t("actions.add","Hinzufügen")}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>}

      {showForm && <div style={sx.card}>
        <div style={sx.ct}>{editId ? t("actions.edit_title","Aktion bearbeiten") : t("actions.new_title","Neue Aktion")}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {TYPES.map(td => (
            <button key={td.id} onClick={() => setForm(p => ({ ...p, type: td.id }))} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer", border: `2px solid ${form.type === td.id ? td.color : C.border}`, background: form.type === td.id ? `${td.color}22` : "transparent", color: form.type === td.id ? td.color : C.textDim, fontFamily: FH, fontSize: 11, fontWeight: 700, transition: "all .15s" }}>{td.icon} {pickTypeLabel(td.id)}</button>
          ))}
        </div>
        <div style={sx.g3}>
          <div style={{ gridColumn: "1/3" }}><label style={sx.lbl}>{t("actions.field_name","Name")}</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={sx.inp} placeholder={t("actions.ph_name","z.B. Longsword-Angriff")} /></div>
          <div><label style={sx.lbl}>{t("actions.field_range","Reichweite")}</label><input value={form.range} onChange={e => setForm(p => ({ ...p, range: e.target.value }))} style={sx.inp} placeholder="5ft" /></div>
          <div><label style={sx.lbl}>{t("actions.field_tohit","Treffer +")}</label><input value={form.toHit} onChange={e => setForm(p => ({ ...p, toHit: e.target.value }))} style={sx.inp} placeholder="+5" /></div>
          <div><label style={sx.lbl}>{t("actions.field_damage","Schaden")}</label><input value={form.damage} onChange={e => setForm(p => ({ ...p, damage: e.target.value }))} style={sx.inp} placeholder="1d8+3" /></div>
          <div><label style={sx.lbl}>{t("actions.field_savedc","Save DC")}</label><input value={form.saveDC} onChange={e => setForm(p => ({ ...p, saveDC: e.target.value }))} style={sx.inp} placeholder="DC 14" /></div>
          <div><label style={sx.lbl}>{t("actions.field_saveab","Save Attribut")}</label><select value={form.saveAbility} onChange={e => setForm(p => ({ ...p, saveAbility: e.target.value }))} style={sx.sel}>{ABS.map(a => <option key={a}>{a}</option>)}</select></div>
        </div>
        <div style={{ marginTop: 10 }}><label style={sx.lbl}>{t("actions.field_desc","Beschreibung")}</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...sx.ta, height: 72 }} placeholder={t("actions.ph_desc","Effekt, Bedingungen, Sonderregeln...")} /></div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={save} style={sx.btn(C.green)}>{t("action.save","Speichern")}</button>
          <button onClick={() => setShowForm(false)} style={sx.btn(C.textDim)}>{t("action.cancel","Abbrechen")}</button>
        </div>
      </div>}

      {TYPES.map(({ id, icon, color }) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontFamily: FH, color, fontSize: 13, fontWeight: 700, letterSpacing: .5 }}>{pickTypeLabel(id)}</span>
            <span style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: "1px 10px", fontSize: 11, color, fontWeight: 700 }}>{grouped[id].length}</span>
          </div>
          {grouped[id].length === 0 ? (
            <div style={{ background: `${color}08`, border: `1px dashed ${color}30`, borderRadius: 10, padding: "10px 14px", color: C.textDim, fontSize: 12, fontStyle: "italic" }}>
              {t("actions.empty_for_type","Keine {type}. Nutze 'Standard D&D' oder '+ Eigene Aktion'.").replace("{type}", pickTypeLabel(id))}
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
                    }} title={t("actions.pin_to_overview","Auf Übersicht anzeigen")} style={{ ...sx.bsm((char.pinnedActionIds || []).includes(action.id) ? C.amber : C.textDim), fontWeight: (char.pinnedActionIds || []).includes(action.id) ? 700 : 400 }}>📌</button>
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
          <div style={{ fontSize: 14, marginBottom: 4 }}>{t("actions.empty_title","Noch keine Aktionen angelegt")}</div>
          <div style={{ fontSize: 12 }}>{t("actions.empty_desc","Nutze 'Standard D&D' für vorgefertigte Regelwerk-Aktionen oder erstelle eigene.")}</div>
        </div>
      )}
    </div>
  );
}
