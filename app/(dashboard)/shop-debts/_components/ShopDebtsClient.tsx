// app/(dashboard)/shop-debts/_components/ShopDebtsClient.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { shopDebtsApi } from "@/lib/api/shop-debts";
import { Store, Plus, Trash2, ShieldAlert, Check, Banknote, ArrowRight, Edit } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MonthSelector } from "../../marketings/_components/MonthSelector";
import { AddShopDebtModal } from "./AddShopDebtModal";
import { AddShopPaymentModal } from "./AddShopPaymentModal";
import { formatBanglaNumber } from "@/lib/banglaParser";
import { Search } from "lucide-react";

type FormType = "DEBT" | "PAYMENT" | null;

export function ShopDebtsClient() {
  const { user } = useAuth();
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const [formType, setFormType] = useState<FormType>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"DEBT" | "PAYMENT" | null>(null);
  
  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch global summary
  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
    queryKey: ["shop-debts-summary"],
    queryFn: async () => {
      const res = await shopDebtsApi.getSummary();
      return res.data;
    },
  });

  // Fetch monthly data
  const { data: monthlyData, isLoading: loadingMonthly, refetch: refetchMonthly } = useQuery({
    queryKey: ["shop-debts-monthly", selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await shopDebtsApi.getMonthlyData(selectedYear, selectedMonth);
      return res.data;
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: async (id: string) => shopDebtsApi.deleteDebt(id),
    onSuccess: () => {
      toast.success("Debt log deleted!");
      refetchSummary();
      refetchMonthly();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete debt");
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => shopDebtsApi.deletePayment(id),
    onSuccess: () => {
      toast.success("Payment log deleted!");
      refetchSummary();
      refetchMonthly();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete payment");
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteConfirmId && deleteType) {
      if (deleteType === "DEBT") {
        deleteDebtMutation.mutate(deleteConfirmId);
      } else {
        deletePaymentMutation.mutate(deleteConfirmId);
      }
      setDeleteConfirmId(null);
      setDeleteType(null);
    }
  };

  const isLoading = loadingSummary || loadingMonthly;

  // Combine debts and payments into a single ledger array
  const allLedger = [
    ...(monthlyData?.debts?.map((d: any) => ({ ...d, type: "DEBT" })) || []),
    ...(monthlyData?.payments?.map((p: any) => ({ ...p, type: "PAYMENT" })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const ledger = allLedger.filter(item => 
    item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.itemDetails && item.itemDetails.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalMonthlyDebt = monthlyData?.debts?.reduce((acc: number, d: any) => acc + Number(d.amount), 0) || 0;
  const totalMonthlyPaid = monthlyData?.payments?.reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop Debts (দোকানের বাকি)</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage credit purchases and payments to local shops.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <MonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedYear={setSelectedYear}
            setSelectedMonth={setSelectedMonth}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddDebtModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Debt
            </button>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <Banknote className="w-4 h-4" /> Pay Shop
            </button>
          </div>
        </div>
      </div>

      <AddShopDebtModal 
        isOpen={isAddDebtModalOpen} 
        onClose={() => {
          setIsAddDebtModalOpen(false);
          refetchSummary();
          refetchMonthly();
        }} 
      />
      <AddShopPaymentModal 
        isOpen={isAddPaymentModalOpen} 
        onClose={() => {
          setIsAddPaymentModalOpen(false);
          refetchSummary();
          refetchMonthly();
        }} 
      />

      {/* Global Stats summaries */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <Store className="w-4 h-4" /> Shop Balance Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credit This Month</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {formatBanglaNumber(Number(totalMonthlyDebt ?? 0))}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid This Month</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">৳ {formatBanglaNumber(Number(totalMonthlyPaid ?? 0))}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Check className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Global Due</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">৳ {formatBanglaNumber(Number(summary?.currentDue ?? 0))}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shop Wise Summary List */}
        <Card className="col-span-1 p-6 bg-white border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-500" /> Balances By Shop
          </h2>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {summary?.shopWiseSummary && summary.shopWiseSummary.length > 0 ? (
                summary.shopWiseSummary.map((shop: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{shop.shopName}</p>
                      <p className="text-[10px] text-slate-400">Total Bought: ৳{formatBanglaNumber(Number(shop.totalDebt))}</p>
                      <p className="text-[10px] text-slate-400">Total Paid: ৳{formatBanglaNumber(Number(shop.totalPaid))}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        Number(shop.currentDue) > 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        ৳{formatBanglaNumber(Number(shop.currentDue))} {Number(shop.currentDue) > 0 ? "due" : "clear"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No shop details found.</p>
              )}
            </div>
          )}
        </Card>

        {/* Shop Ledger for Selected Month */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Store className="w-5 h-5 text-primary-500" /> Monthly Ledger ({monthlyData?.month})
              </h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search products, shop..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Date</th>
                      <th className="pb-3">Details</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ledger && ledger.length > 0 ? (
                      ledger.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 pl-2 text-xs text-slate-500">
                            {format(new Date(item.date), "MMM dd")}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                                item.type === "DEBT" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                              }`}>
                                {item.type === "DEBT" ? "CREDIT BOUGHT" : "PAYMENT"}
                              </span>
                              <span className="font-semibold text-slate-800 text-sm">{item.shopName}</span>
                            </div>
                            {item.itemDetails && <span className="text-[11px] text-slate-500 block mt-0.5">{item.itemDetails}</span>}
                            {item.note && <span className="text-[10px] text-slate-400 block mt-0.5 italic">{item.note}</span>}
                            
                            {/* WHO ADDED/PAID */}
                            <span className="text-[9px] font-medium text-slate-400 block mt-1 uppercase">
                              {item.type === "DEBT" ? "Logged by: " : "Paid by: "}
                              <span className="text-primary-600">{item.recordedByName || item.paidByName}</span>
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-sm">
                            <span className={item.type === "DEBT" ? "text-rose-600" : "text-emerald-600"}>
                              {item.type === "DEBT" ? "+" : "-"} ৳ {formatBanglaNumber(Number(item.amount))}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            {/* Removed Edit Button for bulk forms */}
                            <button
                              onClick={() => {
                                setDeleteConfirmId(item.id);
                                setDeleteType(item.type);
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                          No ledger records for this month.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => { setDeleteConfirmId(null); setDeleteType(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Ledger Entry"
        message="Are you sure you want to delete this entry? This will update the shop's global balance."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteDebtMutation.isPending || deletePaymentMutation.isPending}
      />
    </div>
  );
}
