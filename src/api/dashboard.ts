import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface DashboardOverview {
  monthly_budget: {
    value: number;
    percentage_change: number;
  }
  spent_this_month: {
    value: number;
    percentage_change: number;
  }
  active_workers: {
    value: number;
    number_change: number;
  }
  reports_generated: {
    value: number;
    percentage_change: number;
  }
  remaining_budget: {
    value: number;
    percentage_change: number;
  }
}

export interface MonthlySpendData {
  month: string;
  budget: number;
  actual_spend: number;
}

export interface ChartPoint {
  x: number | string;
  y: number;
}

export interface OverviewChartsResponse {
  budget_chart: ChartPoint[];
  actual_spend: ChartPoint[];
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

export const getOverviewBudgetChart = async (): Promise<OverviewChartsResponse> => {
  const response = await apiRequest<ApiResponse<OverviewChartsResponse>>("console/overview-budget-chart");
  return response.data;
};

export const getRecentExpenses = async (): Promise<RecentExpenseData[]> => {
  const response = await apiRequest<ApiResponse<RecentExpenseData[]>>("console/recent-expenses");
  return response.data;
};

export const getWeeklyBurnChart = async (): Promise<ChartPoint[]> => {
  const response = await apiRequest<ApiResponse<ChartPoint[]>>("console/weekly-burn-chart");
  return response.data;
};
