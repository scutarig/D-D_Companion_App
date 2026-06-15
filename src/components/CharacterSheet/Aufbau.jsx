import { useState } from "react";
import { C, sx, SC, ABS, SKILLS, FH } from "../../constants/theme.js";
import { modOf, getPB } from "../../utils/helpers.js";
import { getMasteryCount } from "../../data/weaponMasteries.js";
import { useI18n } from "../../i18n/index.js";
import { useMulticlass } from "../../hooks/useMulticlass.js";
import RaceSelector from "./RaceSelector.jsx";
import BackgroundSelector from "./BackgroundSelector.jsx";
import MulticlassManager from "./MulticlassManager.jsx";
import SubclassPicker from "./SubclassPicker.jsx";
import WeaponMasteryPicker from "./WeaponMasteryPicker.jsx";
import OriginFeatChoices from "./OriginFeatChoices.jsx";
import TraitsFeatures from "./TraitsFeatures.jsx";

/**
 * Aufbau — Char-Build / Edit view (Tab 2 of CharManagerV2).
 *
 * Organizes ALL char-defining controls into thematic Collapsible Sections.
 * Each section is independent — user expands what they want to edit.
 *
 * Sections (in order):
 *   1. Identität (Name, Klasse-Anzeige, Level-Anzeige, Spell-Ability-Select)
 *   2. Volk (RaceSelector)
 *   3. Klassen & Subclass (MulticlassManager + SubclassPicker)
 *   4. Hintergrund + Origin-Feat (BackgroundSelector + OriginFeatChoices)
 *   5. Attribute-Editor (STR/DEX/CON/INT/WIS/CHA Steppers)
 *   6. Save-Proficiency (6 Toggles)
 *   7. Skill-Proficiency (18 Skills × 3-state)
 *   8. Weapon-Mastery (WeaponMasteryPicker — nur martial)
 *   9. Sprachen-Editor
 *  10. Persönlichkeit (Traits/Ideals/Bonds/Flaws/Backstory edit)
 *  11. Features & Traits (TraitsFeatures)
 */
