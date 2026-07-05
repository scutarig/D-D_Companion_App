import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";
import { useMulticlass } from "../hooks/useMulticlass.js";
import { usePersist } from "../hooks/usePersist.js";
import { useI18n } from "../i18n/index.js";
import { applyLongRest as applyLongRestUtil, applyShortRest as applyShortRestUtil, spendHitDie } from "../utils/restHelpers.js";
import CharManagerV2 from "./CharManagerV2.jsx";
import ResumeBanner from "./CharWizard/ResumeBanner.jsx";

/**
 * CharManager — Charakter-Tab.
 *
 * The old header row (char-list buttons, +Neu, delete, Import) was moved out
 * of here:
 *   - Char selection / creation / deletion → CharSwitcher in the sidebar.
 *   - Backup import → Settings modal.
 * What stays is what actually belongs to the tab itself: the rest tracker
 * (Kurze Rast / Lange Rast) and the CharManagerV2 sub-tabs.
 */
export default function CharManager() {
  const { t } = useI18n();
  const { aid, active, setActive } = useChar();
  const [, setUsedSlots] = usePersist(`tokens_used_${aid}`, {});
  const [usedAuto, setUsedAuto] = usePersist(`tokens_auto_used_${aid}`, {});
  const [wizardState, setWizardState] = usePersist("wizard_active_v1", null);
  const [restMode, setRestMode] = useState(null);
  const [shortHpVal, setShortHpVal] = useState(0);
  const [shortResult, setShortResult] = useState(null);
  const [longResult, setLongResult] = useState(null);
  const [hdRollLog, setHdRollLog] = useState([]);
  // Multiclass info needed for rest resource tracking
  const { classes } = useMulticlass(aid, active, setActive);

  // AppRouter reads wizard_active_v1 via its own usePersist instance, which
  // doesn't subscribe to storage events. Reload to make the takeover mount.
  const resumeWizard = () => {
    window.location.reload();
  };
  const discardWizard = () => {
    setWizardState(null);
    localStorage.removeItem("wizard_active_v1");
  };

  const doLongRest = () => {
    const result = applyLongRestUtil(active, classes, usedAuto);
    setActive(result.char);
    setUsedAuto(result.usedAuto);
    setUsedSlots({});  // All spell slots reset
    setLongResult({
      hdRecovered: result.hdRecovered,
      exhaustionRemoved: result.exhaustionRemoved,
      resourcesReset: Object.keys(result.usedAuto).length,
    });
    setRestMode("long_done");
  };

  const doShortRest = () => {
    const result = applyShortRestUtil(active, classes, usedAuto, shortHpVal);
    setActive(result.char);
    setUsedAuto(result.usedAuto);
    setShortResult({
      healed: result.healed,
      resourcesReset: Object.keys(result.usedAuto).length,
    });
    setRestMode("short_done");
  };

  const doRollHitDie = () => {
    const result = spendHitDie(active);
    if (result.error) return;
    setActive(result.char);
    setShortHpVal(prev => prev + result.healed);
    setHdRollLog(prev => [...prev, { roll: result.roll, hdSize: result.hdSize, mod: result.modifier, healed: result.healed }]);
  };

  if (!active) return null;

  return (
    <div>
      {wizardState && (
        <ResumeBanner
          wizardState={wizardState}
          onResume={resumeWizard}
          onDiscard={discardWizard}
        />
      )}
      <div data-no-print style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ ...sx.jb, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: FH, letterSpacing: 1 }}>{t("char.character_label","CHARAKTER")}</span>
            <span style={{ fontFamily: FH, fontSize: 13, color: C.purpleBright, fontWeight: 700 }}>
              {active.name} <span style={{ color: C.textDim, fontSize: 10, fontWeight: 400 }}>Lv.{active.level}</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button type="button" onClick={() => setRestMode(restMode === "short" ? null : "short")} style={{ ...sx.bsm(C.teal), background: restMode === "short" ? `${C.teal}30` : `${C.teal}18`, border: `1px solid ${C.teal}55`, fontWeight: 700 }}>🌙 {t("header.short_rest","Kurze Rast")}</button>
            <button type="button" onClick={() => setRestMode(restMode === "long_confirm" ? null : "long_confirm")} style={{ ...sx.bsm(C.purple), background: restMode === "long_confirm" ? `${C.purple}30` : `${C.purple}18`, border: `1px solid ${C.purple}55`, fontWeight: 700 }}>🌟 {t("header.long_rest","Lange Rast")}</button>
            <span style={{ fontSize: 10, color: C.textDim }}>💾 {t("char.auto_save","Auto-Speichern")}</span>
          </div>
        </div>

        {restMode === "short" && (() => {
          const hdRemaining = (active.level || 1) - (active.hd_used || 0);
          const hdMatch = (active.hd || "d8").match(/[dDwW](\d+)/);
          const hdSize = hdMatch ? parseInt(hdMatch[1]) : 8;
          const conMod = Math.floor(((active.con || 10) - 10) / 2);
          return (
            <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(13,148,136,0.1)", border: `1px solid ${C.teal}40`, borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: C.tealBright, fontFamily: FH, fontWeight: 700, marginBottom: 8 }}>{t("char.short_rest_header","🌙 Kurze Rast — Hit Dice ausgeben (2024 RAW)")}</div>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
                {t("char.hp_label","HP:")} <strong style={{ color: C.textBright }}>{active.hp} / {active.maxHp}</strong>
                {" · "}{t("char.hd_available","HD verfügbar:")} <strong style={{ color: hdRemaining > 0 ? C.tealBright : C.textDim }}>{hdRemaining} × d{hdSize}</strong>
                {" · "}{t("char.con_mod_label","CON-Mod:")} <strong style={{ color: C.amberBright }}>{conMod >= 0 ? `+${conMod}` : conMod}</strong>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <button type="button" onClick={doRollHitDie} disabled={hdRemaining <= 0 || active.hp >= active.maxHp} style={{ ...sx.btn(C.teal), opacity: (hdRemaining <= 0 || active.hp >= active.maxHp) ? 0.4 : 1 }}>
                  {t("char.roll_hd_btn","🎲 1 HD würfeln")} (d{hdSize} + {conMod >= 0 ? `+${conMod}` : conMod})
                </button>
                <span style={{ fontSize: 11, color: C.textDim }}>{t("char.or_manual","oder manuell:")}</span>
                <label style={{ ...sx.lbl, marginBottom: 0 }}>{t("char.hp_label","HP:")}</label>
                <input type="number" min={0} max={active.maxHp} value={shortHpVal} onChange={e => setShortHpVal(Math.max(0, +e.target.value))} style={{ ...sx.inp, width: 70 }} />
              </div>
              {hdRollLog.length > 0 && (
                <div style={{ marginBottom: 8, padding: "6px 10px", background: "rgba(0,0,0,0.25)", borderRadius: 6, fontSize: 11, color: C.text }}>
                  <span style={{ color: C.tealBright, fontWeight: 700 }}>{t("char.rolls_word","🎲 Würfe:")} </span>
                  {hdRollLog.map((l, i) => (
                    <span key={i} style={{ marginRight: 8 }}>
                      [{l.roll}+{l.mod >= 0 ? l.mod : `(${l.mod})`}={l.healed}]
                    </span>
                  ))}
                  <span style={{ color: C.greenBright, marginLeft: 4, fontWeight: 700 }}>= {shortHpVal} HP</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={doShortRest} style={sx.btn(C.tealBright)}>{t("char.complete_short_rest","✓ Kurze Rast abschließen")}</button>
                <button type="button" onClick={() => { setRestMode(null); setShortHpVal(0); setHdRollLog([]); }} style={sx.bsm(C.textDim)}>{t("char.cancel_word","Abbrechen")}</button>
              </div>
            </div>
          );
        })()}

        {restMode === "short_done" && shortResult && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(13,148,136,0.1)", border: `1px solid ${C.teal}40`, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22 }}>🌙</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.tealBright, fontWeight: 700 }}>{t("char.short_rest_done","Kurze Rast abgeschlossen!")}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                <strong style={{ color: C.greenBright }}>+{shortResult.healed} HP</strong> {t("char.hp_restored","wiederhergestellt")}
                {shortResult.resourcesReset > 0 && <> · <strong style={{ color: C.amberBright }}>{shortResult.resourcesReset} {t("char.resources_reset","Klassen-Ressource(n) zurückgesetzt (Action Surge, Bardische Inspiration, Channel Divinity, Focus Points, Pact Slots…)")}</strong></>}
              </div>
            </div>
            <button type="button" onClick={() => { setRestMode(null); setShortHpVal(0); setHdRollLog([]); }} style={sx.bsm(C.textDim)}>✕</button>
          </div>
        )}

        {restMode === "long_confirm" && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,0.1)", border: `1px solid ${C.purple}40`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: C.purpleBright, fontFamily: FH, fontWeight: 700, marginBottom: 6 }}>{t("char.long_rest_confirm_header","🌟 Lange Rast — Bestätigen (2024 PHB)")}</div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.6 }}>
              {t("char.restores_word","Stellt wieder her:")}
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                <li><strong style={{ color: C.greenBright }}>{t("char.lr_hp_max","HP → Max")}</strong> ({active.maxHp})</li>
                <li><strong style={{ color: C.blueBright }}>{t("char.lr_all_slots","Alle Spell Slots")}</strong></li>
                <li><strong style={{ color: C.amberBright }}>{Math.max(1, Math.floor((active.level || 1) / 2))} {t("char.lr_hd_restored","Hit Dice wiederhergestellt")}</strong></li>
                <li><strong style={{ color: C.tealBright }}>{t("char.lr_temp_hp","Temp HP → 0, Death Saves reset")}</strong></li>
                <li><strong style={{ color: C.redBright }}>{t("char.lr_exhaustion","Exhaustion -1 Level (2024 RAW)")}</strong></li>
                <li><strong style={{ color: C.purpleBright }}>{t("char.lr_resources","Alle Klassen-Ressourcen (Rage, Action Surge, Bardische Inspiration, Focus Points, Pact Slots, etc.)")}</strong></li>
              </ul>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={doLongRest} style={sx.btn(C.purple)}>{t("char.do_long_rest","🌟 Lange Rast durchführen")}</button>
              <button type="button" onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>{t("char.cancel_word","Abbrechen")}</button>
            </div>
          </div>
        )}

        {restMode === "long_done" && longResult && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,0.1)", border: `1px solid ${C.purple}40`, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22 }}>🌟</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.purpleBright, fontWeight: 700 }}>{t("char.long_rest_done","Lange Rast abgeschlossen!")}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                {t("char.lr_summary_hp","HP voll · Spell Slots zurück")} · <strong style={{ color: C.amberBright }}>+{longResult.hdRecovered} HD</strong>
                {longResult.exhaustionRemoved > 0 && <> · <strong style={{ color: C.redBright }}>{t("char.exhaustion_word","Exhaustion")} -{longResult.exhaustionRemoved}</strong></>}
                {longResult.resourcesReset > 0 && <> · <strong style={{ color: C.purpleBright }}>{longResult.resourcesReset} {t("char.resources_word","Ressourcen")}</strong> {t("char.reset_word","reset")}</>}
              </div>
            </div>
            <button type="button" onClick={() => setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
          </div>
        )}
      </div>

      <CharManagerV2 />
    </div>
  );
}
