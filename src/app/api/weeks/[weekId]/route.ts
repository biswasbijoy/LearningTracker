import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { weekProgressSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/weeks/[weekId]">
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId } = await context.params;
    const body = await request.json();
    const parsed = weekProgressSchema.safeParse({ ...body, weekId });

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const week = await prisma.week.findUnique({
      where: { id: weekId },
      include: {
        roadmap: { select: { ownerId: true } },
        progress: true,
      },
    });

    if (!week || week.roadmap.ownerId !== session.user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const { status, notes, weekdayHours, weekendHours } = parsed.data;
    const oldStatus = week.progress?.status ?? "Not Started";

    const progress = await prisma.weekProgress.upsert({
      where: { weekId },
      update: {
        status,
        notes,
        weekdayHours: weekdayHours ?? undefined,
        weekendHours: weekendHours ?? undefined,
        completionConfirmedAt:
          status === "Completed" && !week.progress?.completionConfirmedAt
            ? new Date()
            : undefined,
        updatedById: session.user.id,
      },
      create: {
        weekId,
        status,
        notes: notes ?? undefined,
        updatedById: session.user.id,
      },
    });

    if (oldStatus !== status) {
      await prisma.statusHistory.create({
        data: {
          weekId,
          actorId: session.user.id,
          fromStatus: oldStatus,
          toStatus: status,
        },
      });
    }

    return Response.json({ progress });
  } catch (error) {
    console.error("Week update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/weeks/[weekId]">
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId } = await context.params;

    const week = await prisma.week.findUnique({
      where: { id: weekId },
      include: {
        phase: true,
        progress: true,
        learningLogs: {
          where: { ownerId: session.user.id },
          orderBy: { entryDate: "desc" },
        },
        evidenceItems: {
          where: { ownerId: session.user.id },
          orderBy: { createdAt: "desc" },
        },
        statusHistory: {
          include: { actor: { select: { name: true } } },
          orderBy: { changedAt: "desc" },
          take: 20,
        },
        roadmap: {
          include: {
            milestones: {
              where: {
                targetWeekStart: { lte: 0 },
                targetWeekEnd: { gte: 0 },
              },
            },
          },
        },
      },
    });

    if (!week) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ week });
  } catch (error) {
    console.error("Week get error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
