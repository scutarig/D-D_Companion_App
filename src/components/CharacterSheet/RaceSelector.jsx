import { C, sx, FH } from "../../constants/theme.js";
import { ALL_VOELKER } from "../../data/races.js";
import { getRaceData, formatStatBonuses } from "../../utils/races.js";
import { useRaceTraits } from "../../hooks/useRaceTraits.js";

/**
 * RaceSelector — Enhanced race dropdown with stat bonus preview
 * Props: char, setChar
 */
export default function RaceSelector({ char, setChar }) {
  const { handleRaceChange } = useRaceTraits(setChar);
  const raceData = getRaceData(char.race);
  const bonusStr = raceData ? formatStatBonuses(raceData.statBonuses) : "";
  const traitCount = raceData ? raceData.traits.length + raceData.features.length : 0;

  const onChange = (e) => {
    const val = e.target.value;
    if (val === "Eigenes") {
      setChar(p => ({ ...p, race: "Eigenes" }));
    } else {
      handleRaceChange(val);
    }
  };

  return (
    <div>
      <label style={sx.lbl}>Volk</label>
      <select
        value={char.race}
        onChange={onChange}
        style={sx.sel}
      >
        {ALL_VOELKER.map(r => <option key={r}>{r}</option>)}
        <option value="Eigenes">Eigenes...</option>
      </select>

      {char.race === "Eigenes" && (
        <input
          value={char.raceCustom || ""}
          onChange={e => setChar(p => ({ ...p, raceCustom: e.target.value }))}
          style={{ ...sx.inp, marginTop: 4 }}
          placeholder="Eigenes Volk..."
        />
      )}

      {/* Bonus / trait preview pill */}
      {raceData && (
        <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
          {bonusStr && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
              background: `${C.tealBright}18`, border: `1px solid ${C.tealBright}44`,
              color: C.tealBright, letterSpacing: 0.3,
            }}>
              {bonusStr}
            </span>
          )}
          {traitCount > 0 && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8,
              background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
              color: C.amberBright,
            }}>
              {traitCount} Traits
            </span>
          )}
        </div>
      )}
    </div>
  );
}
