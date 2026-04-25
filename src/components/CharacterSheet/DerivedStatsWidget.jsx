import { C, FH, sx } from "../../constants/theme.js";
import { fmtMod } from "../../utils/derivedStats.js";
import DerivedStatCard from "./DerivedStatCard.jsx";

// Stat colours matching theme SC map
const SC = { STR: "#ef4444", DEX: "#22c55e", CON: "#f97316", INT: "#3b82f6", WIS: "#a855f7", CHA: "#ec4899" };

const SAVE_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/**
 * DerivedStatsWidget — Compact combat-stats overview card
 * Props: stats (from useDerivedStats), isMobile
 */
export default function DerivedStatsWidget({ stats, isMobile }) {
  if (!stats) return null;

  const {
    proficiencyBonus,
    meleeAttackRoll, rangedAttackRoll, spellAttackRoll,
    spellSaveDC, baseAC, dexMod,
    strSave, dexSave, conSave, intSave, wisSave, chaSave,
    saveProfFlags, spellAbility, hasWeaponProf, modMap,
  } = stats;

  const saveValues = { STR: strSave, DEX: dexSave, CON: conSave, INT: intSave, WIS: wisSave, CHA: chaSave };

  const divider = (
    <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
  );

  return (
    <div style={{ ...sx.card, padding: "14px 16px" }}>
      {/* Title */}
      <div style={{
        fontFamily: FH, fontSize: 12, color: C.gold, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        borderBottom: `1px solid ${C.gold}44`, paddingBottom: 6, marginBottom: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span>⚔️ Kampfwerte</span>
        <span style={{ fontSize: 10, color: C.textDim, fontWeight: 400, fontFamily: "'Segoe UI',sans-serif", letterSpacing: 0 }}>
          PB <strong style={{ color: C.tealBright }}>+{proficiencyBonus}</strong>
          {" · "}Level <strong style={{ color: C.textBright }}>{stats.level}</strong>
        </span>
      </div>

      {/* ── Row 1: Attack rolls + Spell DC ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 2 }}>
        <DerivedStatCard
          label="Melee"
          value={meleeAttackRoll}
          color={C.redBright}
          formula={hasWeaponProf ? `STR${fmtMod(modMap.STR)} +PB` : `STR${fmtMod(modMap.STR)}`}
          size="md"
          proficient={hasWeaponProf}
        />
        <DerivedStatCard
          label="Ranged"
          value={rangedAttackRoll}
          color={C.amberBright}
          formula={hasWeaponProf ? `DEX${fmtMod(modMap.DEX)} +PB` : `DEX${fmtMod(modMap.DEX)}`}
          size="md"
          proficient={hasWeaponProf}
        />
        <DerivedStatCard
          label="Spell Atk"
          value={spellAttackRoll}
          color={C.purpleBright}
          formula={`${spellAbility}${fmtMod(modMap[spellAbility])} +PB`}
          size="md"
          proficient
        />
        <div style={{
          background: `${C.blueBright}0d`, border: `1px solid ${C.blueBright}30`,
          borderRadius: 10, padding: "8px 10px", textAlign: "center", minWidth: 60,
        }}>
          <div style={{ fontSize: 9, color: C.blueBright, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: FH, marginBottom: 3 }}>
            Spell DC
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.textBright, lineHeight: 1 }}>
            {spellSaveDC}
          </div>
          <div style={{ fontSize: 9, color: C.textDim, marginTop: 3 }}>
            8 +{spellAbility}{fmtMod(modMap[spellAbility])} +PB
          </div>
        </div>
      </div>

      {divider}

      {/* ── Row 2: Saving throws ── */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
          Rettungswürfe <span style={{ color: C.textDim, opacity: 0.5 }}>· Punkt = Übung</span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: 5,
        }}>
          {SAVE_KEYS.map(ab => (
            <DerivedStatCard
              key={ab}
              label={ab}
              value={saveValues[ab]}
              color={SC[ab]}
              size="sm"
              proficient={saveProfFlags[ab]}
            />
          ))}
        </div>
      </div>

      {divider}

      {/* ── Row 3: Base AC + Prof bonus ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{
          flex: 1, background: `${C.tealBright}0d`, border: `1px solid ${C.tealBright}30`,
          borderRadius: 8, padding: "7px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 9, color: C.tealBright, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: FH }}>Basis-RK</div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>10 + DEX {fmtMod(dexMod)}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.textBright }}>{baseAC}</div>
        </div>
        <div style={{
          flex: 1, background: `${C.gold}0d`, border: `1px solid ${C.gold}30`,
          borderRadius: 8, padding: "7px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: FH }}>Prof Bonus</div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>Level {stats.level}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>+{proficiencyBonus}</div>
        </div>
      </div>
    </div>
  );
}
