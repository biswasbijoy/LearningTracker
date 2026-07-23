import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ milestoneId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { milestoneId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["Not Started", "In Progress", "Completed"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, roadmap: { ownerId: session.user.id } },
    });

    if (!milestone) {
      return Response.json({ error: "Milestone not found" }, { status: 404 });
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status },
    });

    return Response.json({ milestone: updated });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
