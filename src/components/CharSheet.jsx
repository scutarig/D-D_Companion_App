import { useState } from "react";
import { C, sx, SC, ABS, SKILLS, FH } from "../constants/theme.js";
import { modOf, modStr, getPB } from "../utils/helpers.js";
import { ALL_KLASSEN, D3_KLASSEN } from "../data/classes.js";
import { ALL_VOELKER, DND_BACKGROUNDS } from "../data/races.js";
import RaceSelector from "./CharacterSheet/RaceSelector.jsx";
import TraitsFeatures from "./CharacterSheet/TraitsFeatures.jsx";

export default function CharSheet({ char, setChar }) {
  const [tab, setTab] = useState("stats");
  const u = (f, v) => setChar(p => ({ ...p, [f]: v }));
  const pb = getPB(char.level);

  // Auto-berechnete Zauberwerte
  const spellAbilityKey = (char.spellAbility || "INT").toLowerCase();
  const spellMod = modOf(char[spellAbilityKey] || 10);
  const spellDC = 8 + pb + spellMod;
  const spellAtk = pb + spellMod;

  // Klasse wechseln → HD auto-setzen
  const handleKlasseChange = (newKlass) => {
    const classData = D3_KLASSEN.find(c => c.name === newKlass);
    setChar(p => ({
      ...p,
      klass: newKlass,
      ...(classData ? { hd: classData.hd } : {}),
    }));
  };

  return (
    <div>
      <div style={{ ...sx.card, background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,0,0,0.2))" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, marginBottom: 14 }}>
          <div><label style={sx.lbl}>Name</label><input value={char.name} onChange={e => u("name", e.target.value)} style={{ ...sx.inp, fontSize: 16, fontFamily: FH, color: C.gold, fontWeight: 700 }} /></div>
          <div>
            <label style={sx.lbl}>Klasse</label>
            <select value={char.klass} onChange={e => handleKlasseChange(e.target.value)} style={sx.sel}>
              {ALL_KLASSEN.map(k => <option key={k}>{k}</option>)}
              <option value="Eigene">Eigene...</option>
            </select>
            {char.klass === "Eigene" && <input value={char.klassCustom || ""} onChange={e => u("klassCustom", e.target.value)} style={{ ...sx.inp, marginTop: 4 }} placeholder="Eigene Klasse..." />}
          </div>
          <RaceSelector char={char} setChar={setChar} />
          <div>
            <label style={sx.lbl}>Hintergrund</label>
            <select value={char.background} onChange={e => u("background", e.target.value)} style={sx.sel}>
              {DND_BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
              <option value="Eigener">Eigener...</option>
            </select>
            {char.background === "Eigener" && <input value={char.backgroundCustom || ""} onChange={e => u("backgroundCustom", e.target.value)} style={{ ...sx.inp, marginTop: 4 }} placeholder="Eigener Hintergrund..." />}
          </div>
          <div>
            <label style={sx.lbl}>Level</label>
            <div style={{ ...sx.inp, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: C.gold, fontFamily: FH, cursor: "default", userSelect: "none" }}>
              {char.level}
            </div>
            <div style={{ fontSize: 9, color: C.textDim, textAlign: "center", marginTop: 2 }}>via Level-Up</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
          {[["❤️", "HP", "hp", 0, char.maxHp, C.red], ["💛", "Max HP", "maxHp", 1, 999, C.amber], ["💙", "Temp HP", "tempHp", 0, 999, C.blue], ["🛡️", "AC", "ac", 0, 30, C.teal], ["⚡", "Init", "initiative", -10, 20, C.green], ["💨", "Speed", "speed", 0, 120, C.purple]].map(([ic, l, f, mn, mx, col]) => (
            <div key={f} style={{ background: `${col}12`, border: `1px solid ${col}25`, borderRadius: 10, padding: "8px 12px", textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 10, color: col, fontFamily: FH, marginBottom: 2, letterSpacing: .5 }}>{ic} {l}</div>
              <input type="number" min={mn} max={mx} value={char[f]} onChange={e => u(f, +e.target.value)} style={{ ...sx.inp, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.textBright, padding: "2px 0", background: "transparent", border: "none", width: 68 }} />
            </div>
          ))}
          <div style={{ background: `${C.gold}12`, border: `1px solid ${C.gold}25`, borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 58 }}>
            <div style={{ fontSize: 10, color: C.gold, fontFamily: FH, marginBottom: 2, letterSpacing: .5 }}>🎖️ PB</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold }}>+{pb}</div>
          </div>
          <button onClick={() => u("inspiration", !char.inspiration)} style={{ background: char.inspiration ? "linear-gradient(135deg,#f0c060,#d97706)" : "rgba(0,0,0,0.25)", border: `1px solid ${char.inspiration ? C.gold : C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", textAlign: "center", minWidth: 88, boxShadow: char.inspiration ? "0 0 20px rgba(240,192,96,0.4)" : "none", transition: "all .3s" }}>
            <div style={{ fontSize: 20 }}>{char.inspiration ? "✨" : "💫"}</div>
            <div style={{ fontSize: 9, fontFamily: FH, fontWeight: 700, color: char.inspiration ? "#000" : C.textDim, letterSpacing: .5, marginTop: 2 }}>INSPIRATION</div>
            <div style={{ fontSize: 8, color: char.inspiration ? "#00000099" : C.textDim }}>{char.inspiration ? "AKTIV" : "INAKTIV"}</div>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: 2 }}>
        {[["stats", "⚔️ Attribute"], ["skills", "🎯 Skills"], ["saves", "💀 Saves"], ["traits", "✦ Traits"], ["personality", "🎭 Charakter"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...sx.nb(tab === t), flexShrink: 0 }}>{l}</button>
        ))}
      </div>

      {tab === "stats" && (
        <div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            {ABS.map(ab => { const val = char[ab.toLowerCase()] || 10; return (
              <div key={ab} style={sx.statBox(SC[ab])}>
                <div style={{ fontSize: 11, fontFamily: FH, color: SC[ab], fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{ab}</div>
                <input type="number" min={1} max={30} value={val} onChange={e => u(ab.toLowerCase(), +e.target.value)} style={{ ...sx.inp, textAlign: "center", fontSize: 28, fontWeight: 900, color: C.textBright, padding: "4px 0", background: "transparent", border: "none" }} />
                <div style={{ fontSize: 17, fontWeight: 700, color: SC[ab], borderTop: `1px solid ${SC[ab]}25`, paddingTop: 4, marginTop: 2 }}>{modStr(val)}</div>
              </div>
            ); })}
          </div>
          <div style={sx.g2}>
            <div style={sx.card}>
              <div style={sx.ct}>🏹 Hit Dice</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <input value={char.hd} onChange={e => u("hd", e.target.value)} style={{ ...sx.inp, width: 70 }} placeholder="d10" />
                <span style={{ color: C.textBright }}>{char.level - (char.hd_used || 0)}× verfügbar</span>
                <button onClick={() => u("hd_used", Math.max(0, (char.hd_used || 0) - 1))} style={sx.bsm(C.green)}>+ Wiederh.</button>
                <button onClick={() => u("hd_used", Math.min(char.level, (char.hd_used || 0) + 1))} style={sx.bsm(C.red)}>- Verbrauch</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div style={sx.card}>
          <div style={sx.ct}>🎯 Skills <span style={{ color: C.textDim, fontSize: 11, fontWeight: 400 }}>(☑ Proficient · ☑☑ Expertise)</span></div>
          <div style={{ columns: 2, gap: 12 }}>
            {Object.entries(SKILLS).flatMap(([ab, skills]) => skills.map(skill => {
              const pk = `skill_${skill}`, ek = `exp_${skill}`;
              const ip = char.skills[pk], ie = char.skills[ek];
              const bonus = modOf(char[ab.toLowerCase()] || 10) + (ie ? pb * 2 : ip ? pb : 0);
              return (
                <div key={skill} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, breakInside: "avoid" }}>
                  <input type="checkbox" checked={ip || false} onChange={e => setChar(p => ({ ...p, skills: { ...p.skills, [pk]: e.target.checked } }))} title="Proficient" />
                  <input type="checkbox" checked={ie || false} onChange={e => setChar(p => ({ ...p, skills: { ...p.skills, [ek]: e.target.checked } }))} title="Expertise" />
                  <span style={{ color: SC[ab], fontSize: 10, fontFamily: FH, width: 24 }}>{ab}</span>
                  <span style={{ flex: 1, fontSize: 14, color: ip ? C.textBright : C.text }}>{skill}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: ip ? C.gold : C.textDim, minWidth: 26, textAlign: "right" }}>{bonus >= 0 ? `+${bonus}` : bonus}</span>
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {tab === "saves" && (
        <div>
          <div style={sx.card}>
            <div style={sx.ct}>🎯 Saving Throws</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {ABS.map(ab => { const val = char[ab.toLowerCase()] || 10; const prof = char.saves[ab]; const bonus = modOf(val) + (prof ? pb : 0); return (
                <div key={ab} style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface, borderRadius: 4, padding: "8px 12px" }}>
                  <input type="checkbox" checked={prof || false} onChange={e => setChar(p => ({ ...p, saves: { ...p.saves, [ab]: e.target.checked } }))} />
                  <span style={{ color: SC[ab], fontFamily: FH, fontWeight: 700, fontSize: 13 }}>{ab}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: prof ? C.gold : C.textDim }}>{bonus >= 0 ? `+${bonus}` : bonus}</span>
                </div>
              ); })}
            </div>
          </div>
          <div style={sx.card}>
            <div style={sx.ct}>💀 Todeswürfe</div>
            <div style={{ display: "flex", gap: 24 }}>
              {[["Erfolge", C.greenBright, "suc"], ["Misserfolge", C.redBright, "fail"]].map(([lbl, col, f]) => (
                <div key={f}>
                  <div style={{ fontSize: 13, color: col, marginBottom: 6, fontFamily: FH }}>{lbl}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 1, 2].map(i => <div key={i} onClick={() => setChar(p => { const ds = p.deathSaves || { suc: 0, fail: 0 }; return { ...p, deathSaves: { ...ds, [f]: i < (ds[f] || 0) ? i : (ds[f] || 0) + 1 } }; })} style={{ width: 24, height: 24, borderRadius: "50%", background: i < ((char.deathSaves || {})[f] || 0) ? col : "transparent", border: `2px solid ${col}`, cursor: "pointer" }} />)}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setChar(p => ({ ...p, deathSaves: { suc: 0, fail: 0 } }))} style={{ ...sx.bsm(C.textDim), marginTop: 10 }}>Zurücksetzen</button>
          </div>
          <div style={sx.card}>
            <div style={sx.ct}>🔮 Zauberwerte</div>
            <div style={{ marginBottom: 10 }}>
              <label style={sx.lbl}>Zauberfähigkeit</label>
              <select value={char.spellAbility} onChange={e => u("spellAbility", e.target.value)} style={{ ...sx.sel, maxWidth: 120 }}>
                {ABS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["Zauber-SG", spellDC, `8 + PB(${pb}) + ${modStr(spellMod)}`, C.purple],
                ["Zauber-Angriff", spellAtk >= 0 ? `+${spellAtk}` : spellAtk, `PB(${pb}) + ${modStr(spellMod)}`, C.blue]
              ].map(([lbl, val, formula, col]) => (
                <div key={lbl} style={{ background: `${col}12`, border: `1px solid ${col}25`, borderRadius: 10, padding: "10px 16px", textAlign: "center", minWidth: 110 }}>
                  <div style={{ fontSize: 10, color: col, fontFamily: FH, marginBottom: 4, letterSpacing: .5 }}>{lbl}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: C.textBright }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{formula}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "traits" && (
        <TraitsFeatures char={char} setChar={setChar} />
      )}

      {tab === "personality" && (
        <div>
          <div style={sx.g2}>
            {[["traits", "🎭 Persönlichkeit", "Ich bin…"], ["ideals", "💡 Ideale", "Ich glaube an…"], ["bonds", "❤️ Bindungen", "Ich sorge mich um…"], ["flaws", "💔 Makel", "Mein größter Fehler…"]].map(([f, l, ph]) => (
              <div key={f} style={sx.card}><div style={sx.ct}>{l}</div><textarea value={char[f]} onChange={e => u(f, e.target.value)} style={{ ...sx.ta, height: 80 }} placeholder={ph} /></div>
            ))}
          </div>
          <div style={sx.card}><div style={sx.ct}>🗡️ Features & Fähigkeiten</div><textarea value={char.features} onChange={e => u("features", e.target.value)} style={{ ...sx.ta, height: 90 }} placeholder="Klassen-Features, Volksfähigkeiten…" /></div>
          <div style={sx.card}><div style={sx.ct}>📖 Hintergrundgeschichte</div><textarea value={char.backstory} onChange={e => u("backstory", e.target.value)} style={{ ...sx.ta, height: 110 }} placeholder="Woher komme ich? Was motiviert mich?" /></div>
        </div>
      )}
    </div>
  );
}
