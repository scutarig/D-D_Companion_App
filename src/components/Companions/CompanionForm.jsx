import { useState } from "react";
import { C, sx, FH, SC } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";
import CompanionBestiaryImport from "./CompanionBestiaryImport.jsx";

const TYPES = [
  { id: "beast",     label: "Tier",       key: "comp.type_beast",     icon: "🐾" },
  { id: "construct", label: "Konstrukt",  key: "comp.type_construct", icon: "⚙️"  },
  { id: "humanoid",  label: "Humanoid",   key: "comp.type_humanoid",  icon: "👤" },
  { id: "fiend",     label: "Teufel",     key: "comp.type_fiend",     icon: "😈" },
  { id: "undead",    label: "Untoter",    key: "comp.type_undead",    icon: "💀" },
  { id: "celestial", label: "Himmlisch",  key: "comp.type_celestial", icon: "✨" },
  { id: "fey",       label: "Fee",        key: "comp.type_fey",       icon: "🧚" },
  { id: "dragon",    label: "Drache",     key: "comp.type_dragon",    icon: "🐉" },
  { id: "other",     label: "Sonstiges",  key: "comp.type_other",     icon: "❓" },
];

const SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
const ABS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const defaultForm = () => ({
  name: "", type: "beast", size: "Medium",
  hp: "10", maxHp: "10", ac: "12", speed: "30",
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  traits: "", actions: "", notes: "",
  senses: "", languages: "", cr: "",
});

/**
 * CompanionForm — Add / Edit companion modal
 * Props:
 *   initial: companion | null   — null = new companion
 *   onSave: (data) => void
 *   onCancel: () => void
 */
