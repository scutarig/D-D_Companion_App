import { useState } from "react";
import { C, sx, FH, SC, SKILLS } from "../../constants/theme.js";
import { modOf } from "../../utils/helpers.js";
import { useI18n } from "../../i18n/index.js";

/**
 * SkillsCard — gameplay-oriented skill list for the Übersicht/Dashboard tab.
 *
 * Shows all 18 D&D 5e skills grouped by their ability score, with proficiency
 * markers (○ none · ● proficient · ◉ expertise) and the computed bonus
 * (mod + PB × multiplier). Designed so the player doesn't need to switch to
 * the Charakter tab during play.
 *
 * Default collapsed to keep the dashboard scannable; one click expands.
 */
export default function SkillsCard({ char, pb }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);

  const wisMod = modOf(char.wis || 10);
  const percProf = !!char.skills?.skill_Perception;
  const percExp  = !!char.skills?.exp_Perception;
  const passivePerc = 10 + wisMod + (percExp ? pb * 2 : percProf ? pb : 0);

  // Quick counts (proficient + expertise across all skills) for the header.
  const profKeys = Object.keys(char.skills || {});
  const profCount = profKeys.filter((k) => k.startsWith("skill_") && char.skills[k]).length;
  const expCount  = profKeys.filter((k) => k.startsWith("exp_")   && char.skills[k]).length;

  return (
    <div style={{ ...sx.card, marginBottom: 10, padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: open ? `${C.amberBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.amberBright}30` : "none",
          color: C.amberBright,
          fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          padding: "10px 12px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          textAlign: "left",
        }}
      >
        <span>🎯 {t("dash.skills_header","Fertigkeiten")}</span>
        <span style={{ flex: 1, fontSize: 11, color: C.textDim, fontWeight: 400 }}>
          {t("dash.skills_meta","● {p} Übung · ◉ {e} Expertise · 👁 Passive Wahrn. {pp}")
            .replace("{p}", String(profCount))
            .replace("{e}", String(expCount))
            .replace("{pp}", String(passivePerc))}
        </span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 4 }}>
          {Object.entries(SKILLS).flatMap(([ab, skills]) =>
            skills.map((skill) => {
              const pk = `skill_${skill}`;
              const ek = `exp_${skill}`;
              const isProf = !!char.skills?.[pk];
              const isExp  = !!char.skills?.[ek];
              const abMod  = modOf(char[ab.toLowerCase()] || 10);
              const bonus  = abMod + (isExp ? pb * 2 : isProf ? pb : 0);
              const col    = SC[ab];
              const marker = isExp ? "◉" : isProf ? "●" : "○";
              const markerCol = isExp || isProf ? col : C.textDim;
              const active = isExp || isProf;
              return (
                <div key={skill} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "4px 8px",
                  background: active ? `${col}0a` : "transparent",
                  borderRadius: 6,
                }}>
                  <span style={{ color: markerCol, fontSize: 14, lineHeight: 1, width: 12 }}>{marker}</span>
                  <span style={{ color: col, fontFamily: FH, fontSize: 9, fontWeight: 700, width: 26 }}>{ab}</span>
                  <span style={{ flex: 1, fontSize: 12, color: active ? C.textBright : C.text }}>{skill}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: active ? C.gold : C.textDim,
                    minWidth: 32, textAlign: "right",
                    fontFamily: FH,
                  }}>
                    {bonus >= 0 ? `+${bonus}` : bonus}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
