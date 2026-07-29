import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface UserRoleAssignment {
  id: string; // The user ID or assignment ID
  name: string; // User name
  email: string;
  role: string;
  created_at: string;
}

export const getRoles = async (): Promise<UserRoleAssignment[]> => {
  const response =
    await apiRequest<ApiResponse<UserRoleAssignment[]>>("console/roles");
  return response.data || [];
};

export const assignRole = async (payload: {
  user_id: string;
  role: string;
}): Promise<UserRoleAssignment> => {
  const response = await apiRequest<ApiResponse<UserRoleAssignment>>(
    "console/roles/assign",
    "POST",
    payload,
  );
  return response.data;
};
