import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface Expense {
  id: string;
  expense_number: string;
  category_id: string;
  category_name: string;
  vendor_name: string;
  amount: number;
  description: string;
  expense_date: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await apiRequest<ApiResponse<Expense[]>>("console/expenses");
  return response.data || [];
};

export const getExpenseDetails = async (id: string): Promise<Expense> => {
  const response = await apiRequest<ApiResponse<Expense>>(`console/expenses/${id}`);
  return response.data;
};

export const createExpense = async (payload: Partial<Expense>): Promise<Expense> => {
  const response = await apiRequest<ApiResponse<Expense>>("console/expenses", "POST", payload);
  return response.data;
};

export const updateExpense = async (id: string, payload: Partial<Expense>): Promise<Expense> => {
  const response = await apiRequest<ApiResponse<Expense>>(`console/expenses/${id}`, "PUT", payload);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await apiRequest(`console/expenses/${id}`, "DELETE");
};

export const updateExpenseStatus = async (id: string, status: string): Promise<Expense> => {
  const response = await apiRequest<ApiResponse<Expense>>(`console/expenses/${id}/status`, "PUT", { status });
  return response.data;
};
