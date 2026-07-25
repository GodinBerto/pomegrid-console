import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiRequest<ApiResponse<Category[]>>("console/categories");
  return response.data || [];
};

export const getCategoryDetails = async (id: string): Promise<Category> => {
  const response = await apiRequest<ApiResponse<Category>>(`console/categories/${id}`);
  return response.data;
};

export const createCategory = async (payload: Partial<Category>): Promise<Category> => {
  const response = await apiRequest<ApiResponse<Category>>("console/categories", "POST", payload);
  return response.data;
};

export const updateCategory = async (id: string, payload: Partial<Category>): Promise<Category> => {
  const response = await apiRequest<ApiResponse<Category>>(`console/categories/${id}`, "PUT", payload);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiRequest(`console/categories/${id}`, "DELETE");
};
