# Authoring interface

## Contract

Version 1. Capabilities: recipe-create, recipe-update, ingredient-propose.
The canonical implementation contract is docs/ai/recipe-authoring.md.
Build-time inserts MUST use production definitions and src/content/ingredients.json.
The published /ai/recipe-authoring/ page MUST be self-contained.
Response metadata MUST remain outside frontmatter.
Recipe bodies MAY contain plain source URLs. The page MUST display them as escaped text, not links.

## Checks

Verify the marked example with the production parser, schema, and catalog.
Verify generated metadata, current catalog entries, routes, and absence of insertion markers.
