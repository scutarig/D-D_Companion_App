import { useState, useRef, useEffect } from "react";
import { C, sx, FH, F } from "../constants/theme.js";
import { useProfile } from "../context/ProfileContext.jsx";
import { useI18n } from "../i18n/index.js";
import { useDialog } from "../hooks/useDialog.jsx";
import ProfileEditor from "./ProfileEditor.jsx";

/**
 * ProfileSwitcher — compact dropdown button.
 *
 * Props:
 *   variant: "sidebar" | "compact" — slightly different sizing
 *   onSwitch: optional callback after profile is switched
 */
export default function ProfileSwitcher({ variant = "sidebar", onSwitch }) {
  const { t } = useI18n();
  const { profiles, active, activeId, setActiveId, deleteProfile } = useProfile();
  const { confirm } = useDialog();
  const [open, setOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create, profile-object = edit
  const wrapRef = useRef(null);

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (id) => {
    setActiveId(id);
    setOpen(false);
    onSwitch?.(id);
  };

  const handleDelete = async (p) => {
    setOpen(false);
    const ok = await confirm(
      t("profile.confirm_delete","Profil \"{name}\" wirklich löschen? Alle Daten dieses Profils gehen verloren.").replace("{name}", p.name),
      { title: t("profile.delete_title","Profil löschen"), danger: true, okLabel: t("profile.delete_btn","Löschen") }
    );
    if (!ok) return;
    deleteProfile(p.id);
  };

  // Icon-only trigger — matches the lang-toggle's compact footprint.
  // Tooltip + aria-label carry the active profile name.
  const triggerStyle = variant === "compact" ? {
    background: `${C.amberBright}15`,
    border: `1px solid ${C.amberBright}55`,
    borderRadius: 8,
    color: C.amberBright,
    fontFamily: FH, fontWeight: 700,
    cursor: "pointer",
    padding: "6px 10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    minWidth: 44,
  } : {
    background: `${C.amberBright}11`,
    border: `1px solid ${C.amberBright}55`,
    borderRadius: 8,
    color: C.amberBright,
    fontFamily: FH, fontWeight: 700,
    cursor: "pointer",
    padding: "6px 4px",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%",
  };

  const tooltip = `${t("profile.switch_title","Profil wechseln")}: ${active.name}`;

  return (
    <div ref={wrapRef} style={{ position: "relative", flexShrink: 0, width: variant === "sidebar" ? "100%" : undefined }}>
      <button
        type="button"
        data-phone-compact
        onClick={() => setOpen((o) => !o)}
        title={tooltip}
        aria-label={tooltip}
        aria-haspopup="menu"
        aria-expanded={open}
        style={triggerStyle}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{active.icon}</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            minWidth: 220,
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
            {t("profile.list_label","Profile")}
          </div>
          {profiles.map((p) => {
            const isActive = p.id === activeId;
            return (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: 0, marginBottom: 2,
              }}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => switchTo(p.id)}
                  style={{
                    flex: 1, minWidth: 0,
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px",
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
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  {isActive && <span style={{ fontSize: 10 }}>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setEditTarget(p); setEditorOpen(true); setOpen(false); }}
                  aria-label={t("profile.edit_aria","Profil bearbeiten")}
                  title={t("profile.edit_aria","Profil bearbeiten")}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: C.textDim, fontSize: 11, padding: "4px 6px", lineHeight: 1,
                  }}
                >✎</button>
                {p.id !== "default" && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p); }}
                    aria-label={t("profile.delete_aria","Profil löschen")}
                    title={t("profile.delete_aria","Profil löschen")}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      color: C.redBright, fontSize: 11, padding: "4px 6px", lineHeight: 1,
                    }}
                  >🗑</button>
                )}
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 4 }}>
            <button
              type="button"
              onClick={() => { setEditTarget(null); setEditorOpen(true); setOpen(false); }}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "transparent",
                border: `1px dashed ${C.border}`,
                borderRadius: 6,
                color: C.amberBright,
                fontFamily: F, fontSize: 11, fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}
            >
              ＋ {t("profile.add_btn","Neues Profil")}
            </button>
          </div>
        </div>
      )}

      <ProfileEditor
        open={editorOpen}
        profile={editTarget}
        onClose={() => setEditorOpen(false)}
        onDelete={editTarget ? () => { handleDelete(editTarget); setEditorOpen(false); } : null}
      />
    </div>
  );
}
