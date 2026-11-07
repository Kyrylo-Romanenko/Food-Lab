export interface ShoppingSource {
  recipeId: string;
  recipeName: string;
  quantity: number;
  unit: string;
}
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  category: string;
  purchased: boolean;
  sources: ShoppingSource[];
}
const aliases: Record<string, { group: string; factor: number; unit: string }> =
  {
    g: { group: "mass", factor: 1, unit: "g" },
    грам: { group: "mass", factor: 1, unit: "g" },
    кг: { group: "mass", factor: 1000, unit: "g" },
    kg: { group: "mass", factor: 1000, unit: "g" },
    ml: { group: "volume", factor: 1, unit: "ml" },
    мл: { group: "volume", factor: 1, unit: "ml" },
    l: { group: "volume", factor: 1000, unit: "ml" },
    л: { group: "volume", factor: 1000, unit: "ml" },
    piece: { group: "piece", factor: 1, unit: "pcs" },
    pcs: { group: "piece", factor: 1, unit: "pcs" },
    шт: { group: "piece", factor: 1, unit: "pcs" },
    "шт.": { group: "piece", factor: 1, unit: "pcs" },
  };
export function mergeShoppingItem(
  items: ShoppingItem[],
  incoming: ShoppingItem,
): ShoppingItem[] {
  const key = incoming.name
    .trim()
    .toLocaleLowerCase("uk-UA")
    .replace(/\s+/g, " ");
  const unit = aliases[incoming.unit.toLowerCase()];
  const index = items.findIndex(
    (item) =>
      item.name.trim().toLocaleLowerCase("uk-UA").replace(/\s+/g, " ") ===
        key &&
      item.purchased === incoming.purchased &&
      item.quantity !== null &&
      incoming.quantity !== null &&
      aliases[item.unit.toLowerCase()]?.group === unit?.group,
  );
  if (index < 0) return [...items, incoming];
  const old = items[index],
    oldUnit = aliases[old.unit.toLowerCase()]!;
  const quantity =
    (old.quantity! * oldUnit.factor +
      incoming.quantity! * (unit?.factor ?? 1)) /
    oldUnit.factor;
  const sources = [...old.sources];
  for (const source of incoming.sources) {
    const existing = sources.find((s) => s.recipeId === source.recipeId);
    if (existing) {
      if (existing.unit === source.unit) existing.quantity += source.quantity;
    } else sources.push({ ...source });
  }
  return items.map((item, i) =>
    i === index ? { ...old, quantity, sources } : item,
  );
}
export function validateShoppingList(value: unknown): ShoppingItem[] | null {
  if (!Array.isArray(value) || value.length > 500) return null;
  if (
    value.some(
      (x) =>
        !x ||
        typeof x.id !== "string" ||
        typeof x.name !== "string" ||
        !x.name.trim() ||
        x.name.length > 120 ||
        !(
          x.quantity === null ||
          (typeof x.quantity === "number" &&
            Number.isFinite(x.quantity) &&
            x.quantity >= 0)
        ) ||
        typeof x.unit !== "string" ||
        typeof x.category !== "string" ||
        typeof x.purchased !== "boolean" ||
        !Array.isArray(x.sources),
    )
  )
    return null;
  return value as ShoppingItem[];
}
