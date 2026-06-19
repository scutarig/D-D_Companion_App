import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { modOf, rollD } from "../../utils/helpers.js";
import { useI18n } from "../../i18n/index.js";

/**
 * HitDiceCard — dashboard tracker for spent / available Hit Dice.
 *
 * Schema reminder:
 *   char.hd       — string like "d10" (the die size from class)
 *   char.hd_used  — number of HD already spent
 *   total HD      — char.level
 *
 * Click a pill to toggle spent/unspent. The "🎲 Würfeln" button rolls 1 HD
 * + CON-Mod, heals the character, and increments hd_used by 1. Useful in the
 * middle of a Short Rest without leaving the Übersicht tab.
 */
export default function HitDiceCard({ char, setChar }) {
  const { t } = useI18n();
  const [lastSpend, setLastSpend] = useState(null);

  const level = Math.max(1, char.level || 1);
  const used = Math.max(0, Math.min(level, char.hd_used || 0));
  const remaining = level - used;
  const hdStr = char.hd || "d8";
  const hdMatch = hdStr.match(/[dDwW](\d+)/);
  const hdSize = hdMatch ? parseInt(hdMatch[1], 10) : 8;
  const conMod = modOf(char.con || 10);

  const togglePill = (idx) => {
    // Clicking pill at index `idx`:
    //   - if it's currently spent → restore it (reduce hd_used)
    //   - if it's currently full   → spend it (no roll, just count)
    setChar((p) => {
      const cur = Math.max(0, Math.min(level, p.hd_used || 0));
      const wasSpent = idx < cur;
      return { ...p, hd_used: wasSpent ? idx : idx + 1 };
    });
  };

  const rollSpend = () => {
    if (remaining <= 0 || char.hp >= char.maxHp) return;
    const roll = rollD(hdSize);
    const heal = Math.max(1, roll + conMod);
    setChar((p) => ({
      ...p,
      hp: Math.min(p.maxHp, (p.hp || 0) + heal),
      hd_used: Math.min(p.level || 1, (p.hd_used || 0) + 1),
    }));
    setLastSpend({ roll, conMod, heal, ts: Date.now() });
  };

  const resetAll = () => setChar((p) => ({ ...p, hd_used: 0 }));

  return (
    <div style={{ ...sx.card, marginBottom: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: C.amberBright, fontWeight: 700, letterSpacing: 0.5 }}>
          🎲 {t("dash.hd_header","Trefferwürfel")}
        </span>
        <span style={{ fontSize: 11, color: C.textDim }}>
          {hdStr.toLowerCase()} · {t("dash.hd_remaining","verfügbar")}: {" "}
          <strong style={{ color: remaining > 0 ? C.amberBright : C.textDim }}>{remaining}</strong>
          {" / "}{level}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button"
          onClick={rollSpend}
          disabled={remaining <= 0 || char.hp >= char.maxHp}
          title={t("dash.hd_roll_hint","1d{n} + CON-Mod heilen und 1 HD verbrauchen").replace("{n}", String(hdSize))}
          style={{
            padding: "4px 10px",
            borderRadius: 7,
            border: `1px solid ${remaining > 0 && char.hp < char.maxHp ? C.amberBright + "88" : C.border}`,
            background: remaining > 0 && char.hp < char.maxHp ? `${C.amberBright}22` : "transparent",
            color: remaining > 0 && char.hp < char.maxHp ? C.amberBright : C.textDim,
            fontSize: 11,
            fontWeight: 700,
            cursor: remaining > 0 && char.hp < char.maxHp ? "pointer" : "default",
            fontFamily: "inherit",
          }}>
          🎲 {t("dash.hd_roll_btn","Würfeln + heilen")}
        </button>
        <button type="button"
          onClick={resetAll}
          disabled={used === 0}
          title={t("dash.hd_reset_hint","Alle HD zurücksetzen (sonst über Long Rest)")}
          style={{ ...sx.bsm(used === 0 ? C.textDim : C.gold), fontSize: 10 }}>
          ↺
        </button>
      </div>

      {lastSpend && (
        <div style={{
          marginBottom: 8,
          padding: "5px 10px",
          background: `${C.green}18`,
          border: `1px solid ${C.greenBright}55`,
          borderRadius: 6,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          fontSize: 11,
        }}>
          <span style={{ color: C.textDim }}>
            {lastSpend.roll} {lastSpend.conMod >= 0 ? "+" : "−"} {Math.abs(lastSpend.conMod)} =
          </span>
          <strong style={{ color: C.greenBright, fontSize: 13 }}>+{lastSpend.heal} HP</strong>
          <button type="button" onClick={() => setLastSpend(null)}
            style={{ ...sx.bsm(C.textDim), marginLeft: "auto", fontSize: 10 }}>✕</button>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {Array.from({ length: level }).map((_, i) => {
          const spent = i < used;
          return (
            <button key={i}
              type="button"
              onClick={() => togglePill(i)}
              title={spent
                ? t("dash.hd_pill_spent","Verbraucht — Klick: wiederherstellen")
                : t("dash.hd_pill_avail","Verfügbar — Klick: als verbraucht markieren")}
              style={{
                minWidth: 28,
                height: 22,
                padding: "0 6px",
                borderRadius: 5,
                border: `1.5px solid ${C.amberBright}`,
                background: spent ? "transparent" : C.amberBright,
                color: spent ? C.amberBright : C.bg,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: FH,
                cursor: "pointer",
                transition: "background .15s",
              }}>
              {hdStr.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
