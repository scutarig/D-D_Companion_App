import { useEffect, useRef } from "react";

/**
 * useTabSwipe — attaches touchstart / touchend listeners to a DOM element
 * (usually the mobile <main> container) and calls `onSwipe(direction)`
 * with 'left' | 'right' when the user horizontally swipes at least
 * `threshold` px without much vertical drift.
 *
 * Ignores swipes that start inside an input, textarea, select or
 * contenteditable element so typing inside forms doesn't hijack the
 * gesture, and swipes with vertical drift > verticalTolerance so
 * scrolling long lists stays smooth.
 */
export function useTabSwipe({ ref, enabled = true, onSwipe, threshold = 60, verticalTolerance = 40 }) {
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref?.current;
    if (!el) return undefined;

    const onStart = (e) => {
      const target = e.target;
      // Ignore gesture starts on interactive form controls
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (target?.isContentEditable) return;
      const t = e.touches?.[0];
      if (!t) return;
      startRef.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dy) > verticalTolerance) return;
      if (Math.abs(dx) < threshold) return;
      onSwipe(dx < 0 ? "left" : "right");
    };
    // Passive listeners — we're not preventing default scroll behaviour.
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    el.addEventListener("touchcancel", () => { startRef.current = null; }, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [ref, enabled, onSwipe, threshold, verticalTolerance]);
}
