import { C, FH } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

// PHB 2024 RACES_FULL data in our codebase doesn't expose explicit open
// choices (Hochelf cantrip, Tiefling spell line, etc. are baked into traits).
// This step is rendered when hasSpeciesChoice returns true — currently
// always false — and shows a polite empty-state.
export default function Step11_SpeciesChoices() {
  const { t } = useI18n();
  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s11.title","Spezies-Auswahl")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12 }}>
        {t("wizard.s11.no_choice","Keine Auswahl für diese Spezies erforderlich.")}
      </p>
    </div>
  );
}

export const validate = () => ({ ok: true });
