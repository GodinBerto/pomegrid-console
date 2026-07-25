import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/api/categories";
import { toast } from "sonner";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryDetails(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) =>
      updateCategory(id, payload),
    onSuccess: (data, variables) => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
};
