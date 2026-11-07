# Research: ingredient-calculator

## Decisions

- **Decision**: Keep recipe schema and files unchanged. Use recipe values supplied by the page as island props.
  **Rationale**: Every measured amount already has a positive numeric quantity and supported unit. To-taste amounts have a separate discriminant.
  **Alternatives considered**: Adding a `scalable` schema field. Rejected because current amount types already determine scalability.

- **Decision**: Use Preact for the recipe-local calculator UI and pure TypeScript for calculation rules.
  **Rationale**: The repository already includes Preact. The calculator needs controlled inputs, apply/reset behavior, and storage.
  **Alternatives considered**: A DOM-only module. Rejected because the calculator has multiple synchronized rows and accessibility states; a framework-free DOM implementation would increase local complexity.

- **Decision**: Keep local-storage access in the island, with every access wrapped in try/catch.
  **Rationale**: Storage is a browser integration, not a calculation rule. Session behavior remains usable when the browser blocks access.

- **Decision**: Restore validated stored state during component initialization and calculate all values from original props.
  **Rationale**: This avoids cumulative rounding and minimizes a visible restore jump.

- **Decision**: Use existing design tokens for text, surfaces, focus, and controls; create `docs/STYLE_GUIDE.md` because it does not exist.
  **Rationale**: The request asks for the file, and the design kit already provides appropriate tokens including control border contrast.

## Compatibility Notes

- Astro static output and the `/Food-Lab/` base path remain unchanged.
- No external data requests or new npm packages are needed.
- The AI recipe-authoring guide remains unchanged because the authored schema and example do not change.
