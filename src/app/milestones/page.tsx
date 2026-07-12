import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roadmap = await prisma.roadmap.findFirst({
    where: { ownerId: session.user.id, active: true },
  });

  if (!roadmap) redirect("/dashboard");

  const milestones = await prisma.milestone.findMany({
    where: { roadmapId: roadmap.id },
    include: {
      phase: { select: { name: true, orderIndex: true } },
      evidence: {
        where: { ownerId: session.user.id },
        select: { id: true, title: true, type: true, url: true },
      },
    },
    orderBy: { targetWeekStart: "asc" },
  });

  const portfolioChecklist = [
    { label: "Automation Framework", key: "framework" },
    { label: "API Testing", key: "api" },
    { label: "CI/CD Pipeline", key: "cicd" },
    { label: "Performance Testing", key: "performance" },
    { label: "Security & DB Testing", key: "security" },
    { label: "AI/LLM Testing", key: "ai-testing" },
    { label: "Documentation", key: "documentation" },
    { label: "Resume & LinkedIn", key: "resume" },
    { label: "Mock Interviews", key: "interviews" },
  ];

  const phases = await prisma.phase.findMany({
    where: { roadmapId: roadmap.id },
    orderBy: { orderIndex: "asc" },
  });

  const milestonesByPhase = phases.map((phase) => ({
    phase,
    milestones: milestones.filter((m) => m.phaseId === phase.id),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Milestones & Portfolio</h1>
          <p className="text-neutral-500">Track your project milestones and portfolio readiness</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Readiness</CardTitle>
            <CardDescription>
              Complete these items to build a strong SQA portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioChecklist.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                >
                  <Circle className="h-4 w-4 shrink-0 text-neutral-300" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {milestonesByPhase.map(({ phase, milestones: phaseMilestones }) => {
          const completed = phaseMilestones.filter((m) => m.status === "Completed").length;
          const total = phaseMilestones.length;
          const percentage = total > 0 ? (completed / total) * 100 : 0;

          return (
            <Card key={phase.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Phase {phase.orderIndex}: {phase.name}
                </CardTitle>
                <CardDescription>
                  {completed} of {total} milestones completed
                </CardDescription>
                <Progress value={percentage} className="mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {phaseMilestones.length === 0 ? (
                  <p className="py-2 text-sm text-neutral-500">No milestones in this phase.</p>
                ) : (
                  phaseMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {m.status === "Completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-neutral-300" />
                            )}
                            <h3 className="text-sm font-medium">{m.name}</h3>
                            <Badge
                              variant={
                                m.status === "Completed"
                                  ? "completed"
                                  : m.status === "In Progress"
                                    ? "inProgress"
                                    : "notStarted"
                              }
                            >
                              {m.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-neutral-500">{m.description}</p>
                          <p className="mt-1 text-xs text-neutral-400">
                            Target: Weeks {m.targetWeekStart}–{m.targetWeekEnd}
                          </p>
                        </div>
                      </div>
                      {m.evidence.length > 0 && (
                        <div className="mt-3 space-y-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                          <p className="text-xs font-medium text-neutral-500">Evidence</p>
                          {m.evidence.map((ev) => (
                            <div key={ev.id} className="flex items-center gap-2 text-sm">
                              <span className="text-xs text-neutral-400">{ev.type}</span>
                              <span className="font-medium">{ev.title}</span>
                              {ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline"
                                >
                                  Link
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
