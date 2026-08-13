/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/role-dashboards/SuperAdminDashboard.tsx
"use client";

import {
  Users,
  Utensils,
  ShoppingBag,
  CreditCard,
  Percent,
  Package,
  TrendingUp,
  AlertCircle,
  Calendar,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { HeroBanner } from "../shared/HeroBanner";
import { StatCard } from "../shared/StatCard";
import { ActivityList } from "../shared/ActivityList";
import { AdminDashboardData } from "@/lib/api/dashboard";

interface SuperAdminDashboardProps {
  stats: AdminDashboardData;
  user: any;
}

export default function SuperAdminDashboard({
  stats,
  user,
}: SuperAdminDashboardProps) {
  // Use safe defaults
  const safeStats = stats || {
    totalMembers: 0,
    activeMembers: 0,
    totalMealsToday: 0,
    totalMealsThisMonth: 0,
    totalMarketingCostThisMonth: 0,
    totalUtilityCostThisMonth: 0,
    totalCostThisMonth: 0,
    totalPaymentsThisMonth: 0,
    totalDue: 0,
    mealRate: 0,
    inventory: { meat: 0, fish: 0 },
    recentActivities: { meals: [], marketings: [], payments: [] },
    dailyStats: null,
    monthlyStats: null,
  };

  const statCards = [
    {
      label: "Active Members",
      value: `${safeStats.activeMembers ?? 0} / ${safeStats.totalMembers ?? 0}`,
      description: "Active / Total",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Today's Meals",
      value: safeStats.totalMealsToday ?? 0,
      description: "Total meal count today",
      icon: Utensils,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Monthly Bazar",
      value: `৳ ${(safeStats.totalMarketingCostThisMonth ?? 0).toLocaleString()}`,
      description: "Total marketing expense",
      icon: ShoppingBag,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Meal Rate",
      value: `৳ ${Number(safeStats.mealRate ?? 0).toFixed(2)}`,
      description: "Per meal cost",
      icon: Percent,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Total Payments",
      value: `৳ ${(safeStats.totalPaymentsThisMonth ?? 0).toLocaleString()}`,
      description: "Deposits this month",
      icon: CreditCard,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      label: "Total Due",
      value: `৳ ${(safeStats.totalDue ?? 0).toLocaleString()}`,
      description: "Outstanding balances",
      icon: AlertCircle,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      label: "Inventory (Meat/Fish)",
      value: `${safeStats.inventory?.meat ?? 0}kg / ${safeStats.inventory?.fish ?? 0}kg`,
      description: "Freezer stock",
      icon: Package,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Utility Share",
      value: `৳ ${(safeStats.totalUtilityCostThisMonth ?? 0).toLocaleString()}`,
      description: "Rent, Wifi, Bills",
      icon: TrendingUp,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  const quickActions = [
    { href: "/users", label: "Manage Members", icon: Users },
    { href: "/users/create", label: "Add Member", icon: Plus },
    { href: "/meals", label: "Log Meals", icon: Utensils },
    { href: "/marketings", label: "Add Bazar", icon: ShoppingBag },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/monthly-summary", label: "Summary", icon: Calendar },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="SUPER_ADMIN" />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        {quickActions.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-all cursor-pointer">
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} delay={i} />
          ))}
        </div>
      </div>

      {/* Activity feeds */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActivityList
            title="Recent Meal Logs"
            icon={Utensils}
            iconColor="text-primary-500"
            items={safeStats.recentActivities?.meals ?? []}
            emptyText="No recent meal entries"
            href="/meals"
            renderItem={(meal, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {meal.userName || meal.member?.user?.name || meal.userId}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {meal.morning && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                        M
                      </span>
                    )}
                    {meal.lunch && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        L
                      </span>
                    )}
                    {meal.dinner && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                        D
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {format(new Date(meal.date), "MMM dd")}
                </span>
              </div>
            )}
          />

          <ActivityList
            title="Recent Bazar"
            icon={ShoppingBag}
            iconColor="text-amber-500"
            items={safeStats.recentActivities?.marketings ?? []}
            emptyText="No recent bazar purchases"
            href="/marketings"
            renderItem={(item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.itemName}
                  </p>
                  <p className="text-xs text-slate-400">
                    by {item.userName || item.member?.user?.name || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">
                    ৳{Number(item.amount).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {format(new Date(item.date), "MMM dd")}
                  </span>
                </div>
              </div>
            )}
          />

          <ActivityList
            title="Recent Deposits"
            icon={CreditCard}
            iconColor="text-emerald-500"
            items={safeStats.recentActivities?.payments ?? []}
            emptyText="No recent deposits"
            href="/payments"
            renderItem={(payment, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {payment.userName ||
                      payment.member?.user?.name ||
                      "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {payment.paymentMethod?.toLowerCase() || "cash"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    +৳{Number(payment.amount).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {format(new Date(payment.paymentDate), "MMM dd")}
                  </span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
