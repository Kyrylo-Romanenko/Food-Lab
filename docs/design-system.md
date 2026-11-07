# Food Lab design system

The design kit in `public/design-kit/` supplies the colors, self-hosted fonts, and font licenses. The dark navy palette is the default. The user can cycle through dark, light, and automatic themes in the header. Automatic mode follows `prefers-color-scheme`. The selection persists in `localStorage` when storage is available. The server renders dark when JavaScript is disabled.

## Design rules

Use calm surfaces, strong monospace headings, readable body text, and small accents. Use natural recipe content. Keep controls large enough for kitchen use. Use one border and surface contrast instead of heavy shadows. The recipe schema has no image field; placeholders use one emoji each. Both current recipes remain unverified.

## Color tokens

`public/design-kit/tokens.css` is the color source. Set `data-palette="green"` on `<html>` to use the green palette. Do not copy color literals into component CSS.

| Token              | Role                               | Navy light | Navy dark | Green light | Green dark |
| ------------------ | ---------------------------------- | ---------- | --------- | ----------- | ---------- |
| `--bg`             | Page                               | `#F6F7F9`  | `#0A1220` | `#F7F8F5`   | `#0B1510`  |
| `--surface`        | Cards and controls                 | `#FFFFFF`  | `#111C2E` | `#FFFFFF`   | `#122019`  |
| `--border`         | Decorative dividers                | `#E0E5EC`  | `#223049` | `#E0E7E1`   | `#223A2D`  |
| `--control-border` | Control outlines                   | `#828E9E`  | `#62728A` | `#859286`   | `#607C6D`  |
| `--text`           | Main text                          | `#0F1B2D`  | `#E8EDF5` | `#14231B`   | `#E6EFE9`  |
| `--muted`          | Secondary text                     | `#5A6678`  | `#9AA7BA` | `#5B6B61`   | `#9BB0A3`  |
| `--primary`        | Brand actions and badges           | `#0B2D5E`  | `#7DABF2` | `#14532D`   | `#63C48C`  |
| `--on-primary`     | Text on brand fill                 | `#FFFFFF`  | `#0A1220` | `#FFFFFF`   | `#0B1510`  |
| `--primary-soft`   | Soft brand fill                    | `#E6EDF8`  | `#172A47` | `#E4F1E8`   | `#173324`  |
| `--accent`         | Accent fill and icon               | `#D98E04`  | `#F2B84B` | `#B4232C`   | `#F0707A`  |
| `--accent-text`    | Accent text and focus              | `#8A5A00`  | `#F2B84B` | `#B4232C`   | `#F0707A`  |
| `--ok`             | Verified status if supported later | `#1F7A4D`  | `#58C08A` | `#14532D`   | `#63C48C`  |

`--surface-hover` uses the kit's soft brand fill. `--control-border` is the only new color family. It gives input and button outlines at least 3:1 contrast against each surface. Decorative `--border` remains subtle and does not identify an interactive control.

## Typography and layout

`public/design-kit/fonts.css` loads local Inter 400/500/600 and JetBrains Mono 500/700 in Latin and Cyrillic. Body text uses `--sans` at 16px/1.6. Headings use `--mono`: H1 28–40px, H2 24px, H3 and card titles 18px. Step text uses 20px. Description text uses 14px. Metadata uses `--mono` at 13px and badges at 12px. Numbers, time, and quantities use `--mono`.

Spacing tokens are 4, 8, 12, 16, 24, 32, and 48px. Radius tokens are 8, 12, and 16px. Main width is 960px; recipe reading width is 720px. Cards use one column below 600px, two columns from 600px, and three from 900px. Card images are 4:3 and the recipe hero is 16:9. Safe area padding protects the footer. The page must fit 320px.

## Components and access

The header has a brand link, recipe link, and SVG theme control. Catalog cards are whole links. Search checks recipe titles and ingredient names from validated content. Search and status filters combine. Controls appear only when JavaScript runs; recipes remain readable without it. The detail page uses checkbox rows, numbered steps, a static time chip, and the original notes. The time chip does not start a timer.

Give buttons and inputs at least 44px of touch height. Keep focus visible with a 2px `--accent-text` outline and 2px offset. Respect reduced motion. Use a single emoji in each missing-image placeholder. Do not add emoji to headings, navigation, or primary controls. Use inline SVG for UI icons. Do not invent recipe images, verification states, or cooking behavior.

## Contrast review

The values below were computed from the token values with the WCAG contrast formula. They cover text and control pairs used by the site. This is a numeric token check, not a browser accessibility audit.

| Pair                      | Navy light | Navy dark | Green light | Green dark |
| ------------------------- | ---------: | --------: | ----------: | ---------: |
| Text on page              |      16.12 |     15.95 |       15.32 |      15.84 |
| Text on surface           |      17.28 |     14.53 |       16.33 |      14.35 |
| Muted on page             |       5.43 |      7.69 |        5.30 |       8.09 |
| Muted on surface          |       5.82 |      7.00 |        5.64 |       7.33 |
| Primary on page           |      12.63 |      8.02 |        8.55 |       8.69 |
| Primary on soft fill      |      11.50 |      6.16 |        7.83 |       6.39 |
| On-primary on primary     |      13.54 |      8.02 |        9.11 |       8.69 |
| Accent text on surface    |       5.93 |      9.54 |        6.53 |       5.86 |
| OK on surface             |       5.32 |      7.58 |        9.11 |       7.87 |
| Control border on surface |       3.33 |      3.49 |        3.25 |       3.69 |

All listed text pairs exceed 4.5:1. Control borders exceed 3:1. Check both themes and both palettes after a token change.
