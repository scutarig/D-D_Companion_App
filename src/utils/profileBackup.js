// ── Profile Backup / Restore ───────────────────────────────────────────────
// Collects everything for ONE profile from localStorage into a portable JSON.
//
// Default profile: raw keys (no prefix) — backwards compat with v1 exports.
// Custom profile:  `p_<id>_<rawKey>` keys are read, prefix stripped on export.
//
// Keys starting with `__` (e.g. __profiles_v1, __active_profile_v1) are GLOBAL
// and never included in a profile backup — that's correct, they belong to the
// app meta, not to any single profile.

export const BACKUP_TYPE = "dnd-companion-profile";
export const BACKUP_VERSION = 1;

/**
 * Build a profile backup object containing ALL localStorage data for the
 * given profile (chars, notes, combat-state, spells, slots, etc.).
 */
export function buildProfileBackup(profile) {
  if (!profile || !profile.id) throw new Error("buildProfileBackup: missing profile");
  const isDefault = profile.id === "default";
  const prefix = isDefault ? null : `p_${profile.id}_`;

  const data = {};
  if (typeof window === "undefined") return wrapBackup(profile, data);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("__")) continue; // global meta — not profile data

    let rawKey;
    if (isDefault) {
      if (key.startsWith("p_")) continue; // belongs to another profile
      rawKey = key;
    } else {
      if (!key.startsWith(prefix)) continue;
      rawKey = key.slice(prefix.length);
    }

    const raw = localStorage.getItem(key);
    if (raw === null) continue;
    // Store as parsed JSON when possible, else raw string
    try { data[rawKey] = JSON.parse(raw); }
    catch (_) { data[rawKey] = raw; }
  }
  return wrapBackup(profile, data);
}

function wrapBackup(profile, data) {
  return {
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: { id: profile.id, name: profile.name, icon: profile.icon },
    stats: {
      chars: Array.isArray(data?.chars_v4) ? data.chars_v4.length : 0,
      notes: Array.isArray(data?.notes_v5) ? data.notes_v5.length : 0,
      totalKeys: Object.keys(data).length,
    },
    data,
  };
}

/**
 * Write backup.data into localStorage under the given target profile namespace.
 * Existing keys are overwritten. Refuses anything that isn't our backup-type.
 * Returns { ok: boolean, written: number, error?: string }.
 */
export function restoreProfileBackup(backup, targetProfileId) {
  if (!backup || backup.type !== BACKUP_TYPE) {
    return { ok: false, written: 0, error: "not-a-backup" };
  }
  if (!targetProfileId) return { ok: false, written: 0, error: "no-target" };
  if (typeof window === "undefined") return { ok: false, written: 0, error: "no-window" };

  const isDefault = targetProfileId === "default";
  const prefix = isDefault ? "" : `p_${targetProfileId}_`;

  let written = 0;
  for (const [rawKey, value] of Object.entries(backup.data || {})) {
    if (rawKey.startsWith("__")) continue;
    if (rawKey.startsWith("p_")) continue; // safety: never accept double-prefixed
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(prefix + rawKey, serialized);
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
