// app/(dashboard)/utility-bills/_components/UtilityBillStats.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Landmark, Users, CreditCard } from "lucide-react";

interface UtilityBillStatsProps {
    totalAmount: number;
    perPersonShare: number;
    totalBills: number;
    isLoading?: boolean;
}

export function UtilityBillStats({
    totalAmount,
    perPersonShare,
    totalBills,
    isLoading = false,
}: UtilityBillStatsProps) {
    const stats = [
        {
            label: "Total Utilities",
            value: `৳ ${totalAmount.toLocaleString()}`,
            icon: Landmark,
            color: "bg-indigo-50 text-indigo-500",
        },
        {
            label: "Per Person Share",
            value: `৳ ${perPersonShare.toFixed(2)}`,
            icon: Users,
            color: "bg-primary-50 text-primary-500",
        },
        {
            label: "Total Bills",
            value: totalBills,
            icon: CreditCard,
            color: "bg-teal-50 text-teal-500",
        },
    ];

    // ✅ Skeleton for loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-5 bg-white border border-slate-100">
                        <div className="animate-pulse flex items-center justify-between">
                            <div>
                                <div className="h-3 bg-slate-200 rounded w-24" />
                                <div className="h-8 bg-slate-200 rounded w-32 mt-2" />
                            </div>
                            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="p-5 bg-white border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.color} rounded-2xl`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                </Card>
            ))}
        </div>
    );
}