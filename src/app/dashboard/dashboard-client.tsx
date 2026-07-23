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
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  BookOpen,
  Code,
  Shield,
  Sparkles,
  ChevronRight,
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

const PHASE_STYLES = [
  {
    label: "text-primary",
    bar: "bg-gradient-to-r from-primary to-primary-light",
    icon: BookOpen,
    border: "border-l-primary",
  },
  {
    label: "text-secondary",
    bar: "bg-gradient-to-r from-secondary to-sky-400",
    icon: Code,
    border: "border-l-secondary",
  },
  {
    label: "text-accent",
    bar: "bg-gradient-to-r from-accent to-accent-light",
    icon: Shield,
    border: "border-l-accent",
  },
  {
    label: "text-warning",
    bar: "bg-gradient-to-r from-warning to-amber-400",
    icon: Sparkles,
    border: "border-l-warning",
  },
];

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
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Dashboard
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {primaryLanguage
            ? `${primaryLanguage} · SQA Engineer Roadmap`
            : "SQA Engineer Roadmap"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-dark dark:text-primary-light">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatPercentage(overallCompletion)}</div>
            <Progress
              value={overallCompletion}
              className="mt-2 h-2.5 bg-neutral-200 dark:bg-neutral-700"
              indicatorClassName="bg-gradient-to-r from-primary to-secondary"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {completed} of {totalWeeks} {pluralize(totalWeeks, "week")} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-accent shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">
              Status Overview
            </CardTitle>
            <Layers className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Completed</span>
                <span className="font-medium text-accent">{completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">In Progress</span>
                <span className="font-medium text-secondary">{inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Not Started</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{notStarted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Blocked</span>
                <span className="font-medium text-warning">{blocked}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-secondary shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Next Roadmap Week</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            {currentWeek ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-secondary">
                    Week {currentWeek.targetIndex}
                  </span>
                  <StatusBadge status={currentWeek.status} />
                </div>
                <p className="mt-1 text-sm font-medium leading-tight text-neutral-700 dark:text-neutral-300">
                  {currentWeek.focusArea}
                </p>
                <Link href={`/roadmap/week/${currentWeek.weekId}`}>
                  <Button size="sm" className="mt-3 w-full bg-gradient-to-r from-primary to-secondary text-white shadow-md transition-all hover:shadow-lg hover:brightness-110">
                    View this week
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                Roadmap complete!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-warning shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-warning">Learning Rhythm</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-neutral-500 dark:text-neutral-400">
              Weekdays: <span className="font-medium text-neutral-700 dark:text-neutral-300">1-2 hours</span>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Weekend: <span className="font-medium text-neutral-700 dark:text-neutral-300">4-6 hours</span>
            </p>
            <p className="mt-1 text-xs italic text-neutral-400 dark:text-neutral-500">
              Sunday: 30-min teach-back reflection
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-800 dark:text-neutral-200">
              Phase Progress
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400">
              Track your completion across each phase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {phaseProgress.map((phase, i) => {
              const ps = PHASE_STYLES[i] ?? PHASE_STYLES[0];
              const Icon = ps.icon;
              const completedPercent = formatPercentage(phase.percentage);
              return (
                <div key={phase.phaseId}>
                  <div className="mb-1.5 flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${ps.border} bg-white shadow-sm dark:bg-neutral-900`}>
                      <Icon className={`h-4 w-4 ${ps.label}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${ps.label}`}>{phase.phaseName}</span>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          {phase.completed}/{phase.total} · {completedPercent}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={phase.percentage}
                    className="h-2.5 bg-neutral-200 dark:bg-neutral-700"
                    indicatorClassName={ps.bar}
                  />
                  <div className="mt-1 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
                    <span>{phase.completed} completed</span>
                    <span>{phase.total - phase.completed} remaining</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-neutral-800 dark:text-neutral-200">
              Blocked Weeks
              {blockedWeeks.length > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 text-xs font-bold text-warning">
                  {blockedWeeks.length}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400">
              Items that need attention to stay on track
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blockedWeeks.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">All clear!</p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">No blocked weeks. Keep up the great work!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedWeeks.map((bw) => (
                  <Link
                    key={bw.weekId}
                    href={`/roadmap/week/${bw.weekId}`}
                    className="group block"
                  >
                    <div className="rounded-lg border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/50 p-3 shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md dark:border-amber-800/60 dark:from-amber-950/50 dark:to-amber-950/30 dark:hover:border-amber-700">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 transition-colors group-hover:bg-amber-200 dark:bg-amber-900 dark:group-hover:bg-amber-800">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-800/60 dark:text-amber-200">
                              Week {bw.targetIndex}
                            </span>
                            <span className="text-xs text-amber-600/60 dark:text-amber-400/60">Blocked</span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {bw.focusArea}
                          </p>
                          {bw.notes && (
                            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                              {bw.notes}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-amber-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-amber-600" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
