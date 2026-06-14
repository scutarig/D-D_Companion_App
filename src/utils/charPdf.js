// ── Character PDF generation ──────────────────────────────────────────────
// Builds the full HTML document used for printing a character sheet.
// Pulls in everything that lives "outside" the char object:
//   - Spells (known + prepared) from `spells_known_<aid>` / `spells_prep_<aid>`
//   - Spell-slot usage from `tokens_used_<aid>`
//   - Companions from `companions_v1` (or whatever the companion-store uses)
//   - Custom proficiencies from `proficiencies_v1`
// XSS-safe: every user-controlled string is escaped before being interpolated.

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));
const nlbr = (s) => esc(s).replace(/\n/g, "<br>");

const modOf = (score) => Math.floor((Number(score) || 10) - 10) >> 1;
const modStr = (score) => {
  const m = Math.floor(((Number(score) || 10) - 10) / 2);
  return m >= 0 ? `+${m}` : String(m);
};

const ABS = ["str", "dex", "con", "int", "wis", "cha"];
const SKILL_TO_ABILITY = {
  "Acrobatics": "dex", "Animal Handling": "wis", "Arcana": "int",
  "Athletics": "str", "Deception": "cha", "History": "int",
  "Insight": "wis", "Intimidation": "cha", "Investigation": "int",
  "Medicine": "wis", "Nature": "int", "Perception": "wis",
  "Performance": "cha", "Persuasion": "cha", "Religion": "int",
  "Sleight of Hand": "dex", "Stealth": "dex", "Survival": "wis",
};

function safeReadJson(key, fallback = null) {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (_) { return fallback; }
}

/**
 * Build the complete PDF HTML for a character.
 * @param {object} char       The active character object.
 * @param {object} opts
 * @param {(k, fb) => string} opts.t   i18n translator
 * @param {string} opts.lang  "de" | "en"
 * @param {Array<object>} [opts.spellDb] optional full spell DB so we can look up
 *                                       known/prepared spell ids → name+level
 * @param {Array<object>} [opts.companions] companions for this char
 */
