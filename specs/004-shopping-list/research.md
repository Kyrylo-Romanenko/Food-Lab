# Research: shopping list

## R01 Existing data

Decision: migrate v1 rows as independent legacy contributions, preserving their original fields.
Rationale: v1 stores names and source slugs, not stable ingredient IDs or selected recipe portions.
Its nested source data is not fully validated. A valid-looking total cannot reconstruct recipe ownership.
Alternative: infer recipes or IDs from names and slugs. Rejected because it can duplicate or lose data.

## R02 Calculation

Decision: use stable IDs for authored ingredients, a separate identity for manual and legacy rows,
and compatible unit groups. Derive totals from contributions. Reuse calculator factor rules.
Rationale: v1 merges by name and can conflate unrelated products. Its aliases omit Ukrainian `г`;
unknown units can incorrectly compare as equivalent. Mass-to-volume conversion is not generally safe.
Alternative: merge by name or derive weights from generic food densities. Rejected as unreliable.

## R03 Portion isolation

Decision: store a recipe snapshot and list-specific portions. Explicit re-add updates the selected
recipe after user choice. Recipe-page changes alone never update the list.
Rationale: the user explicitly chose independent list portions. Snapshotting also protects against
silent changes after a recipe update or removal.

## R04 Storage and sharing

Decision: keep a strictly validated versioned local envelope and an explicit v1 migration/import path.
A shared link contains a copy of list data and is not synchronization. Warn before link creation.
Rationale: the existing implementation already has locally saved data and URL-fragment sharing.
Alternative: replace the storage key without migration. Rejected because private lists could be lost.
