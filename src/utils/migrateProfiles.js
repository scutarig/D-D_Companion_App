// One-shot migration: consolidate the old multi-profile localStorage layout
// (`p_<profileId>_<key>` namespacing + `__profiles_v1` / `__active_profile_v1`
// meta) into the flat single-account layout the app uses now.
//
// Runs at boot, before React mounts. Idempotent via `__migration_v2_singleaccount`
// marker so it can't accidentally double-run.
//
// Behaviour:
//   1. If no `p_*_chars_v4` keys exist, just clear the two meta keys and mark done.
//   2. For each custom profile found, merge its chars into the default `chars_v4`
//      list, generating fresh IDs on collision. Every per-char sidecar key
//      (`tokens_used_<id>`, `spells_prep_<id>`, `companions_v1_<id>`, …) gets
//      rewritten under the new id.
//   3. Delete all `p_*` and profile-meta keys after the merge so the flat layout
//      is the only one left.

const MARKER = "__migration_v2_singleaccount";

const PER_CHAR_KEY_PATTERNS = [
  "tokens_used",
  "tokens_custom",
  "tokens_auto_used",
  "spells_prep",
  "spells_known",
  "multiclass_v1",
  "downtime_active",
  "downtime_history",
  "ws_form",
  "ws_hp",
  "ws_uses",
  "ws_poly",
  "ws_polyhp",
  "companions_v1",
];

function newCharId(existing) {
  const gen = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `mig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };
  let id = gen();
  while (existing.has(id)) id = gen();
  return id;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch (_) {
    return fallback;
  }
}

/** Discover profile ids by scanning `p_<id>_chars_v4` keys. */
function findCustomProfileIds() {
  const ids = new Set();
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith("p_")) continue;
    // Match anything ending in _chars_v4 so profile id can contain underscores.
    if (!k.endsWith("_chars_v4")) continue;
    const idPart = k.slice(2, -"_chars_v4".length);
    if (idPart) ids.add(idPart);
  }
  return [...ids];
}

/** Move every `p_<profileId>_<pattern>_<oldCharId>` key to `<pattern>_<newCharId>`. */
function rewritePerCharKeys(profileId, oldCharId, newCharId) {
  const prefix = `p_${profileId}_`;
  for (const pattern of PER_CHAR_KEY_PATTERNS) {
    const src = `${prefix}${pattern}_${oldCharId}`;
    const val = localStorage.getItem(src);
    if (val === null) continue;
    const dst = `${pattern}_${newCharId}`;
    // Only overwrite if the destination doesn't already exist so pre-existing
    // default-profile data always wins on collision.
    if (localStorage.getItem(dst) === null) {
      localStorage.setItem(dst, val);
    }
  }
}

/** Delete every localStorage key that starts with `p_` plus the profile meta. */
function purgeProfileKeys() {
  const toDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith("p_")) toDelete.push(k);
  }
  for (const k of toDelete) localStorage.removeItem(k);
  localStorage.removeItem("__profiles_v1");
  localStorage.removeItem("__active_profile_v1");
}

/**
 * Run the migration once. Safe to call on every boot: after the first run
 * the marker key short-circuits.
 * Returns a small report — currently only consumed by dev-tools / tests.
 */
export function migrateProfilesToSingle() {
  if (typeof window === "undefined") return { skipped: "no-window" };
  try {
    if (localStorage.getItem(MARKER) === "done") return { skipped: "already-migrated" };
  } catch (_) {
    return { skipped: "no-localstorage" };
  }

  const customIds = findCustomProfileIds();

  // No custom profiles ever created — still tidy up the leftover meta keys.
  if (customIds.length === 0) {
    purgeProfileKeys();
    try { localStorage.setItem(MARKER, "done"); } catch (_) {}
    return { customProfilesMerged: 0, charsAdded: 0 };
  }

  // Seed the merge with any chars already at the root namespace (default profile).
  let mergedChars = readJson("chars_v4", []);
  if (!Array.isArray(mergedChars)) mergedChars = [];
  const usedIds = new Set(mergedChars.map(c => c?.id).filter(x => x !== undefined && x !== null));

  let charsAdded = 0;

  for (const profileId of customIds) {
    const customChars = readJson(`p_${profileId}_chars_v4`, []);
    if (!Array.isArray(customChars)) continue;

    for (const oldChar of customChars) {
      if (!oldChar || typeof oldChar !== "object") continue;
      const oldId = oldChar.id;
      let newId = oldId;
      if (newId === undefined || newId === null || usedIds.has(newId)) {
        newId = newCharId(usedIds);
      }
      usedIds.add(newId);

      mergedChars.push({ ...oldChar, id: newId });
      charsAdded++;

      rewritePerCharKeys(profileId, oldId, newId);
    }
  }

  try { localStorage.setItem("chars_v4", JSON.stringify(mergedChars)); } catch (_) {}

  // If the previously-active char came from a custom profile it may no longer
  // be in scope; re-anchor the active-id to the first merged char.
  const activeId = readJson("chars_active_v4", null);
  const stillPresent = mergedChars.some(c => c?.id === activeId);
  if (!stillPresent && mergedChars.length > 0) {
    try { localStorage.setItem("chars_active_v4", JSON.stringify(mergedChars[0].id)); } catch (_) {}
  }

  purgeProfileKeys();

  try { localStorage.setItem(MARKER, "done"); } catch (_) {}

  return { customProfilesMerged: customIds.length, charsAdded };
}
