import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { rollD } from "../../utils/helpers.js";
import { useI18n } from "../../i18n/index.js";

/**
 * ConsumablesCard — one-tap "trinken" belt for potions / scrolls that
 * live in char.inventory. Filters by `sub === "Potion"` (extendable to
 * "Scroll" / "Ammo" later). Each row shows the item name, remaining qty
 * (default 1) and a Nutzen button that:
 *   1. Parses the `eff` field for a `NdX+M HP` pattern.
 *   2. Rolls and applies the heal to char.hp (clamped to maxHp).
 *   3. Decrements qty. When qty hits 0 the item is dropped from
 *      inventory.
 * Ammo-style items (Pfeile, Bolzen) also live here as a qty-only
 * counter — no auto-effect, but the ± buttons let the player track
 * shots without opening the full Inventar tab.
 */

const HEAL_RE = /(\d+)\s*d\s*(\d+)\s*(?:([+\-])\s*(\d+))?\s*HP/i;

function rollEff(eff) {
  const m = eff?.match(HEAL_RE);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const d = parseInt(m[2], 10);
  const sign = m[3] === "-" ? -1 : 1;
  const mod = m[4] ? parseInt(m[4], 10) * sign : 0;
  let total = mod;
  const rolls = [];
  for (let i = 0; i < n; i++) {
    const r = rollD(d);
    rolls.push(r);
    total += r;
  }
  return { total, rolls, mod, notation: `${n}d${d}${mod ? (sign > 0 ? `+${mod}` : mod) : ""}` };
}

export default function ConsumablesCard({ char, setChar }) {
  const { t } = useI18n();
  const [lastUse, setLastUse] = useState(null);

  const inv = Array.isArray(char.inventory) ? char.inventory : [];
  const potions = inv.filter((it) => it.sub === "Potion");
  const ammo    = inv.filter((it) => it.sub === "Ammo" || it.sub === "Munition");

  if (potions.length === 0 && ammo.length === 0) return null;

  const bumpQty = (uid, delta) => {
    setChar((p) => {
      const nextInv = (p.inventory || []).map((it) => {
        if (it.uid !== uid) return it;
        return { ...it, qty: Math.max(0, (it.qty || 1) + delta) };
      }).filter((it) => (it.qty === undefined || it.qty > 0));
      return { ...p, inventory: nextInv };
    });
  };

  const usePotion = (item) => {
    const eff = rollEff(item.eff);
    if (eff) {
      setChar((p) => ({
        ...p,
        hp: Math.min(p.maxHp || p.hp, (p.hp || 0) + eff.total),
        inventory: (p.inventory || []).map((it) => {
          if (it.uid !== item.uid) return it;
          const nextQty = Math.max(0, (it.qty || 1) - 1);
          return { ...it, qty: nextQty };
        }).filter((it) => (it.qty === undefined || it.qty > 0)),
      }));
      setLastUse({ name: item.name, effect: `+${eff.total} HP`, roll: `${eff.rolls.join("+")}${eff.mod ? (eff.mod > 0 ? `+${eff.mod}` : eff.mod) : ""} = ${eff.total}` });
    } else {
      // Non-heal potion: just decrement, don't touch HP
      bumpQty(item.uid, -1);
      setLastUse({ name: item.name, effect: item.eff || t("dash.cons_effect_manual","Effekt manuell anwenden"), roll: null });
    }
  };

  return (
    <div style={{ marginBottom: 6, padding: "2px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: C.tealBright, fontWeight: 700, letterSpacing: 0.5 }}>
          🧪 {t("dash.consumables_header","Verbrauchsgüter")}
        </span>
      </div>

      {lastUse && (
        <div style={{
          marginBottom: 6,
          padding: "5px 10px",
          background: `${C.green}18`,
          border: `1px solid ${C.greenBright}55`,
          borderRadius: 6,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          fontSize: 11,
        }}>
          <strong style={{ color: C.greenBright }}>{lastUse.name}</strong>
          <span style={{ color: C.text }}>→ {lastUse.effect}</span>
          {lastUse.roll && <span style={{ color: C.textDim, fontSize: 10 }}>({lastUse.roll})</span>}
          <button type="button" onClick={() => setLastUse(null)}
            style={{ ...sx.bsm(C.textDim), marginLeft: "auto", fontSize: 10 }}>✕</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {potions.map((item) => {
          const qty = item.qty ?? 1;
          return (
            <div key={item.uid || item.name} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "3px 6px",
              background: `${C.tealBright}0a`,
              borderLeft: `3px solid ${C.tealBright}`,
              borderRadius: 5,
            }}>
              <span style={{ flex: 1, fontSize: 11, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                🧪 {item.name}
              </span>
              <span style={{ fontSize: 10, color: C.textDim, minWidth: 22, textAlign: "right" }}>× {qty}</span>
              <button type="button" onClick={() => usePotion(item)} disabled={qty <= 0}
                title={item.eff || ""}
                style={{
                  padding: "2px 8px",
                  borderRadius: 5,
                  border: `1px solid ${qty > 0 ? C.greenBright + "77" : C.border}`,
                  background: qty > 0 ? `${C.greenBright}22` : "transparent",
                  color: qty > 0 ? C.greenBright : C.textDim,
                  fontSize: 10, fontWeight: 700,
                  cursor: qty > 0 ? "pointer" : "default",
                  fontFamily: "inherit",
                }}>
                {t("dash.cons_use","Nutzen")}
              </button>
            </div>
          );
        })}
        {ammo.map((item) => {
          const qty = item.qty ?? 1;
          return (
            <div key={item.uid || item.name} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "3px 6px",
              background: `${C.amber}0a`,
              borderLeft: `3px solid ${C.amberBright}`,
              borderRadius: 5,
            }}>
              <span style={{ flex: 1, fontSize: 11, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                🏹 {item.name}
              </span>
              <button type="button" onClick={() => bumpQty(item.uid, -1)} disabled={qty <= 0}
                title={t("dash.cons_ammo_down","1 verbrauchen")}
                style={{ ...sx.bsm(C.red), fontSize: 10, padding: "1px 6px" }}>−</button>
              <span style={{ fontSize: 11, color: C.text, minWidth: 30, textAlign: "center", fontWeight: 700 }}>{qty}</span>
              <button type="button" onClick={() => bumpQty(item.uid, +1)}
                title={t("dash.cons_ammo_up","+1")}
                style={{ ...sx.bsm(C.green), fontSize: 10, padding: "1px 6px" }}>+</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
