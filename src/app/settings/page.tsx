import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AppShell from "@/components/layout/app-shell";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, roadmap, preferences] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.roadmap.findFirst({
      where: { ownerId: session.user.id, active: true },
    }),
    prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const serialized = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    primaryLanguage: roadmap?.primaryLanguage ?? null,
    startDate: roadmap?.startDate?.toISOString() ?? null,
    currentWeekOverride: preferences?.currentWeekOverride ?? null,
    weekdayHourGoal: preferences?.weekdayHourGoal ?? null,
    weekendHourGoal: preferences?.weekendHourGoal ?? null,
    theme: preferences?.theme ?? "system",
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-neutral-500">Manage your profile and preferences</p>
        </div>

        <SettingsClient settings={serialized} />
      </div>
    </AppShell>
  );
}
