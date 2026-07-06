import { useEffect, useRef, useState } from "react";
import { C, FH } from "../constants/theme.js";
import { useI18n } from "../i18n/index.js";

/**
 * AutoSaveIndicator — small "✓ Gesichert" pill top-right that flashes in
 * after persists. Listens for `dnd:persisted` from usePersist, so any
 * state change picked up by the storage layer surfaces here without each
 * component having to opt in.
 *
 * Placed in the top-right corner because the bottom-right sits over the
 * mobile bottom-nav / thumb area and every tap there felt like it was
 * competing with a live indicator. Top-right is a rarely-clicked zone.
 *
 * Two-stage behaviour:
 *   - Rapid consecutive writes (typing, sliders) are debounced so the pill
 *     doesn't flicker — it stays on while writes keep coming and only
 *     starts its fade-out ~2.4 s after the last save.
 *   - A cooldown between successive appearances (2 s) throttles the case
 *     where isolated single saves fire in bursts, so the pill can't
 *     re-appear until it's been hidden for a moment.
 */
const HIDE_DELAY_MS = 2400;
const COOLDOWN_MS   = 2000;

export default function AutoSaveIndicator() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const timeoutRef      = useRef(null);
  const visibleRef      = useRef(false);
  const lastHiddenAtRef = useRef(0);

  useEffect(() => {
    const onPersist = () => {
      const now = Date.now();
      if (!visibleRef.current && now - lastHiddenAtRef.current < COOLDOWN_MS) return;
      visibleRef.current = true;
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        visibleRef.current = false;
        lastHiddenAtRef.current = Date.now();
        setVisible(false);
      }, HIDE_DELAY_MS);
    };
    window.addEventListener("dnd:persisted", onPersist);
    return () => {
      window.removeEventListener("dnd:persisted", onPersist);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        right: 10,
        top: `calc(8px + env(safe-area-inset-top, 0px))`,
        zIndex: 9998,
        pointerEvents: "none",
        transition: "opacity .25s ease-out, transform .25s ease-out",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
      }}
    >
      <div
        style={{
          background: `${C.greenBright}22`,
          border: `1px solid ${C.greenBright}66`,
          color: C.greenBright,
          fontFamily: FH,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.5,
          padding: "3px 8px",
          borderRadius: 20,
          boxShadow: `0 3px 10px rgba(0,0,0,0.35)`,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <span>✓</span>
        <span>{t("autosave.saved", "Gesichert")}</span>
      </div>
    </div>
  );
}
