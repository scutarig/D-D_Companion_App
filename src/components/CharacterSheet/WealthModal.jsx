import { C, sx, FH } from "../../constants/theme.js";
import Modal from "../Modal.jsx";
import { useI18n } from "../../i18n/index.js";

/**
 * WealthModal — currency editor lifted out of the old inline WealthPanel
 * dropdown. Same +/− buttons and direct-input fields, just in a modal
 * so it doesn't push the Übersicht stack down whenever it's open.
 */
const CURR = [
  { id: "pp",       short: "PP", gpVal: 10,   col: "#e2e8f0" },
  { id: "gold",     short: "GP", gpVal: 1,    col: "#c9a84c" },
  { id: "electrum", short: "EP", gpVal: 0.5,  col: "#67cdcd" },
  { id: "silver",   short: "SP", gpVal: 0.1,  col: "#94a3b8" },
  { id: "copper",   short: "CP", gpVal: 0.01, col: "#b45309" },
];

export default function WealthModal({ open, onClose, char, setChar }) {
  const { t } = useI18n();
  const totalGP = CURR.reduce((s, c) => s + (char[c.id] || 0) * c.gpVal, 0);

  const setAmount = (id, val) => setChar(p => ({ ...p, [id]: Math.max(0, parseInt(val) || 0) }));
  const bump      = (id, d) => setChar(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + d) }));

  const lbl = { fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase" };

  return (
    <Modal open={open} onClose={onClose} title={`💰 ${t("wealth.modal_title","Münzen")}`} maxWidth={360}>
      <div style={{
        marginBottom: 12,
        padding: "8px 12px",
        background: `${C.gold}10`, border: `1px solid ${C.gold}55`, borderRadius: 8,
        display: "flex", alignItems: "baseline", gap: 8, justifyContent: "center",
      }}>
        <span style={{ ...lbl, color: C.gold }}>{t("wealth.total","Gesamt")}</span>
        <span style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: C.gold }}>
          {totalGP % 1 === 0 ? totalGP : totalGP.toFixed(2)}
        </span>
        <span style={{ fontSize: 12, color: C.gold }}>GP</span>
      </div>
      {CURR.map(c => (
        <div key={c.id} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 6, padding: "4px 0",
        }}>
          <span style={{ ...lbl, color: c.col, minWidth: 36 }}>{c.short}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button type="button"
              onClick={() => bump(c.id, -1)}
              aria-label={`${c.short} −1`}
              style={{ width: 28, height: 28, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", fontSize: 15 }}>
              −
            </button>
            <input type="number" min={0} value={char[c.id] || 0}
              onChange={e => setAmount(c.id, e.target.value)}
              style={{ width: 72, textAlign: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textBright, padding: "4px 0", fontSize: 14 }} />
            <button type="button"
              onClick={() => bump(c.id, 1)}
              aria-label={`${c.short} +1`}
              style={{ width: 28, height: 28, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", fontSize: 15 }}>
              +
            </button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 14 }}>
        <button type="button" onClick={onClose} style={{ ...sx.btn(C.gold), fontSize: 12 }}>
          {t("modal.close","Schließen")}
        </button>
      </div>
    </Modal>
  );
}
