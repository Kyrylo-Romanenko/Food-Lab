# Tasks: ingredient-calculator

Inputs: spec.md, plan.md, research.md, data-model.md, quickstart.md.

## Phase 1: Pure calculator logic

- [x] T001 [US1] Add calculator parsing, scaling, formatting, pluralization, and stored-state validation in `src/lib/calculator.ts`.
      Goal: Implement the single authoritative pure calculation module.
      Inputs: spec.md; data-model.md; user task.
      Allowed scope: `src/lib/calculator.ts`, `tests/calculator.test.ts`.
      Requirements: FR-003 through FR-007, FR-011.
      Acceptance checks: Tests cover comma/point decimals, fractions, mixed fractions, invalid values, factor limits, fractional portions, countable-unit fractions, and valid/invalid stored states.
      Non-goals: DOM, storage access, recipe changes, unit conversion.
      Dependencies: None.

## Phase 2: User Story 1 and 2 UI

- [x] T002 [US1] Render original recipe data and mount the calculator island in `src/pages/recipes/[slug].astro`.
      Goal: Preserve static fallback content while passing stable recipe values into the island.
      Inputs: plan.md; data-model.md; current recipe schema.
      Allowed scope: `src/pages/recipes/[slug].astro`, `src/components/IngredientCalculator.tsx`.
      Requirements: FR-001, FR-002, FR-012.
      Acceptance checks: Original amounts remain in static output; `to-taste` amounts remain static and no schema or URL changes.
      Non-goals: Recipe data or authoring contract changes.
      Dependencies: T001.

- [x] T003 [US2] Implement calculator mode, row inputs, validation, apply, scaling, and live announcements in `src/components/IngredientCalculator.tsx`.
      Goal: Let a cook anchor calculations on a numeric ingredient.
      Inputs: spec.md; calculator module; plan.md.
      Allowed scope: `src/components/IngredientCalculator.tsx`, `src/pages/recipes/[slug].astro`.
      Requirements: FR-003 through FR-010.
      Acceptance checks: Apply button appears only for a changed row; Enter applies; blur does not apply; invalid drafts do not change applied state; re-anchoring uses original values.
      Non-goals: Unit conversion, shopping lists, recipe content changes.
      Dependencies: T001, T002.

- [x] T004 [US1] Implement portion stepper, calculated status bar, reset, and per-recipe persistence in `src/components/IngredientCalculator.tsx`.
      Goal: Allow stepper scaling and restore or reset each recipe calculation.
      Inputs: spec.md; data-model.md; user task.
      Allowed scope: `src/components/IngredientCalculator.tsx`, `src/lib/calculator.ts`.
      Requirements: FR-002, FR-003, FR-009, FR-011.
      Acceptance checks: Storage failure does not break session use; invalid saved states are ignored and removed; reset removes only the current recipe key and keeps mode.
      Non-goals: Cross-device sync or private-data export.
      Dependencies: T001, T002, T003.

## Phase 3: Presentation and documentation

- [x] T005 [US1] Add calculator styling in `src/styles/global.css`.
      Goal: Style controls, changed rows, inputs, hints, status, and errors with design tokens.
      Inputs: DESIGN.md; docs/design-system.md; user task.
      Allowed scope: `src/styles/global.css`.
      Requirements: FR-013, FR-014.
      Acceptance checks: 44px controls, 16px mono inputs, visible focus, no raw color values, reduced-motion compatibility, no overflow at 360px.
      Non-goals: Unrelated page redesign.
      Dependencies: T002, T003, T004.

- [x] T006 [US1] Document calculator components and four-pair contrast in `docs/STYLE_GUIDE.md` and `DESIGN.md`.
      Goal: Record component patterns and token usage.
      Inputs: current design tokens; user task.
      Allowed scope: `docs/STYLE_GUIDE.md`, `DESIGN.md`, `docs/design-system.md` if token evidence requires an update.
      Requirements: FR-014.
      Acceptance checks: Document calculator button, amount input, apply button, anchor badge, status bar, and inline error; report text and control contrast for navy/green light/dark.
      Non-goals: New theme or palette tokens unless a contrast calculation demonstrates the need.
      Dependencies: T005.

