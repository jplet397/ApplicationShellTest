# AGENTS-IMPROVEMENT-SPEC.md

Concrete improvements needed for `AGENTS.md` and the repository's agent-readiness.
Each item states the problem, the desired state, and the exact change required.

---

## Audit Summary

### What is good

| Area | Status |
|------|--------|
| TypeScript strict mode | Enabled — agents can rely on type safety |
| `.gitignore` | Covers `node_modules/` and `dist/` |
| Webpack configs | One config per app — clear separation |
| Shadow DOM isolation | Consistent across all Web Components |
| `rxjs` shared in federation | Prevents duplicate instances |
| CodeQL workflow | Security scanning in CI |
| `SECURITY.md` | Present |

### What is missing

1. **`AGENTS.md`** — did not exist (now created)
2. **No test framework** — `npm test` exits 1; agents cannot verify changes
3. **No linter** — no ESLint/Prettier config; agents have no style enforcement signal
4. **`about` MFE** — referenced in router and webpack but absent from repo; agents will produce broken code if they follow existing patterns
5. **`docs/create-new-micro-front-end.md`** — body is a TODO; agents lack a step-by-step guide for the most common extension task
6. **No type stubs for federation imports** — `@ts-ignore` is used; agents cannot infer module shapes
7. **No `npm-run-all` in devDependencies** — `start:all` uses it but it is not declared

### What is wrong

1. **`build` scripts use Windows-only syntax** (`set NODE_ENV=production&&`) — CI runs on `ubuntu-latest` and will fail if the test/build step ever calls these scripts directly
2. **`src/config/federationConfig.js` references React** — `react` and `react-dom` are not dependencies; this file is dead/misleading code
3. **`src/config/TODO` is a plain text file** — should be a proper issue or inline comment, not a tracked file
4. **`README.md` is a placeholder** — provides no useful context for agents or contributors
5. **`package.json` has no `name` or `version` field** — non-standard; some tooling and agents assume these exist
6. **`todo.md` at repo root** — informal task list mixed with source; agents may treat it as authoritative spec

---

## Improvement Specifications

### ~~SPEC-1: Fix cross-platform build scripts~~ ✅ RESOLVED

Replaced `set NODE_ENV=production&&` with `cross-env NODE_ENV=production` in all build scripts.
`webpack.mfe1.config.js` and `webpack.about.config.js` updated to read `process.env.NODE_ENV` for `mode`/`devtool`.

---

### ~~SPEC-2: Declare `npm-run-all` in devDependencies~~ ✅ RESOLVED

Added `npm-run-all` and `cross-env` to `devDependencies`. Also added `name` and `version` fields (SPEC-3).

---

### ~~SPEC-3: Add `name` and `version` to `package.json`~~ ✅ RESOLVED

Added alongside SPEC-2.

---

### ~~SPEC-4: Remove or fix `src/config/federationConfig.js`~~ ✅ RESOLVED

Deleted `src/config/federationConfig.js`, `src/config/TODO`, and the now-empty `src/config/` directory.

---

### SPEC-5: Implement or stub the `about` MFE

**Problem**: `webpack.config.js` declares `about` as a remote at `localhost:50002`. `router.ts` imports `about/component`. The MFE does not exist. Any agent following the existing pattern will produce code that compiles but fails at runtime.

**Options** (choose one):
- Create a minimal `src/about-module/` MFE mirroring `src/mfe1/` structure with its own webpack config
- Remove all references to `about` from `webpack.config.js` and `router.ts` until it is built

**Files**: `webpack.config.js`, `src/shell/router.ts`, `src/shell/MicroFrontends.ts`, optionally `webpack.about.config.js`

---

### SPEC-6: Add a test framework

**Problem**: `npm test` exits 1. Agents cannot run tests to verify changes. `todo.md` item 1 acknowledges this.

