import { useState, useEffect, useCallback } from "react";

// Unified storage: Tauri/Capacitor window.storage if available, else localStorage
const store = {
  get: async (key) => {
    if (window.storage) return window.storage.get(key);
    try {
      const v = localStorage.getItem(key);
      return v !== null ? { value: v } : null;
    } catch (e) { return null; }
  },
  set: (key, val) => {
    if (window.storage) { window.storage.set(key, val); return; }
    try { localStorage.setItem(key, val); } catch (e) {}
  },
};

export function usePersist(key, def) {
  const [v, setRaw] = useState(def);
  const [rdy, setRdy] = useState(false);

  useEffect(() => {
    setRaw(Array.isArray(def) ? [...def] : typeof def === "object" && def !== null ? { ...def } : def);
    setRdy(false);
    (async () => {
      try {
        const r = await store.get(key);
        if (r?.value) setRaw(JSON.parse(r.value));
      } catch (e) {}
      setRdy(true);
    })();
  }, [key]); // eslint-disable-line

  const set = useCallback((u) => {
    setRaw(prev => {
      const next = typeof u === "function" ? u(prev) : u;
      store.set(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [v, set, rdy];
}
