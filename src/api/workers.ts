import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface Worker {
  id: string;
  full_name: string;
  role: string;
  status: string;
  salary: number;
  joined_date: string;
  created_at?: string;
  updated_at?: string;
}

export const getWorkers = async (): Promise<Worker[]> => {
  const response = await apiRequest<ApiResponse<Worker[]>>("console/workers");
  return response.data || [];
};

export const getWorkerDetails = async (id: string): Promise<Worker> => {
  const response = await apiRequest<ApiResponse<Worker>>(`console/workers/${id}`);
  return response.data;
};

export const createWorker = async (payload: Partial<Worker>): Promise<Worker> => {
  const response = await apiRequest<ApiResponse<Worker>>("console/workers", "POST", payload);
  return response.data;
};

export const updateWorker = async (id: string, payload: Partial<Worker>): Promise<Worker> => {
  const response = await apiRequest<ApiResponse<Worker>>(`console/workers/${id}`, "PUT", payload);
  return response.data;
};

export const deleteWorker = async (id: string): Promise<void> => {
  await apiRequest(`console/workers/${id}`, "DELETE");
};
