import { C, sx, FH } from "../../constants/theme.js";
import { CONDITIONS } from "../../data/conditions.js";
import { useI18n } from "../../i18n/index.js";

/**
 * ConditionsCard — dashboard-side view of active conditions. Click a pill
 * to remove the condition (no confirm — symmetric with how chars get them
 * applied via spells/effects). For a deeper view + Exhaustion ladder, the
 * Kampf-Tab still holds the full ConditionsTracker.
 */
export default function ConditionsCard({ char, setChar }) {
  const { t, lang } = useI18n();
  const active = Array.isArray(char.activeConditions) ? char.activeConditions : [];

  const remove = (id) => {
    setChar((p) => ({
      ...p,
      activeConditions: (p.activeConditions || []).filter((cid) => cid !== id),
    }));
  };

  const condByName = (id) => CONDITIONS.find((c) => c.id === id);

  return (
    <div style={{ ...sx.card, marginBottom: 10, padding: "8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: C.redBright, fontWeight: 700, letterSpacing: 0.5 }}>
          🌪 {t("dash.conditions_header","Aktive Conditions")}
        </span>
        {active.length === 0 ? (
          <span style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
            {t("dash.conditions_none","Keine — alles klar")}
          </span>
        ) : (
          active.map((id) => {
            const c = condByName(id);
            const label = c ? (lang === "en" ? (c.nameEN || c.name) : c.name) : id;
            const icon = c?.icon || "⚡";
            const desc = c ? (lang === "en" ? c.descEN : c.desc) : "";
            return (
              <button key={id}
                type="button"
                onClick={() => remove(id)}
                title={desc ? `${desc}\n\n${t("dash.conditions_remove_hint","Klick: entfernen")}` : t("dash.conditions_remove_hint","Klick: entfernen")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "3px 10px",
                  background: `${C.redBright}18`,
                  border: `1px solid ${C.redBright}55`,
                  borderRadius: 12,
                  color: C.redBright,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}>
                <span>{icon}</span>
                <span>{label}</span>
                <span style={{ opacity: 0.7, marginLeft: 2 }}>×</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
