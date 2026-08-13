// components/layout/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Utensils, ShoppingBag, User, Users, CreditCard,
} from "lucide-react";

type NavItem = { icon: React.ElementType; label: string; href: string; roles?: string[] };

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Home",    href: "/dashboard" },
  { icon: Utensils,        label: "Meals",   href: "/meals" },
  { icon: ShoppingBag,     label: "Bazar",   href: "/marketings" },
  { icon: Users,           label: "Members", href: "/users",    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { icon: CreditCard,      label: "Payments",href: "/payments" },
  { icon: User,            label: "Profile", href: "/profile" },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Use user.role directly — no mess fetch needed for nav
  const role = user?.role ?? "MEMBER";

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  }).slice(0, 5);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-2xl shadow-slate-900/10"
    >
      <div className="flex items-center justify-around py-1.5 max-w-lg mx-auto px-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className="relative flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-bg"
                    className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                  />
                )}
                <div className="relative">
                  <item.icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? "text-primary-600 scale-110" : "text-slate-400"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-active-dot"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors leading-none ${
                    isActive ? "text-primary-600" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {/* iOS safe area */}
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </motion.div>
  );
};
