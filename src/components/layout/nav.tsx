"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Trophy,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/milestones", label: "Milestones", icon: Trophy },
  { href: "/learning-log", label: "Learning Log", icon: BookOpen },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-neutral-200 md:bg-white md:dark:border-neutral-700 md:dark:bg-neutral-900">
        <div className="flex h-14 items-center border-b border-neutral-200 px-6 dark:border-neutral-700">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            SQA Tracker
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-neutral-200 bg-white px-2 md:hidden dark:border-neutral-700 dark:bg-neutral-900">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "text-neutral-900 dark:text-neutral-50"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
            pathname === "/settings"
              ? "text-neutral-900 dark:text-neutral-50"
              : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          <SettingsIcon className="h-5 w-5" />
          Settings
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          Menu
        </button>
      </nav>
    </>
  );
}
