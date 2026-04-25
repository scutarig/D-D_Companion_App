import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { rollDeathSave } from "../../utils/rolls.js";

const HoldBtn = ({ onClick, children, style, disabled = false }) => {
  const handleMouseDown = (e) => {
    if (disabled) return;
    let presses = 0;
    let interval;

    const onMouseUp = () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", onMouseUp);
      presses = 0;
    };

    onClick?.(1);
    presses = 1;

    interval = setInterval(() => {
      presses++;
      onClick?.(presses);
    }, 150);

    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      style={{
        ...style,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function ActiveFighterCard() {
  const { state } = useCombat();
  const { damageTarget, healTarget, addDeathSaveResult } = useCombatActions();

  if (state.activeIndex < 0 || state.activeIndex >= state.fighters.length) {
    return (
      <div style={{ ...sx.card, textAlign: "center", color: C.textDim }}>
        Keine aktiven Kämpfer
      </div>
    );
  }

  const fighter = state.fighters[state.activeIndex];
  const hpPercent = Math.max(0, Math.min(100, (fighter.hp / fighter.maxHp) * 100));

  // HP bar color: green → yellow → red
  let barColor = C.green;
  if (hpPercent < 50) barColor = C.amber;
  if (hpPercent < 25) barColor = C.red;
  if (fighter.hp <= 0) barColor = C.red;

  return (
    <div style={{ ...sx.card, background: `${C.purple}08`, border: `2px solid ${C.purple}25` }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🏹</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FH, fontSize: 16, color: C.textBright, fontWeight: 700 }}>
              {fighter.name}
            </div>
            <div style={{ fontSize: 11, color: C.textDim }}>
              {fighter.isPlayer ? "Player" : "Enemy"} · AC {fighter.ac}
            </div>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH }}>HP</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: hpPercent > 50 ? C.greenBright : hpPercent > 25 ? C.amberBright : C.redBright,
            }}
          >
            {fighter.hp} / {fighter.maxHp}
          </span>
        </div>
        <div
          style={{
            height: 20,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${hpPercent}%`,
              background: barColor,
              transition: "width .3s, background .3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 4,
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {hpPercent > 10 && `${Math.round(hpPercent)}%`}
          </div>
        </div>
      </div>

      {/* Quick HP Buttons */}
      {fighter.hp > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <HoldBtn onClick={(presses) => damageTarget(fighter.id, 5 * presses)} style={{ ...sx.btn(C.red), flex: 1, fontSize: 11 }}>
            -5 HP
          </HoldBtn>
          <HoldBtn onClick={(presses) => damageTarget(fighter.id, 10 * presses)} style={{ ...sx.btn(C.red), flex: 1, fontSize: 11 }}>
            -10 HP
          </HoldBtn>
          <HoldBtn onClick={(presses) => healTarget(fighter.id, 5 * presses)} style={{ ...sx.btn(C.green), flex: 1, fontSize: 11 }}>
            +5 HP
          </HoldBtn>
          <HoldBtn onClick={(presses) => healTarget(fighter.id, 10 * presses)} style={{ ...sx.btn(C.green), flex: 1, fontSize: 11 }}>
            +10 HP
          </HoldBtn>
        </div>
      )}

      {/* Status */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {fighter.hp <= 0 && (
          <div style={{ ...sx.tag(C.red), fontSize: 11 }}>☠️ Unconscious</div>
        )}
        {fighter.conditions.length > 0 && (
          <div style={{ ...sx.tag(C.amber), fontSize: 11 }}>⚡ {fighter.conditions.length} Conditions</div>
        )}
        {fighter.tempHp > 0 && (
          <div style={{ ...sx.tag(C.blue), fontSize: 11 }}>❄️ {fighter.tempHp} Temp HP</div>
        )}
      </div>

      {/* Death Saves — shown only at 0 HP */}
      {fighter.hp <= 0 && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontFamily: FH, fontSize: 11, color: C.redBright, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>☠️ Death Saves</span>
            <button
              onClick={() => {
                const roll = rollDeathSave();
                addDeathSaveResult(fighter.id, roll.success ? "success" : "failure");
              }}
              style={{ ...sx.bsm(C.red), fontSize: 10, padding: "3px 8px" }}
            >
              🎲 Roll Save
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {/* Successes */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.greenBright, marginBottom: 4 }}>Successes</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => addDeathSaveResult(fighter.id, "success")}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `1px solid ${C.green}`,
                      background: i < fighter.deathSaves.suc ? C.green : "transparent",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Failures */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.redBright, marginBottom: 4 }}>Failures</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => addDeathSaveResult(fighter.id, "failure")}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `1px solid ${C.red}`,
                      background: i < fighter.deathSaves.fail ? C.red : "transparent",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {fighter.deathSaves.suc >= 3 && (
            <div style={{ marginTop: 8, fontSize: 11, color: C.greenBright, fontWeight: 700 }}>✓ Stabilized!</div>
          )}
          {fighter.deathSaves.fail >= 3 && (
            <div style={{ marginTop: 8, fontSize: 11, color: C.redBright, fontWeight: 700 }}>✗ Dead</div>
          )}
        </div>
      )}

      {/* Speed Preset */}
      <div style={{ background: C.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${C.border}`, fontSize: 11 }}>
        <span style={{ color: C.textDim, fontFamily: FH }}>SPEED:</span>
        <span style={{ color: C.textBright, fontWeight: 700, marginLeft: 6 }}>{fighter.actions.movement || 30} ft</span>
      </div>
    </div>
  );
}
