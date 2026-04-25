import { useState, useEffect } from "react";

/**
 * useLayout — detects screen layout mode
 * Returns: "desktop" | "portrait" | "landscape"
 *
 * - "desktop":   wide screen (≥900px wide, or small dimension ≥ 520px)
 * - "portrait":  narrow mobile in portrait (width < height, width < 768)
 * - "landscape": mobile/tablet in landscape (width > height, height < 520px)
 */
export function useLayout() {
  const getLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= 900) return "desktop";
    if (w > h && h < 520) return "landscape";
    if (w < 768) return "portrait";
    return "desktop";
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
