import { useEffect } from "react";

/**
 * useScrollLock — locks body scroll when a modal/sheet is open.
 *
 * Usage:
 *   useScrollLock(modalOpen); // pass boolean
 *
 * Prevents background scroll on mobile when modals are visible.
 * Restores previous scroll-position after unlock.
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
