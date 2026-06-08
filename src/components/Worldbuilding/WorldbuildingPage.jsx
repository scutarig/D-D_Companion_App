import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import LocationsList    from "./LocationsList.jsx";
import FactionsList     from "./FactionsList.jsx";
import QuestList        from "./QuestList.jsx";
import DowntimeTracker  from "../Downtime/DowntimeTracker.jsx";

const TABS = [
  { id: "quests",    label: "📋 Quests"     },
  { id: "locations", label: "📍 Orte"       },
  { id: "factions",  label: "⚔️ Fraktionen" },
  { id: "downtime",  label: "⏳ Downtime"   },
];

export default function WorldbuildingPage() {
  const [tab, setTab] = useState("quests");

  return (
    <div>
      {/* Header */}
      <div style={sx.hdr}>
        <span style={{ fontSize:22 }}>🌍</span>
        <div>
          <div style={sx.hT}>WELTENBAU</div>
          <div style={sx.hS}>Quests · Orte · Fraktionen · Downtime</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <nav style={sx.nav}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={sx.nb(tab === t.id)}>
            {t.label}
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
