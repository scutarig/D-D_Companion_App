import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { generateWeather, generateWeatherWeek, WEATHER_SEASONS } from "../../data/dmGenerators.js";
import { useI18n } from "../../i18n/index.js";

/**
 * WeatherPanel — DM utility: roll a random weather entry (single day) or an
 * entire seven-day travel week for the given season. Uses the shared table
 * in data/dmGenerators.js.
 */
export default function WeatherPanel() {
  const { t } = useI18n();
  const [season, setSeason] = useState(WEATHER_SEASONS[0]);
  const [single, setSingle] = useState(null);
  const [week, setWeek] = useState(null);

  const rollOne = () => { setSingle(generateWeather(season)); setWeek(null); };
  const rollWeek = () => { setWeek(generateWeatherWeek(season)); setSingle(null); };

  const label = (k) => t(`wb.weather_${k}`, {
    season: "Jahreszeit", roll_single: "🎲 1 Tag würfeln", roll_week: "📅 7-Tage-Woche würfeln",
    temperature: "Temperatur", precipitation: "Niederschlag", wind: "Wind",
    day: "Tag",
  }[k] || k);

  const entryCard = (w, i) => (
    <div key={i} style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3,
    }}>
      {i != null && (
        <div style={{ fontFamily: FH, fontSize: 11, color: C.amberBright, fontWeight: 700 }}>
          {label("day")} {i + 1}
        </div>
      )}
      <div style={{ fontSize: 12, color: C.text }}>🌡 {w.temperature}</div>
      <div style={{ fontSize: 12, color: C.text }}>💧 {w.precipitation}</div>
      <div style={{ fontSize: 12, color: C.text }}>💨 {w.wind}</div>
    </div>
  );

  return (
    <div style={sx.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: FH, fontSize: 14, color: C.tealBright, fontWeight: 700 }}>
          🌤 {t("wb.weather_title","Wetter-Generator")}
        </div>
        <select value={season} onChange={(e) => setSeason(e.target.value)} style={{ ...sx.sel, width: "auto" }}>
          {WEATHER_SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={rollOne} style={{ ...sx.btn(C.amberBright), flex: 1 }}>
          {label("roll_single")}
        </button>
        <button type="button" onClick={rollWeek} style={{ ...sx.btn(C.tealBright), flex: 1 }}>
          {label("roll_week")}
        </button>
      </div>

      {single && (
        <div>{entryCard(single, null)}</div>
      )}
      {week && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 6 }}>
          {week.map((w, i) => entryCard(w, i))}
        </div>
      )}
    </div>
  );
}
