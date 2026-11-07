# Quickstart: ingredient-calculator

## Automated checks

From the repository root, run:

```sh
npm run verify
```

The verification command checks types, lint, formatting, unit tests, static build output, and route content.

## Manual scenarios

1. Open `/Food-Lab/recipes/hrechka-z-morkvoiu/`.
2. In calculator mode, enter `60` for Морква and apply. Confirm 80 г buckwheat, 175 мл water, one portion, and Морква as the anchor.
3. Enter `700` for Вода and apply. Confirm 320 г buckwheat, 240 г carrot, four portions, and Вода as the anchor.
4. Enter `1,5`, `1.5`, `1/2`, and `1 1/2` on a scalable row. Confirm each applies.
5. Try empty, `abc`, `0`, and an input that produces a factor above 20. Confirm inline validation and unchanged applied state.
6. Choose Готово. Confirm the calculated values stay visible.
7. Reload and confirm state restoration. Choose Скинути and confirm original values and current mode.
8. Test keyboard use, 360px, 768px, and 1280px layouts in all four theme/palette pairs.
