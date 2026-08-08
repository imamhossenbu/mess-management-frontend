// components/ui/Card.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void; // ✅ Add onClick prop
}

export const Card = ({
  children,
  className = "",
  hover = true,
  onClick,
}: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-xl bg-white p-6 shadow-sm border border-slate-200
        ${hover ? "transition-all duration-200 hover:shadow-md hover:border-primary-200" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
