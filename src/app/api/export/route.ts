import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    const roadmap = await prisma.roadmap.findFirst({
      where: { ownerId: userId, active: true },
    });

    if (!roadmap) {
      return Response.json({ error: "No roadmap found" }, { status: 404 });
    }

    const [weeks, phases, milestones, preferences, learningLogs, evidenceItems] =
      await Promise.all([
        prisma.week.findMany({
          where: { roadmapId: roadmap.id },
          include: {
            progress: true,
            statusHistory: true,
          },
          orderBy: { targetIndex: "asc" },
        }),
        prisma.phase.findMany({
          where: { roadmapId: roadmap.id },
          orderBy: { orderIndex: "asc" },
        }),
        prisma.milestone.findMany({
          where: { roadmapId: roadmap.id },
          include: { evidence: true },
        }),
        prisma.userPreference.findUnique({ where: { userId } }),
        prisma.learningLog.findMany({
          where: { ownerId: userId },
          orderBy: { entryDate: "desc" },
        }),
        prisma.evidenceItem.findMany({
          where: { ownerId: userId },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      user,
      roadmap: {
        ...roadmap,
        startDate: roadmap.startDate?.toISOString(),
      },
      phases: phases.map((p) => ({
        ...p,
        createdAt: undefined,
        updatedAt: undefined,
      })),
      weeks: weeks.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
        scheduledStartDate: w.scheduledStartDate?.toISOString(),
        scheduledEndDate: w.scheduledEndDate?.toISOString(),
        progress: w.progress
          ? {
              ...w.progress,
              completionConfirmedAt:
                w.progress.completionConfirmedAt?.toISOString(),
            }
          : null,
        statusHistory: w.statusHistory.map((h) => ({
          ...h,
          changedAt: h.changedAt.toISOString(),
        })),
      })),
      milestones,
      preferences,
      learningLogs: learningLogs.map((l) => ({
        ...l,
        entryDate: l.entryDate.toISOString(),
      })),
      evidenceItems: evidenceItems.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="sqa-roadmap-export.json"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
