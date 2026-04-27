/**
 * magicItemBonuses.js
 * Aggregates bonuses from equipped + (if required) attuned magic items.
 *
 * Returns:
 * {
 *   ac: number,        // flat AC bonus
 *   hit: number,       // attack roll bonus
 *   dmg: number,       // flat damage bonus
 *   saves: number,     // all saving throw bonus
 *   setStr: number|null,
 *   setDex: number|null,
 *   setCon: number|null,
 *   setInt: number|null,
 *   setWis: number|null,
 *   setCha: number|null,
 *   speedMult: number, // speed multiplier (default 1)
 *   extraDmg: string[] // extra damage strings like "1d6 Kälte"
 *   activeItems: [{name, bonuses, color}]  // for display
 * }
 */

const RC = {
  Common: "#888",
  Uncommon: "#00c040",
  Rare: "#3b82f6",
  "Very Rare": "#a855f7",
  Legendary: "#f59e0b",
};

const EMPTY = {
  ac: 0, hit: 0, dmg: 0, saves: 0,
  setStr: null, setDex: null, setCon: null,
  setInt: null, setWis: null, setCha: null,
  speedMult: 1,
  extraDmg: [],
  activeItems: [],
};

/**
 * Check if an item's bonuses are active.
 * - No attunement required → always active when equipped
 * - Attunement required → only active when uid is in char.attunedItems
 */
function isActive(item, char) {
  if (!item?.magic || !item?.bonuses) return false;
  if (item.attunement) {
    return (char.attunedItems || []).includes(item.uid);
  }
  return true;
}

/**
 * Get all equipped items from char.equipSlots (values may be null).
 */
function getEquippedItems(char) {
  const slots = char.equipSlots || {};
  return Object.values(slots).filter(Boolean);
}

/**
 * Main aggregator.
 */
export function aggregateBonuses(char) {
  if (!char) return EMPTY;

  const equipped = getEquippedItems(char);
  const result = { ...EMPTY, extraDmg: [], activeItems: [] };

  for (const item of equipped) {
    if (!isActive(item, char)) continue;
    const b = item.bonuses || {};

    if (b.ac)    result.ac    += b.ac;
    if (b.hit)   result.hit   += b.hit;
    if (b.dmg)   result.dmg   += b.dmg;
    if (b.saves) result.saves += b.saves;
    if (b.setStr != null && (result.setStr === null || b.setStr > result.setStr)) result.setStr = b.setStr;
    if (b.setDex != null && (result.setDex === null || b.setDex > result.setDex)) result.setDex = b.setDex;
    if (b.setCon != null && (result.setCon === null || b.setCon > result.setCon)) result.setCon = b.setCon;
    if (b.setInt != null && (result.setInt === null || b.setInt > result.setInt)) result.setInt = b.setInt;
    if (b.setWis != null && (result.setWis === null || b.setWis > result.setWis)) result.setWis = b.setWis;
    if (b.setCha != null && (result.setCha === null || b.setCha > result.setCha)) result.setCha = b.setCha;
    if (b.speedMult && b.speedMult > result.speedMult) result.speedMult = b.speedMult;
    if (b.extraDmg) result.extraDmg.push(b.extraDmg);

    result.activeItems.push({
      name: item.name,
      rar: item.rar,
      color: RC[item.rar] || "#888",
      bonuses: b,
    });
  }

  return result;
}

/**
 * Format bonus summary for display.
 * Returns array of strings like "+1 Angriff", "+1 AC", "STR=19"
 */
export function formatBonusSummary(bonuses) {
  const parts = [];
  if (bonuses.ac)    parts.push(`+${bonuses.ac} AC`);
  if (bonuses.hit)   parts.push(`+${bonuses.hit} Angriff`);
  if (bonuses.dmg)   parts.push(`+${bonuses.dmg} Schaden`);
  if (bonuses.saves) parts.push(`+${bonuses.saves} Saves`);
  if (bonuses.setStr) parts.push(`STR=${bonuses.setStr}`);
  if (bonuses.setDex) parts.push(`DEX=${bonuses.setDex}`);
  if (bonuses.setCon) parts.push(`CON=${bonuses.setCon}`);
  if (bonuses.setInt) parts.push(`INT=${bonuses.setInt}`);
  if (bonuses.setWis) parts.push(`WIS=${bonuses.setWis}`);
  if (bonuses.setCha) parts.push(`CHA=${bonuses.setCha}`);
  if (bonuses.speedMult > 1) parts.push(`Speed ×${bonuses.speedMult}`);
  bonuses.extraDmg?.forEach(e => parts.push(`+${e}`));
  return parts;
}
