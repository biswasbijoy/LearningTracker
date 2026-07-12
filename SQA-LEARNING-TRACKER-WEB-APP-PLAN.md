# SQA Learning Tracker Web Application — Software Plan

## 1. Purpose and source-of-truth scope

Build a fully responsive personal learning-tracker web application for the **AI-Resilient Mid-Level SQA Engineer** roadmap. The application replaces the existing Excel workflow while retaining its curriculum, status workflow, and progress calculations.

This plan is based on the two files in `Pre-Plan`:

- `AI-Resilient-Mid-Level-SQA-Roadmap.pdf` — the learning philosophy, 12-month career roadmap, practical projects, and learning cadence.
- `SQA-12-Month-Weekly-Tracker.xlsx` — the operational tracker: 52 weekly entries, current status values, notes/blockers, data validation, and dashboard formula logic.

The initial release is for one learner, but the data model and authorization boundaries should support a multi-user version later without a rewrite.

## 2. Product outcome

The user can see the entire one-year plan, understand what to do this week, record progress and blockers, review completed work, and receive accurate phase and overall progress immediately. The app must favor learning decisions and evidence of progress rather than merely reproducing a spreadsheet grid.

The roadmap’s central principle should shape the product: promote judgment-heavy SQA growth—risk analysis, framework architecture, root-cause analysis, CI/CD ownership, communication, and review of AI-generated work—rather than simple task completion.

## 3. Source curriculum to import

### 3.1 Schedule structure

Import all 52 existing weekly records exactly once. Each record has:

| Field | Excel source | Meaning |
| --- | --- | --- |
| `index` | Target Index (A) | Numeric position, 1–52 |
| `weekNumber` | Week # (B) | Display label, e.g. `Week 1` |
| `monthNumber` | Month (C) | Month 1–12 |
| `phase` | Phase (D) | Curriculum group |
| `focusArea` | Focus Area (E) | Weekly learning theme |
| `weekdayTasks` | Weekday Tasks (F) | 1–2 hours/day activities |
| `weekendMilestone` | Weekend Target / Milestone (G) | 4–6 hour deliverable |
| `status` | Status (H) | Current work state |
| `notes` | Notes / Blockers (I) | Learner comments and blockers |

### 3.2 Phases

| Phase | Weeks | Months | Goal |
| --- | ---: | ---: | --- |
| Phase 1: Engineering Foundations | 1–12 | 1–3 | Build programming, SQL, HTTP/API, Git, clean-code, and automation-design foundations. |
| Phase 2: Automation Engineering | 13–24 | 4–6 | Build a UI/API automation framework with POM, reporting, cross-browser execution, and GitHub Actions. |
| Phase 3: Performance, Security, DB Depth | 25–36 | 7–9 | Gain working depth in k6, OWASP-oriented testing, authorization/IDOR, and advanced data validation. |
| Phase 4: AI-Native QA + Portfolio | 37–52 | 10–12 | Use AI responsibly in QA, test AI/LLM behaviors, polish the portfolio, and prepare for interviews/job transition. |

### 3.3 Roadmap milestones and portfolio evidence

Create milestone records linked to the existing weeks. These should be visible in the tracker, dashboard, and portfolio area.

| Milestone | Target week(s) | Evidence to collect |
| --- | --- | --- |
| Phase 1 console project | 11–12 | CSV → API call → validation → logged pass/fail results, README, repository link |
| Project 1: UI + API automation framework | 13–24 | POM/layered architecture, environment configuration, Allure/Extent report, CI run, GitHub link |
| Project 4: Performance report | 26–29 | k6 load/spike/soak results, p95 analysis, charts/report |
| Security and DB integration | 30–36 | OWASP/IDOR tests, security findings, data-integrity queries |
| Project 5: AI/LLM testing project | 41–44 | Test strategy, prompt variations, evaluation rubric, output/safety checks |
| Portfolio, interview, transition readiness | 46–52 | Clean READMEs, resume, LinkedIn, mock interview notes, applications/transition notes, retrospective |

