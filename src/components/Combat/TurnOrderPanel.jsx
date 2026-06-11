import { C, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useI18n } from "../../i18n/index.js";

export default function TurnOrderPanel() {
  const { t } = useI18n();
  const { state } = useCombat();

  if (state.fighters.length === 0) {
    return <div style={{ fontSize: 13, color: C.textDim, padding: "8px 0" }}>{t("combat.no_fighters_short","Keine Kämpfer")}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {state.fighters.map((fighter, idx) => {
        const isActive = idx === state.activeIndex;
        const isPast = idx < state.activeIndex;
        const isPlayer = fighter.isPlayer;
        const isDead = fighter.hp <= 0;
        const accentColor = isPlayer ? C.blue : C.red;

        return (
          <div
            key={fighter.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${isActive ? C.purple + "88" : accentColor + "20"}`,
              background: isActive
                ? `${C.purple}18`
                : isPast
                ? `${C.surface}60`
                : `${accentColor}08`,
              transition: "all .2s",
              boxShadow: isActive ? `0 0 10px ${C.purple}30` : "none",
              opacity: isDead ? 0.5 : isPast ? 0.65 : 1,
            }}
          >
            {/* Turn indicator */}
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: isActive ? C.purple : isDead ? C.red + "55" : isPast ? C.surface : accentColor + "22",
              border: `1px solid ${isActive ? C.purpleBright : isDead ? C.red + "55" : accentColor + "40"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              fontSize: 10,
            }}>
              {isActive
                ? <span style={{ color: "#fff", fontWeight: 700 }}>▶</span>
                : isDead
                ? <span>☠</span>
                : isPast
                ? <span style={{ color: C.textDim, fontSize: 9 }}>✓</span>
                : <span style={{ color: accentColor, fontSize: 9, fontWeight: 700 }}>{idx + 1}</span>
              }
            </div>

            {/* Name + type icon */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.purpleBright : isDead ? C.textDim : C.textBright,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {isPlayer ? "👤" : "💀"} {fighter.name}
              </div>
              {/* HP bar — mini */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <div style={{ flex: 1, height: 3, background: C.surface, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.max(0, Math.min(100, (fighter.hp / fighter.maxHp) * 100))}%`,
                    background: fighter.hp > fighter.maxHp * 0.5 ? C.green
                      : fighter.hp > fighter.maxHp * 0.25 ? C.amber
                      : C.red,
                    transition: "width .3s",
                  }} />
                </div>
                <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>
                  {fighter.hp}/{fighter.maxHp}
                </span>
              </div>
            </div>

            {/* Initiative */}
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: isActive ? C.gold : C.textDim,
              flexShrink: 0,
            }}>
              {fighter.initiative}
            </div>
          </div>
        );
      })}
    </div>
  );
}
