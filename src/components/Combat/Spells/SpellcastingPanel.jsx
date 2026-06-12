import { useState } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { usePersist } from "../../../hooks/usePersist.js";
import { useCombatActions } from "../../../hooks/useCombatActions.js";
import { useCombat } from "../../../context/CombatContext.jsx";
import { SPELLS } from "../../../data/spells.js";
import { getDamageTypeEmoji, isConcentration, slotColor, getAvailableSlotLevels, slotLabel } from "../../../utils/spells.js";
import { useI18n } from "../../../i18n/index.js";
import SpellSlotTracker from "./SpellSlotTracker.jsx";
import SpellCastModal from "./SpellCastModal.jsx";

/**
 * SpellcastingPanel — full spellcasting UI for the active fighter
 * Shown as a modal overlay when "🔮 Spell" is clicked
 * Props:
 *   onClose: () => void
 */
export default function SpellcastingPanel({ onClose }) {
  const { state, setState } = useCombat();
  const { shortRest, longRest, dropConcentration } = useCombatActions();

  if (state.activeIndex < 0 || state.activeIndex >= state.fighters.length) return null;
  const fighter = state.fighters[state.activeIndex];

  return (
    <SpellcastingPanelInner
      fighter={fighter}
      onClose={onClose}
      shortRest={shortRest}
      longRest={longRest}
      dropConcentration={dropConcentration}
      setState={setState}
    />
  );
}

