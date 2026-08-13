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
      className={onClick ? "cursor-pointer" : ""}
    >
      <div className="p-5 bg-white border border-slate-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-none">
              {value}
            </p>
            {description && (
              <p className="text-xs text-slate-400 mt-1.5">{description}</p>
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
          <div
            className={`${iconBg} p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
