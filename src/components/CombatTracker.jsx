import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { MONSTERS } from "../data/monsters.js";

export default function CombatTracker() {
  const [fighters, setFighters, rdy] = usePersist("combat_v4", []);
  const [round, setRound] = usePersist("combat_round_v4", 1);
  const [active, setActive] = usePersist("combat_active_v4", 0);
  const [presets, setPresets] = usePersist("combat_presets_v4", []);
  const [combatLog, setCombatLog] = usePersist("combat_log_v1", []);
  const [customMonsters] = usePersist("bestiary_v4", []);
  const [tab, setTab] = useState("combat");
  const [nN, setNN] = useState(""); const [nI, setNI] = useState(""); const [nH, setNH] = useState(""); const [nA, setNA] = useState("");
  const [dmg, setDmg] = useState({});
  const [newPresetName, setNewPresetName] = useState("");
  const [monSearch, setMonSearch] = useState("");
  const [monCount, setMonCount] = useState({});
  const [manualLog, setManualLog] = useState("");

  const allMonsters = [...MONSTERS, ...(customMonsters || [])];
  const sorted = [...fighters].sort((a, b) => b.initiative - a.initiative);

  const addLog = (type, text, r) => setCombatLog(p => [...p, { id: Date.now() + Math.random(), round: r || 0, type, text, ts: new Date().toLocaleTimeString("de") }]);

  const addFighter = () => {
    if (!nN) return;
    const f = { id: Date.now(), name: nN, initiative: +nI || 0, hp: +nH || 10, maxHp: +nH || 10, ac: +nA || 10, conditions: [], isPlayer: false };
    setFighters(p => [...p, f]);
    addLog("join", `${nN} tritt dem Kampf bei (HP: ${nH || 10}, AC: ${nA || 10}, Init: ${nI || 0})`);
    setNN(""); setNI(""); setNH(""); setNA("");
  };

  const applyHP = (id, val, heal) => {
    const v = Math.abs(+val || 0);
    if (v === 0) return;
    setFighters(p => p.map(c => {
      if (c.id !== id) return c;
      const newHp = Math.max(0, Math.min(c.maxHp, heal ? c.hp + v : c.hp - v));
      const text = heal
        ? `${c.name} wird geheilt: +${v} HP (${c.hp} → ${newHp})`
        : `${c.name} erleidet ${v} Schaden (${c.hp} → ${newHp} HP)${newHp === 0 ? " — BEWUSSTLOS!" : ""}`;
      addLog(heal ? "heal" : "dmg", text);
      return { ...c, hp: newHp };
    }));
    setDmg(p => ({ ...p, [id]: "" }));
  };

  const nextTurn = () => {
    if (!sorted.length) return;
    const nextIdx = (active + 1) % sorted.length;
    let newRound = round;
    if (nextIdx === 0) { newRound = round + 1; setRound(newRound); addLog("round", `--- Runde ${newRound} beginnt ---`, newRound); }
    const next = sorted[nextIdx];
    if (next) addLog("turn", `Zug: ${next.name} (Initiative ${next.initiative})`, nextIdx === 0 ? newRound : round);
    setActive(nextIdx);
  };

  const togCond = (id, cn) => setFighters(p => p.map(c => {
    if (c.id !== id) return c;
    const has = c.conditions.includes(cn);
    addLog("cond", `${c.name}: Condition "${cn}" ${has ? "entfernt" : "hinzugefuegt"}`);
    return { ...c, conditions: has ? c.conditions.filter(x => x !== cn) : [...c.conditions, cn] };
  }));

  const hCol = (h, m) => { const p = h / m; return p > .5 ? C.greenBright : p > .25 ? "#c09030" : C.redBright; };

  const savePreset = () => {
    const name = newPresetName.trim(); if (!name || !fighters.length) return;
    const template = fighters.map(f => ({ name: f.name, hp: f.maxHp, ac: f.ac, isPlayer: f.isPlayer }));
    setPresets(p => [...p.filter(x => x.name !== name), { id: Date.now(), name, fighters: template }]);
    setNewPresetName("");
  };
  const loadPreset = preset => {
    const newFighters = preset.fighters.map(f => ({ id: Date.now() + Math.random(), name: f.name, initiative: 0, hp: f.hp, maxHp: f.hp, ac: f.ac, conditions: [], isPlayer: f.isPlayer || false }));
    setFighters(p => [...p, ...newFighters]);
  };
  const deletePreset = id => setPresets(p => p.filter(x => x.id !== id));

  const addMonsterToFight = (m, count = 1) => {
    const newF = Array.from({ length: count }, () => ({ id: Date.now() + Math.random(), name: count > 1 ? `${m.name} ${Math.floor(Math.random() * 100)}` : m.name, initiative: 0, hp: m.hp, maxHp: m.hp, ac: m.ac, conditions: [], isPlayer: false, monsterRef: m.id }));
    setFighters(p => [...p, ...newF]);
  };

  const crN = cr => { const n = parseFloat(cr); return isNaN(n) ? 0 : n; };
  const crC = cr => { const n = crN(cr); return n < 1 ? "#40a060" : n < 5 ? "#c0a020" : n < 10 ? C.red : "#c020c0"; };
  const filteredMonsters = allMonsters.filter(m => m.name.toLowerCase().includes(monSearch.toLowerCase()));

  if (!rdy) return <div style={{ color: C.textDim, padding: 20 }}>Lade...</div>;

  return (
    <div>
      <div style={{ ...sx.jb, marginBottom: 12 }}>
        <div style={{ fontFamily: FH, color: C.gold, fontSize: 16 }}>⚔️ Runde {round}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={nextTurn} style={sx.btn(C.green)}>▶ Nächster Zug</button>
          <button onClick={() => { setRound(1); setActive(0); }} style={sx.btn(C.textDim)}>↺ Reset</button>
          <button onClick={() => { setFighters([]); setRound(1); setActive(0); }} style={sx.btn(C.red)}>🗑 Leeren</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: 2 }}>
        {[["combat", "⚔️ Kampf"], ["builder", "🏗️ Encounter Builder"], ["presets", "💾 Vorlagen"], ["log", "📋 Kampflog"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...sx.nb(tab === t), flexShrink: 0 }}>{l}</button>
        ))}
      </div>

      {tab === "combat" && <div>
        <div style={sx.card}>
          <div style={sx.ct}>+ Kämpfer manuell hinzufügen</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input placeholder="Name" value={nN} onChange={e => setNN(e.target.value)} style={{ ...sx.inp, width: 140 }} onKeyDown={e => e.key === "Enter" && addFighter()} />
            <input placeholder="Init" type="number" value={nI} onChange={e => setNI(e.target.value)} style={{ ...sx.inp, width: 75 }} />
            <input placeholder="Max HP" type="number" value={nH} onChange={e => setNH(e.target.value)} style={{ ...sx.inp, width: 80 }} />
            <input placeholder="AC" type="number" value={nA} onChange={e => setNA(e.target.value)} style={{ ...sx.inp, width: 70 }} />
            <button onClick={addFighter} style={sx.btn(C.green)}>+ Hinzufügen</button>
          </div>
        </div>
        {sorted.length === 0 && <div style={{ ...sx.card, color: C.textDim, textAlign: "center", fontStyle: "italic", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚔️</div>
          Keine Kämpfer. Füge sie manuell hinzu, lade eine Vorlage oder benutze den Encounter Builder.
        </div>}
        {sorted.map((c, i) => (
          <div key={c.id} style={{ ...sx.card, position: "relative", border: `1px solid ${i === active ? C.gold : c.hp === 0 ? C.red + "44" : C.border}`, opacity: c.hp === 0 ? .6 : 1, boxShadow: i === active ? `0 0 16px ${C.goldDim}` : "none" }}>
            {i === active && <div style={{ position: "absolute", top: -1, left: -1, background: C.gold, borderRadius: "7px 0 4px 0", padding: "2px 8px", fontSize: 10, fontFamily: FH, color: C.bg, fontWeight: 700 }}>AM ZUG</div>}
            <div style={{ ...sx.jb, marginTop: i === active ? 12 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: C.surface, borderRadius: 4, padding: "4px", textAlign: "center", minWidth: 52 }}>
                  <div style={{ fontSize: 10, color: C.textDim }}>INIT</div>
                  <input type="number" value={c.initiative} onChange={e => setFighters(p => p.map(x => x.id === c.id ? { ...x, initiative: +e.target.value } : x))} style={{ ...sx.inp, textAlign: "center", fontSize: 18, fontWeight: 700, color: C.gold, padding: "2px", background: "transparent", border: "none", width: 48 }} />
                </div>
                <div>
                  <div style={{ fontFamily: FH, fontSize: 15, color: C.textBright, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.textDim }}>AC {c.ac}{c.isPlayer && <span style={{ color: C.gold, marginLeft: 6 }}>👤 Spieler</span>}</div>
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 200, margin: "0 16px" }}>
                <div style={{ ...sx.jb, marginBottom: 3 }}><span style={{ fontSize: 13, color: hCol(c.hp, c.maxHp), fontWeight: 700 }}>{c.hp}/{c.maxHp} HP</span>{c.hp === 0 && <span style={{ color: C.red, fontSize: 11 }}>💀</span>}</div>
                <div style={{ background: C.surface, borderRadius: 10, height: 8, overflow: "hidden" }}><div style={{ width: `${(c.hp / c.maxHp) * 100}%`, height: "100%", background: hCol(c.hp, c.maxHp), borderRadius: 10, transition: "width .3s" }} /></div>
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="number" placeholder="HP" value={dmg[c.id] || ""} onChange={e => setDmg(p => ({ ...p, [c.id]: e.target.value }))} style={{ ...sx.inp, width: 70 }} />
                <button onClick={() => applyHP(c.id, dmg[c.id], false)} style={sx.bsm(C.red)} title="Schaden">🗡️</button>
                <button onClick={() => applyHP(c.id, dmg[c.id], true)} style={sx.bsm(C.green)} title="Heilen">💚</button>
                <button onClick={() => setFighters(p => p.map(x => x.id === c.id ? { ...x, hp: x.maxHp } : x))} style={sx.bsm(C.blue)} title="Vollheilen">♻</button>
                <button onClick={() => setFighters(p => p.filter(x => x.id !== c.id))} style={sx.bsm("#444")}>✕</button>
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["Poisoned", "Prone", "Stunned", "Blinded", "Paralyzed", "Restrained", "Frightened", "Invisible", "Grappled", "Concentration", "Exhaustion"].map(cn => (
                <button key={cn} onClick={() => togCond(c.id, cn)} style={{ background: c.conditions.includes(cn) ? C.red + "88" : C.surface, border: `1px solid ${c.conditions.includes(cn) ? C.red : C.border}`, borderRadius: 3, color: c.conditions.includes(cn) ? C.textBright : C.textDim, fontSize: 10, padding: "2px 6px", cursor: "pointer", fontFamily: FH }}>{cn}</button>
              ))}
            </div>
          </div>
        ))}
      </div>}

      {tab === "builder" && <div>
        <div style={sx.card}>
          <div style={sx.ct}>🏗️ Encounter Builder — Monster zum Kampf hinzufügen</div>
          <div style={{ color: C.textDim, fontSize: 13, marginBottom: 12 }}>Wähle Monster und füge sie direkt in den Kampf ein. Initiative wird auf 0 gesetzt — im Kampf-Tab anpassen.</div>
          <input value={monSearch} onChange={e => setMonSearch(e.target.value)} placeholder="🔍 Monster suchen…" style={{ ...sx.inp, marginBottom: 12 }} />
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {filteredMonsters.map(m => {
              const cnt = monCount[m.id] || 1;
              return (
                <div key={m.id} style={{ ...sx.jb, background: C.surface, borderRadius: 6, padding: "8px 12px", marginBottom: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: FH, fontSize: 14, color: C.textBright, fontWeight: 700 }}>{m.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: crC(m.cr) }}>CR {m.cr}</span>
                      <span style={{ fontSize: 11, color: C.textDim }}>{m.size} {m.type}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                      <span style={sx.tag(C.red)}>❤️ {m.hp}</span>
                      <span style={sx.tag(C.blue)}>🛡️ AC{m.ac}</span>
                      <span style={sx.tag(C.green)}>💨 {m.speed}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" min={1} max={20} value={cnt} onChange={e => setMonCount(p => ({ ...p, [m.id]: Math.max(1, +e.target.value) }))} style={{ ...sx.inp, width: 55, textAlign: "center" }} />
                    <button onClick={() => addMonsterToFight(m, cnt)} style={sx.btn(C.green)}>+ Zum Kampf</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>}

      {tab === "presets" && <div>
        <div style={sx.card}>
          <div style={sx.ct}>💾 Kampf-Vorlage speichern</div>
          <div style={{ color: C.textDim, fontSize: 13, marginBottom: 10 }}>Speichere die aktuellen Kaempfer als Vorlage.</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}><label style={sx.lbl}>Name der Vorlage</label><input value={newPresetName} onChange={e => setNewPresetName(e.target.value)} style={sx.inp} placeholder="z.B. Goblin-Raid, Party..." /></div>
            <button onClick={savePreset} style={sx.btn(C.green)}>💾 Speichern ({fighters.length})</button>
          </div>
          {fighters.length === 0 && <div style={{ color: C.redBright, fontSize: 12, marginTop: 6 }}>Keine Kaempfer vorhanden.</div>}
        </div>
        {presets.length === 0 && <div style={{ ...sx.card, color: C.textDim, textAlign: "center", fontStyle: "italic" }}>Noch keine Vorlagen.</div>}
        {presets.map(p => (
          <div key={p.id} style={sx.card}>
            <div style={{ ...sx.jb, marginBottom: 8 }}>
              <div style={{ fontFamily: FH, color: C.gold, fontSize: 15, fontWeight: 700 }}>📋 {p.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => loadPreset(p)} style={sx.btn(C.green)}>▶ Laden</button>
                <button onClick={() => { setFighters([]); setTimeout(() => loadPreset(p), 50); }} style={sx.btn(C.blue)}>🔄 Ersetzen</button>
                <button onClick={() => deletePreset(p.id)} style={sx.bsm(C.red)}>🗑</button>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {p.fighters.map((f, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 6, padding: "4px 10px", border: `1px solid ${C.border}`, fontSize: 13 }}>
                  {f.name} <span style={{ color: C.textDim, fontSize: 11 }}>❤️{f.hp} 🛡️{f.ac}</span>
                </div>
              ))}
            </div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 6 }}>{p.fighters.length} Kaempfer · Initiative = 0 beim Laden</div>
          </div>
        ))}
      </div>}

      {tab === "log" && <div>
        <div style={sx.card}>
          <div style={{ ...sx.jb, marginBottom: 12 }}>
            <div style={sx.ct}>📋 Kampflog ({combatLog.length} Eintraege)</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => {
                const typeStyle = { round: "color:#a78bfa;font-weight:700", turn: "color:#60a5fa", dmg: "color:#ef4444", heal: "color:#4ade80", cond: "color:#fbbf24", join: "color:#a3e635", manual: "color:#e2e0f0" };
                const rows = combatLog.map(e => `<tr><td style="color:#6b6880;width:56px;padding:3px 8px">${e.ts}</td><td style="color:#6b6880;width:60px;padding:3px 8px">Rd.${e.round || "—"}</td><td style="${typeStyle[e.type] || ""};padding:3px 8px">${e.text.replace(/</g, "&lt;")}</td></tr>`).join("");
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Kampflog</title><style>body{font-family:Calibri,sans-serif;padding:24px}table{width:100%;border-collapse:collapse;font-size:13px}tr:nth-child(even){background:#f7f7f7}td{border-bottom:1px solid #e5e5e5}</style></head><body><h1>D&D Kampflog</h1><table>${rows}</table></body></html>`;
                const w = window.open("", "_blank"); w.document.write(html); w.document.close(); w.onload = () => w.print();
              }} style={sx.btn(C.purple)}>📄 Als PDF exportieren</button>
              <button onClick={() => setCombatLog([])} style={sx.bsm(C.red)}>🗑 Leeren</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input value={manualLog} onChange={e => setManualLog(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && manualLog.trim()) { addLog("manual", manualLog.trim(), round); setManualLog(""); } }} style={sx.inp} placeholder="Manuellen Eintrag hinzufuegen (Enter)..." />
            <button onClick={() => { if (manualLog.trim()) { addLog("manual", manualLog.trim(), round); setManualLog(""); } }} style={sx.btn(C.blue)}>+ Eintrag</button>
          </div>
          {combatLog.length === 0 && <div style={{ color: C.textDim, fontStyle: "italic", textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            Noch keine Eintraege. Kampf-Ereignisse werden automatisch geloggt.
          </div>}
          <div style={{ maxHeight: "55vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {[...combatLog].reverse().map(e => {
              const typeColor = { round: C.purpleBright, turn: C.blueBright, dmg: C.redBright, heal: C.greenBright, cond: C.amberBright, join: C.tealBright, manual: C.textBright };
              const typeIcon = { round: "🔁", turn: "▶", dmg: "🗡️", heal: "💚", cond: "⚡", join: "➕", manual: "📝" };
              const col = typeColor[e.type] || C.textDim;
              return (
                <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 10px", borderRadius: 6, background: e.type === "round" ? `${C.purple}15` : "transparent", borderLeft: e.type === "round" ? `3px solid ${C.purple}` : "3px solid transparent" }}>
                  <span style={{ fontSize: 12, minWidth: 20, textAlign: "center" }}>{typeIcon[e.type] || "•"}</span>
                  <span style={{ fontSize: 11, color: C.textDim, minWidth: 48, whiteSpace: "nowrap" }}>{e.ts}</span>
                  <span style={{ fontSize: 11, color: C.textDim, minWidth: 44, whiteSpace: "nowrap" }}>Rd.{e.round || "—"}</span>
                  <span style={{ fontSize: 13, color: col, flex: 1, lineHeight: 1.5 }}>{e.text}</span>
                  <button onClick={() => setCombatLog(p => p.filter(x => x.id !== e.id))} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 11, opacity: .5 }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>}
    </div>
  );
}
