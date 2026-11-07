<!-- Sync impact: scaffold -> 1.0.0. Added all principles and governance. No deferred placeholders. -->

# Personal Cookbook Constitution

## Core Principles

### C01 Static architecture

The application MUST generate static HTML with Astro. TypeScript MUST use strict mode.
Interactive islands MUST use Preact only when behavior requires JavaScript.
The MVP MUST NOT use a backend, authentication, cloud sync, analytics, or a CMS.
Public recipes MUST remain in Git. Future private user data MUST remain in browser storage.

### C02 Content integrity

Recipe and ingredient IDs MUST be stable and independent of routes.
One authoritative schema MUST validate authored content, including nested objects.
Unknown fields, invalid references, duplicate IDs, and duplicate routes MUST fail the build.
Framework metadata MUST remain distinct from authored data.

### C03 Local reasoning

Code SHOULD remain near the page that uses it. Presentation code MAY be duplicated.
Shared code MUST enforce a domain rule, protect integrity, define a contract, or remove substantial complexity.
Code MUST use direct imports. Generic frameworks, factories, forwarding chains, barrel exports,
dependency injection containers, and speculative layers MUST NOT be added.
Portion calculations, conversions, aggregation, schemas, backup validation, and migrations
MUST each have one authoritative implementation when introduced.
Domain calculations MUST use pure TypeScript without framework, DOM, or storage imports.

### C04 Local data safety

Private notes, recipes, history, ratings, shopping data, credentials, and backups MUST NOT enter public Git or authoring context.
Future storage MUST use a small concrete module and tested migrations.
Future backup support MUST define a versioned contract and validate data before replacement.
These are future obligations, not implemented capabilities.

### C05 Kitchen access

Pages MUST be mobile-first and readable without client JavaScript.
Pages MUST use semantic HTML, visible focus, readable line lengths, and practical touch targets.
Pages MUST work at 320 CSS pixels without page-level horizontal scrolling.
Pages MUST respect color-scheme and reduced-motion preferences.
Accessibility claims MUST identify executed checks and their limits.

### C06 External AI boundary

External AI MUST receive a self-contained content contract.
Its output MUST remain untrusted until repository validation passes.
External AI MUST NOT change the contract to fit its output.
Private user data MUST NOT enter the public authoring context.
Unexecuted checks MUST NOT be reported as passed.

## Documentation

C07: Technical documentation, comments, and the AI guide MUST use English.
Product text and recipe content MUST use Ukrainian, except the provisional display label.
Documents SHOULD use short active sentences, explicit subjects, stable IDs, and one term per concept.
The project targets practical adoption of approximately 80% of an ASD-STE100-inspired style.
This is not measured or certified compliance.

## Development Workflow

C08: Spec Kit MUST remain the only task system. Each task MUST state its ID, goal, inputs,
allowed scope, requirements, checks, non-goals, and dependencies.
Agents MUST read inputs, make bounded changes, run checks, report failures, and stop when complete.
Agents MUST NOT refactor unrelated code, add future features, weaken checks, or disable strict types.
Dependencies MUST serve current requirements. Completion MUST follow deterministic verification.
Contract changes MUST update the AI guide and its example in the same task.

## Governance

The constitution takes precedence over feature specifications, plans, tasks, ADRs, research,
existing code, and assumptions, in that order. Lower sources MUST NOT override higher sources.
Changes MUST document their reason and impact. Incompatible rules require a major version;
new obligations require a minor version; clarifications require a patch version.
Each plan and completion review MUST check these principles.

**Version**: 1.0.0 | **Ratified**: 2026-11-07 | **Last Amended**: 2026-11-07
