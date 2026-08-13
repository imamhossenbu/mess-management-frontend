// lib/api/shop-debts.ts
import { apiClient } from "./client";

export interface ShopDebt {
  id: string;
  shopName: string;
  date: string;
  itemDetails?: string;
  amount: number;
  status: string;
  paidDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopDebtData {
  shopName: string;
  date?: string;
  itemDetails?: string;
  amount: number;
  status?: string;
  note?: string;
}

export interface UpdateShopDebtData {
  shopName?: string;
  itemDetails?: string;
  amount?: number;
  status?: string;
  paidDate?: string;
  note?: string;
}

export const shopDebtsApi = {
  // Get all shop debts
  getAll: () => apiClient.get<ShopDebt[]>("/shop-debts"),

  // Get single debt
  getOne: (id: string) => apiClient.get<ShopDebt>(`/shop-debts/${id}`),

  // Create debt
  create: (data: CreateShopDebtData) =>
    apiClient.post<ShopDebt>("/shop-debts", data),

  // Update debt
  update: (id: string, data: UpdateShopDebtData) =>
    apiClient.patch<ShopDebt>(`/shop-debts/${id}`, data),

  // Delete debt
  delete: (id: string) => apiClient.delete(`/shop-debts/${id}`),

  // Pay debt
  pay: (id: string, paidDate?: string) => {
    const url = paidDate
      ? `/shop-debts/${id}/pay?paidDate=${paidDate}`
      : `/shop-debts/${id}/pay`;
    return apiClient.post<ShopDebt>(url);
  },

  // Get by shop
  getByShop: (shopName: string) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/shop/${shopName}`),

  // Get by date
  getByDate: (date: string) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/date/${date}`),

  // Get by month
  getByMonth: (year: number, month: number) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/month/${year}/${month}`),

  // Get summary
  getSummary: () => apiClient.get("/shop-debts/summary"),

  // Get monthly summary
  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/shop-debts/monthly?${params.toString()}`);
  },

  // Get monthly report
  getMonthlyReport: (year: number, month: number) =>
    apiClient.get(`/shop-debts/monthly-report?year=${year}&month=${month}`),
};
