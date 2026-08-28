// app/(dashboard)/dashboard/_components/shared/StatCard.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  description?: string;
  trend?: { value: number; isUp: boolean };
  delay?: number;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  description,
  trend,
  delay = 0,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`h-full ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="h-full min-h-[120px] p-5 bg-white border border-slate-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200 group flex flex-col justify-between">
        <div className="flex items-start justify-between w-full h-full gap-2">
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
                {label}
              </p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">
                {value}
              </p>
            </div>
            <div>
              {description && (
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">{description}</p>
              )}
              {trend && (
                <div
                  className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${
                    trend.isUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
          <div
            className={`${iconBg} p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200 shrink-0`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    </motion.div>

  );
}
