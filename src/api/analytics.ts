import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface AnalyticsEfficiency {
  name: string;
  value: number;
  fill: string;
}

export interface AnalyticsSavings {
  month: string;
  actual: number;
  budget: number;
}

export interface AnalyticsCategory {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsWeeklyBurn {
  day: string;
  spend: number;
}

export interface AnalyticsData {
  efficiency: AnalyticsEfficiency[];
  savings: AnalyticsSavings[];
  category_momentum: AnalyticsCategory[];
  weekly_rhythm: AnalyticsWeeklyBurn[];
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await apiRequest<ApiResponse<AnalyticsData>>("console/analytics");
  return response.data;
};
