# Foundation handoff

## Current feature

specs/001-project-foundation/spec.md. Foundation only. Personal Cookbook remains provisional.

## Task status

Completed: T001-T014. Pending foundation task IDs: None.
The authoritative task contracts are in specs/001-project-foundation/tasks.md.

## Verification

T014: Theme button displays sun, moon, and half-moon SVGs for light, dark, and automatic modes.
Its Ukrainian label and tooltip name the active mode. Missing hero images use a 136px strip;
placeholder captions are visually hidden, and the emoji has no opacity treatment. Prep and cook
values use the same plain monospace style. The verification badge sits below the recipe title.
Header, main, and footer share the 960px container and inner padding. The recipe reading column
keeps the shared left edge. The footer divider is inset to the content width and its link is 13px
and muted. Theme tokens, fonts, and palette values were not changed.
`npm run verify` passed: zero Astro diagnostics, lint, formatting, 30 tests, static build, and
output checks. The `/Food-Lab/` build and output check passed. An Edge screenshot shows the recipe
page with the compact placeholder, aligned reading edge, and consistent metadata at 1280px.
The Edge window ignored requested dimensions for the catalog screenshots, so 360px and 768px
catalog layouts were not confirmed. Theme/palette combinations and hover, active, and focus states
were reviewed in CSS but not exercised in a browser. Browser automation was unavailable.
No commit, push, or deployment occurred.

T013 design kit: The provided local Inter and JetBrains Mono subsets, font licenses, and
navy/green tokens are in `public/design-kit/`. Dark navy is rendered by default. The header
cycles dark, light, and automatic themes. A saved preference is restored before styles paint.
The new `--control-border` token raises control outline contrast to at least 3:1 in all four
theme/palette combinations. `docs/design-system.md` records numeric text and control contrast.
The recipe data, schema, routes, search logic, and authoring guide contract did not change.
`npm run verify` passed with zero Astro diagnostics, lint, format, 30 tests, build, and output checks.
The `/Food-Lab/` build and output checks passed. HTTP preview returned 200 for the catalog,
both recipes, the design CSS, and sampled Inter and JetBrains Mono files. Headless Edge screenshots
showed the dark catalog at 500px and 768px and the pasta page at 1280px. A 360px screenshot was
cropped because this Edge invocation used a wider minimum layout viewport. Actual 320px/360px
layout, light/green visual states, keyboard flow, theme persistence, and search/filter behavior
were not verified in a browser. CUA browser initialization timed out; a CDP attempt was unavailable.
The owned preview server was stopped. No commit, push, or deployment occurred.

T012 design system: `npm run verify` passed with zero Astro diagnostics, lint and format checks,
30 tests, static build, and generated-output checks. A separate `/Food-Lab/` build and output check passed.
HTTP preview returned 200 for the catalog, both recipe pages, and the AI guide under `/Food-Lab/`.
The owned preview server was stopped. Browser automation timed out before opening the preview.
Search, filters, theme switching and persistence, keyboard flow, console output, and 320px layout
were reviewed in source but not verified in a browser. The generated-output check now asserts the
search/filter controls, card links, ingredient checkboxes, placeholders, and theme control.
The current content contract has no image field and only permits `unverified`. Neutral image
placeholders are shown. The verified filter has a valid empty state. No recipe contract changed.
The older foundation spec excluded search and storage from that foundation task. The later T012
design request explicitly adds catalog search and one local theme preference without changing
recipe storage or the content contract. No deployment or push occurred.

Earlier foundation verification follows.

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
