// components/layout/Header.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Bell, Crown, Shield, UserCheck } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useState } from "react";

type Notification = { id: string; title: string; message: string; isRead: boolean };

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", icon: Crown,     bg: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
  ADMIN:       { label: "Admin",       icon: Shield,    bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  MANAGER:     { label: "Manager",     icon: Shield,    bg: "bg-blue-50 border-blue-200",     text: "text-blue-700" },
  MEMBER:      { label: "Member",      icon: UserCheck, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
};

export const Header = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const role = user?.role ?? "MEMBER";
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.MEMBER;
  const RoleIcon = cfg.icon;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Unread notification count
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => (await apiClient.get<Notification[]>("/notifications/me")).data,
    enabled: !!user,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const markRead = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const markAllRead = useMutation({
    mutationFn: () => apiClient.patch("/notifications/me/read-all", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

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

        {/* Notification bell → /notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-800">Notifications</p>
                {unreadCount > 0 && <button type="button" onClick={() => markAllRead.mutate()} className="text-xs font-semibold text-primary-600">Mark all read</button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</p> : notifications.slice(0, 8).map((notification) => (
                  <button key={notification.id} type="button" onClick={() => !notification.isRead && markRead.mutate(notification.id)} className={`block w-full border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50 ${notification.isRead ? "" : "bg-primary-50/50"}`}>
                    <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{notification.message}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar → /profile */}
        <Link href="/profile">
          <Avatar name={user?.name || "User"} image={user?.profileImage} size="md" />
        </Link>
      </div>
    </header>
  );
};
