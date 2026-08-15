// app/(dashboard)/inventory/_components/AccessDenied.tsx
"use client";

export function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-500 mt-2">
          Only managers and admins can manage inventory.
        </p>
      </div>
    </div>
  );
}
