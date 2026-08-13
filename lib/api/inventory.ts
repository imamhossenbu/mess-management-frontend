// lib/api/inventory.ts
import { apiClient } from "./client";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minStockLevel: number;
  purchasePrice?: number;
  sellingPrice?: number;
  lastUpdated: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  inventoryItemId: string;
  change: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface CreateInventoryItemData {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minStockLevel: number;
  purchasePrice?: number;
  sellingPrice?: number;
}

export interface AddInventoryData {
  itemName: string;
  quantity: number;
  unit: string;
  marketingItemId?: string;
  note?: string;
}

export interface RemoveInventoryData {
  itemName: string;
  quantity: number;
  note?: string;
}

export interface SetInventoryData {
  itemName: string;
  quantity: number;
  note?: string;
}

export const inventoryApi = {
  // Get all inventory items
  getAll: () => apiClient.get<Record<string, InventoryItem[]>>("/inventory"),

  // Get inventory summary
  getSummary: () => apiClient.get("/inventory/summary"),

  // Get by category
  getByCategory: (category: string) =>
    apiClient.get<InventoryItem[]>(`/inventory/category/${category}`),

  // Get single item
  getItem: (name: string) =>
    apiClient.get<InventoryItem>(`/inventory/item/${name}`),

  // Create inventory item
  createItem: (data: CreateInventoryItemData) =>
    apiClient.post<InventoryItem>("/inventory/items", data),

  // Update inventory item
  updateItem: (name: string, data: Partial<CreateInventoryItemData>) =>
    apiClient.patch<InventoryItem>(`/inventory/items/${name}`, data),

  // Add inventory
  add: (data: AddInventoryData) => apiClient.post("/inventory/add", data),

  // Remove inventory
  remove: (data: RemoveInventoryData) =>
    apiClient.post("/inventory/remove", data),

  // Set inventory (manual)
  set: (data: SetInventoryData) => apiClient.post("/inventory/set", data),

  // Get stock logs
  getLogs: (itemName?: string) => {
    const url = itemName
      ? `/inventory/logs?itemName=${itemName}`
      : "/inventory/logs";
    return apiClient.get<InventoryLog[]>(url);
  },

  // Check availability
  checkAvailability: (itemName: string, quantity: number) =>
    apiClient.get(`/inventory/check/${itemName}?quantity=${quantity}`),
};