export default function CompanionForm({ initial, onSave, onCancel }) {
  const { t } = useI18n();
  const isEdit = !!initial;

  const [form, setForm] = useState(() =>
    initial
      ? {
          name: initial.name,
          type: initial.type ?? "beast",
          size: initial.size ?? "Medium",
          hp: String(initial.hp),
          maxHp: String(initial.maxHp),
          ac: String(initial.ac),
          speed: String(initial.speed),
          stats: { ...{ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }, ...initial.stats },
          traits: initial.traits ?? "",
          actions: initial.actions ?? "",
          notes: initial.notes ?? "",
          senses: initial.senses ?? "",
          languages: initial.languages ?? "",
          cr: initial.cr ?? "",
        }
      : defaultForm()
  );

  const [showBestiary, setShowBestiary] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // "basic" | "stats" | "details"

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setStat = (ab, val) =>
    setForm((p) => ({ ...p, stats: { ...p.stats, [ab]: parseInt(val) || 0 } }));

  const handleBestiaryImport = (data) => {
    setForm({
      name: data.name,
      type: data.type,
      size: data.size ?? "Medium",
      hp: String(data.hp),
      maxHp: String(data.maxHp),
      ac: String(data.ac),
      speed: String(data.speed),
      stats: { ...data.stats },
      traits: data.traits ?? "",
      actions: data.actions ?? "",
      notes: "",
      senses: data.senses ?? "",
      languages: data.languages ?? "",
      cr: data.cr ?? "",
    });
    setShowBestiary(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const hp = parseInt(form.hp) || 10;
    const maxHp = parseInt(form.maxHp) || hp;
    onSave?.({
      ...(isEdit ? { id: initial.id, createdAt: initial.createdAt, monsterRef: initial.monsterRef } : {}),
      name: form.name.trim(),
      type: form.type,
      size: form.size,
      hp: isEdit ? Math.min(hp, maxHp) : maxHp,
      maxHp,
      ac: parseInt(form.ac) || 10,
      speed: parseInt(form.speed) || 30,
      stats: { ...form.stats },
      traits: form.traits,
      actions: form.actions,
      notes: form.notes,
      senses: form.senses,
      languages: form.languages,
      cr: form.cr || null,
    });
  };

  const TABS = [
    { id: "basic",   label: t("comp.tab_basic","Basis") },
    { id: "stats",   label: t("comp.tab_stats","Stats") },
    { id: "details", label: t("comp.tab_details","Details") },
  ];

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onCancel?.()}>
      <div style={modalStyle}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: FH, fontSize: 15, color: C.green, fontWeight: 700 }}>
            {isEdit ? t("comp.edit_title","✎ Begleiter bearbeiten") : t("comp.new_title","🐾 Neuer Begleiter")}
          </div>
          <button onClick={onCancel} style={{ ...sx.bsm(C.red), padding: "4px 8px", fontSize: 13 }}>✕</button>
        </div>

        {/* Bestiary import button (only for new) */}
        {!isEdit && !showBestiary && (
          <button
            onClick={() => setShowBestiary(true)}
            style={{ ...sx.bsm(C.amber), width: "100%", padding: "9px", fontSize: 12, marginBottom: 14, textAlign: "left" }}
          >
            {t("comp.import_bestiary","📚 Aus Bestiary importieren — Monster als Begleiter hinzufügen")}
          </button>
        )}

        {showBestiary && (
          <div style={{ marginBottom: 14 }}>
            <CompanionBestiaryImport
              onImport={handleBestiaryImport}
              onCancel={() => setShowBestiary(false)}
            />
          </div>
        )}

        {!showBestiary && (
          <>
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, background: C.surface, borderRadius: 8, padding: 3 }}>
              {TABS.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setActiveTab(tb.id)}
                  style={{
                    flex: 1, padding: "7px 4px", borderRadius: 6, cursor: "pointer", fontSize: 11,
                    border: "none",
                    background: activeTab === tb.id ? C.card : "transparent",
                    color: activeTab === tb.id ? C.textBright : C.textDim,
                    fontWeight: activeTab === tb.id ? 700 : 400,
                    transition: "all .15s",
                  }}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Basic ─────────────────────────────────────────────────── */}
            {activeTab === "basic" && (
              <div>
                <div style={{ marginBottom: 10 }}>
                  <label style={sx.lbl}>{t("wb.name_required","Name *")}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="z.B. Shadowbark"
                    style={{ ...sx.inp, fontSize: 14 }}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>

                {/* Type selector */}
                <div style={{ marginBottom: 10 }}>
                  <label style={sx.lbl}>{t("wb.type_label","Typ")}</label>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {TYPES.map((ty) => (
                      <button
                        key={ty.id}
                        onClick={() => set("type", ty.id)}
                        style={{
                          padding: "5px 10px", borderRadius: 20, cursor: "pointer", fontSize: 10,
                          border: `1px solid ${form.type === ty.id ? C.green : C.border}`,
                          background: form.type === ty.id ? `${C.green}22` : "transparent",
                          color: form.type === ty.id ? C.greenBright : C.textDim,
                          fontWeight: form.type === ty.id ? 700 : 400,
                          transition: "all .12s",
                        }}
                      >
                        {ty.icon} {t(ty.key, ty.label)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div style={{ marginBottom: 10 }}>
                  <label style={sx.lbl}>{t("comp.size_label","Größe")}</label>
                  <select
                    value={form.size}
                    onChange={(e) => set("size", e.target.value)}
                    style={{ ...sx.sel, fontSize: 13 }}
                  >
                    {SIZES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* HP / MaxHP / AC / Speed / CR — responsive grid: ≥80px Mindestbreite */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 8 }}>
                  {[
                    { key: "hp",    label: "HP",      note: "aktuell" },
                    { key: "maxHp", label: "Max HP",  note: "" },
                    { key: "ac",    label: "RK (AC)", note: "" },
                    { key: "speed", label: "Speed ft", note: "" },
                    { key: "cr",    label: "CR",       note: "optional", text: true },
                  ].map(({ key, label, note, text }) => (
                    <div key={key}>
                      <label style={sx.lbl}>{label}</label>
                      <input
                        type={text ? "text" : "number"}
                        value={form[key]}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder={note}
                        style={{ ...sx.inp, fontSize: 13, textAlign: "center" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: Stats ────────────────────────────────────────────────── */}
            {activeTab === "stats" && (
              <div>
                <div style={{ fontSize: 11, color: C.textDim, marginBottom: 10 }}>
                  Attributwerte (1–30). Modifier wird automatisch berechnet.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
                  {ABS.map((ab) => {
                    const score = form.stats[ab] ?? 10;
                    const mod = Math.floor((score - 10) / 2);
                    const fmtMod = mod >= 0 ? `+${mod}` : `${mod}`;
                    return (
                      <div key={ab} style={{
                        background: `${SC[ab]}08`, border: `1px solid ${SC[ab]}25`,
                        borderRadius: 10, padding: "10px 8px", textAlign: "center",
                      }}>
                        <label style={{ ...sx.lbl, color: SC[ab], marginBottom: 6, textAlign: "center" }}>{ab}</label>
                        <input
                          type="number" min={1} max={30}
                          value={score}
                          onChange={(e) => setStat(ab, e.target.value)}
                          style={{ ...sx.inp, fontSize: 16, fontWeight: 700, textAlign: "center", padding: "6px 4px" }}
                        />
                        <div style={{ fontSize: 12, color: SC[ab], marginTop: 4, fontWeight: 700 }}>{fmtMod}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={sx.lbl}>Sinne</label>
                    <input
                      type="text"
                      value={form.senses}
                      onChange={(e) => set("senses", e.target.value)}
                      placeholder="z.B. Dunkelsicht 60 ft."
                      style={{ ...sx.inp, fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label style={sx.lbl}>Sprachen</label>
                    <input
                      type="text"
                      value={form.languages}
                      onChange={(e) => set("languages", e.target.value)}
                      placeholder="z.B. Gemeinsprache"
                      style={{ ...sx.inp, fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Details ──────────────────────────────────────────────── */}
            {activeTab === "details" && (
              <div>
                <div style={{ marginBottom: 10 }}>
                  <label style={sx.lbl}>Traits / Fähigkeiten</label>
                  <textarea
                    value={form.traits}
                    onChange={(e) => set("traits", e.target.value)}
                    placeholder="z.B. Rudeltaktik. Der Begleiter hat Vorteil auf Angriffswürfe..."
                    style={{ ...sx.ta, fontSize: 12, minHeight: 80 }}
                  />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={sx.lbl}>Aktionen</label>
                  <textarea
                    value={form.actions}
                    onChange={(e) => set("actions", e.target.value)}
                    placeholder="z.B. Biss. Nahkampfangriff: +5 auf Treffer, 1d6+3 Stichschaden."
                    style={{ ...sx.ta, fontSize: 12, minHeight: 80 }}
                  />
                </div>
                <div>
                  <label style={sx.lbl}>Notizen</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Persönliche Notizen zum Begleiter..."
                    style={{ ...sx.ta, fontSize: 12, minHeight: 60 }}
                  />
                </div>
              </div>
            )}

            {/* Save / Cancel */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                style={{
                  ...sx.btn(C.green), flex: 1, padding: "12px", fontSize: 13, fontWeight: 700,
                  opacity: form.name.trim() ? 1 : 0.4,
                  cursor: form.name.trim() ? "pointer" : "not-allowed",
                }}
              >
                {isEdit ? t("comp.save_changes","✓ Änderungen speichern") : t("comp.add_btn","＋ Begleiter hinzufügen")}
              </button>
              <button onClick={onCancel} style={{ ...sx.bsm(C.border), padding: "10px 16px", fontSize: 12, color: C.textDim }}>
                {t("prof.cancel_btn","Abbrechen")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 16,
};
const modalStyle = {
  background: "#1e1b22", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: 20, width: "100%", maxWidth: 480,
  boxShadow: "0 20px 60px rgba(0,0,0,0.8)", maxHeight: "92vh", overflowY: "auto",
};
