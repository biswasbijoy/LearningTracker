"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CalendarDays,
  Tag,
  Layers,
} from "lucide-react";

interface LogEntry {
  id: string;
  entryDate: string;
  learnedText: string;
  difficultyText: string | null;
  insightText: string | null;
  nextAction: string | null;
  tags: string[];
  weekId: string | null;
  weekTargetIndex: number | null;
  weekFocusArea: string | null;
}

const ALL_TAGS = [
  "risk", "framework", "API", "SQL", "CI/CD", "performance",
  "security", "AI QA", "communication", "interview",
];

const PHASE_RANGES = [
  { label: "Phase 1: Foundations", value: "1-12", gradient: "from-indigo-500 to-blue-500", border: "border-l-indigo-400" },
  { label: "Phase 2: Automation", value: "13-24", gradient: "from-emerald-500 to-teal-500", border: "border-l-emerald-400" },
  { label: "Phase 3: Perf/Security/DB", value: "25-36", gradient: "from-violet-500 to-purple-500", border: "border-l-violet-400" },
  { label: "Phase 4: AI + Portfolio", value: "37-52", gradient: "from-amber-500 to-orange-500", border: "border-l-amber-400" },
];

const PHASE_WEEK_MAP: Record<string, { label: string; gradient: string; border: string }> = {};
for (const p of PHASE_RANGES) {
  const [start, end] = p.value.split("-").map(Number);
  for (let i = start; i <= end; i++) {
    PHASE_WEEK_MAP[i] = { label: p.label, gradient: p.gradient, border: p.border };
  }
}

function getWeekPhase(weekNum: number | null) {
  if (!weekNum) return null;
  return PHASE_WEEK_MAP[weekNum] ?? null;
}

export function LearningLogClient({ logs }: { logs: LogEntry[] }) {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let result = [...logs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.learnedText.toLowerCase().includes(q) ||
          l.insightText?.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (tagFilter) {
      result = result.filter((l) => l.tags.includes(tagFilter));
    }
    if (phaseFilter !== "all") {
      const [start, end] = phaseFilter.split("-").map(Number);
      result = result.filter((l) => {
        if (!l.weekTargetIndex) return false;
        return l.weekTargetIndex >= start && l.weekTargetIndex <= end;
      });
    }
    return result;
  }, [logs, search, tagFilter, phaseFilter]);

  const grouped = useMemo(() => {
    const map = new Map<number, { focusArea: string; weekId: string | null; logs: LogEntry[] }>();
    for (const log of filtered) {
      const weekNum = log.weekTargetIndex ?? 0;
      if (!map.has(weekNum)) {
        map.set(weekNum, { focusArea: log.weekFocusArea ?? "", weekId: log.weekId, logs: [] });
      }
      map.get(weekNum)!.logs.push(log);
    }
    return new Map([...map.entries()].sort((a, b) => b[0] - a[0]));
  }, [filtered]);

  const stats = useMemo(() => {
    const total = logs.length;
    const tags = new Set<string>();
    const weeks = new Set<number>();
    let daysWithEntry = 0;
    const dates = new Set<string>();
    for (const l of logs) {
      l.tags.forEach((t) => tags.add(t));
      if (l.weekTargetIndex) weeks.add(l.weekTargetIndex);
      dates.add(new Date(l.entryDate).toLocaleDateString());
    }
    daysWithEntry = dates.size;
    return { total, tags: tags.size, weeks: weeks.size, days: daysWithEntry };
  }, [logs]);

  function toggleWeek(weekNum: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
  }

  const allExpanded = search !== "" || tagFilter !== null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Learning Log
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Your reflections and insights throughout the journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</span>
          </div>
          <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Days</span>
          </div>
          <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.days}</p>
        </div>
        <div className="rounded-lg border border-violet-100 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Weeks</span>
          </div>
          <p className="mt-1 text-xl font-bold text-violet-700 dark:text-violet-300">{stats.weeks}</p>
        </div>
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Tags</span>
          </div>
          <p className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-300">{stats.tags}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search reflections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pl-9 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
            aria-label="Search learning log"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          aria-label="Filter by phase"
        >
          <option value="all">All phases</option>
          {PHASE_RANGES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              tagFilter === tag
                ? "bg-neutral-900 text-neutral-50 shadow-sm dark:bg-neutral-50 dark:text-neutral-900"
                : "border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            }`}
          >
            {tagFilter === tag && <Sparkles className="mr-1 inline h-3 w-3" />}
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {grouped.size === 0 ? (
          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <CardContent className="flex flex-col items-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-base font-semibold text-neutral-600 dark:text-neutral-400">No reflections yet</p>
              <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                {search || tagFilter || phaseFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start logging your learning journey!"}
              </p>
              {!search && !tagFilter && phaseFilter === "all" && (
                <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
                  Go to any week and click &quot;Write reflection&quot;
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          [...grouped.entries()].map(([weekNum, group]) => {
            const isExpanded = expandedWeeks.has(weekNum) || allExpanded;
            const phase = getWeekPhase(weekNum);
            const latestDate = group.logs.reduce((latest, l) => {
              const d = new Date(l.entryDate);
              return d > latest ? d : latest;
            }, new Date(0));

            return (
              <Card key={weekNum} className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                <div className={`h-1.5 ${phase?.gradient ?? "bg-neutral-300 dark:bg-neutral-600"}`} />
                <button
                  onClick={() => toggleWeek(weekNum)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    phase ? "bg-white shadow-sm dark:bg-neutral-800" : "bg-neutral-100 dark:bg-neutral-800"
                  }`}>
                    <BookOpen className={`h-4 w-4 ${phase ? "text-blue-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {weekNum === 0 ? "Unassigned" : `Week ${weekNum}`}
                      </p>
                      {weekNum > 0 && group.weekId && (
                        <Link
                          href={`/roadmap/week/${group.weekId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
                        >
                          View week →
                        </Link>
                      )}
                    </div>
                    {group.focusArea && (
                      <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {group.focusArea}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {group.logs.length} {group.logs.length === 1 ? "entry" : "entries"}
                      </p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Latest: {latestDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex sm:hidden items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {group.logs.length}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800">
                    {group.logs.map((log) => (
                      <div
                        key={log.id}
                        className="border-b border-neutral-50 p-4 transition-colors hover:bg-neutral-50/50 last:border-b-0 dark:border-neutral-800/50 dark:hover:bg-neutral-800/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                            <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                                {log.learnedText}
                              </p>
                              <span className="shrink-0 whitespace-nowrap text-[11px] text-neutral-400 dark:text-neutral-500">
                                {new Date(log.entryDate).toLocaleDateString(undefined, {
                                  month: "short", day: "numeric"
                                })}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                              {log.difficultyText && (
                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                  <AlertTriangle className="h-3 w-3" />
                                  {log.difficultyText}
                                </span>
                              )}
                              {log.insightText && (
                                <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                  <Lightbulb className="h-3 w-3" />
                                  {log.insightText}
                                </span>
                              )}
                              {log.nextAction && (
                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <ArrowRight className="h-3 w-3" />
                                  {log.nextAction}
                                </span>
                              )}
                            </div>
                            {log.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {log.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-[10px]">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
