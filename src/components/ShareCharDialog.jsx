import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { C, sx, FH } from "../constants/theme.js";
import Modal from "./Modal.jsx";
import { useI18n } from "../i18n/index.js";
import { shareUrlFor } from "../utils/charShare.js";

/**
 * ShareCharDialog — renders a QR code + copyable URL for the given char.
 * Recipient scans QR or opens URL → app auto-imports into their active profile.
 */
export default function ShareCharDialog({ open, char, onClose }) {
  const { t } = useI18n();
  const [dataUrl, setDataUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !char) { setDataUrl(""); setShareUrl(""); setCopied(false); setError(null); return; }
    let cancelled = false;
    setError(null);
    try {
      const url = shareUrlFor(char);
      setShareUrl(url);
      QRCode.toDataURL(url, {
        errorCorrectionLevel: "L",
        margin: 1,
        scale: 6,
        color: { dark: "#000000", light: "#ffffff" },
      }).then((d) => { if (!cancelled) setDataUrl(d); })
        .catch((err) => { if (!cancelled) setError(String(err?.message || err)); });
    } catch (e) {
      setError(String(e?.message || e));
    }
    return () => { cancelled = true; };
  }, [open, char]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch (_) { /* swallow — UI shows nothing-copied state */ }
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: char?.name || "D&D Char",
          text: t("share.system_share_text","D&D Companion Charakter"),
          url: shareUrl,
        });
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("share.title","Charakter teilen")}
      maxWidth={420}
    >
      <p style={{ color: C.text, fontSize: 12, lineHeight: 1.55, margin: "0 0 12px" }}>
        {t("share.intro","QR-Code mit dem Handy deines Mitspielers scannen — oder Link kopieren und schicken. Der Charakter wird in das aktuell aktive Profil importiert.")}
      </p>

      {error ? (
        <div style={{
          background: `${C.red}22`, border: `1px solid ${C.red}55`,
          color: C.redBright, fontSize: 12, padding: "10px 12px", borderRadius: 6,
          textAlign: "center",
        }}>
          ⚠ {t("share.error","QR-Code konnte nicht erstellt werden")}: {error}
        </div>
      ) : (
        <>
          <div style={{
            background: "#ffffff",
            padding: 14, borderRadius: 12,
            display: "flex", justifyContent: "center", alignItems: "center",
            margin: "0 auto 14px", width: "fit-content",
            minHeight: 200, minWidth: 200,
          }}>
            {dataUrl ? (
              <img src={dataUrl} alt={t("share.qr_alt","QR-Code")} style={{ display: "block", width: 200, height: 200 }} />
            ) : (
              <div style={{ color: "#666", fontSize: 11 }}>…</div>
            )}
          </div>

          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "6px 8px", fontSize: 10, color: C.textDim,
            fontFamily: "monospace", wordBreak: "break-all", marginBottom: 10,
            maxHeight: 60, overflowY: "auto",
          }}>
            {shareUrl}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleCopy} style={{
              ...sx.bsm(copied ? C.greenBright : C.tealBright),
              flex: 1, padding: "10px 12px", fontSize: 12,
            }}>
              {copied ? `✓ ${t("share.copied","Kopiert!")}` : `📋 ${t("share.copy_btn","Link kopieren")}`}
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button type="button" onClick={handleShare} style={{
                ...sx.btn(C.tealBright),
                flex: 1, padding: "10px 12px", fontSize: 12,
              }}>
                📤 {t("share.share_btn","Teilen")}
              </button>
            )}
          </div>
        </>
      )}

      <div style={{
        marginTop: 14, padding: "8px 12px",
        background: `${C.amberBright}10`, border: `1px solid ${C.amberBright}30`,
        borderRadius: 6, color: C.amberBright, fontSize: 11, lineHeight: 1.5,
      }}>
        ℹ {t("share.note","Der Charakter wird als Snapshot übertragen — spätere Änderungen werden NICHT synchronisiert.")}
      </div>
    </Modal>
  );
}
