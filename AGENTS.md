# Agent contract

## Goal

Maintain a small static personal cookbook foundation. Personal Cookbook is provisional.

## Rules

Technical documentation and comments MUST use English. Product content MUST use Ukrainian.
Use short active sentences, explicit subjects, stable IDs, and MUST/SHOULD/MAY terms.
Target practical ASD-STE100-inspired writing, approximately 80%; do not claim measured compliance.

Source precedence: constitution > approved feature specification > approved implementation plan >
current task > accepted ADRs > research > existing code > assumptions. Report conflicts.
A lower source MUST NOT override a higher source.

Read task inputs. Make the smallest required change. Run checks. Report failures. Stop when complete.
Do not refactor unrelated code, invent future features, weaken tests, or disable strict types.
Keep page code local. Presentation duplication MAY remain.
Extract shared code only for domain rules, integrity, contracts, or substantial complexity.
Keep one authoritative implementation for calculations, conversions, aggregation, schemas,
backup validation, and migrations when introduced. Use direct imports. Avoid speculative abstractions.
Add dependencies only for current requirements. Use npm and the committed lockfile.

When the recipe contract changes, update the AI authoring guide and its example in the same task.
The Markdown guide contains build-time inserts. Copy the rendered page for external AI use.
External AI output MUST pass repository validation. Never export private data into its context.
Never commit private recipes, notes, history, backups, storage exports, credentials, or secrets.

## Files

- .specify/memory/constitution.md: governing rules.
- specs/001-project-foundation/: specification, plan, and only task list.
- src/pages/, src/layouts/, src/styles/: static presentation.
- src/schemas/recipe.ts: authoritative authored-data schema.
- src/lib/content.ts and src/content.config.ts: validation and discovery.
- src/content/ingredients.json and src/content/recipes/: public content.
- docs/ai/recipe-authoring.md and src/lib/authoring.ts: authoring contract.
- tests/ and scripts/check-output.mjs: verification.
- docs/handoff.md: current status and next specification.

## Checks

Run npm run verify before completion. It MUST NOT edit source.
Definition of done: task acceptance checks pass; task status is updated; guide changes accompany
contract changes; handoff records results and limitations. Never claim unexecuted checks passed.
