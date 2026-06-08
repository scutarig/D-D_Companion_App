// ─── Colour Palette ─────────────────────────────────────────────────────────
// Hero's Diary — Radix UI dark mauve scale + accents
export const C = {
  // Backgrounds — Radix mauve-1/2/3/4
  bg:       "#121113",
  surface:  "#1a191b",
  card:     "#232225",
  cardHi:   "#2b292d",

  // Borders — Radix mauve-6/7
  border:       "#3c393f",
  borderBright: "#504d55",

  // Yellow (gold) — Radix yellow-9/3
  gold:    "#e1e378",
  goldDim: "#262600",

  // Red — Radix red-9/11/3
  red:      "#850000",
  redBright:"#ff907f",
  redDim:   "#440704",

  // Blue — Radix blue-9/11
  blue:      "#1681f0",
  blueBright:"#73b8ff",

  // Green — Radix green-9/11
  green:      "#008543",
  greenBright:"#68d18a",

  // Purple — Radix purple-9/11/3
  purple:      "#8526f6",
  purpleBright:"#c0a1ff",
  purpleDim:   "#2e1059",

  // Teal — Radix teal-9/11
  teal:      "#008585",
  tealBright:"#67cdcd",

  // Amber/Orange — Radix orange-9/11
  amber:      "#854300",
  amberBright:"#ffa460",

  // Text — Radix mauve-11/8/12
  text:      "#b5b2bc",
  textDim:   "#625f69",
  textBright:"#eeeef0",
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const F  = "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif";
export const FH = "'Cinzel','Inter','Segoe UI',Georgia,serif";

// ─── Style Factories ─────────────────────────────────────────────────────────
export const sx = {

  app: {
    background: C.bg,
    minHeight: "100vh",
    fontFamily: F,
    color: C.text,
    display: "flex",
    flexDirection: "column",
  },

  // Header — warm charcoal, subtle gold border
  hdr: {
    background: "linear-gradient(180deg,#1c1826 0%,#16121e 100%)",
    borderBottom: `1px solid rgba(201,168,76,0.18)`,
    padding: "9px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 2px 20px rgba(0,0,0,0.45)",
    flexShrink: 0,
  },

  hT: {
    fontFamily: FH,
    fontSize: 15,
    fontWeight: 900,
    color: C.gold,
    letterSpacing: 2.5,
    margin: 0,
    whiteSpace: "nowrap",
    textShadow: "0 0 18px rgba(201,168,76,0.28)",
  },

  hS: {
    color: C.textDim,
    fontSize: 9,
    fontStyle: "italic",
    whiteSpace: "nowrap",
    letterSpacing: 1,
  },

  // Nav — same warm dark, amber accent for active tab
  nav: {
    background: "#141120",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
    display: "flex",
    overflowX: "auto",
    padding: "7px 10px",
    gap: 4,
    alignItems: "center",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    flexShrink: 0,
  },

  // Nav button — active: amber/gold, inactive: ghost
  nb: (a) => ({
    background: a
      ? "linear-gradient(135deg,#6d4fc2,#4a2fa0)"
      : "transparent",
    border: a ? "none" : `1px solid rgba(255,255,255,0.08)`,
    borderRadius: 10,
    color: a ? "#f0eeff" : C.textDim,
    fontFamily: FH,
    fontSize: 10,
    fontWeight: a ? 700 : 400,
    padding: "5px 11px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all .18s",
    letterSpacing: 0.5,
    boxShadow: a ? "0 2px 10px rgba(109,79,194,0.35)" : "none",
    flexShrink: 0,
  }),

  main: {
    flex: 1,
    padding: "12px 10px",
    maxWidth: 980,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },

  // Card — warm dark with a very subtle warm border
  card: {
    background: C.card,
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 4px 28px rgba(0,0,0,0.38)",
  },

  cardAccent: (col) => ({
    background: `${col}0d`,
    border: `1px solid ${col}28`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  }),

  // Card title — gold, understated rule below
  ct: {
    fontFamily: FH,
    color: C.gold,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
    letterSpacing: 1.2,
    borderBottom: "1px solid rgba(201,168,76,0.12)",
    paddingBottom: 7,
  },

  // Inputs — slightly warm dark fill
  inp: {
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 8,
    color: C.textBright,
    fontFamily: F,
    fontSize: 14,
    padding: "8px 10px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
  },

  sel: {
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 8,
    color: C.textBright,
    fontFamily: F,
    fontSize: 14,
    padding: "8px 10px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  },

  ta: {
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 8,
    color: C.textBright,
    fontFamily: F,
    fontSize: 14,
    padding: "8px 10px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },

  // Primary button — solid fill, subtle glow
  btn: (c = C.teal) => ({
    background: `linear-gradient(135deg,${c}dd,${c}99)`,
    border: `1px solid ${c}55`,
    borderRadius: 8,
    color: "#fff",
    fontFamily: FH,
    fontSize: 11,
    fontWeight: 700,
    padding: "7px 14px",
    cursor: "pointer",
    letterSpacing: 0.5,
    boxShadow: `0 2px 10px ${c}30`,
    transition: "all .18s",
  }),

  // Small ghost button
  bsm: (c = C.purple) => ({
    background: `${c}16`,
    border: `1px solid ${c}38`,
    borderRadius: 6,
    color: c,
    fontFamily: F,
    fontSize: 11,
    padding: "4px 9px",
    cursor: "pointer",
    transition: "all .15s",
  }),

  // Grids
  g2: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 },
  g3: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 },

  // Label
  lbl: {
    display: "block",
    color: C.textDim,
    fontSize: 10,
    marginBottom: 4,
    fontFamily: F,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Tag / pill badge
  tag: (c = C.gold) => ({
    background: `${c}16`,
    border: `1px solid ${c}38`,
    borderRadius: 20,
    color: c,
    fontSize: 11,
    padding: "2px 8px",
    display: "inline-block",
  }),

  pill: (c = C.purple, active = false) => ({
    background: active ? `${c}2a` : "transparent",
    border: `1px solid ${active ? c : C.border}`,
    borderRadius: 20,
    color: active ? c : C.textDim,
    fontFamily: F,
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    padding: "4px 12px",
    cursor: "pointer",
    transition: "all .15s",
  }),

  row: { display: "flex", alignItems: "center", gap: 8 },
  jb:  { display: "flex", alignItems: "center", justifyContent: "space-between" },

  statBox: (col) => ({
    background: `${col}10`,
    border: `1px solid ${col}28`,
    borderRadius: 12,
    padding: "10px 8px",
    textAlign: "center",
    flex: "1 1 70px",
    minWidth: 70,
  }),
};

// ─── Stat colours ────────────────────────────────────────────────────────────
export const SC  = { STR:"#c04040", DEX:"#40c0a0", CON:"#c08040", INT:"#4080c0", WIS:"#a040c0", CHA:"#c06090" };
export const ABS = ["STR","DEX","CON","INT","WIS","CHA"];
export const SKILLS = {
  STR: ["Athletics"],
  DEX: ["Acrobatics","Sleight of Hand","Stealth"],
  CON: [],
  INT: ["Arcana","History","Investigation","Nature","Religion"],
  WIS: ["Animal Handling","Insight","Medicine","Perception","Survival"],
  CHA: ["Deception","Intimidation","Performance","Persuasion"],
};
