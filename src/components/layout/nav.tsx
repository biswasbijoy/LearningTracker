"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Map, Trophy, BookOpen,
  Settings as SettingsIcon, LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/milestones", label: "Milestones", icon: Trophy },
  { href: "/learning-log", label: "Learning Log", icon: BookOpen },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:flex md:w-64 md:flex-col md:bg-gradient-to-b md:from-[#1e1b4b] md:to-[#0f0a3c]">
        <div className="flex h-14 items-center border-b border-white/10 px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-[10px] font-bold text-white shadow-lg shadow-primary/30">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SQA Tracker</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary-light to-secondary" />
                )}
                <item.icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive ? "text-primary-light" : "group-hover:scale-110"
                )} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/settings"
                ? "bg-white/10 text-white"
                : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-indigo-200/70 transition-all duration-200 hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-neutral-200 bg-white px-2 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-sm")} />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium",
            pathname === "/settings"
              ? "text-primary"
              : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          <SettingsIcon className="h-5 w-5" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-red-500 dark:text-neutral-400"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </nav>
    </>
  );
}
