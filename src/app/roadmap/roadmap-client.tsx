"use client";

import { useState, useMemo } from "react";

const MILESTONE_WEEKS = new Set([11, 12, 13, 23, 24, 26, 29, 30, 35, 36, 41, 43, 44, 46, 52]);
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronRight,
  BookOpen,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Circle,
  AlertTriangle,
  Flag,
} from "lucide-react";
import Link from "next/link";

interface WeekItem {
  id: string;
  targetIndex: number;
  monthNumber: number;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
  phaseName: string;
  phaseOrderIndex: number;
  status: string;
  notes: string | null;
  evidenceCount: number;
  reflectionCount: number;
}

interface PhaseFilter {
  id: string;
  name: string;
  orderIndex: number;
}

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "notStarted" | "inProgress" | "completed" | "blocked"> = {
    "Not Started": "notStarted",
    "In Progress": "inProgress",
    Completed: "completed",
    Blocked: "blocked",
  };
  return <Badge variant={variantMap[status] ?? "default"}>{status}</Badge>;
}

export function RoadmapClient({
  weeks,
  phases,
}: {
  weeks: WeekItem[];
  phases: PhaseFilter[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"index" | "month" | "status">("index");

  const filtered = useMemo(() => {
    let result = [...weeks];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.focusArea.toLowerCase().includes(q) ||
          w.weekdayTasks.toLowerCase().includes(q) ||
          w.weekendMilestone.toLowerCase().includes(q) ||
          w.notes?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((w) => w.status === statusFilter);
    if (phaseFilter !== "all") {
      const phase = phases.find((p) => p.id === phaseFilter);
      if (phase) result = result.filter((w) => w.phaseName === phase.name);
    }
    if (showBlockedOnly) result = result.filter((w) => w.status === "Blocked");
    if (showMilestonesOnly) result = result.filter((w) => MILESTONE_WEEKS.has(w.targetIndex));
    result.sort((a, b) => {
      switch (sortBy) {
        case "month": return a.monthNumber - b.monthNumber;
        case "status": return a.status.localeCompare(b.status);
        default: return a.targetIndex - b.targetIndex;
      }
    });
    return result;
  }, [weeks, search, statusFilter, phaseFilter, showMilestonesOnly, showBlockedOnly, sortBy, phases]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Roadmap
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">All 52 weeks of the SQA learning journey</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search focus areas, tasks, milestones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
             className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pl-9 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
            aria-label="Search roadmap"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            aria-label="Filter by phase"
          >
            <option value="all">All phases</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>Phase {p.orderIndex}: {p.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "index" | "month" | "status")}
            className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            aria-label="Sort by"
          >
            <option value="index">Sort: Week #</option>
            <option value="month">Sort: Month</option>
            <option value="status">Sort: Status</option>
          </select>
          <Button
            variant={showMilestonesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMilestonesOnly(!showMilestonesOnly)}
            className={`text-sm ${showMilestonesOnly ? "bg-gradient-to-r from-primary to-secondary text-white" : ""}`}
          >
            <Flag className="mr-1 h-3.5 w-3.5" />
            Milestones
          </Button>
          <Button
            variant={showBlockedOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => setShowBlockedOnly(!showBlockedOnly)}
            className="text-sm"
          >
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Blocked
          </Button>
        </div>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((week) => {
          const colorMap: Record<string, { icon: typeof CheckCircle2; iconColor: string; bg: string; borderColor: string }> = {
            Completed: {
              icon: CheckCircle2, iconColor: "text-green-600 dark:text-green-400",
              bg: "bg-gradient-to-br from-green-50 to-white dark:from-green-950/40 dark:to-neutral-900",
              borderColor: "#22c55e",
            },
            "In Progress": {
              icon: PlayCircle, iconColor: "text-sky-600 dark:text-sky-400",
              bg: "bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/40 dark:to-neutral-900",
              borderColor: "#0ea5e9",
            },
            Blocked: {
              icon: AlertCircle, iconColor: "text-amber-600 dark:text-amber-400",
              bg: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-neutral-900",
              borderColor: "#f59e0b",
            },
            "Not Started": {
              icon: Circle, iconColor: "text-neutral-400 dark:text-neutral-500",
              bg: "bg-white dark:bg-neutral-900",
              borderColor: "#a3a3a3",
            },
          };
          const st = colorMap[week.status] ?? colorMap["Not Started"];
          const Icon = st.icon;
          return (
            <Link key={week.id} href={`/roadmap/week/${week.id}`}>
              <Card
                className={`group h-full border-l-4 ${st.bg} shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
                style={{ borderLeftColor: st.borderColor }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${st.iconColor}`} />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Week {week.targetIndex}</span>
                    </div>
                    <StatusBadge status={week.status} />
                  </div>
                  <CardTitle className="mt-1 text-base leading-snug text-neutral-800 dark:text-neutral-200">
                    {week.focusArea}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Phase {week.phaseOrderIndex}: {week.phaseName}
                  </div>
                  <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {week.weekendMilestone}
                  </p>
                  {week.notes && (
                    <p className="mt-2 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-500">
                      Note: {week.notes}
                    </p>
                  )}
                  {(week.evidenceCount > 0 || week.reflectionCount > 0) && (
                    <div className="mt-3 flex gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                      {week.evidenceCount > 0 && (
                        <span className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" /> {week.evidenceCount}
                        </span>
                      )}
                      {week.reflectionCount > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {week.reflectionCount}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="space-y-2 md:hidden">
        {filtered.map((week) => (
          <Link key={week.id} href={`/roadmap/week/${week.id}`}>
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Week {week.targetIndex}</span>
                  <StatusBadge status={week.status} />
                </div>
                <p className="mt-0.5 text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-200">
                  {week.focusArea}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {week.phaseName} · Month {week.monthNumber}
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No weeks match your filters.</p>
        </div>
      )}
    </div>
  );
}
