import { useState, useEffect } from "react";
import { C, sx } from "../constants/theme.js";
import Modal from "./Modal.jsx";
import { useI18n } from "../i18n/index.js";
import { useProfile } from "../context/ProfileContext.jsx";

const ICON_SUGGESTIONS = ["🎲","🧙","🐉","⚔️","🏰","🛡️","🔮","💎","🗝️","🏹","💀","🌙","🌟","👑","🧝","🧚","🐺","🦊","🦉","🦇","🧪","📜","🍺","🎭","🎯","⚡","🔥","❄️","🌿","🐲","🗡️","👁️","🌑","🤖"];

export default function ProfileEditor({ open, profile, onClose, onDelete }) {
  const { t } = useI18n();
  const { addProfile, updateProfile } = useProfile();
  const isEdit = !!profile;
  const [name, setName] = useState(profile?.name || "");
  const [icon, setIcon] = useState(profile?.icon || "🧙");

  useEffect(() => {
    if (!open) return;
    setName(profile?.name || "");
    setIcon(profile?.icon || "🧙");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, open]);

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    if (isEdit) updateProfile(profile.id, { name: n, icon });
    else addProfile({ name: n, icon });
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t("profile.edit_title","Profil bearbeiten") : t("profile.new_title","Neues Profil")}
      maxWidth={420}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={sx.lbl}>{t("profile.name_label","Name")}</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("profile.name_placeholder","z.B. Alice, Tablet, Bob…")}
            maxLength={40}
            style={sx.inp}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          />
        </div>

        <div>
          <label style={sx.lbl}>{t("profile.icon_label","Icon (Emoji)")}</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={4}
            style={{ ...sx.inp, fontSize: 22, textAlign: "center", width: 64 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {ICON_SUGGESTIONS.map((em) => (
              <button type="button" key={em}
                onClick={() => setIcon(em)}
                style={{
                  background: icon === em ? `${C.amberBright}22` : "transparent",
                  border: `1px solid ${icon === em ? C.amberBright : C.border}`,
                  borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: 16,
                  lineHeight: 1,
                }}
              >{em}</button>
            ))}
          </div>
        </div>

        <div style={{
          padding: "8px 12px", borderRadius: 6,
          background: `${C.amberBright}15`,
          border: `1px solid ${C.amberBright}55`,
          color: C.amberBright,
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span>{name || t("profile.name_label","Name")}</span>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 4 }}>
          {isEdit && onDelete && profile.id !== "default" ? (
            <button type="button" onClick={onDelete} style={{ ...sx.bsm(C.red), padding: "8px 14px", fontSize: 12 }}>
              🗑 {t("profile.delete_btn","Löschen")}
            </button>
          ) : <span />}
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={onClose} style={{ ...sx.bsm(C.textDim), padding: "8px 14px", fontSize: 12 }}>
              {t("dialog.cancel","Abbrechen")}
            </button>
            <button type="button" onClick={submit} disabled={!name.trim()}
              style={{ ...sx.btn(C.amberBright), padding: "8px 18px", fontSize: 12, opacity: name.trim() ? 1 : 0.5 }}>
              {isEdit ? t("profile.save_btn","Speichern") : t("profile.create_btn","Anlegen")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
