// components/layout/Header.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Crown, Shield, UserCheck } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";
import { NotificationMenu } from "./NotificationMenu";

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", icon: Crown,     bg: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
  ADMIN:       { label: "Admin",       icon: Shield,    bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  MANAGER:     { label: "Manager",     icon: Shield,    bg: "bg-blue-50 border-blue-200",     text: "text-blue-700" },
  MEMBER:      { label: "Member",      icon: UserCheck, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
};

export const Header = () => {
  const { user } = useAuth();

  const role = user?.role ?? "MEMBER";
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;
  const RoleIcon = cfg.icon;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";


  return (
    <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left: greeting */}
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
  );
};
