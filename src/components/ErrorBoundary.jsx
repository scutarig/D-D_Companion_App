import { Component } from "react";
import { C, sx, F } from "../constants/theme.js";
import { t } from "../i18n/index.js";

/**
 * App-wide error boundary. Catches render errors from any descendant
 * component and shows a recovery UI instead of unmounting the entire tree.
 *
 * Provides two recovery paths:
 *  1. Soft reload (re-tries with same state — works if the error was transient)
 *  2. Emergency reset (clears localStorage + unregisters SW + reloads — for
 *     bricked-state cases where the saved data itself triggers the crash on
 *     every render, so a plain reload loops back to the same error)
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null, resetting: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    if (typeof console !== "undefined" && console.error) {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  handleHardReset = async () => {
    if (typeof window === "undefined") return;
    if (this.state.resetting) return;
    const confirmed = window.confirm(
      t("err.confirm_reset", "ALLE lokalen Daten löschen (Charaktere, Notizen, Profile, Combat-State)?\nDies kann nicht rückgängig gemacht werden.\nFortfahren?")
    );
    if (!confirmed) return;
    this.setState({ resetting: true });
    try {
      try { localStorage.clear(); } catch (_) {}
      try { sessionStorage.clear(); } catch (_) {}
      if ("serviceWorker" in navigator) {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        } catch (_) {}
      }
      if ("caches" in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        } catch (_) {}
      }
    } finally {
      // Bust URL so we don't restore from bf-cache with the broken state
      const url = window.location.pathname + "?reset=" + Date.now();
      window.location.replace(url);
    }
  };

  render() {
    const { error, info, resetting } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{ ...sx.app, padding: 24, justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...sx.card, maxWidth: 560, width: "100%", borderColor: `${C.red}55` }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>🐉💥</div>
          <h2 style={{ ...sx.ct, color: C.redBright, fontSize: 16, borderBottom: `1px solid ${C.red}44`, textAlign: "center" }}>
            {t("err.title", "Etwas ist schiefgelaufen")}
          </h2>
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.5, textAlign: "center", margin: "12px 0 16px" }}>
            {t("err.body", "Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu.")}
          </p>
          <button type="button" onClick={this.handleReload} disabled={resetting}
            style={{ ...sx.btn(C.redBright), width: "100%", padding: "10px 14px", fontSize: 13, marginBottom: 8 }}>
            {t("err.reload_btn", "🔄 Neu laden")}
          </button>
          <p style={{ color: C.textDim, fontSize: 11, lineHeight: 1.4, textAlign: "center", margin: "10px 0 6px" }}>
            {t("err.reset_hint", "Wenn der Fehler nach dem Neuladen wieder erscheint, hilft ein Reset der lokalen Daten:")}
          </p>
          <button type="button" onClick={this.handleHardReset} disabled={resetting}
            style={{
              width: "100%", padding: "10px 14px", fontSize: 12,
              background: "transparent",
              border: `1px solid ${C.amberBright}55`,
              borderRadius: 8,
              color: C.amberBright,
              fontFamily: F, fontWeight: 700,
              cursor: resetting ? "wait" : "pointer",
              letterSpacing: 0.3,
              opacity: resetting ? 0.6 : 1,
            }}>
            {resetting
              ? t("err.resetting", "Setze zurück…")
              : `🧹 ${t("err.reset_btn", "Alle lokalen Daten löschen + neu laden")}`}
          </button>
          {error && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: "pointer", color: C.textDim, fontFamily: F, fontSize: 11 }}>
                {t("err.details_summary", "Technische Details")}
              </summary>
              <pre style={{ background: "rgba(0,0,0,0.4)", color: C.textDim, padding: 10, borderRadius: 6, fontSize: 10, marginTop: 8, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {String(error?.message || error)}
                {info?.componentStack ? "\n" + info.componentStack : ""}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
