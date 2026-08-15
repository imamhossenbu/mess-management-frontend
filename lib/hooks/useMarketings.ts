// lib/hooks/useMarketings.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  marketingsApi,
  CreateMarketingData,
  UpdateMarketingData,
} from "@/lib/api/marketings";

export function useMarketings() {
  return useQuery({
    queryKey: ["marketings"],
    queryFn: async () => {
      const response = await marketingsApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMarketing(id: string) {
  return useQuery({
    queryKey: ["marketing", id],
    queryFn: async () => {
      const response = await marketingsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDailyMarketing(date?: string) {
  return useQuery({
    queryKey: ["marketings", "daily", date],
    queryFn: async () => {
      const response = await marketingsApi.getDailySummary(date);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyMarketing(year?: number, month?: number) {
  return useQuery({
    queryKey: ["marketings", "monthly", year, month],
    queryFn: async () => {
      const response = await marketingsApi.getMonthlySummary(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ No toast here — MarketingForm shows toast.success/toast.error
// via the mutate() call options, so the hook only invalidates queries.
export function useCreateMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketingData) => {
      return marketingsApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["marketings", "monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      console.error("❌ [HOOK] Create error:", error);
    },
  });
}

// ✅ No toast here — MarketingEditModal shows toast.success/toast.error
// via the mutate() call options, so the hook only invalidates queries.
export function useUpdateMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarketingData }) => {
      return marketingsApi.update(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["marketing", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["marketings", "monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      console.error("❌ [HOOK] Update error:", error);
    },
  });
}

// ✅ No toast here — MarketingTable wraps the delete call with
// toast.promise() to show loading/success/error, so the hook only
// invalidates queries.
export function useDeleteMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return marketingsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["marketings", "monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      console.error("❌ [HOOK] Delete error:", error);
    },
  });
}