### 3.4 Learning cadence

- Weekdays: 1–2 hours per day for concepts and small coding drills.
- Weekend: 4–6 hours for a concrete build, milestone, or revision.
- Every Sunday: optional 30-minute “teach-back” reflection to reveal knowledge gaps.
- Every two weeks: refactor or revisit earlier work.
- Every week: one short learning-log entry describing learning, evidence, difficulty, and next action.

## 4. Users, roles, and permissions

### MVP roles

- **Owner/Learner**: full access to their roadmap, weeks, notes, evidence, dashboard, and settings.
- **Guest/unauthenticated visitor**: no access in the private single-user MVP.

### Future-ready roles

- **Mentor**: read-only access plus comments/feedback on shared weeks and projects.
- **Admin**: manages roadmap templates and users.

Use owner-scoped queries from the outset. No request should return another user’s records merely because its identifier is known.

## 5. Functional requirements

### 5.1 Authentication and onboarding

1. Provide secure sign-up, sign-in, sign-out, and password-reset flows (or begin with a single authenticated owner account if deploying privately).
2. First run creates/imports the 52-week SQA roadmap for the owner.
3. Onboarding asks for optional start date, primary language (Java, TypeScript/JavaScript, Python, or other), and weekly time preference.
4. The start date computes optional calendar dates for each week without changing the original Week 1–52 ordering.
5. Show a short onboarding statement: the tracker measures evidence and learning judgment, not only checkmarks.

### 5.2 Dashboard

The dashboard is the primary home screen. It must show:

- Overall completion percentage.
- Status totals: Total Weeks, Completed, In Progress, Not Started, and Blocked.
- A status distribution chart.
- Completion percentage for each of the four phases.
- “Current/next week” card based on the earliest non-completed week (with a manual current-week override in settings).
- The current week’s focus area, weekday tasks, weekend milestone, status, and last note.
- Blocked-week alert area, including blocker text and a direct action to update it.
- Upcoming milestone cards and recent learning-log/evidence activity.
- A “learning rhythm” card showing recommended weekday/weekend effort and the Sunday teach-back prompt.

Do not make numeric counts the only dashboard signal. The dashboard should also expose blockers, next action, evidence quality, and milestone readiness.

### 5.3 Weekly roadmap and tracker

1. Show all 52 weeks in a responsive, filterable tracker.
2. Support compact cards on phones and a table/list layout on tablets and desktop.
3. Allow filtering by phase, month, status, milestone-only, and blocked items.
4. Allow text search across focus areas, tasks, milestones, and notes.
5. Allow sorting by target index, month, phase, status, or last updated time.
6. Each week displays index, phase/month, focus area, status, weekday task, weekend target, notes preview, and evidence count.
7. Clicking a week opens a detail page or side sheet; it must not require editing a wide spreadsheet-style row.
8. The user can update a status, edit notes, add evidence, set actual effort, and log a reflection without changing the curriculum record itself.
9. Preserve the roadmap’s original status vocabulary for migration compatibility: `Not Started`, `In Progress`, `Completed`, `Blocked`.
10. Add an explicit confirmation when setting a week to Completed if no evidence or reflection has been attached; allow completion but flag it as “completion without evidence.”

### 5.4 Week detail

Each week-detail view includes:

- Breadcrumb: phase → month → week.
- Focus area and target index.
- Weekday tasks and weekend target in distinct sections.
- Status control with clear color and accessible text label.
- Notes/blockers editor.
- Learning log: what was learned, difficulty, root cause/insight, and next action.
- Actual study effort: weekday hours and weekend hours (optional).
- Evidence links: repository, pull request, report, documentation, screenshot, or external URL.
- A completion checklist: concepts understood, task practiced, weekend milestone attempted, evidence linked, reflection written.
- Related phase milestone, if the week contributes to one.
- Previous/next week navigation.

### 5.5 Milestones and portfolio

