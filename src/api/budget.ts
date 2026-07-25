import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface MonthlyBudget {
  id: string;
  year: number;
  month: number;
  budget_amount: number;
  created_at: string;
}

export const getBudget = async (): Promise<MonthlyBudget> => {
  const response = await apiRequest<ApiResponse<MonthlyBudget>>("console/budget");
  return response.data;
};

export const updateBudget = async (payload: Partial<MonthlyBudget>): Promise<MonthlyBudget> => {
  const response = await apiRequest<ApiResponse<MonthlyBudget>>("console/budget", "PUT", payload); // Assuming PUT for update
  return response.data;
};
