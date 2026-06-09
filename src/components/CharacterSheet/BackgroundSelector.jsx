import { C, sx, FH } from "../../constants/theme.js";
import { ALL_BACKGROUNDS, applyBackground, applyBackgroundAsi, getBackgroundData, asiTotal, isAsiValid } from "../../utils/backgrounds.js";
import { getFeatById } from "../../data/feats.js";

/**
 * BackgroundSelector — 2024 PHB Background Picker
 *
 * Props: char, setChar
 *
 * Liefert UI für:
 *   1. Background-Wahl (Dropdown)
 *   2. ASI-Verteilung (3 Stats, +2/+1 oder +1/+1/+1)
 *   3. Origin Feat (Badge mit Hover-Description)
 *   4. Skills + Tool Proficiencies (Badges, auto-applied)
 *   5. Equipment-Wahl (Package A oder B)
 *
 * Speichert auf char:
 *   - char.background (Name)
 *   - char.bgAsi: { str?:n, dex?:n, con?:n, int?:n, wis?:n, cha?:n } — Summe 3
 *   - char.originFeat: string (z.B. "Savage Attacker")
 *   - char.bgEquipChoice: "A" | "B"
 */

const ASI_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
const STAT_COLOR = { str: C.red, dex: C.green, con: C.amber, int: C.blue, wis: C.teal, cha: C.purple };

