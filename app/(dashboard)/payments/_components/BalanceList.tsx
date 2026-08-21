/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/BalanceList.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Users, Wallet } from "lucide-react";

interface BalanceListProps {
    balances: any[];
    isLoading: boolean;
}

export function BalanceList({ balances = [], isLoading }: BalanceListProps) {
    if (isLoading) {
        return (
            <Card className="col-span-1 p-6 bg-white border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary-500" />
                    <h2 className="text-base font-bold text-slate-800">Member Balances</h2>
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex justify-between py-2">
                            <div className="h-4 bg-slate-200 rounded w-24" />
                            <div className="h-4 bg-slate-200 rounded w-16" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 p-6 bg-white border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-500" />
                <h2 className="text-base font-bold text-slate-800">Member Balances</h2>
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {balances?.length || 0}
                </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {balances && balances.length > 0 ? (
                    balances.map((item) => (
                        <div
                            key={item.userId}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {item.userName}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Wallet className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs text-slate-500">
                                        Paid: ৳{Number(item.totalPaid).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                                <span
                                    className={`px-3 py-1 rounded-lg text-xs font-bold ${Number(item.balance) >= 0
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-rose-50 text-rose-500"
                                        }`}
                                >
                                    {Number(item.balance) >= 0 ? "+" : ""}
                                    ৳{Number(item.balance).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No members found</p>
                    </div>
                )}
            </div>
        </Card>
    );
}