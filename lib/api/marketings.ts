/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/marketings.ts
import { apiClient } from "./client";

export interface Marketing {
  id: string;
  userId: string;
  userName: string;
  date: string;
  itemName: string;
  quantity?: string;
  amount: number;
  paymentType: "CASH" | "DEBT" | "SELF";
  shopName?: string;
  note?: string;
}

export const marketingsApi = {
  getAll: () => apiClient.get<Marketing[]>("/marketings"),

  getById: (id: string) => apiClient.get<Marketing>(`/marketings/${id}`),

  getDaily: (date?: string) =>
    apiClient.get(`/marketings/daily${date ? `?date=${date}` : ""}`),

  getMonthly: (year: number, month: number) =>
    apiClient.get(`/marketings/monthly?year=${year}&month=${month}`),

  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    let url = `/marketings/user/${userId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return apiClient.get(url);
  },

  getByDate: (date: string) => apiClient.get(`/marketings/date/${date}`),

  create: (data: any) => apiClient.post("/marketings", data),

  update: (id: string, data: any) => apiClient.patch(`/marketings/${id}`, data),

  delete: (id: string) => apiClient.delete(`/marketings/${id}`),

  deleteByDate: (date: string) => apiClient.delete(`/marketings/date/${date}`),
};
