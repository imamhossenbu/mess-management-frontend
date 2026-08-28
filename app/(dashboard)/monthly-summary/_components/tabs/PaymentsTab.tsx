/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/monthly-summary/_components/tabs/PaymentsTab.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";

interface PaymentsTabProps {
  year: number;
  month: number;
}

export function PaymentsTab({ year, month }: PaymentsTabProps) {
  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payments-monthly", year, month],
    queryFn: async () => {
      const res = await paymentsApi.getByMonth(year, month);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Card className="p-5 border border-slate-100"><Skeleton className="h-48 w-full" /></Card>
      </div>
    );
  }

  const payments: any[] = Array.isArray(paymentData) ? paymentData : [];
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
  );

  // Group by user
  const byUser: Record<string, { name: string; total: number; count: number }> = {};
  payments.forEach((p: any) => {
    const uid = p.userId;
    const uname = p.userName ?? "Unknown";
    if (!byUser[uid]) byUser[uid] = { name: uname, total: 0, count: 0 };
    byUser[uid].total += Number(p.amount);
    byUser[uid].count += 1;
  });

  const totalReceived = payments.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="space-y-4">
      {/* Per-user summary */}
      <Card className="p-5 bg-white border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary-500" />
          Payment Summary by Member
          <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
            Total: ৳ {totalReceived.toLocaleString()}
          </span>
        </h3>
        {Object.values(byUser).length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No payments this month</p>
        ) : (
          <div className="space-y-2">
            {Object.values(byUser)
              .sort((a, b) => b.total - a.total)
              .map((u) => (
                <div key={u.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{u.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{u.count} payment{u.count > 1 ? "s" : ""}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">+ ৳ {u.total.toLocaleString()}</span>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* All transactions */}
      <Card className="p-5 bg-white border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          All Transactions ({payments.length})
        </h3>
        {sortedPayments.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No transactions</p>
        ) : (
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
            {sortedPayments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.userName}</p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(p.paymentDate), "dd MMM yyyy")} ·{" "}
                    {p.paymentMethod?.replace("_", " ")}
                    {p.note && ` · ${p.note}`}
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-600">+ ৳ {Number(p.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
