---
description: "Dependency-ordered implementation tasks for Favorite Recipes"
---

# Tasks: Favorite Recipes

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/storage.md`, and `quickstart.md` in this directory.

**Prerequisites**: Approved `spec.md` and `plan.md`.

**Tests**: The specification and quickstart require domain, storage, generated-output, and synthetic browser validation.

**Organization**: Tasks are grouped by user story. Shared storage and validation block all stories.

## Phase 1: Setup

**Purpose**: Add output-level checks before feature UI implementation.

- [x] T001 Add Favorites generated-output assertions in `scripts/check-output.mjs`.
  - Goal: Detect missing static Favorites navigation, page guidance, and star fallback markup.
  - Inputs: FR-001–FR-004, FR-013; plan project structure.
  - Allowed scope: `scripts/check-output.mjs`.
  - Requirements: Assert a named Favorites header link, a static no-JavaScript explanation, and accessible recipe-star fallback markup.
  - Checks: Run `node scripts/check-output.mjs` and confirm each assertion checks built output.
  - Non-goals: Runtime storage tests or UI implementation.
  - Dependencies: None.

## Phase 2: Foundational contracts

**Purpose**: Define and validate private Favorites state before building user-story UI.

- [x] T002 [P] Add Favorites domain tests in `tests/favorites.test.ts`.
  - Goal: Specify unique add/remove, clear, merge, stable IDs, bounds, and share-fragment rules.
  - Inputs: FR-007–FR-011; `data-model.md`; `contracts/storage.md`; research R01–R04.
  - Allowed scope: `tests/favorites.test.ts`.
  - Requirements: Cover idempotent add, ordered removal, collision-safe merge, size limits, strict unknown-field rejection, malformed and oversized share data, and URL-fragment round trips.
  - Checks: Run the focused Vitest file and confirm new tests fail before implementation.
  - Non-goals: DOM, localStorage, or browser UI tests.
  - Dependencies: T001.

- [x] T003 [P] Add Favorites storage tests in `tests/favorites-storage.test.ts`.
  - Goal: Specify safe local reads/writes and cross-page event behavior.
  - Inputs: FR-006–FR-007; `data-model.md`; `contracts/storage.md`; research R01 and R04.
  - Allowed scope: `tests/favorites-storage.test.ts`.
  - Requirements: Cover absent, valid, corrupt, and unsupported envelopes; blocked reads; failed writes; read-back validation; same-document notifications; and storage events.
  - Checks: Run the focused Vitest file and confirm new tests fail before implementation.
  - Non-goals: User-interface behavior or real browser data.
  - Dependencies: T001.

- [x] T004 Implement the validated Favorites domain and storage module in `src/lib/favorites.ts`.
  - Goal: Provide one authoritative implementation for the v1 envelope, bounds, local persistence, events, and share-fragment parsing/encoding.
  - Inputs: FR-007–FR-011; `data-model.md`; `contracts/storage.md`; research R01–R04.
  - Allowed scope: `src/lib/favorites.ts` and its focused tests.
  - Requirements: Store only unique stable recipe IDs and display-name snapshots; reject unknown or invalid nested data as a whole; preserve existing valid state on read/write/import failure; use the URL fragment; enforce one documented conservative item limit; notify same-tab and cross-tab listeners after valid changes.
  - Checks: Pass T002 and T003 tests; run Astro check and focused Vitest tests.
  - Non-goals: Accounts, server storage, sync, recipe content changes, or generic storage frameworks.
  - Dependencies: T002, T003.

**Checkpoint**: The pure contract and browser storage boundary pass tests before UI work begins.

## Phase 3: User Story 1 — Save and find favorite recipes (Priority: P1)

**Goal**: Save a recipe from the catalog or its page and find it in Favorites after navigation or reload.

**Independent Test**: Save synthetic recipes from both locations, open Favorites, reload, and confirm each stable ID appears exactly once with a working recipe link and synchronized star state.

- [x] T005 [US1] Create the accessible favorite star control in `src/components/FavoriteButton.tsx`.
  - Goal: Let a cook add or remove one stable recipe ID from either recipe surface.
  - Inputs: FR-001, FR-002, FR-011, FR-012; `data-model.md`; research R03 and R04.
  - Allowed scope: `src/components/FavoriteButton.tsx` and direct imports from `src/lib/favorites.ts`.
  - Requirements: Use a semantic button with an accessible name, explicit pressed state, visible saved-state indicator, same-tab synchronization, and storage-event synchronization.
  - Checks: Verify keyboard activation, saved/unsaved state, repeat-add idempotency, and storage failure feedback.
  - Non-goals: Catalog layout, share, or management actions.
  - Dependencies: T004.

- [x] T006 [US1] Add favorite controls to recipe cards and recipe pages in `src/pages/index.astro` and `src/pages/recipes/[slug].astro`.
  - Goal: Expose the same saved state at both required recipe locations.
  - Inputs: FR-001, FR-002, FR-011; US1 acceptance scenarios 1 and 3.
  - Allowed scope: The two named recipe pages and `FavoriteButton` integration.
  - Requirements: Pass stable authored recipe IDs and display-name snapshots; keep static recipe content usable without JavaScript.
  - Checks: Save and remove one synthetic recipe from each location; confirm state stays synchronized after navigation and reload.
  - Non-goals: Recipe schema or catalog content changes.
  - Dependencies: T005.

- [x] T007 [US1] Add the named Favorites header link and count in `src/layouts/Base.astro`.
  - Goal: Give users a direct route to the saved list and communicate its size.
  - Inputs: FR-003, FR-011, SC-001.
  - Allowed scope: `src/layouts/Base.astro` and focused output assertions.
  - Requirements: Place the Ukrainian “Улюблене” link beside shopping navigation; provide an accessible name and update the count after same-tab favorite changes and browser storage events.
  - Checks: Verify the link is present on generated pages and the count changes when a favorite is added or removed.
  - Non-goals: Account or cross-device indicators.
  - Dependencies: T004.

- [x] T008 [US1] Create the static Favorites route and saved-recipe list in `src/pages/favorites.astro` and `src/components/FavoritesList.tsx`.
  - Goal: Show each saved recipe with a safe link and a useful empty state.
  - Inputs: FR-004, FR-006, FR-011, FR-013; SC-001 and SC-002; missing-recipe entity rules.
  - Allowed scope: `src/pages/favorites.astro` and `src/components/FavoritesList.tsx`.
  - Requirements: Resolve current public titles and routes by stable ID; show saved name and a safe removal path for missing recipes; provide Ukrainian empty-state text and a static explanation when JavaScript is unavailable.
  - Checks: Verify empty and populated states, one entry per ID, available links, missing-recipe handling, and generated static fallback.
  - Non-goals: Clear-all or sharing controls.
  - Dependencies: T004, T007.

**Checkpoint**: A cook can save and find unique favorites from either recipe surface.

## Phase 4: User Story 2 — Manage saved recipes (Priority: P2)

**Goal**: Remove one saved recipe or clear the entire list only after confirmation.

**Independent Test**: Remove one of several synthetic items; cancel clear-all and verify no changes; confirm clear-all and verify the list and header count become empty.

- [x] T009 [P] [US2] Add management transition tests in `tests/favorites.test.ts`.
  - Goal: Prove single removal and clear preserve the required list semantics.
  - Inputs: FR-005, FR-011; `data-model.md`; US2 acceptance scenarios.
  - Allowed scope: `tests/favorites.test.ts`.
  - Requirements: Verify one-item removal preserves other order and clear returns a valid empty envelope.
  - Checks: Run the focused test file and confirm tests fail before UI changes.
  - Non-goals: Confirmation dialog implementation.
  - Dependencies: T004.

- [x] T010 [US2] Add per-item removal and confirmed clear-all controls in `src/components/FavoritesList.tsx`.
  - Goal: Give users safe control over stored private favorites.
  - Inputs: FR-005–FR-007, FR-012; SC-003; research R03.
  - Allowed scope: `src/components/FavoritesList.tsx` and `src/lib/favorites.ts` calls.
  - Requirements: Remove only the selected stable ID; show clear-all only for non-empty lists; require explicit confirmation; preserve all items on cancellation; report storage failures without false success.
  - Checks: Pass T009 and exercise removal, confirmation cancel, confirmation accept, keyboard operation, and accessible feedback with synthetic data.
  - Non-goals: Undo, server recovery, or removal from public recipes.
  - Dependencies: T008, T009.

**Checkpoint**: Removing one item preserves the others, and bulk clearing requires confirmation.

## Phase 5: User Story 3 — Share a favorites copy (Priority: P3)

**Goal**: Deliberately disclose and share a validated copy without changing saved state.

**Independent Test**: Share a synthetic list, confirm disclosure precedes link creation, cancel without changing state, then import valid and malformed copies and confirm validation/confirmation behavior.

- [x] T011 [P] [US3] Add share/import preservation tests in `tests/favorites.test.ts` and `tests/favorites-storage.test.ts`.
  - Goal: Prove cancel, malformed input, and failed writes preserve current favorites.
  - Inputs: FR-008–FR-010; `contracts/storage.md`; SC-005; US3 acceptance scenarios.
  - Allowed scope: The two named test files.
  - Requirements: Cover cancellation, valid merge, duplicate IDs, unknown recipe IDs, malformed and oversized fragments, and storage failure without state replacement.
  - Checks: Run focused tests and confirm each new case fails before UI implementation.
  - Non-goals: Network services or automated external sharing.
  - Dependencies: T004.

- [x] T012 [US3] Add disclosed share and confirmed import flows in `src/components/FavoritesList.tsx`.
  - Goal: Let users share or merge a read-only copy by explicit action.
  - Inputs: FR-008–FR-010, FR-012; SC-005; `contracts/storage.md`; research R02.
  - Allowed scope: `src/components/FavoritesList.tsx` and direct `src/lib/favorites.ts` calls.
  - Requirements: Show disclosure before creating or sending a link; prefer the device share sheet and provide a copy fallback; expose accessible result feedback; validate the full import before confirmation; merge by ID with current entries winning; preserve state on cancel, invalid data, or failed writes; disable or explain sharing for an empty list.
  - Checks: Pass T011; use synthetic data to verify share cancellation, fallback, valid import, malformed import, and unchanged state on failure.
  - Non-goals: Synchronization, remote APIs, or sharing private notes.
  - Dependencies: T010, T011.

**Checkpoint**: Sharing is explicit and disclosed; imports are validated, confirmed, and non-destructive.

## Phase 6: Polish and cross-cutting verification

**Purpose**: Complete accessibility, responsive, integration, and handoff checks.

- [x] T013 Verify Favorites responsive and accessible behavior in `src/styles/global.css`, `src/components/FavoriteButton.tsx`, `src/components/FavoritesList.tsx`, and `src/pages/favorites.astro`.
  - Goal: Keep Favorites usable at the minimum viewport and across supported input methods.
  - Inputs: FR-012–FR-013; SC-004 and SC-006; constitution C01, C05, C07.
  - Allowed scope: Favorites styles and markup only.
  - Requirements: Use Ukrainian labels, visible focus, practical touch targets, state cues beyond color, reduced-motion support, and no page-level overflow at 320 CSS pixels.
  - Checks: Review 320, 390, and 1280 CSS pixels, both themes, keyboard operation, screen-reader names/state, missing-recipe text wrapping, and JavaScript-disabled guidance. Record unexecuted checks.
  - Non-goals: Unrelated site redesign or automated accessibility claims without executed checks.
  - Dependencies: T006–T012.

- [x] T014 Run the Favorites quickstart and verification, then update `docs/handoff.md` and `specs/001-project-foundation/tasks.md`.
  - Goal: Record completed story checks and remaining limits without exposing private data.
  - Inputs: `quickstart.md`, all feature requirements, and completed story phases.
  - Allowed scope: Feature verification, project task status, and `docs/handoff.md`.
  - Requirements: Use synthetic browser data only; run `npm run verify`; execute applicable browser checks; report unexecuted checks; keep stable project task IDs and do not claim unrun checks.
  - Checks: Confirm the quickstart results, base-path build if required by the project workflow, task status, and handoff accuracy.
  - Non-goals: Deployment, private data export, or unrelated task-system changes.
  - Dependencies: T001–T013.

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no dependencies.
- Foundational contracts (Phase 2) depend on Setup and block all user stories.
- US1, US2, and US3 follow their stated priority because management depends on the list UI and sharing depends on validated storage and management controls.
- Polish depends on all story phases.

### User Story Dependencies

- US1 (P1) depends on Phase 2 and delivers the MVP.
- US2 (P2) depends on the Favorites list from US1.
- US3 (P3) depends on the list and management interface from US1 and US2.

### Parallel Opportunities

- T002 and T003 use separate test files and can run in parallel after T001.
- T006 and T007 touch separate page/layout files and can run in parallel after T005 and T004 respectively.
- T009 and T011 can be prepared in parallel after T004 because they cover separate story behavior; T011 must finish before T012.

## Parallel Example: Foundational tests

```text
Task: T002 Add Favorites domain tests in tests/favorites.test.ts
Task: T003 Add Favorites storage tests in tests/favorites-storage.test.ts
```

## Implementation Strategy

1. Add output checks, then complete and validate the shared contract and storage boundary.
2. Deliver US1 first as the smallest usable feature.
3. Add safe removal and confirmed clearing in US2.
4. Add disclosed sharing and confirmed import in US3.
5. Complete responsive and accessibility review, run verification, and record limits.
