// src/lib/api/shop-debts.ts
import { apiClient } from "./client";

export interface ShopDebt {
  id: string;
  shopName: string;
  date: string;
  itemDetails?: string;
  amount: number;
  status: "DUE" | "PAID";
  paidDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopDebtSummary {
  totalDue: number;
  totalPaid: number;
  totalAmount: number;
  shopWiseSummary: {
    shopName: string;
    totalDue: number;
    totalPaid: number;
    totalAmount: number;
  }[];
}

export interface MonthlyShopDebtSummary {
  month: string;
  year: number;
  totalDebt: number;
  totalPaid: number;
  currentDue: number;
  debts: ShopDebt[];
}

export const shopDebtsApi = {
  // Get all shop debts
  getAll: () => apiClient.get<ShopDebt[]>("/shop-debts"),

  // Get a single shop debt by ID
  getById: (id: string) => apiClient.get<ShopDebt>(`/shop-debts/${id}`),

  // Get debts for a specific shop
  getByShop: (shopName: string) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/shop/${shopName}`),

  // Get debts by date
  getByDate: (date: string) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/date/${date}`),

  // Get debts by month
  getByMonth: (year: number, month: number) =>
    apiClient.get<ShopDebt[]>(`/shop-debts/month/${year}/${month}`),

  // Get summary
  getSummary: () => apiClient.get<ShopDebtSummary>("/shop-debts/summary"),

  // Get monthly summary
  getMonthlySummary: (year: number, month: number) =>
    apiClient.get<MonthlyShopDebtSummary>(
      `/shop-debts/monthly?year=${year}&month=${month}`,
    ),

  // Get monthly summary report
  getMonthlyReport: (year: number, month: number) =>
    apiClient.get(`/shop-debts/monthly-report?year=${year}&month=${month}`),

  // Create a new shop debt
  create: (data: {
    shopName: string;
    date?: string;
    itemDetails?: string;
    amount: number;
    status?: string;
    note?: string;
  }) => apiClient.post<ShopDebt>("/shop-debts", data),

  // Pay a debt
  pay: (id: string, paidDate?: string) =>
    apiClient.post<ShopDebt>(
      `/shop-debts/${id}/pay${paidDate ? `?paidDate=${paidDate}` : ""}`,
    ),

  // Update a shop debt
  update: (
    id: string,
    data: {
      shopName?: string;
      itemDetails?: string;
      amount?: number;
      status?: string;
      paidDate?: string;
      note?: string;
    },
  ) => apiClient.patch<ShopDebt>(`/shop-debts/${id}`, data),

  // Delete a shop debt
  delete: (id: string) => apiClient.delete(`/shop-debts/${id}`),
};
