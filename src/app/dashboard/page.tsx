import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateDashboardSummary } from "@/lib/calculations";
import AppShell from "@/components/layout/app-shell";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const roadmap = await prisma.roadmap.findFirst({
    where: { ownerId: userId, active: true },
  });

  if (!roadmap) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-semibold">No roadmap found</h2>
          <p className="mt-2 text-neutral-500">
            Create a new roadmap to get started.
          </p>
        </div>
      </AppShell>
    );
  }

  const [weeks, phases, preferences] = await Promise.all([
    prisma.week.findMany({
      where: { roadmapId: roadmap.id },
      include: {
        phase: { select: { id: true, name: true, orderIndex: true } },
        progress: { select: { status: true, notes: true } },
      },
      orderBy: { targetIndex: "asc" },
    }),
    prisma.phase.findMany({
      where: { roadmapId: roadmap.id },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.userPreference.findUnique({ where: { userId } }),
  ]);

  const weekRecords = weeks.map((w) => ({
    id: w.id,
    targetIndex: w.targetIndex,
    focusArea: w.focusArea,
    weekdayTasks: w.weekdayTasks,
    weekendMilestone: w.weekendMilestone,
    status: w.progress?.status ?? "Not Started",
    notes: w.progress?.notes ?? null,
    phaseId: w.phase.id,
    phaseName: w.phase.name,
    phaseOrderIndex: w.phase.orderIndex,
    monthNumber: w.monthNumber,
  }));

  const phaseMetas = phases.map((p) => ({
    id: p.id,
    name: p.name,
    goal: p.goal,
    orderIndex: p.orderIndex,
    startWeek: p.startWeek,
    endWeek: p.endWeek,
  }));

  const summary = calculateDashboardSummary(weekRecords, phaseMetas);

  const serialized = {
    ...summary,
    overallCompletion: Math.round(summary.overallCompletion * 100) / 100,
    phaseProgress: summary.phaseProgress.map((p) => ({
      ...p,
      percentage: Math.round(p.percentage * 100) / 100,
    })),
    currentWeekOverride: preferences?.currentWeekOverride ?? null,
    customStartDate: roadmap.startDate?.toISOString() ?? null,
    primaryLanguage: roadmap.primaryLanguage,
  };

  return (
    <AppShell>
      <DashboardClient summary={serialized} />
    </AppShell>
  );
}
