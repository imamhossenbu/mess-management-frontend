// lib/api/monthly-summary.ts
import { apiClient } from "./client";

export interface UserMonthlySummary {
  userId: string;
  userName: string;
  phone: string;
  totalMeal: number;
  mealRate: number;
  mealBill: number;
  utilityShare: number;
  totalBill: number;
  totalPaid: number;
  previousDue: number;
  currentDue: number;
  carryToNext: number;
}

export interface MonthlySummary {
  isGenerated: boolean;
  month: string;
  year: number;
  totalMeals: number;
  mealRate: number;
  totalMealBill: number;
  totalUtilityBill: number;
  totalBill: number;
  totalPaid: number;
  totalDue: number;
  adjustmentFromPrevious: number;
  adjustmentToNext: number;
  userSummaries: UserMonthlySummary[];
}

export interface GenerateMonthlySummaryData {
  year: number;
  month: number;
  adjustmentFromPrevious?: number;
  adjustmentToNext?: number;
}

export const monthlySummaryApi = {
  generate: (data: GenerateMonthlySummaryData) =>
    apiClient.post<MonthlySummary>("/monthly-summary/generate", data),

  getAll: () => apiClient.get<MonthlySummary[]>("/monthly-summary"),

  getByMonth: (year: number, month: number) =>
    apiClient.get<MonthlySummary>(
      `/monthly-summary/month?year=${year}&month=${month}`,
    ),

  getUserSummaries: (userId: string, year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(
      `/monthly-summary/user/${userId}?${params.toString()}`,
    );
  },

  update: (id: string, data: Partial<UserMonthlySummary>) =>
    apiClient.patch(`/monthly-summary/${id}`, data),

  delete: (year: number, month: number) =>
    apiClient.delete(`/monthly-summary/month/${year}/${month}`),

  // Alias for consistency
  deleteByMonth: (year: number, month: number) =>
    apiClient.delete(`/monthly-summary/month/${year}/${month}`),
};
