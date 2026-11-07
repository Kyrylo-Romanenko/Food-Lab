import { describe, expect, it } from "vitest";
import {
  factorFromAmount,
  factorFromPortions,
  formatAmount,
  formatPortions,
  parseAmount,
  scaleAmount,
  validateStoredState,
} from "../src/lib/calculator";

describe("calculator pure logic", () => {
  it.each([
    ["1,5", 1.5],
    ["1.5", 1.5],
    ["1/2", 0.5],
    ["1 1/2", 1.5],
  ])("parses %s", (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each([
    "",
    "0",
    "abc",
    "-1",
    "NaN",
    "1/0",
    "0/2",
    "1 3/2",
    "1,2.3",
    "Infinity",
  ])("rejects %s", (input) => expect(parseAmount(input)).toBeNull());

  it("always scales from the original amount", () => {
    expect(scaleAmount(160, 0.5)).toBe(80);
    expect(scaleAmount(160, 2)).toBe(320);
  });

  it("derives bounded factors from original amounts and portions", () => {
    expect(factorFromAmount(3, 2)).toBeCloseTo(2 / 3);
    expect(factorFromAmount(160, 9999)).toBeNull();
    expect(factorFromAmount(160, 16)).toBe(0.1);
    expect(factorFromAmount(1, 20)).toBe(20);
    expect(factorFromPortions(1, 2)).toBe(0.5);
    expect(factorFromPortions(40, 2)).toBe(20);
    expect(factorFromPortions(41, 2)).toBeNull();
  });

  it.each([
    [1, "1 порція"],
    [2, "2 порції"],
    [4, "4 порції"],
    [5, "5 порцій"],
    [11, "11 порцій"],
    [21, "21 порція"],
    [2.666, "≈ 2,7 порції"],
  ])("formats %s portions", (value, expected) => {
    expect(formatPortions(value)).toBe(expected);
  });

  it.each([
    [0.5, "½"],
    [0.25, "¼"],
    [0.75, "¾"],
    [1.5, "1½"],
    [3.333, "3,33"],
  ])("formats countable amount %s", (value, expected) => {
    expect(formatAmount(value, "piece")).toBe(expected);
  });

  it("validates stored state against this recipe's original ingredients", () => {
    const ingredients = [{ id: "egg", quantity: 3, unit: "piece" }];
    expect(
      validateStoredState(
        { anchorId: "egg", enteredValue: 2, factor: 2 / 3 },
        ingredients,
      ),
    ).toEqual({ anchorId: "egg", enteredValue: 2, factor: 2 / 3 });
    expect(
      validateStoredState(
        { anchorId: "other", enteredValue: 2, factor: 2 / 3 },
        ingredients,
      ),
    ).toBeNull();
  });

  it("accepts the inclusive factor bounds and rejects outside values", () => {
    const ingredients = [{ id: "grain", quantity: 100, unit: "g" }];
    expect(
      validateStoredState(
        { anchorId: null, enteredValue: null, factor: 0.1 },
        ingredients,
      ),
    ).not.toBeNull();
    expect(
      validateStoredState(
        { anchorId: null, enteredValue: null, factor: 20 },
        ingredients,
      ),
    ).not.toBeNull();
    expect(
      validateStoredState(
        { anchorId: null, enteredValue: null, factor: 0.09 },
        ingredients,
      ),
    ).toBeNull();
    expect(
      validateStoredState(
        { anchorId: null, enteredValue: null, factor: 20.1 },
        ingredients,
      ),
    ).toBeNull();
  });
});
