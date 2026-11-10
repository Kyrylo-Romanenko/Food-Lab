# Storage and sharing contract

- The existing `foodlab:shopping:v1` value is an unversioned JSON array. Treat it as private input.
- Use a distinct v2 key and an envelope with `version: 2`; validate every nested field before use.
- Accept old v2 envelopes without `amountOverrides`. New envelopes MAY include validated row
  quantity overrides. Preserve existing `stock` values for compatibility, but do not apply them to
  current totals or expose them in the shopping interface.
- Migrate only when no valid v2 exists. Preserve each valid v1 row as a distinct legacy contribution,
  including item identity, name, quantity, unit, category, purchase state and validated sources.
- Unknown source shape, invalid JSON, blocked access, and quota failure MUST leave v1 untouched.
  Do not silently replace a malformed v2. Surface an error and allow unsaved session-only use.
- A successful v2 write MUST be validated by reading it back before it is presented as persisted.
  Keep v1 for recovery; do not repeatedly merge it into an existing v2.
- Import existing v1 link arrays through explicit user confirmation and the same strict validation.
  Import v2 envelopes through explicit confirmation. Failed imports leave current state unchanged.
  Imported items receive collision-safe identities; no import silently replaces the current list.
- Link creation is explicit and discloses that anyone holding the link can read its list data.
  Do not send list data to a server. Copy and platform sharing remain user-initiated.
- Clearing or deleting user-visible items needs an undo or confirmation, as appropriate. Recovery
  copy handling MUST be documented so clearing does not silently resurrect migrated entries.
