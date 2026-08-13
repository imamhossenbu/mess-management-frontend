/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/shared/HeroBanner.tsx
"use client";

import { RoleBadge } from "./RoleBadge";
import { Shield, UserCheck } from "lucide-react";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    icon: Shield,
    gradient: "from-violet-500 to-purple-600",
  },
  MANAGER: {
    label: "Manager",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
  },
  MEMBER: {
    label: "Member",
    icon: UserCheck,
    gradient: "from-emerald-500 to-teal-600",
  },
};

interface HeroBannerProps {
  user: any;
  role: string;
}

export function HeroBanner({ user, role }: HeroBannerProps) {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const cfg =
    ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.MEMBER;

  const gradients = {
    ADMIN: "from-violet-900 via-purple-800 to-violet-700",
    MANAGER: "from-slate-900 via-indigo-900 to-blue-800",
    MEMBER: "from-teal-900 via-emerald-900 to-teal-800",
  };
  const gradient =
    gradients[role as keyof typeof gradients] || gradients.MEMBER;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden px-6 py-7 md:px-10 md:py-9 bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-52 h-52 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 blur-xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <RoleBadge role={role} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {greet},{" "}
            <span className="opacity-90">
              {user?.name?.split(" ")[0] || "User"}
            </span>{" "}
            👋
          </h1>
          <p className="text-white/60 text-sm mt-1.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <div
          className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cfg.gradient} shadow-xl shrink-0`}
        >
          <cfg.icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
