/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/role-dashboards/MemberDashboard.tsx
"use client";

import {
  Wallet,
  Utensils,
  Percent,
  DollarSign,
  CreditCard,
  Calendar,
  UserCheck,
  ShoppingBag,
  FileText,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { HeroBanner } from "../shared/HeroBanner";
import { StatCard } from "../shared/StatCard";
import { ActivityList } from "../shared/ActivityList";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animations";
import { MemberDashboardData } from "@/lib/api/dashboard";

interface MemberDashboardProps {
  stats: MemberDashboardData;
  user: any;
}

export default function MemberDashboard({ stats, user }: MemberDashboardProps) {
  const safeStats = stats || {
    userId: user?.id || "",
    userName: user?.name || "",
    totalMealThisMonth: 0,
    mealBillThisMonth: 0,
    utilityShareThisMonth: 0,
    totalBillThisMonth: 0,
    totalPaidThisMonth: 0,
    currentBalance: 0,
    recentPayments: [],
    recentMeals: [],
    mealRate: 0,
    dailyStats: null,
    monthlyStats: null,
  };

  const balance = safeStats.currentBalance ?? 0;
  const isNegative = balance < 0;

  const personalStats = [
    {
      label: "My Meals",
      value: safeStats.totalMealThisMonth ?? 0,
      description: "Total meals this month",
      icon: Utensils,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Meal Rate",
      value: `৳ ${Number(safeStats.mealRate ?? 0).toFixed(2)}`,
      description: "Per meal cost",
      icon: TrendingUp,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Meal Bill",
      value: `৳ ${(safeStats.mealBillThisMonth ?? 0).toLocaleString()}`,
      description: "Meals × rate",
      icon: DollarSign,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      label: "My Payments",
      value: `৳ ${(safeStats.totalPaidThisMonth ?? 0).toLocaleString()}`,
      description: "Deposits this month",
      icon: CreditCard,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      label: "Utility Share",
      value: `৳ ${(safeStats.utilityShareThisMonth ?? 0).toLocaleString()}`,
      description: "My shared utilities",
      icon: FileText,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  const quickActions = [
    { href: "/meals", label: "My Meals", icon: Utensils },
    { href: "/marketings", label: "Bazar", icon: ShoppingBag },
    { href: "/payments", label: "My Payments", icon: CreditCard },
    { href: "/monthly-summary", label: "Monthly Summary", icon: Calendar },
    { href: "/profile", label: "My Profile", icon: UserCheck },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="MEMBER" />

      {/* Balance Card */}
      <motion.div variants={fadeIn} initial="hidden" animate="show">
        <div
          className={`p-6 rounded-xl border-2 ${
            isNegative
              ? "border-rose-200 bg-rose-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Your Balance
              </p>
              <p
                className={`text-4xl font-bold ${
                  isNegative ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {isNegative ? "-" : "+"}৳{Math.abs(balance).toLocaleString()}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isNegative ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                {isNegative
                  ? "⚠️ You have outstanding dues"
                  : "✅ Your account is in good standing"}
              </p>
            </div>
            <div
              className={`p-4 rounded-2xl ${isNegative ? "bg-rose-100" : "bg-emerald-100"}`}
            >
              <Wallet
                className={`w-8 h-8 ${isNegative ? "text-rose-500" : "text-emerald-500"}`}
              />
            </div>
          </div>
        </div>
      </motion.div>

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

      {/* Stats */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          This Month
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {personalStats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i} />
          ))}
        </div>
      </div>

      {/* Activity */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          My Recent Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityList
            title="My Meal Logs"
            icon={Utensils}
            iconColor="text-primary-500"
            items={safeStats.recentMeals || []}
            emptyText="No recent meal entries"
            href="/meals"
            renderItem={(meal, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-xs text-slate-400">
                    {format(new Date(meal.date), "MMM dd, yyyy")}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
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
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {meal.totalMeal || 0} meals
                </span>
              </div>
            )}
            maxItems={3}
          />

          <ActivityList
            title="My Deposits"
            icon={CreditCard}
            iconColor="text-emerald-500"
            items={safeStats.recentPayments || []}
            emptyText="No recent deposits"
            href="/payments"
            renderItem={(payment, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    ৳{Number(payment.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {payment.paymentMethod?.toLowerCase() || "cash"} deposit
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {format(new Date(payment.paymentDate), "MMM dd")}
                </span>
              </div>
            )}
            maxItems={3}
          />
        </div>
      </div>
    </div>
  );
}
