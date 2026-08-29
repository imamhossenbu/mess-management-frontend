/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
// lib/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "./useAuth";
import { useMemo, useRef } from "react";

export function useDashboard(year?: number, month?: number) {
  const { user, isAdmin, isManager, accessToken, isAuthenticated } = useAuth();
  const isAdminRole = isAdmin || isManager;
  const renderCount = useRef(0);
  renderCount.current += 1;

  // ✅ Stable query key - user ID and month/year
  const queryKey = useMemo(() => {
    return ["dashboard", user?.id || "guest", year, month];
  }, [user?.id, year, month]);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log(`🌐 [${renderCount.current}] Fetching fresh data for ${year}-${month}`);
      try {
        const response = isAdminRole
          ? await dashboardApi.getAdmin(year, month)
          : await dashboardApi.getMember(year, month);
        console.log(`✅ [${renderCount.current}] Data fetched`);
        return response.data;
      } catch (error) {
        console.error(`❌ [${renderCount.current}] Fetch failed:`, error);
        throw error;
      }
    },
    enabled: isAuthenticated && !!user && !!accessToken,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    // ✅ Don't auto refetch
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}
