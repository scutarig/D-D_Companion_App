import { Component } from "react";
import { C, sx, FH, F } from "../constants/theme.js";
import { t } from "../i18n/index.js";

/**
 * App-wide error boundary. Catches render errors from any descendant
 * component and shows a recovery UI instead of unmounting the entire tree.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
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

  render() {
    const { error, info } = this.state;
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
          <button type="button" onClick={this.handleReload} style={{ ...sx.btn(C.redBright), width: "100%", padding: "10px 14px", fontSize: 13 }}>
            {t("err.reload_btn", "🔄 Neu laden")}
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
