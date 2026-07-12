import { prisma } from "@/lib/db";

const weeklyData: Array<{
  index: number;
  month: number;
  phaseIndex: number;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
}> = [
  { index: 1, month: 1, phaseIndex: 0, focusArea: "Programming Fundamentals â€“ Python", weekdayTasks: "Set up Python environment (pyenv + venv). Complete 5 basic coding exercises (loops, conditionals, functions). Read about clean code basics.", weekendMilestone: "Write a CLI script that reads a CSV, validates row counts, and logs pass/fail. Push to a GitHub repo with a README." },
  { index: 2, month: 1, phaseIndex: 0, focusArea: "Programming Fundamentals â€“ Data Structures", weekdayTasks: "Study Python lists, dicts, sets, tuples. Complete 5 exercises on string manipulation and file I/O.", weekendMilestone: "Extend last week's script: add functions for data transformation and filtering. Write unit tests with pytest." },
  { index: 3, month: 1, phaseIndex: 0, focusArea: "Programming Fundamentals â€“ OOP Basics", weekdayTasks: "Study Python classes, inheritance, polymorphism. Practice writing simple classes.", weekendMilestone: "Build a simple test data generator using OOP: factory classes for generating sample user/test data." },
  { index: 4, month: 2, phaseIndex: 0, focusArea: "SQL & Databases â€“ Querying", weekdayTasks: "Learn SELECT, WHERE, JOIN, GROUP BY, ORDER BY. Practice on a sample dataset (SQLite).", weekendMilestone: "Write 15 SQL queries on a provided e-commerce schema. Validate results with expected output. Document queries and findings." },
  { index: 5, month: 2, phaseIndex: 0, focusArea: "SQL & Databases â€“ DML & DDL", weekdayTasks: "Learn INSERT, UPDATE, DELETE, CREATE TABLE, ALTER, indexes. Study basic normalization.", weekendMilestone: "Design a normalized schema for a bug-tracking system. Write DDL scripts and seed data. Verify with test queries." },
  { index: 6, month: 2, phaseIndex: 0, focusArea: "SQL & Databases â€“ Advanced", weekdayTasks: "Study subqueries, CTEs, window functions, views, and transactions.", weekendMilestone: "Write complex queries using CTEs and window functions on a test DB. Demonstrate data integrity checks with transactions." },
  { index: 7, month: 3, phaseIndex: 0, focusArea: "HTTP & API Fundamentals", weekdayTasks: "Learn HTTP methods, status codes, headers, REST principles. Practice with curl/Postman.", weekendMilestone: "Test a public REST API (e.g., GitHub API): document endpoints, test edge cases, verify status codes. Write a report." },
  { index: 8, month: 3, phaseIndex: 0, focusArea: "API Testing with Python", weekdayTasks: "Learn requests library. Write Python scripts to call APIs, validate responses, handle errors.", weekendMilestone: "Build a test suite for a sample API: CRUD operations, negative tests, schema validation. Use pytest." },
  { index: 9, month: 3, phaseIndex: 0, focusArea: "Git & Version Control", weekdayTasks: "Learn branching, merging, rebasing, pull requests, and conflict resolution. Practice git workflow.", weekendMilestone: "Set up a GitHub repo with proper branching strategy (feature/main). Practice resolving merge conflicts. Write CONTRIBUTING.md." },
  { index: 10, month: 4, phaseIndex: 0, focusArea: "Automation Design Principles", weekdayTasks: "Study POM, DRY, SOLID in testing context. Learn test fixtures and configuration management.", weekendMilestone: "Design an automation framework structure: project layout, config files, reporting approach. Document architecture decisions." },
  { index: 11, month: 4, phaseIndex: 0, focusArea: "Integration Project â€“ Part 1", weekdayTasks: "Start building a console-based test project: CSV input, API validation, result logging.", weekendMilestone: "Complete Phase 1 console project: CSV to API validation pipeline with clean error handling. Push to GitHub." },
  { index: 12, month: 4, phaseIndex: 0, focusArea: "Review & Refactor", weekdayTasks: "Review Phase 1 concepts. Refactor your project. Write documentation. Identify knowledge gaps.", weekendMilestone: "Finalize Phase 1 portfolio: README, test results, refactored code. Write a self-assessment of foundations learned." },
  { index: 13, month: 5, phaseIndex: 1, focusArea: "Selenium/Playwright Foundations", weekdayTasks: "Set up browser automation tool. Learn locators, navigation, assertions. Write 5 basic tests.", weekendMilestone: "Create a test suite for a demo web app: login, navigation, form submission, and verification." },
  { index: 14, month: 5, phaseIndex: 1, focusArea: "Advanced Page Object Model", weekdayTasks: "Implement POM with base page, page components, and page factory. Learn waits and synchronization.", weekendMilestone: "Refactor test suite with full POM architecture. Add explicit waits, error handling, and logging." },
  { index: 15, month: 5, phaseIndex: 1, focusArea: "Data-Driven Testing", weekdayTasks: "Learn data providers, external data sources (CSV, JSON, Excel). Parameterize test data.", weekendMilestone: "Implement data-driven tests: read test cases from external files, run parameterized scenarios, report results." },
  { index: 16, month: 6, phaseIndex: 1, focusArea: "API Automation Layer", weekdayTasks: "Build API test layer using requests/httpx. Learn request chaining, auth, and schema validation.", weekendMilestone: "Build API test suite: CRUD endpoints, auth flows, negative testing, and data cleanup. Integrate with UI tests." },
  { index: 17, month: 6, phaseIndex: 1, focusArea: "Test Reporting & Allure", weekdayTasks: "Learn Allure/Extent reporting. Integrate reports with test frameworks. Add screenshots and logs.", weekendMilestone: "Integrate Allure reporting into test suites. Generate rich reports with steps, attachments, and history." },
  { index: 18, month: 6, phaseIndex: 1, focusArea: "Cross-Browser & Parallel Execution", weekdayTasks: "Learn cross-browser configuration. Set up parallel test execution with Selenium Grid or Playwright.", weekendMilestone: "Configure cross-browser (Chrome, Firefox, Edge) parallel execution. Compare run times and results." },
  { index: 19, month: 7, phaseIndex: 1, focusArea: "CI/CD Integration", weekdayTasks: "Learn GitHub Actions basics: workflows, jobs, steps, triggers. Set up a simple pipeline.", weekendMilestone: "Create GitHub Actions workflow that runs automation tests on push. Include reporting artifacts and notifications." },
  { index: 20, month: 7, phaseIndex: 1, focusArea: "Test Environment Management", weekdayTasks: "Learn Docker basics: images, containers, Docker Compose. Set up test environment with Docker.", weekendMilestone: "Containerize the automation framework. Use Docker Compose for app under test + test runner. Document setup." },
  { index: 21, month: 7, phaseIndex: 1, focusArea: "Advanced Assertions & Hamcrest", weekdayTasks: "Learn soft assertions, custom matchers, and collection assertions. Practice fluent assertion patterns.", weekendMilestone: "Enhance test suites with soft assertions, collection validations, and custom error messages. Compare soft vs hard." },
  { index: 22, month: 8, phaseIndex: 1, focusArea: "Mobile Testing Basics", weekdayTasks: "Learn Appium/Detox basics: setup, locators, gestures. Write 3 basic mobile tests.", weekendMilestone: "Set up mobile test environment. Automate a simple mobile flow. Document challenges and differences from web." },
  { index: 23, month: 8, phaseIndex: 1, focusArea: "Project 1 â€“ Framework Completion", weekdayTasks: "Integrate all components: POM, API, data-driven, reporting, CI, cross-browser. Full end-to-end test.", weekendMilestone: "Complete Project 1: UI + API automation framework. All components integrated, documented, CI passing." },
  { index: 24, month: 8, phaseIndex: 1, focusArea: "Review & Refactor", weekdayTasks: "Review all automation concepts. Refactor framework. Write documentation and lessons learned.", weekendMilestone: "Finalize Phase 2 portfolio: framework architecture doc, test results, CI config. Self-assessment and retrospective." },
  { index: 25, month: 9, phaseIndex: 2, focusArea: "Performance Testing â€“ k6 Basics", weekdayTasks: "Install k6. Learn k6 scripting: HTTP requests, checks, thresholds, options.", weekendMilestone: "Write k6 scripts for a demo API: load test with ramp-up, verify response times, set pass/fail thresholds." },
  { index: 26, month: 9, phaseIndex: 2, focusArea: "Performance Testing â€“ Scenarios", weekdayTasks: "Learn load, spike, soak, and stress testing patterns. Study metrics: p95, p99, throughput, error rate.", weekendMilestone: "Execute load, spike, and soak tests on a sample app. Compare results, analyze bottlenecks, write report." },
  { index: 27, month: 9, phaseIndex: 2, focusArea: "Performance Reporting & Analysis", weekdayTasks: "Learn k6 outputs: JSON, CSV, Prometheus, Grafana. Study performance report best practices.", weekendMilestone: "Generate performance report with charts and analysis. Include recommendations. Push to portfolio repository." },
  { index: 28, month: 10, phaseIndex: 2, focusArea: "Performance in CI/CD", weekdayTasks: "Integrate k6 into GitHub Actions. Set up performance gates in CI pipeline.", weekendMilestone: "Configure performance test pipeline: automatic k6 execution, threshold validation, trend tracking over builds." },
  { index: 29, month: 10, phaseIndex: 2, focusArea: "Security Testing â€“ OWASP Top 10", weekdayTasks: "Study OWASP Top 10 vulnerabilities: SQL injection, XSS, CSRF, IDOR, auth flaws. Understand each.", weekendMilestone: "Document OWASP Top 10 with examples. Test a demo vulnerable app (DVWA) for at least 5 vulnerabilities." },
  { index: 30, month: 10, phaseIndex: 2, focusArea: "Security Testing â€“ Tools & Automation", weekdayTasks: "Learn OWASP ZAP or Burp Suite basics. Set up automated security scanning.", weekendMilestone: "Configure automated ZAP scan in CI. Run security tests on a sample app. Document findings and remediation." },
  { index: 31, month: 11, phaseIndex: 2, focusArea: "Authorization & IDOR Testing", weekdayTasks: "Deep dive into IDOR, privilege escalation, and authorization bypass. Practice identifying these flaws.", weekendMilestone: "Write tests to detect IDOR vulnerabilities in a sample API. Document methodology and findings." },
  { index: 32, month: 11, phaseIndex: 2, focusArea: "Advanced Data Validation", weekdayTasks: "Study data integrity testing, referential integrity, constraint validation. Learn Great Expectations basics.", weekendMilestone: "Write data validation tests: check constraints, relationships, data types, and business rules on a test database." },
  { index: 33, month: 11, phaseIndex: 2, focusArea: "DB Performance & Indexing", weekdayTasks: "Learn query plan analysis, index strategies, and performance optimization in SQL. Use EXPLAIN ANALYZE.", weekendMilestone: "Analyze query performance on a sample database. Create optimized indexes. Benchmark before/after improvements." },
  { index: 34, month: 12, phaseIndex: 2, focusArea: "DB Migrations & Versioning", weekdayTasks: "Learn migration tools (Alembic, Flyway). Practice schema versioning and rollback strategies.", weekendMilestone: "Set up migration workflow: create initial schema, add changes, handle rollbacks. Document best practices." },
  { index: 35, month: 12, phaseIndex: 2, focusArea: "Security & DB Integration Project", weekdayTasks: "Combine security and database testing: test auth, data integrity, SQL injection prevention.", weekendMilestone: "Complete Security and DB Integration Project: OWASP/IDOR tests, security findings report, data-integrity queries." },
  { index: 36, month: 12, phaseIndex: 2, focusArea: "Review & Refactor", weekdayTasks: "Review performance, security, and DB concepts. Refactor test projects. Document lessons learned.", weekendMilestone: "Finalize Phase 3 portfolio: performance report, security findings, DB tests. Self-assessment and retrospective." },
  { index: 37, month: 13, phaseIndex: 3, focusArea: "AI in QA â€“ Fundamentals", weekdayTasks: "Study AI/ML fundamentals for QA: test generation, defect prediction, visual testing. Learn prompt engineering.", weekendMilestone: "Use AI to generate test cases for a sample feature. Compare AI-generated vs manually written tests. Document observations." },
  { index: 38, month: 13, phaseIndex: 3, focusArea: "Prompt Engineering for QA", weekdayTasks: "Practice crafting prompts for test generation, bug reproduction, and test data creation. Iterate and refine.", weekendMilestone: "Create a prompt library for common QA tasks. Test and evaluate prompt effectiveness. Document best practices." },
  { index: 39, month: 13, phaseIndex: 3, focusArea: "Testing AI-Generated Code", weekdayTasks: "Learn strategies for testing AI-generated code: hallucination detection, edge case analysis, validation approaches.", weekendMilestone: "Write test suites for AI-generated functions. Identify hallucinated APIs and incorrect logic. Document findings." },
  { index: 40, month: 14, phaseIndex: 3, focusArea: "AI-Assisted Test Automation", weekdayTasks: "Use AI tools to enhance test automation: self-healing locators, visual regression, smart wait strategies.", weekendMilestone: "Implement an AI-assisted testing feature: automated test generation from user stories or visual regression baseline updates." },
  { index: 41, month: 14, phaseIndex: 3, focusArea: "LLM Testing â€“ Quality & Safety", weekdayTasks: "Learn LLM evaluation metrics: accuracy, relevance, safety, bias. Study testing strategies for LLM outputs.", weekendMilestone: "Build test strategy for an LLM-powered feature: prompt variations, output validation, bias/safety checks, evaluation rubric." },
  { index: 42, month: 14, phaseIndex: 3, focusArea: "LLM Testing â€“ Automation", weekdayTasks: "Build automated LLM test harness: prompt templates, output parsers, expected behavior validation.", weekendMilestone: "Implement automated LLM evaluation pipeline: run test prompts, validate outputs, generate quality report." },
  { index: 43, month: 15, phaseIndex: 3, focusArea: "Project 5 â€“ AI/LLM Testing", weekdayTasks: "Design and scope AI/LLM testing project. Define test strategy, evaluation criteria, and automation approach.", weekendMilestone: "Complete Project 5: AI/LLM testing project with test strategy, prompt variations, evaluation rubric, and output/safety checks." },
  { index: 44, month: 15, phaseIndex: 3, focusArea: "Portfolio Building â€“ Projects", weekdayTasks: "Review all projects. Clean up repositories. Write comprehensive READMEs for each project.", weekendMilestone: "Polish all project repositories: consistent READMEs, proper documentation, clean code, and CI badges." },
  { index: 45, month: 15, phaseIndex: 3, focusArea: "Resume & LinkedIn Optimization", weekdayTasks: "Update resume with SQA projects and skills. Optimize LinkedIn profile for QA engineering roles.", weekendMilestone: "Complete resume and LinkedIn overhaul. Get feedback from peers. Document interview talking points for each project." },
  { index: 46, month: 16, phaseIndex: 3, focusArea: "Interview Prep â€“ Technical", weekdayTasks: "Practice coding problems for QA interviews. Review system design for test automation frameworks.", weekendMilestone: "Complete mock technical interview: coding challenge, framework design discussion, and test strategy presentation." },
  { index: 47, month: 16, phaseIndex: 3, focusArea: "Interview Prep â€“ Behavioral", weekdayTasks: "Prepare STAR stories for behavioral questions. Practice communication of QA decisions and trade-offs.", weekendMilestone: "Complete mock behavioral interview. Document feedback and improvement areas. Refine talking points." },
  { index: 48, month: 16, phaseIndex: 3, focusArea: "Job Application Strategy", weekdayTasks: "Research target companies. Tailor applications. Network with QA professionals. Set up job alerts.", weekendMilestone: "Submit 5+ quality applications. Document each application for follow-up. Prepare company research notes." },
  { index: 49, month: 17, phaseIndex: 3, focusArea: "Technical Interview Deep Dive", weekdayTasks: "Deep dive into specific technical topics: automation framework architecture, CI/CD pipeline design, performance engineering.", weekendMilestone: "Complete a technical deep-dive: build a mini project or write an architecture document for a complex testing scenario." },
  { index: 50, month: 17, phaseIndex: 3, focusArea: "Portfolio Review & Enhancement", weekdayTasks: "Review all portfolio materials. Identify gaps. Enhance projects based on job market feedback.", weekendMilestone: "Complete portfolio review checklist. Add any missing evidence, enhance existing projects, update documentation." },
  { index: 51, month: 17, phaseIndex: 3, focusArea: "Transition Planning", weekdayTasks: "Plan transition strategy. Set up tracking for applications. Prepare for multiple interview rounds.", weekendMilestone: "Create transition plan: timeline, target companies, skill gap analysis, and contingency planning. Document in learning log." },
  { index: 52, month: 18, phaseIndex: 3, focusArea: "Retrospective & Next Steps", weekdayTasks: "Complete final retrospective. Review all 52 weeks of learning. Identify continuous learning paths.", weekendMilestone: "Write comprehensive retrospective: achievements, challenges, growth areas, and next steps. Publish as portfolio capstone." },
];

