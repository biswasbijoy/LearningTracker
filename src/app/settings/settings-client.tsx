"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Save,
  User,
  Clock,
  Globe,
  Calendar,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

interface SettingsData {
  name: string;
  email: string;
  primaryLanguage: string | null;
  startDate: string | null;
  currentWeekOverride: number | null;
  weekdayHourGoal: number | null;
  weekendHourGoal: number | null;
  theme: string;
}

export function SettingsClient({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({ ...settings });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Settings saved successfully" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="overflow-hidden shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 shadow-sm dark:bg-blue-950">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-blue-600 dark:focus:bg-neutral-800 dark:focus:ring-blue-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-800/50">
                <span className="min-w-0 truncate text-sm text-neutral-500">{form.email}</span>
                <Badge className="shrink-0 text-[10px]" variant="secondary">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 shadow-sm dark:bg-emerald-950">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Learning Preferences</CardTitle>
                <CardDescription>Set your learning goals and schedule</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="language"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <Globe className="mr-1 inline h-3.5 w-3.5" />
                  Primary Language
                </label>
                <select
                  id="language"
                  value={form.primaryLanguage ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, primaryLanguage: e.target.value || null })
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 transition-colors focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                >
                  <option value="">Select a language</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="TypeScript/JavaScript">TypeScript/JavaScript</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="weekdayHours"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <Clock className="mr-1 inline h-3.5 w-3.5" />
                  Weekday Goal (hours/day)
                </label>
                <input
                  id="weekdayHours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={form.weekdayHourGoal ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      weekdayHourGoal: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 transition-colors focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="weekendHours"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <Calendar className="mr-1 inline h-3.5 w-3.5" />
                  Weekend Goal (hours)
                </label>
                <input
                  id="weekendHours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={form.weekendHourGoal ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      weekendHourGoal: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 transition-colors focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="currentWeek"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <BarChart3 className="mr-1 inline h-3.5 w-3.5" />
                  Current Week Override
                </label>
                <input
                  id="currentWeek"
                  type="number"
                  min="1"
                  max="52"
                  value={form.currentWeekOverride ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currentWeekOverride: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 transition-colors focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-100 dark:focus:border-emerald-600 dark:focus:bg-neutral-800 dark:focus:ring-emerald-900"
                  placeholder="Auto"
                />
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Leave empty for automatic week calculation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>



        {message && (
          <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
          }`}>
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <RefreshCw className="h-4 w-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="gap-2 px-6">
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Badge({ className, variant, children }: { className?: string; variant: "secondary"; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-transparent bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 ${className ?? ""}`}>
      {children}
    </span>
  );
}
