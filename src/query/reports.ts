import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExpenseReports,
  getExpenseReportDetails,
  createExpenseReport,
  updateExpenseReport,
  deleteExpenseReport,
  ExpenseReport,
  generateMonthlyExpenseSummary,
  generatePayrollRegister,
  generateBudgetVsActual,
  generateVendorSpend,
  generateCashBurn,
  generateTaxReadyLedger
} from "@/api/reports";
import { toast } from "sonner";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: () => [...reportKeys.lists()] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

export const useExpenseReports = () => {
  return useQuery({
    queryKey: reportKeys.list(),
    queryFn: getExpenseReports,
  });
};

export const useExpenseReport = (id: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => getExpenseReportDetails(id),
    enabled: !!id,
  });
};

export const useCreateExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpenseReport,
    onSuccess: () => {
      toast.success("Report created successfully");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create report: ${error.message}`);
    },
  });
};

export const useUpdateExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ExpenseReport> }) =>
      updateExpenseReport(id, payload),
    onSuccess: (data, variables) => {
      toast.success("Report updated successfully");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update report: ${error.message}`);
    },
  });
};

export const useDeleteExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpenseReport,
    onSuccess: () => {
      toast.success("Report deleted successfully");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete report: ${error.message}`);
    },
  });
};

export const useGenerateMonthlyExpenseSummary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateMonthlyExpenseSummary,
    onSuccess: () => {
      toast.success("Monthly Expense Summary generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useGeneratePayrollRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generatePayrollRegister,
    onSuccess: () => {
      toast.success("Payroll Register generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useGenerateBudgetVsActual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateBudgetVsActual,
    onSuccess: () => {
      toast.success("Budget vs Actual report generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useGenerateVendorSpend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateVendorSpend,
    onSuccess: () => {
      toast.success("Vendor Spend report generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useGenerateCashBurn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateCashBurn,
    onSuccess: () => {
      toast.success("Cash Burn report generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useGenerateTaxReadyLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateTaxReadyLedger,
    onSuccess: () => {
      toast.success("Tax Ready Ledger generated");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};
