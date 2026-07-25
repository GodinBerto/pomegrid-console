"use client";

import { PageHeader, Section, Card } from "@/components/page-header";
import { Printer, Download, FileText, Trash2, FileOutput, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  useExpenseReports,
  useDeleteExpenseReport,
  useGenerateMonthlyExpenseSummary,
  useGeneratePayrollRegister,
  useGenerateBudgetVsActual,
  useGenerateVendorSpend,
  useGenerateCashBurn,
  useGenerateTaxReadyLedger,
} from "@/query/reports";
import { downloadReport, printReport, exportPdf, exportCsv, printGlobalReport } from "@/api/reports";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const { data: expenseReports, isLoading, isError } = useExpenseReports();
  const deleteReport = useDeleteExpenseReport();

  const generateMonthly = useGenerateMonthlyExpenseSummary();
  const generatePayroll = useGeneratePayrollRegister();
  const generateBudget = useGenerateBudgetVsActual();
  const generateVendor = useGenerateVendorSpend();
  const generateCashBurn = useGenerateCashBurn();
  const generateTaxLedger = useGenerateTaxReadyLedger();

  const handleGenerate = (action: any, name: string) => {
    action.mutate(undefined, {
      onSuccess: () => toast.success(`${name} generated successfully`),
      onError: (err: any) => toast.error(`Failed to generate ${name}: ${err.message}`),
    });
  };

  const reportTypes = [
    {
      name: "Monthly expense summary",
      desc: "All expenses, grouped by category, for the current month.",
      period: "Current Month",
      action: generateMonthly,
    },
    {
      name: "Payroll register",
      desc: "Every worker, salary, and pay status.",
      period: "Current",
      action: generatePayroll,
    },
    {
      name: "Budget vs actual",
      desc: "12-month rolling comparison of budget and actual spend.",
      period: "12 months",
      action: generateBudget,
    },
    {
      name: "Vendor spend",
      desc: "Total spend by vendor, sorted by amount.",
      period: "Year to date",
      action: generateVendor,
    },
    {
      name: "Cash burn",
      desc: "Weekly burn rate with running balance.",
      period: "Last 8 weeks",
      action: generateCashBurn,
    },
    {
      name: "Tax-ready ledger",
      desc: "Clean, exportable ledger for your accountant.",
      period: "Year to date",
      action: generateTaxLedger,
    },
  ];

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate, download, and print reports to run and review the business."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCsv()}
              className="h-8 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPdf()}
              className="h-8 gap-1.5"
            >
              <FileOutput className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => printGlobalReport()}
              className="h-8 gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" /> Print view
            </Button>
          </>
        }
      />
      
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {reportTypes.map((r) => (
            <Card
              key={r.name}
              className="hover:border-foreground/20 transition"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{r.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {r.desc}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Period · {r.period}
                  </p>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(r.action, r.name)}
                      disabled={r.action.isPending}
                      className="h-8 text-xs font-medium"
                    >
                      {r.action.isPending ? "Generating..." : "Generate Report"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Generated Reports" description="History of all generated reports">
          <div className="mt-2">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading reports...</div>
            ) : isError ? (
              <div className="py-8 text-center text-sm text-red-500">Failed to load reports.</div>
            ) : !expenseReports || expenseReports.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No reports generated yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Generated At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>{report.report_type}</TableCell>
                      <TableCell>{report.generated_by}</TableCell>
                      <TableCell>{new Date(report.generated_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadReport(report.id)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => printReport(report.id)}
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this report?")) {
                                deleteReport.mutate(report.id);
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </Section>
    </>
  );
}
