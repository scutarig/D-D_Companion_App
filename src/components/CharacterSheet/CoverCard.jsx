import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * CoverCard — situational-modifier picker for cover. PHB 2024 grades
 * cover into four tiers; each grants an AC + DEX-save bonus (or full
 * immunity to the attack for total cover). The card is a tiny 4-button
 * chip row + a computed-effect line, so the player can flip the state
 * as terrain changes without opening a modal.
 *
 * The current tier persists via char.uiState.cover so it survives page
 * reloads — but nothing else in the app depends on it; it's purely a
 * visual reminder for the player.
 */

const TIERS = [
  { id: "none",    label: "Keine",   labelEN: "None",     ac: 0,  save: 0,  desc: "Kein Deckungs-Bonus.",                                            descEN: "No cover bonus." },
  { id: "half",    label: "Halb",    labelEN: "Half",     ac: 2,  save: 2,  desc: "½ Deckung: +2 AC, +2 DEX-Saves.",                                 descEN: "½ cover: +2 AC, +2 DEX saves." },
  { id: "three",   label: "¾",       labelEN: "¾",        ac: 5,  save: 5,  desc: "¾ Deckung: +5 AC, +5 DEX-Saves.",                                 descEN: "¾ cover: +5 AC, +5 DEX saves." },
  { id: "full",    label: "Voll",    labelEN: "Full",     ac: Infinity, save: Infinity, desc: "Volle Deckung: kann nicht direkt Ziel eines Angriffs / Zaubers sein.", descEN: "Total cover: can't be targeted by attacks or spells directly." },
];

export default function CoverCard({ char, setChar }) {
  const { t, lang } = useI18n();
  const persisted = char.uiState?.cover || "none";
  const [tierId, setTierId] = useState(persisted);
  const tier = TIERS.find((x) => x.id === tierId) || TIERS[0];

  const setTier = (id) => {
    setTierId(id);
    setChar((p) => ({ ...p, uiState: { ...(p.uiState || {}), cover: id } }));
  };

  const label = (tt) => (lang === "en" ? tt.labelEN : tt.label);
  const desc  = (tt) => (lang === "en" ? tt.descEN  : tt.desc);
  const activeCol = tierId === "none" ? C.textDim : tierId === "half" ? C.tealBright : tierId === "three" ? C.amberBright : C.purpleBright;

  return (
    <div style={{ marginBottom: 6, padding: "2px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: activeCol, fontWeight: 700, letterSpacing: 0.5 }}>
          🛡 {t("dash.cover_header","Deckung")}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.textDim }}>
          {tier.ac === Infinity
            ? t("dash.cover_untargetable","untargetable")
            : `AC +${tier.ac}, DEX +${tier.save}`}
        </span>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {TIERS.map((tt) => {
          const on = tierId === tt.id;
          const col = tt.id === "none" ? C.textDim : tt.id === "half" ? C.tealBright : tt.id === "three" ? C.amberBright : C.purpleBright;
          return (
            <button key={tt.id} type="button"
              onClick={() => setTier(tt.id)}
              title={desc(tt)}
              style={{
                flex: 1, minWidth: 46,
                padding: "3px 6px",
                borderRadius: 8,
                border: `1px solid ${on ? col + "aa" : C.border}`,
                background: on ? `${col}22` : "transparent",
                color: on ? col : C.textDim,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
              {label(tt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
