import { useEffect, useState } from "preact/hooks";
import {
  addFavorite,
  readFavorites,
  removeFavorite,
  subscribeFavorites,
  writeFavorites,
} from "../lib/favorites";

type Props = { recipeId: string; recipeName: string };

export default function FavoriteButton({ recipeId, recipeName }: Props) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => {
      const result = readFavorites();
      setSaved(result.state.items.some((item) => item.recipeId === recipeId));
      if (result.error) setMessage(result.error);
    };
    sync();
    return subscribeFavorites(sync);
  }, [recipeId]);

  const toggle = () => {
    const current = readFavorites();
    if (!current.persisted) {
      setMessage(current.error ?? "Не вдалося прочитати улюблені рецепти.");
      return;
    }
    const next = saved
      ? removeFavorite(current.state, recipeId)
      : addFavorite(current.state, { recipeId, recipeName });
    const result = writeFavorites(next);
    setMessage(
      result.persisted
        ? saved
          ? "Рецепт видалено з улюбленого."
          : "Рецепт додано до улюбленого."
        : (result.error ?? "Не вдалося зберегти улюблені рецепти."),
    );
  };

  return (
    <span class="favorite-control">
      <button
        type="button"
        class="favorite-button"
        data-favorite-button
        aria-label={`${saved ? "Видалити з улюбленого" : "Додати до улюбленого"}: ${recipeName}`}
        aria-pressed={saved}
        title={saved ? "Видалити з улюбленого" : "Додати до улюбленого"}
        onClick={toggle}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />
        </svg>
      </button>
      <span class="visually-hidden" role="status" aria-live="polite">
        {message}
      </span>
    </span>
  );
}
