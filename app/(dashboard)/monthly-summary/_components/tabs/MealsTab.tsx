/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/monthly-summary/_components/tabs/MealsTab.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { mealsApi } from "@/lib/api/meals";
import { Utensils } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface MealsTabProps {
  year: number;
  month: number;
}

export function MealsTab({ year, month }: MealsTabProps) {
  const { data: mealData, isLoading } = useQuery({
    queryKey: ["meals-monthly", year, month],
    queryFn: async () => {
      const res = await mealsApi.getMonthlySummary(year, month);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="p-5 border border-slate-100">
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  const userMeals: any[] = mealData?.userMeals ?? mealData?.meals ?? [];
  const totalMeals = mealData?.totalMeals ?? 0;
  const mealRate = mealData?.mealRate ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Meals</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{totalMeals}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meal Rate</p>
          <p className="text-xl font-extrabold text-primary-600 mt-1">৳ {Number(mealRate).toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Members</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{userMeals.length}</p>
        </Card>
      </div>

      <Card className="p-5 bg-white border border-slate-100 overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-primary-500" />
          Meal Count Per Member
        </h3>
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-2.5 pl-2">Member</th>
              <th className="pb-2.5 text-center">Morning</th>
              <th className="pb-2.5 text-center">Lunch</th>
              <th className="pb-2.5 text-center">Dinner</th>
              <th className="pb-2.5 text-center">Total</th>
              <th className="pb-2.5 text-right pr-2">Meal Bill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {userMeals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No meal data for this month
                </td>
              </tr>
            ) : (
              userMeals
                .sort((a: any, b: any) => (b.totalMeal ?? b.total ?? 0) - (a.totalMeal ?? a.total ?? 0))
                .map((u: any) => {
                  const total = u.totalMeal ?? u.total ?? 0;
                  const mealBill = total * Number(mealRate);
                  return (
                    <tr key={u.userId ?? u.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 pl-2 font-semibold text-slate-800">{u.userName ?? u.name}</td>
                      <td className="py-3 text-center text-slate-600">{u.morning ?? "—"}</td>
                      <td className="py-3 text-center text-slate-600">{u.lunch ?? "—"}</td>
                      <td className="py-3 text-center text-slate-600">{u.dinner ?? "—"}</td>
                      <td className="py-3 text-center font-bold text-slate-800">{total}</td>
                      <td className="py-3 text-right pr-2 text-primary-600 font-semibold">
                        ৳ {mealBill.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
          {userMeals.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                <td className="py-3 pl-2">TOTAL</td>
                <td className="py-3 text-center">—</td>
                <td className="py-3 text-center">—</td>
                <td className="py-3 text-center">—</td>
                <td className="py-3 text-center">{totalMeals}</td>
                <td className="py-3 text-right pr-2 text-primary-600">
                  ৳ {(totalMeals * Number(mealRate)).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </Card>
    </div>
  );
}
