"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("Python");
  const [weekdayHours, setWeekdayHours] = useState(1.5);
  const [weekendHours, setWeekendHours] = useState(5);
  const [saving, setSaving] = useState(false);

  async function handleComplete() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryLanguage: language,
          weekdayHourGoal: weekdayHours,
          weekendHourGoal: weekendHours,
        }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      // ignore, continue
    } finally {
      setSaving(false);
    }
  }

  if (step === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to SQA Tracker</CardTitle>
            <CardDescription>
              This tracker measures evidence and learning judgment, not only
              checkmarks. Your journey to becoming an AI-Resilient Mid-Level SQA
              Engineer starts here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStep(1)} className="w-full">
              Get started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>
            Set up your learning preferences to personalize your roadmap.
          </CardDescription>
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            >
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
              Weekday study goal (hours/day)
            </label>
            <input
              id="weekdayHours"
              type="number"
              min="0.5"
              max="4"
              step="0.5"
              value={weekdayHours}
              onChange={(e) => setWeekdayHours(parseFloat(e.target.value))}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="weekendHours"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Weekend study goal (hours)
            </label>
            <input
              id="weekendHours"
              type="number"
              min="1"
              max="8"
              step="0.5"
              value={weekendHours}
              onChange={(e) => setWeekendHours(parseFloat(e.target.value))}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : "Start learning!"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
