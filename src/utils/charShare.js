// ── Legacy character share decoder ─────────────────────────────────────────
// The QR-share encoder and its UI were removed because the payload skipped
// per-character sidecar data (spells, slots, companions, …) — full backup is
// now the only supported transfer path. What's left here is the DECODE side
// so URLs like `<origin>/#share=<base64>` that older versions of the app
// already handed out to players still import correctly on receive.
//
// The base64 encoding uses a URL-safe alphabet (`-` and `_` instead of `+`
// and `/`) with the padding stripped, matching what the old encoder produced.

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
