# Validation scenarios

## Inputs

Use Node 24.15.0 or a newer Node 24 patch and npm 11.12.1.

## Checks

1. Run npm ci.
2. Run npm run verify.
3. Run npm run dev and open the printed local address.
4. Follow the catalog recipe link and footer authoring link.
5. Confirm all content is readable with JavaScript disabled.
6. Run npm run build -- --base /Food-Lab/.
7. Run node scripts/check-output.mjs /Food-Lab/.
8. Run npm run build to restore default output.

Invalid-content cases are tested in tests/content.test.ts. Contract cases are tested in tests/authoring.test.ts.
Browser checks MUST be reported separately from static assertions.
