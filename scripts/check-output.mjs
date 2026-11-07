import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
const missing = read("404.html");
assert.ok(catalog.includes(`${base}/recipes/hrechka-z-morkvoiu/`));
assert.ok(catalog.includes(`${base}/recipes/pasta-karbonara/`));
assert.ok(catalog.includes(`${base}/ai/recipe-authoring/`));
for (const text of [
  'id="recipe-search"',
  'data-filter="verified"',
  'data-filter="unverified"',
  'id="no-results"',
  'data-search="',
  'class="card-link"',
])
  assert.ok(catalog.includes(text), text);
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
    'class="image-placeholder hero-image"',
    "Ще не перевірено",
  ])
    assert.ok(recipe.includes(text), text);
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
for (const html of [catalog, ...recipes, guide, missing]) {
  assert.ok(!/<astro-island\b/.test(html), "No hydrated island");
  assert.ok(html.includes('class="theme-toggle"'), "Theme control");
  assert.ok(html.includes("cookbook-theme"), "Persistent theme script");
  assert.ok(html.includes(`${base}/`));
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g))
    assert.ok(url.startsWith(`${base}/`), `Subpath missing: ${url}`);
  assert.ok(
    !/(?:src|href)="https?:[^" ]+\.(?:png|jpg|webp|woff2?)/.test(html),
    "No external assets",
  );
}
console.log(
  `Generated output passed: catalog, recipe, guide, 404; base=${base || "/"}`,
);
