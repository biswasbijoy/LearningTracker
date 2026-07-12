import type { DashboardSummary, PhaseProgress, CurrentWeek, BlockedWeek } from "@/types";

export interface WeekRecord {
  id: string;
  targetIndex: number;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
  status: string;
  notes: string | null;
  phaseId: string;
  phaseName: string;
  phaseOrderIndex: number;
  monthNumber: number;
}

export interface PhaseMeta {
  id: string;
  name: string;
  goal: string;
  orderIndex: number;
  startWeek: number;
  endWeek: number;
}

export function calculatePhaseProgress(
  weeks: WeekRecord[],
  phases: PhaseMeta[]
): PhaseProgress[] {
  return phases.map((phase) => {
    const phaseWeeks = weeks.filter(
      (w) =>
        w.targetIndex >= phase.startWeek && w.targetIndex <= phase.endWeek
    );
    const total = phaseWeeks.length;
    const completed = phaseWeeks.filter((w) => w.status === "Completed").length;
    return {
      phaseId: phase.id,
      phaseName: phase.name,
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
      orderIndex: phase.orderIndex,
    };
  });
}

export function calculateDashboardSummary(
  weeks: WeekRecord[],
  phases: PhaseMeta[]
): DashboardSummary {
  const totalWeeks = weeks.length;
  const completed = weeks.filter((w) => w.status === "Completed").length;
  const inProgress = weeks.filter((w) => w.status === "In Progress").length;
  const notStarted = weeks.filter((w) => w.status === "Not Started").length;
  const blocked = weeks.filter((w) => w.status === "Blocked").length;
  const overallCompletion = totalWeeks > 0 ? (completed / totalWeeks) * 100 : 0;

  const phaseProgress = calculatePhaseProgress(weeks, phases);

  const activeWeek = weeks
    .filter((w) => w.status !== "Completed")
    .sort((a, b) => a.targetIndex - b.targetIndex)[0];

  const currentWeek: CurrentWeek | null = activeWeek
    ? {
        weekId: activeWeek.id,
        targetIndex: activeWeek.targetIndex,
        focusArea: activeWeek.focusArea,
        weekdayTasks: activeWeek.weekdayTasks,
        weekendMilestone: activeWeek.weekendMilestone,
        status: activeWeek.status as CurrentWeek["status"],
        lastNote: activeWeek.notes,
      }
    : {
        weekId: "",
        targetIndex: 52,
        focusArea: "Roadmap complete!",
        weekdayTasks: "",
        weekendMilestone: "",
        status: "Completed",
        lastNote: null,
      };

  const blockedWeeks: BlockedWeek[] = weeks
    .filter((w) => w.status === "Blocked")
    .map((w) => ({
      weekId: w.id,
      targetIndex: w.targetIndex,
      focusArea: w.focusArea,
      notes: w.notes,
    }));

  return {
    totalWeeks,
    completed,
    inProgress,
    notStarted,
    blocked,
    overallCompletion,
    phaseProgress,
    currentWeek: activeWeek ? currentWeek : null,
    blockedWeeks,
    recentActivity: [],
    upcomingMilestones: [],
  };
}

export function getCurrentWeek(
  weeks: WeekRecord[],
  overrideIndex?: number | null
): WeekRecord | null {
  if (overrideIndex) {
    const overridden = weeks.find((w) => w.targetIndex === overrideIndex);
    if (overridden) return overridden;
  }
  const sorted = [...weeks].sort((a, b) => a.targetIndex - b.targetIndex);
  const active = sorted.find((w) => w.status !== "Completed");
  return active ?? null;
}

export function validateStatusTransition(from: string, to: string): boolean {
  const valid = ["Not Started", "In Progress", "Completed", "Blocked"];
  return valid.includes(from) && valid.includes(to);
}

export function calculateScheduledDates(
  startDate: Date,
  weekIndex: number
): { start: Date; end: Date } {
  const start = new Date(startDate);
  start.setDate(start.getDate() + (weekIndex - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}
