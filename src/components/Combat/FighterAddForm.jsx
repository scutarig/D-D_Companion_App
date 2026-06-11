import { useState } from "react";
import { C, sx, FH } from "../../constants/theme.js";
import { useFighter } from "../../hooks/useFighter.js";
import { MONSTERS as Bestiary } from "../../data/monsters.js";
import { useI18n } from "../../i18n/index.js";
import { useDialog } from "../../hooks/useDialog.jsx";

export default function FighterAddForm({ onClose }) {
  const { t } = useI18n();
  const { alert } = useDialog();
  const { addFighter } = useFighter();

  const [mode, setMode] = useState("manual"); // "manual" or "bestiary"
  const [formData, setFormData] = useState({
    name: "",
    hp: "10",
    maxHp: "10",
    ac: "10",
    initiativeBonus: "0",
  });
  const [bestiarySearch, setBestiarySearch] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterCount, setMonsterCount] = useState(1);

  // Manual add
  const handleAddManual = () => {
    if (!formData.name.trim()) {
      alert(t("combat.err_name_required","Name erforderlich!"));
      return;
    }
    addFighter({
      name: formData.name,
      hp: parseInt(formData.hp) || 10,
      maxHp: parseInt(formData.maxHp) || 10,
      ac: parseInt(formData.ac) || 10,
      initiativeBonus: parseInt(formData.initiativeBonus) || 0,
    });
    setFormData({ name: "", hp: "10", maxHp: "10", ac: "10", initiativeBonus: "0" });
    onClose?.();
  };

  // Add from bestiary
  const handleAddFromBestiary = () => {
    if (!selectedMonster) {
      alert(t("combat.err_select_monster","Monster auswählen!"));
      return;
    }
    for (let i = 0; i < monsterCount; i++) {
      addFighter({
        name: selectedMonster.name,
        hp: selectedMonster.hp,
        maxHp: selectedMonster.hp,
        ac: selectedMonster.ac,
        initiativeBonus: selectedMonster.initiativeBonus || 0,
        monsterRef: selectedMonster.id,
      });
    }
    setSelectedMonster(null);
    setMonsterCount(1);
    setBestiarySearch("");
    onClose?.();
  };

  // Filter bestiary
  const filteredMonsters = Bestiary.filter((m) =>
    m.name.toLowerCase().includes(bestiarySearch.toLowerCase())
  ).slice(0, 20);

  return (
    <div style={{ background: C.surface, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 12 }}>
      {/* Mode Selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button type="button"
          onClick={() => setMode("manual")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 6,
            border: `2px solid ${mode === "manual" ? C.blue : C.border}`,
            background: mode === "manual" ? `${C.blue}22` : "transparent",
            color: mode === "manual" ? C.blue : C.textDim,
            fontWeight: mode === "manual" ? 700 : 400,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {t("combat.add_mode_manual","✏️ Manuell")}
        </button>
        <button type="button"
          onClick={() => setMode("bestiary")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 6,
            border: `2px solid ${mode === "bestiary" ? C.purple : C.border}`,
            background: mode === "bestiary" ? `${C.purple}22` : "transparent",
            color: mode === "bestiary" ? C.purple : C.textDim,
            fontWeight: mode === "bestiary" ? 700 : 400,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {t("combat.add_mode_bestiary","📚 Bestiary")}
        </button>
      </div>

      {/* Manual Form */}
      {mode === "manual" && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder={t("combat.placeholder_goblin","z.B. Goblin")}
              style={{ ...sx.inp, width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={sx.lbl}>HP</label>
              <input
                type="number"
                value={formData.hp}
                onChange={(e) => setFormData((p) => ({ ...p, hp: e.target.value, maxHp: e.target.value }))}
                style={sx.inp}
              />
            </div>
            <div>
              <label style={sx.lbl}>AC</label>
              <input
                type="number"
                value={formData.ac}
                onChange={(e) => setFormData((p) => ({ ...p, ac: e.target.value }))}
                style={sx.inp}
              />
            </div>
            <div>
              <label style={sx.lbl}>{t("combat.init_bonus_lbl","Init Bonus")}</label>
              <input
                type="number"
                value={formData.initiativeBonus}
                onChange={(e) => setFormData((p) => ({ ...p, initiativeBonus: e.target.value }))}
                style={sx.inp}
              />
            </div>
          </div>

          <button type="button" onClick={handleAddManual} style={{ ...sx.btn(C.blue), width: "100%" }}>
            {t("combat.add_short_btn","➕ Hinzufügen")}
          </button>
        </div>
      )}

      {/* Bestiary Mode */}
      {mode === "bestiary" && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <label style={sx.lbl}>{t("combat.search_monster_short","Monster suchen")}</label>
            <input
              type="text"
              value={bestiarySearch}
              onChange={(e) => setBestiarySearch(e.target.value)}
              placeholder={t("combat.placeholder_goblin_orc","z.B. Goblin, Orc...")}
              style={{ ...sx.inp, width: "100%" }}
            />
          </div>

          {filteredMonsters.length > 0 && (
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              {filteredMonsters.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMonster(m)}
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer",
                    background: selectedMonster?.id === m.id ? `${C.purple}22` : "transparent",
                    color: selectedMonster?.id === m.id ? C.purpleBright : C.textBright,
                    fontSize: 12,
                  }}
                >
                  <strong>{m.name}</strong> · HP {m.hp} · AC {m.ac}
                </div>
              ))}
            </div>
          )}

          {selectedMonster && (
            <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 6, padding: "8px 10px", marginBottom: 8, fontSize: 12 }}>
              <div style={{ color: C.purpleBright, fontWeight: 700, marginBottom: 4 }}>{selectedMonster.name}</div>
              <div style={{ color: C.textDim, fontSize: 11, marginBottom: 6 }}>HP {selectedMonster.hp} · AC {selectedMonster.ac}</div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.textDim }}>{t("combat.count_label","Anzahl:")}</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={monsterCount}
                  onChange={(e) => setMonsterCount(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ ...sx.inp, width: 60, fontSize: 12 }}
                />
              </div>

              <button type="button" onClick={handleAddFromBestiary} style={{ ...sx.btn(C.green), width: "100%" }}>
                ➕ {monsterCount}× {selectedMonster.name}
              </button>
            </div>
          )}

          {filteredMonsters.length === 0 && bestiarySearch && (
            <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: "12px 0" }}>
              {t("combat.no_monster_found","Keine Monster gefunden")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
