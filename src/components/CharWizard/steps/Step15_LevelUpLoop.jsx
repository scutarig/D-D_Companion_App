import { C, sx, FH, SC, ABS } from "../../../constants/theme.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { SUBCLASSES } from "../../../data/subclasses.js";
import { useI18n } from "../../../i18n/index.js";

// Standard ASI levels (PHB 2024) for all classes. Fighter adds Lv6 + Lv14,
// Rogue adds Lv10 (class-specific extras on top of the standard set).
const ASI_LEVELS_DEFAULT = [4, 8, 12, 16, 19];
const CLASS_EXTRA_ASI = { Kämpfer: [6, 14], Schurke: [10] };

function asiAtLevel(klass, lv) {
  if (ASI_LEVELS_DEFAULT.includes(lv)) return true;
  if (CLASS_EXTRA_ASI[klass]?.includes(lv)) return true;
  return false;
}

function rollDie(size) {
  return Math.floor(Math.random() * size) + 1;
}

export default function Step15_LevelUpLoop({ state, updatePartial }) {
  const { t } = useI18n();
  const lv = state.levelupCurrent;
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);
  // Default HP-mode is "avg" (PHB 2024 standard). New chars get the average
  // until the user explicitly picks roll/manual.
  const choice = state.levelupChoices[lv] || { hpMode: "avg" };
  const setChoice = (patch) => updatePartial({
    levelupChoices: { ...state.levelupChoices, [lv]: { ...choice, ...patch } },
  });

  const needsSubclass = lv === 3;
  const needsASI = asiAtLevel(state.klass, lv);
  const subclassOptions = SUBCLASSES[state.klass] || [];

  const hdMatch = (cls?.hd || "d8").match(/\d+/);
  const hdSize = hdMatch ? parseInt(hdMatch[0]) : 8;
  const hpAvg = Math.floor(hdSize / 2) + 1;

  const hpMode = choice.hpMode || "avg";

  const onRoll = () => setChoice({ hpMode: "roll", hpRoll: rollDie(hdSize) });

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 14 }}>
        {t("wizard.s15.title","Level {n} ausbauen").replace("{n}", String(lv))}
      </h2>

      <section style={{ marginBottom: 18 }}>
        <label style={sx.lbl}>
          {t("wizard.s15.hp_lbl","TP-Gewinn")}
          <span style={{ color: C.textDim, fontWeight: 400, marginLeft: 6 }}>
            (+ CON-Mod beim Commit)
          </span>
        </label>

        {/* Mode picker */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setChoice({ hpMode: "avg" })}
            style={{ ...sx.bsm(hpMode === "avg" ? C.tealBright : C.textDim) }}>
            {t("wizard.s15.hp_avg","🎯 Average")} ({hpAvg})
          </button>
          <button type="button" onClick={onRoll}
            style={{ ...sx.bsm(hpMode === "roll" ? C.tealBright : C.textDim) }}>
            {t("wizard.s15.hp_roll","🎲 Würfeln")} (1{cls?.hd || "d8"})
          </button>
          <button type="button" onClick={() => setChoice({ hpMode: "manual", hpManual: choice.hpManual ?? hpAvg })}
            style={{ ...sx.bsm(hpMode === "manual" ? C.tealBright : C.textDim) }}>
            {t("wizard.s15.hp_manual","✏️ Manuell")}
          </button>
        </div>

        {/* Mode-specific display */}
        {hpMode === "avg" && (
          <div style={{ ...sx.inp, color: C.tealBright, fontFamily: FH, fontWeight: 700 }}>
            +{hpAvg} TP {t("wizard.s15.hp_avg_hint","(HD-Average aus {hd})").replace("{hd}", cls?.hd || "d8")}
          </div>
        )}
        {hpMode === "roll" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ ...sx.inp, color: C.tealBright, fontFamily: FH, fontWeight: 700, flex: 1 }}>
              {choice.hpRoll
                ? `+${choice.hpRoll} TP ${t("wizard.s15.hp_roll_hint","(gewürfelt: {n} auf {hd})").replace("{n}", String(choice.hpRoll)).replace("{hd}", cls?.hd || "d8")}`
                : t("wizard.s15.hp_no_roll","Noch nicht gewürfelt.")}
            </div>
            <button type="button" onClick={onRoll} style={sx.bsm(C.amber)}>
              🎲 {t("wizard.s15.hp_reroll","Erneut")}
            </button>
          </div>
        )}
        {hpMode === "manual" && (
          <input type="number" min={1} max={hdSize} value={choice.hpManual ?? hpAvg}
            onChange={(e) => setChoice({ hpManual: Math.max(1, Math.min(hdSize, parseInt(e.target.value) || 1)) })}
            style={{ ...sx.inp, color: C.tealBright, fontFamily: FH, fontWeight: 700 }} />
        )}
      </section>

      {needsSubclass && (
        <section style={{ marginBottom: 18 }}>
          <label style={sx.lbl}>{t("wizard.s15.subclass_lbl","Subclass")}</label>
          <select value={choice.subclass || ""} onChange={(e) => setChoice({ subclass: e.target.value })} style={sx.sel}>
            <option value="">— wählen —</option>
            {subclassOptions.map((sc) => <option key={sc.name} value={sc.name}>{sc.name}</option>)}
          </select>
        </section>
      )}

      {needsASI && (
        <section style={{ marginBottom: 18 }}>
          <label style={sx.lbl}>{t("wizard.s15.asi_lbl","ASI / Feat")}</label>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6, lineHeight: 1.45 }}>
            {t("wizard.s15.asi_phb","PHB 2024: Entweder +2 auf 1 Attribut ODER +1 auf 2 Attribute ODER ein Feat.")}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setChoice({ asi: { mode: "ability_2", picks: {} } })}
              style={{ ...sx.btn(choice.asi?.mode === "ability_2" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_2","+2 auf 1 Attribut")}
            </button>
            <button type="button" onClick={() => setChoice({ asi: { mode: "ability_1_1", picks: {} } })}
              style={{ ...sx.btn(choice.asi?.mode === "ability_1_1" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_11","+1 auf 2 Attribute")}
            </button>
            <button type="button" onClick={() => setChoice({ asi: { mode: "feat" } })}
              style={{ ...sx.btn(choice.asi?.mode === "feat" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_feat","Feat")}
            </button>
          </div>

          {(choice.asi?.mode === "ability_2" || choice.asi?.mode === "ability_1_1") && (
            <AbilityPicker mode={choice.asi.mode} picks={choice.asi.picks || {}}
              onChange={(picks) => setChoice({ asi: { ...choice.asi, picks } })} />
          )}

          {choice.asi?.mode === "feat" && (
            <input value={choice.asi?.feat || ""} onChange={(e) => setChoice({ asi: { ...choice.asi, feat: e.target.value } })}
              placeholder="Feat-Name (z.B. Lucky)"
              style={{ ...sx.inp, color: C.textBright, marginTop: 8 }} />
          )}
        </section>
      )}

      {!needsSubclass && !needsASI && (
        <p style={{ color: C.textDim, fontSize: 12 }}>{t("wizard.s15.no_choice","Auf diesem Level musst du nichts wählen.")}</p>
      )}
    </div>
  );
}

// ─── Ability picker — used in both +2 and +1+1 ASI modes ─────────────────
function AbilityPicker({ mode, picks, onChange }) {
  // Mode "ability_2": exactly one ability gets +2 (radio-like).
  // Mode "ability_1_1": exactly two abilities each get +1, and the two
  //                     must be different.
  const togglePick = (ab) => {
    if (mode === "ability_2") {
      // Single-select +2
      onChange(picks[ab] === 2 ? {} : { [ab]: 2 });
      return;
    }
    // ability_1_1: toggle in/out, cap at 2 distinct abilities
    const next = { ...picks };
    if (next[ab]) {
      delete next[ab];
    } else if (Object.keys(next).length < 2) {
      next[ab] = 1;
    }
    onChange(next);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {ABS.map((ab) => {
        const val = picks[ab] || 0;
        const col = SC[ab] || C.gold;
        return (
          <button type="button" key={ab} onClick={() => togglePick(ab)}
            style={{
              ...sx.card,
              cursor: "pointer",
              textAlign: "center",
              padding: 10,
              borderColor: val > 0 ? col : C.border,
              background: val > 0 ? `${col}22` : "transparent",
            }}>
            <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 13, color: col }}>{ab}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: val > 0 ? col : C.textDim, marginTop: 2 }}>
              {val > 0 ? `+${val}` : "—"}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function asiPicksValid(choice) {
  if (!choice?.asi) return false;
  if (choice.asi.mode === "ability_2") {
    const vals = Object.values(choice.asi.picks || {});
    return vals.length === 1 && vals[0] === 2;
  }
  if (choice.asi.mode === "ability_1_1") {
    const vals = Object.values(choice.asi.picks || {});
    return vals.length === 2 && vals.every((v) => v === 1);
  }
  if (choice.asi.mode === "feat") return !!choice.asi.feat?.trim();
  return false;
}

export const validate = (s) => {
  const lv = s.levelupCurrent;
  const choice = s.levelupChoices[lv] || {};
  const needsSubclass = lv === 3;
  const needsASI = asiAtLevel(s.klass, lv);
  // HP roll mode requires an actual roll
  if (choice.hpMode === "roll" && !choice.hpRoll) {
    return { ok: false, errorKey: "wizard.err_no_choice" };
  }
  if (needsSubclass && !choice.subclass) return { ok: false, errorKey: "wizard.err_no_choice" };
  if (needsASI && !asiPicksValid(choice)) return { ok: false, errorKey: "wizard.err_no_choice" };
  return { ok: true };
};
