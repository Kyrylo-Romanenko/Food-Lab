# Visual rules for agents

- Use variables from `public/design-kit/tokens.css`. Do not add raw colors to component CSS.
- Use the local fonts in `public/design-kit/fonts/`. Headings and numbers use `--mono`; body text uses `--sans`.
- Keep touch controls at least 44px high. Preserve visible keyboard focus.
- Keep calculator inputs at least 44px high and 16px in `--mono`. Use the existing `--control-border` and `--accent-text` tokens for control borders and focus.
- Use `--primary-soft` for the active ingredient row and calculation status. Use `--accent-text` for inline errors.
- Keep emoji to missing-image placeholders and brief status or empty-state uses. Use SVG for UI icons.
- Check dark and light themes in navy and green after each visual change. Dark navy is the default.
- Preserve recipe content, routes, schema, and the `/Food-Lab/` base path.
- Read `docs/design-system.md` for token roles, layout rules, and contrast values.
- Read `docs/STYLE_GUIDE.md` for the ingredient calculator component patterns.
