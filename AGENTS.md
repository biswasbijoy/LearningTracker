# SQA Learning Tracker

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build (always run before committing)
- `npm run lint` — ESLint check (0 warnings target)
- `npm run test` — Run Vitest tests
- `npm run db:seed` — Re-seed database
- `npm run db:push` — Push schema to database
- `npm run db:studio` — Open Prisma Studio

## Architecture
- Next.js 16 App Router + TypeScript
- SQLite via Prisma 5 (swap to PostgreSQL for production)
- NextAuth.js v5 with credentials provider
- Dashboard calculations live in `src/lib/calculations.ts` (framework-independent)
- Zod schemas shared in `src/lib/validations/index.ts`
- Auth middleware in `src/proxy.ts` (Next.js 16 proxy convention)
- UI: Tailwind CSS 4 + Radix primitives + Lucide icons

## Key patterns
- Server components fetch data; pass serialized JSON to client components
- API routes in `src/app/api/` use RouteContext for typed params
- Ownership checks in every server action and API handler
- Optimistic UI for status updates with rollback on API failure
- Database seed at `prisma/seed.ts` — 52 weeks, 4 phases, 6 milestones

## Typescript conventions
- Use `RouteContext<"/api/weeks/[weekId]">` for route handler params
- `WeekDetail` type includes full week with relations
- Status is typed as `WeekStatus = "Not Started" | "In Progress" | "Completed" | "Blocked"`
