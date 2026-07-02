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
      {/* Header row: title left, ＋ Hinzufügen anchored right. Content
          (pills or empty-state hint) lives on its own row below so the
          first condition doesn't sit on the same line as the heading. */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: C.redBright, fontWeight: 700, letterSpacing: 0.5 }}>
          🌪 {t("dash.conditions_header","Aktive Conditions")}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button"
          onClick={() => setPickerOpen((o) => !o)}
          title={t("dash.conditions_add_hint","Condition hinzufügen")}
          aria-expanded={pickerOpen}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px",
            background: pickerOpen ? `${C.tealBright}22` : "transparent",
            border: `1px dashed ${C.tealBright}88`,
            borderRadius: 12,
            color: C.tealBright,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}>
          <span>＋</span>
          <span>{t("dash.conditions_add","Hinzufügen")}</span>
        </button>
      </div>

      {/* Aggregate-effect summary when 2+ conditions stack. Only surfaces
          the mechanical hints (auto-fail saves + attack-modifier notes)
          rather than repeating each condition's full description — the
          per-pill tooltips still carry the source text. */}
      {(() => {
        if (active.length < 2) return null;
        const conds = active.map(condByName).filter(Boolean);
        const failSet = new Set();
        let attackerDisadv = 0, attackerAdv = 0;
        let targetAdv = 0, targetDisadv = 0;
        let speedZero = false, noActions = false;
        for (const c of conds) {
          const e = c.effects || {};
          (e.autoFailSaves || []).forEach((s) => failSet.add(s));
          if (e.attackerDisadvantage) attackerDisadv++;
          if (e.attackerAdvantage)    attackerAdv++;
          if (e.targetAdvantage)      targetAdv++;
          if (e.targetDisadvantage)   targetDisadv++;
          if (e.speedZero)  speedZero = true;
          if (e.noActions)  noActions = true;
        }
        const bits = [];
        if (failSet.size)      bits.push(`✗ ${t("dash.cond_int_autofail","Auto-Fail")}: ${[...failSet].join(", ")}`);
        if (attackerDisadv)    bits.push(`⬇ ${t("dash.cond_int_your_attacks_dis","Deine Angriffe: Nachteil")}`);
        if (attackerAdv)       bits.push(`⬆ ${t("dash.cond_int_your_attacks_adv","Deine Angriffe: Vorteil")}`);
        if (targetAdv)         bits.push(`⬆ ${t("dash.cond_int_vs_you_adv","Angriffe gegen dich: Vorteil")}`);
        if (targetDisadv)      bits.push(`⬇ ${t("dash.cond_int_vs_you_dis","Angriffe gegen dich: Nachteil")}`);
        if (speedZero)         bits.push(`⛔ ${t("dash.cond_int_speed_zero","Speed 0")}`);
        if (noActions)         bits.push(`💫 ${t("dash.cond_int_no_actions","Keine Aktionen/Reaktionen")}`);
        if (!bits.length) return null;
        return (
          <div style={{
            marginBottom: 6,
            padding: "4px 8px",
            background: `${C.redBright}10`,
            border: `1px solid ${C.redBright}44`,
            borderRadius: 6,
            fontSize: 10, color: C.redBright,
            display: "flex", flexWrap: "wrap", gap: 6,
          }}>
            {bits.map((b, i) => <span key={i}>{b}</span>)}
          </div>
        );
      })()}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
