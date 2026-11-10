# Tasks: project-foundation

Inputs: spec.md, plan.md, data-model.md, contracts/authoring.md, research.md.
All paths in task inputs are relative to this feature directory unless repository paths are stated.

## Phase 1: Setup

- [x] T001 Configure package.json, Astro, TypeScript, lint, format, and ignore files

  Goal: Configure package.json, Astro, TypeScript, lint, format, and ignore files.
  Inputs: plan.md; research.md.
  Allowed scope: root configuration and package-lock.json.
  Requirements: FR-007, FR-010; C01, C08.
  Acceptance checks: Install dependencies without peer errors; strict configuration is active.
  Non-goals: No application behavior.
  Dependencies: None.

## Phase 2: Foundational validation

- [x] T002 Write content contract tests in tests/content.test.ts

  Goal: Write content contract tests in tests/content.test.ts.
  Inputs: data-model.md; spec.md.
  Allowed scope: tests/content.test.ts.
  Requirements: FR-002, FR-003; C02.
  Acceptance checks: Tests cover valid, malformed, unknown nested/top-level, unit, reference, duplicate and numeric cases.
  Non-goals: No schema weakening.
  Dependencies: T001.

- [x] T003 Implement src/schemas/recipe.ts and src/lib/content.ts

  Goal: Implement src/schemas/recipe.ts and src/lib/content.ts.
  Inputs: data-model.md; tests/content.test.ts.
  Allowed scope: schemas, content loader support, ingredient catalog, example recipe.
  Requirements: FR-002, FR-003; C02.
  Acceptance checks: T002 tests pass; strict objects; positive finite measured quantities; non-negative integer times; unique step IDs; positive integer servings.
  Non-goals: No calculations or storage.
  Dependencies: T002.

## Phase 3: US1 static reading

- [x] T004 [US1] Implement src/content.config.ts, src/layouts/Base.astro, src/pages/index.astro, src/pages/recipes/[slug].astro, src/pages/404.astro, src/styles/global.css

  Goal: Implement src/content.config.ts, src/layouts/Base.astro, src/pages/index.astro, src/pages/recipes/[slug].astro, src/pages/404.astro, src/styles/global.css.
  Inputs: plan.md; validated content.
  Allowed scope: listed static UI files and small path helper if needed.
  Requirements: FR-001, FR-004; C01, C05.
  Acceptance checks: Build generates catalog and complete recipe; subpath links work; no client script.
  Non-goals: No future navigation or controls.
  Dependencies: T003.

## Phase 4: US2 external authoring

- [x] T005 [US2] Write tests/authoring.test.ts for generated contract and example

  Goal: Write tests/authoring.test.ts for generated contract and example.
  Inputs: contracts/authoring.md; data-model.md.
  Allowed scope: tests/authoring.test.ts.
  Requirements: FR-005, FR-006, FR-007; C06.
  Acceptance checks: Tests require real schema/catalog, metadata, all inserts, and valid example.
  Non-goals: No duplicated validation.
  Dependencies: T003.

- [x] T006 [US2] Implement docs/ai/recipe-authoring.md, src/lib/authoring.ts, and src/pages/ai/recipe-authoring.astro

  Goal: Implement docs/ai/recipe-authoring.md, src/lib/authoring.ts, and src/pages/ai/recipe-authoring.astro.
  Inputs: contracts/authoring.md; tests/authoring.test.ts.
  Allowed scope: listed guide files and guide collection in src/content.config.ts.
  Requirements: FR-005, FR-006; C06, C07.
  Acceptance checks: T005 passes; generated guide includes complete pack and response format.
  Non-goals: No AI API, media support, or runtime parser.
  Dependencies: T004, T005.

## Phase 5: US3 bounded continuation

