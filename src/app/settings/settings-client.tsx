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
import { Download, Upload, RefreshCw, Save } from "lucide-react";

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
  const [message, setMessage] = useState<string | null>(null);
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
      setMessage("Settings saved successfully");
      router.refresh();
    } catch {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sqa-roadmap-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage("Export failed");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
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
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-600 dark:bg-neutral-900"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Preferences</CardTitle>
          <CardDescription>Set your learning goals and schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="language"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Primary Language
            </label>
            <select
              id="language"
              value={form.primaryLanguage ?? ""}
              onChange={(e) =>
                setForm({ ...form, primaryLanguage: e.target.value || null })
              }
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            >
              <option value="">Select a language</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="TypeScript/JavaScript">TypeScript/JavaScript</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="weekdayHours"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
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
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="weekendHours"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
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
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data</CardTitle>
          <CardDescription>Export or reset your learning data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </Button>
          <Button type="button" variant="outline" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Import (coming soon)
          </Button>
          <Button type="button" variant="destructive" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset roadmap
          </Button>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`text-sm ${
            message === "Settings saved successfully"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
