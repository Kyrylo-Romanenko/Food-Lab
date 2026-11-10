# Feature Specification: Favorite Recipes

**Feature Branch**: `006-favorite-recipes`  
**Created**: 2026-11-10  
**Status**: Ready for planning  
**Input**: User request: Add a favorites section, a star action on recipe cards and recipe pages, a header link beside the shopping list, and controls to remove, clear, and share favorite recipes.

## User Scenarios & Testing

### User Story 1 - Save and find favorite recipes (Priority: P1)

A cook marks a recipe with a star in the recipe catalog or on its page, then opens Favorites from the header and finds the saved recipe.

**Why this priority**: Saving and finding recipes is the core value of the feature.

**Independent Test**: Mark a recipe in each supported location, navigate to Favorites, and confirm each recipe appears once and remains saved after reload.

**Acceptance Scenarios**:

1. **Given** an unsaved recipe, **When** the cook activates its star, **Then** the recipe is saved and the star communicates its saved state.
2. **Given** a saved recipe, **When** the cook opens Favorites from the header, **Then** the recipe appears with a link to its recipe page.
3. **Given** a saved recipe, **When** the cook activates its star again, **Then** it is removed from Favorites.
4. **Given** no saved recipes, **When** the cook opens Favorites, **Then** a useful Ukrainian empty state is shown.

### User Story 2 - Manage saved recipes (Priority: P2)

A cook removes one saved recipe or clears all saved recipes after an explicit confirmation.

**Why this priority**: Users need control over stored private data and safe recovery from accidental bulk actions.

**Independent Test**: Remove one item and confirm other items remain; choose clear-all, cancel and confirm the list remains; repeat and confirm clearing empties the list.

**Acceptance Scenarios**:

1. **Given** several saved recipes, **When** the cook removes one, **Then** only that recipe is removed.
2. **Given** a non-empty Favorites list, **When** the cook requests clear-all and cancels, **Then** no item is removed.
3. **Given** a non-empty Favorites list, **When** the cook confirms clear-all, **Then** all saved recipes are removed.

### User Story 3 - Share a favorites copy (Priority: P3)

A cook deliberately shares a copy of the saved recipe list using the device share sheet or a copyable link.

**Why this priority**: Sharing is useful after the core private list and safe management flows work.

**Independent Test**: Share a synthetic favorites list, confirm the user is told that link holders can view its contents, and verify cancellation or unavailable sharing does not change saved data.

**Acceptance Scenarios**:

1. **Given** a non-empty list, **When** the cook chooses Share, **Then** the cook receives a clear disclosure before creating or sending a link that contains the list.
2. **Given** the cook cancels sharing, **When** the flow ends, **Then** saved favorites remain unchanged.
3. **Given** sharing is unavailable, **When** the cook chooses Share, **Then** the app offers a copyable link and reports the result accessibly.
4. **Given** an empty list, **When** the cook opens Favorites, **Then** sharing is unavailable or disabled with a clear explanation.

### Edge Cases

- Storage is unavailable, corrupt, or full; the page reports that the change could not be saved and does not claim success.
- A recipe is removed from the public catalog after it was saved; the Favorites page handles the missing recipe without crashing and offers removal.
- A shared link is malformed, oversized, or contains unknown recipe IDs; the app rejects it without changing saved data.
- The user opens the same favorite in multiple tabs; the visible state updates when the browser reports a storage change.
- Keyboard and assistive technology users can identify each star's purpose and saved state without relying on color alone.

## Requirements

### Functional Requirements

- **FR-001**: The catalog MUST show a star control for each recipe. Activating it MUST add or remove that recipe from Favorites.
- **FR-002**: Each recipe page MUST show the same favorite control and state as the catalog.
- **FR-003**: The header MUST provide a clearly named Favorites link beside the shopping-list link.
- **FR-004**: Favorites MUST list saved recipes with their names and links to available recipe pages.
- **FR-005**: The cook MUST be able to remove an individual recipe and clear all recipes. Clear-all MUST require confirmation.
- **FR-006**: The Favorites page MUST provide an empty state and MUST communicate storage failures without falsely reporting success.
- **FR-007**: Saved favorites MUST persist in the user's browser and MUST NOT enter public recipe content, Git, or external authoring context.
- **FR-008**: The cook MUST explicitly initiate sharing. Before a share link is created or sent, the app MUST disclose that anyone with the link can view the included recipe list.
- **FR-009**: Sharing MUST use a device share option when available and provide a copyable link fallback. Canceling sharing MUST NOT change Favorites.
- **FR-010**: Imported shared lists MUST be validated and MUST require explicit confirmation before merging. Invalid data MUST leave current Favorites unchanged.
- **FR-011**: The app MUST use stable recipe identifiers and MUST avoid duplicate favorites.
- **FR-012**: All feature text presented to users MUST be Ukrainian. Controls MUST have accessible names, visible focus, keyboard operation, and practical touch targets.
- **FR-013**: The Favorites page MUST remain readable without JavaScript, including a clear explanation when its interactive features are unavailable.

### Key Entities

- **Favorite**: A saved reference to a stable recipe identifier and the display snapshot needed to explain a missing recipe.
- **Favorites list**: The user's ordered collection of unique favorites, private to their browser until explicitly shared.
- **Shared favorites copy**: A validated, read-only representation of favorites encoded for deliberate transfer; it is not synchronization.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A cook can save a recipe from either the catalog or recipe page and find it in Favorites in at most three actions.
- **SC-002**: Adding the same recipe repeatedly results in exactly one Favorites entry.
- **SC-003**: Removing one item preserves every other saved item; canceling clear-all preserves the complete list.
- **SC-004**: The Favorites page and its primary actions work at 320 CSS pixels without page-level horizontal scrolling.
- **SC-005**: Share cancellation and malformed imports leave existing favorites unchanged in every tested case.
- **SC-006**: The interface identifies saved state and control purpose for keyboard and screen-reader users without color-only cues.

## Assumptions

- The app remains static and has no accounts, server storage, or cross-device synchronization.
- Favorites are private browser data unless a user explicitly shares a link.
- Sharing transfers a copy and does not synchronize later changes.
- Import merges unique recipe IDs and requires confirmation; export/share contains no private notes because this feature has none.
- Product-facing labels use “Улюблене” and “Улюблені страви” consistently.
