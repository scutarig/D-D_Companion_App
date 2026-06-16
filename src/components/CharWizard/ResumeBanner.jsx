import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

export default function ResumeBanner({ wizardState, onResume, onDiscard }) {
  const { t } = useI18n();
  if (!wizardState) return null;

  const ageMin = Math.max(1, Math.floor((Date.now() - (wizardState.startedAt || Date.now())) / 60000));
  const ageLabel = ageMin > 60
    ? `${Math.floor(ageMin / 60)} Std`
    : `${ageMin} Min`;

  return (
    <div style={{
      ...sx.card,
      borderColor: `${C.amberBright}55`,
      background: `linear-gradient(135deg, ${C.amberBright}11, transparent)`,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 24 }}>🔄</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: FH, fontWeight: 700, color: C.amberBright }}>
            {t("wizard.shell.resume_title","Du hast eine unfertige Char-Erstellung")}
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {wizardState.name || "—"} · {wizardState.klass || "—"}
            {wizardState.targetLevel > 1 && ` · Lv${wizardState.targetLevel}`}
            {" · "}gestartet vor {ageLabel}
          </div>
        </div>
        <button type="button" onClick={onResume} style={sx.btn(C.amber)}>
          {t("wizard.shell.resume_resume","▶ Fortsetzen")}
        </button>
        <button type="button" onClick={onDiscard} style={sx.bsm(C.red)}>
          {t("wizard.shell.resume_discard","🗑 Verwerfen & neu")}
        </button>
      </div>
    </div>
  );
}
