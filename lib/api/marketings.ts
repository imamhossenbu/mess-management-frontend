// lib/api/marketings.ts
import { apiClient } from "./client";

export interface MarketingItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  note?: string;
  addedToInventory: boolean;
}

export interface Marketing {
  id: string;
  userId: string;
  userName: string;
  date: string;
  shopName?: string;
  totalAmount: number;
  paymentType: string;
  note?: string;
  items: MarketingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketingItem {
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  note?: string;
  addToInventory?: boolean;
}

export interface CreateMarketingData {
  date?: string;
  shopName?: string;
  paymentType?: string;
  userId?: string; // ✅ Made optional - backend will get from auth
  items: CreateMarketingItem[];
  note?: string;
}

export interface UpdateMarketingData {
  shopName?: string;
  paymentType?: string;
  note?: string;
}

export const marketingsApi = {
  getAll: () => apiClient.get<Marketing[]>("/marketings"),

  getOne: (id: string) => apiClient.get<Marketing>(`/marketings/${id}`),

  create: (data: CreateMarketingData) =>
    apiClient.post<Marketing>("/marketings", data),

  update: (id: string, data: UpdateMarketingData) =>
    apiClient.patch<Marketing>(`/marketings/${id}`, data),

  delete: (id: string) => apiClient.delete(`/marketings/${id}`),

  getByDate: (date: string) =>
    apiClient.get<Marketing[]>(`/marketings/date/${date}`),

  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get<Marketing[]>(
      `/marketings/user/${userId}?${params.toString()}`,
    );
  },

  getDailySummary: (date?: string) => {
    const url = date ? `/marketings/daily?date=${date}` : "/marketings/daily";
    return apiClient.get(url);
  },

  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/marketings/monthly?${params.toString()}`);
  },

  deleteByDate: (date: string) => apiClient.delete(`/marketings/date/${date}`),
};
