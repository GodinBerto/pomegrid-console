import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/api/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.all,
    queryFn: getAnalytics,
  });
};
