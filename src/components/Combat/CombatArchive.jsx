import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombatArchive } from "../../hooks/useCombatArchive.js";
import { exportLogAsText } from "../../utils/log.js";
import { useI18n } from "../../i18n/index.js";
import { fmtDateTime } from "../../utils/locale.js";

/**
 * CombatArchive — view + manage saved combat histories
 * Props:
 *   onClose: () => void
 */
export default function CombatArchive({ onClose }) {
  const { t } = useI18n();
  const OUTCOME_CONFIG = {
    victory: { icon: "🎉", color: C.gold,     label: t("combat.outcome_victory","Sieg")    },
    defeat:  { icon: "☠️", color: C.red,      label: t("combat.outcome_defeat","Niederlage") },
    ended:   { icon: "⊗",  color: C.textDim,  label: t("combat.outcome_ended","Beendet") },
  };
  const { archives, deleteArchive, clearArchives } = useCombatArchive();
  const [expandedId, setExpandedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExportArchive = (archive) => {
    const text = exportLogAsText(archive.log, archive.fighters);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kampf-${archive.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FH, fontSize: 16, color: C.gold, fontWeight: 700 }}>
            {t("combat.archive_title","🗂️ Kampf-Archiv")}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {archives.length > 0 && (
              confirmClear ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button"
                    onClick={() => { clearArchives(); setConfirmClear(false); }}
                    style={{ ...sx.bsm(C.red), padding: "4px 10px", fontSize: 11 }}
                  >
                    {t("combat.archive_yes_delete","Ja, alles löschen")}
                  </button>
                  <button type="button"
                    onClick={() => setConfirmClear(false)}
                    style={{ ...sx.bsm(C.border), padding: "4px 10px", fontSize: 11 }}
                  >
                    {t("combat.archive_cancel","Abbrechen")}
                  </button>
                </div>
              ) : (
                <button type="button"
                  onClick={() => setConfirmClear(true)}
                  style={{ ...sx.bsm(C.red), padding: "4px 10px", fontSize: 11 }}
                >
                  {t("combat.archive_delete_all_btn","🗑️ Alle löschen")}
                </button>
              )
            )}
            <button type="button" onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }} aria-label="Schließen">✕</button>
          </div>
        </div>

        {/* Empty state */}
        {archives.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: C.textDim }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗂️</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>{t("combat.archive_empty","Noch keine archivierten Kämpfe")}</div>
            <div style={{ fontSize: 12 }}>{t("combat.archive_empty_hint","Kämpfe werden nach Victory/Defeat gespeichert")}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {archives.map((archive) => {
              const cfg = OUTCOME_CONFIG[archive.outcome] ?? OUTCOME_CONFIG.ended;
              const isExpanded = expandedId === archive.id;
              const date = fmtDateTime(archive.timestamp);

              return (
                <div
                  key={archive.id}
                  style={{
                    background: C.surface,
                    border: `1px solid ${isExpanded ? cfg.color + "55" : C.border}`,
                    borderRadius: 10,
                    overflow: "hidden",
                    transition: "border-color .15s",
                  }}
                >
                  {/* Archive card header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : archive.id)}
                    style={{
                      padding: "10px 14px", cursor: "pointer",
                      background: isExpanded ? `${cfg.color}08` : "transparent",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{cfg.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, color: C.textBright, fontWeight: 600,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {archive.name}
                      </div>
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                        {date} · {archive.rounds} {t("combat.archive_rounds","Runden")}
                      </div>
                    </div>
                    {/* Stats badges */}
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <span style={{ ...badgeStyle(C.blue) }}>👤 {archive.playerCount}</span>
                      <span style={{ ...badgeStyle(C.red)  }}>💀 {archive.enemyCount}</span>
                      <span style={{
                        ...badgeStyle(cfg.color),
                        fontWeight: 700,
                      }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: C.textDim, flexShrink: 0 }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 14px" }}>
                      {/* Fighter summary */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>
                          {t("combat.archive_fighters_label","KÄMPFER")}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {archive.fighters.map((f) => (
                            <div key={f.id} style={{
                              display: "flex", alignItems: "center", gap: 5,
                              padding: "4px 10px", borderRadius: 20,
                              background: f.survived ? `${C.green}10` : `${C.red}10`,
                              border: `1px solid ${f.survived ? C.green + "40" : C.red + "40"}`,
                              fontSize: 11,
                            }}>
                              <span>{f.isPlayer ? "👤" : "💀"}</span>
                              <span style={{ color: f.survived ? C.greenBright : C.redBright, fontWeight: 600 }}>
                                {f.name}
                              </span>
                              <span style={{ color: C.textDim }}>
                                {f.finalHp}/{f.maxHp} HP
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Log preview (last 5 entries) */}
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>
                          LOG ({archive.log.length} {t("combat.log_entries","Einträge")})
                        </div>
                        <div style={{
                          background: "#161420", border: `1px solid ${C.border}`, borderRadius: 6,
                          padding: "8px 10px", maxHeight: 120, overflowY: "auto",
                        }}>
                          {archive.log.slice(0, 8).map((entry) => (
                            <div key={entry.id} style={{ fontSize: 10, color: C.textDim, lineHeight: 1.6, fontFamily: FH }}>
                              [{entry.timestamp}] R{entry.round} {entry.text}
                            </div>
                          ))}
                          {archive.log.length > 8 && (
                            <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", marginTop: 4 }}>
                              + {archive.log.length - 8} {t("combat.archive_log_more","weitere Einträge...")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button"
                          onClick={() => handleExportArchive(archive)}
                          style={{ ...sx.bsm(C.teal), flex: 1, padding: "8px", fontSize: 12 }}
                        >
                          {t("combat.archive_export_txt","📄 Als TXT exportieren")}
                        </button>
                        <button type="button"
                          onClick={() => deleteArchive(archive.id)}
                          style={{ ...sx.bsm(C.red), padding: "8px 12px", fontSize: 12 }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const badgeStyle = (color) => ({
  fontSize: 10, padding: "2px 7px", borderRadius: 12,
  background: `${color}15`, border: `1px solid ${color}40`,
  color, fontWeight: 600,
});

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 16,
};
const panelStyle = {
  background: "#1a1720", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 560,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto",
};
