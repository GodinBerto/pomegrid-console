import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto h-12 w-12 rounded-md bg-linear-to-br from-brand to-info flex items-center justify-center text-white text-sm font-bold">
          PG
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/dashboard"
            prefetch={false}
            className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            prefetch={false}
            className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border text-sm hover:bg-surface-muted"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
