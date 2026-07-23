export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            SQA Learning Tracker
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track your 12-month SQA journey
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
