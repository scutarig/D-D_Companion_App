import { useState, useEffect, useRef, useMemo } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { exportLogAsText, exportLogAsJSON, searchLog, filterLogByType } from "../../utils/log.js";
import { addLog } from "../../utils/log.js";
import { useI18n } from "../../i18n/index.js";

const LOG_COLORS = {
  join: C.textDim, round: "#555", turn: "#777",
  action: C.blue, dmg: C.red, heal: C.green,
  condition: C.amber, death: "#c02040", victory: C.gold, generic: C.textDim,
};

const LOG_ICONS = {
  join: "➕", round: "🔄", turn: "▶", action: "⚔️", dmg: "💥",
  heal: "💚", condition: "⚡", death: "☠️", victory: "🎉", generic: "📝",
};

export default function CombatLogPanel() {
  const { t } = useI18n();
  const FILTERS = [
    { id: "all",       label: t("combat.log_filter_all","Alle"),         icon: "📋", color: C.textDim },
    { id: "action",    label: t("combat.log_filter_actions","Aktionen"), icon: "⚔️",  color: C.blue    },
    { id: "dmg",       label: t("combat.log_filter_dmg","Schaden"),      icon: "💥",  color: C.red     },
    { id: "heal",      label: t("combat.log_filter_heal","Heilung"),     icon: "💚",  color: C.green   },
    { id: "condition", label: t("combat.log_filter_condition","Status"), icon: "⚡",  color: C.amber   },
    { id: "death",     label: t("combat.log_filter_death","Tod"),        icon: "☠️",  color: "#a61e4d" },
  ];
  const { state, setState } = useCombat();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [note, setNote] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportFeedback, setExportFeedback] = useState("");
  const logEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll when new entries arrive
  useEffect(() => {
    if (autoScroll) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [state.log.length, autoScroll]);

  // Filter + search
  const displayLog = useMemo(() => {
    let entries = typeFilter === "all"
      ? state.log
      : filterLogByType(state.log, [typeFilter, ...(typeFilter === "action" ? ["turn", "join", "generic"] : [])]);
    return searchLog(entries, search);
  }, [state.log, typeFilter, search]);

  // Group into rounds with separators
  const logWithSeparators = useMemo(() => {
    const result = [];
    let lastRound = null;
    // displayLog is newest-first; iterate reversed to build round groups correctly
    const reversed = [...displayLog].reverse();
    reversed.forEach((entry) => {
      if (entry.round !== lastRound && entry.type === "round") {
        lastRound = entry.round;
      }
    });

    // Just render with inline round badges inline
    return displayLog;
  }, [displayLog]);

  // Add manual note
  const handleAddNote = () => {
    if (!note.trim()) return;
    setState((prev) => addLog(prev, "generic", `📝 ${note.trim()}`));
    setNote("");
  };

  // Export functions
  const handleExport = (format) => {
    setShowExportMenu(false);
    try {
      if (format === "copy") {
        const text = exportLogAsText(state.log, state.fighters);
        navigator.clipboard.writeText(text).then(() => {
          setExportFeedback(t("combat.log_export_copied","✓ Kopiert!"));
          setTimeout(() => setExportFeedback(""), 2000);
        });
      } else if (format === "txt") {
        const text = exportLogAsText(state.log, state.fighters);
        const blob = new Blob([text], { type: "text/plain" });
        downloadBlob(blob, `combat-log-${Date.now()}.txt`);
        setExportFeedback(t("combat.log_export_txt_saved","✓ TXT gespeichert"));
        setTimeout(() => setExportFeedback(""), 2000);
      } else if (format === "json") {
        const json = exportLogAsJSON(state);
        const blob = new Blob([json], { type: "application/json" });
        downloadBlob(blob, `combat-log-${Date.now()}.json`);
        setExportFeedback(t("combat.log_export_json_saved","✓ JSON gespeichert"));
        setTimeout(() => setExportFeedback(""), 2000);
      }
    } catch (e) {
      setExportFeedback(t("combat.log_export_err","✗ Fehler"));
      setTimeout(() => setExportFeedback(""), 2000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, height: "100%", minHeight: 0 }}>

      {/* ── Search + Export ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <input
          type="text"
          placeholder={t("combat.log_search_placeholder","🔍 Log durchsuchen...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...sx.inp, flex: 1, fontSize: 11 }}
        />
        <div style={{ position: "relative" }}>
          <button type="button"
            onClick={() => setShowExportMenu((v) => !v)}
            title={t("combat.log_export_title","Log exportieren")}
            style={{
              ...sx.bsm(C.teal), padding: "7px 10px", fontSize: 12,
              background: showExportMenu ? `${C.teal}22` : "transparent",
            }}
          >
            {exportFeedback || "📤"}
          </button>
          {showExportMenu && (
            <div style={{
              position: "absolute", right: 0, top: "100%", zIndex: 200, marginTop: 4,
              background: "#1e1b22", border: `1px solid ${C.border}`, borderRadius: 8,
              padding: 4, minWidth: 140, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
              {[
                { f: "copy", icon: "📋", label: t("combat.log_export_copy","Clipboard kopieren") },
                { f: "txt",  icon: "📄", label: t("combat.log_export_txt","Als TXT speichern")  },
                { f: "json", icon: "📦", label: t("combat.log_export_json","Als JSON speichern")  },
              ].map(({ f, icon, label }) => (
                <button type="button"
                  key={f}
                  onClick={() => handleExport(f)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                    background: "transparent", border: "none", color: C.text, fontSize: 12,
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = `${C.teal}18`}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button"
          onClick={() => setAutoScroll((v) => !v)}
          title={autoScroll ? t("combat.log_autoscroll_on","Auto-Scroll aktiv") : t("combat.log_autoscroll_off","Auto-Scroll aus")}
          style={{
            ...sx.bsm(autoScroll ? C.green : C.border),
            padding: "7px 9px", fontSize: 12,
            background: autoScroll ? `${C.green}18` : "transparent",
          }}
        >
          {autoScroll ? "🔒" : "🔓"}
        </button>
      </div>

      {/* ── Type filter chips ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flexShrink: 0 }}>
        {FILTERS.map((f) => (
          <button type="button"
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            style={{
              padding: "3px 9px", borderRadius: 20, cursor: "pointer", fontSize: 10, transition: "all .1s",
              background: typeFilter === f.id ? `${f.color}28` : "transparent",
              border: `1px solid ${typeFilter === f.id ? f.color : C.border}`,
              color: typeFilter === f.id ? f.color : C.textDim,
              fontWeight: typeFilter === f.id ? 700 : 400,
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* ── Log entries ───────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column-reverse", gap: 1, minHeight: 0 }}
      >
        <div ref={logEndRef} />
        {logWithSeparators.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: "20px 0" }}>
            {search ? t("combat.log_empty_search","Keine Treffer") : t("combat.log_empty","Log leer — Kampf beginnen")}
          </div>
        ) : (
          logWithSeparators.map((entry) => {
            const color = LOG_COLORS[entry.type] || C.textDim;
            const isRound = entry.type === "round";
            const isTurn = entry.type === "turn";

            if (isRound) {
              return (
                <div key={entry.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 4px", color: "#555", fontSize: 10,
                  fontFamily: FH, letterSpacing: 1,
                }}>
                  <div style={{ flex: 1, height: 1, background: "#333" }} />
                  <span style={{ color: C.purple + "aa", fontWeight: 700 }}>
                    🔄 {entry.text}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#333" }} />
                </div>
              );
            }

            if (isTurn) {
              return (
                <div key={entry.id} style={{
                  padding: "4px 8px", fontSize: 10, color: "#666",
                  fontFamily: FH, letterSpacing: 0.5,
                }}>
                  ▶ {entry.text}
                </div>
              );
            }

            return (
              <div
                key={entry.id}
                style={{
                  padding: "5px 8px",
                  borderRadius: 4,
                  borderLeft: `2px solid ${color}50`,
                  background: `${color}06`,
                  fontSize: 11,
                  color,
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 10, color: "#555", flexShrink: 0, paddingTop: 1 }}>
                  {entry.timestamp}
                </span>
                <span style={{ fontSize: 10, flexShrink: 0, paddingTop: 1 }}>
                  {LOG_ICONS[entry.type] || "📝"}
                </span>
                <span style={{ fontSize: 11, lineHeight: 1.4, flex: 1, wordBreak: "break-word" }}>
                  {entry.text}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ── Manual note input ─────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
          placeholder={t("combat.log_note_placeholder","📝 Notiz hinzufügen...")}
          style={{ ...sx.inp, flex: 1, fontSize: 11 }}
        />
        <button type="button"
          onClick={handleAddNote}
          disabled={!note.trim()}
          style={{
            ...sx.bsm(C.teal), padding: "7px 10px", fontSize: 13,
            opacity: note.trim() ? 1 : 0.4,
          }}
        >
          ＋
        </button>
      </div>

      {/* ── Footer stats ──────────────────────────────────────────────── */}
      <div style={{
        fontSize: 10, color: C.textDim, display: "flex", justifyContent: "space-between",
        paddingTop: 6, borderTop: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <span>{state.log.length} {t("combat.log_entries","Einträge")}</span>
        {search && <span style={{ color: C.amber }}>{displayLog.length} {t("combat.log_matches","Treffer")}</span>}
        <span>{t("combat.round","Runde")} {state.round}</span>
      </div>
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
