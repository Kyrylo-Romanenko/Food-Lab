## Shopping-list corrections (2026-11-10)

The shopping row has a visible delete button for every source, including recipe ingredients. Deleting
a row removes its recipe snapshots and independent contributions for that row; Undo restores them
without replacing unrelated state. Measured row quantities can be edited in the row menu and persist
as validated v2 overrides. A source-quantity change clears the override and resets the cart row.
The row places the edit control before the delete control in both visual and keyboard order.
At-home stock no longer affects totals or appears in the interface. Existing v2 stock fields remain
validated and preserved for compatibility.

Copy and copy-link first use the browser Clipboard API. If access is unavailable, the page shows a
selectable text field with the list or link. Browser review on the isolated `localhost` origin added
a synthetic 500 g item, edited it to 350 g, confirmed 350 g after reload, deleted it, restored it
with Undo, and deleted it again. The test list returned to its empty state. The user's
`127.0.0.1` list and operating-system clipboard were not read or changed.

`npm run verify` and the `/Food-Lab/` build/output check passed after these changes. The copy and
copy-link browser actions were not run because they would write synthetic data to the user's system
clipboard. Their clipboard failure fallback was reviewed in code. Responsive layout at 320 CSS
pixels was not rechecked after adding the row delete control; the earlier T045 review covered the
prior row layout. Browser storage failure and JavaScript-disabled behavior also remain unverified.

## Completed feature: favorite recipes (2026-11-10)

Feature tasks T001–T014 in `specs/006-favorite-recipes/tasks.md` are complete. The catalog and
recipe pages have favorite controls. The header shows the saved count, and `/favorites/` lists
saved recipes. Users can remove one recipe, confirm clearing the list, and explicitly share or
import a validated list. Browser storage uses a strict versioned envelope; malformed or failed
storage operations do not report success. Static output includes no-JavaScript guidance. The
recipe contract and AI authoring guide did not change.

The feature tests cover validation, unique add/remove/clear/merge behavior, URL fragment round trips,
malformed and oversized fragments, storage failures, read-back validation, and same-tab and
cross-tab updates. Browser review confirmed adding favorites from the catalog and recipe page,
header count updates, saved recipe links, removal, confirmed import, rejection of an unknown recipe
ID, clearing, 320/390/1280 CSS pixel layouts, both themes, keyboard focus, accessible names, and no
horizontal overflow. Synthetic data was removed from the isolated `localhost` origin. The user's
`127.0.0.1` shopping list was not opened or changed.

Browser cancellation of share and clear confirmations, the storage-failure UI, and an actual
JavaScript-disabled browser session were not verified. The clear confirmation was accepted during
the browser review. `npm run verify` passed: Astro check found zero diagnostics, lint and format
checks passed, all 91 tests passed, the static build produced nine pages, and generated-output checks
passed. The separate `/Food-Lab/` build and output check also passed.

## Recipe sharing and serving variations (2026-11-10)

The recipe page shows each serving option in its own bordered card. Recipe notes use `Варіант: <title>` paragraphs to start a card; following paragraphs stay grouped under that option. Multiple cards form a horizontal scroll-snap carousel with a visible next-card edge on narrow screens; a single option uses the full width. The recipe title row has a share icon. It uses the browser share sheet when available and copies the current recipe URL otherwise, with a status message for the copy result. Astro check, lint, formatting, all 84 tests, static build and generated-output checks passed after these changes. Browser review confirmed both serving cards and the share button render on the local recipe page. The share action itself was not activated in the browser.

## Current shopping-list implementation update (2026-11-10)

Feature tasks T031–T046 are complete. T045 is complete after responsive browser review at 320, 390,
and 1280 CSS pixels using a synthetic item on the isolated `localhost` origin. The page had no
horizontal overflow at any width. At mobile widths the product field uses the full row, with quantity
and unit fields on the next line. A long synthetic name wrapped without clipping. At 320 px the
checkbox measured 24×24 px inside a 156×162 px clickable label, the row action measured 44×44 px,
and the home-stock input was 44 px high. Both themes rendered. Keyboard navigation reached the product
field and showed a 3 px focus outline. The synthetic item and local test storage were removed after
review.

The shopping domain tests now cover recipe snapshots with independent portions, to-taste rows,
shared-ingredient aggregation and source breakdown, duplicate recipe IDs, stock subtraction and
reversal, cart reset after changed needs, and imported identity collisions. A cart reset now keeps
the purchased state of a newly imported row when its identity was remapped. The storage tests cover
legacy-array and v2-envelope validation, malformed imports, and non-destructive merge behavior.
Browser import checks confirmed that canceling a v1 import leaves the list empty, confirming the v1
import adds its legacy row, and confirming a v2 import adds its item. Copy-link sharing and clear/
undo were reviewed in code but were not run in the browser.

