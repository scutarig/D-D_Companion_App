import { C, sx, FH } from "../../constants/theme.js";
import {
  WEAPONS_WITH_MASTERY,
  MASTERY_PROPERTIES,
  getWeaponById,
  getMasteryCount,
} from "../../data/weaponMasteries.js";
import { useI18n } from "../../i18n/index.js";

/**
 * WeaponMasteryPicker — 2024 PHB Weapon Mastery Selector
 *
 * Props: char, setChar
 *
 * Renders only for classes with mastery (Barbar, Kämpfer, Paladin, Waldläufer, Schurke).
 * Number of slots scales with level (Fighter: 3→4→5→6 at 1/4/10/16, others: 2→3 at 1/4).
 *
 * Stored in char.weaponMasteries: string[] (weapon ids).
 */
export default function WeaponMasteryPicker({ char, setChar }) {
  const { t } = useI18n();
  const slotCount = getMasteryCount(char.klass, char.level);
  if (slotCount === 0) return null;

  const masteries = char.weaponMasteries || [];

  const setSlot = (idx, weaponId) => {
    const next = [...masteries];
    while (next.length < slotCount) next.push("");
    next[idx] = weaponId;
    // Trim to slotCount
    next.length = slotCount;
    setChar(p => ({ ...p, weaponMasteries: next }));
  };

  // Group weapons by category for select
  const groupedWeapons = {
    "Simple Melee":    WEAPONS_WITH_MASTERY.filter(w => w.category === "simple_melee"),
    "Simple Ranged":   WEAPONS_WITH_MASTERY.filter(w => w.category === "simple_ranged"),
    "Martial Melee":   WEAPONS_WITH_MASTERY.filter(w => w.category === "martial_melee"),
    "Martial Ranged":  WEAPONS_WITH_MASTERY.filter(w => w.category === "martial_ranged"),
  };

  return (
    <div style={{
      ...sx.card,
      background: `linear-gradient(135deg, ${C.red}08, rgba(0,0,0,0.2))`,
      borderLeft: `3px solid ${C.redBright}`,
    }}>
      <div style={{
        fontFamily: FH, fontSize: 13, color: C.redBright, fontWeight: 700,
        marginBottom: 6, letterSpacing: 0.5,
      }}>
        {t("char.weapon_mastery_header","⚔ WEAPON MASTERY (2024 PHB)")}
      </div>

      <div style={{
        fontSize: 11, color: C.text, lineHeight: 1.55,
        background: `${C.red}0d`, border: `1px solid ${C.red}30`,
        borderRadius: 6, padding: "7px 10px", marginBottom: 10,
      }}>
        {t("char.mastery_slots_intro","{klass} Lv{lv} → {n} Mastery-Slot{s}. Wähle Waffen mit denen du Proficiency hast. Nach jeder Long Rest darfst du wechseln.")
          .replace("{klass}", char.klass)
          .replace("{lv}", char.level)
          .replace("{n}", slotCount)
          .replace("{s}", slotCount > 1 ? "s" : "")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: slotCount }, (_, i) => {
          const wid = masteries[i] || "";
          const weapon = wid ? getWeaponById(wid) : null;
          const mastery = weapon ? MASTERY_PROPERTIES[weapon.mastery] : null;
          const masteryColor = mastery ? (C[mastery.color] || C.redBright) : C.textDim;

          return (
            <div key={i} style={{
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${weapon ? `${masteryColor}55` : C.border}`,
              borderRadius: 6,
              padding: 8,
            }}>
              <label style={{ ...sx.lbl, marginBottom: 4 }}>
                {t("char.slot_n","Slot {n}").replace("{n}", i + 1)}
              </label>
              <select
                value={wid}
                onChange={e => setSlot(i, e.target.value)}
                style={sx.sel}
              >
                <option value="">{t("char.choose_weapon","— Waffe wählen —")}</option>
                {Object.entries(groupedWeapons).map(([groupName, ws]) => (
                  <optgroup key={groupName} label={groupName}>
                    {ws.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.damage}) → {w.mastery}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {weapon && mastery && (
                <div style={{
                  marginTop: 6,
                  padding: "7px 10px",
                  borderRadius: 6,
                  background: `${masteryColor}10`,
                  border: `1px solid ${masteryColor}33`,
                  borderLeft: `3px solid ${masteryColor}`,
                }}>
                  <div style={{ fontSize: 11, color: masteryColor, fontFamily: FH, fontWeight: 700, marginBottom: 3 }}>
                    {mastery.icon} {weapon.mastery} — {mastery.short}
                  </div>
                  <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5, marginBottom: 4 }}>
                    {mastery.description}
                  </div>
                  <div style={{ fontSize: 9, color: C.textDim, fontStyle: "italic" }}>
                    {weapon.name}: {weapon.damage}
                    {weapon.properties.length > 0 && ` · ${weapon.properties.join(", ")}`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
