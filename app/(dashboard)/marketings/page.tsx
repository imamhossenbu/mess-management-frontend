// app/(dashboard)/marketings/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { marketingsApi } from "@/lib/api/marketings";
import { useState } from "react";
import { ShoppingBag, Plus, Calendar as CalendarIcon, Edit2, Trash2, Tag, Layers } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function MarketingsPage() {
  const { currentMess, useGetMembers } = useMess();
  const { isManager, user: currentUser } = useAuth();
  
  // Date filter states
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [buyerUserId, setBuyerUserId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentType, setPaymentType] = useState<"CASH" | "DEBT" | "SELF">("CASH");
  const [shopName, setShopName] = useState("");
  const [inventoryType, setInventoryType] = useState<"" | "MEAT" | "FISH">("");
  const [totalPieces, setTotalPieces] = useState("");
  const [usedPieces, setUsedPieces] = useState("");
  const [note, setNote] = useState("");

  // Fetch members for buyer dropdown selection
  const { data: members } = useGetMembers(currentMess?.id || "");

  // Fetch monthly marketing summary
  const { data: monthlySummary, isLoading, refetch } = useQuery({
    queryKey: ["monthly-marketing", currentMess?.id, selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await marketingsApi.getMonthly(selectedYear, selectedMonth);
      return res.data;
    },
    enabled: !!currentMess,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return marketingsApi.create(data);
    },
    onSuccess: () => {
      toast.success("Bazar purchase logged!");
      refetch();
      setShowAddForm(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log bazar purchase");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return marketingsApi.delete(id);
    },
    onSuccess: () => {
      toast.success("Bazar purchase deleted!");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete bazar purchase");
    },
  });

  const resetForm = () => {
    setItemName("");
    setQuantity("");
    setAmount("");
    setBuyerUserId("");
    setPurchaseDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentType("CASH");
    setShopName("");
    setInventoryType("");
    setTotalPieces("");
    setUsedPieces("");
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !amount || !buyerUserId) {
      toast.error("Please fill in item name, amount, and select a buyer");
      return;
    }

    const payload: any = {
      userId: buyerUserId,
      date: purchaseDate,
      itemName,
      quantity: quantity || undefined,
      amount: parseFloat(amount),
      paymentType,
      shopName: shopName || undefined,
      note: note || undefined,
    };

    if (inventoryType) {
      payload.inventoryType = inventoryType;
      if (totalPieces) payload.totalPieces = parseInt(totalPieces);
      if (usedPieces) payload.usedPieces = parseInt(usedPieces);
    }

    createMutation.mutate(payload);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bazar entry?")) {
      deleteMutation.mutate(id);
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
          <h1 className="text-2xl font-bold text-slate-900">Bazar List</h1>
          <p className="text-slate-500 mt-1">
            Track daily shopping expenses and manage food inventory logging.
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

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log Bazar Expense
          </button>
        </div>
      </div>

      {/* Add Expense Form Card */}
      {showAddForm && (
        <Card className="p-6 border border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" /> Log Bazar Expense
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken, Rice, Oil"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Quantity</label>
                <input
                  type="text"
                  placeholder="e.g. 5 kg, 2 litres"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Amount (৳)</label>
                <input
                  type="number"
                  placeholder="e.g. 1200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Buyer (Mess Member)</label>
                <select
                  value={buyerUserId}
                  onChange={(e) => setBuyerUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                >
                  <option value="">-- Choose Buyer --</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.userId}>{m.userName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payment Method</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="CASH">CASH (Paid from Mess fund)</option>
                  <option value="SELF">SELF (Paid by Member)</option>
                  <option value="DEBT">DEBT (Bbought on credit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Shop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Local Bazar Shop"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Freezer Stock (Inventory Impact)</label>
                <select
                  value={inventoryType}
                  onChange={(e) => setInventoryType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">No inventory impact (Default)</option>
                  <option value="MEAT">MEAT</option>
                  <option value="FISH">FISH</option>
                </select>
              </div>
            </div>

            {/* Inventory Fields Collapsible */}
            {inventoryType && (
              <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Total Pieces Received</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={totalPieces}
                    onChange={(e) => setTotalPieces(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Used Pieces Today (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={usedPieces}
                    onChange={(e) => setUsedPieces(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Notes</label>
              <textarea
                placeholder="Write any additional description or note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 h-20"
              />
            </div>

            <div className="flex justify-end gap-3">
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
                Save Purchase
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Monthly Bazar Total Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Marketing Cost</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳ {Number(monthlySummary?.totalAmount ?? 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Bazar list Table */}
      <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary-500" /> Bazar Sheet
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
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Item details</th>
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3 text-right">Amount</th>
                  {isManager && <th className="pb-3 text-right pr-2">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthlySummary?.marketings && monthlySummary.marketings.length > 0 ? (
                  monthlySummary.marketings.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 pl-2 text-sm text-slate-600">
                        {format(new Date(item.date), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3.5">
                        <span className="font-semibold text-slate-800 text-sm block">{item.itemName}</span>
                        {item.quantity && <span className="text-xs text-slate-400 block">Quantity: {item.quantity}</span>}
                        {item.shopName && <span className="text-[10px] text-slate-400 block mt-0.5">Shop: {item.shopName}</span>}
                        {item.note && <span className="text-[10px] italic text-slate-400 block">{item.note}</span>}
                      </td>
                      <td className="py-3.5 text-sm text-slate-600 font-medium">
                        {item.userName}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                          item.paymentType === "CASH" ? "bg-blue-50 text-blue-600" :
                          item.paymentType === "SELF" ? "bg-purple-50 text-purple-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {item.paymentType}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-800 text-sm">
                        ৳ {Number(item.amount).toLocaleString()}
                      </td>
                      {isManager && (
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={() => handleDelete(item.id)}
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
                      No bazar purchases logged for this month.
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
