import { useState } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { useCombatActions } from "../../../hooks/useCombatActions.js";
import { isConcentration, getDamageTypeEmoji, slotLabel, slotColor, getAvailableSlotLevels } from "../../../utils/spells.js";
import { useI18n } from "../../../i18n/index.js";
import DamageRollModal from "../Rolls/DamageRollModal.jsx";

/**
 * SpellCastModal — cast flow for a single spell
 * Props:
 *   spell: SPELLS entry
 *   fighter: Fighter (caster)
 *   onClose: () => void
 */
export default function SpellCastModal({ spell, fighter, onClose }) {
  const { t } = useI18n();
  const { castSpell } = useCombatActions();
  const [slotLevel, setSlotLevel] = useState(spell.lv === 0 ? 0 : null);
  const [showDamage, setShowDamage] = useState(false);
  const [cast, setCast] = useState(false);

  if (!spell) return null;

  const needsConc = isConcentration(spell);
  const isDamage = spell.dmg && spell.dmg !== "—";
  const isHealing = spell.dt === "healing";
  const isCantrip = spell.lv === 0;

  // Available slots ≥ spell level
  const availableLevels = isCantrip
    ? [0]
    : getAvailableSlotLevels(fighter).filter((lv) => lv >= spell.lv);

  const upcastInfo = slotLevel && slotLevel > spell.lv
    ? spell.upcast?.find((u) => u.slot <= slotLevel && (!spell.upcast.find(u2 => u2.slot > u.slot && u2.slot <= slotLevel)))
    : null;

  const effectiveDmg = upcastInfo?.dmg || spell.dmg;

  const handleCast = () => {
    if (slotLevel === null) return;
    castSpell(fighter.id, spell.id, slotLevel);
    setCast(true);
    // After casting, if damage spell → show damage modal
    if (isDamage && !isHealing) {
      setShowDamage(true);
    }
  };

  if (showDamage) {
    return (
      <DamageRollModal
        attacker={fighter}
        target={null}
        isCrit={false}
        onClose={onClose}
        onApply={(_targetId, _dmg) => { onClose?.(); }}
        forceDice={effectiveDmg !== "—" ? effectiveDmg : undefined}
        title={`${spell.name} — Schaden`}
      />
    );
  }

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 16, color: C.purpleBright, fontWeight: 700 }}>{spell.name}</div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
              {isCantrip ? "Cantrip" : `Level ${spell.lv}`} · {spell.school}
            </div>
          </div>
          <button onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Spell info tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["⏱", spell.ct], ["📏", spell.range], ["⏳", spell.dur], ["🔤", spell.comp]].map(([ic, v]) => (
            <span key={ic} style={{ ...sx.tag(C.blue), fontSize: 11 }}>{ic} {v}</span>
          ))}
          {isDamage && !isHealing && (
            <span style={{ ...sx.tag(C.red), fontSize: 11 }}>
              {getDamageTypeEmoji(spell.dt)} {effectiveDmg}
            </span>
          )}
          {isHealing && (
            <span style={{ ...sx.tag(C.green), fontSize: 11 }}>💛 {spell.dmg}</span>
          )}
          {needsConc && (
            <span style={{ ...sx.tag(C.amber), fontSize: 11 }}>🧠 Conc.</span>
          )}
        </div>

        {/* Concentration warning */}
        {needsConc && fighter.concentration && (
          <div style={{ background: `${C.amber}12`, border: `1px solid ${C.amber}35`, borderRadius: 8, padding: "8px 10px", marginBottom: 12, fontSize: 12, color: C.amberBright }}>
            ⚠ Du konzentrierst dich bereits. Das Zaubern dieses Zaubers bricht die bestehende Konzentration!
          </div>
        )}

        {/* Slot level selection */}
        {!isCantrip && (
          <div style={{ marginBottom: 14 }}>
            <label style={sx.lbl}>{t("spellcast.choose_slot","Zauberplatz-Stufe wählen")}</label>
            {availableLevels.length === 0 ? (
              <div style={{ background: `${C.red}12`, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.redBright }}>
                ✕ {t("spellcast.no_slots","Keine Zauberplätze verfügbar")} ({t("spellcast.level","Stufe")} {spell.lv}+)
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {availableLevels.map((lv) => {
                  const color = slotColor(lv);
                  const upInfo = lv > spell.lv
                    ? spell.upcast?.find((u) => u.slot <= lv && !spell.upcast.find(u2 => u2.slot > u.slot && u2.slot <= lv))
                    : null;
                  return (
                    <button
                      key={lv}
                      onClick={() => setSlotLevel(lv)}
                      style={{
                        padding: "8px 12px", borderRadius: 8, cursor: "pointer", transition: "all .15s",
                        border: `2px solid ${slotLevel === lv ? color : color + "44"}`,
                        background: slotLevel === lv ? `${color}28` : `${color}0a`,
                        color: slotLevel === lv ? color : color + "aa",
                        fontWeight: slotLevel === lv ? 700 : 400,
                        fontSize: 12,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      }}
                    >
                      <span style={{ fontFamily: FH, fontSize: 13 }}>{slotLabel(lv)}</span>
                      {upInfo && (
                        <span style={{ fontSize: 9, color: C.gold }}>{upInfo.dmg || upInfo.note || "+"}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Spell description */}
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          {spell.desc}
        </div>

        {/* Cast button */}
        {!cast && (
          <button
            onClick={handleCast}
            disabled={!isCantrip && (slotLevel === null || availableLevels.length === 0)}
            style={{
              ...sx.btn(C.purple), width: "100%", padding: "13px", fontSize: 14, fontWeight: 700,
              opacity: (!isCantrip && (slotLevel === null || availableLevels.length === 0)) ? 0.4 : 1,
              cursor: (!isCantrip && (slotLevel === null || availableLevels.length === 0)) ? "not-allowed" : "pointer",
              boxShadow: `0 4px 20px ${C.purple}40`,
            }}
          >
            🔮 {spell.name} wirken{slotLevel !== null && slotLevel > 0 ? ` (${slotLabel(slotLevel)})` : ""}
          </button>
        )}

        {/* After cast */}
        {cast && !isDamage && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>✨</div>
            <div style={{ color: C.purpleBright, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
              {spell.name} {t("spellcast.cast","gewirkt!")}
            </div>
            {needsConc && (
              <div style={{ fontSize: 12, color: C.amberBright, marginBottom: 10 }}>
                🧠 {t("spellcast.conc_active","Konzentration aktiv — erscheint als Condition")}
              </div>
            )}
            <button onClick={onClose} style={{ ...sx.btn(C.teal), padding: "10px 24px" }}>
              Schließen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16,
};
const modalStyle = {
  background: "#1e1b22", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto",
};
