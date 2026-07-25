"use client";
import { useMemo, useState } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
import {
  monthlySpend,
  categoryBreakdown,
  recentExpenses,
  kpis,
} from "@/lib/dashboard-data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { StatusPill } from "../dashboard/page";

const CATEGORIES = ["Salaries", "Logistics", "Utilities", "Marketing", "Misc"];

export default function ExpensesPage() {
  const [budget, setBudget] = useState(kpis.monthlyBudget);
  const [expenses, setExpenses] = useState(recentExpenses);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: CATEGORIES[0],
    vendor: "",
    amount: "",
    status: "Pending" as "Pending" | "Paid",
  });

  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = Math.max(budget - spent, 0);
  const pct = Math.min(Math.round((spent / budget) * 100), 100);

  const totalByCat = useMemo(
    () => categoryBreakdown.reduce((s, c) => s + c.value, 0),
    [],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!form.vendor.trim() || !amt) {
      toast.error("Please enter a vendor and amount.");
      return;
    }
    const nextId =
      "EXP-" +
      String(
        Math.max(...expenses.map((x) => Number(x.id.split("-")[1]) || 1000)) +
          1,
      );
    setExpenses([
      {
        id: nextId,
        date: form.date,
        category: form.category,
        vendor: form.vendor.trim(),
        amount: amt,
        status: form.status,
      },
      ...expenses,
    ]);
    toast.success(`Added ${nextId} · $${amt.toLocaleString()}`);
    setOpen(false);
    setForm({ ...form, vendor: "", amount: "" });
  }

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Set your monthly budget and see how much the business has used."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" /> Add expense
          </button>
        }
      />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            title="Monthly budget"
            description="Set the ceiling for this month"
            className="lg:col-span-1"
          >
            <label className="text-xs text-muted-foreground">
              Budget amount (USD)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Used</span>
                <span className="text-xs font-medium">{pct}%</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-surface-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand to-info transition-all"
                  style={{ width: pct + "%" }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-surface-muted p-3">
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className="mt-0.5 font-semibold">
                    ${spent.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-md bg-surface-muted p-3">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="mt-0.5 font-semibold text-brand">
                    ${remaining.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast.success("Budget saved")}
                className="mt-4 w-full h-9 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90"
              >
                Save budget
              </button>
            </div>
          </Card>

          <Card
            title="Spend by category"
            description="Where the money went this month"
            className="lg:col-span-1"
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="var(--color-background)"
                  >
                    {categoryBreakdown.map((c, i) => (
                      <Cell key={i} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {categoryBreakdown.map((c) => (
                <li key={c.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: c.color }}
                    />
                    {c.name}
                  </span>
                  <span className="text-muted-foreground">
                    ${c.value.toLocaleString()} ·{" "}
                    {Math.round((c.value / totalByCat) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Spending trend"
            description="Actual spend vs budget"
            className="lg:col-span-1"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlySpend}
                  margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
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
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card
            title="All expenses"
            description="Filter, review, and reconcile every entry"
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
                  {expenses.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border last:border-0 hover:bg-surface-muted"
                    >
                      <td className="px-5 py-3 font-mono text-xs">{e.id}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {e.date}
                      </td>
                      <td className="px-5 py-3">{e.category}</td>
                      <td className="px-5 py-3">{e.vendor}</td>
                      <td className="px-5 py-3 text-right font-medium">
                        ${e.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <DialogDescription>
              Record a new business expense.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Category</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium">Vendor</span>
              <input
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                placeholder="e.g. Fastlane Freight"
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium">Amount (USD)</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as "Pending" | "Paid",
                    })
                  }
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
              </label>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-4 rounded-md border border-border text-sm hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90"
              >
                Add expense
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
