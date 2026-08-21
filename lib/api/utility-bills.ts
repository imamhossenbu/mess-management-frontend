// lib/api/utility-bills.ts
import { apiClient } from "./client";

export type BillType = "CURRENT" | "WIFI" | "RENT" | "WATER" | "KHALA";

export interface UtilityBill {
  id: string;
  billType: BillType;
  monthYear: string;
  amount: number;
  paidBy?: string;
  paidByName?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUtilityBillData {
  billType: BillType;
  monthYear: string;
  amount: number;
  paidBy?: string;
  note?: string;
}

export interface UpdateUtilityBillData {
  billType?: BillType;
  amount?: number;
  paidBy?: string;
  note?: string;
  monthYear?: string;
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

export const utilityBillsApi = {
  getAll: () => apiClient.get<UtilityBill[]>("/utility-bills"),
  getOne: (id: string) => apiClient.get<UtilityBill>(`/utility-bills/${id}`),
  create: (data: CreateUtilityBillData) =>
    apiClient.post<UtilityBill>("/utility-bills", data),
  update: (id: string, data: UpdateUtilityBillData) =>
    apiClient.patch<UtilityBill>(`/utility-bills/${id}`, data),
  delete: (id: string) => apiClient.delete(`/utility-bills/${id}`),
  getByMonth: (year: number, month: number) =>
    apiClient.get<UtilityBill[]>(`/utility-bills/month/${year}/${month}`),
  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get<MonthlyUtilitySummary>(
      `/utility-bills/monthly?${params.toString()}`,
    );
  },
  getSummary: () => apiClient.get("/utility-bills/summary"),
  deleteByMonth: (year: number, month: number) =>
    apiClient.delete(`/utility-bills/month/${year}/${month}`),
};
