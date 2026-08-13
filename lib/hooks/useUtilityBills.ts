/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useUtilityBills.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  utilityBillsApi,
  CreateUtilityBillData,
  UpdateUtilityBillData,
} from "@/lib/api/utility-bills";
import toast from "react-hot-toast";

export function useUtilityBills() {
  return useQuery({
    queryKey: ["utility-bills"],
    queryFn: async () => {
      const response = await utilityBillsApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUtilityBill(id: string) {
  return useQuery({
    queryKey: ["utility-bill", id],
    queryFn: async () => {
      const response = await utilityBillsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUtilityBillSummary() {
  return useQuery({
    queryKey: ["utility-bills", "summary"],
    queryFn: async () => {
      const response = await utilityBillsApi.getSummary();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyUtilityBills(year?: number, month?: number) {
  return useQuery({
    queryKey: ["utility-bills", "monthly", year, month],
    queryFn: async () => {
      const response = await utilityBillsApi.getMonthlySummary(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUtilityBillsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["utility-bills", "by-month", year, month],
    queryFn: async () => {
      const response = await utilityBillsApi.getByMonth(year, month);
      return response.data;
    },
    enabled: !!year && !!month,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateUtilityBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUtilityBillData) => utilityBillsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
      queryClient.invalidateQueries({ queryKey: ["utility-bills", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Utility bill created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create utility bill",
      );
    },
  });
}

export function useUpdateUtilityBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUtilityBillData }) =>
      utilityBillsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
      queryClient.invalidateQueries({
        queryKey: ["utility-bill", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["utility-bills", "summary"] });
      toast.success("Utility bill updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update utility bill",
      );
    },
  });
}

export function useDeleteUtilityBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => utilityBillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
      queryClient.invalidateQueries({ queryKey: ["utility-bills", "summary"] });
      toast.success("Utility bill deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete utility bill",
      );
    },
  });
}

export function useDeleteUtilityBillsByMonth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      utilityBillsApi.deleteByMonth(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
      queryClient.invalidateQueries({ queryKey: ["utility-bills", "summary"] });
      toast.success("Utility bills deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete utility bills",
      );
    },
  });
}
