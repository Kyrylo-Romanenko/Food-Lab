# Recipe authoring

Copy the complete Context Pack below into an external AI conversation.
The rendered page includes build-time inserts. The Markdown source alone is not a complete pack.
The AI creates recipe content, not Astro pages. Review all output before applying it.

## Context Pack — start

```text
@@METADATA@@
```

### Scope and trust

You MUST use this contract without requiring repository access or other project documents.
You MAY create a recipe, update a supplied recipe, or propose an ingredient entry.
You MUST NOT change schemas, enums, units, routes, dependencies, configuration, application code, or licensing.
For an unsupported request, respond: "Unsupported by the current contract."
Your output is untrusted until repository validation passes.

The contract version identifies compatibility. Maintainers MUST increase it for incompatible changes.
Context build comes from the source Git commit, with a dirty suffix for uncommitted changes.
It is unknown when Git metadata is unavailable. It is never a timestamp.
Uncommitted changes can make the pack differ from its recorded commit.
A dirty build does not claim exact reproducibility. An old pack may have an old catalog.
Repository validation remains authoritative.
Repeat contract version and context build in response metadata, outside recipe frontmatter.

### Files and routes

Create `src/content/recipes/<slug>/index.md` with YAML frontmatter and an optional plain-text body.
The slug MUST match `[a-z0-9]+(-[a-z0-9]+)*` and MUST be unique in the repository.
The route is `/recipes/<slug>/`, prefixed by the deployment base path when configured.
Do not invent a production domain. Do not create a route file or edit navigation.
The build discovers every Markdown recipe under `src/content/recipes/` automatically.
Unsupported paths fail validation. A valid file appears in the catalog after a successful build.

### Structured fields

All fields below are required. No other frontmatter fields are supported.
All objects, including nested objects, reject unknown fields.
Required strings MUST contain non-whitespace characters. Numeric values MUST be finite.
Recipe text MUST use Ukrainian. Code identifiers MUST remain unchanged.

- `id`: stable recipe ID matching `[a-z0-9]+(-[a-z0-9]+)*`. It MUST be unique across recipes.
  It MUST remain independent of the slug. Do not change it during updates.
- `title`: nonempty dish title.
- `description`: nonempty concise summary.
- `category`: one allowed category below.
- `tags`: an array of nonempty strings. An empty array is allowed.
- `difficulty`: one allowed difficulty below.
- `status`: one allowed status below. Only unverified is supported.
- `servings`: positive integer base portion count. Mark unverified estimates in the body and response.
- `time`: strict object with `prep` and `cook`, each a non-negative integer in minutes.
  These values are estimates until tested. Do not add total or verification fields.
- `ingredients`: nonempty array of strict objects with `ingredientId` and `amount`.
  `ingredientId` MUST reference the catalog below.
- `amount`: one of two strict objects. A measured amount has `kind: measured`,
  positive numeric `quantity`, and a supported `unit`. A to-taste amount has only `kind: to-taste`.
  Ranges, fractions as strings, aliases, density conversion, and extra amount fields are unsupported.
- `steps`: nonempty ordered array of strict objects with `id` and `text`.
  Step `id` MUST match the same ID pattern and MUST be unique within the recipe.
  Preserve IDs for steps that remain the same. New steps receive new IDs.
  Step `text` is a nonempty Ukrainian instruction.

@@ENUMS@@

Unit meanings: g = gram; kg = kilogram; ml = millilitre; l = litre;
tsp = teaspoon; tbsp = tablespoon; piece = count. No unit conversion is implemented.
Categories are identifiers: breakfast, main dish, side dish, soup, salad, dessert, in the order listed.
Difficulty identifiers mean easy, medium, and hard. They are not test claims.

### Current ingredient catalog

@@CATALOG@@

Reuse an ID when the ingredient matches. Do not rename existing IDs.
Do not invent existing IDs or add aliases. If no match exists, propose a new strict `{id, name}` entry.
The name MUST be nonempty Ukrainian text. The ID MUST follow the stable ID pattern.
Propose a bounded addition to `src/content/ingredients.json`. Do not replace the full catalog.
New references fail validation until the maintainer accepts the proposed entries.
Do not assume the catalog is still current after this pack was copied.

### Body, sources, and media

The body MAY contain plain paragraphs for notes, estimates, and known source attribution.
Known attribution MAY include a plain URL. The page displays the URL as escaped text, not as a link.
Do not use HTML, Markdown links or formatting, images, lists, or executable content.
Outside plain URLs, the body MUST NOT contain angle brackets, square brackets, backticks,
asterisks, underscores, hash marks, or exclamation marks. Do not start a line with a list marker.
Use original wording. Preserve known attribution in supplied content. Never invent a source.
Media fields and embedded media are unsupported. No image is required.
Expected media paths: None. Future media may be colocated only after a contract change.
Do not supply third-party media without reuse rights. Do not modify licensing.

### Complete valid example

