// lib/hooks/useMarketings.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  marketingsApi,
  CreateMarketingData,
  UpdateMarketingData,
} from "@/lib/api/marketings";
import toast from "react-hot-toast";

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
      console.log("📦 Monthly marketing response:", response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketingData) => marketingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // ✅ Only show toast here, not in component
      toast.success("Bazar entry created successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create bazar entry";
      toast.error(message);
      console.error("❌ Create marketing error:", error);
    },
  });
}
export function useUpdateMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarketingData }) =>
      marketingsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["marketing", variables.id] });
      toast.success("Bazar entry updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update bazar entry",
      );
    },
  });
}

export function useDeleteMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Bazar entry deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete bazar entry",
      );
    },
  });
}
