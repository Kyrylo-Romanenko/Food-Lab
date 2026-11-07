import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  formatAmount,
  formatPortions,
  factorFromAmount,
  factorFromPortions,
  MAX_FACTOR,
  MIN_FACTOR,
  parseAmount,
  scaleAmount,
  validateStoredState,
  type CalculatorState,
  type ScalableIngredient,
} from "../lib/calculator";

interface MeasuredAmount {
  kind: "measured";
  quantity: number;
  unit: string;
}

interface ToTasteAmount {
  kind: "to-taste";
}

interface Ingredient {
  id: string;
  name: string;
  amount: MeasuredAmount | ToTasteAmount;
}

interface Props {
  slug: string;
  recipeName?: string;
  servings: number;
  ingredients: Ingredient[];
  fallbackId: string;
}

const unitLabels: Record<string, string> = {
  g: "г",
  kg: "кг",
  ml: "мл",
  l: "л",
  tsp: "ч. л.",
  tbsp: "ст. л.",
  piece: "шт.",
};

function storageKey(slug: string): string {
  return `foodlab:calc:v1:${slug}`;
}

function getStoredState(
  slug: string,
  scalable: ScalableIngredient[],
): CalculatorState {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return { anchorId: null, enteredValue: null, factor: 1 };
    const valid = validateStoredState(JSON.parse(raw), scalable);
    if (valid) return valid;
    localStorage.removeItem(storageKey(slug));
  } catch {
    try {
      localStorage.removeItem(storageKey(slug));
    } catch {
      // Keep the calculator available for this session when storage is blocked.
    }
  }
  return { anchorId: null, enteredValue: null, factor: 1 };
}

function saveState(slug: string, state: CalculatorState): void {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(state));
  } catch {
    // Storage is optional. The current page state remains active.
  }
}

function ingredientText(ingredient: Ingredient, quantity: number): string {
  if (ingredient.amount.kind === "to-taste") return "за смаком";
  return `${formatAmount(quantity, ingredient.amount.unit)} ${unitLabels[ingredient.amount.unit]}`;
}

