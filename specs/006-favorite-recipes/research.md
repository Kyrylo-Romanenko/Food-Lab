# Research: Favorite Recipes

## R01 Browser-local persistence

Decision: Store a strictly validated, versioned, bounded envelope in browser localStorage, using stable recipe IDs and a name snapshot.

Rationale: The constitution requires private user data to stay in browser storage. Stable IDs prevent route changes from breaking identity. A name snapshot allows the UI to explain and remove recipes no longer in the public catalog.

Alternatives considered: Server accounts and sync conflict with the static MVP. Unvalidated JSON risks runtime failures and silent corruption.

## R02 Share and import

Decision: Encode a compact, versioned list of recipe references in the URL fragment. Explain that anyone with the link can read it before creating or sending it. Use the share sheet when available and a copy-link fallback. Validate imports and ask before merging unique IDs.

Rationale: URL fragments support static hosting without sending the list to the server. Explicit confirmation meets the privacy boundary and protects current data.

Alternatives considered: Query strings expose data in server logs and referrers. A remote share service would require a backend and is outside the constitution. Automatic synchronization is not requested.

## R03 Interaction and accessibility

Decision: Use a semantic button with an accessible name and explicit pressed state for each star, visible text/status feedback for failures, and standard confirmation for destructive clear-all.

Rationale: State is communicated without color alone; native button behavior supports keyboard activation. Confirmation reduces accidental bulk deletion.

Alternatives considered: A decorative star gives no reliable assistive-technology state. Undo-only clear is less predictable than confirmation for this small private list.

## R04 Cross-page state

Decision: Update same-tab controls through a narrowly named custom event and update other tabs through the browser storage event.

Rationale: Static pages are separate documents and need a small explicit synchronization signal. This avoids introducing shared global state infrastructure.

Alternatives considered: Reloading pages is disruptive. A state-management dependency is unnecessary for a small list.
