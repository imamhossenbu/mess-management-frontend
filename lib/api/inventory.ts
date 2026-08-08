/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/inventory.ts
import { apiClient } from "./client";

export interface Inventory {
  id: string;
  type: "MEAT" | "FISH";
  quantity: number;
  lastUpdated: string;
}

export const inventoryApi = {
  getAll: () => apiClient.get<Inventory[]>("/inventory"),

  getSummary: () => apiClient.get("/inventory/summary"),

  getByType: (type: string) => apiClient.get(`/inventory/type/${type}`),

  getLogs: (type?: string) =>
    apiClient.get(`/inventory/logs${type ? `?type=${type}` : ""}`),

  checkAvailability: (type: string, quantity: number) =>
    apiClient.get(`/inventory/check/${type}?quantity=${quantity}`),

  add: (data: { type: string; quantity: number; note?: string }) =>
    apiClient.post("/inventory/add", data),

  remove: (data: { type: string; quantity: number; note?: string }) =>
    apiClient.post("/inventory/remove", data),

  set: (data: { type: string; quantity: number; note?: string }) =>
    apiClient.patch("/inventory/set", data),

  bulkAdd: (items: any[]) => apiClient.post("/inventory/bulk-add", items),

  bulkRemove: (items: any[]) => apiClient.post("/inventory/bulk-remove", items),
};
