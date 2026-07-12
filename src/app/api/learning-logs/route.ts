import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { learningLogSchema } from "@/lib/validations";
import { serializeTags } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = learningLogSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { weekId, learnedText, difficultyText, insightText, nextAction, tags } =
      parsed.data;

    const learningLog = await prisma.learningLog.create({
      data: {
        weekId: weekId ?? null,
        ownerId: session.user.id,
        learnedText,
        difficultyText: difficultyText ?? null,
        insightText: insightText ?? null,
        nextAction: nextAction ?? null,
        tags: serializeTags(tags),
      },
    });

    return Response.json({ learningLog }, { status: 201 });
  } catch (error) {
    console.error("Learning log error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get("weekId");

    const where: Record<string, unknown> = { ownerId: session.user.id };
    if (weekId) where.weekId = weekId;

    const logs = await prisma.learningLog.findMany({
      where,
      include: {
        week: { select: { targetIndex: true, focusArea: true } },
      },
      orderBy: { entryDate: "desc" },
      take: 100,
    });

    return Response.json({ logs });
  } catch (error) {
    console.error("Learning logs get error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
