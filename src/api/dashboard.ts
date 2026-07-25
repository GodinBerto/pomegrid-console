import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface DashboardOverview {
  monthlyBudget: number;
  spentThisMonth: number;
  activeWorkers: number;
  reportsGenerated: number;
}

export interface MonthlySpendData {
  month: string;
  budget: number;
  actual: number;
}

export interface WeeklyBurnData {
  day: string;
  spend: number;
}

export interface RecentExpenseData {
  id: string;
  expense_number?: string;
  date: string;
  expense_date?: string;
  category: string;
  category_name?: string;
  vendor: string;
  vendor_name?: string;
  amount: number;
  status: string;
}

export const getOverview = async (): Promise<DashboardOverview> => {
  const response = await apiRequest<ApiResponse<DashboardOverview>>("console/overview");
  return response.data;
};

export const getOverviewBudgetChart = async (): Promise<MonthlySpendData[]> => {
  const response = await apiRequest<ApiResponse<MonthlySpendData[]>>("console/overview-budget-chart");
  return response.data;
};

export const getRecentExpenses = async (): Promise<RecentExpenseData[]> => {
  const response = await apiRequest<ApiResponse<RecentExpenseData[]>>("console/recent-expenses");
  return response.data;
};

export const getWeeklyBurnChart = async (): Promise<WeeklyBurnData[]> => {
  const response = await apiRequest<ApiResponse<WeeklyBurnData[]>>("console/weekly-burn-chart");
  return response.data;
};