export default function BackgroundSelector({ char, setChar }) {
  const bg = getBackgroundData(char.background);
  const isCustom = char.background === "Eigener";
  const bgAsi = char.bgAsi || {};
  const asiOk = bg && isAsiValid(bgAsi, bg);

  // Find Origin Feat description from feats.js (English name match)
  const featObj = bg?.feat ? findFeatByName(bg.feat) : null;

  const onBgChange = (e) => {
    setChar(prev => applyBackground(prev, e.target.value));
  };

  const onAsiPreset = (preset) => {
    if (!bg) return;
    const [a, b, c] = bg.abilityScores.map(s => s.toLowerCase());
    let newAsi = {};
    if (preset === "2+1-AB")  newAsi = { [a]: 2, [b]: 1 };
    if (preset === "2+1-AC")  newAsi = { [a]: 2, [c]: 1 };
    if (preset === "2+1-BA")  newAsi = { [b]: 2, [a]: 1 };
    if (preset === "2+1-BC")  newAsi = { [b]: 2, [c]: 1 };
    if (preset === "2+1-CA")  newAsi = { [c]: 2, [a]: 1 };
    if (preset === "2+1-CB")  newAsi = { [c]: 2, [b]: 1 };
    if (preset === "1+1+1")   newAsi = { [a]: 1, [b]: 1, [c]: 1 };
    setChar(prev => applyBackgroundAsi(prev, newAsi));
  };

  const onEquipChoice = (which) => {
    setChar(prev => ({ ...prev, bgEquipChoice: which }));
  };

  return (
    <div>
      {/* ── Dropdown ─────────────────────────────────────── */}
      <label style={sx.lbl}>Hintergrund / Background</label>
      <select value={char.background} onChange={onBgChange} style={sx.sel}>
        {ALL_BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
        <option value="Eigener">Eigener...</option>
      </select>
      {isCustom && (
        <input
          value={char.backgroundCustom || ""}
          onChange={e => setChar(p => ({ ...p, backgroundCustom: e.target.value }))}
          style={{ ...sx.inp, marginTop: 4 }}
          placeholder="Eigener Hintergrund..."
        />
      )}

      {/* Edition Badge */}
      {bg && (
        <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
          {bg.edition === "2024" && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
              background: `${C.purpleBright}1f`, border: `1px solid ${C.purpleBright}55`,
              color: C.purpleBright, letterSpacing: 0.3,
            }}>2024 PHB</span>
          )}
          {!asiOk && (
            <span style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700,
              background: `${C.amberBright}1f`, border: `1px solid ${C.amberBright}55`,
              color: C.amberBright,
            }} title="Du musst noch deine ASI-Verteilung wählen">
              ⚠ ASI offen
            </span>
          )}
        </div>
      )}

      {bg && (
        <>
          {/* ── Description ──────────────────────────────── */}
          <div style={{ marginTop: 8, fontSize: 11, color: C.textDim, lineHeight: 1.5, fontStyle: "italic" }}>
            {bg.description}
          </div>

          {/* ── ASI Picker ───────────────────────────────── */}
          <div style={{ marginTop: 12 }}>
            <label style={sx.lbl}>
              Ability Score Increase
              <span style={{ color: C.textDim, fontSize: 9, marginLeft: 6, textTransform: "none" }}>
                — verteile 3 Punkte auf {bg.abilityScores.join(" / ")}
              </span>
            </label>

            {/* Current distribution display */}
            <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              {bg.abilityScores.map(s => {
                const k = s.toLowerCase();
                const v = bgAsi[k] || 0;
                const col = STAT_COLOR[k];
                return (
                  <div key={k} style={{
                    background: `${col}15`,
                    border: `1px solid ${col}${v > 0 ? "88" : "33"}`,
                    borderRadius: 8,
                    padding: "5px 10px",
                    minWidth: 50,
                    textAlign: "center",
                    opacity: v > 0 ? 1 : 0.6,
                  }}>
                    <div style={{ fontSize: 9, color: col, fontFamily: FH, fontWeight: 700 }}>{s}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: v > 0 ? col : C.textDim }}>
                      {v > 0 ? `+${v}` : "—"}
                    </div>
                  </div>
                );
              })}
              <div style={{
                background: asiOk ? `${C.green}22` : `${C.textDim}11`,
                border: `1px solid ${asiOk ? C.green : C.textDim}55`,
                borderRadius: 8, padding: "5px 10px", minWidth: 50, textAlign: "center",
              }}>
                <div style={{ fontSize: 9, color: asiOk ? C.green : C.textDim, fontFamily: FH, fontWeight: 700 }}>SUM</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: asiOk ? C.green : C.textDim }}>
                  {asiTotal(bgAsi)}/3
                </div>
              </div>
            </div>

            {/* Preset Buttons */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <AsiBtn label={`+2 ${bg.abilityScores[0]} / +1 ${bg.abilityScores[1]}`} onClick={() => onAsiPreset("2+1-AB")} active={bgAsi[bg.abilityScores[0].toLowerCase()] === 2 && bgAsi[bg.abilityScores[1].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+2 ${bg.abilityScores[0]} / +1 ${bg.abilityScores[2]}`} onClick={() => onAsiPreset("2+1-AC")} active={bgAsi[bg.abilityScores[0].toLowerCase()] === 2 && bgAsi[bg.abilityScores[2].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+2 ${bg.abilityScores[1]} / +1 ${bg.abilityScores[0]}`} onClick={() => onAsiPreset("2+1-BA")} active={bgAsi[bg.abilityScores[1].toLowerCase()] === 2 && bgAsi[bg.abilityScores[0].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+2 ${bg.abilityScores[1]} / +1 ${bg.abilityScores[2]}`} onClick={() => onAsiPreset("2+1-BC")} active={bgAsi[bg.abilityScores[1].toLowerCase()] === 2 && bgAsi[bg.abilityScores[2].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+2 ${bg.abilityScores[2]} / +1 ${bg.abilityScores[0]}`} onClick={() => onAsiPreset("2+1-CA")} active={bgAsi[bg.abilityScores[2].toLowerCase()] === 2 && bgAsi[bg.abilityScores[0].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+2 ${bg.abilityScores[2]} / +1 ${bg.abilityScores[1]}`} onClick={() => onAsiPreset("2+1-CB")} active={bgAsi[bg.abilityScores[2].toLowerCase()] === 2 && bgAsi[bg.abilityScores[1].toLowerCase()] === 1 && asiTotal(bgAsi) === 3} />
              <AsiBtn label={`+1 / +1 / +1 (${bg.abilityScores.join(" ")})`} onClick={() => onAsiPreset("1+1+1")} active={bg.abilityScores.every(s => bgAsi[s.toLowerCase()] === 1)} highlight />
            </div>
          </div>

          {/* ── Origin Feat ──────────────────────────────── */}
          <div style={{ marginTop: 12 }}>
            <label style={sx.lbl}>Origin Feat (2024)</label>
            <div style={{
              padding: "8px 10px",
              borderRadius: 6,
              background: `${C.amber}0d`,
              border: `1px solid ${C.amber}30`,
              borderLeft: `3px solid ${C.amberBright}`,
            }}>
              <div style={{ fontSize: 12, color: C.amberBright, fontFamily: FH, fontWeight: 700, marginBottom: 3 }}>
                ⚔ {bg.feat}
              </div>
              {featObj?.description && (
                <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>
                  {featObj.description}
                </div>
              )}
            </div>
          </div>

          {/* ── Skills + Tool ────────────────────────────── */}
          <div style={{ marginTop: 12 }}>
            <label style={sx.lbl}>Proficiencies</label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {bg.skillProfs.map(s => (
                <span key={s} style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 8, fontWeight: 700,
                  background: `${C.tealBright}18`, border: `1px solid ${C.tealBright}55`,
                  color: C.tealBright,
                }}>🎯 {s}</span>
              ))}
              <span style={{
                fontSize: 10, padding: "3px 8px", borderRadius: 8, fontWeight: 700,
                background: `${C.gold}18`, border: `1px solid ${C.gold}55`,
                color: C.amberBright,
              }}>🔧 {bg.toolProf}</span>
            </div>
          </div>

          {/* ── Equipment Choice ─────────────────────────── */}
          <div style={{ marginTop: 12 }}>
            <label style={sx.lbl}>Startausrüstung — wähle Package A oder B</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <EquipCard
                label="Package A (Gear)"
                items={bg.equipmentA.join(", ")}
                active={char.bgEquipChoice === "A"}
                onClick={() => onEquipChoice("A")}
              />
              <EquipCard
                label="Package B"
                items={bg.equipmentB}
                active={char.bgEquipChoice === "B"}
                onClick={() => onEquipChoice("B")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Small sub-components ───────────────────────────────────────────────────
function AsiBtn({ label, onClick, active, highlight }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 9,
      padding: "4px 8px",
      borderRadius: 5,
      cursor: "pointer",
      background: active
        ? (highlight ? `${C.purple}55` : `${C.tealBright}55`)
        : "rgba(0,0,0,0.3)",
      border: `1px solid ${active
        ? (highlight ? C.purpleBright : C.tealBright)
        : C.border}`,
      color: active ? C.textBright : C.text,
      fontWeight: active ? 700 : 400,
      transition: "all .2s",
    }}>
      {label}
    </button>
  );
}

function EquipCard({ label, items, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: "8px 10px",
      borderRadius: 6,
      cursor: "pointer",
      background: active ? `${C.tealBright}18` : "rgba(0,0,0,0.2)",
      border: `1px solid ${active ? C.tealBright : C.border}`,
      borderLeft: `3px solid ${active ? C.tealBright : C.border}`,
      transition: "all .2s",
    }}>
      <div style={{ fontSize: 10, color: active ? C.tealBright : C.textDim, fontFamily: FH, fontWeight: 700, marginBottom: 3 }}>
        {active && "✓ "}{label}
      </div>
      <div style={{ fontSize: 10, color: C.text, lineHeight: 1.4 }}>
        {items}
      </div>
    </div>
  );
}

// ─── Find Feat by English name (since bg.feat is a string) ──────────────────
function findFeatByName(featName) {
  // Strip parens like "Magic Initiate (Cleric)" → "magic_initiate"
  const base = featName.toLowerCase().split("(")[0].trim().replace(/[\s']/g, "_").replace(/[^a-z_]/g, "");
  // Try direct id match
  let f = getFeatById(base);
  if (f) return f;
  // Fallback: search by name field
  return null;
}
