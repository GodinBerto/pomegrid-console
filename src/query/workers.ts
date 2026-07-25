import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkers,
  getWorkerDetails,
  createWorker,
  updateWorker,
  deleteWorker,
  Worker,
} from "@/api/workers";
import { toast } from "sonner";

export const workerKeys = {
  all: ["workers"] as const,
  lists: () => [...workerKeys.all, "list"] as const,
  list: () => [...workerKeys.lists()] as const,
  details: () => [...workerKeys.all, "detail"] as const,
  detail: (id: string) => [...workerKeys.details(), id] as const,
};

export const useWorkers = () => {
  return useQuery({
    queryKey: workerKeys.list(),
    queryFn: getWorkers,
  });
};

export const useWorker = (id: string) => {
  return useQuery({
    queryKey: workerKeys.detail(id),
    queryFn: () => getWorkerDetails(id),
    enabled: !!id,
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      toast.success("Worker created successfully");
      queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create worker: ${error.message}`);
    },
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Worker> }) =>
      updateWorker(id, payload),
    onSuccess: (data, variables) => {
      toast.success("Worker updated successfully");
      queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workerKeys.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update worker: ${error.message}`);
    },
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      toast.success("Worker deleted successfully");
      queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete worker: ${error.message}`);
    },
  });
};
