// lib/api/utility-bills.ts
import { apiClient } from "./client";

export interface UtilityBill {
  id: string;
  billType: string;
  monthYear: string;
  amount: number;
  paidBy?: string;
  paidByName?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUtilityBillData {
  billType: string;
  monthYear: string;
  amount: number;
  paidBy?: string;
  note?: string;
}

export interface UpdateUtilityBillData {
  billType?: string;
  amount?: number;
  paidBy?: string;
  note?: string;
}

export const utilityBillsApi = {
  // Get all utility bills
  getAll: () => apiClient.get<UtilityBill[]>("/utility-bills"),

  // Get single bill
  getOne: (id: string) => apiClient.get<UtilityBill>(`/utility-bills/${id}`),

  // Create bill
  create: (data: CreateUtilityBillData) =>
    apiClient.post<UtilityBill>("/utility-bills", data),

  // Update bill
  update: (id: string, data: UpdateUtilityBillData) =>
    apiClient.patch<UtilityBill>(`/utility-bills/${id}`, data),

  // Delete bill
  delete: (id: string) => apiClient.delete(`/utility-bills/${id}`),

  // Get by month
  getByMonth: (year: number, month: number) =>
    apiClient.get<UtilityBill[]>(`/utility-bills/month/${year}/${month}`),

  // Get monthly summary
  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/utility-bills/monthly?${params.toString()}`);
  },

  // Get summary
  getSummary: () => apiClient.get("/utility-bills/summary"),

  // Delete by month
  deleteByMonth: (year: number, month: number) =>
    apiClient.delete(`/utility-bills/month/${year}/${month}`),
};
