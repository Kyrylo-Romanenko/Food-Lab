import { globSync, readFileSync } from "node:fs";
import { parseDocument } from "yaml";
import {
  catalogSchema,
  recipeSchema,
  stableId,
  type Recipe,
} from "../schemas/recipe";
import catalog from "../content/ingredients.json";
export type RecipeFile = {
  file: string;
  slug: string;
  data: Recipe;
  body: string;
};
export function parseRecipe(source: string, file: string): RecipeFile {
  try {
    const normalized = file.replaceAll("\\", "/");
    const match = normalized.match(/(?:^|\/)recipes\/([^/]+)\/index\.md$/);
    if (!match) throw new Error("path: expected recipes/<slug>/index.md");
    const slug = stableId.parse(match[1]);
    const frontmatter = source
      .replaceAll("\r\n", "\n")
      .match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
    if (!frontmatter) throw new Error("frontmatter: expected YAML delimiters");
    const document = parseDocument(frontmatter[1], { uniqueKeys: true });
    if (document.errors.length)
      throw new Error(document.errors.map((e) => e.message).join("; "));
    const data = recipeSchema.parse(document.toJS());
    const body = frontmatter[2].trim();
    const plainText = body.replace(/https?:\/\/[^\s<>]+/gi, "");
    if (/[<>![\]`*_#]|^\s*(?:[-+>]|\d+\.)\s/m.test(plainText))
      throw new Error("body: only plain paragraphs are supported");
    return { file, slug, data, body };
  } catch (error) {
    throw new Error(
      `${file}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}
export function validateRecipes(
  recipes: RecipeFile[],
  ingredients: unknown,
): RecipeFile[] {
  const parsed = catalogSchema.safeParse(ingredients);
  if (!parsed.success)
    throw new Error(`src/content/ingredients.json: ${parsed.error.message}`);
  const entries = parsed.data;
  const known = new Set(entries.map((i) => i.id));
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const recipe of recipes) {
    recipeSchema.parse(recipe.data);
    if (ids.has(recipe.data.id))
      throw new Error(`${recipe.file}: duplicate recipe id ${recipe.data.id}`);
    if (slugs.has(recipe.slug))
      throw new Error(`${recipe.file}: duplicate route slug ${recipe.slug}`);
    ids.add(recipe.data.id);
    slugs.add(recipe.slug);
    recipe.data.ingredients.forEach((ingredient, index) => {
      if (!known.has(ingredient.ingredientId))
        throw new Error(
          `${recipe.file}: ingredients.${index}.ingredientId: unknown ${ingredient.ingredientId}`,
        );
    });
  }
  return recipes;
}
export function discoverRecipes(): RecipeFile[] {
  const files = [...globSync("src/content/recipes/**/*.md")].sort();
  return validateRecipes(
    files.map((file) => parseRecipe(readFileSync(file, "utf8"), file)),
    catalog,
  );
}
