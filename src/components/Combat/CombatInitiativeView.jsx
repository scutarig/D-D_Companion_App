import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useFighter } from "../../hooks/useFighter.js";
import { useChar } from "../../context/CharContext.jsx";
import { rollInitiative } from "../../utils/rolls.js";
import { sortByInitiative, generateUniqueName } from "../../utils/combat.js";
import FighterAddForm from "./FighterAddForm.jsx";
import PresetManager from "./PresetManager.jsx";

export default function CombatInitiativeView({ onStartCombat }) {
  const { state, setState } = useCombat();
  const { startCombat } = useCombatActions();
  const { addFighter } = useFighter();
  const { chars } = useChar();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showPresets, setShowPresets] = useState(false);

  // Roll initiative for all fighters
  const doRollInitiative = () => {
    setState((prev) => {
      const updated = prev.fighters.map((fighter) => ({
        ...fighter,
        initiative: rollInitiative(fighter.initiativeBonus).total,
      }));
      return {
        ...prev,
        fighters: sortByInitiative(updated),
      };
    });
  };

  // Start combat (lock in initiative, go to turn manager)
  const handleStartCombat = () => {
    if (state.fighters.length === 0) {
      alert("Mindestens 1 Kämpfer hinzufügen!");
      return;
    }
    startCombat();
    onStartCombat?.();
  };

  // Add selected players to combat
  const addSelectedPlayers = () => {
    selectedPlayers.forEach((charId) => {
      const char = chars.find((c) => c.id === charId);
      if (char) {
        addFighter({
          name: char.name,
          isPlayer: true,
          charRef: char.id,
          hp: char.hp,
          maxHp: char.maxHp,
          ac: char.ac,
          initiativeBonus: Math.floor((char.dex - 10) / 2),
          speed: char.speed || 30,
        });
      }
    });
    setSelectedPlayers([]);
  };

  const removeFighter = (id) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.filter((f) => f.id !== id),
    }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...sx.card, background: "linear-gradient(135deg,rgba(220,53,69,0.1),rgba(0,0,0,0.2))", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>⚔️</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 18, color: C.amber, fontWeight: 700 }}>Kampf starten</div>
            <div style={{ fontSize: 13, color: C.textDim }}>Initiative würfeln, Gegner hinzufügen</div>
          </div>
        </div>
      </div>

      {/* Player Character Selection */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom: 12 }}>
          <div style={sx.ct}>👥 Spieler-Charaktere</div>
        </div>
        {chars.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim }}>Keine Charaktere verfügbar</div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {chars.map((char) => (
                <label key={char.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 0" }}>
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(char.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlayers((p) => [...p, char.id]);
                      } else {
                        setSelectedPlayers((p) => p.filter((id) => id !== char.id));
                      }
                    }}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 13, color: C.textBright }}>{char.name}</span>
                  <span style={{ fontSize: 11, color: C.textDim }}>Lv{char.level} · AC {char.ac}</span>
                </label>
              ))}
            </div>
            {selectedPlayers.length > 0 && (
              <button onClick={addSelectedPlayers} style={{ ...sx.btn(C.green), marginBottom: 10 }}>
                + {selectedPlayers.length} Char(s) hinzufügen
              </button>
            )}
          </>
        )}
      </div>

      {/* Add Fighters */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom: 12 }}>
          <div style={sx.ct}>➕ Gegner hinzufügen</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowAddForm(!showAddForm)} style={sx.bsm(C.blue)}>
              {showAddForm ? "✕ Abbrechen" : "➕ Manuell"}
            </button>
            <button onClick={() => setShowPresets(true)} style={sx.bsm(C.purple)}>
              💾 Presets
            </button>
          </div>
        </div>

        {showAddForm && <FighterAddForm onClose={() => setShowAddForm(false)} />}

        {showPresets && <PresetManager onClose={() => setShowPresets(false)} />}
      </div>

      {/* Fighter List (sorted by initiative) */}
      <div style={sx.card}>
        <div style={sx.ct}>⚔️ Kampf-Reihenfolge (nach Initiative)</div>
        {state.fighters.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>Noch keine Kämpfer — füge Charaktere oder Monster hinzu!</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {state.fighters.map((fighter, idx) => (
              <div key={fighter.id} style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...sx.jb, marginBottom: 4 }}>
                    <span style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700 }}>
                      {idx + 1}. {fighter.name}
                    </span>
                    <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>Init: {fighter.initiative}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim }}>
                    HP: {fighter.hp}/{fighter.maxHp} · AC: {fighter.ac} · Bonus: +{fighter.initiativeBonus}
                  </div>
                </div>
                <button
                  onClick={() => removeFighter(fighter.id)}
                  style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 12 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Initiative Roll Section */}
      <div style={{ ...sx.card, background: `${C.amber}0d`, border: `2px solid ${C.amber}50` }}>
        <div style={{ ...sx.jb, marginBottom: 12, alignItems: "center" }}>
          <div style={sx.ct}>🎲 Initiative würfeln</div>
          <button onClick={doRollInitiative} style={{ ...sx.btn(C.amber), fontSize: 13, padding: "8px 16px" }}>
            🎲 Roll Initiative
          </button>
        </div>

        {state.fighters.every((f) => f.initiative > 0) ? (
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            ✓ Initiative gewürfelt für alle Kämpfer. Fighters sind nach Initiative sortiert.
          </div>
        ) : (
          <div style={{ fontSize: 12, color: C.amberBright, marginBottom: 12 }}>
            Klick "Roll Initiative" um Initiative für alle zu würfeln und sie zu sortieren.
          </div>
        )}

        {/* Surprise Check (optional) */}
        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={state.surprise.enabled}
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  surprise: { ...prev.surprise, enabled: e.target.checked },
                }));
              }}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 13, color: C.purpleBright, fontWeight: 700 }}>Surprise aktivieren?</span>
          </label>
          {state.surprise.enabled && (
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
              (Wähle überraschte Gegner — sie skipping Turn 1)
            </div>
          )}
        </div>

        {/* Start Combat Button */}
        {state.fighters.length > 0 && state.fighters.every((f) => f.initiative > 0) && (
          <button
            onClick={handleStartCombat}
            style={{
              width: "100%",
              ...sx.btn(C.red),
              fontSize: 14,
              padding: "12px 20px",
              fontWeight: 700,
            }}
          >
            ▶ Kampf starten
          </button>
        )}
      </div>
    </div>
  );
}
