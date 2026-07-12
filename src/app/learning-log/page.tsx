import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import { LearningLogClient } from "./learning-log-client";

export const dynamic = "force-dynamic";

export default async function LearningLogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const logs = await prisma.learningLog.findMany({
    where: { ownerId: session.user.id },
    include: {
      week: { select: { targetIndex: true, focusArea: true } },
    },
    orderBy: { entryDate: "desc" },
    take: 100,
  });

  const serialized = logs.map((l) => ({
    id: l.id,
    entryDate: l.entryDate.toISOString(),
    learnedText: l.learnedText,
    difficultyText: l.difficultyText,
    insightText: l.insightText,
    nextAction: l.nextAction,
    tags: (() => {
      try {
        return JSON.parse(l.tags);
      } catch {
        return [];
      }
    })(),
    weekTargetIndex: l.week?.targetIndex ?? null,
    weekFocusArea: l.week?.focusArea ?? null,
  }));

  return (
    <AppShell>
      <LearningLogClient logs={serialized} />
    </AppShell>
  );
}
