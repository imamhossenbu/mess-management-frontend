// app/(dashboard)/inventory/_components/InventoryHeader.tsx
"use client";

import { Package, Plus, RefreshCw } from "lucide-react";

interface InventoryHeaderProps {
  onAddItem: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function InventoryHeader({
  onAddItem,
  onRefresh,
  isRefreshing
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-500" />
          Freezer Inventory
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor and log all inventory items in storage.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '...' : 'Refresh'}
          </button>
        )}

        <button
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>
    </div>
  );
}