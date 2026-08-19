// // lib/hooks/useInventory.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   inventoryApi,
//   CreateInventoryItemData,
//   AddInventoryData,
//   RemoveInventoryData,
//   SetInventoryData,
// } from "@/lib/api/inventory";
// import toast from "react-hot-toast";

// export function useInventory() {
//   return useQuery({
//     queryKey: ["inventory"],
//     queryFn: async () => {
//       const response = await inventoryApi.getAll();
//       return response.data;
//     },
//     staleTime: 2 * 60 * 1000,
//   });
// }

// export function useInventorySummary() {
//   return useQuery({
//     queryKey: ["inventory", "summary"],
//     queryFn: async () => {
//       const response = await inventoryApi.getSummary();
//       return response.data;
//     },
//     staleTime: 2 * 60 * 1000,
//   });
// }

// export function useInventoryByCategory(category: string) {
//   return useQuery({
//     queryKey: ["inventory", "category", category],
//     queryFn: async () => {
//       const response = await inventoryApi.getByCategory(category);
//       return response.data;
//     },
//     enabled: !!category,
//     staleTime: 2 * 60 * 1000,
//   });
// }

// export function useInventoryItem(name: string) {
//   return useQuery({
//     queryKey: ["inventory", "item", name],
//     queryFn: async () => {
//       const response = await inventoryApi.getItem(name);
//       return response.data;
//     },
//     enabled: !!name,
//     staleTime: 2 * 60 * 1000,
//   });
// }

// export function useCreateInventoryItem() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateInventoryItemData) =>
//       inventoryApi.createItem(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["inventory"] });
//       queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
//       toast.success("Inventory item created successfully!");
//     },
//     onError: (error: any) => {
//       toast.error(
//         error.response?.data?.message || "Failed to create inventory item",
//       );
//     },
//   });
// }

// export function useAddInventory() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: AddInventoryData) => {
//       // ✅ Ensure unit is provided
//       const payload = {
//         ...data,
//         unit: data.unit || "KG",
//       };
//       return inventoryApi.add(payload);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["inventory"] });
//       queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
//       toast.success("Inventory added successfully!");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to add inventory");
//     },
//   });
// }

// export function useRemoveInventory() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: RemoveInventoryData) => inventoryApi.remove(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["inventory"] });
//       queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
//       toast.success("Inventory removed successfully!");
//     },
//     onError: (error: any) => {
//       toast.error(
//         error.response?.data?.message || "Failed to remove inventory",
//       );
//     },
//   });
// }

// export function useSetInventory() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: SetInventoryData) => inventoryApi.set(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["inventory"] });
//       queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
//       toast.success("Inventory updated successfully!");
//     },
//     onError: (error: any) => {
//       toast.error(
//         error.response?.data?.message || "Failed to update inventory",
//       );
//     },
//   });
// }

// export function useInventoryLogs(itemName?: string) {
//   return useQuery({
//     queryKey: ["inventory", "logs", itemName],
//     queryFn: async () => {
//       const response = await inventoryApi.getLogs(itemName);
//       return response.data;
//     },
//     staleTime: 2 * 60 * 1000,
//   });
// }

// export function useCheckAvailability(itemName: string, quantity: number) {
//   return useQuery({
//     queryKey: ["inventory", "check", itemName, quantity],
//     queryFn: async () => {
//       const response = await inventoryApi.checkAvailability(itemName, quantity);
//       return response.data;
//     },
//     enabled: !!itemName && !!quantity,
//     staleTime: 1 * 60 * 1000,
//   });
// }

// lib/hooks/useInventory.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useInventory.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useInventory.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inventoryApi,
  CreateInventoryItemData,
  AddInventoryData,
  RemoveInventoryData,
  SetInventoryData,
  UpdateInventoryItemData,
} from "@/lib/api/inventory";
import toast from "react-hot-toast";

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await inventoryApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    // ❌ refetchInterval removed
    // ❌ refetchIntervalInBackground removed
  });
}

export function useInventorySummary() {
  return useQuery({
    queryKey: ["inventory", "summary"],
    queryFn: async () => {
      const response = await inventoryApi.getSummary();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useInventoryByCategory(category: string) {
  return useQuery({
    queryKey: ["inventory", "category", category],
    queryFn: async () => {
      const response = await inventoryApi.getByCategory(category);
      return response.data;
    },
    enabled: !!category,
    staleTime: 2 * 60 * 1000,
  });
}

export function useInventoryItem(name: string) {
  return useQuery({
    queryKey: ["inventory", "item", name],
    queryFn: async () => {
      const response = await inventoryApi.getItem(name);
      return response.data;
    },
    enabled: !!name,
    staleTime: 2 * 60 * 1000,
  });
}

export function useInventoryLogs(itemName?: string) {
  return useQuery({
    queryKey: ["inventory", "logs", itemName],
    queryFn: async () => {
      const response = await inventoryApi.getLogs(itemName);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCheckAvailability(itemName: string, quantity: number) {
  return useQuery({
    queryKey: ["inventory", "check", itemName, quantity],
    queryFn: async () => {
      const response = await inventoryApi.checkAvailability(itemName, quantity);
      return response.data;
    },
    enabled: !!itemName && !!quantity,
    staleTime: 1 * 60 * 1000,
  });
}

// ==================== MUTATIONS ====================

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryItemData) =>
      inventoryApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create inventory item",
      );
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemName,
      data,
    }: {
      itemName: string;
      data: UpdateInventoryItemData;
    }) => inventoryApi.updateItem(itemName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory item",
      );
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemName: string) => inventoryApi.deleteItem(itemName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete inventory item",
      );
    },
  });
}

export function useAddInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddInventoryData) => inventoryApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add inventory");
    },
  });
}

export function useRemoveInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveInventoryData) => inventoryApi.remove(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove inventory",
      );
    },
  });
}

export function useSetInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetInventoryData) => inventoryApi.set(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory",
      );
    },
  });
}