1. Provide a dedicated Milestones/Portfolio page.
2. Group the six source milestones by phase and show status, target weeks, linked evidence, and readiness state.
3. Let the user attach GitHub links, reports, README links, screenshots, and interview framing notes.
4. Add a “portfolio readiness” checklist for framework, API, CI/CD, performance, security/DB, AI-testing, documentation, resume/LinkedIn, and mock interviews.
5. The product should store links and metadata, not clone or access external Git repositories in the MVP.

### 5.6 Reflections and learning log

1. Offer a weekly reflection prompt: “What did I learn? What was difficult? What evidence proves it? What is my next action?”
2. Offer a monthly reflection prompt based on the roadmap: “Am I drifting toward execution-only work, or building judgment-heavy engineering skills?”
3. Provide a chronological learning-log view with filtering by phase/month/tag.
4. Allow tags such as `risk`, `framework`, `API`, `SQL`, `CI/CD`, `performance`, `security`, `AI QA`, `communication`, and `interview`.

### 5.7 Settings and data portability

- Manage profile, start date, primary language, time preferences, current-week override, and theme.
- Export the learner’s roadmap, status history, notes, reflections, effort entries, and evidence as JSON/CSV.
- Import the original Excel tracker through a deliberate import screen in a later iteration. The importer maps the nine spreadsheet fields and validates all status strings.
- Offer a reset/reseed flow only after an explicit destructive confirmation; it creates a fresh copy of the template rather than deleting historical progress by default.

## 6. Calculation and business rules

The following logic must reproduce the workbook dashboard exactly for migrated status data.

| Metric | Formula / rule |
| --- | --- |
| Total Weeks | Number of active weekly-plan records; initial value is 52. |
| Completed | Count of weeks with `status = Completed`. |
| In Progress | Count of weeks with `status = In Progress`. |
| Not Started | Count of weeks with `status = Not Started`. |
| Blocked | Count of weeks with `status = Blocked`. |
| Overall Completion % | `completedWeeks / totalWeeks × 100`; return 0 if there are no weeks. This matches Excel `B4/B3`. |
| Phase Completion % | `completed weeks in phase / total weeks in phase × 100`; return 0 for an empty phase. This matches the dashboard `COUNTIFS / COUNTIF` formulas. |
| Current Week | Lowest `targetIndex` whose status is not Completed; if all are complete, show “Roadmap complete.” |
| At-risk state | A week is at risk when Blocked or when its scheduled end date has passed without completion; calendar dates are only available when a start date is set. |

Status transitions are intentionally unrestricted in the MVP—learning is not linear—but every transition records an audit event (`fromStatus`, `toStatus`, time, actor, optional note). Do not treat `In Progress` as completion for phase/overall percentages, matching the workbook.

## 7. Data model

Use a relational database (PostgreSQL recommended). UUID primary keys, `created_at`, and `updated_at` apply to every user-owned table.

### 7.1 Core tables

```text
users
  id, email, display_name, password_auth_or_provider_fields, created_at, updated_at

roadmaps
  id, owner_id -> users.id, name, template_version, start_date nullable,
  primary_language nullable, active, created_at, updated_at

phases
  id, roadmap_id -> roadmaps.id, order_index, name, goal, start_week, end_week

weeks
  id, roadmap_id -> roadmaps.id, phase_id -> phases.id, target_index (1..52),
  month_number (1..12), focus_area, weekday_tasks, weekend_milestone,
  scheduled_start_date nullable, scheduled_end_date nullable, created_at, updated_at

week_progress
  id, week_id -> weeks.id UNIQUE, status, notes nullable, weekday_hours nullable,
  weekend_hours nullable, completion_confirmed_at nullable, updated_by -> users.id

status_history
  id, week_id -> weeks.id, actor_id -> users.id, from_status nullable, to_status,
  note nullable, changed_at

learning_logs
  id, week_id -> weeks.id nullable, owner_id -> users.id, entry_date,
  learned_text, difficulty_text nullable, insight_text nullable, next_action nullable,
  tags jsonb or normalized join table

evidence_items
  id, week_id -> weeks.id nullable, milestone_id -> milestones.id nullable,
  owner_id -> users.id, type, title, url nullable, storage_key nullable,
  description nullable, created_at

milestones
  id, roadmap_id -> roadmaps.id, phase_id -> phases.id nullable, name, description,
  target_week_start, target_week_end, status, interview_framing nullable

milestone_evidence
  milestone_id -> milestones.id, evidence_item_id -> evidence_items.id

user_preferences
  user_id -> users.id UNIQUE, current_week_override nullable, theme,
  weekday_hour_goal nullable, weekend_hour_goal nullable
```

