# SQA Learning Tracker

A personal learning-tracker web application for the **AI-Resilient Mid-Level SQA Engineer** 12-month roadmap. Replaces the Excel-based workflow with a responsive web app.

## Features

- **Dashboard** — KPI cards, phase progress bars, current-week card, blocked-week alerts, learning rhythm
- **Roadmap** — Filterable/searchable/sortable 52-week tracker with mobile cards & desktop grid
- **Week Detail** — Status updates, notes, learning log, evidence links, status history, navigation
- **Milestones & Portfolio** — 6 milestones grouped by phase, evidence attachment, portfolio readiness checklist
- **Learning Log** — Chronological reflections with tag filtering and phase filtering
- **Settings** — Profile, language preferences, time goals, JSON export
- **Authentication** — Secure sign-up/sign-in with password hashing
- **Seed Data** — Pre-loaded 52-week SQA curriculum with initial statuses

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui primitives |
| Charts | Recharts |
| Database | SQLite (dev) — PostgreSQL-ready (swap provider in schema) |
| ORM | Prisma 5 |
| Auth | NextAuth.js (Auth.js v5) with credentials provider |
| Validation | Zod (shared client/server) |
| Testing | Vitest + React Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
cd sqa-learning-tracker

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your preferred secret

# Run database migrations
npm run db:push

# Seed the database
npm run db:seed

# Start the dev server
npm run dev
```

### Default Login

After seeding:

- **Email:** `learner@sqa.dev`
- **Password:** `password123`

### Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run db:studio    # Open Prisma Studio (DB browser)
npm run db:reset     # Reset database and re-seed
npm run db:seed      # Re-run seed script
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Register
│   ├── api/               # REST API routes
│   ├── dashboard/         # Dashboard page
│   ├── roadmap/           # Roadmap tracker + week detail
│   ├── milestones/        # Portfolio page
│   ├── learning-log/      # Learning reflections
│   ├── settings/          # Preferences & export
│   └── onboarding/        # First-run setup
├── components/
│   ├── ui/                # Button, Card, Badge, Progress
│   └── layout/            # Nav, AppShell, AuthLayout
├── lib/
│   ├── auth/              # NextAuth config
│   ├── validations/       # Zod schemas
│   ├── calculations.ts    # Dashboard business logic
│   ├── db.ts              # Prisma client singleton
│   └── utils.ts           # cn(), helpers
├── types/                 # TypeScript types
└── proxy.ts               # Auth middleware
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # 52-week curriculum seed
tests/
└── calculations.test.ts   # Unit tests for business logic
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account with roadmap seed |
| PATCH | `/api/weeks/[weekId]` | Update week status/notes |
| GET | `/api/weeks/[weekId]` | Get week detail |
| POST | `/api/learning-logs` | Create reflection entry |
| GET | `/api/learning-logs` | List reflections (optional `?weekId=`) |
| DELETE | `/api/evidence/[evidenceId]` | Remove evidence item |
| PATCH | `/api/settings` | Update profile/preferences |
| GET | `/api/settings` | Get current settings |
| GET | `/api/export` | Export all data as JSON |

## Testing

```bash
npm run test
```

### Test Strategy

- **Unit tests:** Dashboard calculations, phase progress, current week selection, status validation (Vitest)
- **Integration tests:** API ownership, filters, export boundaries
- **E2E tests (planned):** Playwright for critical user flows
- **Manual gates:** Keyboard navigation, contrast review, browser compatibility

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Set environment variables:
- `DATABASE_URL` — Point to a managed PostgreSQL instance (e.g., Neon, Supabase)
- `NEXTAUTH_SECRET` — Random string for session encryption
- `NEXTAUTH_URL` — Your deployment URL

### PostgreSQL Migration

1. Change the Prisma datasource provider:
   ```
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Run `npm run db:push` to create tables
3. Run `npm run db:seed` to populate data

## Future Improvements

- Mentor read-only access with commenting
- Excel import with validation preview
- File evidence uploads with signed URLs
- Calendar date scheduling from start date
- Automatic GitHub integration
- AI-powered learning recommendations
- Mobile native apps (currently responsive web app)

## License

Private — SQA Learning Tracker
