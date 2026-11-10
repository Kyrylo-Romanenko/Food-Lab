# Feature Specification: kitchen-use refinements

**Feature Branch**: existing main  
**Created**: 2026-11-10  
**Status**: Approved for implementation by direct user request  
**Input**: User request dated 2026-11-10; constitution; approved foundation scope amendment.

## User Scenarios & Testing

### User Story 1 - Read a recipe on a phone (Priority: P1)

A cook opens a recipe and sees its description, times, servings, ingredients, and steps without large empty image areas.

**Independent Test**: Inspect a recipe without an image at 320 and 390 CSS pixels. Confirm ingredient name, amount, and action remain together and that page width does not overflow.

### User Story 2 - Add and find a shopping item (Priority: P1)

A cook adds a measured ingredient, sees confirmation, opens the list, and marks the item purchased.

**Independent Test**: Add the same measured recipe ingredient twice, open the list, confirm its combined quantity, mark it purchased, then remove the synthetic test item.

### User Story 3 - Find a recipe (Priority: P2)

A cook scans compact recipe cards and filters recipes by title or ingredient and verification status.

**Independent Test**: Search for a missing term, inspect the empty result, then check verified and unverified filters independently.

## Requirements

- **FR-001**: Recipe and catalog pages MUST NOT reserve large areas for absent images.
- **FR-002**: At 320 CSS pixels, recipe ingredient names, amounts, and shopping actions MUST remain associated without page-level horizontal overflow.
- **FR-003**: Preparation checkboxes MUST state their purpose and MUST provide a label hit area of at least 48 CSS pixels.
- **FR-004**: The calculator and recipe actions MUST show a visible label or clear visible result.
- **FR-005**: Recipe jump links MUST provide direct access to ingredients and preparation.
- **FR-006**: Recipe additions MUST persist in the existing local list before navigation. Repeated additions MUST explain and apply their quantity effect.
- **FR-007**: The shopping page MUST show stable Ukrainian field labels, a useful empty state, and relevant action groups.
- **FR-008**: Catalog search, status filters, and no-result feedback MUST remain functional.
- **FR-009**: Recipe content MUST keep times and readiness cues with the relevant step. The recipe schema and authoring contract MUST remain unchanged.

## Success Criteria

- **SC-001**: No image placeholder delays recipe ingredients or dominates a catalog card.
- **SC-002**: Recipe and list flows fit 320 CSS pixels with no horizontal page overflow.
- **SC-003**: At least two complete ingredient rows are visible at 320x780 and at least four at 390x844 on the representative recipe.
- **SC-004**: A repeated shopping addition displays the combined amount and the purchased state works.
- **SC-005**: Search, both status filters, and the empty search result render the expected item counts.

## Scope and non-goals

This request refines current recipe, catalog, and shopping presentation and the existing recipe-to-list flow. It does not add a cooking mode, step completion, timers, recipe schema fields, storage versions, accounts, sync, or dependencies.

## Assumptions

- The user directly requested the listed changes and acceptance checks.
- Browser checks use synthetic data and restore the list to its initial empty state.
