import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { useCombatActions } from "../../hooks/useCombatActions.js";
import { useI18n } from "../../i18n/index.js";
import { useDialog } from "../../hooks/useDialog.jsx";

export default function PresetManager({ onClose }) {
  const { t } = useI18n();
  const { alert } = useDialog();
  const { state } = useCombat();
  const { savePreset, loadPreset, deletePreset } = useCombatActions();
  const [newPresetName, setNewPresetName] = useState("");
  const [expandedPreset, setExpandedPreset] = useState(null);

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      alert(t("combat.err_preset_name","Preset-Name erforderlich!"));
      return;
    }
    savePreset(newPresetName);
    setNewPresetName("");
  };

  const handleLoadPreset = (presetId) => {
    loadPreset(presetId);
    onClose?.();
  };

  const handleDeletePreset = (presetId) => {
    if (confirm(t("combat.confirm_delete_preset","Preset löschen?"))) {
      deletePreset(presetId);
    }
  };

  return (
    <div style={{ background: C.surface, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 12 }}>
      {/* Save Current Setup as Preset */}
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...sx.ct, marginBottom: 8 }}>{t("combat.preset_save_current","💾 Aktuellen Kampf speichern")}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder={t("combat.placeholder_goblin_ambush","z.B. Goblin Ambush")}
            style={{ ...sx.inp, flex: 1 }}
            onKeyPress={(e) => e.key === "Enter" && handleSavePreset()}
          />
          <button type="button" onClick={handleSavePreset} style={sx.btn(C.green)}>
            {t("combat.preset_save_btn","💾 Save")}
          </button>
        </div>
      </div>

      {/* Load Presets */}
      <div>
        <div style={sx.ct}>{state.presets.length} {t("combat.presets_word","Presets")}</div>
        {state.presets.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>{t("combat.no_presets","Noch keine Presets gespeichert")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {state.presets.map((preset) => (
              <div key={preset.id} style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 6, overflow: "hidden" }}>
                {/* Preset Header */}
                <div
                  onClick={() => setExpandedPreset(expandedPreset === preset.id ? null : preset.id)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.purpleBright, fontWeight: 700 }}>{preset.name}</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>{preset.fighters.length} {t("combat.fighters_word","Kämpfer")}</div>
                  </div>
                  <div style={{ fontSize: 14 }}>{expandedPreset === preset.id ? "▼" : "▶"}</div>
                </div>

                {/* Expanded Content */}
                {expandedPreset === preset.id && (
                  <div style={{ borderTop: `1px solid ${C.purple}25`, padding: "10px 12px", background: `${C.purple}04` }}>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>
                      {preset.fighters.map((f, i) => (
                        <div key={i}>
                          {i + 1}. {f.name} (HP {f.hp}, AC {f.ac})
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button"
                        onClick={() => handleLoadPreset(preset.id)}
                        style={{ ...sx.btn(C.blue), flex: 1, fontSize: 11, padding: "6px 10px" }}
                      >
                        {t("combat.preset_load","📂 Load")}
                      </button>
                      <button type="button"
                        onClick={() => handleDeletePreset(preset.id)}
                        style={{ ...sx.btn(C.red), fontSize: 11, padding: "6px 10px" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button type="button"
        onClick={onClose}
        style={{ ...sx.bsm(C.textDim), width: "100%", marginTop: 12 }}
      >
        {t("combat.close_btn","✕ Schließen")}
      </button>
    </div>
  );
}
