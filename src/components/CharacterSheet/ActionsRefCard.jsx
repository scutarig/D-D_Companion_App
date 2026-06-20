import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";
import { STD_ACTIONS, CORE_ACTION_NAMES } from "../CharActions.jsx";

/**
 * ActionsRefCard — Action / Bonus Action / Reaction list on the Übersicht
 * tab. Shows a union of:
 *   1. The PHB-2024 core list (Attack, Dash, Disengage, …) — always present
 *      as the reference, even on a fresh character.
 *   2. The player's own char.actions — anything added in Charakter → Kampf
 *      → Aktionen (including custom weapons, class features, etc.).
 *
 * char.actions wins on duplicates so per-character overrides (e.g. a tuned
 * "Attack" row with the right to-hit + damage) replace the generic PHB
 * reference instead of doubling it up.
 *
 * Layout mirrors SkillsCard: collapsible card header with summary counts,
 * one flat auto-fit grid of rows below. Each row is colour-coded by type
 * (⚔ action / ⚡ bonus / 🛡 reaction) and shows its description + the small
 * mechanical badges (range / to-hit / damage / save DC) inline at all times.
 */

const TYPE_META = {
  action:   { ab: "ACT", icon: "⚔",  color: "#dc2626" },
  bonus:    { ab: "BON", icon: "⚡", color: "#d97706" },
  reaction: { ab: "RXN", icon: "🛡", color: "#2563eb" },
};
const TYPE_ORDER = ["action", "bonus", "reaction"];

export default function ActionsRefCard({ char }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);

  const customActions = Array.isArray(char?.actions) ? char.actions : [];
  const isEN = lang === "en";
  const pickDesc   = (a) => (isEN && a.descriptionEN) ? a.descriptionEN : (a.description || "");
  const pickRange  = (a) => (isEN && a.rangeEN)       ? a.rangeEN       : a.range;
  const pickDamage = (a) => (isEN && a.damageEN)      ? a.damageEN      : a.damage;

  // Build the merged list: PHB core actions always show up; any matching
  // entry from char.actions overrides the PHB row (so a tuned Attack with
  // the right to-hit + damage wins). Custom (non-PHB) char.actions are
  // appended at the end of their type bucket. Match is case-insensitive on
  // the action name.
  const customByName = new Map(customActions.map((a) => [a.name?.toLowerCase(), a]));
  const phbCore = STD_ACTIONS.filter((a) => CORE_ACTION_NAMES.has(a.name));
  const mergedPhb = phbCore.map((std) => customByName.get(std.name.toLowerCase()) || std);
  const phbNames = new Set(phbCore.map((a) => a.name.toLowerCase()));
  const customExtras = customActions.filter((a) => !phbNames.has((a.name || "").toLowerCase()));
  const allActions = [...mergedPhb, ...customExtras];

  // Group by type, render in fixed action → bonus → reaction order so the
  // grid reads predictably regardless of how rows arrived.
  const sorted = TYPE_ORDER.flatMap((type) =>
    allActions.filter((a) => a.type === type)
  );
  // Append any actions whose type isn't one of the three known buckets at
  // the end so we never silently drop them.
  const unknown = allActions.filter((a) => !TYPE_ORDER.includes(a.type));
  const rows = [...sorted, ...unknown];

  // Header counts per known type — from the merged list, so the summary
  // reflects what's actually shown below.
  const counts = TYPE_ORDER.reduce((acc, type) => {
    acc[type] = allActions.filter((a) => a.type === type).length;
    return acc;
  }, {});

  return (
    <div style={{ ...sx.card, marginBottom: 10, padding: 0, overflow: "hidden" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        style={{
          width: "100%",
          background: open ? `${C.amberBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.amberBright}30` : "none",
          color: C.amberBright,
          fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
          textAlign: "left",
        }}>
        <span>⚔ {t("dash.actions_ref_header","Aktionen / Bonus / Reaktionen")}</span>
        <span style={{ flex: 1, fontSize: 11, color: C.textDim, fontWeight: 400 }}>
          <span style={{ color: TYPE_META.action.color }}>⚔ {counts.action || 0}</span>
          {" · "}
          <span style={{ color: TYPE_META.bonus.color }}>⚡ {counts.bonus || 0}</span>
          {" · "}
          <span style={{ color: TYPE_META.reaction.color }}>🛡 {counts.reaction || 0}</span>
        </span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        rows.length === 0 ? (
          // With the PHB core merged in this is effectively unreachable, but
          // keep the empty state for safety if STD_ACTIONS is ever empty.
          <div style={{ padding: "12px 14px", fontSize: 12, color: C.textDim, fontStyle: "italic" }}>
            {t("dash.actions_ref_empty","Noch keine Aktionen gepflegt. Füge welche im Tab Charakter → Kampf → Aktionen hinzu (es gibt einen 'Standard-Aktionen hinzufügen'-Button).")}
          </div>
        ) : (
          <div style={{ padding: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 6 }}>
            {rows.map((a) => {
              const meta = TYPE_META[a.type] || { ab: "?", icon: "?", color: C.textDim };
              const desc = pickDesc(a);
              const range = pickRange(a);
              const damage = pickDamage(a);
              return (
                <div key={a.id || `${a.type}_${a.name}`}
                  style={{
                    display: "flex", flexDirection: "column", gap: 4,
                    background: `${meta.color}0e`,
                    borderRadius: 6,
                    borderLeft: `3px solid ${meta.color}`,
                    padding: "5px 8px",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: meta.color, fontFamily: FH, fontSize: 9, fontWeight: 700, width: 30 }}>
                      {meta.ab}
                    </span>
                    <span style={{ flex: 1, fontSize: 12, color: C.textBright, fontWeight: 600 }}>
                      {a.name}
                    </span>
                  </div>
                  {(a.toHit || (damage && damage !== "—") || a.saveDC || range) && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 38, fontSize: 10 }}>
                      {a.toHit && <span style={{ color: C.blueBright }}>Hit {a.toHit}</span>}
                      {damage && damage !== "—" && <span style={{ color: C.redBright }}>{damage}</span>}
                      {a.saveDC && <span style={{ color: C.amberBright }}>DC {a.saveDC}{a.saveAbility ? ` ${a.saveAbility}` : ""}</span>}
                      {range && range !== "—" && <span style={{ color: C.textDim }}>⬡ {range}</span>}
                    </div>
                  )}
                  {desc && (
                    <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4, paddingLeft: 38 }}>
                      {desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
