// ── Character share encoding/decoding ──────────────────────────────────────
// Encode a character as a URL-safe base64 string so it can be embedded in a
// share URL (and rendered as QR code). Uses gzip-like compaction via JSON
// minification; raw base64 keeps things simple, no external compression dep.
//
// URL format:  <origin>/#share=<base64>
// Max practical QR payload at error-correction-L: ~2900 chars. A typical full
// character JSON is ~1-3 KB minified → base64 adds ~33% → fits comfortably.

const MAGIC = "dndchar:v1:";

const fromBase64Url = (b64u) => {
  const padded = b64u.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - b64u.length % 4) % 4);
  return decodeURIComponent(escape(atob(padded)));
};

/** Decode a payload string → char object. Returns null if invalid.
 *  Kept for backwards compatibility with URL-hash share links from earlier
 *  versions of the app. The encoding UI (ShareCharDialog / QR button) was
 *  removed because the incomplete payload skipped per-char extras. */
export function decodeChar(payload) {
  if (!payload || typeof payload !== "string") return null;
  try {
    const str = fromBase64Url(payload);
    if (!str.startsWith(MAGIC)) return null;
    const json = str.slice(MAGIC.length);
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || !parsed.name) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

/** Extract payload from window.location.hash (#share=...). Returns null if none. */
export function extractShareFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || "";
  const m = hash.match(/[#&]share=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Clear the #share=… fragment from the URL (after import). */
export function clearShareHash() {
  if (typeof window === "undefined") return;
  if (!window.location.hash) return;
  const cleaned = window.location.hash.replace(/[#&]share=[^&]+/, "").replace(/^#+/, "#");
  const newHash = cleaned === "#" ? "" : cleaned;
  history.replaceState(null, "", window.location.pathname + window.location.search + newHash);
}
