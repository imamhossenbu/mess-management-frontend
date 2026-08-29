// lib/api/marketings.ts
import { apiClient } from "./client";

export interface MarketingItem {
  id: string;
  itemName: string;
  quantity?: number;
  unit?: string;
  price?: number;
  totalPrice: number;
  note?: string;
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
  imageUrl?: string;
  items: MarketingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketingItem {
  itemName: string;
  quantity?: number;
  unit?: string;
  price?: number;
  totalPrice: number;
  note?: string;
}

export interface CreateMarketingData {
  date?: string;
  shopName?: string;
  paymentType?: string;
  items: CreateMarketingItem[];
  note?: string;
  memberId?: string;
  image?: File;
}

export interface UpdateMarketingData {
  shopName?: string;
  paymentType?: string;
  note?: string;
  items?: CreateMarketingItem[];
  image?: File;
  removeImage?: boolean;
}

export const marketingsApi = {
  getAll: () => apiClient.get<Marketing[]>("/marketings"),

  getOne: (id: string) => apiClient.get<Marketing>(`/marketings/${id}`),

  create: (data: CreateMarketingData) => {
    const formData = new FormData();

    if (data.date) formData.append("date", data.date);
    if (data.shopName) formData.append("shopName", data.shopName);
    if (data.paymentType) formData.append("paymentType", data.paymentType);
    if (data.memberId) formData.append("memberId", data.memberId);
    if (data.note) formData.append("note", data.note);

    const items = Array.isArray(data.items) ? data.items : [];
    const sanitizedItems = items.map((item) => ({
      itemName: item.itemName || "",
      totalPrice: item.totalPrice || 0,
      note: item.note || undefined,
    }));
    const itemsJson = JSON.stringify(sanitizedItems);
    formData.append("items", itemsJson);

    if (data.image) {
      formData.append("image", data.image);
    }

    return apiClient.post<Marketing>("/marketings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id: string, data: UpdateMarketingData) => {
    const formData = new FormData();

    if (data.shopName) formData.append("shopName", data.shopName);
    if (data.paymentType) formData.append("paymentType", data.paymentType);
    if (data.note) formData.append("note", data.note);

    if (data.items) {
      const items = Array.isArray(data.items) ? data.items : [];
      const sanitizedItems = items.map((item) => ({
        itemName: item.itemName || "",
        totalPrice: item.totalPrice || 0,
        note: item.note || undefined,
      }));
      const itemsJson = JSON.stringify(sanitizedItems);
      formData.append("items", itemsJson);
    }

    if (data.image) {
      formData.append("image", data.image);
    } else if (data.removeImage) {
      formData.append("removeImage", "true");
    }

    return apiClient.patch<Marketing>(`/marketings/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

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
