// app/(dashboard)/inventory/_components/InventorySkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";

export function InventorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded w-40" />
          <div className="h-4 bg-slate-200 rounded w-64 mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 bg-slate-200 rounded w-32" />
                <div className="h-8 bg-slate-200 rounded w-24 mt-2" />
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            </div>
            <div className="mt-4 h-3 bg-slate-200 rounded w-40" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded-xl" />
            <div className="h-10 bg-slate-200 rounded-xl" />
            <div className="h-10 bg-slate-200 rounded-xl" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-3 border-b"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-xl" />
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-200 rounded w-48 mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
