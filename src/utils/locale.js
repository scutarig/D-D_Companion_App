/**
 * Locale-Helper für lang-aware Date/Number-Formatting.
 *
 * Nutze diese Helper anstatt hardcoded toLocaleDateString("de") etc.
 * Liest lang aus localStorage damit auch Non-React-Code es nutzen kann.
 */

const STORAGE_KEY = "app_lang_v1";

/** Aktuelle Sprache aus localStorage. Default: "de". */
export function currentLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "en" ? "en" : "de";
  } catch {
    return "de";
  }
}

/** BCP-47-Locale-String für die aktuelle Sprache. */
export function currentLocale() {
  return currentLang() === "en" ? "en-US" : "de-DE";
}

/** Gibt Locale für eine spezifische lang (React-Komponenten). */
export function localeFor(lang) {
  return lang === "en" ? "en-US" : "de-DE";
}

/** Date.toLocaleDateString mit aktueller Sprache. */
export function fmtDate(date, options) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(currentLocale(), options);
}

/** Date.toLocaleTimeString mit aktueller Sprache. */
export function fmtTime(date, options) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString(currentLocale(), options);
}

/** Date.toLocaleString mit aktueller Sprache. */
export function fmtDateTime(date, options) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString(currentLocale(), options);
}

/** Number.toLocaleString mit aktueller Sprache (z.B. für XP, Coins). */
export function fmtNumber(num, options) {
  const n = typeof num === "number" ? num : Number(num);
  if (Number.isNaN(n)) return String(num);
  return n.toLocaleString(currentLocale(), options);
}
