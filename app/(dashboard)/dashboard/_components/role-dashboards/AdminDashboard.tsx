/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/role-dashboards/AdminDashboard.tsx
"use client";

import {
  Users,
  Utensils,
  ShoppingBag,
  CreditCard,
  Percent,
  Calendar,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { HeroBanner } from "../shared/HeroBanner";
import { StatCard } from "../shared/StatCard";
import { ActivityList } from "../shared/ActivityList";
import { AdminDashboardData } from "@/lib/api/dashboard";

interface AdminDashboardProps {
  stats: AdminDashboardData;
  user: any;
}

export default function AdminDashboard({ stats, user }: AdminDashboardProps) {
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
      label: "Total Members",
      value: safeStats.totalMembers ?? 0,
      description: "Active members",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Today's Meals",
      value: safeStats.totalMealsToday ?? 0,
      description: "Meals served today",
      icon: Utensils,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Monthly Revenue",
      value: `৳ ${(safeStats.totalPaymentsThisMonth ?? 0).toLocaleString()}`,
      description: "Total deposits",
      icon: CreditCard,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      label: "Meal Rate",
      value: `৳ ${Number(safeStats.mealRate ?? 0).toFixed(2)}`,
      description: "Current rate",
      icon: Percent,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  const quickActions = [
    { href: "/users", label: "Members", icon: Users },
    { href: "/users/create", label: "Add Member", icon: Plus },
    { href: "/meals", label: "Meals", icon: Utensils },
    { href: "/marketings", label: "Bazar", icon: ShoppingBag },
    { href: "/payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="ADMIN" />

      <div className="flex flex-wrap gap-2.5">
        {quickActions.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-all cursor-pointer">
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  by {item.userName || "Unknown"}
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
                  {payment.userName || "Unknown"}
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
  );
}
