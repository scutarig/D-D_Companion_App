import { useState, useEffect, useCallback, useRef } from "react";

// Unified storage: Tauri/Capacitor window.storage if available, else localStorage
const store = {
  get: async (key) => {
    if (typeof window !== "undefined" && window.storage) return window.storage.get(key);
    try {
      const v = localStorage.getItem(key);
      return v !== null ? { value: v } : null;
    } catch (e) { return null; }
  },
  set: (key, val) => {
    if (typeof window !== "undefined" && window.storage) { window.storage.set(key, val); return; }
    try { localStorage.setItem(key, val); } catch (e) {
      if (typeof console !== "undefined") console.warn("[usePersist] storage write failed for", key, e);
    }
  },
};

export function usePersist(key, def) {
  const [v, setRaw] = useState(def);
  const [rdy, setRdy] = useState(false);
  // readyRef breaks the race: set() calls before the async load finishes are
  // buffered (no premature persist of the default) and replayed once ready.
  const readyRef = useRef(false);
  const pendingRef = useRef(null);
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
    readyRef.current = false;
    pendingRef.current = null;
    setRaw(Array.isArray(def) ? [...def] : typeof def === "object" && def !== null ? { ...def } : def);
    setRdy(false);
    let cancelled = false;
    (async () => {
      let loaded = null;
      try {
        const r = await store.get(key);
        if (r?.value) loaded = JSON.parse(r.value);
      } catch (e) {}
      if (cancelled || keyRef.current !== key) return;
      // Apply any pending update on top of loaded value, then persist once.
      let base = loaded !== null ? loaded : (Array.isArray(def) ? [...def] : typeof def === "object" && def !== null ? { ...def } : def);
      if (pendingRef.current) {
        for (const u of pendingRef.current) base = typeof u === "function" ? u(base) : u;
        pendingRef.current = null;
        store.set(key, JSON.stringify(base));
      }
      setRaw(base);
      readyRef.current = true;
      setRdy(true);
    })();
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line

  const set = useCallback((u) => {
    if (!readyRef.current) {
      if (!pendingRef.current) pendingRef.current = [];
      pendingRef.current.push(u);
      setRaw(prev => typeof u === "function" ? u(prev) : u);
      return;
    }
    setRaw(prev => {
      const next = typeof u === "function" ? u(prev) : u;
      store.set(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [v, set, rdy];
}
