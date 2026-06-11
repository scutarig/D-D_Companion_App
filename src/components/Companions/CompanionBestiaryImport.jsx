import { useState, useMemo } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { MONSTERS } from "../../data/monsters.js";
import { useI18n } from "../../i18n/index.js";

const CR_OPTS = ["all", "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

/**
 * CompanionBestiaryImport — search MONSTERS and return companion data
 * Props:
 *   onImport: (companionData) => void   — called with pre-filled data
 *   onCancel: () => void
 */
export default function CompanionBestiaryImport({ onImport, onCancel }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [crFilter, setCrFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const crNum = (cr) => {
    if (cr === "0") return 0;
    if (cr === "1/8") return 0.125;
    if (cr === "1/4") return 0.25;
    if (cr === "1/2") return 0.5;
    return parseFloat(cr) || 0;
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MONSTERS.filter((m) => {
      const matchSearch = !q || m.name.toLowerCase().includes(q) || (m.type || "").toLowerCase().includes(q);
      const matchCr = crFilter === "all"
        ? true
        : crFilter === "10+"
        ? crNum(m.cr) >= 10
        : m.cr === crFilter;
      return matchSearch && matchCr;
    }).slice(0, 40);
  }, [search, crFilter]);

  const handleImport = () => {
    if (!selected) return;
    const m = selected;

    // Map monster type string → companion type key
    const typeMap = {
      Humanoid: "humanoid", Beast: "beast", Construct: "construct",
      Fiend: "fiend", Undead: "undead", Celestial: "celestial",
      Fey: "fey", Dragon: "dragon",
    };
    const type = typeMap[m.type] ?? "other";

    onImport?.({
      name: m.name,
      type,
      hp: m.hp,
      maxHp: m.hp,
      ac: m.ac,
      speed: parseInt(m.speed) || 30,
      stats: {
        STR: m.str ?? 10, DEX: m.dex ?? 10, CON: m.con ?? 10,
        INT: m.int ?? 10, WIS: m.wis ?? 10, CHA: m.cha ?? 10,
      },
      traits: m.traits ?? "",
      actions: m.actions ?? "",
      notes: "",
      monsterRef: m.id,
      cr: m.cr,
      size: m.size,
      senses: m.senses ?? "",
      languages: m.languages ?? "",
    });
  };

  return (
    <div>
      <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, marginBottom: 12 }}>
        {t("comp.import_header","📚 Aus Bestiary importieren")}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
        placeholder={t("comp.import_search_placeholder","🔍 Monster suchen...")}
        style={{ ...sx.inp, fontSize: 13, marginBottom: 8 }}
        autoFocus
      />

      {/* CR Filter */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {CR_OPTS.map((cr) => (
          <button type="button"
            key={cr}
            onClick={() => { setCrFilter(cr); setSelected(null); }}
            style={{
              padding: "3px 8px", borderRadius: 20, fontSize: 9, cursor: "pointer",
              border: `1px solid ${crFilter === cr ? C.amber : C.border}`,
              background: crFilter === cr ? `${C.amber}22` : "transparent",
              color: crFilter === cr ? C.amberBright : C.textDim,
              fontWeight: crFilter === cr ? 700 : 400,
              transition: "all .1s",
            }}
          >
            {cr === "all" ? t("comp.import_all_cr","Alle CR") : `CR ${cr}`}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ maxHeight: 240, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 16, fontSize: 12, color: C.textDim, textAlign: "center" }}>
            {t("comp.import_no_monster","Kein Monster gefunden")}
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(selected?.id === m.id ? null : m)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                borderBottom: `1px solid ${C.border}30`,
                background: selected?.id === m.id ? `${C.amber}18` : "transparent",
                cursor: "pointer", transition: "background .1s",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: selected?.id === m.id ? C.amberBright : C.textBright, fontWeight: selected?.id === m.id ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 10, color: C.textDim }}>
                  {m.type} · {m.size}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: C.amberBright }}>CR {m.cr}</span>
                <span style={{ fontSize: 10, color: C.textDim }}>HP {m.hp}</span>
                <span style={{ fontSize: 10, color: C.textDim }}>AC {m.ac}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected preview */}
      {selected && (
        <div style={{
          background: `${C.amber}0d`, border: `1px solid ${C.amber}30`,
          borderRadius: 8, padding: "10px 12px", marginBottom: 10,
          fontSize: 12, color: C.text,
        }}>
          <div style={{ fontWeight: 700, color: C.amberBright, marginBottom: 4 }}>{selected.name}</div>
          <div style={{ color: C.textDim, fontSize: 11, lineHeight: 1.6 }}>
            HP {selected.hp} · AC {selected.ac} · Speed {selected.speed}<br />
            STR {selected.str} DEX {selected.dex} CON {selected.con} INT {selected.int} WIS {selected.wis} CHA {selected.cha}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button"
          onClick={handleImport}
          disabled={!selected}
          style={{
            ...sx.btn(C.amber), flex: 1, padding: "11px",
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
            color: "#000",
          }}
        >
          {selected ? t("comp.import_btn","✓ {name} importieren").replace("{name}", `"${selected.name}"`) : t("comp.import_select_btn","Monster wählen")}
        </button>
        <button type="button" onClick={onCancel} style={{ ...sx.bsm(C.border), padding: "10px 16px", fontSize: 12, color: C.textDim }}>
          {t("prof.cancel_btn","Abbrechen")}
        </button>
      </div>
    </div>
  );
}
