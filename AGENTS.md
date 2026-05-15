# AGENTS.md

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript strict
- **Tailwind CSS v4** — CSS-driven config; no `tailwind.config.*` file. Import via `@import "tailwindcss"` in `globals.css`.
- **ESLint v9** flat config (`eslint.config.mjs`), extends `eslint-config-next`
- No test runner, no Prettier, no CI configured

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Important

- **Next.js 16 has breaking changes** from earlier versions. APIs, conventions, and file structure may differ from your training data. Check `node_modules/next/dist/docs/` before writing framework-specific code.
- Path alias: `@/*` → `./src/*`
