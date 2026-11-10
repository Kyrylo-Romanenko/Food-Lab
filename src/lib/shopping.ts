import { factorFromPortions } from "./calculator";

export type Amount =
  | { kind: "measured"; quantity: number; unit: string }
  | { kind: "unspecified" };
export interface IngredientSnapshot {
  ingredientId: string;
  name: string;
  amount: Amount;
}
export interface SelectedRecipe {
  recipeId: string;
  recipeName: string;
  basePortions: number;
  selectedPortions: number;
  ingredients: IngredientSnapshot[];
}
export interface Contribution {
  id: string;
  origin: "individual" | "manual" | "legacy";
  ingredientId?: string;
  name: string;
  amount: Amount;
  unit?: string;
  category?: string;
  purchased?: boolean;
  sources?: LegacySource[];
}
export interface LegacySource {
  recipeId: string;
  recipeName: string;
  quantity: number;
  unit: string;
}
export interface LegacyItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  category: string;
  purchased: boolean;
  sources: LegacySource[];
}
export interface Stock {
  key: string;
  quantity: number;
  unit: string;
}
export interface AmountOverride {
  key: string;
  quantity: number;
  unit: string;
}
export interface ShoppingState {
  version: 2;
  selectedRecipes: SelectedRecipe[];
  contributions: Contribution[];
  amountOverrides: AmountOverride[];
  /** Retained only to validate and preserve existing v2 data. */
  stock: Stock[];
  cart: string[];
}
export interface ShoppingRow {
  key: string;
  ingredientId?: string;
  name: string;
  amount: Amount;
  baseNeeded: number | null;
  needed: number | null;
  unit: string;
  toBuy: number | null;
  inCart: boolean;
  hasUnspecified: boolean;
  sources: string[];
  contributionIds: string[];
  origin?: string;
}

export const emptyShoppingState = (): ShoppingState => ({
  version: 2,
  selectedRecipes: [],
  contributions: [],
  amountOverrides: [],
  stock: [],
  cart: [],
});
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const text = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;
const onlyKeys = (v: unknown, allowed: string[]): boolean =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  Object.keys(v).every((k) => allowed.includes(k));

