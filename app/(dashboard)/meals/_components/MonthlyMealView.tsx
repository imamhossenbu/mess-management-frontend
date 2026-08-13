/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/meals/_components/MonthlyMealView.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { Member } from "@/lib/hooks/useUsers";

interface MonthlyMealViewProps {
  data: any;
  members: Member[];
  year: number;
  month: number;
  canEdit: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function MonthlyMealView({
  data,
  members,
  year,
  month,
  canEdit,
  selectedDate,
  setSelectedDate,
}: MonthlyMealViewProps) {
  const startDate = startOfMonth(new Date(year, month - 1, 1));
  const endDate = endOfMonth(new Date(year, month - 1, 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const dailyData = data?.dailyData || [];

  // Get user totals
  const userTotals = data?.userMonthlyTotals || [];

  // Function to get meal count for a day
  const getDayMeals = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const dayData = dailyData.find((d: any) => d.date === dateKey);
    return (
      dayData || {
        totalMeals: 0,
        totalMorning: 0,
        totalLunch: 0,
        totalDinner: 0,
      }
    );
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Meals
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {data?.monthlyTotals?.totalMeals || 0}
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border border-amber-100">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Breakfast
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {data?.monthlyTotals?.totalMorning || 0}
          </p>
        </Card>
        <Card className="p-4 bg-blue-50 border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Lunch
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {data?.monthlyTotals?.totalLunch || 0}
          </p>
        </Card>
        <Card className="p-4 bg-purple-50 border border-purple-100">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Dinner
          </p>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {data?.monthlyTotals?.totalDinner || 0}
          </p>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {format(startDate, "MMMM yyyy")}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-slate-400 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells before start of month */}
          {Array.from({ length: startDate.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day Cells */}
          {days.map((day) => {
            const dayMeals = getDayMeals(day);
            const isSelected =
              format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square p-1 rounded-lg text-center transition-all hover:shadow-md
                  ${isSelected ? "ring-2 ring-primary-500 bg-primary-50" : ""}
                  ${isTodayDate ? "border-2 border-primary-300" : "border border-transparent"}
                  ${!isSameMonth(day, startDate) ? "opacity-40" : "hover:bg-slate-50"}
                `}
              >
                <div className="text-xs font-medium text-slate-700">
                  {format(day, "d")}
                </div>
                {dayMeals.totalMeals > 0 && (
                  <div className="mt-0.5 text-[10px] font-bold text-primary-600">
                    {dayMeals.totalMeals}
                  </div>
                )}
                {dayMeals.totalMeals > 0 && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {dayMeals.totalMorning > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                    {dayMeals.totalLunch > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                    {dayMeals.totalDinner > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* User Monthly Summary */}
      <Card className="p-6 bg-white border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Member Monthly Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Member</th>
                <th className="pb-3 text-center">Breakfast</th>
                <th className="pb-3 text-center">Lunch</th>
                <th className="pb-3 text-center">Dinner</th>
                <th className="pb-3 text-right pr-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userTotals.map((user: any) => (
                <tr
                  key={user.userId}
                  className="hover:bg-slate-50/50 transition"
                >
                  <td className="py-3 pl-2">
                    <p className="font-semibold text-slate-800 text-sm">
                      {user.userName}
                    </p>
                  </td>
                  <td className="py-3 text-center text-amber-600 font-medium">
                    {user.morning || 0}
                  </td>
                  <td className="py-3 text-center text-blue-600 font-medium">
                    {user.lunch || 0}
                  </td>
                  <td className="py-3 text-center text-purple-600 font-medium">
                    {user.dinner || 0}
                  </td>
                  <td className="py-3 text-right pr-2 font-bold text-slate-700">
                    {user.totalMeals || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