### 7.2 Constraints and indexes

- Enforce `UNIQUE(roadmap_id, target_index)` on `weeks`.
- Enforce `month_number BETWEEN 1 AND 12` and `target_index BETWEEN 1 AND 52` for the initial template.
- Restrict status to the four initial values via database enum/check constraint.
- Index `weeks(roadmap_id, target_index)`, `week_progress(status)`, `learning_logs(owner_id, entry_date DESC)`, and `status_history(week_id, changed_at DESC)`.
- Require exactly one parent target for evidence in the MVP: week or milestone. A future generalized evidence relation can relax this.

## 8. Information architecture and routes

| Route | Purpose |
| --- | --- |
| `/` | Auth-aware dashboard/home. |
| `/onboarding` | First-run setup and template initialization. |
| `/dashboard` | Dashboard with KPIs, phase progress, current week, blockers, and milestones. |
| `/roadmap` | Filterable 52-week tracker. |
| `/roadmap/week/:weekId` | Week detail and progress workspace. |
| `/milestones` | Portfolio/milestone readiness and evidence. |
| `/learning-log` | Reflections and searchable learning history. |
| `/settings` | Profile, dates, preferences, import/export, account controls. |
| `/auth/*` | Authentication and recovery screens. |

The main navigation is Dashboard, Roadmap, Milestones, Learning Log, and Settings. On mobile, use a bottom navigation for the first four destinations and place Settings in the profile/menu control.

## 9. Responsive UX and design system

### 9.1 Breakpoints and layout behavior

| Viewport | Layout behavior |
| --- | --- |
| 320–639 px | One-column layout, card-based roadmap, sticky bottom nav, full-screen detail sheet/page, large tap targets. |
| 640–1023 px | Two-column dashboard where space allows; compact filters; roadmap may show list rows with selected columns. |
| 1024–1279 px | Sidebar/top navigation, dashboard KPI grid, tracker table with horizontal scroll only as a fallback. |
| 1280 px+ | Full dashboard grid, visible phase panels, tracker table with all primary columns and a detail pane/drawer option. |

### 9.2 Key interaction rules

- Never rely on hover for a required action.
- Status changes are available directly on every weekly card/row and in the detail view.
- On touch screens, use a native/select-like accessible status control; do not require drag-and-drop.
- Keep form controls at least 44×44 CSS pixels of effective tap area.
- Preserve unsaved note edits with local draft state and warn before navigating away.
- Use optimistic status updates with rollback and an actionable error message on API failure.
- Empty states should explain the next useful action, especially for evidence and learning logs.

### 9.3 Visual language

- Use a calm, professional quality-engineering aesthetic: neutral background, strong text contrast, one restrained accent color, and semantic status colors.
- Status must never be color-only. Pair color with text and an icon/shape.
- Suggested semantic colors: gray = Not Started, blue = In Progress, green = Completed, amber/red = Blocked. Validate contrast ratios in the actual theme.
- Use progress bars for phase completion and numerical labels such as `3 of 12 completed (25%)`.
- Make primary actions specific: `Update status`, `Add evidence`, `Write reflection`, `View this week`.

## 10. Accessibility, performance, and security requirements

### Accessibility

- Target WCAG 2.2 AA.
- Keyboard-operable navigation, filters, dialogs, status controls, and form submissions.
- Proper labels, error messages, focus states, landmarks, headings, and skip navigation.
- Screen-reader announcement after a successful status update.
- Do not communicate status/progress through color alone.
- Respect reduced-motion preferences; animations must be optional and short.

