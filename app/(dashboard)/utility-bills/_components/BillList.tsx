/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/utility-bills/_components/BillList.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { FileText, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

const billLabels: Record<string, string> = {
    CURRENT: "Electricity",
    WIFI: "Internet",
    RENT: "Rent",
    WATER: "Water",
    KHALA: "Cook",
};

interface BillListProps {
    bills: any[];
    isLoading: boolean;
    canEdit: boolean;
    onDelete: (id: string, name: string) => void;
    onEdit: (bill: any) => void;
    isDeleting: boolean;
}

export function BillList({
    bills,
    isLoading,
    canEdit,
    onDelete,
    onEdit,
    isDeleting,
}: BillListProps) {
    // ✅ Skeleton for loading
    if (isLoading) {
        return (
            <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h2 className="text-base font-bold text-slate-800">Logged Bills</h2>
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-50">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-28" />
                                <div className="h-3 bg-slate-200 rounded w-24" />
                                <div className="h-3 bg-slate-200 rounded w-20" />
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-16" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" /> Logged Bills
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="pb-3 pl-2">Bill Category</th>
                            <th className="pb-3">Month</th>
                            <th className="pb-3">Payer</th>
                            <th className="pb-3 hidden md:table-cell">Note</th>
                            <th className="pb-3 text-right">Amount</th>
                            {canEdit && <th className="pb-3 text-right pr-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {bills && bills.length > 0 ? (
                            bills.map((bill: any) => (
                                <tr key={bill.id} className="hover:bg-slate-50/50 transition">
                                    <td className="py-3.5 pl-2">
                                        <span className="font-semibold text-slate-800 text-sm block">
                                            {billLabels[bill.billType] || bill.billType}
                                        </span>
                                    </td>
                                    <td className="py-3.5 text-sm text-slate-600">
                                        {format(new Date(bill.monthYear), "MMMM yyyy")}
                                    </td>
                                    <td className="py-3.5 text-sm text-slate-600 font-medium">
                                        {bill.paidByName || "Mess Fund"}
                                    </td>
                                    <td className="py-3.5 text-xs text-slate-400 max-w-xs truncate hidden md:table-cell">
                                        {bill.note || "-"}
                                    </td>
                                    <td className="py-3.5 text-right font-bold text-slate-800 text-sm">
                                        ৳ {Number(bill.amount).toLocaleString()}
                                    </td>
                                    {canEdit && (
                                        <td className="py-3.5 text-right pr-2">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onEdit(bill)}
                                                    disabled={isDeleting}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(bill.id, billLabels[bill.billType] || bill.billType)}
                                                    disabled={isDeleting}
                                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={canEdit ? 6 : 5} className="py-8 text-center text-slate-400 text-sm">
                                    No bills logged for this month.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}