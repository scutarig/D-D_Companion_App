import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import CompanionCard from "./CompanionCard.jsx";
import CompanionForm from "./CompanionForm.jsx";

/**
 * CompanionList — Full CRUD list of companions
 * Props: companions, add, update, remove, updateHp
 */
export default function CompanionList({ companions, add, update, remove, updateHp }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // companion to edit

  const handleAdd = (data) => {
    add(data);
    setShowForm(false);
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
      {/* Add button */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => { setShowForm(true); setEditTarget(null); }}
          style={{ ...sx.btn(C.green), flex: 1, padding: "11px", fontSize: 13, fontWeight: 700 }}
        >
          🐾 Begleiter hinzufügen
        </button>
      </div>

      {/* Empty state */}
      {companions.length === 0 && !showForm && (
        <div style={{
          textAlign: "center", padding: "32px 16px",
          border: `2px dashed ${C.border}`, borderRadius: 14,
          color: C.textDim,
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Begleiter</div>
          <div style={{ fontSize: 12 }}>Füge einen Begleiter hinzu oder importiere aus dem Bestiary</div>
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
