// // lib/api/inventory.ts
// import { apiClient } from "./client";

// export interface InventoryItem {
//   id: string;
//   name: string;
//   category: string;
//   quantity: number;
//   minStockLevel: number;
//   lastUpdated: string;
//   status: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface InventoryLog {
//   id: string;
//   inventoryItemId: string;
//   change: number;
//   previousQuantity: number;
//   newQuantity: number;
//   reason: string;
//   note?: string;
//   date: string;
//   createdAt: string;
//   inventoryItem?: {
//     id: string;
//     name: string;
//     category: string;
//   };
// }

// export interface CreateInventoryItemData {
//   name: string;
//   category: string;
//   initialQuantity: number;
//   minStockLevel: number;
// }

// export interface AddInventoryData {
//   itemName: string;
//   quantity: number;
//   note?: string;
// }

// export interface RemoveInventoryData {
//   itemName: string;
//   quantity: number;
//   note?: string;
// }

// export interface SetInventoryData {
//   itemName: string;
//   quantity: number;
//   note?: string;
// }

// export const inventoryApi = {
//   getAll: () => apiClient.get<Record<string, InventoryItem[]>>("/inventory"),
//   getSummary: () => apiClient.get("/inventory/summary"),
//   getByCategory: (category: string) =>
//     apiClient.get<InventoryItem[]>(`/inventory/category/${category}`),
//   getItem: (name: string) =>
//     apiClient.get<InventoryItem>(`/inventory/item/${name}`),
//   createItem: (data: CreateInventoryItemData) =>
//     apiClient.post<InventoryItem>("/inventory/items", data),
//   updateItem: (name: string, data: Partial<CreateInventoryItemData>) =>
//     apiClient.patch<InventoryItem>(`/inventory/items/${name}`, data),
//   add: (data: AddInventoryData) => apiClient.post("/inventory/add", data),
//   remove: (data: RemoveInventoryData) =>
//     apiClient.post("/inventory/remove", data),
//   set: (data: SetInventoryData) => apiClient.post("/inventory/set", data),
//   getLogs: (itemName?: string) => {
//     const url = itemName
//       ? `/inventory/logs?itemName=${itemName}`
//       : "/inventory/logs";
//     return apiClient.get<InventoryLog[]>(url);
//   },
//   checkAvailability: (itemName: string, quantity: number) =>
//     apiClient.get(`/inventory/check/${itemName}?quantity=${quantity}`),
// };

// lib/api/inventory.ts
import { apiClient } from "./client";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  lastUpdated: string;
  status: string;
  isActive: boolean;
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
  inventoryItem?: {
    id: string;
    name: string;
    category: string;
  };
}

export interface CreateInventoryItemData {
  name: string;
  category: string;
  initialQuantity: number;
  minStockLevel: number;
}

export interface UpdateInventoryItemData {
  name?: string;
  category?: string;
  minStockLevel?: number;
  isActive?: boolean;
}

export interface AddInventoryData {
  itemName: string;
  quantity: number;
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
  getAll: () => apiClient.get<Record<string, InventoryItem[]>>("/inventory"),
  getSummary: () => apiClient.get("/inventory/summary"),
  getByCategory: (category: string) =>
    apiClient.get<InventoryItem[]>(`/inventory/category/${category}`),
  getItem: (name: string) =>
    apiClient.get<InventoryItem & { logs: InventoryLog[] }>(
      `/inventory/item/${name}`,
    ),
  createItem: (data: CreateInventoryItemData) =>
    apiClient.post<InventoryItem>("/inventory/items", data),
  updateItem: (name: string, data: UpdateInventoryItemData) =>
    apiClient.patch<InventoryItem>(`/inventory/items/${name}`, data),
  add: (data: AddInventoryData) => apiClient.post("/inventory/add", data),
  remove: (data: RemoveInventoryData) =>
    apiClient.post("/inventory/remove", data),
  set: (data: SetInventoryData) => apiClient.post("/inventory/set", data),
  getLogs: (itemName?: string) => {
    const url = itemName
      ? `/inventory/logs?itemName=${itemName}`
      : "/inventory/logs";
    return apiClient.get<InventoryLog[]>(url);
  },
  checkAvailability: (itemName: string, quantity: number) =>
    apiClient.get(`/inventory/check/${itemName}?quantity=${quantity}`),
  deleteItem: (name: string) => apiClient.delete(`/inventory/items/${name}`),
};
