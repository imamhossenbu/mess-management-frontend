/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/TransactionList.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight, Trash2, Edit2, Eye } from "lucide-react";
import { format } from "date-fns";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

interface TransactionListProps {
    transactions: any[];
    isLoading: boolean;
    canEdit: boolean;
    onDelete: (id: string) => void;
    onEdit?: (transaction: any) => void;
    onView?: (transaction: any) => void;
}

export function TransactionList({
    transactions = [],
    isLoading,
    canEdit,
    onDelete,
    onEdit,
    onView,
}: TransactionListProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState<string>("");

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteId(id);
        setDeleteName(name);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            // ✅ Modal বন্ধ করুন
            setDeleteId(null);
            setDeleteName("");
            // ✅ Delete শুরু করুন (parent এ Loading দেখাবে)
            onDelete(deleteId);
        }
    };

    const handleCloseModal = () => {
        setDeleteId(null);
        setDeleteName("");
    };

    if (isLoading) {
        return (
            <Card className="col-span-2 p-6 bg-white border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <ArrowUpRight className="w-5 h-5 text-primary-500" />
                    <h2 className="text-base font-bold text-slate-800">Recent Transactions</h2>
                </div>
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse flex justify-between py-3 border-b">
                            <div className="space-y-1">
                                <div className="h-4 bg-slate-200 rounded w-32" />
                                <div className="h-3 bg-slate-200 rounded w-24" />
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-16" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-primary-500" />
                        <h2 className="text-base font-bold text-slate-800">Recent Transactions</h2>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {transactions?.length || 0}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Credit
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Debit
                        </span>
                    </div>
                </div>

                {transactions && transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Member</th>
                                    <th className="pb-3">Method</th>
                                    <th className="pb-3 hidden sm:table-cell">Date</th>
                                    <th className="pb-3 hidden md:table-cell">Note</th>
                                    <th className="pb-3 text-right">Amount</th>
                                    {(canEdit || onView) && (
                                        <th className="pb-3 text-right pr-2">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-slate-50/50 transition"
                                    >
                                        <td className="py-3 pl-2">
                                            <div>
                                                <span className="font-semibold text-slate-800 text-sm block">
                                                    {tx.userName}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block sm:hidden">
                                                    {format(new Date(tx.paymentDate), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium capitalize whitespace-nowrap">
                                                {tx.paymentMethod?.toLowerCase() || "cash"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-xs text-slate-400 hidden sm:table-cell">
                                            {format(new Date(tx.paymentDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="py-3 text-xs text-slate-400 max-w-[120px] truncate hidden md:table-cell">
                                            {tx.note || "-"}
                                        </td>
                                        <td className="py-3 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                                            +৳ {Number(tx.amount).toLocaleString()}
                                        </td>
                                        {(canEdit || onView) && (
                                            <td className="py-3 text-right pr-2">
                                                <div className="flex items-center justify-end gap-1">
                                                    {onView && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onView(tx);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition"
                                                            title="View"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {canEdit && onEdit && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(tx);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(tx.id, tx.userName);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <ArrowUpRight className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No transactions found</p>
                        <p className="text-xs text-slate-300 mt-1">Start by recording a deposit</p>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Payment"
                message={`Are you sure you want to delete this payment from "${deleteName}"? This action cannot be undone.`}
                isLoading={false}
                confirmText="Delete Payment"
                cancelText="Cancel"
            />
        </>
    );
}