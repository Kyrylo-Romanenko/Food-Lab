import { describe, expect, it } from "vitest";
import {
  buildShoppingRows,
  clearChangedAmountOverrides,
  convertUnit,
  emptyShoppingState,
  removeContribution,
  removeShoppingRow,
  resetChangedCartRows,
  setShoppingRowAmount,
  validateShoppingState,
  type ShoppingState,
} from "../src/lib/shopping";

describe("shopping domain", () => {
  it("aggregates compatible metric units and Ukrainian aliases", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "a",
          origin: "individual",
          ingredientId: "carrot",
          name: "Морква",
          amount: { kind: "measured", quantity: 200, unit: "g" },
        },
        {
          id: "b",
          origin: "individual",
          ingredientId: "carrot",
          name: "Морква",
          amount: { kind: "measured", quantity: 0.3, unit: "кг" },
        },
      ],
    };
    expect(buildShoppingRows(state)[0]?.needed).toBe(500);
    expect(
      buildShoppingRows({
        ...state,
        contributions: [
          {
            ...state.contributions[0]!,
            amount: { kind: "measured", quantity: 200, unit: "г" },
          },
        ],
      })[0]?.needed,
    ).toBe(200);
  });
  it("keeps incompatible and unknown units separate and keeps unspecified needs visible", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "a",
          origin: "individual",
          ingredientId: "salt",
          name: "Сіль",
          amount: { kind: "measured", quantity: 1, unit: "g" },
        },
        {
          id: "b",
          origin: "individual",
          ingredientId: "salt",
          name: "Сіль",
          amount: { kind: "measured", quantity: 1, unit: "штучка" },
        },
        {
          id: "c",
          origin: "individual",
          ingredientId: "salt",
          name: "Сіль",
          amount: { kind: "unspecified" },
        },
      ],
    };
    expect(buildShoppingRows(state)).toHaveLength(3);
    expect(
      buildShoppingRows(state).find((r) => r.amount.kind === "unspecified")
        ?.needed,
    ).toBeNull();
  });
  it("converts equal unknown units by identity", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: ["one", "two"].map((id) => ({
        id,
        origin: "manual" as const,
        name: id,
        amount: { kind: "measured" as const, quantity: 1.5, unit: "склянка" },
      })),
    };
    expect(buildShoppingRows(state)).toHaveLength(2);
    expect(convertUnit(1.5, "склянка", "склянка")).toBe(1.5);
  });
  it("preserves legacy zero and old stock data without applying stock", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "old",
          origin: "legacy",
          name: "Старий запис",
          amount: { kind: "measured", quantity: 0, unit: "g" },
          unit: "g",
          category: "Інше",
          purchased: false,
          sources: [],
        },
      ],
      stock: [{ key: "ingredient:beans:mass", quantity: 5, unit: "g" }],
    };
    expect(validateShoppingState(state)).not.toBeNull();
    const current: ShoppingState = {
      ...state,
      contributions: [
        {
          id: "beans",
          origin: "individual",
          ingredientId: "beans",
          name: "Квасоля",
          amount: { kind: "measured", quantity: 2, unit: "g" },
        },
      ],
    };
    const row = buildShoppingRows(current)[0]!;
    const stocked = {
      ...current,
      stock: [{ key: row.key, quantity: 5, unit: "g" }],
    };
    expect(buildShoppingRows(stocked)[0]?.toBuy).toBe(2);
    expect(
      validateShoppingState({
        version: 2,
        selectedRecipes: [],
        contributions: [],
        stock: [],
        cart: [],
      })?.amountOverrides,
    ).toEqual([]);
  });
  it("removes one source without affecting others", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: ["a", "b"].map((id) => ({
        id,
        origin: "manual" as const,
        name: id,
        amount: { kind: "measured" as const, quantity: 1, unit: "g" },
      })),
    };
    expect(
      removeContribution(state, "a").contributions.map((x) => x.id),
    ).toEqual(["b"]);
  });
  it("keeps recipe portions independent and scales each saved snapshot", () => {
    const recipe = {
      recipeId: "soup",
      recipeName: "Суп",
      basePortions: 2,
      selectedPortions: 4,
      ingredients: [
        {
          ingredientId: "carrot",
          name: "Морква",
          amount: { kind: "measured" as const, quantity: 100, unit: "g" },
        },
      ],
    };
    const state: ShoppingState = {
      ...emptyShoppingState(),
      selectedRecipes: [recipe],
    };
    expect(buildShoppingRows(state)[0]?.needed).toBe(200);
    expect(
      buildShoppingRows({
        ...state,
        selectedRecipes: [{ ...recipe, selectedPortions: 6 }],
      })[0]?.needed,
    ).toBe(300);
  });
  it("keeps to-taste ingredients unspecified in recipe snapshots", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      selectedRecipes: [
        {
          recipeId: "soup",
          recipeName: "Суп",
          basePortions: 2,
          selectedPortions: 4,
          ingredients: [
            {
              ingredientId: "salt",
              name: "Сіль",
              amount: { kind: "unspecified" },
            },
          ],
        },
      ],
    };
    expect(buildShoppingRows(state)[0]).toMatchObject({
      name: "Сіль",
      needed: null,
      hasUnspecified: true,
    });
  });
  it("groups a shared ingredient from separate recipes and lists both sources", () => {
    const shared = (
      recipeId: string,
      recipeName: string,
      quantity: number,
    ) => ({
      recipeId,
      recipeName,
      basePortions: 2,
      selectedPortions: 2,
      ingredients: [
        {
          ingredientId: "carrot",
          name: "Морква",
          amount: { kind: "measured" as const, quantity, unit: "g" },
        },
      ],
    });
    const rows = buildShoppingRows({
      ...emptyShoppingState(),
      selectedRecipes: [
        shared("soup", "Суп", 200),
        shared("stew", "Рагу", 300),
      ],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      needed: 500,
      sources: ["Суп (2 порц.)", "Рагу (2 порц.)"],
    });
  });
  it("returns only changed cart rows to outstanding", () => {
    const current: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "a",
          origin: "individual",
          ingredientId: "a",
          name: "A",
          amount: { kind: "measured", quantity: 500, unit: "g" },
        },
        {
          id: "b",
          origin: "individual",
          ingredientId: "b",
          name: "B",
          amount: { kind: "measured", quantity: 100, unit: "g" },
        },
      ],
      cart: ["ingredient:a:mass", "ingredient:b:mass"],
    };
    const next: ShoppingState = {
      ...current,
      contributions: current.contributions.map((item) =>
        item.id === "a"
          ? { ...item, amount: { kind: "measured", quantity: 600, unit: "g" } }
          : item,
      ),
    };
    expect(resetChangedCartRows(current, next).cart).toEqual([
      "ingredient:b:mass",
    ]);
  });
  it("preserves old stock data without subtracting it from the shopping amount", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "a",
          origin: "individual",
          ingredientId: "a",
          name: "A",
          amount: { kind: "measured", quantity: 500, unit: "g" },
        },
        {
          id: "b",
          origin: "individual",
          ingredientId: "b",
          name: "B",
          amount: { kind: "measured", quantity: 100, unit: "g" },
        },
      ],
      cart: ["ingredient:a:mass", "ingredient:b:mass"],
    };
    const withOldStock = {
      ...state,
      stock: [{ key: "ingredient:a:mass", quantity: 200, unit: "g" }],
    };
    expect(
      buildShoppingRows(withOldStock).find((row) => row.name === "A")?.toBuy,
    ).toBe(500);
    expect(validateShoppingState(withOldStock)?.stock).toEqual(
      withOldStock.stock,
    );
  });
  it("persists row quantity overrides and clears them when source needs change", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "a",
          origin: "individual",
          ingredientId: "a",
          name: "A",
          amount: { kind: "measured", quantity: 500, unit: "g" },
        },
      ],
      cart: ["ingredient:a:mass"],
    };
    const edited = setShoppingRowAmount(state, "ingredient:a:mass", 350)!;
    expect(buildShoppingRows(edited)[0]?.needed).toBe(350);
    expect(edited.cart).toEqual([]);
    expect(validateShoppingState(edited)?.amountOverrides).toEqual([
      { key: "ingredient:a:mass", quantity: 350, unit: "g" },
    ]);
    const changed = {
      ...edited,
      contributions: edited.contributions.map((item) => ({
        ...item,
        amount: { kind: "measured" as const, quantity: 600, unit: "g" },
      })),
    };
    expect(
      buildShoppingRows(clearChangedAmountOverrides(edited, changed))[0]
        ?.needed,
    ).toBe(600);
  });
  it("removes a complete ingredient row from recipe and individual sources", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      selectedRecipes: [
        {
          recipeId: "soup",
          recipeName: "Суп",
          basePortions: 2,
          selectedPortions: 2,
          ingredients: [
            {
              ingredientId: "salt",
              name: "Сіль",
              amount: { kind: "measured", quantity: 5, unit: "g" },
            },
            {
              ingredientId: "carrot",
              name: "Морква",
              amount: { kind: "measured", quantity: 100, unit: "g" },
            },
          ],
        },
      ],
      contributions: [
        {
          id: "salt-extra",
          origin: "individual",
          ingredientId: "salt",
          name: "Сіль",
          amount: { kind: "measured", quantity: 2, unit: "g" },
        },
      ],
      cart: ["ingredient:salt:mass", "ingredient:carrot:mass"],
    };
    const removed = removeShoppingRow(state, "ingredient:salt:mass");
    const rows = buildShoppingRows(removed);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe("Морква");
    expect(removed.selectedRecipes[0]?.ingredients).toHaveLength(1);
    expect(removed.contributions).toHaveLength(0);
    expect(removed.cart).toEqual(["ingredient:carrot:mass"]);
  });
  it("rejects duplicate recipe choices in one saved list", () => {
    const recipe = {
      recipeId: "soup",
      recipeName: "Суп",
      basePortions: 2,
      selectedPortions: 2,
      ingredients: [],
    };
    expect(
      validateShoppingState({
        ...emptyShoppingState(),
        selectedRecipes: [recipe, recipe],
      }),
    ).toBeNull();
  });
  it("rejects selected recipe portions outside the calculator factor limits", () => {
    const state: ShoppingState = {
      ...emptyShoppingState(),
      selectedRecipes: [
        {
          recipeId: "soup",
          recipeName: "Суп",
          basePortions: 2,
          selectedPortions: 42,
          ingredients: [],
        },
      ],
    };
    expect(validateShoppingState(state)).toBeNull();
  });
});
