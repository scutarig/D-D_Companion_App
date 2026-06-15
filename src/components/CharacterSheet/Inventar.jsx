import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";
import CharInventory from "../CharInventory.jsx";
import Katalog from "../Katalog.jsx";
import CurrencyTab from "../CurrencyTab.jsx";

/**
 * Inventar — Equipment & Wealth tab (Tab 4 of CharManagerV2).
 *
 * Bundles 3 collapsible sections:
 *   1. Ausrüstung & Slots — CharInventory (Items + 10 Equip-Slots + Attunement)
 *   2. Währung            — CurrencyTab (PP/GP/EP/SP/CP + transactions)
 *   3. Item-Katalog       — Katalog (browse + add items)
 */
export default function Inventar({ char, setChar }) {
  const { t } = useI18n();

  return (
    <div>
      <div style={{
        padding: "8px 12px", marginBottom: 14,
        background: `${C.gold}10`,
        border: `1px dashed ${C.gold}40`,
        borderRadius: 8,
        color: C.gold,
        fontSize: 11, lineHeight: 1.5, textAlign: "center",
      }}>
        🎒 {t("inventar.intro","Ausrüstung, Slots, Attunement und Währung an einem Ort.")}
      </div>

      <Section title={t("inventar.section_equipment","Ausrüstung & Slots")} icon="🎒" defaultOpen>
        <CharInventory char={char} setChar={setChar} />
      </Section>

      <Section title={t("inventar.section_currency","Währung")} icon="💰">
        <CurrencyTab />
      </Section>

      <Section title={t("inventar.section_catalog","Item-Katalog")} icon="📚">
        <Katalog char={char} setChar={setChar} />
      </Section>
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
          background: open ? `${C.gold}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.gold}30` : "none",
          color: C.gold,
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
