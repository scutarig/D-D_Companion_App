import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { newChar } from "../utils/helpers.js";
import { useChar } from "../context/CharContext.jsx";
import CharSheet from "./CharSheet.jsx";
import LevelUpAssistant from "./LevelUpAssistant.jsx";
import CharActions from "./CharActions.jsx";
import Spellbook from "./Spellbook.jsx";
import Tokens from "./Tokens.jsx";
import ConditionsTracker from "./ConditionsTracker.jsx";
import CurrencyTab from "./CurrencyTab.jsx";

export default function CharManager() {
  const { chars, setChars, aid, setAid, active, setActive } = useChar();
  const [subtab, setSubtab] = useState("sheet");
  const [usedSlots, setUsedSlots] = usePersist(`tokens_used_${aid}`, {});
  const [restMode, setRestMode] = useState(null);
  const [shortHpVal, setShortHpVal] = useState(5);
  const [shortResult, setShortResult] = useState(null);

  const addChar = () => { const id = Date.now(); setChars(p => [...p, newChar(id)]); setAid(id); };
  const delChar = id => { if (chars.length <= 1) return; const nx = chars.find(c => c.id !== id); setChars(p => p.filter(c => c.id !== id)); setAid(nx?.id); };

  const doLongRest = () => {
    setActive(p => { const regainHD = Math.max(1, Math.floor(p.level / 2)); return { ...p, hp: p.maxHp, tempHp: 0, deathSaves: { suc: 0, fail: 0 }, hd_used: Math.max(0, (p.hd_used || 0) - regainHD) }; });
    setUsedSlots({});
    setRestMode("long_done");
  };
  const doShortRest = () => {
    const hp = Math.max(0, shortHpVal || 0);
    setActive(p => ({ ...p, hp: Math.min(p.maxHp, p.hp + hp) }));
    setShortResult({ healed: hp });
    setRestMode("short_done");
  };

  const importJSON = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data && data.name) { const id = Date.now(); const newC = { ...newChar(id), ...data, id }; setChars(p => [...p, newC]); setAid(id); }
        else { alert("Ungültige Charakter-Datei."); }
      } catch { alert("JSON konnte nicht gelesen werden."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!active) return null;

  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ ...sx.jb, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH, letterSpacing: 1 }}>CHARAKTER</span>
            {chars.map(c => (
              <button key={c.id} onClick={() => setAid(c.id)} style={{ background: c.id === aid ? "linear-gradient(135deg,#7c3aed44,#5b21b622)" : "transparent", border: `1px solid ${c.id === aid ? C.purple : C.border}`, borderRadius: 20, color: c.id === aid ? C.purpleBright : C.textBright, fontFamily: FH, fontSize: 12, padding: "5px 14px", cursor: "pointer", fontWeight: c.id === aid ? 700 : 400, boxShadow: c.id === aid ? "0 0 12px rgba(124,58,237,0.3)" : "none", transition: "all .2s" }}>
                {c.name} <span style={{ color: C.textDim, fontSize: 10 }}>Lv.{c.level}</span>
              </button>
            ))}
            <button onClick={addChar} style={sx.bsm(C.green)}>+ Neu</button>
            {chars.length > 1 && <button onClick={() => delChar(aid)} style={sx.bsm(C.red)}>🗑</button>}
            <label style={{ ...sx.bsm(C.blue), cursor: "pointer" }}>
              📥 Import
              <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
            </label>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setRestMode(restMode === "short" ? null : "short")} style={{ ...sx.bsm(C.teal), background: restMode === "short" ? `${C.teal}30` : `${C.teal}18`, border: `1px solid ${C.teal}55`, fontWeight: 700 }}>🌙 Kurze Rast</button>
            <button onClick={() => setRestMode(restMode === "long_confirm" ? null : "long_confirm")} style={{ ...sx.bsm(C.purple), background: restMode === "long_confirm" ? `${C.purple}30` : `${C.purple}18`, border: `1px solid ${C.purple}55`, fontWeight: 700 }}>🌟 Lange Rast</button>
            <span style={{ fontSize: 10, color: C.textDim }}>💾 Auto-Speichern</span>
          </div>
        </div>

        {restMode === "short" && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(13,148,136,0.1)", border: `1px solid ${C.teal}40`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: C.tealBright, fontFamily: FH, fontWeight: 700, marginBottom: 8 }}>🌙 Kurze Rast — HP wiederherstellen</div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>Aktuelle HP: <strong style={{ color: C.textBright }}>{active.hp} / {active.maxHp}</strong></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ ...sx.lbl, marginBottom: 0 }}>HP-Betrag:</label>
              <input type="number" min={0} max={active.maxHp} value={shortHpVal} onChange={e => setShortHpVal(Math.max(0, +e.target.value))} style={{ ...sx.inp, width: 80 }} />
              <button onClick={doShortRest} style={sx.btn(C.teal)}>Heilen</button>
              <button onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>Abbrechen</button>
            </div>
          </div>
        )}

        {restMode === "short_done" && shortResult && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(13,148,136,0.1)", border: `1px solid ${C.teal}40`, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22 }}>🌙</div>
            <div>
              <div style={{ fontSize: 14, color: C.tealBright, fontWeight: 700 }}>Kurze Rast abgeschlossen!</div>
              <div style={{ fontSize: 12, color: C.textDim }}><strong style={{ color: C.greenBright }}>+{shortResult.healed} HP</strong> wiederhergestellt</div>
            </div>
            <button onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
          </div>
        )}

        {restMode === "long_confirm" && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,0.1)", border: `1px solid ${C.purple}40`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: C.purpleBright, fontFamily: FH, fontWeight: 700, marginBottom: 6 }}>🌟 Lange Rast — Bestaetigen</div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
              Stellt wieder her: <strong style={{ color: C.textBright }}>volle HP</strong>, <strong style={{ color: C.textBright }}>alle Spell Slots</strong>, <strong style={{ color: C.textBright }}>Temp HP → 0</strong>, <strong style={{ color: C.textBright }}>Todeswuerfe reset</strong>, <strong style={{ color: C.textBright }}>{Math.max(1, Math.floor(active.level / 2))} Hit Dice</strong> wiederhergestellt.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={doLongRest} style={sx.btn(C.purple)}>🌟 Lange Rast durchfuehren</button>
              <button onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>Abbrechen</button>
            </div>
          </div>
        )}

        {restMode === "long_done" && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,0.1)", border: `1px solid ${C.purple}40`, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22 }}>🌟</div>
            <div>
              <div style={{ fontSize: 14, color: C.purpleBright, fontWeight: 700 }}>Lange Rast abgeschlossen!</div>
              <div style={{ fontSize: 12, color: C.textDim }}>HP voll · Alle Spell Slots zurück · Hit Dice teilweise wiederhergestellt</div>
            </div>
            <button onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: 4 }}>
        {[["sheet", "📜 Bogen"], ["currency", "💰 Währung"], ["levelup", "⬆️ Level-Up"], ["aktionen", "⚔️ Aktionen"], ["spells", "🔮 Spellbook"], ["tokens", "🏷️ Tokens"], ["conditions", "⚡ Conditions"]].map(([t, l]) => (
          <button key={t} onClick={() => setSubtab(t)} style={{ ...sx.nb(subtab === t), flexShrink: 0 }}>{l}</button>
        ))}
      </div>

      {subtab === "sheet" && <CharSheet char={active} setChar={setActive} />}
      {subtab === "currency" && <CurrencyTab />}
      {subtab === "levelup" && <LevelUpAssistant char={active} setChar={setActive} />}
      {subtab === "aktionen" && <CharActions char={active} setChar={setActive} />}
      {subtab === "spells" && <Spellbook key={aid} charId={aid} />}
{subtab === "tokens" && <Tokens char={active} charId={aid} usedSlots={usedSlots} setUsedSlots={setUsedSlots} />}
      {subtab === "conditions" && <ConditionsTracker char={active} setChar={setActive} />}
    </div>
  );
}
