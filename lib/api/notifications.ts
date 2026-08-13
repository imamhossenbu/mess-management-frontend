// lib/api/notifications.ts
import { apiClient } from "./client";

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead?: boolean;
}

export interface BulkNotificationData {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  link?: string;
}

export interface UnreadCount {
  unreadCount: number;
}

export const notificationsApi = {
  // Get all notifications (admin only)
  getAll: () => apiClient.get<Notification[]>("/notifications"),

  // Get my notifications
  getMy: () => apiClient.get<Notification[]>("/notifications/me"),

  // Get unread count
  getUnreadCount: () =>
    apiClient.get<UnreadCount>("/notifications/me/unread-count"),

  // Get notifications by user (admin only)
  getByUser: (userId: string) =>
    apiClient.get<Notification[]>(`/notifications/user/${userId}`),

  // Get single notification
  getOne: (id: string) => apiClient.get<Notification>(`/notifications/${id}`),

  // Create notification (admin only)
  create: (data: CreateNotificationData) =>
    apiClient.post<Notification>("/notifications", data),

  // Create bulk notifications (admin only)
  createBulk: (data: BulkNotificationData) =>
    apiClient.post("/notifications/bulk", data),

  // Mark as read
  markAsRead: (id: string) =>
    apiClient.patch<Notification>(`/notifications/${id}/read`),

  // Mark multiple as read
  markMultipleAsRead: (ids: string[]) =>
    apiClient.patch("/notifications/mark-read", { ids }),

  // Mark all as read
  markAllAsRead: () => apiClient.patch("/notifications/me/read-all"),

  // Delete notification
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),

  // Delete all my notifications
  deleteAll: () => apiClient.delete("/notifications/me/all"),

  // ==================== SPECIAL NOTIFICATIONS ====================

  // Send bill notification
  sendBill: (userId: string, amount: number, dueDate: string) =>
    apiClient.post(`/notifications/bill/${userId}`, { amount, dueDate }),

  // Send payment confirmation
  sendPaymentConfirmation: (userId: string, amount: number) =>
    apiClient.post(`/notifications/payment/${userId}`, { amount }),

  // Send meal reminder
  sendMealReminder: (userId: string, mealType: string) =>
    apiClient.post(`/notifications/meal-reminder/${userId}`, { mealType }),

  // Send inventory alert (admin only)
  sendInventoryAlert: (type: string, quantity: number) =>
    apiClient.post("/notifications/inventory-alert", { type, quantity }),

  // Send monthly summary notification
  sendMonthlySummary: (year: number, month: number) =>
    apiClient.post("/notifications/monthly-summary", { year, month }),

  // Send email
  sendEmail: (data: {
    email: string;
    subject: string;
    message: string;
    html?: string;
  }) => apiClient.post("/notifications/email", data),
};