// Inner component so hooks can be called at top level safely
function SpellcastingPanelInner({ fighter, onClose, shortRest, longRest, dropConcentration, setState }) {
  const { t } = useI18n();
  // Read prepared spells for linked character
  const charId = fighter.charRef ?? "g";
  const [preparedIds] = usePersist(`spells_prep_${charId}`, []);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [showSearch, setShowSearch] = useState(!fighter.charRef);

  const availableSlotLevels = getAvailableSlotLevels(fighter);

  // Determine spell list
  const baseSpells = fighter.charRef
    ? SPELLS.filter((s) => preparedIds.includes(s.id))
    : [];

  // If search is open, show full SPELLS filtered
  const searchResults = showSearch
    ? SPELLS.filter((s) => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
        const matchLevel = levelFilter === "all" || s.lv === parseInt(levelFilter);
        return matchSearch && matchLevel;
      }).slice(0, 30)
    : baseSpells.filter((s) => {
        const matchLevel = levelFilter === "all" || s.lv === parseInt(levelFilter);
        return matchLevel;
      });

  // Manual use/restore slot
  const handleUseSlot = (lv) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f, i) =>
        i === prev.activeIndex
          ? { ...f, spellSlots: (f.spellSlots ?? []).map((s) => s.lv === lv && s.used < s.total ? { ...s, used: s.used + 1 } : s) }
          : f
      ),
    }));
  };
  const handleRestoreSlot = (lv) => {
    setState((prev) => ({
      ...prev,
      fighters: prev.fighters.map((f, i) =>
        i === prev.activeIndex
          ? { ...f, spellSlots: (f.spellSlots ?? []).map((s) => s.lv === lv && s.used > 0 ? { ...s, used: s.used - 1 } : s) }
          : f
      ),
    }));
  };

  const LEVELS = ["all", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 16, color: C.purpleBright, fontWeight: 700 }}>{t("combat.spellcasting","🔮 Zauberei")}</div>
            <div style={{ fontSize: 12, color: C.textDim }}>{fighter.name}</div>
          </div>
          <button type="button" onClick={onClose} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }} aria-label={t("modal.close","Schließen")}>✕</button>
        </div>

        {/* Concentration display */}
        {fighter.concentration && (() => {
          const concSpell = SPELLS.find((s) => s.id === fighter.concentration);
          return (
            <div style={{ background: `${C.amber}12`, border: `1px solid ${C.amber}35`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: C.amber, fontFamily: FH, letterSpacing: 0.5, marginBottom: 2 }}>{t("combat.concentration_active","KONZENTRATION AKTIV")}</div>
                <div style={{ fontSize: 13, color: C.amberBright, fontWeight: 700 }}>🧠 {concSpell?.name ?? t("combat.unknown_spell","Unbekannter Zauber")}</div>
              </div>
              <button type="button"
                onClick={() => dropConcentration(fighter.id)}
                style={{ ...sx.bsm(C.amber), fontSize: 11, padding: "4px 8px" }}
              >
                {t("combat.cancel_word","Abbrechen")}
              </button>
            </div>
          );
        })()}

        {/* Spell Slots */}
        {(fighter.spellSlots?.length ?? 0) > 0 && (
          <div style={{ ...sx.card, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FH, letterSpacing: 0.5, marginBottom: 8 }}>{t("combat.spell_slots_upper","ZAUBERPLÄTZE")}</div>
            <SpellSlotTracker
              spellSlots={fighter.spellSlots ?? []}
              onUse={handleUseSlot}
              onRestore={handleRestoreSlot}
            />
          </div>
        )}

        {/* Rest buttons */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <button type="button" onClick={() => shortRest(fighter.id)} style={{ ...sx.bsm(C.teal), flex: 1, padding: "7px", fontSize: 11 }}>
            {t("combat.short_rest_btn","🌙 Short Rest")}
          </button>
          <button type="button" onClick={() => longRest(fighter.id)} style={{ ...sx.bsm(C.purple), flex: 1, padding: "7px", fontSize: 11 }}>
            {t("combat.long_rest_btn","☀️ Long Rest")}
          </button>
        </div>

        {/* Toggle search vs prepared */}
        {fighter.charRef && (
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button type="button"
              onClick={() => setShowSearch(false)}
              style={{ ...sx.bsm(!showSearch ? C.purple : C.border), flex: 1, padding: "7px", fontSize: 11, background: !showSearch ? `${C.purple}22` : "transparent" }}
            >
              {t("combat.prepared_label","🕯 Vorbereitet")} ({preparedIds.length})
            </button>
            <button type="button"
              onClick={() => setShowSearch(true)}
              style={{ ...sx.bsm(showSearch ? C.blue : C.border), flex: 1, padding: "7px", fontSize: 11, background: showSearch ? `${C.blue}22` : "transparent" }}
            >
              {t("combat.all_spells_btn","📚 Alle Zauber")}
            </button>
          </div>
        )}

        {/* Search + level filter */}
        {showSearch && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("combat.search_spell","🔍 Zauber suchen...")}
            style={{ ...sx.inp, fontSize: 13, marginBottom: 8 }}
            autoFocus={!!showSearch}
          />
        )}

        {/* Level filter pills */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {LEVELS.map((l) => (
            <button type="button"
              key={l}
              onClick={() => setLevelFilter(l)}
              style={{
                padding: "3px 9px", borderRadius: 20, cursor: "pointer", fontSize: 10, transition: "all .1s",
                background: levelFilter === l ? (l === "all" ? C.purple + "44" : slotColor(+l) + "44") : "transparent",
                border: `1px solid ${levelFilter === l ? (l === "all" ? C.purple : slotColor(+l)) : C.border}`,
                color: levelFilter === l ? (l === "all" ? C.purpleBright : slotColor(+l)) : C.textDim,
                fontWeight: levelFilter === l ? 700 : 400,
              }}
            >
              {l === "all" ? "All" : l === "0" ? "C" : l}
            </button>
          ))}
        </div>

        {/* Spell list */}
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: C.textDim }}>
              {fighter.charRef && !showSearch
                ? t("combat.no_prepared_spells","Keine vorbereiteten Zauber. Tab auf 'Alle Zauber' wechseln.")
                : t("combat.no_spells_found","Keine Zauber gefunden.")}
            </div>
          ) : (
            searchResults.map((spell) => {
              const canCast = spell.lv === 0 || availableSlotLevels.some((lv) => lv >= spell.lv);
              const needsConc = isConcentration(spell);
              const isDmg = spell.dmg && spell.dmg !== "—";
              return (
                <div
                  key={spell.id}
                  onClick={() => setSelectedSpell(spell)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                    borderRadius: 8, marginBottom: 4, cursor: "pointer",
                    background: C.surface,
                    border: `1px solid ${canCast ? C.border : C.border + "55"}`,
                    opacity: canCast ? 1 : 0.55,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => canCast && (e.currentTarget.style.background = `${C.purple}12`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}
                >
                  {/* Level circle */}
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: slotColor(spell.lv) + "22",
                    border: `1px solid ${slotColor(spell.lv)}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: slotColor(spell.lv), fontFamily: FH, fontWeight: 700,
                  }}>
                    {spell.lv === 0 ? "C" : spell.lv}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: C.textBright, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {spell.name}
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim }}>
                      {spell.school} · {spell.ct}
                      {needsConc && " · 🧠"}
                    </div>
                  </div>

                  {isDmg && (
                    <span style={{ fontSize: 11, color: spell.dt === "healing" ? C.greenBright : C.redBright, flexShrink: 0 }}>
                      {getDamageTypeEmoji(spell.dt)} {spell.dmg}
                    </span>
                  )}

                  <span style={{ fontSize: 16, color: canCast ? C.purpleBright : C.textDim, flexShrink: 0 }}>▶</span>
                </div>
              );
            })
          )}
        </div>

        {/* Spell Cast Modal */}
        {selectedSpell && (
          <SpellCastModal
            spell={selectedSpell}
            fighter={fighter}
            onClose={() => { setSelectedSpell(null); onClose?.(); }}
          />
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 16,
};
const panelStyle = {
  background: "#1a1720", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 420,
  boxShadow: "0 20px 60px rgba(0,0,0,0.7)", maxHeight: "92vh", overflowY: "auto",
};
