import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { modOf, modStr, getPB, buildSlotsForLevel, CASTER_TYPE, FULL_CASTER, HALF_CASTER, THIRD_CASTER, PACT_MAGIC } from "../utils/helpers.js";
import { CLASS_FEATURES } from "../data/classFeatures.js";
import { FEATS, meetsPrerequisite } from "../data/feats.js";
import { applyFeat } from "../utils/feats.js";
import { updateOriginFeatOnLevelUp } from "../utils/originFeats.js";
import { useI18n } from "../i18n/index.js";

// ── ASI-Levels pro Klasse ───────────────────────────────────────────────────
const ASI_DEFAULT = [4, 8, 12, 16, 19];
const ASI_BY_CLASS = {
  Kämpfer: [4, 6, 8, 12, 14, 16, 19],   // 7 ASIs
  Schurke:  [4, 8, 10, 12, 16, 19],       // ASI auch auf Level 10
};

// ── Half-Feat Detection ─────────────────────────────────────────────────────
// Detects "+1 STR" / "+1 STR oder DEX" / "+1 STR/DEX" in feat descriptions.
// Returns array of stat letters (["STR","DEX"]) or [] if no half-feat boost.
function getHalfFeatStats(feat) {
  if (!feat?.description) return [];
  // Skip the generic "Ability Score Improvement" feat (which IS pure ASI)
  if (feat.id === "ability_score_improvement") return [];
  const desc = feat.description;
  const stats = new Set();
  const re = /\+1\s+(STR|DEX|CON|INT|WIS|CHA)(?:\s*(?:oder|or|\/|,)\s*(STR|DEX|CON|INT|WIS|CHA))?(?:\s*(?:oder|or|\/|,)\s*(STR|DEX|CON|INT|WIS|CHA))?/gi;
  let m;
  while ((m = re.exec(desc)) !== null) {
    if (m[1]) stats.add(m[1].toUpperCase());
    if (m[2]) stats.add(m[2].toUpperCase());
    if (m[3]) stats.add(m[3].toUpperCase());
  }
  return [...stats];
}

// ── Klassen-Features — aus data/classFeatures.js importiert ─────────────────
// CLF[class][level] → [{name, description}]  (format wie bisher via Adapter)
const CLF = Object.fromEntries(
  Object.entries(CLASS_FEATURES).map(([cls, lvlMap]) => [
    cls,
    Object.fromEntries(
      Object.entries(lvlMap).map(([lvl, feats]) => [
        lvl,
        feats.map(f => ({ n: f.name, d: f.description })),
      ])
    ),
  ])
);

