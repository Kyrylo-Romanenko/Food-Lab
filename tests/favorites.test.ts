import { describe, expect, it } from "vitest";
import {
  addFavorite,
  clearFavorites,
  decodeFavoritesFragment,
  encodeFavoritesFragment,
  mergeFavorites,
  removeFavorite,
  validateFavorites,
} from "../src/lib/favorites";

const buckwheat = { recipeId: "recipe-buckwheat", recipeName: "Гречка" };
const pasta = { recipeId: "recipe-pasta", recipeName: "Паста" };

describe("favorites", () => {
  it("validates strict versioned envelopes and rejects duplicates", () => {
    expect(validateFavorites({ version: 1, items: [buckwheat] })).toEqual({
      version: 1,
      items: [buckwheat],
    });
    expect(
      validateFavorites({ version: 1, items: [buckwheat, buckwheat] }),
    ).toBeNull();
    expect(
      validateFavorites({ version: 1, items: [buckwheat], extra: true }),
    ).toBeNull();
    expect(validateFavorites({ version: 2, items: [] })).toBeNull();
  });

  it("adds each stable ID once and removes only the requested item", () => {
    const one = addFavorite({ version: 1, items: [] }, buckwheat);
    const repeated = addFavorite(one, buckwheat);
    expect(repeated.items).toHaveLength(1);
    const both = addFavorite(repeated, pasta);
    expect(removeFavorite(both, buckwheat.recipeId).items).toEqual([pasta]);
  });

  it("clears and merges by ID while preserving current snapshots", () => {
    const current = { version: 1 as const, items: [buckwheat] };
    const merged = mergeFavorites(current, {
      version: 1,
      items: [buckwheat, pasta],
    });
    expect(merged.items).toEqual([buckwheat, pasta]);
    expect(clearFavorites()).toEqual({ version: 1, items: [] });
  });

  it("rejects oversized and malformed data and round-trips a fragment", () => {
    const state = { version: 1 as const, items: [buckwheat, pasta] };
    const fragment = encodeFavoritesFragment(state);
    expect(decodeFavoritesFragment(fragment)).toEqual(state);
    expect(decodeFavoritesFragment("#favorites=%not-valid")).toBeNull();
    expect(
      validateFavorites({
        version: 1,
        items: Array.from({ length: 501 }, (_, index) => ({
          recipeId: `recipe-${index}`,
          recipeName: "Recipe",
        })),
      }),
    ).toBeNull();
  });
});
