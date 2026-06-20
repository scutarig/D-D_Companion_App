import { useState, useEffect } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import Modal from "../Modal.jsx";
import { typeOf } from "../Companions/CompanionCard.jsx";
import { useI18n } from "../../i18n/index.js";

/**
 * CompanionsCard — at-a-glance companion overview for the Übersicht tab.
 *
 * Header is always visible with a count badge (alive / total). The card
 * defaults to open when there are companions and closed when the list is
 * empty (per the user's preference: empty → just header showing 'leer').
 * Empty state inside the body points at the dedicated Begleiter tab where
 * companions are created.
 *
 * Each row is a compact strip: type-icon · name · HP bar · ± HP buttons · AC.
 * Clicking anywhere on the row opens a detail modal with editable HP/MaxHP,
 * AC, name, type, speed and notes, plus a delete button. The dedicated
 * Begleiter tab still owns the full creation flow (Bestiary import, stat
 * blocks, traits…) — this card is just for table-time quick reference.
 */
export default function CompanionsCard({ companions, updateHp, update, remove }) {
  const { t } = useI18n();
  const list = Array.isArray(companions) ? companions : [];
  const hasAny = list.length > 0;
  // Track whether the user has explicitly toggled the card. Until they do,
  // `open` follows `hasAny` so the card auto-opens when companions arrive
  // (usePersist hydrates asynchronously, so the initial render is always
  // empty). Once the user clicks the header we stop overriding.
  const [open, setOpen] = useState(false);
  const [userTouched, setUserTouched] = useState(false);
  useEffect(() => {
    if (!userTouched) setOpen(hasAny);
  }, [hasAny, userTouched]);
  const handleToggle = () => { setUserTouched(true); setOpen((o) => !o); };
  const [editId, setEditId] = useState(null);

  const aliveCount = list.filter((c) => (c.hp || 0) > 0).length;
  const editing = list.find((c) => c.id === editId) || null;

  const hpAcc = (hp, max) => {
    const p = hp / (max || 1);
    return p > 0.5 ? C.green : p > 0.25 ? C.amber : C.red;
  };
  const hpTxt = (hp, max) => {
    const p = hp / (max || 1);
    return p > 0.5 ? C.greenBright : p > 0.25 ? C.amberBright : C.redBright;
  };

  return (
    <div style={{ ...sx.card, marginBottom: 10, padding: 0, overflow: "hidden" }}>
      <button type="button" onClick={handleToggle} aria-expanded={open}
        style={{
          width: "100%",
          background: open ? `${C.amberBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.amberBright}30` : "none",
          color: C.amberBright,
          fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
          textAlign: "left",
        }}>
        {/* i18n key already carries the 🐾 — don't double-prefix it here. */}
        <span>{t("dash.companions_header","🐾 Begleiter")}</span>
        <span style={{ flex: 1, fontSize: 11, color: hasAny ? C.textDim : C.textDim, fontWeight: 400, fontStyle: hasAny ? "normal" : "italic" }}>
          {hasAny
            ? `${aliveCount}/${list.length} ${t("dash.active_count","aktiv")}`
            : t("dash.companions_empty_short","leer")}
        </span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        !hasAny ? (
          <div style={{ padding: "12px 14px", fontSize: 12, color: C.textDim, fontStyle: "italic" }}>
            {t("dash.companions_empty_hint","Noch keine Begleiter — im Tab Begleiter anlegen (Bestiarium-Import, Familiar, Find Steed, Beast Master Primal Companion, Pact of the Chain …).")}
          </div>
        ) : (
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {list.map((c) => {
              const cfg = typeOf(c.type);
              const max = c.maxHp || 1;
              const pct = Math.max(0, Math.min(1, (c.hp || 0) / max));
              const acc = hpAcc(c.hp, max);
              const txt = hpTxt(c.hp, max);
              const dead = (c.hp || 0) <= 0;
              return (
                <div key={c.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: `${cfg.color}0a`,
                    borderLeft: `3px solid ${cfg.color}`,
                    borderRadius: 6,
                    padding: "5px 8px",
                    opacity: dead ? 0.55 : 1,
                    cursor: "pointer",
                  }}
                  onClick={() => setEditId(c.id)}
                  title={t("dash.companions_row_hint","Klick: Details / bearbeiten")}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: C.textBright,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {c.name}{dead && <span style={{ color: C.red, marginLeft: 4 }}>☠</span>}
                    </div>
                    <div style={{ height: 3, background: C.surface, borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct * 100}%`, background: acc, borderRadius: 2, transition: "width .2s" }} />
                    </div>
                  </div>
                  {/* HP +/− buttons. stopPropagation so they don't open the modal. */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button type="button"
                      onClick={() => updateHp(c.id, -1)}
                      style={{ ...sx.bsm(C.red), padding: "2px 7px", fontSize: 13, fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: 11, fontWeight: 700, color: txt, minWidth: 36, textAlign: "center" }}>
                      {c.hp || 0}/{c.maxHp}
                    </span>
                    <button type="button"
                      onClick={() => updateHp(c.id, +1)}
                      style={{ ...sx.bsm(C.green), padding: "2px 7px", fontSize: 13, fontWeight: 700 }}>+</button>
                  </div>
                  <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>
                    {t("dash.ac_short","RK")} {c.ac}
                  </span>
                </div>
              );
            })}
          </div>
        )
      )}

      {editing && (
        <CompanionDetailModal
          companion={editing}
          onClose={() => setEditId(null)}
          onUpdate={(changes) => update(editing.id, changes)}
          onDelete={() => { remove(editing.id); setEditId(null); }}
        />
      )}
    </div>
  );
}

/**
 * Detail modal for a single companion. Inline edits commit on each change
 * via `update(id, partial)`, so closing the modal doesn't risk losing input.
 */
function CompanionDetailModal({ companion: c, onClose, onUpdate, onDelete }) {
  const { t } = useI18n();
  const cfg = typeOf(c.type);

  const Row = ({ label, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 10, color: C.textDim, letterSpacing: 0.6, textTransform: "uppercase", minWidth: 80 }}>{label}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );

  const numInput = (val, onChange, props = {}) => (
    <input type="number" value={val ?? 0} onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      style={{ ...sx.inp, width: 80, fontSize: 13, padding: "4px 6px" }} {...props} />
  );

  return (
    <Modal open={true} onClose={onClose} title={`${cfg.icon} ${c.name}`} maxWidth={460}>
      <Row label={t("dash.companions_field_name","Name")}>
        <input type="text" value={c.name || ""} onChange={(e) => onUpdate({ name: e.target.value })}
          style={{ ...sx.inp, width: "100%", fontSize: 13, padding: "4px 6px", boxSizing: "border-box" }} />
      </Row>
      <Row label={t("dash.companions_field_type","Typ")}>
        <select value={c.type || "beast"} onChange={(e) => onUpdate({ type: e.target.value })}
          style={{ ...sx.sel, fontSize: 13, padding: "4px 6px" }}>
          <option value="beast">🐾 Tier</option>
          <option value="construct">⚙️ Konstrukt</option>
          <option value="humanoid">👤 Humanoid</option>
          <option value="fiend">😈 Teufel</option>
          <option value="undead">💀 Untoter</option>
          <option value="celestial">✨ Himmlisch</option>
          <option value="fey">🧚 Fee</option>
          <option value="dragon">🐉 Drache</option>
          <option value="other">❓ Sonstiges</option>
        </select>
      </Row>
      <Row label={t("dash.companions_field_hp","HP")}>
        {numInput(c.hp, (n) => onUpdate({ hp: Math.max(0, Math.min(n, c.maxHp || n)) }))}
        <span style={{ color: C.textDim, margin: "0 6px" }}>/</span>
        {numInput(c.maxHp, (n) => onUpdate({ maxHp: Math.max(1, n) }), { min: 1 })}
      </Row>
      <Row label={t("dash.companions_field_ac","RK / AC")}>
        {numInput(c.ac, (n) => onUpdate({ ac: Math.max(0, n) }))}
      </Row>
      <Row label={t("dash.companions_field_speed","Speed")}>
        {numInput(c.speed, (n) => onUpdate({ speed: Math.max(0, n) }))}
        <span style={{ fontSize: 11, color: C.textDim, marginLeft: 4 }}>ft</span>
      </Row>
      {c.cr != null && (
        <Row label={t("dash.companions_field_cr","CR")}>
          <span style={{ fontSize: 12, color: C.text }}>{c.cr}</span>
        </Row>
      )}
      {c.senses && (
        <Row label={t("dash.companions_field_senses","Sinne")}>
          <span style={{ fontSize: 11, color: C.textDim }}>{c.senses}</span>
        </Row>
      )}
      <Row label={t("dash.companions_field_notes","Notizen")}>
        <textarea value={c.notes || ""} onChange={(e) => onUpdate({ notes: e.target.value })}
          rows={3}
          style={{ ...sx.inp, width: "100%", fontSize: 12, padding: "5px 7px", boxSizing: "border-box", resize: "vertical" }} />
      </Row>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8 }}>
        <button type="button" onClick={onDelete}
          style={{ ...sx.btn(C.redBright), fontSize: 11, padding: "6px 10px" }}>
          🗑 {t("dash.companions_delete","Löschen")}
        </button>
        <button type="button" onClick={onClose}
          style={{ ...sx.btn(C.amberBright), fontSize: 12 }}>
          {t("modal.close","Schließen")}
        </button>
      </div>
    </Modal>
  );
}
