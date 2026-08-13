// lib/api/payments.ts
import { apiClient } from "./client";

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  userId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod?: string;
  note?: string;
}

export interface UpdatePaymentData {
  amount?: number;
  paymentDate?: string;
  paymentMethod?: string;
  note?: string;
}

export interface UserBalance {
  userId: string;
  userName: string;
  totalPaid: number;
  balance: number;
  payments: Payment[];
}

export const paymentsApi = {
  // Get all payments
  getAll: () => apiClient.get<Payment[]>("/payments"),

  // Get single payment
  getOne: (id: string) => apiClient.get<Payment>(`/payments/${id}`),

  // Create payment
  create: (data: CreatePaymentData) =>
    apiClient.post<Payment>("/payments", data),

  // Update payment
  update: (id: string, data: UpdatePaymentData) =>
    apiClient.patch<Payment>(`/payments/${id}`, data),

  // Delete payment
  delete: (id: string) => apiClient.delete(`/payments/${id}`),

  // Get by user
  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get<Payment[]>(
      `/payments/user/${userId}?${params.toString()}`,
    );
  },

  // Get user balance
  getUserBalance: (userId: string) =>
    apiClient.get<UserBalance>(`/payments/user/${userId}/balance`),

  // Get all user balances
  getAllBalances: () => apiClient.get<UserBalance[]>("/payments/balances"),

  // Get by date
  getByDate: (date: string) =>
    apiClient.get<Payment[]>(`/payments/date/${date}`),

  // Get by month
  getByMonth: (year: number, month: number) =>
    apiClient.get<Payment[]>(`/payments/month/${year}/${month}`),

  // Get monthly summary
  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/payments/monthly?${params.toString()}`);
  },
};
