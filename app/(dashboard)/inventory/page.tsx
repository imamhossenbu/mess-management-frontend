// app/(dashboard)/inventory/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useInventory } from "@/lib/hooks/useInventory";
import { InventoryHeader } from "./_components/InventoryHeader";
import { StockCards } from "./_components/StockCards";
import { AdjustStockForm } from "./_components/AdjustStockForm";
import { AuditLog } from "./_components/AuditLog";
import { InventorySkeleton } from "./_components/InventorySkeleton";
import { AccessDenied } from "./_components/AccessDenied";
import { AddItemModal } from "./_components/AddItemModal";
import { RefreshCw } from "lucide-react";

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, isAdmin, isManager } = useAuth();
  const canEdit = true; // All active members can manage inventory

  const {
    data: inventory,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useInventory();

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">Failed to load inventory</p>
        <p className="text-sm text-slate-400 mt-1">
          {(error as Error).message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Group inventory by category
  const meatItems = inventory?.MEAT || [];
  const fishItems = inventory?.FISH || [];
  const vegetableItems = inventory?.VEGETABLE || [];
  const otherItems = inventory?.OTHER || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <InventoryHeader onAddItem={() => setIsAddModalOpen(true)} />

        {/* Manual Refresh Button */}
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <StockCards
        meatItems={meatItems}
        fishItems={fishItems}
        vegetableItems={vegetableItems}
        otherItems={otherItems}
        isLoading={isLoading}
        onRefresh={refetch}
        canEdit={canEdit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdjustStockForm onSuccess={refetch} canEdit={canEdit} />
        <AuditLog onRefresh={refetch} />
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}