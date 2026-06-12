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
      {/* Sub-tabs */}
      <nav style={sx.nav}>
        {TABS.map(tb => (
          <button type="button" key={tb.id} onClick={() => setTab(tb.id)} style={sx.nb(tab === tb.id)}>
            {tb.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ ...sx.main, paddingTop:14 }}>
        {tab === "quests"    && <QuestList />}
        {tab === "locations" && <LocationsList />}
        {tab === "factions"  && <FactionsList />}
        {tab === "downtime"  && <DowntimeTracker />}
      </div>
    </div>
  );
}
