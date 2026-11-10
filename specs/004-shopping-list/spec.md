# Feature Specification: shopping list

**Feature Branch**: existing main  
**Created**: 2026-11-10  
**Status**: Approved for implementation by explicit user approval  
**Input**: User approval dated 2026-11-10; shopping implementation plan; constitution.
**Amended**: User request dated 2026-11-10 replaces at-home stock tracking with editable list quantities and requests reliable per-row deletion and clipboard fallbacks.

## User Scenarios & Testing

### User Story 1 - Select recipes and ingredients (Priority: P1)

A cook adds a whole recipe or one ingredient to the shopping list. The cook can change list-specific portions in the selected-recipes section. Recipe-page calculator changes do not change the saved selection.

**Independent Test**: Add two synthetic recipes that share an ingredient. Change one selected portion count. Confirm one aggregate and a source breakdown. Change the recipe-page calculator and confirm the selected portion count stays unchanged.

**Acceptance Scenarios**:

1. Given a recipe page, when the cook adds the whole recipe, then the list stores a snapshot and the displayed portion count.
2. Given a measured or to-taste ingredient, when the cook adds that ingredient, then the list stores its stable ingredient identity and current amount.
3. Given a recipe is already selected, when the cook adds it again, then the interface asks to update or cancel.
4. Given selected recipes share an ingredient, when the cook opens the list, then the page shows one total and its sources.
5. Given the cook changes portions in the selected-recipes section, then only that saved selection changes.
6. Given the cook removes one selected recipe, then other recipe, individual, manual, and legacy contributions remain.

### User Story 2 - Edit quantities and track shopping (Priority: P2)

A cook edits a row's total quantity and marks a row in the cart. The cook can reverse cart state. A quantity override remains until its source contributions change.

**Independent Test**: Add 500 g of an ingredient, edit its list quantity to 350 g, reload, and confirm 350 g remains. Mark it in the cart, change its source contribution, and confirm the row returns to outstanding with the recalculated quantity.

### User Story 3 - Manage, migrate, and share the list (Priority: P3)

A cook adds manual products, marks items, removes or restores entities, and shares a copy by explicit action. Existing v1 lists remain recoverable during migration.

**Independent Test**: Migrate a synthetic v1 list, inspect every legacy row, import a legacy link after confirmation, share a v2 copy, reload, and exercise invalid-data and storage-failure states.

## Requirements

- **FR-001**: The recipe page MUST add a whole recipe or one ingredient using the current displayed amounts. It MUST include to-taste ingredients as unspecified contributions.
- **FR-002**: A whole-recipe addition MUST store the authored recipe ID, display-name snapshot, base portions, selected portions, and ingredient snapshots.
- **FR-003**: A selected recipe's portions MUST remain independent from its recipe-page calculator. The cook MUST change them in the selected-recipes section.
- **FR-004**: The list MUST show one aggregate for compatible contributions with stable ingredient identity, plus a source breakdown. Manual and legacy rows MUST remain independent unless the cook edits them.
- **FR-005**: Adding an already selected recipe MUST request an explicit update or cancellation. It MUST NOT silently double the recipe.
- **FR-006**: The cook MUST be able to edit the displayed total quantity of a measured row. The override MUST persist, use the row's existing unit, and clear when its source contributions change.
- **FR-007**: Cart state MUST be reversible. A change to the displayed quantity MUST return the affected cart row to outstanding.
- **FR-008**: Removing a visible row MUST remove its contributing sources and preserve unrelated rows. Undo MUST restore the removed row without undoing later changes.
- **FR-009**: The v2 state MUST use a distinct storage key and a versioned envelope. The implementation MUST validate every nested value.
- **FR-010**: Migration MUST preserve each valid v1 row, ID, name, amount including null and accepted zero, unit, category, purchased state, and validated source data. Migration MUST NOT infer selected recipes.
- **FR-011**: Invalid v1 or v2 data, blocked storage, and write or read-back failures MUST NOT overwrite saved data. The interface MUST report unsaved session-only changes accurately.
- **FR-012**: A successful v2 write MUST pass read-back validation. The v1 value MUST remain intact as recovery data.
- **FR-013**: Legacy-array and v2 link imports MUST require explicit confirmation and strict validation. They MUST NOT replace the current list. A generated link MUST disclose that its holder can read the copied list. Copy actions MUST provide selectable text when clipboard access is unavailable. The application MUST NOT send list data to a server.
- **FR-014**: Manual items MUST support edit, delete, purchase state, and an optional nonnegative amount. The empty state MUST guide the cook. Sharing and clearing actions MUST appear only when relevant.
- **FR-015**: The page MUST remain usable at 320 CSS pixels, show a static no-JavaScript explanation, use visible Ukrainian labels, and retain focus and touch-target styles.

## Success Criteria

- **SC-001**: Two selected recipes with a shared ingredient show one aggregate and a correct source breakdown.
- **SC-002**: Changing a selected portion count changes its contribution; changing the recipe-page calculator does not.
- **SC-003**: An edited quantity persists, and cart state can be reversed. Changing source contributions clears the override and returns the affected row to outstanding.
- **SC-004**: A valid v1 migration preserves every row and source without inventing a selected recipe.
- **SC-005**: Malformed data and failed writes leave the original saved values unchanged and show no false success.
- **SC-006**: Recipe, manual, import, purchase, removal, undo, reload, and sharing scenarios pass with synthetic data.
- **SC-007**: Layout checks cover 320, 390, and 1280 CSS pixels and report unexecuted theme, keyboard, or no-JavaScript checks.

## Scope and non-goals

This feature provides one browser-local shopping list. It does not add a server, account, cloud sync, persistent household inventory outside this list, food-density conversion, categories, prices, or recipe-schema fields.

## Assumptions

- The user approved the separate list-specific portion decision on 2026-11-10.
- Existing v1 data is private input. Tests and browser review use synthetic data only.
- A shared URL contains a copy of list data; it is not synchronization.
