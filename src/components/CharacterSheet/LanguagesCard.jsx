import { C, sx, FH } from "../../constants/theme.js";
import { langLabel } from "../../data/languages.js";
import { useI18n } from "../../i18n/index.js";

/**
 * LanguagesCard — compact list of spoken languages for the dashboard. Common
 * RP question is "do I understand the NPC?"; this surfaces it without a tab
 * switch. Custom (non-standard) entries pass through langLabel unchanged.
 */
export default function LanguagesCard({ char }) {
  const { t, lang } = useI18n();
  const langs = Array.isArray(char.languages) ? char.languages.filter(Boolean) : [];

  return (
    <div style={{ padding: "2px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: C.tealBright, fontWeight: 700, letterSpacing: 0.5 }}>
          🗣 {t("dash.languages_header","Sprachen")}
        </span>
        {langs.length === 0 ? (
          <span style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
            {t("dash.languages_none","Keine Sprachen eingetragen")}
          </span>
        ) : (
          langs.map((l, i) => (
            <span key={`${l}-${i}`} style={{
              display: "inline-block",
              padding: "2px 10px",
              background: `${C.tealBright}18`,
              border: `1px solid ${C.tealBright}55`,
              borderRadius: 12,
              color: C.tealBright,
              fontSize: 11,
              fontWeight: 700,
            }}>
              {langLabel(l, lang)}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
