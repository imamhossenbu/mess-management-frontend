"use client";

import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api/client";

type Notification = { id: string; title: string; message: string; isRead: boolean };

export function NotificationMenu({ enabled }: { enabled: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useState(false);
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => (await apiClient.get<Notification[]>("/notifications/me")).data,
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  const markRead = useMutation({ mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}), onSuccess: refresh });
  const markAllRead = useMutation({
    mutationFn: () => apiClient.patch("/notifications/me/read-all", {}),
    onSuccess: () => { refresh(); toast.success("All notifications marked as read"); },
    onError: () => toast.error("Could not mark notifications as read"),
  });

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  return <div ref={rootRef} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Notifications" aria-expanded={isOpen}>
      <Bell className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
      {unreadCount > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5">{unreadCount > 9 ? "9+" : unreadCount}</span>}
    </button>
    {isOpen && <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><p className="font-semibold text-slate-800">Notifications</p>
        {unreadCount > 0 && <button type="button" disabled={markAllRead.isPending} onClick={() => markAllRead.mutate()} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 disabled:opacity-60">{markAllRead.isPending ? <LoaderCircle className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}{markAllRead.isPending ? "Marking…" : "Mark all read"}</button>}
      </div>
      <div className="max-h-80 overflow-y-auto">{notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</p> : notifications.slice(0, 8).map((notification) => <button key={notification.id} type="button" onClick={() => !notification.isRead && markRead.mutate(notification.id)} className={`block w-full border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50 ${notification.isRead ? "" : "bg-primary-50/50"}`}><p className="text-sm font-medium text-slate-800">{notification.title}</p><p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{notification.message}</p></button>)}</div>
    </div>}
  </div>;
}
