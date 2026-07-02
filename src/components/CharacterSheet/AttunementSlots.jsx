import { C, sx, FH } from "../../constants/theme.js";
import { useI18n } from "../../i18n/index.js";

/**
 * AttunementSlots — 3-slot visual for magical attunement (PHB 2024: a
 * character can attune to at most three magic items). Clicking an
 * occupied slot un-attunes the item; the actual attunement toggle lives
 * on the inventory / equipment editor, this card is just the at-a-
 * glance status the player forgets to check between sessions.
 *
 * We render occupied slots as coloured pills with the item name and
 * empty slots as dashed placeholders so the "1 free / 2 used" state is
 * obvious.
 */
export default function AttunementSlots({ char, setChar }) {
  const { t } = useI18n();

  const attuned = Array.isArray(char.attunedItems) ? char.attunedItems : [];
  // Build a quick uid → item map from equipSlots + inventory so we can
  // render the item name for each attuned uid.
  const items = [
    ...Object.values(char.equipSlots || {}).filter(Boolean),
    ...(char.inventory || []),
  ];
  const byUid = new Map(items.map((it) => [it.uid, it]));

  const unattune = (uid) => {
    setChar((p) => ({
      ...p,
      attunedItems: (p.attunedItems || []).filter((u) => u !== uid),
      attunementChangedSinceRest: [...(p.attunementChangedSinceRest || []), uid],
    }));
  };

  const slots = [0, 1, 2].map((i) => attuned[i] || null);
  const used = attuned.length;
  const headerCol = used >= 3 ? C.amberBright : used > 0 ? C.purpleBright : C.textDim;

  return (
    <div style={{ marginBottom: 6, padding: "2px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: FH, fontSize: 12, color: headerCol, fontWeight: 700, letterSpacing: 0.5 }}>
          🔗 {t("dash.attune_header","Attunement")}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.textDim }} title={t("dash.attune_rule","Max 3 gleichzeitig attunement (PHB)")}>
          {used}/3
        </span>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {slots.map((uid, i) => {
          const item = uid ? byUid.get(uid) : null;
          if (!uid) {
            return (
              <span key={i} style={{
                flex: "1 1 60px", minWidth: 60,
                padding: "3px 8px",
                border: `1px dashed ${C.border}`,
                borderRadius: 8,
                color: C.textDim,
                fontSize: 10,
                fontStyle: "italic",
                textAlign: "center",
              }}>
                {t("dash.attune_slot_empty","frei")}
              </span>
            );
          }
          return (
            <button key={i} type="button"
              onClick={() => unattune(uid)}
              title={t("dash.attune_unattune","Attunement lösen")}
              style={{
                flex: "1 1 80px", minWidth: 80,
                padding: "3px 8px",
                background: `${C.purpleBright}18`,
                border: `1px solid ${C.purpleBright}55`,
                borderRadius: 8,
                color: C.purpleBright,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
              ✦ {item?.name || t("dash.attune_unknown","Unbekannt")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
