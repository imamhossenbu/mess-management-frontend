/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useShopDebts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  shopDebtsApi,
  CreateShopDebtData,
  UpdateShopDebtData,
} from "@/lib/api/shop-debts";
import toast from "react-hot-toast";

export function useShopDebts() {
  return useQuery({
    queryKey: ["shop-debts"],
    queryFn: async () => {
      const response = await shopDebtsApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useShopDebt(id: string) {
  return useQuery({
    queryKey: ["shop-debt", id],
    queryFn: async () => {
      const response = await shopDebtsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useShopDebtSummary() {
  return useQuery({
    queryKey: ["shop-debts", "summary"],
    queryFn: async () => {
      const response = await shopDebtsApi.getSummary();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyShopDebts(year?: number, month?: number) {
  return useQuery({
    queryKey: ["shop-debts", "monthly", year, month],
    queryFn: async () => {
      const response = await shopDebtsApi.getMonthlySummary(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopDebtsByShop(shopName: string) {
  return useQuery({
    queryKey: ["shop-debts", "shop", shopName],
    queryFn: async () => {
      const response = await shopDebtsApi.getByShop(shopName);
      return response.data;
    },
    enabled: !!shopName,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateShopDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShopDebtData) => shopDebtsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Shop debt created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create shop debt",
      );
    },
  });
}

export function usePayShopDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paidDate }: { id: string; paidDate?: string }) =>
      shopDebtsApi.pay(id, paidDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debt", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts", "summary"] });
      toast.success("Shop debt paid successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to pay shop debt");
    },
  });
}

export function useUpdateShopDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopDebtData }) =>
      shopDebtsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debt", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts", "summary"] });
      toast.success("Shop debt updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update shop debt",
      );
    },
  });
}

export function useDeleteShopDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shopDebtsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts", "summary"] });
      toast.success("Shop debt deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete shop debt",
      );
    },
  });
}
