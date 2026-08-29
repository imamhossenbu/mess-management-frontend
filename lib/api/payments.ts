// lib/api/payments.ts
import { apiClient } from "./client";

export type PaymentMethod = "CASH" | "BANK" | "MOBILE_BANKING";

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  userId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  note?: string;
}

export interface UpdatePaymentData {
  amount?: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
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
  getAll: () => apiClient.get<Payment[]>("/payments"),
  getOne: (id: string) => apiClient.get<Payment>(`/payments/${id}`),
  create: (data: CreatePaymentData) =>
    apiClient.post<Payment>("/payments", data),
  update: (id: string, data: UpdatePaymentData) =>
    apiClient.patch<Payment>(`/payments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/payments/${id}`),
  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get<Payment[]>(
      `/payments/user/${userId}?${params.toString()}`,
    );
  },
  getUserBalance: (userId: string) =>
    apiClient.get<UserBalance>(`/payments/user/${userId}/balance`),
  getAllBalances: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const queryString = params.toString();
    return apiClient.get<UserBalance[]>(`/dashboard/member-balances${queryString ? `?${queryString}` : ""}`);
  },
  getByDate: (date: string) =>
    apiClient.get<Payment[]>(`/payments/date/${date}`),
  getByMonth: (year: number, month: number) =>
    apiClient.get<Payment[]>(`/payments/month/${year}/${month}`),
  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/payments/monthly?${params.toString()}`);
  },
};
