import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * ActionsRefCard — condensed "what can I do this turn" reference for the
 * Dashboard. Source-of-truth STD_ACTIONS lives in CharActions.jsx; this view
 * repeats only the core PHB 2024 list (no class-specifics) so it stays
 * scannable at the table.
 *
 * Layout mirrors SkillsCard: collapsible card, header with summary, and one
 * flat auto-fit grid of action rows. Each row is colour-coded by type
 * (⚔ action / ⚡ bonus / 🛡 reaction) and shows its description inline at
 * all times — no extra click needed to read what the action does.
 */

const CORE_ACTIONS = [
  { type: "action", name: "Attack", desc: "Melee/Ranged. Extra Attacks ab Lv5+." },
  { type: "action", name: "Magic", desc: "Spell wirken / Magic Item / mag. Klassen-Feature." },
  { type: "action", name: "Dash", desc: "Extra-Bewegung = Speed (Rest des Zuges)." },
  { type: "action", name: "Disengage", desc: "Bewegung provoziert keine OAs." },
  { type: "action", name: "Dodge", desc: "Angriffe vs. dich = Nachteil; DEX-Saves = Vorteil." },
  { type: "action", name: "Help", desc: "Ally erhält Vorteil auf nächste Probe/Angriff." },
  { type: "action", name: "Hide", desc: "DEX(Stealth)-Check → Invisible bis Angriff/Sicht." },
  { type: "action", name: "Influence", desc: "CHA-Check (oder WIS Animal-Handling) ändert NPC-Attitude." },
  { type: "action", name: "Ready", desc: "Aktion + Trigger; löst als Reaktion aus." },
  { type: "action", name: "Search", desc: "WIS-Check (Insight/Medicine/Perception/Survival)." },
  { type: "action", name: "Study", desc: "INT-Check (Arcana/History/Investigation/Nature/Religion)." },
  { type: "action", name: "Utilize", desc: "Nicht-magisches Objekt verwenden (Trank, Schalter, …)." },

  { type: "bonus", name: "Off-Hand Attack", desc: "Nach Attack mit Light Weapon: 2. Angriff (kein Mod)." },
  { type: "bonus", name: "Bonus-Action Spell", desc: "1-BA-Spell; Action-Spell danach nur Cantrip." },

  { type: "reaction", name: "Opportunity Attack", desc: "Feind verlässt 5ft ohne Disengage: 1 Nahkampfangriff." },
  { type: "reaction", name: "Readied Action", desc: "Trigger der Ready-Action löst Aktion aus." },
];

const TYPE_META = {
  action:   { ab: "ACT", icon: "⚔",  color: "#dc2626" },
  bonus:    { ab: "BON", icon: "⚡", color: "#d97706" },
  reaction: { ab: "RXN", icon: "🛡", color: "#2563eb" },
};

export default function ActionsRefCard() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  // Header summary: counts per type so the closed header still tells you
  // how many of each kind are listed.
  const counts = CORE_ACTIONS.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
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
        <span>⚔ {t("dash.actions_ref_header","Action / Bonus / Reaction")}</span>
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
        <div style={{ padding: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 6 }}>
          {CORE_ACTIONS.map((a) => {
            const meta = TYPE_META[a.type];
            return (
              <div key={`${a.type}_${a.name}`}
                style={{
                  display: "flex", flexDirection: "column", gap: 3,
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
                <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4, paddingLeft: 38 }}>
                  {a.desc}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
