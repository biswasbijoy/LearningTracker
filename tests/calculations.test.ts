import { describe, it, expect } from "vitest";
import {
  calculateDashboardSummary,
  calculatePhaseProgress,
  getCurrentWeek,
} from "@/lib/calculations";
import type { WeekRecord, PhaseMeta } from "@/lib/calculations";
import { authSchema } from "@/lib/validations";

function makeWeek(overrides: Partial<WeekRecord> = {}): WeekRecord {
  return {
    id: "w1",
    targetIndex: 1,
    focusArea: "Test Focus",
    weekdayTasks: "Test tasks",
    weekendMilestone: "Test milestone",
    status: "Not Started",
    notes: null,
    phaseId: "p1",
    phaseName: "Engineering Foundations",
    phaseOrderIndex: 1,
    monthNumber: 1,
    ...overrides,
  };
}

function makePhase(overrides: Partial<PhaseMeta> = {}): PhaseMeta {
  return {
    id: "p1",
    name: "Engineering Foundations",
    goal: "Build foundations",
    orderIndex: 1,
    startWeek: 1,
    endWeek: 12,
    ...overrides,
  };
}

describe("registration validation", () => {
  it("accepts a valid email and strong password", () => {
    expect(
      authSchema.safeParse({
        email: "learner@example.com",
        password: "StrongPass1!",
      }).success
    ).toBe(true);
  });

  it("rejects invalid emails and passwords missing a required character type", () => {
    expect(
      authSchema.safeParse({
        email: "not-an-email",
        password: "StrongPass1!",
      }).success
    ).toBe(false);
    expect(
      authSchema.safeParse({
        email: "learner@example.com",
        password: "alllowercase1!",
      }).success
    ).toBe(false);
  });
});

describe("calculatePhaseProgress", () => {
  it("returns 0% when no weeks are completed", () => {
    const weeks = [makeWeek({ status: "Not Started" })];
    const phases = [makePhase()];
    const result = calculatePhaseProgress(weeks, phases);
    expect(result[0].percentage).toBe(0);
    expect(result[0].completed).toBe(0);
    expect(result[0].total).toBe(1);
  });

  it("returns 100% when all weeks are completed", () => {
    const weeks = [makeWeek({ status: "Completed" })];
    const phases = [makePhase()];
    const result = calculatePhaseProgress(weeks, phases);
    expect(result[0].percentage).toBe(100);
    expect(result[0].completed).toBe(1);
  });

  it("calculates correct percentage for partial completion", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "Completed" }),
      makeWeek({ id: "w3", targetIndex: 3, status: "Not Started" }),
      makeWeek({ id: "w4", targetIndex: 4, status: "In Progress" }),
    ];
    const phases = [makePhase({ startWeek: 1, endWeek: 4 })];
    const result = calculatePhaseProgress(weeks, phases);
    expect(result[0].percentage).toBe(50);
    expect(result[0].completed).toBe(2);
    expect(result[0].total).toBe(4);
  });

  it("handles multiple phases correctly", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, phaseId: "p1", status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, phaseId: "p1", status: "Not Started" }),
      makeWeek({ id: "w13", targetIndex: 13, phaseId: "p2", status: "Completed" }),
    ];
    const phases = [
      makePhase({ id: "p1", startWeek: 1, endWeek: 12 }),
      makePhase({ id: "p2", name: "Automation", startWeek: 13, endWeek: 24 }),
    ];
    const result = calculatePhaseProgress(weeks, phases);
    expect(result[0].percentage).toBe(50);
    expect(result[1].percentage).toBe(100);
  });

  it("returns 0 for empty phase", () => {
    const result = calculatePhaseProgress([], [makePhase()]);
    expect(result[0].percentage).toBe(0);
    expect(result[0].total).toBe(0);
  });
});

describe("calculateDashboardSummary", () => {
  it("returns correct totals for empty weeks", () => {
    const summary = calculateDashboardSummary([], [makePhase()]);
    expect(summary.totalWeeks).toBe(0);
    expect(summary.overallCompletion).toBe(0);
    expect(summary.completed).toBe(0);
    expect(summary.inProgress).toBe(0);
    expect(summary.notStarted).toBe(0);
    expect(summary.blocked).toBe(0);
  });

  it("matches expected seed dashboard parity", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "In Progress" }),
      ...Array.from({ length: 51 }, (_, i) =>
        makeWeek({
          id: `w${i + 2}`,
          targetIndex: i + 2,
          status: "Not Started",
        })
      ),
    ];
    const phases = [
      makePhase({ startWeek: 1, endWeek: 12 }),
      makePhase({ id: "p2", name: "Automation", startWeek: 13, endWeek: 24 }),
      makePhase({ id: "p3", name: "Performance", startWeek: 25, endWeek: 36 }),
      makePhase({ id: "p4", name: "AI-Native", startWeek: 37, endWeek: 52 }),
    ];

    const summary = calculateDashboardSummary(weeks, phases);
    expect(summary.totalWeeks).toBe(52);
    expect(summary.completed).toBe(0);
    expect(summary.inProgress).toBe(1);
    expect(summary.notStarted).toBe(51);
    expect(summary.blocked).toBe(0);
    expect(summary.overallCompletion).toBe(0);
  });

  it("identifies the current week as first non-completed week", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "In Progress" }),
      makeWeek({ id: "w3", targetIndex: 3, status: "Not Started" }),
    ];
    const summary = calculateDashboardSummary(weeks, [makePhase({ startWeek: 1, endWeek: 3 })]);
    expect(summary.currentWeek?.targetIndex).toBe(2);
  });

  it("returns roadmap complete when all weeks are done", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "Completed" }),
    ];
    const result = calculateDashboardSummary(weeks, [makePhase({ startWeek: 1, endWeek: 2 })]);
    expect(result.currentWeek).toBeNull();
  });

  it("lists blocked weeks correctly", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Blocked", notes: "Stuck on setup" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "Not Started" }),
    ];
    const summary = calculateDashboardSummary(weeks, [makePhase()]);
    expect(summary.blockedWeeks).toHaveLength(1);
    expect(summary.blockedWeeks[0].targetIndex).toBe(1);
    expect(summary.blockedWeeks[0].notes).toBe("Stuck on setup");
  });

  it("updates overall completion percentage when weeks are completed", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "Not Started" }),
    ];
    const summary = calculateDashboardSummary(weeks, [makePhase()]);
    expect(summary.overallCompletion).toBe(50);
  });
});

describe("getCurrentWeek", () => {
  it("returns the first non-completed week", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "In Progress" }),
      makeWeek({ id: "w3", targetIndex: 3, status: "Not Started" }),
    ];
    const result = getCurrentWeek(weeks);
    expect(result?.targetIndex).toBe(2);
  });

  it("respects override index", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "In Progress" }),
      makeWeek({ id: "w5", targetIndex: 5, status: "Not Started" }),
    ];
    const result = getCurrentWeek(weeks, 5);
    expect(result?.targetIndex).toBe(5);
  });

  it("returns null when all weeks are completed and no override", () => {
    const weeks = [
      makeWeek({ id: "w1", targetIndex: 1, status: "Completed" }),
      makeWeek({ id: "w2", targetIndex: 2, status: "Completed" }),
    ];
    const result = getCurrentWeek(weeks);
    expect(result).toBeNull();
  });
});
