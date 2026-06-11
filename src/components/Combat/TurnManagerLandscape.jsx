import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useI18n } from "../../i18n/index.js";
import TurnOrderPanel from "./TurnOrderPanel.jsx";
import ActiveFighterCard from "./ActiveFighterCard.jsx";
import ActionEconomyBar from "./ActionEconomyBar.jsx";
import QuickActionBar from "./QuickActionBar.jsx";
import CombatLogPanel from "./CombatLogPanel.jsx";

/**
 * TurnManagerLandscape — 2-column layout for mobile landscape (wide, short screens)
 * Left: Fighter card + actions + end turn
 * Right: Turn order + log
 */
export default function TurnManagerLandscape() {
  const { t } = useI18n();
  const { state, undo, redo, canUndo, canRedo } = useCombat();
  const { endTurn, endCombat, checkVictoryCondition } = useCombatActions();

  const isVictory = checkVictoryCondition();

  const handleEndTurn = () => endTurn();
  const handleEndCombat = () => { if (confirm(t("combat.confirm_end","Kampf beenden?"))) endCombat(); };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 220px",
      gap: 8,
      padding: 8,
      height: "100%",
      overflow: "hidden",
      background: C.bg,
    }}>

      {/* ── LEFT: Active Fighter + Actions ─────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 0, overflow: "hidden" }}>

        {/* Header row: round + undo/redo + end combat */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          background: `${C.purple}08`, border: `1px solid ${C.purple}25`,
          borderRadius: 8, padding: "5px 10px",
        }}>
          <div style={{ fontFamily: FH, fontSize: 12, color: C.purpleBright, fontWeight: 700, flex: 1 }}>
            ⚔️ {t("combat.round","Runde")} {state.round}
          </div>
          {/* Undo / Redo */}
          <UndoRedoButtons undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
          <button onClick={handleEndCombat} style={{ ...sx.bsm(C.red), fontSize: 10, padding: "4px 8px" }}>⊗</button>
        </div>

        {/* Fighter card — compact */}
        <div style={{ flexShrink: 0 }}>
          <ActiveFighterCard compact />
        </div>

        {/* Action Economy */}
        <div style={{ ...sx.card, padding: "6px 10px", flexShrink: 0 }}>
          <ActionEconomyBar compact />
        </div>

        {/* Quick Actions */}
        <div style={{ ...sx.card, padding: "6px 10px", flex: 1, minHeight: 0, overflowY: "auto" }}>
          <QuickActionBar onActionClick={() => {}} />
        </div>

        {/* End Turn */}
        <div style={{ flexShrink: 0 }}>
          {!isVictory ? (
            <button
              onClick={handleEndTurn}
              style={{ ...sx.btn(C.green), width: "100%", padding: "9px", fontSize: 13, fontWeight: 700 }}
            >
              ✓ {t("combat.next_turn","Next Turn")} ▶
            </button>
          ) : (
            <div style={{
              ...sx.btn(C.green), width: "100%", textAlign: "center",
              color: C.greenBright, fontSize: 13, fontWeight: 700,
            }}>
              🎉 {t("combat.victory","Victory!")}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Turn Order + Log ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 0, overflow: "hidden" }}>
        {/* Turn Order */}
        <div style={{ ...sx.card, padding: "6px 10px", flexShrink: 0, maxHeight: "45%", overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 4 }}>
            {t("combat.turn_order_upper","TURN ORDER")}
          </div>
          <TurnOrderPanel compact />
        </div>

        {/* Combat Log */}
        <div style={{ ...sx.card, padding: "6px 10px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 4, flexShrink: 0 }}>
            {t("combat.combat_log_upper","COMBAT LOG")}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CombatLogPanel compact />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Undo/Redo button group ────────────────────────────────────────────
export function UndoRedoButtons({ undo, redo, canUndo, canRedo, small = true }) {
  const { t } = useI18n();
  const btnStyle = (enabled) => ({
    padding: small ? "4px 8px" : "6px 12px",
    borderRadius: 6,
    border: `1px solid ${enabled ? C.blue + "55" : C.border}`,
    background: enabled ? `${C.blue}12` : "transparent",
    color: enabled ? C.blueBright : C.textDim,
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: small ? 11 : 12,
    fontWeight: 600,
    opacity: enabled ? 1 : 0.45,
    transition: "all .15s",
  });

  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button onClick={undo} disabled={!canUndo} title={t("combat.undo","Rückgängig (Strg+Z)")} style={btnStyle(canUndo)}>
        ⟲
      </button>
      <button onClick={redo} disabled={!canRedo} title={t("combat.redo","Wiederholen (Strg+Y)")} style={btnStyle(canRedo)}>
        ⟳
      </button>
    </div>
  );
}
