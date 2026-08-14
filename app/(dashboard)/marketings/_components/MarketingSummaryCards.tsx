// app/(dashboard)/marketings/_components/MarketingSummaryCards.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { ShoppingBag, CreditCard, Users, AlertCircle } from "lucide-react";

interface MarketingSummaryCardsProps {
  data: any;
}

export function MarketingSummaryCards({ data }: MarketingSummaryCardsProps) {
  const totalAmount = data?.totalAmount || 0;
  const totalCash = data?.totalCash || 0;
  const totalDebt = data?.totalDebt || 0;
  const totalSelf = data?.totalSelf || 0;
  const totalItems = data?.totalItems || 0;

  const cards = [
    {
      label: "Total Spend",
      value: `৳ ${Number(totalAmount).toLocaleString()}`,
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Cash",
      value: `৳ ${Number(totalCash).toLocaleString()}`,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Debt",
      value: `৳ ${Number(totalDebt).toLocaleString()}`,
      icon: AlertCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Self (Member)",
      value: `৳ ${Number(totalSelf).toLocaleString()}`,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className={`p-4 border ${card.bg} border-transparent`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
            </div>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}