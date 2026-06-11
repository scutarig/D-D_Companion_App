import { C, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { calculateMulticlassSpellSlots } from "../../utils/multiclass.js";
import { useI18n } from "../../i18n/index.js";

const SLOT_COLORS = [
  C.redBright, C.amberBright, C.gold, C.greenBright,
  C.tealBright, C.blueBright, C.purpleBright, "#c084fc", "#f0abfc",
];

/**
 * MulticlassSpellSlots — Displays and tracks multiclass spell slots.
 * Only renders when character has at least one caster class.
 * Props: classes (array), charId (string)
 */
export default function MulticlassSpellSlots({ classes, charId }) {
  const { t } = useI18n();
  const [used, setUsed] = usePersist(`slots_used_mc_${charId}`, {});

  if (!classes || classes.length === 0) return null;

  const { slots, pact, hasCaster, hasPact } = calculateMulticlassSpellSlots(classes);
  if (!hasCaster && !hasPact) return null;

  const toggle = (key) => setUsed(prev => ({ ...prev, [key]: !prev[key] }));
  const reset  = () => setUsed({});

  return (
    <div style={{
      background: `${C.purpleBright}08`, border: `1px solid ${C.purpleBright}25`,
      borderRadius: 10, padding: "12px 14px", marginTop: 8,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: FH, fontSize: 11, color: C.purpleBright, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {t("char.spell_slots_header","🔮 Zauberplätze")}
        </span>
        <button type="button"
          onClick={reset}
          style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, border: `1px solid ${C.border}`, background: "none", color: C.textDim, cursor: "pointer" }}
        >
          {t("char.long_rest_btn","🌙 Lange Rast")}
        </button>
      </div>

      {/* Regular spell slots */}
      {hasCaster && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: hasPact ? 10 : 0 }}>
          {[1,2,3,4,5,6,7,8,9].map(lvl => {
            const max = slots[lvl] || 0;
            if (max === 0) return null;
            const col = SLOT_COLORS[lvl - 1] ?? C.purpleBright;
            return (
              <div key={lvl} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Grade label */}
                <div style={{ fontSize: 10, color: col, fontWeight: 700, fontFamily: FH, minWidth: 42, letterSpacing: 0.5 }}>
                  {t("char.grade_n","{n}. Grad").replace("{n}", lvl)}
                </div>
                {/* Slot bubbles */}
                <div style={{ display: "flex", gap: 5, flex: 1 }}>
                  {Array.from({ length: max }).map((_, i) => {
                    const key = `${lvl}_${i}`;
                    const isUsed = !!used[key];
                    return (
                      <button type="button"
                        key={i}
                        onClick={() => toggle(key)}
                        title={isUsed ? t("char.slot_used_title","Verbraucht — klicken zum Zurücksetzen") : t("char.slot_avail_title","Verfügbar — klicken zum Verbrauchen")}
                        style={{
                          width: 22, height: 22, borderRadius: "50%",
                          border: `2px solid ${col}`,
                          background: isUsed ? `${col}30` : col,
                          cursor: "pointer", transition: "all .15s",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      />
                    );
                  })}
                </div>
                {/* Count label */}
                <span style={{ fontSize: 10, color: C.textDim, minWidth: 28, textAlign: "right" }}>
                  {max - Array.from({ length: max }).filter((_, i) => used[`${lvl}_${i}`]).length}/{max}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pact magic (Hexenmeister) */}
      {hasPact && (
        <div style={{ borderTop: hasCaster ? `1px solid ${C.border}` : "none", paddingTop: hasCaster ? 8 : 0 }}>
          <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 0.6, marginBottom: 6, textTransform: "uppercase" }}>
            {t("char.pact_magic","Paktmagie")} <span style={{ color: C.purpleBright }}>{t("char.pact_grade","{lv}. Grad").replace("{lv}", pact.spellLevel)}</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: pact.slots }).map((_, i) => {
              const key = `pact_${i}`;
              const isUsed = !!used[key];
              return (
                <button type="button"
                  key={i}
                  onClick={() => toggle(key)}
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2px solid ${C.purpleBright}`,
                    background: isUsed ? `${C.purpleBright}30` : C.purpleBright,
                    cursor: "pointer", transition: "all .15s",
                  }}
                />
              );
            })}
            <span style={{ fontSize: 10, color: C.textDim, marginLeft: 4, alignSelf: "center" }}>
              {t("char.pact_slots_n","{rem}/{total} Slots")
                .replace("{rem}", pact.slots - Array.from({ length: pact.slots }).filter((_, i) => used[`pact_${i}`]).length)
                .replace("{total}", pact.slots)}
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>
            {t("char.short_rest_renew","Erneuern nach kurzer Rast")}
          </div>
        </div>
      )}
    </div>
  );
}
