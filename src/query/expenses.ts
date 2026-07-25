import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExpenses,
  getExpenseDetails,
  createExpense,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
  Expense,
} from "@/api/expenses";
import { toast } from "sonner";

export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: () => [...expenseKeys.lists()] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export const useExpenses = () => {
  return useQuery({
    queryKey: expenseKeys.list(),
    queryFn: getExpenses,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => getExpenseDetails(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create expense: ${error.message}`);
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Expense> }) =>
      updateExpense(id, payload),
    onSuccess: (data, variables) => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update expense: ${error.message}`);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete expense: ${error.message}`);
    },
  });
};

export const useUpdateExpenseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateExpenseStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success("Expense status updated successfully");
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update expense status: ${error.message}`);
    },
  });
};