Manual product entry uses a unit select with five common choices: `шт.`, `г`, `кг`, `мл` and `л`.
The default is `шт.`. Generated-output checks assert the select and all five options. The browser
confirmed that a manual amount of 1 kg is normalized to 1,000 g in the shopping row.

The shopping icon in the header now has a hover title, an accessible name, and a badge with the
aggregated row count. Recipe additions and list edits announce state changes so the badge updates in
the current tab. List copy/share actions use one compact icon row; clear is separated and retains a
confirmation prompt. Recipe content is centered, and the whole-recipe action is an icon beside the
title with a descriptive tooltip. Shopping rows keep source text below the item name, align amount,
home stock and a collapsed action menu in one row where space permits, and move home stock below the
main line at very narrow widths. The empty-state card uses the full form width.

Browser review confirmed the header badge updated to nine aggregate rows after adding a test recipe,
the compact row and expanded manual-action menu render correctly, and the empty state matches the form width. All temporary
checks used the isolated `localhost` origin and were removed; the saved list at `127.0.0.1` was not
changed. The local dev server remains available on port 4321.

`npm run verify` passed: Astro check reported 27 files with zero errors, warnings or hints; lint and
format checks passed; all 84 tests passed; the static build and generated-output check passed. A
separate build with `BASE_PATH=/Food-Lab/` and `node scripts/check-output.mjs /Food-Lab/` passed.

The local synthetic browser run added a 500 g manual item, recorded 200 g at home, showed 300 g to
buy, marked it in the cart, and retained both the stock and cart state after reload. It then added
the buckwheat recipe at two portions, changed the recipe-page calculator to three portions, and
confirmed the shopping list still showed the saved two-portion snapshot. The test recipe and manual
item were removed, and the list returned to its empty state. Unit tests cover shared totals from two
recipes; the browser did not run that exact two-recipe case. No private list data was opened or used.

The full quickstart was not completed. Browser storage migration, blocked-storage and quota-error
flows, and JavaScript-disabled behavior remain unverified. T045 completed the 320, 390, and 1280 CSS-
pixel, long-label, and hit-area review for the previous shopping-row layout. This task did not repeat
the 320-pixel check after the later row-action change.

## Completed tasks: T022–T029 shopping list

The approved shopping-list feature uses v2 browser storage. Valid v1 entries migrate as separate
legacy contributions. The v1 key remains as recovery data, and migration never invents selected
recipes. Invalid input and failed writes do not replace stored values. Every v2 write passes strict
validation and read-back comparison.

Recipe pages add either a whole recipe snapshot or one ingredient, including to-taste ingredients.
List portions remain independent from the recipe calculator. The list groups compatible measured
contributions by stable ingredient ID, shows source details, supports manual products, available-at-
home amounts, and a reversible cart. Manual, legacy, individual, and recipe sources can be removed.
Share and import actions are explicit. The static shopping page includes a no-JavaScript message.
The recipe contract and AI authoring guide did not change.

`npm run verify` passed: Astro diagnostics, lint, formatting, 75 tests, static build, and generated-
output checks. The `/Food-Lab/` build and `node scripts/check-output.mjs /Food-Lab/` passed. A local
synthetic browser flow confirmed recipe addition, independent portions, 500 g needed minus 200 g at
home equals 300 g, and cart marking. The browser used a separate port and disposable profile.

The browser viewport could not be set to exact 320, 390, or 1280 CSS pixels through the connected
controls. Those visual widths, light theme, keyboard-only use, JavaScript-disabled behavior, and
malformed storage in a browser remain unverified. Domain tests cover two-recipe aggregation and source
breakdown. The dev server reported a hydration warning during inspection; the component now renders
a stable status element and detects Web Share after hydration. This final fix was not rechecked in a
browser. No real saved list was opened or changed.

## Completed task: T030 kitchen-use refinements

T030 removes missing-image areas from recipe and catalog pages. Recipe pages now include section
jump links, explicit preparation-checkbox context, 48px checkbox hit areas, labeled calculator and
portion controls, and compact ingredient rows. The pasta sauce sequence is split into two steps.
The catalog keeps search, status filters, and no-result feedback. The shopping page has persistent
field labels, a concise empty state, separated conditional action groups, and localized unit labels.

Recipe additions now write through `src/lib/shopping-storage.ts` to the existing v1 local key and
item format before navigation. Repeat additions merge compatible measured amounts, and the recipe
page confirms both the addition and repeat behavior. Ingredients without measured amounts cannot
be added through the measured action. Malformed or inaccessible saved data is not overwritten.
The recipe schema and AI authoring contract did not change.

`npm run verify` passed: 26 Astro files had zero diagnostics; lint and formatting passed; 63 tests
passed; the static build and generated-output checks passed. The first full run stopped at the
pre-existing `src/layouts/Base.astro` formatting warning. Prettier formatted that file. The next
run exposed an output-check rule that also rejected the intended shopping-list island; the check
now allows that island and still rejects islands on the catalog and reference pages. The final
full run passed.

