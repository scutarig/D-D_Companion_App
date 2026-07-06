import { useEffect } from "react";
import { C, sx, FH } from "../constants/theme.js";
import Modal from "./Modal.jsx";
import { usePersist } from "../hooks/usePersist.js";
import { useI18n } from "../i18n/index.js";
import { useChar } from "../context/CharContext.jsx";
import { useDialog } from "../hooks/useDialog.jsx";
import { detectImportType, restoreProfileBackup } from "../utils/profileBackup.js";
import { sanitizeCharImport, MAX_FILE_BYTES } from "../utils/charImport.js";
import { newChar } from "../utils/helpers.js";

// Profile-backups (all chars + notes + worldbuilding) can legitimately be
// larger than a single character — allow up to 5 MB.
const MAX_PROFILE_BYTES = 5 * 1024 * 1024;

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
  theme: "dark",       // "dark" | "sepia" | "light" — applied via CSS filter on <html>
  startTab: "last",    // "last" or a tab id — where the app opens on boot
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
    // Theme via CSS filter — sepia keeps hues, light inverts. Dark = no-op.
    html.dataset.theme = ["dark","sepia","light"].includes(settings.theme) ? settings.theme : "dark";
    html.dataset.a11yHighContrast = settings.highContrast ? "true" : "false";
    html.dataset.a11yColorblind   = settings.colorblind   ? "true" : "false";
    html.dataset.a11yReducedMotion = settings.reducedMotion ? "true" : "false";
  }, [settings.fontScale, settings.theme, settings.highContrast, settings.colorblind, settings.reducedMotion]);
  return [settings, setSettings];
}

