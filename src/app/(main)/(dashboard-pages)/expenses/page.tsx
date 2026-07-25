"use client";
import { useMemo, useState, useEffect } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
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
import { useExpenses, useCreateExpense } from "@/query/expenses";
import { useBudget, useUpdateBudget } from "@/query/budget";
import { useCategories } from "@/query/categories";
import { useDashboardBudgetChart } from "@/query/dashboard";

function formatMoney(n: number) {
  return "$" + n.toLocaleString();
}

export default function ExpensesPage() {
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: budgetData, isLoading: budgetLoading } = useBudget();
  const { data: monthlySpend = [], isLoading: chartLoading } = useDashboardBudgetChart();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  
  const createExpense = useCreateExpense();
  const updateBudget = useUpdateBudget();

  const [budgetVal, setBudgetVal] = useState<number>(0);
  
  useEffect(() => {
    if (budgetData?.budget_amount !== undefined) {
      setBudgetVal(budgetData.budget_amount);
    }
  }, [budgetData]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    expense_date: new Date().toISOString().slice(0, 10),
    category_id: "",
    vendor_name: "",
    amount: "",
    status: "Pending",
  });

  // Calculate dynamic category breakdown
  const { categoryBreakdown, totalSpent } = useMemo(() => {
    const totalByCatMap = new Map<string, number>();
    let totalSpent = 0;
    expenses.forEach(e => {
      const cat = e.category_name || e.category_id || "Uncategorized";
      totalByCatMap.set(cat, (totalByCatMap.get(cat) || 0) + e.amount);
      totalSpent += e.amount;
    });
    
    const breakdown = Array.from(totalByCatMap.entries())
      .map(([name, value], i) => ({
        name,
        value,
        color: `var(--color-chart-${(i % 5) + 1})`
      }))
      .sort((a, b) => b.value - a.value);
      
    return { categoryBreakdown: breakdown, totalSpent };
  }, [expenses]);

  const remaining = Math.max(budgetVal - totalSpent, 0);
  const pct = budgetVal > 0 ? Math.min(Math.round((totalSpent / budgetVal) * 100), 100) : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!form.vendor_name.trim() || !amt || !form.category_id) {
      toast.error("Please enter a vendor, category, and amount.");
      return;
    }
    
    createExpense.mutate({
      expense_date: form.expense_date,
      category_id: form.category_id,
      vendor_name: form.vendor_name,
      amount: amt,
      status: form.status,
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ ...form, vendor_name: "", amount: "" });
      }
    });
  }

  function handleSaveBudget() {
    updateBudget.mutate({
      budget_amount: budgetVal,
      // Pass other required fields if any (year, month depending on backend)
    });
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
            {budgetLoading ? (
               <div className="h-40 animate-pulse bg-surface-muted rounded-md" />
            ) : (
              <>
                <label className="text-xs text-muted-foreground">
                  Budget amount (USD)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(Number(e.target.value) || 0)}
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
                        {formatMoney(totalSpent)}
                      </p>
                    </div>
                    <div className="rounded-md bg-surface-muted p-3">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="mt-0.5 font-semibold text-brand">
                        {formatMoney(remaining)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveBudget}
                    disabled={updateBudget.isPending}
                    className="mt-4 w-full h-9 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
                  >
                    {updateBudget.isPending ? "Saving..." : "Save budget"}
                  </button>
                </div>
              </>
            )}
          </Card>

          <Card
            title="Spend by category"
            description="Where the money went this month"
            className="lg:col-span-1"
          >
            {expensesLoading ? (
               <div className="h-52 animate-pulse bg-surface-muted rounded-md" />
            ) : categoryBreakdown.length > 0 ? (
              <>
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
                        {formatMoney(c.value)} ·{" "}
                        {Math.round((c.value / totalSpent) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No expense data available.
              </div>
            )}
          </Card>

          <Card
            title="Spending trend"
            description="Actual spend vs budget"
            className="lg:col-span-1"
          >
            <div className="h-64">
              {chartLoading ? (
                 <div className="h-full w-full bg-surface-muted animate-pulse rounded-md" />
              ) : monthlySpend && monthlySpend.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available.
                </div>
              )}
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
                  {expensesLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">Loading...</td>
                    </tr>
                  ) : expenses.length > 0 ? (
                    expenses.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-border last:border-0 hover:bg-surface-muted"
                      >
                        <td className="px-5 py-3 font-mono text-xs">{e.expense_number || e.id}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {e.expense_date}
                        </td>
                        <td className="px-5 py-3">{e.category_name}</td>
                        <td className="px-5 py-3">{e.vendor_name}</td>
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
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">No expenses recorded.</td>
                    </tr>
                  )}
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
                  value={form.expense_date}
                  onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Category</span>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium">Vendor</span>
              <input
                value={form.vendor_name}
                onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
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
                      status: e.target.value,
                    })
                  }
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
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
                disabled={createExpense.isPending}
                className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
              >
                {createExpense.isPending ? "Adding..." : "Add expense"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
