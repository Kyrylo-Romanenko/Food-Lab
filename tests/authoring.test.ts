import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildContextPack, contextBuild } from "../src/lib/authoring";
import { parseRecipe, validateRecipes } from "../src/lib/content";
import catalog from "../src/content/ingredients.json";
const source = readFileSync("docs/ai/recipe-authoring.md", "utf8");
it("validates the complete canonical guide example against the real catalog", () => {
  const example = source.match(
    /<!-- EXAMPLE:START -->\s*```markdown\s*([\s\S]*?)```\s*<!-- EXAMPLE:END -->/,
  );
  expect(example).not.toBeNull();
  expect(
    validateRecipes(
      [
        parseRecipe(
          example![1],
          "src/content/recipes/hrechka-z-morkvoiu/index.md",
        ),
      ],
      catalog,
    ),
  ).toHaveLength(1);
});
it("generates complete metadata and current catalog without markers", () => {
  const pack = buildContextPack(source, "abc123-dirty");
  expect(pack).toContain("Contract: recipe-authoring");
  expect(pack).toContain("Contract version: 1");
  expect(pack).toContain("Context build: abc123-dirty");
  expect(pack).toContain(
    "Capabilities: recipe-create, recipe-update, ingredient-propose",
  );
  for (const text of [
    "without requiring repository access or other project documents",
    "src/content/recipes/<slug>/index.md",
    "Create workflow",
    "Update workflow",
    "Required response format",
    "Repository validation and review",
    "Privacy and uncertainty",
    "Unsupported by the current contract.",
    "Repeat contract version and context build in response metadata, outside recipe frontmatter.",
    "The page displays the URL as escaped text, not as a link.",
  ])
    expect(pack).toContain(text);
  for (const item of catalog) {
    expect(pack).toContain(item.id);
    expect(pack).toContain(item.name);
  }
  expect(pack).not.toMatch(/@@[A-Z_]+@@/);
  expect(contextBuild()).toMatch(/^(unknown|[a-f0-9]{40}(?:-dirty)?)$/);
});
it("fails closed on unexpected insertion markers", () => {
  expect(() => buildContextPack(source + "\n@@MISSING@@", "unknown")).toThrow(
    /marker/,
  );
});
