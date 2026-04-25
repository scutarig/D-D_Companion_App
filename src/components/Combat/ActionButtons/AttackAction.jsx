import { useState } from "react";
import { useCombat } from "../../../context/CombatContext.jsx";
import { useCombatActions } from "../../../hooks/useCombatActions.js";
import { logAttack, logCritical, logDamage } from "../../../utils/log.js";
import AttackRollModal from "../Rolls/AttackRollModal.jsx";
import DamageRollModal from "../Rolls/DamageRollModal.jsx";

/**
 * AttackAction — orchestrates the full attack flow:
 *   1. AttackRollModal → HIT/MISS
 *   2. (if HIT) DamageRollModal → apply damage
 *   3. Log everything
 *
 * Usage: render this anywhere; it shows the modals when active.
 * Props:
 *   open: boolean
 *   onClose: () => void
 */
export default function AttackAction({ open, onClose }) {
  const { state, setState } = useCombat();
  const { damageTarget } = useCombatActions();

  // Phase: "attack" | "damage" | null
  const [phase, setPhase] = useState("attack");
  const [attackResult, setAttackResult] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [isCrit, setIsCrit] = useState(false);

  if (!open) return null;

  const attacker = state.fighters[state.activeIndex] ?? null;
  const target = state.fighters.find((f) => f.id === targetId) ?? null;

  // Step 1: Attack roll resolved
  const handleHit = (result, tid, crit) => {
    // Log the attack
    const tgt = state.fighters.find((f) => f.id === tid);
    setState((prev) => {
      let updated = logAttack(
        prev,
        attacker?.name ?? "Unknown",
        tgt?.name ?? "Unknown",
        result.total,
        tgt?.ac ?? 0,
        result.hit,
        attacker?.id ?? null,
        tid
      );
      if (crit) {
        updated = logCritical(updated, attacker?.name ?? "Unknown", tgt?.name ?? "Unknown", attacker?.id ?? null, tid);
      }
      return updated;
    });

    setAttackResult(result);
    setTargetId(tid);
    setIsCrit(crit);
    setPhase("damage");
  };

  // Step 2: Damage applied
  const handleApplyDamage = (tid, damage) => {
    const tgt = state.fighters.find((f) => f.id === tid);
    const oldHp = tgt?.hp ?? 0;
    const newHp = Math.max(0, oldHp - damage);

    // Apply damage via useCombatActions (handles HP + unconscious log)
    damageTarget(tid, damage);
  };

  const handleClose = () => {
    // Reset state for next use
    setPhase("attack");
    setAttackResult(null);
    setTargetId(null);
    setIsCrit(false);
    onClose?.();
  };

  return (
    <>
      {phase === "attack" && (
        <AttackRollModal
          attacker={attacker}
          onClose={handleClose}
          onHit={handleHit}
        />
      )}
      {phase === "damage" && (
        <DamageRollModal
          attacker={attacker}
          target={target}
          isCrit={isCrit}
          onClose={handleClose}
          onApply={handleApplyDamage}
        />
      )}
    </>
  );
}
