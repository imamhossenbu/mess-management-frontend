/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentsApi,
  CreatePaymentData,
  UpdatePaymentData,
} from "@/lib/api/payments";
import toast from "react-hot-toast";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await paymentsApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const response = await paymentsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserPayments(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: ["payments", "user", userId, startDate, endDate],
    queryFn: async () => {
      const response = await paymentsApi.getByUser(userId, startDate, endDate);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserBalance(userId: string) {
  return useQuery({
    queryKey: ["payments", "balance", userId],
    queryFn: async () => {
      const response = await paymentsApi.getUserBalance(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAllUserBalances() {
  return useQuery({
    queryKey: ["payments", "all-balances"],
    queryFn: async () => {
      const response = await paymentsApi.getAllBalances();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyPayments(year?: number, month?: number) {
  return useQuery({
    queryKey: ["payments", "monthly", year, month],
    queryFn: async () => {
      const response = await paymentsApi.getMonthlySummary(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentData) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "all-balances"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment");
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentData }) =>
      paymentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payments", "all-balances"] });
      toast.success("Payment updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update payment");
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "all-balances"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete payment");
    },
  });
}
