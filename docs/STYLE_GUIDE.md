# Ingredient calculator style guide

This page documents the calculator controls on recipe detail pages. Recipe content remains readable without JavaScript. The interactive toolbar and calculated rows appear after the local calculator loads.

## Components

### Calculator toolbar

Place the portions stepper, calculation status, reset control, and mode control in one wrapping toolbar. Keep status and reset beside the mode control when space permits. Remove instructional copy that creates an extra row. Let the toolbar wrap on narrow screens. All controls MUST have at least 44px height. Use inline SVG icons with visible Ukrainian labels for calculator, ready, and reset actions. Do not use emoji.

### Portions stepper

Use 44px square minus and plus buttons. Give each button an explicit Ukrainian accessible name and hover tooltip. Render the current portion number in `--mono`; expose the full portions phrase as its accessible label. Keep portions within the supported factor range.

### Amount input

Show an input only for measured ingredients while calculator mode is active. Keep the unit outside the input as muted text. Set `inputmode="decimal"`, a 16px `--mono` font, right alignment, and a minimum 44px height. Label the input with the ingredient name. Keep the checklist checkbox available.

### Apply button

Show the 44px primary check button only when the row draft differs from its current calculated value. Give it `aria-label="Застосувати"`. Enter applies the row. Blur does not apply it.

### Anchor badge and row

Give the anchor row a `--primary-soft` background. Show the small `основа` badge in `--mono`. In calculator mode, show the original amount below each changed amount in muted `--mono` text.
Keep every ingredient name and amount in fixed grid columns so quantities align across rows. Place the anchor badge beside the name so it cannot change the amount column. Use the same fixed columns for the displayed quantity/unit and the edit input/unit. Left-align displayed unit text in its cell and use the same muted color and font as the edit view. Reserve the apply-button column before a draft changes. At 360px, show the name on its own full-width row, then show the amount controls below it. Keep the previous amount and validation text aligned with the controls.

### Status bar

Show the status whenever the factor differs from one. Place it on the toolbar with the mode control and reset action. Use `--primary-soft`, readable `--text`, and `--mono` at 13px. Let long status text wrap on narrow screens. Keep its complete content visible. Give reset an icon and visible label.

### Step marker

Keep the step number and separator in one nowrap marker column. Use a max-content column so `01 ·` stays together at every supported width.

### Inline error

Place validation directly under the affected row. Use `role="alert"` and `--accent-text`. Associate the text with the input through `aria-describedby`.

## Tokens and interaction

- Use only design tokens for color, spacing, and radius. Do not add raw color values.
- Use `--mono` for numbers, labels, badges, and controls. Use `--sans` for ingredient names and help text.
- Keep focus visible with the shared 2px `--accent-text` outline and 2px offset.
- Use `--control-border` for input and button outlines.
- Respect reduced-motion preferences. Do not depend on animation to communicate state.
- Allow controls to wrap at 360px. Do not create page-level horizontal scrolling.

## Contrast check

These values use the current tokens in `public/design-kit/tokens.css` and the WCAG contrast formula. The status pair is `--text` on `--primary-soft`. The control pair is `--control-border` on `--surface`. The error pair is `--accent-text` on `--surface`.

| Pair                           | Navy light | Navy dark | Green light | Green dark |
| ------------------------------ | ---------: | --------: | ----------: | ---------: |
| Status text on soft background |    14.68:1 |   12.25:1 |     14.03:1 |    11.65:1 |
| Control border on surface      |     3.33:1 |    3.49:1 |      3.25:1 |     3.69:1 |
| Inline error on surface        |     5.93:1 |    9.54:1 |      6.53:1 |     5.86:1 |

The current tokens exceed the 4.5:1 text and 3:1 control thresholds for these pairs. No token change is required.
