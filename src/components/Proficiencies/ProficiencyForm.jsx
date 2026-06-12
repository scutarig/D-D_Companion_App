import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { PROF_CATEGORIES, PROF_TYPES } from "../../utils/proficiency.js";
import { useI18n } from "../../i18n/index.js";

const defaultForm = () => ({ name: "", category: "weapon", type: "normal", notes: "" });

/**
 * ProficiencyForm — Add / Edit modal
 * Props: initial, onSave, onCancel
 */
export default function ProficiencyForm({ initial, onSave, onCancel }) {
  const { t } = useI18n();
  const isEdit = !!initial;

  const [form, setForm] = useState(() =>
    initial
      ? { name: initial.name, category: initial.category, type: initial.type, notes: initial.notes ?? "" }
      : defaultForm()
  );

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave?.({ ...(isEdit ? { id: initial.id, createdAt: initial.createdAt } : {}), ...form, name: form.name.trim() });
  };

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onCancel?.()}>
      <div style={modalStyle}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.tealBright, fontWeight: 700 }}>
            {isEdit ? t("prof.edit_title","✎ Proficiency bearbeiten") : t("prof.new_title","＋ Neue Proficiency")}
          </div>
          <button type="button" onClick={onCancel} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }} aria-label={t("modal.close","Schließen")}>✕</button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>{t("wb.name_required","Name *")}</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder={t("prof.placeholder_name","z.B. Langschwert, Kettenpanzer, Diebeswerkzeug…")}
            style={{ ...sx.inp, fontSize: 14 }}
            autoFocus
            onKeyDown={e => e.key === "Enter" && handleSave()}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>{t("prof.category_label","Kategorie")}</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PROF_CATEGORIES.map(cat => (
              <button type="button"
                key={cat.id}
                onClick={() => set("category", cat.id)}
                style={{
                  padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 11,
                  border: `1px solid ${form.category === cat.id ? cat.color : C.border}`,
                  background: form.category === cat.id ? `${cat.color}22` : "transparent",
                  color: form.category === cat.id ? cat.color : C.textDim,
                  fontWeight: form.category === cat.id ? 700 : 400,
                  transition: "all .12s",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: 12 }}>
          <label style={sx.lbl}>{t("prof.type_label","Typ")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            {PROF_TYPES.map(pt => (
              <button type="button"
                key={pt.id}
                onClick={() => set("type", pt.id)}
                style={{
                  flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                  border: `1px solid ${form.type === pt.id ? C.tealBright : C.border}`,
                  background: form.type === pt.id ? `${C.tealBright}22` : "transparent",
                  color: form.type === pt.id ? C.tealBright : C.textDim,
                  fontWeight: form.type === pt.id ? 700 : 400,
                  transition: "all .12s",
                }}
              >
                <div style={{ fontSize: 10, marginBottom: 2, opacity: 0.7 }}>
                  {pt.id === "normal" ? "×1 PB" : "×2 PB"}
                </div>
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 16 }}>
          <label style={sx.lbl}>{t("prof.notes_label","Notizen (optional)")}</label>
          <textarea
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            placeholder={t("prof.notes_placeholder","z.B. einfache Waffen, schwere Rüstungen…")}
            style={{ ...sx.ta, fontSize: 12, minHeight: 56 }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button"
            onClick={handleSave}
            disabled={!form.name.trim()}
            style={{
              ...sx.btn(C.tealBright), flex: 1, padding: "11px", fontSize: 13, fontWeight: 700,
              opacity: form.name.trim() ? 1 : 0.4,
              cursor: form.name.trim() ? "pointer" : "not-allowed",
            }}
          >
            {isEdit ? t("prof.save_btn","✓ Speichern") : t("prof.add_short","＋ Hinzufügen")}
          </button>
          <button type="button" onClick={onCancel} style={{ ...sx.bsm(C.border), padding: "10px 16px", fontSize: 12, color: C.textDim }}>
            {t("prof.cancel_btn","Abbrechen")}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 16,
};
const modalStyle = {
  background: "#1e1b22", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 420,
  boxShadow: "0 20px 60px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto",
};
