// app/(dashboard)/utility-bills/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { utilityBillsApi } from "@/lib/api/utility-bills";
import { useState } from "react";
import { FileText, Plus, Users, Landmark, CreditCard, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function UtilityBillsPage() {
  const { currentMess, useGetMembers } = useMess();
  const { isManager } = useAuth();
  
  // Date filter states
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [billType, setBillType] = useState<"CURRENT" | "WIFI" | "RENT" | "WATER" | "KHALA">("CURRENT");
  const [amount, setAmount] = useState("");
  const [paidByUserId, setPaidByUserId] = useState("");
  const [billMonthYear, setBillMonthYear] = useState(format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");

  // Fetch members for paid-by dropdown
  const { data: members } = useGetMembers(currentMess?.id || "");

  // Fetch monthly utility bills summary
  const { data: monthlySummary, isLoading, refetch } = useQuery({
    queryKey: ["monthly-utility", currentMess?.id, selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await utilityBillsApi.getMonthlySummary(selectedYear, selectedMonth);
      return res.data;
    },
    enabled: !!currentMess,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return utilityBillsApi.create(data);
    },
    onSuccess: () => {
      toast.success("Utility bill logged successfully!");
      refetch();
      setShowAddForm(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log utility bill");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return utilityBillsApi.delete(id);
    },
    onSuccess: () => {
      toast.success("Utility bill deleted!");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete utility bill");
    },
  });

  const resetForm = () => {
    setBillType("CURRENT");
    setAmount("");
    setPaidByUserId("");
    setBillMonthYear(format(new Date(), "yyyy-MM-dd"));
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      toast.error("Please enter a valid bill amount");
      return;
    }

    createMutation.mutate({
      billType,
      monthYear: billMonthYear,
      amount: parseFloat(amount),
      paidBy: paidByUserId || undefined,
      note: note || undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      deleteMutation.mutate(id);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const billLabels = {
    CURRENT: "Electricity (বিদ্যুৎ)",
    WIFI: "Internet / Wifi (ওয়াইফাই)",
    RENT: "House Rent (বাসা ভাড়া)",
    WATER: "Water (পানি)",
    KHALA: "Cook / Khala (খালা)",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utility Bills</h1>
          <p className="text-slate-500 mt-1">
            Track joint expenses and monthly utility shares per member.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month/Year selectors */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
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

          {isManager && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Utility Bill
            </button>
          )}
        </div>
      </div>

      {/* Add Utility Bill Form */}
      {showAddForm && isManager && (
        <Card className="p-6 border border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" /> Log Utility Bill
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bill Type</label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="CURRENT">Electricity (Current)</option>
                  <option value="WIFI">WiFi Internet</option>
                  <option value="RENT">Room/House Rent</option>
                  <option value="WATER">Water</option>
                  <option value="KHALA">Khala (Cook)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bill Month / Date</label>
                <input
                  type="date"
                  value={billMonthYear}
                  onChange={(e) => setBillMonthYear(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Amount (৳)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payer (Paid By Member)</label>
                <select
                  value={paidByUserId}
                  onChange={(e) => setPaidByUserId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">-- Paid from Mess Fund --</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.userId}>{m.userName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
              <input
                type="text"
                placeholder="e.g. Wifi bill for August, Khala basic salary"
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
                Save Bill
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Utilities Amount</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {Number(monthlySummary?.totalAmount ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
            <Landmark className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Per Person Share</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">৳ {Number(monthlySummary?.perPersonShare ?? 0).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bill Tally (Count)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{monthlySummary?.bills?.length ?? 0} bills</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-500 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Bill Breakdown Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-white border border-slate-50 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Electricity</p>
          <p className="text-lg font-bold text-slate-700 mt-1">৳ {Number(monthlySummary?.totalCurrent ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-50 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Wifi</p>
          <p className="text-lg font-bold text-slate-700 mt-1">৳ {Number(monthlySummary?.totalWifi ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-50 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Rent</p>
          <p className="text-lg font-bold text-slate-700 mt-1">৳ {Number(monthlySummary?.totalRent ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-50 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Water</p>
          <p className="text-lg font-bold text-slate-700 mt-1">৳ {Number(monthlySummary?.totalWater ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-50 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Khala (Cook)</p>
          <p className="text-lg font-bold text-slate-700 mt-1">৳ {Number(monthlySummary?.totalKhala ?? 0).toLocaleString()}</p>
        </Card>
      </div>

      {/* Individual Bills Tally */}
      <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" /> Logged Bills list
        </h2>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Bill Category</th>
                  <th className="pb-3">Bill Month</th>
                  <th className="pb-3">Payer Details</th>
                  <th className="pb-3">Note / Memo</th>
                  <th className="pb-3 text-right">Amount</th>
                  {isManager && <th className="pb-3 text-right pr-2">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthlySummary?.bills && monthlySummary.bills.length > 0 ? (
                  monthlySummary.bills.map((bill: any) => (
                    <tr key={bill.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 pl-2">
                        <span className="font-semibold text-slate-800 text-sm block">
                          {billLabels[bill.billType as keyof typeof billLabels] || bill.billType}
                        </span>
                      </td>
                      <td className="py-3.5 text-sm text-slate-600">
                        {format(new Date(bill.monthYear), "MMMM yyyy")}
                      </td>
                      <td className="py-3.5 text-sm text-slate-600 font-medium">
                        {bill.paidByName || "Mess Common Fund"}
                      </td>
                      <td className="py-3.5 text-xs text-slate-400 max-w-xs truncate">
                        {bill.note || "No notes"}
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-800 text-sm">
                        ৳ {Number(bill.amount).toLocaleString()}
                      </td>
                      {isManager && (
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={() => handleDelete(bill.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isManager ? 6 : 5} className="py-8 text-center text-slate-400 text-sm">
                      No bills logged for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
