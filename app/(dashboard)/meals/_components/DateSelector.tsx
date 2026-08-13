// app/(dashboard)/meals/_components/DateSelector.tsx
"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

type ViewMode = "daily" | "monthly";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  viewMode?: ViewMode;
}

export function DateSelector({
  selectedDate,
  setSelectedDate,
  viewMode = "daily",
}: DateSelectorProps) {
  const today = new Date();
  const isTodayDate = isToday(selectedDate);

  const goToToday = () => {
    setSelectedDate(today);
  };

  const handlePrev = () => {
    if (viewMode === "daily") {
      setSelectedDate(subDays(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "daily") {
      setSelectedDate(addDays(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const getDisplayText = () => {
    if (viewMode === "daily") {
      return format(selectedDate, "EEE, MMM dd");
    }
    return format(selectedDate, "MMMM yyyy");
  };

  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
      <button
        onClick={handlePrev}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        aria-label={viewMode === "daily" ? "Previous day" : "Previous month"}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={goToToday}
        className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
          isTodayDate && viewMode === "daily"
            ? "bg-primary-100 text-primary-700"
            : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {getDisplayText()}
        </div>
      </button>

      <button
        onClick={handleNext}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        aria-label={viewMode === "daily" ? "Next day" : "Next month"}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
