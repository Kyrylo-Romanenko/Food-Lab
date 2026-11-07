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
