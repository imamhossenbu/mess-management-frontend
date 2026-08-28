// app/(dashboard)/meals/_components/MealSummaryCards.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { DailyMealSummary } from "@/lib/api/meals";

interface MealSummaryCardsProps {
  dailySummary?: DailyMealSummary;
}

export function MealSummaryCards({ dailySummary }: MealSummaryCardsProps) {
  const cards = [
    {
      label: "Lunch",
      value: dailySummary?.totalLunch ?? 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Dinner",
      value: dailySummary?.totalDinner ?? 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      label: "Total Meals",
      value: dailySummary?.totalMeals ?? 0,
      color: "text-primary-600",
      bg: "bg-primary-50",
      border: "border-primary-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`p-4 border ${card.bg} ${card.border}`}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {card.label}
          </p>
          <p className={`text-2xl font-bold ${card.color} mt-1`}>
            {card.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
