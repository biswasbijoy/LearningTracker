import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/evidence/[evidenceId]">
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { evidenceId } = await context.params;

    const evidence = await prisma.evidenceItem.findUnique({
      where: { id: evidenceId },
    });

    if (!evidence || evidence.ownerId !== session.user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.evidenceItem.delete({ where: { id: evidenceId } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Evidence delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
