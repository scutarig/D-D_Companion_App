import { useEffect } from "react";
import { usePersist } from "./usePersist.js";
import { calculateTotalLevel, createClassEntry, getClassHd } from "../utils/multiclass.js";
import { getPB } from "../utils/helpers.js";
import { applyClassFeatures } from "../utils/classFeatures.js";
import { applySubclasses } from "../utils/subclasses.js";

/**
 * useMulticlass(charId, char, setChar)
 *
 * Manages the classes[] array persisted separately from the char object.
 * Auto-migrates from legacy single-class (char.klass + char.level).
 * Keeps char.level and char.klass in sync via setChar.
 */
export function useMulticlass(charId, char, setChar) {
  const [classes, setClassesPersist, rdy] = usePersist(`multiclass_v1_${charId}`, []);

  // Auto-migrate from single-class char once storage is ready
  useEffect(() => {
    if (!rdy) return;
    if (classes.length === 0 && char?.klass) {
      setClassesPersist([createClassEntry(char.klass, char.level || 1)]);
    }
  }, [rdy, charId]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalLevel = calculateTotalLevel(classes);
  const pb = getPB(totalLevel);

  /** Push updated classes to persist store and sync char fields */
  const commit = (newClasses) => {
    setClassesPersist(newClasses);
    if (!setChar) return;
    const total = calculateTotalLevel(newClasses);
    setChar(prev => {
      let next = {
        ...prev,
        level: total,
        klass:  newClasses[0]?.name || prev.klass,
        hd:     newClasses[0] ? getClassHd(newClasses[0].name) : prev.hd,
      };
      next = applyClassFeatures(next, newClasses);
      next = applySubclasses(next, newClasses);
      return next;
    });
  };

  /** Add a new class at level 1 */
  const addKlass = (name) => {
    if (!name) return;
    if (classes.some(c => c.name === name)) return;
    if (totalLevel >= 20) return;
    commit([...classes, createClassEntry(name, 1)]);
  };

  /** Adjust level of an existing class by delta (+1 / -1) */
  const updateLevel = (name, delta) => {
    const updated = classes.map(c => {
      if (c.name !== name) return c;
      const newLvl = c.level + delta;
      if (newLvl < 1) return c;                    // floor at 1
      const potentialTotal = classes.reduce((s, cl) => s + (cl.name === name ? newLvl : cl.level), 0);
      if (potentialTotal > 20) return c;            // cap at 20
      return { ...c, level: newLvl };
    });
    commit(updated);
  };

  /** Remove a class (must keep at least 1) */
  const removeKlass = (name) => {
    if (classes.length <= 1) return;
    commit(classes.filter(c => c.name !== name));
  };

  /**
   * Set (or clear) a subclass for a given class name.
   * Updates char.subclasses and recomputes subclassFeatures.
   */
  const setSubclass = (className, subclassName) => {
    if (!setChar) return;
    setChar(prev => {
      const newSubclasses = { ...(prev.subclasses || {}), [className]: subclassName || "" };
      const next = { ...prev, subclasses: newSubclasses };
      return applySubclasses(next, classes);
    });
  };

  return {
    classes,
    totalLevel,
    pb,
    isReady: rdy,
    addKlass,
    updateLevel,
    removeKlass,
    setSubclass,
  };
}
