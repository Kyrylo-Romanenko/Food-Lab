import { afterEach, describe, expect, it } from "vitest";
import {
  FAVORITES_STORAGE_KEY,
  readFavorites,
  subscribeFavorites,
  writeFavorites,
} from "../src/lib/favorites";

const original = globalThis.localStorage;
let data = new Map<string, string>();
let failGet = false;
let failSet = false;
let corruptReadback = false;
const originalWindow = globalThis.window;
const mock: Storage = {
  get length() {
    return data.size;
  },
  clear: () => data.clear(),
  getItem: (key) => {
    if (failGet) throw new DOMException("blocked");
    if (corruptReadback && key === FAVORITES_STORAGE_KEY) return "{}";
    return data.get(key) ?? null;
  },
  key: (index) => [...data.keys()][index] ?? null,
  removeItem: (key) => void data.delete(key),
  setItem: (key, value) => {
    if (failSet) throw new DOMException("quota", "QuotaExceededError");
    data.set(key, String(value));
  },
};

describe("favorites storage", () => {
  afterEach(() => {
    data = new Map();
    failGet = false;
    failSet = false;
    corruptReadback = false;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: original,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  });

  it("reads valid envelopes and rejects corrupt values", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: mock,
    });
    data.set(FAVORITES_STORAGE_KEY, JSON.stringify({ version: 1, items: [] }));
    expect(readFavorites().state).toEqual({ version: 1, items: [] });
    data.set(FAVORITES_STORAGE_KEY, "invalid");
    expect(readFavorites().persisted).toBe(false);
  });

  it("does not claim success when reads, writes, or read-back fail", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: mock,
    });
    failGet = true;
    expect(readFavorites().persisted).toBe(false);
    failGet = false;
    failSet = true;
    expect(writeFavorites({ version: 1, items: [] }).persisted).toBe(false);
    failSet = false;
    corruptReadback = true;
    expect(writeFavorites({ version: 1, items: [] }).persisted).toBe(false);
  });

  it("notifies listeners for same-document and cross-tab changes", () => {
    const target = new EventTarget();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: target,
    });
    let calls = 0;
    const unsubscribe = subscribeFavorites(() => calls++);
    target.dispatchEvent(new CustomEvent("foodlab:favorites-updated"));
    const event = Object.assign(new Event("storage"), {
      key: FAVORITES_STORAGE_KEY,
    });
    target.dispatchEvent(event);
    unsubscribe();
    expect(calls).toBe(2);
  });
});
