import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { useChar } from "../../context/CharContext.jsx";
import { useI18n } from "../../i18n/index.js";
import CharActions from "../CharActions.jsx";
import Spellbook from "../Spellbook.jsx";
import Tokens from "../Tokens.jsx";
import ConditionsTracker from "../ConditionsTracker.jsx";

/**
 * Kampf — Combat-oriented tab (Tab 3 of CharManagerV2).
 *
 * Bundles 4 collapsible sections in a play-oriented order:
 *   1. Aktionen       — CharActions (Standard + Class + Custom)
 *   2. Spellbook      — known + prepared spells
 *   3. Slots & Tokens — spell slots + class resources + custom tokens
 *   4. Conditions     — active conditions + exhaustion tracker
 *
 * usedSlots state is read/written via the same key the classic CharManager
 * uses (`tokens_used_${aid}`), so toggling between views is non-destructive.
 */
export default function Kampf({ char, setChar }) {
  const { t } = useI18n();
  const { aid } = useChar();
  const [usedSlots, setUsedSlots] = usePersist(`tokens_used_${aid}`, {});

  return (
    <div>
      <div style={{
        padding: "8px 12px", marginBottom: 14,
        background: `${C.redBright}10`,
        border: `1px dashed ${C.redBright}40`,
        borderRadius: 8,
        color: C.redBright,
        fontSize: 11, lineHeight: 1.5, textAlign: "center",
      }}>
        ⚔️ {t("kampf.intro","Alles für den Kampf: Aktionen, Zauber, Slots und Conditions.")}
      </div>

      <Section title={t("kampf.section_actions","Aktionen")} icon="⚔️" defaultOpen>
        <CharActions char={char} setChar={setChar} />
      </Section>

      <Section title={t("kampf.section_spellbook","Spellbook")} icon="🔮">
        <Spellbook key={aid} charId={aid} />
      </Section>

      <Section title={t("kampf.section_tokens","Spell-Slots & Tokens")} icon="🏷️">
        <Tokens char={char} charId={aid} usedSlots={usedSlots} setUsedSlots={setUsedSlots} />
      </Section>

      <Section title={t("kampf.section_conditions","Conditions & Erschöpfung")} icon="⚡">
        <ConditionsTracker char={char} setChar={setChar} />
      </Section>
    </div>
  );
}

// ─── Collapsible Section wrapper (mirrors Aufbau.jsx) ─────────────────────
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
          background: open ? `${C.redBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.redBright}30` : "none",
          color: C.redBright,
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
