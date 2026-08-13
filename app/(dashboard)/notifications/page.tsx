// app/(dashboard)/notifications/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Bell, CheckCheck, LoaderCircle, Trash2, AlertCircle, Info, CreditCard, Utensils, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
};

const TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  PAYMENT:   { icon: CreditCard, bg: "bg-emerald-100", color: "text-emerald-600" },
  MEAL:      { icon: Utensils,   bg: "bg-blue-100",    color: "text-blue-600" },
  INVENTORY: { icon: Package,    bg: "bg-amber-100",   color: "text-amber-600" },
  BILL:      { icon: AlertCircle,bg: "bg-rose-100",    color: "text-rose-600" },
  SYSTEM:    { icon: Info,       bg: "bg-slate-100",   color: "text-slate-600" },
  EMAIL:     { icon: Bell,       bg: "bg-violet-100",  color: "text-violet-600" },
  SUMMARY:   { icon: CheckCheck, bg: "bg-indigo-100",  color: "text-indigo-600" },
};

async function fetchNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<Notification[]>("/notifications/me");
  return res.data;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => apiClient.patch("/notifications/me/read-all", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const deleteNotif = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Your recent activity and alerts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-60"
          >
            {markAllRead.isPending ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
            {markAllRead.isPending ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center bg-white">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No notifications yet</p>
          <p className="text-slate-300 text-sm mt-1">Activity alerts will appear here</p>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.SYSTEM;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Card
                    className={`p-4 flex items-start gap-3 cursor-pointer border transition-all duration-150 ${
                      n.isRead
                        ? "bg-white border-slate-100 opacity-70"
                        : "bg-blue-50/50 border-blue-100 shadow-sm"
                    }`}
                    onClick={() => !n.isRead && markRead.mutate(n.id)}
                  >
                    {/* Icon */}
                    <div className={`${cfg.bg} p-2.5 rounded-xl shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold leading-snug ${n.isRead ? "text-slate-500" : "text-slate-900"}`}>
                          {n.title}
                          {!n.isRead && <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full inline-block" />}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                          {format(new Date(n.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif.mutate(n.id);
                      }}
                      className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
