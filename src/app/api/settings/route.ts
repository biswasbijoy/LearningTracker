import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const { name, primaryLanguage, startDate, currentWeekOverride, weekdayHourGoal, weekendHourGoal, theme } =
      parsed.data;

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { ownerId: userId, active: true },
    });

    if (roadmap) {
      await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: {
          primaryLanguage: primaryLanguage ?? undefined,
          startDate: startDate ? new Date(startDate) : undefined,
        },
      });

      if (startDate) {
        const weeks = await prisma.week.findMany({
          where: { roadmapId: roadmap.id },
          orderBy: { targetIndex: "asc" },
        });

        const start = new Date(startDate);
        for (const week of weeks) {
          const scheduledStart = new Date(start);
          scheduledStart.setDate(scheduledStart.getDate() + (week.targetIndex - 1) * 7);
          const scheduledEnd = new Date(scheduledStart);
          scheduledEnd.setDate(scheduledEnd.getDate() + 6);

          await prisma.week.update({
            where: { id: week.id },
            data: {
              scheduledStartDate: scheduledStart,
              scheduledEndDate: scheduledEnd,
            },
          });
        }
      }
    }

    const preferencesData: Record<string, unknown> = {};
    if (currentWeekOverride !== undefined)
      preferencesData.currentWeekOverride = currentWeekOverride;
    if (weekdayHourGoal !== undefined)
      preferencesData.weekdayHourGoal = weekdayHourGoal;
    if (weekendHourGoal !== undefined)
      preferencesData.weekendHourGoal = weekendHourGoal;
    if (theme) preferencesData.theme = theme;

    if (Object.keys(preferencesData).length > 0) {
      await prisma.userPreference.upsert({
        where: { userId },
        update: preferencesData,
        create: { userId, ...preferencesData },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, roadmap, preferences] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.roadmap.findFirst({
        where: { ownerId: session.user.id, active: true },
      }),
      prisma.userPreference.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    return Response.json({
      name: user?.name,
      email: user?.email,
      primaryLanguage: roadmap?.primaryLanguage,
      startDate: roadmap?.startDate,
      currentWeekOverride: preferences?.currentWeekOverride,
      weekdayHourGoal: preferences?.weekdayHourGoal,
      weekendHourGoal: preferences?.weekendHourGoal,
      theme: preferences?.theme ?? "system",
    });
  } catch (error) {
    console.error("Settings get error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
