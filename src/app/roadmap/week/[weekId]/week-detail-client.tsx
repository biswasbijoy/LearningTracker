"use client";

import { useState, type FormEvent } from "react";
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
  Loader2,
  Download,
  Eye,
  File,
  CheckCircle2,
  PlayCircle,
  Circle,
  Target,
  Calendar,
  Lightbulb,
  ArrowRight,
  Trophy,
  History,
  Save,
  StickyNote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { WeekDetail } from "@/types";

interface WeekDetailProps {
  week: WeekDetail;
  prevWeek: { id: string; targetIndex: number } | null;
  nextWeek: { id: string; targetIndex: number } | null;
}

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle2; label: string; active: string; inactive: string; border: string }> = {
  "Not Started": {
    icon: Circle,
    label: "Not Started",
    active: "border-neutral-400 bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200",
    inactive: "border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800/50",
    border: "border-l-neutral-400",
  },
  "In Progress": {
    icon: PlayCircle,
    label: "In Progress",
    active: "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    inactive: "border-neutral-200 text-neutral-500 hover:bg-sky-50/50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-sky-950/30",
    border: "border-l-sky-500",
  },
  Completed: {
    icon: CheckCircle2,
    label: "Completed",
    active: "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    inactive: "border-neutral-200 text-neutral-500 hover:bg-green-50/50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-green-950/30",
    border: "border-l-green-500",
  },
  Blocked: {
    icon: AlertTriangle,
    label: "Blocked",
    active: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    inactive: "border-neutral-200 text-neutral-500 hover:bg-amber-50/50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-amber-950/30",
    border: "border-l-amber-500",
  },
};

