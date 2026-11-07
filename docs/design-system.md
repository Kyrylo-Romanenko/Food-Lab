# Personal Cookbook Design System v1.0

## Principles

Use modern editorial minimalism. Keep white or dark neutral surfaces, strong type, clear food content, and restrained green accents. Keep decoration and motion minimal. The display label remains provisional.

## Tokens and themes

`src/styles/global.css` defines semantic CSS variables. Light colors are background `#FFFFFF`, surface `#F7F7F5`, hover `#F0F1EE`, text `#202124`, secondary `#666B68`, muted `#858A86`, border `#E5E7E4`, accent `#355C48`, accent hover `#294936`, and accent soft `#EAF1EC`.

Dark colors are background `#151A18`, surface `#202723`, text `#F1F3EF`, secondary `#B0BBB3`, border `#36423A`, accent `#A2CBB0`, and accent soft `#263A2E`. Dark hover and muted tokens support controls and labels.

The system color scheme applies until a person selects a theme. The header control saves `light` or `dark` in `localStorage`. An early head script restores that value before body rendering. If storage is unavailable, the control still changes the current page. The manual preference has no reset control in v1.0; clearing `cookbook-theme` restores automatic selection.

## Typography and spacing

Use `Inter, system-ui, sans-serif` without external font requests. Body text is 16px with 1.6 line height. Page titles use 28px on mobile and 36px on larger screens. Section titles use 24px. Card titles use 18px on mobile and 20px on larger screens. Descriptions use 14px, metadata 13px, and status labels 12px.

Use a spacing scale of 4, 8, 12, 16, 24, 32, 48, and 64px. The main container is at most 1120px. Recipe reading width is at most 720px.

## Components and layout

The header contains the provisional brand, the recipe link, and a theme control. The authoring guide stays in the footer. Cards contain a 4:3 image area, title, description, total time, servings, and status. Each full card is a link. The detail page contains a 16:9 image area, metadata, ingredient checkboxes, steps, and existing notes.

The grid uses one column below 768px, two columns from 768px, and three columns from 1200px. The interface must fit 320px without page-level horizontal scrolling. Search uses recipe titles and ingredient names from the existing public catalog. Search and status filters combine. They appear only when JavaScript runs; static reading remains available.

The current authoring contract has no image field. Both public recipes use neutral placeholders. The current schema accepts only `unverified`. The verified filter therefore returns the empty state until a separate contract change adds a verified value. Do not infer verification from notes or appearance.

## Accessibility and implementation

Use semantic landmarks, visible focus, labeled controls, 44px or larger controls where practical, and readable line lengths. The ingredient row has a touch-sized checkbox target. Respect `prefers-reduced-motion`. Keep transitions at 150ms or less. Use token colors in components. Keep scripts local to the page or shared layout. Preserve static Astro output, existing routes, base paths, and the strict content schema. Do not add remote assets or dependencies for this design system.