Browser review used the local preview. At 320x780, the recipe had no horizontal overflow, showed
two complete ingredient rows, and each checkbox label measured at least 48px. At 390x844, it showed
four complete rows. At 1280x900, the recipe had no horizontal overflow and both jump links were
present. The catalog search showed its no-result message; the unverified filter showed 3 recipes
and the verified filter showed 0. The shopping flow added buckwheat twice, showed 320 г, marked it
purchased, and removed the synthetic item. The list was empty after cleanup. A full assistive-
technology review, browser-console review, and an actual browser session with JavaScript disabled
were not run. The generated static output still contains the recipe fallback list.

At T030 completion, the broader shopping-list proposal in T022–T029 remained pending. The later
approved work in T022–T029 adds list-specific portions, stock tracking, and v2 migration.

## Documentation task: reconcile feature scope

T021 amends the foundation specification and plan to limit their feature exclusions to the
original delivery. The approved calculator remains a separate feature. A shopping-list feature
requires its own approved specification. This task does not implement shopping behavior or change
the recipe contract. `npm run verify` passed Astro check and lint but stopped at the format check:
`src/layouts/Base.astro` has formatting differences in parallel work. The file was not changed by
T021. Separate `npm run test:run` passed 62 tests, `npm run build` passed, and
`node scripts/check-output.mjs` passed. No browser or accessibility review was run.

## Documentation task: kitchen-use guidance

T020 records proposed kitchen-use rules, a bounded draft specification, and source conflicts.
It does not change product behavior, the recipe contract, or the AI authoring guide. The rules
describe target behavior; current compliance has not been established. `npm run verify` passed: Astro check, lint, formatting, 60 tests, static build, and output checks.
The first run stopped at formatting; the documented files were formatted before the passing run.
No browser or accessibility checks were run for this documentation task.

# Foundation handoff

## Completed task: chicken and mushroom julienne

T019 adds `Жульєн з куркою та печерицями` at six base servings and adds the required ingredient IDs to the public catalog. The authored body uses plain paragraphs accepted by contract v1. The existing detail page recognizes the `Варіанти подавання` paragraph as a section boundary and renders a separate heading. The calculation baseline contains no cheese or tartlets. Sour cream, broth, and butter use the midpoints 225 g, 125 ml, and 25 g because the strict contract does not support numeric ranges. Oil, salt, and black pepper use the existing to-taste amount.

`npm run verify` passed after implementation: Astro check, lint, formatting, 60 tests, static build, and generated-output checks. The local page rendered with its missing-image placeholder. Browser checks confirmed 3 servings (250 g chicken, 250 g mushrooms, 1½ onions), 6 servings (the base values), and 12 servings (1,000 g chicken, 1,000 g mushrooms, 6 onions). The 12-serving state was reset. The catalog linked to the recipe, and the recipe navigation returned to the catalog. The separate serving-variations heading and its content remained visible while the calculator changed servings.

The browser screenshot showed the available desktop layout. A mobile-width viewport could not be set through the connected browser controls. Browser console inspection was unavailable. The local route returned 200, but the browser requested the repository's missing `/favicon.ico` and received 404. The production build and generated-output checks passed. Mobile layout and browser-console inspection remain unverified. No other recipes or global styles changed.

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

## Feature context

The foundation is in `specs/001-project-foundation/`. The completed calculator work is in
`specs/002-ingredient-calculator/`. Favorites is in `specs/006-favorite-recipes/`. Personal
Cookbook remains provisional.

## Task status

Completed foundation tasks: T001-T030 and T048-T050. Pending foundation task IDs: None. Feature-local
Favorites tasks T001-T014 and shopping-list tasks T031-T048 are complete.
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

The kitchen-reading draft is `specs/003-kitchen-reading/spec.md`; T030 implements the requested
subset and its remaining checklist records open review criteria. The shopping-list feature in
`specs/004-shopping-list/` is approved and implemented by T022–T029 with row-action and quantity
editing corrections in T049. Selected recipe portions stay independent from later recipe-page
calculator changes.

The 2026-11-10 foundation amendment resolves the scope conflict with the approved calculator:
foundation FR-004 and FR-010 exclusions apply to the original foundation delivery, not separately
specified features. The original plan has the same scope clarification. The constitution remains
binding. PWA validation remains a follow-up.

## Local operation

Use npm ci, npm run verify, and npm run dev. Stop owned servers after testing.
On a fresh checkout, set SPECIFY_FEATURE_DIRECTORY=specs/001-project-foundation before resuming
Spec Kit checks. The installed workflow keeps .specify/feature.json local and ignored.

## Git review

The existing main branch and origin URL are unchanged. LICENSE has no diff.
README.md is modified. Foundation files and package-lock.json are new and unstaged.
No commit, push, deployment, or repository-setting change was made.
Suggested commit message: feat: bootstrap static cookbook and AI authoring contract.