- [x] T007 [US3] Add scripts/check-output.mjs and .github/workflows/verify.yml

  Goal: Add scripts/check-output.mjs and .github/workflows/verify.yml.
  Inputs: spec.md; plan.md.
  Allowed scope: generated checks, CI, package scripts.
  Requirements: FR-007, FR-008; C08.
  Acceptance checks: verify executes checks in order; output checks follow build; npm ci works.
  Non-goals: No deployment.
  Dependencies: T006.

- [x] T008 [US3] Write AGENTS.md, README.md, LICENSE-CONTENT.md, NOTICE.md, and docs/adr/

  Goal: Write AGENTS.md, README.md, LICENSE-CONTENT.md, NOTICE.md, and docs/adr/.
  Inputs: constitution; existing LICENSE; spec.md.
  Allowed scope: listed operational docs and at most three ADRs.
  Requirements: FR-008, FR-009; C04, C07, C08.
  Acceptance checks: MIT unchanged; content notice links official license; precedence and private-data rules explicit.
  Non-goals: No branding or unimplemented capability claims.
  Dependencies: T007.

## Phase 6: Verification and handoff

- [x] T009 Verify foundation and write docs/handoff.md

  Goal: Verify foundation and write docs/handoff.md.
  Inputs: all feature artifacts; quickstart.md.
  Allowed scope: fixes within approved foundation; task status; docs/handoff.md.
  Requirements: FR-001 through FR-010; C01-C08.
  Acceptance checks: Format then verify; inspect routes and subpath; smoke-test if available; inspect Git hygiene; report check limits.
  Non-goals: No next feature, commit, push, or deployment.
  Dependencies: T008.

## Dependencies and execution

Execute T001-T009 in order. T005 may be written independently of T004 after T003.
Other tasks share files or depend on completed outputs. No parallel implementation is required.
US1 is tested by static output. US2 is tested by the complete pack and example.
US3 is tested by verify and handoff review. Do not commit automatically.

## Phase 7: Convergence

- [x] T010 Correct plain source URL handling and verify the complete Context Pack per FR-002, FR-006, SC-003, and plan: plain-text recipe body (partial)

  Goal: Accept and preserve plain source URLs in recipe body text, keep unsupported markup rejected, and confirm the rendered authoring pack is complete.
  Inputs: spec.md; plan.md; data-model.md; contracts/authoring.md; docs/ai/recipe-authoring.md; src/lib/content.ts; src/lib/authoring.ts; tests/content.test.ts; tests/authoring.test.ts; rendered /ai/recipe-authoring/ page.
  Allowed scope: src/lib/content.ts, tests/content.test.ts, docs/ai/recipe-authoring.md, specs/001-project-foundation/data-model.md, specs/001-project-foundation/contracts/authoring.md, tests/authoring.test.ts, scripts/check-output.mjs, and docs/handoff.md.
  Requirements: Plain source URLs MUST be stored without data loss and rendered as escaped text. Recipe bodies MUST continue to reject HTML and unsupported Markdown. The guide MUST state that source URLs are plain text, not clickable links. The rendered pack MUST include current metadata, fields, enums, catalog, paths, workflows, response sections, validation commands, privacy rules, and unsupported-operation rules without unresolved markers.
  Acceptance checks: Add a regression test for a URL containing query and fragment characters and confirm parsed body equality. Confirm the rendered page contains the complete current contract and no insertion markers or invalid fields. Run `npm run verify`.
  Non-goals: No rich Markdown, media, link generation, portion scaling, product features, or invented attribution.
  Dependencies: T009.

## Phase 8: Public recipe content

