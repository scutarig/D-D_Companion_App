import { C, sx, FH } from "../../../constants/theme.js";
import { useI18n } from "../../../i18n/index.js";

export default function Step14_Personality({ state, updatePartial }) {
  const { t } = useI18n();
  const u = (k, v) => updatePartial({ [k]: v });

  return (
    <div>
      <h2 style={{ color: C.gold, fontFamily: FH, marginBottom: 4 }}>
        {t("wizard.s14.title","Persönlichkeit & Identität")}
      </h2>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        {t("wizard.s14.subtitle","Fülle Charakter-Details aus.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <Field label={t("wizard.s14.name","Name *")} value={state.name} onChange={(v) => u("name", v)} accent={C.gold} />
        <Field label={t("wizard.s14.age","Alter")} value={state.age} onChange={(v) => u("age", v)} />
        <Field label={t("wizard.s14.sex","Geschlecht")} value={state.sex} onChange={(v) => u("sex", v)} />
        <Field label={t("wizard.s14.height","Größe")} value={state.height} onChange={(v) => u("height", v)} />
        <Field label={t("wizard.s14.weight","Gewicht")} value={state.weight} onChange={(v) => u("weight", v)} />
        <Field label={t("wizard.s14.deity","Gottheit")} value={state.deity} onChange={(v) => u("deity", v)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginTop: 16 }}>
        <TextArea label={t("wizard.s14.traits","Wesenszüge")} value={state.traits} onChange={(v) => u("traits", v)} col={C.amberBright} />
        <TextArea label={t("wizard.s14.ideals","Ideale")} value={state.ideals} onChange={(v) => u("ideals", v)} col={C.tealBright} />
        <TextArea label={t("wizard.s14.bonds","Bindungen")} value={state.bonds} onChange={(v) => u("bonds", v)} col={C.purpleBright} />
        <TextArea label={t("wizard.s14.flaws","Schwächen")} value={state.flaws} onChange={(v) => u("flaws", v)} col={C.redBright} />
      </div>

      <div style={{ marginTop: 14 }}>
        <TextArea label={t("wizard.s14.backstory","Hintergrundgeschichte")} value={state.backstory} onChange={(v) => u("backstory", v)} col={C.gold} rows={5} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, accent }) {
  // accent-styling only when an accent color is supplied; otherwise sx.inp's
  // default color (C.textBright) must be preserved — setting `color: undefined`
  // would override the spread and leave the input text invisible on the dark
  // wizard background.
  const style = accent
    ? { ...sx.inp, color: accent, fontWeight: 700 }
    : sx.inp;
  return (
    <div>
      <label style={sx.lbl}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} style={style} />
    </div>
  );
}

function TextArea({ label, value, onChange, col, rows = 2 }) {
  return (
    <div>
      <label style={{ ...sx.lbl, color: col }}>{label}</label>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows}
        style={{ ...sx.ta, borderLeft: `3px solid ${col}` }} />
    </div>
  );
}

export const validate = (s) => s.name?.trim()
  ? { ok: true }
  : { ok: false, errorKey: "wizard.err_no_name" };
