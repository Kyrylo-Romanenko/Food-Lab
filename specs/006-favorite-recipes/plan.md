# Implementation Plan: Favorite Recipes

**Branch**: `006-favorite-recipes` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

## Summary

Add browser-local favorite recipe references, synchronized star controls in the catalog and recipe pages, a header link and a dedicated management page. Sharing transfers a validated, explicitly disclosed copy; it does not create accounts or synchronization.

## Technical Context

**Language/Version**: TypeScript strict mode; Astro project runtime from package.json  
**Primary Dependencies**: Existing Astro, Preact, TypeScript, Vitest; no new dependency  
**Storage**: Browser localStorage through a small validated module; shared copies in URL fragments  
**Testing**: `npm run verify`, focused Vitest coverage, generated-output assertions, synthetic browser scenarios  
**Target Platform**: Static website in current evergreen desktop and mobile browsers  
**Project Type**: Static web application with Preact islands  
**Performance Goals**: Favorite state available on page interaction without noticeable delay for the bounded list  
**Constraints**: Static HTML fallback; no backend or sync; private data stays local until explicit share; no page overflow at 320 CSS pixels  
**Scale/Scope**: Personal cookbook and a bounded collection of references to published recipes

## Constitution Check

- C01: PASS. Keep static Astro output and use a Preact island only for interactive favorite behavior.
- C02: PASS. Reference stable authored recipe IDs; do not alter recipe schema or content.
- C03: PASS. Keep validation and storage in one small concrete module; no generic abstraction.
- C04: PASS. Keep favorites in browser storage; validate shared copies before merge; no public/private data mixing.
- C05: PASS. Provide static fallback, keyboard access, visible focus, practical targets, responsive layout, and reduced-motion/theme compatibility.
- C06: PASS. Do not export private favorites to authoring context; shared copy is explicit.
- C07: PASS. Technical artifacts use English; UI strings use Ukrainian.
- C08: PASS. Spec Kit remains the only task system; verification results will be recorded.

## Design

1. Define a versioned, bounded favorites envelope with unique stable recipe IDs and a display-name snapshot for missing-content handling.
2. Implement strict validation, local read/write, safe failure reporting, and share-link parsing/encoding in one authoritative module.
3. Add a reusable focused star control to catalog cards and recipe pages. Initialize from storage and synchronize same-tab events and cross-tab storage events.
4. Add a static favorites page with no-JavaScript guidance, an interactive island for list management, individual removal, confirmed clear-all, and accessible empty/error states.
5. Add a labeled header link beside shopping, with a saved-item count badge.
6. Share only after disclosure. Prefer the browser share sheet and provide copy fallback. Import only after validation and confirmation, merge by stable ID, and preserve current state on failure.
7. Cover state rules and storage failures with unit tests, rendered static structures with output assertions, and key flows with synthetic browser data.

## Project Structure

```text
src/
├── components/
│   ├── FavoriteButton.tsx
│   └── FavoritesList.tsx
├── lib/
│   └── favorites.ts
├── pages/
│   ├── favorites.astro
│   ├── index.astro
│   └── recipes/[slug].astro
└── layouts/Base.astro
tests/
├── favorites.test.ts
└── favorites-storage.test.ts
scripts/check-output.mjs
specs/006-favorite-recipes/
├── contracts/storage.md
├── data-model.md
├── quickstart.md
└── research.md
```

**Structure Decision**: Extend the existing single Astro project. Keep UI in local Preact components and the favorites data contract in one `src/lib/favorites.ts` module.

## Complexity Tracking

No constitution violations.
