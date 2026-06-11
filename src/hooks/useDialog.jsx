import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { C, sx } from "../constants/theme.js";
import Modal from "../components/Modal.jsx";
import { useI18n } from "../i18n/index.js";

/**
 * Themed replacement for window.alert / window.confirm.
 *
 * Returned API:
 *   const { alert, confirm } = useDialog();
 *   await alert("Message");
 *   const ok = await confirm("Delete this?", { title: "Bestätigen", danger: true });
 *
 * Both return Promises so callers can `await` them. confirm() resolves to true/false.
 */
const DialogContext = createContext(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    // Safe fallback: degrade to native dialogs if provider missing.
    return {
      alert: (msg) => { window.alert(msg); return Promise.resolve(); },
      confirm: (msg) => Promise.resolve(window.confirm(msg)),
    };
  }
  return ctx;
}

export function DialogProvider({ children }) {
  const { t } = useI18n();
  const [state, setState] = useState(null);

  const close = useCallback((result) => {
    setState((cur) => {
      cur?.resolve?.(result);
      return null;
    });
  }, []);

  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({ kind: "alert", message, options, resolve });
    });
  }, []);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({ kind: "confirm", message, options, resolve });
    });
  }, []);

  const api = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      {state && (
        <Modal
          open
          onClose={() => close(state.kind === "confirm" ? false : undefined)}
          title={state.options.title || (state.kind === "confirm" ? t("dialog.confirm_title","Bestätigen") : t("dialog.notice_title","Hinweis"))}
          maxWidth={420}
          closeOnBackdrop={state.kind === "alert"}
        >
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap", margin: "4px 0 16px" }}>
            {state.message}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {state.kind === "confirm" && (
              <button
                type="button"
                onClick={() => close(false)}
                style={{ ...sx.bsm(C.textDim), padding: "8px 14px", fontSize: 12 }}
              >
                {state.options.cancelLabel || t("dialog.cancel","Abbrechen")}
              </button>
            )}
            <button
              type="button"
              autoFocus
              onClick={() => close(state.kind === "confirm" ? true : undefined)}
              style={{ ...sx.btn(state.options.danger ? C.redBright : C.tealBright), padding: "8px 18px", fontSize: 12 }}
            >
              {state.options.okLabel || t("dialog.ok","OK")}
            </button>
          </div>
        </Modal>
      )}
    </DialogContext.Provider>
  );
}
