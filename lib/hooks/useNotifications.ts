/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateNotificationData,
  BulkNotificationData,
} from "@/lib/api/notifications";
import toast from "react-hot-toast";
import { notificationsApi } from "../api";

// ==================== GET NOTIFICATIONS ====================

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (userId) {
        const response = await notificationsApi.getByUser(userId);
        return response.data;
      }
      const response = await notificationsApi.getAll();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

export function useMyNotifications() {
  return useQuery({
    queryKey: ["notifications", "me"],
    queryFn: async () => {
      const response = await notificationsApi.getMy();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const response = await notificationsApi.getUnreadCount();
      return response.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: async () => {
      const response = await notificationsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}

// ==================== CREATE NOTIFICATIONS ====================

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationData) => notificationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("Notification created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create notification",
      );
    },
  });
}

export function useCreateBulkNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkNotificationData) =>
      notificationsApi.createBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("Bulk notifications created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create bulk notifications",
      );
    },
  });
}

// ==================== MARK AS READ ====================

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    },
  });
}

export function useMarkMultipleRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => notificationsApi.markMultipleAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("Notifications marked as read!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("All notifications marked as read!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to mark all as read",
      );
    },
  });
}

// ==================== DELETE NOTIFICATIONS ====================

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("Notification deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete notification",
      );
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("All notifications deleted!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete notifications",
      );
    },
  });
}

// ==================== SPECIAL NOTIFICATIONS ====================

export function useSendBillNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      amount,
      dueDate,
    }: {
      userId: string;
      amount: number;
      dueDate: string;
    }) => notificationsApi.sendBill(userId, amount, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Bill notification sent!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send bill notification",
      );
    },
  });
}

export function useSendPaymentConfirmation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, amount }: { userId: string; amount: number }) =>
      notificationsApi.sendPaymentConfirmation(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Payment confirmation sent!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send payment confirmation",
      );
    },
  });
}

export function useSendMealReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, mealType }: { userId: string; mealType: string }) =>
      notificationsApi.sendMealReminder(userId, mealType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Meal reminder sent!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send meal reminder",
      );
    },
  });
}

export function useSendInventoryAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, quantity }: { type: string; quantity: number }) =>
      notificationsApi.sendInventoryAlert(type, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Inventory alert sent!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send inventory alert",
      );
    },
  });
}

export function useSendMonthlySummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      notificationsApi.sendMonthlySummary(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Monthly summary notification sent!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send monthly summary",
      );
    },
  });
}

export function useSendEmail() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      subject: string;
      message: string;
      html?: string;
    }) => notificationsApi.sendEmail(data),
    onSuccess: () => {
      toast.success("Email sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send email");
    },
  });
}