export function WeekDetailClient({ week, prevWeek, nextWeek }: WeekDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(week.status);
  const [savedNotes, setSavedNotes] = useState(week.notes ?? "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [logText, setLogText] = useState("");
  const [logDifficulty, setLogDifficulty] = useState("");
  const [logInsight, setLogInsight] = useState("");
  const [logNextAction, setLogNextAction] = useState("");
  const [logTags, setLogTags] = useState<string[]>([]);
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evTitle, setEvTitle] = useState("");
  const [evUrl, setEvUrl] = useState("");
  const [evType, setEvType] = useState("url");
  const [evDescription, setEvDescription] = useState("");
  const [evSubmitting, setEvSubmitting] = useState(false);
  const [evError, setEvError] = useState<string | null>(null);
  const [evFile, setEvFile] = useState<File | null>(null);

  const activeStatus = STATUS_STYLES[status] ?? STATUS_STYLES["Not Started"];
  const StatusIcon = activeStatus.icon;

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
    } catch {
      setSaveMessage("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmedComplete() {
    await saveProgress("Completed");
  }

  async function addEvidence(e: FormEvent) {
    e.preventDefault();
    setEvSubmitting(true);
    setEvError(null);
    try {
      let storageKey: string | null = null;
      let fileName: string | null = null;
      let mimeType: string | null = null;
      let fileSize: number | null = null;

      if (evFile) {
        const fd = new FormData();
        fd.set("file", evFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || "File upload failed");
        }
        const uploadData = await uploadRes.json();
        storageKey = uploadData.storageKey;
        fileName = uploadData.fileName;
        mimeType = uploadData.mimeType;
        fileSize = uploadData.fileSize;
      }

      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: week.id,
          title: evTitle,
          url: evUrl || null,
          type: evType,
          storageKey,
          fileName,
          mimeType,
          fileSize,
          description: evDescription || null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save evidence");
      }
      setShowAddEvidence(false);
      setEvTitle("");
      setEvUrl("");
      setEvType("url");
      setEvDescription("");
      setEvFile(null);
      setEvError(null);
      router.refresh();
    } catch (err) {
      setEvError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setEvSubmitting(false);
    }
  }

  const ALL_TAGS = [
    "risk", "framework", "API", "SQL", "CI/CD", "performance",
    "security", "AI QA", "communication", "interview",
  ];

  async function addLearningLog(e: FormEvent) {
    e.preventDefault();
    setLogSubmitting(true);
    setLogError(null);
    try {
      const res = await fetch("/api/learning-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: week.id,
          learnedText: logText,
          difficultyText: logDifficulty || null,
          insightText: logInsight || null,
          nextAction: logNextAction || null,
          tags: logTags,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Failed to save reflection");
      }
      setShowAddLog(false);
      setLogText("");
      setLogDifficulty("");
      setLogInsight("");
      setLogNextAction("");
      setLogTags([]);
      router.refresh();
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLogSubmitting(false);
    }
  }

  function toggleLogTag(tag: string) {
    setLogTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function deleteEvidence(id: string) {
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch {
      console.error("Delete failed");
    }
  }

  const statusBarColor = status === "Completed" ? "bg-green-500"
    : status === "In Progress" ? "bg-sky-500"
    : status === "Blocked" ? "bg-amber-500"
    : "bg-neutral-300 dark:bg-neutral-600";

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
        <Link href="/roadmap" className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
          Roadmap
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-neutral-900 dark:text-neutral-50">
          Week {week.targetIndex}
        </span>
      </nav>

      <div className={`rounded-xl border-l-4 bg-gradient-to-r ${statusBarColor} from-white to-white p-6 shadow-md dark:from-neutral-900 dark:to-neutral-900`}
        style={{ borderLeftColor: activeStatus.border.replace("border-l-", "#") }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/roadmap"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              aria-label="Back to roadmap"
            >
              <ArrowLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  Week {week.targetIndex}
                </h1>
                <Badge variant={({ "Not Started": "notStarted", "In Progress": "inProgress", Completed: "completed", Blocked: "blocked" } as const)[status] ?? "default"}>
                  {status}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {week.focusArea} · Phase: {week.phase.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {prevWeek && (
              <Link href={`/roadmap/week/${prevWeek.id}`}>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Week {prevWeek.targetIndex}
                </Button>
              </Link>
            )}
            {nextWeek && (
              <Link href={`/roadmap/week/${nextWeek.id}`}>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  Week {nextWeek.targetIndex}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{week.focusArea}</CardTitle>
              </div>
              <CardDescription>Month {week.monthNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Weekday Tasks
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {week.weekdayTasks}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div className="mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Weekend Milestone
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {week.weekendMilestone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Learning Log</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddLog(true)} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Reflect
                </Button>
              </div>
              <CardDescription>Reflect on what you learned this week</CardDescription>
            </CardHeader>
            <CardContent>
              {week.learningLogs.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No reflections yet</p>
                  <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                    Click the button above to write your first reflection
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {week.learningLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-neutral-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                            {log.learnedText}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs">
                            {log.difficultyText && (
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="h-3 w-3" />
                                {log.difficultyText}
                              </span>
                            )}
                            {log.insightText && (
                              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                <Lightbulb className="h-3 w-3" />
                                {log.insightText}
                              </span>
                            )}
                            {log.nextAction && (
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <ArrowRight className="h-3 w-3" />
                                {log.nextAction}
                              </span>
                            )}
                          </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">Evidence</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddEvidence(true)} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <CardDescription>Links to your work and deliverables</CardDescription>
            </CardHeader>
            <CardContent>
              {week.evidenceItems.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                    <LinkIcon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No evidence yet</p>
                  <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                    Add links or files to showcase your work
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {week.evidenceItems.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {ev.storageKey ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                            <File className="h-4 w-4 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                            <LinkIcon className="h-4 w-4 text-blue-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {ev.title}
                          </p>
                          {ev.storageKey ? (
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="truncate text-xs text-neutral-400">{ev.fileName}</span>
                              <span className="text-xs text-neutral-300 dark:text-neutral-600">·</span>
                              <a
                                href={`/api/files/${ev.storageKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </a>
                              <a
                                href={`/api/files/${ev.storageKey}?download=true`}
                                className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </a>
                            </div>
                          ) : ev.url ? (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {ev.url}
                            </a>
                          ) : null}
                          <div className="mt-0.5 flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                              {ev.type}
                            </Badge>
                            {ev.description && (
                              <span className="text-xs text-neutral-400">{ev.description}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvidence(ev.id)}
                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
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
          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-violet-400" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                <CardTitle className="text-lg">Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(STATUS_STYLES).map(([key, s]) => {
                const Icon = s.icon;
                const isActive = status === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateStatus(key)}
                    disabled={saving}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive
                        ? `${s.active} shadow-sm`
                        : `${s.inactive}`
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "" : "text-neutral-400"}`} />
                    <span>{s.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs opacity-60">Active</span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-400" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {savedNotes && (
                <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Saved notes
                  </p>
                  <p className="text-sm whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                    {savedNotes}
                  </p>
                </div>
              )}
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaveMessage(null);
                }}
                rows={4}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-blue-600 dark:focus:bg-neutral-800 dark:focus:ring-blue-900"
                placeholder="Add notes or blockers..."
              />
              <Button
                onClick={() => saveProgress()}
                size="sm"
                className="mt-2 w-full gap-1"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save notes"}
              </Button>
              {saveMessage && (
                <p
                  className={`mt-2 text-center text-sm ${
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
            <Card className="overflow-hidden shadow-md">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-rose-400" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-pink-500" />
                  <CardTitle className="text-lg">Milestone</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-pink-100 bg-pink-50 p-3 dark:border-pink-900 dark:bg-pink-950">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {week.milestone.name}
                  </p>
                  <Badge variant="outline" className="mt-2 border-pink-200 text-pink-600 dark:border-pink-800 dark:text-pink-400">
                    {week.milestone.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {week.statusHistory.length > 0 && (
            <Card className="overflow-hidden shadow-md">
              <div className="h-1.5 bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-500" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-lg">History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {week.statusHistory.slice(0, 5).map((h, i) => (
                    <div key={h.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          h.toStatus === "Completed" ? "border-green-400 bg-green-50 dark:bg-green-950"
                            : h.toStatus === "Blocked" ? "border-amber-400 bg-amber-50 dark:bg-amber-950"
                            : h.toStatus === "In Progress" ? "border-sky-400 bg-sky-50 dark:bg-sky-950"
                            : "border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800"
                        }`}>
                          <div className={`h-2 w-2 rounded-full ${
                            h.toStatus === "Completed" ? "bg-green-500"
                              : h.toStatus === "Blocked" ? "bg-amber-500"
                              : h.toStatus === "In Progress" ? "bg-sky-500"
                              : "bg-neutral-400"
                          }`} />
                        </div>
                        {i < Math.min(week.statusHistory.length, 5) - 1 && (
                          <div className="w-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="font-medium">{h.fromStatus ?? "—"}</span>
                          <span className="mx-1 text-neutral-300 dark:text-neutral-600">→</span>
                          <span className="font-medium">{h.toStatus}</span>
                        </p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          {new Date(h.changedAt).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showAddLog} onOpenChange={setShowAddLog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Write reflection
            </DialogTitle>
            <DialogDescription>What did you learn this week?</DialogDescription>
          </DialogHeader>
          <form onSubmit={addLearningLog} className="space-y-4">
            <div>
              <label htmlFor="log-text" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                What did you learn?
              </label>
              <textarea
                id="log-text"
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                required
                rows={3}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-blue-600 dark:focus:bg-neutral-800 dark:focus:ring-blue-900"
                placeholder="I learned about..."
              />
            </div>
            <div>
              <label htmlFor="log-difficulty" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Difficulty
              </label>
              <input
                id="log-difficulty"
                value={logDifficulty}
                onChange={(e) => setLogDifficulty(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-amber-600 dark:focus:bg-neutral-800 dark:focus:ring-amber-900"
                placeholder="e.g. Challenging but manageable"
              />
            </div>
            <div>
              <label htmlFor="log-insight" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Insight
              </label>
              <textarea
                id="log-insight"
                value={logInsight}
                onChange={(e) => setLogInsight(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-purple-600 dark:focus:bg-neutral-800 dark:focus:ring-purple-900"
                placeholder="Any key insight or realization"
              />
            </div>
            <div>
              <label htmlFor="log-next" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Next action
              </label>
              <input
                id="log-next"
                value={logNextAction}
                onChange={(e) => setLogNextAction(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-green-600 dark:focus:bg-neutral-800 dark:focus:ring-green-900"
                placeholder="What will you do next?"
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleLogTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      logTags.includes(tag)
                        ? "bg-neutral-900 text-neutral-50 shadow-sm dark:bg-neutral-50 dark:text-neutral-900"
                        : "border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {logError && (
              <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400" role="alert">{logError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddLog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={logSubmitting} className="gap-1">
                {logSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {logSubmitting ? "Saving..." : "Save reflection"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddEvidence} onOpenChange={setShowAddEvidence}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-emerald-500" />
              Add evidence
            </DialogTitle>
            <DialogDescription>Link to your work or deliverables for this week.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addEvidence} className="space-y-4">
            <div>
              <label htmlFor="ev-title" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Title
              </label>
              <input
                id="ev-title"
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                placeholder="What did you create?"
              />
            </div>
            <div>
              <label htmlFor="ev-type" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Type
              </label>
              <select
                id="ev-type"
                value={evType}
                onChange={(e) => {
                  setEvType(e.target.value);
                  if (e.target.value !== "file") setEvFile(null);
                }}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
              >
                <option value="url">URL</option>
                <option value="repository">Repository</option>
                <option value="pull-request">Pull Request</option>
                <option value="report">Report</option>
                <option value="screenshot">Screenshot</option>
                <option value="documentation">Documentation</option>
                <option value="file">File upload</option>
                <option value="other">Other</option>
              </select>
            </div>
            {evType === "file" ? (
              <div key="file-input">
                <label htmlFor="ev-file" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  File
                </label>
                <input
                  id="ev-file"
                  type="file"
                  onChange={(e) => setEvFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300 dark:hover:file:bg-emerald-900"
                />
                <p className="mt-1 text-xs text-neutral-500">Max 50 MB</p>
              </div>
            ) : (
              <div key="url-input">
                <label htmlFor="ev-url" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  URL
                </label>
                <input
                  id="ev-url"
                  type="url"
                  value={evUrl}
                  onChange={(e) => setEvUrl(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                  placeholder="https://github.com/..."
                />
              </div>
            )}
            <div>
              <label htmlFor="ev-description" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Description
              </label>
              <textarea
                id="ev-description"
                value={evDescription}
                onChange={(e) => setEvDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder-neutral-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:placeholder-neutral-500 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                placeholder="Optional notes about this evidence"
              />
            </div>
            {evError && (
              <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400" role="alert">{evError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddEvidence(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={evSubmitting} className="gap-1">
                {evSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {evSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          <Card className="mx-4 max-w-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
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
