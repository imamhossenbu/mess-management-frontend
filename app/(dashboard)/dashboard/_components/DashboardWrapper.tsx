/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/DashboardWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AdminDashboardData, MemberDashboardData } from "@/lib/api/dashboard";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { memo, useMemo, useState } from "react";
import { MonthSelector } from "../../marketings/_components/MonthSelector";

const AdminDashboard = dynamic(
  () => import("./role-dashboards/AdminDashboard"),
  { ssr: false, loading: () => <DashboardSkeleton /> },
);

const ManagerDashboard = dynamic(
  () => import("./role-dashboards/ManagerDashboard"),
  { ssr: false, loading: () => <DashboardSkeleton /> },
);

const MemberDashboard = dynamic(
  () => import("./role-dashboards/MemberDashboard"),
  { ssr: false, loading: () => <DashboardSkeleton /> },
);

const DashboardSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    <div className="h-36 rounded-2xl bg-slate-200" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-slate-100" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-56 rounded-2xl bg-slate-100" />
      ))}
    </div>
  </div>
));
DashboardSkeleton.displayName = "DashboardSkeleton";

interface Props {
  user: any;
  role: string;
}

// ✅ Memoize with proper comparison
export const DashboardWrapper = memo(
  function DashboardWrapper({ user, role }: Props) {
    const { isLoading: authLoading } = useAuth();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

    const {
      data: stats,
      isLoading: isDashboardLoading,
      error,
      refetch,
    } = useDashboard(selectedYear, selectedMonth);

    const isLoading = authLoading || isDashboardLoading;

    const content = useMemo(() => {
      if (isLoading) {
        return <DashboardSkeleton />;
      }

      if (error) {
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold text-rose-600 mb-2">
              Failed to Load Dashboard
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              {error instanceof Error
                ? error.message
                : "Please check your connection"}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        );
      }

      if (!stats) {
        return <DashboardSkeleton />;
      }

      switch (role) {
        case "ADMIN":
          return (
            <AdminDashboard stats={stats as AdminDashboardData} user={user} />
          );
        case "MANAGER":
          return (
            <ManagerDashboard stats={stats as AdminDashboardData} user={user} />
          );
        case "MEMBER":
        default:
          return (
            <MemberDashboard stats={stats as MemberDashboardData} user={user} />
          );
      }
    }, [isLoading, error, stats, role, user, refetch]);

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <MonthSelector 
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedYear={setSelectedYear}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        {content}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // ✅ Only re-render if user or role changes
    return (
      prevProps.user?.id === nextProps.user?.id &&
      prevProps.role === nextProps.role
    );
  },
);

DashboardWrapper.displayName = "DashboardWrapper";
