import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  discoverRecipes,
  parseRecipe,
  validateRecipes,
} from "../src/lib/content";
import { catalogSchema, recipeSchema } from "../src/schemas/recipe";
import catalog from "../src/content/ingredients.json";

const file = "src/content/recipes/hrechka-z-morkvoiu/index.md";
const example = () => parseRecipe(readFileSync(file, "utf8"), file);
const carbonaraFile = "src/content/recipes/pasta-karbonara/index.md";
const carbonaraExample = () =>
  parseRecipe(readFileSync(carbonaraFile, "utf8"), carbonaraFile);

describe("production content validation", () => {
  it("accepts and discovers the public recipe", () => {
    expect(validateRecipes([example()], catalog)).toHaveLength(1);
    expect(validateRecipes([carbonaraExample()], catalog)).toHaveLength(1);
    expect(discoverRecipes().map((r) => r.slug)).toEqual(
      expect.arrayContaining(["hrechka-z-morkvoiu", "pasta-karbonara"]),
    );
  });
  it.each([
    [
      "blank title",
      (r: ReturnType<typeof example>["data"]) => {
        r.title = " ";
      },
    ],
    [
      "fractional servings",
      (r) => {
        r.servings = 1.5;
      },
    ],
    [
      "invalid status",
      (r) => {
        Object.assign(r, { status: "verified" });
      },
    ],
    [
      "infinite quantity",
      (r) => {
        Object.assign(r.ingredients[0].amount, { quantity: Infinity });
      },
    ],
    [
      "negative quantity",
      (r) => {
        Object.assign(r.ingredients[0].amount, { quantity: -1 });
      },
    ],
    [
      "zero servings",
      (r) => {
        r.servings = 0;
      },
    ],
    [
      "negative time",
      (r) => {
        r.time.prep = -1;
      },
    ],
    [
      "empty steps",
      (r) => {
        r.steps = [];
      },
    ],
    [
      "duplicate steps",
      (r) => {
        r.steps.push(r.steps[0]);
      },
    ],
    [
      "invalid enum",
      (r) => {
        Object.assign(r, { category: "invalid" });
      },
    ],
    [
      "unknown field",
      (r) => {
        Object.assign(r, { rating: 5 });
      },
    ],
    [
      "nested field",
      (r) => {
        Object.assign(r.time, { total: 1 });
      },
    ],
    [
      "ingredient field",
      (r) => {
        Object.assign(r.ingredients[0], { alias: "x" });
      },
    ],
    [
      "step field",
      (r) => {
        Object.assign(r.steps[0], { timer: 1 });
      },
    ],
    [
      "unsupported unit",
      (r) => {
        Object.assign(r.ingredients[0].amount, { unit: "cup" });
      },
    ],
    [
      "zero quantity",
      (r) => {
        Object.assign(r.ingredients[0].amount, { quantity: 0 });
      },
    ],
    [
      "amount field",
      (r) => {
        Object.assign(r.ingredients[0].amount, { max: 3 });
      },
    ],
  ])("rejects %s", (_name, change) => {
    const recipe = example();
    change(recipe.data);
    expect(() => recipeSchema.parse(recipe.data)).toThrow();
  });
  it("accepts explicit to-taste and rejects extra amount data", () => {
    const r = example();
    r.data.ingredients[0].amount = { kind: "to-taste" };
    expect(recipeSchema.safeParse(r.data).success).toBe(true);
    Object.assign(r.data.ingredients[0].amount, { quantity: 1 });
    expect(recipeSchema.safeParse(r.data).success).toBe(false);
  });
  it("rejects unknown ingredient references with file context", () => {
    const r = example();
    r.data.ingredients[0].ingredientId = "missing";
    expect(() => validateRecipes([r], catalog)).toThrow(
      /index.md.*ingredients/,
    );
  });
  it("rejects duplicate recipe IDs", () => {
    const r = example();
    expect(() =>
      validateRecipes([r, { ...r, slug: "other" }], catalog),
    ).toThrow(/duplicate recipe id/);
  });
  it("rejects duplicate route slugs", () => {
    const r = example();
    expect(() =>
      validateRecipes([r, { ...r, data: { ...r.data, id: "other" } }], catalog),
    ).toThrow(/duplicate route slug/);
  });
  it("rejects duplicate catalog IDs and unknown catalog fields", () => {
    expect(() => catalogSchema.parse([...catalog, catalog[0]])).toThrow();
    expect(() =>
      catalogSchema.parse([{ ...catalog[0], alias: "x" }]),
    ).toThrow();
  });
  it("rejects malformed YAML and unsupported body markup", () => {
    expect(() => parseRecipe("---\ntitle: [\n---", file)).toThrow(/index.md/);
    expect(() =>
      parseRecipe(readFileSync(file, "utf8") + "\n<script>x</script>", file),
    ).toThrow(/body/);
  });
  it("preserves plain source URLs with query and fragment text", () => {
    const source = readFileSync(file, "utf8");
    const url = "https://example.org/recipe_name?source=book&edition=2#notes";
    const originalBody = parseRecipe(source, file).body;
    const recipe = parseRecipe(`${source.trimEnd()}\nДжерело: ${url}\n`, file);
    expect(recipe.body).toBe(`${originalBody}\nДжерело: ${url}`);
  });
  it("rejects duplicate YAML keys", () => {
    const source = readFileSync(file, "utf8").replace(
      "servings: 2",
      "servings: 2\nservings: 3",
    );
    expect(() => parseRecipe(source, file)).toThrow(/index.md/);
  });
  it("rejects unsupported source paths", () => {
    expect(() =>
      parseRecipe(readFileSync(file, "utf8"), "src/content/recipes/bad.md"),
    ).toThrow(/path/);
  });
});
