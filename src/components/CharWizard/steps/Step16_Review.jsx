import { useMemo } from "react";
import { C, sx, FH, ABS, SC } from "../../../constants/theme.js";
import { getPB, modOf, modStr } from "../../../utils/helpers.js";
import { useI18n } from "../../../i18n/index.js";
import { buildCharFromWizard, spellIdsFromWizard } from "../utils/buildCharFromWizard.js";

export default function Step16_Review({ state }) {
  const { t } = useI18n();

  // Pre-build the char so we can preview every auto-derived value
  // (HP, AC, Init, Save bonuses, etc.) before the user clicks Commit.
  const preview = useMemo(() => {
    try { return buildCharFromWizard(state); } catch { return null; }
  }, [state]);

  const onCreate = () => {
    const char = buildCharFromWizard(state);
    const { knownSpellIds, preparedSpellIds } = spellIdsFromWizard(state);

    // Write directly to localStorage. React's setState batching could defer
    // a setChars call past window.location.reload(), so we bypass usePersist
    // here and let the page reload pick up the persisted char-list on mount.
    try {
      const existing = JSON.parse(localStorage.getItem("chars_v4") || "[]");
      const next = Array.isArray(existing) ? [...existing, char] : [char];
      localStorage.setItem("chars_v4", JSON.stringify(next));
      localStorage.setItem("chars_active_v4", JSON.stringify(char.id));
      localStorage.setItem(`spells_known_${char.id}`, JSON.stringify(knownSpellIds));
      localStorage.setItem(`spells_prep_${char.id}`,  JSON.stringify(preparedSpellIds));
    } catch (_) { /* quota errors handled by the user via export tools */ }

    localStorage.removeItem("wizard_active_v1");
    window.location.reload();
  };

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s16.title","Übersicht & Bestätigung")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s16.subtitle","Prüfe deine Auswahlen und alle automatisch berechneten Werte.")}
      </p>

      <Section title={t("wizard.s16.section_basics","Basis")}>
        <Row label="Name">{state.name || "—"}</Row>
        <Row label="Klasse">{state.klass || "—"}</Row>
        <Row label="Ziel-Level">{state.targetLevel}</Row>
        {state.classSkillsChosen?.length > 0 && <Row label="Klassen-Skills">{state.classSkillsChosen.join(", ")}</Row>}
        {state.classChoices && Object.keys(state.classChoices).length > 0 && (
          <Row label="Klassen-Choice">{Object.values(state.classChoices).join(", ")}</Row>
        )}
        {(state.cantripsChosen?.length || 0) + (state.lv1SpellsChosen?.length || 0) > 0 && (
          <Row label="Zauber">
            {state.cantripsChosen?.length || 0} Cantrips · {state.lv1SpellsChosen?.length || 0} Lv1-Spells
          </Row>
        )}
      </Section>

      <Section title={t("wizard.s16.section_origin","Origin")}>
        <Row label="Background">{state.background || "—"}</Row>
        <Row label="Origin-Feat">{preview?.originFeat || "—"}</Row>
        <Row label="Spezies">{state.race || "—"}</Row>
        {preview?.toolProfs?.length > 0 && <Row label="Werkzeug-Übung">{preview.toolProfs.join(", ")}</Row>}
        {preview?.languages?.length > 0 && <Row label="Sprachen">{preview.languages.join(", ")}</Row>}
      </Section>

      {preview && <DerivedStatsPreview char={preview} state={state} />}

      {preview && <InventoryPreview char={preview} />}

      <Section title={t("wizard.s16.section_personality","Persönlichkeit")}>
        <Row label="Alignment">{state.alignment || "—"}</Row>
        <Row label="Wesenszüge">{state.traits || "—"}</Row>
        <Row label="Ideale">{state.ideals || "—"}</Row>
        <Row label="Bindungen">{state.bonds || "—"}</Row>
        <Row label="Schwächen">{state.flaws || "—"}</Row>
      </Section>

      <button type="button" onClick={onCreate}
        style={{ ...sx.btn(C.green), fontSize: 14, padding: "12px 24px", marginTop: 20, display: "block", marginLeft: "auto", marginRight: "auto" }}>
        {t("wizard.s16.create","🎲 Charakter erstellen")}
      </button>
    </div>
  );
}

