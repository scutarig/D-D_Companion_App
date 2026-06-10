import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { MONSTERS } from "../data/monsters.js";
import { useCombatArchive } from "../hooks/useCombatArchive.js";
import { useI18n } from "../i18n/index.js";

/**
 * Encounter Builder — DM-Mode Tool für Encounter-Design mit CR-Budget
 *
 * PHB 2024 / DMG 2024 Encounter Budget System:
 *   - Party-Level + Party-Size + Difficulty bestimmt XP-Budget
 *   - Monster werden per XP-Wert addiert
 *   - Multi-Monster-Factor erhöht das effektive XP
 *
 * Schwierigkeits-Schwellwerte (XP pro Char-Level):
 *   Easy / Moderate / Hard
 *
 * Speichert Encounters in localStorage als encounters_v1
 */

const CR_TO_NUM = (cr) => {
  if (!cr) return 0;
  if (cr === "1/8") return 0.125;
  if (cr === "1/4") return 0.25;
  if (cr === "1/2") return 0.5;
  return parseFloat(cr) || 0;
};

// PHB 2024 / DMG 2024 XP Thresholds pro Char-Level
const XP_THRESHOLDS = [
  // [Easy, Moderate, Hard] pro 1 Char
  { lv: 1,  easy: 50,   moderate: 75,    hard: 100   },
  { lv: 2,  easy: 100,  moderate: 150,   hard: 200   },
  { lv: 3,  easy: 150,  moderate: 225,   hard: 400   },
  { lv: 4,  easy: 250,  moderate: 375,   hard: 500   },
  { lv: 5,  easy: 500,  moderate: 750,   hard: 1100  },
  { lv: 6,  easy: 600,  moderate: 1000,  hard: 1400  },
  { lv: 7,  easy: 750,  moderate: 1300,  hard: 1700  },
  { lv: 8,  easy: 1000, moderate: 1700,  hard: 2100  },
  { lv: 9,  easy: 1300, moderate: 2000,  hard: 2600  },
  { lv: 10, easy: 1600, moderate: 2300,  hard: 3100  },
  { lv: 11, easy: 1900, moderate: 2900,  hard: 4100  },
  { lv: 12, easy: 2200, moderate: 3700,  hard: 4700  },
  { lv: 13, easy: 2600, moderate: 4200,  hard: 5400  },
  { lv: 14, easy: 2900, moderate: 4900,  hard: 6200  },
  { lv: 15, easy: 3300, moderate: 5400,  hard: 7800  },
  { lv: 16, easy: 3800, moderate: 6100,  hard: 9800  },
  { lv: 17, easy: 4500, moderate: 7200,  hard: 11700 },
  { lv: 18, easy: 5000, moderate: 8700,  hard: 14200 },
  { lv: 19, easy: 5500, moderate: 10700, hard: 17200 },
  { lv: 20, easy: 6400, moderate: 13200, hard: 22000 },
];

const getThreshold = (level) => XP_THRESHOLDS.find(t => t.lv === level) || XP_THRESHOLDS[0];

