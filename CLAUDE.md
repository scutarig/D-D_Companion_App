# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
```

No lint or test scripts are configured. Build output goes to `dist/` (already committed).

## Architecture

**Single-page PWA** — React 18 + Vite, no router. Tab state persisted to localStorage via `usePersist`.

### State & Persistence

- `usePersist(key, default)` (`src/hooks/usePersist.js`) — unified storage hook. Falls back to `localStorage` when `window.storage` (Tauri/Capacitor) is absent. Returns `[value, setter, ready]`.
- **CharContext** (`src/context/CharContext.jsx`) — global character list (`chars_v4`) and active character ID (`chars_active_v4`). All character mutations go through `setActive`.
- **CombatContext** (`src/context/CombatContext.jsx`) — combat state (fighters, turn order, log).
- Spell slot usage is stored per-character as `tokens_used_<aid>` and `tokens_custom_<aid>`, lifted to `App.jsx` so `CharHeader` and `CombatDashboard` share the same slot state.

### Styling

All styles are inline React objects — no CSS modules or Tailwind. Import primitives from `src/constants/theme.js`:
- `C` — colour palette (Radix-dark-inspired)
- `F` / `FH` — body font / Cinzel heading font
- `sx` — shared style factory objects (`sx.card`, `sx.btn(color)`, `sx.inp`, `sx.bsm(color)`, etc.)
- `SC` / `ABS` / `SKILLS` — stat colours, attribute list, skill-to-ability map

### Data

Static D&D 5e data lives in `src/data/` (spells, monsters, classes, races, items, feats, subclasses, etc.). Computed/derived values use helpers in `src/utils/` — notably `helpers.js` (`getPB`, `buildSlotsForLevel`, `applyShortRest`, `applyLongRest`, `newChar`).

### Layout

`App.jsx` renders two layouts (desktop sidebar / mobile bottom-nav) based on `useIsMobile(768)`. All tab components are lazy-loaded via `React.lazy`. The active tab is persisted as `app_tab_v5`.

### Component structure

```
src/components/
  CombatDashboard.jsx   — "Übersicht" tab: token tracker + quick stats
  CharManager.jsx       — character CRUD + CharSheet
  Combat/               — full initiative/turn combat system
  CharacterSheet/       — multiclass, subclass, race selector, traits
  Companions/           — animal companions / familiars
  Proficiencies/        — proficiency & expertise tracker
  Worldbuilding/        — quests, locations, factions
  Downtime/             — downtime activity tracker
  WildShape/            — druid wild shape panel
```

### dnd-v6.jsx

Legacy monolithic single-file version of the entire app. Kept as reference only — the active codebase is `src/`.
