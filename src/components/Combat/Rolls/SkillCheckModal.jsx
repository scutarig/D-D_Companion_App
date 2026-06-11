import { useState, useMemo } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { useCombat } from "../../../context/CombatContext.jsx";
import { rollAbilityCheck } from "../../../utils/rolls.js";
import { addLog } from "../../../utils/log.js";
import {
  SKILLS, SKILLS_BY_ABILITY, ABILITIES, abilityColor,
  skillModifier, abilityMod, fmtMod, getProfBonus,
} from "../../../data/skills.js";
import { useI18n } from "../../../i18n/index.js";
import RollResult from "./RollResult.jsx";
import TargetSelector from "./TargetSelector.jsx";

/**
 * SkillCheckModal — D&D 5e skill checks for any fighter
 * Props:
 *   onClose: () => void
 */
export default function SkillCheckModal({ onClose }) {
  const { t } = useI18n();
  const { state, setState } = useCombat();

  const [targetId, setTargetId] = useState(
    state.fighters[state.activeIndex]?.id ?? ""
  );
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [dc, setDc] = useState("15");
  const [manualMod, setManualMod] = useState(null); // null = auto from fighter
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [activeAbility, setActiveAbility] = useState(null); // filter by ability

  const fighter = state.fighters.find((f) => f.id === targetId) ?? null;

  // Auto modifier for selected skill + fighter
  const autoMod = useMemo(() => {
    if (!fighter || !selectedSkill) return 0;
    return skillModifier(fighter, selectedSkill.id);
  }, [fighter, selectedSkill]);

  const modifier = manualMod !== null ? parseInt(manualMod) || 0 : autoMod;
  const dcNum = parseInt(dc) || 10;

  // Proficiency status badge
  const profStatus = (skillId) => {
    if (!fighter) return null;
    const p = fighter.skillProficiencies?.[skillId];
    if (p === "expertise") return "exp";
    if (p) return "prof";
    return null;
  };

  // Filtered skills for display
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SKILLS.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.ability.toLowerCase().includes(q);
      const matchAbility = !activeAbility || s.ability === activeAbility;
      return matchSearch && matchAbility;
    });
  }, [search, activeAbility]);

  const handleRoll = () => {
    if (!selectedSkill) return;
    const res = rollAbilityCheck(modifier, dcNum, { advantage, disadvantage });
    setResult(res);

    const skillName = selectedSkill.name;
    const casterName = fighter?.name ?? "Unknown";
    setState((prev) =>
      addLog(
        prev,
        "action",
        `${casterName}: ${skillName} Check (DC ${dcNum}) — ${res.roll}${modifier !== 0 ? ` ${fmtMod(modifier)}` : ""} = ${res.total} → ${res.success ? "✓ SUCCESS" : "✗ FAIL"}`,
        fighter?.id ?? null
      )
    );
  };

  const toggleAdv = () => { setAdvantage((v) => !v); if (!advantage) setDisadvantage(false); setResult(null); };
  const toggleDis = () => { setDisadvantage((v) => !v); if (!disadvantage) setAdvantage(false); setResult(null); };

  const highlight = result ? (result.success ? "hit" : "miss") : null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.teal, fontWeight: 700 }}>🎯 Skill Check</div>
          <button type="button" onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Creature selector */}
        <div style={{ marginBottom: 12 }}>
          <TargetSelector
            fighters={state.fighters}
            value={targetId}
            onChange={(id) => { setTargetId(id); setManualMod(null); setResult(null); }}
            label="Creature"
          />
        </div>

        {/* Fighter ability score summary (if selected) */}
        {fighter && fighter.abilityScores && (
          <div style={{
            display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10,
            background: `${C.surface}`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px",
          }}>
            {ABILITIES.map((ab) => {
              const score = fighter.abilityScores[ab.key] ?? 10;
              const mod = abilityMod(score);
              return (
                <button type="button"
                  key={ab.key}
                  onClick={() => setActiveAbility(activeAbility === ab.key ? null : ab.key)}
                  title={`${ab.label}: ${score} (${fmtMod(mod)})`}
                  style={{
                    flex: "1 1 50px", minWidth: 50, padding: "7px 4px",
                    borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                    minHeight: 40,
                    border: `1px solid ${activeAbility === ab.key ? ab.color : ab.color + "40"}`,
                    background: activeAbility === ab.key ? `${ab.color}28` : `${ab.color}0e`,
                    color: activeAbility === ab.key ? ab.color : ab.color + "cc",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                    transition: "all .12s",
                  }}
                >
                  <span style={{ fontSize: 9 }}>{ab.key}</span>
                  <span style={{ fontSize: 11 }}>{fmtMod(mod)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search + Skill grid */}
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveAbility(null); }}
            placeholder={t("combat.skill_search","🔍 Skill suchen...")}
            style={{ ...sx.inp, fontSize: 12, marginBottom: 6 }}
          />

          <div style={{ maxHeight: 200, overflowY: "auto", borderRadius: 8, border: `1px solid ${C.border}` }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px", fontSize: 12, color: C.textDim, textAlign: "center" }}>
                {t("combat.no_skill_found","Kein Skill gefunden")}
              </div>
            ) : (
              // Group by ability if no search query
              !search && !activeAbility
                ? SKILLS_BY_ABILITY.map((group) => {
                    const groupFiltered = group.skills.filter((s) => filtered.includes(s));
                    if (groupFiltered.length === 0) return null;
                    return (
                      <div key={group.key}>
                        <div style={{
                          padding: "5px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                          color: group.color, background: `${group.color}12`,
                          borderBottom: `1px solid ${group.color}25`,
                        }}>
                          {group.icon} {group.label.toUpperCase()} ({group.key})
                        </div>
                        {groupFiltered.map((skill) => (
                          <SkillRow
                            key={skill.id}
                            skill={skill}
                            fighter={fighter}
                            selected={selectedSkill?.id === skill.id}
                            profStatus={profStatus(skill.id)}
                            onSelect={() => { setSelectedSkill(skill); setManualMod(null); setResult(null); }}
                          />
                        ))}
                      </div>
                    );
                  })
                : filtered.map((skill) => (
                    <SkillRow
                      key={skill.id}
                      skill={skill}
                      fighter={fighter}
                      selected={selectedSkill?.id === skill.id}
                      profStatus={profStatus(skill.id)}
                      onSelect={() => { setSelectedSkill(skill); setManualMod(null); setResult(null); }}
                    />
                  ))
            )}
          </div>
        </div>

        {/* Selected skill + modifier row */}
        {selectedSkill && (
          <div style={{
            background: `${abilityColor(selectedSkill.ability)}12`,
            border: `1px solid ${abilityColor(selectedSkill.ability)}35`,
            borderRadius: 8, padding: "8px 12px", marginBottom: 10,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>{selectedSkill.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.textBright, fontWeight: 700 }}>{selectedSkill.name}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>{selectedSkill.ability} based</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <label style={{ fontSize: 9, color: C.textDim, letterSpacing: 0.5 }}>MODIFIER</label>
              <input
                type="number"
                value={manualMod !== null ? manualMod : modifier}
                onChange={(e) => { setManualMod(e.target.value); setResult(null); }}
                style={{
                  ...sx.inp, width: 60, padding: "5px", fontSize: 15, fontWeight: 700, textAlign: "center",
                  color: modifier >= 0 ? C.greenBright : C.redBright,
                  borderColor: `${abilityColor(selectedSkill.ability)}50`,
                }}
              />
            </div>
          </div>
        )}

        {/* DC */}
        <div style={{ marginBottom: 10 }}>
          <label style={sx.lbl}>Difficulty Class (DC)</label>
          <input
            type="number"
            value={dc}
            onChange={(e) => { setDc(e.target.value); setResult(null); }}
            style={{ ...sx.inp, fontSize: 16, fontWeight: 700, textAlign: "center" }}
          />
        </div>

        {/* Adv / Dis */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button type="button"
            onClick={toggleAdv}
            style={{
              flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: advantage ? 700 : 400, transition: "all .15s",
              border: `1px solid ${advantage ? C.green : C.border}`,
              background: advantage ? `${C.green}22` : C.surface,
              color: advantage ? C.greenBright : C.textDim,
            }}
          >
            ▲ Advantage
          </button>
          <button type="button"
            onClick={toggleDis}
            style={{
              flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: disadvantage ? 700 : 400, transition: "all .15s",
              border: `1px solid ${disadvantage ? C.red : C.border}`,
              background: disadvantage ? `${C.red}22` : C.surface,
              color: disadvantage ? C.redBright : C.textDim,
            }}
          >
            ▼ Disadvantage
          </button>
        </div>

        {/* Roll / Result */}
        {!result ? (
          <button type="button"
            onClick={handleRoll}
            disabled={!selectedSkill}
            style={{
              ...sx.btn(selectedSkill ? abilityColor(selectedSkill.ability) : C.border),
              width: "100%", padding: "12px", fontSize: 13, fontWeight: 700,
              opacity: selectedSkill ? 1 : 0.45,
              cursor: selectedSkill ? "pointer" : "not-allowed",
            }}
          >
            🎲 {selectedSkill ? `${selectedSkill.name} ${t("combat.skill_roll_action","würfeln")} (DC ${dcNum})` : t("combat.skill_select","Skill auswählen")}
          </button>
        ) : (
          <div>
            {result.roll1 !== undefined && (
              <div style={{ marginBottom: 6, fontSize: 12, color: C.textDim, textAlign: "center" }}>
                {t("combat.rolled_label","Gewürfelt:")} {result.roll1} {t("combat.and_word","und")} {result.roll2} →{" "}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {result.advantage ? t("combat.took_higher_short","höher gewählt") : t("combat.took_lower_short","niedriger gewählt")}: {result.roll}
                </span>
              </div>
            )}
            <RollResult
              rolls={[result.roll]}
              modifier={modifier}
              total={result.total}
              label={`${selectedSkill.name} vs DC ${dcNum}`}
              highlight={highlight}
              extra={result.success ? t("combat.skill_succeeded","✓ Geschafft!") : t("combat.skill_failed","✗ Misslungen!")}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => setResult(null)} style={{ ...sx.bsm(C.purple), flex: 1, padding: "9px", fontSize: 12 }}>
                {t("combat.reroll_nochmal","🎲 Nochmal")}
              </button>
              <button type="button" onClick={onClose} style={{ ...sx.btn(C.teal), flex: 1, padding: "9px", fontSize: 12 }}>
                {t("combat.close_word","Schließen")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skill row in the list ────────────────────────────────────────────────────
function SkillRow({ skill, fighter, selected, profStatus, onSelect }) {
  const mod = fighter ? skillModifier(fighter, skill.id) : null;
  const color = abilityColor(skill.ability);

  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 10px", cursor: "pointer",
        background: selected ? `${color}18` : "transparent",
        borderBottom: `1px solid ${C.border}30`,
        transition: "background .1s",
      }}
      onMouseEnter={(e) => !selected && (e.currentTarget.style.background = `${color}0e`)}
      onMouseLeave={(e) => !selected && (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>{skill.icon}</span>
      <span style={{
        flex: 1, fontSize: 12, color: selected ? C.textBright : C.text,
        fontWeight: selected ? 700 : 400,
      }}>
        {skill.name}
      </span>
      {profStatus && (
        <span style={{
          fontSize: 9, padding: "1px 5px", borderRadius: 10,
          background: profStatus === "expertise" ? `${C.gold}22` : `${color}22`,
          color: profStatus === "expertise" ? C.gold : color,
          fontWeight: 700, flexShrink: 0,
        }}>
          {profStatus === "expertise" ? "EXP" : "PROF"}
        </span>
      )}
      {mod !== null && (
        <span style={{
          fontSize: 12, fontWeight: 700, flexShrink: 0, minWidth: 28, textAlign: "right",
          color: selected ? color : mod >= 0 ? C.greenBright : C.redBright,
        }}>
          {fmtMod(mod)}
        </span>
      )}
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16,
};
const modalStyle = {
  background: "#1e1b22", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "92vh", overflowY: "auto",
};
