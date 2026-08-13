// app/(dashboard)/users/_components/UsersHeader.tsx
"use client";

import { Users } from "lucide-react";

export function UsersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-500" />
          Members
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage users and permissions for your mess
        </p>
      </div>
    </div>
  );
}