Path: `src/content/recipes/hrechka-z-morkvoiu/index.md`.
Route: `/recipes/hrechka-z-morkvoiu/` before any deployment base path.
This example already exists. Do not reuse its ID or slug for a new recipe.

<!-- EXAMPLE:START -->

```markdown
---
id: recipe-buckwheat-carrot-001
title: Гречка з морквою
description: Проста гречана каша з м’якою морквою для спокійного домашнього обіду.
category: main
tags:
  - крупи
  - без м’яса
difficulty: easy
status: unverified
servings: 2
time:
  prep: 10
  cook: 25
ingredients:
  - ingredientId: buckwheat
    amount:
      kind: measured
      quantity: 160
      unit: g
  - ingredientId: carrot
    amount:
      kind: measured
      quantity: 120
      unit: g
  - ingredientId: water
    amount:
      kind: measured
      quantity: 350
      unit: ml
  - ingredientId: sunflower-oil
    amount:
      kind: measured
      quantity: 1
      unit: tbsp
  - ingredientId: salt
    amount:
      kind: to-taste
steps:
  - id: rinse
    text: Промийте гречку та дайте воді стекти. Очистьте моркву й натріть її на грубій тертці.
  - id: soften
    text: Нагрійте олію в невеликій каструлі. Додайте моркву й готуйте на помірному вогні приблизно 4 хвилини, помішуючи.
  - id: simmer
    text: Додайте гречку, воду та сіль. Доведіть до кипіння, накрийте кришкою й варіть на слабкому вогні приблизно 18 хвилин, до м’якості крупи. За потреби додайте трохи гарячої води.
  - id: rest
    text: Зніміть каструлю з вогню. Залиште під кришкою на 3 хвилини, потім обережно перемішайте.
---

Рецепт ще не перевірено приготуванням. Час і кількість порцій є орієнтовними. Перевіряйте готовність крупи перед подаванням.
```

<!-- EXAMPLE:END -->

### Create workflow

1. Receive this current Context Pack, the dish description, and optional source material.
2. Use only supported fields and original Ukrainian wording.
3. Reuse matching ingredient IDs. Propose missing entries separately.
4. Propose a stable recipe ID and slug. Do not claim global uniqueness without repository checks.
5. Return a complete Markdown file, its exact repository-relative path, and expected route.
6. State assumptions, estimated servings and times, and required validation.
7. Keep status unverified. Do not invent ratings, cooking history, test results, or source attribution.

### Update workflow

Receive this Context Pack, the complete current recipe file, and the requested changes.
Receive relevant catalog entries if this pack lacks them.
Without the current file, request it. Do not reconstruct an update from memory.
Return the complete updated file for a small recipe.
Preserve the recipe ID, unchanged content, known attribution, and metadata unless the request requires a change.
Preserve step IDs where the same steps remain.
Do not move the file or rename its slug without an explicit request. Report any proposed route change.
Do not extend the contract to make the update fit.

### Required response format

Use all eight numbered sections. If a section has no changes, state "None".

1. **Contract metadata**: Repeat contract version and context build from this pack.
2. **Files to create**: Give each exact repository-relative path and complete file content.
3. **Files to update**: Give the exact path and complete updated recipe when applicable.
   Give an exact proposed catalog entry or bounded addition. Do not replace unrelated content.
4. **Ingredients**: Separate existing IDs used, proposed entries, and repository checks required.
   If no new ingredients are needed, state "None".
5. **Media**: Give expected paths and attribution requirements, or "None".
6. **Expected route**: Derive it from the path and trailing-slash rule. Do not invent a domain.
7. **Validation**: List exact commands, checks requiring repository access, and checks not executed.
8. **Assumptions and unverified items**: List missing information, proposed defaults, estimates,
   unsupported requests, and any uncertainty.

### Repository validation and review

The maintainer MUST run these commands from the repository root:

```sh
npm ci
npm run verify
npm run dev
```

`npm run verify` runs type/Astro checks, lint, formatting checks, production-code unit tests,
the production build, and generated-output checks. It does not modify source files.
If a formatting check fails, the maintainer MAY run `npm run format`, review the changes, and rerun verify.
Use the local address printed by dev to preview the catalog, recipe, and guide. Stop dev after review.
Repository checks MUST confirm IDs, routes, current catalog references, fields, and the complete build.
The AI MUST report these checks as "Not run" unless it actually executed them in the repository.
AI self-review is not a substitute for validation. Do not claim deployment or successful execution without evidence.

Workflow: Context Pack -> External AI output -> Repository validation -> Local preview -> Review -> Commit.
Only a human-approved contribution should be committed. No automatic application is supported.

### Privacy and uncertainty

The public pack MUST NOT contain local notes, cooking history, ratings, shopping data, private recipes,
backups, browser storage exports, credentials, or other private data.
Private context may be supplied separately by the user. Do not export it automatically or copy it into public content.
Do not claim tested outcomes for an untested recipe. State estimates and missing facts explicitly.
Unsupported fields remain unsupported even when useful. Repository validation is authoritative.

## Context Pack — end
