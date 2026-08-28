/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/monthly-summary/_components/tabs/BazarTab.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { marketingsApi } from "@/lib/api/marketings";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface BazarTabProps {
  year: number;
  month: number;
}

export function BazarTab({ year, month }: BazarTabProps) {
  const { data: bazarData, isLoading } = useQuery({
    queryKey: ["marketings-monthly", year, month],
    queryFn: async () => {
      const res = await marketingsApi.getMonthlySummary(year, month);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-5 border border-slate-100">
            <Skeleton className="h-14 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  const entries: any[] =
    bazarData?.marketings ??
    bazarData?.entries ??
    (Array.isArray(bazarData) ? bazarData : []);

  // Group by user
  const byUser: Record<string, { name: string; total: number; count: number; entries: any[] }> = {};
  entries.forEach((e: any) => {
    const uid = e.userId ?? e.id;
    const uname = e.userName ?? e.user?.name ?? "Unknown";
    if (!byUser[uid]) byUser[uid] = { name: uname, total: 0, count: 0, entries: [] };
    byUser[uid].total += Number(e.totalAmount ?? 0);
    byUser[uid].count += 1;
    byUser[uid].entries.push(e);
  });

  const sortedUsers = Object.values(byUser).sort((a, b) => b.total - a.total);
  const grandTotal = sortedUsers.reduce((s, u) => s + u.total, 0);

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bazar Cost</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">৳ {grandTotal.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Entries</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{entries.length}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">People Did Bazar</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{sortedUsers.length}</p>
        </Card>
      </div>

      {sortedUsers.length === 0 ? (
        <Card className="p-8 text-center border border-slate-100">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No bazar entries for {MONTHS[month - 1]} {year}</p>
        </Card>
      ) : (
        sortedUsers.map((u) => <BazarUserSection key={u.name} user={u} />)
      )}
    </div>
  );
}

function BazarUserSection({ user }: { user: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-5 bg-white border border-slate-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-800 text-sm">{user.name}</p>
            <p className="text-xs text-slate-400">{user.count} entr{user.count === 1 ? "y" : "ies"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-slate-800">৳ {user.total.toLocaleString()}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 divide-y divide-slate-50">
          {user.entries
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((entry: any) => (
              <div key={entry.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {format(new Date(entry.date), "dd MMM yyyy")}
                  </p>
                  {entry.shopName && <p className="text-xs text-slate-400">{entry.shopName}</p>}
                  {entry.note && <p className="text-xs text-slate-400 italic">{entry.note}</p>}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">৳ {Number(entry.totalAmount).toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400">{entry.paymentType}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
