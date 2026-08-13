// lib/api/dashboard.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./client";

export interface BaseStats {
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
}

export interface AdminStats extends BaseStats {
  inventory: {
    meat: number;
    fish: number;
  };
  recentActivities: {
    meals: any[];
    marketings: any[];
    payments: any[];
  };
  mealsBreakfast?: number;
  mealsLunch?: number;
  mealsDinner?: number;
}

export interface MemberStats {
  userId: string;
  userName: string;
  totalMealThisMonth: number;
  mealBillThisMonth: number;
  utilityShareThisMonth: number;
  totalBillThisMonth: number;
  totalPaidThisMonth: number;
  currentBalance: number;
  recentPayments: any[];
  recentMeals?: any[];
  mealRate?: number;
}

export interface DailyStats {
  date: string;
  totalMeals: number;
  totalMorning: number;
  totalLunch: number;
  totalDinner: number;
  totalMarketingCost: number;
  mealRate: number;
}

// ✅ Rename to avoid conflict with monthly-summary
export interface DashboardMonthlySummary {
  month: string;
  year: number;
  totalMeals: number;
  totalMarketingCost: number;
  totalUtilityCost: number;
  totalCost: number;
  totalPayments: number;
  totalDue: number;
  mealRate: number;
  totalMembers: number;
  userSummaries: Array<{
    userId: string;
    userName: string;
    userPhone?: string;
    userEmail?: string;
    totalMeal: number;
    mealBill: number;
    utilityShare: number;
    totalBill: number;
    totalPaid: number;
    previousDue: number;
    currentDue: number;
  }>;
}

export interface AdminDashboardData extends AdminStats {
  dailyStats: DailyStats | null;
  monthlyStats: DashboardMonthlySummary | null;
}

export interface MemberDashboardData extends MemberStats {
  dailyStats: DailyStats | null;
  monthlyStats: DashboardMonthlySummary | null;
}

export function isAdminDashboardData(stats: any): stats is AdminDashboardData {
  return (
    stats &&
    typeof stats === "object" &&
    "inventory" in stats &&
    "recentActivities" in stats &&
    "totalMembers" in stats &&
    "activeMembers" in stats
  );
}

export function isMemberDashboardData(
  stats: any,
): stats is MemberDashboardData {
  return (
    stats &&
    typeof stats === "object" &&
    "userId" in stats &&
    "currentBalance" in stats &&
    "userName" in stats
  );
}

export const dashboardApi = {
  getAdmin: () => apiClient.get<AdminStats>("/dashboard/admin"),

  getMember: () => apiClient.get<MemberStats>("/dashboard/member"),

  getDaily: (date?: string) => {
    const url = date ? `/dashboard/daily?date=${date}` : "/dashboard/daily";
    return apiClient.get<DailyStats>(url);
  },

  getMonthly: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const queryString = params.toString();
    return apiClient.get<DashboardMonthlySummary>(
      `/dashboard/monthly${queryString ? `?${queryString}` : ""}`,
    );
  },
};
