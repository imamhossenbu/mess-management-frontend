// app/(dashboard)/users/_components/UserSearch.tsx
"use client";

import { Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function UserSearch({ searchTerm, setSearchTerm }: UserSearchProps) {
  return (
    <div className="relative max-w-xs w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
      />
    </div>
  );
}
