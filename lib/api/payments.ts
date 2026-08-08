// src/lib/api/payments.ts
import { apiClient } from "./client";

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "CASH" | "BANK" | "MOBILE_BANKING";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBalance {
  userId: string;
  userName: string;
  totalPaid: number;
  balance: number; // + = পাওনা, - = বাকি
  payments: Payment[];
}

export interface MonthlyPaymentSummary {
  month: string;
  year: number;
  totalPayments: number;
  totalAmount: number;
  payments: Payment[];
}

export const paymentsApi = {
  // Get all payments
  getAll: () => apiClient.get<Payment[]>("/payments"),

  // Get a single payment by ID
  getById: (id: string) => apiClient.get<Payment>(`/payments/${id}`),

  // Get payments for a specific user
  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    let url = `/payments/user/${userId}`;
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get<Payment[]>(url);
  },

  // Get user balance
  getUserBalance: (userId: string) =>
    apiClient.get<UserBalance>(`/payments/user/${userId}/balance`),

  // Get all user balances
  getAllBalances: () => apiClient.get<UserBalance[]>("/payments/balances"),

  // Get payments by date
  getByDate: (date: string) =>
    apiClient.get<Payment[]>(`/payments/date/${date}`),

  // Get payments by month
  getByMonth: (year: number, month: number) =>
    apiClient.get<Payment[]>(`/payments/month/${year}/${month}`),

  // Get monthly summary
  getMonthlySummary: (year: number, month: number) =>
    apiClient.get<MonthlyPaymentSummary>(
      `/payments/monthly?year=${year}&month=${month}`,
    ),

  // Create a new payment
  create: (data: {
    userId: string;
    amount: number;
    paymentDate?: string;
    paymentMethod?: string;
    note?: string;
  }) => apiClient.post<Payment>("/payments", data),

  // Update a payment
  update: (
    id: string,
    data: {
      amount?: number;
      paymentDate?: string;
      paymentMethod?: string;
      note?: string;
    },
  ) => apiClient.patch<Payment>(`/payments/${id}`, data),

  // Delete a payment
  delete: (id: string) => apiClient.delete(`/payments/${id}`),
};
