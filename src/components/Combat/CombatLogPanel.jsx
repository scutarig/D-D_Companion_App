import { useState, useEffect, useRef } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useCombat } from "../../context/CombatContext.jsx";
import { formatLogEntry, searchLog } from "../../utils/log.js";

const getLogIcon = (type) => {
  const icons = {
    join: "➕",
    round: "🔄",
    turn: "👣",
    action: "⚔️",
    dmg: "💥",
    heal: "💚",
    condition: "⚡",
    death: "☠️",
    victory: "🎉",
    generic: "📝",
  };
  return icons[type] || "📝";
};

const getLogColor = (type) => {
  const colors = {
    join: C.textDim,
    round: C.textDim,
    turn: C.textDim,
    action: C.blue,
    dmg: C.red,
    heal: C.green,
    condition: C.amber,
    death: C.red,
    victory: C.green,
    generic: C.textDim,
  };
  return colors[type] || C.textDim;
};

export default function CombatLogPanel() {
  const { state } = useCombat();
  const [search, setSearch] = useState("");
  const logEndRef = useRef(null);

  const filteredLog = searchLog(state.log, search);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [state.log]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0 }}>
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="🔍 Search log..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...sx.inp, width: "100%", fontSize: 12 }}
        />
      </div>

      {/* Log entries */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          gap: 2,
          minHeight: 0,
        }}
      >
        {filteredLog.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: "20px 0" }}>
            {search ? "No matches" : "Combat log empty"}
          </div>
        ) : (
          filteredLog.map((entry, idx) => (
            <div
              key={entry.id}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                background: idx % 2 === 0 ? "transparent" : `${C.surface}40`,
                fontSize: 11,
                color: getLogColor(entry.type),
                display: "flex",
                gap: 6,
                alignItems: "flex-start",
                fontFamily: FH,
              }}
            >
              <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>
                [{entry.timestamp}]
              </span>
              <span style={{ fontSize: 11, flexShrink: 0 }}>{getLogIcon(entry.type)}</span>
              <span style={{ fontSize: 11, lineHeight: 1.4, flex: 1 }}>R{entry.round} {entry.text}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>

      {/* Footer */}
      <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
        {state.log.length} event{state.log.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
