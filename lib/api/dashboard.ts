/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/dashboard.ts
import { apiClient } from "./client";

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalMealsToday: number;
  totalMealsThisMonth: number;
  totalMarketingCostThisMonth: number;
  totalUtilityCostThisMonth: number;
  totalCostThisMonth: number;
  totalPaymentsThisMonth: number;
  totalDue: number;
  mealRate: number;
  inventory: {
    meat: number;
    fish: number;
  };
  recentActivities: {
    meals: any[];
    marketings: any[];
    payments: any[];
  };
}

export const dashboardApi = {
  getAdmin: () => apiClient.get<DashboardStats>("/dashboard/admin"),

  getMember: () => apiClient.get("/dashboard/member"),

  getDaily: (date?: string) =>
    apiClient.get(`/dashboard/daily${date ? `?date=${date}` : ""}`),

  getMonthly: (year?: number, month?: number) => {
    let url = "/dashboard/monthly";
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get(url);
  },
};
