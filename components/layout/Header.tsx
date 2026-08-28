// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Crown, Shield, UserCheck, Menu, X, LogOut } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationMenu } from "./NotificationMenu";
import { motion, AnimatePresence } from "framer-motion";
import { getNavGroups, ROLE_BRAND } from "./Sidebar";

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", icon: Crown,     bg: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
  ADMIN:       { label: "Admin",       icon: Shield,    bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  MANAGER:     { label: "Manager",     icon: Shield,    bg: "bg-blue-50 border-blue-200",     text: "text-blue-700" },
  MEMBER:      { label: "Member",      icon: UserCheck, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
};

export const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role ?? "MEMBER";
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;
  const RoleIcon = cfg.icon;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Sidebar exports
  const navGroups = getNavGroups(role);
  const brand = ROLE_BRAND[role as keyof typeof ROLE_BRAND] ?? ROLE_BRAND.MEMBER;
  const BrandIcon = brand.icon;

  return (
    <>
      <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        {/* Left: greeting or Hamburger */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {greet},{" "}
              <span className="text-primary-600">{user?.name?.split(" ")[0] ?? "User"}</span> 👋
            </p>
            <p className="text-xs text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role badge */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text}`}
          >
            <RoleIcon className="w-3 h-3" />
            {cfg.label}
          </span>

          <NotificationMenu enabled={!!user} />

          {/* Avatar → /profile */}
          <Link href="/profile">
            <Avatar name={user?.name || "User"} image={user?.profileImage} size="md" />
          </Link>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-slate-900 shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-5 border-b border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                    <BrandIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-[14px] font-bold leading-tight">
                      Mess Management
                    </p>
                    <p className="text-slate-400 text-[11px] leading-tight mt-0.5">
                      {brand.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navGroups.map((group, idx) => (
                  <div key={idx}>
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {group.label}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                              isActive
                                ? "bg-white/[0.08] text-white font-semibold"
                                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 font-medium"
                            }`}
                          >
                            <ItemIcon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                            <span className="text-[13px]">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/[0.07]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[13px]">Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
