/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory";
import { useState } from "react";
import {
  Package,
  Plus,
  Minus,
  History,
  Calendar as CalendarIcon,
  ListFilter,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const { currentMess } = useMess();
  const { isManager } = useAuth();

  // Forms states
  const [actionType, setActionType] = useState<"ADD" | "REMOVE">("ADD");
  const [itemType, setItemType] = useState<"MEAT" | "FISH">("MEAT");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  // Fetch all inventory items
  const {
    data: inventories,
    isLoading: loadingInventory,
    refetch: refetchInventory,
  } = useQuery({
    queryKey: ["inventory-list", currentMess?.id],
    queryFn: async () => {
      const res = await inventoryApi.getAll();
      return res.data;
    },
    enabled: !!currentMess,
  });

  // Fetch inventory logs
  const {
    data: logs,
    isLoading: loadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["inventory-logs", currentMess?.id],
    queryFn: async () => {
      const res = await inventoryApi.getLogs();
      return res.data;
    },
    enabled: !!currentMess,
  });

  const adjustMutation = useMutation({
    mutationFn: async (data: {
      type: "MEAT" | "FISH";
      quantity: number;
      note?: string;
      reason?: string;
    }) => {
      if (actionType === "ADD") {
        return inventoryApi.add({
          type: data.type,
          quantity: data.quantity,
          note: data.note || data.reason,
        });
      } else {
        return inventoryApi.remove({
          type: data.type,
          quantity: data.quantity,
          note: data.note || data.reason,
        });
      }
    },
    onSuccess: () => {
      toast.success(`Inventory stock adjusted successfully!`);
      refetchInventory();
      refetchLogs();
      setQuantity("");
      setReason("");
      setNote("");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to adjust inventory stock",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast.error("Please enter a valid positive quantity");
      return;
    }

    adjustMutation.mutate({
      type: itemType,
      quantity: parseInt(quantity),
      reason:
        reason ||
        (actionType === "ADD" ? "Manual Refill" : "Daily Cooking Consumption"),
      note: note || undefined,
    });
  };

  const meatItem = inventories?.find((item) => item.type === "MEAT");
  const fishItem = inventories?.find((item) => item.type === "FISH");

  if (!isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">
            Only managers and admins can manage inventory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Freezer Inventory</h1>
        <p className="text-slate-500 mt-1">
          Monitor and log meat/fish stocks in storage.
        </p>
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Meat Card */}
        <Card className="p-6 bg-white border border-slate-100/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Meat (মাংস) Stock
              </p>
              {loadingInventory ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-extrabold text-slate-800 mt-2">
                  {meatItem?.quantity ?? 0}{" "}
                  <span className="text-sm font-normal text-slate-500">
                    pieces
                  </span>
                </p>
              )}
            </div>
            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Last Updated:{" "}
            {meatItem?.lastUpdated
              ? format(new Date(meatItem.lastUpdated), "MMM dd, hh:mm a")
              : "Never"}
          </div>
        </Card>

        {/* Fish Card */}
        <Card className="p-6 bg-white border border-slate-100/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fish (মাছ) Stock
              </p>
              {loadingInventory ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-extrabold text-slate-800 mt-2">
                  {fishItem?.quantity ?? 0}{" "}
                  <span className="text-sm font-normal text-slate-500">
                    pieces
                  </span>
                </p>
              )}
            </div>
            <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Last Updated:{" "}
            {fishItem?.lastUpdated
              ? format(new Date(fishItem.lastUpdated), "MMM dd, hh:mm a")
              : "Never"}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adjust Stock Form */}
        <Card className="p-6 bg-white border border-slate-100 h-fit">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" /> Adjust Stock
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Adjustment Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActionType("ADD")}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    actionType === "ADD"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("REMOVE")}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    actionType === "REMOVE"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" /> Consume Stock
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Item Type
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="MEAT">Meat (মাংস)</option>
                <option value="FISH">Fish (মাছ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Quantity (Pieces)
              </label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Reason / Description
              </label>
              <input
                type="text"
                placeholder={
                  actionType === "ADD"
                    ? "e.g. Manual Refill, Bazar Buy"
                    : "e.g. Lunch Cooking, Dinner Cooking"
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Extra Note
              </label>
              <input
                type="text"
                placeholder="Optional notes"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <button
              type="submit"
              disabled={adjustMutation.isPending}
              className={`w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                actionType === "ADD"
                  ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-100"
                  : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-100"
              }`}
            >
              {adjustMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {actionType === "ADD" ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  Confirm Adjustment
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Audit Log Timeline */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-primary-500" /> Inventory Audit
              Log
            </h2>

            {loadingLogs ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[400px] pr-2 space-y-4">
                {logs && logs.length > 0 ? (
                  logs.map((log: any) => {
                    const isAddition = log.change > 0;
                    return (
                      <div
                        key={log.id}
                        className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0"
                      >
                        <div className="flex gap-3">
                          <div
                            className={`p-2 rounded-xl mt-0.5 ${
                              log.inventory?.type === "MEAT"
                                ? "bg-rose-50 text-rose-500"
                                : "bg-blue-50 text-blue-500"
                            }`}
                          >
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {log.inventory?.type} stock{" "}
                              {isAddition ? "added" : "consumed"}
                            </p>
                            <p className="text-xs text-slate-400">
                              Reason: {log.reason}
                            </p>
                            {log.note && (
                              <p className="text-xs italic text-slate-400">
                                Note: {log.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${isAddition ? "text-emerald-600" : "text-rose-500"}`}
                          >
                            {isAddition ? "+" : ""}
                            {log.change} pcs
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {format(new Date(log.date), "MMM dd, hh:mm a")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">
                    No inventory logs recorded.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
