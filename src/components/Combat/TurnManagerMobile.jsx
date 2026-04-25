import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import TurnOrderPanel from "./TurnOrderPanel.jsx";
import ActiveFighterCard from "./ActiveFighterCard.jsx";
import ActionEconomyBar from "./ActionEconomyBar.jsx";
import QuickActionBar from "./QuickActionBar.jsx";
import CombatLogPanel from "./CombatLogPanel.jsx";

export default function TurnManagerMobile() {
  const { state } = useCombat();
  const { endTurn, endCombat, checkVictoryCondition } = useCombatActions();
  const [turnOrderOpen, setTurnOrderOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const handleEndTurn = () => {
    endTurn();
  };

  const handleEndCombat = () => {
    if (confirm("Kampf beenden?")) {
      endCombat();
    }
  };

  const isVictory = checkVictoryCondition();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: C.bg, padding: "12px" }}>
      {/* Header: Round + End Combat */}
      <div style={{ ...sx.card, background: `${C.purple}08`, border: `1px solid ${C.purple}25`, padding: "10px 12px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700 }}>
            ⚔️ Runde {state.round}
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {state.fighters.length} Kämpfer
          </div>
        </div>
        <button onClick={handleEndCombat} style={{ ...sx.bsm(C.red), fontSize: 11, padding: "6px 10px" }}>
          ⊗
        </button>
      </div>

      {/* Main: Active Fighter Card (scrollable center section) */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 12, minHeight: 0 }}>
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
          <QuickActionBar onActionClick={(actionId) => console.log("Action:", actionId)} />
        </div>
      </div>

      {/* Collapsible Sections */}
      {/* Turn Order Collapsible */}
      <div style={{ ...sx.card, marginBottom: 8 }}>
        <div
          onClick={() => setTurnOrderOpen(!turnOrderOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0",
          }}
        >
          <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700 }}>
            🎯 Turn Order
          </div>
          <span style={{ fontSize: 12, color: C.textDim }}>{turnOrderOpen ? "▼" : "▶"}</span>
        </div>
        {turnOrderOpen && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <TurnOrderPanel />
          </div>
        )}
      </div>

      {/* Combat Log Collapsible */}
      <div style={{ ...sx.card, marginBottom: 8, height: 200, display: "flex", flexDirection: "column" }}>
        <div
          onClick={() => setLogOpen(!logOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0",
            marginBottom: logOpen ? 8 : 0,
            borderBottom: logOpen ? `1px solid ${C.border}` : "none",
            paddingBottom: logOpen ? 8 : 0,
          }}
        >
          <div style={{ fontFamily: FH, fontSize: 12, color: C.textBright, fontWeight: 700 }}>
            📜 Combat Log
          </div>
          <span style={{ fontSize: 12, color: C.textDim }}>{logOpen ? "▼" : "▶"}</span>
        </div>
        {logOpen && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <CombatLogPanel />
          </div>
        )}
      </div>

      {/* Bottom: End Turn Button (sticky) */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {!isVictory && (
          <button
            onClick={handleEndTurn}
            style={{
              flex: 1,
              ...sx.btn(C.green),
              fontSize: 13,
              padding: "12px 16px",
              fontWeight: 700,
            }}
          >
            ✓ Next Turn
          </button>
        )}

        {isVictory && (
          <div style={{ flex: 1, ...sx.btn(C.green), textAlign: "center", color: C.greenBright, fontSize: 13, fontWeight: 700 }}>
            🎉 Victory!
          </div>
        )}
      </div>
    </div>
  );
}