// ── Komponente ───────────────────────────────────────────────────────────────
export default function LevelUpAssistant({ char, setChar }) {
  const { lang } = useI18n();
  const newLevel = char.level + 1;
  const pb = getPB(newLevel);
  const pbOld = getPB(char.level);
  const hdMatch = (char.hd || "d8").match(/[dDwW](\d+)/);
  const hdNum = hdMatch ? parseInt(hdMatch[1]) : 8;
  const conMod = modOf(char.con || 10);

  const [hpChoice, setHpChoice] = useState("avg");
  const [rolledHp, setRolledHp] = useState(null);
  const [doneInfo, setDoneInfo] = useState(null);

  // ASI / Feat state
  const [asiMode, setAsiMode] = useState("asi");   // "asi" | "feat"
  const [asiA, setAsiA]       = useState("");      // first stat for ASI
  const [asiB, setAsiB]       = useState("");      // second stat (optional)
  const [featId, setFeatId]   = useState("");

  const avgHp = Math.floor(hdNum / 2) + 1 + conMod;
  const chosenHp = hpChoice === "roll" && rolledHp != null ? Math.max(1, rolledHp + conMod) : avgHp;

  const newPbFeature = pb > pbOld;
  const casterType = CASTER_TYPE[char.klass];
  const asiLevels = ASI_BY_CLASS[char.klass] || ASI_DEFAULT;
  const isAsi = asiLevels.includes(newLevel);
  const classFeatures = CLF[char.klass]?.[newLevel] || [];

  const ABS_LIST = ["STR","DEX","CON","INT","WIS","CHA"];

  // ── Feat filter ──────────────────────────────────────────────────────────
  // Auf Lv19 = Epic Boon Level (2024). Sonst nur General Feats.
  // Origin Feats kommen vom Background, Fighting Style Feats von der Klasse.
  // "Ability Score Improvement" wird ausgeblendet — dafür gibt es den ASI-Toggle.
  const isEpicLevel = newLevel === 19;
  const availableFeats = FEATS.filter(f => {
    // Skip redundant ASI-as-feat (ASI-Toggle deckt das ab)
    if (f.id === "ability_score_improvement") return false;
    // Category filter
    if (isEpicLevel) {
      if (f.category !== "epic_boon" && f.category !== "general") return false;
    } else {
      if (f.category !== "general") return false;
    }
    // Prereq + not already taken
    return meetsPrerequisite(char, f) && !(char.feats || []).some(cf => cf.id === f.id);
  });

  const [confirmReset, setConfirmReset] = useState(false);

  const doLevelUp = () => {
    setDoneInfo({ reachedLevel: newLevel, hpGained: chosenHp, newPb: pb, oldPb: pbOld });
    setChar(prev => {
      let next = { ...prev, level: newLevel, maxHp: prev.maxHp + chosenHp, hp: prev.hp + chosenHp, hd_used: Math.max(0, (prev.hd_used || 0) - 1) };
      // Apply ASI or Feat at ASI levels
      if (isAsi) {
        if (asiMode === "asi") {
          if (asiA) next = { ...next, [asiA.toLowerCase()]: Math.min(20, (next[asiA.toLowerCase()] || 10) + 1) };
          if (asiB) next = { ...next, [asiB.toLowerCase()]: Math.min(20, (next[asiB.toLowerCase()] || 10) + 1) };
        } else if (asiMode === "feat" && featId) {
          next = applyFeat(next, featId);
        }
      }
      // Auto-scale Origin Feat HP-bonus (Tough: +2 per level)
      next = updateOriginFeatOnLevelUp(next, newLevel);
      return next;
    });
  };

  const doReset = () => {
    const l1Hp = hdNum + conMod;
    setChar(p => ({ ...p, level: 1, maxHp: l1Hp, hp: l1Hp, hd_used: 0 }));
    setConfirmReset(false);
    setDoneInfo(null);
  };

  if (newLevel > 20 && !doneInfo) return (
    <div style={sx.card}><div style={sx.ct}>⬆️ Level-Up</div><div style={{ color: C.textDim, fontSize: 14 }}>Level 20 erreicht — maximales Level!</div></div>
  );

  if (doneInfo) return (
    <div style={{ ...sx.card, background: `${C.purple}10`, border: `1px solid ${C.purple}40` }}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
        <div style={{ fontFamily: FH, fontSize: 22, color: C.gold, fontWeight: 700, marginBottom: 6 }}>Level {doneInfo.reachedLevel} erreicht!</div>
        <div style={{ fontSize: 14, color: C.textDim, marginBottom: 16 }}>+{doneInfo.hpGained} Max HP · PB {doneInfo.newPb > doneInfo.oldPb ? `+${doneInfo.newPb} (war +${doneInfo.oldPb})` : `+${doneInfo.newPb}`}</div>
        <button onClick={() => setDoneInfo(null)} style={sx.btn(C.purple)}>Zurück zum Assistenten</button>
      </div>
    </div>
  );

  // ── Zauberplätze ermitteln ────────────────────────────────────────────────
  const renderSpellSlots = () => {
    if (!casterType) return null;

    if (casterType === "pact") {
      const pm = PACT_MAGIC[newLevel];
      if (!pm) return null;
      const [slots, grade] = pm;
      return (
        <div style={sx.card}>
          <div style={sx.ct}>3. Paktmagie (Hexenmeister)</div>
          <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>
            Kurzrastend auffüllbar. Alle Slots haben denselben Grad.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={slotBox(C.purple)}><div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>Grad</div><div style={{ fontSize: 20, fontWeight: 700, color: C.purpleBright }}>{grade}</div></div>
            <div style={slotBox(C.purple)}><div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>Slots</div><div style={{ fontSize: 20, fontWeight: 700, color: C.purpleBright }}>{slots}</div></div>
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>Pakt-Slots füllen sich nach einem kurzen oder langen Rest auf.</div>
          <div style={{ fontSize: 12, color: C.greenBright, marginTop: 4 }}>✅ Pakt-Slots passen sich automatisch zu deinem Level an.</div>
        </div>
      );
    }

    const table = casterType === "full" ? FULL_CASTER
      : casterType === "half" ? HALF_CASTER
      : THIRD_CASTER;
    const slots = table[newLevel];
    if (!slots) return null;

    const label = casterType === "half" ? "Halbzauberer" : casterType === "third" ? "⅓-Zauberer" : "Vollzauberer";
    const labels = ["1","2","3","4","5","6","7","8","9"];

    return (
      <div style={sx.card}>
        <div style={sx.ct}>3. Zauberplätze ({label})</div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>
          {char.klass} auf Level {newLevel} — Zauberplätze nach langem Rest:
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {slots.map((s, i) => s ? (
            <div key={i} style={slotBox(C.blue)}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, marginBottom: 2 }}>{labels[i]}. Grad</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.blueBright }}>{s}</div>
            </div>
          ) : null)}
        </div>
        <div style={{ fontSize: 12, color: C.greenBright, marginTop: 8 }}>✅ Zauberplätze im Tokens-Tab passen sich automatisch zu deinem Level an.</div>
      </div>
    );
  };

  // ── Erinnerungen ──────────────────────────────────────────────────────────
  const reminders = [
    isAsi && "⚔️ ASI oder Feat: 2 verschiedene Attribute +1 ODER 1 Feat wählen (wenn DM Feats erlaubt).",
    isAsi && "📐 Nach ASI: Alle abhängigen Werte neu berechnen (AC, HP, Angriffsboni, Rettungswürfe, Zaubersave-DC).",
    newPbFeature && `🎖️ PB steigt auf +${pb}: Alle Proficiency-abhängigen Boni aktualisieren (Angriffe, Skills, Rettungswürfe, Zaubersave-DC).`,
    newLevel === 2 && char.klass === "Druide" && "🐻 Wähle deinen Druidenzirkel (Unterklasse).",
    newLevel === 3 && ["Barbar","Barde","Kämpfer","Mönch","Paladin","Schurke","Waldläufer","Zauberer","Magieschmied"].includes(char.klass) && `🔱 Unterklasse wählen: ${char.klass} wählt auf Level 3 seinen Archetypen/Pfad.`,
    newLevel === 1 && ["Hexenmeister","Kleriker"].includes(char.klass) && `🔱 Unterklasse bereits auf Level 1 wählen (${char.klass}).`,
    newLevel === 2 && char.klass === "Magier" && "🔱 Arkane Tradition (Unterklasse) auf Level 2 wählen.",
    [5,11,20].includes(newLevel) && char.klass === "Kämpfer" && `⚔️ Extra-Angriff prüfen: Kämpfer hat auf Level ${newLevel} ${newLevel === 5 ? "2" : newLevel === 11 ? "3" : "4"} Angriffe pro Angriffsaktion.`,
    newLevel === 5 && ["Barbar","Paladin","Waldläufer","Mönch","Magieschmied"].includes(char.klass) && "⚔️ Extra-Angriff: Ab jetzt 2 Angriffe pro Angriffsaktion.",
    casterType && "📖 Neue Zauber auswählen und ins Zauberbuch / die Zauberliste eintragen.",
    casterType && newPbFeature && "🎯 Zaubersave-DC und Zauberangriffswurf neu berechnen (8 + PB + Zaubermerkmal-Mod).",
    "👁️ Passive Wahrnehmung aktualisieren: 10 + WIS-Mod + PB (wenn Proficiency).",
    "📊 Alle Skills und Rettungswürfe mit neuem PB aktualisieren.",
    "🎲 Du erhältst 1 neuen Trefferwürfel (HD). Gesamtzahl jetzt: " + newLevel + "× " + (char.hd || "W8") + ".",
    newLevel === 20 && "🏆 Level 20 erreicht! Capstone-Feature deiner Klasse aktivieren.",
  ].filter(Boolean);

  const sectionNum = (n) => casterType ? n : n - 1;

  return (
    <div>
      {/* Header */}
      <div style={{ ...sx.card, background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,0,0,0.2))", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>⬆️</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 18, color: C.gold, fontWeight: 700 }}>{char.name}</div>
            <div style={{ fontSize: 13, color: C.textDim }}>{char.klass} · Level {char.level} → <span style={{ color: C.purpleBright, fontWeight: 700 }}>Level {newLevel}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={sx.tag(C.purple)}>⬆️ Level {newLevel}</span>
          <span style={sx.tag(C.gold)}>🎖️ PB +{pb}{newPbFeature && <span style={{ color: C.amberBright }}> (↑ von +{pbOld})</span>}</span>
          <span style={sx.tag(C.teal)}>🎲 {char.hd}</span>
          {isAsi && <span style={sx.tag(C.green)}>✨ ASI / Feat</span>}
        </div>
      </div>

      {/* 1. HP */}
      <div style={sx.card}>
        <div style={sx.ct}>1. Trefferpunkte</div>
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 12 }}>
          CON-Mod: <strong style={{ color: C.textBright }}>{modStr(char.con || 10)}</strong> · Trefferwürfel: <strong style={{ color: C.textBright }}>{char.hd}</strong>
          <span style={{ marginLeft: 12, color: C.textDim }}>
            (Fest: {Math.floor(hdNum/2)+1}{conMod !== 0 ? ` ${conMod > 0 ? "+" : ""}${conMod}` : ""} HP)
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["avg", `Durchschnitt (${avgHp} HP)`, C.blue], ["roll", "Würfeln", C.amber]].map(([v, l, col]) => (
            <button key={v} onClick={() => setHpChoice(v)} style={{ flex: "1 1 120px", padding: "10px", borderRadius: 10, cursor: "pointer", background: hpChoice === v ? `${col}22` : "transparent", border: `2px solid ${hpChoice === v ? col : C.border}`, color: hpChoice === v ? col : C.textDim, fontFamily: FH, fontSize: 11, fontWeight: hpChoice === v ? 700 : 400 }}>{l}</button>
          ))}
        </div>
        {hpChoice === "roll" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.textDim }}>Ergebnis des {char.hd}-Wurfs:</span>
            <input type="number" min={1} max={hdNum} value={rolledHp ?? ""} onChange={e => setRolledHp(Math.max(1, Math.min(hdNum, +e.target.value)))} style={{ ...sx.inp, width: 80 }} placeholder={`1–${hdNum}`} />
            <button onClick={() => setRolledHp(Math.floor(Math.random() * hdNum) + 1)} style={sx.btn(C.amber)}>🎲 Würfeln</button>
          </div>
        )}
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>❤️</span>
          <div>
            <div style={{ fontSize: 12, color: C.textDim }}>Neue Max HP</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.greenBright }}>{char.maxHp} + {chosenHp} = <span style={{ color: C.gold }}>{char.maxHp + chosenHp}</span></div>
          </div>
        </div>
      </div>

      {/* 2. Klassenmerkmale */}
      <div style={sx.card}>
        <div style={sx.ct}>2. Klassenmerkmale — {char.klass} Level {newLevel}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {isAsi && (
            <div style={{ ...featureBox(C.green), padding: 14 }}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.greenBright, fontWeight: 700, marginBottom: 8 }}>✨ Attributswerterhöhung (ASI) oder Feat</div>

              {/* ── EXPLANATION BANNER ─────────────────────────────────────── */}
              <div style={{
                fontSize: 11, color: C.text, lineHeight: 1.55,
                background: `${C.purple}10`, border: `1px solid ${C.purple}33`, borderLeft: `3px solid ${C.purpleBright}`,
                borderRadius: 6, padding: "8px 10px", marginBottom: 12,
              }}>
                <div style={{ fontWeight: 700, color: C.purpleBright, marginBottom: 4 }}>ℹ️ Entweder/Oder — du wählst EINS pro ASI-Level</div>
                <div style={{ marginBottom: 3 }}><b style={{ color: C.greenBright }}>📈 ASI</b> = pures Stat-Plus (+2 auf 1 Attribut <i>oder</i> +1 auf 2 Attribute).</div>
                <div style={{ marginBottom: 3 }}><b style={{ color: C.amberBright }}>⭐ Feat</b> = neue Fähigkeit. Viele sind <b>Half-Feats</b> — sie geben <b>+1 Stat als Teil des Feats</b> (markiert mit 🎯 in der Liste).</div>
                <div style={{ color: C.textDim, fontSize: 10 }}>↳ Background-ASI (Level 1, einmalig) ist eine andere Quelle — nicht zu verwechseln.</div>
              </div>

              {/* Toggle ASI / Feat */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[["asi", "📈 ASI (pures Stat-Plus)"], ["feat", "⭐ Feat (Fähigkeit)"]].map(([mode, label]) => (
                  <button key={mode} onClick={() => setAsiMode(mode)} style={{
                    flex: 1, padding: "7px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
                    border: `1px solid ${asiMode === mode ? C.greenBright : C.border}`,
                    background: asiMode === mode ? `${C.greenBright}22` : "transparent",
                    color: asiMode === mode ? C.greenBright : C.textDim,
                  }}>{label}</button>
                ))}
              </div>

              {asiMode === "asi" && (
                <div>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Wähle 1–2 Attribute (+1 je Attribut, max. 20):</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {ABS_LIST.map(ab => {
                      const val = char[ab.toLowerCase()] || 10;
                      const isA = asiA === ab, isB = asiB === ab;
                      const selected = isA || isB;
                      return (
                        <button key={ab} onClick={() => {
                          if (isA) { setAsiA(asiB); setAsiB(""); }
                          else if (isB) setAsiB("");
                          else if (!asiA) setAsiA(ab);
                          else if (!asiB) setAsiB(ab);
                        }} style={{
                          padding: "9px 12px", borderRadius: 8, cursor: val >= 20 ? "default" : "pointer",
                          border: `1px solid ${selected ? C.greenBright : C.border}`,
                          background: selected ? `${C.greenBright}22` : "transparent",
                          color: selected ? C.greenBright : val >= 20 ? C.textDim : C.text,
                          fontFamily: FH, fontSize: 12, fontWeight: 700,
                          minHeight: 40,
                          opacity: val >= 20 ? 0.4 : 1,
                        }}>
                          {ab} {val}{selected ? ` → ${Math.min(20, val + 1)}` : ""}
                        </button>
                      );
                    })}
                  </div>
                  {!asiA && !asiB && <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>Kein Attribut gewählt — Erhöhung wird beim Level-Up übersprungen.</div>}
                </div>
              )}

              {asiMode === "feat" && (
                <div>
                  {/* Epic Boon Banner für Lv19 */}
                  {isEpicLevel && (
                    <div style={{
                      background: `linear-gradient(135deg, ${C.amberBright}22 0%, ${C.gold}11 100%)`,
                      border: `2px solid ${C.amberBright}`,
                      borderRadius: 10, padding: "10px 14px", marginBottom: 10,
                      boxShadow: `0 0 16px ${C.amberBright}44`,
                    }}>
                      <div style={{ fontFamily: FH, fontSize: 14, color: C.amberBright, fontWeight: 700, marginBottom: 4, letterSpacing: 0.6 }}>
                        🌟 EPIC BOON LEVEL (PHB 2024)
                      </div>
                      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                        Auf Lv19 wählst du statt eines normalen ASI/Feats einen <b>Epic Boon</b> — extrem mächtige Fähigkeiten, die Stats <b>bis 30</b> erlauben. Allgemeine Feats bleiben auch wählbar.
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>
                    Wähle ein Feat — <span style={{ color: C.amberBright }}>🎯 = Half-Feat (+1 Stat)</span>
                    {isEpicLevel && <span> · <span style={{ color: C.amberBright, fontWeight: 700 }}>🌟 = Epic Boon</span></span>}
                  </div>
                  <select value={featId} onChange={e => setFeatId(e.target.value)} style={{ ...sx.sel, width: "100%" }}>
                    <option value="">— Feat wählen —</option>
                    {/* Epic Boons zuerst auf Lv19 */}
                    {isEpicLevel && (
                      <optgroup label="🌟 Epic Boons (PHB 2024 Lv19)">
                        {availableFeats.filter(f => f.category === "epic_boon").map(f => {
                          const halfStats = getHalfFeatStats(f);
                          const halfMark = halfStats.length ? `🎯 ` : "";
                          return (
                            <option key={f.id} value={f.id}>
                              🌟 {halfMark}{f.name}
                            </option>
                          );
                        })}
                      </optgroup>
                    )}
                    <optgroup label={isEpicLevel ? "Allgemeine Feats (auch wählbar)" : "Allgemeine Feats"}>
                      {availableFeats.filter(f => f.category !== "epic_boon").map(f => {
                        const halfStats = getHalfFeatStats(f);
                        const halfMark = halfStats.length ? `🎯 [+1 ${halfStats.join("/")}] ` : "";
                        return (
                          <option key={f.id} value={f.id}>
                            {halfMark}{f.name}{f.prerequisite ? ` (${f.prerequisite})` : ""}
                          </option>
                        );
                      })}
                    </optgroup>
                  </select>
                  {featId && (() => {
                    const f = availableFeats.find(x => x.id === featId);
                    if (!f) return null;
                    const halfStats = getHalfFeatStats(f);
                    const isEpic = f.category === "epic_boon";
                    return (
                      <div style={{ marginTop: 8 }}>
                        {isEpic && (
                          <div style={{
                            background: `${C.amberBright}15`, border: `1px solid ${C.amberBright}55`, borderLeft: `3px solid ${C.amberBright}`,
                            borderRadius: 6, padding: "6px 10px", marginBottom: 6, fontSize: 11, color: C.amberBright, fontWeight: 700,
                          }}>
                            🌟 Epic Boon: Mächtige Lv19-Fähigkeit. Stat-Bumps gehen bis <b>30</b> (statt 20).
                          </div>
                        )}
                        {halfStats.length > 0 && (
                          <div style={{
                            background: `${C.amber}15`, border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amberBright}`,
                            borderRadius: 6, padding: "6px 10px", marginBottom: 6, fontSize: 11, color: C.amberBright, fontWeight: 700,
                          }}>
                            🎯 Half-Feat: Du erhältst <b>+1 auf {halfStats.join(" oder ")}</b> zusätzlich zur Fähigkeit (max {isEpic ? 30 : 20}).
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: C.text, background: C.surface, padding: "8px 10px", borderRadius: 6 }}>
                          {lang === "en" && f.descriptionEN ? f.descriptionEN : f.description}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
          {newPbFeature && (
            <div style={featureBox(C.gold)}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, marginBottom: 3 }}>🎖️ Übungsbonus steigt: +{pbOld} → +{pb}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>Alle Proben, Angriffe und DCs mit PB werden stärker.</div>
            </div>
          )}
          {classFeatures.length > 0 ? classFeatures.map((f, i) => (
            <div key={i} style={featureBox(C.purple)}>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700, marginBottom: 3 }}>{f.n}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{f.d}</div>
            </div>
          )) : !isAsi && !newPbFeature && (
            <div style={{ fontSize: 13, color: C.textDim, fontStyle: "italic" }}>Kein generelles Feature auf Level {newLevel} — prüfe deine Unterklasse im Regelwerk.</div>
          )}
        </div>
      </div>

      {/* 3. Zauberplätze */}
      {renderSpellSlots()}

      {/* 4. Erinnerungen */}
      <div style={{ ...sx.card, background: `${C.amber}0d`, border: `2px solid ${C.amber}50` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.amberBright, fontWeight: 700 }}>
            {casterType ? "4." : "3."} Checkliste für Level {newLevel}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {reminders.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: `${C.amber}08`, border: `1px solid ${C.amber}25`, borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{tip.split(" ")[0]}</span>
              <span style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>{tip.slice(tip.indexOf(" ") + 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bestätigen */}
      <div style={{ ...sx.card, background: `${C.green}10`, border: `1px solid ${C.green}40` }}>
        <div style={{ ...sx.jb, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 14, color: C.greenBright, fontWeight: 700 }}>Level-Up bestätigen</div>
            <div style={{ fontSize: 12, color: C.textDim }}>Level {char.level} → {newLevel} · Max HP +{chosenHp} ({char.maxHp} → {char.maxHp + chosenHp}) · PB +{pb}</div>
          </div>
          <button onClick={doLevelUp} style={{ ...sx.btn(C.green), fontSize: 13, padding: "10px 20px" }}>⬆️ Jetzt Level-Up durchführen</button>
        </div>
      </div>

      {!confirmReset ? (
        <div style={{ textAlign: "center", paddingBottom: 8 }}>
          <button onClick={() => setConfirmReset(true)} style={{ ...sx.bsm(C.red), fontSize: 11 }}>↩️ Auf Level 1 zurücksetzen</button>
        </div>
      ) : (
        <div style={{ ...sx.card, background: `${C.red}0d`, border: `1px solid ${C.red}40` }}>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.redBright, fontWeight: 700, marginBottom: 6 }}>⚠️ Wirklich auf Level 1 zurücksetzen?</div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            Level → 1 · Max HP → {hdNum + conMod} ({char.hd} Max + CON) · HD zurückgesetzt
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={doReset} style={{ ...sx.btn(C.red), fontSize: 12 }}>↩️ Ja, zurücksetzen</button>
            <button onClick={() => setConfirmReset(false)} style={sx.bsm(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Style-Helfer ─────────────────────────────────────────────────────────────
const featureBox = (col) => ({
  background: `${col}0a`, border: `1px solid ${col}20`, borderLeft: `3px solid ${col}`,
  borderRadius: 8, padding: "8px 12px",
});
const slotBox = (col) => ({
  background: `${col}12`, border: `1px solid ${col}25`, borderRadius: 8,
  padding: "8px 14px", textAlign: "center", minWidth: 60,
});
