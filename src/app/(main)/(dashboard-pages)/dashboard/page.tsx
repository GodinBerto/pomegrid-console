"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  FileText,
  Percent,
} from "lucide-react";
import { PageHeader, Section, Card } from "@/components/page-header";
import Link from "next/link";
import {
  useDashboardOverview,
  useDashboardBudgetChart,
  useDashboardRecentExpenses,
  useDashboardWeeklyBurn,
} from "@/query/dashboard";

function formatMoney(n: number | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardOverview();
  const { data: monthlySpend, isLoading: spendLoading } = useDashboardBudgetChart();
  const { data: recentExpenses, isLoading: expensesLoading } = useDashboardRecentExpenses();
  const { data: weeklyBurn, isLoading: burnLoading } = useDashboardWeeklyBurn();





  return (
    <>
      <PageHeader
        title="Overview"
        actions={
          <>
            <button className="h-8 px-3 rounded-md border border-border text-sm hover:bg-surface-muted">
              Export
            </button>
            <Link
              href="/expenses"
              className="h-8 px-3 inline-flex items-center rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
            >
              New expense
            </Link>
          </>
        }
      />
      <Section>
        {/* KPI row */}
        {kpisLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-32 rounded-lg border border-border bg-card animate-pulse" />
            <div className="h-32 rounded-lg border border-border bg-card animate-pulse" />
            <div className="h-32 rounded-lg border border-border bg-card animate-pulse" />
            <div className="h-32 rounded-lg border border-border bg-card animate-pulse" />
          </div>
        ) : kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi
              label="Monthly budget"
              value={formatMoney(kpis.monthly_budget.value)}
              delta={`${kpis.monthly_budget.percentage_change}% from last month`}
              trend={
                kpis.monthly_budget.percentage_change < 0
                  ? "down"
                  : kpis.monthly_budget.percentage_change > 0
                    ? "up"
                    : "neutral"
              }
              icon={Wallet}
            />
            <Kpi
              label="Spent this month"
              value={formatMoney(kpis.spent_this_month.value)}
              delta={`${kpis.spent_this_month.percentage_change}% of budget`}
              trend={kpis.spent_this_month.percentage_change < 0 ? "down" : kpis.spent_this_month.percentage_change > 0 ? "up" : "neutral"}
              icon={Percent}
              accent="info"
            />
            <Kpi
              label="Active workers"
              value={String(kpis.active_workers.value || 0)}
              delta={`${String(kpis.active_workers.number_change)} from last month`}
              trend={kpis.active_workers.number_change < 0 ? "down" : kpis.active_workers.number_change > 0 ? "up" : "neutral"}
              icon={Users}
            />
            <Kpi
              label="Remaining Budget"
              value={formatMoney(kpis.remaining_budget.value)}
              delta={`${kpis.remaining_budget.percentage_change}% of budget`}
              trend={kpis.remaining_budget.percentage_change < 0 ? "down" : kpis.remaining_budget.percentage_change > 0 ? "up" : "neutral"}
              icon={FileText}
            />
          </div>
        ) : (
          <div className="text-center text-red-500">Failed to load KPIs</div>
        )}

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            className="lg:col-span-2"
            title="Budget vs actual spend"
            description="Rolling 12 months"
            action={
              <button className="text-xs text-muted-foreground hover:text-foreground">
                Last 12 mo →
              </button>
            }
          >
            <div className="h-72">
              {spendLoading ? (
                <div className="h-full w-full bg-surface/50 animate-pulse rounded-md" />
              ) : monthlySpend && monthlySpend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlySpend}
                    margin={{ left: -10, right: 8, top: 8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="var(--color-chart-1)"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-chart-1)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="var(--color-chart-2)"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-chart-2)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="var(--color-border)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stroke="var(--color-chart-2)"
                      fill="url(#g2)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--color-chart-1)"
                      fill="url(#g1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </Card>

          <Card title="Weekly burn" description="Daily spend, this week">
            <div className="h-72">
              {burnLoading ? (
                <div className="h-full w-full bg-surface/50 animate-pulse rounded-md" />
              ) : weeklyBurn && weeklyBurn.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyBurn}
                    margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="var(--color-border)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="spend"
                      fill="var(--color-chart-2)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="mt-6">
          <Card
            title="Recent expenses"
            action={
              <Link
                href="/expenses"
                className="text-xs text-info hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            <div className="-mx-5 -my-5">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left font-medium px-5 py-2.5">ID</th>
                    <th className="text-left font-medium px-5 py-2.5">Date</th>
                    <th className="text-left font-medium px-5 py-2.5">
                      Category
                    </th>
                    <th className="text-left font-medium px-5 py-2.5">
                      Vendor
                    </th>
                    <th className="text-right font-medium px-5 py-2.5">
                      Amount
                    </th>
                    <th className="text-left font-medium px-5 py-2.5">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expensesLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : recentExpenses && recentExpenses.length > 0 ? (
                    recentExpenses.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-border last:border-0 hover:bg-surface-muted"
                      >
                        <td className="px-5 py-3 font-mono text-xs">{e.expense_number || e.id}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {e.expense_date || e.date}
                        </td>
                        <td className="px-5 py-3">{e.category_name || e.category}</td>
                        <td className="px-5 py-3">{e.vendor_name || e.vendor}</td>
                        <td className="px-5 py-3 text-right font-medium">
                          {formatMoney(e.amount)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusPill status={e.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">
                        No recent expenses
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}

function Kpi({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  accent?: "brand" | "info";
}) {
  const accentClass =
    accent === "info" ? "bg-info/10 text-info" : "bg-brand/10 text-brand";
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div
          className={
            "h-7 w-7 rounded-md flex items-center justify-center " + accentClass
          }
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-1 text-xs">
        <TrendIcon
          className={
            "h-3 w-3 " + (trend === "up" ? "text-brand" : trend === "down" ? "text-destructive" : "text-neutral")
          }
        />
        <span className="text-muted-foreground">{delta}</span>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "paid" || s === "active"
      ? "bg-brand/10 text-brand"
      : s === "pending" || s === "on leave"
        ? "bg-info/10 text-info"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium " +
        cls
      }
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (s === "paid" || s === "active"
            ? "bg-brand"
            : s === "pending" || s === "on leave"
              ? "bg-info"
              : "bg-muted-foreground")
        }
      />
      {status}
    </span>
  );
}
