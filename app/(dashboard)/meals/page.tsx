// app/(dashboard)/meals/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/useUsers";
import {
  useDailyMeals,
  useBulkMeals,
  useMonthlyDateWiseMeals,
} from "@/lib/hooks/useMeals";
import { MealsHeader } from "./_components/MealsHeader";
import { MealSummaryCards } from "./_components/MealSummaryCards";
import { MealTable } from "./_components/MealTable";
import { MonthlyTableView } from "./_components/MonthlyTableView";
import { MealsSkeleton } from "./_components/MealsSkeleton";
import { format } from "date-fns";

type ViewMode = "daily" | "monthly";

export default function MealsPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const canEdit = isManager;

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // Get members
  const { members, isLoading: loadingMembers } = useUsers();

  // Get daily meals
  const {
    data: dailySummary,
    isLoading: loadingDaily,
    refetch: refetchDaily,
  } = useDailyMeals(dateString);

  // Get monthly meals
  const {
    data: monthlyData,
    isLoading: loadingMonthly,
    refetch: refetchMonthly,
  } = useMonthlyDateWiseMeals(year, month);

  // Bulk save mutation
  const bulkMealsMutation = useBulkMeals();

  const isLoading =
    loadingMembers || (viewMode === "daily" ? loadingDaily : loadingMonthly);

  // Handle save
  const handleSave = (
    mealSelections: Record<
      string,
      { morning: boolean; lunch: boolean; dinner: boolean }
    >,
  ) => {
    const morningUserIds: string[] = [];
    const lunchUserIds: string[] = [];
    const dinnerUserIds: string[] = [];

    Object.entries(mealSelections).forEach(([userId, select]) => {
      if (select.morning) morningUserIds.push(userId);
      if (select.lunch) lunchUserIds.push(userId);
      if (select.dinner) dinnerUserIds.push(userId);
    });

    bulkMealsMutation.mutate(
      {
        date: dateString,
        morningUserIds,
        lunchUserIds,
        dinnerUserIds,
      },
      {
        onSuccess: () => {
          refetchDaily();
          refetchMonthly();
        },
      },
    );
  };

  // Handle date click from monthly view
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("daily");
  };

  if (isLoading) {
    return <MealsSkeleton />;
  }

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
