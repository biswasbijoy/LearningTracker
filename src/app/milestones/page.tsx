import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import { MilestonesClient } from "./milestones-client";

export const dynamic = "force-dynamic";

type CheckFn = (
  milestones: { status: string; name: string }[],
  evidenceTypes: string[],
  logCount: number,
) => boolean;

const PORTFOLIO_RULES: { key: string; label: string; check: CheckFn }[] = [
  {
    key: "framework",
    label: "Automation Framework",
    check: (ms) =>
      ms.some((m) => m.name.includes("Automation Framework") && m.status === "Completed"),
  },
  {
    key: "api",
    label: "API Testing",
    check: (ms) =>
      ms.some((m) => m.name.includes("Phase 1 Console") && m.status === "Completed"),
  },
  {
    key: "cicd",
    label: "CI/CD Pipeline",
    check: (ms, evidenceTypes) =>
      ms.some((m) => m.name.includes("Automation Framework") && m.status === "Completed") ||
      evidenceTypes.includes("pull-request"),
  },
  {
    key: "performance",
    label: "Performance Testing",
    check: (ms) =>
      ms.some((m) => m.name.includes("Performance Report") && m.status === "Completed"),
  },
  {
    key: "security",
    label: "Security & DB Testing",
    check: (ms) =>
      ms.some((m) => m.name.includes("Security") && m.status === "Completed"),
  },
  {
    key: "ai-testing",
    label: "AI/LLM Testing",
    check: (ms) =>
      ms.some((m) => m.name.includes("AI/LLM") && m.status === "Completed"),
  },
  {
    key: "documentation",
    label: "Documentation",
    check: (_ms, _evidenceTypes, logCount) =>
      logCount >= 3,
  },
  {
    key: "resume",
    label: "Resume & LinkedIn",
    check: (ms) =>
      ms.some((m) => m.name.includes("Portfolio") && m.status === "Completed"),
  },
  {
    key: "interviews",
    label: "Mock Interviews",
    check: () => false,
  },
];

export default async function MilestonesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roadmap = await prisma.roadmap.findFirst({
    where: { ownerId: session.user.id, active: true },
  });

  if (!roadmap) redirect("/dashboard");

  const [milestones, phases, weeks, evidenceItems, logCount] = await Promise.all([
    prisma.milestone.findMany({
      where: { roadmapId: roadmap.id },
      include: {
        evidence: {
          where: { ownerId: session.user.id },
          select: {
            id: true,
            title: true,
            type: true,
            url: true,
            storageKey: true,
            fileName: true,
            mimeType: true,
            fileSize: true,
            description: true,
          },
        },
      },
      orderBy: { targetWeekStart: "asc" },
    }),
    prisma.phase.findMany({
      where: { roadmapId: roadmap.id },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.week.findMany({
      where: { roadmapId: roadmap.id },
      select: { id: true, targetIndex: true },
      orderBy: { targetIndex: "asc" },
    }),
    prisma.evidenceItem.findMany({
      where: { ownerId: session.user.id },
      select: { type: true },
    }),
    prisma.learningLog.count({ where: { ownerId: session.user.id } }),
  ]);

  const evidenceTypes = evidenceItems.map((e) => e.type);
  const portfolio = PORTFOLIO_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    completed: rule.check(milestones, evidenceTypes, logCount),
  }));

  const serialized = {
    milestones: milestones.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      targetWeekStart: m.targetWeekStart,
      targetWeekEnd: m.targetWeekEnd,
      status: m.status,
      phaseId: m.phaseId,
      evidence: m.evidence.map((e) => ({
        id: e.id,
        type: e.type,
        title: e.title,
        url: e.url,
        storageKey: e.storageKey,
        fileName: e.fileName,
        mimeType: e.mimeType,
        fileSize: e.fileSize,
        description: e.description,
      })),
    })),
    phases: phases.map((p) => ({
      id: p.id,
      name: p.name,
      orderIndex: p.orderIndex,
    })),
    weeks: weeks.map((w) => ({ id: w.id, targetIndex: w.targetIndex })),
    portfolio,
  };

  return (
    <AppShell>
      <MilestonesClient
        milestones={serialized.milestones}
        phases={serialized.phases}
        portfolio={serialized.portfolio}
        weeks={serialized.weeks}
      />
    </AppShell>
  );
}
