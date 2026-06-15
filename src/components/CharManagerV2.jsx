import { sx } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";
import { usePersist } from "../hooks/usePersist.js";
import { useI18n } from "../i18n/index.js";
import Bogen from "./CharacterSheet/Bogen.jsx";
import Aufbau from "./CharacterSheet/Aufbau.jsx";
import Kampf from "./CharacterSheet/Kampf.jsx";
import Inventar from "./CharacterSheet/Inventar.jsx";
import Progress from "./CharacterSheet/Progress.jsx";

/**
 * CharManagerV2 — 5-tab character area.
 *
 *   📜 Bogen     → read-only Char-Sheet (abilities, skills, saves, derived)
 *   🧬 Aufbau    → edit identity, race, class, background, stats, skills, mastery
 *   ⚔️ Kampf     → spellbook, slots, actions, conditions
 *   🎒 Inventar  → items, equipped, currency, attunement
 *   📈 Progress  → level-up, exhaustion, hit dice, wild shape
 */
export default function CharManagerV2() {
  const { t } = useI18n();
  const { active, setActive } = useChar();
  const [tab, setTab] = usePersist("char_tab_v2", "bogen");

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
        {tab === "bogen"    && <Bogen char={active} setChar={setActive} />}
        {tab === "aufbau"   && <Aufbau char={active} setChar={setActive} />}
        {tab === "kampf"    && <Kampf char={active} setChar={setActive} />}
        {tab === "inv"      && <Inventar char={active} setChar={setActive} />}
        {tab === "progress" && <Progress char={active} setChar={setActive} />}
      </div>
    </div>
  );
}
