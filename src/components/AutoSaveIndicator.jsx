import { useEffect, useRef, useState } from "react";
import { C, FH } from "../constants/theme.js";
import { useI18n } from "../i18n/index.js";

/**
 * AutoSaveIndicator — floating "✓ Gesichert" pill that flashes in for
 * ~1.5 s after every persist. Listens for `dnd:persisted` events which
 * usePersist emits on every successful localStorage write, so any state
 * change picked up by the storage layer surfaces here without each
 * component having to opt in.
 *
 * Rapid consecutive writes (typing in an input, dragging a slider) are
 * debounced — the pill stays visible while writes keep coming and only
 * fades out ~1.2 s after the last one.
 */
export default function AutoSaveIndicator() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onPersist = () => {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 1200);
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
        right: 12,
        bottom: `calc(12px + env(safe-area-inset-bottom, 0px))`,
        zIndex: 9998,
        pointerEvents: "none",
        transition: "opacity .25s ease-out, transform .25s ease-out",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div
        style={{
          background: `${C.greenBright}22`,
          border: `1px solid ${C.greenBright}66`,
          color: C.greenBright,
          fontFamily: FH,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.6,
          padding: "5px 10px",
          borderRadius: 20,
          boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>✓</span>
        <span>{t("autosave.saved", "Gesichert")}</span>
      </div>
    </div>
  );
}
