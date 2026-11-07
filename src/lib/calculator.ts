export interface CalculatorState {
  anchorId: string | null;
  enteredValue: number | null;
  factor: number;
}

export interface ScalableIngredient {
  id: string;
  quantity: number;
  unit: string;
}

export const MIN_FACTOR = 0.1;
export const MAX_FACTOR = 20;

export function factorFromAmount(
  originalAmount: number,
  enteredValue: number,
): number | null {
  if (
    !Number.isFinite(originalAmount) ||
    !Number.isFinite(enteredValue) ||
    originalAmount <= 0 ||
    enteredValue <= 0
  )
    return null;
  const factor = enteredValue / originalAmount;
  return factor >= MIN_FACTOR && factor <= MAX_FACTOR ? factor : null;
}

export function factorFromPortions(
  portions: number,
  basePortions: number,
): number | null {
  if (
    !Number.isFinite(portions) ||
    !Number.isFinite(basePortions) ||
    portions <= 0 ||
    basePortions <= 0
  )
    return null;
  const factor = portions / basePortions;
  return factor >= MIN_FACTOR && factor <= MAX_FACTOR ? factor : null;
}

export function parseAmount(value: string): number | null {
  const input = value.trim();
  if (!input) return null;

  const mixed = input.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const numerator = Number(mixed[2]);
    const denominator = Number(mixed[3]);
    if (denominator === 0 || numerator >= denominator) return null;
    const parsed = whole + numerator / denominator;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  const fraction = input.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator === 0) return null;
    const parsed = Number(fraction[1]) / denominator;
    return parsed > 0 ? parsed : null;
  }

  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(input)) return null;
  const parsed = Number(input.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function scaleAmount(originalAmount: number, factor: number): number {
  return originalAmount * factor;
}

function decimal(value: number): string {
  return new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(value);
}

export function formatAmount(value: number, unit: string): string {
  if (!Number.isFinite(value)) return "";
  if (unit === "piece") {
    const nearestQuarter = Math.round(value * 4) / 4;
    if (Math.abs(value - nearestQuarter) < 0.035) {
      const whole = Math.floor(nearestQuarter);
      const fraction = Math.round((nearestQuarter - whole) * 4);
      const glyph = ["", "¼", "½", "¾"][fraction];
      if (whole === 0 && glyph) return glyph;
      if (whole > 0 && glyph) return `${whole}${glyph}`;
      return String(whole);
    }
  }
  return decimal(value);
}

export function formatPortions(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const integer = Number.isInteger(rounded);
  const whole = Math.floor(rounded);
  const lastTwo = whole % 100;
  const last = whole % 10;
  const noun = !integer
    ? "порції"
    : lastTwo >= 11 && lastTwo <= 14
      ? "порцій"
      : last === 1
        ? "порція"
        : last >= 2 && last <= 4
          ? "порції"
          : "порцій";
  return `${integer ? "" : "≈ "}${decimal(rounded)} ${noun}`;
}

export function validateStoredState(
  value: unknown,
  ingredients: ScalableIngredient[],
): CalculatorState | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Partial<CalculatorState>;
  if (
    typeof state.factor !== "number" ||
    !Number.isFinite(state.factor) ||
    state.factor < MIN_FACTOR ||
    state.factor > MAX_FACTOR
  )
    return null;
  if (state.anchorId === null && state.enteredValue === null)
    return { anchorId: null, enteredValue: null, factor: state.factor };
  if (
    typeof state.anchorId !== "string" ||
    typeof state.enteredValue !== "number" ||
    !Number.isFinite(state.enteredValue) ||
    state.enteredValue <= 0
  )
    return null;
  const anchor = ingredients.find(
    (ingredient) => ingredient.id === state.anchorId,
  );
  if (!anchor || anchor.quantity <= 0) return null;
  const expectedFactor = state.enteredValue / anchor.quantity;
  if (Math.abs(expectedFactor - state.factor) > 1e-10) return null;
  return {
    anchorId: state.anchorId,
    enteredValue: state.enteredValue,
    factor: state.factor,
  };
}
