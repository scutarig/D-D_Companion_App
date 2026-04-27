import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import TraitFeatureCard from "./TraitFeatureCard.jsx";

// ── Colour map for each trait group ──────────────────────────────────────────
const GROUP_STYLE = {
  race:      { icon: "🌿", label: "Volksmerkmale",   color: C.greenBright },
  bg:        { icon: "📜", label: "Hintergrund",      color: C.amberBright },
  class:     { icon: "⚔️", label: "Klassenmerkmale",  color: C.gold },
  subclass:  { icon: "✨", label: "Subklasse",         color: C.purpleBright },
  feat:      { icon: "⭐", label: "Talente (Feats)",   color: C.blueBright },
  custom:    { icon: "✦", label: "Eigene",             color: C.tealBright },
};

function groupKey(source) {
  if (!source) return "custom";
  if (source.startsWith("class:")) return "class";
  if (source.startsWith("subclass:")) return "subclass";
  if (source.startsWith("Hintergrund:")) return "bg";
  if (source.startsWith("feat:")) return "feat";
  // race traits have source = race name (e.g. "Elf")
  return "race";
}

function buildGroups(char) {
  const all = [
    ...(char.raceTraits      || []),
    ...(char.bgTraits        || []),
    ...(char.classFeatures   || []),
    ...(char.subclassFeatures|| []),
    ...(char.feats           || []),
  ];

  const map = {};
  all.forEach(t => {
    const gk = groupKey(t.source);
    if (!map[gk]) map[gk] = [];
    map[gk].push(t);
  });
  return map;
}

// group display order
const GROUP_ORDER = ["race", "bg", "class", "subclass", "feat", "custom"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function TraitsFeatures({ char, setChar }) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", description: "", category: "trait" });

  const groups = buildGroups(char);
  const hasAny = Object.keys(groups).length > 0 || (char.languages || []).length > 0;

  // Custom trait add
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
    setChar(p => ({
      ...p,
      raceTraits: (p.raceTraits || []).filter(t => t.id !== id),
    }));
  };

  return (
    <div>
      {/* ── Header bar ── */}
      <div style={{
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 10, padding: "10px 14px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <span style={{ fontFamily: FH, fontSize: 12, color: "#818cf8", fontWeight: 700 }}>
            ✦ Traits & Features
          </span>
          <span style={{ fontSize: 11, color: C.textDim, marginLeft: 10 }}>
            Rasse, Hintergrund, Klasse &amp; Subklasse werden auto-befüllt
          </span>
        </div>
        <button
          onClick={() => setShowCustomForm(p => !p)}
          style={{ ...sx.bsm(C.purple), fontSize: 11, padding: "4px 10px" }}
        >
          ＋ Eigener Trait
        </button>
      </div>

      {/* ── Languages ── */}
      {(char.languages || []).length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <GroupHeader icon="💬" label="Sprachen" color={C.tealBright} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {(char.languages).map(lang => (
              <span key={lang} style={{
                padding: "3px 10px", borderRadius: 20,
                background: `${C.tealBright}18`, border: `1px solid ${C.tealBright}40`,
                fontSize: 12, color: C.tealBright, fontWeight: 600,
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Custom form ── */}
      {showCustomForm && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: FH, fontSize: 12, color: C.purple, marginBottom: 10, fontWeight: 700 }}>
            Eigenen Trait hinzufügen
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>Name *</label>
            <input type="text" value={customForm.name}
              onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))}
              placeholder="z.B. Sprung des Glaubens"
              style={{ ...sx.inp, fontSize: 13 }} autoFocus />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>Beschreibung</label>
            <textarea value={customForm.description}
              onChange={e => setCustomForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Was kann dein Charakter damit tun?"
              style={{ ...sx.ta, fontSize: 12, minHeight: 60 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={sx.lbl}>Kategorie</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[["trait", "Trait", "✦", "#10b981"], ["feature", "Feature", "⚡", "#6366f1"]].map(([id, label, icon, col]) => (
                <button key={id} onClick={() => setCustomForm(p => ({ ...p, category: id }))} style={{
                  flex: 1, padding: 7, borderRadius: 8, cursor: "pointer", fontSize: 12,
                  border: `1px solid ${customForm.category === id ? col : C.border}`,
                  background: customForm.category === id ? `${col}22` : "transparent",
                  color: customForm.category === id ? col : C.textDim,
                  fontWeight: customForm.category === id ? 700 : 400,
                }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addCustomTrait} disabled={!customForm.name.trim()}
              style={{ ...sx.btn(C.purple), flex: 1, padding: 10, fontSize: 12, fontWeight: 700, opacity: customForm.name.trim() ? 1 : 0.4 }}>
              ＋ Hinzufügen
            </button>
            <button onClick={() => setShowCustomForm(false)} style={{ ...sx.bsm(C.border), padding: "8px 14px", fontSize: 12, color: C.textDim }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasAny && !showCustomForm && (
        <div style={{ textAlign: "center", padding: "32px 16px", border: `2px dashed ${C.border}`, borderRadius: 14, color: C.textDim }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Traits</div>
          <div style={{ fontSize: 12 }}>Wähle Rasse, Hintergrund und Klasse — Traits werden automatisch eingetragen.</div>
        </div>
      )}

      {/* ── Trait groups ── */}
      {GROUP_ORDER.map(gk => {
        const items = groups[gk];
        if (!items?.length) return null;
        const gs = GROUP_STYLE[gk];
        return (
          <div key={gk} style={{ marginBottom: 14 }}>
            <GroupHeader icon={gs.icon} label={gs.label} color={gs.color} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              {items.map(trait => (
                <div key={trait.id} style={{ position: "relative" }}>
                  <TraitFeatureCard trait={trait} accentColor={gs.color} />
                  {trait.source === "Eigenes" && (
                    <button onClick={() => removeTrait(trait.id)} title="Entfernen" style={{
                      position: "absolute", top: 6, right: 6,
                      background: "transparent", border: "none",
                      color: C.textDim, cursor: "pointer", fontSize: 12, padding: "2px 5px", opacity: 0.5,
                    }}
                      onMouseOver={e => e.currentTarget.style.opacity = 1}
                      onMouseOut={e => e.currentTarget.style.opacity = 0.5}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GroupHeader({ icon, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ height: 1, flex: 1, background: C.border }} />
      <span style={{ fontSize: 11, color, fontFamily: FH, fontWeight: 700, padding: "0 6px", whiteSpace: "nowrap" }}>
        {icon} {label}
      </span>
      <div style={{ height: 1, flex: 1, background: C.border }} />
    </div>
  );
}
