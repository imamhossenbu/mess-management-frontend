// lib/api/shop-debts.ts
import { apiClient } from "./client";

export interface ShopDebt {
  id: string;
  shopName: string;
  date: string;
  itemDetails?: string;
  amount: number;
  note?: string;
  recordedById?: string;
  recordedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopPayment {
  id: string;
  shopName: string;
  date: string;
  amount: number;
  note?: string;
  paidById?: string;
  paidByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopDebtData {
  shopName: string;
  date?: string;
  itemDetails?: string;
  amount: number;
  note?: string;
}

export interface CreateShopPaymentData {
  shopName: string;
  date?: string;
  amount: number;
  note?: string;
}

export interface UpdateShopDebtData {
  shopName?: string;
  itemDetails?: string;
  amount?: number;
  note?: string;
}

export const shopDebtsApi = {
  // Create debt
  createDebt: (data: CreateShopDebtData) =>
    apiClient.post<ShopDebt>("/shop-debts/debt", data),

  // Create bulk debt
  createBulkDebt: (data: { items: CreateShopDebtData[] }) =>
    apiClient.post<ShopDebt[]>("/shop-debts/debt/bulk", data),

  // Create payment
  createPayment: (data: CreateShopPaymentData) =>
    apiClient.post<ShopPayment>("/shop-debts/payment", data),

  // Get summary
  getSummary: () => apiClient.get("/shop-debts/summary"),

  // Get monthly data (debts & payments)
  getMonthlyData: (year?: number, month?: number, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`/shop-debts/monthly?${params.toString()}`);
  },

  // Update debt
  updateDebt: (id: string, data: UpdateShopDebtData) =>
    apiClient.patch<ShopDebt>(`/shop-debts/debt/${id}`, data),

  // Update payment
  updatePayment: (id: string, data: any) =>
    apiClient.patch<ShopPayment>(`/shop-debts/payment/${id}`, data),

  // Delete debt
  deleteDebt: (id: string) => apiClient.delete(`/shop-debts/debt/${id}`),

  // Delete payment
  deletePayment: (id: string) => apiClient.delete(`/shop-debts/payment/${id}`),
};
