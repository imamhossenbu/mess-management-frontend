// components/ui/Avatar.tsx
"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, image, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-2xl",
  };

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center bg-slate-100 text-slate-600 font-semibold shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        initials || <User className="w-4 h-4" />
      )}
    </div>
  );
}
