import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { SPELLS } from "../../data/spells.js";
import { getAllSpellPreparedLimits } from "../../data/spellPreparation.js";

/**
 * SpellPreparationCard — 2024 PHB Spell Preparation Status
 *
 * Props: char, classes
 *   - classes: aus useMulticlass()
 *
 * Zeigt pro Caster-Klasse:
 *   - Aktuelle Anzahl vorbereiteter Spells
 *   - Maximum (Klassen-Formel)
 *   - Progress-Bar (grün=OK, gold=voll, rot=über Limit)
 *   - Liste der aktuell vorbereiteten Spells dieser Klasse
 *
 * Storage: spells_prep_<charId> (vom Spellbook geteilt)
 *
 * 2024 Reform: Alle Caster nutzen "Prepared Spells" (Sorcerer/Warlock/Bard
 * waren vorher "Known"). Tauschen nach Long Rest.
 */
export default function SpellPreparationCard({ char, classes }) {
  const [prepared] = usePersist(`spells_prep_${char.id || "g"}`, []);

  const limits = getAllSpellPreparedLimits(classes, char);
  if (limits.length === 0) return null;

  // Map German class to English spell-list class tag
  const KLASS_TO_SPELL_TAG = {
    Barde:        "Bard",
    Druide:       "Druid",
    Hexenmeister: "Warlock",
    Kleriker:     "Cleric",
    Magier:       "Wizard",
    Paladin:      "Paladin",
    Waldläufer:   "Ranger",
    Zauberer:     "Sorcerer",
    Magieschmied: "Artificer",
  };

  // Get prepared spells (excluding cantrips) per class tag
  const preparedSpells = SPELLS.filter(s => prepared.includes(s.id) && s.lv > 0);

  return (
    <div style={{
      ...sx.card,
      background: `linear-gradient(135deg, ${C.blue}10, rgba(0,0,0,0.2))`,
      borderLeft: `3px solid ${C.blueBright}`,
    }}>
      <div style={{
        fontFamily: FH, fontSize: 13, color: C.blueBright, fontWeight: 700,
        marginBottom: 6, letterSpacing: 0.5,
      }}>
        🕯️ VORBEREITETE ZAUBER (2024 PHB)
      </div>

      <div style={{
        fontSize: 11, color: C.text, lineHeight: 1.55,
        background: `${C.blue}0d`, border: `1px solid ${C.blue}30`,
        borderRadius: 6, padding: "7px 10px", marginBottom: 10,
      }}>
        2024 Reform: <b>Alle Caster nutzen "Prepared"</b> (Sorcerer/Warlock/Bard waren vorher "Known"). Nach <b>Long Rest</b> darfst du die Auswahl tauschen. Verwaltung im <b>Spellbook</b>-Tab.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {limits.map(l => {
          const tag = KLASS_TO_SPELL_TAG[l.klassName];
          const classPrepared = preparedSpells.filter(s =>
            tag && (s.cls?.includes(tag) || s.cls === tag)
          );
          const count = classPrepared.length;
          const ratio = count / l.limit;
          const isFull = count === l.limit;
          const isOver = count > l.limit;
          const barColor = isOver ? C.redBright : isFull ? C.amberBright : C.greenBright;
          const barFill = Math.min(100, Math.round(ratio * 100));

          return (
            <div key={l.klassName} style={{
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${isOver ? C.redBright : C.border}`,
              borderRadius: 6,
              padding: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: FH, fontSize: 12, color: C.gold, fontWeight: 700 }}>
                    {l.klassName}
                  </span>
                  <span style={{ fontSize: 9, color: C.textDim }}>Lv{l.level}</span>
                  <span style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 6, fontWeight: 700,
                    background: `${C[l.ability + "Bright"] || C.purpleBright}22`,
                    border: `1px solid ${C[l.ability + "Bright"] || C.purpleBright}55`,
                    color: C[l.ability + "Bright"] || C.purpleBright,
                  }}>{l.ability.toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: barColor, fontWeight: 700 }}>
                    {count}/{l.limit}
                  </span>
                  {isOver && <span style={{ fontSize: 9, color: C.redBright }}>⚠ Über Limit</span>}
                  {isFull && !isOver && <span style={{ fontSize: 9, color: C.amberBright }}>✓ Voll</span>}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 6, borderRadius: 3, background: "rgba(0,0,0,0.4)",
                overflow: "hidden", marginBottom: 4,
              }}>
                <div style={{
                  height: "100%", width: `${barFill}%`,
                  background: barColor, transition: "width 0.3s",
                }} />
              </div>

              <div style={{ fontSize: 9, color: C.textDim, marginBottom: 4, fontStyle: "italic" }}>
                Limit: {l.formula}
              </div>

              {/* Prepared spell tags */}
              {count > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {classPrepared.map(s => (
                    <span key={s.id} style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 6,
                      background: `${C.blue}22`, border: `1px solid ${C.blue}55`,
                      color: C.blueBright,
                    }}>
                      Lv{s.lv} {s.name}
                    </span>
                  ))}
                </div>
              )}
              {count === 0 && (
                <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", marginTop: 4 }}>
                  Noch keine Zauber vorbereitet — wähle im Spellbook-Tab.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