export default function EncounterBuilder() {
  const { t } = useI18n();
  const mob = useIsMobile(900);
  const [partyLevel, setPartyLevel] = usePersist("eb_party_level", 1);
  const [partySize, setPartySize] = usePersist("eb_party_size", 4);
  const [difficulty, setDifficulty] = useState("moderate"); // easy | moderate | hard
  const [encounter, setEncounter] = useState([]); // [{ monsterId, count }]
  const [search, setSearch] = useState("");
  const [savedEncounters, setSavedEncounters] = usePersist("encounters_v1", []);
  const { archives, deleteArchive } = useCombatArchive();
  const [showArchive, setShowArchive] = useState(false);

  // Budget calculations
  const threshold = getThreshold(partyLevel);
  const budgetTotal = threshold[difficulty] * partySize;

  // Current encounter XP (raw sum)
  const encounterXp = encounter.reduce((sum, e) => {
    const m = MONSTERS.find(x => x.id === e.monsterId);
    return sum + (m?.xp || 0) * e.count;
  }, 0);

  const budgetPct = budgetTotal > 0 ? Math.round((encounterXp / budgetTotal) * 100) : 0;
  const budgetColor =
    budgetPct < 50 ? C.green :
    budgetPct < 80 ? C.tealBright :
    budgetPct < 100 ? C.amber :
    budgetPct < 130 ? C.amberBright :
    C.red;

  const budgetLabel =
    budgetPct < 50  ? "Sehr leicht — könnte längere Encounter-Serie sein" :
    budgetPct < 80  ? "Leichter als geplant" :
    budgetPct < 110 ? `Ziel erreicht (${difficulty.toUpperCase()})` :
    budgetPct < 150 ? "Etwas härter als geplant" :
    "⚠️ DEUTLICH ÜBER BUDGET — möglicherweise TPK-Risiko";

  // Filter monsters by search
  const monsterChoices = MONSTERS
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.nameDE || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => CR_TO_NUM(a.cr) - CR_TO_NUM(b.cr));

  const addMonster = (m) => {
    setEncounter(prev => {
      const existing = prev.find(e => e.monsterId === m.id);
      if (existing) return prev.map(e => e.monsterId === m.id ? { ...e, count: e.count + 1 } : e);
      return [...prev, { monsterId: m.id, count: 1 }];
    });
  };
  const removeMonster = (m) => {
    setEncounter(prev => prev.map(e => e.monsterId === m.id ? { ...e, count: e.count - 1 } : e).filter(e => e.count > 0));
  };

  const clearEncounter = () => {
    if (window.confirm("Encounter wirklich leeren?")) setEncounter([]);
  };

  const saveEncounter = () => {
    const name = window.prompt("Encounter-Name?", `Lv${partyLevel} ${difficulty} (${encounter.length} Typen)`);
    if (!name) return;
    setSavedEncounters(p => [...p, { id: Date.now(), name, partyLevel, partySize, difficulty, monsters: encounter, xp: encounterXp }]);
  };

  const loadEncounter = (enc) => {
    setEncounter(enc.monsters);
    setPartyLevel(enc.partyLevel);
    setPartySize(enc.partySize);
    setDifficulty(enc.difficulty);
  };

  const deleteEncounter = (id) => {
    if (window.confirm("Gespeicherten Encounter löschen?")) {
      setSavedEncounters(p => p.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...sx.card, background: `linear-gradient(135deg,${C.purpleBright}10,rgba(0,0,0,0.2))`, borderLeft: `3px solid ${C.purpleBright}` }}>
        <div style={{ fontFamily: FH, fontSize: 14, color: C.purpleBright, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
          {t("encounter.title", "🎲 ENCOUNTER BUILDER · PHB 2024 / DMG 2024")}
        </div>

        {/* Party setup */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, marginBottom: 12 }}>
          <div>
            <label style={sx.lbl}>{t("encounter.party_level", "Party-Level")}</label>
            <input type="number" min={1} max={20} value={partyLevel}
              onChange={e => setPartyLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              style={sx.inp} />
          </div>
          <div>
            <label style={sx.lbl}>{t("encounter.party_size", "Party-Größe")}</label>
            <input type="number" min={1} max={10} value={partySize}
              onChange={e => setPartySize(Math.max(1, Math.min(10, parseInt(e.target.value) || 4)))}
              style={sx.inp} />
          </div>
          <div>
            <label style={sx.lbl}>{t("encounter.difficulty", "Schwierigkeit")}</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={sx.sel}>
              <option value="easy">{t("encounter.easy", "Leicht")}</option>
              <option value="moderate">{t("encounter.moderate", "Mittel")}</option>
              <option value="hard">{t("encounter.hard", "Schwer")}</option>
            </select>
          </div>
        </div>

        {/* Budget Display */}
        <div style={{
          background: `${budgetColor}11`,
          border: `1px solid ${budgetColor}55`,
          borderLeft: `4px solid ${budgetColor}`,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 6,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontFamily: FH, fontSize: 13, color: budgetColor, fontWeight: 700, letterSpacing: 0.4 }}>
              {t("encounter.xp_budget", "XP-BUDGET")}
            </div>
            <div style={{ fontFamily: FH, fontSize: 18, color: budgetColor, fontWeight: 700 }}>
              {encounterXp} / {budgetTotal} <span style={{ fontSize: 11, opacity: 0.7 }}>XP</span>
            </div>
          </div>
          <div style={{ background: C.surface, borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 6 }}>
            <div style={{
              width: `${Math.min(100, budgetPct)}%`,
              height: "100%",
              background: budgetColor,
              transition: "width .3s",
            }} />
          </div>
          <div style={{ fontSize: 11, color: budgetColor, fontStyle: "italic" }}>
            {budgetPct}% · {budgetLabel}
          </div>
        </div>
      </div>

      {/* Empty State Hint */}
      {encounter.length === 0 && (
        <div style={{
          ...sx.card,
          borderLeft: `3px solid ${C.amberBright}`,
          background: `${C.amberBright}08`,
          textAlign: "center",
          padding: "20px 24px",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, marginBottom: 6 }}>
            {t("encounter.empty_state_title", "Bereit für Encounter-Design")}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>
            {t("encounter.empty_state_desc", "Wähle unten Monster aus, um sie zum Encounter hinzuzufügen.")}
          </div>
        </div>
      )}

      {/* Current Encounter */}
      {encounter.length > 0 && (() => {
        // Compute quick-stats
        const totalMonsters = encounter.reduce((s,e)=>s+e.count,0);
        let totalHp = 0, totalAc = 0, count = 0;
        encounter.forEach(e => {
          const m = MONSTERS.find(x => x.id === e.monsterId);
          if (m) {
            totalHp += (m.hp || 0) * e.count;
            totalAc += (m.ac || 0) * e.count;
            count += e.count;
          }
        });
        const avgAc = count > 0 ? Math.round(totalAc / count) : 0;

        return (
        <div style={{ ...sx.card, borderLeft: `3px solid ${C.amberBright}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
            <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, letterSpacing: 0.4 }}>
              ⚔️ AKTUELLER ENCOUNTER ({totalMonsters} Monster)
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
              <span style={{ color: C.red }}>❤️ {totalHp} HP</span>
              <span style={{ color: C.blue }}>🛡️ Ø {avgAc} AC</span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={saveEncounter} style={{ ...sx.bsm(C.tealBright), fontSize: 10 }}>💾 Speichern</button>
              <button onClick={clearEncounter} style={{ ...sx.bsm(C.red), fontSize: 10 }}>🗑 Leeren</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {encounter.map(e => {
              const m = MONSTERS.find(x => x.id === e.monsterId);
              if (!m) return null;
              return (
                <div key={e.monsterId} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 10px",
                }}>
                  <button onClick={() => removeMonster(m)} style={{ ...sx.bsm(C.red), fontSize: 12, padding: "2px 8px", minWidth: 28 }}>−</button>
                  <div style={{ minWidth: 24, textAlign: "center", fontFamily: FH, fontSize: 14, fontWeight: 700, color: C.amberBright }}>{e.count}×</div>
                  <button onClick={() => addMonster(m)} style={{ ...sx.bsm(C.green), fontSize: 12, padding: "2px 8px", minWidth: 28 }}>+</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700 }}>
                      {m.nameDE || m.name}
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim }}>
                      CR {m.cr} · {m.xp} XP · {m.type}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.amber, fontWeight: 700 }}>
                    {(m.xp || 0) * e.count} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        );
      })()}

      {/* Monster Picker */}
      <div style={{ ...sx.card }}>
        <div style={{ fontFamily: FH, fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 8 }}>
          {t("encounter.add_monsters", "Monster hinzufügen")}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("ui.search_placeholder", "🔍 Suchen…")}
          style={{ ...sx.inp, marginBottom: 8 }}
        />
        <div style={{ maxHeight: mob ? "50vh" : 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {monsterChoices.slice(0, 80).map(m => (
            <div key={m.id} onClick={() => addMonster(m)} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "6px 10px", cursor: "pointer", transition: "all .15s",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700 }}>
                  {m.nameDE || m.name}
                </div>
                <div style={{ fontSize: 10, color: C.textDim }}>
                  CR {m.cr} · {m.xp} XP · {m.type}
                </div>
              </div>
              <button style={{ ...sx.btn(C.green), fontSize: 11, padding: "4px 12px" }}>+</button>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Archive Toggle + Section */}
      {archives.length > 0 && (
        <div style={{ ...sx.card, borderLeft: `3px solid ${C.red}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showArchive ? 8 : 0 }}>
            <div style={{ fontFamily: FH, fontSize: 13, color: C.red, fontWeight: 700 }}>
              {t("encounter.combat_archive", "📜 KAMPF-ARCHIV")} ({archives.length})
            </div>
            <button
              onClick={() => setShowArchive(!showArchive)}
              style={{ ...sx.bsm(C.red), fontSize: 10 }}
            >
              {showArchive ? "▲ Einklappen" : "▼ Anzeigen"}
            </button>
          </div>
          {showArchive && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, maxHeight: mob ? "40vh" : 300, overflowY: "auto" }}>
              {archives.map(a => {
                const survived = a.playersAlive || 0;
                const total = a.playerCount || 0;
                const defeated = a.enemiesDefeated || 0;
                const date = a.timestamp ? new Date(a.timestamp).toLocaleDateString("de-DE") : "—";
                const outcomeIcon = a.outcome === "victory" ? "🎉" : a.outcome === "defeat" ? "☠️" : "⊗";
                const outcomeColor = a.outcome === "victory" ? C.gold : a.outcome === "defeat" ? C.red : C.textDim;
                return (
                  <div key={a.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 12px",
                    borderLeft: `3px solid ${outcomeColor}`,
                  }}>
                    <div style={{ fontSize: 18 }}>{outcomeIcon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.name}
                      </div>
                      <div style={{ fontSize: 10, color: C.textDim }}>
                        {date} · {a.rounds} Runden · Spieler {survived}/{total} · Gegner besiegt {defeated}
                      </div>
                    </div>
                    <button onClick={() => { if (window.confirm("Archiv-Eintrag löschen?")) deleteArchive(a.id); }}
                      style={{ ...sx.bsm(C.red), fontSize: 10, padding: "2px 6px" }}>🗑</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Saved Encounters */}
      {savedEncounters.length > 0 && (
        <div style={{ ...sx.card, borderLeft: `3px solid ${C.tealBright}` }}>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.tealBright, fontWeight: 700, marginBottom: 8 }}>
            {t("encounter.saved_encounters", "💾 GESPEICHERTE BEGEGNUNGEN")} ({savedEncounters.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {savedEncounters.map(enc => (
              <div key={enc.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 10px",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700 }}>
                    {enc.name}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim }}>
                    Lv{enc.partyLevel} × {enc.partySize} · {enc.difficulty} · {enc.xp} XP · {enc.monsters.length} Typen
                  </div>
                </div>
                <button onClick={() => loadEncounter(enc)} style={{ ...sx.bsm(C.tealBright), fontSize: 10 }}>📂 Laden</button>
                <button onClick={() => deleteEncounter(enc.id)} style={{ ...sx.bsm(C.red), fontSize: 10 }}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
