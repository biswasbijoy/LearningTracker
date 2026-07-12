import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PHASES = [
  {
    orderIndex: 1,
    name: "Engineering Foundations",
    goal:
      "Build programming, SQL, HTTP/API, Git, clean-code, and automation-design foundations.",
    startWeek: 1,
    endWeek: 12,
  },
  {
    orderIndex: 2,
    name: "Automation Engineering",
    goal:
      "Build a UI/API automation framework with POM, reporting, cross-browser execution, and GitHub Actions.",
    startWeek: 13,
    endWeek: 24,
  },
  {
    orderIndex: 3,
    name: "Performance, Security, DB Depth",
    goal:
      "Gain working depth in k6, OWASP-oriented testing, authorization/IDOR, and advanced data validation.",
    startWeek: 25,
    endWeek: 36,
  },
  {
    orderIndex: 4,
    name: "AI-Native QA + Portfolio",
    goal:
      "Use AI responsibly in QA, test AI/LLM behaviors, polish the portfolio, and prepare for interviews/job transition.",
    startWeek: 37,
    endWeek: 52,
  },
];

const WEEKLY_DATA: Array<{
  index: number;
  weekNumber: string;
  month: number;
  phase: string;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
}> = [
  // Phase 1: Engineering Foundations (Weeks 1-12)
  {
    index: 1,
    weekNumber: "Week 1",
    month: 1,
    phase: "Engineering Foundations",
    focusArea: "Programming Fundamentals – Python",
    weekdayTasks:
      "Set up Python environment (pyenv + venv). Complete 5 basic coding exercises (loops, conditionals, functions). Read about clean code basics.",
    weekendMilestone:
      "Write a CLI script that reads a CSV, validates row counts, and logs pass/fail. Push to a GitHub repo with a README.",
  },
  {
    index: 2,
    weekNumber: "Week 2",
    month: 1,
    phase: "Engineering Foundations",
    focusArea: "Programming Fundamentals – Data Structures",
    weekdayTasks:
      "Study Python lists, dicts, sets, tuples. Complete 5 exercises on string manipulation and file I/O.",
    weekendMilestone:
      "Extend last week's script: add functions for data transformation and filtering. Write unit tests with pytest.",
  },
  {
    index: 3,
    weekNumber: "Week 3",
    month: 1,
    phase: "Engineering Foundations",
    focusArea: "Programming Fundamentals – OOP Basics",
    weekdayTasks:
      "Study Python classes, inheritance, polymorphism. Practice writing simple classes.",
    weekendMilestone:
      "Build a simple test data generator using OOP: factory classes for generating sample user/test data.",
  },
  {
    index: 4,
    weekNumber: "Week 4",
    month: 2,
    phase: "Engineering Foundations",
    focusArea: "SQL & Databases – Querying",
    weekdayTasks:
      "Learn SELECT, WHERE, JOIN, GROUP BY, ORDER BY. Practice on a sample dataset (SQLite).",
    weekendMilestone:
      "Write 15 SQL queries on a provided e-commerce schema. Validate results with expected output. Document queries and findings.",
  },
  {
    index: 5,
    weekNumber: "Week 5",
    month: 2,
    phase: "Engineering Foundations",
    focusArea: "SQL & Databases – DML & DDL",
    weekdayTasks:
      "Learn INSERT, UPDATE, DELETE, CREATE TABLE, ALTER, indexes. Study basic normalization.",
    weekendMilestone:
      "Design a normalized schema for a bug-tracking system. Write DDL scripts and seed data. Verify with test queries.",
  },
  {
    index: 6,
    weekNumber: "Week 6",
    month: 2,
    phase: "Engineering Foundations",
    focusArea: "SQL & Databases – Advanced",
    weekdayTasks:
      "Study subqueries, CTEs, window functions, views, and transactions.",
    weekendMilestone:
      "Write complex queries using CTEs and window functions on a test DB. Demonstrate data integrity checks with transactions.",
  },
  {
    index: 7,
    weekNumber: "Week 7",
    month: 3,
    phase: "Engineering Foundations",
    focusArea: "HTTP & API Fundamentals",
    weekdayTasks:
      "Learn HTTP methods, status codes, headers, REST principles. Practice with curl/Postman.",
    weekendMilestone:
      "Test a public REST API (e.g., GitHub API): document endpoints, test edge cases, verify status codes. Write a report.",
  },
  {
    index: 8,
    weekNumber: "Week 8",
    month: 3,
    phase: "Engineering Foundations",
    focusArea: "API Testing with Python",
    weekdayTasks:
      "Learn requests library. Write Python scripts to call APIs, validate responses, handle errors.",
    weekendMilestone:
      "Build a test suite for a sample API: CRUD operations, negative tests, schema validation. Use pytest.",
  },
  {
    index: 9,
    weekNumber: "Week 9",
    month: 3,
    phase: "Engineering Foundations",
    focusArea: "Git & Version Control",
    weekdayTasks:
      "Learn branching, merging, rebasing, pull requests, and conflict resolution. Practice git workflow.",
    weekendMilestone:
      "Set up a GitHub repo with proper branching strategy (feature/main). Practice resolving merge conflicts. Write CONTRIBUTING.md.",
  },
  {
    index: 10,
    weekNumber: "Week 10",
    month: 4,
    phase: "Engineering Foundations",
    focusArea: "Automation Design Principles",
    weekdayTasks:
      "Study POM, DRY, SOLID in testing context. Learn test fixtures and configuration management.",
    weekendMilestone:
      "Design an automation framework structure: project layout, config files, reporting approach. Document your architecture decisions.",
  },
  {
    index: 11,
    weekNumber: "Week 11",
    month: 4,
    phase: "Engineering Foundations",
    focusArea: "Integration Project – Part 1",
    weekdayTasks:
      "Start building a console-based test project: CSV input, API validation, result logging.",
    weekendMilestone:
      "Complete Phase 1 console project: CSV to API validation pipeline with clean error handling. Push to GitHub.",
  },
  {
    index: 12,
    weekNumber: "Week 12",
    month: 4,
    phase: "Engineering Foundations",
    focusArea: "Review & Refactor",
    weekdayTasks:
      "Review Phase 1 concepts. Refactor your project. Write documentation. Identify knowledge gaps.",
    weekendMilestone:
      "Finalize Phase 1 portfolio: README, test results, refactored code. Write a self-assessment of foundations learned.",
  },
  // Phase 2: Automation Engineering (Weeks 13-24)
  {
    index: 13,
    weekNumber: "Week 13",
    month: 5,
    phase: "Automation Engineering",
    focusArea: "Selenium/Playwright Foundations",
    weekdayTasks:
      "Set up browser automation tool. Learn locators, navigation, assertions. Write 5 basic tests.",
    weekendMilestone:
      "Create a test suite for a demo web app: login, navigation, form submission, and verification.",
  },
  {
    index: 14,
    weekNumber: "Week 14",
    month: 5,
    phase: "Automation Engineering",
    focusArea: "Advanced Page Object Model",
    weekdayTasks:
      "Implement POM with base page, page components, and page factory. Learn waits and synchronization.",
    weekendMilestone:
      "Refactor test suite with full POM architecture. Add explicit waits, error handling, and logging.",
  },
  {
    index: 15,
    weekNumber: "Week 15",
    month: 5,
    phase: "Automation Engineering",
    focusArea: "Data-Driven Testing",
    weekdayTasks:
      "Learn data providers, external data sources (CSV, JSON, Excel). Parameterize test data.",
    weekendMilestone:
      "Implement data-driven tests: read test cases from external files, run parameterized scenarios, report results.",
  },
  {
    index: 16,
    weekNumber: "Week 16",
    month: 6,
    phase: "Automation Engineering",
    focusArea: "API Automation Layer",
    weekdayTasks:
      "Build API test layer using requests/httpx. Learn request chaining, auth, and schema validation.",
    weekendMilestone:
      "Build API test suite: CRUD endpoints, auth flows, negative testing, and data cleanup. Integrate with UI tests.",
  },
  {
    index: 17,
    weekNumber: "Week 17",
    month: 6,
    phase: "Automation Engineering",
    focusArea: "Test Reporting & Allure",
    weekdayTasks:
      "Learn Allure/Extent reporting. Integrate reports with test frameworks. Add screenshots and logs.",
    weekendMilestone:
      "Integrate Allure reporting into test suites. Generate rich reports with steps, attachments, and history.",
  },
  {
    index: 18,
    weekNumber: "Week 18",
    month: 6,
    phase: "Automation Engineering",
    focusArea: "Cross-Browser & Parallel Execution",
    weekdayTasks:
      "Learn cross-browser configuration. Set up parallel test execution with Selenium Grid or Playwright.",
    weekendMilestone:
      "Configure cross-browser (Chrome, Firefox, Edge) parallel execution. Compare run times and results.",
  },
  {
    index: 19,
    weekNumber: "Week 19",
    month: 7,
    phase: "Automation Engineering",
    focusArea: "CI/CD Integration",
    weekdayTasks:
      "Learn GitHub Actions basics: workflows, jobs, steps, triggers. Set up a simple pipeline.",
    weekendMilestone:
      "Create GitHub Actions workflow that runs automation tests on push. Include reporting artifacts and notifications.",
  },
  {
    index: 20,
    weekNumber: "Week 20",
    month: 7,
    phase: "Automation Engineering",
    focusArea: "Test Environment Management",
    weekdayTasks:
      "Learn Docker basics: images, containers, Docker Compose. Set up test environment with Docker.",
    weekendMilestone:
      "Containerize the automation framework. Use Docker Compose for app under test + test runner. Document setup.",
  },
  {
    index: 21,
    weekNumber: "Week 21",
    month: 7,
    phase: "Automation Engineering",
    focusArea: "Advanced Assertions & Hamcrest",
    weekdayTasks:
      "Learn soft assertions, custom matchers, and collection assertions. Practice fluent assertion patterns.",
    weekendMilestone:
      "Enhance test suites with soft assertions, collection validations, and custom error messages. Compare soft vs hard.",
  },
  {
    index: 22,
    weekNumber: "Week 22",
    month: 8,
    phase: "Automation Engineering",
    focusArea: "Mobile Testing Basics",
    weekdayTasks:
      "Learn Appium/Detox basics: setup, locators, gestures. Write 3 basic mobile tests.",
    weekendMilestone:
      "Set up mobile test environment. Automate a simple mobile flow. Document challenges and differences from web.",
  },
  {
    index: 23,
    weekNumber: "Week 23",
    month: 8,
    phase: "Automation Engineering",
    focusArea: "Project 1 – Framework Completion",
    weekdayTasks:
      "Integrate all components: POM, API, data-driven, reporting, CI, cross-browser. Full end-to-end test.",
    weekendMilestone:
      "Complete Project 1: UI + API automation framework. All components integrated, documented, CI passing.",
  },
  {
    index: 24,
    weekNumber: "Week 24",
    month: 8,
    phase: "Automation Engineering",
    focusArea: "Review & Refactor",
    weekdayTasks:
      "Review all automation concepts. Refactor framework. Write documentation and lessons learned.",
    weekendMilestone:
      "Finalize Phase 2 portfolio: framework architecture doc, test results, CI config. Self-assessment and retrospective.",
  },
  // Phase 3: Performance, Security, DB Depth (Weeks 25-36)
  {
    index: 25,
    weekNumber: "Week 25",
    month: 9,
    phase: "Performance, Security, DB Depth",
    focusArea: "Performance Testing – k6 Basics",
    weekdayTasks:
      "Install k6. Learn k6 scripting: HTTP requests, checks, thresholds, options.",
    weekendMilestone:
      "Write k6 scripts for a demo API: load test with ramp-up, verify response times, set pass/fail thresholds.",
  },
  {
    index: 26,
    weekNumber: "Week 26",
    month: 9,
    phase: "Performance, Security, DB Depth",
    focusArea: "Performance Testing – Scenarios",
    weekdayTasks:
      "Learn load, spike, soak, and stress testing patterns. Study metrics: p95, p99, throughput, error rate.",
    weekendMilestone:
      "Execute load, spike, and soak tests on a sample app. Compare results, analyze bottlenecks, write report.",
  },
  {
    index: 27,
    weekNumber: "Week 27",
    month: 9,
    phase: "Performance, Security, DB Depth",
    focusArea: "Performance Reporting & Analysis",
    weekdayTasks:
      "Learn k6 outputs: JSON, CSV, Prometheus, Grafana. Study performance report best practices.",
    weekendMilestone:
      "Generate performance report with charts and analysis. Include recommendations. Push to portfolio repository.",
  },
  {
    index: 28,
    weekNumber: "Week 28",
    month: 10,
    phase: "Performance, Security, DB Depth",
    focusArea: "Performance in CI/CD",
    weekdayTasks:
      "Integrate k6 into GitHub Actions. Set up performance gates in CI pipeline.",
    weekendMilestone:
      "Configure performance test pipeline: automatic k6 execution, threshold validation, trend tracking over builds.",
  },
  {
    index: 29,
    weekNumber: "Week 29",
    month: 10,
    phase: "Performance, Security, DB Depth",
    focusArea: "Security Testing – OWASP Top 10",
    weekdayTasks:
      "Study OWASP Top 10 vulnerabilities: SQL injection, XSS, CSRF, IDOR, auth flaws. Understand each.",
    weekendMilestone:
      "Document OWASP Top 10 with examples. Test a demo vulnerable app (DVWA) for at least 5 vulnerabilities.",
  },
  {
    index: 30,
    weekNumber: "Week 30",
    month: 10,
    phase: "Performance, Security, DB Depth",
    focusArea: "Security Testing – Tools & Automation",
    weekdayTasks:
      "Learn OWASP ZAP or Burp Suite basics. Set up automated security scanning.",
    weekendMilestone:
      "Configure automated ZAP scan in CI. Run security tests on a sample app. Document findings and remediation.",
  },
  {
    index: 31,
    weekNumber: "Week 31",
    month: 11,
    phase: "Performance, Security, DB Depth",
    focusArea: "Authorization & IDOR Testing",
    weekdayTasks:
      "Deep dive into IDOR, privilege escalation, and authorization bypass. Practice identifying these flaws.",
    weekendMilestone:
      "Write tests to detect IDOR vulnerabilities in a sample API. Document methodology and findings.",
  },
  {
    index: 32,
    weekNumber: "Week 32",
    month: 11,
    phase: "Performance, Security, DB Depth",
    focusArea: "Advanced Data Validation",
    weekdayTasks:
      "Study data integrity testing, referential integrity, constraint validation. Learn Great Expectations basics.",
    weekendMilestone:
      "Write data validation tests: check constraints, relationships, data types, and business rules on a test database.",
  },
  {
    index: 33,
    weekNumber: "Week 33",
    month: 11,
    phase: "Performance, Security, DB Depth",
    focusArea: "Database Performance & Indexing",
    weekdayTasks:
      "Learn query plan analysis, index strategies, and performance optimization in SQL. Use EXPLAIN ANALYZE.",
    weekendMilestone:
      "Analyze query performance on a sample database. Create optimized indexes. Benchmark before/after improvements.",
  },
  {
    index: 34,
    weekNumber: "Week 34",
    month: 12,
    phase: "Performance, Security, DB Depth",
    focusArea: "Database Migrations & Versioning",
    weekdayTasks:
      "Learn migration tools (Alembic, Flyway). Practice schema versioning and rollback strategies.",
    weekendMilestone:
      "Set up migration workflow: create initial schema, add changes, handle rollbacks. Document best practices.",
  },
  {
    index: 35,
    weekNumber: "Week 35",
    month: 12,
    phase: "Performance, Security, DB Depth",
    focusArea: "Security & DB Integration Project",
    weekdayTasks:
      "Combine security and database testing: test auth, data integrity, SQL injection prevention.",
    weekendMilestone:
      "Complete Security and DB Integration Project: OWASP/IDOR tests, security findings report, data-integrity queries.",
  },
  {
    index: 36,
    weekNumber: "Week 36",
    month: 12,
    phase: "Performance, Security, DB Depth",
    focusArea: "Review & Refactor",
    weekdayTasks:
      "Review performance, security, and DB concepts. Refactor test projects. Document lessons learned.",
    weekendMilestone:
      "Finalize Phase 3 portfolio: performance report, security findings, DB tests. Self-assessment and retrospective.",
  },
  // Phase 4: AI-Native QA + Portfolio (Weeks 37-52)
  {
    index: 37,
    weekNumber: "Week 37",
    month: 13,
    phase: "AI-Native QA + Portfolio",
    focusArea: "AI in QA – Fundamentals",
    weekdayTasks:
      "Study AI/ML fundamentals for QA: test generation, defect prediction, visual testing. Learn prompt engineering.",
    weekendMilestone:
      "Use AI to generate test cases for a sample feature. Compare AI-generated vs manually written tests. Document observations.",
  },
  {
    index: 38,
    weekNumber: "Week 38",
    month: 13,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Prompt Engineering for QA",
    weekdayTasks:
      "Practice crafting prompts for test generation, bug reproduction, and test data creation. Iterate and refine.",
    weekendMilestone:
      "Create a prompt library for common QA tasks. Test and evaluate prompt effectiveness. Document best practices.",
  },
  {
    index: 39,
    weekNumber: "Week 39",
    month: 13,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Testing AI-Generated Code",
    weekdayTasks:
      "Learn strategies for testing AI-generated code: hallucination detection, edge case analysis, validation approaches.",
    weekendMilestone:
      "Write test suites for AI-generated functions. Identify hallucinated APIs and incorrect logic. Document findings.",
  },
  {
    index: 40,
    weekNumber: "Week 40",
    month: 14,
    phase: "AI-Native QA + Portfolio",
    focusArea: "AI-Assisted Test Automation",
    weekdayTasks:
      "Use AI tools to enhance test automation: self-healing locators, visual regression, smart wait strategies.",
    weekendMilestone:
      "Implement an AI-assisted testing feature: automated test generation from user stories or visual regression baseline updates.",
  },
  {
    index: 41,
    weekNumber: "Week 41",
    month: 14,
    phase: "AI-Native QA + Portfolio",
    focusArea: "LLM Testing – Quality & Safety",
    weekdayTasks:
      "Learn LLM evaluation metrics: accuracy, relevance, safety, bias. Study testing strategies for LLM outputs.",
    weekendMilestone:
      "Build test strategy for an LLM-powered feature: prompt variations, output validation, bias/safety checks, evaluation rubric.",
  },
  {
    index: 42,
    weekNumber: "Week 42",
    month: 14,
    phase: "AI-Native QA + Portfolio",
    focusArea: "LLM Testing – Automation",
    weekdayTasks:
      "Build automated LLM test harness: prompt templates, output parsers, expected behavior validation.",
    weekendMilestone:
      "Implement automated LLM evaluation pipeline: run test prompts, validate outputs, generate quality report.",
  },
  {
    index: 43,
    weekNumber: "Week 43",
    month: 15,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Project 5 – AI/LLM Testing",
    weekdayTasks:
      "Design and scope AI/LLM testing project. Define test strategy, evaluation criteria, and automation approach.",
    weekendMilestone:
      "Complete Project 5: AI/LLM testing project with test strategy, prompt variations, evaluation rubric, and output/safety checks.",
  },
  {
    index: 44,
    weekNumber: "Week 44",
    month: 15,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Portfolio Building – Projects",
    weekdayTasks:
      "Review all projects. Clean up repositories. Write comprehensive READMEs for each project.",
    weekendMilestone:
      "Polish all project repositories: consistent READMEs, proper documentation, clean code, and CI badges.",
  },
  {
    index: 45,
    weekNumber: "Week 45",
    month: 15,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Resume & LinkedIn Optimization",
    weekdayTasks:
      "Update resume with SQA projects and skills. Optimize LinkedIn profile for QA engineering roles.",
    weekendMilestone:
      "Complete resume and LinkedIn overhaul. Get feedback from peers. Document interview talking points for each project.",
  },
  {
    index: 46,
    weekNumber: "Week 46",
    month: 16,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Interview Preparation – Technical",
    weekdayTasks:
      "Practice coding problems for QA interviews. Review system design for test automation frameworks.",
    weekendMilestone:
      "Complete mock technical interview: coding challenge, framework design discussion, and test strategy presentation.",
  },
  {
    index: 47,
    weekNumber: "Week 47",
    month: 16,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Interview Preparation – Behavioral",
    weekdayTasks:
      "Prepare STAR stories for behavioral questions. Practice communication of QA decisions and trade-offs.",
    weekendMilestone:
      "Complete mock behavioral interview. Document feedback and improvement areas. Refine talking points.",
  },
  {
    index: 48,
    weekNumber: "Week 48",
    month: 16,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Job Application Strategy",
    weekdayTasks:
      "Research target companies. Tailor applications. Network with QA professionals. Set up job alerts.",
    weekendMilestone:
      "Submit 5+ quality applications. Document each application for follow-up. Prepare company research notes.",
  },
  {
    index: 49,
    weekNumber: "Week 49",
    month: 17,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Technical Interview Deep Dive",
    weekdayTasks:
      "Deep dive into specific technical topics: automation framework architecture, CI/CD pipeline design, performance engineering.",
    weekendMilestone:
      "Complete a technical deep-dive: build a mini project or write an architecture document for a complex testing scenario.",
  },
  {
    index: 50,
    weekNumber: "Week 50",
    month: 17,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Portfolio Review & Enhancement",
    weekdayTasks:
      "Review all portfolio materials. Identify gaps. Enhance projects based on job market feedback.",
    weekendMilestone:
      "Complete portfolio review checklist. Add any missing evidence, enhance existing projects, update documentation.",
  },
  {
    index: 51,
    weekNumber: "Week 51",
    month: 17,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Transition Planning",
    weekdayTasks:
      "Plan transition strategy. Set up tracking for applications. Prepare for multiple interview rounds.",
    weekendMilestone:
      "Create transition plan: timeline, target companies, skill gap analysis, and contingency planning. Document in learning log.",
  },
  {
    index: 52,
    weekNumber: "Week 52",
    month: 18,
    phase: "AI-Native QA + Portfolio",
    focusArea: "Retrospective & Next Steps",
    weekdayTasks:
      "Complete final retrospective. Review all 52 weeks of learning. Identify continuous learning paths.",
    weekendMilestone:
      "Write comprehensive retrospective: achievements, challenges, growth areas, and next steps. Publish as portfolio capstone.",
  },
];

