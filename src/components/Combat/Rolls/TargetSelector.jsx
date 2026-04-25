import { C, sx } from "../../../constants/theme.js";

/**
 * TargetSelector — dropdown to pick a target from fighters
 * Props:
 *   fighters: Fighter[]
 *   value: string (fighter id)
 *   onChange: (id: string) => void
 *   excludeId: string — fighter id to exclude (usually the attacker)
 *   label: string
 */
export default function TargetSelector({ fighters = [], value, onChange, excludeId, label = "Target" }) {
  const options = fighters.filter((f) => f.id !== excludeId);

  return (
    <div>
      <label style={sx.lbl}>{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        style={sx.sel}
      >
        <option value="">— Select target —</option>
        {options.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} (HP {f.hp}/{f.maxHp}, AC {f.ac}){f.hp <= 0 ? " ☠️" : ""}
          </option>
        ))}
      </select>

      {/* Show selected target's AC as a quick hint */}
      {value && (() => {
        const target = fighters.find((f) => f.id === value);
        if (!target) return null;
        return (
          <div style={{ marginTop: 4, fontSize: 11, color: C.textDim }}>
            AC <span style={{ color: C.amberBright, fontWeight: 700 }}>{target.ac}</span>
            {" · "}
            HP <span style={{ color: target.hp > 0 ? C.greenBright : C.redBright, fontWeight: 700 }}>
              {target.hp}/{target.maxHp}
            </span>
            {target.hp <= 0 && <span style={{ color: C.redBright }}> (Unconscious)</span>}
          </div>
        );
      })()}
    </div>
  );
}