- [x] T011 Add the first pasta carbonara recipe and its catalog ingredients per FR-001, FR-003, and SC-001

  Goal: Add one Ukrainian, unverified pasta carbonara recipe that passes the existing content contract and appears in generated pages.
  Inputs: spec.md; data-model.md; src/schemas/recipe.ts; src/content/ingredients.json; docs/ai/recipe-authoring.md.
  Allowed scope: src/content/ingredients.json, src/content/recipes/pasta-karbonara/index.md, tests/content.test.ts, scripts/check-output.mjs, specs/001-project-foundation/tasks.md, and docs/handoff.md.
  Requirements: Recipe text MUST use Ukrainian. Ingredient IDs MUST be stable and present in the catalog. Recipe fields, amounts, units, and steps MUST pass the existing strict schema. Status MUST remain unverified.
  Acceptance checks: Production validation discovers the recipe and all ingredient references. Build output contains its catalog route and complete detail page. `npm run verify` passes.
  Non-goals: No recipe contract changes, source attribution, rich markup, media, portion scaling, or other product features.
  Dependencies: T010.

## Phase 9: Design system

- [x] T012 Implement Personal Cookbook Design System v1.0

  Goal: Apply the approved modern editorial visual direction to the existing static site.
  Inputs: user design-system request; constitution; foundation spec and plan; current pages, styles, schema, and deployment workflow.
  Allowed scope: layout and page presentation, global styles, generated-output checks, design-system documentation, task status, and handoff.
  Requirements: Semantic light and dark tokens; automatic and persistent manual themes; accessible catalog search and status filters; responsive cards and detail layout; recipe content integrity; static base-path compatibility.
  Acceptance checks: Run `npm run verify`; inspect both generated recipes, navigation, controls, placeholders, and subpath output; check browser behavior when available.
  Non-goals: No recipe contract change, invented verification state, invented images, dependency, deploy, or push.
  Dependencies: T011.

## Phase 10: Reference kit refinement

- [x] T013 Apply the supplied Food Lab design kit with dark navy default

  Goal: Use the supplied navy and green palettes and self-hosted fonts for the existing pages.
  Inputs: user request; `food-lab-design-kit.zip`; style preview HTML; constitution; T012 pages, styles, and design documentation.
  Allowed scope: static design assets, layout and page presentation, global CSS, output checks, design documentation, task status, and handoff.
  Requirements: Dark navy MUST be the default. Theme control MUST support dark, light, and automatic modes. Palette MUST be switchable through `data-palette`. Preserve existing recipe data, search behavior, routes, and static base path.
  Acceptance checks: Run `npm run verify`; check the `/Food-Lab/` build and local fonts; compute text and control contrast for both palettes and themes; inspect browser layout when available.
  Non-goals: No recipe contract change, invented images or verification, timer behavior, new dependencies, deploy, push, or automatic commit.
  Dependencies: T012.

## Phase 11: Visual QA corrections

- [x] T014 Correct theme icons, recipe placeholders, metadata, and shared alignment

  Goal: Fix the visual QA issues reported for theme controls, missing photos, recipe metadata, and page alignment.
  Inputs: user QA checklist; constitution; T013 design system and current rendered components.
  Allowed scope: shared layout, catalog and recipe presentation, global styles, task status, and handoff.
  Requirements: Keep design tokens, fonts, palette values, recipe content, and routes unchanged. Theme icon and labels MUST reflect the active mode. Missing recipe photos MUST use compact strips. Content edges MUST align.
  Acceptance checks: Run `npm run verify`; inspect requested widths, theme/palette combinations, and interaction states where browser tooling permits.
  Non-goals: No recipe data changes, new behavior, assets, dependencies, deployment, or push.
  Dependencies: T013.

## Phase 12: AI design reference

- [x] T015 Add a visual design reference page for AI assisted UI work

  Goal: Provide one shareable page with live component examples and concise design implementation rules.
  Inputs: user request; current design kit, pages, routes, and design system documentation.
  Allowed scope: new AI design reference route, shared footer link, generated-output checks, task status, and handoff.
  Requirements: The page MUST show real component patterns, theme and palette guidance, typography, responsive and accessibility constraints, and repository boundaries. Palette previews MUST be interactive.
  Acceptance checks: Run `npm run verify`; check the generated page and base-path links.
  Non-goals: No recipe data or schema changes, dependencies, deployment, or push.
  Dependencies: T014.

## Phase 13: Recipe step typography

