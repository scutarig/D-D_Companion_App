import { useState, useRef, useEffect } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { CONDITIONS } from "../../utils/conditions.js";
import { useI18n } from "../../i18n/index.js";

/**
 * ConditionsCard — dashboard-side view of active conditions. Click a pill
 * to remove the condition (no confirm — symmetric with how chars get them
 * applied via spells/effects). The "+" pill opens a popover picker so the
 * player can add a condition without leaving the Übersicht tab. For the
 * deeper view + Exhaustion ladder, the Kampf-Tab still holds the full
 * ConditionsTracker.
 */
export default function ConditionsCard({ char, setChar }) {
  const { t, lang } = useI18n();
  const active = Array.isArray(char.activeConditions) ? char.activeConditions : [];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFilter, setPickerFilter] = useState("");
  const popRef = useRef(null);

  // Click-outside closes the popover
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  const remove = (id) => {
    setChar((p) => ({
      ...p,
      activeConditions: (p.activeConditions || []).filter((cid) => cid !== id),
    }));
  };

  const add = (id) => {
    setChar((p) => {
      const cur = p.activeConditions || [];
      if (cur.includes(id)) return p;
      return { ...p, activeConditions: [...cur, id] };
    });
  };

  const condByName = (id) => CONDITIONS.find((c) => c.id === id);
  const labelOf = (c) => (lang === "en" ? (c.nameEN || c.name) : c.name);

  // Picker excludes Exhaustion (own tracker), non-PHB combat markers
  // (concentration is tracked via ConcentrationBanner; hidden/raging are
  // Combat-tab flags), and already-active conditions.
  const NON_PICKABLE = new Set(["exhaustion", "concentration", "hidden", "raging"]);
  const pickable = CONDITIONS
    .filter((c) => !NON_PICKABLE.has(c.id) && !active.includes(c.id))
    .filter((c) => {
      if (!pickerFilter.trim()) return true;
      const q = pickerFilter.trim().toLowerCase();
      return labelOf(c).toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });

  return (
    <div style={{ marginBottom: 6, padding: "2px 4px", position: "relative" }}>
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
            const label = c ? labelOf(c) : id;
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

        {/* "+" picker pill — always visible so the player can add quickly. */}
        <button type="button"
          onClick={() => setPickerOpen((o) => !o)}
          title={t("dash.conditions_add_hint","Condition hinzufügen")}
          aria-expanded={pickerOpen}
          style={{
            marginLeft: "auto",
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px",
            background: pickerOpen ? `${C.tealBright}22` : "transparent",
            border: `1px dashed ${C.tealBright}88`,
            borderRadius: 12,
            color: C.tealBright,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}>
          <span>＋</span>
          <span>{t("dash.conditions_add","Hinzufügen")}</span>
        </button>
      </div>

      {/* Popover picker — anchored to card top-right, scrolls if long. */}
      {pickerOpen && (
        <div ref={popRef} style={{
          position: "absolute",
          top: "100%",
          right: 8,
          marginTop: 4,
          width: 280,
          maxHeight: 380,
          overflowY: "auto",
          background: C.card,
          border: `1px solid ${C.tealBright}66`,
          borderRadius: 10,
          padding: 8,
          boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
          zIndex: 60,
        }}>
          <input
            type="text"
            value={pickerFilter}
            onChange={(e) => setPickerFilter(e.target.value)}
            placeholder={t("dash.conditions_search","Suchen …")}
            autoFocus
            style={{
              ...sx.inp,
              width: "100%",
              marginBottom: 8,
              fontSize: 12,
              padding: "5px 8px",
              boxSizing: "border-box",
            }}
          />
          {pickable.length === 0 ? (
            <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", padding: "8px 4px" }}>
              {t("dash.conditions_picker_empty","Keine Treffer")}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {pickable.map((c) => {
                const desc = lang === "en" ? c.descEN : c.desc;
                return (
                  <button key={c.id}
                    type="button"
                    onClick={() => { add(c.id); setPickerFilter(""); setPickerOpen(false); }}
                    title={desc || ""}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "5px 8px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      color: C.text,
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}>
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{labelOf(c)}</span>
                    <span style={{ fontSize: 12, color: C.tealBright }}>＋</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
