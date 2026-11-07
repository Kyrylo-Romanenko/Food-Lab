import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { readFileSync } from "node:fs";
import { discoverRecipes } from "./lib/content";
import { buildContextPack } from "./lib/authoring";
import { recipeSchema } from "./schemas/recipe";
const recipes = defineCollection({
  schema: z
    .object({ recipe: recipeSchema, slug: z.string(), notes: z.string() })
    .strict(),
  loader: {
    name: "validated-recipes",
    async load({ store, parseData, watcher }) {
      const sync = async () => {
        const recipes = discoverRecipes();
        store.clear();
        for (const recipe of recipes) {
          const data = await parseData({
            id: recipe.data.id,
            data: {
              recipe: recipe.data,
              slug: recipe.slug,
              notes: recipe.body,
            },
            filePath: recipe.file,
          });
          store.set({ id: recipe.data.id, data });
        }
      };
      await sync();
      watcher?.on("all", async (_event, path) => {
        if (path.replaceAll("\\", "/").includes("/src/content/")) {
          await sync();
        }
      });
    },
  },
});
const guides = defineCollection({
  schema: z.object({ title: z.string() }),
  loader: {
    name: "recipe-authoring-guide",
    async load({ store, parseData, renderMarkdown }) {
      const body = buildContextPack(
        readFileSync("docs/ai/recipe-authoring.md", "utf8"),
      );
      const data = await parseData({
        id: "recipe-authoring",
        data: { title: "Recipe authoring" },
      });
      store.clear();
      store.set({
        id: "recipe-authoring",
        data,
        body,
        rendered: await renderMarkdown(body),
      });
    },
  },
});
export const collections = { recipes, guides };
