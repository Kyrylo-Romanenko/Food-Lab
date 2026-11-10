# Favorites Storage and Share Contract

## Local storage

- Use one dedicated versioned key; its exact stable name is selected in implementation and covered by tests.
- Store only a `FavoritesEnvelope v1` as described in [data-model.md](../data-model.md).
- Reject malformed or unsupported envelopes without partial replacement.
- Preserve current valid state when an import fails, is canceled, or cannot be written.
- Dispatch a same-document update event after successful writes. Other tabs listen for the standard storage event.

## Share fragment

- Share data is a versioned envelope containing only stable recipe IDs and display-name snapshots.
- Place data in the URL fragment so it is not sent as an HTTP request path or query.
- Enforce the same item limit and strict validation used for local state.
- Warn before creating/sending the share link that anyone who has it can read the included recipe list.
- Sharing creates a copy. It does not synchronize updates.
- Import requires explicit confirmation and merges unique IDs. Cancellation, invalid data, and storage failure leave current state unchanged.
- Clear consumed import fragments from the visible URL after processing so the list is not repeatedly prompted.
