# Changelog

All notable changes to the D&D 5e Companion PWA are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows the `package.json` (`1.0.0`).

## [Unreleased]

_No unreleased changes yet._

---

## [1.1.0] — 2026-06-19 — Dashboard becomes the play-cockpit

The Übersicht tab now carries everything a player needs mid-encounter, so
tab-switching during combat is largely unnecessary.

### Added
- **Dashboard at-the-table cards** — 4 new sections on the Übersicht tab
  ([037e2f9](https://github.com/scutarig/D-D_Companion_App/commit/037e2f9)):
  - `ConditionsCard` — pill row of `char.activeConditions[]`, click to remove
  - `ActionsRefCard` — collapsible 3-column PHB 2024 Action/Bonus/Reaction
    reference (16 core actions)
  - `SkillsCard` — all 18 skills with proficiency markers (`○ ● ◉`), computed
    bonus, click-to-roll d20+bonus with NAT 20 / NAT 1 highlights
  - `LanguagesCard` — pill row of `char.languages[]`
- **HitDiceCard** ([9e9b5cc](https://github.com/scutarig/D-D_Companion_App/commit/9e9b5cc))
  — per-level pills (toggle spent/available), "🎲 Würfeln + heilen" rolls
  `1d<hd> + CON-mod` and applies the heal in one click, `↺` resets all
- **Inspiration toggle** in vitals row — glowing `✨ Insp.` pill, click
  toggles `char.inspiration`
- **Conditions picker** — `＋ Hinzufügen` popover in `ConditionsCard` with
  searchable list over all PHB-2024 conditions (Exhaustion excluded — own
  tracker in Kampf tab)
- `CHANGELOG.md` introduced

### Changed
- Dashboard's old inline Conditions block (using `usePersist("cond_v4", [])`)
  removed in favour of the new `ConditionsCard` (using `char.activeConditions`,
  shared with `ConditionsTracker` in Kampf tab) — single source of truth

### Fixed
- i18n key collision between `dash.actions_header` (existing Hotbar) and the
  new ActionsRefCard — renamed reference keys to `dash.actions_ref_*`

---

## 1.0.0 — Wizard polish

Character-creation wizard reached feature parity and was smoke-tested across all
four classes. See the `feat(wizard)` / `fix(wizard)` commit cluster ending at
[d4f285a](https://github.com/.../commit/d4f285a).

### Added
- Entry modal with start-level picker (1–20)
- Step 16 — review + final character creation
- Step 15 — level-up loop with subclass + ASI picks (PHB 2024: `+2 to one`
  OR `+1+1 to two` OR Feat)
- Step 14 — personality / bonds / ideals inputs
- Equipment unpacking + background/race traits applied on commit
- Alignment shown in Bogen + PDF export
- `buildCharFromWizard` — pure commit function

### Fixed
- Step14 input visibility (color undefined override)
- Step14 input visibility for personality fields
- Race condition in commit + dead i18n keys
- Background skill translation, derived stats preview, cancel button
- Step15 HP roll/manual modes

### Verified
- All 4 smoke paths green: Magier · Kämpfer · Paladin · Druide
- i18n parity audit: 79 keys × DE+EN, 0 missing

---

## Legend

- `feat(scope):` new feature
- `fix(scope):` bug fix
- `chore(scope):` housekeeping / verification
- `perf(scope):` performance

Scopes used so far: `dashboard`, `wizard`, `i18n`.