**Recommended approach**: Add [Vitest](https://vitest.dev/) (works with Webpack projects, no config needed for unit tests) or Jest with `ts-jest`.

**Minimum viable setup**:
```bash
npm install --save-dev vitest
```
Add to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest"
```
Add one smoke test per module (e.g. `src/shell/router.test.ts`) to confirm the framework works.

**Files**: `package.json`, `vitest.config.ts` (or `jest.config.ts`), `src/**/*.test.ts`

---

### ~~SPEC-7: Add ESLint~~ ✅ RESOLVED

Implemented a dual-linter setup: ESLint 10 + `@typescript-eslint` for the shell/shared code (`eslint.config.js`), and Biome 2 for mfe1 (`src/mfe1/biome.json`). Scripts: `lint:shell`, `lint:mfe1`, `lint`. CI runs `npm run lint` before the build step.

**Problem**: No linting. Agents produce inconsistent style and cannot self-check.

**Minimum viable setup**:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
Add `.eslintrc.json`:
```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parserOptions": { "project": "./tsconfig.json" }
}
```
Add to `package.json`:
```json
"lint": "eslint \"src/**/*.ts\""
```

**Files**: `.eslintrc.json`, `package.json`

---

### SPEC-8: Add federation type stubs

**Problem**: `@ts-ignore` suppresses type errors on all federation dynamic imports. Agents cannot infer what a remote module exports.

**Change**: Create declaration files for each remote:

`src/types/mfe1.d.ts`:
```typescript
declare module 'mfe1/component' {
  export const elementName: string;
}
```

`src/types/about.d.ts`:
```typescript
declare module 'about/component' {
  export const elementName: string;
}
```

Remove `@ts-ignore` comments from `router.ts` once stubs are in place.

**Files**: `src/types/mfe1.d.ts`, `src/types/about.d.ts`, `src/shell/router.ts`, `tsconfig.json` (add `include` for `src/types`)

---

### SPEC-9: Complete `docs/create-new-micro-front-end.md`

**Problem**: The file body is `TODO`. This is the most common extension task and agents will improvise without it.

**Required content** (step-by-step):
1. Create `src/<mfe-name>/` with `main.ts`, `component.ts`, `index.html`, `styles.css`
2. Create `webpack.<mfe-name>.config.js` (copy `webpack.mfe1.config.js`, update `name`, `port`, `exposes`)
3. Add `start:<mfe-name>` and `build:<mfe-name>` to `package.json`
4. Add the remote URL to `webpack.config.js` under `remotes`
5. Add an enum value to `src/shell/MicroFrontends.ts`
6. Add a `case` to `router.ts → handleHashChange()` and `loadModule()`
7. Add a type stub to `src/types/<mfe-name>.d.ts`
8. Add a nav link to `src/shell/index.html`

**Files**: `docs/create-new-micro-front-end.md`

---

### SPEC-10: Expand `README.md`

**Problem**: README is a placeholder. Agents and contributors have no entry point.

**Minimum required sections**:
- What this project is (one paragraph)
- Prerequisites (Node version, OS notes)
- Getting started (`npm install && npm run start:all`)
- Architecture overview (link to `docs/`)
- How to add a new MFE (link to `docs/create-new-micro-front-end.md`)

**Files**: `README.md`

---

### SPEC-11: Update `AGENTS.md` after each spec is resolved

As each spec above is implemented, update the corresponding entry in `AGENTS.md`:
- Move resolved known issues out of "Known Issues"
- Update the dev commands table if ports or scripts change
- Add any new conventions introduced (e.g. test file naming, lint rules)

**Files**: `AGENTS.md`

---

## Priority Order

| Priority | Spec | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| 1 | SPEC-1 (build scripts) | Low | Unblocks CI | ✅ Done |
| 2 | SPEC-2 (npm-run-all) | Trivial | Unblocks `start:all` | ✅ Done |
| 3 | SPEC-3 (package name/version) | Trivial | Standards compliance | ✅ Done |
| 4 | SPEC-4 (dead federation config) | Trivial | Removes misleading code | ✅ Done |
| 5 | SPEC-5 (about MFE) | Medium | Removes broken reference | Pending |
| 6 | SPEC-8 (type stubs) | Low | Improves agent type inference | Pending |
| 7 | SPEC-6 (tests) | Medium | Enables agent verification | Pending |
| 8 | SPEC-7 (lint) | Low | Enforces style | ✅ Done |
| 9 | SPEC-9 (docs) | Medium | Guides MFE additions | Pending |
| 10 | SPEC-10 (README) | Low | Onboarding | Pending |
