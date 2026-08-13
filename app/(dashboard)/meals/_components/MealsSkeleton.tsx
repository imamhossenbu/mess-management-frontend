// app/(dashboard)/meals/_components/MealsSkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { MealTableSkeleton } from "./MealTableSkeleton";

export function MealsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded w-40" />
          <div className="h-4 bg-slate-200 rounded w-64 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-slate-200 rounded-xl w-48" />
          <div className="h-10 bg-slate-200 rounded-xl w-28" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-12 mt-2" />
          </Card>
        ))}
      </div>

      <MealTableSkeleton />
    </div>
  );
}
