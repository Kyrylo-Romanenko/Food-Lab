import { afterEach, describe, expect, it } from "vitest";
import {
  LEGACY_SHOPPING_STORAGE_KEY,
  readShoppingState,
  SHOPPING_STORAGE_KEY,
  writeShoppingState,
} from "../src/lib/shopping-storage";
import { emptyShoppingState } from "../src/lib/shopping";
import { mergeImportedShoppingState } from "../src/lib/shopping";
import { validateImportedState } from "../src/lib/shopping-storage";

const original = globalThis.localStorage;
let data = new Map<string, string>();
let failSet = false;
let failReadback = false;
let failGet = false;
let afterWrite = false;
const mock: Storage = {
  get length() {
    return data.size;
  },
  clear: () => data.clear(),
  getItem: (key) => {
    if (failGet) throw new DOMException("blocked");
    if (afterWrite && key === SHOPPING_STORAGE_KEY) {
      afterWrite = false;
      if (failReadback) return "bad";
    }
    return data.get(key) ?? null;
  },
  key: (index) => [...data.keys()][index] ?? null,
  removeItem: (key) => void data.delete(key),
  setItem: (key, value) => {
    if (failSet) throw new DOMException("quota", "QuotaExceededError");
    data.set(key, String(value));
    afterWrite = true;
  },
};
const install = () =>
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: mock,
  });
