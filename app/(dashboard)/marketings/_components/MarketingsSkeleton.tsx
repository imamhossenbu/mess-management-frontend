// app/(dashboard)/marketings/_components/MarketingsSkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";

export function MarketingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-24 mt-2" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="h-5 bg-slate-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-32" />
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-20 ml-auto" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
