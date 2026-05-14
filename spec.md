# Spec: Testing Infrastructure for the Shell

## Problem Statement

The shell has no tests (`npm test` exits 1). This spec covers adding a two-layer testing
strategy: **unit tests** (Vitest + jsdom) for the shell's routing logic with mocked Module
Federation imports, and **E2E tests** (Playwright) for browser-level smoke testing of the
running shell. Both layers must pass in CI before the build proceeds.

---

## Scope

- **In scope**: `src/shell/` (Router, MicroFrontends enum)
- **Out of scope**: MFE1, about-module, features — tested separately if needed later

---

## Requirements

### Unit Tests (Vitest)

1. Use **Vitest** with the `jsdom` environment so `document`, `window`, and `location` are
   available without a real browser.
2. Module Federation dynamic imports (`import('mfe1/component')`, `import('about/component')`)
   must be **mocked** via Vitest's `vi.mock()` — tests must not require live remote servers.
3. Test file location: `src/shell/__tests__/` (co-located with source).
4. TypeScript support via Vitest's native TS handling (no separate `ts-jest` or Babel needed).
5. Cover the following cases in `Router`:
   - Default hash (`""` / no hash) renders `<h1>Home</h1>` into `#appContainer`.
   - `#/mfe1` calls `loadModule(MicroFrontends.Mfe1)` and appends the mocked element.
   - `#/about` calls `loadModule(MicroFrontends.Mfe2)` and appends the mocked element.
   - `#/contact` calls `fetchHtml('contact.html')` (mock `fetch`).
   - An unsupported MFE enum value in `loadModule()` throws an error.
   - `removeFirstChild()` removes an existing child before loading a new route.
   - Constructor throws if `#appContainer` is absent from the DOM.
6. Cover `MicroFrontends` enum: all three values (`Mfe1`, `Mfe2`, `Mfe3`) are defined.

### E2E Tests (Playwright)

7. Use **Playwright** targeting Chromium only (sufficient for smoke tests; can expand later).
8. E2E tests live in `e2e/` at the repo root.
9. Playwright config (`playwright.config.ts`) starts the shell dev server
   (`webpack serve --config webpack.config.js`, port 47000) automatically via `webServer`.
   MFE remotes are **not** started — the shell must handle failed remote loads gracefully
   (or the E2E tests avoid navigating to routes that require live remotes).
10. Cover the following E2E cases:
    - Shell loads at `http://localhost:47000` and the page title is present.
    - Default route renders an `<h1>` containing "Home".
    - Navigating to `#/contact` renders the contact page content (fetched HTML).
    - Navigation links (if present in the shell HTML) are clickable and change the hash.

### npm Scripts

11. `npm run test:unit` — runs Vitest once (non-watch).
12. `npm run test:e2e` — runs Playwright.
13. `npm test` — runs `test:unit` then `test:e2e` (replaces the current stub).

### CI (GitHub Actions — `ci-cd.yml`)

14. Add a `test` job that runs after `analyze-codeql` and before `build`.
15. The `build` job gains `needs: [test]` so a test failure blocks deployment.
16. The test job runs `npm run test:unit` only (Playwright E2E requires a display/browser
    install; keep E2E as a separate optional job or local-only for now — see note below).

> **Note on E2E in CI**: Playwright can run headless in CI with `ubuntu-latest` using
> `npx playwright install --with-deps chromium`. This can be added to the CI test job,
> but requires the shell dev server to be startable in CI (no live MFE remotes needed
> for the contact/home routes). The spec includes this as an optional extension.

---

## Acceptance Criteria

- [ ] `npm run test:unit` passes with all Router and MicroFrontends unit tests green.
- [ ] `npm run test:e2e` passes against a locally running shell (home + contact routes).
- [ ] `npm test` runs both layers in sequence and exits 0 when all pass.
- [ ] CI `test` job runs `npm run test:unit` and blocks `build` on failure.
- [ ] No existing lint, build, or CI steps are broken.
- [ ] Federation dynamic imports are never called in unit tests (verified by mock assertions).

---

## Implementation Steps

1. **Install Vitest and jsdom**
   - Add `vitest`, `@vitest/coverage-v8`, `jsdom` to `devDependencies`.
   - Add `vitest.config.ts` at repo root: `environment: 'jsdom'`, include `src/shell/**`.

2. **Configure TypeScript for tests**
   - Add `"types": ["vitest/globals"]` (or `/// <reference types="vitest/globals" />`) so
     `describe`/`it`/`expect`/`vi` are available without explicit imports.
   - Ensure `tsconfig.json` includes test files (or create a `tsconfig.test.json` that
     extends the root and adds `src/shell/__tests__/**`).

3. **Write Router unit tests** (`src/shell/__tests__/router.test.ts`)
   - Mock `import('mfe1/component')` and `import('about/component')` with `vi.mock()`.
   - Mock `window.fetch` for the `#/contact` path.
   - Set up a minimal DOM (`<div id="appContainer">`) in `beforeEach`, tear down in
     `afterEach`.
   - Instantiate `Router` and drive it by setting `location.hash` and dispatching
     `hashchange` events.

4. **Write MicroFrontends enum test** (`src/shell/__tests__/MicroFrontends.test.ts`)
   - Assert all three enum members exist and have distinct values.

5. **Add npm scripts**
   - `"test:unit": "vitest run"`
   - `"test:e2e": "playwright test"`
   - `"test": "npm run test:unit && npm run test:e2e"`

6. **Install and configure Playwright**
   - Add `@playwright/test` to `devDependencies`.
   - Create `playwright.config.ts`: Chromium only, `webServer` pointing to
     `npm run start:shell` on port 47000, `baseURL: 'http://localhost:47000'`.

7. **Write E2E tests** (`e2e/shell.spec.ts`)
   - Home route: page loads, `<h1>` contains "Home".
   - Contact route: navigate to `#/contact`, assert contact content appears.

8. **Update CI (`ci-cd.yml`)**
   - Add `test` job: checkout → setup Node 20 → `npm install` → `npm run test:unit`.
   - Add `needs: [test]` to the `build` job.
   - (Optional) extend `test` job to also run `npm run test:e2e` with
     `npx playwright install --with-deps chromium`.

9. **Update `AGENTS.md`**
   - Document the new test scripts and file locations under a "Testing" section.
   - Add a convention rule: **any new feature or change to existing shell code must be
     accompanied by corresponding unit tests** (and E2E tests where behaviour is
     user-visible). This applies to new routes, new MFE enum values, and changes to
     `Router` logic. Add this to both the "Conventions" section and the
     "What Agents Should NOT Do" section (as a "do not skip tests" rule).
