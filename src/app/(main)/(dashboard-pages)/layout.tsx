"use client";
import {
  LayoutDashboard,
  Wallet,
  Users,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronsUpDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/workers", label: "Workers", icon: Users },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const SidebarInner = (
    <>
      <div className="h-14 px-4 flex items-center gap-2 border-b border-border">
        <div className="h-7 w-7 rounded-md bg-linear-to-br from-brand to-info flex items-center justify-center text-white text-sm font-bold">
          P
        </div>
        <span className="font-semibold tracking-tight text-sm">
          Pomegrid Console
        </span>
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-surface-muted"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <button className="w-full flex items-center gap-1.5 text-sm font-medium hover:bg-surface-muted px-2 py-1.5 rounded-md">
          <div className="h-5 w-5 rounded-full bg-brand/15 text-brand text-[10px] font-bold flex items-center justify-center">
            PG
          </div>
          Pomegrid HQ
          <ChevronsUpDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <p className="mt-4 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <nav className="mt-1 space-y-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                href={item.to}
                className={
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition " +
                  (active
                    ? "bg-surface-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-muted")
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-surface-muted"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-56 border-r border-border flex-col bg-sidebar z-40">
        {SidebarInner}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-sidebar border-r border-border flex flex-col animate-in slide-in-from-left duration-200">
            {SidebarInner}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur">
          <div className="h-full px-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-surface-muted"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 lg:hidden"
            >
              <div className="h-7 w-7 rounded-md bg-linear-to-br from-brand to-info flex items-center justify-center text-white text-sm font-bold">
                P
              </div>
              <span className="font-semibold tracking-tight text-sm">
                Pomegrid Console
              </span>
            </Link>
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  placeholder="Search…"
                  className="w-full h-8 pl-8 pr-14 rounded-md border border-border bg-surface text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="h-8 w-8 rounded-md hover:bg-surface-muted inline-flex items-center justify-center">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </button>
              <Link
                href="/"
                className="h-8 w-8 rounded-full bg-linear-to-br from-info to-brand text-white text-xs font-bold flex items-center justify-center"
                title="Sign out"
              >
                A
              </Link>
            </div>
          </div>
        </header>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
