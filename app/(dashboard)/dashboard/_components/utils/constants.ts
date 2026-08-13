// app/(dashboard)/dashboard/_components/utils/constants.ts
import { Shield, UserCheck } from "lucide-react";

export const ROLE_CONFIG = {
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