export default function IngredientCalculator({
  slug,
  recipeName = slug,
  servings,
  ingredients,
  fallbackId,
}: Props) {
  const scalable = useMemo(
    () =>
      ingredients.flatMap((ingredient) =>
        ingredient.amount.kind === "measured"
          ? [
              {
                id: ingredient.id,
                quantity: ingredient.amount.quantity,
                unit: ingredient.amount.unit,
              },
            ]
          : [],
      ),
    [ingredients],
  );
  const [state, setState] = useState(() => getStoredState(slug, scalable));
  const [mode, setMode] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      ingredients.map((ingredient) => [
        ingredient.id,
        ingredient.amount.kind === "measured"
          ? formatAmount(
              ingredient.amount.quantity * state.factor,
              ingredient.amount.unit,
            )
          : "",
      ]),
    ),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState("");
  const amountInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const factor = state.factor;
  const portionValue = servings * factor;
  const anchor = state.anchorId
    ? ingredients.find((ingredient) => ingredient.id === state.anchorId)
    : undefined;

  useLayoutEffect(() => {
    document.getElementById(fallbackId)?.setAttribute("hidden", "");
  }, [fallbackId]);

  function displayedQuantity(ingredient: Ingredient): number {
    return ingredient.amount.kind === "measured"
      ? scaleAmount(ingredient.amount.quantity, factor)
      : 0;
  }

  function addToShopping(ingredient: Ingredient): void {
    if (ingredient.amount.kind !== "measured") return;
    window.dispatchEvent(
      new CustomEvent("foodlab:shopping-add", {
        detail: {
          recipeId: slug,
          recipeName,
          name: ingredient.name,
          quantity: displayedQuantity(ingredient),
          unit: ingredient.amount.unit,
          category: "Інше",
        },
      }),
    );
    setAnnouncement(`${ingredient.name} додано до списку покупок`);
  }

  function syncDrafts(nextFactor: number): Record<string, string> {
    return Object.fromEntries(
      ingredients.map((ingredient) => [
        ingredient.id,
        ingredient.amount.kind === "measured"
          ? formatAmount(
              scaleAmount(ingredient.amount.quantity, nextFactor),
              ingredient.amount.unit,
            )
          : "",
      ]),
    );
  }

  function setCalculation(next: CalculatorState): void {
    setState(next);
    saveState(slug, next);
    setDrafts(syncDrafts(next.factor));
    setErrors({});
  }

  function changePortions(direction: -1 | 1): void {
    const current = Math.round(portionValue);
    const minimum = Math.ceil(servings * MIN_FACTOR);
    const maximum = Math.floor(servings * MAX_FACTOR);
    const nextPortions = Math.max(
      minimum,
      Math.min(maximum, current + direction),
    );
    const nextFactor = factorFromPortions(nextPortions, servings);
    if (nextFactor === null) return;
    const next: CalculatorState = {
      anchorId: null,
      enteredValue: null,
      factor: nextFactor,
    };
    setCalculation(next);
    setAnnouncement(`Рецепт перераховано: ${formatPortions(nextPortions)}`);
  }

  function apply(ingredient: Ingredient): void {
    if (ingredient.amount.kind !== "measured") return;
    const entered = parseAmount(drafts[ingredient.id] ?? "");
    if (entered === null || entered <= 0) {
      setErrors((current) => ({
        ...current,
        [ingredient.id]: "Введіть число більше нуля",
      }));
      return;
    }
    const nextFactor = factorFromAmount(ingredient.amount.quantity, entered);
    if (nextFactor === null) {
      setErrors((current) => ({
        ...current,
        [ingredient.id]: "Занадто мало або забагато — перевірте кількість",
      }));
      return;
    }
    const next = {
      anchorId: ingredient.id,
      enteredValue: entered,
      factor: nextFactor,
    };
    setCalculation(next);
    setAnnouncement(
      `Рецепт перераховано: ${ingredient.name} — ${ingredientText(ingredient, entered)} · ${formatPortions(servings * nextFactor)}`,
    );
    requestAnimationFrame(() => amountInputs.current[ingredient.id]?.focus());
  }

  function reset(): void {
    const original = { anchorId: null, enteredValue: null, factor: 1 };
    setState(original);
    setDrafts(syncDrafts(1));
    setErrors({});
    try {
      localStorage.removeItem(storageKey(slug));
    } catch {
      // Reset remains effective for the current session when storage is blocked.
    }
    setAnnouncement("Скинуто до початкових значень");
    requestAnimationFrame(() => {
      if (mode) amountInputs.current[anchor?.id ?? ingredients[0]?.id]?.focus();
      else
        document
          .querySelector<HTMLButtonElement>(".calculator-mode-button")
          ?.focus();
    });
  }

  return (
    <div class="calculator" data-factor={factor}>
      <div class="calculator-toolbar">
        <div class="portion-stepper" aria-label="Кількість порцій">
          <button
            class="stepper-button"
            type="button"
            aria-label="Зменшити порції"
            title="Зменшити порції"
            onClick={() => changePortions(-1)}
          >
            −
          </button>
          <output
            class="portion-value"
            aria-label={formatPortions(portionValue)}
          >
            {formatPortions(portionValue).replace(/ порці[яіїй]+$/u, "")}
          </output>
          <button
            class="stepper-button"
            type="button"
            aria-label="Збільшити порції"
            title="Збільшити порції"
            onClick={() => changePortions(1)}
          >
            +
          </button>
        </div>
        {factor !== 1 && (
          <div class="calculator-status">
            <span
              class="calculator-status-text"
              title={
                anchor && state.enteredValue !== null
                  ? `Перераховано під: ${anchor.name} — ${ingredientText(anchor, state.enteredValue)} · ${formatPortions(portionValue)}`
                  : `Змінено порції: ${formatPortions(portionValue)}`
              }
            >
              {anchor && state.enteredValue !== null
                ? `Перераховано під: ${anchor.name} — ${ingredientText(anchor, state.enteredValue)} · ${formatPortions(portionValue)}`
                : `Змінено порції: ${formatPortions(portionValue)}`}
            </span>
            <button
              class="reset-button"
              type="button"
              aria-label="Скинути розрахунок"
              title="Скинути розрахунок"
              onClick={reset}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 4v6h6M4.5 9a8 8 0 1 1 .8 7" />
              </svg>
              <span>Скинути</span>
            </button>
          </div>
        )}
        <button
          class={`calculator-mode-button${mode ? " is-primary" : ""}`}
          type="button"
          aria-pressed={mode}
          aria-label={mode ? "Готово" : "Калькулятор"}
          title={mode ? "Готово" : "Калькулятор"}
          onClick={() => setMode((current) => !current)}
        >
          {mode ? (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
              <span>Готово</span>
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 3h2m4 0h2" />
              </svg>
              <span>Калькулятор</span>
            </>
          )}
        </button>
      </div>
      <ul class="ingredients calculator-ingredients">
        {ingredients.map((ingredient, index) => {
          const measured = ingredient.amount.kind === "measured";
          const quantity = displayedQuantity(ingredient);
          const currentText = measured
            ? formatAmount(
                quantity,
                ingredient.amount.kind === "measured"
                  ? ingredient.amount.unit
                  : "",
              )
            : "";
          const draft = drafts[ingredient.id] ?? currentText;
          const dirty = measured && draft !== currentText;
          const isAnchor = state.anchorId === ingredient.id;
          const changed =
            ingredient.amount.kind === "measured" &&
            factor !== 1 &&
            Math.abs(quantity - ingredient.amount.quantity) > 1e-9;
          return (
            <li
              key={ingredient.id}
              class={isAnchor ? "ingredient-is-anchor" : ""}
            >
              <div class="ingredient-row">
                <input
                  type="checkbox"
                  aria-label={`${ingredient.name}, інгредієнт ${index + 1}`}
                />
                <div class="ingredient-title">
                  <span class="ingredient-name">{ingredient.name}</span>
                  {isAnchor && <span class="anchor-badge">основа</span>}
                </div>
                {ingredient.amount.kind === "measured" && mode ? (
                  <span class="calculator-amount-editor">
                    <span class="apply-slot">
                      {dirty && (
                        <button
                          class="apply-button"
                          type="button"
                          aria-label="Застосувати"
                          onClick={() => apply(ingredient)}
                        >
                          ✓
                        </button>
                      )}
                    </span>
                    <input
                      ref={(element) => {
                        amountInputs.current[ingredient.id] = element;
                      }}
                      class="calculator-amount-input"
                      type="text"
                      inputMode="decimal"
                      aria-label={ingredient.name}
                      aria-invalid={Boolean(errors[ingredient.id])}
                      aria-describedby={
                        errors[ingredient.id]
                          ? `${ingredient.id}-error`
                          : undefined
                      }
                      value={draft}
                      onInput={(event) => {
                        const nextValue = (
                          event.currentTarget as HTMLInputElement
                        ).value;
                        setDrafts((current) => ({
                          ...current,
                          [ingredient.id]: nextValue,
                        }));
                        setErrors((current) => {
                          const next = { ...current };
                          delete next[ingredient.id];
                          return next;
                        });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          apply(ingredient);
                        }
                      }}
                    />
                    <span class="amount-unit">
                      {ingredient.amount.kind === "measured" &&
                        unitLabels[ingredient.amount.unit]}
                    </span>
                  </span>
                ) : (
                  <strong class="ingredient-amount">
                    {ingredient.amount.kind === "to-taste" ? (
                      <span class="amount-text">за смаком</span>
                    ) : (
                      <>
                        <span class="amount-value">{currentText}</span>
                        <span class="amount-unit">
                          {unitLabels[ingredient.amount.unit]}
                        </span>
                      </>
                    )}
                  </strong>
                )}
              </div>
              <button
                class="shopping-add-one"
                type="button"
                onClick={() => addToShopping(ingredient)}
              >
                До списку
              </button>
              {changed && mode && (
                <div class="original-amount">
                  {ingredient.amount.kind === "measured" &&
                    `було ${formatAmount(ingredient.amount.quantity, ingredient.amount.unit)} ${unitLabels[ingredient.amount.unit]}`}
                </div>
              )}
              {errors[ingredient.id] && (
                <p
                  class="calculator-error"
                  id={`${ingredient.id}-error`}
                  role="alert"
                >
                  {errors[ingredient.id]}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p class="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
