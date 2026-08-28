/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/monthly-summary/_components/tabs/SummaryTab.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

interface SummaryTabProps {
  summary: any;
}

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
      <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        Compiled Calculation Sheet — {summary.month} {summary.year}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Member</th>
              <th className="pb-3 text-center">Meals</th>
              <th className="pb-3 text-right">Meal Cost</th>
              <th className="pb-3 text-right">Utility</th>
              <th className="pb-3 text-right">Total Bill</th>
              <th className="pb-3 text-right">Deposited</th>
              <th className="pb-3 text-right pr-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {summary.userSummaries?.map((u: any) => (
              <tr key={u.userId} className="hover:bg-slate-50/50 transition">
                <td className="py-3.5 pl-2">
                  <span className="font-semibold text-slate-800">{u.userName}</span>
                  {u.phone && <span className="text-xs text-slate-400 block">{u.phone}</span>}
                </td>
                <td className="py-3.5 text-center font-medium text-slate-600">{u.totalMeal}</td>
                <td className="py-3.5 text-right text-slate-600">৳ {Number(u.mealBill).toFixed(2)}</td>
                <td className="py-3.5 text-right text-slate-600">৳ {Number(u.utilityShare).toFixed(2)}</td>
                <td className="py-3.5 text-right font-semibold text-slate-700">৳ {Number(u.totalBill).toFixed(2)}</td>
                <td className="py-3.5 text-right text-emerald-600 font-semibold">
                  ৳ {Number(u.totalPaid).toLocaleString()}
                </td>
                <td className="py-3.5 text-right pr-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    Number(u.currentDue) > 0
                      ? "bg-rose-50 text-rose-600"
                      : Number(u.currentDue) < 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                  }`}>
                    {Number(u.currentDue) > 0
                      ? `Due: ৳${Number(u.currentDue).toLocaleString()}`
                      : Number(u.currentDue) < 0
                        ? `Adv: ৳${Math.abs(Number(u.currentDue)).toLocaleString()}`
                        : "Cleared"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
              <td className="py-3 pl-2">TOTAL</td>
              <td className="py-3 text-center">{summary.totalMeals}</td>
              <td className="py-3 text-right">৳ {Number(summary.totalMealBill).toLocaleString()}</td>
              <td className="py-3 text-right">৳ {Number(summary.totalUtilityBill).toLocaleString()}</td>
              <td className="py-3 text-right">৳ {Number(summary.totalBill).toLocaleString()}</td>
              <td className="py-3 text-right text-emerald-600">৳ {Number(summary.totalPaid).toLocaleString()}</td>
              <td className="py-3 text-right pr-2 text-rose-600">৳ {Number(summary.totalDue).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