## Phase 4: Verification and handoff

- [x] T007 Verify the feature and update `specs/002-ingredient-calculator/tasks.md` and `docs/handoff.md`.
      Goal: Run repository verification and record executed and unexecuted checks honestly.
      Inputs: all feature artifacts; quickstart.md.
      Allowed scope: task status and handoff, plus fixes required by verification.
      Requirements: FR-001 through FR-014; C01-C08.
      Acceptance checks: Run `npm run verify`; check base-path output; report browser viewports, themes, palettes, keyboard, and virtual-keyboard checks only when actually run.
      Non-goals: Commit, push, deploy, or recipe changes.
      Dependencies: T001-T006.

- [x] T008 Correct narrow-screen calculator and step layout in `src/styles/global.css` and `src/components/IngredientCalculator.tsx`.
      Goal: Keep ingredient rows, controls, and numbered steps legible at 360px.
      Inputs: user QA findings; spec.md FR-015 through FR-018; current design tokens.
      Allowed scope: `src/styles/global.css`, `src/components/IngredientCalculator.tsx`, `docs/STYLE_GUIDE.md`, `specs/002-ingredient-calculator/spec.md`, `specs/002-ingredient-calculator/tasks.md`, and `docs/handoff.md`.
      Requirements: FR-015 through FR-018; SC-006.
      Acceptance checks: The 399px CSS rule gives ingredient names a full-width row and places amounts below them; amount controls reserve the apply column; previous values and errors align with the amount column; status text wraps without truncation; calculator, ready, and reset controls have visible labels; `01 ·` uses a max-content nowrap column. Run `npm run verify` and report browser checks that were not run.
      Non-goals: Recipe data, schema, calculations, or route changes.
      Dependencies: T001-T007.

- [x] T009 Keep measurement columns fixed across anchor and edit states in `src/components/IngredientCalculator.tsx` and `src/styles/global.css`.
      Goal: Prevent the gram quantity and unit from shifting when a row becomes the anchor or an apply action appears.
      Inputs: user screenshots; spec.md FR-019; current component layout.
      Allowed scope: `src/components/IngredientCalculator.tsx`, `src/styles/global.css`, `docs/STYLE_GUIDE.md`, `specs/002-ingredient-calculator/spec.md`, `specs/002-ingredient-calculator/tasks.md`, and `docs/handoff.md`.
      Requirements: FR-019; SC-007.
      Acceptance checks: The anchor badge is in the name region; displayed amount and edit input use the same number/unit columns; every row keeps those columns even when the apply button is absent or appears. Run `npm run verify` and report browser visual limits.
      Non-goals: Recipe content, calculation rules, or route changes.
      Dependencies: T001-T008.

- [x] T010 Align static unit labels with edit-mode unit labels in `src/styles/global.css`.
      Goal: Keep `г`, `мл`, and other units at one horizontal position, color, and font in both display modes.
      Inputs: user screenshots; spec.md FR-020; current calculator styles.
      Allowed scope: `src/styles/global.css`, `docs/STYLE_GUIDE.md`, `specs/002-ingredient-calculator/spec.md`, `specs/002-ingredient-calculator/tasks.md`, and `docs/handoff.md`.
      Requirements: FR-020; SC-008.
      Acceptance checks: Static unit labels start at the same position as editable unit labels, stay left-aligned in their fixed grid cell, and use the same muted color and font. Run `npm run verify` and report browser visual limits.
      Non-goals: Recipe content, calculation rules, or route changes.
      Dependencies: T001-T009.

## Dependencies

Execute T001, then T002-T004 in dependency order, followed by T005-T010. No new task system is introduced.
