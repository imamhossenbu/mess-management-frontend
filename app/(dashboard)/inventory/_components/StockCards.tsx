/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/StockCards.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Package } from "lucide-react";
import { format } from "date-fns";

interface StockCardsProps {
  meatItems: any[];
  fishItems: any[];
  vegetableItems: any[];
  otherItems: any[];
  isLoading: boolean;
}

export function StockCards({
  meatItems,
  fishItems,
  vegetableItems,
  otherItems,
  isLoading,
}: StockCardsProps) {
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
      .map((item) => `${item.name}: ${item.quantity} ${item.unit}`)
      .join(", ");
  };

  const cards = [
    {
      title: "Meat Items",
      items: meatItems,
      icon: "🥩",
      color: "bg-rose-50 text-rose-500",
    },
    {
      title: "Fish Items",
      items: fishItems,
      icon: "🐟",
      color: "bg-blue-50 text-blue-500",
    },
    {
      title: "Vegetable Items",
      items: vegetableItems,
      icon: "🥬",
      color: "bg-green-50 text-green-500",
    },
    {
      title: "Other Items",
      items: otherItems,
      icon: "📦",
      color: "bg-slate-50 text-slate-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const total = getTotalQuantity(card.items);
        const lastUpdated = getLastUpdated(card.items);

        return (
          <Card
            key={index}
            className="p-6 bg-white border border-slate-100/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>{card.icon}</span> {card.title}
                </p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-2" />
                ) : (
                  <>
                    <p className="text-3xl font-extrabold text-slate-800 mt-2">
                      {total}{" "}
                      <span className="text-sm font-normal text-slate-500">
                        total
                      </span>
                    </p>
                    {card.items.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {getItemsList(card.items)}
                      </p>
                    )}
                    {card.items.length === 0 && (
                      <p className="text-xs text-slate-300 mt-1">No items</p>
                    )}
                  </>
                )}
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <Package className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Last Updated:{" "}
              {lastUpdated
                ? format(new Date(lastUpdated), "MMM dd, hh:mm a")
                : "Never"}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
