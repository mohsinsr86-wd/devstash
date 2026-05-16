# Current Feature

Dashboard UI Phase 1

## Status

Completed

## Goals

- [x] ShadCN UI initialization and components
- [x] ShadCN component installation
- [x] Dashboard route at /dashboard
- [x] Main dashboard layout and any global styles
- [x] Dark mode by default
- [x] Top bar with search, New Collection, and New Item button (display only)
- [x] Placeholder for sidebar and main area

## References

- @context/screenshots/dashboard-ui-main.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md

## Notes

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, ESLint v9, ShadCN UI

## History

- Initialized Next.js 16 project with TypeScript strict mode
- Cleaned up boilerplate: simplified page.tsx to just `<h1>devstash</h1>`, stripped layout.tsx of fonts, removed 5 boilerplate SVGs from public/
- Created AGENTS.md with stack details, commands, and Next.js 16 breaking changes warning
- Created CLAUDE.md with project description and commands referencing AGENTS.md
- Initial commit `chore: initial next.js and tailwind setup` pushed to `https://github.com/mohsinsr86-wd/devstash.git`
- Added `dark` class to root layout for dark mode by default
- Created `/dashboard` route with layout: sidebar placeholder, top bar with search input, New Collection button, and New Item button, main area placeholder
- Created `src/components/ui/button.tsx` (Base UI + CVA) and `src/components/ui/input.tsx` (Base UI)
- Created `src/lib/utils.ts` (cn helper) and `src/lib/mock-data.ts` (users, collections, items, item types)

### Features delivered in Phase 1

- ShadCN UI initialized with Base UI components (Button, Input) and CVA variants
- Dark mode set as default via `dark` class on `<html>` in root layout
- Dashboard route at `/dashboard` with responsive flex layout (sidebar + main)
- Top bar: search input (disabled, placeholder), New Collection button (outline), New Item button (primary + icon)
- Sidebar and main area placeholders ready for Phase 2 content
