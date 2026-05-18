# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Completed

## Goals

- [x] Install Prisma 7 and initialize project
- [x] Set up Neon PostgreSQL connection (serverless)
- [x] Create initial schema based on data models in project-overview.md
- [x] Include NextAuth models (Account, Session, VerificationToken)
- [x] Add appropriate indexes and cascade deletes
- [x] Create and apply initial migration (never push directly to production branch)

## References

- @context/project-overview.md
- @context/features/database-spec.md
- Prisma docs: https://prisma.io/docs
- Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma quickstart: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

## Notes

- Use Neon PostgreSQL (serverless)
- Development branch via DATABASE_URL, production branch separate — always create migrations, never push directly unless specified
- Prisma 7 has breaking changes — refer to the upgrade guide
- Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma 7

## History

### Phase 1 (Completed)

- Installed Prisma 7: `@prisma/client@7`, `prisma@7`, `@prisma/adapter-pg`, `pg`, `dotenv`, `@types/pg`
- Added `"type": "module"` to `package.json` for Prisma 7 ESM support
- Updated `tsconfig.json` target to `ES2023`
- Created `prisma/schema.prisma` with 8 models: User, Account, Session, VerificationToken, Item, ItemType, Collection, Tag, ItemTag
- Created `prisma.config.ts` with Neon PostgreSQL datasource
- Created `src/lib/prisma.ts` with driver adapter (`PrismaPg`) instantiation
- Created `.env` and `.env.example` with DATABASE_URL
- Ran `prisma migrate dev --name init` — migration applied to Neon dev branch, all tables created with indexes and cascades
