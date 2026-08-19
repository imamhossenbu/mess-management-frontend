/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/StockCards.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Package, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { EditItemModal } from "./EditItemModal";
import { DeleteItemModal } from "./DeleteItemModal";

interface StockCardsProps {
  meatItems: any[];
  fishItems: any[];
  vegetableItems: any[];
  otherItems: any[];
  isLoading: boolean;
  onRefresh: () => void;
  canEdit: boolean;
}

export function StockCards({
  meatItems,
  fishItems,
  vegetableItems,
  otherItems,
  isLoading,
  onRefresh,
  canEdit,
}: StockCardsProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getTotalQuantity = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getLastUpdated = (items: any[]) => {
    if (items.length === 0) return null;
    const sorted = [...items].sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    );
    return sorted[0]?.lastUpdated;
  };

  const getItemsList = (items: any[]) => {
    return items
      .slice(0, 5)
      .map((item) => `${item.name}: ${item.quantity}`)
      .join(", ");
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const cards = [
    {
      title: "🥩 Meat",
      items: meatItems,
      color: "bg-rose-50 text-rose-500",
      borderColor: "border-rose-100",
    },
    {
      title: "🐟 Fish",
      items: fishItems,
      color: "bg-blue-50 text-blue-500",
      borderColor: "border-blue-100",
    },
    {
      title: "🥬 Vegetables",
      items: vegetableItems,
      color: "bg-green-50 text-green-500",
      borderColor: "border-green-100",
    },
    {
      title: "📦 Others",
      items: otherItems,
      color: "bg-slate-50 text-slate-500",
      borderColor: "border-slate-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5 md:p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-8 bg-slate-200 rounded w-20 mt-3" />
              <div className="h-3 bg-slate-200 rounded w-32 mt-2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => {
          const total = getTotalQuantity(card.items);
          const lastUpdated = getLastUpdated(card.items);
          const lowStockItems = card.items.filter(
            (item) => item.status === "LOW_STOCK"
          );

          return (
            <Card
              key={index}
              className={`p-5 md:p-6 bg-white border ${card.borderColor} relative overflow-hidden min-w-0`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  
                  <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                    <p className="text-2xl md:text-3xl font-extrabold text-slate-800">
                      {total}
                      <span className="text-sm font-normal text-slate-400 ml-1">
                        total
                      </span>
                    </p>
                    {lowStockItems.length > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3" />
                        {lowStockItems.length}
                      </span>
                    )}
                  </div>

                  {card.items.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-full">
                      {getItemsList(card.items)}
                    </p>
                  )}
                  {card.items.length === 0 && (
                    <p className="text-xs text-slate-300 mt-1">No items</p>
                  )}
                </div>
                
                <div className={`p-3 rounded-2xl ${card.color} flex-shrink-0 ml-2`}>
                  <Package className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>

              {/* Action buttons and last updated */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400 truncate">
                  Updated:{" "}
                  {lastUpdated
                    ? format(new Date(lastUpdated), "MMM dd, hh:mm a")
                    : "Never"}
                </span>
                
                {canEdit && card.items.length > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(card.items[0])}
                      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                      title="Edit item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.items[0])}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Show more items in a dropdown if many */}
              {card.items.length > 5 && (
                <details className="mt-2">
                  <summary className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                    View all {card.items.length} items
                  </summary>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                    {card.items.slice(5).map((item) => (
                      <div key={item.id} className="flex justify-between py-0.5 border-b border-slate-50 last:border-0">
                        <span className="truncate">{item.name}</span>
                        <span className="font-medium flex-shrink-0 ml-2">
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      {selectedItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSuccess={onRefresh}
        />
      )}

      {/* Delete Modal */}
      {selectedItem && (
        <DeleteItemModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}