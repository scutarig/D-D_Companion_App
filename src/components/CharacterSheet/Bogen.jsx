import { C, sx, SC, ABS, SKILLS, FH } from "../../constants/theme.js";
import { modOf, modStr, getPB } from "../../utils/helpers.js";
import { useI18n } from "../../i18n/index.js";

/**
 * Bogen — read-only Character-Sheet view (Tab 1 of CharManagerV2).
 *
 * Pure presentation of all derived char data:
 *   - Identity header (read)
 *   - Vitals strip (HP/AC/Init/Speed editable for play; rest read)
 *   - Inspiration toggle + Death Saves (for play)
 *   - 6 Ability cards (read)
 *   - 6 Saving Throws (read with proficiency markers)
 *   - 18 Skills with computed modifier + proficiency markers (read)
 *   - Derived stats panel (Spell-DC, Spell-Atk, Passive Perception, Initiative)
 *   - Personality read-cards (Wesenszüge / Ideale / Bindungen / Schwächen)
 *   - Languages pills
 *
 * Editing of stat values / skill-prof / personality content happens in the
 * Aufbau tab (Phase 3). Only play-time mutations (HP/inspiration/death-saves)
 * are editable here.
 */
export default function Bogen({ char, setChar }) {
  const { t } = useI18n();
  const pb = getPB(char.level);

  const spellAbilityKey = (char.spellAbility || "INT").toLowerCase();
  const spellMod = modOf(char[spellAbilityKey] || 10);
  const spellDC  = 8 + pb + spellMod;
  const spellAtk = pb + spellMod;

  // Passive Perception = 10 + WIS-mod + (proficient skill_Perception ? pb : 0) + (expertise: ×2)
  const wisMod = modOf(char.wis || 10);
  const percProf = !!char.skills?.skill_Perception;
  const percExp  = !!char.skills?.exp_Perception;
  const passivePerc = 10 + wisMod + (percExp ? pb * 2 : percProf ? pb : 0);

  const u = (f, v) => setChar((p) => ({ ...p, [f]: v }));

  return (
    <div>
      {/* ── Identity Header ─────────────────────────────────────────────── */}
      <div style={{
        ...sx.card,
        background: "linear-gradient(135deg, rgba(124,58,237,0.10), rgba(0,0,0,0.2))",
        marginBottom: 10,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 0.7fr 0.7fr", gap: 8 }}>
          <Field label={t("sheet.name","Name")} value={char.name} large color={C.gold} />
          <Field label={t("sheet.primary_class","Primärklasse")} value={char.klass} color={C.gold} />
          <Field label={t("sheet.level","Level")} value={char.level} center color={C.gold} />
          <Field label={t("sheet.pb_short","PB")} value={`+${pb}`} center color={C.gold} accent />
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, color: C.textDim }}>
          <span><strong style={{ color: C.tealBright }}>{char.race}</strong> {t("bogen.race_lbl","Volk")}</span>
          {char.background && <span><strong style={{ color: C.amberBright }}>{char.background}</strong> {t("bogen.bg_lbl","Hintergrund")}</span>}
          {char.originFeat && <span><strong style={{ color: C.amberBright }}>⚔ {char.originFeat}</strong></span>}
        </div>
      </div>

      {/* ── Vitals Strip (HP/Init/Speed editable for play, AC read) ────── */}
      <div style={{ ...sx.card, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Vital label={t("sheet.hp","HP")} editable value={char.hp} setVal={(v) => u("hp", v)} max={char.maxHp} icon="❤️" col={C.red} />
          <Vital label={t("sheet.max_hp","Max HP")} editable value={char.maxHp} setVal={(v) => u("maxHp", v)} icon="💛" col={C.amber} />
          <Vital label={t("sheet.temp_hp","Temp HP")} editable value={char.tempHp || 0} setVal={(v) => u("tempHp", v)} icon="💙" col={C.blue} />
          <Vital label={t("sheet.ac","AC")} value={char.ac} icon="🛡️" col={C.teal} />
          <Vital label={t("sheet.init","Init")} value={modStr(char.dex || 10)} icon="⚡" col={C.green} />
          <Vital label={t("sheet.speed","Speed")} value={`${char.speed || 30} ft`} icon="💨" col={C.purple} />
          <Vital label={t("bogen.hd_short","HD")} value={`${(char.level || 1) - (char.hd_used || 0)}/${char.level || 1}${char.hd ? ` ${char.hd}` : ""}`} icon="🎲" col={C.amberBright} />
        </div>
      </div>

      {/* ── 6 Ability Cards (read) ─────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={sx.ct}>⚔️ {t("bogen.abilities_h","Attribute")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
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
                <div style={{ fontSize: 24, fontWeight: 700, color: C.textBright, lineHeight: 1.1, marginTop: 2 }}>{score}</div>
                <div style={{
                  display: "inline-block",
                  background: `${col}22`,
                  border: `1px solid ${col}55`,
                  borderRadius: 14,
                  padding: "1px 8px",
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: col,
                }}>{mod >= 0 ? `+${mod}` : mod}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Saving Throws (read) ───────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={sx.ct}>🛡️ {t("bogen.saves_h","Rettungswürfe")} <span style={{ color: C.textDim, fontSize: 11, fontWeight: 400 }}>{t("bogen.saves_legend","(● = Übung)")}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 6 }}>
          {ABS.map((ab) => {
            const score = char[ab.toLowerCase()] || 10;
            const prof  = !!(char.saves || {})[ab];
            const total = modOf(score) + (prof ? pb : 0);
            const col = SC[ab];
            return (
              <div key={ab} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 10px",
                background: prof ? `${col}14` : "transparent",
                border: `1px solid ${prof ? col + "55" : C.border}`,
                borderRadius: 8,
              }}>
                <span style={{ color: prof ? col : C.textDim, fontSize: 14, lineHeight: 1 }}>{prof ? "●" : "○"}</span>
                <span style={{ color: col, fontFamily: FH, fontSize: 10, fontWeight: 700, flex: 1 }}>{ab}</span>
                <span style={{ color: prof ? C.textBright : C.text, fontWeight: 700, fontSize: 14 }}>
                  {total >= 0 ? `+${total}` : total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 18 Skills (read with prof markers + computed mods) ─────────── */}
      <div style={sx.card}>
        <div style={sx.ct}>
          🎯 {t("bogen.skills_h","Fertigkeiten")}{" "}
          <span style={{ color: C.textDim, fontSize: 11, fontWeight: 400 }}>
            {t("bogen.skills_legend","(○ keine · ● Übung · ◉ Expertise)")}
          </span>
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
                <div key={skill} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "4px 8px",
                  background: isExp || isProf ? `${col}0a` : "transparent",
                  borderRadius: 6,
                }}>
                  <span style={{ color: markerCol, fontSize: 14, lineHeight: 1, width: 12 }}>{marker}</span>
                  <span style={{ color: col, fontFamily: FH, fontSize: 9, fontWeight: 700, width: 26 }}>{ab}</span>
                  <span style={{ flex: 1, fontSize: 13, color: isExp || isProf ? C.textBright : C.text }}>{skill}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: isExp || isProf ? C.gold : C.textDim,
                    minWidth: 32, textAlign: "right",
                  }}>
                    {bonus >= 0 ? `+${bonus}` : bonus}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Derived Stats Panel ─────────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={sx.ct}>📊 {t("bogen.derived_h","Abgeleitete Werte")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 6 }}>
          <Derived label={t("sheet.spell_dc","Zauber-SG")} value={spellDC} hint={`8 + PB(${pb}) + ${modStr(spellMod)}`} col={C.purple} />
          <Derived label={t("sheet.spell_atk","Zauber-Angriff")} value={`${spellAtk >= 0 ? "+" : ""}${spellAtk}`} hint={`PB(${pb}) + ${modStr(spellMod)}`} col={C.purpleBright} />
          <Derived label={t("bogen.passive_perc","Passive Wahrnehmung")} value={passivePerc} hint={`10 + WIS-Mod${percProf ? ` + PB(${pb})` : ""}${percExp ? " ×2" : ""}`} col={C.tealBright} />
          <Derived label={t("bogen.initiative","Initiative")} value={modStr(char.dex || 10)} hint={t("bogen.initiative_hint","DEX-Mod")} col={C.greenBright} />
        </div>
      </div>

      {/* ── Personality Read-Cards ──────────────────────────────────────── */}
      {(char.traits || char.ideals || char.bonds || char.flaws) && (
        <div style={sx.card}>
          <div style={sx.ct}>🎭 {t("bogen.personality_h","Persönlichkeit")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {char.traits && <PersonalityCard label={t("pdf.traits_lbl","Wesenszüge")} text={char.traits} col={C.amberBright} icon="✦" />}
            {char.ideals && <PersonalityCard label={t("pdf.ideals_lbl","Ideale")}     text={char.ideals} col={C.tealBright}  icon="★" />}
            {char.bonds  && <PersonalityCard label={t("pdf.bonds_lbl","Bindungen")}   text={char.bonds}  col={C.purpleBright} icon="∞" />}
            {char.flaws  && <PersonalityCard label={t("pdf.flaws_lbl","Schwächen")}   text={char.flaws}  col={C.redBright}  icon="⚠" />}
          </div>
        </div>
      )}

      {/* ── Languages ──────────────────────────────────────────────────── */}
      {Array.isArray(char.languages) && char.languages.length > 0 && (
        <div style={sx.card}>
          <div style={sx.ct}>🗣️ {t("pdf.languages_h","Sprachen")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {char.languages.map((l, i) => (
              <span key={i} style={{
                display: "inline-block",
                padding: "3px 10px",
                background: `${C.tealBright}18`,
                border: `1px solid ${C.tealBright}55`,
                borderRadius: 12,
                color: C.tealBright,
                fontSize: 11,
                fontWeight: 700,
              }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Hint — Edit-Path ────────────────────────────────────────────── */}
      <div style={{
        padding: "10px 12px",
        background: `${C.amberBright}10`,
        border: `1px dashed ${C.amberBright}40`,
        borderRadius: 8,
        color: C.amberBright,
        fontSize: 11,
        lineHeight: 1.5,
        textAlign: "center",
        marginTop: 4,
      }}>
        ℹ {t("bogen.edit_hint","Werte ändern? → Wechsle zum Tab 🧬 Aufbau")}
      </div>
    </div>
  );
}

// ─── helpers ───────────────────────────────────────────────────────────────
function Field({ label, value, large, center, color, accent }) {
  return (
    <div>
      <label style={sx.lbl}>{label}</label>
      <div style={{
        ...sx.inp,
        background: accent ? `${color}12` : "rgba(0,0,0,0.25)",
        border: `1px solid ${accent ? color + "33" : C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        fontFamily: FH,
        fontSize: large ? 16 : center ? 22 : 13,
        fontWeight: 700,
        color: color || C.text,
        cursor: "default",
        userSelect: "text",
        padding: "8px 10px",
      }}>
        {value}
      </div>
    </div>
  );
}

function Vital({ label, value, setVal, editable, max, icon, col }) {
  return (
    <div style={{
      background: `${col}12`,
      border: `1px solid ${col}30`,
      borderRadius: 10,
      padding: "8px 10px",
      textAlign: "center",
      minWidth: 70,
      flex: "1 1 70px",
    }}>
      <div style={{ fontSize: 10, color: col, fontFamily: FH, marginBottom: 2, letterSpacing: 0.5, fontWeight: 700 }}>
        {icon} {label}
      </div>
      {editable ? (
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { setVal(0); return; }
            const n = Number(raw);
            if (!Number.isFinite(n)) return;
            setVal(Math.max(0, Math.min(max ?? 999, n)));
          }}
          style={{
            ...sx.inp,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            color: C.textBright,
            padding: "2px 0",
            background: "transparent",
            border: "none",
            width: "100%",
            minWidth: 0,
          }}
        />
      ) : (
        <div style={{ fontSize: 18, fontWeight: 700, color: C.textBright }}>{value}</div>
      )}
    </div>
  );
}

function Derived({ label, value, hint, col }) {
  return (
    <div style={{
      background: `${col}10`,
      border: `1px solid ${col}40`,
      borderRadius: 8,
      padding: "8px 10px",
      textAlign: "center",
    }}>
      <div style={{ fontFamily: FH, fontSize: 10, color: col, fontWeight: 700, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.textBright, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{hint}</div>
    </div>
  );
}

function PersonalityCard({ label, text, col, icon }) {
  return (
    <div style={{
      background: `${col}0a`,
      border: `1px solid ${col}30`,
      borderLeft: `3px solid ${col}`,
      borderRadius: 8,
      padding: "8px 10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color: col, fontSize: 14 }}>{icon}</span>
        <strong style={{ color: col, fontSize: 11, letterSpacing: 0.5, fontFamily: FH }}>{label}</strong>
      </div>
      <p style={{ color: C.text, fontSize: 12, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>{text}</p>
    </div>
  );
}
