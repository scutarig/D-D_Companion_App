import { C, sx, FH } from "../../constants/theme.js";
import { usePersist } from "../../hooks/usePersist.js";
import { SPELLS } from "../../data/spells.js";
import { getAllCantripLimits } from "../../data/spellPreparation.js";

/**
 * CantripsCard — 2024 PHB Cantrips Known Tracker
 *
 * Props: char, classes (from useMulticlass)
 *
 * Zeigt pro Caster-Klasse die Cantrip-Quota an:
 *   - Aktuelle Anzahl bekannter Cantrips dieser Klasse
 *   - Maximum (2024 Tabelle, steigt auf Lv4 + Lv10)
 *   - Progress-Bar + Status-Tag
 *   - Liste der gewählten Cantrips als Badges
 *
 * Storage: spells_known_<charId> (Spellbook-Storage)
 * Cantrips = Spells mit lv === 0
 *
 * 2024 Regel: Cantrips können NICHT täglich getauscht werden — nur bei
 * Levelup 1 Cantrip aus eigener Liste umwählen.
 */
export default function CantripsCard({ char, classes }) {
  const [known] = usePersist(`spells_known_${char.id || "g"}`, []);
  const limits = getAllCantripLimits(classes, char);
  if (limits.length === 0) return null;

  const KLASS_TO_SPELL_TAG = {
    Barde:        "Bard",
    Druide:       "Druid",
    Hexenmeister: "Warlock",
    Kleriker:     "Cleric",
    Magier:       "Wizard",
    Zauberer:     "Sorcerer",
    Magieschmied: "Artificer",
  };

  // Cantrips = known spells with lv === 0
  const knownCantrips = SPELLS.filter(s => known.includes(s.id) && s.lv === 0);

  return (
    <div style={{
      ...sx.card,
      background: `linear-gradient(135deg, ${C.amber}10, rgba(0,0,0,0.2))`,
      borderLeft: `3px solid ${C.amberBright}`,
    }}>
      <div style={{
        fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700,
        marginBottom: 6, letterSpacing: 0.5,
      }}>
        ✨ CANTRIPS (2024 PHB)
      </div>

      <div style={{
        fontSize: 11, color: C.text, lineHeight: 1.55,
        background: `${C.amber}0d`, border: `1px solid ${C.amber}30`,
        borderRadius: 6, padding: "7px 10px", marginBottom: 10,
      }}>
        2024: Cantrip-Anzahl steigt auf <b>Lv4</b> und <b>Lv10</b>. Cantrips können <b>NICHT täglich getauscht</b> werden — nur bei Levelup 1 Cantrip umwählen. Verwaltung im <b>Spellbook</b>-Tab.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {limits.map(l => {
          const tag = KLASS_TO_SPELL_TAG[l.klassName];
          const classCantrips = knownCantrips.filter(s =>
            tag && (s.cls?.includes(tag) || s.cls === tag)
          );
          const count = classCantrips.length;
          const ratio = count / l.limit;
          const isFull = count === l.limit;
          const isOver = count > l.limit;
          const barColor = isOver ? C.redBright : isFull ? C.amberBright : C.greenBright;
          const barFill = Math.min(100, Math.round(ratio * 100));
          const abilityColor = C[l.ability + "Bright"] || C.purpleBright;

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
                    background: `${abilityColor}22`,
                    border: `1px solid ${abilityColor}55`,
                    color: abilityColor,
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
                overflow: "hidden", marginBottom: 6,
              }}>
                <div style={{
                  height: "100%", width: `${barFill}%`,
                  background: barColor, transition: "width 0.3s",
                }} />
              </div>

              {/* Cantrip badges */}
              {count > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {classCantrips.map(s => (
                    <span key={s.id} style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 6,
                      background: `${C.amber}22`, border: `1px solid ${C.amber}55`,
                      color: C.amberBright,
                    }}>
                      ✨ {s.name}
                    </span>
                  ))}
                </div>
              )}
              {count === 0 && (
                <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic" }}>
                  Noch keine Cantrips bekannt — wähle im Spellbook-Tab.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
