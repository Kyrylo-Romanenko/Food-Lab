# Foundation compatibility decisions

## Inputs

No architecture research was supplied. This file records new setup evidence, not reconstructed research.
The bootstrap request is the product input.

## Decisions

- Use installed Node 24.15.0 and npm 11.12.1. Node 24 is LTS per https://nodejs.org/en/about/previous-releases.
- npm registry metadata reports Astro 7.4.7 requires Node >=22.23.4 and npm >=9.6.5. The installed runtime satisfies both.
- @astrojs/preact 6.1.2 accepts Preact ^10.6.5 or ^11.0.0. Use a matching stable release.
- Vitest 5.1.0 accepts Node ^24.0.0. ESLint 10.14.0 accepts Node >=24. typescript-eslint 8.72.1 accepts ESLint 10 and TypeScript <6.1.
- Prefer production loader validation over a second content-only validator. Reference: https://docs.astro.build/en/reference/content-loader-reference/.
- Use official actions/checkout@v7 and actions/setup-node@v7, as documented in their official main READMEs at setup time. Use GitHub-hosted ubuntu-latest.
- Preserve the existing MIT notice and confirmed holder. Use the official CC BY 4.0 reference for original content.

## Spec Kit

Installed specify-cli 1.0.12 in its existing isolated uv tool environment.
Initialized with specify init --here --integration codex --script ps after confirming only LICENSE and README existed.
The supported integration installed .agents/skills/speckit-* and .specify/ templates/scripts.
Skills and resolved templates are followed directly. No slash command execution is claimed.
No extension hooks are installed. The current workflow does not require branch creation.

## Alternatives

Do not use a separate content registry, runtime Markdown renderer, site service, or framework starter.
These add duplication or exceed this foundation.

## Resolved tooling choices

Use eslint-plugin-astro 1.3.1 and ESLint 10.14.0. The current plugin requires Node 24.16.0,
which exceeds the installed patch. The selected plugin accepts the installed runtime.
Use TypeScript 6.0.3, not current major 7: @astrojs/check 0.9.12 accepts TypeScript 5 or 6,
and typescript-eslint requires TypeScript below 6.1. Exact resolved versions are in package.json.
The guide loader uses LoaderContext.renderMarkdown. Astro 7 exports Zod through astro/zod.
YAML parses authored frontmatter with duplicate-key rejection; it is a direct current dependency.

## Consistency analysis

Followed installed speckit-analyze instructions directly before implementation.
10 requirements map to 9 tasks (100% requirement coverage). No unmapped tasks,
material ambiguities, duplicate requirements, or critical constitution conflicts were found.
FR-001/004: T004; FR-002/003: T002-T003; FR-005/006: T005-T006;
FR-007: T001/T005/T007; FR-008: T007-T008; FR-009: T008-T009; FR-010: T001/T009.
The requirements checklist passed 5/5. No extension hooks were present.

## Dependency audit remediation

The initial lint toolchain resolved minimatch 10.2.6. npm audit reported the moderate
GHSA-g3hv-75wg-m249 advisory through ESLint and typescript-eslint.
Use a bounded minimatch 11.0.5 override. Its Node requirement is 20 or >=22.
The advisory identifies 11.0.1 as patched: https://github.com/advisories/GHSA-g3hv-75wg-m249.
Verification MUST exercise the lint toolchain after this major transitive override.
Remove the override when upstream packages select a patched compatible release.
ESLint 9 was not retained because npm marks that release unsupported.

## Selected direct packages

- @astrojs/preact: 6.1.2.
- astro: 7.4.7.
- preact: 11.2.0.
- yaml: 2.9.1.
- @astrojs/check: 0.9.12.
- @eslint/js: 10.0.1.
- @types/node: 24.19.2.
- eslint: 10.14.0.
- eslint-plugin-astro: 1.3.1.
- globals: 17.14.0.
- prettier: 3.9.10.
- prettier-plugin-astro: 1.1.2.
- typescript: 6.0.3.
- typescript-eslint: 8.72.1.
- vitest: 5.1.0.

Astro CLI scripts preload scripts/no-telemetry.mjs to disable build-tool telemetry.
No client telemetry is present. npm ci pins the dependency tree in package-lock.json.
