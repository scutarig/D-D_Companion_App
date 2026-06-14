import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Service-worker registration. onNeedRefresh fires when a new SW is waiting —
// we accept immediately so the user always runs the latest build.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() { updateSW?.(true); },
  onOfflineReady() {},
});

// ── Lazy-chunk-load resilience ─────────────────────────────────────────────
// After a new deploy the OLD index.html still references hashed chunks that
// no longer exist on the CDN (new deploy emits new hashes). The next
// React.lazy() import then rejects with "Loading chunk … failed" and the
// ErrorBoundary fires. Auto-recover by forcing a hard reload — once.
window.addEventListener("error", (e) => {
  const msg = String(e?.message || "");
  if (/Loading chunk|Importing a module script failed|dynamically imported module/i.test(msg)) {
    if (!sessionStorage.getItem("__chunk_reload_attempted")) {
      sessionStorage.setItem("__chunk_reload_attempted", "1");
      window.location.reload();
    }
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e?.reason?.message || e?.reason || "");
  if (/Loading chunk|Importing a module script failed|dynamically imported module/i.test(msg)) {
    if (!sessionStorage.getItem("__chunk_reload_attempted")) {
      sessionStorage.setItem("__chunk_reload_attempted", "1");
      window.location.reload();
    }
  }
});
// Clear the guard after a successful boot pass so the next stale-chunk event
// can also recover.
window.addEventListener("load", () => {
  setTimeout(() => sessionStorage.removeItem("__chunk_reload_attempted"), 4000);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
