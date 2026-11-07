# Personal Cookbook

The display label is provisional. This repository contains a static foundation, not the complete product.

## Run

Use Node 24.15.0 or a newer Node 24 patch and npm 11.12.1.

```sh
npm ci
npm run verify
npm run dev
```

Use npm run build and npm run preview for production output. test uses watch mode; test:run exits.
Use npm run format to format source. verify checks formatting without changing source.

## Author and continue

- [Constitution](.specify/memory/constitution.md)
- [Specification](specs/001-project-foundation/spec.md), [plan](specs/001-project-foundation/plan.md), [tasks](specs/001-project-foundation/tasks.md)
- [Agent instructions](AGENTS.md) and [handoff](docs/handoff.md)
- [AI authoring source](docs/ai/recipe-authoring.md); copy the complete rendered pack from /ai/recipe-authoring/.
- [Compatibility evidence](specs/001-project-foundation/research.md)

Spec Kit 1.0.12 uses Codex skills in .agents/skills/.
Entry points: $speckit-constitution, $speckit-specify, $speckit-plan, $speckit-tasks,
$speckit-analyze, $speckit-implement. Bootstrap followed installed instructions directly.
On a new checkout, set SPECIFY_FEATURE_DIRECTORY to specs/001-project-foundation before
continuing this feature. Spec Kit keeps its feature.json pointer local and ignored.

## Deployment inputs

The GitHub Pages workflow builds the site for the `/Food-Lab/` base path.
Build with npm run build -- --base /Food-Lab/ for that subpath, or set BASE_PATH before building.
Use node scripts/check-output.mjs /Food-Lab/ to check that output.
Use trailing-slash URLs. Configure the host to serve dist/ and its 404.html.
No production domain is assumed. Restart dev after editing guide source or catalog definitions.

## Boundaries and licenses

The theme control stores a public display preference in localStorage. Catalog search and status filters run on the current page.
No recipe storage, scaling, cooking mode, offline support, AI API, authentication, or sync is implemented.
Do not commit private data, backups, or credentials.
Code uses [MIT](LICENSE). Original recipes, documentation, and project media use
[CC BY 4.0](LICENSE-CONTENT.md). See [NOTICE.md](NOTICE.md) for scope and reuse rights.
