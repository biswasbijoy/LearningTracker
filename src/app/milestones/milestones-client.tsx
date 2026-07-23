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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Target,
  Code,
  Shield,
  FlaskConical,
  GanttChartSquare,
  FileText,
  Briefcase,
  Users,
  Cpu,
  Trophy,
  ArrowRight,
  Sparkles,
  Plus,
  Loader2,
  Trash2,
  Link as LinkIcon,
  Download,
  Eye,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PhaseData {
  id: string;
  name: string;
  orderIndex: number;
}

interface EvidenceItem {
  id: string;
  type: string;
  title: string;
  url: string | null;
  storageKey: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  description: string | null;
}

interface MilestoneData {
  id: string;
  name: string;
  description: string;
  targetWeekStart: number;
  targetWeekEnd: number;
  status: string;
  phaseId: string | null;
  evidence: EvidenceItem[];
}

interface PortfolioItemData {
  key: string;
  label: string;
  completed: boolean;
}

interface MilestonesClientProps {
  milestones: MilestoneData[];
  phases: PhaseData[];
  portfolio: PortfolioItemData[];
  weeks: { id: string; targetIndex: number }[];
}

const PHASE_ACCENTS = [
  {
    gradient: "from-indigo-500 to-blue-500",
    bar: "bg-gradient-to-r from-indigo-500 to-blue-500",
    icon: Code,
    iconBg: "bg-indigo-50 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    gradient: "from-emerald-500 to-teal-500",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    icon: Shield,
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    gradient: "from-violet-500 to-purple-500",
    bar: "bg-gradient-to-r from-violet-500 to-purple-500",
    icon: GanttChartSquare,
    iconBg: "bg-violet-50 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    gradient: "from-amber-500 to-orange-500",
    bar: "bg-gradient-to-r from-amber-500 to-orange-500",
    icon: Cpu,
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

const PORTFOLIO_META: Record<string, { icon: typeof Code; bg: string; border: string }> = {
  framework: { icon: Code, bg: "bg-blue-50 dark:bg-blue-950", border: "border-l-blue-500" },
  api: { icon: FlaskConical, bg: "bg-emerald-50 dark:bg-emerald-950", border: "border-l-emerald-500" },
  cicd: { icon: GanttChartSquare, bg: "bg-violet-50 dark:bg-violet-950", border: "border-l-violet-500" },
  performance: { icon: Shield, bg: "bg-amber-50 dark:bg-amber-950", border: "border-l-amber-500" },
  security: { icon: Shield, bg: "bg-red-50 dark:bg-red-950", border: "border-l-red-500" },
  "ai-testing": { icon: Cpu, bg: "bg-pink-50 dark:bg-pink-950", border: "border-l-pink-500" },
  documentation: { icon: FileText, bg: "bg-sky-50 dark:bg-sky-950", border: "border-l-sky-500" },
  resume: { icon: Briefcase, bg: "bg-green-50 dark:bg-green-950", border: "border-l-green-500" },
  interviews: { icon: Users, bg: "bg-indigo-50 dark:bg-indigo-950", border: "border-l-indigo-500" },
};

export function MilestonesClient({ milestones, phases, portfolio, weeks }: MilestonesClientProps) {
  const router = useRouter();
  const [updatingMilestone, setUpdatingMilestone] = useState<string | null>(null);
  const [showAddEvidence, setShowAddEvidence] = useState<string | null>(null);
  const [evTitle, setEvTitle] = useState("");
  const [evUrl, setEvUrl] = useState("");
  const [evType, setEvType] = useState("url");
  const [evDescription, setEvDescription] = useState("");
  const [evSubmitting, setEvSubmitting] = useState(false);
  const [evError, setEvError] = useState<string | null>(null);
  const [evFile, setEvFile] = useState<File | null>(null);

  const milestonesByPhase = phases.map((phase) => ({
    phase,
    milestones: milestones.filter((m) => m.phaseId === phase.id),
  }));

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.status === "Completed").length;
  const overallPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const portfolioCompleted = portfolio.filter((p) => p.completed).length;

  async function updateMilestoneStatus(milestoneId: string, newStatus: string) {
    setUpdatingMilestone(milestoneId);
    try {
      const res = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch {
      console.error("Failed to update milestone status");
    } finally {
      setUpdatingMilestone(null);
    }
  }

  async function addEvidence(e: FormEvent) {
    e.preventDefault();
    if (!showAddEvidence) return;
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
          milestoneId: showAddEvidence,
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
      setShowAddEvidence(null);
      setEvTitle("");
      setEvUrl("");
      setEvType("url");
      setEvDescription("");
      setEvFile(null);
      router.refresh();
    } catch (err) {
      setEvError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setEvSubmitting(false);
    }
  }

  async function deleteEvidence(evidenceId: string) {
    try {
      const res = await fetch(`/api/evidence/${evidenceId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch {
      console.error("Delete failed");
    }
  }

  function getWeekLink(targetIndex: number): string | null {
    const week = weeks.find((w) => w.targetIndex === targetIndex);
    return week ? `/roadmap/week/${week.id}` : null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Milestones & Portfolio
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Track your project milestones and portfolio readiness
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Milestones</span>
            </div>
            <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              {completedMilestones}/{totalMilestones}
            </span>
            <span className="text-sm text-neutral-400">
              ({Math.round(overallPercentage)}%)
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Portfolio</span>
            </div>
            <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              {portfolioCompleted}/{portfolio.length}
            </span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Portfolio Readiness</CardTitle>
            </div>
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {portfolioCompleted}/{portfolio.length} complete
            </span>
          </div>
          <CardDescription>
            Click items to track your portfolio progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => {
              const meta = PORTFOLIO_META[item.key] ?? PORTFOLIO_META.framework;
              const Icon = meta.icon;
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 rounded-lg border border-l-4 bg-white p-3 shadow-sm transition-all dark:bg-neutral-900 ${
                    item.completed ? meta.border : "border-l-neutral-300"
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    item.completed ? meta.bg : "bg-neutral-100 dark:bg-neutral-800"
                  }`}>
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icon className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${
                      item.completed ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400"
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-[11px] ${item.completed ? "text-green-600 dark:text-green-400" : "text-neutral-400 dark:text-neutral-500"}`}>
                      {item.completed ? "Completed" : "Not started"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {milestonesByPhase.map(({ phase, milestones: phaseMilestones }, phaseIdx) => {
        const completed = phaseMilestones.filter((m) => m.status === "Completed").length;
        const total = phaseMilestones.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const accent = PHASE_ACCENTS[phaseIdx] ?? PHASE_ACCENTS[0];
        const PhaseIcon = accent.icon;

        return (
          <Card key={phase.id} className="overflow-hidden shadow-md">
            <div className={`h-2 bg-gradient-to-r ${accent.gradient}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.iconBg} shadow-sm`}>
                    <PhaseIcon className={`h-5 w-5 ${accent.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Phase {phase.orderIndex}: {phase.name}
                    </CardTitle>
                    <CardDescription>
                      {completed} of {total} milestones completed
                    </CardDescription>
                  </div>
                </div>
                <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{completed}</span>
              </div>
              <div className="mt-2">
                <Progress
                  value={percentage}
                  className="h-2.5 bg-neutral-200 dark:bg-neutral-700"
                  indicatorClassName={accent.bar}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {phaseMilestones.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Target className="mb-2 h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No milestones in this phase.</p>
                </div>
              ) : (
                phaseMilestones.map((m) => {
                  const weekLinkStart = getWeekLink(m.targetWeekStart);
                  const weekLinkEnd = getWeekLink(m.targetWeekEnd);
                  return (
                    <div
                      key={m.id}
                      className={`rounded-lg border border-l-4 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-neutral-900 ${
                        m.status === "Completed" ? "border-l-green-500"
                          : m.status === "In Progress" ? "border-l-sky-500"
                          : "border-l-neutral-300 dark:border-l-neutral-600"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {m.status === "Completed" ? (
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            ) : m.status === "In Progress" ? (
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900">
                                <Circle className="h-4 w-4 fill-sky-500 text-sky-500" />
                              </div>
                            ) : (
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Circle className="h-4 w-4 text-neutral-400" />
                              </div>
                            )}
                            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {m.name}
                            </h3>
                          </div>
                          {m.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                              {m.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                              <Target className="h-3 w-3" />
                              <span>
                                Weeks {m.targetWeekStart}–{m.targetWeekEnd}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {weekLinkStart && (
                                <Link
                                  href={weekLinkStart}
                                  className="inline-flex items-center gap-0.5 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                >
                                  W{m.targetWeekStart}
                                  <ArrowRight className="h-2.5 w-2.5" />
                                </Link>
                              )}
                              {m.targetWeekEnd !== m.targetWeekStart && weekLinkEnd && (
                                <Link
                                  href={weekLinkEnd}
                                  className="inline-flex items-center gap-0.5 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                >
                                  W{m.targetWeekEnd}
                                  <ArrowRight className="h-2.5 w-2.5" />
                                </Link>
                              )}
                            </div>
                          </div>
                          {m.evidence.length > 0 && (
                            <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                  Evidence ({m.evidence.length})
                                </p>
                              </div>
                              <div className="space-y-1.5">
                                {m.evidence.map((ev) => (
                                  <div key={ev.id} className="flex items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5 dark:bg-neutral-800">
                                    <div className="flex min-w-0 items-center gap-2">
                                      <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                                        {ev.type}
                                      </Badge>
                                      <span className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {ev.title}
                                      </span>
                                      {ev.storageKey ? (
                                        <div className="flex shrink-0 gap-1">
                                          <a
                                            href={`/api/files/${ev.storageKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                          >
                                            <Eye className="h-3 w-3" /> View
                                          </a>
                                          <a
                                            href={`/api/files/${ev.storageKey}?download=true`}
                                            className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                          >
                                            <Download className="h-3 w-3" /> Download
                                          </a>
                                        </div>
                                      ) : ev.url ? (
                                        <a
                                          href={ev.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                          Open <ArrowRight className="h-3 w-3" />
                                        </a>
                                      ) : null}
                                    </div>
                                    <button
                                      onClick={() => deleteEvidence(ev.id)}
                                      className="shrink-0 rounded p-0.5 text-neutral-400 hover:text-red-500"
                                      aria-label={`Delete ${ev.title}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <select
                            value={m.status}
                            onChange={(e) => updateMilestoneStatus(m.id, e.target.value)}
                            disabled={updatingMilestone === m.id}
                            className={`cursor-pointer rounded-md border px-2 py-1 text-xs font-semibold focus:outline-none ${
                              m.status === "Completed"
                                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                                : m.status === "In Progress"
                                ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
                                : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddEvidence(m.id)}
                            className="h-6 gap-1 px-2 text-xs text-neutral-500"
                          >
                            <Plus className="h-3 w-3" />
                            Evidence
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!showAddEvidence} onOpenChange={(open) => { if (!open) setShowAddEvidence(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-emerald-500" />
              Add evidence
            </DialogTitle>
            <DialogDescription>Link your work to this milestone.</DialogDescription>
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
                <option value="repository">Repository</option>
                <option value="pull-request">Pull Request</option>
                <option value="report">Report</option>
                <option value="screenshot">Screenshot</option>
                <option value="documentation">Documentation</option>
                <option value="url">URL</option>
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
              <Button type="button" variant="outline" onClick={() => setShowAddEvidence(null)}>
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
    </div>
  );
}
