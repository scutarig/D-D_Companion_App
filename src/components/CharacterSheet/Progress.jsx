import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";
import LevelUpAssistant from "../LevelUpAssistant.jsx";
import ExhaustionTracker from "../ExhaustionTracker.jsx";
import WildShapePanel from "../WildShape/WildShapePanel.jsx";

/**
 * Progress — Character-progression tab (Tab 5 of CharManagerV2).
 *
 * Bundles 4 collapsible sections in a "between-adventures" workflow order:
 *   1. Level-Up Assistant      (auto-open — the main interaction)
 *   2. Hit-Dice status         (inline mini-panel — visual only, spending
 *                              happens via the Short-Rest button in the header)
 *   3. Erschöpfung             (ExhaustionTracker)
 *   4. Wild Shape / Polymorph  (default closed — only relevant for druids /
 *                              casters with the spell)
 */
export default function Progress({ char, setChar }) {
  const { t } = useI18n();
  const isDruid = char?.klass === "Druide" || (char?.classes || []).some(c => c.klass === "Druide");

  return (
    <div>
      <div style={{
        padding: "8px 12px", marginBottom: 14,
        background: `${C.greenBright}10`,
        border: `1px dashed ${C.greenBright}40`,
        borderRadius: 8,
        color: C.greenBright,
        fontSize: 11, lineHeight: 1.5, textAlign: "center",
      }}>
        📈 {t("progress.intro","Aufstieg, Erschöpfung und Pausen-Ressourcen an einem Ort.")}
      </div>

      <Section title={t("progress.section_levelup","Level-Up Assistant")} icon="⬆️" defaultOpen>
        <LevelUpAssistant char={char} setChar={setChar} />
      </Section>

      <Section title={t("progress.section_hd","Trefferwürfel-Status")} icon="🎲">
        <HitDicePanel char={char} setChar={setChar} />
      </Section>

      <Section title={t("progress.section_exhaustion","Erschöpfung")} icon="💀">
        <ExhaustionTracker char={char} setChar={setChar} />
      </Section>

      <Section title={t("progress.section_wildshape", isDruid ? "Wild Shape" : "Wild Shape / Polymorph")} icon="🐺" defaultOpen={isDruid}>
        <WildShapePanel />
      </Section>
    </div>
  );
}

// ─── Hit-Dice mini-panel: visual status of unspent / spent HD ────────────
function HitDicePanel({ char, setChar }) {
  const { t } = useI18n();
  const level = char?.level || 1;
  const used  = char?.hd_used || 0;
  const available = Math.max(0, level - used);
  const hd = char?.hd || "—";

  const dots = Array.from({ length: level }, (_, i) => i < available);

  const reset = () => setChar((p) => ({ ...p, hd_used: 0 }));
  const spend = () => setChar((p) => ({ ...p, hd_used: Math.min(level, (p.hd_used || 0) + 1) }));
  const unspend = () => setChar((p) => ({ ...p, hd_used: Math.max(0, (p.hd_used || 0) - 1) }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{
          fontFamily: FH, fontSize: 22, fontWeight: 700, color: C.amberBright,
        }}>
          {available}/{level} <span style={{ fontSize: 14, color: C.textDim }}>× {hd}</span>
        </div>
        <div style={{ flex: 1, minWidth: 100, fontSize: 11, color: C.textDim }}>
          {t("progress.hd_hint","Würfeln passiert über '🌙 Kurze Rast' im Header. Vollständige Reset bei langer Rast.")}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {dots.map((isUnspent, i) => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: "50%",
            background: isUnspent ? C.amberBright : "transparent",
            border: `2px solid ${isUnspent ? C.amberBright : C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isUnspent ? "#000" : C.textDim,
            fontSize: 9, fontWeight: 700,
          }}>{i + 1}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" onClick={unspend} disabled={used === 0}
          style={{ ...sx.bsm(C.green), opacity: used === 0 ? 0.4 : 1 }}>
          ＋1 {t("progress.hd_restore","wiederherstellen")}
        </button>
        <button type="button" onClick={spend} disabled={available === 0}
          style={{ ...sx.bsm(C.red), opacity: available === 0 ? 0.4 : 1 }}>
          −1 {t("progress.hd_spend","verbrauchen")}
        </button>
        <button type="button" onClick={reset} disabled={used === 0}
          style={{ ...sx.bsm(C.purple), opacity: used === 0 ? 0.4 : 1 }}>
          ⟲ {t("progress.hd_reset","Alle zurück")}
        </button>
      </div>
    </div>
  );
}

// ─── Collapsible Section wrapper ──────────────────────────────────────────
function Section({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      ...sx.card,
      marginBottom: 8,
      padding: 0,
      overflow: "hidden",
    }}>
      <button type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: open ? `${C.greenBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.greenBright}30` : "none",
          color: C.greenBright,
          fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          padding: "12px 14px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          textAlign: "left",
        }}>
        <span>{icon} {title}</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div style={{ padding: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
}