- [x] T016 Match recipe steps to design reference section headings

  Goal: Replace circular step numbers with section-style numbers on recipe pages and the AI design reference.
  Inputs: user request; constitution; current recipe page, global styles, and AI design reference.
  Allowed scope: recipe presentation, AI design reference example, task status, and handoff.
  Requirements: Steps MUST use the reference section heading font and size. Step numbers MUST use the `01 ·` format. Recipe data and IDs MUST remain unchanged.
  Acceptance checks: Run `npm run verify`; inspect generated recipe and design reference output.
  Non-goals: No recipe contract, behavior, token, font asset, or palette changes.
  Dependencies: T015.

## Phase 14: Step column refinement

- [x] T017 Separate recipe step numbers from body text

  Goal: Keep section-style step numbers in their own column and restore the previous step body typography.
  Inputs: user screenshot and correction; constitution; current recipe page, styles, and AI design reference.
  Allowed scope: recipe presentation, AI design reference example, task status, and handoff.
  Requirements: Numbers MUST use the `01 ·` heading style. Step text MUST use the previous 20px sans-serif style and stay in a separate column. Recipe content and IDs MUST remain unchanged.
  Acceptance checks: Run `npm run verify`; inspect generated recipe and design reference output.
  Non-goals: No recipe contract, behavior, tokens, font assets, or palette changes.
  Dependencies: T016.

## Phase 15: Step number cleanup

- [x] T018 Remove separators from recipe step numbers

  Goal: Remove decorative dots from the separate recipe step number column.
  Inputs: user screenshot and correction; T017 styles and AI design reference.
  Allowed scope: recipe presentation, AI design reference, task status, and handoff.
  Requirements: Step numbers MUST remain two-digit and separate from body text. The separator dot MUST be removed.
  Acceptance checks: Run `npm run verify`; inspect generated recipe and design reference output.
  Non-goals: No recipe data, layout, behavior, token, font, or palette changes.
  Dependencies: T017.

## Phase 16: Add chicken and mushroom julienne

- [x] T019 Add the Ukrainian chicken and mushroom julienne recipe

  Goal: Add the requested six-serving recipe with scalable base ingredients and serving variations.
  Inputs: user-provided recipe content; recipe authoring guide; design reference; current recipe pages and calculator.
  Allowed scope: `src/content/ingredients.json`, the new recipe file, local recipe detail presentation, task status, and handoff.
  Requirements: Recipe text MUST use Ukrainian. Measured ingredients MUST scale from six servings. To-taste items MUST remain unchanged. Serving variations MUST remain outside the ingredient calculation. The page MUST use the existing template, placeholder, and catalog discovery behavior.
  Acceptance checks: `npm run verify`; local browser review; confirm scaling at 3, 6, and 12 servings; confirm catalog navigation and variation separation. Desktop review completed. Mobile viewport and browser-console inspection were unavailable in the connected browser; report these limits.
  Non-goals: No global redesign, recipe-specific component, dependency, invented photo, or changes to other recipe data.
  Dependencies: T018.

- [x] T020 Record kitchen-use guidance and draft scope

  Goal: Record practical UI guidance and the next bounded draft scope.
  Inputs: constitution; foundation and calculator specifications; design-system and handoff; user request.
  Allowed scope: design-system, handoff, this task, and the draft kitchen-reading specification.
  Requirements: C05, C07, C08; preserve approved-source precedence and report conflicts.
  Acceptance checks: Rules and draft scope are documented; existing conflicts and verification limits are explicit.
  Non-goals: Product implementation, constitution or recipe contract changes.
  Dependencies: T019.

