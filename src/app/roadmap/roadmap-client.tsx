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

function StatusIcon({ status, className }: { status: string; className?: string }) {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className={`h-4 w-4 text-green-500 ${className ?? ""}`} />;
    case "In Progress":
      return <PlayCircle className={`h-4 w-4 text-blue-500 ${className ?? ""}`} />;
    case "Blocked":
      return <AlertCircle className={`h-4 w-4 text-amber-500 ${className ?? ""}`} />;
    default:
      return <Circle className={`h-4 w-4 text-neutral-300 ${className ?? ""}`} />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const variant = status
    .toLowerCase()
    .replace(/\s+/g, "") as "notStarted" | "inProgress" | "completed" | "blocked";
  return <Badge variant={variant}>{status}</Badge>;
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

    if (statusFilter !== "all") {
      result = result.filter((w) => w.status === statusFilter);
    }

    if (phaseFilter !== "all") {
      const phase = phases.find((p) => p.id === phaseFilter);
      if (phase) {
        result = result.filter((w) => w.phaseName === phase.name);
      }
    }

    if (showBlockedOnly) {
      result = result.filter((w) => w.status === "Blocked");
    }

    if (showMilestonesOnly) {
      result = result.filter((w) => MILESTONE_WEEKS.has(w.targetIndex));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "month":
          return a.monthNumber - b.monthNumber;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return a.targetIndex - b.targetIndex;
      }
    });

    return result;
  }, [weeks, search, statusFilter, phaseFilter, showMilestonesOnly, showBlockedOnly, sortBy, phases]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roadmap</h1>
        <p className="text-neutral-500">All 52 weeks of the SQA learning journey</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search focus areas, tasks, milestones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
            aria-label="Search roadmap"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
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
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            aria-label="Filter by phase"
          >
            <option value="all">All phases</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                Phase {p.orderIndex}: {p.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "index" | "month" | "status")}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
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
          >
            Milestones
          </Button>
          <Button
            variant={showBlockedOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => setShowBlockedOnly(!showBlockedOnly)}
          >
            Blocked
          </Button>
        </div>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((week) => (
          <Link key={week.id} href={`/roadmap/week/${week.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={week.status} />
                    <span className="text-sm text-neutral-500">Week {week.targetIndex}</span>
                  </div>
                  <StatusBadge status={week.status} />
                </div>
                <CardTitle className="mt-1 text-base leading-snug">
                  {week.focusArea}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-xs text-neutral-500">
                  Phase {week.phaseOrderIndex}: {week.phaseName}
                </div>
                <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {week.weekendMilestone}
                </p>
                {week.notes && (
                  <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
                    Note: {week.notes}
                  </p>
                )}
                {(week.evidenceCount > 0 || week.reflectionCount > 0) && (
                  <div className="mt-2 flex gap-3 text-xs text-neutral-400">
                    {week.evidenceCount > 0 && (
                      <span className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        {week.evidenceCount}
                      </span>
                    )}
                    {week.reflectionCount > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {week.reflectionCount}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-2 md:hidden">
        {filtered.map((week) => (
          <Link key={week.id} href={`/roadmap/week/${week.id}`}>
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <StatusIcon status={week.status} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Week {week.targetIndex}</span>
                  <StatusBadge status={week.status} />
                </div>
                <p className="mt-0.5 text-sm font-medium leading-snug">
                  {week.focusArea}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
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
          <p className="text-neutral-500">No weeks match your filters.</p>
        </div>
      )}
    </div>
  );
}
