import { C, FH } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

// PHB 2024 backgrounds in our current data don't expose explicit open
// choices (tool/language picks are baked into the strings). This step is
// rendered when hasBgChoice returns true — currently always false — and
// shows a polite empty-state. Future data shape changes can re-enable it.
export default function Step08_BackgroundChoices() {
  const { t } = useI18n();
  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s8.title","Background-Auswahl")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12 }}>
        {t("wizard.s8.no_choice","Dieser Background hat keine offenen Auswahlen.")}
      </p>
    </div>
  );
}

export const validate = () => ({ ok: true });