- [x] T021 Reconcile foundation and later feature scope

  Goal: Limit foundation-only exclusions and clarify calculator and shopping feature boundaries.
  Inputs: constitution; foundation specification and plan; calculator specification; user request; handoff.
  Allowed scope: foundation specification, plan and task list; kitchen-reading draft and checklist; design-system scope note; handoff.
  Requirements: Preserve constitution precedence and foundation obligations; identify shopping work as requiring its own specification.
  Acceptance checks: Read amended requirements for consistent scope; run `npm run verify`; record results and limits.
  Non-goals: No product implementation, constitution change, recipe contract change, or shopping feature approval.
  Dependencies: T020.

## Phase 18: Shopping list feature (approved)

Inputs: `specs/004-shopping-list/spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/storage.md`, and `quickstart.md`. The user approved the specification on 2026-11-10.
Execute T022–T029 in dependency order. This file remains the only authoritative task list.

- [x] T022 Establish shopping domain and tests in `src/lib/shopping.ts` and `tests/shopping.test.ts`

  Goal: Provide one pure authoritative implementation for contributions, unit conversion and totals.
  Inputs: shopping spec FR-004–FR-006, FR-015; data model; research R02.
  Allowed scope: `src/lib/shopping.ts`, `tests/shopping.test.ts`.
  Requirements: Stable ingredient IDs group authored contributions; incompatible units stay separate; to-taste stays unspecified. Finite positive contributions and finite nonnegative stock are validated; legacy zero is preserved. Use calculator factor rules, not a duplicate.
  Acceptance checks: Test 200 g + 0.3 kg = 500 g, `г` aliases, unknown and incompatible units, unspecified amounts, stock exceeding need, and source-specific removal.
  Non-goals: DOM, storage access, schema changes, or food-density conversions.
  Dependencies: T021.

- [x] T023 Implement safe storage migration in `src/lib/shopping-storage.ts` and `tests/shopping-storage.test.ts`

  Goal: Preserve existing lists and validate versioned state without data loss.
  Inputs: shopping spec FR-009–FR-011; `contracts/storage.md`; data model.
  Allowed scope: shopping storage and its tests; pure validation in `src/lib/shopping.ts` if needed.
  Requirements: Validate all nested fields; preserve each valid v1 entry and source without inventing recipe selections; do not overwrite v1 or corrupt v2; read back v2 writes; show unsaved failure to callers. Selected portions are finite positive with factors 0.1–20 inclusive.
  Acceptance checks: Tests cover valid v1, null/zero quantity, malformed sources, corrupt JSON, blocked read/write, quota, interrupted write, readback, and repeated initialization.
  Non-goals: Real user data, cloud sync, or silent fallback that replaces saved data.
  Dependencies: T022.

- [x] T024 [US1] Add recipe contributions in `src/components/IngredientCalculator.tsx` and `src/pages/recipes/[slug].astro`

  Goal: Add a whole recipe or one ingredient using stable IDs and current displayed portions.
  Inputs: shopping spec FR-001–FR-004, FR-010; calculator spec; storage contract.
  Allowed scope: recipe page and calculator island; shopping domain/storage integration.
  Requirements: Include measured and to-taste ingredients. Confirm success only after persistence; offer session-only unsaved operation on storage failure. Re-adding a selected recipe requires explicit update or cancellation.
  Acceptance checks: Add a recipe at changed portions; add a to-taste ingredient; repeat recipe without silent doubling; verify failure feedback and independent recipe calculator state.
  Non-goals: Recipe schema or AI guide change.
  Dependencies: T023.

- [x] T025 [US1] Show selected recipes and aggregated needs in `src/components/ShoppingList.tsx`

  Goal: Let the cook inspect sources, explicitly edit list portions, and remove one recipe's contributions.
  Inputs: shopping spec FR-002–FR-005; data model; T022–T024.
  Allowed scope: shopping component and shopping domain integration.
  Requirements: One snapshot per stable recipe ID; finite positive portions with factor 0.1–20; recipe-page changes do not update list state. Removal leaves independent contributions intact.
  Acceptance checks: Add two synthetic recipes with a shared ingredient; change one list portion count and remove that recipe; check total, source breakdown, and other contributions.
  Non-goals: Automatic refresh from later recipe edits or removal of legacy rows.
  Dependencies: T024.

