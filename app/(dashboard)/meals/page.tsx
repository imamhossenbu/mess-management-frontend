/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/meals/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { mealsApi } from "@/lib/api/meals";
import { useState, useEffect } from "react";
import { Utensils, Calendar as CalendarIcon, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import toast from "react-hot-toast";

export default function MealsPage() {
  const { currentMess, useGetMembers } = useMess();
  const { isManager } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // States for checkbox toggles (only modified by manager/admin)
  const [mealSelections, setMealSelections] = useState<{
    [userId: string]: { morning: boolean; lunch: boolean; dinner: boolean };
  }>({});

  // Fetch members to display in the grid
  const { data: members, isLoading: loadingMembers } = useGetMembers(currentMess?.id || "");

  // Fetch daily summary for selected date
  const dateString = format(selectedDate, "yyyy-MM-dd");
  const { data: dailySummary, isLoading: loadingDaily, refetch: refetchDaily } = useQuery({
    queryKey: ["daily-meals", currentMess?.id, dateString],
    queryFn: async () => {
      const res = await mealsApi.getDaily(dateString);
      return res.data;
    },
    enabled: !!currentMess,
  });

  // Populate mealSelections with data from dailySummary
  useEffect(() => {
    if (dailySummary?.meals && members) {
      const selections: typeof mealSelections = {};
      members.forEach((m) => {
        const existingMeal = dailySummary.meals.find((meal: any) => meal.userId === m.userId);
        selections[m.userId] = {
          morning: existingMeal?.morning || false,
          lunch: existingMeal?.lunch || false,
          dinner: existingMeal?.dinner || false,
        };
      });
      setMealSelections(selections);
    }
  }, [dailySummary, members]);

  // Bulk save meals mutation
  const saveMealsMutation = useMutation({
    mutationFn: async (data: {
      date: string;
      morningUserIds: string[];
      lunchUserIds: string[];
      dinnerUserIds: string[];
    }) => {
      return mealsApi.bulkCreate(data);
    },
    onSuccess: () => {
      toast.success("Meal sheet updated successfully!");
      refetchDaily();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update meals");
    },
  });

  const handleCheckboxChange = (userId: string, type: "morning" | "lunch" | "dinner") => {
    if (!isManager) return;
    setMealSelections((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [type]: !prev[userId]?.[type],
      },
    }));
  };

  const handleSave = () => {
    if (!isManager) return;

    const morningUserIds: string[] = [];
    const lunchUserIds: string[] = [];
    const dinnerUserIds: string[] = [];

    Object.entries(mealSelections).forEach(([userId, select]) => {
      if (select.morning) morningUserIds.push(userId);
      if (select.lunch) lunchUserIds.push(userId);
      if (select.dinner) dinnerUserIds.push(userId);
    });

    saveMealsMutation.mutate({
      date: dateString,
      morningUserIds,
      lunchUserIds,
      dinnerUserIds,
    });
  };

  const handleDateChange = (amount: number) => {
    setSelectedDate((prev) => (amount > 0 ? addDays(prev, 1) : subDays(prev, 1)));
  };

  const isLoading = loadingMembers || loadingDaily;

  return (
    <div className="space-y-8">
      {/* Header & Datepicker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meal Sheet</h1>
          <p className="text-slate-500 mt-1">
            Track and log daily breakfast, lunch, and dinner bookings.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm max-w-xs w-full justify-between">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span>{format(selectedDate, "EEE, MMM dd, yyyy")}</span>
          </div>

          <button
            onClick={() => handleDateChange(1)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white border border-slate-100/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Breakfast</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{dailySummary?.totalMorning ?? 0}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lunch</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{dailySummary?.totalLunch ?? 0}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dinner</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{dailySummary?.totalDinner ?? 0}</p>
        </Card>
        <Card className="p-4 bg-primary-50 border border-primary-100/80">
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Total Meals</p>
          <p className="text-2xl font-bold text-primary-700 mt-1">{dailySummary?.totalMeals ?? 0}</p>
        </Card>
      </div>

      {/* Meals Table Card */}
      <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary-500" /> Logged Meals ({members?.length || 0} Members)
          </h2>

          {isManager && (
            <button
              onClick={handleSave}
              disabled={saveMealsMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saveMealsMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Sheet
                </>
              )}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Member</th>
                  <th className="pb-3 text-center">Breakfast (সকাল)</th>
                  <th className="pb-3 text-center">Lunch (দুপুর)</th>
                  <th className="pb-3 text-center">Dinner (রাত)</th>
                  <th className="pb-3 text-right pr-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members?.map((member) => {
                  const select = mealSelections[member.userId] || {
                    morning: false,
                    lunch: false,
                    dinner: false,
                  };
                  const subtotal = (select.morning ? 1 : 0) + (select.lunch ? 1 : 0) + (select.dinner ? 1 : 0);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 pl-2">
                        <span className="font-semibold text-slate-800 text-sm">{member.userName}</span>
                        <span className="block text-[10px] text-slate-400 capitalize">{member?.role?.toLowerCase() ?? "member"}</span>
                      </td>

                      <td className="py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={select.morning}
                          onChange={() => handleCheckboxChange(member.userId, "morning")}
                          disabled={!isManager}
                          className="w-4.5 h-4.5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </td>

                      <td className="py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={select.lunch}
                          onChange={() => handleCheckboxChange(member.userId, "lunch")}
                          disabled={!isManager}
                          className="w-4.5 h-4.5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </td>

                      <td className="py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={select.dinner}
                          onChange={() => handleCheckboxChange(member.userId, "dinner")}
                          disabled={!isManager}
                          className="w-4.5 h-4.5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </td>

                      <td className="py-3.5 text-right pr-2 font-bold text-slate-700 text-sm">
                        {subtotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
