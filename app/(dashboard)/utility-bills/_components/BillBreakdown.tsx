// app/(dashboard)/utility-bills/_components/BillBreakdown.tsx
"use client";

import { Card } from "@/components/ui/Card";

interface BillBreakdownProps {
    totalCurrent: number;
    totalWifi: number;
    totalRent: number;
    totalWater: number;
    totalKhala: number;
    isLoading?: boolean;
}

export function BillBreakdown({
    totalCurrent,
    totalWifi,
    totalRent,
    totalWater,
    totalKhala,
    isLoading = false,
}: BillBreakdownProps) {
    const items = [
        { label: "Electricity", amount: totalCurrent, color: "text-blue-600" },
        { label: "Wifi", amount: totalWifi, color: "text-purple-600" },
        { label: "Rent", amount: totalRent, color: "text-amber-600" },
        { label: "Water", amount: totalWater, color: "text-cyan-600" },
        { label: "Cook (Khala)", amount: totalKhala, color: "text-rose-600" },
    ];

    // ✅ Skeleton for loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="p-4 bg-white border border-slate-50">
                        <div className="animate-pulse text-center">
                            <div className="h-3 bg-slate-200 rounded w-16 mx-auto" />
                            <div className="h-6 bg-slate-200 rounded w-20 mx-auto mt-2" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {items.map((item) => (
                <Card key={item.label} className="p-4 bg-white border border-slate-50 text-center">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">{item.label}</p>
                    <p className={`text-lg font-bold ${item.color} mt-1`}>
                        ৳ {Number(item.amount).toLocaleString()}
                    </p>
                </Card>
            ))}
        </div>
    );
}