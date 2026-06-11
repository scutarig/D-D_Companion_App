import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useCombatArchive } from "../../hooks/useCombatArchive.js";
import { useLayout } from "../../hooks/useLayout.js";
import { useI18n } from "../../i18n/index.js";
import TurnManagerDesktop from "./TurnManagerDesktop.jsx";
import TurnManagerMobile from "./TurnManagerMobile.jsx";
import TurnManagerLandscape from "./TurnManagerLandscape.jsx";

// ─── Shared stats block ───────────────────────────────────────────────────────
function CombatStats({ state }) {
  const { t } = useI18n();
  const players = state.fighters.filter((f) => f.isPlayer);
  const enemies  = state.fighters.filter((f) => !f.isPlayer);
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
      {[
        { label: t("combat.rounds_lbl","Runden"),      value: state.round,                             color: C.purple  },
        { label: t("combat.players_alive","Spieler am Leben"), value: `${players.filter(f => f.hp > 0).length}/${players.length}`, color: C.blue },
        { label: t("combat.enemies_defeated","Gegner besiegt"),   value: `${enemies.filter(f => f.hp <= 0).length}/${enemies.length}`, color: C.red },
      ].map(({ label, value, color }) => (
        <div key={label} style={{
          textAlign: "center", background: `${color}12`,
          border: `1px solid ${color}30`, borderRadius: 10, padding: "8px 16px", minWidth: 80,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: FH }}>{value}</div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Victory overlay ──────────────────────────────────────────────────────────
function VictoryOverlay({ onEndCombat }) {
  const { t } = useI18n();
  const { state } = useCombat();
  const { saveToArchive } = useCombatArchive();
  const [saved, setSaved] = useState(false);

  const handleSaveAndEnd = () => {
    saveToArchive(state, "victory");
    setSaved(true);
    setTimeout(() => onEndCombat(), 800);
  };

  return (
    <div style={overlayBg}>
      <div style={{ ...overlayCard, border: `2px solid ${C.gold}`, boxShadow: `0 0 60px ${C.gold}40` }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🎉</div>
        <div style={{ fontFamily: FH, fontSize: 24, color: C.gold, fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>
          {t("combat.victory_upper","VICTORY!")}
        </div>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 18 }}>
          {t("combat.victory_desc","Alle Feinde wurden besiegt!")}
        </div>

        <CombatStats state={state} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!saved ? (
            <button type="button"
              onClick={handleSaveAndEnd}
              style={{ ...sx.btn(C.gold), padding: "12px 28px", fontSize: 13, color: C.bg, fontWeight: 700 }}
            >
              {t("combat.save_and_end","💾 Speichern & Beenden")}
            </button>
          ) : (
            <div style={{ padding: "12px", textAlign: "center", color: C.greenBright, fontSize: 13, fontWeight: 700 }}>
              {t("combat.saved_ending","✓ Gespeichert! Wird beendet...")}
            </div>
          )}
          <button type="button"
            onClick={onEndCombat}
            style={{ ...sx.bsm(C.border), padding: "10px 20px", fontSize: 12, color: C.textDim }}
          >
            {t("combat.end_without_save","Ohne Speichern beenden")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Defeat overlay ───────────────────────────────────────────────────────────
function DefeatOverlay({ onEndCombat }) {
  const { t } = useI18n();
  const { state } = useCombat();
  const { saveToArchive } = useCombatArchive();
  const [saved, setSaved] = useState(false);

  const handleSaveAndEnd = () => {
    saveToArchive(state, "defeat");
    setSaved(true);
    setTimeout(() => onEndCombat(), 800);
  };

  return (
    <div style={overlayBg}>
      <div style={{ ...overlayCard, border: `2px solid ${C.red}`, boxShadow: `0 0 60px ${C.red}40` }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>☠️</div>
        <div style={{ fontFamily: FH, fontSize: 24, color: C.redBright, fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>
          {t("combat.defeat_upper","DEFEAT")}
        </div>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 18 }}>
          {t("combat.defeat_desc","Alle Spieler-Charaktere sind gefallen.")}
        </div>

        <CombatStats state={state} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!saved ? (
            <button type="button"
              onClick={handleSaveAndEnd}
              style={{ ...sx.btn(C.red), padding: "12px 28px", fontSize: 13, fontWeight: 700 }}
            >
              {t("combat.save_and_end","💾 Speichern & Beenden")}
            </button>
          ) : (
            <div style={{ padding: "12px", textAlign: "center", color: C.greenBright, fontSize: 13, fontWeight: 700 }}>
              {t("combat.saved_ending","✓ Gespeichert! Wird beendet...")}
            </div>
          )}
          <button type="button"
            onClick={onEndCombat}
            style={{ ...sx.bsm(C.border), padding: "10px 20px", fontSize: 12, color: C.textDim }}
          >
            {t("combat.end_without_save","Ohne Speichern beenden")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function TurnManagerView() {
  const { t } = useI18n();
  const { state } = useCombat();
  const { checkVictoryCondition, checkDefeatCondition, endCombat } = useCombatActions();
  const layout = useLayout();

  if (!state.isActive) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.textDim }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚔️</div>
          <div style={{ fontSize: 14 }}>{t("combat.not_active","Kampf nicht aktiv")}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{t("combat.go_to_combat_tab","Gehe zum Kampf-Tab um einen Kampf zu starten")}</div>
        </div>
      </div>
    );
  }

  const isVictory = checkVictoryCondition();
  const isDefeat  = checkDefeatCondition();

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {isVictory && <VictoryOverlay onEndCombat={endCombat} />}
      {!isVictory && isDefeat && <DefeatOverlay onEndCombat={endCombat} />}
      {layout === "portrait"  && <TurnManagerMobile />}
      {layout === "landscape" && <TurnManagerLandscape />}
      {layout === "desktop"   && <TurnManagerDesktop />}
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const overlayBg = {
  position: "absolute", inset: 0, zIndex: 500,
  background: "rgba(0,0,0,0.88)",
  display: "flex", alignItems: "center", justifyContent: "center",
};
const overlayCard = {
  background: "#1e1b22",
  borderRadius: 20, padding: "36px 32px",
  textAlign: "center", maxWidth: 360, width: "90%",
};
