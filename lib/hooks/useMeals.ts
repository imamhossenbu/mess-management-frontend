/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useMeals.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mealsApi, CreateMealData, BulkMealData } from "@/lib/api/meals";
import toast from "react-hot-toast";

// Get all meals
export function useMeals() {
  return useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const response = await mealsApi.getAll();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Get single meal
export function useMeal(id: string) {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const response = await mealsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// Get daily meals
export function useDailyMeals(date?: string) {
  return useQuery({
    queryKey: ["meals", "daily", date],
    queryFn: async () => {
      const response = await mealsApi.getDailySummary(date);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Get monthly meals
export function useMonthlyMeals(year?: number, month?: number) {
  return useQuery({
    queryKey: ["meals", "monthly", year, month],
    queryFn: async () => {
      const response = await mealsApi.getMonthlySummary(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get monthly date-wise meals
export function useMonthlyDateWiseMeals(year?: number, month?: number) {
  return useQuery({
    queryKey: ["meals", "monthly-date-wise", year, month],
    queryFn: async () => {
      const response = await mealsApi.getMonthlyDateWise(year, month);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get meals by user
export function useUserMeals(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: ["meals", "user", userId, startDate, endDate],
    queryFn: async () => {
      const response = await mealsApi.getByUser(userId, startDate, endDate);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Create meal
export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealData) => mealsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Meal created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create meal");
    },
  });
}

// Bulk create meals
export function useBulkMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkMealData) => mealsApi.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Bulk meals created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create bulk meals",
      );
    },
  });
}

// Single meal type entry
export function useSingleMealEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { date: string; mealType: string; userIds: string[] }) =>
      mealsApi.singleMealEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Meal entry added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add meal entry");
    },
  });
}

// Update meal
export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mealsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meal", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Meal updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update meal");
    },
  });
}

// Delete meal
export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Meal deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete meal");
    },
  });
}

// Delete meals by date
export function useDeleteMealsByDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => mealsApi.deleteByDate(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Meals deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete meals");
    },
  });
}
