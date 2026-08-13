// lib/api/meals.ts
import { apiClient } from "./client";

export interface Meal {
  id: string;
  userId: string;
  userName: string;
  date: string;
  morning: boolean;
  lunch: boolean;
  dinner: boolean;
  totalMeal: number;
}

export interface DailyMealSummary {
  date: string;
  totalMorning: number;
  totalLunch: number;
  totalDinner: number;
  totalMeals: number;
  totalUsers: number;
  mealRate: number;
  meals: Meal[];
}

export interface CreateMealData {
  userId: string;
  date?: string;
  morning?: boolean;
  lunch?: boolean;
  dinner?: boolean;
}

export interface BulkMealData {
  date: string;
  morningUserIds: string[];
  lunchUserIds: string[];
  dinnerUserIds: string[];
}

export const mealsApi = {
  getAll: () => apiClient.get<Meal[]>("/meals"),

  getOne: (id: string) => apiClient.get<Meal>(`/meals/${id}`),

  create: (data: CreateMealData) => apiClient.post<Meal>("/meals", data),

  bulkCreate: (data: BulkMealData) => apiClient.post("/meals/bulk", data),

  singleMealEntry: (data: {
    date: string;
    mealType: string;
    userIds: string[];
  }) => apiClient.post("/meals/single-meal-type", data),

  update: (
    id: string,
    data: { morning?: boolean; lunch?: boolean; dinner?: boolean },
  ) => apiClient.patch(`/meals/${id}`, data),

  delete: (id: string) => apiClient.delete(`/meals/${id}`),

  getDailySummary: (date?: string) => {
    const url = date ? `/meals/daily?date=${date}` : "/meals/daily";
    return apiClient.get<DailyMealSummary>(url);
  },

  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/meals/monthly?${params.toString()}`);
  },

  getMonthlyDateWise: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return apiClient.get(`/meals/monthly/date-wise?${params.toString()}`);
  },

  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`/meals/user/${userId}?${params.toString()}`);
  },

  getByDate: (date: string) => apiClient.get(`/meals/date/${date}`),

  deleteByDate: (date: string) => apiClient.delete(`/meals/date/${date}`),
};
