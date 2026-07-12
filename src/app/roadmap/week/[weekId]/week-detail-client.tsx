"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Link as LinkIcon,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import type { WeekDetail } from "@/types";

interface WeekDetailProps {
  week: WeekDetail;
  prevWeek: { id: string; targetIndex: number } | null;
  nextWeek: { id: string; targetIndex: number } | null;
}

export function WeekDetailClient({ week, prevWeek, nextWeek }: WeekDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(week.status);
  const [savedNotes, setSavedNotes] = useState(week.notes ?? "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const statusColors: Record<string, string> = {
    "Not Started": "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Blocked: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  async function updateStatus(newStatus: string) {
    if (newStatus === "Completed" && week.evidenceItems.length === 0 && week.learningLogs.length === 0) {
      setShowConfirm(true);
      return;
    }
    await saveProgress(newStatus);
  }

  async function saveProgress(newStatus?: string) {
    setSaving(true);
    setSaveMessage(null);
    const noteToSave = [savedNotes, notes.trim()].filter(Boolean).join("\n\n");
    try {
      const res = await fetch(`/api/weeks/${week.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus ?? status,
          notes: noteToSave || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setStatus(data.progress.status);
      setSavedNotes(data.progress.notes ?? "");
      setNotes("");
      setShowConfirm(false);
      setSaveMessage("Notes saved.");
      router.refresh();
    } catch (err) {
      console.error("Save failed", err);
      setSaveMessage("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmedComplete() {
    await saveProgress("Completed");
  }

  async function deleteEvidence(id: string) {
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  const breadcrumb = (
    <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
      <Link href="/roadmap" className="hover:text-neutral-700 dark:hover:text-neutral-300">
        Roadmap
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-neutral-900 dark:text-neutral-50">
        Week {week.targetIndex}
      </span>
    </nav>
  );

  return (
    <div className="space-y-6">
      {breadcrumb}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Back to roadmap"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Week {week.targetIndex}</h1>
            <p className="text-sm text-neutral-500">Phase {week.phase.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {prevWeek && (
            <Link href={`/roadmap/week/${prevWeek.id}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Week {prevWeek.targetIndex}
              </Button>
            </Link>
          )}
          {nextWeek && (
            <Link href={`/roadmap/week/${nextWeek.id}`}>
              <Button variant="outline" size="sm">
                Week {nextWeek.targetIndex}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{week.focusArea}</CardTitle>
              <CardDescription>Month {week.monthNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-neutral-500">Weekday Tasks</h3>
                <p className="text-sm">{week.weekdayTasks}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-neutral-500">Weekend Milestone</h3>
                <p className="text-sm">{week.weekendMilestone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Log
              </CardTitle>
              <CardDescription>Reflect on what you learned this week</CardDescription>
            </CardHeader>
            <CardContent>
              {week.learningLogs.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-neutral-500">No reflections yet.</p>
                  <Link href={`/learning-log?weekId=${week.id}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-1 h-4 w-4" />
                      Write reflection
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {week.learningLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                    >
                      <p className="text-sm">{log.learnedText}</p>
                      {log.difficultyText && (
                        <p className="mt-1 text-xs text-neutral-500">
                          Difficulty: {log.difficultyText}
                        </p>
                      )}
                      {log.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {log.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Evidence
              </CardTitle>
              <CardDescription>Links to your work and deliverables</CardDescription>
            </CardHeader>
            <CardContent>
              {week.evidenceItems.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-neutral-500">No evidence attached.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="mr-1 h-4 w-4" />
                    Add evidence
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {week.evidenceItems.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{ev.title}</p>
                        {ev.url && (
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {ev.url}
                          </a>
                        )}
                        <p className="text-xs text-neutral-400">{ev.type}</p>
                      </div>
                      <button
                        onClick={() => deleteEvidence(ev.id)}
                        className="rounded p-1 text-neutral-400 hover:text-red-500"
                        aria-label={`Delete ${ev.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Not Started", "In Progress", "Completed", "Blocked"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={saving}
                  className={`w-full rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    status === s
                      ? `${statusColors[s]} border-current`
                      : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedNotes && (
                <div className="mb-3 rounded-md bg-neutral-100 p-3 text-sm whitespace-pre-wrap dark:bg-neutral-800">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Saved notes
                  </p>
                  {savedNotes}
                </div>
              )}
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaveMessage(null);
                }}
                rows={4}
                className="w-full rounded-md border border-neutral-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Add notes or blockers..."
              />
              <Button
                onClick={() => saveProgress()}
                size="sm"
                className="mt-2 w-full"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save notes"}
              </Button>
              {saveMessage && (
                <p
                  className={`mt-2 text-sm ${
                    saveMessage === "Notes saved."
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  role="status"
                >
                  {saveMessage}
                </p>
              )}
            </CardContent>
          </Card>

          {week.milestone && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4" />
                  Related Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{week.milestone.name}</p>
                <Badge variant="outline" className="mt-1">
                  {week.milestone.status}
                </Badge>
              </CardContent>
            </Card>
          )}

          {week.statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {week.statusHistory.slice(0, 5).map((h) => (
                  <div key={h.id} className="text-xs text-neutral-500">
                    <span className="font-medium">{h.fromStatus ?? "—"}</span>
                    {" → "}
                    <span className="font-medium">{h.toStatus}</span>
                    <span className="ml-1 text-neutral-400">
                      {new Date(h.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          <Card className="mx-4 max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Complete without evidence?
              </CardTitle>
              <CardDescription>
                This week has no reflections or evidence attached. You can still mark it complete, but consider adding
                learning evidence for your portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmedComplete}>
                Complete anyway
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
}
