import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { buildSlotsForLevel, CASTER_TYPE } from "../utils/helpers.js";
import { computeAllResources } from "../data/classResources.js";
import { useMulticlass } from "../hooks/useMulticlass.js";
import { useI18n } from "../i18n/index.js";

const SC = ["#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];

export default function Tokens({ char, charId, usedSlots, setUsedSlots }) {
  const { t } = useI18n();
  const [custom, setCustom] = usePersist(`tokens_custom_${charId}`, []);
  const [autoUsed, setAutoUsed] = usePersist(`tokens_auto_used_${charId}`, {});
  const [nT, setNT] = useState({ name: "", tot: 3, color: C.purple, tier: "" });

  // Slots live aus Klasse + Level ableiten
  const slotDef = buildSlotsForLevel(char?.klass, char?.level);

  // Auto class resources from multiclass
  const { classes } = useMulticlass(charId, char, null);
  const autoResources = computeAllResources(classes, char);

  const setAutoUsedR = (id, used) => setAutoUsed(p => ({ ...p, [id]: used }));
  const resetAutoResources = (resetType) => {
    const toReset = {};
    autoResources.forEach(r => {
      if (resetType === "long" || r.reset === resetType || r.reset === "short") {
        toReset[r.id] = 0;
      }
    });
    setAutoUsed(p => ({ ...p, ...toReset }));
  };
  const isPact = CASTER_TYPE[char?.klass] === "pact";
  const slots = slotDef ? slotDef.map(s => ({ ...s, used: usedSlots[s.lv] || 0 })) : [];

  const setSlotUsed = (lv, used) => setUsedSlots(p => ({ ...p, [lv]: used }));
  const resetAllSlots = () => setUsedSlots({});

  return (
    <div>
      {/* ── Zauberplätze ─────────────────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom: 8 }}>
          <div>
            <div style={sx.ct}>🔮 {t("tokens.spell_slots","Zauberplätze")}</div>
            {slotDef !== null && (
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                {char?.klass} · Lv.{char?.level} · {t("tokens.auto","automatisch")}
              </div>
            )}
          </div>
          {slotDef !== null && slots.length > 0 && (
            <button onClick={resetAllSlots} style={sx.bsm(C.gold)}>
              {isPact ? `↺ ${t("tokens.short_long_rest","Kurze/Lange Rast")}` : `↺ ${t("header.long_rest","Lange Rast")}`}
            </button>
          )}
        </div>

        {slotDef === null ? (
          // Kein Zauberer
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>⚔️</div>
            <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, marginBottom: 4 }}>
              {t("tokens.not_caster","{cls} hat keine Zauberplätze").replace("{cls}", char?.klass || "")}
            </div>
            <div style={{ fontSize: 12, color: C.textDim }}>
              {t("tokens.use_custom_resources","Nutze \"Eigene Ressourcen\" für Klassenmerkmale wie Rage oder Focus Points.")}
            </div>
          </div>
        ) : slots.length === 0 ? (
          // Zauberer aber noch keine Slots auf diesem Level
          <div style={{ fontSize: 13, color: C.textDim }}>
            {t("tokens.no_slots_yet","{cls} erhält auf Lv.{lv} noch keine Zauberplätze.").replace("{cls}", char?.klass || "").replace("{lv}", char?.level || 1)}
          </div>
        ) : (
          <>
            {isPact && (
              <div style={{ fontSize: 12, color: C.purpleBright, marginBottom: 10, background: `${C.purple}15`, borderRadius: 6, padding: "6px 10px" }}>
                ⚡ {t("tokens.pact_info","Paktmagie · Alle Slots gleicher Grad · Auffüllung nach kurzer oder langer Rast")}
              </div>
            )}
            {slots.map((sl, si) => (
              <div key={sl.lv} style={{ marginBottom: 14 }}>
                <div style={{ ...sx.jb, marginBottom: 4 }}>
                  <span style={{ fontFamily: FH, fontSize: 13, color: C.textBright }}>
                    {sl.lbl}{isPact ? ` ${t("tokens.tier_pact","Grad (Pakt)")}` : `. ${t("tokens.tier","Grad")}`}
                  </span>
                  <span style={{ fontSize: 12, color: C.textDim }}>
                    {sl.tot - sl.used} / {sl.tot}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Array.from({ length: sl.tot }).map((_, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSlotUsed(sl.lv, i < sl.used ? i : i + 1)}
                      style={{
                        width: 36, height: 36, borderRadius: isPact ? 6 : "50%",
                        cursor: "pointer",
                        background: i < sl.used ? "#1a1a1a" : SC[si] + "cc",
                        border: `2px solid ${i < sl.used ? C.border : SC[si]}`,
                        transition: "all .2s", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 12,
                        color: i < sl.used ? C.border : "white",
                      }}
                    >
                      {i < sl.used ? "×" : "◆"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Klassen-Ressourcen (auto) ────────────────────────────────────── */}
      {autoResources.length > 0 && (
        <div style={sx.card}>
          <div style={{ ...sx.jb, marginBottom: 8 }}>
            <div>
              <div style={sx.ct}>⚡ {t("tokens.class_resources","Klassen-Ressourcen")}</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{t("tokens.auto_from_class","Automatisch aus Klasse + Level")}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => resetAutoResources("short")} style={sx.bsm(C.teal)}>↺ {t("tokens.sr_short","K.Rast")}</button>
              <button onClick={() => resetAutoResources("long")} style={sx.bsm(C.gold)}>↺ {t("tokens.lr_short","L.Rast")}</button>
            </div>
          </div>

          {autoResources.map(r => {
            const maxNum = typeof r.max === "number" ? r.max : null;
            const used = autoUsed[r.id] || 0;
            const resetLabel = r.reset === "short" ? t("header.short_rest","Kurze Rast") : t("header.long_rest","Lange Rast");
            return (
              <div key={r.id} style={{ background: C.surface, borderRadius: 6, padding: "10px 12px", marginBottom: 10, border: `1px solid ${r.color}44` }}>
                <div style={{ ...sx.jb, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontFamily: FH, fontSize: 13, color: r.color, fontWeight: 700 }}>{r.name}</span>
                    <span style={{ fontSize: 10, color: C.textDim, marginLeft: 8 }}>{r.className}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.textDim }}>{resetLabel}</span>
                    {maxNum !== null && (
                      <span style={{ fontSize: 12, color: C.textDim }}>{maxNum - used}/{maxNum}</span>
                    )}
                    <button onClick={() => setAutoUsedR(r.id, 0)} style={sx.bsm(C.goldDim)}>↺</button>
                  </div>
                </div>
                {maxNum !== null ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from({ length: maxNum }).map((_, i) => (
                      <div key={i}
                        onClick={() => setAutoUsedR(r.id, i < used ? i : i + 1)}
                        style={{
                          width: 32, height: 32, borderRadius: 4, cursor: "pointer",
                          background: i < used ? "#1a1a1a" : r.color + "99",
                          border: `2px solid ${i < used ? C.border : r.color}`,
                          transition: "all .2s", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 16,
                        }}>
                        {i < used ? "✗" : "●"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: r.color, fontStyle: "italic" }}>
                    Max: {r.max}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Eigene Ressourcen ─────────────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom: 8 }}>
          <div style={sx.ct}>🏷️ {t("tokens.custom_resources","Eigene Ressourcen")}</div>
          <button onClick={() => setCustom(p => p.map(tok => ({ ...tok, used: 0 })))} style={sx.bsm(C.gold)}>↺ {t("tokens.reset_all","Alle zurücksetzen")}</button>
        </div>

        {custom.length === 0 && (
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
            {t("tokens.custom_empty","Noch keine Ressourcen. Rage, Bardic Inspiration, Focus Points, … hier eintragen.")}
          </div>
        )}

        {custom.map(tok => (
          <div key={tok.id} style={{ background: C.surface, borderRadius: 6, padding: "10px 12px", marginBottom: 10, border: `1px solid ${tok.color}44` }}>
            <div style={{ ...sx.jb, marginBottom: 6 }}>
              <span style={{ fontFamily: FH, fontSize: 13, color: tok.color, fontWeight: 700 }}>
                {tok.name}{tok.tier && <span style={{ color: C.textDim, fontWeight: 400 }}> ({tok.tier})</span>}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 12, color: C.textDim }}>{tok.tot - tok.used}/{tok.tot}</span>
                <button onClick={() => setCustom(p => p.map(x => x.id === tok.id ? { ...x, used: 0 } : x))} style={sx.bsm(C.goldDim)}>↺</button>
                <button onClick={() => setCustom(p => p.filter(x => x.id !== tok.id))} style={sx.bsm(C.red)}>✕</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Array.from({ length: tok.tot }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCustom(p => p.map(x => x.id === tok.id ? { ...x, used: i < x.used ? i : i + 1 } : x))}
                  style={{
                    width: 32, height: 32, borderRadius: 4, cursor: "pointer",
                    background: i < tok.used ? "#1a1a1a" : tok.color + "99",
                    border: `2px solid ${i < tok.used ? C.border : tok.color}`,
                    transition: "all .2s", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 16,
                  }}
                >
                  {i < tok.used ? "✗" : "●"}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Neue Ressource */}
        <div style={{ background: "#0f0f1e", borderRadius: 6, padding: 12, border: `1px dashed ${C.border}` }}>
          <div style={{ ...sx.ct, marginBottom: 8 }}>+ {t("tokens.new_resource","Neue Ressource")}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div><label style={sx.lbl}>{t("sheet.name","Name")}</label><input value={nT.name} onChange={e => setNT(p => ({ ...p, name: e.target.value }))} style={{ ...sx.inp, width: 130 }} /></div>
            <div><label style={sx.lbl}>{t("tokens.count","Anzahl")}</label><input type="number" min={1} max={20} value={nT.tot} onChange={e => setNT(p => ({ ...p, tot: +e.target.value }))} style={{ ...sx.inp, width: 70 }} /></div>
            <div><label style={sx.lbl}>{t("tokens.type","Typ")}</label><input value={nT.tier} onChange={e => setNT(p => ({ ...p, tier: e.target.value }))} style={{ ...sx.inp, width: 80 }} placeholder="d8" /></div>
            <div><label style={sx.lbl}>{t("tokens.color","Farbe")}</label><input type="color" value={nT.color} onChange={e => setNT(p => ({ ...p, color: e.target.value }))} style={{ height: 34, width: 50, border: `1px solid ${C.border}`, borderRadius: 4, background: "transparent", cursor: "pointer" }} /></div>
            <button onClick={() => { if (!nT.name) return; setCustom(p => [...p, { ...nT, id: Date.now(), used: 0 }]); setNT({ name: "", tot: 3, color: C.purple, tier: "" }); }} style={sx.btn(C.green)}>{t("actions.add","Hinzufügen")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
