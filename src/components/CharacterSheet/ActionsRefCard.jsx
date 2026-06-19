import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * ActionsRefCard — condensed 3-column reference of "what can I do this turn"
 * on the Dashboard. Source-of-truth STD_ACTIONS lives in CharActions.jsx;
 * this view repeats only the core list (no class-specifics) so it stays
 * scannable at the table. Click a row to toggle its long description.
 */

// Core PHB 2024 actions — kept in sync with the Standard Actions in
// CharActions.jsx. Class-specific bonus actions are intentionally omitted
// to keep this card compact; the Kampf tab still has the full picker.
const CORE_ACTIONS = [
  { type: "action", name: "Attack", desc: "Melee/Ranged. Extra Attacks from Lv5+." },
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
  action:   { label: "Action",   icon: "⚔️", color: "#dc2626" },
  bonus:    { label: "Bonus",    icon: "⚡", color: "#d97706" },
  reaction: { label: "Reaction", icon: "🛡️", color: "#2563eb" },
};

export default function ActionsRefCard() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});

  const toggleRow = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

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
          padding: "10px 12px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
          textAlign: "left",
        }}>
        <span>⚔ {t("dash.actions_ref_header","Action / Bonus / Reaction")}</span>
        <span style={{ flex: 1, fontSize: 11, color: C.textDim, fontWeight: 400 }}>
          {t("dash.actions_ref_meta","PHB 2024 Kern-Aktionen — Klick auf Zeile = Details")}
        </span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <section key={type}>
              <div style={{
                fontFamily: FH, fontSize: 12, fontWeight: 700,
                color: meta.color, letterSpacing: 0.5, marginBottom: 6,
                borderBottom: `1px solid ${meta.color}55`, paddingBottom: 4,
              }}>
                {meta.icon} {meta.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {CORE_ACTIONS.filter((a) => a.type === type).map((a) => {
                  const key = `${type}_${a.name}`;
                  const isOpen = !!expanded[key];
                  return (
                    <button key={key} type="button" onClick={() => toggleRow(key)}
                      style={{
                        background: isOpen ? `${meta.color}11` : "transparent",
                        border: `1px solid ${isOpen ? meta.color + "55" : C.border}`,
                        borderRadius: 6,
                        padding: "5px 8px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, color: C.textBright, fontSize: 12 }}>{a.name}</span>
                        <span style={{ marginLeft: "auto", fontSize: 10, color: C.textDim }}>{isOpen ? "▾" : "▸"}</span>
                      </div>
                      {isOpen && (
                        <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>
                          {a.desc}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