export async function createRoadmapForUser(userId: string) {
  const roadmap = await prisma.roadmap.create({
    data: {
      ownerId: userId,
      name: "SQA Engineer Roadmap",
    },
  });

  const phases = await Promise.all(
    [
      {
        orderIndex: 1,
        name: "Engineering Foundations",
        goal: "Build programming, SQL, HTTP/API, Git, clean-code, and automation-design foundations.",
        startWeek: 1,
        endWeek: 12,
      },
      {
        orderIndex: 2,
        name: "Automation Engineering",
        goal: "Build a UI/API automation framework with POM, reporting, cross-browser execution, and GitHub Actions.",
        startWeek: 13,
        endWeek: 24,
      },
      {
        orderIndex: 3,
        name: "Performance, Security, DB Depth",
        goal: "Gain working depth in k6, OWASP-oriented testing, authorization/IDOR, and advanced data validation.",
        startWeek: 25,
        endWeek: 36,
      },
      {
        orderIndex: 4,
        name: "AI-Native QA + Portfolio",
        goal: "Use AI responsibly in QA, test AI/LLM behaviors, polish the portfolio, and prepare for interviews.",
        startWeek: 37,
        endWeek: 52,
      },
    ].map((p) =>
      prisma.phase.create({
        data: { ...p, roadmapId: roadmap.id },
      })
    )
  );

  for (const w of weeklyData) {
    const week = await prisma.week.create({
      data: {
        roadmapId: roadmap.id,
        phaseId: phases[w.phaseIndex].id,
        targetIndex: w.index,
        monthNumber: w.month,
        focusArea: w.focusArea,
        weekdayTasks: w.weekdayTasks,
        weekendMilestone: w.weekendMilestone,
      },
    });

    await prisma.weekProgress.create({
      data: {
        weekId: week.id,
        status: w.index === 1 ? "In Progress" : "Not Started",
        updatedById: userId,
      },
    });
  }

  await prisma.milestone.createMany({
    data: [
      { roadmapId: roadmap.id, phaseId: phases[0].id, name: "Phase 1 Console Project", description: "CSV to API validation pipeline with clean error handling.", targetWeekStart: 11, targetWeekEnd: 12 },
      { roadmapId: roadmap.id, phaseId: phases[1].id, name: "Project 1: UI + API Automation Framework", description: "Complete automation framework with POM, API layer, CI/CD.", targetWeekStart: 13, targetWeekEnd: 24 },
      { roadmapId: roadmap.id, phaseId: phases[2].id, name: "Project 4: Performance Report", description: "k6 load/spike/soak test results with p95 analysis.", targetWeekStart: 26, targetWeekEnd: 29 },
      { roadmapId: roadmap.id, phaseId: phases[2].id, name: "Security and DB Integration", description: "OWASP/IDOR tests, security findings, data-integrity queries.", targetWeekStart: 30, targetWeekEnd: 36 },
      { roadmapId: roadmap.id, phaseId: phases[3].id, name: "Project 5: AI/LLM Testing Project", description: "Test strategy, prompt variations, evaluation rubric.", targetWeekStart: 41, targetWeekEnd: 44 },
      { roadmapId: roadmap.id, phaseId: phases[3].id, name: "Portfolio, Interview, Transition Readiness", description: "Clean READMEs, resume, LinkedIn, mock interviews.", targetWeekStart: 46, targetWeekEnd: 52 },
    ],
  });

  return roadmap;
}
