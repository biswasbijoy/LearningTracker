"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";

interface LogEntry {
  id: string;
  entryDate: string;
  learnedText: string;
  difficultyText: string | null;
  insightText: string | null;
  nextAction: string | null;
  tags: string[];
  weekTargetIndex: number | null;
  weekFocusArea: string | null;
}

const ALL_TAGS = [
  "risk", "framework", "API", "SQL", "CI/CD", "performance",
  "security", "AI QA", "communication", "interview",
];

export function LearningLogClient({ logs }: { logs: LogEntry[] }) {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Log</h1>
          <p className="text-neutral-500">Your reflections and insights throughout the journey</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reflections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
            aria-label="Search learning log"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
          aria-label="Filter by phase"
        >
          <option value="all">All phases</option>
          <option value="1-12">Phase 1: Foundations</option>
          <option value="13-24">Phase 2: Automation</option>
          <option value="25-36">Phase 3: Perf/Security/DB</option>
          <option value="37-52">Phase 4: AI + Portfolio</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              tagFilter === tag
                ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <BookOpen className="mb-2 h-8 w-8 text-neutral-300" />
              <p className="text-sm text-neutral-500">No reflections yet.</p>
              <p className="text-xs text-neutral-400">
                Start logging your learning journey!
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((log) => (
            <Card key={log.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{log.learnedText}</CardTitle>
                    {log.weekTargetIndex && (
                      <CardDescription>
                        Week {log.weekTargetIndex}{log.weekFocusArea ? ` · ${log.weekFocusArea}` : ""}
                      </CardDescription>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {new Date(log.entryDate).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {log.difficultyText && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      Difficulty:
                    </span>{" "}
                    {log.difficultyText}
                  </p>
                )}
                {log.insightText && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      Insight:
                    </span>{" "}
                    {log.insightText}
                  </p>
                )}
                {log.nextAction && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      Next:
                    </span>{" "}
                    {log.nextAction}
                  </p>
                )}
                {log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
