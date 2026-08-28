/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/meals/_components/MonthlyTableView.tsx
"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
} from "date-fns";
import { Member } from "@/lib/hooks/useUsers";

interface MonthlyTableViewProps {
  data: any;
  members: Member[];
  year: number;
  month: number;
  canEdit: boolean;
  onDateClick?: (date: Date) => void;
}

type MealType = "lunch" | "dinner";

const MEAL_COLORS = {
  lunch: "bg-blue-100 text-blue-700 border-blue-200",
  dinner: "bg-purple-100 text-purple-700 border-purple-200",
};

const MEAL_LABELS = {
  lunch: "🍽️ Lunch",
  dinner: "🌙 Dinner",
};

export function MonthlyTableView({
  data,
  members,
  year,
  month,
  canEdit,
  onDateClick,
}: MonthlyTableViewProps) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    userId: string;
    date: string;
    mealType: MealType;
  } | null>(null);

  const startDate = startOfMonth(new Date(year, month - 1, 1));
  const endDate = endOfMonth(new Date(year, month - 1, 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Get daily data from API
  const dailyData = data?.dailyData || [];

  // Get meal for a specific user and date
  const getMealForUser = (userId: string, date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = dailyData.find((d: any) => d.date === dateKey);
    if (!dayData) return null;
    const userMeal = dayData.userMeals?.find((m: any) => m.userId === userId);
    return userMeal || null;
  };

  // Get meal status for a specific user, date and meal type
  const getMealStatus = (userId: string, date: Date, mealType: MealType) => {
    const userMeal = getMealForUser(userId, date);
    if (!userMeal) return false;
    return userMeal[mealType] || false;
  };

  // Get total meals for a user on a date
  const getTotalMealsForUser = (userId: string, date: Date) => {
    const userMeal = getMealForUser(userId, date);
    if (!userMeal) return 0;
    return (
      (userMeal.lunch ? 1 : 0) +
      (userMeal.dinner ? 1 : 0)
    );
  };

  // Get daily total
  const getDailyTotal = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = dailyData.find((d: any) => d.date === dateKey);
    return dayData?.totalMeals || 0;
  };

  // Get user monthly total
  const getUserMonthlyTotal = (userId: string) => {
    let total = 0;
    days.forEach((day) => {
      total += getTotalMealsForUser(userId, day);
    });
    return total;
  };

  // Toggle expand user
  const toggleExpandUser = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Handle cell click
  const handleCellClick = (userId: string, date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  // Get meal type display
  const getMealTypeDisplay = (mealType: MealType) => {
    return MEAL_LABELS[mealType];
  };

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {format(startDate, "MMMM yyyy")}
        </h2>
        <div className="text-sm text-slate-500">
          {days.length} days · {members.length} members
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-slate-500">Legend:</span>

        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-200" />
          Lunch
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-purple-200" />
          Dinner
        </span>
        <span className="flex items-center gap-1 ml-2">
          <span className="w-3 h-3 rounded border border-slate-300 bg-white" />
          No Meal
        </span>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-500 min-w-[100px]">
                Date
              </th>
              {members.map((member) => (
                <th
                  key={member.id}
                  className="px-1 py-2 text-center text-xs font-semibold text-slate-600 min-w-[60px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="truncate max-w-[60px]">
                      {member.userName.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {getUserMonthlyTotal(member.userId)}
                    </span>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-10 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-500 min-w-[60px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const isTodayDate = isToday(day);
              const dayTotal = getDailyTotal(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <tr
                  key={day.toISOString()}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition ${
                    isTodayDate ? "bg-primary-50/30" : ""
                  } ${isWeekend ? "bg-slate-50/30" : ""}`}
                >
                  {/* Date Column */}
                  <td className="sticky left-0 z-10 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>{format(day, "dd")}</span>
                      <span className="text-[10px] text-slate-400">
                        {format(day, "EEE")}
                      </span>
                      {dayTotal > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-primary-600">
                          {dayTotal}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Member Columns */}
                  {members.map((member) => {
                    const lunch = getMealStatus(member.userId, day, "lunch");
                    const dinner = getMealStatus(member.userId, day, "dinner");
                    const total = getTotalMealsForUser(member.userId, day);

                    return (
                      <td
                        key={member.id}
                        className="px-1 py-1 text-center"
                        onMouseEnter={() =>
                          setHoveredCell({
                            userId: member.userId,
                            date: format(day, "yyyy-MM-dd"),
                            mealType: "lunch",
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <button
                          onClick={() => handleCellClick(member.userId, day)}
                          className={`w-full py-1.5 px-1 rounded-lg transition-all ${
                            total > 0
                              ? "hover:scale-105 hover:shadow-md"
                              : "hover:bg-slate-50"
                          } ${isTodayDate ? "ring-1 ring-primary-200" : ""}`}
                        >
                          <div className="flex justify-center gap-0.5">
                            <span
                              className={`w-3 h-3 rounded-full transition-all ${
                                lunch
                                  ? "bg-blue-400 shadow-sm"
                                  : "border border-slate-200 bg-slate-50 opacity-40"
                              }`}
                              title={`Lunch: ${lunch ? "Yes" : "No"}`}
                            />
                            <span
                              className={`w-3 h-3 rounded-full transition-all ${
                                dinner
                                  ? "bg-purple-400 shadow-sm"
                                  : "border border-slate-200 bg-slate-50 opacity-40"
                              }`}
                              title={`Dinner: ${dinner ? "Yes" : "No"}`}
                            />
                          </div>
                          {total > 0 && (
                            <span className="text-[10px] font-medium text-slate-500 ml-0.5">
                              {total}
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Daily Total */}
                  <td className="sticky right-0 z-10 bg-white px-3 py-1.5 text-center text-xs font-bold text-primary-600">
                    {dayTotal > 0 ? dayTotal : "-"}
                  </td>
                </tr>
              );
            })}

            {/* Footer - Monthly Totals */}
            <tr className="bg-slate-100/50 border-t-2 border-slate-200 font-semibold">
              <td className="sticky left-0 z-10 bg-slate-100/50 px-3 py-2 text-xs text-slate-600">
                Total
              </td>
              {members.map((member) => (
                <td
                  key={member.id}
                  className="px-1 py-2 text-center text-sm font-bold text-primary-600"
                >
                  {getUserMonthlyTotal(member.userId)}
                </td>
              ))}
              <td className="sticky right-0 z-10 bg-slate-100/50 px-3 py-2 text-center text-sm font-bold text-primary-700">
                {data?.monthlyTotals?.totalMeals || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tooltip for hover */}
      {hoveredCell && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-50">
          <p className="font-medium">{hoveredCell.userId}</p>
          <p className="text-slate-300">{hoveredCell.date}</p>
        </div>
      )}
    </div>
  );
}
