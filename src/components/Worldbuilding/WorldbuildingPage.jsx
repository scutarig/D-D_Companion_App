import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";
import LocationsList    from "./LocationsList.jsx";
import FactionsList     from "./FactionsList.jsx";
import QuestList        from "./QuestList.jsx";
import DowntimeTracker  from "../Downtime/DowntimeTracker.jsx";

export default function WorldbuildingPage() {
  const { t } = useI18n();
  const TABS = [
    { id: "quests",    label: t("wb.tab_quests","📋 Quests")     },
    { id: "locations", label: t("wb.tab_locations","📍 Orte")    },
    { id: "factions",  label: t("wb.tab_factions","⚔️ Fraktionen") },
    { id: "downtime",  label: t("wb.tab_downtime","⏳ Downtime") },
  ];
  const [tab, setTab] = useState("quests");

  return (
    <div>
      {/* Sub-tabs — 2×2 grid auf Mobile (saubere Symmetrie statt 3+1 wrap),
          horizontale Reihe auf größeren Viewports. */}
      <nav style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 6,
        padding: "10px 12px 4px",
        maxWidth: 600,
        margin: "0 auto",
        background: "transparent",
        border: "none",
      }}>
        {TABS.map(tb => (
          <button type="button" key={tb.id} onClick={() => setTab(tb.id)} style={{
            ...sx.nb(tab === tb.id),
            textAlign: "center",
          }}>
            {tb.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ ...sx.main, paddingTop:10 }}>
        {tab === "quests"    && <QuestList />}
        {tab === "locations" && <LocationsList />}
        {tab === "factions"  && <FactionsList />}
        {tab === "downtime"  && <DowntimeTracker />}
      </div>
    </div>
  );
}
