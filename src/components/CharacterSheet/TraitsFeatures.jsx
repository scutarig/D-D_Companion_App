import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import TraitFeatureCard from "./TraitFeatureCard.jsx";
import { useRaceTraits } from "../../hooks/useRaceTraits.js";

/**
 * TraitsFeatures — Traits & Features Section on Character Sheet
 * Grouped by source. Shows race traits (auto-applied) and allows manual custom entries.
 * Props: char, setChar
 */
export default function TraitsFeatures({ char, setChar }) {
  const raceTraits = char.raceTraits || [];
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", description: "", category: "trait" });

  // Group by source
  const sources = {};
  raceTraits.forEach(t => {
    if (!sources[t.source]) sources[t.source] = [];
    sources[t.source].push(t);
  });
  const groups = Object.entries(sources);

  const addCustomTrait = () => {
    if (!customForm.name.trim()) return;
    const newTrait = {
      id: `custom_${Date.now()}`,
      name: customForm.name.trim(),
      description: customForm.description.trim(),
      source: "Eigenes",
      category: customForm.category,
    };
    setChar(p => ({ ...p, raceTraits: [...(p.raceTraits || []), newTrait] }));
    setCustomForm({ name: "", description: "", category: "trait" });
    setShowCustomForm(false);
  };

  const removeTrait = (id) => {
    setChar(p => ({ ...p, raceTraits: (p.raceTraits || []).filter(t => t.id !== id) }));
  };

  const isEmpty = raceTraits.length === 0;

  return (
    <div>
      {/* Header info */}
      <div style={{
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 10, padding: "10px 14px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <span style={{ fontFamily: FH, fontSize: 12, color: "#818cf8", fontWeight: 700 }}>
            ✦ Volksmerkmale
          </span>
          <span style={{ fontSize: 11, color: C.textDim, marginLeft: 10 }}>
            Wechsel die Rasse im Bogen-Tab um Traits automatisch anzupassen
          </span>
        </div>
        <button
          onClick={() => setShowCustomForm(p => !p)}
          style={{ ...sx.bsm(C.purple), fontSize: 11, padding: "4px 10px" }}
        >
          ＋ Eigener Trait
        </button>
      </div>

      {/* Custom form */}
      {showCustomForm && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "14px", marginBottom: 14,
        }}>
          <div style={{ fontFamily: FH, fontSize: 12, color: C.purple, marginBottom: 10, fontWeight: 700 }}>
            Eigenen Trait hinzufügen
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>Name *</label>
            <input
              type="text"
              value={customForm.name}
              onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))}
              placeholder="z.B. Sprung des Glaubens"
              style={{ ...sx.inp, fontSize: 13 }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>Beschreibung</label>
            <textarea
              value={customForm.description}
              onChange={e => setCustomForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Was kann dein Charakter damit tun?"
              style={{ ...sx.ta, fontSize: 12, minHeight: 60 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={sx.lbl}>Kategorie</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[["trait", "Trait", "✦", "#10b981"], ["feature", "Feature", "⚡", "#6366f1"]].map(([id, label, icon, col]) => (
                <button
                  key={id}
                  onClick={() => setCustomForm(p => ({ ...p, category: id }))}
                  style={{
                    flex: 1, padding: "7px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                    border: `1px solid ${customForm.category === id ? col : C.border}`,
                    background: customForm.category === id ? `${col}22` : "transparent",
                    color: customForm.category === id ? col : C.textDim,
                    fontWeight: customForm.category === id ? 700 : 400,
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={addCustomTrait}
              disabled={!customForm.name.trim()}
              style={{ ...sx.btn(C.purple), flex: 1, padding: "10px", fontSize: 12, fontWeight: 700, opacity: customForm.name.trim() ? 1 : 0.4 }}
            >
              ＋ Hinzufügen
            </button>
            <button onClick={() => setShowCustomForm(false)} style={{ ...sx.bsm(C.border), padding: "8px 14px", fontSize: 12, color: C.textDim }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && !showCustomForm && (
        <div style={{
          textAlign: "center", padding: "32px 16px",
          border: `2px dashed ${C.border}`, borderRadius: 14, color: C.textDim,
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Traits</div>
          <div style={{ fontSize: 12 }}>
            Wähle eine der 9 Standardrassen im Bogen-Tab — Traits werden automatisch eingetragen.
          </div>
        </div>
      )}

      {/* Grouped sections */}
      {groups.map(([source, items]) => (
        <div key={source} style={{ marginBottom: 14 }}>
          {/* Group header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 8,
          }}>
            <div style={{ height: 1, flex: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH, fontWeight: 700, padding: "0 8px" }}>
              {source}
            </span>
            <div style={{ height: 1, flex: 1, background: C.border }} />
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(trait => (
              <div key={trait.id} style={{ position: "relative" }}>
                <TraitFeatureCard trait={trait} />
                {/* Only show remove for manually added (Eigenes) traits */}
                {trait.source === "Eigenes" && (
                  <button
                    onClick={() => removeTrait(trait.id)}
                    title="Entfernen"
                    style={{
                      position: "absolute", top: 6, right: 6,
                      background: "transparent", border: "none",
                      color: C.textDim, cursor: "pointer", fontSize: 12,
                      padding: "2px 5px", lineHeight: 1,
                      opacity: 0.5,
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0.5}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
