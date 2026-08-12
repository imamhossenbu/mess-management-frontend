/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";
import { useState } from "react";
import { CreditCard, Plus, ArrowUpRight, DollarSign, ListFilter, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const { currentMess, useGetMembers } = useMess();
  const { isManager } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK" | "MOBILE_BANKING">("CASH");
  const [note, setNote] = useState("");

  // Fetch mess members for form
  const { data: members } = useGetMembers(currentMess?.id || "");

  // Fetch all user balances
  const { data: balances, isLoading: loadingBalances, refetch: refetchBalances } = useQuery({
    queryKey: ["member-balances", currentMess?.id],
    queryFn: async () => {
      const res = await paymentsApi.getAllBalances();
      return res.data;
    },
    enabled: !!currentMess,
  });

  // Fetch all payment transactions
  const { data: transactions, isLoading: loadingTransactions, refetch: refetchTransactions } = useQuery({
    queryKey: ["payment-transactions", currentMess?.id],
    queryFn: async () => {
      const res = await paymentsApi.getAll();
      return res.data;
    },
    enabled: !!currentMess,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return paymentsApi.create(data);
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      refetchBalances();
      refetchTransactions();
      setShowAddForm(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to record payment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return paymentsApi.delete(id);
    },
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      refetchBalances();
      refetchTransactions();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete payment");
    },
  });

  const resetForm = () => {
    setUserId("");
    setAmount("");
    setPaymentDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentMethod("CASH");
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    createMutation.mutate({
      userId,
      amount: parseFloat(amount),
      paymentDate,
      paymentMethod,
      note: note || undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payment transaction? This will adjust the member's balance.")) {
      deleteMutation.mutate(id);
    }
  };

  const totalFundDeposited = balances?.reduce((sum, item) => sum + Number(item.totalPaid), 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Member Deposits</h1>
          <p className="text-slate-500 mt-1">
            Log deposits, track user cash ledger, and audit overall finances.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Record Deposit
          </button>
        )}
      </div>

      {/* Record Deposit Form */}
      {showAddForm && isManager && (
        <Card className="p-6 border border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-500" /> Record Member Deposit
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Member Name</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                >
                  <option value="">-- Select Member --</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.userId}>{m.userName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Amount (৳)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Deposit Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="CASH">Cash (নগদ)</option>
                  <option value="MOBILE_BANKING">Mobile Banking (bkash/Nagad)</option>
                  <option value="BANK">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
              <input
                type="text"
                placeholder="e.g. Initial payment for August, Bazar offset"
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
                Save Deposit
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mess Deposits</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {Number(totalFundDeposited).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balances List */}
        <Card className="col-span-1 p-6 bg-white border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" /> Member Balances
          </h2>
          {loadingBalances ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {balances?.map((balanceItem) => (
                <div key={balanceItem.userId} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{balanceItem.userName}</p>
                    <p className="text-xs text-slate-400">Total Deposited: ৳{Number(balanceItem.totalPaid).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                      Number(balanceItem.balance) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                    }`}>
                      {Number(balanceItem.balance) >= 0 ? "+" : ""}৳{Number(balanceItem.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Transactions List */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary-500" /> Recent Transactions Ledger
            </h2>

            {loadingTransactions ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Member</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Note</th>
                      <th className="pb-3 text-right">Amount</th>
                      {isManager && <th className="pb-3 text-right pr-2">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions && transactions.length > 0 ? (
                      transactions.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 pl-2">
                            <span className="font-semibold text-slate-800 text-sm block">{tx.userName}</span>
                          </td>
                          <td className="py-3 text-xs text-slate-500">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium capitalize">
                              {tx.paymentMethod?.toLowerCase()}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-slate-400">
                            {format(new Date(tx.paymentDate), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 text-xs text-slate-400 max-w-[120px] truncate">
                            {tx.note || "-"}
                          </td>
                          <td className="py-3 text-right font-bold text-emerald-600 text-sm">
                            +৳ {Number(tx.amount).toLocaleString()}
                          </td>
                          {isManager && (
                            <td className="py-3 text-right pr-2">
                              <button
                                onClick={() => handleDelete(tx.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isManager ? 6 : 5} className="py-8 text-center text-slate-400 text-sm">
                          No transactions found.
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
