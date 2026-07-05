// ── Backup / Restore ───────────────────────────────────────────────────────
// Collects everything the user has in localStorage into a portable JSON.
//
// Since the multi-profile system was removed, all data lives at the root
// namespace (no `p_<id>_…` prefix). We still skip keys that start with `__`
// (app-meta) and any legacy `p_…` orphans left behind by the previous
// profile system — those aren't part of the current account and would
// contaminate a fresh restore.

export const BACKUP_TYPE = "dnd-companion-profile"; // kept for backwards compat with older exports
export const BACKUP_VERSION = 2;

/**
 * Build a backup object containing ALL localStorage data (chars, notes,
 * combat-state, spells, slots, etc.). Ignores app-meta (`__…`) and any
 * orphaned profile-namespaced keys (`p_…`) from earlier app versions.
 */
export function buildProfileBackup() {
  const data = {};
  if (typeof window === "undefined") return wrapBackup(data);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("__")) continue; // app meta
    if (key.startsWith("p_")) continue; // legacy profile-scoped orphan

    const raw = localStorage.getItem(key);
    if (raw === null) continue;
    try { data[key] = JSON.parse(raw); }
    catch (_) { data[key] = raw; }
  }
  return wrapBackup(data);
}

function wrapBackup(data) {
  return {
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    stats: {
      chars: Array.isArray(data?.chars_v4) ? data.chars_v4.length : 0,
      notes: Array.isArray(data?.notes_v5) ? data.notes_v5.length : 0,
      totalKeys: Object.keys(data).length,
    },
    data,
  };
}

/**
 * Write backup.data into localStorage under the root namespace.
 * Existing keys are overwritten. Refuses anything that isn't our backup-type.
 * Returns { ok: boolean, written: number, error?: string }.
 */
export function restoreProfileBackup(backup) {
  if (!backup || backup.type !== BACKUP_TYPE) {
    return { ok: false, written: 0, error: "not-a-backup" };
  }
  if (typeof window === "undefined") return { ok: false, written: 0, error: "no-window" };

  let written = 0;
  for (const [rawKey, value] of Object.entries(backup.data || {})) {
    if (rawKey.startsWith("__")) continue;
    if (rawKey.startsWith("p_")) continue; // safety: never restore legacy prefixed keys
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(rawKey, serialized);
      written++;
    } catch (_) {}
  }
  return { ok: true, written };
}

/**
 * Auto-detect what kind of import payload we have.
 *   - "profile" → buildProfileBackup output
 *   - "char"    → legacy single-character JSON (has .name)
 *   - "unknown" → reject
 */
export function detectImportType(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "unknown";
  if (data.type === BACKUP_TYPE) return "profile";
  if (typeof data.name === "string" && data.name.trim()) return "char";
  return "unknown";
}
