import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useCombatArchive } from "../../hooks/useCombatArchive.js";
import { t } from "../../i18n/index.js";
import TurnOrderPanel from "./TurnOrderPanel.jsx";
import ActiveFighterCard from "./ActiveFighterCard.jsx";
import ActionEconomyBar from "./ActionEconomyBar.jsx";
import QuickActionBar from "./QuickActionBar.jsx";
import CombatLogPanel from "./CombatLogPanel.jsx";
import CombatArchive from "./CombatArchive.jsx";
import { UndoRedoButtons } from "./TurnManagerLandscape.jsx";

export default function TurnManagerDesktop() {
  const { state, undo, redo, canUndo, canRedo } = useCombat();
  const { endTurn, endCombat, checkVictoryCondition } = useCombatActions();
  const { archives } = useCombatArchive();
  const [archiveOpen, setArchiveOpen] = useState(false);

  const handleEndTurn = () => {
    endTurn();
  };

  const handleEndCombat = () => {
    if (confirm(t("combat.confirm_end","Kampf beenden?"))) {
      endCombat();
    }
  };

  const isVictory = checkVictoryCondition();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr 320px",
        gap: 12,
        padding: 14,
        height: "100%",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* LEFT: Turn Order */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", minHeight: 0 }}>
        {/* Header */}
        <div style={{ ...sx.card, background: `${C.purple}08`, border: `1px solid ${C.purple}25`, padding: "10px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700, marginBottom: 2 }}>
                ⚔️ Runde {state.round}
              </div>
              <div style={{ fontSize: 11, color: C.textDim }}>
                {state.fighters.length} Kämpfer
              </div>
            </div>
            <button
              onClick={() => setArchiveOpen(true)}
              title="Kampf-Archiv"
              style={{ ...sx.bsm(C.gold), padding: "5px 9px", fontSize: 12, position: "relative" }}
            >
              🗂️{archives.length > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: C.gold, color: C.bg,
                  fontSize: 8, fontWeight: 700,
                  borderRadius: "50%", width: 14, height: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {archives.length > 9 ? "9+" : archives.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {archiveOpen && <CombatArchive onClose={() => setArchiveOpen(false)} />}

        {/* Turn Order */}
        <div style={sx.card}>
          <TurnOrderPanel />
        </div>
      </div>

      {/* CENTER: Active Fighter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0, overflow: "hidden" }}>
        {/* Top: Fighter Card + Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Fighter Card */}
          <ActiveFighterCard />

          {/* Action Economy */}
          <div style={sx.card}>
            <div style={{ ...sx.ct, marginBottom: 10 }}>⚙️ Action Economy</div>
            <ActionEconomyBar />
          </div>

          {/* Quick Actions */}
          <div style={sx.card}>
            <div style={{ ...sx.ct, marginBottom: 10 }}>🎯 Quick Actions</div>
            <QuickActionBar onActionClick={() => {}} />
          </div>
        </div>

        {/* Bottom: Undo/Redo + End Turn + End Combat */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "auto", flexShrink: 0 }}>
          {/* Undo / Redo row */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <UndoRedoButtons undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} small={false} />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {!isVictory && (
              <button
                onClick={handleEndTurn}
                style={{ flex: 1, ...sx.btn(C.green), fontSize: 14, padding: "12px 16px", fontWeight: 700 }}
              >
                ✓ End Turn ▶
              </button>
            )}
            {isVictory && (
              <div style={{ flex: 1, ...sx.btn(C.green), textAlign: "center", color: C.greenBright, fontSize: 14, fontWeight: 700 }}>
                🎉 Victory!
              </div>
            )}
            <button onClick={handleEndCombat} style={{ ...sx.bsm(C.red), padding: "10px 16px", fontSize: 12 }}>
              ⊗ End Combat
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Combat Log */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700 }}>
          📜 Combat Log
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CombatLogPanel />
        </div>
      </div>
    </div>
  );
}
