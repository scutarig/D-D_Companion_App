import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useFighter } from "../../hooks/useFighter.js";
import { useChar } from "../../context/CharContext.jsx";
import { rollInitiative } from "../../utils/rolls.js";
import { sortByInitiative } from "../../utils/combat.js";
import { MONSTERS as Bestiary } from "../../data/monsters.js";
import PresetManager from "./PresetManager.jsx";

// ─── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({ color, icon, title, action }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingBottom: 10, marginBottom: 12,
    borderBottom: `2px solid ${color}40`,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: FH, fontSize: 14, color, fontWeight: 700, letterSpacing: 0.5 }}>{title}</span>
    </div>
    {action}
  </div>
);

export default function CombatInitiativeView({ onStartCombat }) {
  const { state, setState } = useCombat();
  const { startCombat } = useCombatActions();
  const { addFighter } = useFighter();
  const { chars } = useChar();

  // Player section state
  const [selectedChars, setSelectedChars] = useState([]);
  const [showManualPlayer, setShowManualPlayer] = useState(false);
  const [manualPlayer, setManualPlayer] = useState({ name: "", hp: "20", ac: "10", initiativeBonus: "0", speed: "30" });

  // Enemy section state
  const [showBestiary, setShowBestiary] = useState(false);
  const [showManualEnemy, setShowManualEnemy] = useState(false);
  const [bestiarySearch, setBestiarySearch] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterCount, setMonsterCount] = useState(1);
  const [manualEnemy, setManualEnemy] = useState({ name: "", hp: "10", ac: "12", initiativeBonus: "0" });

  // Presets
  const [showPresets, setShowPresets] = useState(false);

  // ── Add from app chars ────────────────────────────────────────────────────────
  const addSelectedChars = () => {
    selectedChars.forEach((charId) => {
      const char = chars.find((c) => c.id === charId);
      if (!char) return;
      addFighter({
        name: char.name,
        isPlayer: true,
        charRef: char.id,
        hp: char.hp || char.maxHp,
        maxHp: char.maxHp || char.hp,
        ac: char.ac,
        initiativeBonus: Math.floor(((char.dex || 10) - 10) / 2),
        speed: char.speed || 30,
        klass: char.klass,
        level: char.level,
        spellAbility: char.spellAbility || null,
        spellDC: char.spellDC || null,
        spellAtk: char.spellAtk || null,
        // Phase 6: Ability scores & proficiencies
        abilityScores: {
          STR: char.str || 10,
          DEX: char.dex || 10,
          CON: char.con || 10,
          INT: char.int || 10,
          WIS: char.wis || 10,
          CHA: char.cha || 10,
        },
        saveProficiencies: char.saves || {},
        skillProficiencies: char.skills || {},
      });
    });
    setSelectedChars([]);
  };

  // ── Manual player ─────────────────────────────────────────────────────────────
  const addManualPlayer = () => {
    if (!manualPlayer.name.trim()) return;
    const hp = parseInt(manualPlayer.hp) || 10;
    addFighter({
      name: manualPlayer.name.trim(),
      isPlayer: true,
      hp,
      maxHp: hp,
      ac: parseInt(manualPlayer.ac) || 10,
      initiativeBonus: parseInt(manualPlayer.initiativeBonus) || 0,
      speed: parseInt(manualPlayer.speed) || 30,
    });
    setManualPlayer({ name: "", hp: "20", ac: "10", initiativeBonus: "0", speed: "30" });
    setShowManualPlayer(false);
  };

  // ── Manual enemy ──────────────────────────────────────────────────────────────
  const addManualEnemy = () => {
    if (!manualEnemy.name.trim()) return;
    const hp = parseInt(manualEnemy.hp) || 10;
    addFighter({
      name: manualEnemy.name.trim(),
      isPlayer: false,
      hp,
      maxHp: hp,
      ac: parseInt(manualEnemy.ac) || 10,
      initiativeBonus: parseInt(manualEnemy.initiativeBonus) || 0,
    });
    setManualEnemy({ name: "", hp: "10", ac: "12", initiativeBonus: "0" });
    setShowManualEnemy(false);
  };

  // ── Bestiary ──────────────────────────────────────────────────────────────────
  const addFromBestiary = () => {
    if (!selectedMonster) return;
    for (let i = 0; i < monsterCount; i++) {
      addFighter({
        name: selectedMonster.name,
        isPlayer: false,
        hp: selectedMonster.hp,
        maxHp: selectedMonster.hp,
        ac: selectedMonster.ac,
        initiativeBonus: selectedMonster.initiativeBonus || 0,
        monsterRef: selectedMonster.id,
      });
    }
    setSelectedMonster(null);
    setMonsterCount(1);
    setBestiarySearch("");
  };

  // ── Utilities ─────────────────────────────────────────────────────────────────
  const removeFighter = (id) => {
    setState((prev) => ({ ...prev, fighters: prev.fighters.filter((f) => f.id !== id) }));
  };

  const setFighterInitiative = (id, val) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f) =>
        f.id === id ? { ...f, initiative: parseInt(val) || 0 } : f
      ),
    }));
  };

  const rollAllInitiative = () => {
    setState((prev) => {
      const updated = prev.fighters.map((f) => ({
        ...f,
        initiative: rollInitiative(f.initiativeBonus).total,
      }));
      return { ...prev, fighters: sortByInitiative(updated) };
    });
  };

  const handleStartCombat = () => {
    if (state.fighters.length === 0) return;
    startCombat();
    onStartCombat?.();
  };

  const filteredMonsters = Bestiary.filter((m) =>
    m.name.toLowerCase().includes(bestiarySearch.toLowerCase())
  ).slice(0, 15);

  const players = state.fighters.filter((f) => f.isPlayer);
  const enemies = state.fighters.filter((f) => !f.isPlayer);
  const allHaveInit = state.fighters.length > 0 && state.fighters.every((f) => f.initiative > 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 90px 0" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg,#2a1040,#1a0a28)",
        border: `1px solid ${C.purple}35`,
        borderRadius: 16,
        padding: "18px 20px",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 40 }}>⚔️</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 20, color: C.purpleBright, fontWeight: 700, letterSpacing: 1 }}>
              Kampf starten
            </div>
            <div style={{ fontSize: 13, color: C.textDim, marginTop: 2 }}>
              Charaktere wählen · Initiative würfeln · Los!
            </div>
          </div>
        </div>
        <button onClick={() => setShowPresets(!showPresets)} style={{ ...sx.bsm(C.amber), padding: "8px 12px", fontSize: 12 }}>
          💾 Presets
        </button>
      </div>

      {showPresets && (
        <div style={{ marginBottom: 16 }}>
          <PresetManager onClose={() => setShowPresets(false)} />
        </div>
      )}

      {/* ── SPIELER ─────────────────────────────────────────────────────────────── */}
      <div style={{ ...sx.card, borderLeft: `4px solid ${C.blue}`, marginBottom: 12 }}>
        <SectionHead color={C.blueBright} icon="👤" title="Spieler-Charaktere" />

        {/* From app chars */}
        {chars.length > 0 && (
          <>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Aus der App:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              {chars.map((char) => {
                const checked = selectedChars.includes(char.id);
                const alreadyAdded = state.fighters.some((f) => f.charRef === char.id);
                return (
                  <label key={char.id} style={{
                    display: "flex", alignItems: "center", gap: 10, cursor: alreadyAdded ? "default" : "pointer",
                    padding: "8px 12px", borderRadius: 8,
                    background: alreadyAdded ? `${C.green}10` : checked ? `${C.blue}12` : C.surface,
                    border: `1px solid ${alreadyAdded ? C.green + "40" : checked ? C.blue + "55" : C.border}`,
                    opacity: alreadyAdded ? 0.65 : 1,
                    transition: "all .15s",
                  }}>
                    {alreadyAdded ? (
                      <span style={{ fontSize: 16, color: C.greenBright }}>✓</span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setSelectedChars((p) => e.target.checked ? [...p, char.id] : p.filter((id) => id !== char.id))}
                        style={{ width: 17, height: 17, cursor: "pointer", accentColor: C.blue }}
                      />
                    )}
                    <span style={{ flex: 1, fontSize: 14, color: C.textBright, fontWeight: checked ? 700 : 400 }}>{char.name}</span>
                    <span style={{ fontSize: 12, color: C.textDim }}>Lv{char.level}</span>
                    <span style={{ fontSize: 12, color: C.amberBright }}>AC {char.ac}</span>
                    <span style={{ fontSize: 12, color: C.greenBright }}>HP {char.maxHp}</span>
                    {alreadyAdded && <span style={{ fontSize: 10, color: C.greenBright, fontStyle: "italic" }}>bereits dabei</span>}
                  </label>
                );
              })}
            </div>
            {selectedChars.length > 0 && (
              <button onClick={addSelectedChars} style={{ ...sx.btn(C.blue), width: "100%", marginBottom: 10, padding: "10px", fontSize: 13 }}>
                👤 {selectedChars.length} Charakter{selectedChars.length > 1 ? "e" : ""} hinzufügen
              </button>
            )}
          </>
        )}
        {chars.length === 0 && (
          <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>Keine App-Charaktere vorhanden</div>
        )}

        {/* Manual player button */}
        <button
          onClick={() => setShowManualPlayer(!showManualPlayer)}
          style={{
            width: "100%", padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, transition: "all .15s",
            background: showManualPlayer ? `${C.teal}18` : "transparent",
            border: `1px dashed ${showManualPlayer ? C.teal : C.border}`,
            color: showManualPlayer ? C.tealBright : C.textDim,
          }}
        >
          {showManualPlayer ? "✕ Abbrechen" : "＋ Spieler manuell hinzufügen"}
        </button>

        {showManualPlayer && (
          <div style={{ marginTop: 10, background: `${C.teal}0a`, border: `1px solid ${C.teal}25`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 14, color: C.tealBright, fontWeight: 700, marginBottom: 12 }}>👤 Neuer Spieler-Charakter</div>
            <div style={{ marginBottom: 10 }}>
              <label style={sx.lbl}>Name *</label>
              <input
                type="text"
                value={manualPlayer.name}
                onChange={(e) => setManualPlayer((p) => ({ ...p, name: e.target.value }))}
                placeholder="z.B. Aragorn"
                style={{ ...sx.inp, fontSize: 14 }}
                onKeyDown={(e) => e.key === "Enter" && addManualPlayer()}
                autoFocus
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { key: "hp", label: "Max HP" },
                { key: "ac", label: "Rüstung (AC)" },
                { key: "initiativeBonus", label: "Init Bonus" },
                { key: "speed", label: "Speed (ft)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={sx.lbl}>{label}</label>
                  <input
                    type="number"
                    value={manualPlayer[key]}
                    onChange={(e) => setManualPlayer((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ ...sx.inp, fontSize: 13 }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addManualPlayer}
              disabled={!manualPlayer.name.trim()}
              style={{
                ...sx.btn(C.teal), width: "100%", padding: "11px", fontSize: 14,
                opacity: manualPlayer.name.trim() ? 1 : 0.4,
              }}
            >
              ＋ Spieler hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* ── GEGNER ──────────────────────────────────────────────────────────────── */}
      <div style={{ ...sx.card, borderLeft: `4px solid ${C.red}`, marginBottom: 12 }}>
        <SectionHead color={C.redBright} icon="💀" title="Gegner / Feinde" />

        {/* Bestiary */}
        <button
          onClick={() => { setShowBestiary(!showBestiary); if (showManualEnemy) setShowManualEnemy(false); }}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .15s",
            background: showBestiary ? `${C.red}18` : `${C.red}08`,
            border: `1px solid ${showBestiary ? C.red + "55" : C.red + "25"}`,
            color: showBestiary ? C.redBright : C.text,
            marginBottom: 8,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span>📚 Aus dem Bestiary wählen</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>{showBestiary ? "▲ Schließen" : "▼ Öffnen"}</span>
        </button>

        {showBestiary && (
          <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
            <input
              type="text"
              value={bestiarySearch}
              onChange={(e) => { setBestiarySearch(e.target.value); setSelectedMonster(null); }}
              placeholder="🔍 Monster suchen (z.B. Goblin, Orc...)"
              style={{ ...sx.inp, fontSize: 13, marginBottom: 8 }}
              autoFocus
            />
            {filteredMonsters.length > 0 && (
              <div style={{ maxHeight: 160, overflowY: "auto", borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                {filteredMonsters.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMonster(selectedMonster?.id === m.id ? null : m)}
                    style={{
                      padding: "9px 12px", borderBottom: `1px solid ${C.border}40`, cursor: "pointer",
                      background: selectedMonster?.id === m.id ? `${C.red}22` : "transparent",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "background .1s",
                    }}
                  >
                    <span style={{ fontSize: 13, color: selectedMonster?.id === m.id ? C.redBright : C.textBright, fontWeight: selectedMonster?.id === m.id ? 700 : 400 }}>
                      {m.name}
                    </span>
                    <span style={{ fontSize: 11, color: C.textDim }}>HP {m.hp} · AC {m.ac}</span>
                  </div>
                ))}
              </div>
            )}
            {bestiarySearch && filteredMonsters.length === 0 && (
              <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: 8 }}>Kein Monster gefunden</div>
            )}
            {selectedMonster && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", background: `${C.red}12`, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ flex: 1, fontSize: 13, color: C.redBright, fontWeight: 700 }}>{selectedMonster.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: C.textDim }}>Anzahl:</span>
                  <input
                    type="number" min={1} max={20}
                    value={monsterCount}
                    onChange={(e) => setMonsterCount(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ ...sx.inp, width: 60, fontSize: 13, padding: "6px 8px" }}
                  />
                </div>
                <button onClick={addFromBestiary} style={{ ...sx.btn(C.red), padding: "8px 14px", fontSize: 13 }}>
                  ＋ Hinzufügen
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual enemy */}
        <button
          onClick={() => { setShowManualEnemy(!showManualEnemy); if (showBestiary) setShowBestiary(false); }}
          style={{
            width: "100%", padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, transition: "all .15s",
            background: showManualEnemy ? `${C.amber}18` : "transparent",
            border: `1px dashed ${showManualEnemy ? C.amber : C.border}`,
            color: showManualEnemy ? C.amberBright : C.textDim,
          }}
        >
          {showManualEnemy ? "✕ Abbrechen" : "＋ Gegner manuell hinzufügen"}
        </button>

        {showManualEnemy && (
          <div style={{ marginTop: 10, background: `${C.amber}0a`, border: `1px solid ${C.amber}25`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 14, color: C.amberBright, fontWeight: 700, marginBottom: 12 }}>💀 Neuer Gegner</div>
            <div style={{ marginBottom: 10 }}>
              <label style={sx.lbl}>Name *</label>
              <input
                type="text"
                value={manualEnemy.name}
                onChange={(e) => setManualEnemy((p) => ({ ...p, name: e.target.value }))}
                placeholder="z.B. Bandit"
                style={{ ...sx.inp, fontSize: 14 }}
                onKeyDown={(e) => e.key === "Enter" && addManualEnemy()}
                autoFocus
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[{ key: "hp", label: "Max HP" }, { key: "ac", label: "Rüstung (AC)" }, { key: "initiativeBonus", label: "Init Bonus" }].map(({ key, label }) => (
                <div key={key}>
                  <label style={sx.lbl}>{label}</label>
                  <input
                    type="number"
                    value={manualEnemy[key]}
                    onChange={(e) => setManualEnemy((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ ...sx.inp, fontSize: 13 }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addManualEnemy}
              disabled={!manualEnemy.name.trim()}
              style={{
                ...sx.btn(C.amber), width: "100%", padding: "11px", fontSize: 14, color: C.bg,
                opacity: manualEnemy.name.trim() ? 1 : 0.4,
              }}
            >
              ＋ Gegner hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* ── KÄMPFER-LISTE ─────────────────────────────────────────────────────────── */}
      {state.fighters.length > 0 && (
        <div style={{ ...sx.card, marginBottom: 12 }}>
          <SectionHead
            color={C.gold}
            icon="🎲"
            title={`Kämpfer (${state.fighters.length})`}
            action={
              <button
                onClick={rollAllInitiative}
                style={{ ...sx.btn(C.amber), padding: "7px 14px", fontSize: 12, color: C.bg }}
              >
                🎲 Alle würfeln
              </button>
            }
          />

          {players.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.blueBright, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>👤 SPIELER</div>
              {players.map((f) => (
                <FighterRow key={f.id} fighter={f} color={C.blue}
                  onRemove={() => removeFighter(f.id)}
                  onInitChange={(val) => setFighterInitiative(f.id, val)}
                />
              ))}
            </div>
          )}

          {enemies.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: C.redBright, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>💀 GEGNER</div>
              {enemies.map((f) => (
                <FighterRow key={f.id} fighter={f} color={C.red}
                  onRemove={() => removeFighter(f.id)}
                  onInitChange={(val) => setFighterInitiative(f.id, val)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── EMPTY STATE ──────────────────────────────────────────────────────────── */}
      {state.fighters.length === 0 && (
        <div style={{
          textAlign: "center", padding: "32px 0", color: C.textDim,
          border: `2px dashed ${C.border}`, borderRadius: 14,
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⚔️</div>
          <div style={{ fontSize: 15, marginBottom: 4 }}>Noch keine Kämpfer</div>
          <div style={{ fontSize: 13 }}>Füge oben Spieler und Gegner hinzu</div>
        </div>
      )}

      {/* ── STICKY START BUTTON ──────────────────────────────────────────────────── */}
      {state.fighters.length > 0 && (
        <div style={{
          position: "sticky", bottom: 0,
          background: `linear-gradient(to top, ${C.bg} 80%, transparent)`,
          padding: "16px 0 4px",
        }}>
          {!allHaveInit && (
            <div style={{ fontSize: 11, color: C.amberBright, textAlign: "center", marginBottom: 6 }}>
              ⚠ Initiative noch nicht gewürfelt — oder manuell oben eingeben
            </div>
          )}
          <button
            onClick={handleStartCombat}
            style={{
              width: "100%",
              ...sx.btn(C.purple),
              padding: "15px 20px",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.5,
              boxShadow: `0 4px 24px ${C.purple}55`,
            }}
          >
            ▶ Kampf starten — {state.fighters.length} Kämpfer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Fighter row in the list ──────────────────────────────────────────────────
function FighterRow({ fighter, color, onRemove, onInitChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: `${color}0a`, border: `1px solid ${color}25`,
      borderRadius: 8, padding: "8px 12px", marginBottom: 6,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: C.textBright, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fighter.name}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>HP {fighter.hp}/{fighter.maxHp}</span>
          <span style={{ fontSize: 11, color: C.amberBright }}>AC {fighter.ac}</span>
          <span style={{ fontSize: 11, color: C.textDim }}>+{fighter.initiativeBonus} Init</span>
        </div>
      </div>

      {/* Initiative input */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 0.5 }}>INIT</span>
        <input
          type="number"
          value={fighter.initiative || ""}
          onChange={(e) => onInitChange(e.target.value)}
          placeholder="—"
          style={{
            ...sx.inp, width: 52, padding: "5px 6px", fontSize: 14, fontWeight: 700,
            textAlign: "center",
            color: fighter.initiative > 0 ? C.gold : C.textDim,
            borderColor: fighter.initiative > 0 ? `${C.gold}50` : undefined,
          }}
        />
      </div>

      <button
        onClick={onRemove}
        style={{
          width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.red}40`,
          background: `${C.red}12`, color: C.redBright, cursor: "pointer",
          fontSize: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
}
