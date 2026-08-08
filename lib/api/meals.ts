/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/meals.ts
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

export const mealsApi = {
  getAll: () => apiClient.get<Meal[]>("/meals"),

  getById: (id: string) => apiClient.get<Meal>(`/meals/${id}`),

  getDaily: (date?: string) =>
    apiClient.get(`/meals/daily${date ? `?date=${date}` : ""}`),

  getMonthly: (year: number, month: number) =>
    apiClient.get(`/meals/monthly?year=${year}&month=${month}`),

  getByUser: (userId: string, startDate?: string, endDate?: string) => {
    let url = `/meals/user/${userId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return apiClient.get(url);
  },

  getByDate: (date: string) => apiClient.get(`/meals/date/${date}`),

  create: (data: any) => apiClient.post("/meals", data),

  bulkCreate: (data: any) => apiClient.post("/meals/bulk", data),

  singleMealType: (data: any) =>
    apiClient.post("/meals/single-meal-type", data),

  update: (id: string, data: any) => apiClient.patch(`/meals/${id}`, data),

  delete: (id: string) => apiClient.delete(`/meals/${id}`),

  deleteByDate: (date: string) => apiClient.delete(`/meals/date/${date}`),
};
