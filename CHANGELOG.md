# Changelog

All notable changes to the D&D 5e Companion PWA are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows the `package.json` (`1.0.0`).

## [Unreleased]

### Added
- **Dashboard at-the-table cards** — 4 new sections on the Übersicht tab so the
  player rarely needs to switch tabs during play
  ([037e2f9](https://github.com/.../commit/037e2f9)):
  - `ConditionsCard` — pill row of `char.activeConditions[]`, click to remove
  - `ActionsRefCard` — collapsible 3-column PHB 2024 Action/Bonus/Reaction
    reference (16 core actions)
  - `SkillsCard` — all 18 skills with proficiency markers (`○ ● ◉`), computed
    bonus, click-to-roll d20+bonus with NAT 20 / NAT 1 highlights
  - `LanguagesCard` — pill row of `char.languages[]`
- **Hit-Dice tracker** on dashboard (planned, see Hit-Dice card)
- **Inspiration toggle** in vitals header (planned)
- **Conditions picker** with `+` button in `ConditionsCard` (planned)

### Fixed
- i18n key collision between `dash.actions_header` (existing Hotbar) and the
  new ActionsRefCard — renamed reference keys to `dash.actions_ref_*`

### Performance
- `FindingsView` (sibling ServerOverview project) — WPF virtualization enabled

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
