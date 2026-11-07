# Foundation handoff

## Current feature: ingredient calculator

Feature artifacts: `specs/002-ingredient-calculator/`. Tasks T001-T010 are complete.
The recipe schema, recipe data, routes, and AI authoring contract remain unchanged. The recipe page
now has a portion stepper, labeled calculator mode and reset controls, ingredient amount inputs,
aligned quantity columns, anchor feedback, status, validation, and per-recipe local storage. The
toolbar has no instructional hint row. Controls use inline SVG icons, visible Ukrainian labels,
and accessible names. Static pages keep the original ingredient list; calculator controls mount
only in the client-side island.

`npm run verify` passed: zero Astro diagnostics, lint and format checks, 60 tests, static build, and
generated-output checks. A separate build with `BASE_PATH=/Food-Lab/` and output check passed.
The browser preview confirmed the portions stepper/status/reset/mode controls share one toolbar row
at the available desktop width, amount fields align, and the hint row is absent. It also confirmed
the buckwheat examples: carrot 60 gives 80 g grain, 175 ml water, and 1 portion; water 700 then
gives 320 g grain, 240 g carrot, and 4 portions. Reload restored the saved carrot calculation;
reset restored original amounts and removed that calculation. The browser was left with original
values and calculator mode closed.

The browser was checked in its available default viewport and dark navy theme. Separate 360px,
768px, and 1280px checks were not run. Light theme, green palette, hover/focus/active states,
keyboard Enter, virtual keyboard visibility, storage-blocked behavior, invalid browser inputs, and
recipe-to-recipe storage isolation were not exercised in the browser. Pure tests cover accepted
decimal and fraction input, invalid values, factor limits, number formatting, portions plural forms,
and saved-state validation. Token contrast checks cover all four theme/palette pairs; no token
changes were required. The AI authoring guide did not change because the authored recipe contract
did not change.

T008 follow-up from the 360px review: ingredient names now use word wrapping with a separate
amount row under the name. The amount editor reserves its apply-button column, and the previous
amount and validation message align under that row. The status wraps instead of truncating. Mode
and reset controls have visible Ukrainian labels. Step markers use a max-content nowrap column.
`npm run verify` passed again with 60 tests and zero Astro diagnostics. The available browser view
confirmed visible labels and unchanged wide-screen alignment, but it could not be resized to an
exact 360px viewport after the CSS change. That narrow visual check remains unverified.

T009 fixes amount drift across rows and states. The anchor badge now sits beside the ingredient
name and does not participate in amount-column sizing. Static quantity/unit display and calculator
inputs use the same fixed columns, including a reserved apply-button slot. The browser preview
confirmed that anchor and non-anchor rows share the same amount/unit positions, and changing a draft
shows the apply button without moving the field or unit. The test state was reset afterward.
`npm run verify` passed again with 60 tests and zero Astro diagnostics. Exact 360px visual testing
remains unverified.

T010 left-aligns static unit labels in their fixed grid cell and shares the edit view's muted color
and font. The browser preview confirmed matching unit starts and colors for `г`, `мл`, and `ст. л.`
in both modes; font equality is provided by the shared `.amount-unit` rule. Exact 360px visual
testing remains unverified. `npm run verify` passed with zero Astro diagnostics, clean lint and
formatting, 60 passing tests, a static build, and generated-output checks after the font update.

## Current feature

specs/001-project-foundation/spec.md. Foundation only. Personal Cookbook remains provisional.

## Task status

Completed: T001-T018. Pending foundation task IDs: None.
The authoritative task contracts are in specs/001-project-foundation/tasks.md.

## Verification

T018 removes separator dots from the two-digit recipe step numbers. The change applies to the
recipe pages and the AI design reference example.

T017 places section-style step numbers in a fixed column and restores 20px sans-serif step
text in a separate column. The AI design reference example uses the same structure. Recipe
content and step IDs are unchanged.
`npm run verify` passed Astro, lint, and formatting checks but stopped at one existing
calculator test: `factorFromAmount(160, 1)` returned `null` while the test expects `0.1`.
This calculator failure is outside T017. The build and output checks did not run in that attempt.
`npm run build` passed separately and generated both recipe routes and the design reference.

T016 replaces circular recipe step numbers with `01 ·` section-style numbers. Recipe steps and
the AI design reference example use the same 24px monospace heading style. Recipe content, step
IDs, fonts, tokens, and palettes are unchanged.
`npm run verify` passed: zero Astro diagnostics, lint, formatting, 56 tests, static build, and
output checks. The generated recipe and design reference pages contain the updated step styles.
Browser visual inspection was not run for this typography change.

T015 adds `/ai/design-reference/` with visual examples and an interactive navy/green sample
palette switch. The footer links to it. Its guidance covers fonts, tokens, themes, accessibility,
responsive layouts, content integrity, base path, and verification workflow.

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

## Next specification

No next product feature is approved. The ingredient calculator is specified in
`specs/002-ingredient-calculator/`; it includes portion scaling and per-recipe local restoration.
Write a separate Spec Kit specification for any new product scope. PWA validation remains a
follow-up. Check compatibility before selecting a plugin.

## Local operation

Use npm ci, npm run verify, and npm run dev. Stop owned servers after testing.
On a fresh checkout, set SPECIFY_FEATURE_DIRECTORY=specs/001-project-foundation before resuming
Spec Kit checks. The installed workflow keeps .specify/feature.json local and ignored.

## Git review

The existing main branch and origin URL are unchanged. LICENSE has no diff.
README.md is modified. Foundation files and package-lock.json are new and unstaged.
No commit, push, deployment, or repository-setting change was made.
Suggested commit message: feat: bootstrap static cookbook and AI authoring contract.
