import { z } from "astro/zod";
export const categories = [
  "breakfast",
  "main",
  "side",
  "soup",
  "salad",
  "dessert",
] as const;
export const difficulties = ["easy", "medium", "hard"] as const;
export const statuses = ["unverified"] as const;
export const units = ["g", "kg", "ml", "l", "tsp", "tbsp", "piece"] as const;
export const stableId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().trim().min(1);
export const catalogSchema = z
  .array(z.object({ id: stableId, name: text }).strict())
  .min(1)
  .superRefine((items, ctx) => {
    const ids = new Set<string>();
    items.forEach((item, index) => {
      if (ids.has(item.id))
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: "duplicate catalog id",
        });
      ids.add(item.id);
    });
  });
export const recipeSchema = z
  .object({
    id: stableId,
    title: text,
    description: text,
    category: z.enum(categories),
    tags: z.array(text),
    difficulty: z.enum(difficulties),
    status: z.enum(statuses),
    servings: z.number().int().positive(),
    time: z
      .object({
        prep: z.number().int().nonnegative(),
        cook: z.number().int().nonnegative(),
      })
      .strict(),
    ingredients: z
      .array(
        z
          .object({
            ingredientId: stableId,
            amount: z.discriminatedUnion("kind", [
              z
                .object({
                  kind: z.literal("measured"),
                  quantity: z.number().positive(),
                  unit: z.enum(units),
                })
                .strict(),
              z.object({ kind: z.literal("to-taste") }).strict(),
            ]),
          })
          .strict(),
      )
      .min(1),
    steps: z.array(z.object({ id: stableId, text }).strict()).min(1),
  })
  .strict()
  .superRefine((recipe, ctx) => {
    const ids = new Set<string>();
    recipe.steps.forEach((step, index) => {
      if (ids.has(step.id))
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "id"],
          message: "duplicate step id",
        });
      ids.add(step.id);
    });
  });
export type Recipe = z.infer<typeof recipeSchema>;
