import { useEffect, useRef } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { useI18n } from "../i18n/index.js";

/**
 * Accessible modal wrapper.
 *
 * Provides: dialog role, aria-modal, ESC-to-close, focus-trap, restore-focus-on-close,
 * scroll-lock on body. Drop-in replacement for the inline-modal-divs scattered across
 * the codebase. Backdrop click closes by default.
 */
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 480,
  closeOnBackdrop = true,
  hideClose = false,
  describedById,
}) {
  const { t } = useI18n();
  const dialogRef = useRef(null);
  const lastFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusRef.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const node = dialogRef.current;
      if (!node) return;
      const candidates = node.querySelectorAll(FOCUSABLE);
      const first = candidates[0];
      if (first && first instanceof HTMLElement) first.focus();
      else node.focus();
    };
    const timer = setTimeout(focusFirst, 30);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const focusables = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (focusables.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      const last = lastFocusRef.current;
      if (last && typeof last.focus === "function") {
        try { last.focus(); } catch (_) {}
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const titleId = title ? "modal-title-" + Math.random().toString(36).slice(2, 8) : undefined;

  return (
    <div
      onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        animation: "dndFadeIn 0.15s ease-out",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedById}
        tabIndex={-1}
        style={{
          background: C.card,
          border: `1px solid ${C.borderBright}`,
          borderRadius: 14,
          padding: 18,
          maxWidth, width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
          outline: "none",
        }}
      >
        {(title || !hideClose) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
            {title && (
              <h2 id={titleId} style={{ ...sx.ct, margin: 0, fontSize: 14, borderBottom: "none", paddingBottom: 0 }}>
                {title}
              </h2>
            )}
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={t("modal.close", "Schließen")}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: C.textDim, fontSize: 18, lineHeight: 1, padding: "4px 8px",
                  fontFamily: FH,
                }}
              >✕</button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