export function validateShoppingState(value: unknown): ShoppingState | null {
  if (!value || typeof value !== "object") return null;
  const s = value as ShoppingState;
  if (
    !onlyKeys(s, [
      "version",
      "selectedRecipes",
      "contributions",
      "amountOverrides",
      "stock",
      "cart",
    ]) ||
    s.version !== 2 ||
    !Array.isArray(s.selectedRecipes) ||
    !Array.isArray(s.contributions) ||
    !Array.isArray(s.stock) ||
    (s.amountOverrides !== undefined && !Array.isArray(s.amountOverrides)) ||
    !Array.isArray(s.cart) ||
    s.selectedRecipes.length + s.contributions.length > 500
  )
    return null;
  const amountOK = (a: unknown): a is Amount =>
    !!a &&
    typeof a === "object" &&
    (((a as Amount).kind === "unspecified" && onlyKeys(a, ["kind"])) ||
      ((a as Amount).kind === "measured" &&
        onlyKeys(a, ["kind", "quantity", "unit"]) &&
        finite((a as Extract<Amount, { kind: "measured" }>).quantity) &&
        (a as Extract<Amount, { kind: "measured" }>).quantity > 0 &&
        text((a as Extract<Amount, { kind: "measured" }>).unit)));
  const recipeIds = new Set<string>();
  for (const r of s.selectedRecipes) {
    if (
      !onlyKeys(r, [
        "recipeId",
        "recipeName",
        "basePortions",
        "selectedPortions",
        "ingredients",
      ]) ||
      !text(r.recipeId) ||
      recipeIds.has(r.recipeId) ||
      !text(r.recipeName) ||
      !finite(r.basePortions) ||
      !finite(r.selectedPortions) ||
      !factorFromPortions(r.selectedPortions, r.basePortions) ||
      !Array.isArray(r.ingredients) ||
      r.ingredients.some(
        (i) =>
          !onlyKeys(i, ["ingredientId", "name", "amount"]) ||
          !text(i.ingredientId) ||
          !text(i.name) ||
          !amountOK(i.amount),
      )
    )
      return null;
    recipeIds.add(r.recipeId);
  }
  const ids = new Set<string>();
  for (const c of s.contributions) {
    const legacyAmount = c.amount as {
      kind?: string;
      quantity?: number;
      unit?: string;
    };
    const legacyZero =
      c.origin === "legacy" &&
      legacyAmount?.kind === "measured" &&
      legacyAmount.quantity === 0 &&
      typeof legacyAmount.unit === "string";
    const contributionKeys =
      c.origin === "legacy"
        ? [
            "id",
            "origin",
            "name",
            "amount",
            "unit",
            "category",
            "purchased",
            "sources",
          ]
        : c.origin === "individual"
          ? ["id", "origin", "ingredientId", "name", "amount"]
          : ["id", "origin", "name", "amount"];
    const manualZero =
      c.origin === "manual" &&
      legacyAmount?.kind === "measured" &&
      legacyAmount.quantity === 0 &&
      text(legacyAmount.unit);
    if (
      !onlyKeys(c, contributionKeys) ||
      !text(c.id) ||
      ids.has(c.id) ||
      !["individual", "manual", "legacy"].includes(c.origin) ||
      !text(c.name) ||
      !(amountOK(c.amount) || legacyZero || manualZero)
    )
      return null;
    ids.add(c.id);
    if (c.origin === "individual" && !text(c.ingredientId)) return null;
    if (
      c.origin === "legacy" &&
      (typeof c.unit !== "string" ||
        typeof c.category !== "string" ||
        typeof c.purchased !== "boolean" ||
        !Array.isArray(c.sources))
    )
      return null;
    if (
      c.sources &&
      c.sources.some(
        (x) =>
          !text(x.recipeId) ||
          !text(x.recipeName) ||
          !finite(x.quantity) ||
          !text(x.unit),
      )
    )
      return null;
  }
  if (
    s.stock.some((x) => {
      if (
        !onlyKeys(x, ["key", "quantity", "unit"]) ||
        !text(x.key) ||
        !finite(x.quantity) ||
        x.quantity < 0 ||
        !text(x.unit)
      )
        return true;
      const unit = unitGroups[x.unit.trim().toLowerCase()];
      const group = x.key.match(/:(mass|volume|piece)$/)?.[1];
      if (group) return unit?.group !== group;
      return !x.key.endsWith(`:measured:${x.unit}`);
    })
  )
    return null;
  const amountOverrides = s.amountOverrides ?? [];
  if (
    amountOverrides.some((x) => {
      if (
        !onlyKeys(x, ["key", "quantity", "unit"]) ||
        !text(x.key) ||
        !finite(x.quantity) ||
        x.quantity < 0 ||
        !text(x.unit)
      )
        return true;
      const unit = unitGroups[x.unit.trim().toLowerCase()];
      const group = x.key.match(/:(mass|volume|piece)$/)?.[1];
      if (group) return unit?.group !== group;
      const exactUnit = x.key.match(/:measured:(.+)$/)?.[1];
      return !exactUnit || exactUnit !== x.unit;
    }) ||
    new Set(amountOverrides.map((x) => x.key)).size !== amountOverrides.length
  )
    return null;
  const baseRows = buildShoppingRows({ ...s, amountOverrides: [] });
  if (
    amountOverrides.some((item) => {
      const row = baseRows.find((candidate) => candidate.key === item.key);
      return (
        !row ||
        row.baseNeeded === null ||
        convertUnit(item.quantity, item.unit, row.unit) === null
      );
    })
  )
    return null;
  if (s.cart.some((x) => !text(x)) || new Set(s.cart).size !== s.cart.length)
    return null;
  return structuredClone({ ...s, amountOverrides });
}

const unitGroups: Record<
  string,
  { group: string; factor: number; canonical: string }
