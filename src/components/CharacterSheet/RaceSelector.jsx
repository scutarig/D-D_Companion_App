import { C, sx, FH } from "../../constants/theme.js";
import { ALL_VOELKER, DND_RACES } from "../../data/races.js";
import { getRaceData, formatStatBonuses } from "../../utils/races.js";
import { useRaceTraits } from "../../hooks/useRaceTraits.js";
import { useI18n } from "../../i18n/index.js";

/**
 * RaceSelector — Enhanced race dropdown with stat bonus preview + 2024 Lineage-Picker
 * Props: char, setChar
 *
 * 2024 PHB: Elf/Gnome/Tiefling haben Lineages innerhalb der Species (3-2-3 Optionen).
 * Wird in `char.lineage` (Lineage-ID) persistiert.
 */
export default function RaceSelector({ char, setChar }) {
  const { t } = useI18n();
  const { handleRaceChange } = useRaceTraits(setChar);
  const raceData = getRaceData(char.race);
  const bonusStr = raceData ? formatStatBonuses(raceData.statBonuses) : "";
  const traitCount = raceData ? raceData.traits.length + raceData.features.length : 0;

  // 2024 Edition + Legacy Tags
  const raceEntry = DND_RACES.find(r => r.name === char.race);
  const edition = raceEntry?.edition;
  const isLegacy = !!raceEntry?.legacy;

  // 2024 Lineages (Elf/Gnome/Tiefling)
  const lineages = raceData?.lineages || [];
  const selectedLineage = lineages.find(l => l.id === char.lineage);

  const onChange = (e) => {
    const val = e.target.value;
    if (val === "Eigenes") {
      setChar(p => ({ ...p, race: "Eigenes", lineage: null }));
    } else {
      handleRaceChange(val);
      // Reset lineage when changing species
      setChar(p => ({ ...p, lineage: null }));
    }
  };

  const onLineageChange = (e) => {
    setChar(p => ({ ...p, lineage: e.target.value || null }));
  };

  return (
    <div>
      <label style={sx.lbl}>{t("char.species_label","Volk / Species")}</label>
      <select
        value={char.race}
        onChange={onChange}
        style={sx.sel}
      >
        {ALL_VOELKER.map(r => <option key={r}>{r}</option>)}
        <option value="Eigenes">{t("char.custom_option","Eigenes...")}</option>
      </select>

      {char.race === "Eigenes" && (
        <input
          value={char.raceCustom || ""}
          onChange={e => setChar(p => ({ ...p, raceCustom: e.target.value }))}
          style={{ ...sx.inp, marginTop: 4 }}
          placeholder={t("char.custom_placeholder","Eigenes Volk...")}
        />
      )}

      {/* Edition + Bonus + Trait preview pills */}
      {raceData && (
        <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
          {edition === "2024" && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
              background: `${C.purpleBright}1f`, border: `1px solid ${C.purpleBright}55`,
              color: C.purpleBright, letterSpacing: 0.3,
            }}>
              2024 PHB
            </span>
          )}
          {isLegacy && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
              background: `${C.amberBright}1f`, border: `1px solid ${C.amberBright}55`,
              color: C.amberBright, letterSpacing: 0.3,
            }} title={t("char.legacy_2014_title","2014er Mechanik — nicht im 2024 PHB Core")}>
              {t("char.legacy_2014_tag","⚠ Legacy 2014")}
            </span>
          )}
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
              {traitCount} {t("char.traits_count","Traits")}
            </span>
          )}
        </div>
      )}

      {/* 2024 Lineage Picker (Elf/Gnome/Tiefling) */}
      {lineages.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <label style={sx.lbl}>
            {t("char.lineage_label","Lineage (2024 PHB)")}
            <span style={{ color: C.textDim, fontSize: 9, marginLeft: 6, textTransform: "none" }}>
              {t("char.lineage_sublabel","— Sub-Identität deiner Species")}
            </span>
          </label>
          <select
            value={char.lineage || ""}
            onChange={onLineageChange}
            style={sx.sel}
          >
            <option value="">{t("char.lineage_choose","— Wähle Lineage —")}</option>
            {lineages.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {selectedLineage && (
            <div style={{
              marginTop: 6,
              padding: "8px 10px",
              borderRadius: 6,
              background: `${C.purple}0d`,
              border: `1px solid ${C.purple}30`,
              borderLeft: `3px solid ${C.purpleBright}`,
            }}>
              <div style={{ fontSize: 11, color: C.purpleBright, fontFamily: FH, fontWeight: 700, marginBottom: 3 }}>
                {selectedLineage.name}
              </div>
              <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>
                {selectedLineage.description}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
