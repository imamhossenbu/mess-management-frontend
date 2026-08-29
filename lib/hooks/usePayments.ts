/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentsApi,
  CreatePaymentData,
  UpdatePaymentData,
} from "@/lib/api/payments";
import toast from "react-hot-toast";

// Get all payments
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await paymentsApi.getAll();
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Get payments by month
export function usePaymentsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["payments", "month", year, month],
    queryFn: async () => {
      const res = await paymentsApi.getByMonth(year, month);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}


// Get single payment
export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const res = await paymentsApi.getOne(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// Get user payments
export function useUserPayments(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: ["payments", "user", userId, startDate, endDate],
    queryFn: async () => {
      const res = await paymentsApi.getByUser(userId, startDate, endDate);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get user balance
export function useUserBalance(userId: string) {
  return useQuery({
    queryKey: ["payments", "balance", userId],
    queryFn: async () => {
      const res = await paymentsApi.getUserBalance(userId);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get all user balances
export function useAllUserBalances(year?: number, month?: number) {
  return useQuery({
    queryKey: ["payments", "all-balances", year, month],
    queryFn: async () => {
      const res = await paymentsApi.getAllBalances(year, month);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Get monthly payments
export function useMonthlyPayments(year?: number, month?: number) {
  return useQuery({
    queryKey: ["payments", "monthly", year, month],
    queryFn: async () => {
      const res = await paymentsApi.getMonthlySummary(year, month);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Create payment
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

// Update payment
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

// Delete payment
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