export default function Aufbau({ char, setChar }) {
  const { t } = useI18n();
  const pb = getPB(char.level);
  const { classes, setSubclass } = useMulticlass(char.id, char, setChar);
  const masteryCount = getMasteryCount(char.klass, char.level) || 0;

  return (
    <div>
      <div style={{
        padding: "8px 12px", marginBottom: 14,
        background: `${C.tealBright}10`,
        border: `1px dashed ${C.tealBright}40`,
        borderRadius: 8,
        color: C.tealBright,
        fontSize: 11, lineHeight: 1.5, textAlign: "center",
      }}>
        🧬 {t("aufbau.intro","Hier definierst du deinen Charakter. Jeder Bereich ist aufklappbar.")}
      </div>

      <Section title={t("aufbau.section_identity","Identität")} icon="📝" defaultOpen>
        <IdentitySection char={char} setChar={setChar} pb={pb} />
      </Section>

      <Section title={t("aufbau.section_race","Volk / Species")} icon="🧝">
        <RaceSelector char={char} setChar={setChar} />
      </Section>

      <Section title={t("aufbau.section_class","Klassen & Subclass")} icon="⚔️">
        <MulticlassManager char={char} setChar={setChar} />
        <div style={{ marginTop: 8 }}>
          <SubclassPicker char={char} classes={classes} setSubclass={setSubclass} />
        </div>
      </Section>

      <Section title={t("aufbau.section_background","Hintergrund & Origin-Feat")} icon="📜">
        <BackgroundSelector char={char} setChar={setChar} />
        <div style={{ marginTop: 8 }}>
          <OriginFeatChoices char={char} setChar={setChar} />
        </div>
      </Section>

      <Section title={t("aufbau.section_abilities","Attributwerte")} icon="💪">
        <AbilitiesEditor char={char} setChar={setChar} />
      </Section>

      <Section title={t("aufbau.section_saves","Rettungswürfe — Übung")} icon="🛡️">
        <SavesEditor char={char} setChar={setChar} pb={pb} />
      </Section>

      <Section title={t("aufbau.section_skills","Fertigkeiten — Übung & Expertise")} icon="🎯">
        <SkillsEditor char={char} setChar={setChar} pb={pb} />
      </Section>

      {masteryCount > 0 && (
        <Section title={t("aufbau.section_mastery","Waffen-Meisterschaft")} icon="🗡️">
          <WeaponMasteryPicker char={char} setChar={setChar} />
        </Section>
      )}

      <Section title={t("aufbau.section_languages","Sprachen")} icon="🗣️">
        <LanguagesEditor char={char} setChar={setChar} />
      </Section>

      <Section title={t("aufbau.section_personality","Persönlichkeit & Backstory")} icon="🎭">
        <PersonalityEditor char={char} setChar={setChar} />
      </Section>

      <Section title={t("aufbau.section_features","Features & Traits")} icon="✦">
        <TraitsFeatures char={char} setChar={setChar} />
      </Section>
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────
function Section({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      ...sx.card,
      marginBottom: 8,
      padding: 0,
      overflow: "hidden",
    }}>
      <button type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: open ? `${C.amberBright}10` : "transparent",
          border: "none",
          borderBottom: open ? `1px solid ${C.amberBright}30` : "none",
          color: C.amberBright,
          fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          padding: "12px 14px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          textAlign: "left",
        }}>
        <span>{icon} {title}</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div style={{ padding: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Identity ─────────────────────────────────────────────────────────────
function IdentitySection({ char, setChar, pb }) {
  const { t } = useI18n();
  const u = (f, v) => setChar((p) => ({ ...p, [f]: v }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
      <div>
        <label style={sx.lbl}>{t("sheet.name","Name")}</label>
        <input value={char.name} onChange={(e) => u("name", e.target.value)}
          style={{ ...sx.inp, fontSize: 14, fontFamily: FH, color: C.gold, fontWeight: 700 }} />
      </div>
      <div>
        <label style={sx.lbl}>{t("sheet.spell_ability","Zauber-Attribut")}</label>
        <select value={char.spellAbility || "INT"} onChange={(e) => u("spellAbility", e.target.value)}
          style={sx.sel}>
          {ABS.map((ab) => <option key={ab} value={ab}>{ab}</option>)}
        </select>
      </div>
      <div>
        <label style={sx.lbl}>{t("sheet.hd_die","Trefferwürfel")}</label>
        <input value={char.hd || ""} onChange={(e) => u("hd", e.target.value)}
          placeholder="W8" style={{ ...sx.inp, fontFamily: FH }} />
      </div>
      <div>
        <label style={sx.lbl}>PB ({t("aufbau.computed","aus Level")})</label>
        <div style={{ ...sx.inp, color: C.gold, fontFamily: FH, fontWeight: 700, textAlign: "center" }}>+{pb}</div>
      </div>
    </div>
  );
}

// ─── Abilities Editor ─────────────────────────────────────────────────────
function AbilitiesEditor({ char, setChar }) {
  const { t } = useI18n();
  const set = (ab, v) => setChar((p) => ({ ...p, [ab]: Math.max(1, Math.min(30, v)) }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
      {ABS.map((ab) => {
        const score = char[ab.toLowerCase()] || 10;
        const mod = modOf(score);
        const col = SC[ab];
        return (
          <div key={ab} style={{
            background: `${col}10`,
            border: `1px solid ${col}40`,
            borderRadius: 10,
            padding: "10px 8px",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: FH, fontSize: 11, color: col, fontWeight: 700, letterSpacing: 0.5 }}>{ab}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
              <button type="button" onClick={() => set(ab.toLowerCase(), score - 1)}
                style={{ ...sx.bsm(col), padding: "2px 8px", fontSize: 14, fontWeight: 700 }}
                aria-label={`${ab} -1`}>−</button>
              <input type="number" min={1} max={30} value={score}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) set(ab.toLowerCase(), n);
                }}
                style={{
                  width: 44, textAlign: "center",
                  fontSize: 18, fontWeight: 700,
                  background: "transparent", border: `1px solid ${col}30`,
                  borderRadius: 6, color: C.textBright,
                  padding: "2px 0",
                }} />
              <button type="button" onClick={() => set(ab.toLowerCase(), score + 1)}
                style={{ ...sx.bsm(col), padding: "2px 8px", fontSize: 14, fontWeight: 700 }}
                aria-label={`${ab} +1`}>+</button>
            </div>
            <div style={{
              display: "inline-block",
              background: `${col}22`,
              border: `1px solid ${col}55`,
              borderRadius: 12,
              padding: "1px 8px",
              marginTop: 6,
              fontSize: 11,
              fontWeight: 700,
              color: col,
            }}>{mod >= 0 ? `+${mod}` : mod}</div>
          </div>
        );
      })}
      <div style={{ gridColumn: "1 / -1", fontSize: 11, color: C.textDim, marginTop: 2 }}>
        {t("aufbau.abilities_hint","Werte 1–30. Modifier = ⌊(Wert − 10) / 2⌋.")}
      </div>
    </div>
  );
}

// ─── Saves Editor ─────────────────────────────────────────────────────────
function SavesEditor({ char, setChar, pb }) {
  const { t } = useI18n();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 6 }}>
      {ABS.map((ab) => {
        const prof = !!(char.saves || {})[ab];
        const total = modOf(char[ab.toLowerCase()] || 10) + (prof ? pb : 0);
        const col = SC[ab];
        return (
          <label key={ab} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            background: prof ? `${col}18` : "transparent",
            border: `1px solid ${prof ? col + "55" : C.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}>
            <input type="checkbox" checked={prof}
              onChange={(e) => setChar((p) => ({ ...p, saves: { ...(p.saves || {}), [ab]: e.target.checked } }))} />
            <span style={{ color: col, fontFamily: FH, fontSize: 11, fontWeight: 700, flex: 1 }}>{ab}</span>
            <span style={{ color: prof ? C.gold : C.textDim, fontWeight: 700, fontSize: 13 }}>
              {total >= 0 ? `+${total}` : total}
            </span>
          </label>
        );
      })}
      <div style={{ gridColumn: "1 / -1", fontSize: 11, color: C.textDim, marginTop: 2 }}>
        {t("aufbau.saves_hint","Übung gibt +PB auf den Save-Wurf.")}
      </div>
    </div>
  );
}

// ─── Skills Editor (3-state cycle: none → prof → expert → none) ──────────
function SkillsEditor({ char, setChar, pb }) {
  const { t } = useI18n();
  const cycle = (skill) => {
    const pk = `skill_${skill}`;
    const ek = `exp_${skill}`;
    const isProf = !!char.skills?.[pk];
    const isExp  = !!char.skills?.[ek];
    // none → prof → expert → none
    if (!isProf && !isExp) {
      setChar((p) => ({ ...p, skills: { ...(p.skills || {}), [pk]: true, [ek]: false } }));
    } else if (isProf && !isExp) {
      setChar((p) => ({ ...p, skills: { ...(p.skills || {}), [pk]: true, [ek]: true } }));
    } else {
      setChar((p) => ({ ...p, skills: { ...(p.skills || {}), [pk]: false, [ek]: false } }));
    }
  };

  return (
    <>
      <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>
        {t("aufbau.skills_hint","Klick wechselt: ○ keine → ● Übung → ◉ Expertise → ○ keine")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 4 }}>
        {Object.entries(SKILLS).flatMap(([ab, skills]) =>
          skills.map((skill) => {
            const pk = `skill_${skill}`;
            const ek = `exp_${skill}`;
            const isProf = !!char.skills?.[pk];
            const isExp  = !!char.skills?.[ek];
            const bonus  = modOf(char[ab.toLowerCase()] || 10) + (isExp ? pb * 2 : isProf ? pb : 0);
            const col = SC[ab];
            const marker = isExp ? "◉" : isProf ? "●" : "○";
            const markerCol = isExp || isProf ? col : C.textDim;
            return (
              <button key={skill} type="button" onClick={() => cycle(skill)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px",
                  background: isExp || isProf ? `${col}12` : "transparent",
                  border: `1px solid ${isExp || isProf ? col + "55" : C.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  color: C.text,
                }}>
                <span style={{ color: markerCol, fontSize: 16, lineHeight: 1, width: 14 }}>{marker}</span>
                <span style={{ color: col, fontFamily: FH, fontSize: 9, fontWeight: 700, width: 26 }}>{ab}</span>
                <span style={{ flex: 1, fontSize: 13, color: isExp || isProf ? C.textBright : C.text }}>{skill}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isExp || isProf ? C.gold : C.textDim,
                  minWidth: 32, textAlign: "right",
                }}>
                  {bonus >= 0 ? `+${bonus}` : bonus}
                </span>
              </button>
            );
          })
        )}
      </div>
    </>
  );
}

