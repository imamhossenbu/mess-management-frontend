// app/(dashboard)/shop-debts/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { shopDebtsApi } from "@/lib/api/shop-debts";
import { useState } from "react";
import { Store, Plus, CreditCard, Calendar as CalendarIcon, Check, Trash2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function ShopDebtsPage() {
  const { currentMess } = useMess();
  const { isManager } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [shopName, setShopName] = useState("");
  const [amount, setAmount] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [itemDetails, setItemDetails] = useState("");
  const [note, setNote] = useState("");

  // Fetch shop debt summary
  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
    queryKey: ["shop-debts-summary", currentMess?.id],
    queryFn: async () => {
      const res = await shopDebtsApi.getSummary();
      return res.data;
    },
    enabled: !!currentMess,
  });

  // Fetch all shop debts
  const { data: debts, isLoading: loadingDebts, refetch: refetchDebts } = useQuery({
    queryKey: ["shop-debts-list", currentMess?.id],
    queryFn: async () => {
      const res = await shopDebtsApi.getAll();
      return res.data;
    },
    enabled: !!currentMess,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return shopDebtsApi.create(data);
    },
    onSuccess: () => {
      toast.success("Shop debt registered!");
      refetchSummary();
      refetchDebts();
      setShowAddForm(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to register shop debt");
    },
  });

  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      return shopDebtsApi.pay(id);
    },
    onSuccess: () => {
      toast.success("Debt marked as PAID!");
      refetchSummary();
      refetchDebts();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to register debt payment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return shopDebtsApi.delete(id);
    },
    onSuccess: () => {
      toast.success("Debt log deleted!");
      refetchSummary();
      refetchDebts();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete debt");
    },
  });

  const resetForm = () => {
    setShopName("");
    setAmount("");
    setPurchaseDate(format(new Date(), "yyyy-MM-dd"));
    setItemDetails("");
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please fill in shop name and amount correctly");
      return;
    }

    createMutation.mutate({
      shopName,
      amount: parseFloat(amount),
      date: purchaseDate,
      itemDetails: itemDetails || undefined,
      note: note || undefined,
    });
  };

  const handlePay = (id: string) => {
    if (confirm("Are you sure you want to mark this debt as PAID?")) {
      payMutation.mutate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this debt log?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">Only managers and admins can view shop debts.</p>
        </div>
      </div>
    );
  }

  const isLoading = loadingSummary || loadingDebts;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop Debts (বাকি খাতা)</h1>
          <p className="text-slate-500 mt-1">
            Log and manage credit bills due to local groceries or shops.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log Credit Purchase
        </button>
      </div>

      {/* Record Debt Form */}
      {showAddForm && (
        <Card className="p-6 border border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-500" /> Log Shop Credit Purchase
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Shop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bhai Bhai Store"
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
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
              <input
                type="text"
                placeholder="Optional descriptions"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition cursor-pointer"
              >
                Log Credit
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credit Amount</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {Number(summary?.totalAmount ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid Dues</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">৳ {Number(summary?.totalPaid ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Check className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Dues</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">৳ {Number(summary?.totalDue ?? 0).toLocaleString()}</p>
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
            <Store className="w-5 h-5 text-primary-500" /> Shopwise Credit Balance
          </h2>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {summary?.shopWiseSummary && summary.shopWiseSummary.length > 0 ? (
                summary.shopWiseSummary.map((shop, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{shop.shopName}</p>
                      <p className="text-xs text-slate-400">Total bills: ৳{Number(shop.totalAmount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        Number(shop.totalDue) > 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        ৳{Number(shop.totalDue).toLocaleString()} due
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

        {/* Shop Debts Ledger */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary-500" /> Credit Logs (Dues list)
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
                      <th className="pb-3 pl-2">Shop details</th>
                      <th className="pb-3">Purchase Date</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {debts && debts.length > 0 ? (
                      debts.map((debt: any) => (
                        <tr key={debt.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 pl-2">
                            <span className="font-semibold text-slate-800 text-sm block">{debt.shopName}</span>
                            {debt.itemDetails && <span className="text-xs text-slate-400 block">{debt.itemDetails}</span>}
                            {debt.note && <span className="text-[10px] text-slate-400 block italic">{debt.note}</span>}
                          </td>
                          <td className="py-3 text-xs text-slate-400">
                            {format(new Date(debt.date), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                              debt.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                            }`}>
                              {debt.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-700 text-sm">
                            ৳ {Number(debt.amount).toLocaleString()}
                          </td>
                          <td className="py-3 text-right pr-2 flex items-center justify-end gap-2">
                            {debt.status === "DUE" && (
                              <button
                                onClick={() => handlePay(debt.id)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                                title="Mark as Paid"
                              >
                                Clear Due
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(debt.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                          No credit ledger records.
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
    </div>
  );
}