### Performance

- Ship a fast initial dashboard on mobile networks; lazy-load charts and heavy detail areas.
- Fetch the full 52-week roadmap in one efficient request; paginate historical logs/evidence only when needed.
- Avoid recalculating dashboard values in the browser from stale partial data. Return a server-computed dashboard summary or reliably invalidate/recompute it after mutations.
- Use responsive images and size limits if file evidence uploads are enabled.

### Security and privacy

- Store passwords only through a proven auth provider/library using modern hashing; never store plaintext.
- Enforce authentication and ownership checks in every server action/API handler and database policy.
- Validate all status values, lengths, URLs, dates, and uploaded-file types/sizes on the server.
- Escape/sanitize rendered user notes and learning logs; never render them as trusted HTML.
- Rate-limit auth and mutation endpoints.
- Use HTTPS, secure cookies, CSRF protection appropriate to the auth/session model, and structured audit logs.
- Keep uploaded evidence private by default and serve it through authorized access or short-lived signed URLs.

## 11. Recommended technical architecture

Use a type-safe full-stack web application with a relational data layer. A practical stack:

- **Frontend/full-stack framework:** Next.js (App Router) + TypeScript.
- **UI:** React, Tailwind CSS, accessible component primitives (for example Radix/shadcn-style primitives), and a lightweight chart library.
- **Backend:** Next.js route handlers/server actions or a separate REST API only if deployment/team needs require it.
- **Database:** PostgreSQL with Prisma or Drizzle ORM.
- **Authentication:** Auth.js or a managed provider such as Clerk/Supabase Auth.
- **Validation:** Zod shared between client and server.
- **Deployment:** Vercel/Render/Fly.io plus managed PostgreSQL; environment variables managed by the hosting provider.
- **Testing:** Vitest for utilities/business logic, React Testing Library for components, Playwright for critical end-to-end flows.

Keep domain logic framework-independent in modules such as `calculateDashboardSummary`, `getCurrentWeek`, and `validateStatusTransition`. This makes formula parity easy to unit-test.

## 12. API/server contract

Use JSON over REST-style endpoints or equivalent server actions. The following capability boundaries are required even if the exact URL shape changes.

| Capability | Operation |
| --- | --- |
| Dashboard | Read KPI totals, phase progress, current week, blockers, milestones, recent activity. |
| Roadmap | List weeks with filters/search/sort; read a single enriched week. |
| Week progress | Update status, notes, effort, and completion checklist; create status-history event. |
| Learning log | Create, list, update, delete own entries; filter by phase/month/tag. |
| Evidence | Create/list/delete metadata; request authorized file upload/download where enabled. |
| Milestones | Read milestone readiness and link/unlink evidence. |
| Settings | Read/update preferences and start date; recalculate scheduled dates transactionally. |
| Import/export | Validate import preview; create export for the current owner only. |

Mutation responses should include the updated record and an invalidation hint/version so dashboard, tracker, and detail views immediately agree.

## 13. Initial import/seed process

1. Create the roadmap template with four phases and the six milestone records listed above.
2. Seed the 52 Excel rows in `targetIndex` order, preserving text exactly for focus area, weekday tasks, and weekend milestone.
3. Create one `week_progress` row per week.
4. Import current initial statuses from the workbook: Week 1 = `In Progress`; Weeks 2–52 = `Not Started`; all notes empty.
5. Verify seed dashboard parity: Total = 52, Completed = 0, In Progress = 1, Not Started = 51, Blocked = 0, Overall = 0%; each phase completion = 0%.
6. Keep seed data in a versioned, reviewable source file rather than hardcoding it inside UI components.

The Excel dashboard sheet was protected with the supplied password. No web-app feature should depend on spreadsheet protection; the web application enforces authorization at the server/database layer.

## 14. Delivery plan

### Phase A — Foundation and parity

