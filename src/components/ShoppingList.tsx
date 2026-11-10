import { useEffect, useState } from "preact/hooks";
import {
  buildShoppingRows,
  clearChangedAmountOverrides,
  emptyShoppingState,
  mergeImportedShoppingState,
  removeShoppingRow,
  resetChangedCartRows,
  setShoppingRowAmount,
  type Contribution,
  type SelectedRecipe,
  type ShoppingState,
} from "../lib/shopping";
import {
  createShoppingItemId,
  readShoppingState,
  SHOPPING_STORAGE_KEY,
  validateImportedState,
  writeSessionShoppingState,
  writeShoppingState,
} from "../lib/shopping-storage";

const unitNames: Record<string, string> = { g: "г", ml: "мл", piece: "шт." };
const amountText = (value: number, unit: string) => {
  const quantity = new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 2,
  }).format(value);
  const label = unitNames[unit] ?? unit;
  return label ? `${quantity} ${label}` : quantity;
};

export default function ShoppingList() {
  const [state, setState] = useState<ShoppingState>(emptyShoppingState),
    [loaded, setLoaded] = useState(false),
    [persisted, setPersisted] = useState(true),
    [message, setMessage] = useState(""),
    [name, setName] = useState(""),
    [quantity, setQuantity] = useState(""),
    [unit, setUnit] = useState("piece"),
    [shareAvailable, setShareAvailable] = useState(false),
    [copyFallback, setCopyFallback] = useState(""),
    [editingRow, setEditingRow] = useState<{
      key: string;
      value: string;
    } | null>(null),
    [undo, setUndo] = useState<{
      contributions: Contribution[];
      recipes: SelectedRecipe[];
      recipeIngredients?: {
        recipeId: string;
        ingredients: SelectedRecipe["ingredients"];
      }[];
      amountOverrides?: ShoppingState["amountOverrides"];
    } | null>(null),
    [importState, setImportState] = useState<ShoppingState | null>(null);
  useEffect(() => {
    setShareAvailable(typeof navigator !== "undefined" && "share" in navigator);
    const result = readShoppingState();
    setState(result.state);
    setPersisted(result.persisted);
    if (result.error) setMessage(result.error);
    setLoaded(true);
    const refresh = (event: StorageEvent) => {
      if (event.key === SHOPPING_STORAGE_KEY) {
        const next = readShoppingState();
        setState(next.state);
        setPersisted(next.persisted);
      }
    };
    window.addEventListener("storage", refresh);
    try {
      if (location.hash.startsWith("#list=")) {
        const data = JSON.parse(
          new TextDecoder().decode(
            Uint8Array.from(atob(location.hash.slice(6)), (c) =>
              c.charCodeAt(0),
            ),
          ),
        );
        const imported = validateImportedState(data);
        if (imported) setImportState(imported);
        else setMessage("Посилання містить некоректний список.");
      }
    } catch {
      setMessage("Посилання містить некоректний список.");
    }
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const rows = buildShoppingRows(state);
  function commit(next: ShoppingState, success: string) {
    setState(next);
    const ok = persisted && writeShoppingState(next);
    const sessionSaved = !ok && writeSessionShoppingState(next);
    setPersisted(ok);
    setMessage(
      ok
        ? success
        : sessionSaved
          ? "Зміни діють лише на цей сеанс. Не вдалося зберегти їх постійно."
          : "Зміни є лише в пам’яті сторінки. Сховище недоступне.",
    );
    if (ok || sessionSaved)
      window.dispatchEvent(new Event("foodlab:shopping-updated"));
  }
  function commitNeedChange(next: ShoppingState, success: string) {
    commit(
      resetChangedCartRows(state, clearChangedAmountOverrides(state, next)),
      success,
    );
  }
  function updateSelected(recipeId: string, portions: number) {
    const recipe = state.selectedRecipes.find((r) => r.recipeId === recipeId);
    if (
      !recipe ||
      !Number.isFinite(portions) ||
      portions / recipe.basePortions < 0.1 ||
      portions / recipe.basePortions > 20
    )
      return;
    commitNeedChange(
      {
        ...state,
        selectedRecipes: state.selectedRecipes.map((r) =>
          r.recipeId === recipeId ? { ...r, selectedPortions: portions } : r,
        ),
      },
      "Порції у списку оновлено.",
    );
  }
  function addManual(event: SubmitEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const q = quantity.trim() ? Number(quantity) : null;
    if (q !== null && (!Number.isFinite(q) || q < 0)) return;
    const contribution = {
      id: createShoppingItemId(),
      origin: "manual" as const,
      name: name.trim(),
      amount:
        q === null
          ? { kind: "unspecified" as const }
          : {
              kind: "measured" as const,
              quantity: q,
              unit: unit.trim() || "шт.",
            },
    };
    commit(
      { ...state, contributions: [...state.contributions, contribution] },
      `${name.trim()} додано.`,
    );
    setName("");
    setQuantity("");
    setUnit("piece");
  }
  function saveRowAmount(key: string, raw: string) {
    const row = rows.find((item) => item.key === key);
    if (!row || row.baseNeeded === null) return;
    const quantity = raw.trim() ? Number(raw) : row.baseNeeded;
    if (!Number.isFinite(quantity) || quantity < 0) {
      setMessage("Вкажіть невід’ємну кількість.");
      return;
    }
    const next = setShoppingRowAmount(state, key, quantity);
    if (next) commitNeedChange(next, "Кількість у списку оновлено.");
    setEditingRow(null);
  }
  function deleteRow(key: string) {
    const next = removeShoppingRow(state, key);
    const removedContributions = state.contributions.filter(
      (item) =>
        !next.contributions.some((candidate) => candidate.id === item.id),
    );
    const recipeIngredients = state.selectedRecipes.flatMap((recipe) => {
      const remaining =
        next.selectedRecipes.find(
          (candidate) => candidate.recipeId === recipe.recipeId,
        )?.ingredients ?? [];
      const identity = (item: SelectedRecipe["ingredients"][number]) =>
        `${item.ingredientId}:${item.amount.kind}:${item.amount.kind === "measured" ? `${item.amount.quantity}:${item.amount.unit}` : ""}`;
      const removed = recipe.ingredients.filter(
        (item) =>
          !remaining.some(
            (candidate) => identity(candidate) === identity(item),
          ),
      );
      return removed.length
        ? [{ recipeId: recipe.recipeId, ingredients: removed }]
        : [];
    });
    setUndo({
      contributions: removedContributions,
      recipes: [],
      recipeIngredients,
      amountOverrides: state.amountOverrides.filter((item) => item.key === key),
    });
    commitNeedChange(next, "Товар видалено зі списку.");
  }
  const shareText = () =>
    rows
      .map(
        (r) =>
          `${r.inCart ? "[x]" : "[ ]"} ${r.name}${r.toBuy !== null ? ` — ${amountText(r.toBuy, r.unit)}` : " — за смаком"}`,
      )
      .join("\n");
  async function copyText(value: string, success: string, fallback: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopyFallback("");
        setMessage(success);
        return;
      }
    } catch {
      // Try the local selection fallback below.
    }
    setCopyFallback(value);
    setMessage(fallback);
  }
  function copy() {
    return copyText(
      `Список покупок\n${shareText()}`,
      "Список скопійовано.",
      "Автоматичне копіювання недоступне. Виділіть і скопіюйте текст нижче.",
    );
  }
  async function copyLink() {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(state));
      let binary = "";
      for (let index = 0; index < bytes.length; index += 0x8000)
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
      const encoded = btoa(binary);
      const url = `${location.origin}${location.pathname}#list=${encoded}`;
      setMessage(
        "Посилання містить копію списку, яку зможе прочитати кожен, хто його має.",
      );
      await copyText(
        url,
        "Посилання скопійовано. Кожен, хто його має, зможе прочитати список.",
        "Автоматичне копіювання недоступне. Виділіть і скопіюйте посилання нижче.",
      );
    } catch {
      setMessage("Не вдалося створити посилання.");
    }
  }
  return (
    <section class="shopping">
      <h1>Список покупок</h1>
      <p role="status" hidden={!message}>
        {message}
        {!persisted && (
          <strong> Не закривайте сторінку, щоб не втратити зміни.</strong>
        )}
      </p>
      {importState && (
        <div class="shopping-import">
          <p>
            У посиланні є копія списку. Імпорт додасть її до поточного списку.
          </p>
          <button
            onClick={() => {
              const next = mergeImportedShoppingState(
                state,
                importState,
                createShoppingItemId,
              );
              if (next) commit(next, "Дані додано до списку.");
              else
                setMessage(
                  "Не вдалося перевірити імпорт. Поточний список не змінено.",
                );
              setImportState(null);
            }}
          >
            Імпортувати
          </button>
          <button onClick={() => setImportState(null)}>Скасувати</button>
        </div>
      )}
      <form onSubmit={addManual} class="shopping-form">
        <label for="shopping-name">Товар</label>
        <input
          id="shopping-name"
          required
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <label for="shopping-quantity">Кількість</label>
        <input
          id="shopping-quantity"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={quantity}
          onInput={(e) => setQuantity(e.currentTarget.value)}
        />
        <label for="shopping-unit">Одиниця</label>
        <select
          id="shopping-unit"
          value={unit}
          onChange={(e) => setUnit(e.currentTarget.value)}
        >
          <option value="piece">шт.</option>
          <option value="g">г</option>
          <option value="kg">кг</option>
          <option value="ml">мл</option>
          <option value="l">л</option>
        </select>
        <button class="shopping-add-button">Додати товар</button>
      </form>
      {loaded && rows.length === 0 && (
        <p class="shopping-empty">
          Список порожній. Додайте товар або інгредієнти з рецепта.
        </p>
      )}
      {state.selectedRecipes.length > 0 && (
        <section class="shopping-selected">
          <h2>Обрані рецепти</h2>
          {state.selectedRecipes.map((recipe) => (
            <article class="shopping-recipe" key={recipe.recipeId}>
              <h3>{recipe.recipeName}</h3>
              <label>
                Порції{" "}
                <input
                  type="number"
                  min={recipe.basePortions * 0.1}
                  max={recipe.basePortions * 20}
                  step="any"
                  value={recipe.selectedPortions}
                  onChange={(e) =>
                    updateSelected(
                      recipe.recipeId,
                      Number(e.currentTarget.value),
                    )
                  }
                />
              </label>
              <button
                onClick={() => {
                  setUndo({ contributions: [], recipes: [recipe] });
                  commitNeedChange(
                    {
                      ...state,
                      selectedRecipes: state.selectedRecipes.filter(
                        (r) => r.recipeId !== recipe.recipeId,
                      ),
                    },
                    "Рецепт видалено зі списку.",
                  );
                }}
              >
                Видалити рецепт
              </button>
            </article>
          ))}
        </section>
      )}
      {rows.length > 0 && (
        <>
          <p class="shopping-summary">
            {rows.filter((r) => r.inCart).length} із {rows.length} у кошику
          </p>
          <ul class="shopping-rows">
            {rows.map((row) => {
              const contributions = row.contributionIds
                .map((id) => state.contributions.find((item) => item.id === id))
                .filter((item): item is Contribution => item !== undefined);
              return (
                <li key={row.key} class={row.inCart ? "purchased" : ""}>
                  <label class="shopping-row-name">
                    <input
                      type="checkbox"
                      checked={row.inCart}
                      aria-label={`${row.name}: ${row.inCart ? "у кошику" : "позначити в кошику"}`}
                      onChange={(e) =>
                        commit(
                          {
                            ...state,
                            cart: e.currentTarget.checked
                              ? [...state.cart, row.key]
                              : state.cart.filter((k) => k !== row.key),
                          },
                          e.currentTarget.checked
                            ? "Додано до кошика."
                            : "Товар повернуто до списку.",
                        )
                      }
                    />
                    <span class="shopping-row-copy">
                      <span>{row.name}</span>
                      {row.sources.length > 0 && (
                        <small title={row.sources.join(", ")}>
                          {row.sources.join(", ")}
                        </small>
                      )}
                    </span>
                  </label>
                  <strong class="shopping-row-amount">
                    {row.toBuy === null
                      ? "за смаком"
                      : amountText(row.toBuy, row.unit)}
                    {row.hasUnspecified && row.toBuy !== null
                      ? " · також за смаком"
                      : ""}
                  </strong>
                  <details class="shopping-row-menu">
                    <summary
                      aria-label={`Редагувати ${row.name}`}
                      title={`Редагувати ${row.name}`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m14 5 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z" />
                      </svg>
                    </summary>
                    <div class="shopping-row-menu-content">
                      {editingRow?.key === row.key &&
                      row.baseNeeded !== null ? (
                        <div class="shopping-row-edit-form">
                          <label>
                            Кількість ({unitNames[row.unit] ?? row.unit})
                            <input
                              type="number"
                              min="0"
                              step="any"
                              inputMode="decimal"
                              value={editingRow.value}
                              onInput={(event) =>
                                setEditingRow({
                                  key: row.key,
                                  value: event.currentTarget.value,
                                })
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  saveRowAmount(row.key, editingRow.value);
                                }
                              }}
                            />
                          </label>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                saveRowAmount(row.key, editingRow.value)
                              }
                            >
                              Зберегти
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingRow(null)}
                            >
                              Скасувати
                            </button>
                          </div>
                        </div>
                      ) : row.needed !== null && row.baseNeeded !== null ? (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingRow({
                              key: row.key,
                              value: String(row.needed),
                            })
                          }
                        >
                          Змінити кількість
                        </button>
                      ) : null}
                      {contributions.length > 0 && (
                        <div class="shopping-row-menu-group">
                          {contributions.map((contribution) => (
                            <div
                              class="shopping-row-menu-group"
                              key={contribution.id}
                            >
                              {contribution.origin === "manual" && (
                                <button
                                  type="button"
                                  aria-label={`Змінити назву ${contribution.name}`}
                                  title="Змінити назву"
                                  onClick={() => {
                                    const nextName = prompt(
                                      "Назва товару",
                                      contribution.name,
                                    );
                                    if (nextName?.trim())
                                      commitNeedChange(
                                        {
                                          ...state,
                                          contributions:
                                            state.contributions.map((item) =>
                                              item.id === contribution.id
                                                ? {
                                                    ...item,
                                                    name: nextName.trim(),
                                                  }
                                                : item,
                                            ),
                                        },
                                        "Товар змінено.",
                                      );
                                  }}
                                >
                                  Змінити назву
                                </button>
                              )}
                              <button
                                type="button"
                                aria-label={`Видалити джерело ${contribution.name}`}
                                title="Видалити джерело"
                                onClick={() => {
                                  setUndo({
                                    contributions: [contribution],
                                    recipes: [],
                                  });
                                  commitNeedChange(
                                    {
                                      ...state,
                                      contributions: state.contributions.filter(
                                        (item) => item.id !== contribution.id,
                                      ),
                                    },
                                    "Джерело видалено.",
                                  );
                                }}
                              >
                                Видалити джерело
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                  <button
                    type="button"
                    class="shopping-row-delete"
                    aria-label={`Видалити ${row.name} зі списку`}
                    title={`Видалити ${row.name} зі списку`}
                    onClick={() => deleteRow(row.key)}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {undo && (
        <button
          onClick={() => {
            commit(
              {
                ...state,
                amountOverrides: [
                  ...state.amountOverrides,
                  ...(undo.amountOverrides ?? []).filter(
                    (item) =>
                      !state.amountOverrides.some(
                        (current) => current.key === item.key,
                      ),
                  ),
                ],
                contributions: [
                  ...state.contributions,
                  ...undo.contributions.filter(
                    (c) => !state.contributions.some((x) => x.id === c.id),
                  ),
                ],
                selectedRecipes: [
                  ...state.selectedRecipes.map((recipe) => {
                    const removed = undo.recipeIngredients?.find(
                      (item) => item.recipeId === recipe.recipeId,
                    );
                    if (!removed) return recipe;
                    const identity = (
                      item: SelectedRecipe["ingredients"][number],
                    ) =>
                      `${item.ingredientId}:${item.amount.kind}:${item.amount.kind === "measured" ? `${item.amount.quantity}:${item.amount.unit}` : ""}`;
                    const current = new Set(recipe.ingredients.map(identity));
                    return {
                      ...recipe,
                      ingredients: [
                        ...recipe.ingredients,
                        ...removed.ingredients.filter(
                          (item) => !current.has(identity(item)),
                        ),
                      ],
                    };
                  }),
                  ...undo.recipes.filter(
                    (recipe) =>
                      !state.selectedRecipes.some(
                        (current) => current.recipeId === recipe.recipeId,
                      ),
                  ),
                ],
              },
              "Видалення скасовано.",
            );
            setUndo(null);
          }}
        >
          Скасувати останнє видалення
        </button>
      )}
      {rows.length > 0 && (
        <div class="shopping-actions">
          <div
            class="shopping-share-actions"
            role="group"
            aria-label="Дії зі списком"
          >
            <button
              type="button"
              aria-label="Копіювати список"
              title="Копіювати список"
              onClick={copy}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="8" y="8" width="12" height="13" rx="2" />
                <path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Копіювати посилання"
              title="Копіювати посилання"
              onClick={copyLink}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7" />
                <path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7" />
              </svg>
            </button>
            {shareAvailable && (
              <button
                type="button"
                aria-label="Поділитися списком"
                title="Поділитися списком"
                onClick={() =>
                  navigator
                    .share({ title: "Список покупок", text: shareText() })
                    .catch(() =>
                      setMessage("Поширення скасовано або недоступне."),
                    )
                }
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" />
                </svg>
              </button>
            )}
          </div>
          <div class="shopping-clear-actions">
            <button
              type="button"
              aria-label="Очистити список"
              title="Очистити список"
              onClick={() => {
                if (
                  confirm(
                    "Очистити список покупок? Старий список залишиться у браузері як резервна копія.",
                  )
                )
                  commit(emptyShoppingState(), "Список очищено.");
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {copyFallback && (
        <label class="shopping-copy-fallback">
          Скопіюйте вручну:
          <textarea
            rows={3}
            readOnly
            value={copyFallback}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
      <noscript>
        <p class="shopping-empty">
          Увімкніть JavaScript, щоб переглянути список і керувати ним.
        </p>
      </noscript>
    </section>
  );
}
