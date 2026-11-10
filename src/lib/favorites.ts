export const FAVORITES_STORAGE_KEY = "foodlab:favorites:v1";
export const FAVORITES_EVENT = "foodlab:favorites-updated";
export const MAX_FAVORITES = 500;

export type Favorite = { recipeId: string; recipeName: string };
export type FavoritesEnvelope = { version: 1; items: Favorite[] };

export function validateFavorites(value: unknown): FavoritesEnvelope | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const envelope = value as Record<string, unknown>;
  if (
    Object.keys(envelope).sort().join(",") !== "items,version" ||
    envelope.version !== 1 ||
    !Array.isArray(envelope.items) ||
    envelope.items.length > MAX_FAVORITES
  )
    return null;

  const seen = new Set<string>();
  const items: Favorite[] = [];
  for (const value of envelope.items) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return null;
    const item = value as Record<string, unknown>;
    if (
      Object.keys(item).sort().join(",") !== "recipeId,recipeName" ||
      typeof item.recipeId !== "string" ||
      !item.recipeId.trim() ||
      item.recipeId.length > 256 ||
      typeof item.recipeName !== "string" ||
      !item.recipeName.trim() ||
      item.recipeName.length > 256 ||
      seen.has(item.recipeId)
    )
      return null;
    seen.add(item.recipeId);
    items.push({ recipeId: item.recipeId, recipeName: item.recipeName });
  }
  return { version: 1, items };
}

export const emptyFavorites = (): FavoritesEnvelope => ({
  version: 1,
  items: [],
});

export function addFavorite(
  state: FavoritesEnvelope,
  favorite: Favorite,
): FavoritesEnvelope {
  if (state.items.some((item) => item.recipeId === favorite.recipeId))
    return state;
  return (
    validateFavorites({ ...state, items: [...state.items, favorite] }) ?? state
  );
}

export function removeFavorite(
  state: FavoritesEnvelope,
  recipeId: string,
): FavoritesEnvelope {
  return {
    version: 1,
    items: state.items.filter((item) => item.recipeId !== recipeId),
  };
}

export const clearFavorites = (): FavoritesEnvelope => emptyFavorites();

export function mergeFavorites(
  current: FavoritesEnvelope,
  incoming: FavoritesEnvelope,
): FavoritesEnvelope {
  const items = [...current.items];
  const ids = new Set(items.map((item) => item.recipeId));
  for (const item of incoming.items) {
    if (!ids.has(item.recipeId) && items.length < MAX_FAVORITES) {
      ids.add(item.recipeId);
      items.push(item);
    }
  }
  return { version: 1, items };
}

export function encodeFavoritesFragment(state: FavoritesEnvelope): string {
  return `#favorites=${encodeURIComponent(JSON.stringify(state))}`;
}

export function decodeFavoritesFragment(
  fragment: string,
): FavoritesEnvelope | null {
  const prefix = "#favorites=";
  if (!fragment.startsWith(prefix)) return null;
  try {
    return validateFavorites(
      JSON.parse(decodeURIComponent(fragment.slice(prefix.length))),
    );
  } catch {
    return null;
  }
}

type StorageResult = {
  state: FavoritesEnvelope;
  persisted: boolean;
  error?: string;
};

export function readFavorites(): StorageResult {
  try {
    const raw = globalThis.localStorage?.getItem(FAVORITES_STORAGE_KEY);
    if (raw === null || raw === undefined)
      return { state: emptyFavorites(), persisted: true };
    const state = validateFavorites(JSON.parse(raw));
    return state
      ? { state, persisted: true }
      : {
          state: emptyFavorites(),
          persisted: false,
          error: "Збережений список не вдалося перевірити.",
        };
  } catch {
    return {
      state: emptyFavorites(),
      persisted: false,
      error: "Сховище улюбленого недоступне.",
    };
  }
}

export function writeFavorites(value: unknown): StorageResult {
  const state = validateFavorites(value);
  if (!state)
    return {
      state: emptyFavorites(),
      persisted: false,
      error: "Список улюбленого має некоректний формат.",
    };
  try {
    globalThis.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(state),
    );
    const saved = globalThis.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (
      !saved ||
      JSON.stringify(validateFavorites(JSON.parse(saved))) !==
        JSON.stringify(state)
    )
      throw new Error("Read-back validation failed");
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    return { state, persisted: true };
  } catch {
    return {
      state,
      persisted: false,
      error: "Не вдалося зберегти улюблені рецепти.",
    };
  }
}

export function subscribeFavorites(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener(FAVORITES_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
