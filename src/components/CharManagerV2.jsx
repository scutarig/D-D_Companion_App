import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";
import { useI18n } from "../i18n/index.js";

/**
 * CharManagerV2 — new 5-tab character area.
 *
 * Phase 1 (this file): skeleton only — 5 top-tabs, placeholder content per tab.
 * Toggle from old CharManager activates this view (`char_view_v2` setting).
 *
 * Tab plan (filled in subsequent phases):
 *   📜 Bogen     → read-only Char-Sheet (abilities, skills, saves, derived)
 *   🧬 Aufbau    → edit identity, race, class, background, stats, skills, mastery
 *   ⚔️ Kampf     → spellbook, slots, actions, conditions
 *   🎒 Inventar  → items, equipped, currency, attunement
 *   📈 Progress  → level-up, exhaustion, hit dice, wild shape
 */
export default function CharManagerV2() {
  const { t } = useI18n();
  const { active } = useChar();
  const [tab, setTab] = useState("bogen");

  const TABS = [
    { id: "bogen",    label: t("v2.tab_bogen",    "📜 Bogen") },
    { id: "aufbau",   label: t("v2.tab_aufbau",   "🧬 Aufbau") },
    { id: "kampf",    label: t("v2.tab_kampf",    "⚔️ Kampf") },
    { id: "inv",      label: t("v2.tab_inv",      "🎒 Inventar") },
    { id: "progress", label: t("v2.tab_progress", "📈 Progress") },
  ];

  if (!active) return null;

  return (
    <div data-no-print>
      <nav style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: 4,
        marginBottom: 14,
        padding: "0 2px",
      }}>
        {TABS.map((tb) => (
          <button
            type="button"
            key={tb.id}
            onClick={() => { setTab(tb.id); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); }}
            style={{
              ...sx.nb(tab === tb.id),
              textAlign: "center",
              padding: "8px 6px",
              fontSize: 11,
            }}
          >
            {tb.label}
          </button>
        ))}
      </nav>

      <div>
        {tab === "bogen"    && <PlaceholderTab title="📜 Bogen" desc={t("v2.placeholder_bogen", "Hier kommt das klassische Char-Sheet — Stats, Saves, Skills, Derived Values.")} phase={2} />}
        {tab === "aufbau"   && <PlaceholderTab title="🧬 Aufbau" desc={t("v2.placeholder_aufbau", "Identity, Volk, Klassen, Hintergrund, Origin-Feat, Stats/Skill-Editor, Weapon-Mastery, Sprachen.")} phase={3} />}
        {tab === "kampf"    && <PlaceholderTab title="⚔️ Kampf" desc={t("v2.placeholder_kampf", "Spellbook, Spell-Slots, Aktionen, Conditions, Equipped-Quick-View.")} phase={4} />}
        {tab === "inv"      && <PlaceholderTab title="🎒 Inventar" desc={t("v2.placeholder_inv", "Inventar, Equipped-Slots-Visual, Währung, Attunement-Tracker.")} phase={5} />}
        {tab === "progress" && <PlaceholderTab title="📈 Progress" desc={t("v2.placeholder_progress", "Level-Up-Assistant, Exhaustion, Hit-Dice, Wild-Shape.")} phase={6} />}
      </div>
    </div>
  );
}

function PlaceholderTab({ title, desc, phase }) {
  const { t } = useI18n();
  return (
    <div style={{
      ...sx.card,
      textAlign: "center",
      padding: 32,
      borderColor: `${C.amberBright}33`,
      background: `linear-gradient(180deg, ${C.amberBright}06 0%, transparent 100%)`,
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{title.split(" ")[0]}</div>
      <h2 style={{
        ...sx.ct,
        color: C.amberBright,
        fontSize: 18,
        borderBottom: "none",
        margin: "0 0 8px",
        padding: 0,
      }}>
        {title}
      </h2>
      <p style={{ color: C.text, fontSize: 13, lineHeight: 1.55, margin: "0 0 14px", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
        {desc}
      </p>
      <div style={{
        display: "inline-block",
        padding: "4px 10px",
        background: `${C.gold}22`,
        border: `1px solid ${C.gold}55`,
        borderRadius: 12,
        color: C.gold,
        fontFamily: FH,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}>
        {t("v2.coming_in_phase", "Kommt in Phase {n}").replace("{n}", phase)}
      </div>
    </div>
  );
}
