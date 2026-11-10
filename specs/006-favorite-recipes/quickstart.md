# Quickstart: Favorite Recipes Validation

Use synthetic data only. Do not inspect, export, or modify the user's existing favorites or shopping data.

## Automated checks

1. Run `npm run verify`.
2. Confirm domain tests cover unique add, remove, clear, strict envelope validation, size bounds, merge collisions, and malformed share data.
3. Confirm generated-output checks cover the header Favorites link, static page guidance, and star-control fallback markup.

## Browser scenarios

1. Start `npm run dev` in an isolated browser profile.
2. Mark one synthetic recipe from the catalog and another from a recipe page. Confirm stars and the header count update.
3. Reload and open Favorites. Confirm both entries and recipe links appear.
4. Remove one item. Confirm the other remains. Begin clear-all, cancel, and confirm no data changes; confirm a second clear to remove the remainder.
5. Save a synthetic recipe, choose Share, and verify disclosure appears before link creation. Cancel and confirm stored data remains.
6. Import a valid synthetic share copy after confirmation. Try malformed data and cancel confirmation; verify current items stay unchanged.
7. Check keyboard operation, visible focus, both themes, 320, 390, and 1280 CSS-pixel widths, and storage failure messaging.
8. Clear only synthetic test data and verify the isolated profile has returned to its initial state.
