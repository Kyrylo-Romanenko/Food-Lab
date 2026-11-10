# Data Model: shopping list

## ShoppingState v2

A versioned envelope contains selected recipes, independent contributions, optional quantity
overrides, legacy at-home values, and cart state. Old v2 envelopes without quantity overrides remain
valid. All IDs are nonempty stable strings. Collections are bounded before rendering or
storage; enforce limits at least as restrictive as current 500-item input limit without losing valid v1
rows. Reject invalid nested structures as a whole; do not partially overwrite stored input.

## SelectedRecipe

`recipeId` is the authored stable ID; `recipeName` is a nonempty display snapshot. `basePortions`
and `selectedPortions` are finite positive numbers and their factor is within calculator limits
0.1–20 inclusive. Ingredient snapshots retain stable ingredient IDs, names, original amounts and
units, and distinguish measured amounts from to-taste. Snapshots are not refreshed automatically.
One selected recipe exists per stable ID. Explicit replacement refreshes snapshot and portions.

## Contribution

Each independent contribution has its own stable ID, origin (`individual`, `manual`, or `legacy`),
name, and either a finite positive measured amount with a unit or an unspecified amount. Individual
catalog contributions carry a stable ingredient ID; manual and legacy entries do not assume one.
Legacy migration preserves zero quantities if accepted by v1 and retains raw source metadata as
historical data after validation. A selected recipe's contribution is derived from its snapshot.

## Row and transitions

Group authored ingredient contributions by ingredient ID and compatible unit group. Manual and
legacy entries remain independent unless the user explicitly edits them. Display measured and
unspecified needs distinctly. `baseNeeded = sum(contributions)` for compatible measured amounts.
`needed` equals a saved row quantity override when one exists; otherwise it equals `baseNeeded`.
`toBuy = needed`. Quantity overrides are finite and nonnegative and use the row's unit. A source
contribution change clears the affected override. A displayed quantity change moves the row back to
outstanding. Cart actions are reversible. Remove operations preserve independent sources; undo
restores the deleted entity, not an old copy of the whole list. Old v2 at-home values remain
validated and stored for compatibility, but they do not affect current totals.

## Migration and validation

Read v1 without mutating it. Strictly validate array entries and nested source fields before migration.
Preserve ID, name, amount including null and zero, unit, category, purchased flag, and source data.
Do not derive selected recipes. Validate the new envelope before writing; retain v1 after a successful
v2 write as recovery data. If any v1 record is malformed or a write fails, leave v1 unchanged, show
an error, and avoid automatic replacement. Test unavailable, corrupt, quota and interrupted-write cases.
