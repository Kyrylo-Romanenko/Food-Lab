# Feature Specification: kitchen reading

**Feature Branch**: existing main
**Created**: 2026-11-10
**Status**: Draft; not approved for implementation
**Input**: User request for practical kitchen-use documentation and bounded next scope.

## User Scenarios & Testing

### User Story 1 - Read a recipe while cooking (Priority: P1)

A cook reads ingredients and steps on a narrow screen and can relate each amount to its ingredient.

**Independent Test**: Open a recipe at 320 CSS pixels with and without JavaScript. Inspect the
ingredients and steps, including long ingredient names.

**Acceptance Scenarios**:

1. Given JavaScript is unavailable, when the cook opens a recipe, then ingredients and steps remain readable.
2. Given a recipe without an image, when the cook opens it, then no large empty image area delays its content.
3. Given a narrow screen, when an ingredient name wraps, then its amount and unit remain visually associated with it.
4. Given a primary cooking action, when the cook sees it, then its visible label or context identifies the action.

### User Story 2 - Add an ingredient to a shopping list (Priority: P2)

A cook adds an ingredient and can tell that the action succeeded.

**Independent Test**: Add an ingredient from a recipe and inspect the visible response and shopping list.

**Acceptance Scenarios**:

1. Given an ingredient can be added, when the add action succeeds, then the interface visibly confirms it.
2. Given the cook opens the shopping list, when the addition succeeded, then the ingredient appears there.

### Edge Cases

- Long ingredient names and units remain associated at 320 CSS pixels.
- Recipes without images do not reserve a large image area.
- The static recipe remains readable when interactive behavior is unavailable.
- A failed addition MUST NOT be presented as successful.

## Requirements

### Functional Requirements

- **FR-001**: Recipe ingredients and preparation steps MUST remain readable without JavaScript.
- **FR-002**: A recipe without an image MUST NOT reserve a large image area.
- **FR-003**: Primary cooking actions MUST have clear visible labels or equally clear visible context.
- **FR-004**: Ingredient names, amounts, and units MUST remain visually associated at 320 CSS pixels.
- **FR-005**: A successful addition to the shopping list MUST receive visible confirmation.
- **FR-006**: Reviews SHOULD exercise recipe reading and the shopping flow at narrow and wide viewport sizes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: At 320 CSS pixels, every ingredient name remains associated with its displayed amount and unit, without page-level horizontal scrolling.
- **SC-002**: One representative recipe exposes all ingredients and steps with JavaScript disabled.
- **SC-003**: One successful ingredient addition shows visible confirmation and appears in the shopping list.
- **SC-004**: Review records outcomes at 320, 390, and 1280 CSS pixels and records any unexecuted checks.

## Assumptions and scope

This draft covers recipe reading, action clarity, and existing shopping feedback. It does not
introduce a cooking mode, timers, recipe schema changes, new storage, or new shopping features.
The review uses representative recipes and does not claim a full accessibility audit.

## Source context

The 2026-11-10 amendment limits foundation FR-004 and FR-010 exclusions to the original
foundation implementation. The approved calculator specification governs scaling and its local
state. Shopping-list development requires a separate approved specification. This draft does not
amend approved specifications or authorize implementation. Existing foundation visual requirements
still apply where relevant; assess any proposed change against them before implementation.
