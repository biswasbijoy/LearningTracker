import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import { RoadmapClient } from "./roadmap-client";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roadmap = await prisma.roadmap.findFirst({
    where: { ownerId: session.user.id, active: true },
  });

  if (!roadmap) {
    redirect("/dashboard");
  }

  const weeks = await prisma.week.findMany({
    where: { roadmapId: roadmap.id },
    include: {
      phase: { select: { name: true, orderIndex: true } },
      progress: { select: { status: true, notes: true, weekdayHours: true, weekendHours: true } },
      evidenceItems: { select: { id: true } },
      learningLogs: { select: { id: true } },
    },
    orderBy: { targetIndex: "asc" },
  });

  const phases = await prisma.phase.findMany({
    where: { roadmapId: roadmap.id },
    orderBy: { orderIndex: "asc" },
  });

  const serializedWeeks = weeks.map((w) => ({
    id: w.id,
    targetIndex: w.targetIndex,
    monthNumber: w.monthNumber,
    focusArea: w.focusArea,
    weekdayTasks: w.weekdayTasks,
    weekendMilestone: w.weekendMilestone,
    phaseName: w.phase.name,
    phaseOrderIndex: w.phase.orderIndex,
    status: w.progress?.status ?? "Not Started",
    notes: w.progress?.notes ?? null,
    evidenceCount: w.evidenceItems.length,
    reflectionCount: w.learningLogs.length,
  }));

  const phaseFilters = phases.map((p) => ({
    id: p.id,
    name: p.name,
    orderIndex: p.orderIndex,
  }));

  return (
    <AppShell>
      <RoadmapClient weeks={serializedWeeks} phases={phaseFilters} />
    </AppShell>
  );
}
