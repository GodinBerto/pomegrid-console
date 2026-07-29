import { apiRequest, setAuthSession, clearAuthSession } from "@/lib/useClient";
import { User, UserRole } from "@/store/store";

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}

export const login = async (credentials: any) => {
  const response = await apiRequest<ApiResponse<any>>(
    "auth/login",
    "POST",
    credentials,
  );
  if (response.data?.access_token) {
    setAuthSession(
      response.data.access_token,
      response.data.csrf_token,
      response.data.refresh_token,
    );
  }

  return response.data;
};

export const logout = async () => {
  try {
    await apiRequest("auth/signout", "POST", undefined, false, {
      skipRefresh: true,
    });
  } catch (e) {
    // Ignore errors on logout
  } finally {
    clearAuthSession();
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiRequest<ApiResponse<User>>("auth/me");
  return response.data;
};

export const getCurrentUserRole = async (): Promise<UserRole[]> => {
  const response =
    await apiRequest<ApiResponse<UserRole[]>>("console/roles/user");
  return response.data;
};
