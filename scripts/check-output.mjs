import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
const base = (process.argv[2] || process.env.BASE_PATH || "/").replace(
  /\/$/,
  "",
);
const read = (file) => readFileSync(`dist/${file}`, "utf8");
const catalog = read("index.html");
const recipes = [
  read("recipes/hrechka-z-morkvoiu/index.html"),
  read("recipes/pasta-karbonara/index.html"),
];
const guide = read("ai/recipe-authoring/index.html");
const designReference = read("ai/design-reference/index.html");
const shopping = read("shopping/index.html");
const favorites = read("favorites/index.html");
const missing = read("404.html");
assert.ok(catalog.includes(`${base}/recipes/hrechka-z-morkvoiu/`));
assert.ok(catalog.includes(`${base}/recipes/pasta-karbonara/`));
assert.ok(catalog.includes(`${base}/ai/recipe-authoring/`));
assert.ok(catalog.includes(`${base}/ai/design-reference/`));
for (const html of [catalog, shopping]) {
  for (const text of [
    'class="shopping-nav-link"',
    'class="shopping-count"',
    'title="Список покупок"',
  ])
    assert.ok(html.includes(text), text);
}
for (const html of [catalog, shopping, favorites])
  assert.ok(html.includes('class="favorites-nav-link"'));
for (const text of [
  "Улюблене",
  "Увімкніть JavaScript, щоб переглянути та керувати улюбленими рецептами.",
])
  assert.ok(favorites.includes(text), text);
for (const recipe of recipes)
  assert.ok(recipe.includes("data-favorite-button"));
assert.ok(catalog.includes("data-favorite-button"));
for (const text of [
  "Дизайн-референс для AI",
  'data-palette-choice="navy"',
  'data-palette-choice="green"',
  "JetBrains Mono",
  "npm run verify",
  "/Food-Lab/",
])
  assert.ok(designReference.includes(text), text);
for (const text of [
  'id="recipe-search"',
  'data-filter="verified"',
  'data-filter="unverified"',
  'id="no-results"',
  'data-search="',
  'class="card-link"',
])
  assert.ok(catalog.includes(text), text);
assert.ok(!catalog.includes('class="image-placeholder card-image"'));
for (const text of [
  'class="shopping-form"',
  'id="shopping-name"',
  'id="shopping-quantity"',
  'id="shopping-unit"',
  "Увімкніть JavaScript, щоб переглянути список і керувати ним.",
])
  assert.ok(shopping.includes(text), text);
for (const text of ["Гречка з морквою", "Промийте гречку", "за смаком"])
  assert.ok(recipes[0].includes(text), text);
for (const text of [
  "Паста карбонара",
  "Гуанчале",
  "пекоріно",
  "яєчну суміш",
  "Ще не перевірено",
])
  assert.ok(recipes[1].includes(text), text);
for (const recipe of recipes)
  for (const text of ["Інгредієнти", "Приготування"])
    assert.ok(recipe.includes(text), text);
for (const recipe of recipes)
  for (const text of [
    'class="ingredient-row"',
    'type="checkbox"',
    'id="ingredients"',
    'id="steps"',
    "підготовлено",
    "Ще не перевірено",
  ])
    assert.ok(recipe.includes(text), text);
for (const recipe of recipes)
  assert.ok(!recipe.includes('class="image-placeholder hero-image"'));
for (const text of [
  "Contract: recipe-authoring",
  "Contract version: 1",
  "Context build:",
  "recipe-create, recipe-update, ingredient-propose",
  "src/content/recipes/",
  "Create workflow",
  "Update workflow",
  "Required response format",
  "Repository validation and review",
  "Privacy and uncertainty",
  "Unsupported by the current contract.",
  "The page displays the URL as escaped text, not as a link.",
  "Context Pack — end",
  "recipe-buckwheat-carrot-001",
])
  assert.ok(guide.includes(text), text);
assert.match(guide, /Context build: (?:unknown|[a-f0-9]{40}(?:-dirty)?)/);
for (const item of JSON.parse(
  readFileSync("src/content/ingredients.json", "utf8"),
)) {
  assert.ok(guide.includes(item.id), item.id);
  assert.ok(guide.includes(item.name), item.name);
}
assert.ok(!/@@[A-Z_]+@@/.test(guide));
assert.match(shopping, /<astro-island\b[^>]*client="load"/);
assert.match(shopping, /<select\b[^>]*id="shopping-unit"/);
for (const unit of [
  'value="piece">шт.',
  'value="g">г',
  'value="kg">кг',
  'value="ml">мл',
  'value="l">л',
])
  assert.ok(shopping.includes(unit), `Missing shopping unit option: ${unit}`);
assert.match(catalog, /<astro-island\b[^>]*client="load"/);
for (const html of [guide, designReference, missing]) {
  assert.ok(
    !/<astro-island\b/.test(html),
    "No recipe island outside recipe pages",
  );
  assert.ok(html.includes('class="theme-toggle"'), "Theme control");
  assert.ok(html.includes("cookbook-theme"), "Persistent theme script");
  assert.ok(html.includes(`${base}/design-kit/fonts.css`), "Local font CSS");
  assert.ok(html.includes(`${base}/design-kit/tokens.css`), "Design tokens");
  assert.ok(html.includes(`${base}/`));
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g))
    assert.ok(url.startsWith(`${base}/`), `Subpath missing: ${url}`);
  assert.ok(
    !/(?:src|href)="https?:[^" ]+\.(?:png|jpg|webp|woff2?)/.test(html),
    "No external assets",
  );
}
for (const recipe of recipes) {
  assert.match(recipe, /<astro-island\b[^>]*client="only"/);
  assert.ok(recipe.includes('id="static-ingredients"'));
  assert.ok(recipe.includes("data-recipe-add-whole"));
  assert.ok(recipe.includes('title="ДОДАТИ ВЕСЬ РЕЦЕПТ ДО СПИСКУ"'));
  assert.ok(!recipe.includes('class="calculator-toolbar"'));
  assert.ok(!recipe.includes('class="calculator-mode-button"'));
}
const fontCss = read("design-kit/fonts.css");
assert.ok(read("design-kit/tokens.css").includes("--mono"));
const fonts = [...fontCss.matchAll(/url\(["']\.\/fonts\/([^"']+)["']\)/g)];
assert.equal(fonts.length, 10, "All local font subsets are referenced");
for (const [, file] of fonts) {
  assert.ok(
    existsSync(`dist/design-kit/fonts/${file}`),
    `Missing font: ${file}`,
  );
}
console.log(
  `Generated output passed: catalog, recipe, guide, 404; base=${base || "/"}`,
);
