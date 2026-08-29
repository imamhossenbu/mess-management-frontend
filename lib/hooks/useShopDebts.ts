import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopDebtsApi } from "../api/shop-debts";

export const useShopDebtSummary = () => {
  return useQuery({
    queryKey: ["shop-debts-summary"],
    queryFn: async () => {
      const { data } = await shopDebtsApi.getSummary();
      return data;
    },
  });
};

export const useShopDebtsMonthly = (year: number, month: number) => {
  return useQuery({
    queryKey: ["shop-debts-monthly", year, month],
    queryFn: async () => {
      const { data } = await shopDebtsApi.getMonthlyData(year, month);
      return data;
    },
  });
};

export const useCreateShopDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await shopDebtsApi.createDebt(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts-monthly"] });
    },
  });
};

export const useCreateBulkShopDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { items: any[] }) => {
      const { data } = await shopDebtsApi.createBulkDebt(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts-monthly"] });
    },
  });
};

export const useCreateShopPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await shopDebtsApi.createPayment(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts-monthly"] });
    },
  });
};

export const useDeleteShopDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await shopDebtsApi.deleteDebt(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts-monthly"] });
    },
  });
};

export const useDeleteShopPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await shopDebtsApi.deletePayment(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-debts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["shop-debts-monthly"] });
    },
  });
};
