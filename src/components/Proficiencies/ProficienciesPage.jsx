import { C, sx, FH } from "../../constants/theme.js";
import { useChar } from "../../context/CharContext.jsx";
import { useProficiencies } from "../../hooks/useProficiencies.js";
import { calculateProficiencyBonus, PROF_CATEGORIES } from "../../utils/proficiency.js";
import ProficiencyList from "./ProficiencyList.jsx";

export default function ProficienciesPage() {
  const { active: char, aid } = useChar();
  const { proficiencies, add, update, remove } = useProficiencies(aid);

  const level = char?.level ?? 1;
  const pb = calculateProficiencyBonus(level);

  // Summary counts
  const counts = Object.fromEntries(
    PROF_CATEGORIES.map(c => [c.id, proficiencies.filter(p => p.category === c.id).length])
  );
  const expertiseCount = proficiencies.filter(p => p.type === "expertise").length;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0d1a2a,#0a1520)",
        border: `1px solid ${C.tealBright}30`,
        borderRadius: 16, padding: "18px 20px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{ fontSize: 38 }}>🎓</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FH, fontSize: 20, color: C.tealBright, fontWeight: 700, letterSpacing: 1 }}>
            Übungsbonus
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
            {proficiencies.length === 0
              ? "Noch keine Proficiencies eingetragen"
              : `${proficiencies.length} Einträge · ${expertiseCount} Expertise`}
          </div>
        </div>

        {/* PB badge */}
        <div style={{
          textAlign: "center", background: `${C.tealBright}18`,
          border: `2px solid ${C.tealBright}44`, borderRadius: 12,
          padding: "10px 18px", flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: C.tealBright, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>
            PROF BONUS
          </div>
          <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: C.tealBright, lineHeight: 1 }}>
            +{pb}
          </div>
          <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>
            Level {level}
          </div>
        </div>
      </div>

      {/* Category summary row */}
      {proficiencies.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12,
        }}>
          {PROF_CATEGORIES.map(cat => (
            <div key={cat.id} style={{
              background: `${cat.color}10`, border: `1px solid ${cat.color}25`,
              borderRadius: 10, padding: "8px 6px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{cat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: counts[cat.id] > 0 ? cat.color : C.textDim }}>
                {counts[cat.id]}
              </div>
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 0.3 }}>{cat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <ProficiencyList
        proficiencies={proficiencies}
        add={add}
        update={update}
        remove={remove}
        pb={pb}
      />
    </div>
  );
}
