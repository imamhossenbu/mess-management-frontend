// app/(dashboard)/dashboard/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import {
  Users,
  Utensils,
  ShoppingBag,
  Package,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock stats - later replace with real API data
  const stats = [
    {
      label: "Total Members",
      value: "12",
      icon: Users,
      color: "bg-primary-500",
    },
    {
      label: "Today's Meals",
      value: "24",
      icon: Utensils,
      color: "bg-success",
    },
    {
      label: "Monthly Bazar",
      value: "৳ 45,000",
      icon: ShoppingBag,
      color: "bg-warning",
    },
    {
      label: "Inventory Stock",
      value: "15 pcs",
      icon: Package,
      color: "bg-error",
    },
  ];

  const recentActivities = [
    { id: 1, action: "Meal entry added", user: "John Doe", time: "2 min ago" },
    { id: 2, action: "Bazar purchase", user: "Jane Smith", time: "15 min ago" },
    {
      id: 3,
      action: "Payment received",
      user: "Mike Johnson",
      time: "1 hour ago",
    },
    { id: 4, action: "Utility bill added", user: "Admin", time: "2 hours ago" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name}! 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {activity.action}
                </p>
                <p className="text-sm text-slate-500">{activity.user}</p>
              </div>
              <span className="text-sm text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
