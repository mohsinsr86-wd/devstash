# Current Feature

Dashboard UI Phase 2

## Status

Completed

## Goals

- [x] Collapsible sidebar
- [x] Items/types with links to /items/TYPE (e.g. /items/snippets)
- [x] Favorite collections
- [x] Most recent collections
- [x] User avatar area at the bottom
- [x] Drawer icon to open/close sidebar
- [x] Always a drawer on mobile view

## References

- @context/screenshots/dashboard-ui-main.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md

## Notes

- Use mock data directly (no database yet)
- Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, ESLint v9, ShadCN UI

## History

### Phase 1 (Completed)

- Initialized Next.js 16 project with TypeScript strict mode
- Cleaned up boilerplate: simplified page.tsx to just `<h1>devstash</h1>`, stripped layout.tsx of fonts, removed 5 boilerplate SVGs from public/
- Created AGENTS.md with stack details, commands, and Next.js 16 breaking changes warning
- Created CLAUDE.md with project description and commands referencing AGENTS.md
- Initial commit `chore: initial next.js and tailwind setup` pushed to `https://github.com/mohsinsr86-wd/devstash.git`
- Added `dark` class to root layout for dark mode by default
- Created `/dashboard` route with layout: sidebar placeholder, top bar with search input, New Collection button, and New Item button, main area placeholder
- Created `src/components/ui/button.tsx` (Base UI + CVA) and `src/components/ui/input.tsx` (Base UI)
- Created `src/lib/utils.ts` (cn helper) and `src/lib/mock-data.ts` (users, collections, items, item types)
- ShadCN UI initialized with Base UI components (Button, Input) and CVA variants
- Dark mode set as default via `dark` class on `<html>` in root layout
- Dashboard route at `/dashboard` with responsive flex layout (sidebar + main)
- Top bar: search input (disabled, placeholder), New Collection button (outline), New Item button (primary + icon)
- Sidebar and main area placeholders ready for Phase 2 content

### Phase 2 (Completed)

- Collapsible sidebar with `PanelLeftClose`/`PanelLeftOpen` toggle icon (desktop) and hamburger drawer (mobile)
- Sidebar collapses to narrow icon-only strip on desktop, always full drawer overlay on mobile
- Item types section: 7 types (Snippet, Prompt, Note, Command, File, Image, URL) each linking to `/items/{type}` with colored lucide icons and item counts
- Collections section: nested dropdown with Favorites (star icon) and Recent (clock icon) subcategories, each showing item counts
- User avatar area at sidebar bottom with initials fallback, name, and email
- Item counts computed from mock data for both types and collections
