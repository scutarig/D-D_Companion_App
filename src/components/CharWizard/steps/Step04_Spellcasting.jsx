import { useState, useMemo } from "react";
import { C, sx, FH } from "../../../constants/theme.js";
import { SPELLS } from "../../../data/spells.js";
import { useI18n } from "../../../i18n/index.js";

// Map German class → English spell tag used in spells.js
const KLASS_TO_TAG = {
  Barde: "Bard", Druide: "Druid", Hexenmeister: "Warlock", Kleriker: "Cleric",
  Magier: "Wizard", Zauberer: "Sorcerer", Magieschmied: "Artificer",
  Paladin: "Paladin", Waldläufer: "Ranger",
};

// PHB-2024 Lv1 cantrip + spell limits per caster class.
const LIMITS = {
  Magier:       { cantrips: 3, spells: 6 },
  Kleriker:     { cantrips: 3, spells: 0 },
  Druide:       { cantrips: 2, spells: 0 },
  Zauberer:     { cantrips: 4, spells: 2 },
  Hexenmeister: { cantrips: 2, spells: 2 },
  Barde:        { cantrips: 2, spells: 4 },
  Magieschmied: { cantrips: 2, spells: 2 },
  Paladin:      { cantrips: 0, spells: 0 },
  Waldläufer:   { cantrips: 0, spells: 0 },
};

export default function Step04_Spellcasting({ state, updatePartial }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState("");

  const limit = LIMITS[state.klass] || { cantrips: 0, spells: 0 };
  const tag = KLASS_TO_TAG[state.klass];
  const cantripPool = useMemo(() =>
    SPELLS.filter((s) => s.lv === 0 && s.classes?.includes(tag)),
    [tag]);
  const spellPool = useMemo(() =>
    SPELLS.filter((s) => s.lv === 1 && s.classes?.includes(tag)),
    [tag]);

  const cantrips = state.cantripsChosen || [];
  const spells = state.lv1SpellsChosen || [];

  const toggleCantrip = (id) => {
    const has = cantrips.includes(id);
    if (has) updatePartial({ cantripsChosen: cantrips.filter((s) => s !== id) });
    else if (cantrips.length < limit.cantrips) updatePartial({ cantripsChosen: [...cantrips, id] });
  };
  const toggleSpell = (id) => {
    const has = spells.includes(id);
    if (has) updatePartial({ lv1SpellsChosen: spells.filter((s) => s !== id) });
    else if (spells.length < limit.spells) updatePartial({ lv1SpellsChosen: [...spells, id] });
  };

  const fc = filter.toLowerCase();
  const showSpell = (s) => !fc || s.name.toLowerCase().includes(fc);

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 14 }}>
        {t("wizard.s4.title","Zauber lernen")}
      </h2>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t("wizard.s4.search","Suchen…")}
        style={{ ...sx.inp, marginBottom: 14, width: "100%", maxWidth: 360 }}
      />

      {limit.cantrips > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: C.amberBright, fontSize: 13 }}>
            {t("wizard.s4.cantrips_h","Cantrips ({n}/{total})")
              .replace("{n}", String(cantrips.length))
              .replace("{total}", String(limit.cantrips))}
          </h3>
          <SpellList pool={cantripPool.filter(showSpell)} chosen={cantrips} toggle={toggleCantrip}
            limit={limit.cantrips} />
        </section>
      )}

      {limit.spells > 0 && (
        <section>
          <h3 style={{ color: C.amberBright, fontSize: 13 }}>
            {t("wizard.s4.spells_h","Level-1 Zauber ({n}/{total})")
              .replace("{n}", String(spells.length))
              .replace("{total}", String(limit.spells))}
          </h3>
          <SpellList pool={spellPool.filter(showSpell)} chosen={spells} toggle={toggleSpell}
            limit={limit.spells} />
        </section>
      )}
    </div>
  );
}

function SpellList({ pool, chosen, toggle, limit }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 6,
      marginTop: 8,
    }}>
      {pool.map((s) => {
        const isPicked = chosen.includes(s.id);
        const isFull = chosen.length >= limit && !isPicked;
        return (
          <button
            type="button"
            key={s.id}
            onClick={() => toggle(s.id)}
            disabled={isFull}
            style={{
              ...sx.card,
              cursor: isFull ? "not-allowed" : "pointer",
              opacity: isFull ? 0.4 : 1,
              padding: "8px 10px",
              borderColor: isPicked ? C.green : C.border,
              background: isPicked ? `${C.green}11` : "transparent",
              textAlign: "left",
              fontSize: 12,
            }}
          >
            {isPicked ? "✓" : "○"} <strong>{s.name}</strong>
            {s.school && <span style={{ color: C.textDim }}> · {s.school}</span>}
          </button>
        );
      })}
    </div>
  );
}

export const validate = (s) => {
  const lim = LIMITS[s.klass] || { cantrips: 0, spells: 0 };
  const cOk = (s.cantripsChosen?.length || 0) === lim.cantrips;
  const sOk = (s.lv1SpellsChosen?.length || 0) === lim.spells;
  return (cOk && sOk) ? { ok: true } : { ok: false, errorKey: "wizard.err_no_spells" };
};
