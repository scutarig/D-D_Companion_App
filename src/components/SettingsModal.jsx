import { useEffect } from "react";
import { C, sx, FH } from "../constants/theme.js";
import Modal from "./Modal.jsx";
import { usePersist } from "../hooks/usePersist.js";
import { useI18n } from "../i18n/index.js";

/**
 * SettingsModal — user-facing accessibility + preferences panel opened
 * from the top-nav ⚙ button.
 *
 * State lives in a single usePersist("user_settings_v1", …) blob. Changes
 * are applied globally by toggling data-attributes on <html>; CSS rules in
 * index.css react to those and cascade into every screen.
 *
 * Font-scale is applied via `data-font-scale="s|m|l"` on <html> and a
 * scoped `main { zoom: … }` rule in index.css. Confining zoom to the
 * content area means nav / sidebar / modal chrome stay at native size
 * and breakpoints don't shift, which was the failure mode of the earlier
 * `html.style.zoom` and `html.style.fontSize` attempts.
 *
 * The applyUserSettings hook is exported so App can call it once at mount
 * even when the modal is closed.
 */

export const DEFAULT_SETTINGS = {
  fontScale: "m",      // "s" | "m" | "l" — applied via CSS to <main> only
  highContrast: false,
  colorblind: false,
  reducedMotion: false,
};

export function useUserSettings() {
  const [settings, setSettings] = usePersist("user_settings_v1", DEFAULT_SETTINGS);
  useEffect(() => {
    const html = document.documentElement;
    // Clear any legacy font-scale artefacts from prior builds so the
    // previous html-level zoom / fontSize approach can't leak in.
    html.style.zoom = "";
    html.style.fontSize = "";
    html.style.removeProperty("--ui-scale");
    // Font-scale is a data-attribute; CSS scopes `zoom` to <main> so
    // nav / sidebar / modals stay untouched.
    html.dataset.fontScale = ["s","m","l"].includes(settings.fontScale) ? settings.fontScale : "m";
    html.dataset.a11yHighContrast = settings.highContrast ? "true" : "false";
    html.dataset.a11yColorblind   = settings.colorblind   ? "true" : "false";
    html.dataset.a11yReducedMotion = settings.reducedMotion ? "true" : "false";
  }, [settings.fontScale, settings.highContrast, settings.colorblind, settings.reducedMotion]);
  return [settings, setSettings];
}

export default function SettingsModal({ open, onClose }) {
  const { t, lang, setLang } = useI18n();
  const [settings, setSettings] = useUserSettings();

  const currentScale = ["s","m","l"].includes(settings.fontScale) ? settings.fontScale : "m";

  const FontChip = ({ id, label }) => {
    const on = currentScale === id;
    return (
      <button type="button" onClick={() => patch("fontScale", id)}
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          border: `1px solid ${on ? C.gold + "aa" : C.border}`,
          background: on ? `${C.gold}22` : "transparent",
          color: on ? C.gold : C.text,
          fontSize: 12,
          fontFamily: FH,
          fontWeight: 700,
          cursor: "pointer",
        }}>
        {label}
      </button>
    );
  };

  const LangChip = ({ id, label }) => {
    const on = lang === id;
    return (
      <button type="button" onClick={() => setLang(id)}
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          border: `1px solid ${on ? C.blueBright + "aa" : C.border}`,
          background: on ? `${C.blueBright}22` : "transparent",
          color: on ? C.blueBright : C.text,
          fontSize: 11,
          fontFamily: FH,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor: "pointer",
        }}>
        {label}
      </button>
    );
  };

  const patch = (k, v) => setSettings((p) => ({ ...(p || DEFAULT_SETTINGS), [k]: v }));
  const reset = () => setSettings(DEFAULT_SETTINGS);

  const Row = ({ label, hint, children }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: C.textBright, fontWeight: 600 }}>{label}</div>
        {hint && <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ on, onChange, colorOn = C.greenBright }) => (
    <button type="button" onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{
        width: 46, height: 24,
        borderRadius: 12,
        border: `1px solid ${on ? colorOn + "88" : C.border}`,
        background: on ? `${colorOn}33` : C.surface,
        cursor: "pointer",
        position: "relative",
        transition: "background .15s, border-color .15s",
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 24 : 2,
        width: 18, height: 18,
        borderRadius: "50%",
        background: on ? colorOn : C.textDim,
        transition: "left .15s, background .15s",
      }} />
    </button>
  );

  return (
    <Modal open={open} onClose={onClose} title={`⚙ ${t("settings.title","Einstellungen")}`} maxWidth={420}>
      <Row label={t("settings.language","Sprache")}
        hint={t("settings.language_hint","Wechselt die Oberfläche zwischen Deutsch und Englisch.")}>
        <div style={{ display: "flex", gap: 6 }}>
          <LangChip id="de" label="DE" />
          <LangChip id="en" label="EN" />
        </div>
      </Row>

      <Row label={t("settings.font_size","Schriftgröße")}
        hint={t("settings.font_size_hint","Skaliert nur den Inhaltsbereich — Nav & Menüs bleiben unverändert.")}>
        <div style={{ display: "flex", gap: 4 }}>
          <FontChip id="s" label={t("settings.font_s","S")} />
          <FontChip id="m" label={t("settings.font_m","M")} />
          <FontChip id="l" label={t("settings.font_l","L")} />
        </div>
      </Row>

      <Row label={t("settings.high_contrast","Hoher Kontrast")}
        hint={t("settings.high_contrast_hint","Verstärkt Text-Kontrast auf dunklem Hintergrund.")}>
        <Toggle on={settings.highContrast} onChange={(v) => patch("highContrast", v)} colorOn={C.gold} />
      </Row>

      <Row label={t("settings.colorblind","Farbenblind-freundlich")}
        hint={t("settings.colorblind_hint","Passt Rot/Grün an (Deuteranopie-safe Palette).")}>
        <Toggle on={settings.colorblind} onChange={(v) => patch("colorblind", v)} colorOn={C.amberBright} />
      </Row>

      <Row label={t("settings.reduced_motion","Reduzierte Animationen")}
        hint={t("settings.reduced_motion_hint","Blendet Transitions und Fanfaren aus.")}>
        <Toggle on={settings.reducedMotion} onChange={(v) => patch("reducedMotion", v)} colorOn={C.blueBright} />
      </Row>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8 }}>
        <button type="button" onClick={reset}
          style={{ ...sx.bsm(C.textDim), fontSize: 11, padding: "6px 12px" }}>
          ↺ {t("settings.reset","Zurücksetzen")}
        </button>
        <button type="button" onClick={onClose}
          style={{ ...sx.btn(C.gold), fontSize: 12 }}>
          {t("modal.close","Schließen")}
        </button>
      </div>
    </Modal>
  );
}