export default function SettingsModal({ open, onClose, onExportJSON, onExportPDF, canExportPDF = true, tabs = [], mode, onRequestModeSwitch }) {
  const { t, lang, setLang } = useI18n();
  const [settings, setSettings] = useUserSettings();
  const { setChars, setAid } = useChar();
  const { alert, confirm } = useDialog();

  // Unregister the PWA service-worker + wipe every Cache Storage entry and
  // reload. Used when a stale bundle refuses to update via HMR — e.g. after
  // a Vercel deploy where the SW is still serving the old chunks.
  const resetPWA = async () => {
    const ok = await confirm(
      t("settings.pwa_reset_confirm", "Cache & Service-Worker leeren?\n\nDeine gespeicherten Charaktere und Einstellungen bleiben erhalten. Die App lädt danach neu."),
      { title: t("settings.pwa_reset_title", "App-Cache leeren"), danger: true, okLabel: t("settings.pwa_reset_btn", "Leeren & neu laden") }
    );
    if (!ok) return;
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (_) { /* best-effort */ }
    window.location.reload();
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_PROFILE_BYTES) {
      alert(t("import.file_too_large","Datei zu groß (max 5 MB)."));
      return;
    }
    const raw = await file.text();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { alert(t("char.json_error","JSON konnte nicht gelesen werden.")); return; }

    const kind = detectImportType(parsed);

    if (kind === "profile") {
      const stats = parsed.stats || {};
      const msg = t("import.profile_confirm_simple",
        "Backup importieren?\n\n• Chars: {chars}\n• Notizen: {notes}\n• Gesamt-Keys: {keys}\n\n⚠ Deine aktuellen Daten werden ÜBERSCHRIEBEN.")
        .replace("{chars}", stats.chars ?? "?")
        .replace("{notes}", stats.notes ?? "?")
        .replace("{keys}", stats.totalKeys ?? "?");
      const ok = await confirm(msg, {
        title: t("import.profile_title","Backup importieren"),
        danger: true,
        okLabel: t("import.profile_ok","Importieren"),
      });
      if (!ok) return;
      const r = restoreProfileBackup(parsed);
      if (!r.ok) {
        alert(t("import.profile_error","Restore fehlgeschlagen: {err}").replace("{err}", r.error));
        return;
      }
      await alert(t("import.profile_done","✓ Backup importiert ({n} Keys). Die Seite wird neu geladen, um alle Daten zu aktivieren.").replace("{n}", r.written));
      window.location.reload();
      return;
    }

    if (kind === "char") {
      if (file.size > MAX_FILE_BYTES) {
        alert(t("char.file_too_large","Datei zu groß (max 512 KB)."));
        return;
      }
      const result = sanitizeCharImport(parsed, file.size);
      if (!result.ok) {
        alert(t("char.invalid_file","Ungültige Charakter-Datei."));
        return;
      }
      const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `imp-${Date.now()}`;
      const c = { ...newChar(id), ...result.data, id };
      setChars(prev => [...prev, c]);
      setAid(id);
      onClose?.();
      return;
    }

    alert(t("char.invalid_file","Ungültige Charakter-Datei."));
  };

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

  const currentTheme = ["dark","sepia","light"].includes(settings.theme) ? settings.theme : "dark";

  const ThemeChip = ({ id, label, tint }) => {
    const on = currentTheme === id;
    return (
      <button type="button" onClick={() => patch("theme", id)}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: `1px solid ${on ? tint + "aa" : C.border}`,
          background: on ? `${tint}22` : "transparent",
          color: on ? tint : C.text,
          fontSize: 11,
          fontFamily: FH,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: 0.3,
        }}>
        {label}
      </button>
    );
  };

  const isDM = mode === "dm";
  const ModeChip = ({ id, label, icon, tint }) => {
    const on = (id === "dm" && isDM) || (id === "player" && !isDM);
    return (
      <button type="button"
        onClick={() => { if (!on) onRequestModeSwitch?.(); }}
        aria-pressed={on}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: `1px solid ${on ? tint + "aa" : C.border}`,
          background: on ? `${tint}22` : "transparent",
          color: on ? tint : C.text,
          fontSize: 11,
          fontFamily: FH,
          fontWeight: 700,
          cursor: on ? "default" : "pointer",
          letterSpacing: 0.5,
          display: "flex", alignItems: "center", gap: 4,
        }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span>{label}</span>
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
      {onRequestModeSwitch && (
        <Row label={t("settings.mode","Modus")}
          hint={t("settings.mode_hint","Wechselt zwischen Spieler- und DM-Ansicht. Öffnet einen Bestätigungs-Dialog.")}>
          <div style={{ display: "flex", gap: 6 }}>
            <ModeChip id="player" label={t("settings.mode_player","Spieler")} icon="👤" tint={C.gold} />
            <ModeChip id="dm"     label={t("settings.mode_dm","DM")}         icon="🎲" tint={C.purpleBright} />
          </div>
        </Row>
      )}

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

      <Row label={t("settings.theme","Farbschema")}
        hint={t("settings.theme_hint","Dark = Standard, Sepia = warm für draußen, Light = hell.")}>
        <div style={{ display: "flex", gap: 4 }}>
          <ThemeChip id="dark"  label={t("settings.theme_dark","Dark")}   tint={C.blueBright} />
          <ThemeChip id="sepia" label={t("settings.theme_sepia","Sepia")} tint={C.amberBright} />
          <ThemeChip id="light" label={t("settings.theme_light","Light")} tint={C.textBright} />
        </div>
      </Row>

      <Row label={t("settings.start_tab","Start-Ansicht")}
        hint={t("settings.start_tab_hint","Welche Ansicht öffnet sich beim App-Start?")}>
        <select
          value={settings.startTab || "last"}
          onChange={(e) => patch("startTab", e.target.value)}
          style={{
            padding: "5px 8px", borderRadius: 6,
            border: `1px solid ${C.border}`,
            background: C.surface, color: C.text,
            fontFamily: FH, fontSize: 11,
            cursor: "pointer",
            minWidth: 140,
          }}
        >
          <option value="last">{t("settings.start_tab_last","Zuletzt geöffnet")}</option>
          {tabs.map(td => (
            <option key={td.id} value={td.id}>
              {td.icon} {td.labelKey ? t(td.labelKey, td.label) : td.label}
            </option>
          ))}
        </select>
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

      <div style={{ padding: "12px 0 4px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.textBright, fontWeight: 600, marginBottom: 4 }}>
          {t("settings.maintenance","Wartung")}
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>
          {t("settings.pwa_reset_hint","Nach einem App-Update noch die alte Version? Cache & Service-Worker leeren, deine Daten bleiben.")}
        </div>
        <button type="button" onClick={resetPWA}
          style={{ ...sx.bsm(C.amber), fontSize: 11, padding: "6px 12px" }}>
          🧹 {t("settings.pwa_reset","App-Cache leeren")}
        </button>
      </div>

      {(onExportJSON || onExportPDF) && (
        <div style={{ padding: "12px 0 4px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.textBright, fontWeight: 600, marginBottom: 4 }}>
            {t("settings.backup", "Sichern & Export")}
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>
            {t("settings.backup_hint", "Vollständiges Profil-Backup als JSON oder aktueller Charakter als druckbares PDF.")}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            {onExportJSON && (
              <button type="button" onClick={() => { onExportJSON(); onClose?.(); }}
                style={{ ...sx.btn(C.teal), fontSize: 12, flex: "1 1 140px" }}>
                ⬇️ {t("save.export_json", "JSON exportieren")}
              </button>
            )}
            {onExportPDF && (
              <button type="button" onClick={() => { onExportPDF(); onClose?.(); }}
                disabled={!canExportPDF}
                style={{ ...sx.btn(C.amber), fontSize: 12, flex: "1 1 140px", opacity: canExportPDF ? 1 : 0.4, cursor: canExportPDF ? "pointer" : "not-allowed" }}>
                📄 {t("save.export_pdf", "PDF drucken")}
              </button>
            )}
            <label style={{ ...sx.btn(C.blue), fontSize: 12, flex: "1 1 140px", cursor: "pointer", textAlign: "center", display: "inline-block" }}>
              📥 {t("save.import_json", "JSON importieren")}
              <input type="file" accept=".json,application/json" onChange={handleImport} style={{ display: "none" }} />
            </label>
          </div>
        </div>
      )}

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