const oldItems = [
  {
    id: "old",
    name: "Морква",
    quantity: 0,
    unit: "g",
    category: "Овочі",
    purchased: true,
    sources: [
      {
        recipeId: "hrechka-z-morkvoiu",
        recipeName: "Гречка з морквою",
        quantity: 0,
        unit: "g",
      },
    ],
  },
];
describe("shopping storage", () => {
  afterEach(() => {
    data = new Map();
    failSet = false;
    failReadback = false;
    failGet = false;
    afterWrite = false;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: original,
    });
  });
  it("migrates legacy rows without inferring selected recipes and preserves the source", () => {
    install();
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(oldItems));
    const result = readShoppingState();
    expect(result.persisted).toBe(true);
    expect(result.state.selectedRecipes).toEqual([]);
    expect(result.state.contributions[0]).toMatchObject({
      id: "old",
      amount: { kind: "measured", quantity: 0, unit: "g" },
      purchased: true,
      sources: oldItems[0]?.sources,
    });
    expect(result.state.cart).toContain("legacy:old:mass");
    expect(data.get(LEGACY_SHOPPING_STORAGE_KEY)).toBe(
      JSON.stringify(oldItems),
    );
  });
  it("preserves a null legacy amount and its original unit", () => {
    install();
    const items = [
      {
        id: "old-null",
        name: "Крупа",
        quantity: null,
        unit: "кг",
        category: "Бакалія",
        purchased: false,
        sources: [],
      },
    ];
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(items));
    const result = readShoppingState();
    expect(result.state.contributions[0]).toMatchObject({
      unit: "кг",
      amount: { kind: "unspecified" },
      category: "Бакалія",
    });
  });
  it("does not overwrite malformed v1 or malformed v2", () => {
    install();
    data.set(LEGACY_SHOPPING_STORAGE_KEY, "bad");
    expect(readShoppingState().persisted).toBe(false);
    expect(data.get(LEGACY_SHOPPING_STORAGE_KEY)).toBe("bad");
    data.set(SHOPPING_STORAGE_KEY, "bad");
    expect(readShoppingState().persisted).toBe(false);
    expect(data.get(SHOPPING_STORAGE_KEY)).toBe("bad");
  });
  it("does not overwrite a versioned state with invalid nested fields", () => {
    install();
    const invalid = { ...emptyShoppingState(), contributions: [{ id: "x" }] };
    const raw = JSON.stringify(invalid);
    data.set(SHOPPING_STORAGE_KEY, raw);
    expect(readShoppingState().persisted).toBe(false);
    expect(data.get(SHOPPING_STORAGE_KEY)).toBe(raw);
  });
  it("rejects malformed nested legacy source data without writing v2", () => {
    install();
    const invalid = [{ ...oldItems[0], sources: [{ recipeId: "x" }] }];
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(invalid));
    expect(readShoppingState().persisted).toBe(false);
    expect(data.has(SHOPPING_STORAGE_KEY)).toBe(false);
  });
  it("validates a write by reading the saved state back", () => {
    install();
    expect(writeShoppingState(emptyShoppingState())).toBe(true);
    const before = data.get(SHOPPING_STORAGE_KEY);
    failReadback = true;
    expect(writeShoppingState(emptyShoppingState())).toBe(false);
    expect(data.get(SHOPPING_STORAGE_KEY)).toBe(before);
  });
  it("keeps data when storage is blocked or quota fails", () => {
    install();
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(oldItems));
    failSet = true;
    expect(readShoppingState().persisted).toBe(false);
    expect(data.get(LEGACY_SHOPPING_STORAGE_KEY)).toBe(
      JSON.stringify(oldItems),
    );
  });
  it("reports blocked reads without attempting a write", () => {
    install();
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(oldItems));
    failGet = true;
    expect(readShoppingState().persisted).toBe(false);
    expect(data.has(SHOPPING_STORAGE_KEY)).toBe(false);
  });
  it("does not migrate the same v1 list repeatedly", () => {
    install();
    data.set(LEGACY_SHOPPING_STORAGE_KEY, JSON.stringify(oldItems));
    expect(readShoppingState().state.contributions).toHaveLength(1);
    expect(readShoppingState().state.contributions).toHaveLength(1);
  });
  it("validates legacy-array and versioned-envelope imports", () => {
    expect(validateImportedState(oldItems)?.contributions).toHaveLength(1);
    expect(validateImportedState(emptyShoppingState())).toMatchObject({
      version: 2,
    });
    expect(
      validateImportedState([
        { ...oldItems[0], sources: [{ recipeId: "bad" }] },
      ]),
    ).toBeNull();
  });
  it("merges imported items without replacing current state and remaps collisions", () => {
    const current = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "same",
          origin: "manual" as const,
          name: "Поточний",
          amount: { kind: "measured" as const, quantity: 1, unit: "g" },
        },
      ],
    };
    const incoming = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "same",
          origin: "manual" as const,
          name: "Імпортований",
          amount: { kind: "measured" as const, quantity: 2, unit: "g" },
        },
      ],
    };
    const merged = mergeImportedShoppingState(
      current,
      incoming,
      () => "new-id",
    );
    expect(merged?.contributions.map((item) => item.name)).toEqual([
      "Поточний",
      "Імпортований",
    ]);
    expect(merged?.contributions[1]?.id).toBe("new-id");
    expect(
      mergeImportedShoppingState(current, { version: 2 }, () => "unused"),
    ).toBeNull();
    expect(current.contributions).toHaveLength(1);
  });
  it("remaps colliding legacy imports and leaves current data untouched on invalid input", () => {
    const current = {
      ...emptyShoppingState(),
      contributions: [
        {
          id: "old",
          origin: "legacy" as const,
          name: "Поточний товар",
          amount: { kind: "measured" as const, quantity: 1, unit: "g" },
          unit: "g",
          category: "Інше",
          purchased: false,
          sources: [],
        },
      ],
    };
    const imported = mergeImportedShoppingState(
      current,
      validateImportedState(oldItems),
      () => "old-copy",
    );
    expect(imported?.contributions.map((item) => item.id)).toEqual([
      "old",
      "old-copy",
    ]);
    expect(imported?.cart).toContain("legacy:old-copy:mass");
    expect(
      mergeImportedShoppingState(
        current,
        [{ ...oldItems[0], sources: [{ recipeId: "invalid" }] }],
        () => "unused",
      ),
    ).toBeNull();
    expect(current.contributions[0]?.name).toBe("Поточний товар");
  });
});
