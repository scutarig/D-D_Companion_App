import React from "react";
import { C, FH } from "../../constants/theme.js";
import { getSubclassNames, getSubclassChoiceLevel } from "../../data/subclasses.js";
import { useI18n } from "../../i18n/index.js";

/**
 * Shows a subclass dropdown for a class once the character reaches the
 * subclass-choice level.
 *
 * Props:
 *   className  — e.g. "Barbar"
 *   level      — current class level
 *   value      — currently selected subclass name (or "")
 *   onChange   — (subclassName: string) => void
 */
export default function SubclassSelector({ className, level, value, onChange }) {
  const { t } = useI18n();
  const choiceLevel = getSubclassChoiceLevel(className);
  // choiceLevel kann null sein wenn Klasse keine Subklassen hat
  if (choiceLevel == null || level < choiceLevel) return null;

  const options = getSubclassNames(className);
  if (!options.length) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <span style={{ fontSize: 11, color: C.purpleBright, fontFamily: FH, whiteSpace: "nowrap" }}>
        {t("char.subclass_label","Subklasse")}
      </span>
      <select
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1,
          background: C.card,
          color: value ? C.textBright : C.textDim,
          border: `1px solid ${value ? C.purpleBright : C.border}`,
          borderRadius: 4,
          padding: "2px 6px",
          fontSize: 12,
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="">{t("char.subclass_choose_short","— wählen —")}</option>
        {options.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
}
