# Quickstart: shopping list validation

1. Run `npm ci` if dependencies are absent, then run `npm run verify`.
2. Start `npm run dev`. Use an isolated browser profile with synthetic, disposable data.
3. Add two recipes sharing an ingredient; inspect one aggregate and its source breakdown. Change
   list portions and confirm recipe-page calculator changes do not alter the stored selection.
4. Add one ingredient and one manual product. Edit a measured row quantity, reload, and confirm the
   edited value persists. Change its source and confirm the list returns to the calculated quantity.
   Mark the row in the cart and reverse that state.
5. Delete one recipe ingredient row and one manual row. Confirm unrelated rows remain. Remove a
   selected recipe and verify other contributions stay.
6. Exercise synthetic v1 migration and legacy-link import, malformed data, blocked storage and quota
   failures. Confirm original values are retained and no false save confirmation appears.
7. Test copy and copy-link actions with clipboard access and with clipboard access unavailable;
   confirm fallback text remains selectable. Inspect 320, 390 and 1280 CSS pixels, keyboard focus,
   light/dark themes, and JavaScript disabled. Test `/Food-Lab/` by building with
   `BASE_PATH=/Food-Lab/` and running output checks.
8. Record observed outcomes and unexecuted checks in `docs/handoff.md`. Do not use real private lists.
