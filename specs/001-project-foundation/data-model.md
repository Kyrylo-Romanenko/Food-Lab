# Data model

## Recipe

All fields are required: id, title, description, category, tags, difficulty, status, servings,
time, ingredients, steps. Unknown fields MUST fail at every object level.
IDs and path slugs MUST match lowercase kebab-case: [a-z0-9]+(-[a-z0-9]+)*.
Text MUST contain non-whitespace characters. Tags MAY be empty.
Category: breakfast, main, side, soup, salad, dessert. Difficulty: easy, medium, hard.
Status: unverified. Servings: positive integer. Time: prep and cook, non-negative integer minutes.
Ingredients: nonempty array. Each entry has ingredientId and amount.
Measured amount: kind=measured, quantity=positive finite number, unit=g|kg|ml|l|tsp|tbsp|piece.
To-taste amount: kind=to-taste only. Steps: nonempty array of strict id/text objects.
Step IDs MUST be unique within a recipe. Recipe IDs and slugs MUST be globally unique.
Body: optional plain paragraphs for notes and attribution. Plain URLs are escaped text, not clickable links. HTML, Markdown links or formatting, images, and lists are unsupported.

## Ingredient

Strict id/name objects. IDs MUST be unique. Names MUST be nonempty Ukrainian text.
Every recipe ingredientId MUST exist in src/content/ingredients.json.
No aliases, density conversion, ranges, media fields, or verification history.

## Routes

src/content/recipes/<slug>/index.md maps to /recipes/<slug>/ under BASE_PATH.
The route slug is independent of the stable recipe ID.

## State

No runtime mutation or private storage exists. All examples remain unverified.
