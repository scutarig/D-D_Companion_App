# TODO — D&D Companion PWA

Offene Punkte nach der 2024 PHB UI-Migration.

## P1 — Rast-System 2024-Update

**Status:** Core-Math korrekt (HP/Slots/HD), aber 2024-spezifische Erweiterungen fehlen.

### Long Rest (`doLongRest` in CharManager.jsx)

- [ ] **Exhaustion -1 Level** beim Long Rest automatisch reduzieren
  - File: `src/components/CharManager.jsx` → `doLongRest`
  - Schreibe `char.exhaustion = Math.max(0, (char.exhaustion || 0) - 1)`
  - 2014 + 2024 RAW identisch — fehlt heute komplett
- [ ] **Klassen-Ressourcen** zurücksetzen (Rage Tokens, Lay on Hands Pool, Sorcery Points, etc.)
  - Daten in `src/data/classResources.js` schon vorhanden
  - Neue Hook/Helper: `applyLongRestResources(char)` der alle long-rest Resources auf Max setzt
- [ ] **Heroic Inspiration** (2024): Bei manchen Backgrounds/Features automatisch +1

### Short Rest (`doShortRest` in CharManager.jsx)

- [ ] **HD-Würfel-UI**: Buttons "HD ausgeben (Würfeln)" statt nur HP-Input
  - HD-Wurf: `1d{hitDie} + CON-Mod`
  - Verfügbare HD = `level - hd_used` (schon getrackt)
  - Auto-Update von `hd_used`
- [ ] **Klassen-Ressourcen** auf Short Rest zurücksetzen:
  - **2024 NEU**: Bardische Inspiration (war 2014 Long Rest!)
  - Action Surge, Second Wind, Channel Divinity, Focus Points
  - Druide 2024: Wild Shape (war 2014 schon Short Rest)
  - Warlock Pact Slots

### Architektur-Vorschlag

```js
// src/utils/restHelpers.js (neu)
import { computeAllResources } from "../data/classResources.js";

export function applyLongRest(char, classes) {
  const resources = computeAllResources(classes);
  return {
    ...char,
    hp: char.maxHp,
    tempHp: 0,
    deathSaves: { suc: 0, fail: 0 },
    hd_used: Math.max(0, (char.hd_used || 0) - Math.max(1, Math.floor(char.level / 2))),
    exhaustion: Math.max(0, (char.exhaustion || 0) - 1),
    classResources: { ...resources.longRestMaxValues },
  };
}

export function applyShortRest(char, classes) {
  const resources = computeAllResources(classes);
  return {
    ...char,
    classResources: { 
      ...(char.classResources || {}),
      ...resources.shortRestMaxValues  // overrides only short-rest keys
    },
  };
}
```

## P2 — Andere offene Punkte

- [ ] Origin Feat Auto-Apply: Manche Origin Feats geben Skills oder Pools (z.B. Healer's Kit benutzt Heal-Charges). Sollte in Daten gehen.
- [ ] Multi-class Subclass-Picker: aktuell zeigt nur Klassen mit erreichtem Choice-Level → Locked-Klassen sind verständlich aber könnten Preview zeigen
- [ ] Spellbook: Cantrip-Counter-Warning beim Hinzufügen über Limit (aktuell zeigt's Card unter "Über Limit", aber kein Block beim Spellbook-Hinzufügen)
