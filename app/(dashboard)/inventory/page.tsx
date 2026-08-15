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

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  const { data: inventory, isLoading, error, refetch } = useInventory();

  if (!canEdit) {
    return <AccessDenied />;
  }

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
  const fruitItems = inventory?.FRUIT || [];
  const dairyItems = inventory?.DAIRY || [];
  const oilItems = inventory?.OIL || [];
  const spiceItems = inventory?.SPICE || [];
  const riceItems = inventory?.RICE || [];
  const otherItems = inventory?.OTHER || [];

  return (
    <div className="space-y-6">
      <InventoryHeader onAddItem={() => setIsAddModalOpen(true)} />

      <StockCards
        meatItems={meatItems}
        fishItems={fishItems}
        vegetableItems={vegetableItems}
        otherItems={otherItems}
        isLoading={isLoading}
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
