import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { PROF_CATEGORIES, categoryOf } from "../../utils/proficiency.js";
import { useI18n } from "../../i18n/index.js";
import ProficiencyForm from "./ProficiencyForm.jsx";

/**
 * ProficiencyList — Grouped CRUD list
 * Props: proficiencies, add, update, remove, pb (proficiency bonus)
 */
export default function ProficiencyList({ proficiencies, add, update, remove, pb }) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [expandedCats, setExpandedCats] = useState(() =>
    Object.fromEntries(PROF_CATEGORIES.map(c => [c.id, true]))
  );

  const handleAdd = (data) => { add(data); setShowForm(false); };
  const handleUpdate = (data) => { update(data.id, data); setEditTarget(null); };
  const handleEdit = (prof) => { setEditTarget(prof); setShowForm(false); };
  const toggleCat = (id) => setExpandedCats(p => ({ ...p, [id]: !p[id] }));

  // Group by category
  const groups = PROF_CATEGORIES.map(cat => ({
    ...cat,
    items: proficiencies.filter(p => p.category === cat.id),
  })).filter(g => g.items.length > 0);

  const empty = proficiencies.length === 0;

  return (
    <div>
      {/* Add button */}
      <div style={{ marginBottom: 12 }}>
        <button type="button"
          onClick={() => { setShowForm(true); setEditTarget(null); }}
          style={{ ...sx.btn(C.tealBright), width: "100%", padding: "11px", fontSize: 13, fontWeight: 700 }}
        >
          {t("prof.add_btn","＋ Proficiency hinzufügen")}
        </button>
      </div>

      {/* Empty state */}
      {empty && !showForm && (
        <div style={{
          textAlign: "center", padding: "32px 16px",
          border: `2px dashed ${C.border}`, borderRadius: 14, color: C.textDim,
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>{t("prof.no_yet","Noch keine Proficiencies")}</div>
          <div style={{ fontSize: 12 }}>{t("prof.add_hint","Füge Waffen-, Rüstungs-, Werkzeug- oder Sprachkenntnisse hinzu")}</div>
        </div>
      )}

      {/* Grouped list */}
      {groups.map(group => (
        <div key={group.id} style={{ marginBottom: 10 }}>
          {/* Group header */}
          <button type="button"
            onClick={() => toggleCat(group.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "8px 12px", borderRadius: 10,
              background: `${group.color}10`, border: `1px solid ${group.color}30`,
              cursor: "pointer", marginBottom: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{group.icon}</span>
              <span style={{ fontFamily: FH, fontSize: 12, color: group.color, fontWeight: 700 }}>
                {group.label}
              </span>
              <span style={{ fontSize: 11, color: C.textDim, background: C.surface, borderRadius: 10, padding: "1px 7px" }}>
                {group.items.length}
              </span>
            </div>
            <span style={{ fontSize: 11, color: C.textDim }}>{expandedCats[group.id] ? "▲" : "▼"}</span>
          </button>

          {/* Items */}
          {expandedCats[group.id] && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {group.items.map(prof => (
                <ProficiencyItem
                  key={prof.id}
                  prof={prof}
                  cat={group}
                  pb={pb}
                  onEdit={() => handleEdit(prof)}
                  onDelete={() => remove(prof.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add form modal */}
      {showForm && (
        <ProficiencyForm
          initial={null}
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit form modal */}
      {editTarget && (
        <ProficiencyForm
          initial={editTarget}
          onSave={handleUpdate}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

function ProficiencyItem({ prof, cat, pb, onEdit, onDelete }) {
  const isExp = prof.type === "expertise";
  const bonus = isExp ? pb * 2 : pb;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: `${cat.color}06`, border: `1px solid ${cat.color}20`,
      borderLeft: `3px solid ${cat.color}`, borderRadius: 8, padding: "8px 10px",
    }}>
      {/* Bonus badge */}
      <div style={{
        minWidth: 38, textAlign: "center", background: `${cat.color}18`,
        border: `1px solid ${cat.color}40`, borderRadius: 6, padding: "3px 4px",
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 9, color: cat.color, fontWeight: 700, letterSpacing: 0.4 }}>
          {isExp ? "EXP" : "PROF"}
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: cat.color, lineHeight: 1.1 }}>
          +{bonus}
        </div>
      </div>

      {/* Name + notes */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {prof.name}
        </div>
        {prof.notes && (
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {prof.notes}
          </div>
        )}
      </div>

      {/* Type chip */}
      {isExp && (
        <span style={{
          fontSize: 9, fontWeight: 700, color: C.amberBright,
          background: `${C.amber}22`, border: `1px solid ${C.amber}44`,
          borderRadius: 8, padding: "2px 6px", flexShrink: 0, letterSpacing: 0.3,
        }}>
          ×2
        </span>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button type="button"
          onClick={onEdit}
          style={{ ...sx.bsm(C.border), padding: "3px 8px", fontSize: 12, color: C.textDim }}
        >✎</button>
        <button type="button"
          onClick={onDelete}
          style={{ ...sx.bsm(C.red), padding: "3px 8px", fontSize: 12 }}
        >✕</button>
      </div>
    </div>
  );
}
