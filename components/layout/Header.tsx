// components/layout/Header.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../ui/Avatar";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome back, {user?.name} 👋
        </h2>
        <p className="text-sm text-slate-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <Avatar name={user?.name || "User"} size="md" />
      </div>
    </header>
  );
};
