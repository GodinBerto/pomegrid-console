"use client";
import { PageHeader, Section, Card } from "@/components/page-header";
import { Printer, Download, FileText } from "lucide-react";
import { recentExpenses, workers, monthlySpend } from "@/lib/dashboard-data";
import { toast } from "sonner";

type ReportDef = {
  name: string;
  desc: string;
  period: string;
  filename: string;
  build: () => { headers: string[]; rows: (string | number)[][] };
};

const reports: ReportDef[] = [
  {
    name: "Monthly expense summary",
    desc: "All expenses, grouped by category, for the current month.",
    period: "July 2026",
    filename: "monthly-expense-summary",
    build: () => ({
      headers: ["ID", "Date", "Category", "Vendor", "Amount", "Status"],
      rows: recentExpenses.map((e) => [
        e.id,
        e.date,
        e.category,
        e.vendor,
        e.amount,
        e.status,
      ]),
    }),
  },
  {
    name: "Payroll register",
    desc: "Every worker, salary, and pay status.",
    period: "July 2026",
    filename: "payroll-register",
    build: () => ({
      headers: ["ID", "Name", "Role", "Status", "Joined", "Salary"],
      rows: workers.map((w) => [
        w.id,
        w.name,
        w.role,
        w.status,
        w.joined,
        w.salary,
      ]),
    }),
  },
  {
    name: "Budget vs actual",
    desc: "12-month rolling comparison of budget and actual spend.",
    period: "12 months",
    filename: "budget-vs-actual",
    build: () => ({
      headers: ["Month", "Budget", "Actual", "Variance"],
      rows: monthlySpend.map((m) => [
        m.month,
        m.budget,
        m.actual,
        m.budget - m.actual,
      ]),
    }),
  },
  {
    name: "Vendor spend",
    desc: "Total spend by vendor, sorted by amount.",
    period: "Year to date",
    filename: "vendor-spend",
    build: () => {
      const totals = new Map<string, number>();
      recentExpenses.forEach((e) =>
        totals.set(e.vendor, (totals.get(e.vendor) ?? 0) + e.amount),
      );
      const rows = [...totals.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([v, a]) => [v, a]);
      return { headers: ["Vendor", "Total"], rows };
    },
  },
  {
    name: "Cash burn",
    desc: "Weekly burn rate with running balance.",
    period: "Last 8 weeks",
    filename: "cash-burn",
    build: () => ({
      headers: ["Month", "Actual spend"],
      rows: monthlySpend.slice(-8).map((m) => [m.month, m.actual]),
    }),
  },
  {
    name: "Tax-ready ledger",
    desc: "Clean, exportable ledger for your accountant.",
    period: "Year to date",
    filename: "tax-ready-ledger",
    build: () => ({
      headers: ["ID", "Date", "Category", "Vendor", "Amount", "Status"],
      rows: recentExpenses.map((e) => [
        e.id,
        e.date,
        e.category,
        e.vendor,
        e.amount,
        e.status,
      ]),
    }),
  },
];

function toCsv(headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n");
}

function downloadReport(r: ReportDef) {
  const { headers, rows } = r.build();
  const csv = toCsv(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${r.filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${r.name}`);
}

function printReport(r: ReportDef) {
  const { headers, rows } = r.build();
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    toast.error("Enable pop-ups to print this report.");
    return;
  }
  const html = `<!doctype html><html><head><title>${r.name} — Pomegrid</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#111;padding:32px}
      h1{font-size:20px;margin:0 0 4px}
      p.meta{color:#666;font-size:12px;margin:0 0 24px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border-bottom:1px solid #e5e7eb;padding:8px 10px;text-align:left}
      th{background:#f8fafc;font-weight:600}
      tfoot{color:#666}
    </style></head><body>
    <h1>${r.name}</h1>
    <p class="meta">Pomegrid · ${r.period} · Generated ${new Date().toLocaleString()}</p>
    <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
    <script>window.onload=()=>{window.print();}</script>
    </body></html>`;
  win.document.write(html);
  win.document.close();
}

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate, download, and print reports to run and review the business."
        actions={
          <button
            onClick={() => window.print()}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border text-sm hover:bg-surface-muted"
          >
            <Printer className="h-3.5 w-3.5" /> Print page
          </button>
        }
      />
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <Card
              key={r.name}
              className="hover:border-foreground/20 transition"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{r.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.desc}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Period · {r.period}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => downloadReport(r)}
                      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
                    >
                      <Download className="h-3 w-3" /> Download CSV
                    </button>
                    <button
                      onClick={() => printReport(r)}
                      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border text-xs hover:bg-surface-muted"
                    >
                      <Printer className="h-3 w-3" /> Print
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
