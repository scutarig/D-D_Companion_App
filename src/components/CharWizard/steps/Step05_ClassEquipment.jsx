import { C, sx, FH } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step05_ClassEquipment({ state, updatePartial }) {
  const { t } = useI18n();
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);
  const eq = cls?.startingEquipment || { A: "—", B: "—" };
  const choice = state.classEquipmentChoice;

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s5.title","Klassen-Ausrüstung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s5.subtitle","Wähle Pack A oder Pack B.")}
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        {["A", "B"].map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => updatePartial({ classEquipmentChoice: p })}
            style={{
              ...sx.card,
              cursor: "pointer",
              borderColor: choice === p ? C.gold : C.border,
              background: choice === p ? `${C.gold}22` : "transparent",
              textAlign: "left",
              padding: 16,
            }}
          >
            <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 14, color: choice === p ? C.gold : C.textBright, marginBottom: 6 }}>
              {choice === p ? "✓ " : ""}{p === "A" ? t("wizard.s5.pack_a","📦 Pack A") : t("wizard.s5.pack_b","💰 Pack B")}
            </div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>{eq[p]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const validate = (s) => s.classEquipmentChoice
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_equipment" };
