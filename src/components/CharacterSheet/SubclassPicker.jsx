import { C, sx, FH } from "../../constants/theme.js";
import {
  getSubclasses,
  getSubclassChoiceLevel,
  getSubclassByName,
} from "../../data/subclasses.js";

/**
 * SubclassPicker — 2024 PHB Subclass Selector with Feature Preview
 *
 * Props: char, classes, setSubclass
 *   - classes: aus useMulticlass() der Parent-Komponente (lift-state-up)
 *   - setSubclass: (className, subclassName) => void
 *
 * Zeigt für jede Klasse des Charakters den Subclass-Picker an, sobald die Klasse
 * das Subclass-Choice-Level erreicht hat (2024: meist Lv3).
 *
 * Bei Auswahl: Volle Feature-Preview-Karte mit allen verfügbaren Features
 * (gefiltert nach Klassen-Level), gruppiert nach Feature-Level.
 *
 * Speichert in char.subclasses[KlassenName] = subclassName (string).
 */
export default function SubclassPicker({ char, classes, setSubclass }) {

  // Filter classes that have reached subclass choice level
  const eligibleClasses = classes
    .map(klass => ({
      ...klass,
      choiceLevel: getSubclassChoiceLevel(klass.name),
    }))
    .filter(klass => klass.choiceLevel !== null);

  if (eligibleClasses.length === 0) return null;

  return (
    <div style={{
      ...sx.card,
      background: `linear-gradient(135deg, ${C.purple}10, rgba(0,0,0,0.2))`,
      borderLeft: `3px solid ${C.purpleBright}`,
    }}>
      <div style={{
        fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700,
        marginBottom: 6, letterSpacing: 0.5,
      }}>
        ✦ SUBKLASSEN (2024 PHB)
      </div>
      <div style={{
        fontSize: 11, color: C.text, lineHeight: 1.55,
        background: `${C.purple}0d`, border: `1px solid ${C.purple}30`,
        borderRadius: 6, padding: "7px 10px", marginBottom: 10,
      }}>
        2024 Reform: <b>Alle Subklassen werden auf Lv3 gewählt</b> (vorher 2014: Lv1/2 für Cleric/Druid/Wizard/Sorcerer/Warlock). Pro Klasse 4 Subklassen verfügbar.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {eligibleClasses.map(klass => {
          const choices = getSubclasses(klass.name);
          const selected = (char.subclasses || {})[klass.name] || "";
          const isLocked = klass.level < klass.choiceLevel;
          const subclassData = selected ? getSubclassByName(klass.name, selected) : null;

          return (
            <div key={klass.name} style={{
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${selected ? `${C.purpleBright}55` : C.border}`,
              borderRadius: 8,
              padding: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: FH, fontSize: 13, color: C.gold, fontWeight: 700 }}>
                    {klass.name}
                  </span>
                  <span style={{ fontSize: 10, color: C.textDim }}>Lv{klass.level}</span>
                </div>
                {isLocked && (
                  <span
                    title="Du kannst Subklassen jetzt schon vorab anschauen, die Auswahl wird erst beim Erreichen des Choice-Levels wirksam."
                    style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
                      background: `${C.amberBright}1f`, border: `1px solid ${C.amberBright}55`,
                      color: C.amberBright,
                    }}>
                    🔍 Preview · Lv{klass.choiceLevel} erforderlich
                  </span>
                )}
              </div>

              {/* Show dropdown always — locked classes use it for preview only */}
              <select
                value={selected}
                onChange={e => setSubclass(klass.name, e.target.value)}
                style={{ ...sx.sel, opacity: isLocked ? 0.85 : 1 }}
              >
                <option value="">{isLocked ? "— Subklasse vorab anschauen —" : "— Subklasse wählen —"}</option>
                {choices.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {selected && subclassData && (
                <SubclassFeaturesPreview
                  subclass={subclassData}
                  classLevel={klass.level}
                  isPreview={isLocked}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Feature Preview Card ─────────────────────────────────────────────────────
function SubclassFeaturesPreview({ subclass, classLevel, isPreview = false }) {
  // Group features by level
  const byLevel = {};
  subclass.features.forEach(f => {
    if (!byLevel[f.level]) byLevel[f.level] = [];
    byLevel[f.level].push(f);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  const accentColor = isPreview ? C.amberBright : C.purpleBright;

  return (
    <div style={{
      marginTop: 8,
      padding: "8px 10px",
      borderRadius: 6,
      background: isPreview ? `${C.amberBright}08` : `${C.purple}0d`,
      border: `1px solid ${isPreview ? C.amberBright : C.purple}30`,
      borderLeft: `3px solid ${accentColor}`,
    }}>
      <div style={{ fontSize: 11, color: accentColor, fontFamily: FH, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
        {isPreview ? "🔍" : "✦"} {subclass.name}
        {isPreview && (
          <span style={{ fontSize: 9, color: C.textDim, fontWeight: 400, fontFamily: "inherit", fontStyle: "italic" }}>
            (Vorschau — wird auf Lv{subclass.levelGained || 3} wirksam)
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {levels.map(lvl => {
          const unlocked = classLevel >= lvl;
          const feats = byLevel[lvl];
          return (
            <div key={lvl} style={{ opacity: unlocked ? 1 : 0.45 }}>
              <div style={{
                fontSize: 9, fontFamily: FH, fontWeight: 700,
                color: unlocked ? C.amberBright : C.textDim,
                letterSpacing: 0.5, marginBottom: 3,
              }}>
                {unlocked ? "✓" : "🔒"} LV {lvl}
              </div>
              {feats.map(f => (
                <div key={f.id} style={{
                  fontSize: 10, color: C.text, lineHeight: 1.45,
                  paddingLeft: 12, marginBottom: 3,
                  borderLeft: `2px solid ${unlocked ? C.purpleBright : C.border}`,
                  paddingTop: 1, paddingBottom: 1,
                }}>
                  <b style={{ color: unlocked ? C.text : C.textDim }}>{f.name}</b>
                  <div style={{ color: C.textDim, marginTop: 1 }}>{f.description}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
