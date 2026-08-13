// app/(dashboard)/monthly-summary/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { monthlySummaryApi } from "@/lib/api/monthly-summary";
import { useState } from "react";
import { Calendar as CalendarIcon, RefreshCw, Layers, CheckCircle2, ChevronRight, FileSpreadsheet, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function MonthlySummaryPage() {
  const { isManager } = useAuth();
  
  // Date states
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Fetch monthly summary
  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ["monthly-summary-sheet", selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await monthlySummaryApi.getByMonth(selectedYear, selectedMonth);
      return res.data;
    },
    enabled: true,
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { year: number; month: number }) => {
      return monthlySummaryApi.generate(data);
    },
    onSuccess: () => {
      toast.success("Monthly summary generated successfully!");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to calculate monthly summary");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: { year: number; month: number }) => {
      return monthlySummaryApi.deleteByMonth(data.year, data.month);
    },
    onSuccess: () => {
      toast.success("Monthly summary cleared!");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete monthly summary");
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ year: selectedYear, month: selectedMonth });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to clear/delete this monthly calculation sheet? This will not delete daily meal logs or payments, only the compiled summary details.")) {
      deleteMutation.mutate({ year: selectedYear, month: selectedMonth });
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Summary</h1>
          <p className="text-slate-500 mt-1">
            Generate and view consolidated monthly sheets, meal rates, and bills.
          </p>
        </div>

        {/* Date Filter Selection */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm max-w-xs w-full justify-between">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-2 py-1.5 bg-white border-0 text-sm font-semibold text-slate-700 outline-none focus:ring-0"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-2 py-1.5 bg-white border-0 border-l border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:ring-0"
          >
            {[...Array(5)].map((_, i) => {
              const yr = new Date().getFullYear() - 2 + i;
              return <option key={yr} value={yr}>{yr}</option>;
            })}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[0, 1, 2, 3].map((item) => <SkeletonCard key={item} />)}</div>
          <Skeleton className="h-80 w-full" />
        </div>
      ) : summary?.isGenerated ? (
        /* Summary sheet generated - show dashboard and details */
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metrics cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-4 bg-white border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meal Rate</p>
              <p className="text-2xl font-extrabold text-primary-600 mt-1">৳ {Number(summary.mealRate).toFixed(2)}</p>
            </Card>
            <Card className="p-4 bg-white border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Meals</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{summary.totalMeals}</p>
            </Card>
            <Card className="p-4 bg-white border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bazar Cost</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">৳ {Number(summary.totalMealBill).toLocaleString()}</p>
            </Card>
            <Card className="p-4 bg-white border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utility Bills</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">৳ {Number(summary.totalUtilityBill).toLocaleString()}</p>
            </Card>
          </div>

          {/* Action Row */}
          {isManager && (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generateMutation.isPending ? "animate-spin" : ""}`} /> Recalculate Sheet
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear sheet
              </button>
            </div>
          )}

          {/* Sheet details table */}
          <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary-500" /> Compiled Calculation Sheet
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Member</th>
                    <th className="pb-3 text-center">Meals</th>
                    <th className="pb-3 text-right">Meal Cost (A)</th>
                    <th className="pb-3 text-right">Utility Cost (B)</th>
                    <th className="pb-3 text-right">Total Bill (A+B)</th>
                    <th className="pb-3 text-right">Total Deposited</th>
                    <th className="pb-3 text-right">Prev Due/Adv</th>
                    <th className="pb-3 text-right pr-2">Net Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {summary.userSummaries?.map((user: any) => {
                    const statusVal = Number(user.currentDue);
                    const isDue = statusVal < 0; // Negative due means they owe money/due, wait let's check
                    // Actually let's look at schema logic:
                    // currentDue = previousDue + totalBill - totalPaid
                    // If currentDue > 0, they owe money (DUE). If currentDue < 0, they have extra advance balance.
                    const displayStatusStr = Number(user.currentDue) > 0 
                      ? `Due: ৳${Number(user.currentDue).toLocaleString()}` 
                      : `Advance: ৳${Math.abs(Number(user.currentDue)).toLocaleString()}`;

                    return (
                      <tr key={user.userId} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 pl-2">
                          <span className="font-semibold text-slate-800">{user.userName}</span>
                        </td>
                        <td className="py-3.5 text-center font-medium text-slate-600">
                          {user.totalMeal}
                        </td>
                        <td className="py-3.5 text-right text-slate-600">
                          ৳ {Number(user.mealBill).toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right text-slate-600">
                          ৳ {Number(user.utilityShare).toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right font-semibold text-slate-700">
                          ৳ {Number(user.totalBill).toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right text-emerald-600 font-semibold">
                          ৳ {Number(txAmount(user.totalPaid)).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right text-slate-500">
                          ৳ {Number(user.previousDue).toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                            Number(user.currentDue) > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {Number(user.currentDue) > 0 ? "-" : "+"} ৳{Math.abs(Number(user.currentDue)).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Sheet not generated prompt */
        <div className="py-16 text-center max-w-md mx-auto">
          <Card className="p-8 bg-white border border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Sheet Not Calculated</h2>
            <p className="text-slate-500 text-sm mt-2 mb-6">
              The monthly calculation sheet for {months[selectedMonth - 1]} {selectedYear} has not been compiled yet.
            </p>

            {isManager ? (
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generateMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> Calculate & Compile Sheet
                  </>
                )}
              </button>
            ) : (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg">
                ⚠️ Only managers or admins can generate this sheet.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// Small helper to ensure we output valid transaction sum
function txAmount(amount: any) {
  return isNaN(Number(amount)) ? 0 : Number(amount);
}
