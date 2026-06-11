import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import CompanionCard from "./CompanionCard.jsx";
import CompanionForm from "./CompanionForm.jsx";
import { COMPANION_TEMPLATES } from "../../data/companionTemplates.js";
import { useI18n } from "../../i18n/index.js";

/**
 * CompanionList — Full CRUD list of companions
 * Props: companions, add, update, remove, updateHp
 */
export default function CompanionList({ companions, add, update, remove, updateHp }) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // companion to edit

  const handleAdd = (data) => {
    add(data);
    setShowForm(false);
  };

  const handleAddTemplate = (tpl) => {
    add({ ...tpl.data });
    setShowTemplates(false);
  };

  const handleUpdate = (data) => {
    update(data.id, data);
    setEditTarget(null);
  };

  const handleEdit = (companion) => {
    setEditTarget(companion);
    setShowForm(false);
  };

  return (
    <div>
      {/* Add buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => { setShowForm(true); setEditTarget(null); setShowTemplates(false); }}
          style={{ ...sx.btn(C.green), flex: "1 1 200px", padding: "11px", fontSize: 13, fontWeight: 700 }}
        >
          {t("comp.add_custom_btn","🐾 Eigener Begleiter")}
        </button>
        <button
          onClick={() => { setShowTemplates(!showTemplates); setShowForm(false); setEditTarget(null); }}
          style={{ ...sx.btn(showTemplates ? C.amber : C.purple), flex: "1 1 200px", padding: "11px", fontSize: 13, fontWeight: 700 }}
        >
          {t("comp.templates_btn","📖 PHB 2024 Templates")}
        </button>
      </div>

      {/* Templates Picker */}
      {showTemplates && (
        <div style={{ ...sx.card, marginBottom: 12 }}>
          <div style={sx.ct}>{t("comp.templates_header","📖 PHB 2024 Standard-Begleiter")}</div>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 12, lineHeight: 1.5 }}>
            {t("comp.templates_intro","Auswahl an Standard-Begleitern aus dem PHB 2024 (Find Familiar, Find Steed, Wild Companion, Primal Beast). Klicke einen Eintrag um ihn deinem Charakter hinzuzufügen — danach beliebig anpassbar.")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {COMPANION_TEMPLATES.map(tpl => (
              <div key={tpl.id} style={{
                background: `${C.purple}08`, border: `1px solid ${C.purple}30`,
                borderLeft: `3px solid ${C.purpleBright}`,
                borderRadius: 8, padding: "10px 12px",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, fontWeight: 700, marginBottom: 2 }}>
                    {tpl.label}
                  </div>
                  <div style={{ fontSize: 10, color: C.purpleBright, marginBottom: 4 }}>
                    {tpl.source}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{tpl.desc}</div>
                </div>
                <button
                  onClick={() => handleAddTemplate(tpl)}
                  style={{ ...sx.btn(C.green), fontSize: 11, padding: "6px 12px", flexShrink: 0 }}
                >
                  {t("comp.add_short","+ Hinzufügen")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {companions.length === 0 && !showForm && (
        <div style={{
          textAlign: "center", padding: "32px 16px",
          border: `2px dashed ${C.border}`, borderRadius: 14,
          color: C.textDim,
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>{t("comp.no_yet","Noch keine Begleiter")}</div>
          <div style={{ fontSize: 12 }}>{t("comp.add_hint","Füge einen Begleiter hinzu oder importiere aus dem Bestiary")}</div>
        </div>
      )}

      {/* Companion cards */}
      {companions.map((c) => (
        <CompanionCard
          key={c.id}
          companion={c}
          onEdit={handleEdit}
          onDelete={remove}
          onHpChange={updateHp}
        />
      ))}

      {/* Add form modal */}
      {showForm && (
        <CompanionForm
          initial={null}
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit form modal */}
      {editTarget && (
        <CompanionForm
          initial={editTarget}
          onSave={handleUpdate}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
