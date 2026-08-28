/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/MemberPaymentView.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useCreatePayment } from "@/lib/hooks/usePayments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MonthSelector } from "../../marketings/_components/MonthSelector";
import { monthlySummaryApi } from "@/lib/api/monthly-summary";

interface MemberPaymentViewProps {
  user: any;
  myBalance: any;
  myPayments: any[];
  isLoadingBalance: boolean;
  isLoadingPayments: boolean;
  onPaymentAdded: () => void;
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
}

export function MemberPaymentView({
  user,
  myBalance,
  myPayments,
  isLoadingBalance,
  isLoadingPayments,
  onPaymentAdded,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
}: MemberPaymentViewProps) {
  const [showForm, setShowForm] = useState(false);

  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "BANK" | "MOBILE_BANKING"
  >("CASH");
  const [note, setNote] = useState("");

  const createPayment = useCreatePayment();
  const queryClient = useQueryClient();

  // Query this month's compiled user summary sheet
  const { data: monthlySummaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ["monthly-user-summary", user.id, selectedYear, selectedMonth],
    queryFn: async () => {
      try {
        const res = await monthlySummaryApi.getUserSummaries(user.id, selectedYear, selectedMonth);
        return res.data[0] || null;
      } catch (err) {
        return null;
      }
    },
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  const hasSummary = !!monthlySummaryData;

  // 1. Balance Calculation
  // Compiled sheet uses: positive = due, negative = advance
  // Live balance uses: negative = due, positive = advance
  const displayBalance = hasSummary 
    ? Number(monthlySummaryData.currentDue)
    : myBalance ? Number(myBalance.balance) : 0;

  const isDue = hasSummary ? displayBalance > 0 : displayBalance < 0;
  const isAdvance = hasSummary ? displayBalance < 0 : displayBalance > 0;

  // 2. Total Paid / Deposited
  const displayDeposited = hasSummary
    ? Number(monthlySummaryData.totalPaid)
    : myPayments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  // 3. Bill / Expenses
  const displayBill = hasSummary ? Number(monthlySummaryData.totalBill) : null;



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    createPayment.mutate(
      {
        userId: user.id,
        amount: parseFloat(amount),
        paymentDate,
        paymentMethod,
        note: note || undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setAmount("");
          setNote("");
          queryClient.invalidateQueries({ queryKey: ["payments", "balance", user.id] });
          queryClient.invalidateQueries({ queryKey: ["payments", "user", user.id] });
          onPaymentAdded();
        },
      }
    );
  };


  const methodLabel: Record<string, string> = {
    CASH: "Cash",
    BANK: "Bank Transfer",
    MOBILE_BANKING: "Mobile Banking",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Payments</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Your financial status and payment history
          </p>
        </div>

        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
      </div>



      {/* Financial Status Cards */}
      {isLoadingBalance || loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-100 rounded-2xl h-28"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Balance / Due */}
          <Card
            className={`p-5 border-2 ${
              isDue
                ? "border-rose-200 bg-rose-50"
                : isAdvance
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDue
                    ? "bg-rose-100"
                    : isAdvance
                      ? "bg-emerald-100"
                      : "bg-slate-100"
                }`}
              >
                {isDue ? (
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                ) : isAdvance ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isDue ? "Amount Due" : isAdvance ? "Advance Balance" : "Cleared"}
                </p>
                <p
                  className={`text-2xl font-extrabold mt-0.5 ${
                    isDue
                      ? "text-rose-600"
                      : isAdvance
                        ? "text-emerald-600"
                        : "text-slate-600"
                  }`}
                >
                  ৳ {Math.abs(displayBalance).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3">
              {!hasSummary ? (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Showing Live Running Balance (Uncompiled Month)
                </div>
              ) : (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex flex-col gap-1.5 font-medium w-full">
                  <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-1.5 mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Finalized Balance for {format(new Date(selectedYear, selectedMonth - 1, 1), "MMMM yyyy")}
                  </div>
                  <div className="text-[11px] text-emerald-600 space-y-1">
                    <div className="flex justify-between items-center">
                      <span>Previous Month Balance:</span>
                      <span className="font-bold">
                        ৳{Math.abs(Number(monthlySummaryData.previousDue)).toLocaleString()} {Number(monthlySummaryData.previousDue) > 0 ? "(Due)" : Number(monthlySummaryData.previousDue) < 0 ? "(Adv)" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>(+) Bill This Month:</span>
                      <span className="font-bold">৳{Number(monthlySummaryData.totalBill).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>(-) Paid This Month:</span>
                      <span className="font-bold">৳{Number(monthlySummaryData.totalPaid).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-emerald-200/60 pt-1 mt-1 font-extrabold text-emerald-800">
                      <span>Final {Number(monthlySummaryData.currentDue) > 0 ? "Due" : "Advance"}:</span>
                      <span>৳{Math.abs(Number(monthlySummaryData.currentDue)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>



          {/* Total Paid (মেসে ও কত দিছে) */}
          <Card className="p-5 border border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Deposited This Month
                </p>
                <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                  ৳ {displayDeposited.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {hasSummary ? "Total deposits in chosen month" : "Deposited in chosen month so far"}
            </p>
          </Card>

          {/* Total Bill (মেস ওর কাছে কত পায়) */}
          <Card className="p-5 border border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bill This Month
                </p>
                <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                  {displayBill !== null ? `৳ ${displayBill.toLocaleString()}` : "Not Compiled"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {hasSummary 
                ? `Meals: ৳${Number(monthlySummaryData.mealBill).toFixed(1)} | Utility: ৳${Number(monthlySummaryData.utilityShare).toFixed(1)}`
                : "Bill will compile at month-end"
              }
            </p>
          </Card>
        </div>
      )}



      {/* Transaction History */}
      <Card className="p-6 border border-slate-100 bg-white">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-primary-500" />
          <h2 className="text-base font-bold text-slate-800">
            Payment History
          </h2>
          <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {myPayments?.length ?? 0}
          </span>
        </div>

        {isLoadingPayments ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between py-3">
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
                <div className="h-5 bg-slate-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : myPayments && myPayments.length > 0 ? (
          <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
            {[...myPayments]
              .sort(
                (a, b) =>
                  new Date(b.paymentDate).getTime() -
                  new Date(a.paymentDate).getTime(),
              )
              .map((payment) => (
                <div
                  key={payment.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {format(new Date(payment.paymentDate), "dd MMM yyyy")}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">
                          {methodLabel[payment.paymentMethod] ||
                            payment.paymentMethod}
                        </span>
                        {payment.note && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-400 truncate max-w-[120px]">
                              {payment.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-emerald-600 whitespace-nowrap">
                    + ৳ {Number(payment.amount).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No payments recorded yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
