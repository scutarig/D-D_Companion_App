// ── Character JSON Import Sanitizer ──────────────────────────────────────────
// Validates and sanitizes user-uploaded character JSON.
// Defense-in-depth: file-size cap + schema whitelist + type-coercion + range-clamp.

const MAX_FILE_BYTES = 512 * 1024; // 512 KB — realistic ceiling for a single character

// Whitelist of allowed top-level keys (matches newChar shape).
const ALLOWED_KEYS = new Set([
  "name","race","klass","level","background",
  "str","dex","con","int","wis","cha",
  "hp","maxHp","tempHp","ac","speed","initiative",
  "hd","hd_used","deathSaves","saves",
  "skills","spellAbility","inspiration",
  "traits","ideals","bonds","flaws","equipment","features","backstory",
  "inventory","actions",
  "gold","silver","copper","electrum","platinum",
  "raceTraits","bgTraits","classFeatures","subclassFeatures","feats",
  "languages","subclasses","activeConditions","attunedItems",
  "attunementChangedSinceRest","exhaustion","concentration",
]);

const STR_MAX = 200;
const TEXT_MAX = 4000;
const ARR_MAX = 200;
const OBJ_MAX = 50;

const clampInt = (v, lo, hi, def) => {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) return def;
  return Math.max(lo, Math.min(hi, n));
};

const cleanStr = (v, max = STR_MAX) => {
  if (typeof v !== "string") return "";
  return v.slice(0, max);
};

const cleanArr = (v, max = ARR_MAX) => {
  if (!Array.isArray(v)) return [];
  return v.slice(0, max);
};

const cleanObj = (v, max = OBJ_MAX) => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out = {};
  let i = 0;
  for (const k of Object.keys(v)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    if (i++ >= max) break;
    out[k] = v[k];
  }
  return out;
};

/**
 * Sanitize raw imported JSON into a safe character object.
 * Returns { ok: true, data } or { ok: false, error: "code" }.
 */
export function sanitizeCharImport(raw, fileBytes = 0) {
  if (fileBytes > MAX_FILE_BYTES) return { ok: false, error: "size" };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "shape" };
  if (typeof raw.name !== "string" || !raw.name.trim()) return { ok: false, error: "no_name" };

  const clean = {};
  for (const key of Object.keys(raw)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    clean[key] = raw[key];
  }

  clean.name       = cleanStr(clean.name, 80);
  clean.race       = cleanStr(clean.race, 60);
  clean.klass      = cleanStr(clean.klass, 60);
  clean.background = cleanStr(clean.background, 60);
  clean.level      = clampInt(clean.level, 1, 20, 1);

  for (const ab of ["str","dex","con","int","wis","cha"]) {
    clean[ab] = clampInt(clean[ab], 1, 30, 10);
  }
  clean.hp         = clampInt(clean.hp, 0, 9999, 10);
  clean.maxHp      = clampInt(clean.maxHp, 1, 9999, 10);
  clean.tempHp     = clampInt(clean.tempHp, 0, 9999, 0);
  clean.ac         = clampInt(clean.ac, 0, 50, 10);
  clean.speed      = clampInt(clean.speed, 0, 500, 30);
  clean.initiative = clampInt(clean.initiative, -20, 50, 0);
  clean.exhaustion = clampInt(clean.exhaustion, 0, 6, 0);

  clean.hd         = cleanStr(clean.hd, 8);
  clean.hd_used    = clampInt(clean.hd_used, 0, 20, 0);
  clean.deathSaves = cleanObj(clean.deathSaves);
  clean.saves      = cleanObj(clean.saves);
  clean.skills     = cleanObj(clean.skills);
  clean.subclasses = cleanObj(clean.subclasses);

  for (const k of ["traits","ideals","bonds","flaws","equipment","features","backstory"]) {
    clean[k] = cleanStr(clean[k], TEXT_MAX);
  }

  for (const k of ["inventory","actions","raceTraits","bgTraits","classFeatures","subclassFeatures","feats","languages","activeConditions","attunedItems","attunementChangedSinceRest"]) {
    clean[k] = cleanArr(clean[k]);
  }

  for (const k of ["gold","silver","copper","electrum","platinum"]) {
    clean[k] = clampInt(clean[k], 0, 9_999_999, 0);
  }

  clean.spellAbility = cleanStr(clean.spellAbility, 4) || "INT";
  clean.inspiration  = !!clean.inspiration;
  clean.concentration = clean.concentration && typeof clean.concentration === "object" ? clean.concentration : null;

  return { ok: true, data: clean };
}

export { MAX_FILE_BYTES };
