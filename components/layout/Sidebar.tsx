// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";
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
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: Users,
    label: "Users",
    href: "/users",
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  { icon: Utensils, label: "Meals", href: "/meals" },
  { icon: ShoppingBag, label: "Bazar", href: "/marketings" },
  {
    icon: Package,
    label: "Inventory",
    href: "/inventory",
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  { icon: FileText, label: "Utility Bills", href: "/utility-bills" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  {
    icon: Store,
    label: "Shop Debts",
    href: "/shop-debts",
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  { icon: Calendar, label: "Monthly Summary", href: "/monthly-summary" },
  { icon: User, label: "Profile", href: "/profile" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, hasRole, logout } = useAuth();

  const filteredItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/80 h-screen sticky top-0 overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/30">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Mess Management
            </h1>
            <p className="text-xs text-slate-500 truncate max-w-[140px]">
              {user?.name}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600 shadow-sm border-r-2 border-primary-500"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
