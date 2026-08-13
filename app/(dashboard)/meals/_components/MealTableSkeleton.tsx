// app/(dashboard)/meals/_components/MealTableSkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";

export function MealTableSkeleton() {
  return (
    <Card className="p-6 bg-white border border-slate-100 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-slate-200 rounded w-32" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>

      <div className="space-y-3">
        {/* Header */}
        <div className="flex gap-4 border-b pb-3">
          <div className="h-4 bg-slate-200 rounded w-32" />
          <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-12" />
        </div>

        {/* Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-slate-50">
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-16 mt-1" />
            </div>
            <div className="w-4 h-4 bg-slate-200 rounded mt-1" />
            <div className="w-4 h-4 bg-slate-200 rounded mt-1" />
            <div className="w-4 h-4 bg-slate-200 rounded mt-1" />
            <div className="h-4 bg-slate-200 rounded w-8 mt-1" />
          </div>
        ))}
      </div>
    </Card>
  );
}
