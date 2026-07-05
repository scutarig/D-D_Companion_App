import { useState, useRef, useEffect } from "react";
import { C, sx, FH, F } from "../constants/theme.js";
import { useChar } from "../context/CharContext.jsx";
import { useDialog } from "../hooks/useDialog.jsx";
import { useI18n } from "../i18n/index.js";
import { initialWizardState } from "./CharWizard/hooks/useWizardState.js";
import { D3_KLASSEN } from "../data/classes.js";

// Map a saved char.klass value (DE name, EN name or id) to the class-icon
// defined in classes.js. Falls back to a neutral 🧝 so unknown values don't
// break the layout.
function classIcon(klass) {
  if (!klass) return "🧝";
  const needle = String(klass).toLowerCase().trim();
  const hit = D3_KLASSEN.find(k =>
    k.name?.toLowerCase() === needle ||
    k.enName?.toLowerCase() === needle ||
    k.id?.toLowerCase() === needle,
  );
  return hit?.icon || "🧝";
}

/**
 * CharSwitcher — dropdown that owns character selection, creation, and
 * deletion. Sits in the same slot the old profile-switcher used to occupy
 * (desktop sidebar + mobile bottom strip), so all char-list operations live
 * in exactly one place.
 *
 *  - Click the trigger to open a menu listing every char.
 *  - Click a row to switch active char.
 *  - Row's 🗑 icon deletes that char (confirm dialog). Disabled when only one
 *    char is left — the app requires at least one.
 *  - Footer button "＋ Neuer Held" seeds the wizard state and reloads so the
 *    AppRouter picks up the wizard takeover.
 */
export default function CharSwitcher({ variant = "sidebar" }) {
  const { t } = useI18n();
  const { confirm } = useDialog();
  const { chars, aid, setAid, setChars } = useChar();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey   = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = chars.find(c => c.id === aid) || chars[0];
  const switchTo = (id) => { setAid(id); setOpen(false); };

  const startNewChar = () => {
    setOpen(false);
    const seed = { ...initialWizardState(), targetLevel: 1 };
    // AppRouter reads wizard_active_v1 via its own usePersist; a plain state
    // set here won't propagate. Write to storage + reload so the takeover
    // renders on the next mount.
    localStorage.setItem("wizard_active_v1", JSON.stringify(seed));
    window.location.reload();
  };

  const handleDelete = async (charObj) => {
    if (chars.length <= 1) return;
    setOpen(false);
    const ok = await confirm(
      t("charswitch.confirm_delete", "Charakter \"{name}\" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")
        .replace("{name}", charObj.name || "—"),
      { title: t("charswitch.delete_title", "Charakter löschen"), danger: true, okLabel: t("charswitch.delete_btn", "Löschen") }
    );
    if (!ok) return;
    const remaining = chars.filter(c => c.id !== charObj.id);
    setChars(remaining);
    if (charObj.id === aid && remaining[0]) setAid(remaining[0].id);
  };

  const triggerStyle = variant === "compact" ? {
    background: `${C.amberBright}15`,
    border: `1px solid ${C.amberBright}55`,
    borderRadius: 8,
    color: C.amberBright,
    fontFamily: FH, fontSize: 13, fontWeight: 700,
    cursor: "pointer", letterSpacing: 0.5,
    padding: "6px 10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    minWidth: 56,
  } : {
    background: `${C.amberBright}11`,
    border: `1px solid ${C.amberBright}55`,
    borderRadius: 8,
    color: C.amberBright,
    fontFamily: FH, fontWeight: 700, fontSize: 11,
    cursor: "pointer",
    padding: "6px 6px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
    width: "100%",
    letterSpacing: 0.3,
  };

  const tooltip = `${t("charswitch.title","Charakter wechseln")}: ${active?.name || "—"}`;
  const activeIcon = active ? classIcon(active.klass) : "🧙";
  // Sidebar has ~50 px of usable width — truncate to keep it single-line.
  const shortName = (active?.name || "").slice(0, 8);

  return (
    <div ref={wrapRef} style={{
      position: "relative",
      flexShrink: 0,
      display: variant === "compact" ? "flex" : undefined,
      alignSelf: variant === "compact" ? "stretch" : undefined,
      width: variant === "sidebar" ? "100%" : undefined,
    }}>
      <button
        type="button"
        data-phone-compact
        onClick={() => setOpen(o => !o)}
        title={tooltip}
        aria-label={tooltip}
        aria-haspopup="menu"
        aria-expanded={open}
        style={triggerStyle}
      >
        <span style={{ fontSize: variant === "compact" ? 14 : 14, lineHeight: 1 }}>{activeIcon}</span>
        {variant === "sidebar" && shortName && (
          <span style={{
            fontSize: 10, lineHeight: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: "100%",
          }}>{shortName}</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            minWidth: 260,
            maxHeight: "70vh",
            overflowY: "auto",
            background: C.card,
            border: `1px solid ${C.borderBright}`,
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            padding: 6,
            zIndex: 1000,
          }}
        >
          <div style={{
            fontFamily: FH, fontSize: 9, color: C.textDim, letterSpacing: 1,
            padding: "4px 8px 6px", borderBottom: `1px solid ${C.border}`, marginBottom: 4,
            textTransform: "uppercase",
          }}>
            {t("charswitch.list_label","Charaktere")}
          </div>

          {chars.length === 0 && (
            <div style={{ padding: "10px 8px", fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
              {t("charswitch.empty","Keine Charaktere. Lege einen neuen an.")}
            </div>
          )}

          {chars.map((c) => {
            const isActive = c.id === aid;
            const subtitle = [c.klass, c.level ? `Lv.${c.level}` : null].filter(Boolean).join(" · ");
            const canDelete = chars.length > 1;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => switchTo(c.id)}
                  style={{
                    flex: 1, minWidth: 0,
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px",
                    background: isActive ? `${C.amberBright}22` : "transparent",
                    border: `1px solid ${isActive ? C.amberBright : "transparent"}`,
                    borderRadius: 6,
                    color: isActive ? C.amberBright : C.text,
                    fontFamily: F, fontSize: 12,
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{classIcon(c.klass)}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name || "—"}</div>
                    {subtitle && <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{subtitle}</div>}
                  </span>
                  {isActive && <span style={{ fontSize: 10 }}>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
                  disabled={!canDelete}
                  aria-label={t("charswitch.delete_aria","Charakter löschen")}
                  title={canDelete ? t("charswitch.delete_aria","Charakter löschen") : t("charswitch.delete_disabled","Letzten Charakter kann man nicht löschen")}
                  style={{
                    background: "transparent", border: "none",
                    cursor: canDelete ? "pointer" : "not-allowed",
                    color: canDelete ? C.redBright : C.textDim,
                    fontSize: 12, padding: "4px 6px", lineHeight: 1,
                    opacity: canDelete ? 1 : 0.4,
                  }}
                >🗑</button>
              </div>
            );
          })}

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 4 }}>
            <button
              type="button"
              onClick={startNewChar}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                border: `1px dashed ${C.border}`,
                borderRadius: 6,
                color: C.greenBright,
                fontFamily: F, fontSize: 11, fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}
            >
              ＋ {t("charswitch.new_char","Neuer Held")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
