// app/(dashboard)/dashboard/error.tsx
"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-rose-500" />
      </div>
      <p className="text-rose-500 font-semibold">Something went wrong!</p>
      <p className="text-sm text-slate-400 mt-1">
        {error.message || "Failed to load dashboard"}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
