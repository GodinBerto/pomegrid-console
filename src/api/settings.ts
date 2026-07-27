import { apiRequest } from "@/lib/useClient";
import { ApiResponse } from "./auth";

export interface NotificationSettings {
  budget: boolean;
  payroll: boolean;
  weekly: boolean;
}

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiRequest<ApiResponse<NotificationSettings>>("console/settings/notifications");
  return response.data;
};

export const updateNotificationSettings = async (prefs: NotificationSettings): Promise<void> => {
  await apiRequest<ApiResponse<null>>("console/settings/notifications", "PUT", prefs);
};

export const updatePassword = async (passwords: any): Promise<void> => {
  await apiRequest<ApiResponse<null>>("console/settings/password", "PUT", passwords);
};
