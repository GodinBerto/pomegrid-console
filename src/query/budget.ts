import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudget, updateBudget, MonthlyBudget } from "@/api/budget";
import { toast } from "sonner";

export const budgetKeys = {
  all: ["budget"] as const,
  current: () => [...budgetKeys.all, "current"] as const,
};

export const useBudget = () => {
  return useQuery({
    queryKey: budgetKeys.current(),
    queryFn: getBudget,
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      toast.success("Budget updated successfully");
      queryClient.invalidateQueries({ queryKey: budgetKeys.current() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
};