export function buildCharPdfHtml(char, opts = {}) {
  const t = opts.t || ((_, fb) => fb);
  const lang = opts.lang || "de";
  const pb = char.level < 5 ? 2 : char.level < 9 ? 3 : char.level < 13 ? 4 : char.level < 17 ? 5 : 6;

  // Pull per-char data from localStorage
  const knownIds = safeReadJson(`spells_known_${char.id}`, []) || [];
  const prepIds  = safeReadJson(`spells_prep_${char.id}`, []) || [];
  const slotUsed = safeReadJson(`tokens_used_${char.id}`, {}) || {};

  const spellById = new Map();
  if (Array.isArray(opts.spellDb)) {
    for (const s of opts.spellDb) spellById.set(s.id, s);
  }

  const companions = Array.isArray(opts.companions) ? opts.companions : [];

  // ── 1. Header ──────────────────────────────────────────────────────────
  const header = `
    <h1 style="margin:0">${esc(char.name)}</h1>
    <p style="margin:4px 0 12px;color:#555">
      ${esc(char.race)} · ${esc(char.klass)} · Level ${esc(char.level)} · PB +${esc(pb)}
      ${char.background ? ` · ${esc(t("pdf.background_lbl","Hintergrund"))}: ${esc(char.background)}` : ""}
    </p>`;

  // ── 2. Vitals grid ─────────────────────────────────────────────────────
  const initMod = modStr(char.dex || 10);
  const vitals = `
    <div class="grid4">
      <div class="box"><div class="boxL">HP</div><div class="bv">${esc(char.hp)}/${esc(char.maxHp)}</div></div>
      <div class="box"><div class="boxL">AC</div><div class="bv">${esc(char.ac)}</div></div>
      <div class="box"><div class="boxL">Init</div><div class="bv">${esc(initMod)}</div></div>
      <div class="box"><div class="boxL">Speed</div><div class="bv">${esc(char.speed || 30)} ft</div></div>
    </div>`;

  // ── 3. Attributes + Saving Throws (combined) ───────────────────────────
  const attrRows = ABS.map((a) => {
    const score = char[a] || 10;
    const m = modStr(score);
    const prof = char.saves?.[a.toUpperCase()] ? "✓" : "";
    const saveTotal = (char.saves?.[a.toUpperCase()] ? pb : 0) + Math.floor((score - 10) / 2);
    const saveStr = saveTotal >= 0 ? `+${saveTotal}` : String(saveTotal);
    return `<tr><td>${a.toUpperCase()}</td><td>${esc(score)}</td><td>${esc(m)}</td><td>${esc(prof)}</td><td>${esc(saveStr)}</td></tr>`;
  }).join("");
  const attrSection = `
    <h3>${esc(t("pdf.attributes_h","Attribute"))} + ${esc(t("pdf.saves_h","Rettungswürfe"))}</h3>
    <table>
      <tr>
        <th>${esc(t("pdf.attr_th","Attr"))}</th>
        <th>${esc(t("pdf.value_th","Wert"))}</th>
        <th>${esc(t("pdf.mod_th","Mod"))}</th>
        <th>${esc(t("pdf.save_prof_th","Prof"))}</th>
        <th>${esc(t("pdf.save_total_th","Save"))}</th>
      </tr>
      ${attrRows}
    </table>`;

  // ── 4. Skills ──────────────────────────────────────────────────────────
  const skillRows = Object.entries(SKILL_TO_ABILITY).map(([skill, ab]) => {
    const score = char[ab] || 10;
    const baseMod = Math.floor((score - 10) / 2);
    const prof = char.skills?.[skill];
    const value = baseMod + (prof === "expert" ? pb * 2 : prof === "prof" ? pb : 0);
    const valStr = value >= 0 ? `+${value}` : String(value);
    const profMark = prof === "expert" ? "★" : prof === "prof" ? "✓" : "";
    return `<tr><td>${esc(skill)}</td><td>${esc(ab.toUpperCase())}</td><td>${esc(profMark)}</td><td>${esc(valStr)}</td></tr>`;
  }).join("");
  const skillsSection = `
    <h3>${esc(t("pdf.skills_h","Fertigkeiten"))}</h3>
    <table class="compact">
      <tr>
        <th>${esc(t("pdf.skill_th","Skill"))}</th>
        <th>${esc(t("pdf.attr_th","Attr"))}</th>
        <th>${esc(t("pdf.prof_th","Übung"))}</th>
        <th>${esc(t("pdf.total_th","Total"))}</th>
      </tr>
      ${skillRows}
    </table>`;

  // ── 5. Active Conditions ───────────────────────────────────────────────
  const conds = Array.isArray(char.activeConditions) ? char.activeConditions : [];
  const condsSection = conds.length ? `
    <h3>${esc(t("pdf.conditions_h","Aktive Conditions"))}</h3>
    <p>${conds.map((c) => `<span class="pill">${esc(typeof c === "string" ? c : c?.id || "?")}</span>`).join(" ")}</p>
  ` : "";

  // ── 6. Inventory + Equipped ────────────────────────────────────────────
  const inv = Array.isArray(char.inventory) ? char.inventory : [];
  const equipped = char.equipSlots || {};
  const equippedUids = new Set(Object.values(equipped).filter(Boolean).map((it) => it?.uid).filter(Boolean));
  const invRows = inv.map((it) => {
    const isEq = equippedUids.has(it.uid);
    return `<tr>
      <td>${isEq ? "⚔" : ""}</td>
      <td>${esc(it.name || "?")}</td>
      <td>${esc(it.type || "")}${it.sub ? ` (${esc(it.sub)})` : ""}</td>
      <td>${esc(it.dmg || it.ac || "")}</td>
      <td>${esc(it.wt || "")}</td>
    </tr>`;
  }).join("");
  const invSection = inv.length ? `
    <h3>${esc(t("pdf.inventory_h","Inventar"))}</h3>
    <table class="compact">
      <tr>
        <th>⚔</th>
        <th>${esc(t("pdf.item_th","Item"))}</th>
        <th>${esc(t("pdf.type_th","Typ"))}</th>
        <th>${esc(t("pdf.dmg_ac_th","Dmg/AC"))}</th>
        <th>${esc(t("pdf.weight_th","Gew."))}</th>
      </tr>
      ${invRows}
    </table>` : "";

  // ── 7. Currency ───────────────────────────────────────────────────────
  const currencySection = `
    <h3>${esc(t("pdf.currency_h","Münzen"))}</h3>
    <p>
      ${esc(char.platinum || 0)} pp ·
      ${esc(char.gold || 0)} gp ·
      ${esc(char.electrum || 0)} ep ·
      ${esc(char.silver || 0)} sp ·
      ${esc(char.copper || 0)} cp
    </p>`;

  // ── 8. Spells ─────────────────────────────────────────────────────────
  const knownByLevel = new Map();
  for (const id of knownIds) {
    const spell = spellById.get(id);
    if (!spell) { knownByLevel.set("?", [...(knownByLevel.get("?") || []), id]); continue; }
    const lv = spell.level ?? 0;
    if (!knownByLevel.has(lv)) knownByLevel.set(lv, []);
    knownByLevel.get(lv).push(spell);
  }
  const prepSet = new Set(prepIds);

  const spellSlotsLine = Object.keys(slotUsed).length
    ? `<p style="font-size:11px;color:#555">${esc(t("pdf.slots_used","Verbrauchte Slots"))}: ${
        Object.entries(slotUsed).map(([lv, n]) => `Lv${lv}: ${esc(n)}`).join(" · ")
      }</p>`
    : "";

  let spellsHtml = "";
  if (knownByLevel.size > 0) {
    const levelsSorted = [...knownByLevel.keys()].sort((a, b) => (a === "?" ? 99 : a) - (b === "?" ? 99 : b));
    spellsHtml = `
      <h3>${esc(t("pdf.spells_h","Zauber"))}</h3>
      ${spellSlotsLine}
      ${levelsSorted.map((lv) => {
        const list = knownByLevel.get(lv);
        const heading = lv === 0
          ? esc(t("pdf.cantrips","Cantrips"))
          : lv === "?" ? esc(t("pdf.unknown_level","Unbekannt"))
          : `${esc(t("pdf.level_word","Level"))} ${lv}`;
        const items = list.map((s) => {
          if (typeof s === "string") return `<span class="spellPill">${esc(s)}</span>`;
          const name = lang === "en" && s.nameEN ? s.nameEN : s.name;
          const prep = prepSet.has(s.id) ? "★" : "";
          return `<span class="spellPill">${prep} ${esc(name)}</span>`;
        }).join(" ");
        return `<div><strong>${heading}:</strong> ${items}</div>`;
      }).join("")}`;
  }

  // ── 9. Background details + personality ───────────────────────────────
  const personalitySection = (char.traits || char.ideals || char.bonds || char.flaws) ? `
    <h3>${esc(t("pdf.personality_h","Persönlichkeit"))}</h3>
    ${char.traits ? `<p><strong>${esc(t("pdf.traits_lbl","Wesenszüge"))}:</strong> ${nlbr(char.traits)}</p>` : ""}
    ${char.ideals ? `<p><strong>${esc(t("pdf.ideals_lbl","Ideale"))}:</strong> ${nlbr(char.ideals)}</p>` : ""}
    ${char.bonds  ? `<p><strong>${esc(t("pdf.bonds_lbl","Bindungen"))}:</strong> ${nlbr(char.bonds)}</p>` : ""}
    ${char.flaws  ? `<p><strong>${esc(t("pdf.flaws_lbl","Schwächen"))}:</strong> ${nlbr(char.flaws)}</p>` : ""}
  ` : "";

  const languagesSection = Array.isArray(char.languages) && char.languages.length ? `
    <h3>${esc(t("pdf.languages_h","Sprachen"))}</h3>
    <p>${char.languages.map((l) => esc(l)).join(", ")}</p>` : "";

  const backstorySection = char.backstory ? `
    <h3>${esc(t("pdf.backstory_h","Hintergrundgeschichte"))}</h3>
    <p>${nlbr(char.backstory)}</p>` : "";

  const featuresSection = char.features ? `
    <h3>${esc(t("pdf.features_h","Merkmale"))}</h3>
    <p>${nlbr(char.features)}</p>` : "";

  // ── 10. Companions ────────────────────────────────────────────────────
  const compSection = companions.length ? `
    <h3>${esc(t("pdf.companions_h","Begleiter"))}</h3>
    ${companions.map((c) => `
      <div class="comp">
        <strong>${esc(c.name)}</strong> ${c.size ? `<span class="sub">(${esc(c.size)} ${esc(c.type || "")})</span>` : ""}
        <div class="sub">HP ${esc(c.hp)}/${esc(c.maxHp)} · AC ${esc(c.ac)} · Speed ${esc(c.speed)} ft${c.cr ? ` · CR ${esc(c.cr)}` : ""}</div>
        ${c.traits ? `<div>${nlbr(c.traits)}</div>` : ""}
        ${c.actions ? `<div><em>${esc(t("pdf.actions_lbl","Aktionen"))}:</em> ${nlbr(c.actions)}</div>` : ""}
      </div>
    `).join("")}` : "";

  // ── Compose ───────────────────────────────────────────────────────────
  const style = `
    body { font-family: Calibri, Arial, sans-serif; padding: 20px; max-width: 720px; color: #111; }
    h1 { font-size: 22px; }
    h3 { border-bottom: 1px solid #ccc; margin: 18px 0 8px; padding-bottom: 3px; font-size: 14px; }
    p { margin: 4px 0; line-height: 1.45; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; margin: 4px 0; }
    table.compact { font-size: 11px; }
    td, th { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
    th { background: #f4f4f4; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 8px 0; }
    .box { border: 1px solid #ccc; padding: 6px; text-align: center; }
    .boxL { font-size: 10px; color: #777; }
    .bv { font-size: 20px; font-weight: bold; }
    .pill { display: inline-block; padding: 1px 8px; border: 1px solid #999; border-radius: 10px; margin: 2px; font-size: 11px; }
    .spellPill { display: inline-block; padding: 1px 6px; border: 1px solid #c9c9c9; border-radius: 8px; margin: 2px 1px; font-size: 11px; background: #fafafa; }
    .comp { border: 1px solid #ddd; padding: 6px 10px; margin: 6px 0; border-radius: 4px; }
    .sub { color: #555; font-size: 11px; }
    @media print { @page { size: A4; margin: 12mm; } body { padding: 0; } }
  `;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(char.name)}</title><style>${style}</style></head><body>
    ${header}
    ${vitals}
    ${attrSection}
    ${skillsSection}
    ${condsSection}
    ${invSection}
    ${currencySection}
    ${spellsHtml}
    ${personalitySection}
    ${languagesSection}
    ${featuresSection}
    ${backstorySection}
    ${compSection}
    <p style="font-size:10px;color:#999;margin-top:24px">D&amp;D Companion · ${esc(new Date().toLocaleDateString(lang === "en" ? "en-US" : "de-DE"))}</p>
  </body></html>`;
}
