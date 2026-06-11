import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import TraitFeatureCard from "./TraitFeatureCard.jsx";
import { getFeatById } from "../../data/feats.js";
import { useI18n } from "../../i18n/index.js";

function groupKey(source) {
  if (!source) return "custom";
  if (source.startsWith("class:")) return "class";
  if (source.startsWith("subclass:")) return "subclass";
  if (source.startsWith("Hintergrund:")) return "bg";
  if (source.startsWith("feat:")) return "feat";
  // race traits have source = race name (e.g. "Elf")
  return "race";
}

/** Detect the auto-added Origin Feat trait (from BG_SOURCE_PREFIX builder) */
function isOriginFeatTrait(t) {
  return t?.id?.endsWith("_feat") && t?.source?.startsWith("Hintergrund:");
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
    // Skip the Origin Feat — rendered separately in featured section
    if (isOriginFeatTrait(t)) return;
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
  const { t } = useI18n();
  const GROUP_STYLE = {
    race:      { icon: "🌿", label: t("char.group_race","Volksmerkmale"),   color: C.greenBright },
    bg:        { icon: "📜", label: t("char.group_bg","Hintergrund"),       color: C.amberBright },
    class:     { icon: "⚔️", label: t("char.group_class","Klassenmerkmale"),color: C.gold },
    subclass:  { icon: "✨", label: t("char.group_subclass","Subklasse"),    color: C.purpleBright },
    feat:      { icon: "⭐", label: t("char.group_feat","Talente (Feats)"),   color: C.blueBright },
    custom:    { icon: "✦", label: t("char.group_custom","Eigene"),          color: C.tealBright },
  };
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", description: "", category: "trait" });

  const groups = buildGroups(char);
  const hasAny = Object.keys(groups).length > 0 || (char.languages || []).length > 0 || char.originFeat;

  // Look up Origin Feat description from feats.js (if available)
  const originFeatObj = char.originFeat ? findFeatByName(char.originFeat) : null;

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
      raceTraits: (p.raceTraits || []).filter(tr => tr.id !== id),
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
            {t("char.traits_features_header","✦ Traits & Features")}
          </span>
          <span style={{ fontSize: 11, color: C.textDim, marginLeft: 10 }}>
            {t("char.traits_autofill_hint","Rasse, Hintergrund, Klasse & Subklasse werden auto-befüllt")}
          </span>
        </div>
        <button type="button"
          onClick={() => setShowCustomForm(p => !p)}
          style={{ ...sx.bsm(C.purple), fontSize: 11, padding: "4px 10px" }}
        >
          {t("char.custom_trait_btn","＋ Eigener Trait")}
        </button>
      </div>

      {/* ── Origin Feat (2024 PHB — vom Background) ── */}
      {char.originFeat && (
        <div style={{ marginBottom: 14 }}>
          <GroupHeader icon="⚔" label={t("char.origin_feat_2024_header","Origin Feat (2024)")} color={C.amberBright} />
          <div style={{
            marginTop: 6,
            background: `linear-gradient(135deg, ${C.amber}18, rgba(0,0,0,0.25))`,
            border: `1px solid ${C.amberBright}55`,
            borderLeft: `4px solid ${C.amberBright}`,
            borderRadius: 8,
            padding: "10px 14px",
            boxShadow: `0 0 14px ${C.amberBright}11`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: FH, fontSize: 14, color: C.amberBright, fontWeight: 700 }}>
                ⚔ {char.originFeat}
              </span>
              {char.background && (
                <span style={{
                  fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
                  background: "rgba(0,0,0,0.35)", border: `1px solid ${C.border}`,
                  color: C.textDim, letterSpacing: 0.3,
                }}>
                  {t("char.bg_label_inline","Background:")} {char.background}
                </span>
              )}
            </div>
            {originFeatObj?.description ? (
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55 }}>
                {originFeatObj.description}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
                {t("char.feat_phb_details","Details siehe Spielerhandbuch (Origin Feat).")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Languages ── */}
      {(char.languages || []).length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <GroupHeader icon="💬" label={t("char.languages_label","Sprachen")} color={C.tealBright} />
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
            {t("char.add_custom_trait","Eigenen Trait hinzufügen")}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>{t("combat.name_required_lbl","Name *")}</label>
            <input type="text" value={customForm.name}
              onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))}
              placeholder={t("char.placeholder_trait_name","z.B. Sprung des Glaubens")}
              style={{ ...sx.inp, fontSize: 13 }} autoFocus />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>{t("char.description_lbl","Beschreibung")}</label>
            <textarea value={customForm.description}
              onChange={e => setCustomForm(p => ({ ...p, description: e.target.value }))}
              placeholder={t("char.placeholder_description","Was kann dein Charakter damit tun?")}
              style={{ ...sx.ta, fontSize: 12, minHeight: 60 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={sx.lbl}>{t("char.category_lbl","Kategorie")}</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[["trait", t("char.trait_lbl","Trait"), "✦", "#10b981"], ["feature", t("char.feature_lbl","Feature"), "⚡", "#6366f1"]].map(([id, label, icon, col]) => (
                <button type="button" key={id} onClick={() => setCustomForm(p => ({ ...p, category: id }))} style={{
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
            <button type="button" onClick={addCustomTrait} disabled={!customForm.name.trim()}
              style={{ ...sx.btn(C.purple), flex: 1, padding: 10, fontSize: 12, fontWeight: 700, opacity: customForm.name.trim() ? 1 : 0.4 }}>
              {t("char.add_custom_btn","＋ Hinzufügen")}
            </button>
            <button type="button" onClick={() => setShowCustomForm(false)} style={{ ...sx.bsm(C.border), padding: "8px 14px", fontSize: 12, color: C.textDim }}>
              {t("combat.cancel_word","Abbrechen")}
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasAny && !showCustomForm && (
        <div style={{ textAlign: "center", padding: "32px 16px", border: `2px dashed ${C.border}`, borderRadius: 14, color: C.textDim }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>{t("char.no_traits_yet","Noch keine Traits")}</div>
          <div style={{ fontSize: 12 }}>{t("char.no_traits_hint","Wähle Rasse, Hintergrund und Klasse — Traits werden automatisch eingetragen.")}</div>
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
                  <TraitFeatureCard trait={trait} />
                  {trait.source === "Eigenes" && (
                    <button type="button" onClick={() => removeTrait(trait.id)} title={t("char.remove_title","Entfernen")} style={{
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

/** Find a feat object by display-name (e.g. 'Savage Attacker' → feat object) */
function findFeatByName(featName) {
  if (!featName) return null;
  // Strip parens like "Magic Initiate (Cleric)" → "magic_initiate"
  const baseId = featName.toLowerCase().split("(")[0].trim().replace(/[\s']/g, "_").replace(/[^a-z_]/g, "");
  return getFeatById(baseId);
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
