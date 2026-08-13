// lib/hooks/useDashboardData.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  dashboardApi,
  AdminDashboardData,
  MemberDashboardData,
  AdminStats,
  MemberStats,
  DailyStats,
  MonthlySummary,
} from "@/lib/api/dashboard";
import { useAuth } from "./useAuth";

type DashboardData = AdminDashboardData | MemberDashboardData;

export function useDashboardData() {
  const { user, isAdmin, isManager, accessToken } = useAuth();
  const isAdminRole = isAdmin || isManager;

  console.log("📊 useDashboardData - Token exists:", !!accessToken);
  console.log("📊 useDashboardData - User:", user?.name);
  console.log("📊 useDashboardData - isAdminRole:", isAdminRole);

  return useQuery<DashboardData>({
    queryKey: ["dashboard", user?.role],
    queryFn: async () => {
      try {
        let mainStats: AdminStats | MemberStats;

        if (isAdminRole) {
          const response = await dashboardApi.getAdmin();
          mainStats = response.data as AdminStats;
        } else {
          const response = await dashboardApi.getMember();
          mainStats = response.data as MemberStats;
        }

        // Fetch daily stats (optional)
        let dailyStats: DailyStats | null = null;
        try {
          const dailyResponse = await dashboardApi.getDaily();
          dailyStats = dailyResponse.data;
        } catch (err) {
          console.warn("Daily stats not available:", err);
        }

        // Fetch monthly stats (optional)
        let monthlyStats: MonthlySummary | null = null;
        try {
          const monthlyResponse = await dashboardApi.getMonthly();
          monthlyStats = monthlyResponse.data;
        } catch (err) {
          console.warn("Monthly stats not available:", err);
        }

        // Combine all data with proper typing
        const combinedData = {
          ...mainStats,
          dailyStats,
          monthlyStats,
        };

        return combinedData as DashboardData;
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        throw error;
      }
    },
    enabled: !!user && !!accessToken,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}
