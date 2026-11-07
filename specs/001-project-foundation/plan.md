# Implementation Plan: project-foundation

**Branch**: existing main | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)
**Input**: Approved bootstrap specification.

## Summary

Generate static Ukrainian catalog and recipe pages. Publish one generated English authoring contract.

## Technical Context

**Language/Version**: strict TypeScript; Node 24 LTS; npm 11.
**Primary Dependencies**: Astro 7, Preact integration, Astro-exported Zod; YAML for frontmatter parsing.
**Storage**: Git files only.
**Testing**: Vitest, Astro check, ESLint, Prettier, generated HTML assertions.
**Target Platform**: static hosts, including repository subpaths; Windows/Linux development.
**Project Type**: static web application.
**Performance Goals**: no client runtime on foundation pages; no external asset requests.
**Constraints**: no backend, storage, scaling, or future controls.
**Scale/Scope**: one recipe, small catalog, four route types.

## Constitution Check

C01-C08 pass before and after design. No exceptions.
No feature requires hydration. Domain algorithms and storage remain absent.
The build-time loader validates raw authored objects before adding framework metadata.

## Project Structure

- src/schemas/recipe.ts: shared definitions and strict schemas.
- src/content/ingredients.json: authoritative ingredient catalog.
- src/content/recipes/<slug>/index.md: public recipes and future adjacent media.
- src/content.config.ts: supported Astro content loaders.
- src/lib/content.ts: production discovery, reference and uniqueness validation.
- src/lib/authoring.ts: specific Context Pack composition, not a generic generator.
- src/layouts/Base.astro, src/pages/, src/styles/global.css: local static presentation.
- docs/ai/recipe-authoring.md: canonical authoring prose and marked example.
- tests/: production validation and contract tests.
- scripts/check-output.mjs: post-build route and content checks.
- .github/workflows/verify.yml: CI verification only.
- .specify/ and .agents/skills/: installed Spec Kit 1.0.12 artifacts.

## Design Decisions

Use a custom Astro loader to validate all raw files before collection storage.
Use the loader renderMarkdown API for the composed guide; no runtime parser.
Recipe body supports plain paragraphs only. Render them as escaped text.
Derive slug from the single parent directory. Reject unsupported recipe paths.
Use BASE_PATH at build time and Astro BASE_URL for links. Do not invent a domain.
Derive context build from git rev-parse HEAD; append dirty when applicable; fallback unknown.
Pin direct package versions and commit one npm lockfile.

## Complexity Tracking

No constitution violations. Shared modules protect content integrity and the authoring contract.
