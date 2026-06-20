import { C, sx, FH } from "../../constants/theme.js";
import { breakConcentration } from "../../utils/concentration.js";
import { useI18n } from "../../i18n/index.js";

/**
 * StatusStrip — three-pill utility row that replaces the old Death-Saves
 * card + Wealth-card on the Übersicht tab. Single horizontal strip so the
 * full ConcentrationBanner / SkillsCard / etc. start much higher in the
 * stack.
 *
 *   [💀 dots]   [💰 GP]   [🔮 spell-name | —]
 *
 * Layout: flex wrap on the smallest phones, single line everywhere else
 * (~750 px Samsung S7 FE portrait still fits one row).
 */
export default function StatusStrip({ char, setChar, totalGP, onOpenWealth }) {
  const { t } = useI18n();
  const isDying = char.hp === 0;
  const conc = char.concentration;

  // Death Saves —— 6 small dots; only clickable while dying. Greyed when stable.
  const sucCount  = char.deathSaves?.suc  || 0;
  const failCount = char.deathSaves?.fail || 0;
  const toggleDS = (key, idx) => {
    if (!isDying) return;
    setChar(p => ({
      ...p,
      deathSaves: {
        ...p.deathSaves,
        [key]: (p.deathSaves?.[key] || 0) === idx + 1 ? idx : idx + 1,
      },
    }));
  };
  const renderDot = (filled, col, key, idx) => (
    <button key={`${key}_${idx}`} type="button"
      onClick={() => toggleDS(key, idx)}
      disabled={!isDying}
      aria-label={`${key} ${idx + 1}`}
      style={{
        width: 12, height: 12, padding: 0,
        borderRadius: "50%",
        border: `1.5px solid ${isDying ? col : C.border}`,
        background: filled ? (isDying ? col : C.border) : "transparent",
        cursor: isDying ? "pointer" : "default",
        opacity: isDying ? 1 : 0.55,
      }}
    />
  );

  // Concentration — click to break; disabled when no spell.
  const breakConc = () => {
    if (!conc) return;
    setChar(p => breakConcentration(p));
  };

  const pillBase = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "5px 10px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: C.surface,
    fontSize: 11,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all .15s",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 6,
      marginBottom: 6,
      alignItems: "center",
    }}>
      {/* Death Saves */}
      <div style={{
        ...pillBase,
        cursor: "default",
        borderColor: isDying ? `${C.redBright}88` : C.border,
        background: isDying ? `${C.red}18` : C.surface,
      }}
        title={isDying
          ? t("strip.ds_dying","Stirbst — Klick auf einen Kreis = Save markieren")
          : t("strip.ds_stable","Death Saves (nur aktiv bei 0 HP)")}>
        <span style={{ fontSize: 11, color: isDying ? C.redBright : C.textDim, fontFamily: FH, fontWeight: 700, letterSpacing: 0.3 }}>
          💀 {t("strip.ds_short","DS")}
        </span>
        <div style={{ display: "flex", gap: 3 }} aria-label={t("strip.ds_successes","Successes")}>
          {[0, 1, 2].map(i => renderDot(i < sucCount, C.greenBright, "suc", i))}
        </div>
        <div style={{ display: "flex", gap: 3 }} aria-label={t("strip.ds_failures","Failures")}>
          {[0, 1, 2].map(i => renderDot(i < failCount, C.redBright, "fail", i))}
        </div>
        {isDying && (
          <button type="button"
            onClick={() => setChar(p => ({ ...p, hp: 1, deathSaves: { suc: 0, fail: 0 } }))}
            title={t("strip.ds_stabilize","Stabilisieren: 1 HP")}
            style={{ ...sx.bsm(C.greenBright), fontSize: 9, padding: "2px 6px", marginLeft: 4 }}>
            ↺ 1 HP
          </button>
        )}
      </div>

      {/* Wealth */}
      <button type="button" onClick={onOpenWealth}
        title={t("strip.wealth_hint","Münzen verwalten")}
        style={{
          ...pillBase,
          borderColor: `${C.gold}55`,
          background: `${C.gold}10`,
          color: C.gold,
          fontWeight: 700,
        }}>
        <span>💰</span>
        <span style={{ fontFamily: FH }}>
          {totalGP % 1 === 0 ? totalGP : totalGP.toFixed(2)} GP
        </span>
      </button>

      {/* Concentration */}
      <button type="button"
        onClick={breakConc}
        disabled={!conc}
        title={conc
          ? t("strip.conc_active","Klick: Konzentration brechen")
          : t("strip.conc_none","Keine Konzentration aktiv")}
        style={{
          ...pillBase,
          borderColor: conc ? `${C.purpleBright}88` : C.border,
          background: conc ? `${C.purpleBright}18` : C.surface,
          color: conc ? C.purpleBright : C.textDim,
          cursor: conc ? "pointer" : "default",
          fontWeight: conc ? 700 : 400,
          maxWidth: 240,
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
        <span>🔮 {t("strip.conc_short","Konz.")}</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {conc ? conc.spellName : t("strip.conc_dash","—")}
        </span>
        {conc?.slotLv > conc?.lv && (
          <span style={{ fontSize: 9, color: C.amberBright, marginLeft: 2 }}>↑{conc.slotLv}</span>
        )}
        {conc && <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 2 }}>✕</span>}
      </button>
    </div>
  );
}
