import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  assignRole,
} from "@/api/roles";
import { toast } from "sonner";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: () => [...roleKeys.lists()] as const,
};

export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: getRoles,
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignRole,
    onSuccess: () => {
      toast.success("Role assigned successfully");
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    },
  });
};
