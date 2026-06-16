import { C, sx, FH } from "../../../constants/theme.js";
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
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setChoice({ asi: { mode: "asi" } })}
              style={{ ...sx.btn(choice.asi?.mode === "asi" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_asi","+2 / +1")}
            </button>
            <button type="button" onClick={() => setChoice({ asi: { mode: "feat" } })}
              style={{ ...sx.btn(choice.asi?.mode === "feat" ? C.gold : C.textDim) }}>
              {t("wizard.s15.asi_mode_feat","Feat")}
            </button>
          </div>
          {choice.asi?.mode === "feat" && (
            <input value={choice.asi?.feat || ""} onChange={(e) => setChoice({ asi: { ...choice.asi, feat: e.target.value } })}
              placeholder="Feat-Name (z.B. Lucky)" style={{ ...sx.inp, color: C.textBright, marginTop: 8 }} />
          )}
        </section>
      )}

      {!needsSubclass && !needsASI && (
        <p style={{ color: C.textDim, fontSize: 12 }}>{t("wizard.s15.no_choice","Auf diesem Level musst du nichts wählen.")}</p>
      )}
    </div>
  );
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
  if (needsASI) {
    if (!choice.asi?.mode) return { ok: false, errorKey: "wizard.err_no_choice" };
    if (choice.asi.mode === "feat" && !choice.asi.feat?.trim()) return { ok: false, errorKey: "wizard.err_no_choice" };
  }
  return { ok: true };
};
