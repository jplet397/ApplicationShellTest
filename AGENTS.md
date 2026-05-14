# AGENTS.md — ApplicationShellTest

Agent guidance for AI coding assistants working in this repository.

---

## Project Overview

A **Webpack Module Federation** shell application written in TypeScript (no framework).
The shell hosts multiple micro-frontends (MFEs) via hash-based routing and Web Components.

| App | Entry | Dev port |
|-----|-------|----------|
| Shell | `src/shell/index.ts` | 50000 |
| mfe1 | `src/mfe1/main.ts` | 50001 |
| about (mfe2) | *(not yet in repo)* | 50002 |

---

## Repository Layout

```
src/
  shell/          # Host application (router, MFE loader)
  mfe1/           # Micro-frontend 1 — Flights (Web Component)
  features/       # Feature modules loaded directly by the shell (e.g. contact)
  about-module/   # Placeholder — not yet implemented
docs/             # GitHub Pages docs
arm-templates/    # Azure deployment templates
.github/workflows # CI/CD (build → Azure Web App) + CodeQL
```

---

## Tech Stack

- **Language**: TypeScript 5, compiled via `ts-loader`
- **Bundler**: Webpack 5 with Module Federation Plugin
- **Styling**: SCSS → PostCSS → MiniCssExtractPlugin
- **Reactive**: RxJS 7
- **Runtime**: Vanilla Web Components (no framework)
- **CI**: GitHub Actions → Azure Web App

---

## Dev Commands

```bash
npm install                  # install dependencies
npm run start:all            # shell (50000) + mfe1 (50001) in parallel
npm run start                # shell only
npm run start:mfe1           # mfe1 only
npm run build                # production build of shell
npm run build:mfe1           # production build of mfe1
```

Build scripts use `cross-env` and work on Linux, macOS, and Windows.

---

## Architecture Patterns

### Routing
Hash-based (`#/mfe1`, `#/about`, `#/contact`). Implemented in `src/shell/router.ts`.
Adding a new route requires:
1. A new `MicroFrontends` enum value in `src/shell/MicroFrontends.ts`
2. A `case` in `router.ts → handleHashChange()`
3. A `case` in `router.ts → loadModule()` with the federation import

### Micro-frontends
Each MFE is a **Web Component** (`HTMLElement` subclass) exposed via Module Federation.
The shell dynamically imports the component and appends it to `#appContainer`.

### Module Federation
- Shell config: `webpack.config.js` (remotes: `mfe1`, `about`)
- MFE1 config: `webpack.mfe1.config.js` (exposes `./component`)
- Shared lib: `rxjs` (not singleton — see `todo.md` item 6)

---

## Known Issues / Active TODOs

See `todo.md` for the full list. Key items:

- No tests (`npm test` exits 1)
- No linting configured
- `about` MFE is referenced in router and webpack config but does not exist in the repo
- `@ts-ignore` used for federation dynamic imports — no type stubs yet

---

## Conventions

- TypeScript strict mode is enabled (`tsconfig.json`)
- Web Components use Shadow DOM (`mode: 'open'`)
- `@ts-ignore` is used for federation dynamic imports — acceptable until proper type stubs exist
- No framework — keep it that way unless explicitly decided otherwise
- Commit messages: imperative mood, plain English, no ticket prefix required

---

## What Agents Should NOT Do

- Do not add React, Angular, or Vue unless explicitly requested
- Do not change port numbers (50000/50001/50002) without updating all webpack configs and the shell's remote URLs
- Do not remove `rxjs` from `shared` in federation configs — it must be shared to avoid duplicate instances
- Do not commit `node_modules/` or `dist/`
