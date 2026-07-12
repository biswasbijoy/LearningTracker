"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { formatPercentage, pluralize } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  totalWeeks: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  blocked: number;
  overallCompletion: number;
  phaseProgress: {
    phaseId: string;
    phaseName: string;
    total: number;
    completed: number;
    percentage: number;
    orderIndex: number;
  }[];
  currentWeek: {
    weekId: string;
    targetIndex: number;
    focusArea: string;
    weekdayTasks: string;
    weekendMilestone: string;
    status: string;
    lastNote: string | null;
  } | null;
  blockedWeeks: {
    weekId: string;
    targetIndex: number;
    focusArea: string;
    notes: string | null;
  }[];
  currentWeekOverride: number | null;
  customStartDate: string | null;
  primaryLanguage: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const variant = status
    .toLowerCase()
    .replace(/\s+/g, "") as "notStarted" | "inProgress" | "completed" | "blocked";
  return <Badge variant={variant}>{status}</Badge>;
}

export function DashboardClient({ summary }: { summary: DashboardData }) {
  const {
    totalWeeks,
    completed,
    inProgress,
    notStarted,
    blocked,
    overallCompletion,
    phaseProgress,
    currentWeek,
    blockedWeeks,
    primaryLanguage,
  } = summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-neutral-500">
          {primaryLanguage
            ? `${primaryLanguage} · SQA Engineer Roadmap`
            : "SQA Engineer Roadmap"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Trophy className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(overallCompletion)}</div>
            <Progress value={overallCompletion} className="mt-2" />
            <p className="mt-1 text-xs text-neutral-500">
              {completed} of {totalWeeks} {pluralize(totalWeeks, "week")} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status Overview</CardTitle>
            <BookOpen className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Completed</span>
                <span className="font-medium text-green-600 dark:text-green-400">{completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">In Progress</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Not Started</span>
                <span className="font-medium text-neutral-600 dark:text-neutral-400">{notStarted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Blocked</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">{blocked}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Roadmap Week</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            {currentWeek ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    Week {currentWeek.targetIndex}
                  </span>
                  <StatusBadge status={currentWeek.status} />
                </div>
                <p className="mt-1 text-sm font-medium leading-tight">
                  {currentWeek.focusArea}
                </p>
                <Link href={`/roadmap/week/${currentWeek.weekId}`}>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    View this week
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Roadmap complete!
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Rhythm</CardTitle>
            <Clock className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-neutral-500">
              Weekdays: <span className="font-medium text-neutral-900 dark:text-neutral-50">1-2 hours</span>
            </p>
            <p className="text-neutral-500">
              Weekend: <span className="font-medium text-neutral-900 dark:text-neutral-50">4-6 hours</span>
            </p>
            <p className="mt-1 text-xs italic text-neutral-400">
              Sunday: 30-min teach-back reflection
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phase Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {phaseProgress.map((phase) => (
              <div key={phase.phaseId}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{phase.phaseName}</span>
                  <span className="text-neutral-500">
                    {phase.completed} of {phase.total} ({formatPercentage(phase.percentage)})
                  </span>
                </div>
                <Progress value={phase.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blocked Weeks</CardTitle>
            <CardDescription>
              Items that need attention to stay on track
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blockedWeeks.length === 0 ? (
              <p className="py-4 text-center text-sm text-neutral-500">
                No blocked weeks. Keep up the great work!
              </p>
            ) : (
              <div className="space-y-3">
                {blockedWeeks.map((bw) => (
                  <div
                    key={bw.weekId}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          Week {bw.targetIndex}: {bw.focusArea}
                        </p>
                        {bw.notes && (
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            {bw.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
