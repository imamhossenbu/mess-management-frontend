// app/(dashboard)/dashboard/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useMess } from "@/lib/hooks/useMess";
import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  Users,
  Utensils,
  ShoppingBag,
  Package,
  CreditCard,
  DollarSign,
  TrendingUp,
  Percent,
  Activity,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, isManager } = useAuth();
  const { currentMess } = useMess();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats", currentMess?.id],
    queryFn: async () => {
      if (isManager) {
        const response = await dashboardApi.getAdmin();
        return response.data;
      } else {
        const response = await dashboardApi.getMember();
        // Wrap response in admin-compatible structure if member endpoint shape differs slightly
        return response.data;
      }
    },
    enabled: !!currentMess,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">Failed to load dashboard metrics.</p>
        <p className="text-sm text-slate-400 mt-1">Please make sure the backend server is running.</p>
      </div>
    );
  }

  // Fallback defaults in case backend response doesn't match typing exactly
  const displayStats = [
    {
      label: "Active / Total Members",
      value: `${stats?.activeMembers ?? 0} / ${stats?.totalMembers ?? 0}`,
      icon: Users,
      color: "bg-blue-500",
      description: "Registered mess members",
    },
    {
      label: "Today's Total Meals",
      value: stats?.totalMealsToday ?? 0,
      icon: Utensils,
      color: "bg-emerald-500",
      description: "Count of all meals booked today",
    },
    {
      label: "Monthly Bazar Cost",
      value: `৳ ${(stats?.totalMarketingCostThisMonth ?? 0).toLocaleString()}`,
      icon: ShoppingBag,
      color: "bg-amber-500",
      description: "Total marketing expense",
    },
    {
      label: "Current Meal Rate",
      value: `৳ ${Number(stats?.mealRate ?? 0).toFixed(2)}`,
      icon: Percent,
      color: "bg-indigo-500",
      description: "Bazar cost / monthly meals",
    },
    {
      label: "Total Payments",
      value: `৳ ${(stats?.totalPaymentsThisMonth ?? 0).toLocaleString()}`,
      icon: CreditCard,
      color: "bg-teal-500",
      description: "Total deposits by members",
    },
    {
      label: "Total Due",
      value: `৳ ${(stats?.totalDue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-rose-500",
      description: "Outstanding outstanding dues",
    },
    {
      label: "Inventory (Meat / Fish)",
      value: `${stats?.inventory?.meat ?? 0}kg / ${stats?.inventory?.fish ?? 0}kg`,
      icon: Package,
      color: "bg-orange-500",
      description: "Food stock in freezer",
    },
    {
      label: "Total Utility Share",
      value: `৳ ${(stats?.totalUtilityCostThisMonth ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-violet-500",
      description: "Rent, Wifi, Bills share",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {user?.name}! Here is the live status of{" "}
          <span className="font-semibold text-primary-600">{currentMess?.name}</span>.
        </p>
      </div>

      {/* Quick Actions for Members & Admins */}
      <div className="flex flex-wrap gap-3">
        <Link href="/meals">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition shadow-sm cursor-pointer">
            <Utensils className="w-4 h-4" /> Book/Log Meals
          </button>
        </Link>
        <Link href="/marketings">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
            <Plus className="w-4 h-4 text-slate-500" /> Add Bazar Entry
          </button>
        </Link>
        <Link href="/payments">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
            <CreditCard className="w-4 h-4 text-slate-500" /> Deposit Money
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border border-slate-100/80 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.color} p-2.5 rounded-xl text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal Logs Activity */}
        <Card className="p-6 bg-white border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary-500" /> Recent Meal Logs
            </h2>
            <Link href="/meals" className="text-xs text-primary-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentActivities?.meals && stats.recentActivities.meals.length > 0 ? (
              stats.recentActivities.meals.slice(0, 5).map((meal: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{meal.userName || meal.userId}</p>
                    <p className="text-xs text-slate-400">
                      Morning: {meal.morning ? "✅" : "❌"} | Lunch: {meal.lunch ? "✅" : "❌"} | Dinner: {meal.dinner ? "✅" : "❌"}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{format(new Date(meal.date), "MMM dd")}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent meal entries.</p>
            )}
          </div>
        </Card>

        {/* Bazar Activity */}
        <Card className="p-6 bg-white border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" /> Recent Bazar Purchases
            </h2>
            <Link href="/marketings" className="text-xs text-primary-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentActivities?.marketings && stats.recentActivities.marketings.length > 0 ? (
              stats.recentActivities.marketings.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.itemName}</p>
                    <p className="text-xs text-slate-400">Bought by {item.userName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">৳{Number(item.amount).toLocaleString()}</p>
                    <span className="text-[10px] text-slate-400">{format(new Date(item.date), "MMM dd")}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent bazar purchases.</p>
            )}
          </div>
        </Card>

        {/* Payments Activity */}
        <Card className="p-6 bg-white border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" /> Recent Deposits
            </h2>
            <Link href="/payments" className="text-xs text-primary-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentActivities?.payments && stats.recentActivities.payments.length > 0 ? (
              stats.recentActivities.payments.slice(0, 5).map((payment: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{payment.userName}</p>
                    <p className="text-xs text-slate-400 capitalize">{payment.paymentMethod?.toLowerCase()} deposit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">+৳{Number(payment.amount).toLocaleString()}</p>
                    <span className="text-[10px] text-slate-400">{format(new Date(payment.paymentDate), "MMM dd")}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent payments logged.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
