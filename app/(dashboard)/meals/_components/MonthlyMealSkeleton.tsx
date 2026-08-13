// app/(dashboard)/meals/_components/MonthlyMealSkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";

export function MonthlyMealSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-12 mt-2" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-7 gap-1">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-lg" />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="h-5 bg-slate-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3">
              <div className="flex-1 h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-8" />
              <div className="h-4 bg-slate-200 rounded w-8" />
              <div className="h-4 bg-slate-200 rounded w-8" />
              <div className="h-4 bg-slate-200 rounded w-8" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
