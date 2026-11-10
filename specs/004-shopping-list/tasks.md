# Tasks: Browser-local shopping list

**Input**: Design documents in this directory: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/storage.md`, and `quickstart.md`.

**Tests**: The specification defines independent scenarios and the plan requires Vitest, migration, and generated-output checks. Include those checks in story phases.

**Organization**: Tasks follow the three user stories and dependency order. Each task names its implementation or test path.

## Phase 1: Setup

**Purpose**: Confirm the feature work area and add output-level coverage.

- [x] T031 Add shopping-page static output assertions in `scripts/check-output.mjs` for visible field labels, the empty-state guidance, the no-JavaScript message, and the shopping island.

## Phase 2: Foundational contracts

**Purpose**: Establish pure shopping rules and a safe browser-storage boundary before story UI work.

- [x] T032 Add domain tests in `tests/shopping.test.ts` for compatible-unit conversion, stable ingredient grouping, unspecified amounts, stock limits, contribution removal, and recipe portion bounds.
- [x] T033 Implement pure validation, unit conversion, aggregation, remaining-amount calculations, and source removal in `src/lib/shopping.ts`; reuse factor limits from `src/lib/calculator.ts` and keep DOM and storage access out of this module.
- [x] T034 Add migration and failure tests in `tests/shopping-storage.test.ts` for valid v1 rows, null and zero quantities, malformed sources, corrupt JSON, blocked reads and writes, quota failures, interrupted writes, read-back, and repeated initialization.
- [x] T035 Implement the v2 envelope and non-destructive v1 migration in `src/lib/shopping-storage.ts`; retain the `foodlab:shopping:v1` recovery value, validate every nested field, verify writes by reading them back, and never infer selected recipes from legacy rows.

**Checkpoint**: Domain calculations and migration must pass their unit tests before recipe and list UI work starts.

## Phase 3: User Story 1 — Select recipes and ingredients (Priority: P1)

**Goal**: Add recipe snapshots or individual ingredients and show source-aware totals with portions controlled by the shopping list.

**Independent Test**: Add two synthetic recipes with one shared ingredient. Confirm one aggregate and two sources. Change one selected portion count, then change the recipe-page calculator and confirm only the list-specific selection controls its saved contribution.

- [x] T036 Add recipe-flow tests in `tests/shopping.test.ts` for whole-recipe snapshots, individual measured and to-taste contributions, repeated recipe choices, shared ingredients, portion changes, and source-specific removal.
- [x] T037 Add stable recipe IDs and the whole-recipe and individual-ingredient actions in `src/pages/recipes/[slug].astro` and `src/components/IngredientCalculator.tsx`; snapshot the displayed portions, include to-taste ingredients as unspecified, require explicit update or cancellation for an existing recipe, and report persistent versus session-only saves.
- [x] T038 Render selected recipes, independently editable portions, aggregate quantities, and source breakdowns in `src/components/ShoppingList.tsx`; retain separate manual and legacy rows and preserve unrelated contributions when one recipe is removed.

**Checkpoint**: The cook can add one or more recipes and inspect source-aware totals without recipe-page calculator changes altering saved list portions.

## Phase 4: User Story 2 — Track home stock and shopping (Priority: P2)

**Goal**: Record stock at home, calculate remaining amounts, and reversibly mark products in the cart.

**Independent Test**: Add 500 g of an ingredient, enter 200 g at home, confirm 300 g to buy, mark it in the cart, change its need, and confirm the affected cart row returns to outstanding.

- [x] T039 Add stock and cart transition tests in `tests/shopping.test.ts` for 500 g needed minus 200 g available, stock above need, stock reversal, cart reversal, and cart reset after a need or stock change.
- [x] T040 Add available-at-home and cart controls in `src/components/ShoppingList.tsx` and implement their state transitions in `src/lib/shopping.ts`; accept only finite nonnegative stock, show `max(needed - available, 0)`, and reset only the affected cart row when its need or stock changes.

**Checkpoint**: Stock and cart state must persist, reverse cleanly, and leave unrelated rows unchanged.

## Phase 5: User Story 3 — Manage, migrate, and share the list (Priority: P3)

**Goal**: Manage manual products, preserve legacy data, and explicitly import or share list copies.

**Independent Test**: Migrate a synthetic v1 list and verify every legacy field. Add, edit, mark, reload, remove, and undo a manual product. Import a legacy link after confirmation and share a v2 copy without replacing current data.

- [x] T041 Extend migration and import tests in `tests/shopping-storage.test.ts` for v1 link arrays, v2 envelope links, explicit confirmation paths, ID collisions, malformed input, and failed imports that leave current state unchanged. Browser checks confirmed v1 cancel leaves the list empty, v1 confirmation imports the legacy row, and v2 confirmation imports the envelope item.
- [x] T042 Add manual-product editing, deletion, purchase state, undo, progress, and empty-state guidance in `src/components/ShoppingList.tsx`; preserve current state when undoing an entity after unrelated changes.
- [x] T043 Add explicit v1-array and v2-envelope import, copy, share, and clear actions in `src/components/ShoppingList.tsx`; validate imports, merge rather than replace, disclose that link holders can read the copied list, and document that clearing must not resurrect migrated v1 rows.
- [x] T044 Add a visible static no-JavaScript explanation to `src/pages/shopping.astro` and verify the page continues to render its fallback without the Preact island.

**Checkpoint**: Existing data remains recoverable, imports never silently replace the list, and sharing occurs only after a user action.

## Phase 6: Polish and cross-cutting verification

**Purpose**: Validate responsive access, static output, the complete flow, and documented limitations.

- [x] T045 Implement shopping-specific responsive styles and accessible focus and touch targets in `src/styles/global.css` and `src/components/ShoppingList.tsx`; check 320, 390, and 1280 CSS-pixel layouts, both themes, keyboard use, long labels, and practical control hit areas. Browser review at all three widths showed no horizontal page overflow. The form uses a full-width product field on mobile and places quantity and unit fields side by side. A long synthetic product name wraps without clipping. At 320 px the checkbox measured 24×24 px inside a 156×162 px clickable label, the row action measured 44×44 px, and the home-stock input was 44 px high. Both themes rendered, and keyboard focus reached the product field with a visible 3 px outline.
- [x] T046 Run the synthetic-data quickstart scenarios available in the local browser and automated tests, `npm run verify`, and the `/Food-Lab/` build/output check; update task status and record results plus unexecuted checks in `docs/handoff.md` without using private list data.

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no dependencies.
- Foundational contracts (Phase 2) depend on Setup and block all stories.
- User Stories 1–3 depend on Phase 2 and follow their priority order because their UI shares the same shopping state.
- Polish (Phase 6) depends on all user stories.

### User Story Dependencies

- US1 (P1) starts after Phase 2 and is the MVP. It has no dependency on US2 or US3.
- US2 (P2) starts after US1 so stock and cart controls can act on aggregate rows.
- US3 (P3) starts after US2 and completes migration, CRUD, import, and share flows.

### Parallel Opportunities

- T032 and T034 can be prepared in parallel because they use different test files; implementation T033 and T035 must wait for their corresponding tests.
- T036 can be prepared alongside Phase 2 tests once the domain contract is agreed; T037 and T038 share the v2 contract and should be sequential.
- T039 can be prepared separately from US1 UI work; T040 depends on aggregate rows from T038.
- T041 can be prepared in parallel with T042 because they edit different files; T043 depends on both the storage contract and list UI.
- T045 and T046 are final cross-cutting work and should follow story implementation.

## Parallel Example: User Story 1

```text
Task: T036 Add recipe-flow domain tests in tests/shopping.test.ts
Task: Review recipe-page props and static fallback in src/pages/recipes/[slug].astro
```

## Implementation Strategy

1. Complete Setup and the foundational domain/storage contracts.
2. Deliver US1 as the MVP and verify independent recipe portions and source aggregation.
3. Add US2 stock and cart transitions and verify reversibility.
4. Add US3 manual management, migration, import, and sharing.
5. Run responsive, static-output, base-path, and full quickstart checks; record all limits.

## Notes

- Tasks use sequential IDs after the existing foundation task IDs T001–T030.
- Keep browser tests synthetic. Never export or commit real shopping data.
- This feature-local task list supports this specification; `specs/001-project-foundation/tasks.md` remains the project task list under `AGENTS.md`.

## Phase 7: Convergence

- [x] T047 Reconcile the shopping-list verification record in `docs/handoff.md` per T046 (partial). Remove the stale paragraph that says T045 remains open and that 320/390 px, long-label, and hit-area checks are unverified. Preserve still-unverified checks, including JavaScript-disabled behavior, and keep the documented measurements consistent with the completed T045 results.

## Phase 8: Shopping-list corrections

- [x] T048 Restore per-row deletion, reliable copy actions, and editable quantities in `src/components/ShoppingList.tsx` and `src/lib/shopping.ts`.

  Goal: Let the cook delete one visible row, edit its total quantity, and copy the list or link when browser clipboard access varies.
  Inputs: User request dated 2026-11-10; amended `spec.md`; `plan.md`; data model; storage contract; constitution.
  Allowed scope: shopping feature documents, component, domain module, shopping styles, related tests, generated-output checks, task status, and handoff.
  Requirements: Remove at-home stock from current totals and interface. Preserve old stock fields when reading and writing existing v2 lists. Persist validated row quantity overrides and clear them when source needs change. Delete a row's recipe and independent contributions together; preserve unrelated rows and support undo. Copy actions MUST fall back to selectable text when clipboard access is unavailable.
  Acceptance checks: Run `npm run verify`, available synthetic browser scenarios, and the `/Food-Lab/` build/output check. Verify per-row deletion and quantity edit/reload. Review clipboard fallback in code and report that the browser copy action was not run to avoid overwriting the user's clipboard. Record unexecuted responsive checks.
  Non-goals: Version 3 storage, server sharing, accounts, recipe contract changes, or use of private shopping data.
  Dependencies: T047.
