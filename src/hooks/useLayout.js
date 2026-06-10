import { useState, useEffect } from "react";

/**
 * useLayout — detects screen layout mode
 * Returns: "desktop" | "portrait" | "landscape"
 *
 * - "desktop":   wide screen (≥900px wide)
 * - "portrait":  narrow/tablet portrait (width < 900, width ≤ height)
 *                — includes S7 FE Portrait (800×1280)
 * - "landscape": mobile/tablet landscape (width > height, height < 520px)
 *
 * NOTE: 900px breakpoint matches App.jsx mobile-nav threshold so
 * Sidebar/Mobile-Strip/Bottom-Nav all flip at the same point.
 */
export function useLayout() {
  const getLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= 900) return "desktop";
    if (w > h && h < 520) return "landscape";
    // Anything narrower than 900 with w ≤ h is portrait (covers S7 FE 800w)
    return "portrait";
  };

  const [layout, setLayout] = useState(getLayout);

  useEffect(() => {
    const fn = () => setLayout(getLayout());
    window.addEventListener("resize", fn);
    window.addEventListener("orientationchange", fn);
    return () => {
      window.removeEventListener("resize", fn);
      window.removeEventListener("orientationchange", fn);
    };
  }, []);

  return layout;
}
