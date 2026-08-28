/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/meals/_components/MealsClient.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/useUsers";
import {
  useDailyMeals,
  useBulkMeals,
  useMonthlyDateWiseMeals,
} from "@/lib/hooks/useMeals";
import { MealsHeader } from "./MealsHeader";
import { MealSummaryCards } from "./MealSummaryCards";
import { MealTable } from "./MealTable";
import { MonthlyTableView } from "./MonthlyTableView";
import { MealsSkeleton } from "./MealsSkeleton";
import { format } from "date-fns";

type ViewMode = "daily" | "monthly";

export function MealsClient() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const canEdit = isManager;

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const { members, isLoading: loadingMembers } = useUsers();

  const { data: dailySummary, isLoading: loadingDaily, refetch: refetchDaily } =
    useDailyMeals(dateString);

  const { data: monthlyData, isLoading: loadingMonthly, refetch: refetchMonthly } =
    useMonthlyDateWiseMeals(year, month);

  const bulkMealsMutation = useBulkMeals();

  const isLoading = loadingMembers || (viewMode === "daily" ? loadingDaily : loadingMonthly);

  const handleSave = (
    mealSelections: Record<string, { lunch: boolean; dinner: boolean }>,
  ) => {
    const lunchUserIds: string[] = [];
    const dinnerUserIds: string[] = [];

    Object.entries(mealSelections).forEach(([userId, select]) => {
      if (select.lunch) lunchUserIds.push(userId);
      if (select.dinner) dinnerUserIds.push(userId);
    });

    bulkMealsMutation.mutate(
      { date: dateString, lunchUserIds, dinnerUserIds },
      { onSuccess: () => { refetchDaily(); refetchMonthly(); } },
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("daily");
  };

  if (isLoading) return <MealsSkeleton />;

  return (
    <div className="space-y-6">
      <MealsHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        canEdit={canEdit}
        isSaving={bulkMealsMutation.isPending}
        onSave={handleSave}
        dailySummary={dailySummary}
        members={members || []}
        viewMode={viewMode}
        setViewMode={setViewMode}
        monthlyData={monthlyData}
      />

      {viewMode === "daily" ? (
        <>
          <MealSummaryCards dailySummary={dailySummary} />
          <MealTable
            members={members || []}
            dailySummary={dailySummary}
            canEdit={canEdit}
            isSaving={bulkMealsMutation.isPending}
            onSave={handleSave}
          />
        </>
      ) : (
        <MonthlyTableView
          data={monthlyData}
          members={members || []}
          year={year}
          month={month}
          canEdit={canEdit}
          onDateClick={handleDateClick}
        />
      )}
    </div>
  );
}