> = {
  g: { group: "mass", factor: 1, canonical: "g" },
  г: { group: "mass", factor: 1, canonical: "g" },
  гр: { group: "mass", factor: 1, canonical: "g" },
  kg: { group: "mass", factor: 1000, canonical: "g" },
  кг: { group: "mass", factor: 1000, canonical: "g" },
  ml: { group: "volume", factor: 1, canonical: "ml" },
  мл: { group: "volume", factor: 1, canonical: "ml" },
  l: { group: "volume", factor: 1000, canonical: "ml" },
  л: { group: "volume", factor: 1000, canonical: "ml" },
  tsp: { group: "volume", factor: 5, canonical: "ml" },
  "ч. л.": { group: "volume", factor: 5, canonical: "ml" },
  tbsp: { group: "volume", factor: 15, canonical: "ml" },
  "ст. л.": { group: "volume", factor: 15, canonical: "ml" },
  piece: { group: "piece", factor: 1, canonical: "piece" },
  шт: { group: "piece", factor: 1, canonical: "piece" },
  "шт.": { group: "piece", factor: 1, canonical: "piece" },
};
export function convertUnit(
  quantity: number,
  from: string,
  to: string,
): number | null {
  if (finite(quantity) && from.trim().toLowerCase() === to.trim().toLowerCase())
    return quantity;
  const a = unitGroups[from.trim().toLowerCase()],
    b = unitGroups[to.trim().toLowerCase()];
  return finite(quantity) && a && b && a.group === b.group
    ? (quantity * a.factor) / b.factor
    : null;
}
function sourceKey(c: Contribution): string {
  return c.origin === "individual"
    ? `ingredient:${c.ingredientId}`
    : `${c.origin}:${c.id}`;
}
function groupedSourceKey(key: string, amount: Amount): string {
  const unit =
    amount.kind === "measured"
      ? (unitGroups[amount.unit.trim().toLowerCase()]?.canonical ?? amount.unit)
      : "";
  return amount.kind === "measured" &&
    unitGroups[amount.unit.trim().toLowerCase()]
    ? `${key}:${unitGroups[amount.unit.trim().toLowerCase()].group}`
    : `${key}:${amount.kind}:${unit}`;
}
function contributionRowKey(contribution: Contribution): string {
  return groupedSourceKey(sourceKey(contribution), contribution.amount);
}
export function buildShoppingRows(state: ShoppingState): ShoppingRow[] {
  const groups = new Map<
    string,
    {
      key: string;
      id?: string;
      name: string;
      unit: string;
      quantities: number[];
      sourceNames: string[];
      ids: string[];
      origin?: string;
      unspecified: boolean;
    }
  >();
  const add = (
    key: string,
    id: string | undefined,
    name: string,
    amount: Amount,
    source: string,
    cid: string,
    origin?: string,
  ) => {
    const unit =
      amount.kind === "measured"
        ? (unitGroups[amount.unit.trim().toLowerCase()]?.canonical ??
          amount.unit)
        : "";
    const groupKey = groupedSourceKey(key, amount);
    let g = groups.get(groupKey);
    if (!g) {
      g = {
        key: groupKey,
        id,
        name,
        unit,
        quantities: [],
        sourceNames: [],
        ids: [],
        origin,
        unspecified: amount.kind === "unspecified",
      };
      groups.set(groupKey, g);
    }
    if (amount.kind === "measured") {
      const conv = convertUnit(amount.quantity, amount.unit, unit);
      if (conv !== null) g.quantities.push(conv);
    } else g.unspecified = true;
    g.sourceNames.push(source);
    g.ids.push(cid);
  };
  for (const r of state.selectedRecipes)
    for (const i of r.ingredients) {
      const amount =
        i.amount.kind === "measured"
          ? {
              kind: "measured" as const,
              quantity:
                (i.amount.quantity * r.selectedPortions) / r.basePortions,
              unit: i.amount.unit,
            }
          : i.amount;
      add(
        `ingredient:${i.ingredientId}`,
        i.ingredientId,
        i.name,
        amount,
        `${r.recipeName} (${r.selectedPortions} порц.)`,
        `recipe:${r.recipeId}`,
      );
    }
  for (const c of state.contributions)
    add(
      sourceKey(c),
      c.ingredientId,
      c.name,
      c.amount,
      c.origin === "individual"
        ? "Окремий інгредієнт"
        : c.origin === "legacy"
          ? "Старий запис"
          : "Окремий товар",
      c.id,
      c.origin,
    );
  return [...groups.values()].map((g) => {
    const baseNeeded = g.quantities.length
      ? g.quantities.reduce((a, b) => a + b, 0)
      : null;
    const override = state.amountOverrides?.find((item) => item.key === g.key);
    const needed = override?.quantity ?? baseNeeded;
    return {
      key: g.key,
      ingredientId: g.id,
      name: g.name,
      amount:
        needed === null
          ? { kind: "unspecified" }
          : {
              kind: "measured",
              quantity: needed,
              unit: override?.unit ?? g.unit,
            },
      baseNeeded,
      needed,
      unit: g.unit,
      toBuy: needed,
      inCart: state.cart.includes(g.key),
      hasUnspecified: g.unspecified,
      sources: [...new Set(g.sourceNames)],
      contributionIds: [...new Set(g.ids)],
      origin: g.origin,
    };
  });
}
export function setShoppingRowAmount(
  state: ShoppingState,
  key: string,
  quantity: number,
): ShoppingState | null {
  const row = buildShoppingRows(state).find((item) => item.key === key);
  if (
    !row ||
    row.baseNeeded === null ||
    !row.unit ||
    !finite(quantity) ||
    quantity < 0
  )
    return null;
  const amountOverrides = (state.amountOverrides ?? []).filter(
    (item) => item.key !== key,
  );
  if (quantity !== row.baseNeeded)
    amountOverrides.push({ key, quantity, unit: row.unit });
  return resetChangedCartRows(state, { ...state, amountOverrides });
}
export function clearChangedAmountOverrides(
  previous: ShoppingState,
  next: ShoppingState,
): ShoppingState {
  const oldRows = new Map(
    buildShoppingRows(previous).map((row) => [row.key, row]),
  );
  const newRows = new Map(buildShoppingRows(next).map((row) => [row.key, row]));
  const changed = new Set<string>();
  for (const [key, row] of oldRows) {
    if (newRows.get(key)?.baseNeeded !== row.baseNeeded) changed.add(key);
  }
  return {
    ...next,
    amountOverrides: next.amountOverrides.filter(
      (item) => !changed.has(item.key),
    ),
  };
}
export function removeShoppingRow(
  state: ShoppingState,
  key: string,
): ShoppingState {
  return {
    ...state,
    selectedRecipes: state.selectedRecipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.filter(
        (item) =>
          groupedSourceKey(`ingredient:${item.ingredientId}`, item.amount) !==
          key,
      ),
    })),
    contributions: state.contributions.filter(
      (item) => contributionRowKey(item) !== key,
    ),
    amountOverrides: state.amountOverrides.filter((item) => item.key !== key),
    stock: state.stock.filter((item) => item.key !== key),
    cart: state.cart.filter((item) => item !== key),
  };
}
export function removeContribution(
  state: ShoppingState,
  id: string,
): ShoppingState {
  return {
    ...state,
    contributions: state.contributions.filter((c) => c.id !== id),
  };
}
export function resetChangedCartRows(
  previous: ShoppingState,
  next: ShoppingState,
): ShoppingState {
  const previousRows = buildShoppingRows(previous);
  const nextRows = buildShoppingRows(next);
  return {
    ...next,
    cart: next.cart.filter((key) => {
      const before = previousRows.find((row) => row.key === key);
      const after = nextRows.find((row) => row.key === key);
      if (!after) return false;
      if (!before) return true;
      return before.needed === after.needed;
    }),
  };
}
export function mergeImportedShoppingState(
  current: ShoppingState,
  importedValue: unknown,
  createId: () => string,
): ShoppingState | null {
  const imported = validateShoppingState(importedValue);
  const validCurrent = validateShoppingState(current);
  if (!imported || !validCurrent) return null;
  const ids = new Set(validCurrent.contributions.map((item) => item.id));
  const remapped = new Map<string, string>();
  const contributions = imported.contributions.map((item) => {
    if (!ids.has(item.id)) {
      ids.add(item.id);
      return item;
    }
    const newId = createId();
    if (!text(newId) || ids.has(newId)) return null;
    ids.add(newId);
    remapped.set(`${item.origin}:${item.id}`, `${item.origin}:${newId}`);
    return { ...item, id: newId };
  });
  if (contributions.some((item) => item === null)) return null;
  const remapKey = (key: string) => {
    for (const [from, to] of remapped)
      if (key.startsWith(`${from}:`)) return `${to}${key.slice(from.length)}`;
    return key;
  };
  const recipes = imported.selectedRecipes.filter(
    (recipe) =>
      !validCurrent.selectedRecipes.some(
        (existing) => existing.recipeId === recipe.recipeId,
      ),
  );
  const merged = validateShoppingState({
    ...validCurrent,
    contributions: [...validCurrent.contributions, ...contributions],
    selectedRecipes: [...validCurrent.selectedRecipes, ...recipes],
    amountOverrides: [
      ...validCurrent.amountOverrides,
      ...imported.amountOverrides
        .map((item) => ({ ...item, key: remapKey(item.key) }))
        .filter(
          (item) =>
            !validCurrent.amountOverrides.some(
              (existing) => existing.key === item.key,
            ),
        ),
    ],
    stock: [
      ...validCurrent.stock,
      ...imported.stock
        .map((item) => ({ ...item, key: remapKey(item.key) }))
        .filter(
          (item) =>
            !validCurrent.stock.some((existing) => existing.key === item.key),
        ),
    ],
    cart: [...new Set([...validCurrent.cart, ...imported.cart.map(remapKey)])],
  });
  return merged ? resetChangedCartRows(validCurrent, merged) : null;
}
export function legacyItemsToState(items: LegacyItem[]): ShoppingState {
  const contributions = items.map((i) => ({
    id: i.id,
    origin: "legacy" as const,
    name: i.name,
    amount:
      i.quantity === null
        ? { kind: "unspecified" as const }
        : { kind: "measured" as const, quantity: i.quantity, unit: i.unit },
    unit: i.unit,
    category: i.category,
    purchased: i.purchased,
    sources: i.sources,
  }));
  const state = { ...emptyShoppingState(), contributions };
  state.cart = contributions
    .filter((c) => c.purchased)
    .map((c) => {
      const unit =
        c.amount.kind === "measured"
          ? unitGroups[c.amount.unit.trim().toLowerCase()]
          : undefined;
      return unit
        ? `legacy:${c.id}:${unit.group}`
        : `legacy:${c.id}:${c.amount.kind}:${c.amount.kind === "measured" ? c.amount.unit : ""}`;
    });
  return state;
}
export function validateLegacyItems(value: unknown): LegacyItem[] | null {
  if (!Array.isArray(value) || value.length > 500) return null;
  const ids = new Set<string>();
  for (const x of value) {
    if (
      !onlyKeys(x, [
        "id",
        "name",
        "quantity",
        "unit",
        "category",
        "purchased",
        "sources",
      ])
    )
      return null;
    const i = x as LegacyItem;
    if (
      !text(i.id) ||
      ids.has(i.id) ||
      !text(i.name) ||
      !(i.quantity === null || (finite(i.quantity) && i.quantity >= 0)) ||
      typeof i.unit !== "string" ||
      typeof i.category !== "string" ||
      typeof i.purchased !== "boolean" ||
      !Array.isArray(i.sources) ||
      i.sources.some(
        (s) =>
          !onlyKeys(s, ["recipeId", "recipeName", "quantity", "unit"]) ||
          !text(s.recipeId) ||
          !text(s.recipeName) ||
          !finite(s.quantity) ||
          !text(s.unit),
      )
    )
      return null;
    ids.add(i.id);
  }
  return structuredClone(value) as LegacyItem[];
}
