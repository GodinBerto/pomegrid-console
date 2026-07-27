import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationSettings, updateNotificationSettings, updatePassword } from "@/api/settings";
import { toast } from "sonner";

export const settingsKeys = {
  notifications: ["settings", "notifications"] as const,
};

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: settingsKeys.notifications,
    queryFn: getNotificationSettings,
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      toast.success("Notifications saved");
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save notifications: ${error.message}`);
    }
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update password: ${error.message}`);
    }
  });
};
