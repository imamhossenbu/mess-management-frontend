// src/lib/api/monthly-summary.ts
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

export interface MonthlySummaryResponse {
  month: string;
  year: number;
  totalMeals: number;
  mealRate: number;
  totalMealBill: number;
  totalUtilityBill: number;
  totalBill: number;
  totalPaid: number;
  totalDue: number;
  userSummaries: UserMonthlySummary[];
}

export interface GenerateMonthlySummaryDto {
  year: number;
  month: number;
}

export const monthlySummaryApi = {
  // Generate monthly summary for a specific month
  generate: (data: GenerateMonthlySummaryDto) =>
    apiClient.post<MonthlySummaryResponse>("/monthly-summary/generate", data),

  // Get all monthly summaries
  getAll: () => apiClient.get("/monthly-summary"),

  // Get monthly summary for a specific month
  getByMonth: (year: number, month: number) =>
    apiClient.get<MonthlySummaryResponse>(
      `/monthly-summary/month?year=${year}&month=${month}`,
    ),

  // Get user's monthly summaries
  getUserSummaries: (userId: string, year?: number, month?: number) => {
    let url = `/monthly-summary/user/${userId}`;
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get(url);
  },

  // Update a monthly summary
  update: (
    id: string,
    data: {
      totalMeal?: number;
      mealRate?: number;
      mealBill?: number;
      utilityShare?: number;
      totalBill?: number;
      totalPaid?: number;
      previousDue?: number;
      currentDue?: number;
      carryToNext?: number;
    },
  ) => apiClient.patch(`/monthly-summary/${id}`, data),

  // Delete monthly summary for a specific month
  deleteByMonth: (year: number, month: number) =>
    apiClient.delete(`/monthly-summary/month/${year}/${month}`),
};
