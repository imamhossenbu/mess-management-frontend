// app/(dashboard)/dashboard/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  Users, Utensils, ShoppingBag, Package, CreditCard,
  DollarSign, TrendingUp, Percent, Activity, Plus,
  Crown, Shield, UserCheck, ArrowUpRight, ArrowDownRight,
  Wallet, ChevronRight, Star, AlertCircle, CheckCircle2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

/* ══════════════════ ANIMATION VARIANTS ══════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ══════════════════ ROLE BADGE ══════════════════ */
const ROLE_CONFIG = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  ADMIN: {
    label: "Admin",
    icon: Shield,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  MANAGER: {
    label: "Manager",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  MEMBER: {
    label: "Member",
    icon: UserCheck,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

/* ══════════════════ STAT CARD ══════════════════ */
type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  index?: number;
};

function StatCard({ label, value, description, icon: Icon, iconBg, iconColor, index = 0 }: StatCardProps) {
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="show">
      <Card className="p-5 bg-white border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            {description && <p className="text-xs text-slate-400 mt-1.5">{description}</p>}
          </div>
          <div className={`${iconBg} p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ══════════════════ ACTIVITY LIST ══════════════════ */
function ActivityList({
  title,
  icon: Icon,
  iconColor,
  items,
  emptyText,
  href,
  renderItem,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  items: any[];
  emptyText: string;
  href: string;
  renderItem: (item: any, i: number) => React.ReactNode;
}) {
  return (
    <Card className="p-5 bg-white border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          {title}
        </h3>
        <Link href={href} className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-0.5">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2 flex-1">
        {items.length > 0 ? (
          items.slice(0, 5).map(renderItem)
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-xs text-slate-400">{emptyText}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ══════════════════ HERO BANNER ══════════════════ */
function HeroBanner({ user, role }: { user: any; role: string }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;

  const gradients = {
    SUPER_ADMIN: "from-amber-900 via-orange-800 to-amber-700",
    ADMIN: "from-violet-900 via-purple-800 to-violet-700",
    MANAGER: "from-slate-900 via-indigo-900 to-blue-800",
    MEMBER: "from-teal-900 via-emerald-900 to-teal-800",
  };
  const gradient = gradients[role as keyof typeof gradients] ?? gradients.MEMBER;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden px-6 py-7 md:px-10 md:py-9 bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-6 -right-6 w-52 h-52 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 blur-xl" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <RoleBadge role={role} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {greet}, <span className="opacity-90">{user?.name?.split(" ")[0] ?? "User"}</span> 👋
          </h1>
          <p className="text-white/60 text-sm mt-1.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cfg.gradient} shadow-xl shrink-0`}>
          {(() => { const Icon = cfg.icon; return <Icon className="w-8 h-8 text-white" />; })()}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ LOADING SKELETON ══════════════════ */
function DashSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl bg-slate-200 h-36" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="rounded-2xl bg-slate-100 h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl bg-slate-100 h-56" />)}
      </div>
    </div>
  );
}

/* ══════════════════ SUPER ADMIN DASHBOARD ══════════════════ */
function SuperAdminDashboard({ stats, user }: { stats: any; user: any }) {
  const statCards = [
    { label: "Active Members", value: `${stats?.activeMembers ?? 0} / ${stats?.totalMembers ?? 0}`, description: "Active / Total", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Today's Meals", value: stats?.totalMealsToday ?? 0, description: "Total meal count today", icon: Utensils, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: "Monthly Bazar", value: `৳ ${(stats?.totalMarketingCostThisMonth ?? 0).toLocaleString()}`, description: "Total marketing expense", icon: ShoppingBag, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Meal Rate", value: `৳ ${Number(stats?.mealRate ?? 0).toFixed(2)}`, description: "Per meal cost", icon: Percent, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
    { label: "Total Payments", value: `৳ ${(stats?.totalPaymentsThisMonth ?? 0).toLocaleString()}`, description: "Deposits this month", icon: CreditCard, iconBg: "bg-teal-100", iconColor: "text-teal-600" },
    { label: "Total Due", value: `৳ ${(stats?.totalDue ?? 0).toLocaleString()}`, description: "Outstanding balances", icon: AlertCircle, iconBg: "bg-rose-100", iconColor: "text-rose-600" },
    { label: "Inventory (Meat/Fish)", value: `${stats?.inventory?.meat ?? 0}kg / ${stats?.inventory?.fish ?? 0}kg`, description: "Freezer stock", icon: Package, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    { label: "Utility Share", value: `৳ ${(stats?.totalUtilityCostThisMonth ?? 0).toLocaleString()}`, description: "Rent, Wifi, Bills", icon: TrendingUp, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="SUPER_ADMIN" />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { href: "/users", label: "Manage Members", icon: Users, color: "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200" },
          { href: "/meals", label: "Log Meals", icon: Utensils, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/marketings", label: "Add Bazar", icon: ShoppingBag, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/payments", label: "Payments", icon: CreditCard, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/monthly-summary", label: "Summary", icon: Calendar, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all cursor-pointer shadow-sm ${color}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => <StatCard key={i} {...card} index={i} />)}
        </div>
      </div>

      {/* Activity feeds */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActivityList
            title="Recent Meal Logs"
            icon={Utensils}
            iconColor="text-primary-500"
            items={stats?.recentActivities?.meals ?? []}
            emptyText="No recent meal entries"
            href="/meals"
            renderItem={(meal, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{meal.userName || meal.userId}</p>
                  <p className="text-xs text-slate-400">M: {meal.morning ? "✅" : "❌"} L: {meal.lunch ? "✅" : "❌"} D: {meal.dinner ? "✅" : "❌"}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{format(new Date(meal.date), "MMM dd")}</span>
              </div>
            )}
          />
          <ActivityList
            title="Recent Bazar"
            icon={ShoppingBag}
            iconColor="text-amber-500"
            items={stats?.recentActivities?.marketings ?? []}
            emptyText="No recent bazar purchases"
            href="/marketings"
            renderItem={(item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.itemName}</p>
                  <p className="text-xs text-slate-400">by {item.userName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">৳{Number(item.amount).toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400">{format(new Date(item.date), "MMM dd")}</span>
                </div>
              </div>
            )}
          />
          <ActivityList
            title="Recent Deposits"
            icon={CreditCard}
            iconColor="text-emerald-500"
            items={stats?.recentActivities?.payments ?? []}
            emptyText="No recent deposits"
            href="/payments"
            renderItem={(payment, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{payment.userName}</p>
                  <p className="text-xs text-slate-400 capitalize">{payment.paymentMethod?.toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+৳{Number(payment.amount).toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400">{format(new Date(payment.paymentDate), "MMM dd")}</span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ MANAGER DASHBOARD ══════════════════ */
function ManagerDashboard({ stats, user }: { stats: any; user: any }) {
  const statCards = [
    { label: "Active Members", value: stats?.activeMembers ?? 0, description: "Active in this mess", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Today's Meals", value: stats?.totalMealsToday ?? 0, description: "Total meals booked", icon: Utensils, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: "Monthly Bazar", value: `৳ ${(stats?.totalMarketingCostThisMonth ?? 0).toLocaleString()}`, description: "Bazar expense", icon: ShoppingBag, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Current Meal Rate", value: `৳ ${Number(stats?.mealRate ?? 0).toFixed(2)}`, description: "Per meal cost", icon: Percent, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="MANAGER" />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { href: "/meals", label: "Book / Log Meals", icon: Utensils, color: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm" },
          { href: "/marketings", label: "Add Bazar Entry", icon: ShoppingBag, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/payments", label: "Record Payment", icon: CreditCard, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/utility-bills", label: "Utility Bills", icon: TrendingUp, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all cursor-pointer ${color}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">This Month</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => <StatCard key={i} {...card} index={i} />)}
        </div>
      </div>

      {/* Activity */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityList
            title="Recent Bazar"
            icon={ShoppingBag}
            iconColor="text-amber-500"
            items={stats?.recentActivities?.marketings ?? []}
            emptyText="No recent bazar purchases"
            href="/marketings"
            renderItem={(item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.itemName}</p>
                  <p className="text-xs text-slate-400">by {item.userName}</p>
                </div>
                <p className="text-sm font-bold text-slate-800">৳{Number(item.amount).toLocaleString()}</p>
              </div>
            )}
          />
          <ActivityList
            title="Recent Deposits"
            icon={CreditCard}
            iconColor="text-emerald-500"
            items={stats?.recentActivities?.payments ?? []}
            emptyText="No recent deposits"
            href="/payments"
            renderItem={(payment, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{payment.userName}</p>
                  <p className="text-xs text-slate-400 capitalize">{payment.paymentMethod?.toLowerCase()}</p>
                </div>
                <p className="text-sm font-bold text-emerald-600">+৳{Number(payment.amount).toLocaleString()}</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ MEMBER DASHBOARD ══════════════════ */
function MemberDashboard({ stats, user }: { stats: any; user: any }) {
  const balance = stats?.myBalance ?? 0;
  const isNegative = balance < 0;

  return (
    <div className="space-y-6">
      <HeroBanner user={user} role="MEMBER" />

      {/* Balance Card */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
        <Card className={`p-6 border-2 ${isNegative ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Your Balance</p>
              <p className={`text-4xl font-bold ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
                {isNegative ? "-" : "+"}৳{Math.abs(balance).toLocaleString()}
              </p>
              <p className={`text-sm mt-1 ${isNegative ? "text-rose-500" : "text-emerald-600"}`}>
                {isNegative ? "⚠️ You have outstanding dues" : "✅ Your account is in good standing"}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${isNegative ? "bg-rose-100" : "bg-emerald-100"}`}>
              <Wallet className={`w-8 h-8 ${isNegative ? "text-rose-500" : "text-emerald-500"}`} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { href: "/meals", label: "My Meals", icon: Utensils, color: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm" },
          { href: "/payments", label: "My Payments", icon: CreditCard, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/monthly-summary", label: "Monthly Summary", icon: Calendar, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
          { href: "/profile", label: "My Profile", icon: UserCheck, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all cursor-pointer ${color}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>

      {/* Personal Stats */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">This Month</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "My Meals", value: stats?.myMealsThisMonth ?? 0, description: "Total meals this month", icon: Utensils, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
            { label: "Meal Rate", value: `৳ ${Number(stats?.mealRate ?? 0).toFixed(2)}`, description: "Per meal cost", icon: Percent, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
            { label: "Meal Bill", value: `৳ ${(stats?.myMealBill ?? 0).toLocaleString()}`, description: "Meals × rate", icon: DollarSign, iconBg: "bg-rose-100", iconColor: "text-rose-600" },
            { label: "My Payments", value: `৳ ${(stats?.myPaymentsThisMonth ?? 0).toLocaleString()}`, description: "Deposits this month", icon: CreditCard, iconBg: "bg-teal-100", iconColor: "text-teal-600" },
          ].map((card, i) => <StatCard key={i} {...card} index={i} />)}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">My Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityList
            title="My Meal Logs"
            icon={Utensils}
            iconColor="text-primary-500"
            items={stats?.recentActivities?.meals ?? []}
            emptyText="No recent meal entries"
            href="/meals"
            renderItem={(meal, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-xs text-slate-400">{format(new Date(meal.date), "MMM dd, yyyy")}</p>
                  <p className="text-sm text-slate-700">
                    Morning: {meal.morning ? "✅" : "❌"} | Lunch: {meal.lunch ? "✅" : "❌"} | Dinner: {meal.dinner ? "✅" : "❌"}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {(meal.morning ? 1 : 0) + (meal.lunch ? 1 : 0) + (meal.dinner ? 1 : 0)} meals
                </span>
              </div>
            )}
          />
          <ActivityList
            title="My Deposits"
            icon={CreditCard}
            iconColor="text-emerald-500"
            items={stats?.recentActivities?.payments ?? []}
            emptyText="No recent deposits"
            href="/payments"
            renderItem={(payment, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">৳{Number(payment.amount).toLocaleString()}</p>
                  <p className="text-xs text-slate-400 capitalize">{payment.paymentMethod?.toLowerCase()} deposit</p>
                </div>
                <span className="text-xs text-slate-400">{format(new Date(payment.paymentDate), "MMM dd")}</span>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ MAIN PAGE ══════════════════ */
export default function DashboardPage() {
  const { user, isSuperAdmin, isManager } = useAuth();

  // Use user.role directly — no mess dependency, no waiting for mess to load
  const role = user?.role ?? "MEMBER";

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats", role],
    queryFn: async () => {
      if (isSuperAdmin || isManager) {
        const response = await dashboardApi.getAdmin();
        return response.data;
      } else {
        const response = await dashboardApi.getMember();
        return response.data;
      }
    },
    enabled: !!user, // fetch as soon as user is available
    staleTime: 2 * 60 * 1000, // 2 min cache
    refetchOnWindowFocus: false,
  });

  if (!user) return null;

  if (isLoading) return (
    <div className="space-y-6 p-2">
      <DashSkeleton />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
      <p className="text-rose-500 font-semibold">Failed to load dashboard</p>
      <p className="text-sm text-slate-400 mt-1">Please make sure the backend server is running.</p>
    </div>
  );

  // Route to the right dashboard by role
  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboard stats={stats} user={user} />;
  }
  if (role === "MANAGER" || role === "ADMIN") {
    return <ManagerDashboard stats={stats} user={user} />;
  }
  return <MemberDashboard stats={stats} user={user} />;
}