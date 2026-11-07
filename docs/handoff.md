# Foundation handoff

## Current feature

specs/001-project-foundation/spec.md. Foundation only. Personal Cookbook remains provisional.

## Task status

Completed: T001-T011. Pending foundation task IDs: None.
The authoritative task contracts are in specs/001-project-foundation/tasks.md.

## Verification

Passed: npm ci, npm run verify (zero diagnostics, lint, format, 30 tests, build, output checks),
repository-subpath build and output checks for /Food-Lab/, and four HTTP route checks.
npm audit reports zero vulnerabilities after the documented override.
T010 verified that a plain source URL with query and fragment text passes recipe parsing and stays unchanged.
A temporary build fixture confirmed that the recipe page escapes the URL query ampersand and does not create a link; the fixture was removed before final verification.
T011 added `src/content/recipes/pasta-karbonara/index.md` and five catalog entries. Production validation and generated-output checks confirm the recipe route and content.
The rendered Context Pack includes current build metadata, supported fields and values, current ingredient catalog, exact paths, separate create and update workflows, response sections, validation commands, privacy rules, and unsupported-operation rules. No insertion markers remain.
The preview server was stopped. Generated output and dependencies are ignored and untracked.
A scan of reviewable files found no credential patterns or machine-local absolute paths.
Failed checks remaining: None. An initial lint failure was fixed. An initial npm ci failed with
EPERM because preview held a native compiler file; it passed after the owned server stopped.
Browser preview returned: js execution timed out; kernel reset, rerun your request.
Browser visual, 320px layout, keyboard, and assistive-technology checks: Not run.
Static review found semantic landmarks, visible focus styles, 48px link targets, system fonts,
light/dark tokens, and reduced-motion rules. Text/background contrast calculations ranged from
5.60:1 to 14.81:1 for ink, muted, primary, and secondary colors. This is not a browser accessibility audit.
Offline/PWA checks: Not run. No offline feature is implemented.
Remote CI and deployment: Not run. No commits or pushes were created.

## Decisions and blockers

No blocking product decision. Final branding and deployment host/base path remain undecided.
The existing MIT license names Kyrylo Romanenko. It was preserved.
The CC BY 4.0 notice covers original content only. No licensing holder is unresolved.
No architecture research was supplied. New compatibility evidence is in the feature research.md.
The minimatch override is an explicit compatibility maintenance item. Remove it after upstream updates.

## Authoring contract

Version 1. Canonical source: docs/ai/recipe-authoring.md.
Copy the rendered /ai/recipe-authoring/ page, not the source with insertion markers.
Context build uses git rev-parse HEAD plus a dirty suffix, or unknown when unavailable.
This bootstrap build records 6c08f3976f020ef2a151453b1073f4a7ef5b982a-dirty.
That commit predates the uncommitted foundation; the pack does not claim exact reproducibility.
Public recipe discovery validates every Markdown file under src/content/recipes/ before collection storage.

## Exact next specification

After reviewing this foundation, use $speckit-specify for a bounded portion-scaling feature.
Inputs: .specify/memory/constitution.md, AGENTS.md, specs/001-project-foundation/spec.md,
specs/001-project-foundation/data-model.md, src/schemas/recipe.ts,
src/pages/recipes/[slug].astro, tests/content.test.ts, docs/ai/recipe-authoring.md.
Define pure scaling rules and rounding before adding a meaningful Preact island.
Do not add storage or unit conversion to that first scaling feature.
Cooking mode and session restoration should follow as separate bounded specifications.
PWA validation remains a required follow-up. Check compatibility before selecting a plugin.

## Local operation

Use npm ci, npm run verify, and npm run dev. Stop owned servers after testing.
On a fresh checkout, set SPECIFY_FEATURE_DIRECTORY=specs/001-project-foundation before resuming
Spec Kit checks. The installed workflow keeps .specify/feature.json local and ignored.

## Git review

The existing main branch and origin URL are unchanged. LICENSE has no diff.
README.md is modified. Foundation files and package-lock.json are new and unstaged.
No commit, push, deployment, or repository-setting change was made.
Suggested commit message: feat: bootstrap static cookbook and AI authoring contract.
