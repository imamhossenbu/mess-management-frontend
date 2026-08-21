// app/(dashboard)/payments/_components/PaymentStats.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { DollarSign } from "lucide-react";

interface PaymentStatsProps {
    totalDeposits: number;
}

export function PaymentStats({ totalDeposits }: PaymentStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Deposits
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        ৳ {totalDeposits.toLocaleString()}
                    </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                    <DollarSign className="w-6 h-6" />
                </div>
            </Card>
        </div>
    );
}