- [x] T026 [US2] Add home-stock controls in `src/components/ShoppingList.tsx` and `src/lib/shopping.ts`

  Goal: Show needed, available, and remaining amounts with reversible full and partial availability.
  Inputs: shopping spec FR-006, FR-008, FR-010; data model.
  Allowed scope: shopping component, domain logic, relevant tests.
  Requirements: Stock is finite and nonnegative, can exceed need, and remaining is never negative. Reject incompatible or invalid entries without changing valid state; changing stock returns affected cart row to outstanding.
  Acceptance checks: 500 g needed and 200 g available yields 300 g; full availability and reversal work; invalid values leave the previous amount intact.
  Non-goals: Persistent inventory outside this list.
  Dependencies: T025.

- [x] T027 [US3] Complete shopping actions in `src/components/ShoppingList.tsx` and `src/pages/shopping.astro`

  Goal: Support manual products, reversible cart grouping, deletion, progress and a static fallback.
  Inputs: shopping spec FR-007–FR-013; storage and sharing contract.
  Allowed scope: shopping page, component, domain/storage integration, relevant tests.
  Requirements: Add/edit/remove manual entries; undo restores the entity without undoing later changes. Preserve existing copy, share, clear and legacy-link import with explicit validation and link privacy notice; no network transmission without a user action.
  Acceptance checks: Add/edit/mark/reload/unmark/remove a manual item; undo after unrelated changes; validate v1/v2 link import, failure and clear paths; inspect the no-JavaScript explanation.
  Non-goals: Categories, pricing, accounts, or sync.
  Dependencies: T026.

- [x] T028 [US3] Design responsive shopping presentation in `src/styles/global.css` and `src/components/ShoppingList.tsx`

  Goal: Make quantities and core actions readable at home and in a shop.
  Inputs: shopping spec FR-012; `docs/design-system.md`; existing tokens.
  Allowed scope: shopping-specific presentation, component markup and shopping page.
  Requirements: Ukrainian visible labels, keyboard access and focus, practical touch targets, 320 px fit, separate outstanding and cart groups, compact manual entry and secondary sharing actions.
  Acceptance checks: Review 320, 390 and 1280 px, both themes, keyboard and representative long labels; report unexecuted checks.
  Non-goals: Unrelated site redesign or new dependencies.
  Dependencies: T027.

- [x] T029 Verify shopping flow and update `docs/handoff.md` and `scripts/check-output.mjs`

  Goal: Validate the complete feature and record results and limitations.
  Inputs: shopping quickstart, spec FR-014–FR-015, all preceding feature tasks.
  Allowed scope: output checks, feature-relevant tests, task status and handoff.
  Requirements: Run `npm run verify`; validate base path, static fallback and representative end-to-end flows using synthetic data. Record all failures and unexecuted checks. Do not include private data.
  Acceptance checks: Verify outputs and browser scenarios in quickstart; confirm no recipe contract or AI authoring change; update task status and handoff.
  Non-goals: Deployment, private data export, or claims of unrun accessibility checks.
  Dependencies: T028.

### Dependencies and delivery

T022 → T023 → T024 → T025 → T026 → T027 → T028 → T029. Shared domain/storage changes are
sequential. Each story has an independent scenario in `specs/004-shopping-list/spec.md`; the first
usable shopping release includes all three stories. Independent documentation review can run in
parallel with domain test design, without editing shared implementation files.

## Phase 19: Kitchen-use refinements

