import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { breakConcentration, getConcentrationDC } from "../utils/concentration.js";
import { modOf, getPB } from "../utils/helpers.js";
import { rollD } from "../utils/helpers.js";
import { useI18n } from "../i18n/index.js";

const SCHOOL_COLOR = {
  Evocation: "#ff6644", Conjuration: "#40a0ff", Abjuration: "#44c4a1",
  Transmutation: "#c9a84c", Enchantment: "#d070e0", Illusion: "#70b0d0",
  Necromancy: "#a040c0", Divination: "#60c060",
};

export default function ConcentrationBanner({ char, setChar }) {
  const { t } = useI18n();
  const conc = char?.concentration;
  const [dmgInput, setDmgInput]  = useState("");
  const [saveResult, setSaveResult] = useState(null); // { roll, total, dc, success }
  const [showSave, setShowSave]  = useState(false);

  if (!conc) return null;

  const schoolColor = SCHOOL_COLOR[conc.school] || C.purpleBright;
  const pb    = getPB(char.level ?? 1);
  const conMod = modOf(char.con ?? 10);

  const doBreak = () => {
    if (!setChar) return;
    setChar(p => breakConcentration(p));
    setSaveResult(null);
    setShowSave(false);
    setDmgInput("");
  };

  const rollSave = () => {
    const dmg = parseInt(dmgInput) || 0;
    const dc  = getConcentrationDC(dmg);
    const nat = rollD(20);
    // War Caster feat → advantage (check via char.feats)
    const hasWarCaster = (char.feats || []).some(f =>
      typeof f === "string" ? f === "war_caster" : f?.id === "war_caster"
    );
    let roll = nat;
    if (hasWarCaster) {
      const nat2 = rollD(20);
      roll = Math.max(nat, nat2);
    }
    const total   = roll + conMod + (char.saves?.CON ? pb : 0);
    const success = total >= dc;
    setSaveResult({ roll, total, dc, success, hasWarCaster, dmg });
    if (!success) doBreak();
  };

  return (
    <div style={{
      ...sx.card,
      border: `1px solid ${schoolColor}66`,
      background: `linear-gradient(135deg, ${schoolColor}0a, transparent)`,
      marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔮</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 13, color: schoolColor, fontWeight: 700 }}>
              {t("concentration.active","KONZENTRATION AKTIV")}
            </div>
            <div style={{ fontSize: 12, color: C.textBright, marginTop: 2 }}>
              {conc.spellName}
              {conc.slotLv > conc.lv && (
                <span style={{ color: C.amberBright, marginLeft: 6, fontSize: 10 }}>↑ Lv{conc.slotLv}</span>
              )}
              <span style={{ color: C.textDim, marginLeft: 8, fontSize: 10 }}>{conc.dur}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setShowSave(p => !p); setSaveResult(null); }}
            style={{ ...sx.bsm(C.amberBright), fontSize: 11 }}>
            🎲 CON Save
          </button>
          <button onClick={doBreak} style={{ ...sx.bsm(C.red), fontSize: 11 }}>
            ✕ {t("concentration.end","Beenden")}
          </button>
        </div>
      </div>

      {/* CON Save Panel */}
      {showSave && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>
            {t("concentration.dc_formula","DC = max(10, Schaden ÷ 2)")} · CON Mod: {conMod >= 0 ? `+${conMod}` : conMod}{char.saves?.CON ? ` · +${pb} PB` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ ...sx.lbl, margin: 0 }}>{t("concentration.damage_taken","Schaden erlitten:")}</label>
              <input type="number" min={0} value={dmgInput}
                onChange={e => { setDmgInput(e.target.value); setSaveResult(null); }}
                placeholder="0"
                style={{ ...sx.inp, width: 70, textAlign: "center" }}
                onKeyDown={e => e.key === "Enter" && rollSave()}
              />
            </div>
            {dmgInput !== "" && (
              <div style={{ fontSize: 11, color: C.amberBright, fontWeight: 700 }}>
                DC {getConcentrationDC(parseInt(dmgInput) || 0)}
              </div>
            )}
            <button onClick={rollSave} style={sx.btn(C.amberBright)}>
              🎲 {t("concentration.roll","Würfeln")}
            </button>
          </div>

          {/* Result */}
          {saveResult && (
            <div style={{
              marginTop: 8, padding: "8px 12px", borderRadius: 7,
              background: saveResult.success ? `${C.greenBright}18` : `${C.redBright}18`,
              border: `1px solid ${saveResult.success ? C.greenBright : C.redBright}55`,
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 18 }}>{saveResult.success ? "✅" : "💔"}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: saveResult.success ? C.greenBright : C.redBright, fontFamily: FH }}>
                  {saveResult.success ? t("concentration.held","Save gehalten!") : t("concentration.broken","Konzentration gebrochen!")}
                </div>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  {t("concentration.dice","Würfel")}: {saveResult.roll} + {conMod >= 0 ? conMod : `(${conMod})`}{char.saves?.CON ? ` + ${pb}` : ""} = <strong style={{ color: C.textBright }}>{saveResult.total}</strong> vs DC {saveResult.dc}
                  {saveResult.hasWarCaster && ` (${t("concentration.war_caster_adv","War Caster: Vorteil")})`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
