// app/(dashboard)/marketings/_components/MarketingsHeader.tsx
"use client";

import { ShoppingBag, Plus } from "lucide-react";
import { MonthSelector } from "./MonthSelector";

interface MarketingsHeaderProps {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  canEdit: boolean;
}

export function MarketingsHeader({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  showAddForm,
  setShowAddForm,
  canEdit,
}: MarketingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary-500" />
          Bazar List
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track daily shopping expenses and manage food inventory logging.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />

        {/* ✅ সবাই বাজার যোগ করতে পারে */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Cancel" : "Log Bazar"}
        </button>
      </div>
    </div>
  );
}