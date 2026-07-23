import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { evidenceSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = evidenceSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { weekId, type, title, url, storageKey, fileName, mimeType, fileSize, description } = parsed.data;

    if (!weekId) {
      return Response.json({ error: "weekId is required" }, { status: 400 });
    }

    const week = await prisma.week.findUnique({ where: { id: weekId } });
    if (!week) {
      return Response.json({ error: "Week not found" }, { status: 404 });
    }

    const evidence = await prisma.evidenceItem.create({
      data: {
        weekId,
        ownerId: session.user.id,
        type,
        title,
        url: url ?? null,
        storageKey: storageKey ?? null,
        fileName: fileName ?? null,
        mimeType: mimeType ?? null,
        fileSize: fileSize ?? null,
        description: description ?? null,
      },
    });

    return Response.json({ evidence }, { status: 201 });
  } catch (error) {
    console.error("Evidence create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
