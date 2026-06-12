import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { C, sx } from "../constants/theme.js";
import Modal from "../components/Modal.jsx";
import { useI18n } from "../i18n/index.js";

/**
 * Themed replacement for window.alert / window.confirm / window.prompt.
 *
 * Returned API:
 *   const { alert, confirm, prompt } = useDialog();
 *   await alert("Message");
 *   const ok = await confirm("Delete this?", { title: "Bestätigen", danger: true });
 *   const name = await prompt("Name?", { defaultValue: "untitled" });
 *
 * All return Promises so callers can `await` them.
 *   alert  → undefined
 *   confirm → true / false
 *   prompt → string (entered value) or null (cancelled)
 */
const DialogContext = createContext(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    return {
      alert: (msg) => { window.alert(msg); return Promise.resolve(); },
      confirm: (msg) => Promise.resolve(window.confirm(msg)),
      prompt: (msg, opts = {}) => Promise.resolve(window.prompt(msg, opts.defaultValue ?? "")),
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

  const prompt = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({ kind: "prompt", message, options, resolve, input: options.defaultValue ?? "" });
    });
  }, []);

  const setInput = useCallback((val) => {
    setState((cur) => cur ? { ...cur, input: val } : cur);
  }, []);

  const api = useMemo(() => ({ alert, confirm, prompt }), [alert, confirm, prompt]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      {state && (
        <Modal
          open
          onClose={() => close(state.kind === "confirm" ? false : (state.kind === "prompt" ? null : undefined))}
          title={state.options.title || (
            state.kind === "confirm" ? t("dialog.confirm_title","Bestätigen") :
            state.kind === "prompt"  ? t("dialog.prompt_title","Eingabe") :
            t("dialog.notice_title","Hinweis")
          )}
          maxWidth={420}
          closeOnBackdrop={state.kind === "alert"}
        >
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap", margin: "4px 0 14px" }}>
            {state.message}
          </p>
          {state.kind === "prompt" && (
            <input
              autoFocus
              value={state.input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") close(state.input);
                if (e.key === "Escape") close(null);
              }}
              placeholder={state.options.placeholder || ""}
              maxLength={state.options.maxLength || 200}
              style={{ ...sx.inp, marginBottom: 14 }}
            />
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {(state.kind === "confirm" || state.kind === "prompt") && (
              <button
                type="button"
                onClick={() => close(state.kind === "prompt" ? null : false)}
                style={{ ...sx.bsm(C.textDim), padding: "8px 14px", fontSize: 12 }}
              >
                {state.options.cancelLabel || t("dialog.cancel","Abbrechen")}
              </button>
            )}
            <button
              type="button"
              autoFocus={state.kind !== "prompt"}
              onClick={() => close(
                state.kind === "confirm" ? true :
                state.kind === "prompt"  ? state.input :
                undefined
              )}
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
