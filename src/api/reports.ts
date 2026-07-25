import { apiRequest, buildApiUrl } from "@/lib/useClient";

export interface ExpenseReport {
  id: string;
  title: string;
  report_type: string;
  generated_by: string;
  generated_at: string;
  file_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}

// --- Expense Reports CRUD ---

export const getExpenseReports = async (): Promise<ExpenseReport[]> => {
  const response = await apiRequest<ApiResponse<ExpenseReport[]>>("/console/expense-reports");
  return response.data || [];
};

export const getExpenseReportDetails = async (id: string): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>(`/console/expense-reports/${id}`);
  return response.data;
};

export const createExpenseReport = async (payload: Partial<ExpenseReport>): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/expense-reports", "POST", payload);
  return response.data;
};

export const updateExpenseReport = async (id: string, payload: Partial<ExpenseReport>): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>(`/console/expense-reports/${id}`, "PUT", payload);
  return response.data;
};

export const deleteExpenseReport = async (id: string): Promise<void> => {
  await apiRequest(`/console/expense-reports/${id}`, "DELETE");
};

// --- Reports ---

export const getAllReports = async (): Promise<any[]> => {
  const response = await apiRequest<ApiResponse<any[]>>("/console/reports");
  return response.data || [];
};

export const getReportDetails = async (id: string): Promise<any> => {
  const response = await apiRequest<ApiResponse<any>>(`/console/reports/${id}`);
  return response.data;
};

export const downloadReport = async (id: string): Promise<void> => {
  window.open(buildApiUrl(`/console/reports/${id}/download`), "_blank");
};

export const printReport = async (id: string): Promise<void> => {
  window.open(buildApiUrl(`/console/reports/${id}/print`), "_blank");
};

// --- Report Types Generators ---
// Using POST to generate and save a report.

export const generateMonthlyExpenseSummary = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/monthly-expense-summary", "POST");
  return response.data;
};

export const generatePayrollRegister = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/payroll-register", "POST");
  return response.data;
};

export const generateBudgetVsActual = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/budget-vs-actual", "POST");
  return response.data;
};

export const generateVendorSpend = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/vendor-spend", "POST");
  return response.data;
};

export const generateCashBurn = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/cash-burn", "POST");
  return response.data;
};

export const generateTaxReadyLedger = async (): Promise<ExpenseReport> => {
  const response = await apiRequest<ApiResponse<ExpenseReport>>("/console/reports/tax-ready-ledger", "POST");
  return response.data;
};

// --- Export Global Reports ---

export const exportPdf = async (): Promise<void> => {
  window.open(buildApiUrl(`/console/reports/pdf`), "_blank");
};

export const exportCsv = async (): Promise<void> => {
  window.open(buildApiUrl(`/console/reports/csv`), "_blank");
};

export const printGlobalReport = async (): Promise<void> => {
  window.open(buildApiUrl(`/console/reports/print`), "_blank");
};
