import { Nav } from "./nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-950">
      <Nav />
      <main className="min-h-screen pb-20 md:ml-56 md:pb-0 lg:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
