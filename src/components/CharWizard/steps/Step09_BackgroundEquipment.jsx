import { C, sx, FH } from "../../../constants/theme.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step09_BackgroundEquipment({ state, updatePartial }) {
  const { t } = useI18n();
  const bg = BACKGROUNDS_FULL.find((b) => b.name === state.background);
  const aItems = Array.isArray(bg?.equipmentA) ? bg.equipmentA.join(", ") : (bg?.equipmentA || "—");
  const bItems = bg?.equipmentB || "50 GP";
  const choice = state.bgEquipmentChoice;

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s9.title","Background-Ausrüstung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s9.subtitle","Wähle Pack A oder Pack B (50 gp).")}
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <button type="button" onClick={() => updatePartial({ bgEquipmentChoice: "A" })}
          style={{ ...sx.card, cursor: "pointer", borderColor: choice === "A" ? C.gold : C.border, background: choice === "A" ? `${C.gold}22` : "transparent", textAlign: "left", padding: 16 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: choice === "A" ? C.gold : C.textBright, marginBottom: 6 }}>
            {choice === "A" ? "✓ " : ""}📦 Pack A
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>{aItems}</div>
        </button>
        <button type="button" onClick={() => updatePartial({ bgEquipmentChoice: "B" })}
          style={{ ...sx.card, cursor: "pointer", borderColor: choice === "B" ? C.gold : C.border, background: choice === "B" ? `${C.gold}22` : "transparent", textAlign: "left", padding: 16 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: choice === "B" ? C.gold : C.textBright, marginBottom: 6 }}>
            {choice === "B" ? "✓ " : ""}💰 Pack B
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>{bItems}</div>
        </button>
      </div>
    </div>
  );
}

export const validate = (s) => s.bgEquipmentChoice
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_equipment" };
