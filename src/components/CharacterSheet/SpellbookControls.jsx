import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * SpellbookControls — search input, level/ritual/concentration filters and
 * the prepared/known counter that live above the spell list on the
 * Übersicht tab. Purely presentational; the parent owns the filter state
 * and the underlying prepared / known / max arrays so this component can
 * be reused in the Charakter → Spellbook view later if needed.
 */
export default function SpellbookControls({
  search, setSearch,
  levelFilter, setLevelFilter,
  ritualOnly, setRitualOnly,
  concOnly, setConcOnly,
  prepared, maxPrepared, known,
}) {
  const { t } = useI18n();

  const chip = (active, color) => ({
    padding: "3px 9px",
    borderRadius: 12,
    border: `1px solid ${active ? color + "aa" : C.border}`,
    background: active ? `${color}22` : "transparent",
    color: active ? color : C.textDim,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  });

  const preparedOver = maxPrepared > 0 && prepared > maxPrepared;
  const preparedCol = preparedOver ? C.redBright : prepared > 0 ? C.purpleBright : C.textDim;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("dash.spellbook_search","🔍 Zauber suchen …")}
          style={{ ...sx.inp, flex: 1, minWidth: 140, fontSize: 12, padding: "4px 8px" }}
        />
        {maxPrepared != null && (
          <span style={{ fontSize: 11, color: preparedCol, fontFamily: FH, fontWeight: 700, whiteSpace: "nowrap" }}
            title={t("dash.spellbook_prep_hint","Vorbereitete / Maximal vorbereitet · Bekannte insgesamt")}>
            ✍ {prepared}/{maxPrepared}
            {known != null && <span style={{ color: C.textDim, fontWeight: 400, marginLeft: 4 }}>·📚 {known}</span>}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {[
          { id: "all", label: t("dash.spellbook_all","Alle") },
          { id: "0",   label: t("dash.spellbook_cantrips","Cantrip") },
          ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv) => ({ id: String(lv), label: `Lv${lv}` })),
        ].map((c) => (
          <button key={c.id} type="button" onClick={() => setLevelFilter(c.id)}
            style={chip(levelFilter === c.id, C.purpleBright)}>
            {c.label}
          </button>
        ))}
        <button type="button" onClick={() => setRitualOnly((v) => !v)}
          title={t("dash.spellbook_ritual_hint","Nur Rituale zeigen")}
          style={chip(ritualOnly, C.amberBright)}>
          ℛ {t("dash.spellbook_ritual","Ritual")}
        </button>
        <button type="button" onClick={() => setConcOnly((v) => !v)}
          title={t("dash.spellbook_conc_hint","Nur Konzentrations-Spells zeigen")}
          style={chip(concOnly, C.tealBright)}>
          🔮 {t("dash.spellbook_conc","Konz.")}
        </button>
      </div>
    </div>
  );
}
