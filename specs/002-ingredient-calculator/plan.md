# Implementation Plan: ingredient-calculator

**Branch**: existing main | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)
**Input**: Approved ingredient calculator request.

## Summary

Add a local Preact recipe calculator. Keep authored recipe data and static original amounts unchanged. Use one pure TypeScript module as the authoritative scaling, parsing, formatting, and pluralization implementation. Persist validated state per recipe in local storage.

## Technical Context

**Language/Version**: strict TypeScript; Node 24; npm 11.
**Primary Dependencies**: Existing Astro 7 and Preact integration. No new dependency.
**Storage**: Browser local storage, with session-only operation when unavailable.
**Testing**: Existing Vitest suite and `npm run verify`.
**Target Platform**: Static recipe routes, including `/Food-Lab/` deployment base.
**Constraints**: No schema or recipe data changes; original values remain authoritative; do not convert units; page remains readable without JavaScript.

## Constitution Check

- C01: Astro static output remains. Preact is used only for behavior that requires JavaScript.
- C02: Authored recipe schema and stable IDs remain unchanged.
- C03: Pure calculation rules live in one DOM-free module. Page wiring stays local.
- C04: Per-recipe calculation state remains in browser storage and is not exported.
- C05: Static recipe content remains available without JavaScript; controls meet touch, focus, responsive, and reduced-motion rules.
- C06: The AI authoring contract does not change because authored recipe data does not change.
- C07: Technical documentation is English; UI text is Ukrainian.
- C08: This feature has a separate spec, plan, and task list. Verification runs before completion.

## Design Decisions

- Render recipe data in page-local `data-*` attributes for the island; do not change the schema or recipe files.
- Create `src/lib/calculator.ts` for pure parsing, factor bounds, scaling, number formatting, plural forms, and stored-state validation.
- Create a recipe-local Preact island in `src/components/IngredientCalculator.tsx` for controls, input state, storage, and announcements.
- Hydrate with `client:load` so valid stored state can be restored before the interactive page paints; static markup remains as fallback.
- Keep static ingredient rows as fallback, and let the hydrated component own interactive rows after hydration.
- Use existing `--primary-soft`, `--accent-text`, `--control-border`, `--muted`, `--mono`, and `--sans` tokens. Add no raw colors.
- Keep input drafts separate from applied calculation state. Apply only on the row's button or Enter; never apply on blur.

## Project Structure

- `src/lib/calculator.ts`: pure domain logic.
- `src/components/IngredientCalculator.tsx`: recipe-local interactive component.
- `src/pages/recipes/[slug].astro`: static data attributes and island mount.
- `src/styles/global.css`: calculator presentation.
- `tests/calculator.test.ts`: pure calculation tests.
- `docs/STYLE_GUIDE.md`, `DESIGN.md`: component and token guidance.
- `specs/002-ingredient-calculator/`: specification, research, data model, tasks, and quickstart.
- `docs/handoff.md`: completed work, verification, and remaining visual-check limits.

## Complexity Tracking

No constitution violations. The Preact island is required for interactive calculator state and local persistence; pure logic remains independent of Preact and browser APIs.
