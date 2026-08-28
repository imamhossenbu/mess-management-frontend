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

type FormType = "DEBT" | "PAYMENT" | null;

export function ShopDebtsClient() {
  const { user } = useAuth();
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const [formType, setFormType] = useState<FormType>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"DEBT" | "PAYMENT" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [shopName, setShopName] = useState("Local Shop");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [itemDetails, setItemDetails] = useState("");
  const [note, setNote] = useState("");

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

  const createDebtMutation = useMutation({
    mutationFn: async (data: any) => shopDebtsApi.createDebt(data),
    onSuccess: () => {
      toast.success("Shop debt logged!");
      refetchSummary();
      refetchMonthly();
      setFormType(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log debt");
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => shopDebtsApi.createPayment(data),
    onSuccess: () => {
      toast.success("Payment logged!");
      refetchSummary();
      refetchMonthly();
      setFormType(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log payment");
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

  const updateDebtMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => shopDebtsApi.updateDebt(id, data),
    onSuccess: () => {
      toast.success("Debt log updated!");
      refetchSummary();
      refetchMonthly();
      setFormType(null);
      setEditId(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update debt");
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => shopDebtsApi.updatePayment(id, data),
    onSuccess: () => {
      toast.success("Payment log updated!");
      refetchSummary();
      refetchMonthly();
      setFormType(null);
      setEditId(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update payment");
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

  const resetForm = () => {
    setShopName("Local Shop");
    setAmount("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setItemDetails("");
    setNote("");
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please fill in shop name and amount correctly");
      return;
    }

    if (formType === "DEBT") {
      if (editId) {
        updateDebtMutation.mutate({
          id: editId,
          data: {
            shopName,
            amount: parseFloat(amount),
            date,
            itemDetails: itemDetails || undefined,
            note: note || undefined,
          }
        });
      } else {
        createDebtMutation.mutate({
          shopName,
          amount: parseFloat(amount),
          date,
          itemDetails: itemDetails || undefined,
          note: note || undefined,
        });
      }
    } else {
      if (editId) {
        updatePaymentMutation.mutate({
          id: editId,
          data: {
            shopName,
            amount: parseFloat(amount),
            date,
            note: note || undefined,
          }
        });
      } else {
        createPaymentMutation.mutate({
          shopName,
          amount: parseFloat(amount),
          date,
          note: note || undefined,
        });
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormType(item.type);
    setEditId(item.id);
    setShopName(item.shopName);
    setAmount(item.amount.toString());
    setDate(format(new Date(item.date), "yyyy-MM-dd"));
    setItemDetails(item.itemDetails || "");
    setNote(item.note || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  const ledger = [
    ...(monthlyData?.debts?.map((d: any) => ({ ...d, type: "DEBT" })) || []),
    ...(monthlyData?.payments?.map((p: any) => ({ ...p, type: "PAYMENT" })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
              onClick={() => { setFormType(formType === "DEBT" ? null : "DEBT"); resetForm(); }}
              className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Debt
            </button>
            <button
              onClick={() => { setFormType(formType === "PAYMENT" ? null : "PAYMENT"); resetForm(); }}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <Banknote className="w-4 h-4" /> Pay Shop
            </button>
          </div>
        </div>
      </div>

      {/* Record Form Modal */}
      {formType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-6 border border-slate-100 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className={`text-base font-bold mb-4 flex items-center gap-2 ${formType === "DEBT" ? "text-rose-600" : "text-emerald-600"}`}>
              {formType === "DEBT" ? <Plus className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
              {editId 
                ? (formType === "DEBT" ? "Edit Shop Debt" : "Edit Shop Payment")
                : (formType === "DEBT" ? "Log New Shop Debt" : "Log Payment to Shop")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Shop Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Local Shop"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Amount (৳)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                {formType === "DEBT" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Items purchased</label>
                    <input
                      type="text"
                      placeholder="e.g. Egg, Potato, Soap"
                      value={itemDetails}
                      onChange={(e) => setItemDetails(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note (Optional)</label>
                <input
                  type="text"
                  placeholder={formType === "DEBT" ? "Optional descriptions" : "e.g. Paid via bKash"}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setFormType(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDebtMutation.isPending || createPaymentMutation.isPending || updateDebtMutation.isPending || updatePaymentMutation.isPending}
                  className={`px-6 py-2 text-white rounded-xl text-sm font-semibold shadow transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                    formType === "DEBT" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {createDebtMutation.isPending || createPaymentMutation.isPending || updateDebtMutation.isPending || updatePaymentMutation.isPending
                    ? "Submitting..."
                    : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Global Stats summaries */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <Store className="w-4 h-4" /> Global Shop Balance (All Months)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credit Taken</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {Number(summary?.totalDebt ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid to Shop</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">৳ {Number(summary?.totalPaid ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Check className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Global Due</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">৳ {Number(summary?.currentDue ?? 0).toLocaleString()}</p>
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
                      <p className="text-[10px] text-slate-400">Total Bought: ৳{Number(shop.totalDebt).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Total Paid: ৳{Number(shop.totalPaid).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        Number(shop.currentDue) > 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        ৳{Number(shop.currentDue).toLocaleString()} {Number(shop.currentDue) > 0 ? "due" : "clear"}
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
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary-500" /> Monthly Ledger ({monthlyData?.month})
            </h2>

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
                              {item.type === "DEBT" ? "+" : "-"} ৳{Number(item.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition cursor-pointer mr-1"
                              title="Edit Entry"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
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
