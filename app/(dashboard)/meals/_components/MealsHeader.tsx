/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/(dashboard)/meals/_components/MealsHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { Utensils, Save, Loader2, Calendar, CalendarDays } from "lucide-react";
import { DateSelector } from "./DateSelector";
import { DailyMealSummary } from "@/lib/api/meals";
import { format } from "date-fns"; // ✅ Import format from date-fns

type ViewMode = "daily" | "monthly";

interface MealsHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  canEdit: boolean;
  isSaving: boolean;
  onSave: (mealSelections: any) => void;
  dailySummary?: DailyMealSummary;
  members: any[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  monthlyData?: any;
}

export function MealsHeader({
  selectedDate,
  setSelectedDate,
  canEdit,
  isSaving,
  onSave,
  dailySummary,
  members,
  viewMode,
  setViewMode,
  monthlyData,
}: MealsHeaderProps) {
  const [mealSelections, setMealSelections] = useState<
    Record<string, { lunch: boolean; dinner: boolean }>
  >({});

  useEffect(() => {
    if (dailySummary?.meals && members) {
      const selections: typeof mealSelections = {};
      members.forEach((m) => {
        const existingMeal = dailySummary.meals.find(
          (meal: any) => meal.userId === m.userId,
        );
        selections[m.userId] = {
          lunch: existingMeal?.lunch || false,
          dinner: existingMeal?.dinner || false,
        };
      });
      setMealSelections(selections);
    }
  }, [dailySummary, members]);

  const handleSaveClick = () => {
    onSave(mealSelections);
  };

  const getViewLabel = () => {
    if (viewMode === "daily") {
      return "Daily View";
    }
    return `Monthly View - ${format(selectedDate, "MMMM yyyy")}`;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-primary-500" />
          Meal Sheet
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {viewMode === "daily"
            ? "Track and log daily lunch and dinner bookings."
            : `Monthly overview for ${format(selectedDate, "MMMM yyyy")}`}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* View Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "daily"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Daily
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "monthly"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Monthly
          </button>
        </div>

        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
        />

        {canEdit && viewMode === "daily" && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Sheet
          </button>
        )}
      </div>
    </div>
  );
}
