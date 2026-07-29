import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, getCurrentUser, getCurrentUserRole } from "@/api/auth";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const authKeys = {
  user: ["auth", "user"] as const,
  role: ["auth", "role"] as const,
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      queryClient.invalidateQueries({ queryKey: authKeys.role });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/");
    },
  });
};

export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    retry: 1,
    enabled,
  });
};

export const useCurrentUserRole = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.role,
    queryFn: getCurrentUserRole,
    enabled,
    retry: 1,
  });
};
