import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

/**
 * ProfileContext — top-level user/profile separation.
 *
 * Purpose: allow multiple users to share one device (1 tablet at the table)
 * without seeing each other's data. Each profile has its own isolated slice
 * of localStorage (chars, notes, combat-state, etc.) via usePersist key
 * prefixing.
 *
 * Storage keys (NOT profile-prefixed — start with `__` so usePersist passes
 * them through verbatim):
 *   __profiles_v1        → list of {id, name, icon}
 *   __active_profile_v1  → id of currently-active profile
 *
 * Default profile: id="default", no key-prefix → existing users' data is
 * automatically theirs (backwards compatible). Additional profiles get
 * `p_<id>_<key>` namespaces.
 */
const PROFILES_KEY = "__profiles_v1";
const ACTIVE_KEY   = "__active_profile_v1";
const DEFAULT_PROFILE = { id: "default", name: "Standard", icon: "🎲" };

const ProfileContext = createContext(null);

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch (_) {
    return fallback;
  }
}
function writeJson(key, value) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}

export function useProfile() {
  return useContext(ProfileContext);
}

// Validate a single profile object — drops anything malformed.
function validProfile(p) {
  return p && typeof p === "object" && typeof p.id === "string" && p.id.length > 0;
}
function sanitizeList(raw) {
  if (!Array.isArray(raw)) return [DEFAULT_PROFILE];
  const cleaned = raw.filter(validProfile).map(p => ({
    id: String(p.id).slice(0, 64),
    name: (typeof p.name === "string" ? p.name : "Profil").slice(0, 60) || "Profil",
    icon: (typeof p.icon === "string" ? p.icon : "🧙").slice(0, 8) || "🧙",
  }));
  // Always guarantee default profile is present so usePersist's default-path works
  if (!cleaned.some(p => p.id === DEFAULT_PROFILE.id)) cleaned.unshift(DEFAULT_PROFILE);
  return cleaned.length ? cleaned : [DEFAULT_PROFILE];
}

export function ProfileProvider({ children }) {
  // Initial state: load synchronously from localStorage so the first
  // render of children sees the correct profile (avoids flicker / wrong-key fetch).
  // Wrapped in try/catch — any throw here would brick the entire app at boot,
  // and the user would have no way to recover without dev-tools.
  const [profiles, setProfilesState] = useState(() => {
    try {
      const list = readJson(PROFILES_KEY, [DEFAULT_PROFILE]);
      return sanitizeList(list);
    } catch (_) {
      return [DEFAULT_PROFILE];
    }
  });
  const [activeId, setActiveIdState] = useState(() => {
    try {
      const stored = readJson(ACTIVE_KEY, DEFAULT_PROFILE.id);
      return typeof stored === "string" && stored.length ? stored : DEFAULT_PROFILE.id;
    } catch (_) {
      return DEFAULT_PROFILE.id;
    }
  });

  // Defensive: if active profile got deleted out-of-band, fall back to first.
  const active = (Array.isArray(profiles) && (profiles.find(p => p?.id === activeId) || profiles[0])) || DEFAULT_PROFILE;
  const effectiveId = active.id;

  // Persist whenever changed
  useEffect(() => { writeJson(PROFILES_KEY, profiles); }, [profiles]);
  useEffect(() => { writeJson(ACTIVE_KEY, effectiveId); }, [effectiveId]);

  const setProfiles = useCallback((updaterOrValue) => {
    setProfilesState(prev => typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue);
  }, []);

  const setActiveId = useCallback((id) => setActiveIdState(id), []);

  const addProfile = useCallback((data) => {
    const id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const profile = {
      id,
      name: (data?.name || "Profil").slice(0, 40),
      icon: (data?.icon || "🧙").slice(0, 4),
    };
    setProfilesState(prev => [...prev, profile]);
    setActiveIdState(id);
    return profile;
  }, []);

  const updateProfile = useCallback((id, patch) => {
    setProfilesState(prev => prev.map(p => p.id === id ? {
      ...p,
      name: (patch.name ?? p.name).slice(0, 40),
      icon: (patch.icon ?? p.icon).slice(0, 4),
    } : p));
  }, []);

  /**
   * Delete a profile. Clears all its prefixed localStorage keys.
   * Refuses to delete the default profile or the last remaining profile.
   * Returns true on success, false on refusal.
   */
  const deleteProfile = useCallback((id) => {
    if (id === DEFAULT_PROFILE.id) return false;
    let removed = false;
    setProfilesState(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(p => p.id !== id);
      if (next.length === prev.length) return prev;
      removed = true;
      // Clean up the profile's namespaced localStorage entries.
      try {
        const prefix = `p_${id}_`;
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) toRemove.push(k);
        }
        for (const k of toRemove) localStorage.removeItem(k);
      } catch (_) {}
      return next;
    });
    if (removed) {
      setActiveIdState(curId => curId === id ? (DEFAULT_PROFILE.id) : curId);
    }
    return removed;
  }, []);

  const value = useMemo(() => ({
    profiles,
    active,
    activeId: effectiveId,
    isDefault: effectiveId === DEFAULT_PROFILE.id,
    setActiveId,
    addProfile,
    updateProfile,
    deleteProfile,
    setProfiles,
  }), [profiles, active, effectiveId, setActiveId, addProfile, updateProfile, deleteProfile, setProfiles]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * Compute the effective storage key for the active profile.
 * Default profile uses the raw key (backwards compat); others get `p_<id>_<key>`.
 * Keys starting with `__` are global (e.g. profile-list itself) — never prefixed.
 */
export function profileKeyFor(activeId, rawKey) {
  if (!rawKey) return rawKey;
  if (rawKey.startsWith("__")) return rawKey;
  if (!activeId || activeId === DEFAULT_PROFILE.id) return rawKey;
  return `p_${activeId}_${rawKey}`;
}
