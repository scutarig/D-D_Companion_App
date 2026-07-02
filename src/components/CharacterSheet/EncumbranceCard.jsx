import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * EncumbranceCard — compact carrying-capacity tracker on the sidebar.
 *
 * PHB 2024 rule of thumb: max carrying capacity = STR × 15 lb. Anything
 * above 5× STR (≈ ⅓ of the cap) starts the encumbered range in the
 * variant encumbrance rules; the card colour-codes into ok / heavy /
 * over-cap so the player has a quick visual without doing the arithmetic
 * every session.
 *
 * Item weights come from `wt: "3 lb"` style strings on inventory /
 * equipSlot items (already the shape items.js uses). Each item's `qty`
 * multiplies the weight; qty defaults to 1 for legacy items.
 */

// Parse "3 lb", "0.5 lb", "1/2 lb" → number. Returns 0 for unknown.
function parseWt(raw) {
  if (raw == null || raw === "" || raw === "—") return 0;
  const s = String(raw).replace(",", ".").toLowerCase();
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    const n = parseFloat(a), d = parseFloat(b);
    return n && d ? n / d : 0;
  }
  const m = s.match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

export default function EncumbranceCard({ char }) {
  const { t } = useI18n();

  const str = char.str || 10;
  const cap = str * 15;
  // Sum inventory + equipped items. equipSlots is { slot: item|null }
  const equipped = Object.values(char.equipSlots || {}).filter(Boolean);
  const inv = Array.isArray(char.inventory) ? char.inventory : [];
  const totalRaw = [...equipped, ...inv].reduce((sum, it) => {
    const w = parseWt(it.wt);
    const qty = Math.max(1, it.qty || 1);
    return sum + w * qty;
  }, 0);
  const total = Math.round(totalRaw * 10) / 10; // 1 decimal

  const pct = Math.min(100, Math.round((total / cap) * 100));
  const light = total <= cap / 3;
  const heavy = total > cap / 3 && total <= cap;
  const over = total > cap;
  const barColor = over ? C.redBright : heavy ? C.amberBright : C.greenBright;
  const label = over
    ? t("dash.enc_over","überladen")
    : heavy
      ? t("dash.enc_heavy","schwer beladen")
      : t("dash.enc_ok","normal");

  return (
    <div style={{ marginBottom: 6, padding: "2px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: barColor, fontWeight: 700, letterSpacing: 0.5 }}>
          🎒 {t("dash.encumbrance_header","Tragfähigkeit")}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.textDim }} title={t("dash.enc_rule","STR × 15 lb = max Kapazität")}>
          <strong style={{ color: barColor }}>{total}</strong> / {cap} lb
        </span>
      </div>
      <div style={{ background: C.surface, borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: barColor,
          transition: "width .2s, background .2s",
          boxShadow: `0 0 6px ${barColor}55`,
        }} />
      </div>
      <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, fontStyle: "italic" }}>
        {label}
      </div>
    </div>
  );
}
