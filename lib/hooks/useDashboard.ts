/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
// lib/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "./useAuth";
import { useMemo, useRef } from "react";

// ✅ Singleton cache
let cachedData: any = null;
let fetchPromise: Promise<any> | null = null;

export function useDashboard() {
  const { user, isAdmin, isManager, accessToken, isAuthenticated } = useAuth();
  const isAdminRole = isAdmin || isManager;
  const renderCount = useRef(0);
  renderCount.current += 1;

  // ✅ Stable query key - user ID only
  const queryKey = useMemo(() => {
    return ["dashboard", user?.id || "guest"];
  }, [user?.id]);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      // ✅ Return cached data immediately
      if (cachedData) {
        console.log(`📦 [${renderCount.current}] Using cached data`);
        return cachedData;
      }

      // ✅ Prevent duplicate requests
      if (fetchPromise) {
        console.log(`⏳ [${renderCount.current}] Waiting for existing request`);
        return fetchPromise;
      }

      console.log(`🌐 [${renderCount.current}] Fetching fresh data`);
      fetchPromise = (async () => {
        try {
          const response = isAdminRole
            ? await dashboardApi.getAdmin()
            : await dashboardApi.getMember();
          cachedData = response.data;
          console.log(`✅ [${renderCount.current}] Data fetched`);
          return cachedData;
        } catch (error) {
          console.error(`❌ [${renderCount.current}] Fetch failed:`, error);
          throw error;
        } finally {
          fetchPromise = null;
        }
      })();

      return fetchPromise;
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
