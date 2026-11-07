# Feature Specification: ingredient-calculator

**Feature Branch**: existing main
**Created**: 2026-11-07
**Status**: Approved for implementation by the user task
**Input**: User request in pasted task text.

## User Scenarios & Testing

### User Story 1 - Scale recipe portions (Priority: P1)

A cook changes portions and sees every numeric ingredient amount recomputed from the original recipe.

**Why this priority**: Portion scaling is the calculator's basic use case.

**Independent Test**: Set the buckwheat recipe from 2 to 1 portion. Verify 80 g buckwheat, 60 g carrot, 175 ml water, and unchanged to-taste salt.

**Acceptance Scenarios**:

1. Given a recipe at its original portions, when the cook changes the portions, then numeric amounts and displayed portions use the new factor.
2. Given a recipe with a non-numeric amount, when the cook scales it, then that amount stays unchanged.

### User Story 2 - Scale from an ingredient amount (Priority: P1)

A cook enters the amount they have for any scalable ingredient. The page recalculates all other amounts and portions from the original recipe.

**Why this priority**: This is the requested ingredient calculator behavior.

**Independent Test**: Set Морква to 60 g in the buckwheat recipe. Verify 80 g buckwheat, 175 ml water, one portion, and the carrot anchor. Then set Вода to 700 ml and verify 320 g buckwheat, 240 g carrot, four portions, and the water anchor.

**Acceptance Scenarios**:

1. Given calculator mode, when a valid amount is applied, then that ingredient becomes the anchor and each amount is calculated from original data.
2. Given a value that parses to a factor outside 0.1–20 or does not parse as positive, when the cook applies it, then the page shows an inline error and does not change calculated state.
3. Given calculator mode, when the cook chooses Готово, then calculator mode closes and calculated values remain.

### User Story 3 - Restore a recipe calculation (Priority: P2)

A cook reloads a recipe and resumes its last calculation, or resets it to original values.

**Why this priority**: A saved state prevents losing a useful calculation during normal recipe use.

**Independent Test**: Apply a new anchor, reload, verify the same values, reset, and verify originals and cleared recipe-specific storage.

**Acceptance Scenarios**:

1. Given valid saved state for this recipe, when the page loads, then it restores the state before displaying calculated values.
2. Given invalid saved state, when the page loads, then it ignores and clears that state.
3. Given storage access is blocked, when the cook calculates, then the page remains usable for the current session.
4. Given a reset, when the cook activates Скинути, then portions and amounts return to original values and the current mode remains active.

## Edge Cases

- Decimal comma and decimal point inputs, simple fractions, and mixed fractions MUST parse.
- Empty, malformed, zero, negative, NaN, and infinite values MUST fail.
- Non-numeric original amounts MUST never receive inputs or change.
- Re-anchoring MUST use original amounts, not rounded display values.
- Factor limits are inclusive from 0.1 through 20.
- Recipe state MUST be isolated by slug.
- Storage reads, writes, and removal may throw.
- Narrow screens, keyboard focus, reduced motion, and all theme/palette pairs must remain usable.

## Requirements

### Functional Requirements

- **FR-001**: Recipe pages MUST show original recipe content without JavaScript.
- **FR-002**: When JavaScript runs, each recipe page MUST provide a portions stepper and a calculator-mode control.
- **FR-003**: The active factor MUST be derived from either portions/base portions or an entered amount/original anchor amount.
- **FR-004**: Each displayed amount MUST be calculated from the original authored amount and the active factor.
- **FR-005**: The page MUST keep each ingredient's authored unit. To-taste amounts MUST remain unchanged and not scalable.
- **FR-006**: The calculator MUST accept positive decimal comma, decimal point, simple fraction, and mixed fraction inputs. It MUST reject invalid values and factors outside 0.1–20 without applying them.
- **FR-007**: The page MUST display Ukrainian number formatting, countable-unit common fractions, and correct Ukrainian portions forms.
- **FR-008**: In calculator mode, the page MUST show amount inputs, changed-original hints, anchor feedback, and inline validation only where applicable.
- **FR-009**: The status bar MUST describe non-original state and provide a reset that restores original state without changing the current mode.
- **FR-010**: The page MUST announce apply and reset outcomes through a polite live region.
- **FR-011**: The page MUST save calculation state per recipe in local storage and validate it before restoration. Storage failures MUST NOT stop session use.
- **FR-012**: The page MUST work under the `/Food-Lab/` base path and preserve existing recipe data, IDs, and routes.
- **FR-013**: Interactive controls MUST support keyboard use, visible focus, minimum 44px tap targets, labeled inputs, and reduced motion.
- **FR-014**: New calculator elements MUST follow the current design tokens and documentation rules.
- **FR-015**: At 360 CSS pixels, ingredient names MUST keep normal word wrapping. Amount input, unit, apply action, anchor badge, previous amount, and error MUST use predictable aligned rows.
- **FR-016**: At 360 CSS pixels, the full calculation status and reset action MUST remain visible without truncating the state.
- **FR-017**: Calculator mode and reset controls MUST show visible Ukrainian labels.
- **FR-018**: A step number and its separator MUST stay together in a dedicated column at narrow and wide widths.
- **FR-019**: The anchor badge MUST NOT change the position of an ingredient's amount. Numeric values and units MUST occupy identical columns in original and edit modes and across all ingredient rows.
- **FR-020**: A displayed unit label MUST start at the same horizontal position and use the same color and font as the unit label beside its edit input.

### Key Entities

- **Original recipe amount**: Authored numeric quantity and unchanged unit, identified by ingredient ID.
- **Calculator state**: Optional anchor ingredient ID and entered value, plus a finite factor within 0.1–20.
- **Displayed calculation**: Per-render amount and portions derived only from original recipe data and current state.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The specified buckwheat and egg scenarios produce the requested amounts and portions.
- **SC-002**: All eight valid and invalid input forms in the task behave as specified.
- **SC-003**: Reload, reset, recipe isolation, and blocked-storage scenarios work without changing recipe files.
- **SC-004**: `npm run verify` passes, including pure function tests and static output checks.
- **SC-005**: No page-level horizontal scrolling occurs at 360 CSS pixels in the implemented layout.
- **SC-006**: At 360 CSS pixels, ingredient labels do not wrap character by character, calculation status remains complete, and step markers remain on one line.
- **SC-007**: Activating an anchor or changing between original and edit display does not shift the amount or unit columns.
- **SC-008**: Static and editable unit labels share the same left edge, color, and font.

## Assumptions

- The existing recipe schema remains unchanged because measured amounts are already machine-readable.
- The `piece` unit is displayed as Ukrainian `шт.` and uses common-fraction rendering.
- Calculator controls are progressively enhanced: generated static HTML keeps the original values, and JavaScript adds interactive controls.
- The existing Preact dependency is used for the local recipe-page island. No new dependency is required.
- `docs/STYLE_GUIDE.md` is absent in the current checkout and will be created.