1. Initialize TypeScript application, linting, formatting, environment handling, database, and authentication.
2. Implement schema, migrations, owner-based authorization, and versioned seed data.
3. Build dashboard summary functions and automated formula-parity tests.
4. Build responsive app shell, navigation, theme tokens, and empty/loading/error states.

**Acceptance:** an authenticated owner sees exactly the seeded 52-week plan and dashboard totals matching the workbook.

### Phase B — Core tracker experience

1. Build dashboard KPI cards, phase progress, current-week card, blockers, and status chart.
2. Build mobile cards and desktop/table roadmap views with filter, search, and sort.
3. Build week-detail editing for status, notes, effort, checklist, and status history.
4. Add optimistic updates and cache invalidation.

**Acceptance:** a user can update any week and see correct overall/phase progress everywhere without a page refresh.

### Phase C — Evidence, reflection, and portfolio

1. Build learning-log/reflection flows and filters.
2. Build milestones/portfolio page and evidence-link flow.
3. Add readiness checklists and milestone-specific interview framing notes.
4. Add optional private file uploads after URLs/metadata are stable.

**Acceptance:** a completed week can have reflection and evidence; milestone readiness can be reviewed in one place.

### Phase D — Settings, portability, and hardening

1. Add start-date scheduling, preferences, and current-week override.
2. Add JSON/CSV export and a validated Excel-import preview.
3. Complete accessibility audit, responsive testing, security review, error handling, and rate limits.
4. Add observability for unexpected API errors and mutation failures.

**Acceptance:** core flows work on mobile, tablet, and desktop; exported data is complete; auth/ownership tests pass.

## 15. Test strategy

### Unit tests

- Dashboard counts and percentages, including zero-week guards.
- Per-phase completion calculation for all four phases.
- Current-week selection.
- Status validation and history-event creation.
- Start-date to scheduled-date calculation.
- Seed-data invariants: 52 unique weeks, valid phase/month assignment, required content present.

### Integration tests

- Owner can only access their own roadmap/progress/evidence.
- Updating a week updates the dashboard response.
- Filters/search produce correct subsets.
- Export contains only the requesting owner’s data.
- Import rejects unrecognized statuses and duplicate target indices.

### End-to-end tests

1. Sign in → see dashboard totals matching the seeded workbook.
2. Change Week 2 to In Progress → dashboard counts update to 2 In Progress/50 Not Started.
3. Mark a Phase 1 week Completed → phase and overall progress update accurately.
4. Mark a week Blocked and add a note → it appears in dashboard blockers.
5. Add evidence and a reflection from mobile viewport → content appears in week and portfolio screens.
6. Navigate tracker at phone, tablet, and desktop widths without inaccessible/hidden controls.

### Manual quality gates

- Keyboard-only navigation and screen-reader smoke test.
- Contrast and color-only-status review.
- Browser compatibility check for current Chrome, Firefox, Safari, and Edge.
- Test with very long notes, long evidence titles, empty states, and failed network requests.

## 16. Definition of done for MVP

The MVP is done when:

1. A secured owner account can use the app on a phone, tablet, and desktop.
2. All 52 source weeks and four phases are present with the original learning text.
3. The four existing status values work, and dashboard results match the Excel logic.
4. The user can update status/notes and record a weekly reflection and evidence link.
5. Dashboard, roadmap, week detail, milestones, and learning log are complete and responsive.
6. Core calculation, authorization, and end-to-end tests pass.
7. Accessibility basics and error states are verified.
8. User data can be exported.

## 17. Explicit non-goals for MVP

- Team collaboration, mentor commenting, and social/community features.
- Automatic GitHub repository scanning or CI-provider synchronization.
- AI-generated learning content, AI coaching, or uploading sensitive work logs to a third-party LLM.
- Full project-management capabilities such as arbitrary tasks, calendars, or billing.
- Native mobile applications; the responsive web app is the initial mobile experience.

These can be added after the personal tracker is stable and the curriculum/progress workflow has proven useful.
