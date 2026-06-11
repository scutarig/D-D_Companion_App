import { C, sx, FH } from "../../constants/theme.js";
import {
  MAGIC_INITIATE_LISTS, ARTISAN_TOOLS, MUSICAL_INSTRUMENTS,
  SKILLED_OPTIONS, TAVERN_BRAWLER_STATS,
  isComplexOriginFeat, getFeatIdFromName, getLuckPointsMax,
} from "../../data/originFeatChoices.js";
import { useI18n } from "../../i18n/index.js";

/**
 * OriginFeatChoices — Picker UI for the 6 complex Origin Feats (PHB 2024)
 *
 * Erscheint nur wenn char.originFeat ein "komplexer" Feat ist
 * (Magic Initiate, Crafter, Skilled, Musician, Lucky, Tavern Brawler).
 *
 * Speichert Wahlen in char.featChoices[featId] = { ... }
 *
 * Lucky-Tracking: char.featChoices.lucky.used = number (consumed Luck Points)
 */
export default function OriginFeatChoices({ char, setChar }) {
  const { t } = useI18n();
  if (!char.originFeat) return null;
  if (!isComplexOriginFeat(char.originFeat)) return null;

  const featId = getFeatIdFromName(char.originFeat);
  const choices = char.featChoices?.[featId] || {};

  const setChoice = (key, value) => {
    setChar(p => ({
      ...p,
      featChoices: {
        ...(p.featChoices || {}),
        [featId]: { ...(p.featChoices?.[featId] || {}), [key]: value },
      },
    }));
  };

  return (
    <div style={{
      ...sx.card,
      background: `linear-gradient(135deg, ${C.amberBright}08, rgba(0,0,0,0.2))`,
      borderLeft: `3px solid ${C.amberBright}`,
    }}>
      <div style={{ fontFamily: FH, fontSize: 13, color: C.amberBright, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>
        {t("char.origin_feat_config_header","⚔ ORIGIN FEAT KONFIGURATION")}
      </div>
      <div style={{
        fontSize: 11, color: C.text, lineHeight: 1.55,
        background: `${C.amberBright}0d`, border: `1px solid ${C.amberBright}30`,
        borderRadius: 6, padding: "7px 10px", marginBottom: 12,
      }}>
        <b>{char.originFeat}</b> {t("char.choose_options_for_feat","— wähle die nötigen Optionen für diesen Feat (PHB 2024).")}
      </div>

      {featId === "magic_initiate" && <MagicInitiatePicker choices={choices} setChoice={setChoice} />}
      {featId === "crafter" && <CrafterPicker choices={choices} setChoice={setChoice} />}
      {featId === "skilled" && <SkilledPicker choices={choices} setChoice={setChoice} />}
      {featId === "musician" && <MusicianPicker choices={choices} setChoice={setChoice} />}
      {featId === "lucky" && <LuckyTracker char={char} choices={choices} setChoice={setChoice} />}
      {featId === "tavern_brawler" && <TavernBrawlerPicker choices={choices} setChoice={setChoice} />}
    </div>
  );
}

// ─── 1. Magic Initiate ──────────────────────────────────────────────────────
function MagicInitiatePicker({ choices, setChoice }) {
  const list = choices.list || "";
  const cantrip1 = choices.cantrip1 || "";
  const cantrip2 = choices.cantrip2 || "";
  const lvl1 = choices.lvl1 || "";
  const listData = list ? MAGIC_INITIATE_LISTS[list] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <label style={sx.lbl}>Spell-Liste</label>
        <select value={list} onChange={e => {
          setChoice("list", e.target.value);
          setChoice("cantrip1", "");
          setChoice("cantrip2", "");
          setChoice("lvl1", "");
        }} style={sx.sel}>
          <option value="">— Wähle Liste —</option>
          <option value="cleric">Cleric</option>
          <option value="druid">Druid</option>
          <option value="wizard">Wizard</option>
        </select>
      </div>

      {listData && (
        <>
          <div>
            <label style={sx.lbl}>Cantrip 1 (von {listData.name})</label>
            <select value={cantrip1} onChange={e => setChoice("cantrip1", e.target.value)} style={sx.sel}>
              <option value="">— Wähle Cantrip —</option>
              {listData.cantrips.filter(c => c !== cantrip2).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={sx.lbl}>Cantrip 2 (von {listData.name})</label>
            <select value={cantrip2} onChange={e => setChoice("cantrip2", e.target.value)} style={sx.sel}>
              <option value="">— Wähle Cantrip —</option>
              {listData.cantrips.filter(c => c !== cantrip1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={sx.lbl}>Lv1 Spell (von {listData.name}) — 1×/Long Rest ohne Slot</label>
            <select value={lvl1} onChange={e => setChoice("lvl1", e.target.value)} style={sx.sel}>
              <option value="">— Wähle Lv1 Spell —</option>
              {listData.lvl1.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </>
      )}

      <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", marginTop: 4 }}>
        Spellcasting-Ability: INT/WIS/CHA deiner Wahl (je nach Liste).
      </div>
    </div>
  );
}

// ─── 2. Crafter ─────────────────────────────────────────────────────────────
function CrafterPicker({ choices, setChoice }) {
  const tools = choices.tools || ["", "", ""];
  const setTool = (idx, val) => {
    const next = [...tools]; next[idx] = val;
    setChoice("tools", next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim }}>3 Artisan's Tools deiner Wahl:</div>
      {[0, 1, 2].map(i => (
        <div key={i}>
          <label style={sx.lbl}>Tool {i + 1}</label>
          <select value={tools[i] || ""} onChange={e => setTool(i, e.target.value)} style={sx.sel}>
            <option value="">— Wähle Tool —</option>
            {ARTISAN_TOOLS.filter(t => !tools.includes(t) || t === tools[i]).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      ))}
      <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic" }}>
        Crafter-Bonus: 20% Rabatt auf nicht-magische Items. Nach Long Rest: 1 Stück Ausrüstung herstellen.
      </div>
    </div>
  );
}

// ─── 3. Skilled ─────────────────────────────────────────────────────────────
function SkilledPicker({ choices, setChoice }) {
  const selections = choices.selections || ["", "", ""];
  const setSel = (idx, val) => {
    const next = [...selections]; next[idx] = val;
    setChoice("selections", next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim }}>3 Skills oder Tools deiner Wahl:</div>
      {[0, 1, 2].map(i => (
        <div key={i}>
          <label style={sx.lbl}>Wahl {i + 1}</label>
          <select value={selections[i] || ""} onChange={e => setSel(i, e.target.value)} style={sx.sel}>
            <option value="">— Wähle Skill oder Tool —</option>
            <optgroup label="Skills">
              {SKILLED_OPTIONS.filter(o => o.type === "skill" && (!selections.includes(o.id) || o.id === selections[i])).map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </optgroup>
            <optgroup label="Artisan's Tools">
              {SKILLED_OPTIONS.filter(o => o.type === "tool" && o.id.startsWith("tool_") && !["tool_thieves","tool_navigator","tool_herbalism","tool_disguise","tool_forgery","tool_poisoner"].includes(o.id) && (!selections.includes(o.id) || o.id === selections[i])).map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </optgroup>
            <optgroup label="Other Tools">
              {SKILLED_OPTIONS.filter(o => ["tool_thieves","tool_navigator","tool_herbalism","tool_disguise","tool_forgery","tool_poisoner"].includes(o.id) && (!selections.includes(o.id) || o.id === selections[i])).map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </optgroup>
            <optgroup label="Musical Instruments">
              {SKILLED_OPTIONS.filter(o => o.type === "instrument" && (!selections.includes(o.id) || o.id === selections[i])).map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      ))}
    </div>
  );
}

// ─── 4. Musician ────────────────────────────────────────────────────────────
function MusicianPicker({ choices, setChoice }) {
  const instruments = choices.instruments || ["", "", ""];
  const setInstr = (idx, val) => {
    const next = [...instruments]; next[idx] = val;
    setChoice("instruments", next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim }}>3 Musical Instruments deiner Wahl:</div>
      {[0, 1, 2].map(i => (
        <div key={i}>
          <label style={sx.lbl}>Instrument {i + 1}</label>
          <select value={instruments[i] || ""} onChange={e => setInstr(i, e.target.value)} style={sx.sel}>
            <option value="">— Wähle Instrument —</option>
            {MUSICAL_INSTRUMENTS.filter(t => !instruments.includes(t) || t === instruments[i]).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      ))}
      <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic" }}>
        Performance-Effekt: Nach Short/Long Rest, spiele Stück → bis PB Verbündete (+ du) erhalten Heroic Inspiration.
      </div>
    </div>
  );
}

// ─── 5. Lucky — Tracker ─────────────────────────────────────────────────────
function LuckyTracker({ char, choices, setChoice }) {
  const max = getLuckPointsMax(char.level || 1);
  const used = choices.used || 0;
  const remaining = max - used;

  return (
    <div>
      <div style={{ fontSize: 12, color: C.text, marginBottom: 10 }}>
        <b>Luck Points:</b> {remaining} / {max}
        <span style={{ color: C.textDim, fontSize: 10, marginLeft: 8 }}>
          (PB × Punkte pro Long Rest, basiert auf Char-Level)
        </span>
      </div>

      {/* Visual dot tracker */}
      <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
        {Array.from({ length: max }).map((_, i) => {
          const isUsed = i < used;
          return (
            <button
              key={i}
              onClick={() => setChoice("used", isUsed ? i : i + 1)}
              title={isUsed ? "Verbraucht — klick um zurückzusetzen" : "Verfügbar — klick um zu verbrauchen"}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: `2px solid ${isUsed ? C.textDim : C.amberBright}`,
                background: isUsed ? "transparent" : C.amberBright,
                cursor: "pointer",
                transition: "all .15s",
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setChoice("used", 0)} style={{ ...sx.bsm(C.gold), padding: "5px 10px", fontSize: 10 }}>
          🌟 Long Rest Reset
        </button>
        <button onClick={() => setChoice("used", Math.min(max, used + 1))} style={{ ...sx.bsm(C.red), padding: "5px 10px", fontSize: 10 }}>
          ⚡ Punkt verbrauchen
        </button>
      </div>

      <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", marginTop: 8, lineHeight: 1.5 }}>
        <b>Spend Luck Point:</b> Vor d20-Wurf für Reroll → musst neuen Wurf nehmen.<br />
        <b>Spend gegen Wurf:</b> Nach gegnerischem Wurf gegen dich → Gegner muss rerollen.
      </div>
    </div>
  );
}

// ─── 6. Tavern Brawler ──────────────────────────────────────────────────────
function TavernBrawlerPicker({ choices, setChoice }) {
  const stat = choices.stat || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.textDim }}>Wähle: +1 STR oder +1 CON (Half-Feat, max 20):</div>
      <div style={{ display: "flex", gap: 6 }}>
        {TAVERN_BRAWLER_STATS.map(s => (
          <button
            key={s}
            onClick={() => setChoice("stat", s === stat ? "" : s)}
            style={{
              flex: 1, padding: "10px",
              borderRadius: 8, cursor: "pointer", transition: "all .15s",
              background: stat === s ? `${C.amberBright}22` : "transparent",
              border: `1.5px solid ${stat === s ? C.amberBright : C.border}`,
              color: stat === s ? C.amberBright : C.text,
              fontFamily: FH, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
            }}>
            +1 {s}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic", marginTop: 4, lineHeight: 1.5 }}>
        <b>Brawler-Bonus:</b> Unarmed Strikes: 1d4 statt 1 Schaden. 1×/Zug nach Treffer mit Unarmed/Improvised: Push 5ft.
        Improvised Weapons gelten als Proficient.
      </div>
    </div>
  );
}
