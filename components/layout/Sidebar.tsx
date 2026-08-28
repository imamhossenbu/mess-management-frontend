/* eslint-disable react-hooks/set-state-in-effect */
// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Utensils,
  ShoppingBag,
  Package,
  FileText,
  CreditCard,
  Store,
  Calendar,
  User,
  LogOut,
  Crown,
  Shield,
  UserCheck,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

export type NavItem = { icon: React.ElementType; label: string; href: string; badgeKey?: string };
export type NavGroup = { label: string; items: NavItem[] };

// ✅ Updated NAV - Users added for all roles
export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "Management",
    items: [
      { icon: Users, label: "Members", href: "/users" },
      { icon: Utensils, label: "Meals", href: "/meals" },
      { icon: ShoppingBag, label: "Bazar", href: "/marketings" },
      { icon: Package, label: "Inventory", href: "/inventory" },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: CreditCard, label: "Payments", href: "/payments" },
      { icon: FileText, label: "Utility Bills", href: "/utility-bills" },
      { icon: Store, label: "Shop Debts", href: "/shop-debts" },
      { icon: Calendar, label: "Monthly Summary", href: "/monthly-summary" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", href: "/profile" },
    ],
  },
];

export const MANAGER_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "Operations",
    items: [
      { icon: Users, label: "Members", href: "/users" },
      { icon: Utensils, label: "Meals", href: "/meals" },
      { icon: ShoppingBag, label: "Bazar", href: "/marketings" },
      { icon: Package, label: "Inventory", href: "/inventory" },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: CreditCard, label: "Payments", href: "/payments" },
      { icon: FileText, label: "Utility Bills", href: "/utility-bills" },
      { icon: Store, label: "Shop Debts", href: "/shop-debts" },
      { icon: Calendar, label: "Monthly Summary", href: "/monthly-summary" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", href: "/profile" },
    ],
  },
];

export const MEMBER_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "My Mess",
    items: [
      { icon: Users, label: "Members", href: "/users" },
      { icon: Utensils, label: "Meals", href: "/meals" },
      { icon: ShoppingBag, label: "Bazar", href: "/marketings" },
      { icon: Package, label: "Inventory", href: "/inventory" },
    ],
  },
  {
    label: "My Financials",
    items: [
      { icon: CreditCard, label: "Payments", href: "/payments" },
      { icon: FileText, label: "Utility Bills", href: "/utility-bills" },
      { icon: Store, label: "Shop Debts", href: "/shop-debts" },
      { icon: Calendar, label: "Monthly Summary", href: "/monthly-summary" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", href: "/profile" },
    ],
  },
];

export const ROLE_BRAND = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: Crown,
    gradient: "from-amber-500 to-amber-600",
  },
  ADMIN: {
    label: "Admin Portal",
    icon: Shield,
    gradient: "from-violet-500 to-violet-600",
  },
  MANAGER: {
    label: "Manager Portal",
    icon: Shield,
    gradient: "from-blue-500 to-blue-600",
  },
  MEMBER: {
    label: "Member Portal",
    icon: UserCheck,
    gradient: "from-emerald-500 to-emerald-600",
  },
};

export function getNavGroups(role: string): NavGroup[] {
  if (role === "SUPER_ADMIN") return ADMIN_NAV;
  if (role === "ADMIN") return ADMIN_NAV;
  if (role === "MANAGER") return MANAGER_NAV;
  return MEMBER_NAV;
}

const COLLAPSE_KEY = "mess-sidebar-collapsed";

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY);
    if (saved === "true") setCollapsed(true);
    setHydrated(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  };

  const role = user?.role ?? "MEMBER";
  const brand =
    ROLE_BRAND[role as keyof typeof ROLE_BRAND] ?? ROLE_BRAND.MEMBER;
  const navGroups = getNavGroups(role);
  const BrandIcon = brand.icon;


  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 248 }}
      initial={false}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`shrink-0 bg-slate-900 h-screen sticky top-0 hidden md:flex flex-col overflow-hidden border-r border-white/[0.06] ${
        hydrated ? "" : "duration-0"
      }`}
    >
      {/* ── Header ── */}
      <div className="px-3 py-4 border-b border-white/[0.07] flex items-center justify-between gap-2">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap min-w-0"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center shrink-0 shadow-md`}
              >
                <BrandIcon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-[13px] font-bold leading-tight truncate">
                  Mess Management
                </p>
                <p className="text-slate-400 text-[10.5px] leading-tight mt-0.5">
                  {brand.label}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expand" : "Collapse"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200 shrink-0 ml-auto"
        >
          <motion.span
            key={collapsed ? "open" : "close"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-center justify-center"
          >
            {collapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </motion.span>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2.5 py-4 flex flex-col gap-4 overflow-y-auto overflow-x-hidden select-none scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.16 }}
                  className="px-2 mb-1 text-[9px] font-bold tracking-[0.18em] uppercase text-slate-500 overflow-hidden whitespace-nowrap"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => collapsed && setHoveredHref(item.href)}
                    onMouseLeave={() => setHoveredHref(null)}
                    className={`group flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 outline-none ${
                      collapsed
                        ? "justify-center w-10 h-10 mx-auto"
                        : "px-2.5 py-2.5 w-full"
                    } ${
                      isActive
                        ? `bg-gradient-to-r ${brand.gradient} text-white shadow-md`
                        : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Icon
                        size={16}
                        className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.13 }}
                          className="overflow-hidden whitespace-nowrap flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* Tooltip when collapsed */}
                  <AnimatePresence>
                    {collapsed && hoveredHref === item.href && (
                      <motion.span
                        initial={{ opacity: 0, x: -6, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-xl pointer-events-none"
                      >
                        {item.label}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-2.5 pb-4 pt-3 border-t border-white/[0.07] flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1 rounded-lg bg-white/[0.05] border border-white/[0.07]"
            >
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-white font-semibold truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 capitalize leading-tight mt-0.5">
                  {brand.label}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <div className="relative">
          <button
            type="button"
            onClick={logout}
            onMouseEnter={() => collapsed && setHoveredHref("logout")}
            onMouseLeave={() => setHoveredHref(null)}
            className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
              collapsed ? "justify-center w-10 mx-auto" : "w-full"
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.13 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {collapsed && hoveredHref === "logout" && (
              <motion.span
                initial={{ opacity: 0, x: -6, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-xl pointer-events-none"
              >
                Log out
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
