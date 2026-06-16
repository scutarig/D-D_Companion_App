import { C, sx, FH } from "../../../constants/theme.js";
import { RACES_FULL } from "../../../data/races.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step10_SpeciesSelect({ state, updatePartial }) {
  const { t, lang } = useI18n();
  const races = RACES_FULL.filter((r) => r.edition === "2024");

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s10.title","Wähle deine Spezies")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s10.subtitle","Spezies bestimmt Größe, Geschwindigkeit und besondere Eigenschaften.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {races.map((r) => {
          const isSelected = state.race === r.name;
          const label = lang === "en" ? (r.nameEN || r.name) : r.name;
          const size = lang === "en" ? (r.sizeEN || r.size) : r.size;
          return (
            <button type="button" key={r.name}
              onClick={() => updatePartial({ race: r.name })}
              style={{
                ...sx.card,
                cursor: "pointer",
                textAlign: "left",
                borderColor: isSelected ? C.gold : C.border,
                background: isSelected ? `${C.gold}22` : "transparent",
              }}>
              <div style={{ fontFamily: FH, fontWeight: 700, color: isSelected ? C.gold : C.textBright, marginBottom: 4 }}>
                {isSelected ? "✓ " : ""}{label}
              </div>
              <div style={{ fontSize: 11, color: C.textDim }}>
                <strong>{t("wizard.s10.speed","Speed")}:</strong> {r.speed} ft · <strong>{t("wizard.s10.size","Größe")}:</strong> {size}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const validate = (s) => s.race ? { ok: true } : { ok: false, errorKey: "wizard.err_no_species" };
