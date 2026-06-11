import { memo } from "react";
import { getCondition, getConditionId } from "../../../utils/conditions.js";
import { C } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

/**
 * ConditionBadge — compact pill showing condition icon + name.
 * Props:
 *   conditionId: string | { id, duration, sourceId }
 *   onRemove: () => void   (optional — shows ✕ button)
 *   size: "sm" | "md"
 */
function ConditionBadge({ conditionId, onRemove, size = "md" }) {
  const { lang } = useI18n();
  const id = getConditionId(conditionId);
  const cond = getCondition(id);
  if (!cond) return null;
  const name = (lang === "en" && cond.nameEN) ? cond.nameEN : cond.name;
  const desc = (lang === "en" && cond.descEN) ? cond.descEN : cond.desc;

  const duration = typeof conditionId === "object" ? conditionId.duration : null;

  const isSm = size === "sm";

  return (
    <div
      title={desc}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? 3 : 4,
        padding: isSm ? "2px 6px" : "3px 8px",
        borderRadius: 20,
        border: `1px solid ${cond.color}55`,
        background: `${cond.color}18`,
        fontSize: isSm ? 10 : 11,
        color: cond.color,
        fontWeight: 600,
        whiteSpace: "nowrap",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: isSm ? 11 : 13 }}>{cond.icon}</span>
      <span>{name}</span>
      {duration !== null && (
        <span style={{ fontSize: 9, color: C.textDim, marginLeft: 1 }}>
          {duration}r
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            marginLeft: 2,
            background: "none",
            border: "none",
            color: cond.color,
            cursor: "pointer",
            fontSize: 11,
            padding: 0,
            lineHeight: 1,
            opacity: 0.7,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default memo(ConditionBadge);
