import { useQuery } from "@tanstack/react-query";
import {
  getOverview,
  getOverviewBudgetChart,
  getRecentExpenses,
  getWeeklyBurnChart,
} from "@/api/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  budgetChart: () => [...dashboardKeys.all, "budgetChart"] as const,
  recentExpenses: () => [...dashboardKeys.all, "recentExpenses"] as const,
  weeklyBurn: () => [...dashboardKeys.all, "weeklyBurn"] as const,
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: getOverview,
  });
};

export const useDashboardBudgetChart = () => {
  return useQuery({
    queryKey: dashboardKeys.budgetChart(),
    queryFn: getOverviewBudgetChart,
  });
};

export const useDashboardRecentExpenses = () => {
  return useQuery({
    queryKey: dashboardKeys.recentExpenses(),
    queryFn: getRecentExpenses,
  });
};

export const useDashboardWeeklyBurn = () => {
  return useQuery({
    queryKey: dashboardKeys.weeklyBurn(),
    queryFn: getWeeklyBurnChart,
  });
};