- [x] T030 Improve recipe reading, shopping feedback, mobile catalog, and shopping list

  Goal: Make recipe and shopping flows clear and compact on narrow screens.
  Inputs: user request; constitution; T020 kitchen-reading draft; approved `specs/005-kitchen-use/spec.md`; current recipe, catalog, shopping, and design-system code.
  Allowed scope: recipe and catalog presentation, existing shopping-list UI and storage adapter, design-system documentation, domain tests, output checks, recipe step text, task status, and handoff.
  Requirements: Missing photos MUST NOT reserve large areas. Ingredient rows MUST keep name, amount, and shopping action associated at 320 CSS pixels. Preparation checkboxes MUST name their purpose and have a 48px label hit area. Primary controls MUST have visible labels or clear state feedback. Recipe shopping additions MUST persist across navigation, and repeated taps MUST show their quantity effect. The shopping form MUST use visible labels and a useful empty state. Catalog cards MUST prioritize recipe information. Search, status filters, and empty results MUST remain functional.
  Acceptance checks: Run `npm run verify`; inspect 320, 390, and 1280 CSS pixel layouts; verify recipe-to-list add, repeat, and purchased flows; inspect search, filters, and empty results; report checks that could not run.
  Non-goals: No recipe schema or authoring-contract change, cooking mode, timer, new dependency, private data export, deploy, or push.
  Dependencies: T021.

## Phase 20: Favorites feature

Inputs: `specs/006-favorite-recipes/spec.md`, `plan.md`, `data-model.md`, `contracts/storage.md`,
and `tasks.md`. The user approved the specification. The feature-local tasks remain in
`specs/006-favorite-recipes/tasks.md`; this file remains the authoritative project task list.

- [x] T048 Implement and verify saved favorite recipes in `specs/006-favorite-recipes/`

  Goal: Let users save, manage, share, and import favorite recipes without an account.
  Inputs: approved Favorites specification and plan; constitution; current recipe catalog and storage patterns.
  Allowed scope: Favorites domain and storage, recipe and catalog controls, header count, Favorites page, feature tests, generated-output checks, task status, and handoff.
  Requirements: Persist only valid known recipe IDs in browser storage. Keep updates synchronized in the current and other tabs. Share and import only after explicit user action and confirmation. Preserve current saved data when storage or validation fails. Keep static guidance when JavaScript is unavailable. Do not include private data in URLs or repository files.
  Acceptance checks: Follow `specs/006-favorite-recipes/quickstart.md`; run `npm run verify` and the `/Food-Lab/` build/output check; record browser checks and limitations in `docs/handoff.md`.
  Non-goals: Accounts, cloud sync, recommendations, private-data export, or changes to the recipe contract.
  Dependencies: T030.

- [x] T049 Correct shopping-list row actions and quantity editing in `specs/004-shopping-list/`

  Goal: Restore per-row deletion and copy actions, replace home-stock controls with editable list quantities, and preserve existing saved data.
  Inputs: User request dated 2026-11-10; approved shopping-list specification and its explicit amendment; shopping data and storage contracts; constitution.
  Allowed scope: shopping specification, plan, data model, storage contract, quickstart, component, domain, styles, tests, output checks, task status, and handoff.
  Requirements: Preserve existing v2 stock fields without applying them to totals. Persist strict row quantity overrides and clear them when source contributions change. Delete only the chosen row and its sources; preserve unrelated rows and support undo. Provide selectable copy text when clipboard access is unavailable.
  Acceptance checks: Run `npm run verify`, the synthetic shopping quickstart, and the `/Food-Lab/` build/output check. Record browser results and limits.
  Non-goals: Version 3 storage, server sharing, accounts, recipe contract changes, or private shopping data.
  Dependencies: T048.

## Phase 21: Shopping row action order

- [x] T050 Show edit before delete in each shopping row

  Goal: Put the non-destructive row action before deletion.
  Inputs: User request and screenshot dated 2026-11-10; shopping row markup and styles.
  Allowed scope: shopping row action markup and grid placement; task status and handoff.
  Requirements: The edit control MUST appear and receive keyboard focus before the delete control.
  Acceptance checks: Run `npm run verify`; inspect the shopping row markup and its explicit grid columns.
  Non-goals: No shopping behavior, data, layout, or other control changes.
  Dependencies: T049.
