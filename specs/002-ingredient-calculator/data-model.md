# Data Model: ingredient-calculator

## Recipe input

- `id`: stable authored recipe ID; used for page content identity.
- `slug`: path-derived route segment; used to isolate local-storage keys.
- `servings`: positive integer base portions.
- `ingredients`: original ingredient IDs, names, amount kinds, quantities, and units.
- `amount.kind = measured`: scalable when quantity and unit are present.
- `amount.kind = to-taste`: never scaled and never receives an input.

## Calculator state

- `anchorId`: stable ingredient ID or `null` for stepper-only state.
- `enteredValue`: last successfully applied entered amount or `null` for stepper-only state.
- `factor`: finite number in the inclusive range 0.1–20.
- When `anchorId` is non-null, it MUST identify a measured ingredient in the current recipe and `enteredValue` MUST be positive and finite.
- When `anchorId` is null, `enteredValue` MUST be null.

## Derived values

- Scaled quantity = original quantity × factor.
- Displayed portions = base servings × factor.
- The display may round, but derived calculations never use rounded display values.
- Each ingredient retains its authored unit.

## Persistence contract

- Key: `foodlab:calc:v1:<recipe-slug>`.
- Value: JSON object with `anchorId`, `enteredValue`, and `factor`.
- Invalid or incompatible values are ignored and removed when storage is available.
- A reset removes the recipe key.
