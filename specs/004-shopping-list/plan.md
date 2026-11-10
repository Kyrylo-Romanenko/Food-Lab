# Implementation Plan: shopping list

**Branch**: existing `main` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)
**Status**: Implemented on 2026-11-10; see `docs/handoff.md` for checks and limits.
**Input**: Shopping-list specification approved by the user on 2026-11-10.

## Summary

Build a complete recipe-to-shopping flow with independent recipe portions, source-aware totals,
editable row quantities, and reversible cart state. Preserve existing local lists by a tested,
non-destructive migration. Keep recipe reading static and use the existing Preact island for
interactive list behavior.

## Technical Context

**Language**: strict TypeScript; Astro and Preact already installed; npm lockfile.
**Storage**: versioned browser local storage; existing `foodlab:shopping:v1` may contain user data.
**Testing**: Vitest, Astro checks, ESLint, Prettier, build and output checks through `npm run verify`.
**Target**: mobile-first static pages, 320 px minimum; repository subpath `/Food-Lab/`.
**Constraints**: No backend, authentication, cloud synchronization, analytics, new dependencies,
recipe schema change, or automatic food-specific density conversion.
**Scope**: One local shopping list; recipes and contributions remain separately identifiable.

## Constitution Check

- C01/C05: Static Astro pages and static recipe reading remain usable; shopping shows a meaningful
  no-JavaScript fallback. Preact provides only required interaction.
- C02/C03: Recipe and ingredient stable IDs remain unchanged. One pure authoritative shopping domain
  implementation handles aggregation and conversions; existing calculator functions remain authoritative
  for portion factors. No duplicate calculation implementations or speculative abstractions.
- C04: Versioned local state, strict nested validation, and tested migration preserve private data.
  No private content enters Git, test fixtures, authoring context, or logs.
- C06/C07/C08: No recipe contract change; technical documentation remains English and product text
  Ukrainian. Acceptance checks and limits are reported without unsupported accessibility claims.

Gates pass before and after the proposed design. Existing link import and sharing need an explicit
versioned compatibility contract; do not silently remove these features.

## Project Structure

- `src/lib/shopping.ts`: pure shopping domain, conversions, contribution aggregation and validation.
- `src/lib/shopping-storage.ts`: concrete versioned browser storage and migration boundary.
- `src/lib/calculator.ts`: existing authoritative portion calculation and input parsing where applicable.
- `src/components/ShoppingList.tsx`, `src/components/IngredientCalculator.tsx`,
  `src/pages/recipes/[slug].astro`, `src/pages/shopping.astro`: local UI integration and static fallback.
- `src/styles/global.css`: responsive presentation consistent with current tokens.
- `tests/`, `scripts/check-output.mjs`: meaningful domain, migration and generated-output checks.
- `specs/001-project-foundation/tasks.md`: only authoritative task list per AGENTS.md.

## Design Decisions

Store recipe ingredient snapshots with stable IDs, base portions and selected portions. Derive totals
from source contributions and store explicit quantity overrides per stable product/unit group. Keep
legacy v1 entries independent where source identity cannot be proven. Preserve existing v2 stock
fields for compatibility, but do not use them in current totals or show them in the interface.
Reconcile derived rows with saved quantity overrides and cart state using a deterministic key. Clear
an override when source contributions change and clear the affected cart state when its displayed
quantity changes.

Use a versioned v2 envelope. Parse and validate all nested values; migrate v1 without deleting or
overwriting v1 until a verified v2 write succeeds. When storage or validation fails, retain raw data,
warn the user, and allow session-only work without overwriting it. Explicit clear remains a user action.
Maintain v1 link import through the same safe validation rules and emit v2 links only after explicit
sharing. See [storage contract](contracts/storage.md).

## Complexity Tracking

No constitution exceptions. The separate storage boundary protects private data, while the pure
domain module holds the single aggregation and conversion rules. No new dependencies are planned.
