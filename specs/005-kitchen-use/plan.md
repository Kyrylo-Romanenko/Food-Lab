# Implementation Plan: kitchen-use refinements

## Summary

Compact recipe and catalog presentation. Keep ingredient checkboxes and row actions clear at phone widths. Route recipe additions through the existing browser-local shopping data and preserve its stored key and item shape.

## Design

1. Remove absent-image placeholders from recipe and catalog pages.
2. Keep ingredient name, amount, and cart action in one mobile row. Give the checkbox label a 48px hit area.
3. Label the calculator and portion count, and add recipe section links.
4. Add a small concrete shopping-storage adapter that reuses the existing merge and validation rules.
5. Keep shopping labels, empty state, and secondary actions within current design tokens.
6. Keep search and filters unchanged; verify their current states in the browser.

## Verification

Run `npm run verify`. Inspect 320, 390, and 1280 CSS pixel layouts. Verify repeated shopping additions, purchased state, search, filters, and the empty result with synthetic data. Restore the shopping list after browser checks.

## Non-goals

Do not add a new shopping storage format, recipe authoring fields, cooking mode, step completion, timer behavior, or dependencies.
