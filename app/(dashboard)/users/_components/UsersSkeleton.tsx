// app/(dashboard)/users/_components/UsersSkeleton.tsx
"use client";

import { Card } from "@/components/ui/Card";

export function UsersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded w-32" />
          <div className="h-4 bg-slate-200 rounded w-48 mt-2" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-48" />
      </div>

      <div className="h-40 bg-slate-100 rounded-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-5 bg-white border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2 mt-2" />
                <div className="h-3 bg-slate-200 rounded w-1/3 mt-1" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 py-3 px-4 bg-slate-100 rounded-xl">
              <div className="text-center">
                <div className="h-3 bg-slate-200 rounded w-12 mx-auto" />
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto mt-1" />
              </div>
              <div className="text-center">
                <div className="h-3 bg-slate-200 rounded w-12 mx-auto" />
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}