import { useState } from "react";
import { C, sx, FH } from "../constants/theme.js";
import { usePersist } from "../hooks/usePersist.js";
import { buildSlotsForLevel, CASTER_TYPE } from "../utils/helpers.js";

const SC = ["#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];

export default function Tokens({ char, charId, usedSlots, setUsedSlots }) {
  const [custom, setCustom] = usePersist(`tokens_custom_${charId}`, []);
  const [nT, setNT] = useState({ name: "", tot: 3, color: C.purple, tier: "" });

  // Slots live aus Klasse + Level ableiten
  const slotDef = buildSlotsForLevel(char?.klass, char?.level);
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
            <div style={sx.ct}>🔮 Zauberplätze</div>
            {slotDef !== null && (
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                {char?.klass} · Lv.{char?.level} · automatisch
              </div>
            )}
          </div>
          {slotDef !== null && slots.length > 0 && (
            <button onClick={resetAllSlots} style={sx.bsm(C.gold)}>
              {isPact ? "↺ Kurze/Lange Rast" : "↺ Lange Rast"}
            </button>
          )}
        </div>

        {slotDef === null ? (
          // Kein Zauberer
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>⚔️</div>
            <div style={{ fontFamily: FH, fontSize: 13, color: C.textBright, marginBottom: 4 }}>
              {char?.klass} hat keine Zauberplätze
            </div>
            <div style={{ fontSize: 12, color: C.textDim }}>
              Nutze "Eigene Ressourcen" für Klassenmerkmale wie Rage oder Ki.
            </div>
          </div>
        ) : slots.length === 0 ? (
          // Zauberer aber noch keine Slots auf diesem Level
          <div style={{ fontSize: 13, color: C.textDim }}>
            {char?.klass} erhält auf Lv.{char?.level} noch keine Zauberplätze.
          </div>
        ) : (
          <>
            {isPact && (
              <div style={{ fontSize: 12, color: C.purpleBright, marginBottom: 10, background: `${C.purple}15`, borderRadius: 6, padding: "6px 10px" }}>
                ⚡ Paktmagie · Alle Slots gleicher Grad · Auffüllung nach <strong>kurzer</strong> oder langer Rast
              </div>
            )}
            {slots.map((sl, si) => (
              <div key={sl.lv} style={{ marginBottom: 14 }}>
                <div style={{ ...sx.jb, marginBottom: 4 }}>
                  <span style={{ fontFamily: FH, fontSize: 13, color: C.textBright }}>
                    {sl.lbl}{isPact ? " Grad (Pakt)" : ". Grad"}
                  </span>
                  <span style={{ fontSize: 12, color: C.textDim }}>
                    {sl.tot - sl.used} / {sl.tot}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Array.from({ length: sl.tot }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setSlotUsed(sl.lv, i < sl.used ? i : i + 1)}
                      style={{
                        width: 30, height: 30, borderRadius: isPact ? 6 : "50%",
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

      {/* ── Eigene Ressourcen ─────────────────────────────────────────────── */}
      <div style={sx.card}>
        <div style={{ ...sx.jb, marginBottom: 8 }}>
          <div style={sx.ct}>🏷️ Eigene Ressourcen</div>
          <button onClick={() => setCustom(p => p.map(t => ({ ...t, used: 0 })))} style={sx.bsm(C.gold)}>↺ Alle zurücksetzen</button>
        </div>

        {custom.length === 0 && (
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
            Noch keine Ressourcen. Rage, Bardic Inspiration, Ki-Punkte, … hier eintragen.
          </div>
        )}

        {custom.map(t => (
          <div key={t.id} style={{ background: C.surface, borderRadius: 6, padding: "10px 12px", marginBottom: 10, border: `1px solid ${t.color}44` }}>
            <div style={{ ...sx.jb, marginBottom: 6 }}>
              <span style={{ fontFamily: FH, fontSize: 13, color: t.color, fontWeight: 700 }}>
                {t.name}{t.tier && <span style={{ color: C.textDim, fontWeight: 400 }}> ({t.tier})</span>}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 12, color: C.textDim }}>{t.tot - t.used}/{t.tot}</span>
                <button onClick={() => setCustom(p => p.map(x => x.id === t.id ? { ...x, used: 0 } : x))} style={sx.bsm(C.goldDim)}>↺</button>
                <button onClick={() => setCustom(p => p.filter(x => x.id !== t.id))} style={sx.bsm(C.red)}>✕</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Array.from({ length: t.tot }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCustom(p => p.map(x => x.id === t.id ? { ...x, used: i < x.used ? i : i + 1 } : x))}
                  style={{
                    width: 32, height: 32, borderRadius: 4, cursor: "pointer",
                    background: i < t.used ? "#1a1a1a" : t.color + "99",
                    border: `2px solid ${i < t.used ? C.border : t.color}`,
                    transition: "all .2s", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 16,
                  }}
                >
                  {i < t.used ? "✗" : "●"}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Neue Ressource */}
        <div style={{ background: "#0f0f1e", borderRadius: 6, padding: 12, border: `1px dashed ${C.border}` }}>
          <div style={{ ...sx.ct, marginBottom: 8 }}>+ Neue Ressource</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div><label style={sx.lbl}>Name</label><input value={nT.name} onChange={e => setNT(p => ({ ...p, name: e.target.value }))} style={{ ...sx.inp, width: 130 }} /></div>
            <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} max={20} value={nT.tot} onChange={e => setNT(p => ({ ...p, tot: +e.target.value }))} style={{ ...sx.inp, width: 70 }} /></div>
            <div><label style={sx.lbl}>Typ</label><input value={nT.tier} onChange={e => setNT(p => ({ ...p, tier: e.target.value }))} style={{ ...sx.inp, width: 80 }} placeholder="d8" /></div>
            <div><label style={sx.lbl}>Farbe</label><input type="color" value={nT.color} onChange={e => setNT(p => ({ ...p, color: e.target.value }))} style={{ height: 34, width: 50, border: `1px solid ${C.border}`, borderRadius: 4, background: "transparent", cursor: "pointer" }} /></div>
            <button onClick={() => { if (!nT.name) return; setCustom(p => [...p, { ...nT, id: Date.now(), used: 0 }]); setNT({ name: "", tot: 3, color: C.purple, tier: "" }); }} style={sx.btn(C.green)}>Hinzufügen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
