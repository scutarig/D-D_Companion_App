import { C, sx, FH } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";
import { buildCharFromWizard, spellIdsFromWizard } from "../utils/buildCharFromWizard.js";

export default function Step16_Review({ state }) {
  const { t } = useI18n();

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
        {t("wizard.s16.subtitle","Prüfe deine Auswahlen.")}
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
        <Row label="Klassen-Equipment">Pack {state.classEquipmentChoice || "?"}</Row>
      </Section>

      <Section title={t("wizard.s16.section_origin","Origin")}>
        <Row label="Background">{state.background || "—"}</Row>
        <Row label="Spezies">{state.race || "—"}</Row>
        <Row label="Background-Equipment">Pack {state.bgEquipmentChoice || "?"}</Row>
      </Section>

      <Section title={t("wizard.s16.section_stats","Attribute")}>
        <Row label="Point-Buy (vor ASI)">
          STR {state.abilityScores.str} · DEX {state.abilityScores.dex} · CON {state.abilityScores.con} ·
          {" "}INT {state.abilityScores.int} · WIS {state.abilityScores.wis} · CHA {state.abilityScores.cha}
        </Row>
        <Row label="Background-ASI">
          {Object.entries(state.bgAsiPicks || {}).filter(([,v])=>v>0).map(([ab, v]) => `${ab} +${v}`).join(" · ") || "—"}
        </Row>
        <Row label="Alignment">{state.alignment || "—"}</Row>
      </Section>

      <Section title={t("wizard.s16.section_personality","Persönlichkeit")}>
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
