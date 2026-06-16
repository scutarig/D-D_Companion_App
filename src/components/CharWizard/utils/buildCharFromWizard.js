import { newChar } from "../../../utils/helpers.js";
import { getClassHd } from "../../../utils/multiclass.js";
import { D3_KLASSEN } from "../../../data/classes.js";
import { BACKGROUNDS_FULL } from "../../../data/backgrounds.js";
import { RACES_FULL } from "../../../data/races.js";

const SAVE_CODES = new Set(["STR", "DEX", "CON", "INT", "WIS", "CHA"]);

/**
 * Pure builder: wizard-state → fully-populated char object.
 * Caller must persist spell IDs separately to `spells_known_<id>` and
 * `spells_prep_<id>` using the returned char.id.
 */
export function buildCharFromWizard(state) {
  const id = Date.now();
  let char = newChar(id);

  // ── Phase 1 — Class ─────────────────────────────────────────────────────
  char.klass = state.klass;
  char.hd = getClassHd(state.klass);
  const cls = D3_KLASSEN.find((c) => c.name === state.klass);

  // Saves from class (e.g. "STR & CON" → { STR: true, CON: true })
  char.saves = {};
  (cls?.saves || "").split("&").map((s) => s.trim()).forEach((s) => {
    if (SAVE_CODES.has(s)) char.saves[s] = true;
  });

  // Class skills
  char.skills = {};
  (state.classSkillsChosen || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

  // Class choices stored on the char object for later inspection
  char.classChoices = state.classChoices || {};

  // Class equipment (PHB string is kept as a single inventory entry — UI
  // can split it later; the wizard doesn't try to itemize free-text).
  const eq = cls?.startingEquipment || {};
  if (state.classEquipmentChoice && eq[state.classEquipmentChoice]) {
    char.inventory = [...(char.inventory || []), { name: `Klasse Pack ${state.classEquipmentChoice}: ${eq[state.classEquipmentChoice]}`, qty: 1 }];
  }

  // ── Phase 2 — Origin (Background + Species) ────────────────────────────
  char.background = state.background;
  const bg = BACKGROUNDS_FULL.find((b) => b.name === state.background);
  char.originFeat = bg?.feat || "";

  // Background skills
  (bg?.skillProfs || []).forEach((sk) => { char.skills[`skill_${sk}`] = true; });

  // Background equipment
  if (state.bgEquipmentChoice === "A" && bg?.equipmentA) {
    const items = Array.isArray(bg.equipmentA) ? bg.equipmentA.join(", ") : String(bg.equipmentA);
    char.inventory = [...(char.inventory || []), { name: `Background Pack A: ${items}`, qty: 1 }];
  } else if (state.bgEquipmentChoice === "B") {
    char.gold = (char.gold || 0) + 50;
  }

  // Species (race) + languages
  char.race = state.race;
  const sp = RACES_FULL.find((r) => r.name === state.race);
  char.speed = sp?.speed || 30;
  char.size = sp?.size || "Mittel";
  char.languages = [];
  (sp?.languages || []).forEach((l) => {
    // Filter out the "1 Sprache (Background)" placeholder — the wizard
    // would normally pick one, but our PHB-2024 data doesn't expose the
    // choice yet, so it's left as Common only.
    if (l && !/\(Background\)/i.test(l) && !char.languages.includes(l)) {
      char.languages.push(l);
    }
  });
  if (!char.languages.includes("Gemeinsprache")) char.languages.unshift("Gemeinsprache");

  // ── Phase 3 — Stats (point-buy + background ASI) ───────────────────────
  const ab = state.abilityScores || {};
  const asi = state.bgAsiPicks || {};
  char.str = (ab.str || 8) + (asi.STR || 0);
  char.dex = (ab.dex || 8) + (asi.DEX || 0);
  char.con = (ab.con || 8) + (asi.CON || 0);
  char.int = (ab.int || 8) + (asi.INT || 0);
  char.wis = (ab.wis || 8) + (asi.WIS || 0);
  char.cha = (ab.cha || 8) + (asi.CHA || 0);

  // HP at Lv1: HD-max + CON-mod (PHB 2024 RAW)
  const hdMatch = (char.hd || "d10").match(/\d+/);
  const hdSize = hdMatch ? parseInt(hdMatch[0]) : 10;
  const conMod = Math.floor((char.con - 10) / 2);
  char.maxHp = hdSize + conMod;
  char.hp = char.maxHp;

  // ── Phase 4 — Alignment ────────────────────────────────────────────────
  char.alignment = state.alignment;

  // ── Phase 5 — Details ──────────────────────────────────────────────────
  char.name = state.name;
  char.age = state.age;
  char.sex = state.sex;
  char.height = state.height;
  char.weight = state.weight;
  char.deity = state.deity;
  char.traits = state.traits;
  char.ideals = state.ideals;
  char.bonds = state.bonds;
  char.flaws = state.flaws;
  char.backstory = state.backstory;

  // ── Phase 6 — Level-up loop ────────────────────────────────────────────
  char.level = 1;
  if (state.targetLevel > 1) {
    const hpAvg = Math.floor(hdSize / 2) + 1;
    for (let lv = 2; lv <= state.targetLevel; lv++) {
      const loopChoice = state.levelupChoices[lv] || {};
      char.level = lv;
      // HP gain — 3 modes selectable in the wizard, default "avg":
      //   avg    → HD-average + CON-mod (PHB 2024 standard)
      //   roll   → use the rolled value persisted in loopChoice.hpRoll
      //   manual → use the value the user typed in loopChoice.hpManual
      let hpGain;
      if (loopChoice.hpMode === "roll" && typeof loopChoice.hpRoll === "number") {
        hpGain = loopChoice.hpRoll + conMod;
      } else if (loopChoice.hpMode === "manual" && typeof loopChoice.hpManual === "number") {
        hpGain = loopChoice.hpManual + conMod;
      } else {
        hpGain = hpAvg + conMod;
      }
      // Floor at 1 — a level-up never reduces HP regardless of CON-mod sign.
      char.maxHp += Math.max(1, hpGain);
      // Subclass at Lv3
      if (lv === 3 && loopChoice.subclass) {
        char.subclasses = { ...(char.subclasses || {}), [state.klass]: loopChoice.subclass };
      }
      // ASI/Feat — PHB 2024: +2 to one ability OR +1 to two abilities OR a Feat.
      // ability_2 mode picks: { STR: 2 }
      // ability_1_1 mode picks: { STR: 1, DEX: 1 }
      // feat mode: free-text feat name.
      if ((loopChoice.asi?.mode === "ability_2" || loopChoice.asi?.mode === "ability_1_1") && loopChoice.asi.picks) {
        Object.entries(loopChoice.asi.picks).forEach(([abKey, bonus]) => {
          const k = abKey.toLowerCase();
          if (typeof char[k] === "number") char[k] += bonus;
        });
      } else if (loopChoice.asi?.mode === "feat" && loopChoice.asi.feat) {
        char.feats = [...(char.feats || []), loopChoice.asi.feat];
      }
    }
    char.hp = char.maxHp;
  }

  return char;
}

/** Returns { knownSpellIds, preparedSpellIds } for persistence. */
export function spellIdsFromWizard(state) {
  return {
    knownSpellIds: [...(state.cantripsChosen || []), ...(state.lv1SpellsChosen || [])],
    preparedSpellIds: [...(state.lv1SpellsChosen || [])],
  };
}
