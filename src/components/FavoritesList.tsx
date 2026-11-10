import { useEffect, useState } from "preact/hooks";
import {
  clearFavorites,
  decodeFavoritesFragment,
  encodeFavoritesFragment,
  emptyFavorites,
  mergeFavorites,
  readFavorites,
  removeFavorite,
  subscribeFavorites,
  writeFavorites,
  type Favorite,
  type FavoritesEnvelope,
} from "../lib/favorites";

type Recipe = { id: string; title: string; href: string };
type Props = { recipes: Recipe[] };

export default function FavoritesList({ recipes }: Props) {
  const [state, setState] = useState<FavoritesEnvelope>(emptyFavorites());
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  useEffect(() => {
    document
      .querySelector<HTMLElement>("[data-favorites-no-js]")
      ?.setAttribute("hidden", "");
    const sync = () => {
      const result = readFavorites();
      setState(result.state);
      if (result.error) setMessage(result.error);
      setLoaded(true);
    };
    sync();
    const unsubscribe = subscribeFavorites(sync);

    const incoming = decodeFavoritesFragment(window.location.hash);
    if (window.location.hash.startsWith("#favorites=")) {
      const knownRecipes =
        incoming &&
        incoming.items.every((item) => recipeById.has(item.recipeId));
      if (!incoming || !knownRecipes) {
        setMessage("Посилання містить некоректний або невідомий рецепт.");
      } else if (window.confirm("Додати рецепти з посилання до улюбленого?")) {
        const current = readFavorites();
        if (current.persisted) {
          const result = writeFavorites(
            mergeFavorites(current.state, incoming),
          );
          setMessage(
            result.persisted
              ? "Рецепти з посилання додано."
              : (result.error ?? "Не вдалося зберегти улюблені рецепти."),
          );
        } else {
          setMessage(current.error ?? "Не вдалося прочитати улюблені рецепти.");
        }
      } else {
        setMessage("Імпорт скасовано. Список не змінено.");
      }
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
    return unsubscribe;
  }, []);

  const commit = (next: FavoritesEnvelope, success: string) => {
    const result = writeFavorites(next);
    if (result.persisted) {
      setState(result.state);
      setMessage(success);
    } else {
      setMessage(result.error ?? "Не вдалося зберегти улюблені рецепти.");
    }
  };

  const share = async () => {
    if (!state.items.length) return;
    if (
      !window.confirm(
        "Будь-хто з посиланням зможе переглянути цей список рецептів. Продовжити?",
      )
    ) {
      setMessage("Поширення скасовано. Список не змінено.");
      return;
    }
    const url = `${location.origin}${location.pathname}${encodeFavoritesFragment(state)}`;
    setShareUrl(url);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Улюблені рецепти", url });
        setMessage("Список передано для поширення.");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMessage("Поширення скасовано. Список не змінено.");
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Посилання на улюблені рецепти скопійовано.");
    } catch {
      setMessage("Скопіюйте посилання з поля нижче.");
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Посилання скопійовано.");
    } catch {
      setMessage("Не вдалося скопіювати посилання.");
    }
  };

  return (
    <section class="favorites-list" aria-label="Улюблені рецепти">
      <p class="favorites-feedback" role="status" aria-live="polite">
        {message}
      </p>
      {loaded && state.items.length === 0 ? (
        <p class="empty">
          Улюблених рецептів поки немає. Позначте зірочкою рецепт, щоб зберегти
          його тут.
        </p>
      ) : (
        <>
          <ul class="favorites-items">
            {state.items.map((item: Favorite) => {
              const recipe = recipeById.get(item.recipeId);
              return (
                <li key={item.recipeId}>
                  {recipe ? (
                    <a href={recipe.href}>{recipe.title}</a>
                  ) : (
                    <div>
                      <strong>{item.recipeName}</strong>
                      <p>Рецепт більше недоступний у збірці.</p>
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={`Видалити ${recipe?.title ?? item.recipeName} з улюбленого`}
                    onClick={() =>
                      commit(
                        removeFavorite(state, item.recipeId),
                        "Рецепт видалено з улюбленого.",
                      )
                    }
                  >
                    Видалити
                  </button>
                </li>
              );
            })}
          </ul>
          {state.items.length > 0 && (
            <div class="favorites-actions">
              <button type="button" onClick={share}>
                Поділитися
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Очистити всі улюблені рецепти?"))
                    commit(clearFavorites(), "Список улюбленого очищено.");
                }}
              >
                Очистити список
              </button>
            </div>
          )}
          {shareUrl && (
            <div class="favorites-share-link">
              <label for="favorites-share-url">Посилання на копію списку</label>
              <input id="favorites-share-url" readOnly value={shareUrl} />
              <button type="button" onClick={copyShareUrl}>
                Скопіювати посилання
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
