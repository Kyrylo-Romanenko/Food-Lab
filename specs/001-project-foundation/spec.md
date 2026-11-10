# Feature Specification: project-foundation

**Feature Branch**: existing main; no branch hook installed
**Created**: 2026-11-07
**Status**: Approved for implementation by bootstrap request
**Input**: User bootstrap contract. No architecture research supplied.

## Scope amendment: 2026-11-10

The user requested reconciliation of foundation scope with the approved ingredient calculator and
shopping-list work. The foundation exclusions in FR-004 and FR-010 apply to the original foundation
implementation only. They do not prohibit separately specified features. The calculator is governed
by `specs/002-ingredient-calculator/spec.md`. Shopping-list development requires its own approved
specification; existing code alone does not define or approve that scope. This amendment does not
change the constitution, recipe contract, or unrelated foundation obligations.

## User Scenarios & Testing

### User Story 1 - Read public recipes (Priority: P1)

A cook opens the catalog and reads a complete Ukrainian recipe without JavaScript.
**Why this priority**: Static reading is the foundation.
**Independent Test**: Inspect catalog and recipe HTML after a successful build.
**Acceptance Scenarios**:

1. Given a valid recipe file, when the build succeeds, then its catalog link and detail HTML exist.
2. Given a repository subpath, when pages are built, then internal links and assets retain that prefix.

### User Story 2 - Author with external AI (Priority: P2)

An author copies one complete Context Pack without giving the AI repository access.
**Why this priority**: Explicit content contracts reduce invalid contributions.
**Independent Test**: Validate the canonical example and inspect the generated guide.
**Acceptance Scenarios**:

1. Given current schemas and catalog, when built, then the guide includes their current values.
2. Given an update request without a current file, then the contract requires the AI to request it.
3. Given invalid AI content, when validated, then the build fails before publication.

### User Story 3 - Continue bounded work (Priority: P3)

A coding agent reads a task and runs one deterministic verification command.
**Why this priority**: Small agents need explicit scope and checks.
**Independent Test**: Run verification and follow the handoff links.
**Acceptance Scenarios**:

1. Given a clean dependency installation, when verify runs, then checks execute without source edits.
2. Given invalid content, then diagnostics identify its file and field where possible.

### Edge Cases

Unknown top-level and nested fields, unsupported units, blank text, nonpositive quantities,
negative times, empty steps, duplicate step/recipe/catalog IDs, duplicate slugs, and missing
ingredient references MUST fail validation. An empty catalog page MUST remain understandable.
Missing Git metadata MUST produce an explicit unknown context build.

## Requirements

### Functional Requirements

- **FR-001**: Generate catalog, recipe, AI guide, and not-found HTML. Use trailing slashes and support a configured base path. Do not require JavaScript for reading.
- **FR-002**: Strictly validate Markdown frontmatter and all nested objects. Validate unique IDs, slugs, and ingredient references before collection storage can hide duplicates.
- **FR-003**: Provide a small ingredient catalog and one original Ukrainian unverified recipe. Numeric measured amounts MUST be positive. To-taste amounts MUST be explicit. Do not add images or fabricated history.
- **FR-004**: Use a shared layout, requested warm light/dark tokens, system fonts, semantic HTML, visible focus, 48px link targets, and a 320px-friendly layout. Respect reduced motion. The foundation implementation does not add future controls; separately specified features may add controls.
- **FR-005**: Render docs/ai/recipe-authoring.md through a build-time Markdown mechanism. Generate catalog, enums, units, and source-revision metadata. The complete selectable pack MUST have no unresolved markers.
- **FR-006**: Define contract version 1 for create, update, and ingredient proposals. Include all fields, constraints, paths, routes, workflows, example, boundaries, privacy, response sections, uncertainty rules, and exact validation commands. Preserve IDs and supplied content during updates.
- **FR-007**: Provide required npm commands. Verify MUST run Astro/types, lint, format checks, production-code unit tests, build, and output checks in order. Test the guide example against production schemas and catalog.
- **FR-008**: Provide pull-request/main-push CI, minimal permissions, npm cache, npm ci, and verify. Preserve MIT; add CC BY 4.0 content notice and rights/privacy guidance. Ignore generated and private files.
- **FR-009**: Provide concise AGENTS.md, operational README, at most three ADRs, and a handoff. Record runtime/tool versions, assumptions, compatibility evidence, check limits, and next bounded feature.
- **FR-010**: Keep Astro static, strict TypeScript, Preact integration, and one npm lockfile. The foundation implementation does not add storage, scaling, search, cooking mode, offline support, AI APIs, deployment, branding, or backend features. This foundation scope does not prohibit a separately specified feature that complies with the constitution.

### Key Entities

Recipe: stable ID, path-derived slug, Ukrainian text, category, tags, difficulty, unverified status,
base servings, preparation/cooking minutes, measured or to-taste ingredients, and ordered stable steps.
Ingredient: stable ID and Ukrainian name. Context Pack: version, source build, catalog, and authoring rules.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Every valid public recipe appears automatically with complete generated HTML.
- **SC-002**: All specified invalid-content cases fail production validation.
- **SC-003**: One rendered Context Pack supports creation and update without outside project documents.
- **SC-004**: One verify command checks the foundation and generated routes without changing source.

## Assumptions

Personal Cookbook is a provisional display label. food-lab is a technical package name.
The existing MIT notice confirms the holder. No deployment domain is known.
Only unverified status is initially supported. Servings and times are estimates.
Recipe files use src/content/recipes/<slug>/index.md. Media and rich body markup are not supported.
The Markdown body is plain paragraphs for notes and known source attribution.