// ─── Languages Editor ─────────────────────────────────────────────────────
function LanguagesEditor({ char, setChar }) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const langs = Array.isArray(char.languages) ? char.languages : [];
  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (langs.includes(v)) { setInput(""); return; }
    setChar((p) => ({ ...p, languages: [...(p.languages || []), v] }));
    setInput("");
  };
  const remove = (l) => setChar((p) => ({ ...p, languages: (p.languages || []).filter((x) => x !== l) }));
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={t("aufbau.lang_placeholder","z.B. Elfisch, Zwergisch…")}
          style={{ ...sx.inp, flex: 1 }} />
        <button type="button" onClick={add} style={sx.btn(C.tealBright)}>＋</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {langs.length === 0 && (
          <span style={{ color: C.textDim, fontSize: 12, fontStyle: "italic" }}>
            {t("aufbau.no_langs","Noch keine Sprachen.")}
          </span>
        )}
        {langs.map((l) => (
          <span key={l} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 4px 3px 10px",
            background: `${C.tealBright}18`,
            border: `1px solid ${C.tealBright}55`,
            borderRadius: 12,
            color: C.tealBright,
            fontSize: 11, fontWeight: 700,
          }}>
            {l}
            <button type="button" onClick={() => remove(l)}
              aria-label={t("aufbau.lang_remove","Sprache entfernen")}
              style={{
                background: "transparent", border: "none",
                color: C.tealBright, cursor: "pointer",
                fontSize: 13, lineHeight: 1, padding: "0 4px",
              }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Personality Editor ──────────────────────────────────────────────────
function PersonalityEditor({ char, setChar }) {
  const { t } = useI18n();
  const u = (f, v) => setChar((p) => ({ ...p, [f]: v }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
      <Field label={t("pdf.traits_lbl","Wesenszüge")} value={char.traits} onChange={(v) => u("traits", v)} col={C.amberBright} />
      <Field label={t("pdf.ideals_lbl","Ideale")}     value={char.ideals} onChange={(v) => u("ideals", v)} col={C.tealBright} />
      <Field label={t("pdf.bonds_lbl","Bindungen")}   value={char.bonds}  onChange={(v) => u("bonds", v)}  col={C.purpleBright} />
      <Field label={t("pdf.flaws_lbl","Schwächen")}   value={char.flaws}  onChange={(v) => u("flaws", v)}  col={C.redBright} />
      <div style={{ gridColumn: "1 / -1" }}>
        <Field label={t("pdf.backstory_h","Hintergrundgeschichte")} value={char.backstory} onChange={(v) => u("backstory", v)} col={C.gold} rows={5} />
      </div>
    </div>
  );
}
function Field({ label, value, onChange, col, rows = 2 }) {
  return (
    <div>
      <label style={{ ...sx.lbl, color: col }}>{label}</label>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)}
        rows={rows} style={{ ...sx.ta, borderLeft: `3px solid ${col}` }} />
    </div>
  );
}
