import { C, FH } from "../../../constants/theme.js";
import { slotLabel, slotColor } from "../../../utils/spells.js";
import { useI18n } from "../../../i18n/index.js";

/**
 * SpellSlotTracker — visual slot circles per level
 * Props:
 *   spellSlots: [{lv, total, used, pact}]
 *   onUse: (lv) => void      — optional: manually use a slot
 *   onRestore: (lv) => void  — optional: manually restore a slot
 *   compact: boolean
 */
export default function SpellSlotTracker({ spellSlots = [], onUse, onRestore, compact = false }) {
  const { t } = useI18n();
  if (spellSlots.length === 0) {
    return (
      <div style={{ fontSize: 12, color: C.textDim, fontStyle: "italic", padding: "4px 0" }}>
        {t("combat.no_spell_slots","Keine Zauberplätze")}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 4 : 6 }}>
      {spellSlots.map((slot) => {
        const color = slotColor(slot.lv);
        const available = slot.total - slot.used;
        return (
          <div key={slot.lv} style={{ display: "flex", alignItems: "center", gap: compact ? 6 : 8 }}>
            {/* Level label */}
            <div style={{
              fontSize: compact ? 9 : 10, fontFamily: FH, color, fontWeight: 700,
              width: compact ? 28 : 36, flexShrink: 0, letterSpacing: 0.3,
            }}>
              {slot.pact ? "PACT" : slotLabel(slot.lv).toUpperCase()}
            </div>

            {/* Slot circles */}
            <div style={{ display: "flex", gap: 4, flex: 1 }}>
              {Array.from({ length: slot.total }, (_, i) => {
                const filled = i < available;
                return (
                  <button
                    key={i}
                    onClick={() => filled ? onUse?.(slot.lv) : onRestore?.(slot.lv)}
                    title={filled ? `Slot ${i + 1} — ${t("combat.tracker_slot_available","Slot verfügbar — klicken zum Verbrauchen")}` : `Slot ${i + 1} — ${t("combat.tracker_slot_used","Slot verbraucht — klicken zum Wiederherstellen")}`}
                    style={{
                      width: compact ? 14 : 18,
                      height: compact ? 14 : 18,
                      borderRadius: "50%",
                      border: `2px solid ${color}`,
                      background: filled ? color : "transparent",
                      cursor: "pointer",
                      padding: 0,
                      flexShrink: 0,
                      transition: "all .15s",
                      boxShadow: filled ? `0 0 4px ${color}50` : "none",
                    }}
                  />
                );
              })}
            </div>

            {/* Count */}
            <div style={{ fontSize: compact ? 9 : 10, color: available > 0 ? color : C.textDim, fontWeight: 700, flexShrink: 0 }}>
              {available}/{slot.total}
            </div>
          </div>
        );
      })}
    </div>
  );
}
