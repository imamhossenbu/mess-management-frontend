// app/(dashboard)/dashboard/_components/shared/RoleBadge.tsx
"use client";

import { Shield, UserCheck } from "lucide-react";

const ROLE_CONFIG = {
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

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const cfg =
    ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}