// ─── Derived stats preview — formulas for every auto-computed value ──────
function DerivedStatsPreview({ char, state }) {
  const pb = getPB(char.level);
  const dexMod = modOf(char.dex || 10);
  const conMod = modOf(char.con || 10);
  const wisMod = modOf(char.wis || 10);
  const hdMatch = (char.hd || "d10").match(/\d+/);
  const hdSize  = hdMatch ? parseInt(hdMatch[0], 10) : 10;

  // Spell-DC / atk for casters
  const sa = (state.cantripsChosen?.length || state.lv1SpellsChosen?.length) ? char.spellAbility || "INT" : null;
  const saMod = sa ? modOf(char[sa.toLowerCase()] || 10) : 0;
  const spellDC  = sa ? 8 + pb + saMod : null;
  const spellAtk = sa ? pb + saMod : null;

  // Save totals (mod + PB if proficient)
  const saves = ABS.map((ab) => {
    const mod = modOf(char[ab.toLowerCase()] || 10);
    const prof = !!char.saves?.[ab];
    const total = mod + (prof ? pb : 0);
    return { ab, prof, total, formula: `${ab}-Mod (${modStr(char[ab.toLowerCase()] || 10)})${prof ? ` + PB (+${pb})` : ""}` };
  });

  return (
    <Section title="📊 Berechnete Werte">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, marginBottom: 10 }}>
        <Stat label="HP" value={char.maxHp} formula={`HD-${state.targetLevel === 1 ? "Max" : "Stack"} + CON-Mod (${modStr(char.con)}) je Level`} />
        <Stat label="AC" value={10 + dexMod} formula={`10 + DEX-Mod (${modStr(char.dex)})`} hint="Ungerüstet — Rüstung im Inventar erhöht diesen Wert" />
        <Stat label="Init" value={modStr(char.dex)} formula="DEX-Mod" />
        <Stat label="Speed" value={`${char.speed} ft`} formula="aus Spezies" />
        <Stat label="PB" value={`+${pb}`} formula={`aus Level ${char.level}`} />
        <Stat label="HD" value={`${char.level}× ${char.hd}`} formula="aus Klasse × Level" />
        <Stat label="Passive Wahrnehmung" value={10 + wisMod + (char.skills?.skill_Perception ? pb : 0)}
          formula={`10 + WIS-Mod (${modStr(char.wis)})${char.skills?.skill_Perception ? ` + PB (+${pb})` : ""}`} />
        {spellDC !== null && <Stat label="Zauber-SG" value={spellDC} formula={`8 + PB (+${pb}) + ${sa}-Mod (${modStr(char[sa.toLowerCase()])})`} />}
        {spellAtk !== null && <Stat label="Zauber-Atk" value={spellAtk >= 0 ? `+${spellAtk}` : `${spellAtk}`} formula={`PB (+${pb}) + ${sa}-Mod (${modStr(char[sa.toLowerCase()])})`} />}
      </div>

      <div style={{ ...sx.ct, color: C.tealBright, fontSize: 11, marginTop: 12, marginBottom: 6 }}>
        🛡️ Saves
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 6 }}>
        {saves.map((s) => (
          <div key={s.ab} style={{ ...sx.card, padding: "6px 10px", borderColor: s.prof ? `${SC[s.ab]}55` : C.border }}>
            <div style={{ fontFamily: FH, fontSize: 10, color: SC[s.ab], fontWeight: 700 }}>
              {s.prof ? "●" : "○"} {s.ab}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textBright }}>
              {s.total >= 0 ? `+${s.total}` : s.total}
            </div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>{s.formula}</div>
          </div>
        ))}
      </div>

      <div style={{ ...sx.ct, color: C.tealBright, fontSize: 11, marginTop: 12, marginBottom: 6 }}>
        🎯 Skill-Profs (●)
      </div>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>
        {(() => {
          const profs = Object.keys(char.skills || {})
            .filter((k) => k.startsWith("skill_") && char.skills[k])
            .map((k) => k.replace("skill_", ""));
          return profs.length > 0 ? profs.join(" · ") : "—";
        })()}
      </div>
    </Section>
  );
}

function Stat({ label, value, formula, hint }) {
  return (
    <div style={{ ...sx.card, padding: "8px 12px" }}>
      <div style={{ fontSize: 10, color: C.textDim, fontFamily: FH, fontWeight: 700, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: C.gold, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 9, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>{formula}</div>
      {hint && <div style={{ fontSize: 9, color: C.amberBright, marginTop: 2 }}>ℹ {hint}</div>}
    </div>
  );
}

// ─── Inventory preview ──────────────────────────────────────────────────
function InventoryPreview({ char }) {
  const inv = char.inventory || [];
  const coins = ["platinum", "gold", "electrum", "silver", "copper"]
    .map((k) => char[k] ? `${char[k]} ${k.charAt(0).toUpperCase()}${k.slice(1)}` : null)
    .filter(Boolean);
  return (
    <Section title="🎒 Inventar (aus Packs entpackt)">
      {coins.length > 0 && (
        <div style={{ marginBottom: 8, fontSize: 12, color: C.amberBright, fontFamily: FH, fontWeight: 700 }}>
          💰 {coins.join(" · ")}
        </div>
      )}
      {inv.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.6 }}>
          {inv.map((it, i) => (
            <li key={i}>{it.qty > 1 && <strong>{it.qty}× </strong>}{it.name}</li>
          ))}
        </ul>
      ) : (
        <div style={{ color: C.textDim, fontSize: 12 }}>—</div>
      )}
    </Section>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ ...sx.card, marginBottom: 10 }}>
      <div style={{ ...sx.ct, color: C.amberBright, fontSize: 12, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
function Row({ label, children }) {
  return (
    <div style={{ fontSize: 12, marginBottom: 4 }}>
      <strong style={{ color: C.textDim }}>{label}:</strong>{" "}
      <span style={{ color: C.text }}>{children}</span>
    </div>
  );
}

export const validate = () => ({ ok: true });