const MILESTONES = [
  {
    name: "Phase 1 Console Project",
    description:
      "CSV to API validation pipeline with clean error handling, unit tests, and documentation.",
    targetWeekStart: 11,
    targetWeekEnd: 12,
    phaseIndex: 1,
  },
  {
    name: "Project 1: UI + API Automation Framework",
    description:
      "Complete automation framework with POM architecture, API layer, reporting, CI/CD, and cross-browser support.",
    targetWeekStart: 13,
    targetWeekEnd: 24,
    phaseIndex: 2,
  },
  {
    name: "Project 4: Performance Report",
    description:
      "k6 load/spike/soak test results with p95 analysis, charts, and optimization recommendations.",
    targetWeekStart: 26,
    targetWeekEnd: 29,
    phaseIndex: 3,
  },
  {
    name: "Security and DB Integration",
    description:
      "OWASP/IDOR tests, security findings report, data-integrity queries, and migration workflow.",
    targetWeekStart: 30,
    targetWeekEnd: 36,
    phaseIndex: 3,
  },
  {
    name: "Project 5: AI/LLM Testing Project",
    description:
      "Test strategy, prompt variations, evaluation rubric, output/safety checks for AI/LLM features.",
    targetWeekStart: 41,
    targetWeekEnd: 44,
    phaseIndex: 4,
  },
  {
    name: "Portfolio, Interview, Transition Readiness",
    description:
      "Clean READMEs, resume, LinkedIn, mock interview notes, applications, and retrospective.",
    targetWeekStart: 46,
    targetWeekEnd: 52,
    phaseIndex: 4,
  },
];

