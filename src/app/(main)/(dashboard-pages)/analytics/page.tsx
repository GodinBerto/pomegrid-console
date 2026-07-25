"use client";
import { PageHeader, Section, Card } from "@/components/page-header";
import {
  monthlySpend,
  categoryBreakdown,
  weeklyBurn,
} from "@/lib/dashboard-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export default function AnalyticsPage() {
  const savings = monthlySpend.map((m) => ({
    month: m.month,
    savings: m.budget - m.actual,
  }));
  const efficiency = [
    { name: "Efficiency", value: 78, fill: "var(--color-chart-1)" },
  ];

  return (
    <>
      <PageHeader title="Analytics" />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            title="Budget efficiency"
            description="How close spend stays to budget"
            className="lg:col-span-1"
          >
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={efficiency}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={20}
                    background={{ fill: "var(--color-surface-muted)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-34 pointer-events-none">
              <p className="text-3xl font-semibold text-brand">78%</p>
              <p className="text-xs text-muted-foreground">on-target months</p>
            </div>
            <div className="mt-16 text-xs text-muted-foreground text-center">
              9 of the last 12 months stayed within budget.
            </div>
          </Card>

          <Card
            title="Monthly savings"
            description="Budget minus actual, per month"
            className="lg:col-span-2"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={savings}
                  margin={{ left: -10, right: 8, top: 8, bottom: 0 }}
                >
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
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="savings"
                    fill="var(--color-chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card
            title="Category momentum"
            description="Spend shape across categories"
          >
            <ul className="space-y-3">
              {categoryBreakdown.map((c) => {
                const total = categoryBreakdown.reduce(
                  (s, x) => s + x.value,
                  0,
                );
                const pct = Math.round((c.value / total) * 100);
                return (
                  <li key={c.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{c.name}</span>
                      <span className="text-muted-foreground">
                        ${c.value.toLocaleString()} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: pct + "%", background: c.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card
            title="Weekly rhythm"
            description="When money leaves the business"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyBurn}
                  margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-chart-2)"
                        stopOpacity={0.35}
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
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="var(--color-chart-2)"
                    fill="url(#ga)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
