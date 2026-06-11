import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { rollDeathSave } from "../../utils/rolls.js";
import { getConditionId, getCondition } from "../../utils/conditions.js";
import { useI18n } from "../../i18n/index.js";
import ConditionBadge from "./Conditions/ConditionBadge.jsx";
import ConditionPicker from "./Conditions/ConditionPicker.jsx";

// ── Hold-to-repeat button ─────────────────────────────────────────────────────
const HoldBtn = ({ onClick, children, style, disabled = false }) => {
  const handleStart = (e) => {
    if (disabled) return;
    e.preventDefault(); // Prevent double-fire on touch+mouse
    let presses = 0;
    let interval;
    const onEnd = () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
    onClick?.(1);
    presses = 1;
    interval = setInterval(() => { presses++; onClick?.(presses); }, 150);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
  };
  return (
    <button type="button"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      style={{ ...style, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function ActiveFighterCard() {
  const { t } = useI18n();
  const { state, setState } = useCombat();
  const { damageTarget, healTarget, addDeathSaveResult } = useCombatActions();
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [customHp, setCustomHp] = useState("");
  const [showCustomHp, setShowCustomHp] = useState(false);

  if (state.activeIndex < 0 || state.activeIndex >= state.fighters.length) {
    return (
      <div style={{ ...sx.card, textAlign: "center", color: C.textDim, padding: 24 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⚔️</div>
        {t("combat.no_active_fighter","Keine aktiven Kämpfer")}
      </div>
    );
  }

  const fighter = state.fighters[state.activeIndex];
  const hpPercent = Math.max(0, Math.min(100, (fighter.hp / fighter.maxHp) * 100));

  let barColor = C.green;
  if (hpPercent < 50) barColor = C.amber;
  if (hpPercent < 25) barColor = C.red;
  if (fighter.hp <= 0) barColor = C.redBright;

  // ── Condition management ────────────────────────────────────────────────────
  const addCondition = (condId, duration) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f, i) =>
        i === prev.activeIndex
          ? { ...f, conditions: [...(f.conditions ?? []), duration === null ? condId : { id: condId, duration, sourceId: null }] }
          : f
      ),
    }));
    setShowConditionPicker(false);
  };

  const removeCondition = (condId) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f, i) =>
        i === prev.activeIndex
          ? { ...f, conditions: (f.conditions ?? []).filter((c) => getConditionId(c) !== condId) }
          : f
      ),
    }));
  };

  // ── Custom HP input ─────────────────────────────────────────────────────────
  const applyCustomHp = (isDamage) => {
    const val = parseInt(customHp);
    if (!val || isNaN(val) || val <= 0) return;
    if (isDamage) damageTarget(fighter.id, val);
    else healTarget(fighter.id, val);
    setCustomHp("");
    setShowCustomHp(false);
  };

  // Defensive: Legacy combat_v5 localStorage hatte u.U. keine conditions[]
  const fighterConditions = fighter.conditions || [];

  return (
    <div style={{ ...sx.card, background: `${C.purple}08`, border: `2px solid ${C.purple}25` }}>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: fighter.isPlayer ? `${C.blue}22` : `${C.red}22`,
          border: `2px solid ${fighter.isPlayer ? C.blue : C.red}55`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
        }}>
          {fighter.isPlayer ? "👤" : "💀"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FH, fontSize: 16, color: C.textBright, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fighter.name}
          </div>
          <div style={{ fontSize: 12, color: C.textDim }}>
            {fighter.isPlayer ? t("combat.player_short","Spieler") : t("combat.enemy_short","Gegner")} · AC <span style={{ color: C.amberBright, fontWeight: 700 }}>{fighter.ac}</span> · Init {fighter.initiative}
          </div>
        </div>
        {/* Condition picker trigger */}
        <button type="button"
          onClick={() => setShowConditionPicker(true)}
          style={{
            ...sx.bsm(C.amber), padding: "5px 10px", fontSize: 11,
            background: fighterConditions.length > 0 ? `${C.amber}22` : "transparent",
          }}
        >
          ⚡ {fighterConditions.length > 0 ? fighterConditions.length : "+"}
        </button>
      </div>

      {/* ── CONDITIONS ROW ──────────────────────────────────────────────────── */}
      {fighterConditions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {fighterConditions.map((c, i) => (
            <ConditionBadge
              key={i}
              conditionId={c}
              onRemove={() => removeCondition(getConditionId(c))}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* ── HP BAR ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH, letterSpacing: 0.5 }}>HP</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: hpPercent > 50 ? C.greenBright : hpPercent > 25 ? C.amberBright : C.redBright }}>
            {fighter.hp} / {fighter.maxHp}
            {fighter.tempHp > 0 && <span style={{ fontSize: 11, color: C.blueBright }}> +{fighter.tempHp}</span>}
          </span>
        </div>
        <div style={{ height: 14, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${hpPercent}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            transition: "width .3s, background .3s",
          }} />
        </div>
      </div>

      {/* ── QUICK HP BUTTONS ───────────────────────────────────────────────── */}
      {fighter.hp > 0 && (
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {[-10, -5].map((n) => (
            <HoldBtn
              key={n}
              onClick={(p) => damageTarget(fighter.id, Math.abs(n) * p)}
              style={{ ...sx.btn(C.red), flex: 1, fontSize: 12, padding: "8px 4px" }}
            >
              {n} HP
            </HoldBtn>
          ))}
          {[5, 10].map((n) => (
            <HoldBtn
              key={n}
              onClick={(p) => healTarget(fighter.id, n * p)}
              style={{ ...sx.btn(C.green), flex: 1, fontSize: 12, padding: "8px 4px" }}
            >
              +{n} HP
            </HoldBtn>
          ))}
          <button type="button"
            onClick={() => setShowCustomHp(!showCustomHp)}
            style={{ ...sx.bsm(C.purple), padding: "8px 10px", fontSize: 12 }}
          >
            ✎
          </button>
        </div>
      )}

      {/* Custom HP input */}
      {showCustomHp && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, background: `${C.purple}10`, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.purple}25` }}>
          <input
            type="number"
            value={customHp}
            onChange={(e) => setCustomHp(e.target.value)}
            placeholder={t("combat.hp_input_placeholder","HP Wert...")}
            style={{ ...sx.inp, flex: 1, fontSize: 13 }}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") applyCustomHp(false); }}
          />
          <button type="button" onClick={() => applyCustomHp(true)} style={{ ...sx.btn(C.red), padding: "8px 12px", fontSize: 12 }}>
            {t("combat.dmg_btn","− Dmg")}
          </button>
          <button type="button" onClick={() => applyCustomHp(false)} style={{ ...sx.btn(C.green), padding: "8px 12px", fontSize: 12 }}>
            {t("combat.heal_btn","+ Heal")}
          </button>
        </div>
      )}

      {/* ── DEATH SAVES ────────────────────────────────────────────────────── */}
      {fighter.hp <= 0 && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: FH, fontSize: 12, color: C.redBright }}>☠️ Death Saves</span>
            <button type="button"
              onClick={() => { const r = rollDeathSave(); addDeathSaveResult(fighter.id, r.success ? "success" : "failure"); }}
              style={{ ...sx.bsm(C.red), fontSize: 10, padding: "3px 8px" }}
            >
              🎲 Roll
            </button>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.greenBright, marginBottom: 4 }}>Successes</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <button type="button" key={i} onClick={() => addDeathSaveResult(fighter.id, "success")} style={{
                    width: 32, height: 32, borderRadius: 4, border: `2px solid ${C.green}`,
                    background: i < (fighter.deathSaves?.suc ?? 0) ? C.green : "transparent", cursor: "pointer", padding: 0,
                  }} />
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.redBright, marginBottom: 4 }}>Failures</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <button type="button" key={i} onClick={() => addDeathSaveResult(fighter.id, "failure")} style={{
                    width: 32, height: 32, borderRadius: 4, border: `2px solid ${C.red}`,
                    background: i < (fighter.deathSaves?.fail ?? 0) ? C.red : "transparent", cursor: "pointer", padding: 0,
                  }} />
                ))}
              </div>
            </div>
          </div>
          {(fighter.deathSaves?.suc ?? 0) >= 3 && <div style={{ marginTop: 6, fontSize: 11, color: C.greenBright, fontWeight: 700 }}>✓ Stabilized!</div>}
          {(fighter.deathSaves?.fail ?? 0) >= 3 && <div style={{ marginTop: 6, fontSize: 11, color: C.redBright, fontWeight: 700 }}>✗ Dead</div>}
        </div>
      )}

      {/* ── SPEED PRESET ───────────────────────────────────────────────────── */}
      <div style={{ background: C.surface, borderRadius: 6, padding: "6px 10px", border: `1px solid ${C.border}`, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: C.textDim, fontFamily: FH, letterSpacing: 0.5, fontSize: 10 }}>SPEED</span>
        <span style={{ color: C.tealBright, fontWeight: 700 }}>
          {fighterConditions.some((c) => {
            const cond = getCondition(getConditionId(c));
            return cond?.effects?.speedZero;
          }) ? <span style={{ color: C.redBright }}>{t("combat.speed_zero_restricted","0 ft (eingeschränkt)")}</span> : `${fighter.actions?.movement ?? 30} ft`}
        </span>
      </div>

      {/* ── CONDITION PICKER MODAL ─────────────────────────────────────────── */}
      {showConditionPicker && (
        <ConditionPicker
          fighter={fighter}
          onAdd={addCondition}
          onClose={() => setShowConditionPicker(false)}
        />
      )}
    </div>
  );
}