async function main() {
  console.log("Seeding database...");

  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    console.log("Database already seeded. Skipping.");
    console.log(
      "To reset: run `npx prisma migrate reset --force` or delete the DB file."
    );
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.create({
    data: {
      email: "learner@sqa.dev",
      name: "SQA Learner",
      password: hashedPassword,
    },
  });
  console.log(`Created user: ${user.email}`);

  const roadmap = await prisma.roadmap.create({
    data: {
      ownerId: user.id,
      name: "SQA Engineer Roadmap",
      primaryLanguage: "Python",
    },
  });
  console.log(`Created roadmap: ${roadmap.name}`);

  const phaseRecords: Record<string, string> = {};
  for (const phase of PHASES) {
    const record = await prisma.phase.create({
      data: {
        roadmapId: roadmap.id,
        orderIndex: phase.orderIndex,
        name: phase.name,
        goal: phase.goal,
        startWeek: phase.startWeek,
        endWeek: phase.endWeek,
      },
    });
    phaseRecords[phase.name] = record.id;
  }
  console.log(`Created ${PHASES.length} phases`);

  const phaseToId: Record<string, string> = {};
  for (const weekData of WEEKLY_DATA) {
    const phaseId = phaseRecords[weekData.phase];
    if (!phaseId) throw new Error(`Phase not found: ${weekData.phase}`);

    const week = await prisma.week.create({
      data: {
        roadmapId: roadmap.id,
        phaseId,
        targetIndex: weekData.index,
        monthNumber: weekData.month,
        focusArea: weekData.focusArea,
        weekdayTasks: weekData.weekdayTasks,
        weekendMilestone: weekData.weekendMilestone,
      },
    });

    const status = weekData.index === 1 ? "In Progress" : "Not Started";

    await prisma.weekProgress.create({
      data: {
        weekId: week.id,
        status,
        updatedById: user.id,
      },
    });

    phaseToId[weekData.index.toString()] = phaseId;
  }
  console.log(`Created ${WEEKLY_DATA.length} weeks with progress`);

  for (const milestone of MILESTONES) {
    const phaseId = phaseRecords[PHASES[milestone.phaseIndex - 1]!.name];

    await prisma.milestone.create({
      data: {
        roadmapId: roadmap.id,
        phaseId,
        name: milestone.name,
        description: milestone.description,
        targetWeekStart: milestone.targetWeekStart,
        targetWeekEnd: milestone.targetWeekEnd,
        status: "Not Started",
      },
    });
  }
  console.log(`Created ${MILESTONES.length} milestones`);

  await prisma.userPreference.create({
    data: {
      userId: user.id,
      theme: "system",
      weekdayHourGoal: 1.5,
      weekendHourGoal: 5,
    },
  });

  console.log("Created user preferences");
  console.log("\n--- Seed complete ---");
  console.log(`Login with: learner@sqa.dev / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
