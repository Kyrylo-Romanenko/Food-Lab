# Data Model: Favorite Recipes

## FavoritesEnvelope v1

- `version`: literal `1`.
- `items`: ordered, bounded array of unique favorites.

The authoritative validator rejects unknown fields, invalid types, duplicate IDs, and over-limit input as a whole. A failed read or write MUST NOT be reported as success. Use a conservative explicit item limit consistent with application input bounds.

## Favorite

- `recipeId`: nonempty stable ID from the authored recipe contract.
- `recipeName`: nonempty display snapshot used when the public recipe is unavailable.

The ID is the uniqueness key. The current authored catalog supplies route and current title when available. Saved items do not copy recipe ingredients, notes, or other private data.

## State transitions

- Add: append only when the ID is absent; repeated adds are idempotent.
- Remove: remove only the matching ID.
- Clear: replace items with an empty array only after explicit confirmation.
- Import: validate completely, ask for confirmation, then merge by ID; current entries win on collision. Invalid input or cancellation leaves state unchanged.
- Share: serialize a snapshot only after disclosure and explicit user action. Sharing never mutates stored state.

## Missing recipe

If an ID no longer resolves in the public catalog, display the saved name with an unavailable-recipe message and a removal action. Do not construct an unsafe route from untrusted stored values.
