/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/role-dashboards/ManagerDashboard.tsx
"use client";

import {
  Users,
  Utensils,
  ShoppingBag,
  Percent,
  CreditCard,
  Package,
  Store,
  TrendingUp,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { HeroBanner } from "../shared/HeroBanner";
import { StatCard } from "../shared/StatCard";
import { ActivityList } from "../shared/ActivityList";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { AdminDashboardData } from "@/lib/api/dashboard";

interface ManagerDashboardProps {
  stats: AdminDashboardData;
  user: any;
}

export default function ManagerDashboard({
  stats,
  user,
}: ManagerDashboardProps) {
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
    mealsBreakfast: 0,
    mealsLunch: 0,
    mealsDinner: 0,
    dailyStats: null,
    monthlyStats: null,
  };

  const activeCount = safeStats.activeMembers || safeStats.totalMembers || 1;
  const utilityPerPerson = (safeStats.totalUtilityCostThisMonth ?? 0) / activeCount;

  const statCards = [
    {
      label: "Active Members",
      value: safeStats.activeMembers ?? 0,
      description: "Active in this mess",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Today's Meals",
      value: safeStats.totalMealsToday ?? 0,
      description: "Total meals booked",
      icon: Utensils,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Monthly Bazar",
      value: `৳ ${(safeStats.totalMarketingCostThisMonth ?? 0).toLocaleString()}`,
      description: "Bazar expense",
      icon: ShoppingBag,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Current Meal Rate",
      value: `৳ ${Number(safeStats.mealRate ?? 0).toFixed(2)}`,
      description: "Per meal cost",
      icon: Percent,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Utility Per Person",
      value: `৳ ${Number(utilityPerPerson).toFixed(2)}`,
      description: `Total: ৳${(safeStats.totalUtilityCostThisMonth ?? 0).toLocaleString()}`,
      icon: FileText,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  const operationalMetrics = [
    { label: "Today's Lunch", value: safeStats.mealsLunch ?? 0, icon: Sun },
    { label: "Today's Dinner", value: safeStats.mealsDinner ?? 0, icon: Moon },
    { label: "Total Members", value: safeStats.totalMembers ?? 0, icon: Users },
  ];

  const quickActions = [
    { href: "/meals", label: "Book / Log Meals", icon: Utensils },
    { href: "/marketings", label: "Add Bazar Entry", icon: ShoppingBag },
    { href: "/payments", label: "Record Payment", icon: CreditCard },
    { href: "/utility-bills", label: "Utility Bills", icon: TrendingUp },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/shop-debts", label: "Shop Debts", icon: Store },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="MANAGER" />

      <div className="flex flex-wrap gap-2.5">
        {quickActions.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-all cursor-pointer">
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Today's Operations
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalMetrics.map((metric, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="p-5 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {metric.value}
                    </p>
                  </div>
                  <metric.icon className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          This Month
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} delay={i} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Recent Activity
        </h2>
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
                    by {item.userName || item.member?.user?.name || "Unknown"}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  ৳{Number(item.amount).toLocaleString()}
                </p>
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
                <p className="text-sm font-bold text-emerald-600">
                  +৳{Number(payment.amount).toLocaleString()}
                </p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
