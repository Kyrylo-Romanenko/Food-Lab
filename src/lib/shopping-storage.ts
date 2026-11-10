import {
  emptyShoppingState,
  legacyItemsToState,
  validateLegacyItems,
  validateShoppingState,
  type ShoppingState,
} from "./shopping";

export const SHOPPING_STORAGE_KEY = "foodlab:shopping:v2";
export const LEGACY_SHOPPING_STORAGE_KEY = "foodlab:shopping:v1";
export const SESSION_SHOPPING_STORAGE_KEY = "foodlab:shopping:session:v2";
export function createShoppingItemId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}
export type ReadResult = {
  state: ShoppingState;
  persisted: boolean;
  error?: string;
};
function storage(): Storage {
  return localStorage;
}
export function readSessionShoppingState(): ShoppingState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_SHOPPING_STORAGE_KEY);
    return raw === null ? null : validateShoppingState(JSON.parse(raw));
  } catch {
    return null;
  }
}
export function writeSessionShoppingState(value: ShoppingState): boolean {
  const valid = validateShoppingState(value);
  if (!valid) return false;
  try {
    sessionStorage.setItem(SESSION_SHOPPING_STORAGE_KEY, JSON.stringify(valid));
    return true;
  } catch {
    return false;
  }
}
export function readShoppingState(): ReadResult {
  const session = readSessionShoppingState();
  if (session)
    return {
      state: session,
      persisted: false,
      error: "Зміни відновлено лише для цього сеансу.",
    };
  try {
    const raw = storage().getItem(SHOPPING_STORAGE_KEY);
    if (raw !== null) {
      const valid = validateShoppingState(JSON.parse(raw));
      if (!valid)
        return {
          state: emptyShoppingState(),
          persisted: false,
          error: "Збережений список має некоректний формат. Дані не змінено.",
        };
      return { state: valid, persisted: true };
    }
    const legacyRaw = storage().getItem(LEGACY_SHOPPING_STORAGE_KEY);
    if (legacyRaw === null)
      return { state: emptyShoppingState(), persisted: true };
    const legacy = validateLegacyItems(JSON.parse(legacyRaw));
    if (!legacy)
      return {
        state: emptyShoppingState(),
        persisted: false,
        error: "Старий список не вдалося перевірити. Дані не змінено.",
      };
    const migrated = legacyItemsToState(legacy);
    const result = writeShoppingState(migrated);
    return result
      ? { state: migrated, persisted: true }
      : {
          state: migrated,
          persisted: false,
          error: "Список відкрито лише на цей сеанс. Старі дані збережено.",
        };
  } catch {
    return {
      state: emptyShoppingState(),
      persisted: false,
      error: "Сховище недоступне. Зміни діятимуть лише до закриття сторінки.",
    };
  }
}
export function writeShoppingState(value: ShoppingState): boolean {
  const valid = validateShoppingState(value);
  if (!valid) return false;
  let previous: string | null;
  try {
    previous = storage().getItem(SHOPPING_STORAGE_KEY);
  } catch {
    return false;
  }
  try {
    const store = storage();
    const raw = JSON.stringify(valid);
    store.setItem(SHOPPING_STORAGE_KEY, raw);
    const readback = store.getItem(SHOPPING_STORAGE_KEY);
    const verified =
      readback === null ? null : validateShoppingState(JSON.parse(readback));
    const written =
      !!verified && JSON.stringify(verified) === JSON.stringify(valid);
    if (written) {
      try {
        sessionStorage.removeItem(SESSION_SHOPPING_STORAGE_KEY);
      } catch {
        // The verified local copy remains authoritative.
      }
    }
    if (written) return true;
    restore(store, previous);
    return false;
  } catch {
    try {
      restore(storage(), previous);
    } catch {
      // Keep the storage error as a failed save result.
    }
    return false;
  }
}
function restore(store: Storage, value: string | null): void {
  if (value === null) store.removeItem(SHOPPING_STORAGE_KEY);
  else store.setItem(SHOPPING_STORAGE_KEY, value);
}
export function validateImportedState(value: unknown): ShoppingState | null {
  if (Array.isArray(value)) {
    const legacy = validateLegacyItems(value);
    return legacy ? legacyItemsToState(legacy) : null;
  }
  return validateShoppingState(value);
}
