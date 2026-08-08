// src/lib/api/utility-bills.ts
import { apiClient } from "./client";

export interface UtilityBill {
  id: string;
  billType: "CURRENT" | "WIFI" | "RENT" | "WATER" | "KHALA";
  monthYear: string;
  amount: number;
  paidBy?: string;
  paidByName?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyUtilitySummary {
  month: string;
  year: number;
  totalCurrent: number;
  totalWifi: number;
  totalRent: number;
  totalWater: number;
  totalKhala: number;
  totalAmount: number;
  perPersonShare: number;
  totalMembers: number;
  bills: UtilityBill[];
}

export interface UtilityBillSummary {
  totalCurrent: number;
  totalWifi: number;
  totalRent: number;
  totalWater: number;
  totalKhala: number;
  totalAmount: number;
  perPersonShare: number;
  totalMembers: number;
}

export const utilityBillsApi = {
  // Get all utility bills
  getAll: () => apiClient.get<UtilityBill[]>("/utility-bills"),

  // Get a single utility bill by ID
  getById: (id: string) => apiClient.get<UtilityBill>(`/utility-bills/${id}`),

  // Get bills for a specific month
  getByMonth: (year: number, month: number) =>
    apiClient.get<UtilityBill[]>(`/utility-bills/month/${year}/${month}`),

  // Get monthly summary
  getMonthlySummary: (year: number, month: number) =>
    apiClient.get<MonthlyUtilitySummary>(
      `/utility-bills/monthly?year=${year}&month=${month}`,
    ),

  // Get overall summary
  getSummary: () => apiClient.get<UtilityBillSummary>("/utility-bills/summary"),

  // Create a new utility bill
  create: (data: {
    billType: string;
    monthYear: string;
    amount: number;
    paidBy?: string;
    note?: string;
  }) => apiClient.post<UtilityBill>("/utility-bills", data),

  // Update a utility bill
  update: (
    id: string,
    data: {
      billType?: string;
      amount?: number;
      paidBy?: string;
      note?: string;
    },
  ) => apiClient.patch<UtilityBill>(`/utility-bills/${id}`, data),

  // Delete a utility bill
  delete: (id: string) => apiClient.delete(`/utility-bills/${id}`),

  // Delete all bills for a month
  deleteByMonth: (year: number, month: number) =>
    apiClient.delete(`/utility-bills/month/${year}/${month}`),
};
