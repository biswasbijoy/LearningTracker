import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import { WeekDetailClient } from "./week-detail-client";
import type { WeekStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function WeekDetailPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { weekId } = await params;

  const week = await prisma.week.findUnique({
    where: { id: weekId },
    include: {
      phase: {
        select: { id: true, name: true, goal: true, orderIndex: true },
      },
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
    },
  });

  if (!week) notFound();

  const [allWeeks, milestones] = await Promise.all([
    prisma.week.findMany({
      where: { roadmapId: week.roadmapId },
      select: { id: true, targetIndex: true },
      orderBy: { targetIndex: "asc" },
    }),
    prisma.milestone.findMany({
      where: {
        roadmapId: week.roadmapId,
        targetWeekStart: { lte: week.targetIndex },
        targetWeekEnd: { gte: week.targetIndex },
      },
    }),
  ]);

  const currentIndex = allWeeks.findIndex((w) => w.id === weekId);
  const prevWeek = currentIndex > 0 ? allWeeks[currentIndex - 1] : null;
  const nextWeek =
    currentIndex < allWeeks.length - 1 ? allWeeks[currentIndex + 1] : null;

  const milestone = milestones.length > 0 ? milestones[0] : null;

  const serialized = {
    id: week.id,
    targetIndex: week.targetIndex,
    monthNumber: week.monthNumber,
    focusArea: week.focusArea,
    weekdayTasks: week.weekdayTasks,
    weekendMilestone: week.weekendMilestone,
    status: (week.progress?.status ?? "Not Started") as WeekStatus,
    notes: week.progress?.notes ?? null,
    weekdayHours: week.progress?.weekdayHours ?? null,
    weekendHours: week.progress?.weekendHours ?? null,
    completionConfirmedAt: week.progress?.completionConfirmedAt?.toISOString() ?? null,
    scheduledStartDate: week.scheduledStartDate?.toISOString() ?? null,
    scheduledEndDate: week.scheduledEndDate?.toISOString() ?? null,
    phase: {
      id: week.phase.id,
      name: week.phase.name,
      goal: week.phase.goal,
    },
    learningLogs: week.learningLogs.map((l) => ({
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
    })),
    evidenceItems: week.evidenceItems.map((e) => ({
      id: e.id,
      type: e.type,
      title: e.title,
      url: e.url,
      storageKey: e.storageKey,
      fileName: e.fileName,
      mimeType: e.mimeType,
      fileSize: e.fileSize,
      description: e.description,
      createdAt: e.createdAt.toISOString(),
    })),
    statusHistory: week.statusHistory.map((h) => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      note: h.note,
      changedAt: h.changedAt.toISOString(),
    })),
    milestone: milestone
      ? {
          milestoneId: milestone.id,
          name: milestone.name,
          status: milestone.status,
        }
      : null,
  };

  return (
    <AppShell>
      <WeekDetailClient
        week={serialized}
        prevWeek={prevWeek ? { id: prevWeek.id, targetIndex: prevWeek.targetIndex } : null}
        nextWeek={nextWeek ? { id: nextWeek.id, targetIndex: nextWeek.targetIndex } : null}
      />
    </AppShell>
  );
}
